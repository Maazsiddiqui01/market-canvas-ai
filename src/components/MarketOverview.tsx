
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    {
      name: 'KSE-100',
      value: '45,234.56',
      change: '+234.12',
      changePercent: '+0.52%',
      isPositive: true
    },
    {
      name: 'KSE-ALL',
      value: '32,123.45',
      change: '-156.78',
      changePercent: '-0.49%',
      isPositive: false
    },
    {
      name: 'KMI-30',
      value: '78,901.23',
      change: '+445.67',
      changePercent: '+0.57%',
      isPositive: true
    },
    {
      name: 'Volume',
      value: '156.7M',
      change: '+12.3M',
      changePercent: '+8.5%',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
