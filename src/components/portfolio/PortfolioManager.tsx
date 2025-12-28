import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

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

export const PortfolioManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingHolding, setIsAddingHolding] = useState(false);
  const [newHolding, setNewHolding] = useState({ ticker: '', stockName: '', shares: '', avgPrice: '' });

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

  const addHolding = async () => {
    if (!selectedPortfolio) return;

    const { error } = await supabase
      .from('portfolio_holdings')
      .insert({
        portfolio_id: selectedPortfolio,
        ticker: newHolding.ticker.toUpperCase(),
        stock_name: newHolding.stockName || null,
        shares: parseFloat(newHolding.shares),
        avg_buy_price: newHolding.avgPrice ? parseFloat(newHolding.avgPrice) : null,
      });

    if (error) {
      toast({ title: 'Error', description: 'Failed to add holding', variant: 'destructive' });
      return;
    }

    setNewHolding({ ticker: '', stockName: '', shares: '', avgPrice: '' });
    setIsAddingHolding(false);
    fetchHoldings(selectedPortfolio);
    toast({ title: 'Success', description: 'Holding added!' });
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

  const totalValue = holdings.reduce((sum, h) => {
    const price = h.avg_buy_price || 0;
    return sum + (h.shares * price);
  }, 0);

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
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">PKR {totalValue.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Holdings</p>
                <p className="text-2xl font-bold">{holdings.length}</p>
              </div>
              <div className="p-3 bg-secondary rounded-full">
                <PieChart className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolios</p>
                <p className="text-2xl font-bold">{portfolios.length}</p>
              </div>
              <div className="p-3 bg-secondary rounded-full">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Portfolio Holdings
            </CardTitle>
            <CardDescription>Manage your stock holdings</CardDescription>
          </div>
          <Dialog open={isAddingHolding} onOpenChange={setIsAddingHolding}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Holding
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Holding</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Ticker Symbol</Label>
                  <Input 
                    placeholder="e.g., OGDC" 
                    value={newHolding.ticker}
                    onChange={(e) => setNewHolding({ ...newHolding, ticker: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock Name (Optional)</Label>
                  <Input 
                    placeholder="e.g., Oil & Gas Development" 
                    value={newHolding.stockName}
                    onChange={(e) => setNewHolding({ ...newHolding, stockName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shares</Label>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={newHolding.shares}
                      onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avg. Buy Price (PKR)</Label>
                    <Input 
                      type="number" 
                      placeholder="150.00" 
                      value={newHolding.avgPrice}
                      onChange={(e) => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addHolding} className="w-full">Add to Portfolio</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No holdings yet. Add your first stock!
            </div>
          ) : (
            <div className="space-y-3">
              {holdings.map((holding) => (
                <div 
                  key={holding.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{holding.ticker}</p>
                      <p className="text-sm text-muted-foreground">{holding.stock_name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">{holding.shares} shares</p>
                      <p className="text-sm text-muted-foreground">
                        @ PKR {holding.avg_buy_price?.toLocaleString() || '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        PKR {((holding.shares * (holding.avg_buy_price || 0))).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeHolding(holding.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
