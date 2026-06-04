import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight, History as HistoryIcon } from 'lucide-react';

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

// Theme-safe card tint by signal — BUY/ADD pop green, SELL/AVOID red, HOLD stays neutral.
function cardTint(signal: string): string {
  if (signal === 'BUY' || signal === 'ADD') return 'bg-emerald-500/[0.10] border-emerald-500/40';
  if (signal === 'SELL' || signal === 'AVOID') return 'bg-red-500/[0.08] border-red-500/40';
  if (signal === 'TRIM') return 'bg-amber-500/[0.08] border-amber-500/40';
  return '';
}

type SigGroup = 'buy' | 'hold' | 'sell';
const SIGNAL_GROUP: Record<string, SigGroup> = {
  BUY: 'buy', ADD: 'buy', HOLD: 'hold', TRIM: 'sell', SELL: 'sell', AVOID: 'sell',
};

interface Group { latest: Rec; history: Rec[]; }

function RecCard({ r, history }: { r: Rec; history: Rec[] }) {
  const [open, setOpen] = useState(false);
  const sig = SIGNAL_STYLES[r.signal] ?? 'bg-slate-100 text-slate-700';
  return (
    <Card className={`p-4 ${cardTint(r.signal)}`}>
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

      {history.length > 0 && (
        <div className="mt-3 border-t border-border/50 pt-2">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <HistoryIcon className="h-3.5 w-3.5" /> history ({history.length})
          </button>
          {open && (
            <div className="mt-2 space-y-2">
              {history.map((h) => (
                <div key={h.id} className="rounded-md border border-border/50 bg-background/40 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge className={SIGNAL_STYLES[h.signal] ?? 'bg-slate-100 text-slate-700'}>{h.signal}</Badge>
                    <span className="text-muted-foreground">conv {h.conviction ?? '—'}{h.horizon ? ` · ${h.horizon}` : ''}</span>
                    <span className="ml-auto text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                  {(h.current_price != null || h.target_price != null) && (
                    <div className="mt-1 text-muted-foreground">
                      {h.current_price != null && <>Price {h.current_price} </>}
                      {h.target_price != null && <>→ Target {h.target_price}</>}
                    </div>
                  )}
                  {h.thesis && <p className="mt-1 text-muted-foreground line-clamp-2">{h.thesis}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

const FILTERS: { key: 'all' | 'buy' | 'hold' | 'sell'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'buy', label: 'Buy' },
  { key: 'hold', label: 'Hold' },
  { key: 'sell', label: 'Sell' },
];

export function RecommendationsFeed() {
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sig, setSig] = useState<'all' | 'buy' | 'hold' | 'sell'>('all');
  const [days, setDays] = useState<'all' | '7' | '30'>('all');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await (supabase as any)
        .from('public_recommendations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);
      if (!active) return;
      if (error) setErr(error.message);
      else setRecs((data ?? []) as Rec[]);
    })();
    return () => { active = false; };
  }, []);

  // Group by market+ticker -> latest card + collapsible history; buys ranked first.
  const grouped = useMemo(() => {
    const out: Record<'PSX' | 'US', Group[]> = { PSX: [], US: [] };
    if (!recs) return out;
    const byKey: Record<string, Rec[]> = {};
    for (const r of recs) {
      const mkt = r.market === 'US' ? 'US' : 'PSX';
      const k = `${mkt}:${r.ticker}`;
      (byKey[k] ||= []).push(r);
    }
    const rank = (s: string) => (SIGNAL_GROUP[s] === 'buy' ? 0 : SIGNAL_GROUP[s] === 'hold' ? 1 : 2);
    for (const k of Object.keys(byKey)) {
      const arr = byKey[k].slice().sort((a, b) => (b.created_at > a.created_at ? 1 : b.created_at < a.created_at ? -1 : 0));
      const mkt: 'PSX' | 'US' = k.startsWith('US:') ? 'US' : 'PSX';
      out[mkt].push({ latest: arr[0], history: arr.slice(1) });
    }
    (['PSX', 'US'] as const).forEach((m) =>
      out[m].sort((a, b) => rank(a.latest.signal) - rank(b.latest.signal) || (b.latest.conviction ?? 0) - (a.latest.conviction ?? 0)));
    return out;
  }, [recs]);

  const filterGroups = (items: Group[]) =>
    items.filter(({ latest }) => {
      if (sig !== 'all' && SIGNAL_GROUP[latest.signal] !== sig) return false;
      if (days !== 'all' && new Date(latest.created_at).getTime() < Date.now() - Number(days) * 86400000) return false;
      return true;
    });

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

  const filterBar = (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={sig === f.key ? 'default' : 'ghost'}
            onClick={() => setSig(f.key)}
            className="h-7 px-3 text-xs"
          >
            {f.label}
          </Button>
        ))}
      </div>
      <select
        value={days}
        onChange={(e) => setDays(e.target.value as 'all' | '7' | '30')}
        aria-label="Filter by date"
        className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
      >
        <option value="all">All dates</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
      <span className="ml-auto text-xs text-muted-foreground">latest per stock · history inside each card</span>
    </div>
  );

  const render = (items: Group[]) => {
    const f = filterGroups(items);
    return (
      <>
        {filterBar}
        {f.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {f.map((g) => <RecCard key={g.latest.id} r={g.latest} history={g.history} />)}
          </div>
        ) : (
          <p className="py-6 text-sm text-muted-foreground">
            {recs.length ? 'No recommendations match these filters.' : 'No recommendations yet — the research agent posts these on its daily run.'}
          </p>
        )}
      </>
    );
  };

  return (
    <Tabs defaultValue="psx">
      <TabsList>
        <TabsTrigger value="psx">PSX ({grouped.PSX.length})</TabsTrigger>
        <TabsTrigger value="us">US ({grouped.US.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="psx" className="mt-4">{render(grouped.PSX)}</TabsContent>
      <TabsContent value="us" className="mt-4">{render(grouped.US)}</TabsContent>
    </Tabs>
  );
}
