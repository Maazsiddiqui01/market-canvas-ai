# market-canvas-ai — Prioritized Improvement Plan

Synthesized from a multi-agent audit. Findings below were **verified against the real source** at `C:\Users\PMLS\AppData\Local\Temp\mcanvas` (file:line confirmed). Two of the three audit agents received broken input (the orchestrator substituted the literal string `"undefined"` for the app name/path and could not locate the code) — their *code-level* findings are therefore absent, but the two real, high-confidence findings they surfaced from adjacent materials (a secret-exposure issue and the orchestration bug itself) are folded in below and flagged as **needs-confirmation** where I could not verify them in this checkout. The AI-feature dimension (AISearchWidget, StockComparison, AIToolsPage) was **never audited** — see "Coverage Gaps" at the end; those components exist locally and should be re-audited.

Severity mapping: audit `BLOCKING` -> **P0**, `SHOULD_FIX` -> **P1**, `CONSIDER` -> **P2**.

---

## Top 5 Quick Wins
Small, high-confidence, low-risk. Each is a contained change with clear payoff.

1. **Remove the random news shuffle; sort newest-first.** Delete `.sort(() => Math.random() - 0.5)` in `src/services/newsService.ts` (lines 73 and 124). Biased, non-deterministic, makes headlines jump on every refresh. (P1-D)
2. **Always clear loading state in a `finally`.** `WatchlistManager.fetchWatchlist` (`src/components/watchlist/WatchlistManager.tsx:39-46`) and `PortfolioManager.fetchPortfolios` (`src/components/portfolio/PortfolioManager.tsx:86-102`) only set `loading=false` on success; an error `return`s and leaves a permanent spinner. One-line fix each. (P0-D / P1-C)
3. **Delete `WatchlistWidget.tsx`.** Confirmed unimported (grep finds only its own `export default`); ships hardcoded fake prices that must never reach prod. Removing it also kills the risk of someone wiring up the mock by mistake. (P1-C)
4. **Stop hardcoding `refreshTrigger={0}` for TopBottom5.** `src/pages/dashboard/DashboardHomePage.tsx:38` pins it to `0`, so the home "Refresh All" button spins but never reloads the top-movers module. Pass the real `refreshTrigger`. (P2-C)
5. **Fix or trim the Tools page subtitle.** `src/pages/dashboard/ToolsPage.tsx:12` promises "manage preferences" but the body is a 2-col grid (`line 15`) with a single `<ExportManager />`, leaving a dead right column. Either drop `lg:grid-cols-2` or trim the subtitle to match what ships. (P2-A)

---

## Top 3 High-Impact Features
The product-level moves that most increase trust and usefulness.

1. **Make the Watchlist a real watchlist (wire live prices).** Today it renders zero quotes — a static green arrow per row and "Added \<date\>". The `get-stock-prices` edge function already exists and is used in `PortfolioManager` (`PortfolioManager.tsx:162`). Reuse it here. This is the single biggest credibility gap. (P0-A)
2. **Ship the Recommendations / "Today's Picks" page.** A page reading a `public_recommendations` Supabase view is reportedly already built on a branch — **note: that branch is NOT in this checkout** (only `main` exists locally; no `public_recommendations` reference found in `src/` or `supabase/`). Locate/merge it. This turns the app from "look stuff up yourself" into "here's what to act on today," and is the highest-leverage net-new surface. Confirm the underlying view enforces row-level security / exposes only intended public data before going live.
3. **Add a Preferences surface (and fill the empty Tools page).** Default sector, price-refresh interval, theme, and email/SMS alert opt-in. This both fulfills the existing Tools-page promise (P2-A) and is the natural home for the alert-channel controls the alerts feature implies. Medium effort, high perceived polish.

---

## P0 — Must-Fix (bugs / misleading-data / trust)

These actively mislead users of a **finance** product or leave core features non-functional.

### P0-A. Watchlist shows no prices despite promising "live prices" (core feature is hollow)
- **What:** `WatchlistPage.tsx:12` advertises "Monitor the stocks you care about with live prices and quick research," but `WatchlistManager.tsx` never fetches or renders a price. Every row shows a fixed `TrendingUp` icon (`:166-168`), the name falls back to the literal `'PSX Stock'` (`:172`), and the only datum is "Added \<date\>" (`:187-189`). **Verified:** no `get-stock-prices`/price call exists in the file.
- **Why it matters:** A watchlist with no quotes, no % change, and no research link is not a watchlist. It's the clearest broken-promise in the app. Ironically the dead `WatchlistWidget.tsx` already hardcodes the "good" layout (price + `TradingViewMiniChart`), so the intended UX is known.
- **Files:** `src/components/watchlist/WatchlistManager.tsx` (159-191); promise at `src/pages/dashboard/WatchlistPage.tsx:12`.
- **Change:** After `fetchWatchlist`, call `supabase.functions.invoke('get-stock-prices', { body: { tickers } })` (same pattern as `PortfolioManager.tsx:162`) and render price + colored % change per row, with the up/down icon driven by the `changePercent` sign instead of a fixed `TrendingUp`. Show a per-row "Loading…" placeholder until prices arrive, add a per-row "View / Analyze" link to `/dashboard/ai-tools` (or a `TradingViewMiniChart`), and a 30s auto-refresh like the portfolio. Replace the `'PSX Stock'` fallback with the real name via `getStockByTicker`. **If prices can't ship now, change the subtitle so it stops promising them.**

