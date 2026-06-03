import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KSEData {
  kse100_close: string;
  kse100_change_percent: string;
  kse100_change_absolute: string;
}

interface MarketOverviewProps {
  refreshTrigger?: number;
}

const WRAP =
  'inline-flex flex-wrap items-center justify-center gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-3 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg transition-all duration-300 animate-fade-in';

const MarketOverview = ({ refreshTrigger }: MarketOverviewProps) => {
  const [data, setData] = useState<KSEData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  const fetchMarketData = async () => {
    setStatus('loading');
    try {
      const response = await fetch('https://n8n.80.225.213.232.sslip.io/webhook/KSE-100', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: 'KSE100', timestamp: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const row: KSEData | undefined = Array.isArray(json) ? json[0] : undefined;
      if (row && row.kse100_close) {
        setData(row);
        setStatus('live');
      } else {
        throw new Error('empty payload');
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [refreshTrigger]);

  // Never show invented numbers: render explicit loading / unavailable states instead.
  if (status !== 'live' || !data) {
    return (
      <div className={WRAP}>
        <span className="text-xs md:text-sm font-medium text-muted-foreground">KSE-100</span>
        {status === 'error' ? (
          <button
            onClick={fetchMarketData}
            className="flex items-center gap-1 text-xs md:text-sm text-primary hover:underline"
          >
            <RefreshCw className="h-3 w-3" /> data unavailable — retry
          </button>
        ) : (
          <span className="text-xs md:text-sm text-muted-foreground animate-pulse">Loading…</span>
        )}
      </div>
    );
  }

  const isPositive = !data.kse100_change_absolute.startsWith('-');
  const sign = isPositive ? '+' : '';

  return (
    <div className={WRAP}>
      <Badge variant="secondary" className="flex items-center gap-1.5 bg-up/10 text-up border-up/20">
        <Activity className="h-3 w-3 animate-pulse" />
        Live
      </Badge>
      <span className="text-xs md:text-sm font-medium text-muted-foreground">KSE-100</span>
      <span className="text-base md:text-xl font-bold text-foreground">{data.kse100_close}</span>
      <div
        className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-lg ${
          isPositive ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
        ) : (
          <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
        )}
        <span className="text-xs md:text-sm font-semibold">
          {sign}{data.kse100_change_absolute} ({sign}{data.kse100_change_percent})
        </span>
      </div>
    </div>
  );
};

export default MarketOverview;
