import React, { useEffect, useRef } from 'react';
import { useTradingViewTheme } from '@/hooks/useTradingViewTheme';
import TradingViewAttribution from './TradingViewAttribution';

export interface MarketQuotesGroup {
  name: string;
  originalName?: string;
  /** Each tuple: ["PSX:OGDC", "OGDC"] */
  symbols: { name: string; displayName?: string }[];
}

interface Props {
  title?: string;
  symbolsGroups: MarketQuotesGroup[];
  width?: string | number;
  height?: string | number;
  showAttribution?: boolean;
}

/**
 * TradingView Market Quotes (multi-group watchlist table).
 * Per-symbol → PSX-safe when symbols use the `PSX:` prefix.
 */
export const TradingViewMarketQuotes = ({
  title = 'Watchlist',
  symbolsGroups,
  width = '100%',
  height = 460,
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
      'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      width,
      height,
      symbolsGroups,
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: theme,
      locale: 'en',
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbolsGroups, theme, width, height]);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
      {showAttribution && <TradingViewAttribution />}
    </div>
  );
};

export default TradingViewMarketQuotes;
