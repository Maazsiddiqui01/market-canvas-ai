import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface FinancialAnalysisProps {
  ticker?: string;
}

const FinancialAnalysis = ({ ticker = 'MEBL' }: FinancialAnalysisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous widget
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    script.async = true;
    
    // Format ticker for TradingView - keep KSE100 as is, add PSX: prefix for others
    const tvSymbol = ticker === 'KSE100' ? 'PSX:KSE100' : `PSX:${ticker}`;
    
    script.innerHTML = JSON.stringify({
      "symbol": tvSymbol,
      "colorTheme": "dark",
      "displayMode": "regular",
      "isTransparent": false,
      "locale": "en",
      "width": "100%",
      "height": "100%"
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
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Analysis for {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[3000px]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialAnalysis;
