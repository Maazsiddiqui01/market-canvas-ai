
import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
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

interface StockData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

const StockSearch = () => {
  const [selectedStock, setSelectedStock] = useState('');
  const [customStock, setCustomStock] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setStockData(null);

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
      
      // Handle the response data properly
      if (data && typeof data === 'object') {
        // Extract stock data from the response
        // Adjust this based on your actual response structure
        setStockData({
          symbol: ticker.toUpperCase(),
          price: data.price || 0,
          change: data.change || 0,
          volume: data.volume || 0
        });
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

      {error && (
        <Card className="bg-red-900/20 border-red-600">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {stockData && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">{stockData.symbol}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Price</p>
                <p className="text-white font-semibold">PKR {stockData.price.toFixed(2)}</p>
              </div>
              
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Change</p>
                <p className={`font-semibold ${stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
                </p>
              </div>
              
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm">Volume</p>
                <p className="text-white font-semibold">{stockData.volume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
