
## Goal

Make the home dashboard the single market+AI page, with the n8n stock-picker workflow (sector dropdown + enforced stock list → POST to n8n → render same rich result as Market page) as the **primary** interface. The Perplexity "general question" AI becomes a secondary mode behind a tab. No separate Market page.

## Changes

### 1. New hero: `AISearchHero` becomes a two-mode component

Replace current `AISearchHero` (which wraps `AISearchWidget`) with a tabbed shell:

- **Tab 1 — "Stock Analysis" (default, primary)**: renders `SearchHero` (the existing market-page component that does the sector filter + stock dropdown + POST to `n8n.../webhook/...` and renders the parsed `htmlBody` result). This is the highlighted, hero-styled experience.
- **Tab 2 — "Ask AI" (secondary)**: renders the existing `AISearchWidget` (Perplexity, free-text questions).

Visual treatment: keep the existing gradient hero frame, "PSX · AI-Powered" pill, big heading ("Ask anything about Pakistani stocks"), and supporting copy. Tabs sit directly under the heading. Hints row below adjusts copy for the active mode (pick a stock vs. ask a question).

### 2. Home page becomes the market page

`src/pages/dashboard/DashboardHomePage.tsx`:
- Title/meta → "Market | Market Canvas AI".
- Structure (top to bottom): Hero (tabbed search above) → TradingView heatmap → `MobileAnalysisTabs` (Technical + Financial for the selected ticker) → `TopBottom5` → `QuickAccessTiles`.
- Lift `selectedTicker` state here; pass it from `SearchHero.onTickerChange` down to `MobileAnalysisTabs` so picking a stock updates the analysis widgets the same way the old Market page did.

### 3. Remove the Market page entirely

- Delete `src/pages/dashboard/MarketPage.tsx`.
- `src/App.tsx`: drop the `/dashboard/market` route + its `Navigate` redirect (already redirects to `/dashboard`, but we'll just remove it; `/dashboard` already renders the home).
- `NavigationGuide.tsx`: confirm no `market` entry remains in any nav list (already removed in prior pass — verify).
- `CommandPalette.tsx`: remove the "Market Analysis" entry (it currently points to `/dashboard`, which is now the same page — duplicate).
- Remove `market` from any breadcrumbs / page-titles maps if present.

### 4. Mobile

- Tabs render full-width, large tap targets (`h-11`).
- Sector select + stock input stack vertically on `<sm`; Search button is full-width on mobile.
- Hero padding tightens on mobile (already handled via `p-4 sm:p-6 md:p-10`).
- Result block from `SearchHero` already uses responsive cards — verify on 390px viewport.

### 5. Out of scope (unchanged)

- n8n webhook URLs, payload (`{ ticker, timestamp }`, ticker-only — per memory).
- `ai-search` edge function.
- Supabase schema, auth, RLS.
- Other dashboard pages (Portfolio, Watchlist, Alerts, News, Tools).

## Files touched

- edit `src/components/dashboard/AISearchHero.tsx` — add Stock/Ask AI tabs
- edit `src/pages/dashboard/DashboardHomePage.tsx` — lift ticker state, wire to analysis widgets, retitle
- edit `src/App.tsx` — drop `/dashboard/market` route
- edit `src/components/dashboard/CommandPalette.tsx` — drop Market Analysis entry
- edit `src/components/dashboard/MobileAnalysisTabs.tsx` — accept dynamic ticker prop (already does)
- delete `src/pages/dashboard/MarketPage.tsx`
- verify `src/components/dashboard/NavigationGuide.tsx` has no Market entry left
