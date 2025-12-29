import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  History, Search, Brain, TrendingUp, Bell, Briefcase, Eye, GitCompare,
  Trash2, RefreshCw, Filter, Calendar
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  activity_type: string;
  description: string;
  ticker: string | null;
  activity_data: Record<string, unknown>;
  created_at: string;
}

const activityIcons: Record<string, React.ReactNode> = {
  ai_search: <Brain className="h-4 w-4" />,
  stock_view: <TrendingUp className="h-4 w-4" />,
  portfolio_action: <Briefcase className="h-4 w-4" />,
  alert_created: <Bell className="h-4 w-4" />,
  watchlist_action: <Eye className="h-4 w-4" />,
  comparison: <GitCompare className="h-4 w-4" />,
  page_view: <Eye className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  ai_search: 'bg-primary/20 text-primary',
  stock_view: 'bg-green-500/20 text-green-500',
  portfolio_action: 'bg-blue-500/20 text-blue-500',
  alert_created: 'bg-yellow-500/20 text-yellow-500',
  watchlist_action: 'bg-purple-500/20 text-purple-500',
  comparison: 'bg-orange-500/20 text-orange-500',
  page_view: 'bg-muted text-muted-foreground',
};

const activityLabels: Record<string, string> = {
  ai_search: 'AI Search',
  stock_view: 'Stock View',
  portfolio_action: 'Portfolio',
  alert_created: 'Alert',
  watchlist_action: 'Watchlist',
  comparison: 'Comparison',
  page_view: 'Page View',
};

const HistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchActivities = useCallback(async () => {
    if (!user) return;

    let query = supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (filterType !== 'all') {
      query = query.eq('activity_type', filterType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }

    setActivities((data as ActivityItem[]) || []);
    setLoading(false);
  }, [user, filterType]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activity-log-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity_log',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchActivities]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('user_activity_log')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setActivities([]);
      toast({
        title: 'History Cleared',
        description: 'Your activity history has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear activity history.',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      activity.description?.toLowerCase().includes(query) ||
      activity.ticker?.toLowerCase().includes(query) ||
      activity.activity_type.toLowerCase().includes(query)
    );
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(new Date(activity.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityItem[]>);

  const SkeletonItem = () => (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Activity History
                </CardTitle>
                <CardDescription>
                  Track all your searches, views, and actions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {activities.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={isClearing}
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Activity?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your activity history. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleClearHistory}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="ai_search">AI Searches</SelectItem>
                  <SelectItem value="stock_view">Stock Views</SelectItem>
                  <SelectItem value="portfolio_action">Portfolio Actions</SelectItem>
                  <SelectItem value="watchlist_action">Watchlist Actions</SelectItem>
                  <SelectItem value="alert_created">Alerts</SelectItem>
                  <SelectItem value="comparison">Comparisons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonItem key={i} />
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No activity yet</p>
                <p className="text-sm mt-1">Your searches and actions will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedActivities).map(([date, items]) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {items.map((activity, index) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 animate-fade-in"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <div className={`p-2.5 rounded-lg ${activityColors[activity.activity_type] || 'bg-muted'}`}>
                            {activityIcons[activity.activity_type] || <Eye className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {activity.description}
                              </p>
                              {activity.ticker && (
                                <Badge variant="secondary" className="text-xs">
                                  {activity.ticker}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs">
                                {activityLabels[activity.activity_type] || activity.activity_type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(activity.created_at), 'h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
