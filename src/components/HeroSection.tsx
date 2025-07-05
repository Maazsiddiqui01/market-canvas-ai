import React from 'react';
import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

interface HeroSectionProps {
  onTickerChange?: (ticker: string) => void;
}

const HeroSection = ({ onTickerChange }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-background via-card to-background border-b border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.02)_75%)] bg-[length:20px_20px]"></div>
      
      <div className="container mx-auto px-4 py-12 relative">
        {/* Main Hero Content */}
        <div className="text-center mb-12">
          {/* Logo and Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-2xl shadow-lg mr-4">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  PSX Analytics Pro
                </h1>
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                  LIVE
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Pakistan Stock Exchange • Real-time Insights</p>
            </div>
          </div>

          {/* Hero Description */}
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-xl text-foreground/90 mb-4 leading-relaxed">
              Advanced technical analysis and market insights for the 
              <span className="text-primary font-semibold"> Pakistan Stock Exchange</span>
            </h2>
            <p className="text-muted-foreground">
              Get real-time market data, technical analysis, and expert recommendations for PSX stocks
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span>Live Charts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span>Technical Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <span>Expert Insights</span>
            </div>
          </div>

          {/* Stock Search - Enhanced */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Analyze Any PSX Stock</h3>
                <p className="text-sm text-muted-foreground">Enter a ticker symbol to get comprehensive analysis and insights</p>
              </div>
              <StockSearch onTickerChange={onTickerChange} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Market Open</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <span>KSE-100 Live</span>
            <div className="w-px h-4 bg-border"></div>
            <span>Real-time Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;