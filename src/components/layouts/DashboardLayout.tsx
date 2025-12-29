import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { NavigationGuide } from '@/components/dashboard/NavigationGuide';
import { Breadcrumb } from '@/components/dashboard/Breadcrumb';
import { SearchHero } from '@/components/dashboard/SearchHero';
import MarketOverview from '@/components/MarketOverview';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showMarketOverview?: boolean;
}

export const DashboardLayout = ({ 
  children, 
  showSearch = false,
  showMarketOverview = false 
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isHomePage = location.pathname === '/dashboard';

  // Get active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'home';
    if (path === '/dashboard/market') return 'market';
    if (path === '/dashboard/ai-tools') return 'ai-search';
    if (path === '/dashboard/portfolio') return 'portfolio';
    if (path === '/dashboard/watchlist') return 'watchlist';
    if (path === '/dashboard/alerts') return 'alerts';
    if (path === '/dashboard/news') return 'news';
    if (path === '/dashboard/tools') return 'tools';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      'home': '/dashboard',
      'market': '/dashboard/market',
      'ai-search': '/dashboard/ai-tools',
      'portfolio': '/dashboard/portfolio',
      'watchlist': '/dashboard/watchlist',
      'alerts': '/dashboard/alerts',
      'news': '/dashboard/news',
      'tools': '/dashboard/tools',
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
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse-glow">
          <div className="p-4 bg-gradient-to-r from-primary to-accent rounded-2xl">
            <TrendingUp className="h-10 w-10 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onTickerChange={setSelectedTicker} />
      
      <main className="container mx-auto px-4 pt-20 flex-1">
        {/* Welcome Section */}
        <div className="py-6 animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg shadow-primary/20 animate-pulse-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Your AI-powered PSX dashboard for portfolio tracking, market analysis, and intelligent insights
            </p>
          </div>

          {/* Search Hero Section - Only on Market page */}
          {showSearch && (
            <div className="mb-6">
              <SearchHero 
                onTickerChange={handleTickerChange} 
                selectedTicker={selectedTicker} 
              />
            </div>
          )}

          {/* Market Overview - Only on pages that need it */}
          {showMarketOverview && (
            <div className="flex items-center justify-center gap-4 mb-2">
              <MarketOverview refreshTrigger={refreshTrigger} />
              <Button 
                onClick={handleRefreshAll}
                disabled={isRefreshing}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Guide - Sticky */}
        <NavigationGuide activeTab={getActiveTab()} onTabChange={handleTabChange} />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Content */}
        <div className="pb-8 animate-fade-in">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
