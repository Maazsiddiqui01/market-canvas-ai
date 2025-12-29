import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const stocks = [
  { symbol: 'AAPL', price: '193.42', change: '+2.34%', up: true },
  { symbol: 'GOOGL', price: '141.80', change: '+1.12%', up: true },
  { symbol: 'MSFT', price: '378.91', change: '+0.89%', up: true },
  { symbol: 'TSLA', price: '252.64', change: '-1.45%', up: false },
  { symbol: 'AMZN', price: '186.51', change: '+1.78%', up: true },
  { symbol: 'NVDA', price: '495.22', change: '+3.21%', up: true },
  { symbol: 'META', price: '353.96', change: '+0.67%', up: true },
  { symbol: 'NFLX', price: '487.82', change: '-0.52%', up: false },
];

const StockTicker = () => {
  return (
    <div className="w-full overflow-hidden bg-card/30 backdrop-blur-sm border-y border-border/30 py-3">
      <div className="flex animate-marquee">
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="flex items-center gap-3 px-6 border-r border-border/20"
          >
            <span className="font-display font-semibold text-foreground">{stock.symbol}</span>
            <span className="text-muted-foreground">${stock.price}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${stock.up ? 'text-green-500' : 'text-red-500'}`}>
              {stock.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
