import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PortfolioHistoryChartProps {
  portfolioId: string;
  currentValue: number;
  currentCost: number;
  currentPnl: number;
  currentPnlPercent: number;
  holdingsSnapshot: Array<{
    ticker: string;
    shares: number;
    avgBuyPrice: number;
    currentPrice: number | null;
  }>;
}

interface HistoryEntry {
  snapshot_date: string;
  total_value: number;
  total_cost: number;
  total_pnl: number;
  pnl_percentage: number;
}

export const PortfolioHistoryChart = ({
  portfolioId,
  currentValue,
  currentCost,
  currentPnl,
  currentPnlPercent,
  holdingsSnapshot,
}: PortfolioHistoryChartProps) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [portfolioId]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('portfolio_history')
      .select('snapshot_date, total_value, total_cost, total_pnl, pnl_percentage')
      .eq('portfolio_id', portfolioId)
      .order('snapshot_date', { ascending: true })
      .limit(90); // Last 90 days

    if (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
      return;
    }

    setHistory(data || []);
    setLoading(false);
  };

  const saveSnapshot = async () => {
    if (currentValue === 0) {
      toast({
        title: 'Cannot save snapshot',
        description: 'Add holdings and fetch prices first.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('portfolio_history')
      .upsert({
        portfolio_id: portfolioId,
        snapshot_date: today,
        total_value: currentValue,
        total_cost: currentCost,
        total_pnl: currentPnl,
        pnl_percentage: currentPnlPercent,
        holdings_snapshot: holdingsSnapshot,
      }, {
        onConflict: 'portfolio_id,snapshot_date',
      });

    setSaving(false);

    if (error) {
      console.error('Error saving snapshot:', error);
      toast({
        title: 'Error',
        description: 'Failed to save portfolio snapshot.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Snapshot Saved',
      description: `Portfolio value of PKR ${currentValue.toLocaleString()} saved for ${today}`,
    });

    fetchHistory();
  };

  const chartData = history.map((h) => ({
    date: format(new Date(h.snapshot_date), 'MMM dd'),
    fullDate: h.snapshot_date,
    value: h.total_value,
    pnl: h.total_pnl,
    pnlPercent: h.pnl_percentage,
  }));

  const minValue = chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) * 0.95 : 0;
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) * 1.05 : 100;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Portfolio Performance History
          </CardTitle>
          <CardDescription>Track your portfolio value over time</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={saveSnapshot}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Today's Snapshot
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Calendar className="h-10 w-10 opacity-50" />
            <p className="text-sm">No history yet. Save your first snapshot!</p>
            <p className="text-xs">Click "Save Today's Snapshot" to start tracking.</p>
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[minValue, maxValue]}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'value') return [`PKR ${value.toLocaleString()}`, 'Value'];
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div>
                          <div>{data.fullDate}</div>
                          <div className={data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            P&L: {data.pnl >= 0 ? '+' : ''}{data.pnl.toLocaleString()} ({data.pnlPercent.toFixed(2)}%)
                          </div>
                        </div>
                      );
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#valueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t border-border/50 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">First Record</p>
              <p className="font-medium">PKR {chartData[0].value.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Latest</p>
              <p className="font-medium">PKR {chartData[chartData.length - 1].value.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Change</p>
              {(() => {
                const change = chartData[chartData.length - 1].value - chartData[0].value;
                const changePercent = (change / chartData[0].value) * 100;
                return (
                  <p className={`font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                  </p>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
