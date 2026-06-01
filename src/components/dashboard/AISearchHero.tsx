import React from 'react';
import { Sparkles, Search, MessageSquare, BookmarkPlus } from 'lucide-react';
import { AISearchWidget } from '@/components/ai/AISearchWidget';

const hints = [
  {
    icon: Search,
    text: 'Search any PSX ticker for an instant AI summary with financials.',
  },
  {
    icon: MessageSquare,
    text: 'Ask a sector or market question for broader insight.',
  },
  {
    icon: BookmarkPlus,
    text: 'Save findings to your watchlist or set price alerts.',
  },
];

/**
 * Hero shell for the dashboard home. Wraps the existing AISearchWidget
 * (same payload / Supabase / n8n contract) inside an attention-grabbing
 * frame so users immediately see the product's core capability.
 */
export const AISearchHero = () => {
  return (
    <section
      aria-labelledby="ai-search-hero-title"
      className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 glass-subtle p-4 sm:p-6 md:p-10"
      style={{ background: 'var(--gradient-brand-tint)' }}
    >
      {/* Decorative glow */}
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
          Search any PSX ticker or market topic and get an instant AI analysis
          with citations — no spreadsheets, no jargon.
        </p>
      </div>

      <div className="relative mt-4 sm:mt-6 md:mt-8 max-w-3xl mx-auto">
        <AISearchWidget />
      </div>

      <ul className="relative mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto">
        {hints.map((hint) => {
          const Icon = hint.icon;
          return (
            <li
              key={hint.text}
              className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-border/40"
            >
              <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{hint.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AISearchHero;
