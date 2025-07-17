import React from 'react';
import { TrendingUp, BarChart3, Activity, Target, Search, RefreshCw, Newspaper, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

interface HeroSectionProps {
  onTickerChange?: (ticker: string) => void;
}

const HeroSection = ({ onTickerChange }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-background to-secondary/50 border-b border-border overflow-hidden">
      {/* Clean, minimal background */}
      <div className="absolute inset-0">
        {/* Simple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-32 h-32 border border-primary/20 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border border-accent/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-primary/15 rotate-12"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Clean Logo Section with hover effects */}
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-primary/10 p-4 rounded-2xl mr-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground transition-all duration-300 hover:text-primary">
                Market Canvas 
                <span className="text-primary animate-pulse"> AI</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">AI-Powered Analytics</span>
              </div>
            </div>
          </div>

          {/* Main Headline with dynamic text effects */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl text-foreground/90 mb-6 leading-relaxed font-light">
              We deliver <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors duration-300">AI-powered insights</span> for 
              <br />intelligent market analysis using <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors duration-300">machine learning</span> algorithms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto hover:text-foreground/80 transition-colors duration-300">
              Advanced AI-driven technical analysis, predictive market trends, and intelligent recommendations for smarter trading decisions
            </p>
          </div>

          {/* How to Use Section with hover effects */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-foreground mb-8">How to Use Market Canvas AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Search className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">1</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Search & Select Stock</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Enter stock symbol to get AI-powered analysis of any listed company
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <RefreshCw className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">2</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">AI Analysis & Insights</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  View AI-generated market insights, technical patterns & smart recommendations
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative mb-4">
                  <div className="bg-primary/10 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Newspaper className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">3</div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Smart News & Rankings</h4>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Browse AI-curated news and intelligent market rankings
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
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">AI Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;