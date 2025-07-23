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
    const content = htmlString.replace(/<br\s*\/?>/g, '\n').replace(/<\/?strong>/g, '').replace(/<\/?br>/g, '\n');
    const sections = {
      stockPrices: [],
      technicalAnalysis: [],
      fundamentalAnalysis: [],
      marketOverview: [],
      industryHighlights: [],
      stockSpecific: [],
      expertRecommendation: [],
      newsLinks: []
    };

    // Split by main sections A, B, C, D, E, F
    const mainSections = content.split(/[A-F]\.\s*/).filter(section => section.trim());

    mainSections.forEach((section, index) => {
      const sectionContent = section.trim();
      
      // A. Market Snapshot - Stock Prices
      if (index === 0 || sectionContent.includes('Market Snapshot') || sectionContent.includes('📈')) {
        const lines = sectionContent.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const cleanLine = line.replace(/^-\s*/, '').trim();
          if (cleanLine && (cleanLine.includes('KSE-100') || cleanLine.includes('🏭') || cleanLine.includes(':'))) {
            sections.stockPrices.push(cleanLine);
          }
        });
      }
      
      // B. News Insights
      else if (index === 1 || sectionContent.includes('News Insights') || sectionContent.includes('🔍')) {
        const lines = sectionContent.split('\n').filter(line => line.trim());
        let currentCategory = '';
        
        lines.forEach(line => {
          const cleanLine = line.replace(/^-\s*/, '').trim();
          
           if (cleanLine.includes('Market Overview:')) {
            currentCategory = 'overview';
            const overview = cleanLine.replace('Market Overview:', '').trim();
            if (overview) sections.marketOverview.push(overview);
          }
          else if (cleanLine.includes('Sector Highlights') || cleanLine.includes('Industry Highlights')) {
            currentCategory = 'industry';
          }
          else if (cleanLine.includes('Stock-Specific Mentions')) {
            currentCategory = 'specific';
          }
          else if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
            const bulletContent = cleanLine.replace(/^[-•]\s*/, '').trim();
            if (bulletContent && bulletContent.length > 10) {
               // Check for and extract links from content
               const processedContent = extractAndProcessLinks(bulletContent);
              
              if (currentCategory === 'industry') {
                sections.industryHighlights.push(processedContent);
              } else if (currentCategory === 'specific') {
                sections.stockSpecific.push(processedContent);
              } else if (currentCategory === 'overview') {
                sections.marketOverview.push(processedContent);
              }
            }
          }
          else if (cleanLine.length > 20 && !cleanLine.includes('News Insights')) {
             // Check for and extract links from content
             const processedContent = extractAndProcessLinks(cleanLine);
            
            if (currentCategory === 'overview') {
              sections.marketOverview.push(processedContent);
            } else if (currentCategory === 'industry') {
              sections.industryHighlights.push(processedContent);
            } else if (currentCategory === 'specific') {
              sections.stockSpecific.push(processedContent);
            }
          }
        });
      }
      
      // C. Technical Analysis
      else if (index === 2 || sectionContent.includes('Technical Analysis') || sectionContent.includes('📊')) {
        const lines = sectionContent.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const cleanLine = line.replace(/^-\s*/, '').trim();
          if (cleanLine && !cleanLine.includes('Technical Analysis')) {
            if (cleanLine.includes('Signal:')) {
              const signal = cleanLine.replace('Signal:', '').trim();
              sections.technicalAnalysis.push({ type: 'Overall Signal', signal });
            } else if (cleanLine.length > 10) {
              sections.technicalAnalysis.push({ type: 'Analysis', signal: cleanLine });
            }
          }
        });
      }
      
      // D. Fundamental Analysis
      else if (index === 3 || sectionContent.includes('Fundamental Analysis') || sectionContent.includes('💡')) {
        const lines = sectionContent.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const cleanLine = line.replace(/^-\s*/, '').trim();
          if (cleanLine && !cleanLine.includes('Fundamental Analysis') && cleanLine.length > 10) {
            sections.fundamentalAnalysis.push(cleanLine);
          }
        });
      }
      
      // E. Recommendation
      else if (index === 4 || sectionContent.includes('Recommendation') || sectionContent.includes('✅')) {
        const lines = sectionContent.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const cleanLine = line.replace(/^-\s*/, '').trim();
          if (cleanLine && !cleanLine.includes('Recommendation') && cleanLine.length > 10) {
            sections.expertRecommendation.push(cleanLine);
          }
        });
      }
      
      // F. Relevant Links
      else if (index === 5 || sectionContent.includes('Relevant Links') || sectionContent.includes('🔗')) {
        const links = sectionContent.match(/<a href="([^"]+)">([^<]+)<\/a>/g);
        if (links) {
          links.forEach(link => {
            const hrefMatch = link.match(/href="([^"]+)"/);
            const textMatch = link.match(/>([^<]+)</);
            if (hrefMatch && textMatch) {
              sections.newsLinks.push({ title: textMatch[1], url: hrefMatch[1] });
            }
          });
        }
      }
    });

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

           {/* Sector Highlights */}
           {sections.industryHighlights.length > 0 && (
             <Card className="bg-purple-500/10 border-purple-500/20">
               <CardContent className="p-4">
                 <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                   🏭 Sector Highlights
                 </h4>
                 <div className="space-y-2">
                   {sections.industryHighlights.map((item, index) => (
                     <p key={index} className="text-muted-foreground leading-relaxed">
                       • {renderTextWithLinks(item)}
                     </p>
                   ))}
                 </div>
              </CardContent>
            </Card>
          )}

          {/* Stock-Specific Mentions */}
          {sections.stockSpecific.length > 0 && (
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🎯 Stock-Specific Mentions
                </h4>
                <div className="space-y-2">
                  {sections.stockSpecific.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      • {renderTextWithLinks(item)}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expert Recommendation */}
          {sections.expertRecommendation.length > 0 && (
            <Card className="bg-emerald-500/10 border-emerald-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  ✅ Expert Recommendation
                </h4>
                <div className="space-y-2">
                  {sections.expertRecommendation.map((item, index) => (
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
                    className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-xl z-[9999] max-h-80 overflow-y-auto"
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
                          <div className="p-2 bg-secondary/20 border-b border-border text-sm text-muted-foreground font-medium">
                            {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
                          </div>
                          {/* Actual stock options */}
                          {suggestions.map((stock, index) => (
                            <div
                              key={`suggestion-${stock.ticker}-${index}`}
                              className="p-3 hover:bg-secondary/50 cursor-pointer border-b border-border/50 last:border-b-0 select-none transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                console.log('Selecting stock:', stock.ticker, 'Index:', index);
                                handleStockSelect(stock);
                              }}
                            >
                              <div className="flex justify-between items-start pointer-events-none">
                                <div>
                                  <div className="font-semibold text-foreground">{stock.ticker}</div>
                                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                                </div>
                                <div className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
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
                          <div className="p-2 bg-secondary/20 border-b border-border text-sm text-muted-foreground font-medium">
                            {sectorStocks.length} result{sectorStocks.length !== 1 ? 's' : ''} found
                          </div>
                          {/* Actual sector stock options */}
                          {sectorStocks.map((stock, index) => (
                            <div
                              key={`sector-${stock.ticker}-${index}`}
                              className="p-3 hover:bg-secondary/50 cursor-pointer border-b border-border/50 last:border-b-0 select-none transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                console.log('Selecting sector stock:', stock.ticker, 'Index:', index);
                                handleStockSelect(stock);
                              }}
                            >
                              <div className="flex justify-between items-start pointer-events-none">
                                <div>
                                  <div className="font-semibold text-foreground">{stock.ticker}</div>
                                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                                </div>
                                <div className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
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
    </div>
  );
};

export default StockSearch;