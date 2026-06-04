import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronDown,
  ChevronRight,
  History as HistoryIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Target,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

type SigGroup = 'buy' | 'hold' | 'sell';
const SIGNAL_GROUP: Record<string, SigGroup> = {
  BUY: 'buy', ADD: 'buy', HOLD: 'hold', TRIM: 'sell', SELL: 'sell', AVOID: 'sell',
};

interface Group { latest: Rec; history: Rec[]; }

/** Theme-aware signal styling using semantic tokens. */
function signalStyles(signal: string) {
  const g = SIGNAL_GROUP[signal];
  if (g === 'buy') {
    return {
      chip: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      ring: 'before:bg-emerald-500/40',
      glow: 'hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.45)]',
      icon: TrendingUp,
      accent: 'text-emerald-500',
      bar: 'bg-emerald-500',
    };
  }
  if (g === 'sell') {
    return {
      chip: 'bg-destructive/15 text-destructive border border-destructive/30',
      ring: 'before:bg-destructive/40',
      glow: 'hover:shadow-[0_20px_50px_-20px_hsl(var(--destructive)/0.45)]',
      icon: TrendingDown,
      accent: 'text-destructive',
      bar: 'bg-destructive',
    };
  }
  return {
    chip: 'bg-muted text-muted-foreground border border-border',
    ring: 'before:bg-muted-foreground/30',
    glow: 'hover:shadow-elegant',
    icon: Minus,
    accent: 'text-muted-foreground',
    bar: 'bg-muted-foreground',
  };
}

function ConvictionMeter({ value }: { value: number | null }) {
  const v = Math.max(0, Math.min(5, Math.round(value ?? 0)));
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-3 rounded-full transition-colors',
              i < v ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">{value ?? '—'}/5</span>
    </div>
  );
}

