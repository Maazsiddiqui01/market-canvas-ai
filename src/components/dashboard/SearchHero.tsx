import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Filter, X, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SECTORS, searchStocks, getStocksBySector, type Stock } from '@/data/stockData';

interface SearchHeroProps {
  onTickerChange: (ticker: string) => void;
  selectedTicker: string;
}

export const SearchHero = ({ onTickerChange, selectedTicker }: SearchHeroProps) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [sectorStocks, setSectorStocks] = useState<Stock[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loadingSectorStocks, setLoadingSectorStocks] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combined suggestions for dropdown
  const dropdownSuggestions = useMemo(() => {
    if (searchQuery.trim()) {
      return suggestions;
    } else if (selectedSector && selectedSector !== 'all' && sectorStocks.length > 0) {
      return sectorStocks;
    }
    return [];
  }, [suggestions, sectorStocks, searchQuery, selectedSector]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-search-hero]')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when search query or sector changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      
      setLoadingSuggestions(true);
      try {
        const results = await searchStocks(searchQuery, selectedSector === 'all' ? undefined : selectedSector);
        setSuggestions(results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSector]);

  // Fetch stocks for selected sector
  useEffect(() => {
    const fetchSectorStocks = async () => {
      if (!selectedSector || selectedSector === 'all') {
        setSectorStocks([]);
        return;
      }
      
      setLoadingSectorStocks(true);
      try {
        const results = await getStocksBySector(selectedSector);
        setSectorStocks(results.slice(0, 20));
      } catch (error) {
        console.error('Error fetching sector stocks:', error);
        setSectorStocks([]);
      } finally {
        setLoadingSectorStocks(false);
      }
    };

    fetchSectorStocks();
  }, [selectedSector]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [dropdownSuggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || dropdownSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < dropdownSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : dropdownSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < dropdownSuggestions.length) {
          handleStockSelect(dropdownSuggestions[highlightedIndex]);
        } else if (dropdownSuggestions.length === 1) {
          handleStockSelect(dropdownSuggestions[0]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isDropdownOpen, dropdownSuggestions, highlightedIndex]);

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('[data-stock-item]');
      const highlightedItem = items[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-primary/30 text-primary font-semibold rounded px-0.5">{part}</span>
      ) : part
    );
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setSearchQuery(stock.ticker);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onTickerChange(stock.ticker);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedStock(null);
    setIsDropdownOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedStock(null);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div 
      data-search-hero
      className="relative w-full max-w-3xl mx-auto animate-fade-in"
    >
      {/* Main Search Container */}
      <div className="relative flex items-center gap-2 p-2 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
        {/* Sector Filter */}
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-[140px] border-0 bg-secondary/50 rounded-xl focus:ring-1 focus:ring-primary/50">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search stocks by name or ticker..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-12 border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
          {(searchQuery || selectedStock) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSelection}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-destructive/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Button */}
        <Button 
          onClick={() => selectedStock && onTickerChange(selectedStock.ticker)}
          className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          disabled={!selectedStock}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && dropdownSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden z-50 animate-fade-in"
        >
          <div className="max-h-[320px] overflow-y-auto p-2">
            {loadingSuggestions || loadingSectorStocks ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              dropdownSuggestions.map((stock, index) => (
                <button
                  key={stock.ticker}
                  data-stock-item
                  onClick={() => handleStockSelect(stock)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left
                    transition-all duration-200
                    ${highlightedIndex === index 
                      ? 'bg-primary/20 text-foreground' 
                      : 'hover:bg-secondary/50'
                    }
                  `}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {stock.ticker.slice(0, 3)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {highlightMatch(stock.ticker, searchQuery)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        PSX
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {highlightMatch(stock.name || '', searchQuery)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span className="max-w-[100px] truncate">{stock.sector}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Stock Badge */}
      {selectedStock && (
        <div className="flex items-center justify-center mt-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm text-muted-foreground">Viewing:</span>
            <span className="font-semibold text-primary">{selectedStock.ticker}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-foreground">{selectedStock.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};
