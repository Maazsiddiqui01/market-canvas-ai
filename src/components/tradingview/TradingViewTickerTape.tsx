import React, { useEffect, useRef } from 'react';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from './TradingViewAttribution';

export interface TickerTapeSymbol {
  /** Full TradingView symbol, e.g. "PSX:OGDC". */
  proName: string;
  /** Display label, e.g. "OGDC". */
  title: string;
}

interface Props {
  symbols: TickerTapeSymbol[];
  displayMode?: 'adaptive' | 'regular' | 'compact';
  showAttribution?: boolean;
}

/**
 * TradingView Ticker Tape (scrolling per-symbol tape).
 * Per-symbol widget → PSX-safe when symbols use `PSX:` prefix.
 */
export const TradingViewTickerTape = ({
  symbols,
  displayMode = 'adaptive',
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
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode,
      colorTheme: theme,
      locale: 'en',
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbols, theme, displayMode]);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
      {showAttribution && <TradingViewAttribution />}
    </div>
  );
};

export default TradingViewTickerTape;
