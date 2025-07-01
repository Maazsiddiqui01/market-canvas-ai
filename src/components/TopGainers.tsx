
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const TopGainers = () => {
  const gainers = [
    { symbol: 'HBL', name: 'Habib Bank Limited', price: '156.78', change: '+8.45%' },
    { symbol: 'ENGRO', name: 'Engro Corporation', price: '278.90', change: '+7.23%' },
    { symbol: 'LUCK', name: 'Lucky Cement', price: '645.30', change: '+6.78%' },
    { symbol: 'UBL', name: 'United Bank Limited', price: '198.45', change: '+5.67%' },
    { symbol: 'PSO', name: 'Pakistan State Oil', price: '234.56', change: '+4.89%' }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Top Gainers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gainers.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div>
              <p className="font-semibold text-white">{stock.symbol}</p>
              <p className="text-sm text-slate-400 truncate max-w-32">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">PKR {stock.price}</p>
              <p className="text-sm text-green-500 font-medium">{stock.change}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopGainers;
