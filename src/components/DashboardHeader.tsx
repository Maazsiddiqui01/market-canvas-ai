
import React from 'react';
import { TrendingUp, Bell, Settings, BarChart3, Newspaper, Calculator, TrendingUp as TechnicalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

interface DashboardHeaderProps {
  onTickerChange?: (ticker: string) => void;
}

const DashboardHeader = ({ onTickerChange }: DashboardHeaderProps) => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">StockAnalyzer Pro</h1>
              <p className="text-sm text-muted-foreground">Real-time market insights</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => document.getElementById('heatmap')?.scrollIntoView({ behavior: 'smooth' })}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Heatmap
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => document.getElementById('technical-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
              <TechnicalIcon className="h-4 w-4 mr-2" />
              Technical
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => document.getElementById('financial-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
              <Calculator className="h-4 w-4 mr-2" />
              Fundamental
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}>
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </Button>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Stock Search */}
        <StockSearch onTickerChange={onTickerChange} />
      </div>
    </div>
  );
};

export default DashboardHeader;