function RecCard({ r, history }: { r: Rec; history: Rec[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const s = signalStyles(r.signal);
  const SignalIcon = s.icon;

  const upside =
    r.current_price != null && r.target_price != null && r.current_price > 0
      ? ((r.target_price - r.current_price) / r.current_price) * 100
      : null;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden p-5 transition-all duration-300',
        'hover:-translate-y-0.5',
        'before:absolute before:inset-x-0 before:top-0 before:h-px',
        s.ring,
        s.glow
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground transition-transform group-hover:scale-[1.02] origin-left">
              {r.ticker}
            </h3>
            {r.market && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {r.market}
              </span>
            )}
          </div>
          {r.company && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.company}</p>
          )}
          {r.sector && (
            <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground/80">
              {r.sector}
            </p>
          )}
        </div>
        <Badge className={cn('shrink-0 gap-1 px-2.5 py-1 text-xs font-semibold', s.chip)}>
          <SignalIcon className="h-3.5 w-3.5" />
          {r.signal}
        </Badge>
      </div>

      {/* Conviction + horizon */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <ConvictionMeter value={r.conviction} />
        {r.horizon && (
          <span className="rounded-full bg-muted/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {r.horizon}
          </span>
        )}
      </div>

      {/* Price row */}
      {(r.current_price != null || r.target_price != null) && (
        <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current</p>
              <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                {r.current_price ?? '—'}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Target className="h-3 w-3" /> Target
              </p>
              <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                {r.target_price ?? '—'}
              </p>
            </div>
            {upside != null && (
              <div className={cn('shrink-0 rounded-md px-2 py-1 text-xs font-bold tabular-nums', s.chip)}>
                {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
              </div>
            )}
          </div>
          {(r.stop_loss != null || r.target_basis) && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              {r.stop_loss != null ? (
                <span className="flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Stop <span className="font-medium tabular-nums text-foreground/80">{r.stop_loss}</span>
                </span>
              ) : <span />}
              {r.target_basis && <span className="italic">{r.target_basis}</span>}
            </div>
          )}
        </div>
      )}

      {/* Thesis */}
      {r.thesis && (
        <div className="mt-4">
          <p className={cn('text-sm leading-relaxed text-muted-foreground', !expanded && 'line-clamp-3')}>
            {r.thesis}
          </p>
          {r.thesis.length > 180 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3 text-[11px]">
        {r.sharia_status && (
          <Badge variant="outline" className="font-normal">
            ☪ {r.sharia_status}
          </Badge>
        )}
        {r.data_confidence && (
          <span className="text-muted-foreground">
            confidence · <span className="text-foreground/80">{r.data_confidence}</span>
          </span>
        )}
        <span className="ml-auto text-muted-foreground">
          {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <HistoryIcon className="h-3.5 w-3.5" />
            <span>Timeline ({history.length})</span>
          </button>
          {open && (
            <ol className="mt-3 space-y-3 border-l border-border/60 pl-4">
              {history.map((h) => {
                const hs = signalStyles(h.signal);
                return (
                  <li key={h.id} className="relative">
                    <span className={cn('absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full ring-2 ring-background', hs.bar)} />
                    <div className="flex items-center gap-2 text-[11px]">
                      <Badge className={cn('h-5 px-1.5 py-0 text-[10px]', hs.chip)}>{h.signal}</Badge>
                      <span className="text-muted-foreground">conv {h.conviction ?? '—'}</span>
                      <span className="ml-auto text-muted-foreground">
                        {new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {(h.current_price != null || h.target_price != null) && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {h.current_price ?? '—'} → {h.target_price ?? '—'}
                      </p>
                    )}
                    {h.thesis && <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{h.thesis}</p>}
                  </li>
                );
              })}
            </ol>
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

function StatTile({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl"
        style={{ background: 'var(--gradient-brand-tint, hsl(var(--primary) / 0.4))' }}
      />
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      {value !== undefined && (
        <p className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      )}
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function HeroStats({ items }: { items: Group[] }) {
  const totals = items.reduce(
    (acc, g) => {
      const grp = SIGNAL_GROUP[g.latest.signal] ?? 'hold';
      acc[grp]++;
      acc.conv += g.latest.conviction ?? 0;
      acc.convCount += g.latest.conviction != null ? 1 : 0;
      return acc;
    },
    { buy: 0, hold: 0, sell: 0, conv: 0, convCount: 0 }
  );
  const total = items.length;
  const avgConv = totals.convCount ? (totals.conv / totals.convCount).toFixed(1) : '—';
  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile
        label="Picks Today"
        value={total}
        hint="Latest per ticker"
      />
      <StatTile label="Avg Conviction" value={avgConv} hint="Out of 5" />
      <StatTile label="Signal Mix">
        <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <span className="bg-emerald-500 transition-all" style={{ width: `${pct(totals.buy)}%` }} />
          <span className="bg-muted-foreground/40 transition-all" style={{ width: `${pct(totals.hold)}%` }} />
          <span className="bg-destructive transition-all" style={{ width: `${pct(totals.sell)}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span><span className="font-semibold text-emerald-500">{totals.buy}</span> buy</span>
          <span><span className="font-semibold text-foreground/80">{totals.hold}</span> hold</span>
          <span><span className="font-semibold text-destructive">{totals.sell}</span> sell</span>
        </div>
      </StatTile>
    </div>
  );
}

export function RecommendationsFeed() {
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sig, setSig] = useState<'all' | 'buy' | 'hold' | 'sell'>('all');
  const [days, setDays] = useState<'today' | '7' | '30' | 'all'>('today');

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const filterBar = (
    <div className="sticky top-16 z-20 -mx-1 mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border/50 bg-background/70 px-2 py-2 backdrop-blur-md">
      <div className="flex gap-0.5 rounded-full bg-muted/50 p-1">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={sig === f.key ? 'default' : 'ghost'}
            onClick={() => setSig(f.key)}
            className="h-7 rounded-full px-3 text-xs"
          >
            {f.label}
          </Button>
        ))}
      </div>
      <select
        value={days}
        onChange={(e) => setDays(e.target.value as 'all' | '7' | '30')}
        aria-label="Filter by date"
        className="h-8 rounded-full border border-input bg-background px-3 text-xs text-foreground"
      >
        <option value="all">All dates</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
      <span className="ml-auto hidden text-[11px] text-muted-foreground sm:inline-flex items-center gap-1">
        <Sparkles className="h-3 w-3" /> latest per stock · timeline inside each card
      </span>
    </div>
  );

  const render = (items: Group[]) => {
    const f = filterGroups(items);
    return (
      <>
        <HeroStats items={items} />
        {filterBar}
        {f.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {f.map((g) => <RecCard key={g.latest.id} r={g.latest} history={g.history} />)}
          </div>
        ) : (
          <Card className="p-10 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              {recs.length ? 'No recommendations match these filters.' : 'No recommendations yet — the research agent posts these on its daily run.'}
            </p>
          </Card>
        )}
      </>
    );
  };

  return (
    <Tabs defaultValue="psx" className="space-y-4">
      <TabsList className="h-11 rounded-full bg-muted/60 p-1">
        <TabsTrigger value="psx" className="rounded-full px-5 data-[state=active]:shadow-sm">
          PSX <span className="ml-1.5 rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] tabular-nums">{grouped.PSX.length}</span>
        </TabsTrigger>
        <TabsTrigger value="us" className="rounded-full px-5 data-[state=active]:shadow-sm">
          US <span className="ml-1.5 rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] tabular-nums">{grouped.US.length}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="psx" className="mt-4">{render(grouped.PSX)}</TabsContent>
      <TabsContent value="us" className="mt-4">{render(grouped.US)}</TabsContent>
    </Tabs>
  );
}
