import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Loader2, RefreshCw, BarChart3, Newspaper, Zap, Database, Brain, Activity, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SECTORS, searchStocks, getStocksBySector, type Stock } from '@/data/stockData';

interface StockSearchProps {
  onTickerChange?: (ticker: string) => void;
}

const StockSearch = ({ onTickerChange }: StockSearchProps) => {
  
   // Function to extract and process links from content
   const extractAndProcessLinks = (content: string) => {
     // Replace HTML links with React-compatible format
     return content.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, 
       '<LINK_START>$1|$2<LINK_END>'
     );
   };

   // Function to render text with clickable links
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
   
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Get filtered suggestions based on search query and selected sector
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [sectorStocks, setSectorStocks] = useState<Stock[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Combined suggestions for dropdown
  const dropdownSuggestions = useMemo(() => {
    if (searchQuery.trim()) {
      return suggestions;
    } else if (selectedSector && selectedSector !== 'all' && sectorStocks.length > 0) {
      return sectorStocks.slice(0, 10);
    }
    return [];
  }, [suggestions, sectorStocks, searchQuery, selectedSector]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-search-container]')) {
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
        setSuggestions(results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSector]);

  // Fetch stocks for selected sector
  useEffect(() => {
    const fetchSectorStocks = async () => {
      if (!selectedSector || selectedSector === 'all') {
        setSectorStocks([]);
        return;
      }
      
      try {
        const results = await getStocksBySector(selectedSector);
        setSectorStocks(results);
      } catch (error) {
        console.error('Error fetching sector stocks:', error);
        setSectorStocks([]);
      }
    };

    fetchSectorStocks();
  }, [selectedSector]);

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

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setSearchQuery(stock.ticker); // Only show the ticker symbol
    setIsDropdownOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedStock(null); // Clear selected stock when manually typing
    setIsDropdownOpen(true);
  };

  const handleSearch = async (isRefresh = false) => {
    // Always use the ticker symbol, whether from selected stock or manual input
    const ticker = selectedStock?.ticker || searchQuery.trim();
    if (!ticker) {
      setError('Please select or enter a stock ticker');
      return;
    }

    setLoading(true);
    setError('');
    if (!isRefresh) {
      setResponseData(null);
    }

    try {
      // Use KSE-100 specific webhook for KSE100 ticker
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
      
      // Clear search state after successful response
      setIsDropdownOpen(false);
      setSuggestions([]);
      
      // Notify parent component about ticker change
      onTickerChange?.(ticker.toUpperCase());
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseHtmlContent = (htmlString: string) => {
    // Parse HTML more comprehensively to preserve formatting
    const cleanHtml = htmlString
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<p>/gi, '')
      .replace(/&nbsp;/g, ' ');

    const sections = {
      stockPrices: [],
      newsInsights: [],
      technicalAnalysis: [],
      fundamentalAnalysis: [],
      marketOverview: [],
      recommendation: [],
      newsLinks: [],
      conclusion: ''
    };

    // Extract title (first line before first <br><br>)
    const titleMatch = htmlString.match(/^([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)*[^<]*?)(?:<br><br>|$)/);
    if (titleMatch) {
      sections.stockPrices.push(titleMatch[1].replace(/<[^>]*>/g, ''));
    }

    // Split by main sections using regex patterns
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
          // Extract stock price lines
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
              // Process links in news insights
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

    // Extract conclusion paragraph after all sections
    const conclusionMatch = htmlString.match(/F\.\s*<strong>🔗\s*Relevant Links<\/strong>.*?<br><br>(.*?)$/s);
    if (conclusionMatch) {
      const conclusionText = conclusionMatch[1]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      if (conclusionText && conclusionText.length > 20) {
        sections.conclusion = conclusionText;
      }
    }

    return sections;
  };

  const renderFormattedData = (data: any) => {
    if (!data) return null;

    // Check if data is an array with HTML content
    if (Array.isArray(data) && data.length > 0 && data[0].htmlBody) {
      const htmlContent = data[0].htmlBody;
      const sections = parseHtmlContent(htmlContent);
      
      const getSignalColor = (signal: string) => {
        const lowerSignal = signal.toLowerCase();
        if (lowerSignal.includes('buy')) return 'text-green-500';
        if (lowerSignal.includes('sell')) return 'text-red-500';
        return 'text-yellow-500';
      };

      const getSignalIcon = (signal: string) => {
        const lowerSignal = signal.toLowerCase();
        if (lowerSignal.includes('buy')) return '📈';
        if (lowerSignal.includes('sell')) return '📉';
        return '➡️';
      };
      
      return (
        <div className="space-y-6">
          {/* Stock Prices */}
          {sections.stockPrices.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  📊 Stock Prices
                </h4>
                <div className="space-y-2">
                  {sections.stockPrices.map((price, index) => (
                    <p key={index} className="text-foreground font-mono text-lg">
                      {price}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Insights */}
          {sections.newsInsights.length > 0 && (
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🔍 News Insights
                </h4>
                <div className="space-y-2">
                  {sections.newsInsights.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      • {renderTextWithLinks(item)}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Analysis */}
          {sections.technicalAnalysis && sections.technicalAnalysis.length > 0 && (
            <Card className="bg-secondary/20 border-secondary">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  📊 Technical Analysis
                </h4>
                <div className="space-y-3">
                  {sections.technicalAnalysis.map((item, index) => (
                    <div key={index} className="bg-card p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">{item.type}</p>
                      <div className={`flex items-center gap-2 ${getSignalColor(item.signal)}`}>
                        <span className="text-lg">{getSignalIcon(item.signal)}</span>
                        <span className="font-semibold">{item.signal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fundamental Analysis */}
          {sections.fundamentalAnalysis && sections.fundamentalAnalysis.length > 0 && (
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  💡 Fundamental Analysis
                </h4>
                <div className="space-y-2">
                  {sections.fundamentalAnalysis.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      • {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deep Analysis Links */}
          {(selectedStock?.ticker || searchQuery.trim()) && (
            <Card className="bg-slate-500/10 border-slate-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🔗 Deep Analysis Links
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore detailed technical and financial analysis on these platforms:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://www.tradingview.com/symbols/PSX-${(selectedStock?.ticker || searchQuery.trim()).toUpperCase()}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      📊 TradingView Charts
                    </a>
                    <a
                      href={`https://sarmaaya.pk/psx/company/${(selectedStock?.ticker || searchQuery.trim()).toUpperCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 rounded-lg text-sm font-medium text-secondary-foreground hover:text-secondary-foreground/80 transition-colors"
                    >
                      📈 Sarmaaya Profile
                    </a>
                    <a
                      href={`https://stockanalysis.com/quote/psx/${(selectedStock?.ticker || searchQuery.trim()).toUpperCase()}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg text-sm font-medium text-accent-foreground hover:text-accent-foreground/80 transition-colors"
                    >
                      📊 Stock Analysis
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Market Overview */}
          {sections.marketOverview.length > 0 && (
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🌍 Market Overview
                </h4>
                 <div className="space-y-2">
                   {sections.marketOverview.map((item, index) => (
                     <p key={index} className="text-muted-foreground leading-relaxed">
                       • {renderTextWithLinks(item)}
                     </p>
                   ))}
                 </div>
              </CardContent>
            </Card>
          )}

          {/* Expert Recommendation */}
          {sections.recommendation.length > 0 && (
            <Card className="bg-emerald-500/10 border-emerald-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  ✅ Expert Recommendation
                </h4>
                <div className="space-y-2">
                  {sections.recommendation.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      • {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Links */}
          {sections.newsLinks.length > 0 && (
            <Card className="bg-slate-500/10 border-slate-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🔗 Relevant News Articles
                </h4>
                <div className="space-y-2">
                  {sections.newsLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline transition-colors"
                      >
                        {link.title}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          {sections.conclusion && (
            <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-4">
              <p className="text-muted-foreground leading-relaxed italic text-center">
                {sections.conclusion}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Handle other data formats (arrays, simple objects)
    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <Card key={index} className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card border">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Sector Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Sector
              </label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-60 overflow-y-auto z-[9999]">
                  <SelectItem value="all">All sectors</SelectItem>
                  {SECTORS.filter(sector => sector && sector.trim()).map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Search */}
            <div className="space-y-2 relative" data-search-container>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search by Ticker or Company Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter ticker symbol (e.g., KSE100, AGTL) or company name..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={(e) => {
                    // Only close if not clicking within dropdown
                    setTimeout(() => {
                      if (!e.relatedTarget?.closest('[data-suggestions-dropdown]')) {
                        setIsDropdownOpen(false);
                      }
                    }, 150);
                  }}
                  className="w-full"
                />

                {/* Suggestions Dropdown */}
                {isDropdownOpen && (searchQuery.trim() || (!searchQuery.trim() && selectedSector !== 'all')) && dropdownSuggestions.length > 0 && (
                  <div 
                    data-suggestions-dropdown
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-2xl z-[9999] max-h-80 overflow-y-auto backdrop-blur-none"
                    style={{ backgroundColor: 'hsl(var(--card))' }}
                  >
                    {loadingSuggestions ? (
                      <div className="p-3 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Searching...
                        </div>
                      </div>
                    ) : searchQuery.trim() ? (
                      suggestions.length > 0 ? (
                        <>
                          {/* Results header - not selectable */}
                          <div className="p-2 bg-muted border-b border-border text-sm text-foreground font-medium">
                            📊 {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
                          </div>
                          {/* Actual stock options */}
                          {suggestions.map((stock, index) => (
                            <div
                              key={`suggestion-${stock.ticker}-${index}`}
                              className="p-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-b-0 select-none transition-all duration-200 bg-card"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                console.log('Selecting stock:', stock.ticker, 'Index:', index);
                                handleStockSelect(stock);
                              }}
                            >
                              <div className="flex justify-between items-start pointer-events-none">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-foreground text-base">{stock.ticker}</div>
                                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                  {stock.sector}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="p-3 text-muted-foreground text-center">
                          No stocks found matching "{searchQuery}"
                          {selectedSector && ` in ${selectedSector}`}
                        </div>
                      )
                    ) : (
                      sectorStocks.length > 0 && (
                        <>
                          {/* Results header for sector stocks - not selectable */}
                          <div className="p-2 bg-muted border-b border-border text-sm text-foreground font-medium">
                            📁 {sectorStocks.length} stock{sectorStocks.length !== 1 ? 's' : ''} in sector
                          </div>
                          {/* Actual sector stock options */}
                          {sectorStocks.map((stock, index) => (
                            <div
                              key={`sector-${stock.ticker}-${index}`}
                              className="p-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-b-0 select-none transition-all duration-200 bg-card"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                console.log('Selecting sector stock:', stock.ticker, 'Index:', index);
                                handleStockSelect(stock);
                              }}
                            >
                              <div className="flex justify-between items-start pointer-events-none">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-foreground text-base">{stock.ticker}</div>
                                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                  {stock.sector}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Stock Display */}
            {selectedStock && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{selectedStock.ticker}</div>
                    <div className="text-sm text-muted-foreground">{selectedStock.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                    {selectedStock.sector}
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Search Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => handleSearch(false)}
                disabled={loading || (!selectedStock && !searchQuery.trim())}
                className="flex items-center gap-2 flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="transition-all duration-300">
                      {loadingMessages[loadingMessageIndex]?.text || "Loading..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Stock
                  </>
                )}
              </Button>
              
              {responseData && (
                <Button
                  variant="outline"
                  onClick={() => handleSearch(true)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Display */}
      {responseData && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Data Response</h3>
            {renderFormattedData(responseData)}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 bg-card/95 border border-border/50">
            <CardContent className="p-8">
              {/* Loading Icons */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-red-500 animate-pulse">
                  <Newspaper className="h-8 w-8" />
                </div>
                <div className="text-blue-500 animate-pulse" style={{animationDelay: '0.1s'}}>
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div className="text-yellow-500 animate-pulse" style={{animationDelay: '0.2s'}}>
                  <Zap className="h-8 w-8" />
                </div>
              </div>

              {/* Loading Message */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  {React.createElement(loadingMessages[loadingMessageIndex].icon, { 
                    className: "h-5 w-5 text-primary animate-spin" 
                  })}
                  {loadingMessages[loadingMessageIndex].text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  This may take a minute or two
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary/20 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full animate-pulse" 
                     style={{ width: '60%' }}></div>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockSearch;