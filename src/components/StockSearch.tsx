
import React, { useState } from 'react';
import { Search, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
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

interface StockSearchProps {
  onTickerChange?: (ticker: string) => void;
}

const StockSearch = ({ onTickerChange }: StockSearchProps) => {
  const [selectedStock, setSelectedStock] = useState('');
  const [customStock, setCustomStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<any>(null);

  const popularStocks = [
    'KSE100', 'MEBL', 'ILP', 'HBL', 'ENGRO', 'LUCK', 'UBL', 'PSO', 
    'OGDC', 'PPL', 'MARI', 'SNGP', 'SSGC', 'BAFL', 'DAWH', 'FCCL', 'HUBC'
  ];

  const handleSearch = async (isRefresh = false) => {
    const ticker = selectedStock || customStock;
    if (!ticker.trim()) {
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
    const content = htmlString.replace(/<br>/g, '\n');
    const sections = {
      stockPrices: [],
      technicalAnalysis: null,
      chartLink: null,
      marketOverview: [],
      industryHighlights: [],
      stockSpecific: [],
      expertRecommendation: [],
      newsLinks: []
    };

    const lines = content.split('\n').filter(line => line.trim());
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Stock prices (lines with 📈)
      if (line.includes('📈')) {
        sections.stockPrices.push(line);
      }
      // Section headers
      else if (line.includes('Technical Analysis:')) {
        currentSection = 'technical';
      }
      else if (line.includes('Chart Link:')) {
        currentSection = 'chart';
      }
      else if (line.includes('Market Overview:')) {
        currentSection = 'market';
      }
      else if (line.includes('Industry Highlights')) {
        currentSection = 'industry';
      }
      else if (line.includes('Stock-Specific Mentions:')) {
        currentSection = 'stock';
      }
      else if (line.includes('Expert Recommendation:')) {
        currentSection = 'expert';
      }
      else if (line.includes('Relevant News Links:')) {
        currentSection = 'news';
      }
      // Content based on current section
      else if (line && !line.includes('News Insights:')) {
        switch (currentSection) {
          case 'technical':
            if (line.includes('Overall Signal:') || line.includes('Moving Average:') || line.includes('Oscillators:')) {
              const signal = line.split(':')[1]?.trim();
              const type = line.split(':')[0]?.trim();
              if (!sections.technicalAnalysis) sections.technicalAnalysis = [];
              sections.technicalAnalysis.push({ type, signal });
            }
            break;
          case 'chart':
            if (line.includes('<a href=')) {
              sections.chartLink = line;
            }
            break;
          case 'market':
            if (line.startsWith('-')) {
              sections.marketOverview.push(line.substring(1).trim());
            }
            break;
          case 'industry':
            if (line.startsWith('-')) {
              sections.industryHighlights.push(line.substring(1).trim());
            }
            break;
          case 'stock':
            if (line.startsWith('-')) {
              sections.stockSpecific.push(line.substring(1).trim());
            }
            break;
          case 'expert':
            if (!line.includes('Relevant News Links:')) {
              sections.expertRecommendation.push(line);
            }
            break;
          case 'news':
            if (line.startsWith('-') && line.includes('http')) {
              sections.newsLinks.push(line.substring(1).trim());
            }
            break;
        }
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

          {/* Technical Analysis */}
          {sections.technicalAnalysis && sections.technicalAnalysis.length > 0 && (
            <Card className="bg-secondary/20 border-secondary">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  📊 Technical Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Chart Link */}
          {sections.chartLink && (
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  📈 Chart
                </h4>
                <div 
                  className="text-accent hover:text-accent/80 underline"
                  dangerouslySetInnerHTML={{ __html: sections.chartLink }}
                />
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
                      • {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Industry Highlights */}
          {sections.industryHighlights.length > 0 && (
            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🏭 Industry Highlights
                </h4>
                <div className="space-y-2">
                  {sections.industryHighlights.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      • {item}
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
                      • {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expert Recommendation */}
          {sections.expertRecommendation.length > 0 && (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  💡 Expert Recommendation
                </h4>
                <div className="space-y-2">
                  {sections.expertRecommendation.map((item, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Links */}
          {sections.newsLinks.length > 0 && (
            <Card className="bg-cyan-500/10 border-cyan-500/20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  📰 Relevant News Links
                </h4>
                <div className="space-y-3">
                  {sections.newsLinks.map((link, index) => {
                    const parts = link.split(': ');
                    const title = parts[0];
                    const url = parts[1];
                    return (
                      <div key={index} className="border-l-2 border-cyan-500/30 pl-3">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                        >
                          {title}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // Fallback to original JSON display
    return (
      <div className="space-y-4">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h4 className="text-foreground font-semibold mb-3">Response Data:</h4>
          <pre className="text-muted-foreground text-sm whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={selectedStock} onValueChange={(value) => {
                setSelectedStock(value);
                setCustomStock('');
              }}>
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue placeholder="Select a stock ticker" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {popularStocks.map((stock) => (
                    <SelectItem key={stock} value={stock} className="text-foreground hover:bg-secondary">
                      {stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Input
                placeholder="Or enter custom ticker (MEBL, ILP, etc)"
                value={customStock}
                onChange={(e) => {
                  setCustomStock(e.target.value);
                  setSelectedStock('');
                }}
                className="bg-card border-border text-foreground placeholder-muted-foreground"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleSearch()}
                disabled={loading}
                variant="default"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              
              {responseData && (
                <Button 
                  onClick={() => handleSearch(true)}
                  disabled={loading}
                  variant="secondary"
                  size="icon"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Enter the stock (MEBL, ILP etc) or KSE100 for market data
          </p>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-foreground font-medium">Processing your request...</p>
                <p className="text-muted-foreground text-sm">This may take a minute or two</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-destructive/20 border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Response Data Display */}
      {responseData && !loading && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Data Response</h3>
            {renderFormattedData(responseData)}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;

// Note: StockSearch component is now 290 lines long. Consider refactoring into smaller components.
