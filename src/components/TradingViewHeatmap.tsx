
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TradingViewHeatmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  // Check if market is open (9 AM to 5 PM Pakistan time)
  const checkMarketHours = () => {
    const now = new Date();
    const pakistanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Karachi"}));
    const hour = pakistanTime.getHours();
    setIsMarketOpen(hour >= 9 && hour < 17);
  };

  useEffect(() => {
    checkMarketHours();
    const interval = setInterval(checkMarketHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    const colorTheme = isDarkMode ? 'dark' : 'light';
    
    script.innerHTML = JSON.stringify({
      "dataSource": "PSXKSE100",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "grouping": "sector",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": colorTheme,
      "exchanges": [],
      "hasTopBar": true,
      "isDataSetEnabled": true,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": true,
      "width": "100%",
      "height": "500"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {isMarketOpen && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          Market Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[500px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewHeatmap;
