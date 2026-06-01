import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Home,
  BarChart3,
  Brain,
  Briefcase,
  Eye,
  Bell,
  Newspaper,
  History,
  Settings,
  Search,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const routes = [
  { label: 'Dashboard Home', path: '/dashboard', icon: Home, group: 'Navigate' },
  { label: 'Market Analysis', path: '/dashboard', icon: BarChart3, group: 'Navigate' },
  { label: 'AI Tools', path: '/dashboard/ai-tools', icon: Brain, group: 'Navigate' },
  { label: 'Portfolio', path: '/dashboard/portfolio', icon: Briefcase, group: 'Navigate' },
  { label: 'Watchlist', path: '/dashboard/watchlist', icon: Eye, group: 'Navigate' },
  { label: 'Price Alerts', path: '/dashboard/alerts', icon: Bell, group: 'Navigate' },
  { label: 'News', path: '/dashboard/news', icon: Newspaper, group: 'Navigate' },
  { label: 'History', path: '/dashboard/history', icon: History, group: 'Navigate' },
  { label: 'Tools & Export', path: '/dashboard/tools', icon: Settings, group: 'Navigate' },
];

interface StockHit {
  ticker: string;
  company: string | null;
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState<StockHit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!query || query.length < 1) {
      setStocks([]);
      return;
    }
    const handle = setTimeout(async () => {
      const { data } = await supabase
        .from('stocks' as any)
        .select('ticker, company')
        .or(`ticker.ilike.%${query}%,company.ilike.%${query}%`)
        .limit(6);
      setStocks((data as any) ?? []);
    }, 150);
    return () => clearTimeout(handle);
  }, [query]);

  const go = (path: string) => {
    setOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search stocks or jump to a page…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {stocks.length > 0 && (
          <>
            <CommandGroup heading="Stocks">
              {stocks.map((s) => (
                <CommandItem
                  key={s.ticker}
                  value={`stock-${s.ticker}-${s.company ?? ''}`}
                  onSelect={() => go(`/dashboard/ai-tools?ticker=${encodeURIComponent(s.ticker)}`)}
                >
                  <Search className="h-4 w-4" />
                  <span className="font-medium">{s.ticker}</span>
                  {s.company && (
                    <span className="text-muted-foreground text-xs truncate">{s.company}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigate">
          {routes.map((r) => {
            const Icon = r.icon;
            return (
              <CommandItem key={r.path} value={r.label} onSelect={() => go(r.path)}>
                <Icon className="h-4 w-4" />
                <span>{r.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
