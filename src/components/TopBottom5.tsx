import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchTopBottom5, TopBottomStock } from '@/services/topBottomService';

interface TopBottom5Props {
  refreshTrigger?: number;
}

const TopBottom5 = ({ refreshTrigger }: TopBottom5Props) => {
  const [stocks, setStocks] = useState<TopBottomStock[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTopBottom5();
      console.log('Top/Bottom 5 data received:', data);
      setStocks(data);
    } catch (error) {
      console.error('Failed to load top/bottom 5 data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const formatNumber = (numStr: string) => {
    return numStr.replace(/,/g, '');
  };

  const isPositive = (changePercent: string) => {
    return !changePercent.startsWith('-');
  };

  // Split data into top 5 and bottom 5
  const top5 = stocks.slice(0, 5);
  const bottom5 = stocks.slice(5, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Top & Bottom Performers</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Gainers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top 5 Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top5.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {stock.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      PKR {formatNumber(stock.close)}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-500 font-medium">
                        +{stock.change_percent}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stock.volume}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bottom 5 Losers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Bottom 5 Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottom5.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {stock.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      PKR {formatNumber(stock.close)}
                    </TableCell>
                    <TableCell>
                      <span className="text-red-500 font-medium">
                        {stock.change_percent}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stock.volume}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopBottom5;
