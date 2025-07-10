import React from 'react';
import { TrendingUp, BarChart3, Activity, Target, Search, RefreshCw, Newspaper, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

interface HeroSectionProps {
  onTickerChange?: (ticker: string) => void;
}

const HeroSection = ({ onTickerChange }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-background via-background/95 to-card/30 border-b border-border overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes with various animations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-[float_6s_ease-in-out_infinite] hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/5 rounded-lg rotate-45 animate-[float_8s_ease-in-out_infinite_reverse] hover:rotate-90 transition-transform duration-700"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/10 rounded-full animate-[float_7s_ease-in-out_infinite] hover:scale-125 transition-transform duration-300"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-lg animate-[float_9s_ease-in-out_infinite_reverse]"></div>
        
        {/* Additional dynamic elements */}
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-primary/8 rounded-full animate-[float_12s_ease-in-out_infinite] opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-accent/8 rotate-12 animate-[float_10s_ease-in-out_infinite_reverse] opacity-70"></div>
        <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-primary/6 rounded-full animate-[float_14s_ease-in-out_infinite] opacity-50"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-[slide_20s_ease-in-out_infinite]"></div>
        
        {/* Dynamic grid with pulse effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Clean Logo Section with hover effects */}
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-primary/10 p-4 rounded-2xl mr-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground transition-all duration-300 hover:text-primary">
                PSX Analytics 
                <span className="text-primary animate-pulse"> Pro</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Market Data</span>
              </div>
            </div>
          </div>

          {/* Main Headline with dynamic text effects */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl text-foreground/90 mb-6 leading-relaxed font-light">
              We provide <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors duration-300">real-time insights</span> for 
              <br />Pakistan Stock Exchange using <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors duration-300">data-driven</span> analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto hover:text-foreground/80 transition-colors duration-300">
              Advanced technical analysis, market trends, and expert recommendations for informed trading decisions
            </p>
          </div>

          {/* How to Use Section with Infographics */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-foreground mb-8">How to Use PSX Analytics Pro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Search className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">1</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Search & Select Stock</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Enter stock symbol in the search box or use dropdown to get detailed analysis of any PSX listed company
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <RefreshCw className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">2</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Refresh & Analyze</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  View market heatmap, technical analysis & fundamentals. Click refresh data button for latest information
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Newspaper className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">3</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">News & Rankings</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Browse latest news, search specific articles, and view top 5 gainers/losers for comprehensive market insights
                </p>
              </div>
            </div>
          </div>

          {/* Stock Search with enhanced styling */}
          <div className="max-w-xl mx-auto mb-8 group">
            <div className="transform transition-all duration-300 group-hover:scale-105">
              <StockSearch onTickerChange={onTickerChange} />
            </div>
          </div>

          {/* Feature Icons with dynamic effects */}
          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <BarChart3 className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Live Charts</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Activity className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Technical Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Target className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Expert Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;