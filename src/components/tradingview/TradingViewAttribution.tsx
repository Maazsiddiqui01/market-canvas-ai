import React from 'react';

/**
 * TradingView free embeds require an attribution link.
 * Pass the symbol so the link deep-links to the right ticker on tradingview.com.
 */
interface Props {
  symbol?: string;
  label?: string;
}

export const TradingViewAttribution = ({ symbol, label = 'Track all markets on TradingView' }: Props) => {
  const href = symbol
    ? `https://www.tradingview.com/symbols/${encodeURIComponent(symbol)}/`
    : 'https://www.tradingview.com/';
  return (
    <div className="tradingview-widget-copyright px-4 py-2 text-xs text-muted-foreground border-t border-border/40">
      <a
        href={href}
        rel="noopener nofollow"
        target="_blank"
        className="hover:text-primary transition-colors"
      >
        <span className="blue-text">{label}</span>
      </a>
    </div>
  );
};

export default TradingViewAttribution;
