
import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Newspaper, Calculator, TrendingUp as TechnicalIcon, TrendingDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface DashboardHeaderProps {
  onTickerChange?: (ticker: string) => void;
}

const DashboardHeader = ({ onTickerChange }: DashboardHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-primary/5' 
        : 'bg-background/95 backdrop-blur-sm border-b border-border'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-r from-primary to-accent p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? 'scale-75' : 'scale-100'
            }`}>
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className={`font-bold text-foreground transition-all duration-300 ${
                isScrolled ? 'text-base' : 'text-xl'
              }`}>Market Canvas AI</h1>
              {!isScrolled && (
                <p className="text-xs text-muted-foreground">AI-powered market intelligence</p>
              )}
            </div>
          </div>
          
          {/* Navigation Menu and Theme Toggle */}
          <div className="flex items-center space-x-1">
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('heatmap')?.scrollIntoView({ behavior: 'smooth' })}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {!isScrolled && "Heatmap"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('technical-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
                <TechnicalIcon className="h-4 w-4 mr-2" />
                {!isScrolled && "Technical"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('financial-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
                <Calculator className="h-4 w-4 mr-2" />
                {!isScrolled && "Fundamental"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}>
                <Newspaper className="h-4 w-4 mr-2" />
                {!isScrolled && "News"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('top-bottom-5')?.scrollIntoView({ behavior: 'smooth' })}>
                <TrendingDown className="h-4 w-4 mr-2" />
                {!isScrolled && "Top & Bottom 5"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <Mail className="h-4 w-4 mr-2" />
                {!isScrolled && "Contact"}
              </Button>
            </nav>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
