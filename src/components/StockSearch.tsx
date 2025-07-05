
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
    // Split by <br> tags and handle links
    const parts = htmlString.split('<br>').filter(part => part.trim());
    
    return parts.map(part => {
      const trimmedPart = part.trim();
      if (!trimmedPart) return null;
      
      // Check if this part contains links
      if (trimmedPart.includes('<a href=')) {
        return {
          type: 'html',
          content: trimmedPart
        };
      } else {
        return {
          type: 'text',
          content: trimmedPart
        };
      }
    }).filter(Boolean);
  };

  const renderFormattedData = (data: any) => {
    if (!data) return null;

    // Check if data is an array with HTML content
    if (Array.isArray(data) && data.length > 0 && data[0].htmlBody) {
      const htmlContent = data[0].htmlBody;
      const parsedElements = parseHtmlContent(htmlContent);
      
      return (
        <div className="space-y-4">
          <div className="bg-secondary/30 p-6 rounded-lg">
            <div className="space-y-3">
              {parsedElements.map((element, index) => {
                if (element.type === 'html') {
                  // Handle HTML content with links
                  return (
                    <div 
                      key={index} 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: element.content }}
                    />
                  );
                } else if (element.type === 'text') {
                  // Handle plain text content
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {element.content}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
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
