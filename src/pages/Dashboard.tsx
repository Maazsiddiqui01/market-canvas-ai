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
import { NavigationGuide } from '@/components/dashboard/NavigationGuide';
import { SearchHero } from '@/components/dashboard/SearchHero';
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

  const handleRecentSearchClick = useCallback((ticker: string) => {
    setActiveTab('ai-search');
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

  const handleTickerChange = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
    // If not on market tab, switch to it to show the analysis
    if (activeTab !== 'market') {
      setActiveTab('market');
    }
  }, [activeTab]);

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
      
      <main className="container mx-auto px-4 pt-20">
        {/* Welcome Section */}
        <div className="py-6 animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg shadow-primary/20 animate-pulse-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Your AI-powered PSX dashboard for portfolio tracking, market analysis, and intelligent insights
            </p>
          </div>

          {/* Search Hero Section */}
          <div className="mb-6">
            <SearchHero 
              onTickerChange={handleTickerChange} 
              selectedTicker={selectedTicker} 
            />
          </div>

          {/* Market Overview - Compact */}
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
        </div>

        {/* Navigation Guide - Sticky */}
        <NavigationGuide activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 pb-8">

          {/* Market Tab - Charts and Analysis */}
          <TabsContent value="market" className="space-y-6 animate-fade-in">
            {/* Heatmap */}
            <div className="stagger-1">
              <TradingViewHeatmap />
            </div>

            {/* Technical and Financial Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="stagger-2">
                <TechnicalAnalysis ticker={selectedTicker} />
              </div>
              <div className="stagger-3">
                <FinancialAnalysis ticker={selectedTicker} />
              </div>
            </div>

            {/* Top/Bottom 5 */}
            <div className="stagger-4">
              <TopBottom5 refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>

          {/* AI Search Tab */}
          <TabsContent value="ai-search" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="stagger-1">
                  <AISearchWidget ref={aiSearchRef} />
                </div>
                <div className="stagger-2">
                  <StockComparison />
                </div>
              </div>
              <div className="stagger-3">
                <RecentSearches onSearchClick={handleRecentSearchClick} />
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="animate-fade-in">
            <PortfolioManager />
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="animate-fade-in">
            <WatchlistManager />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6 animate-fade-in">
            <PriceAlertManager />
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6 animate-fade-in">
            <NewsWidget refreshTrigger={refreshTrigger} />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportManager />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
