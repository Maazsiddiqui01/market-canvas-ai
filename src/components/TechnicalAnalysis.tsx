
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TechnicalAnalysisProps {
  ticker?: string;
}

const TechnicalAnalysis = ({ ticker = 'KSE100' }: TechnicalAnalysisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous widget
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    
    // Format ticker for TradingView
    const tvSymbol = ticker === 'KSE100' ? 'PSX:KSE100' : `PSX:${ticker}`;
    
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "displayMode": "multiple",
      "isTransparent": false,
      "locale": "en",
      "interval": "30m",
      "disableInterval": false,
      "width": "100%",
      "height": "100%",
      "symbol": tvSymbol,
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
  }, [ticker]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Technical Analysis for {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[600px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAnalysis;
