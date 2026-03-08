import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

const DISMISS_KEY = 'newsletter_dismissed_at';
const DISMISS_DAYS = 7;

export const NewsletterPopup = () => {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({ title: 'Invalid email', description: result.error.issues[0].message, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers' as any).insert({
        email: result.data,
        source: 'landing_popup',
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Already subscribed!', description: "You're already on our list." });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'Subscribed!', description: 'Welcome to our daily market insights.' });
      }
      dismiss();
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-in">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close newsletter popup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl mb-3">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Daily Market Insights</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get AI-powered PSX analysis, top movers, and trading signals delivered to your inbox every morning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={submitting} className="gap-2 shrink-0">
            <Mail className="h-4 w-4" />
            {submitting ? '...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
};
