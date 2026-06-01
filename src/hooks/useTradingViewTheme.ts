import { useEffect, useState } from 'react';

/**
 * Tracks the document's current theme (light/dark) by observing the `class`
 * attribute on <html>. Used by TradingView embed widgets which must be
 * re-mounted with a new `colorTheme` whenever the theme flips.
 */
export const useTradingViewTheme = (): 'dark' | 'light' => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  );

  useEffect(() => {
    const check = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
};
