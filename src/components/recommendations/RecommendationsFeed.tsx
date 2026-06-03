import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Rec {
  id: string;
  created_at: string;
  market: string | null;
  ticker: string;
  company: string | null;
  sector: string | null;
  signal: string;
  conviction: number | null;
  horizon: string | null;
  current_price: number | null;
  target_price: number | null;
  target_basis: string | null;
  stop_loss: number | null;
  thesis: string | null;
  sharia_status: string | null;
  data_confidence: string | null;
}

const SIGNAL_STYLES: Record<string, string> = {
  BUY: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  ADD: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  HOLD: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  TRIM: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  SELL: 'bg-red-100 text-red-800 hover:bg-red-100',
  AVOID: 'bg-red-100 text-red-800 hover:bg-red-100',
};

function RecCard({ r }: { r: Rec }) {
  const sig = SIGNAL_STYLES[r.signal] ?? 'bg-slate-100 text-slate-700';
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Badge className={sig}>{r.signal}</Badge>
          <span className="font-semibold">{r.ticker}</span>
          {r.sector && <span className="truncate text-xs text-muted-foreground">{r.sector}</span>}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          conv {r.conviction ?? '—'}{r.horizon ? ` · ${r.horizon}` : ''}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {r.current_price != null && <span>Price <b>{r.current_price}</b></span>}
        {r.target_price != null && (
          <span>Target <b>{r.target_price}</b>{r.target_basis ? ` (${r.target_basis})` : ''}</span>
        )}
        {r.stop_loss != null && <span>Stop {r.stop_loss}</span>}
      </div>
      {r.thesis && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.thesis}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {r.sharia_status && <Badge variant="outline">sharia: {r.sharia_status}</Badge>}
        {r.data_confidence && <span className="text-muted-foreground">confidence: {r.data_confidence}</span>}
        <span className="ml-auto text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}

export function RecommendationsFeed() {
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await (supabase as any)
        .from('public_recommendations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150);
      if (!active) return;
      if (error) setErr(error.message);
      else setRecs((data ?? []) as Rec[]);
    })();
    return () => { active = false; };
  }, []);

  if (err) {
    return <Card className="p-6 text-sm text-muted-foreground">Couldn't load recommendations: {err}</Card>;
  }
  if (!recs) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  const psx = recs.filter((r) => r.market !== 'US');
  const us = recs.filter((r) => r.market === 'US');
  const render = (list: Rec[]) =>
    list.length ? (
      <div className="grid gap-3 md:grid-cols-2">{list.map((r) => <RecCard key={r.id} r={r} />)}</div>
    ) : (
      <p className="py-6 text-sm text-muted-foreground">
        No recommendations yet — the research agent posts these on its daily run.
      </p>
    );

  return (
    <Tabs defaultValue="psx">
      <TabsList>
        <TabsTrigger value="psx">PSX ({psx.length})</TabsTrigger>
        <TabsTrigger value="us">US ({us.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="psx" className="mt-4">{render(psx)}</TabsContent>
      <TabsContent value="us" className="mt-4">{render(us)}</TabsContent>
    </Tabs>
  );
}
