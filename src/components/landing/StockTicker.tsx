import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const stocks = [
  { symbol: 'OGDC', price: '98.45', change: '+2.15%', up: true },
  { symbol: 'PPL', price: '75.20', change: '+1.82%', up: true },
  { symbol: 'HBL', price: '142.50', change: '+0.95%', up: true },
  { symbol: 'LUCK', price: '512.75', change: '-1.23%', up: false },
  { symbol: 'ENGRO', price: '268.30', change: '+2.45%', up: true },
  { symbol: 'MCB', price: '185.60', change: '+1.12%', up: true },
  { symbol: 'PSO', price: '345.80', change: '-0.67%', up: false },
  { symbol: 'HUBC', price: '89.25', change: '+3.21%', up: true },
  { symbol: 'UBL', price: '178.90', change: '+0.88%', up: true },
  { symbol: 'FFC', price: '112.40', change: '-0.45%', up: false },
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
