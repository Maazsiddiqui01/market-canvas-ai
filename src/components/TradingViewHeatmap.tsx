import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from '@/components/tradingview/TradingViewAttribution';

const TradingViewHeatmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const currentTheme = useTradingViewTheme();

  // Check if market is open (9 AM to 5 PM Pakistan time)
  useEffect(() => {
    const checkMarketHours = () => {
      const now = new Date();
      const pakistanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
      const hour = pakistanTime.getHours();
      setIsMarketOpen(hour >= 9 && hour < 17);
    };
    checkMarketHours();
    const interval = setInterval(checkMarketHours, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      dataSource: 'PSXKSE100',
      blockSize: 'market_cap_basic',
      blockColor: 'change',
      grouping: 'sector',
      locale: 'en',
      symbolUrl: '',
      colorTheme: currentTheme,
      exchanges: [],
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: true,
      isTransparent: true,
      width: '100%',
      height: '500',
    });

    const container = containerRef.current;
    container?.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [currentTheme]);

  return (
    <Card className="glass-subtle border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          {isMarketOpen && <div className="w-2 h-2 bg-up rounded-full animate-pulse" aria-hidden />}
          Market Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[500px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
        <TradingViewAttribution symbol="PSX-KSE100" />
      </CardContent>
    </Card>
  );
};

export default TradingViewHeatmap;
