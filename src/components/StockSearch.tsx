
import React, { useState } from 'react';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
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

const StockSearch = () => {
  const [selectedStock, setSelectedStock] = useState('');
  const [customStock, setCustomStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<any>(null);

  const popularStocks = [
    'KSE100', 'MEBL', 'ILP', 'HBL', 'ENGRO', 'LUCK', 'UBL', 'PSO', 
    'OGDC', 'PPL', 'MARI', 'SNGP', 'SSGC', 'BAFL', 'DAWH', 'FCCL', 'HUBC'
  ];

  const handleSearch = async () => {
    const ticker = selectedStock || customStock;
    if (!ticker.trim()) {
      setError('Please select or enter a stock ticker');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook/a1524f8c-3162-4c9d-b58c-b59cc01b0973', {
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
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseHtmlContent = (htmlString: string) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    const elements = [];
    const children = tempDiv.children;
    
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (element.tagName.match(/^H[1-6]$/)) {
        elements.push({
          type: 'heading',
          level: parseInt(element.tagName.charAt(1)),
          content: element.textContent || ''
        });
      } else if (element.tagName === 'P' || element.tagName === 'DIV') {
        const textContent = element.textContent || '';
        if (textContent.trim()) {
          elements.push({
            type: 'paragraph',
            content: textContent
          });
        }
      } else if (element.tagName === 'BR') {
        elements.push({
          type: 'break'
        });
      } else {
        // For other elements, extract text content
        const textContent = element.textContent || '';
        if (textContent.trim()) {
          elements.push({
            type: 'paragraph',
            content: textContent
          });
        }
      }
    }
    
    return elements;
  };

  const renderFormattedData = (data: any) => {
    if (!data) return null;

    // Check if data is an array with HTML content
    if (Array.isArray(data) && data.length > 0 && data[0].htmlBody) {
      const htmlContent = data[0].htmlBody;
      const parsedElements = parseHtmlContent(htmlContent);
      
      return (
        <div className="space-y-4">
          <div className="bg-slate-700/30 p-6 rounded-lg">
            <div className="space-y-4">
              {parsedElements.map((element, index) => {
                if (element.type === 'heading') {
                  const HeadingTag = `h${element.level}` as keyof JSX.IntrinsicElements;
                  const headingClasses = {
                    1: 'text-2xl font-bold text-white mb-4',
                    2: 'text-xl font-semibold text-white mb-3',
                    3: 'text-lg font-semibold text-white mb-2',
                    4: 'text-base font-semibold text-white mb-2',
                    5: 'text-sm font-semibold text-white mb-1',
                    6: 'text-sm font-semibold text-white mb-1'
                  };
                  
                  return (
                    <HeadingTag 
                      key={index} 
                      className={headingClasses[element.level as keyof typeof headingClasses]}
                    >
                      {element.content}
                    </HeadingTag>
                  );
                } else if (element.type === 'paragraph') {
                  return (
                    <p key={index} className="text-slate-200 leading-relaxed mb-3">
                      {element.content}
                    </p>
                  );
                } else if (element.type === 'break') {
                  return <br key={index} />;
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
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Response Data:</h4>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={selectedStock} onValueChange={(value) => {
                setSelectedStock(value);
                setCustomStock('');
              }}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a stock ticker" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {popularStocks.map((stock) => (
                    <SelectItem key={stock} value={stock} className="text-white hover:bg-slate-600">
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
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <p className="text-sm text-slate-400 mt-2">
            Enter the stock (MEBL, ILP etc) or KSE100 for market data
          </p>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <div className="text-center">
                <p className="text-white font-medium">Processing your request...</p>
                <p className="text-slate-400 text-sm">This may take a minute or two</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-900/20 border-red-600">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Response Data Display */}
      {responseData && !loading && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Market Data Response</h3>
            {renderFormattedData(responseData)}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
