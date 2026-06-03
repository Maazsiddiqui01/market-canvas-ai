import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedTicker } from '@/contexts/SelectedTickerContext';
import DashboardHeader from '@/components/DashboardHeader';
import { MobileBottomNav } from '@/components/dashboard/NavigationGuide';
import { Breadcrumb } from '@/components/dashboard/Breadcrumb';
import { SearchHero } from '@/components/dashboard/SearchHero';
import MarketOverview from '@/components/MarketOverview';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, LucideIcon } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '@/components/PullToRefreshIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useActivityLog } from '@/hooks/useActivityLog';
import { PageHeader } from '@/components/ui/page-header';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { CommandHint } from '@/components/dashboard/CommandHint';

import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showMarketOverview?: boolean;
  onTickerChange?: (ticker: string) => void;
  selectedTicker?: string;
  /** Page header props — when provided, a unified header is rendered above content */
  pageTitle?: string;
  pageSubtitle?: string;
  pageIcon?: LucideIcon;
  pageEyebrow?: string;
  pageActions?: ReactNode;
}

export const DashboardLayout = ({ 
  children, 
  showSearch = false,
  showMarketOverview = false,
  onTickerChange: externalTickerChange,
  selectedTicker: externalTicker,
  pageTitle,
  pageSubtitle,
  pageIcon,
  pageEyebrow,
  pageActions,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { selectedTicker: contextTicker, setSelectedTicker } = useSelectedTicker();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  const { logActivity } = useActivityLog();

  // Log page views on route change
  useEffect(() => {
    if (user) {
      logActivity({
        activityType: 'page_view',
        description: `Viewed ${location.pathname}`,
        data: { path: location.pathname } as any,
      });
    }
  }, [location.pathname, user]);

  const { containerRef, pullDistance, isRefreshing: isPullRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      setRefreshTrigger(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 800));
    },
  });

  // Use external ticker if provided, otherwise use shared context ticker (persists across routes)
  const selectedTicker = externalTicker ?? contextTicker;

  const isHomePage = location.pathname === '/dashboard';

  // Get active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'home';
    
    if (path === '/dashboard/ai-tools') return 'ai-search';
    if (path === '/dashboard/recommendations') return 'recommendations';
    if (path === '/dashboard/portfolio') return 'portfolio';
    if (path === '/dashboard/watchlist') return 'watchlist';
    if (path === '/dashboard/alerts') return 'alerts';
    if (path === '/dashboard/news') return 'news';
    if (path === '/dashboard/history') return 'history';
    if (path === '/dashboard/tools') return 'tools';
    if (path === '/dashboard/analytics') return 'analytics';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      'home': '/dashboard',
      
      'ai-search': '/dashboard/ai-tools',
      'recommendations': '/dashboard/recommendations',
      'portfolio': '/dashboard/portfolio',
      'watchlist': '/dashboard/watchlist',
      'alerts': '/dashboard/alerts',
      'news': '/dashboard/news',
      'history': '/dashboard/history',
      'tools': '/dashboard/tools',
      'analytics': '/dashboard/analytics',
    };
    navigate(routes[tab] || '/dashboard');
  };

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleTickerChange = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
    externalTickerChange?.(ticker);
  }, [externalTickerChange, setSelectedTicker]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse-glow">
          <Logo size="lg" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-dvh bg-background flex flex-col">
      <CommandPalette />
      <CommandHint />
      <DashboardHeader
        onTickerChange={handleTickerChange}
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />

      <main className="container mx-auto px-4 pt-16 md:pt-20 flex-1 pb-24 md:pb-8">



        {isMobile && <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isPullRefreshing} />}

        {/* Search Hero — z-40 so its dropdown sits above the z-20 nav */}
        {showSearch && (
          <div className="mb-6 relative z-40">
            <SearchHero
              onTickerChange={handleTickerChange}
              selectedTicker={selectedTicker}
            />
          </div>
        )}

        {/* Market Overview pill — hide on mobile home (already in header, saves vertical space) */}
        {showMarketOverview && (
          <div
            className={`items-center justify-center gap-3 mb-4 ${
              isHomePage ? 'hidden md:flex' : 'flex'
            }`}
          >
            <MarketOverview refreshTrigger={refreshTrigger} />
            <Button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              variant="outline"
              size="icon"
              aria-label="Refresh page"
              className="h-11 w-11 md:h-10 md:w-10 rounded-xl glass-subtle hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}


        {/* Breadcrumb */}
        <Breadcrumb />


        {/* Page Header */}
        {pageTitle && (
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            icon={pageIcon}
            eyebrow={pageEyebrow}
            actions={pageActions}
          />
        )}

        {/* Page Content */}
        <div className="pb-8 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile bottom tab bar (native-app feel) */}
      <MobileBottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </div>

  );
};
