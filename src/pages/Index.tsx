import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopBottom5 from '../components/TopBottom5';
import NewsWidget from '../components/NewsWidget';
import FinancialAnalysis from '../components/FinancialAnalysis';
import LoadingScreen from '../components/LoadingScreen';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background animate-fade-in">
      <HeroSection onTickerChange={setSelectedTicker} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Unified Refresh Button */}
        <div className="flex justify-center animate-slide-in-right">
          <Button 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 transition-all duration-300 hover-scale"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Latest Data'}
          </Button>
        </div>

        {/* Market Overview Cards */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <MarketOverview refreshTrigger={refreshTrigger} />
        </div>
        
        {/* TradingView Heatmap - Full width */}
        <div className="w-full animate-fade-in" style={{ animationDelay: '400ms' }}>
          <TradingViewHeatmap />
        </div>
        
        {/* Technical and Financial Analysis - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <TechnicalAnalysis ticker={selectedTicker} />
          <FinancialAnalysis ticker={selectedTicker} />
        </div>
        
        {/* News Widget - Full width */}
        <div className="w-full animate-fade-in" style={{ animationDelay: '800ms' }}>
          <NewsWidget refreshTrigger={refreshTrigger} />
        </div>
        
        {/* Top/Bottom 5 - Full width tabular format */}
        <div className="w-full animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <TopBottom5 refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Index;
