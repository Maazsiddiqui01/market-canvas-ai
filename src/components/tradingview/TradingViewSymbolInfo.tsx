import React, { useEffect, useRef } from 'react';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from './TradingViewAttribution';

interface Props {
  /** Full TradingView symbol, e.g. "PSX:OGDC". */
  symbol: string;
  width?: string | number;
  showAttribution?: boolean;
}

/**
 * TradingView Symbol Info widget (price, change, key stats).
 * Per-symbol → PSX-safe for any listed PSX ticker.
 */
export const TradingViewSymbolInfo = ({
  symbol,
  width = '100%',
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
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbol,
      width,
      locale: 'en',
      colorTheme: theme,
      isTransparent: true,
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, theme, width]);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
      {showAttribution && <TradingViewAttribution symbol={symbol} />}
    </div>
  );
};

export default TradingViewSymbolInfo;
