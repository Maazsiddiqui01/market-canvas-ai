import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellRing, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PriceAlert {
  id: string;
  ticker: string;
  stock_name: string | null;
  target_price: number;
  alert_type: 'above' | 'below';
  is_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

export const PriceAlertManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false);

  // Form state
  const [newTicker, setNewTicker] = useState('');
  const [newStockName, setNewStockName] = useState('');
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');

  const fetchAlerts = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }

    // Type assertion for alert_type
    const typedAlerts = (data || []).map(alert => ({
      ...alert,
      alert_type: alert.alert_type as 'above' | 'below'
    }));

    setAlerts(typedAlerts);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user, fetchAlerts]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('price-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAlerts]);

  const handleCreateAlert = async () => {
    if (!user || !newTicker.trim() || !newTargetPrice) return;

    setIsCreating(true);
    try {
      const { error } = await supabase.from('price_alerts').insert({
        user_id: user.id,
        ticker: newTicker.toUpperCase(),
        stock_name: newStockName || null,
        target_price: parseFloat(newTargetPrice),
        alert_type: newAlertType,
      });

      if (error) throw error;

      toast({
        title: 'Alert Created',
        description: `Price alert set for ${newTicker.toUpperCase()} when price goes ${newAlertType} PKR ${newTargetPrice}`,
      });

      // Reset form
      setNewTicker('');
      setNewStockName('');
      setNewTargetPrice('');
      setNewAlertType('above');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create price alert.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: 'Alert Deleted',
        description: 'Price alert has been removed.',
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete price alert.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckAlerts = async () => {
    setIsCheckingAlerts(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-alerts', {
        body: { user_id: user?.id }
      });

      if (error) throw error;

      toast({
        title: 'Alerts Checked',
        description: data?.message || 'Price alerts have been checked against current prices.',
      });

      fetchAlerts();
    } catch (error) {
      console.error('Error checking alerts:', error);
      toast({
        title: 'Info',
        description: 'Alert checking will be available once the webhook is configured.',
      });
    } finally {
      setIsCheckingAlerts(false);
    }
  };

  const SkeletonAlert = () => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  );

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonAlert key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Price Alerts
            </CardTitle>
            <CardDescription>
              Get notified when stocks hit your target prices
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCheckAlerts}
              disabled={isCheckingAlerts}
              title="Check alerts against current prices"
            >
              <RefreshCw className={`h-4 w-4 ${isCheckingAlerts ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Price Alert</DialogTitle>
                  <DialogDescription>
                    Set a price target and get notified when it's reached.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticker">Stock Ticker</Label>
                    <Input
                      id="ticker"
                      placeholder="e.g., OGDC, HBL, LUCK"
                      value={newTicker}
                      onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockName">Stock Name (Optional)</Label>
                    <Input
                      id="stockName"
                      placeholder="e.g., Oil & Gas Development Company"
                      value={newStockName}
                      onChange={(e) => setNewStockName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alertType">Alert When Price</Label>
                      <Select value={newAlertType} onValueChange={(v) => setNewAlertType(v as 'above' | 'below')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              Goes Above
                            </div>
                          </SelectItem>
                          <SelectItem value="below">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              Goes Below
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetPrice">Target Price (PKR)</Label>
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="0.00"
                        value={newTargetPrice}
                        onChange={(e) => setNewTargetPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlert} disabled={isCreating || !newTicker || !newTargetPrice}>
                    {isCreating ? 'Creating...' : 'Create Alert'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No price alerts set</p>
            <p className="text-xs mt-1">Create an alert to get notified when a stock hits your target price</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 animate-fade-in ${
                  alert.is_triggered 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`p-2 rounded-full ${
                  alert.is_triggered ? 'bg-primary/20' : 'bg-secondary'
                }`}>
                  {alert.is_triggered ? (
                    <BellRing className="h-5 w-5 text-primary animate-pulse" />
                  ) : alert.alert_type === 'above' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{alert.ticker}</p>
                    {alert.is_triggered && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Triggered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {alert.stock_name || 'Stock'} • {alert.alert_type === 'above' ? 'Above' : 'Below'} PKR {alert.target_price.toLocaleString()}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Alert?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the price alert for {alert.ticker}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
