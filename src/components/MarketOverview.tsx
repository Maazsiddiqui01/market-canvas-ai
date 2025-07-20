import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
        headers: {
          'Content-Type': 'application/json',
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
    change: marketData.kse100_change_absolute 
      ? `${isPositiveChange(marketData.kse100_change_absolute) ? '+' : ''}${marketData.kse100_change_absolute}`
      : '+423.67',
    changePercent: marketData.kse100_change_percent 
      ? `${isPositiveChange(marketData.kse100_change_percent) ? '+' : ''}${marketData.kse100_change_percent}`
      : '+0.53%',
    isPositive: marketData.kse100_change_absolute ? isPositiveChange(marketData.kse100_change_absolute) : true
  };

  const cards = [kseData];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Market Overview</h2>
      
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
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

      {/* Market Analysis Content */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p>
                • Pakistan's business community witnessed a peaceful nationwide strike protesting Sections 37A, 37B, and 37AA of the Income Tax Ordinance granting the Federal Board of Revenue (FBR) powers to arrest taxpayers without due process. Major trade bodies including Karachi Chamber of Commerce and Pakistan Hosiery Manufacturers and Exporters Association (PHMA) led the widespread shutdown of markets and industries across Pakistan, reflecting collective resistance against these "draconian and anti-business" laws. The strike underscores the current uncertainties for investors and businesses.
              </p>
            </div>
            
            <div>
              <p>
                • Read more:{' '}
                <a 
                  href="https://tribune.com.pk/story/2556859/economic-halt-as-nation-strikes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline transition-colors"
                >
                  Economic halt as nation strikes
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sector Highlights as separate section */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Sector Highlights (Commercial Banks):</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p>
                • The banking sector shows resilience despite regulatory pressures and macroeconomic uncertainty.
              </p>
            </div>
            
            <div>
              <p>
                • Meezan Bank, Pakistan's largest Islamic bank, continues to benefit from digitization trends and rising fee income amid Pakistan's growing $4.6 billion IT export market.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
