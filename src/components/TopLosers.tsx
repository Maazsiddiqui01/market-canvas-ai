
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import { fetchTopLosers, StockData } from '@/services/tradingViewService';

const TopLosers = () => {
  const [losers, setLosers] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLosers = async () => {
      try {
        const data = await fetchTopLosers();
        setLosers(data);
      } catch (error) {
        console.error('Failed to load top losers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLosers();
    // Refresh data every 60 seconds
    const interval = setInterval(loadLosers, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const fallbackLosers = [
    { name: 'OGDC', close: 87.45, change: -5.67 },
    { name: 'PPL', close: 156.78, change: -4.89 },
    { name: 'MARI', close: 1234.56, change: -4.23 },
    { name: 'SNGP', close: 45.67, change: -3.78 },
    { name: 'SSGC', close: 12.34, change: -3.45 }
  ];

  const displayLosers = loading ? fallbackLosers : losers.length > 0 ? losers : fallbackLosers;

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          Top Losers
          {loading && <span className="text-sm text-slate-400 ml-2">Loading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayLosers.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div>
              <p className="font-semibold text-white">{stock.name}</p>
              <p className="text-sm text-slate-400 truncate max-w-32">
                {loading ? 'Loading...' : stock.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">PKR {formatNumber(stock.close)}</p>
              <p className="text-sm text-red-500 font-medium">{stock.change.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopLosers;
