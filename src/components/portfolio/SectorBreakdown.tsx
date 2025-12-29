import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';

interface HoldingData {
  ticker: string;
  stockName: string | null;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number | null;
  sector?: string;
}

interface SectorBreakdownProps {
  holdings: HoldingData[];
  stockSectors: Record<string, string>;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

export const SectorBreakdown = ({ holdings, stockSectors }: SectorBreakdownProps) => {
  const sectorData = useMemo(() => {
    const sectorMap: Record<string, { value: number; cost: number; holdings: number }> = {};

    holdings.forEach(h => {
      const sector = stockSectors[h.ticker] || 'Unknown';
      const price = h.currentPrice ?? h.avgBuyPrice;
      const value = h.shares * price;
      const cost = h.shares * h.avgBuyPrice;

      if (!sectorMap[sector]) {
        sectorMap[sector] = { value: 0, cost: 0, holdings: 0 };
      }
      sectorMap[sector].value += value;
      sectorMap[sector].cost += cost;
      sectorMap[sector].holdings += 1;
    });

    const totalValue = Object.values(sectorMap).reduce((sum, s) => sum + s.value, 0);

    return Object.entries(sectorMap)
      .map(([name, data]) => ({
        name: name.length > 20 ? name.substring(0, 18) + '...' : name,
        fullName: name,
        value: data.value,
        cost: data.cost,
        pnl: data.value - data.cost,
        pnlPercent: data.cost > 0 ? ((data.value - data.cost) / data.cost) * 100 : 0,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        holdings: data.holdings,
      }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, stockSectors]);

  const totalValue = sectorData.reduce((sum, s) => sum + s.value, 0);

  if (holdings.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie Chart */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Sector Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {sectorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `PKR ${value.toLocaleString()} (${props.payload.percentage.toFixed(1)}%)`,
                    props.payload.fullName
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sector Performance Bar Chart */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Sector Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${v.toFixed(0)}%`} fontSize={11} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80} 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(2)}%`,
                    `P&L: PKR ${props.payload.pnl.toLocaleString()}`
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar 
                  dataKey="pnlPercent" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sector Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sector Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-2 font-medium">Sector</th>
                  <th className="text-right py-2 px-2 font-medium">Stocks</th>
                  <th className="text-right py-2 px-2 font-medium">Value</th>
                  <th className="text-right py-2 px-2 font-medium">Weight</th>
                  <th className="text-right py-2 px-2 font-medium">P&L</th>
                  <th className="text-right py-2 px-2 font-medium">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {sectorData.map((sector, index) => (
                  <tr key={sector.fullName} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium truncate max-w-[200px]" title={sector.fullName}>
                          {sector.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-2 px-2">{sector.holdings}</td>
                    <td className="text-right py-2 px-2">PKR {sector.value.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{sector.percentage.toFixed(1)}%</td>
                    <td className={`text-right py-2 px-2 ${sector.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sector.pnl >= 0 ? '+' : ''}{sector.pnl.toLocaleString()}
                    </td>
                    <td className="text-right py-2 px-2">
                      <span className={`inline-flex items-center gap-1 ${sector.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {sector.pnlPercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {sector.pnlPercent >= 0 ? '+' : ''}{sector.pnlPercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
