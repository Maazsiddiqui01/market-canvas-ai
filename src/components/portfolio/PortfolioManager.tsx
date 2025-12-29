import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { AddPositionDialog } from './AddPositionDialog';
import { AddHoldingDialog } from './AddHoldingDialog';
import { PositionsList } from './PositionsList';
import { PortfolioCharts } from './PortfolioCharts';
import { PortfolioHistoryChart } from './PortfolioHistoryChart';
import { SectorBreakdown } from './SectorBreakdown';
import { getStockByTicker } from '@/data/stockData';
import { 
  Briefcase, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, 
  PieChart, RefreshCw, ChevronDown, ChevronRight, Loader2, Activity
} from 'lucide-react';

interface Portfolio {
  id: string;
  name: string;
  created_at: string;
}

interface Holding {
  id: string;
  portfolio_id: string;
  ticker: string;
  stock_name: string | null;
  shares: number;
  avg_buy_price: number | null;
}

interface Position {
  id: string;
  holding_id: string;
  shares: number;
  buy_price: number;
  buy_date: string | null;
  notes: string | null;
  created_at: string;
}

interface StockPrice {
  price: number;
  changePercent: number;
  absoluteChange: number;
  volume: number;
}

export const PortfolioManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [positions, setPositions] = useState<Record<string, Position[]>>({});
  const [prices, setPrices] = useState<Record<string, StockPrice>>({});
  const [stockSectors, setStockSectors] = useState<Record<string, string>>({});
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set());
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchHoldings(selectedPortfolio);
    }
  }, [selectedPortfolio]);

  useEffect(() => {
    if (holdings.length > 0) {
      fetchPrices();
      fetchAllPositions();
      fetchSectorInfo();
    }
  }, [holdings]);

  const fetchPortfolios = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolios:', error);
      return;
    }

    setPortfolios(data || []);
    if (data && data.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(data[0].id);
    }
    setLoading(false);
  };

  const fetchHoldings = async (portfolioId: string) => {
    const { data, error } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching holdings:', error);
      return;
    }

    setHoldings(data || []);
  };

  const fetchAllPositions = async () => {
    const holdingIds = holdings.map(h => h.id);
    if (holdingIds.length === 0) return;

    const { data, error } = await supabase
      .from('portfolio_positions')
      .select('*')
      .in('holding_id', holdingIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching positions:', error);
      return;
    }

    // Group positions by holding_id
    const grouped: Record<string, Position[]> = {};
    (data || []).forEach((pos) => {
      if (!grouped[pos.holding_id]) {
        grouped[pos.holding_id] = [];
      }
      grouped[pos.holding_id].push(pos);
    });
    setPositions(grouped);
  };

  const fetchSectorInfo = async () => {
    const sectors: Record<string, string> = {};
    for (const h of holdings) {
      const stock = await getStockByTicker(h.ticker);
      if (stock?.sector) {
        sectors[h.ticker] = stock.sector;
      }
    }
    setStockSectors(sectors);
  };

  const fetchPrices = useCallback(async () => {
    const tickers = holdings.map(h => h.ticker);
    if (tickers.length === 0) return;

    setLoadingPrices(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-stock-prices', {
        body: { tickers },
      });

      if (error) throw error;

      if (data?.prices) {
        setPrices(data.prices);
        toast({
          title: 'Prices Updated',
          description: `Fetched prices for ${Object.keys(data.prices).length} stocks`,
        });
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: 'Price Fetch Failed',
        description: 'Could not fetch live prices. Showing cost basis.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPrices(false);
    }
  }, [holdings, toast]);

  const createPortfolio = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('portfolios')
      .insert({ user_id: user.id, name: 'My Portfolio' })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to create portfolio', variant: 'destructive' });
      return;
    }

    setPortfolios([data, ...portfolios]);
    setSelectedPortfolio(data.id);
    toast({ title: 'Success', description: 'Portfolio created!' });
  };

  const addHoldingWithPositions = async (
    ticker: string, 
    stockName: string, 
    positionsData: Array<{ shares: number; buyPrice: number; buyDate?: string; notes?: string }>
  ) => {
    if (!selectedPortfolio) return;

    // Calculate totals
    let totalShares = 0;
    let totalCost = 0;
    positionsData.forEach(p => {
      totalShares += p.shares;
      totalCost += p.shares * p.buyPrice;
    });
    const avgPrice = totalShares > 0 ? totalCost / totalShares : 0;

    const { data: holdingData, error: holdingError } = await supabase
      .from('portfolio_holdings')
      .insert({
        portfolio_id: selectedPortfolio,
        ticker: ticker.toUpperCase(),
        stock_name: stockName || null,
        shares: totalShares,
        avg_buy_price: avgPrice,
      })
      .select()
      .single();

    if (holdingError) {
      toast({ title: 'Error', description: 'Failed to add holding', variant: 'destructive' });
      return;
    }

    // Insert all positions
    const positionInserts = positionsData.map(p => ({
      holding_id: holdingData.id,
      shares: p.shares,
      buy_price: p.buyPrice,
      buy_date: p.buyDate || null,
      notes: p.notes || null,
    }));

    await supabase.from('portfolio_positions').insert(positionInserts);

    fetchHoldings(selectedPortfolio);
    toast({ title: 'Success', description: 'Holding added with all positions!' });
  };

  const addPosition = async (holdingId: string, shares: number, buyPrice: number, buyDate?: string, notes?: string) => {
    const { error } = await supabase.from('portfolio_positions').insert({
      holding_id: holdingId,
      shares,
      buy_price: buyPrice,
      buy_date: buyDate || null,
      notes: notes || null,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to add position', variant: 'destructive' });
      return;
    }

    // Update holding's total shares and average price
    const holding = holdings.find(h => h.id === holdingId);
    if (holding) {
      const newTotalShares = holding.shares + shares;
      const currentCost = holding.shares * (holding.avg_buy_price || 0);
      const newCost = shares * buyPrice;
      const newAvgPrice = (currentCost + newCost) / newTotalShares;

      await supabase
        .from('portfolio_holdings')
        .update({ shares: newTotalShares, avg_buy_price: newAvgPrice })
        .eq('id', holdingId);

      fetchHoldings(selectedPortfolio!);
    }

    fetchAllPositions();
    toast({ title: 'Success', description: 'Position added!' });
  };

  const deletePosition = async (positionId: string) => {
    const { error } = await supabase
      .from('portfolio_positions')
      .delete()
      .eq('id', positionId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete position', variant: 'destructive' });
      return;
    }

    fetchAllPositions();
    toast({ title: 'Success', description: 'Position removed!' });
  };

  const removeHolding = async (holdingId: string) => {
    const { error } = await supabase
      .from('portfolio_holdings')
      .delete()
      .eq('id', holdingId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to remove holding', variant: 'destructive' });
      return;
    }

    setHoldings(holdings.filter(h => h.id !== holdingId));
    toast({ title: 'Success', description: 'Holding removed!' });
  };

  const toggleExpanded = (holdingId: string) => {
    const newExpanded = new Set(expandedHoldings);
    if (newExpanded.has(holdingId)) {
      newExpanded.delete(holdingId);
    } else {
      newExpanded.add(holdingId);
    }
    setExpandedHoldings(newExpanded);
  };

  // Calculate portfolio metrics
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.shares * (h.avg_buy_price || 0)), 0);
  const totalCurrentValue = holdings.reduce((sum, h) => {
    const price = prices[h.ticker]?.price ?? h.avg_buy_price ?? 0;
    return sum + (h.shares * price);
  }, 0);
  const totalPnL = totalCurrentValue - totalCostBasis;
  const totalPnLPercent = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
  const todayChange = holdings.reduce((sum, h) => {
    const priceData = prices[h.ticker];
    if (!priceData) return sum;
    return sum + (h.shares * priceData.absoluteChange);
  }, 0);

  // Prepare chart data
  const chartData = holdings.map(h => ({
    ticker: h.ticker,
    stockName: h.stock_name,
    shares: h.shares,
    avgBuyPrice: h.avg_buy_price || 0,
    currentPrice: prices[h.ticker]?.price ?? null,
  }));

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading portfolios...</div>
        </CardContent>
      </Card>
    );
  }

  if (portfolios.length === 0) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Briefcase className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first portfolio to start tracking your investments</p>
          </div>
          <Button onClick={createPortfolio} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Portfolio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">PKR {totalCurrentValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()}
                </p>
                <p className={`text-xs ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {totalPnL >= 0 ? (
                  <TrendingUp className={`h-6 w-6 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Change</p>
                <p className={`text-2xl font-bold ${todayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {todayChange >= 0 ? '+' : ''}{todayChange.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-secondary rounded-full">
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Holdings</p>
                <p className="text-2xl font-bold">{holdings.length}</p>
              </div>
              <div className="p-3 bg-secondary rounded-full">
                <PieChart className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <PortfolioCharts holdings={chartData} />

      {/* Sector Breakdown */}
      <SectorBreakdown holdings={chartData} stockSectors={stockSectors} />

      {/* Portfolio History Chart */}
      {selectedPortfolio && (
        <PortfolioHistoryChart
          portfolioId={selectedPortfolio}
          currentValue={totalCurrentValue}
          currentCost={totalCostBasis}
          currentPnl={totalPnL}
          currentPnlPercent={totalPnLPercent}
          holdingsSnapshot={chartData}
        />
      )}

      {/* Holdings Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Portfolio Holdings
            </CardTitle>
            <CardDescription>Manage your stock holdings with live prices</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPrices}
              disabled={loadingPrices}
              className="gap-2"
            >
              {loadingPrices ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh Prices
            </Button>
            <AddHoldingDialog onAdd={addHoldingWithPositions} />
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No holdings yet. Add your first stock!
            </div>
          ) : (
            <div className="space-y-3">
              {holdings.map((holding) => {
                const priceData = prices[holding.ticker];
                const currentPrice = priceData?.price ?? holding.avg_buy_price ?? 0;
                const costBasis = holding.shares * (holding.avg_buy_price || 0);
                const currentValue = holding.shares * currentPrice;
                const pnl = currentValue - costBasis;
                const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                const isExpanded = expandedHoldings.has(holding.id);
                const holdingPositions = positions[holding.id] || [];

                return (
                  <Collapsible 
                    key={holding.id} 
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(holding.id)}
                  >
                    <div className="rounded-lg bg-secondary/50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-secondary/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <div className={`p-2 rounded-lg ${pnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            {pnl >= 0 ? (
                              <TrendingUp className={`h-5 w-5 ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{holding.ticker}</p>
                            <p className="text-sm text-muted-foreground">{holding.stock_name || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {/* Live Price */}
                          <div className="text-right">
                            <p className="font-medium">PKR {currentPrice.toLocaleString()}</p>
                            {priceData && (
                              <p className={`text-xs ${priceData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                              </p>
                            )}
                          </div>
                          {/* Shares & Avg */}
                          <div className="text-right">
                            <p className="font-medium">{holding.shares} shares</p>
                            <p className="text-sm text-muted-foreground">
                              @ PKR {holding.avg_buy_price?.toLocaleString() || '-'}
                            </p>
                          </div>
                          {/* P&L */}
                          <div className="text-right min-w-[100px]">
                            <p className={`font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}{pnl.toLocaleString()}
                            </p>
                            <p className={`text-xs ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <AddPositionDialog
                              holdingId={holding.id}
                              ticker={holding.ticker}
                              onAdd={addPosition}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeHolding(holding.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="px-4 pb-4">
                          <PositionsList
                            positions={holdingPositions}
                            currentPrice={priceData?.price ?? null}
                            onDelete={deletePosition}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
