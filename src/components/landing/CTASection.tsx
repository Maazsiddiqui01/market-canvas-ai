import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Start Free Today</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
          Ready to Transform Your
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trading Strategy?
          </span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of traders who are already using AI-powered insights to make smarter investment decisions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-10 py-7 rounded-xl group font-semibold">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-10 py-7 rounded-xl group font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-10 py-7 rounded-xl font-semibold">
                Watch Demo
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No credit card required • Free forever for basic features
        </p>
      </div>
    </section>
  );
};

export default CTASection;
