
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';

const TopLosers = () => {
  const losers = [
    { symbol: 'OGDC', name: 'Oil & Gas Development', price: '87.45', change: '-5.67%' },
    { symbol: 'PPL', name: 'Pakistan Petroleum', price: '156.78', change: '-4.89%' },
    { symbol: 'MARI', name: 'Mari Petroleum', price: '1,234.56', change: '-4.23%' },
    { symbol: 'SNGP', name: 'Sui Northern Gas', price: '45.67', change: '-3.78%' },
    { symbol: 'SSGC', name: 'Sui Southern Gas', price: '12.34', change: '-3.45%' }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          Top Losers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {losers.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div>
              <p className="font-semibold text-white">{stock.symbol}</p>
              <p className="text-sm text-slate-400 truncate max-w-32">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">PKR {stock.price}</p>
              <p className="text-sm text-red-500 font-medium">{stock.change}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopLosers;
