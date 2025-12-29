import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KSEData {
  kse100_close: string;
  kse100_change_percent: string;
  kse100_change_absolute: string;
}

interface MarketData {
  kse100_close?: string;
  kse100_change_percent?: string;
  kse100_change_absolute?: string;
}

interface MarketOverviewProps {
  refreshTrigger?: number;
}

const MarketOverview = ({ refreshTrigger }: MarketOverviewProps) => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const [loading, setLoading] = useState(false);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook/KSE-100', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: 'KSE100',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data: KSEData[] = await response.json();
        if (data && data.length > 0) {
          setMarketData(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [refreshTrigger]);

  const isPositiveChange = (value: string) => {
    return !value.startsWith('-');
  };

  const kseData = {
    name: 'KSE-100',
    value: marketData.kse100_close || '79,843.25',
    change: marketData.kse100_change_absolute 
      ? `${isPositiveChange(marketData.kse100_change_absolute) ? '+' : ''}${marketData.kse100_change_absolute}` 
      : '+423.67',
    changePercent: marketData.kse100_change_percent 
      ? `${isPositiveChange(marketData.kse100_change_percent) ? '+' : ''}${marketData.kse100_change_percent}` 
      : '+0.53%',
    isPositive: marketData.kse100_change_absolute ? isPositiveChange(marketData.kse100_change_absolute) : true
  };

  return (
    <div className="inline-flex items-center gap-4 px-6 py-3 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      {/* Live Badge */}
      <Badge variant="secondary" className="flex items-center gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
        <Activity className="h-3 w-3 animate-pulse" />
        Live
      </Badge>
      
      {/* Index Name */}
      <span className="text-sm font-medium text-muted-foreground">{kseData.name}</span>
      
      {/* Value */}
      <span className="text-xl font-bold text-foreground">{kseData.value}</span>
      
      {/* Change */}
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
        kseData.isPositive 
          ? 'bg-green-500/10 text-green-500' 
          : 'bg-red-500/10 text-red-500'
      }`}>
        {kseData.isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span className="text-sm font-semibold">
          {kseData.change} ({kseData.changePercent})
        </span>
      </div>
    </div>
  );
};

export default MarketOverview;
