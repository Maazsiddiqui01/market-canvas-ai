import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import HeroSection from '../components/HeroSection';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopBottom5 from '../components/TopBottom5';
import NewsWidget from '../components/NewsWidget';
import FinancialAnalysis from '../components/FinancialAnalysis';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import EmailWidget from '../components/EmailWidget';
import InteractiveBackground from '../components/InteractiveBackground';
import NewsSourcesMarquee from '../components/NewsSourcesMarquee';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      // Automatically refresh data after initial loading
      handleRefreshAll();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleRefreshAll]);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background animate-fade-in relative overflow-hidden">
      <InteractiveBackground />
      <div className="relative z-10">
        <DashboardHeader onTickerChange={setSelectedTicker} />
        <NewsSourcesMarquee className="animate-slide-in-bottom" />
        <HeroSection onTickerChange={setSelectedTicker} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Unified Refresh Button with enhanced animations */}
        <div className="flex justify-center animate-slide-in-right">
          <Button 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            variant="professional"
            className="px-8 py-3 text-base font-semibold"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Latest Data'}
          </Button>
        </div>

        {/* Market Overview Cards with enhanced entrance animation */}
        <div className="animate-slide-in-left hover:scale-[1.01] transition-transform duration-300 card-interactive" style={{ animationDelay: '200ms' }}>
          <MarketOverview refreshTrigger={refreshTrigger} />
        </div>
        
        {/* TradingView Heatmap with dramatic entrance */}
        <div id="heatmap" className="w-full animate-fade-in-scale group hover:scale-[1.01] transition-all duration-300 card-interactive" style={{ animationDelay: '400ms' }}>
          <div className="relative overflow-hidden rounded-lg">
            <TradingViewHeatmap />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>
        
        {/* Technical and Financial Analysis with opposing slide animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="technical-analysis" className="animate-slide-in-left hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-interactive" style={{ animationDelay: '600ms' }}>
            <TechnicalAnalysis ticker={selectedTicker} />
          </div>
          <div id="financial-analysis" className="animate-slide-in-right hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-interactive" style={{ animationDelay: '700ms' }}>
            <FinancialAnalysis ticker={selectedTicker} />
          </div>
        </div>
        
        {/* News Widget with bottom slide entrance */}
        <div id="news" className="w-full animate-slide-in-bottom hover:scale-[1.01] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-interactive" style={{ animationDelay: '800ms' }}>
          <NewsWidget refreshTrigger={refreshTrigger} />
        </div>
        
        {/* Top/Bottom 5 with floating entrance */}
        <div id="top-bottom-5" className="w-full animate-float-in hover:scale-[1.01] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-interactive" style={{ animationDelay: '1000ms' }}>
          <TopBottom5 refreshTrigger={refreshTrigger} />
        </div>
      </div>
      
        {/* Footer */}
        <div id="contact">
          <Footer />
        </div>
      </div>
      
      {/* Email Widget */}
      <EmailWidget />
    </div>
  );
};

export default Index;
