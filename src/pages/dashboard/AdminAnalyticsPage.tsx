import { useState, useEffect, useCallback } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageTransition } from '@/components/PageTransition';
import {
  BarChart3, Users, Eye, Activity, Shield, RefreshCw, TrendingUp,
  Brain, Briefcase, Bell, GitCompare, Newspaper, Globe
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(142, 71%, 45%)',
  'hsl(217, 91%, 60%)',
  'hsl(45, 93%, 47%)',
  'hsl(280, 67%, 55%)',
  'hsl(16, 90%, 50%)',
  'hsl(190, 90%, 50%)',
];

const activityLabels: Record<string, string> = {
  ai_search: 'AI Search',
  stock_view: 'Stock View',
  portfolio_action: 'Portfolio',
  alert_created: 'Alerts',
  watchlist_action: 'Watchlist',
  comparison: 'Comparison',
  page_view: 'Page View',
};

const activityIcons: Record<string, React.ReactNode> = {
  ai_search: <Brain className="h-4 w-4" />,
  stock_view: <TrendingUp className="h-4 w-4" />,
  portfolio_action: <Briefcase className="h-4 w-4" />,
  alert_created: <Bell className="h-4 w-4" />,
  watchlist_action: <Eye className="h-4 w-4" />,
  comparison: <GitCompare className="h-4 w-4" />,
  page_view: <Globe className="h-4 w-4" />,
};

const AdminAnalyticsPage = () => {
  useDocumentTitle('Analytics | Market Canvas AI');
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [uniqueSessions, setUniqueSessions] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [activityBreakdown, setActivityBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [dailyPageViews, setDailyPageViews] = useState<{ date: string; views: number }[]>([]);
  const [dailyActivities, setDailyActivities] = useState<{ date: string; count: number }[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; views: number }[]>([]);

  const checkAdmin = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    setIsAdmin(!!data);
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    if (!user || !isAdmin) return;

    // Fetch page views
    const { data: pageViews } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', subDays(new Date(), 30).toISOString())
      .order('created_at', { ascending: false });

    const pvData = pageViews || [];
    setTotalPageViews(pvData.length);
    
    const sessions = new Set(pvData.map(pv => pv.session_id).filter(Boolean));
    setUniqueSessions(sessions.size);

    // Daily page views for chart
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyMap[d] = 0;
    }
    pvData.forEach(pv => {
      const d = format(new Date(pv.created_at), 'yyyy-MM-dd');
      if (dailyMap[d] !== undefined) dailyMap[d]++;
    });
    setDailyPageViews(Object.entries(dailyMap).map(([date, views]) => ({
      date: format(new Date(date), 'MMM d'),
      views,
    })));

    // Top pages
    const pageCount: Record<string, number> = {};
    pvData.forEach(pv => {
      const page = pv.page_url.replace(/^https?:\/\/[^/]+/, '') || '/';
      pageCount[page] = (pageCount[page] || 0) + 1;
    });
    setTopPages(
      Object.entries(pageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([page, views]) => ({ page, views }))
    );

    // Fetch user activity
    const { data: activities } = await supabase
      .from('user_activity_log')
      .select('*')
      .gte('created_at', subDays(new Date(), 30).toISOString())
      .order('created_at', { ascending: false });

    // Note: this only returns current user's activities due to RLS
    const actData = activities || [];
    setTotalActivities(actData.length);

    // Activity breakdown for pie chart
    const breakdown: Record<string, number> = {};
    actData.forEach(a => {
      breakdown[a.activity_type] = (breakdown[a.activity_type] || 0) + 1;
    });
    setActivityBreakdown(
      Object.entries(breakdown).map(([name, value]) => ({
        name: activityLabels[name] || name,
        value,
      }))
    );

    // Daily activities
    const dailyActMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyActMap[d] = 0;
    }
    actData.forEach(a => {
      const d = format(new Date(a.created_at), 'yyyy-MM-dd');
      if (dailyActMap[d] !== undefined) dailyActMap[d]++;
    });
    setDailyActivities(Object.entries(dailyActMap).map(([date, count]) => ({
      date: format(new Date(date), 'MMM d'),
      count,
    })));

    // Newsletter subscribers count
    const { count } = await supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true });
    setTotalSubscribers(count ?? 0);

    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => { checkAdmin(); }, [checkAdmin]);
  useEffect(() => { if (isAdmin) fetchAnalytics(); }, [isAdmin, fetchAnalytics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  if (!isAdmin && !loading) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground max-w-md">
              This page is only accessible to administrators. Contact an admin to get access.
            </p>
          </div>
        </PageTransition>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Page Views (30d)', value: totalPageViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Unique Sessions', value: uniqueSessions, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'User Activities', value: totalActivities, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Newsletter Subs', value: totalSubscribers, icon: Newspaper, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Analytics Dashboard
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Overview of site traffic, user activity, and engagement
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${card.bg}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div>
                      {loading ? (
                        <Skeleton className="h-7 w-12 mb-1" />
                      ) : (
                        <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page Views Trend */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Page Views (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyPageViews}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Activity Breakdown */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Activity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : activityBreakdown.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                    No activity data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={activityBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {activityBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activities Bar Chart */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Daily Activities (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyActivities}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : topPages.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">No page view data yet</div>
                ) : (
                  <div className="space-y-2">
                    {topPages.map((page, i) => (
                      <div key={page.page} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-sm truncate font-mono">{page.page}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2 shrink-0">{page.views}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
