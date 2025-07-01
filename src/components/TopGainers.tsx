
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { fetchTopGainers, StockData } from '@/services/tradingViewService';

const TopGainers = () => {
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGainers = async () => {
      try {
        const data = await fetchTopGainers();
        setGainers(data);
      } catch (error) {
        console.error('Failed to load top gainers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGainers();
    // Refresh data every 60 seconds
    const interval = setInterval(loadGainers, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const fallbackGainers = [
    { name: 'HBL', close: 156.78, change: 8.45 },
    { name: 'ENGRO', close: 278.90, change: 7.23 },
    { name: 'LUCK', close: 645.30, change: 6.78 },
    { name: 'UBL', close: 198.45, change: 5.67 },
    { name: 'PSO', close: 234.56, change: 4.89 }
  ];

  const displayGainers = loading ? fallbackGainers : gainers.length > 0 ? gainers : fallbackGainers;

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Top Gainers
          {loading && <span className="text-sm text-slate-400 ml-2">Loading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayGainers.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div>
              <p className="font-semibold text-white">{stock.name}</p>
              <p className="text-sm text-slate-400 truncate max-w-32">
                {loading ? 'Loading...' : stock.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">PKR {formatNumber(stock.close)}</p>
              <p className="text-sm text-green-500 font-medium">+{stock.change.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopGainers;
