## UI/UX Audit — Market Canvas AI

### What's wrong today (from the screenshots + code review)

**Dashboard home (`/dashboard`)**
- The welcome block, KSE-100 ticker pill, 9-tab navigation, stat cards, and feature grid all stack with the same vertical rhythm → no hierarchy, no "above the fold" focal point. Looks like a settings page, not a trading dashboard.
- The big "Welcome back, Muhammad Maaz!" is the loudest element on a *data* product. Pros (Robinhood, Public, Tiger Brokers) lead with portfolio value or market state — not a greeting.
- Feature cards use 6 different rainbow gradients (orange, purple, green, blue, yellow, indigo). Looks toy-like, not premium. World-class finance UIs use restrained palettes (1 brand color + neutrals + semantic green/red).
- Stat cards use pastel tinted backgrounds (green/blue/yellow/purple) — clashes with the orange brand.
- No real data density on the home screen: just nav into other pages. Top brokerages show actual portfolio chart, top movers, watchlist preview *on* home.

**Market page (screenshot 2)**
- Search dropdown overlaps the sticky nav tab bar → broken z-index layering (tabs visible *through* dropdown).
- Massive grey rectangle below "Market Heatmap" header — loading state has no skeleton/shimmer, just an empty box.
- Welcome greeting repeats on every subpage, wasting prime real estate.

**Navigation (9 tabs)**
- 9 tabs in a horizontal strip on desktop is too many; on mobile the bottom bar + "More" is already correct, but desktop still over-stuffs.
- Tabs are pill icons with text → no visual indication of grouping (Market vs My Stuff vs Tools).

**Global**
- No glass morphism anywhere despite that being the brief.
- Header is plain solid; no blur, no translucency over content.
- Cards are flat shadcn defaults — no depth, no premium feel.
- Background is flat `bg-background`; no subtle gradient mesh, noise, or aurora.
- Footer is full-width with no separator; sits awkwardly under the dashboard.
- Typography hierarchy is weak — H1 (welcome), H2 (Explore Features), card titles all feel similar in weight.
- Light mode is bright white with no warmth — looks unfinished vs the dark theme.
- Spacing is inconsistent: `space-y-8` between sections but cards inside use `gap-4` and `gap-6` interchangeably.

---

### Reference language we'll borrow

- **Robinhood / Public** — portfolio-first home, calm neutrals, single accent color, generous whitespace
- **Linear / Arc** — glass header that frosts content on scroll, soft inner shadows, hairline borders at `1px solid white/8%`
- **Vercel dashboard** — bento grid composition, mixed card sizes
- **Apple Stocks / Tiger Brokers** — chart-first, data dense without feeling crowded
- **Stripe** — restrained color, semantic green/red only for P&L

---

### Phased plan

#### Phase 1 — Design system foundation (no visible feature changes, sets the substrate)
- Rewrite `index.css` design tokens: refined neutral scale, single brand accent, semantic up/down colors, true glass tokens (`--glass-bg`, `--glass-border`, `--glass-blur`), elevation scale (`--elev-1`…`--elev-4`), aurora gradient tokens.
- Add Tailwind utilities: `.glass`, `.glass-strong`, `.glass-subtle`, `.hairline`, `.elev-1/2/3`, `.aurora-bg`.
- Add subtle full-page aurora/mesh background layer (fixed, behind content, both themes).
- Tighten light mode: warm off-white base, true ink text, properly toned cards.
- Retire the 6 rainbow card gradients in favor of one brand-tinted gradient + monochrome icon tiles.

#### Phase 2 — Global chrome (header, nav, footer)
- Convert `DashboardHeader` to glass: backdrop-blur, hairline bottom border, becomes more opaque on scroll.
- Redesign `NavigationGuide`:
  - Desktop: group into 3 clusters (Markets · My Stuff · Tools) with subtle dividers, glass pill background, active state = filled glass + brand glow.
  - Fix z-index so search dropdowns render *above* the sticky nav (raise dropdown to `z-[60]`, nav stays `z-40`).
- Footer: hairline top border, denser layout, sits inside max-width container.
- Move the global "Welcome back" out of `DashboardLayout` so it only appears on the home page, not every subpage.

#### Phase 3 — Dashboard home redesign (bento + portfolio-first)
- Replace current vertical stack with a bento grid:
  ```text
  ┌────────────────────────┬───────────────┐
  │  Portfolio value +     │  KSE-100 live │
  │  sparkline (large)     │  + change %   │
  ├──────────┬─────────────┼───────────────┤
  │ Top      │ Watchlist   │  Active       │
  │ movers   │ preview     │  alerts feed  │
  ├──────────┴─────────────┴───────────────┤
  │  Quick actions: AI Search · Compare    │
  └────────────────────────────────────────┘
  ```
- All cards use glass tokens, hairline borders, hover lift.
- Smaller, secondary "Welcome back" moved to top-left in muted text.
- Onboarding checklist becomes a dismissible glass card in the top-right slot for new users only.

#### Phase 4 — Market page
- Two-column responsive layout: left = heatmap + technical + financial (tabs), right = market snapshot, top gainers/losers, sector breakdown.
- Real skeleton loaders (shimmer) for heatmap and chart slots — no more grey rectangles.
- Search dropdown z-index fix verified here.

#### Phase 5 — AI Tools, Portfolio, Watchlist, Alerts pages
- Apply the same glass card system, consistent section headers (eyebrow + title + helper text pattern), empty states with illustration + CTA.
- Portfolio: add allocation donut + performance sparkline at the top, holdings table below with sticky header.
- Watchlist: convert from list rows to data-dense cards with mini sparkline per stock.
- Alerts: split active vs triggered with tabs, glass row design.

#### Phase 6 — News, History, Tools, Admin Analytics, Auth, 404
- News: magazine-style card grid with source chip + time + summary.
- History / Tools / Admin Analytics: clean table-driven layouts on glass surface.
- Auth page: glass login card centered over aurora background, brand logo above.
- 404: align with new system.

#### Phase 7 — Motion & polish pass
- Page transitions (already using framer-motion) tuned to be subtle (12px slide + fade, 200ms).
- Card hover: 1px lift + brand-tinted shadow.
- Numbers animate on mount (count-up).
- Scroll-linked header opacity.
- Final QA across light/dark, mobile/tablet/desktop, all routes.

---

### Technical notes
- All changes stay in `src/index.css`, `tailwind.config.ts`, `src/components/**`, and `src/pages/**`. No DB / edge-function / business-logic changes.
- Each phase ships independently and is visibly verifiable in preview.
- Estimated scope: Phase 1–2 = foundation (must land together). Phase 3 = biggest visible win. Phases 4–6 = page-by-page rollout. Phase 7 = final polish.

Tell me to start with **Phase 1 + 2** (foundation + chrome) and I'll execute, then we move page by page.