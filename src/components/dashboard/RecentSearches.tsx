import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { History, Search, TrendingUp, Trash2, RefreshCw } from 'lucide-react';
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

interface SearchHistoryItem {
  id: string;
  ticker: string;
  stock_name: string | null;
  searched_at: string;
}

interface RecentSearchesProps {
  showAll?: boolean;
  onSearchClick?: (ticker: string) => void;
}

export const RecentSearches = ({ showAll = false, onSearchClick }: RecentSearchesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSearchHistory = useCallback(async () => {
    if (!user) return;
    
    const limit = showAll ? 50 : 10;
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching search history:', error);
      return;
    }

    setSearches(data || []);
    setLoading(false);
  }, [user, showAll]);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user, fetchSearchHistory]);

  // Real-time subscription for new searches
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('search-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'search_history',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSearchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSearchHistory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSearchHistory();
    setIsRefreshing(false);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setSearches([]);
      toast({
        title: 'History Cleared',
        description: 'Your search history has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear search history.',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleSearchClick = (ticker: string) => {
    if (onSearchClick) {
      onSearchClick(ticker);
    }
  };

  // Skeleton loader component
  const SkeletonItem = () => (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-4 w-4 text-primary" />
            Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-4 w-4 text-primary" />
            Recent Searches
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            {searches.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isClearing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Search History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your search history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearHistory}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear History
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {searches.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground animate-fade-in">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent searches</p>
            <p className="text-xs mt-1">Your search history will appear here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {searches.map((search, index) => (
              <div
                key={search.id}
                onClick={() => handleSearchClick(search.ticker)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer group animate-fade-in hover:scale-[1.02] active:scale-[0.98]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {search.ticker}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {search.stock_name || 'Stock search'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(search.searched_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
