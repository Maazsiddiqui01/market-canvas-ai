import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Eye, Briefcase, Bell, Brain, X, Rocket } from 'lucide-react';

const DISMISSED_KEY = 'onboarding_dismissed';

interface ChecklistItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  completed: boolean;
}

export const OnboardingChecklist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === 'true');

  useEffect(() => {
    if (!user || dismissed) return;

    const fetchProgress = async () => {
      const [watchlistRes, portfolioRes, alertsRes, searchesRes] = await Promise.all([
        supabase.from('watchlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('price_alerts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('search_history').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setItems([
        { id: 'watchlist', label: 'Add your first stock to watchlist', href: '/dashboard/watchlist', icon: Eye, completed: (watchlistRes.count ?? 0) > 0 },
        { id: 'portfolio', label: 'Create your portfolio', href: '/dashboard/portfolio', icon: Briefcase, completed: (portfolioRes.count ?? 0) > 0 },
        { id: 'alert', label: 'Set a price alert', href: '/dashboard/alerts', icon: Bell, completed: (alertsRes.count ?? 0) > 0 },
        { id: 'search', label: 'Try AI search', href: '/dashboard/ai-tools', icon: Brain, completed: (searchesRes.count ?? 0) > 0 },
      ]);
      setLoading(false);
    };

    fetchProgress();
  }, [user, dismissed]);

  if (dismissed || loading) return null;

  const completedCount = items.filter(i => i.completed).length;
  if (completedCount === items.length) return null; // all done

  const progress = Math.round((completedCount / items.length) * 100);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 mb-6 animate-fade-in">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Get Started</CardTitle>
          <span className="text-xs text-muted-foreground ml-2">{completedCount}/{items.length}</span>
        </div>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1" aria-label="Dismiss onboarding">
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-1.5 mb-4">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  item.completed
                    ? 'bg-primary/10 text-muted-foreground'
                    : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${item.completed ? 'line-through' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
