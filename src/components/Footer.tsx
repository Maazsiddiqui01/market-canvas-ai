import React, { useState } from 'react';
import { Mail, Linkedin, Heart, TrendingUp, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from './Logo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const { toast } = useToast();
  const [footerEmail, setFooterEmail] = useState('');
  const [submittingFooter, setSubmittingFooter] = useState(false);

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    setSubmittingFooter(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers' as any).insert({
        email: footerEmail.trim(),
        source: 'footer',
      });
      if (error && error.code === '23505') {
        toast({ title: 'Already subscribed!', description: "You're already on our list." });
      } else if (error) {
        throw error;
      } else {
        toast({ title: 'Subscribed!', description: 'Welcome to our daily market insights.' });
      }
      setFooterEmail('');
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSubmittingFooter(false);
    }
  };

  return (
    <footer className="mt-16 hairline-t bg-background/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              Market Canvas AI — your intelligent companion for smarter PSX trading decisions.
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild className="glass-subtle">
                <a href="mailto:maaz01888@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="glass-subtle">
                <a
                  href="https://www.linkedin.com/in/maazsiddiqui01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="eyebrow mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-primary" />
              Daily Market Insights
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              AI-powered PSX analysis, in your inbox.
            </p>
            <form onSubmit={handleFooterSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="you@email.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                required
                className="flex-1 h-9 text-sm glass-subtle"
              />
              <Button type="submit" size="sm" disabled={submittingFooter} className="shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="md:col-span-4">
            <h4 className="eyebrow mb-2 flex items-center gap-2">
              <Shield className="h-3 w-3 text-muted-foreground" />
              Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Information here is for educational purposes only and not financial advice.
              Conduct your own research and consult a qualified advisor before investing.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hairline-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <Heart className="h-3 w-3 text-primary" />
            © 2026 Market Canvas AI · Built by Maaz
          </p>
          <p className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            Market data by{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              TradingView
              <TrendingUp className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;