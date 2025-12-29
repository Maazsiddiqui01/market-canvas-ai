import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchStocks, Stock } from '@/data/stockData';
import { Search, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockSelectorProps {
  value: Stock | null;
  onChange: (stock: Stock) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const StockSelector = ({ value, onChange, placeholder = "Search stocks...", disabled }: StockSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 1) {
        setLoading(true);
        try {
          const stocks = await searchStocks(query);
          setResults(stocks);
          setHighlightIndex(0);
        } catch (error) {
          console.error('Error searching stocks:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (stock: Stock) => {
    onChange(stock);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightIndex]) {
          handleSelect(results[highlightIndex]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const clearSelection = () => {
    onChange(null as any);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 p-3 rounded-md border border-border bg-secondary/50">
          <div className="flex-1">
            <p className="font-medium text-sm">{value.ticker}</p>
            <p className="text-xs text-muted-foreground">{value.name}</p>
            {value.sector && (
              <p className="text-xs text-primary/70">{value.sector}</p>
            )}
          </div>
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={clearSelection}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
            disabled={disabled}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {open && !value && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border border-border bg-popover shadow-lg">
          <ScrollArea className="max-h-60">
            <div className="p-1">
              {results.map((stock, index) => (
                <button
                  key={stock.ticker}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors",
                    index === highlightIndex && "bg-accent",
                    "hover:bg-accent focus:bg-accent"
                  )}
                  onClick={() => handleSelect(stock)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stock.ticker}</span>
                      {stock.sector && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate">
                          {stock.sector}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                  </div>
                  {value?.ticker === stock.ticker && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {open && !value && query.length >= 1 && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 p-4 rounded-md border border-border bg-popover shadow-lg text-center text-sm text-muted-foreground">
          No stocks found for "{query}"
        </div>
      )}
    </div>
  );
};
