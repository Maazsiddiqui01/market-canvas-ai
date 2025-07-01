
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const TechnicalAnalysis = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "displayMode": "multiple",
      "isTransparent": false,
      "locale": "en",
      "interval": "30m",
      "disableInterval": false,
      "width": "100%",
      "height": "100%",
      "symbol": "PSX:KSE100",
      "showIntervalTabs": true
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
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Technical Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[400px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAnalysis;
