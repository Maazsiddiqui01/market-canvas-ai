import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart } from 'lucide-react';
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
const MarketOverview = ({
  refreshTrigger
}: MarketOverviewProps) => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const [loading, setLoading] = useState(false);
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook/KSE-100', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticker: 'KSE100',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data: KSEData[] = await response.json();
        console.log('Market data received:', data);

        // Parse the JSON array response and update market data
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
  const parseNumber = (numStr: string) => {
    return parseFloat(numStr.replace(/,/g, ''));
  };
  const isPositiveChange = (value: string) => {
    return !value.startsWith('-');
  };
  const kseData = {
    name: 'KSE-100',
    value: marketData.kse100_close || '79,843.25',
    change: marketData.kse100_change_absolute ? `${isPositiveChange(marketData.kse100_change_absolute) ? '+' : ''}${marketData.kse100_change_absolute}` : '+423.67',
    changePercent: marketData.kse100_change_percent ? `${isPositiveChange(marketData.kse100_change_percent) ? '+' : ''}${marketData.kse100_change_percent}` : '+0.53%',
    isPositive: marketData.kse100_change_absolute ? isPositiveChange(marketData.kse100_change_absolute) : true
  };
  const cards = [kseData];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Overview
        </h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {cards.map((market, index) => <Card key={index} className="bg-card/50 border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 cursor-pointer group backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">{market.name}</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors">{market.value}</p>
                  <div className="flex items-center mt-3 gap-1">
                    {market.isPositive ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                    <span className={`text-sm font-medium ${market.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {market.change} ({market.changePercent})
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-full transition-all duration-300 ${market.isPositive ? 'bg-green-500/20 group-hover:bg-green-500/30' : 'bg-red-500/20 group-hover:bg-red-500/30'}`}>
                  <Activity className={`h-8 w-8 ${market.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Market Analysis Content */}
      <Card className="bg-card border-border">
        
      </Card>

    </div>;
};
export default MarketOverview;