import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface HoldingData {
  ticker: string;
  stockName: string | null;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number | null;
}

interface PortfolioChartsProps {
  holdings: HoldingData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(210, 70%, 50%)',
  'hsl(150, 60%, 45%)',
  'hsl(280, 60%, 55%)',
  'hsl(30, 80%, 55%)',
  'hsl(350, 70%, 50%)',
  'hsl(180, 50%, 45%)',
];

export const PortfolioCharts = ({ holdings }: PortfolioChartsProps) => {
  if (holdings.length === 0) return null;

  // Allocation pie chart data
  const allocationData = holdings.map((h, index) => ({
    name: h.ticker,
    value: h.currentPrice ? h.shares * h.currentPrice : h.shares * h.avgBuyPrice,
    color: COLORS[index % COLORS.length],
  }));

  // P&L bar chart data
  const pnlData = holdings
    .filter(h => h.currentPrice !== null)
    .map((h) => {
      const costBasis = h.shares * h.avgBuyPrice;
      const currentValue = h.shares * (h.currentPrice || h.avgBuyPrice);
      const pnl = currentValue - costBasis;
      return {
        name: h.ticker,
        pnl: parseFloat(pnl.toFixed(2)),
        fill: pnl >= 0 ? 'hsl(150, 60%, 45%)' : 'hsl(0, 70%, 50%)',
      };
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Allocation Pie Chart */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Portfolio Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Value']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* P&L Bar Chart */}
      {pnlData.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Profit/Loss by Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pnlData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toLocaleString()}`} />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`PKR ${value >= 0 ? '+' : ''}${value.toLocaleString()}`, 'P&L']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                    {pnlData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
