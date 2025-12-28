import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, Plus, Trash2, TrendingUp, Search, Star } from 'lucide-react';

interface WatchlistItem {
  id: string;
  ticker: string;
  stock_name: string | null;
  added_at: string;
}

export const WatchlistManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicker, setNewTicker] = useState('');
  const [newStockName, setNewStockName] = useState('');

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    const { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return;
    }

    setWatchlist(data || []);
    setLoading(false);
  };

  const addToWatchlist = async () => {
    if (!user || !newTicker.trim()) return;

    const { data, error } = await supabase
      .from('watchlists')
      .insert({
        user_id: user.id,
        ticker: newTicker.toUpperCase().trim(),
        stock_name: newStockName.trim() || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Already in watchlist', description: 'This stock is already in your watchlist', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to add to watchlist', variant: 'destructive' });
      }
      return;
    }

    setWatchlist([data, ...watchlist]);
    setNewTicker('');
    setNewStockName('');
    toast({ title: 'Added!', description: `${data.ticker} added to watchlist` });
  };

  const removeFromWatchlist = async (id: string, ticker: string) => {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to remove from watchlist', variant: 'destructive' });
      return;
    }

    setWatchlist(watchlist.filter(w => w.id !== id));
    toast({ title: 'Removed', description: `${ticker} removed from watchlist` });
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading watchlist...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add to Watchlist */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add to Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ticker (e.g., OGDC)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Stock Name (optional)"
                value={newStockName}
                onChange={(e) => setNewStockName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
              />
            </div>
            <Button onClick={addToWatchlist} disabled={!newTicker.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Your Watchlist
          </CardTitle>
          <CardDescription>{watchlist.length} stocks being watched</CardDescription>
        </CardHeader>
        <CardContent>
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <Star className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground">Add stocks above to start tracking them</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{item.ticker}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.stock_name || 'PSX Stock'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWatchlist(item.id, item.ticker)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
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
