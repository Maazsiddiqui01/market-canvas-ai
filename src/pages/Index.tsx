
import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopGainers from '../components/TopGainers';
import TopLosers from '../components/TopLosers';
import NewsWidget from '../components/NewsWidget';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <DashboardHeader onTickerChange={setSelectedTicker} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Market Overview Cards */}
        <MarketOverview />
        
        {/* TradingView Heatmap - Full width */}
        <div className="w-full">
          <TradingViewHeatmap />
        </div>
        
        {/* Technical Analysis - Bigger and Dynamic */}
        <div className="w-full">
          <TechnicalAnalysis ticker={selectedTicker} />
        </div>
        
        {/* News Widget - Full width */}
        <div className="w-full">
          <NewsWidget />
        </div>
        
        {/* Gainers/Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopGainers />
          <TopLosers />
        </div>
      </div>
    </div>
  );
};

export default Index;
