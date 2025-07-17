import React from 'react';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo/Icon Animation */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4">
            <TrendingUp className="h-12 w-12 text-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <BarChart3 className="h-14 w-14 text-primary animate-bounce" style={{ animationDelay: '200ms' }} />
            <DollarSign className="h-12 w-12 text-primary animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground animate-fade-in">
            Market Pulse AI
          </h2>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '500ms' }}>
            Initializing AI-powered market analysis...
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-secondary rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;