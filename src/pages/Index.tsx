
import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopBottom5 from '../components/TopBottom5';
import NewsWidget from '../components/NewsWidget';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <HeroSection onTickerChange={setSelectedTicker} />
      
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
        
        {/* Top/Bottom 5 - Full width tabular format */}
        <div className="w-full">
          <TopBottom5 />
        </div>
      </div>
    </div>
  );
};

export default Index;
