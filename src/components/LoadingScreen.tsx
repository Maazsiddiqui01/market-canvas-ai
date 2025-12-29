import React from 'react';
import Logo from './Logo';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo Animation */}
        <div className="relative animate-pulse">
          <Logo size="xl" />
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
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