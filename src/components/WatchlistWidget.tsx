import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, TrendingUp, TrendingDown, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import TradingViewMiniChart from '@/components/tradingview/TradingViewMiniChart';

const WatchlistWidget = () => {
  const watchlist = [
    { symbol: 'BAFL', price: '45.67', change: '+1.23%', isPositive: true },
    { symbol: 'DAWH', price: '123.45', change: '-0.89%', isPositive: false },
    { symbol: 'FCCL', price: '89.01', change: '+2.45%', isPositive: true },
    { symbol: 'HUBC', price: '234.56', change: '+0.67%', isPositive: true },
  ];

  return (
    <Card className="glass-subtle border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            Watchlist
            <Badge variant="secondary" className="ml-1 text-xs">
              {watchlist.length}
            </Badge>
          </CardTitle>
          <Button
            asChild
            size="sm"
            variant="ghost"
            aria-label="Add to watchlist"
            className="text-muted-foreground hover:text-primary"
          >
            <Link to="/dashboard/watchlist">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {watchlist.map((stock, index) => {
          const deltaClass = stock.isPositive ? 'text-up' : 'text-destructive';
          const tintClass = stock.isPositive ? 'bg-up/10' : 'bg-destructive/10';
          return (
            <div
              key={index}
              className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tintClass}`}>
                  {stock.isPositive ? (
                    <TrendingUp className={`h-4 w-4 ${deltaClass}`} />
                  ) : (
                    <TrendingDown className={`h-4 w-4 ${deltaClass}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground tracking-tight">{stock.symbol}</p>
                    <Activity className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Stock
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-24 h-10 opacity-90">
                <TradingViewMiniChart
                  symbol={`PSX:${stock.symbol}`}
                  height={40}
                  dateRange="1M"
                />
              </div>
              <div className="text-right tabular-nums">
                <p className="font-semibold text-foreground">PKR {stock.price}</p>
                <p className={`text-sm font-medium ${deltaClass}`}>{stock.change}</p>
              </div>
            </div>
          );
        })}
        <Button asChild variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground hover:text-primary">
          <Link to="/dashboard/watchlist">View all →</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default WatchlistWidget;
