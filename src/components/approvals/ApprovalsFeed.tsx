import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Loader2 } from 'lucide-react';

interface PendingAction {
  id: string;
  market: string | null;
  ticker: string;
  side: string;
  qty: number | null;
  limit_price: number | null;
  stop_loss: number | null;
  target_price: number | null;
  note: string | null;
  portfolio_id: string | null;
  created_at: string;
}

export function ApprovalsFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<PendingAction[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    // RLS scopes pending_actions to the signed-in owner's portfolios.
    const { data, error } = await (supabase as any)
      .from('pending_actions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      console.error('approvals load', error);
      setItems([]);
      return;
    }
    setItems((data ?? []) as PendingAction[]);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const decide = async (a: PendingAction, approve: boolean) => {
    setBusy(a.id);
    try {
      // On approve, record the fill into the real book (weighted-average), via the
      // authenticated client — RLS lets you write only your own portfolio's holdings.
      if (approve && a.side === 'BUY' && a.portfolio_id && a.qty && a.limit_price) {
        const { data: hs, error: herr } = await supabase
          .from('portfolio_holdings')
          .select('id,shares,avg_buy_price')
          .eq('portfolio_id', a.portfolio_id)
          .eq('ticker', a.ticker)
          .limit(1);
        if (herr) throw herr;
        if (hs && hs.length) {
          const o: any = hs[0];
          const ns = Number(o.shares) + a.qty;
          const na = ns > 0 ? (Number(o.shares) * Number(o.avg_buy_price || 0) + a.qty * a.limit_price) / ns : a.limit_price;
          const { error } = await supabase.from('portfolio_holdings').update({ shares: ns, avg_buy_price: na }).eq('id', o.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('portfolio_holdings').insert({
            portfolio_id: a.portfolio_id, ticker: a.ticker, stock_name: a.ticker,
            shares: a.qty, avg_buy_price: a.limit_price,
          });
          if (error) throw error;
        }
      } else if (approve && a.side === 'SELL' && a.portfolio_id && a.qty) {
        // SELL approval: reduce or close the holding (RLS-scoped to the owner).
        const { data: hs, error: herr } = await supabase
          .from('portfolio_holdings')
          .select('id,shares')
          .eq('portfolio_id', a.portfolio_id)
          .eq('ticker', a.ticker)
          .limit(1);
        if (herr) throw herr;
        if (hs && hs.length) {
          const o: any = hs[0];
          const ns = Number(o.shares) - a.qty;
          if (ns <= 0.0001) {
            const { error } = await supabase.from('portfolio_holdings').delete().eq('id', o.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('portfolio_holdings').update({ shares: ns }).eq('id', o.id);
            if (error) throw error;
          }
        }
      }
      const { error: uerr } = await (supabase as any)
        .from('pending_actions')
        .update({ status: approve ? 'executed' : 'rejected', decided_at: new Date().toISOString() })
        .eq('id', a.id);
      if (uerr) throw uerr;
      setItems((items ?? []).filter((x) => x.id !== a.id));
      toast(approve
        ? { title: 'Approved', description: `${a.side === 'SELL' ? 'Sold' : 'Recorded'} ${a.qty ?? ''} ${a.ticker}${a.limit_price ? ` @ ~${a.limit_price}` : ''}. Adjust in Portfolio if your real fill differed.` }
        : { title: 'Rejected', description: `${a.ticker} dismissed — nothing recorded.` });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Could not update the order.', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  if (!items) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}</div>;
  }
  if (!items.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        No orders awaiting your approval. The research agent proposes orders here when a high-conviction,
        Sharia-compliant setup appears in its entry zone.
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((a) => (
        <Card key={a.id} className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Badge className={a.side === 'BUY' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>{a.side}</Badge>
              <span className="font-semibold">{a.ticker}</span>
              {a.market && <span className="text-xs text-muted-foreground">{a.market}</span>}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {a.qty != null && <span>Qty <b>{a.qty}</b></span>}
            {a.limit_price != null && <span>Limit <b>{a.limit_price}</b></span>}
            {a.stop_loss != null && <span>Stop {a.stop_loss}</span>}
            {a.target_price != null && <span>Target {a.target_price}</span>}
          </div>
          {a.note && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.note}</p>}
          <div className="mt-3 flex gap-2">
            <Button size="sm" disabled={busy === a.id} onClick={() => decide(a, true)} className="gap-1">
              {busy === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Approve
            </Button>
            <Button size="sm" variant="outline" disabled={busy === a.id} onClick={() => decide(a, false)} className="gap-1">
              <X className="h-4 w-4" /> Reject
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Approving records the fill at the proposed terms into your portfolio — edit it there if your actual fill differs. Advisory only; you place the order with your broker.
          </p>
        </Card>
      ))}
    </div>
  );
}
