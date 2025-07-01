
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WatchlistWidget = () => {
  const watchlist = [
    { symbol: 'BAFL', price: '45.67', change: '+1.23%', isPositive: true },
    { symbol: 'DAWH', price: '123.45', change: '-0.89%', isPositive: false },
    { symbol: 'FCCL', price: '89.01', change: '+2.45%', isPositive: true },
    { symbol: 'HUBC', price: '234.56', change: '+0.67%', isPositive: true }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-500" />
            Watchlist
          </CardTitle>
          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {watchlist.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div>
              <p className="font-semibold text-white">{stock.symbol}</p>
              <p className="text-slate-400 text-sm">Stock</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">PKR {stock.price}</p>
              <p className={`text-sm font-medium ${
                stock.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stock.change}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WatchlistWidget;
