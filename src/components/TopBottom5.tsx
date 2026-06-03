import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Activity, BarChart3, Award, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
      setStocks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const formatNumber = (numStr: string) => numStr.replace(/,/g, '');
  const top5 = stocks.slice(0, 5);
  const bottom5 = stocks.slice(5, 10);

  const renderRows = (list: TopBottomStock[], positive: boolean) =>
    list.map((stock, index) => (
      <TableRow key={index} className={positive ? 'hover:bg-up/5 transition-colors' : 'hover:bg-down/5 transition-colors'}>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${positive ? 'bg-up/10' : 'bg-down/10'}`}>
              {positive ? <TrendingUp className="h-3 w-3 text-up" /> : <TrendingDown className="h-3 w-3 text-down" />}
            </div>
            <div>
              <p className="font-semibold flex items-center gap-1">
                {stock.symbol}
                {positive && index === 0 && <Award className="h-3 w-3 text-warning" />}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="font-medium">PKR {formatNumber(stock.close)}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={positive ? 'border-up/30 bg-up/10 text-up font-medium' : 'border-down/30 bg-down/10 text-down font-medium'}
          >
            {positive ? '+' : ''}{stock.change_percent}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {stock.volume}
          </div>
        </TableCell>
      </TableRow>
    ));

  const card = (title: string, icon: React.ReactNode, positive: boolean, list: TopBottomStock[]) => (
    <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <div className={`p-2 rounded-lg ${positive ? 'bg-up/10' : 'bg-down/10'}`}>{icon}</div>
          {title}
          {positive && <Award className="h-4 w-4 text-up ml-auto" />}
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
          <TableBody>{renderRows(list, positive)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top &amp; Bottom Performers
        </h2>
        {stocks.length > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
        )}
      </div>

      {loading && stocks.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((c) => (
            <Card key={c} className="bg-card/50 border-border">
              <CardContent className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stocks.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Couldn't load top movers right now.</p>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {card('Top 5 Gainers', <TrendingUp className="h-5 w-5 text-up" />, true, top5)}
          {card('Bottom 5 Losers', <TrendingDown className="h-5 w-5 text-down" />, false, bottom5)}
        </div>
      )}
    </div>
  );
};

export default TopBottom5;
