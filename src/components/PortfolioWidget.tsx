import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, PieChart, Briefcase, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PortfolioWidget = () => {
  const portfolioData = {
    totalValue: '2,456,789',
    todayChange: '+45,678',
    todayChangePercent: '+1.89%',
    holdings: [
      { symbol: 'HBL', shares: '500', value: '78,390', change: '+2.3%' },
      { symbol: 'ENGRO', shares: '200', value: '55,780', change: '+1.8%' },
      { symbol: 'LUCK', shares: '100', value: '64,530', change: '+3.2%' }
    ]
  };

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          Portfolio
          <Badge variant="secondary" className="ml-2">
            {portfolioData.holdings.length} Holdings
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Portfolio Value */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Value
              </p>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">PKR {portfolioData.totalValue}</p>
            <div className="flex items-center mt-2 gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-sm font-medium">
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
                className="group flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
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
                <div className="text-right">
                  <p className="text-foreground text-sm font-medium">PKR {holding.value}</p>
                  <p className="text-green-500 text-xs font-medium">{holding.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioWidget;
