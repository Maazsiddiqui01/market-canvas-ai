import React, { useEffect, useRef } from 'react';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from './TradingViewAttribution';

interface Props {
  /** Full TradingView symbol, e.g. "PSX:OGDC". Per-symbol → PSX-safe. */
  symbol: string;
  height?: number;
  width?: string | number;
  dateRange?: '1D' | '1M' | '3M' | '12M' | '60M' | 'ALL';
  showAttribution?: boolean;
}

/**
 * TradingView Mini Symbol Overview (sparkline). Per-symbol widget,
 * works for any PSX ticker that TradingView lists.
 */
export const TradingViewMiniChart = ({
  symbol,
  height = 100,
  width = '100%',
  dateRange = '1M',
  showAttribution = false,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTradingViewTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbol,
      width,
      height,
      locale: 'en',
      dateRange,
      colorTheme: theme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, theme, dateRange, height, width]);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
      {showAttribution && <TradingViewAttribution symbol={symbol} />}
    </div>
  );
};

export default TradingViewMiniChart;
