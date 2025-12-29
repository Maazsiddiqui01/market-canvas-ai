import React from 'react';
import { Sparkles, Zap, Target, Shield, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardMockup from './landing/DashboardMockup';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Floating orbs - slower, more elegant */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top badge */}
          <div className="flex justify-center mb-10 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Market Intelligence</span>
              <div className="w-px h-4 bg-primary/30" />
              <span className="text-xs text-primary/80">v2.0 Now Live</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-8 animate-slide-in-bottom">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-8 tracking-tight leading-[1.1]">
              <span className="text-foreground">Trade Smarter</span>
              <br />
              <span className="text-foreground">with </span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Real-time market analysis, predictive insights, and intelligent recommendations 
              powered by advanced AI technology. Make smarter decisions, faster.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-10 py-7 rounded-xl group font-semibold shadow-lg shadow-primary/25">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-10 py-7 rounded-xl group font-semibold shadow-lg shadow-primary/25">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-7 rounded-xl font-semibold group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </>
            )}
          </div>

          {/* Dashboard Mockup */}
          <div className="mb-20 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
            <DashboardMockup />
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 - AI Research */}
            <div className="group relative animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-xl w-fit mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">AI-Powered Research</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant answers to complex market questions with our advanced AI assistant trained on financial data
                </p>
              </div>
            </div>

            {/* Card 2 - Real-time Insights */}
            <div className="group relative animate-slide-in-bottom" style={{ animationDelay: '0.6s' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-xl w-fit mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">Real-time Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live market data, technical analysis, and sentiment tracking updated in real-time at your fingertips
                </p>
              </div>
            </div>

            {/* Card 3 - Portfolio Tracking */}
            <div className="group relative animate-slide-in-bottom" style={{ animationDelay: '0.7s' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-2xl h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-xl w-fit mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">Portfolio Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Manage your investments with personalized watchlists, alerts, and comprehensive portfolio analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
