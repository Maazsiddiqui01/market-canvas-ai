
import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import TradingViewHeatmap from '../components/TradingViewHeatmap';
import MarketOverview from '../components/MarketOverview';
import TopGainers from '../components/TopGainers';
import TopLosers from '../components/TopLosers';
import NewsWidget from '../components/NewsWidget';
import PortfolioWidget from '../components/PortfolioWidget';
import WatchlistWidget from '../components/WatchlistWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Market Overview Cards */}
        <MarketOverview />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TradingView Heatmap - Takes up more space */}
          <div className="lg:col-span-2">
            <TradingViewHeatmap />
          </div>
          
          {/* Portfolio Summary */}
          <div className="space-y-6">
            <PortfolioWidget />
            <WatchlistWidget />
          </div>
        </div>
        
        {/* Gainers/Losers and News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopGainers />
          <TopLosers />
          <NewsWidget />
        </div>
      </div>
    </div>
  );
};

export default Index;
