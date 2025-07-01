
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp } from 'lucide-react';

const PortfolioWidget = () => {
  const portfolioData = {
    totalValue: '2,456,789',
    todayChange: '+45,678',
    todayChangePercent: '+1.89%',
    holdings: [
      { symbol: 'HBL', shares: '500', value: '78,390', change: '+2.3%' },
      { symbol: 'ENGRO', shares: '200', value: '55,780', change: '+1.8%' },
      { symbol: 'LUCK', shares: '100', value: '64,530', change: '+3.2%' }
    ]
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-purple-500" />
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Portfolio Value */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <p className="text-slate-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-white">PKR {portfolioData.totalValue}</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {portfolioData.todayChange} ({portfolioData.todayChangePercent})
              </span>
            </div>
          </div>

          {/* Top Holdings */}
          <div className="space-y-2">
            <p className="text-slate-400 text-sm font-medium">Top Holdings</p>
            {portfolioData.holdings.map((holding, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded bg-slate-700/30">
                <div>
                  <p className="text-white font-medium">{holding.symbol}</p>
                  <p className="text-slate-400 text-xs">{holding.shares} shares</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">PKR {holding.value}</p>
                  <p className="text-green-500 text-xs">{holding.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioWidget;
