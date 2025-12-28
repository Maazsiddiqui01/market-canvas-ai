import React from 'react';
import { TrendingUp, BarChart3, Activity, Target, Search, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onTickerChange?: (ticker: string) => void;
}

const HeroSection = ({ onTickerChange }: HeroSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Top badge */}
          <div className="flex justify-center mb-8 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Market Intelligence</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-12 animate-slide-in-bottom">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Trade Smarter with</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real-time market analysis, predictive insights, and intelligent recommendations 
              powered by advanced AI technology
            </p>
          </div>

          {/* Search box - glassmorphism style */}
          <div className="max-w-2xl mx-auto mb-16 animate-float-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-2">
                <StockSearch onTickerChange={onTickerChange} />
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="btn-professional text-lg px-8 py-6 rounded-xl group">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="btn-professional text-lg px-8 py-6 rounded-xl group">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-border hover:bg-primary/10">
                  Watch Demo
                </Button>
              </>
            )}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative card-professional p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px]">
                <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live market data with AI-powered technical analysis and pattern recognition
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative card-professional p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px]">
                <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Smart Predictions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-driven price predictions and market sentiment analysis for better decisions
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative card-professional p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px]">
                <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Portfolio Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your investments with personalized watchlists and portfolio analytics
                </p>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-in-bottom" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Stocks Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