### P0-B. MarketOverview presents hardcoded fake KSE-100 data behind a permanent "Live" badge
- **What:** On any fetch failure or while loading, `MarketOverview.tsx` falls back to hardcoded literals — value `'79,843.25'`, change `'+423.67'`, `'+0.53%'`, `isPositive: true` (**verified `:59-66`**) — while the pulsing "Live" badge is rendered **unconditionally** (`:72-75`). The catch only `console.error`s (`:42-44`); there is no loading or error/stale state.
- **Why it matters:** Users can be shown completely fabricated index numbers labeled "Live" during an n8n/network outage. For a finance app this is a direct trust/credibility hazard. This pill renders on the dashboard home via `DashboardLayout` (`showMarketOverview`).
- **Files:** `src/components/MarketOverview.tsx` (42-44 catch, 57-67 hardcoded fallback, 72-75 always-on badge).
- **Change:** Remove the hardcoded fallback numbers entirely. Track a status: while loading show a skeleton/`—`; on success show data + a relative "as of \<time\>"; on error show a muted "Market data unavailable" with a small retry. Only render the pulsing "Live" badge when a successful fetch returned **fresh** data (within the last refresh interval). Never substitute invented values for real market data.

### P0-C. Landing-page stats and testimonials are fabricated
- **What:** `Index.tsx` (`:34-37`) hardcodes marketing vanity metrics via `AnimatedCounter` — "10,000+ Active Traders," "500+ PSX Stocks," "99.9% Uptime," "24/7 AI Monitoring" — and renders a `TestimonialSection` for what is a single-developer app (`Footer` credits "Built by Maaz").
- **Why it matters:** Invented user counts, uptime SLAs, and testimonials on a financial product are a reputational and potentially legal risk, compounding the fake "Live" data in P0-B. First-screen dishonesty undermines everything below it.
- **Files:** `src/pages/Index.tsx` (31-50); `src/components/landing/TestimonialSection.tsx`.
- **Change:** Replace invented numbers with real, defensible facts (e.g., "500+ PSX symbols tracked" *only if* the `Stocks` table truly holds them; "AI-powered analysis with cited sources"). Remove or clearly label testimonials until real ones exist. Honest capability statements convert better and carry no liability.

