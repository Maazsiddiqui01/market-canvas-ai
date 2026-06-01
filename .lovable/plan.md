## World-Class UI/UX Audit & Redesign Plan

Goal: bring every page (landing, auth, dashboard, 404) to a world-class investment-product bar — glassmorphism, consistent spacing/typography, polished motion, perfect mobile.

---

### QA Matrix (applied to every page)

Each page is graded against:

1. **Visual hierarchy** — clear H1/H2/H3, scannable, one primary CTA per view
2. **Spacing & rhythm** — 8px grid, consistent section padding, breathing room
3. **Typography** — semantic tokens, no orphan font-sizes, proper line-height
4. **Color & theme** — only design tokens, dark + light parity, no raw hex/tailwind colors
5. **Glassmorphism & depth** — layered surfaces, subtle borders, backdrop-blur, soft shadows
6. **Motion** — entrance fade/slide, hover micro-interactions, page transitions, reduced-motion respected
7. **Responsiveness** — mobile (375), tablet (768), desktop (1280+); no horizontal scroll
8. **Touch targets** — ≥44×44, bottom-nav clearance on mobile
9. **Accessibility** — alt text, aria-labels on icon buttons, focus rings, contrast AA
10. **Empty / loading / error states** — skeletons, friendly empties, retry on errors
11. **Consistency** — same header, card, button, badge patterns across pages
12. **Performance** — lazy images, no layout shift, code-split routes

---

### Phase 1 — Design System Foundation

Refine `index.css` + `tailwind.config.ts`:

- Add glass surface tokens: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-blur` (dark + light)
- Add elevation scale: `--elevation-1..4` shadows
- Add gradient tokens: `--gradient-hero`, `--gradient-card`, `--gradient-accent`
- Standard section paddings: `section-y`, `container-x`
- New shadcn variants: `Card` (glass, elevated, flat), `Button` (premium, glass), `Badge` (status colors)
- Unified `PageHeader`, `SectionHeader`, `StatCard`, `EmptyState`, `LoadingState`, `ErrorState` primitives in `src/components/ui/`

---

### Phase 2 — Landing Page (`/`)

`Index.tsx`, `HeroSection`, `landing/*`, `MarketOverview`, `Footer`:

- Tighten hero: stronger H1, single primary CTA, refined particle/data-flow background, glass stat chips
- Redesign Features section into a bento grid with glass cards + icon gradients
- Trusted-by + testimonials: marquee polish, consistent card heights
- Pricing/CTA section: glass pricing-style call-to-action
- Footer: column alignment, inline newsletter polish, social icons with proper aria-labels
- Mobile: hero copy scaling, CTA stacking, remove any horizontal overflow

---

### Phase 3 — Auth Page (`/auth`)

`Auth.tsx`:

- Split-screen on desktop: left = brand panel with gradient + ticker visual; right = form
- Single-column glass card on mobile
- Tabs (Sign in / Sign up) with smooth indicator
- Inline validation, loading states on submit, success toast → `/dashboard`
- Social proof line + footer link back to landing
- Logo + theme toggle in corner, consistent with app shell

---

### Phase 4 — Dashboard Shell

`Dashboard.tsx`, `DashboardHeader`, `NavigationGuide`, `layouts/*`, bottom nav:

- Unified app shell: sticky glass header (logo, search, theme, profile), desktop sidebar OR top nav (pick one — recommend top nav since current pattern), mobile bottom nav with active indicator pill
- Consistent page wrapper with `PageHeader` (title, subtitle, actions) on every page
- Page transitions via existing `PageTransition`

---

### Phase 5 — Dashboard Pages (one pass per page, same QA matrix)

For each: redesign hero/header, convert cards to glass system, fix spacing, add empty/loading/error states, verify mobile.

- **DashboardHomePage** — stat cards row, search hero, recent activity, onboarding checklist (kept but restyled)
- **MarketPage** — KSE-100 hero stat, gainers/losers/heatmap in unified grid
- **AIToolsPage** — search hero + result card, comparison tool styled as side-by-side glass panels, markdown rendering polish
- **PortfolioPage** — summary stat strip (value, P&L, day change), holdings table → responsive card list on mobile, add-holding sheet
- **WatchlistPage** — list with inline sparkline, swipe-to-delete on mobile
- **AlertsPage** — active vs triggered tabs, alert cards with status badges
- **NewsPage** — magazine-style: featured + grid, source chips, filter bar
- **HistoryPage** — timeline grouped by day, filter by type
- **ToolsPage** — bento grid of tools with icon + description
- **AdminAnalyticsPage** — KPI cards row, chart cards, recent activity table (admin-only gate kept)

---

### Phase 6 — Auxiliary

- **NotFound** — center glass card, brand orbs, primary CTA back to dashboard
- **LoadingScreen** — refined spinner with logo pulse
- **NewsletterPopup / PWAInstallPrompt** — confirm removed/disabled per prior request; remove leftover triggers if present
- **Toasts** — glass styling, status colors, top-right desktop / top-center mobile

---

### Phase 7 — Cross-cutting Polish

- Replace any raw color usage with tokens (sweep `text-white|bg-black|text-gray-*`)
- Icon-only buttons: add `aria-label`
- Replace `h-screen` with `h-dvh` for mobile
- Verify focus-visible rings on all interactive elements
- Run accessibility + design QA pass with browser screenshots at 375 / 768 / 1280

---

### Phase 8 — QA Verification

For each page: capture screenshots at mobile + desktop, both themes, walk the QA matrix, list pass/fail, fix regressions. Final summary report back to you.

---

### Delivery

Phases shipped sequentially (1→8). After each phase I post a short verification note with screenshots so you can sign off before I move on. No backend/data changes — purely frontend, presentation, and design-system work.