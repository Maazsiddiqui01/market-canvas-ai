
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
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook-test/a1524f8c-3162-4c9d-b58c-b59cc01b0973', {
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

  const renderFormattedData = (data: any) => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        {/* Display raw JSON data in a formatted way */}
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Response Data:</h4>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {/* Try to extract and display specific data if available */}
        {data.kse100 && (
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              KSE-100 Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.kse100.price && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Price</p>
                  <p className="text-white font-semibold">PKR {data.kse100.price}</p>
                </div>
              )}
              {data.kse100.change && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Change</p>
                  <p className={`font-semibold ${data.kse100.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.kse100.change >= 0 ? '+' : ''}{data.kse100.change}%
                  </p>
                </div>
              )}
              {data.kse100.volume && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Volume</p>
                  <p className="text-white font-semibold">{data.kse100.volume.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display individual stock data if available */}
        {data.stockData && (
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Stock Data: {data.stockData.symbol || selectedStock || customStock}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.stockData.price && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Price</p>
                  <p className="text-white font-semibold">PKR {data.stockData.price}</p>
                </div>
              )}
              {data.stockData.change && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Change</p>
                  <p className={`font-semibold ${data.stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.stockData.change >= 0 ? '+' : ''}{data.stockData.change}%
                  </p>
                </div>
              )}
              {data.stockData.volume && (
                <div className="bg-slate-600/30 p-3 rounded">
                  <p className="text-slate-400 text-sm">Volume</p>
                  <p className="text-white font-semibold">{data.stockData.volume.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
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
