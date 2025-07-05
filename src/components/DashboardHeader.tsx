
import React from 'react';
import { TrendingUp, Bell, Settings } from 'lucide-react';
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
