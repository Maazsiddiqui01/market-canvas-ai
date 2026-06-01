import React, { useEffect, useRef } from 'react';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from './TradingViewAttribution';

interface Props {
  /** Full TradingView symbol, e.g. "PSX:OGDC". */
  symbol: string;
  interval?: 'D' | 'W' | 'M' | '60' | '240';
  height?: number | string;
  showAttribution?: boolean;
}

/**
 * TradingView Advanced Chart (candlestick + indicators).
 * Per-symbol widget → works with any PSX:XXX symbol TradingView lists.
 */
export const TradingViewAdvancedChart = ({
  symbol,
  interval = 'D',
  height = 500,
  showAttribution = true,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTradingViewTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbol,
      interval,
      timezone: 'Asia/Karachi',
      theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      hide_side_toolbar: false,
      isTransparent: true,
      autosize: true,
      withdateranges: true,
      hide_volume: false,
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, interval, theme]);

  return (
    <div className="tradingview-widget-container" style={{ height }}>
      <div
        ref={containerRef}
        className="tradingview-widget-container__widget"
        style={{ height: '100%', width: '100%' }}
      />
      {showAttribution && <TradingViewAttribution symbol={symbol} />}
    </div>
  );
};

export default TradingViewAdvancedChart;
