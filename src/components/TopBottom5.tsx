import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Activity, BarChart3, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top & Bottom Performers
        </h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Gainers */}
        <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              Top 5 Gainers
              <Award className="h-4 w-4 text-green-500 ml-auto" />
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
                  <TableRow key={index} className="hover:bg-green-500/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-green-500/10">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold flex items-center gap-1">
                            {stock.symbol}
                            {index === 0 && <Award className="h-3 w-3 text-yellow-500" />}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      PKR {formatNumber(stock.close)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-500 font-medium">
                        +{stock.change_percent}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {stock.volume}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bottom 5 Losers */}
        <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
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
                  <TableRow key={index} className="hover:bg-red-500/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-red-500/10">
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      PKR {formatNumber(stock.close)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-500 font-medium">
                        {stock.change_percent}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {stock.volume}
                      </div>
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
