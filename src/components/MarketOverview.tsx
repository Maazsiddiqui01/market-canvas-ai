
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

interface MarketData {
  kse100?: {
    value: number;
    change: number;
    changePercent: number;
  };
  volume?: {
    value: number;
    change: number;
    changePercent: number;
  };
}

interface MarketOverviewProps {
  refreshTrigger?: number;
}

const MarketOverview = ({ refreshTrigger }: MarketOverviewProps) => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const [loading, setLoading] = useState(false);

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

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook/KSE-100', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: 'KSE100',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Market data received:', data);
        
        // Parse the JSON response and update market data
        if (data.kse100) {
          setMarketData(data);
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

  const kseData = {
    name: 'KSE-100',
    value: marketData.kse100?.value ? formatNumber(marketData.kse100.value) : '79,843.25',
    change: marketData.kse100?.change ? `${marketData.kse100.change >= 0 ? '+' : ''}${formatNumber(marketData.kse100.change)}` : '+423.67',
    changePercent: marketData.kse100?.changePercent ? `${marketData.kse100.changePercent >= 0 ? '+' : ''}${marketData.kse100.changePercent.toFixed(2)}%` : '+0.53%',
    isPositive: marketData.kse100?.change ? marketData.kse100.change >= 0 : true
  };

  const volumeData = {
    name: 'Volume',
    value: marketData.volume?.value ? formatVolume(marketData.volume.value) : '312.5M',
    change: marketData.volume?.change ? `${marketData.volume.change >= 0 ? '+' : ''}${formatVolume(marketData.volume.change)}` : '+18.7M',
    changePercent: marketData.volume?.changePercent ? `${marketData.volume.changePercent >= 0 ? '+' : ''}${marketData.volume.changePercent.toFixed(1)}%` : '+6.4%',
    isPositive: marketData.volume?.change ? marketData.volume.change >= 0 : true
  };

  const cards = [kseData, volumeData];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Market Overview</h2>
        <Button 
          onClick={fetchMarketData}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {cards.map((market, index) => (
          <Card key={index} className="bg-card border-border hover:bg-secondary/50 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{market.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{market.value}</p>
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
    </div>
  );
};

export default MarketOverview;
