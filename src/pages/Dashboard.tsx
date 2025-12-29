import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';
import { AISearchWidget, AISearchWidgetRef } from '@/components/ai/AISearchWidget';
import { StockComparison } from '@/components/ai/StockComparison';
import { RecentSearches } from '@/components/dashboard/RecentSearches';
import { PriceAlertManager } from '@/components/alerts/PriceAlertManager';
import { ExportManager } from '@/components/export/ExportManager';
import Footer from '@/components/Footer';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import MarketOverview from '@/components/MarketOverview';
import TopBottom5 from '@/components/TopBottom5';
import NewsWidget from '@/components/NewsWidget';
import StockSearch from '@/components/StockSearch';
import { NavigationGuide } from '@/components/dashboard/NavigationGuide';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('market');
  const aiSearchRef = useRef<AISearchWidgetRef>(null);

  // Handler for clicking on recent searches
  const handleRecentSearchClick = useCallback((ticker: string) => {
    setActiveTab('ai-search');
    // Give the tab time to switch before triggering the search
    setTimeout(() => {
      aiSearchRef.current?.searchTicker(ticker);
    }, 100);
  }, []);

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <TrendingUp className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onTickerChange={setSelectedTicker} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Section with Stock Search */}
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your PSX dashboard for portfolio, analysis, and AI insights
                </p>
              </div>
            </div>
            
            {/* Stock Search and Refresh */}
            <div className="flex items-center gap-3">
              <div className="w-56">
                <StockSearch onTickerChange={setSelectedTicker} />
              </div>
              <Button 
                onClick={handleRefreshAll}
                disabled={isRefreshing}
                variant="outline"
                size="icon"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Market Overview */}
          <MarketOverview refreshTrigger={refreshTrigger} />
        </div>

        {/* Navigation Guide */}
        <NavigationGuide activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* Market Tab - Charts and Analysis */}
          <TabsContent value="market" className="space-y-6">
            {/* Heatmap */}
            <div className="animate-fade-in">
              <TradingViewHeatmap />
            </div>

            {/* Technical and Financial Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <TechnicalAnalysis ticker={selectedTicker} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <FinancialAnalysis ticker={selectedTicker} />
              </div>
            </div>

            {/* Top/Bottom 5 */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <TopBottom5 refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>

          {/* AI Search Tab - Now includes comparison */}
          <TabsContent value="ai-search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="animate-fade-in">
                  <AISearchWidget ref={aiSearchRef} />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <StockComparison />
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                <RecentSearches onSearchClick={handleRecentSearchClick} />
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist">
            <WatchlistManager />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="animate-fade-in">
              <PriceAlertManager />
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <NewsWidget refreshTrigger={refreshTrigger} />
          </TabsContent>

          {/* Tools Tab - Export and utilities */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-fade-in">
                <ExportManager />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
