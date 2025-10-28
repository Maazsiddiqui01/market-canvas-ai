
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, TrendingUp, TrendingDown, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const WatchlistWidget = () => {
  const watchlist = [
    { symbol: 'BAFL', price: '45.67', change: '+1.23%', isPositive: true },
    { symbol: 'DAWH', price: '123.45', change: '-0.89%', isPositive: false },
    { symbol: 'FCCL', price: '89.01', change: '+2.45%', isPositive: true },
    { symbol: 'HUBC', price: '234.56', change: '+0.67%', isPositive: true }
  ];

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            Watchlist
            <Badge variant="secondary" className="ml-2">
              {watchlist.length}
            </Badge>
          </CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {watchlist.map((stock, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full transition-all duration-300 ${
                stock.isPositive 
                  ? 'bg-green-500/10 group-hover:bg-green-500/20' 
                  : 'bg-red-500/10 group-hover:bg-red-500/20'
              }`}>
                {stock.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{stock.symbol}</p>
                  <Activity className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-muted-foreground text-xs flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Stock
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">PKR {stock.price}</p>
              <p className={`text-sm font-medium flex items-center justify-end gap-1 ${
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
