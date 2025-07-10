import React from 'react';
import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

interface HeroSectionProps {
  onTickerChange?: (ticker: string) => void;
}

const HeroSection = ({ onTickerChange }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-background to-card/30 border-b border-border overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/5 rounded-lg rotate-45 animate-[float_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/10 rounded-full animate-[float_7s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-lg animate-[float_9s_ease-in-out_infinite_reverse]"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Clean Logo Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl mr-4">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground">
                PSX Analytics 
                <span className="text-primary"> Pro</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Market Data</span>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl text-foreground/90 mb-6 leading-relaxed font-light">
              We provide <span className="text-primary font-semibold">real-time insights</span> for 
              <br />Pakistan Stock Exchange using <span className="text-primary font-semibold">data-driven</span> analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technical analysis, market trends, and expert recommendations for informed trading decisions
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">PSX Stocks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Real-time Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Market Monitoring</div>
            </div>
          </div>

          {/* Stock Search */}
          <div className="max-w-xl mx-auto mb-8">
            <StockSearch onTickerChange={onTickerChange} />
          </div>

          {/* Feature Icons - Simplified */}
          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Live Charts</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Technical Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Expert Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;