
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { fetchKSE100Data, StockData } from '@/services/tradingViewService';

const MarketOverview = () => {
  const [kseData, setKseData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKSEData = async () => {
      try {
        const data = await fetchKSE100Data();
        setKseData(data);
      } catch (error) {
        console.error('Failed to load KSE-100 data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKSEData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadKSEData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const marketData = [
    {
      name: 'KSE-100',
      value: loading ? 'Loading...' : kseData ? formatNumber(kseData.close) : '79,843.25',
      change: loading ? '...' : kseData ? `${kseData.change_abs >= 0 ? '+' : ''}${formatNumber(kseData.change_abs)}` : '+423.67',
      changePercent: loading ? '...' : kseData ? `${kseData.change >= 0 ? '+' : ''}${kseData.change.toFixed(2)}%` : '+0.53%',
      isPositive: loading ? true : kseData ? kseData.change >= 0 : true
    },
    {
      name: 'Volume',
      value: loading ? 'Loading...' : kseData ? formatVolume(kseData.volume) : '312.5M',
      change: '+18.7M',
      changePercent: '+6.4%',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
