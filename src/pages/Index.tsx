import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopBottom5 from '../components/TopBottom5';
import NewsWidget from '../components/NewsWidget';
import FinancialAnalysis from '../components/FinancialAnalysis';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <HeroSection onTickerChange={setSelectedTicker} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Unified Refresh Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Latest Data'}
          </Button>
        </div>

        {/* Market Overview Cards */}
        <MarketOverview refreshTrigger={refreshTrigger} />
        
        {/* TradingView Heatmap - Full width */}
        <div className="w-full">
          <TradingViewHeatmap />
        </div>
        
        {/* Technical and Financial Analysis - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TechnicalAnalysis ticker={selectedTicker} />
          <FinancialAnalysis ticker={selectedTicker} />
        </div>
        
        {/* News Widget - Full width */}
        <div className="w-full">
          <NewsWidget refreshTrigger={refreshTrigger} />
        </div>
        
        {/* Top/Bottom 5 - Full width tabular format */}
        <div className="w-full">
          <TopBottom5 refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Index;
