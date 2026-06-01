import React, { useState } from 'react';
import { Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SearchHero } from '@/components/dashboard/SearchHero';
import { AISearchWidget } from '@/components/ai/AISearchWidget';

interface AISearchHeroProps {
  selectedTicker: string;
  onTickerChange: (ticker: string) => void;
}

/**
 * Primary hero on the dashboard home. Defaults to the n8n-powered
 * stock picker (sector dropdown + enforced stock list). A secondary
 * "Ask AI" tab exposes the free-form Perplexity widget.
 */
export const AISearchHero = ({ selectedTicker, onTickerChange }: AISearchHeroProps) => {
  const [mode, setMode] = useState<'stock' | 'ask'>('stock');

  return (
    <section
      aria-labelledby="ai-search-hero-title"
      className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 glass-subtle p-4 sm:p-6 md:p-10"
      style={{ background: 'var(--gradient-brand-tint)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: 'var(--gradient-primary, hsl(var(--primary) / 0.4))' }}
      />

      <div className="relative max-w-3xl mx-auto text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 ring-1 ring-primary/30 text-primary text-[10px] sm:text-xs font-medium tracking-wider uppercase">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          PSX · AI-Powered
        </div>
        <h1
          id="ai-search-hero-title"
          className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight"
        >
          Ask anything about Pakistani stocks
        </h1>
        <p className="hidden sm:block text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {mode === 'stock'
            ? 'Pick a sector, choose a stock, and get a full AI analysis — prices, news, technicals & fundamentals.'
            : 'Ask any market or sector question and get an instant AI answer with citations.'}
        </p>
      </div>

      <div className="relative mt-4 sm:mt-6 md:mt-8 max-w-4xl mx-auto">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'stock' | 'ask')}>
          <TabsList className="grid w-full grid-cols-2 h-11 mb-4 max-w-md mx-auto">
            <TabsTrigger value="stock" className="gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4" />
              Stock Analysis
            </TabsTrigger>
            <TabsTrigger value="ask" className="gap-1.5 text-sm">
              <Globe className="h-4 w-4" />
              Ask AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="mt-0">
            <SearchHero
              selectedTicker={selectedTicker}
              onTickerChange={onTickerChange}
            />
          </TabsContent>

          <TabsContent value="ask" className="mt-0">
            <AISearchWidget />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AISearchHero;
