import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Filter, X, Building2, Loader2, TrendingUp, Newspaper, Zap, BarChart3, Activity, Brain, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SECTORS, searchStocks, getStocksBySector, type Stock } from '@/data/stockData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SearchHeroProps {
  onTickerChange: (ticker: string) => void;
  selectedTicker: string;
}

interface ParsedSections {
  stockPrices: string[];
  newsInsights: string[];
  technicalAnalysis: { type: string; signal: string }[];
  fundamentalAnalysis: string[];
  marketOverview: string[];
  recommendation: string[];
  newsLinks: { title: string; url: string }[];
  conclusion: string;
}

export const SearchHero = ({ onTickerChange, selectedTicker }: SearchHeroProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [sectorStocks, setSectorStocks] = useState<Stock[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loadingSectorStocks, setLoadingSectorStocks] = useState(false);
  
  // Search state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    { text: "Spinning up your news...", icon: Newspaper },
    { text: "Powering your analysis...", icon: Zap },
    { text: "Crunching market data...", icon: BarChart3 },
    { text: "Fetching real-time insights...", icon: Activity },
    { text: "Loading financial intelligence...", icon: Brain },
    { text: "Connecting to data sources...", icon: Database },
    { text: "Processing market signals...", icon: TrendingUp },
    { text: "Analyzing trends...", icon: BarChart3 }
  ];

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

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
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedStock(null);
    setIsDropdownOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedStock(null);
    setSearchQuery('');
    setResponseData(null);
    inputRef.current?.focus();
  };

  // Save stock search to history
  const saveSearchToHistory = async (ticker: string, stockName: string | null) => {
    if (!user) return;
    
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from('search_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('ticker', ticker.toUpperCase())
        .gte('searched_at', fiveMinutesAgo)
        .limit(1);
      
      if (existing && existing.length > 0) {
        await supabase
          .from('search_history')
          .update({ searched_at: new Date().toISOString() })
          .eq('id', existing[0].id);
      } else {
        await supabase.from('search_history').insert({
          user_id: user.id,
          ticker: ticker.toUpperCase(),
          stock_name: stockName,
          sector: selectedSector !== 'all' ? selectedSector : null
        });
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSearch = async (isRefresh = false) => {
    const ticker = selectedStock?.ticker || searchQuery.trim();
    if (!ticker) {
      setError('Please select or enter a stock ticker');
      toast({
        title: 'Error',
        description: 'Please select or enter a stock ticker',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError('');
    if (!isRefresh) {
      setResponseData(null);
    }

    try {
      saveSearchToHistory(ticker, selectedStock?.name || null);

      const webhookUrl = ticker.toUpperCase() === 'KSE100' 
        ? 'https://n8n-maaz.duckdns.org/webhook/KSE-100'
        : 'https://n8n-maaz.duckdns.org/webhook/a1524f8c-3162-4c9d-b58c-b59cc01b0973';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResponseData(data);
      
      setIsDropdownOpen(false);
      setSuggestions([]);
      
      onTickerChange(ticker.toUpperCase());

      toast({
        title: 'Search Complete',
        description: `Data loaded for ${ticker.toUpperCase()}`,
      });
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch stock data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const extractAndProcessLinks = (content: string) => {
    return content.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, 
      '<LINK_START>$1|$2<LINK_END>'
    );
  };

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(<LINK_START>[^<]+<LINK_END>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<LINK_START>') && part.endsWith('<LINK_END>')) {
        const linkData = part.replace('<LINK_START>', '').replace('<LINK_END>', '');
        const [url, title] = linkData.split('|');
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {title}
          </a>
        );
      }
      return part;
    });
  };

  const parseHtmlContent = (htmlString: string): ParsedSections => {
    const sections: ParsedSections = {
      stockPrices: [],
      newsInsights: [],
      technicalAnalysis: [],
      fundamentalAnalysis: [],
      marketOverview: [],
      recommendation: [],
      newsLinks: [],
      conclusion: ''
    };

    const titleMatch = htmlString.match(/^([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)*[^<]*?)(?:<br><br>|$)/);
    if (titleMatch) {
      sections.stockPrices.push(titleMatch[1].replace(/<[^>]*>/g, ''));
    }

    const sectionPatterns = [
      { name: 'stockPrices', pattern: /A\.\s*<strong>📈\s*Market Snapshot<\/strong>(.*?)(?=B\.|$)/s },
      { name: 'newsInsights', pattern: /B\.\s*<strong>🔍\s*News Insights<\/strong>(.*?)(?=C\.|$)/s },
      { name: 'technicalAnalysis', pattern: /C\.\s*<strong>📊\s*Technical Analysis<\/strong>(.*?)(?=D\.|$)/s },
      { name: 'fundamentalAnalysis', pattern: /D\.\s*<strong>💡\s*Fundamental Analysis<\/strong>(.*?)(?=E\.|$)/s },
      { name: 'recommendation', pattern: /E\.\s*<strong>✅\s*Recommendation<\/strong>(.*?)(?=F\.|$)/s },
      { name: 'newsLinks', pattern: /F\.\s*<strong>🔗\s*Relevant Links<\/strong>(.*?)$/s }
    ];

    sectionPatterns.forEach(({ name, pattern }) => {
      const match = htmlString.match(pattern);
      if (match) {
        const content = match[1];
        
        if (name === 'stockPrices') {
          const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/<\/?strong>/g, '').replace(/^-\s*/, '').trim();
            if (cleanLine && (cleanLine.includes('KSE-100') || cleanLine.includes('🏦') || cleanLine.includes(':'))) {
              sections.stockPrices.push(cleanLine);
            }
          });
        }
        
        else if (name === 'newsInsights') {
          const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/<\/?strong>/g, '').replace(/^-\s*/, '').trim();
            if (cleanLine && cleanLine.length > 20) {
              const processedContent = extractAndProcessLinks(cleanLine);
              sections.newsInsights.push(processedContent);
            }
          });
        }
        else if (name === 'technicalAnalysis') {
          const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/<\/?strong>/g, '').replace(/^-\s*/, '').trim();
            if (cleanLine) {
              if (cleanLine.includes('Signal:')) {
                const signal = cleanLine.replace('Signal:', '').trim();
                sections.technicalAnalysis.push({ type: 'Overall Signal', signal });
              } else if (cleanLine.length > 10) {
                sections.technicalAnalysis.push({ type: 'Analysis', signal: cleanLine });
              }
            }
          });
        }
        
        else if (name === 'fundamentalAnalysis') {
          const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/<\/?strong>/g, '').replace(/^-\s*/, '').trim();
            if (cleanLine && cleanLine.length > 10) {
              sections.fundamentalAnalysis.push(cleanLine);
            }
          });
        }
        
        else if (name === 'recommendation') {
          const lines = content.split(/<br\s*\/?>/i).filter(line => line.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/<\/?strong>/g, '').replace(/^-\s*/, '').trim();
            if (cleanLine && cleanLine.length > 10) {
              sections.recommendation.push(cleanLine);
            }
          });
        }
        
        else if (name === 'newsLinks') {
          const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
          let linkMatch;
          while ((linkMatch = linkRegex.exec(content)) !== null) {
            sections.newsLinks.push({ title: linkMatch[2], url: linkMatch[1] });
          }
        }
      }
    });

    const conclusionMatch = htmlString.match(/F\.\s*<strong>🔗\s*Relevant Links<\/strong>.*?<br><br>(.*?)$/s);
    if (conclusionMatch) {
      const conclusionText = conclusionMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (conclusionText && conclusionText.length > 20) {
        sections.conclusion = conclusionText;
      }
    }

    return sections;
  };

  const getSignalColor = (signal: string) => {
    const lowerSignal = signal.toLowerCase();
    if (lowerSignal.includes('buy')) return 'text-green-500';
    if (lowerSignal.includes('sell')) return 'text-red-500';
    return 'text-yellow-500';
  };

  const renderFormattedData = (data: any) => {
    if (!data) return null;

    if (Array.isArray(data) && data.length > 0 && data[0].htmlBody) {
      const htmlContent = data[0].htmlBody;
      const sections = parseHtmlContent(htmlContent);

      return (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Market Snapshot */}
          {sections.stockPrices.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Market Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.stockPrices.map((item, index) => (
                    <p key={index} className="text-sm text-foreground/90">{item}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Insights */}
          {sections.newsInsights.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5 text-primary" />
                  News Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sections.newsInsights.map((item, index) => (
                    <p key={index} className="text-sm text-foreground/90">
                      {renderTextWithLinks(item)}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Analysis */}
          {sections.technicalAnalysis.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.technicalAnalysis.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {item.type}
                      </span>
                      <span className={`text-sm ${getSignalColor(item.signal)}`}>
                        {item.signal}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fundamental Analysis */}
          {sections.fundamentalAnalysis.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Fundamental Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.fundamentalAnalysis.map((item, index) => (
                    <p key={index} className="text-sm text-foreground/90">{item}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendation */}
          {sections.recommendation.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.recommendation.map((item, index) => (
                    <p key={index} className="text-sm font-medium text-foreground">{item}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Links */}
          {sections.newsLinks.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Relevant Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {sections.newsLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors p-2 rounded-lg hover:bg-primary/5"
                    >
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          {sections.conclusion && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground italic">{sections.conclusion}</p>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // Fallback for raw JSON data
    return (
      <Card className="mt-6 bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader>
          <CardTitle>Raw Response</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-96 p-4 bg-secondary/50 rounded-lg">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  const CurrentLoadingIcon = loadingMessages[loadingMessageIndex].icon;

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
          <SelectContent className="max-h-[300px] z-[100] bg-card border border-border">
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
          onClick={() => handleSearch()}
          className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          disabled={loading || (!selectedStock && !searchQuery.trim())}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && dropdownSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl shadow-primary/10 overflow-hidden z-[100] animate-fade-in"
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
      {selectedStock && !loading && !responseData && (
        <div className="flex items-center justify-center mt-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm text-muted-foreground">Selected:</span>
            <span className="font-semibold text-primary">{selectedStock.ticker}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-foreground">{selectedStock.name}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-r from-primary to-accent rounded-2xl">
              <CurrentLoadingIcon className="h-8 w-8 text-primary-foreground animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-foreground animate-pulse">
            {loadingMessages[loadingMessageIndex].text}
          </p>
          <p className="text-sm text-muted-foreground">
            Fetching data for {selectedStock?.ticker || searchQuery.toUpperCase()}...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleSearch(true)}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Results */}
      {responseData && !loading && renderFormattedData(responseData)}
    </div>
  );
};