### P0-D. Read-path errors are swallowed; UI sticks on infinite spinner / misleading empty state
- **What:** Multiple fetches handle errors with only `console.error` + early `return`. Two leave a permanent spinner because `loading=false` is on the success branch only: `PortfolioManager.fetchPortfolios` (**verified `:92-101`**) and `WatchlistManager.fetchWatchlist` (**verified `:39-46`**). Others fail silently: `fetchHoldings` (`:111-114`), `fetchAllPositions` (`:129-132`), `fetchPrices` catch (`:171-174`), and `NewsWidget` setting `news=[]` with no "failed to load" message.
- **Why it matters:** A transient Supabase/n8n hiccup is indistinguishable from "empty" or hangs forever, with no recovery path. Users can't tell broken from empty and have no retry.
- **Files:** `src/components/portfolio/PortfolioManager.tsx` (92-101, 111-114, 171-174); `src/components/watchlist/WatchlistManager.tsx` (39-46); `src/components/NewsWidget.tsx` (~51-54).
- **Change:** In every read path, set `loading=false` in a `finally`, add an `error` state, and render an inline error card with a Retry button. **A reusable `<ErrorState onRetry/>` should be added** — there is already an `EmptyState` component at `src/components/ui/empty-state.tsx` to mirror. For `NewsWidget`, distinguish "no results" from "failed to load." Show a destructive toast on initial-load failures so the failure is noticed. (Quick-win #2 covers the two spinner-lockups specifically.)

### P0-E. (Needs confirmation) Live API keys committed in plaintext in an adjacent project's `.env.txt`
- **What:** The AI-features agent reported `psx-analyst-agent/.env.txt` (a OneDrive-synced sibling repo, **not** this one) holding six unredacted live secrets in plaintext: `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `XAI_API_KEY`, and a GitHub token. The Perplexity key is the credential behind the stock-research backend this app calls.
- **Why it matters:** Plaintext keys in a cloud-synced `.txt` are exposed via OneDrive sync and accidental sharing; the GitHub token risks repo write access. Mirrors a previously tracked light-crm `.env` exposure.
- **Files:** Outside this repo — `...\psx-analyst-agent\.env.txt`. **Could not verify from within this checkout; treat as a real lead, not a confirmed market-canvas-ai issue.**
- **Change:** Treat all six as compromised — rotate at each provider console now. Delete the plaintext file; move secrets into a gitignored, OneDrive-excluded store (n8n credentials / Supabase Vault / systemd `EnvironmentFile` with `600` perms). **Then grep this repo (`src/`, `supabase/functions/`) to confirm none of these keys are hardcoded here too.** Note: the n8n webhooks this app calls are hardcoded to `n8n.80.225.213.232.sslip.io` (`MarketOverview.tsx:28`, `newsService.ts:42`), the same host that backend lives on.

---

## P1 — High-Value UX & Features

### P1-A. TopBottom5 has no loading / empty / error state — renders blank tables under a "Live Data" badge
- **What:** `TopBottom5.tsx` sets `loading=true` (`:17`) but **never reads it in render** (verified). On error it only `console.error`s and keeps prior data (`:22-27`); on first load/failure `top5`/`bottom5` are empty, so the component renders two cards with header rows and zero data under a confident "Live Data" badge (`:53-56`). Prominent on `DashboardHomePage` (`:38`).
- **Why it matters:** A flagship home module looks broken on slow networks or backend hiccups, with no explanation.
- **Files:** `src/components/TopBottom5.tsx`; service `src/services/topBottomService.ts` (throws on `!ok`, no fallback).
- **Change:** Add three states: (1) while loading, render 5 skeleton rows per table (reuse the `Skeleton` pattern from `PriceAlertManager`/`RecentSearches`); (2) if `stocks.length === 0` post-load, render an empty/error message with a Retry that re-calls `loadData`; (3) store an `error` string and show "Couldn't load top movers — Retry." Make the "Live Data" badge conditional on data being present.

### P1-B. Inconsistent ticker entry — Portfolio validates, Watchlist & Alerts accept arbitrary free text
- **What:** `AddHoldingDialog` uses the validated `StockSelector` (searches the `Stocks` table, shows name+sector, has a "No stocks found" state). But `WatchlistManager.tsx` (`:116-130`) and `PriceAlertManager.tsx` (verified raw `Input` at `:280-285`) take an uppercased free-text ticker with no validation. **Verified:** `StockSelector` is imported only by `AddHoldingDialog`.
- **Why it matters:** A user can add `XYZ123` or a typo to a watchlist/alert; it silently never resolves to a price or triggers, with zero feedback. The optional free-text "Stock Name" lets names drift from canonical.
- **Files:** `src/components/watchlist/WatchlistManager.tsx` (116-135); `src/components/alerts/PriceAlertManager.tsx` (278-295); reuse `src/components/portfolio/StockSelector.tsx`.
- **Change:** Replace the raw ticker `Input`s in both with the shared `StockSelector` so users pick a real PSX symbol (auto-filling canonical `stock_name`, removing the manual name field). Guarantees the ticker resolves to a real quote and makes all three add-flows consistent. **Note the dependency on P0-A:** once watchlist rows fetch prices, an unvalidated ticker silently shows no quote — so this should land with or before the price wiring.

### P1-C. Dead/mock components and an orphaned dashboard page shipped in the bundle
- **What:** **Verified unimported** (grep finds only each file's own `export`/interface, no import sites): `WatchlistWidget.tsx` (hardcoded mock prices), `PortfolioWidget.tsx`, `StockSearch.tsx` (**993 lines / ~41KB**), `EmailWidget.tsx`, `FeedbackSection.tsx`, `NewsletterPopup.tsx`, `TopGainers.tsx`, `TopLosers.tsx`. The audit additionally reports `src/pages/Dashboard.tsx` as an alternate dashboard not referenced in `App.tsx` routing.
- **Why it matters:** Two "dashboards" and two "watchlists" confuse maintenance, risk someone wiring the mock-data widget into prod, and bloat the build.
- **Files:** the eight components above + `src/pages/Dashboard.tsx`.
- **Change:** Delete the unused components (git preserves history). For `pages/Dashboard.tsx`, **confirm there is no route/import in `App.tsx` first**, then delete. If any are intended future work, move to a clearly-marked `_unused/` folder or gate behind a feature flag. **At minimum delete `WatchlistWidget.tsx` immediately** (quick-win #3) so its fake prices can never ship.

### P1-D. News feed order randomized on every fetch
- **What:** `newsService.ts` shuffles results with `sort(() => Math.random() - 0.5)` for both live (`:73`) and mock (`:124`) data. Not newest-first, order changes every refresh, and the shuffle is statistically biased. The `time` field is a raw display string (`'1 hour ago'`/`publishedAt`, `:65`) that's never parsed, so it can't be sorted chronologically as-is.
- **Why it matters:** A market news feed that reshuffles on every refresh feels broken and unsortable; users expect newest-first.
- **Files:** `src/services/newsService.ts` (73, 124); rendering in `src/components/NewsWidget.tsx`.
- **Change:** Remove both shuffles. Sort by publish time descending — parse `time` into a `Date`, or (better) have the webhook return an ISO timestamp and keep the human string for display only. If source diversity matters, interleave deterministically, not randomly.

---

## P2 — Polish / Perf

### P2-A. Tools & Export page is nearly empty
- **What:** `ToolsPage.tsx:12` promises "Export your data, manage preferences, and access additional utilities," but the body is `grid lg:grid-cols-2` (`:15`) holding only `<ExportManager />` — a dead right column on desktop, no preferences/utilities. Reads as unfinished.
- **Files:** `src/pages/dashboard/ToolsPage.tsx` (9-19).
- **Change:** Either fill the second column with the Preferences card (default sector, refresh interval, theme, alert opt-in) + an account/data-management card — see High-Impact Feature #3 — or drop `lg:grid-cols-2` so `ExportManager` spans naturally and trim the subtitle. (Quick-win #5 is the fast version; the feature is the full version.)

### P2-B. "Refresh All" and pull-to-refresh fake their work
- **What:** `DashboardLayout.handleRefreshAll` just increments `refreshTrigger` behind a 1s `setTimeout` spinner (`:114-120`); pull-to-refresh awaits an 800ms timeout (`:70-75`). `refreshTrigger` reaches `MarketOverview`, but on the home page `TopBottom5` is hardcoded to `refreshTrigger={0}` (`DashboardHomePage.tsx:38`) and the `AISearchHero`/heatmap don't consume it — so the prominent Refresh button spins without reloading most home content.
- **Why it matters:** The control gives false feedback — it appears to refresh but doesn't.
- **Files:** `src/components/layouts/DashboardLayout.tsx` (70-75, 114-120, 181); `src/pages/dashboard/DashboardHomePage.tsx` (38).
- **Change:** Pass the real `refreshTrigger` to `TopBottom5` and any other live home modules (quick-win #4), and key the spinner off actual in-flight fetches so it stops when data has truly reloaded. Remove the artificial `setTimeout` delays.

---

## Suggested Sequencing
1. **Quick wins #2 + #3** (spinner-lockup `finally` fixes + delete `WatchlistWidget`) — minutes, removes a fake-price hazard and two hangs.
2. **P0-B + P0-C** (kill fake "Live" market data and fabricated landing stats) — small, removes the worst trust risks.
3. **P0-A + P1-B together** (watchlist prices + `StockSelector` everywhere) — the marquee fix; do them as one change so unvalidated tickers don't render blank quotes.
4. **P0-D + P1-A** (standardize an `<ErrorState onRetry/>` and apply it to TopBottom5, portfolio, news) — one reusable component, many call sites.
5. **P1-C + P1-D + P2 polish** (dead-code purge, deterministic news sort, real refresh, Tools page).
6. **High-Impact #2** (locate/merge the Recommendations branch) — net-new surface, separate track.
7. **P0-E** (secret rotation) — out-of-band ops task; do immediately if confirmed, independent of the code work.

## Coverage Gaps (re-audit needed)
- **AI features were never audited.** `AISearchWidget.tsx`, `ai/StockComparison.tsx`, and the AI tools page exist locally (`src/components/ai/`, `src/components/dashboard/AISearchHero.tsx`) but the assigned agent received `"undefined"` as the path and never ran. Re-dispatch an audit of prompt quality, citation/source display, streaming-vs-blocking, hallucination guards, and whether **Sharia status and data freshness** are surfaced.
- **Accessibility / mobile / PWA was never audited** for the same `"undefined"`-input reason. Re-run against this path.
- **Fix the orchestration bug:** the dispatch script interpolated an unset variable, so two of three subagents got `"undefined"` for app name and path. Resolve the real path before re-dispatching so future dimension audits hit the actual target (`C:\Users\PMLS\AppData\Local\Temp\mcanvas`).