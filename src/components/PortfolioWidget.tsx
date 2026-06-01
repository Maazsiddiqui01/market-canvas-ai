import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, PieChart, Briefcase, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PortfolioWidget = () => {
  const portfolioData = {
    totalValue: '2,456,789',
    todayChange: '+45,678',
    todayChangePercent: '+1.89%',
    holdings: [
      { symbol: 'HBL', shares: '500', value: '78,390', change: '+2.3%' },
      { symbol: 'ENGRO', shares: '200', value: '55,780', change: '+1.8%' },
      { symbol: 'LUCK', shares: '100', value: '64,530', change: '+3.2%' },
    ],
  };

  return (
    <Card className="glass-subtle border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          Portfolio
          <Badge variant="secondary" className="ml-1 text-xs">
            {portfolioData.holdings.length} Holdings
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Portfolio Value */}
          <div className="p-4 rounded-xl glass border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Value
              </p>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
              PKR {portfolioData.totalValue}
            </p>
            <div className="flex items-center mt-2 gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success text-sm font-medium tabular-nums">
                {portfolioData.todayChange} ({portfolioData.todayChangePercent})
              </span>
            </div>
          </div>

          {/* Top Holdings */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Top Holdings
            </p>
            {portfolioData.holdings.map((holding, index) => (
              <div
                key={index}
                className="group flex justify-between items-center p-3 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <TrendingUp className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{holding.symbol}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {holding.shares} shares
                    </p>
                  </div>
                </div>
                <div className="text-right tabular-nums">
                  <p className="text-foreground text-sm font-medium">PKR {holding.value}</p>
                  <p className="text-success text-xs font-medium">{holding.change}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary">
            <Link to="/dashboard/portfolio">View portfolio →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioWidget;
