
import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import MarketOverview from '../components/MarketOverview';
import TopGainers from '../components/TopGainers';
import TopLosers from '../components/TopLosers';
import NewsWidget from '../components/NewsWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Market Overview Cards */}
        <MarketOverview />
        
        {/* TradingView Heatmap - Full width */}
        <div className="w-full">
          <TradingViewHeatmap />
        </div>
        
        {/* Technical Analysis - Increased height */}
        <div className="w-full">
          <TechnicalAnalysis />
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
