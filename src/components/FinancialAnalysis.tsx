import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from '@/components/tradingview/TradingViewAttribution';

interface FinancialAnalysisProps {
  ticker?: string;
}

const FinancialAnalysis = ({ ticker = 'MEBL' }: FinancialAnalysisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = useTradingViewTheme();

  useEffect(() => {
    setIsLoading(true);
    if (containerRef.current) containerRef.current.innerHTML = '';

    const tvSymbol = ticker === 'KSE100' ? 'PSX:KSE100' : `PSX:${ticker}`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: tvSymbol,
      colorTheme: currentTheme,
      displayMode: 'regular',
      isTransparent: true,
      locale: 'en',
      width: '100%',
      height: '800',
    });
    script.onload = () => setTimeout(() => setIsLoading(false), 2000);

    const container = containerRef.current;
    container?.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [ticker, currentTheme]);

  const tvSymbol = ticker === 'KSE100' ? 'PSX-KSE100' : `PSX-${ticker}`;

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover-scale">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary animate-pulse" />
          Financial Analysis for {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-card/80 flex items-center justify-center">
            <div className="space-y-4 w-full p-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )}
        <div className="tradingview-widget-container h-[800px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
        <TradingViewAttribution symbol={tvSymbol} label={`${ticker} financials on TradingView`} />
      </CardContent>
    </Card>
  );
};

export default FinancialAnalysis;
