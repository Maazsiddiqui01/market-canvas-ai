import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SelectedTickerContextValue {
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
}

const SelectedTickerContext = createContext<SelectedTickerContextValue | undefined>(undefined);

export const SelectedTickerProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTicker, setSelectedTickerState] = useState<string>(() => {
    try {
      return sessionStorage.getItem('selectedTicker') || 'KSE100';
    } catch {
      return 'KSE100';
    }
  });

  const setSelectedTicker = useCallback((ticker: string) => {
    setSelectedTickerState(ticker);
    try {
      sessionStorage.setItem('selectedTicker', ticker);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <SelectedTickerContext.Provider value={{ selectedTicker, setSelectedTicker }}>
      {children}
    </SelectedTickerContext.Provider>
  );
};

export const useSelectedTicker = () => {
  const ctx = useContext(SelectedTickerContext);
  if (!ctx) throw new Error('useSelectedTicker must be used within SelectedTickerProvider');
  return ctx;
};
