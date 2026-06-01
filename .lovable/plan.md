## What you're asking for

1. The TradingView Ticker Tape (the row with OGDC / LUCK / HBL / MCB … and red badges) doesn't render real PSX quotes — kill it.
2. The current `/dashboard` home (Welcome back banner, KSE-100 pill, stats row, 6 big feature cards, Tools card) feels noisy and buries the actual product.
3. The product *is* **AI stock search**. It must be the unmistakable centerpiece on the page users land on after sign-in.
4. Everything else (Portfolio, Watchlist, Alerts, News, History, Tools, Market deep page) should still be reachable, just collapsed so users don't get overwhelmed.

## What I'll build

### 1. Remove the broken ticker tape
- Delete `TradingViewTickerTape` usage from `DashboardHomePage`.
- Delete the component file `src/components/tradingview/TradingViewTickerTape.tsx` (nothing else imports it).
- Keep the other new TradingView widgets (MiniChart, AdvancedChart, SymbolInfo, MarketQuotes) — they're per-symbol and known-working — but only render the ones we actually use on this page (see §3).

### 2. Strip the noisy middle of the home page
Remove from `DashboardHomePage`:
- "Welcome back, {name}" hero block + subtitle
- The standalone KSE-100 live pill (it already lives in the header / market overview strip)
- The 4 stat cards (Holdings / Watchlist / Active Alerts / AI Searches)
- The 6-card "Explore" grid
- The full-width "Tools & Export" card
- The "Quick tip" toast position is unaffected

Keep: `OnboardingChecklist` (only renders for genuinely new users — low noise, high value).

### 3. New home layout — AI search as the hero

```text
┌─────────────────────────────────────────────────────────────┐
│  [eyebrow: PSX • AI-POWERED]                                │
│  Ask anything about Pakistani stocks                         │
│  One-line subhead: "Search any PSX ticker or market topic   │
│  and get an instant AI analysis with citations."             │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [Stock | General] tab                                │  │
│  │  🔍  Type a ticker (OGDC) or a question…    [Search] │  │
│  │  Try:  OGDC outlook · HBL analysis · Top gainers…    │  │
│  └───────────────────────────────────────────────────────┘  │
│  3 tiny "how to use" hints (icon + 1 line each):            │
│   • Search a ticker → AI summary + financials               │
│   • Ask a sector question → market-wide insight             │
│   • Save findings to your watchlist or alerts               │
└─────────────────────────────────────────────────────────────┘

[TradingView Heatmap — full width, KSE-100]

[2-col on lg:  Technical Analysis  |  Financial Analysis ]
  (driven by the last searched ticker, default KSE100)

[Top Gainers / Losers strip]

[ ──────────  compact secondary nav  ────────── ]
[ Portfolio ] [ Watchlist ] [ Alerts ] [ News ] [ History ] [ Tools ]
   small icon tiles, single row on desktop, 2-col on mobile
```

Mechanics:
- The AI search hero reuses the existing `AISearchWidget` (no API/payload changes; n8n + Supabase paths untouched). I'll wrap it in a larger hero container with restyled framing and the instruction hints, but the component contract stays.
- The Heatmap / Technical / Financial / TopBottom5 blocks are lifted directly from `MarketPage` so the home becomes the "market + AI search" surface the user described. `MarketPage` stays in place as the deep view, but the home now satisfies the "market page should be the landing" intent without a forced redirect.
- The 6 feature cards shrink into a single compact icon-tile row at the bottom — present but visually de-emphasised.

### 4. Header / top-of-page chrome
- The existing `DashboardLayout` page header (icon + title + subtitle) for the home is currently absent — keep it absent. The AI search hero IS the header.
- The "Welcome back, Muhammad" greeting is removed entirely (user called this pane out). The KSE-100 live indicator already shows in the layout's market overview strip, so removing it from the page body avoids duplication.

### 5. Files touched

- `src/pages/dashboard/DashboardHomePage.tsx` — rewritten around the new layout above.
- `src/components/dashboard/AISearchHero.tsx` — **new** thin wrapper that places `AISearchWidget` inside the hero shell with eyebrow, headline, subhead, and the 3 instruction hints. No business logic.
- `src/components/dashboard/QuickAccessTiles.tsx` — **new** compact 6-icon row for Portfolio / Watchlist / Alerts / News / History / Tools.
- `src/components/tradingview/TradingViewTickerTape.tsx` — **deleted**.
- Routes (`src/App.tsx`): unchanged. Post-login still lands on `/dashboard`, which is now the AI-search-first home.

### 6. Guardrails (must-not-break)
- AI search payload, n8n webhook usage (ticker-only), and Supabase read/write paths stay byte-identical.
- All 9 existing smoke tests must continue to pass; no test file edits unless a test imports a deleted symbol (none do).
- Design tokens only — no hard-coded colors. Works in both dark and light themes.

### 7. Out of scope for this pass
- Visual rebrand beyond the home page (you said you're "not a fan of the website design" — happy to do a directions pass next, but this plan only covers the post-login home so we can ship the structural fix first).
- Touching MarketPage, PortfolioPage, etc. They keep working as the deep views behind the compact tiles.

If you want me to also re-skin the whole app aesthetic in this same pass, say the word and I'll branch into a design-directions round before touching code.