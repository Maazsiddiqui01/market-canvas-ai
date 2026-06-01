import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import TradingViewAttribution from '@/components/tradingview/TradingViewAttribution';

interface TechnicalAnalysisProps {
  ticker?: string;
}

const TechnicalAnalysis = ({ ticker = 'KSE100' }: TechnicalAnalysisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = useTradingViewTheme();
  const isMobile = useIsMobile();
  const widgetHeight = isMobile ? 560 : 800;

  useEffect(() => {
    setIsLoading(true);
    if (containerRef.current) containerRef.current.innerHTML = '';

    const tvSymbol = ticker === 'KSE100' ? 'PSX:KSE100' : `PSX:${ticker}`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: currentTheme,
      displayMode: 'multiple',
      isTransparent: true,
      locale: 'en',
      interval: '30m',
      disableInterval: false,
      width: '100%',
      height: String(widgetHeight),
      symbol: tvSymbol,
      showIntervalTabs: true,
    });
    script.onload = () => setTimeout(() => setIsLoading(false), 2000);

    const container = containerRef.current;
    container?.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [ticker, currentTheme, widgetHeight]);

  const tvSymbol = ticker === 'KSE100' ? 'PSX-KSE100' : `PSX-${ticker}`;

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover-scale">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
          Technical Analysis for {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-card/80 flex items-center justify-center">
            <div className="space-y-4 w-full p-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )}
        <div className="tradingview-widget-container" style={{ height: widgetHeight }} ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
        <TradingViewAttribution symbol={tvSymbol} label={`${ticker} technicals on TradingView`} />
      </CardContent>
    </Card>
  );
};

export default TechnicalAnalysis;
