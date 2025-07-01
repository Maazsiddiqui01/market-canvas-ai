
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    {
      name: 'KSE-100',
      value: '79,843.25',
      change: '+423.67',
      changePercent: '+0.53%',
      isPositive: true
    },
    {
      name: 'Volume',
      value: '312.5M',
      change: '+18.7M',
      changePercent: '+6.4%',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {marketData.map((market, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">{market.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{market.value}</p>
                <div className="flex items-center mt-2">
                  {market.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    market.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {market.change} ({market.changePercent})
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${
                market.isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <Activity className={`h-6 w-6 ${
                  market.isPositive ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketOverview;
