import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { 
  BarChart3, 
  Brain, 
  Briefcase, 
  Eye, 
  Bell, 
  Newspaper, 
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

const featureCards = [
  {
    id: 'market',
    title: 'Market Analysis',
    description: 'Live heatmaps, technical & financial analysis, top gainers and losers',
    icon: BarChart3,
    href: '/dashboard/market',
    stats: [
      { label: 'Heatmap', icon: Activity },
      { label: 'Technical', icon: TrendingUp },
      { label: 'Financial', icon: TrendingDown },
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'AI-powered stock research, market queries, and stock comparison',
    icon: Brain,
    href: '/dashboard/ai-tools',
    stats: [
      { label: 'AI Search', icon: Zap },
      { label: 'Compare', icon: BarChart3 },
      { label: 'History', icon: Activity },
    ]
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Track your holdings, P&L, sector breakdown, and performance history',
    icon: Briefcase,
    href: '/dashboard/portfolio',
    stats: [
      { label: 'Holdings', icon: Briefcase },
      { label: 'P&L', icon: TrendingUp },
      { label: 'History', icon: Activity },
    ]
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    description: 'Monitor your saved stocks with live prices and quick actions',
    icon: Eye,
    href: '/dashboard/watchlist',
    stats: [
      { label: 'Stocks', icon: Eye },
      { label: 'Live', icon: Activity },
      { label: 'Alerts', icon: Bell },
    ]
  },
  {
    id: 'alerts',
    title: 'Price Alerts',
    description: 'Set price notifications for target levels on your favorite stocks',
    icon: Bell,
    href: '/dashboard/alerts',
    stats: [
      { label: 'Active', icon: Bell },
      { label: 'Triggered', icon: Zap },
      { label: 'Manage', icon: Settings },
    ]
  },
  {
    id: 'news',
    title: 'Market News',
    description: 'Latest market news from PSX sources and financial publications',
    icon: Newspaper,
    href: '/dashboard/news',
    stats: [
      { label: 'Latest', icon: Newspaper },
      { label: 'Sources', icon: Activity },
      { label: 'Topics', icon: BarChart3 },
    ]
  },
];

const DashboardHomePage = () => {
  useDocumentTitle('Dashboard | Market Canvas AI');
  const { user } = useAuth();
  const [stats, setStats] = useState({ watchlist: 0, alerts: 0, searches: 0, holdings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      setLoadingStats(true);
      const [watchlistRes, alertsRes, searchesRes, holdingsRes] = await Promise.all([
        supabase.from('watchlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('price_alerts').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_triggered', false),
        supabase.from('search_history').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('portfolios').select('id').eq('user_id', user.id).limit(1).then(async (res) => {
          if (res.data && res.data.length > 0) {
            const holdRes = await supabase.from('portfolio_holdings').select('id', { count: 'exact', head: true }).eq('portfolio_id', res.data[0].id);
            return holdRes;
          }
          return { count: 0 };
        }),
      ]);
      setStats({
        watchlist: watchlistRes.count ?? 0,
        alerts: alertsRes.count ?? 0,
        searches: searchesRes.count ?? 0,
        holdings: (holdingsRes as any).count ?? 0,
      });
      setLoadingStats(false);
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { value: stats.holdings, label: 'Holdings', icon: Briefcase },
    { value: stats.watchlist, label: 'Watchlist Stocks', icon: Eye },
    { value: stats.alerts, label: 'Active Alerts', icon: Bell },
    { value: stats.searches, label: 'AI Searches', icon: Brain },
  ];

  return (
    <DashboardLayout showMarketOverview>
      <div className="space-y-8">
        {/* Onboarding Checklist for new users */}
        <OnboardingChecklist />

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="glass-subtle rounded-2xl p-4 flex items-center gap-3 lift"
              >
                <div
                  className="p-2.5 rounded-xl glass"
                  style={{ background: 'var(--gradient-brand-tint)' }}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  {loadingStats ? (
                    <Skeleton className="h-7 w-10 mb-1" />
                  ) : (
                    <p className="text-2xl font-display font-bold text-foreground tabular">{card.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground truncate">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Cards Grid */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground">Explore</h2>
            <p className="eyebrow hidden sm:block">Your toolkit</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link 
                  key={card.id} 
                  to={card.href}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <Card className="h-full glass-subtle border-0 lift overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div
                          className="p-3 rounded-xl glass flex items-center justify-center"
                          style={{ background: 'var(--gradient-brand-tint)' }}
                          aria-hidden="true"
                        >
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-lg mt-3 font-display group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        {card.stats.map((stat, idx) => {
                          const StatIcon = stat.icon;
                          return (
                            <div 
                              key={idx}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                              <StatIcon className="h-3 w-3" />
                              <span>{stat.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tools Card */}
        <Link to="/dashboard/tools" className="block group">
          <Card className="glass-subtle border-0 lift overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="p-3 rounded-xl glass shrink-0"
                  style={{ background: 'var(--gradient-brand-tint)' }}
                  aria-hidden="true"
                >
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    Tools & Export
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Export your data, manage settings, and access utilities
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
