## Status check first

- **Published**: yes, public — `https://market-canvas-ai.lovable.app`. Nothing to change there.
- **PWA**: already wired (`vite-plugin-pwa`, manifest, 192/512 icons, apple-touch-icon, theme color, `viewport-fit=cover`).
- **Mobile bottom nav**: already exists (`NavigationGuide` → fixed bottom tab bar with Home/Market/AI/Portfolio + More sheet).
- **Pull-to-refresh**: already exists via `usePullToRefresh`.

So the work isn't "build mobile from scratch" — it's tightening what's already there so the new AI-first home actually feels good on a 390px screen.

## What I found that's wrong / unfinished

1. **The "Welcome back, {name}" banner is still being injected by `DashboardLayout` (lines 158-174) for `/dashboard`.** My last pass removed it from `DashboardHomePage` but the layout still renders it. The user explicitly called this pane out — it must go.
2. **`min-h-screen` everywhere** — on iOS the URL bar collapse leaves a dead strip. Should be `min-h-dvh`. Affects `DashboardLayout`, `Dashboard`, `Index`, `HeroSection`, `NotFound`.
3. **AI search hero on a 390px viewport**: `text-5xl` is too big on mobile (won't fit "Ask anything about Pakistani stocks" on one line), inner `AISearchWidget` adds its own card+padding, and the 3 instruction tiles stack to ~280px tall. Hero is ~600px before the user sees a TradingView heatmap. Needs a mobile compaction pass.
4. **`MarketOverview` pill + refresh button** sit centered on mobile and wrap awkwardly with the new hero right below them. Should be hidden on mobile on the home page (the live KSE-100 already shows on `/dashboard/market` and via the desktop layout).
5. **TradingView Heatmap iframe** on mobile is hard to read (boxes get tiny). The iframe height should drop to a usable single-column min height (~360-400px) on mobile, not the desktop default.
6. **`TechnicalAnalysis` + `FinancialAnalysis` 2-col**: works on `lg:` but on mobile they stack and each is a big iframe (~500px). Two iframes = ~1000px of scroll before the user gets to Top movers. On mobile we should collapse them into a tabbed view (Technical | Financial) so only one iframe is mounted at a time.
7. **`QuickAccessTiles`** currently `grid-cols-3 md:grid-cols-6`. On a 390px screen, 3 columns = ~110px per tile which is fine. Confirmed OK.
8. **Bottom-nav clearance**: `main` already has `pb-20 md:pb-0` ✓. But `Footer` is rendered *after* `main` and on mobile sits *behind* the fixed nav. We should hide `Footer` on mobile (or push it above the bottom-nav). Current state: footer is visually obscured.
9. **iOS input zoom**: viewport meta uses `maximum-scale=1.0, user-scalable=no`, which is an a11y warning but does prevent iOS from auto-zooming when focusing inputs. Better fix: keep the meta as-is (it's standard for app-like PWAs) AND ensure search/text inputs have `text-base` (≥16px) so iOS doesn't zoom. Audit `AISearchWidget` input — currently `text-sm` (14px). Bump to `text-base md:text-sm`.
10. **Tap-target sizing**: bottom-nav buttons are `min-w-[56px]` h≈48px ✓. The hero's instruction-hint tiles are non-interactive ✓. The header's icon buttons (theme toggle, profile) should be at least 44×44.
11. **Safe-area bottom**: `safe-area-bottom` class is used on the nav but I need to confirm the class is defined; if not, fall back to `pb-[env(safe-area-inset-bottom)]` so iPhone notch/home-indicator doesn't eat the nav.

## What I'll ship (mobile-tightening pass, no functional changes)

### A. Kill the layout-level "Welcome back" block

`DashboardLayout.tsx`: delete the whole `isHomePage && (...)` welcome section (lines ~157-174). Confirms what we already did in `DashboardHomePage` and stops the layout from injecting it back.

### B. Mobile compaction of the new home

`AISearchHero.tsx`:
- Headline: `text-2xl sm:text-3xl md:text-5xl`.
- Subhead: hide on mobile (`hidden sm:block`) — eyebrow + headline + the search box are enough; the instruction tiles below carry the "what to do" copy.
- Hero padding: `p-4 sm:p-6 md:p-10`.
- Instruction tiles: keep 1-col on mobile but tighten padding `p-2.5` and use a 2-col layout on `sm:` so it doesn't stretch.
- Bump `AISearchWidget` input font-size to `text-base sm:text-sm` to prevent iOS zoom.

### C. New `MobileAnalysisTabs` wrapper

New file `src/components/dashboard/MobileAnalysisTabs.tsx`. On mobile: shadcn `Tabs` with two values (`technical`, `financial`) — each TabContent mounts the relevant component. On `lg:` and up: render both side-by-side as today. The home page uses this wrapper instead of the raw 2-col grid. Only one TradingView iframe mounted at a time → ~500px less scroll and faster paint on mobile.

### D. Mobile-friendly TradingView wrappers

`TradingViewHeatmap.tsx` (and similar): pass a smaller `height` when `useIsMobile()` is true (~380px) instead of the desktop default. Keep desktop behavior identical. Same for `TechnicalAnalysis` and `FinancialAnalysis` (~420px on mobile, default on desktop).

### E. Hide mobile-noisy chrome on home

`DashboardLayout.tsx`:
- The `<MarketOverview/>` + refresh button row → wrap in `hidden md:flex` on the home route (still visible on Market page for context).
- `<Footer/>` → wrap in `hidden md:block` (mobile already has bottom-nav + a "Tools" tile linking everywhere the footer points). Prevents the footer from sitting behind the fixed nav.

### F. `dvh` migration

Replace `min-h-screen` with `min-h-dvh` in:
- `DashboardLayout.tsx` (loading + main wrappers)
- `Dashboard.tsx`
- `Index.tsx`
- `HeroSection.tsx`
- `NotFound.tsx`

Keeps current visuals on desktop; fixes the iOS Safari URL-bar dead zone.

### G. Safe-area + nav polish

`src/index.css`: ensure `.safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 0.5rem); }` is defined (add it if missing, leave it alone if present). Also add `padding-top: max(env(safe-area-inset-top), 0)` to the header so iPhone notch users don't have the logo eaten.

`NavigationGuide`: bump active-tab dot wrapper so it doesn't visually cut at the safe area.

### H. Tap-target audit

Confirm `DashboardHeader` icon buttons (theme toggle, profile, search/cmd-K trigger) are at least `h-11 w-11` on mobile. Bump any that are `h-10 w-10` to `h-11 w-11 md:h-10 md:w-10`.

### I. Verification

1. `bunx vitest run` — all 9 smoke tests must remain green.
2. `browser--navigate_to_sandbox` at **390×844** (iPhone 14) and **360×800** (small Android) on `/dashboard`. Screenshot full-page on each. Visually verify:
   - No "Welcome back" banner.
   - Hero fits without horizontal scroll, headline doesn't break to 3 lines.
   - Heatmap renders at usable size.
   - Mobile tabs control which analysis iframe is mounted.
   - Bottom nav is above the home indicator.
   - Footer not visible / not clipped behind nav.
3. On **768×1024** (iPad) verify the desktop 2-col layout still kicks in at `lg:` and looks right.

Since I can't log in inside the sandbox browser, the auth-protected screenshots will require the user to be signed in. If the browser hits `/auth`, I'll fall back to inspecting only public surfaces and rely on the code audit for the protected pages.

### J. Files changed

- `src/components/layouts/DashboardLayout.tsx` — remove welcome block, hide mobile MarketOverview row + Footer on home, `min-h-screen` → `min-h-dvh`, safe-area top.
- `src/components/dashboard/AISearchHero.tsx` — mobile typography + spacing.
- `src/components/ai/AISearchWidget.tsx` — input `text-base sm:text-sm` (no logic change, no payload change).
- `src/components/dashboard/MobileAnalysisTabs.tsx` — **new**.
- `src/pages/dashboard/DashboardHomePage.tsx` — swap the 2-col grid for `<MobileAnalysisTabs/>`.
- `src/components/TradingViewHeatmap.tsx`, `TechnicalAnalysis.tsx`, `FinancialAnalysis.tsx` — mobile-aware iframe height (no embed-config changes that would break the widget).
- `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`, `src/components/HeroSection.tsx`, `src/pages/NotFound.tsx` — `min-h-screen` → `min-h-dvh`.
- `src/index.css` — `.safe-area-bottom` rule (only if missing).
- `src/components/DashboardHeader.tsx` — bump icon-button hit targets on mobile if currently <44px (audit-driven, may be no-op).

### K. Guardrails

- AI search payload, n8n webhook (TICKER-only), Supabase reads/writes — untouched.
- TradingView embed config (`isTransparent`, `colorTheme`, attribution) — untouched; only the wrapping container height changes.
- All 9 smoke tests must stay green.
- No new dependencies.
- All colors stay on design tokens.

### Out of scope (call out for next pass)

- Full re-skin of the site visual language (the user said they're "not a fan of the design" — that's a directions pass).
- Adding a homescreen-install prompt UX (PWA installability already works through the browser menu).
- iOS/Android native app via Capacitor (separate decision; PWA covers what's needed for "users open it on mobile").