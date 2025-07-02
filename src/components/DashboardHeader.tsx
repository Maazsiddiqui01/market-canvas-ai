
import React from 'react';
import { TrendingUp, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockSearch from './StockSearch';

const DashboardHeader = () => {
  return (
    <div className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">StockAnalyzer Pro</h1>
              <p className="text-sm text-slate-400">Real-time market insights</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Stock Search */}
        <StockSearch />
      </div>
    </div>
  );
};

export default DashboardHeader;
