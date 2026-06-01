# Finish the Redesign — Visual Masterpiece + UX Clarity

Phases 1–2 (design tokens, header, nav, footer) and partial Phase 5 (Portfolio, History) are done. This plan closes out everything else and adds a dedicated UX-simplification pass so the product feels effortless, not overwhelming.

## Guiding principles

- One primary action per screen. Everything else recedes.
- Progressive disclosure: show summary first, details on demand.
- Consistent page shell: `PageHeader` (title + 1-line subtitle + primary CTA) → content → empty/loading/error states.
- Glass + hairline borders + aurora background already established — apply uniformly, no raw colors.
- Motion is subtle: fade-in, 200ms scale on hover, no bouncy distractions.

## Phase A — Landing + Auth polish

1. **Hero** — single H1, single CTA, ticker strip below, remove competing buttons.
2. **FeaturesSection** — convert to 6-tile bento grid with glass cards + icon + 1-line value prop.
3. **CTASection** — single glass panel, gradient-tint, one button.
4. **Auth page** — split-screen on desktop (brand left, form right), single glass card on mobile, inline validation, success → `/dashboard`.

## Phase B — Dashboard home (bento)

5. Rebuild `/dashboard` as a 12-col bento: Search hero (full width) → Watchlist snapshot (6) + Portfolio snapshot (6) → Top movers (4) + News (8) → Alerts (12).
6. Each tile = glass card, hairline divider, "View all →" link. No tile shows more than 5 rows.
7. Empty states with friendly illustration + 1 CTA.

## Phase C — Remaining dashboard pages

Apply unified `PageHeader` + glass card system to:
- Watchlist, Alerts, News, Top/Bottom, AI Search, Market Overview, Stock Detail, Settings, NotFound.
- Standardize tables: sticky header, zebra hairlines, right-aligned numerics, tabular-nums, color-coded deltas via tokens only.
- Standardize forms: labels above, helper text muted, inline errors, primary button right.

## Phase D — UX simplification pass

8. **Navigation** — collapse 10+ nav items into 3 clusters already grouped; add a global ⌘K command palette for power users (search stocks, jump to page, run actions).
9. **Onboarding** — first-visit dashboard shows a 3-step inline coach-mark (Search → Add to watchlist → Set alert). Dismissible, stored in localStorage.
10. **Reduce cognitive load** — remove duplicate CTAs, merge redundant widgets, hide advanced filters behind "More filters" disclosure, default sort/limit on every list.
11. **Feedback** — every async action shows a toast (success/error). Buttons show loading state. Skeletons replace spinners for content areas.
12. **Mobile** — bottom nav with 5 items max, pull-to-refresh on lists, sheet-based filters, 44px touch targets, `h-dvh` for full-height screens.

## Phase E — Cross-cutting QA

13. Replace any remaining raw color classes with semantic tokens.
14. `aria-label` on every icon-only button; visible focus rings.
15. Browser-screenshot every page at 375 / 768 / 1280 in both themes; fix regressions.
16. Lighthouse pass: lazy-load below-fold widgets, defer heavy charts.

## Technical notes

- New primitives: `PageHeader`, `StatCard`, `EmptyState`, `SectionCard`, `CommandPalette` (cmdk).
- Add `prefers-reduced-motion` guard around all animations.
- No backend/data changes — pure frontend/presentation.

## Out of scope

- Auth logic, webhook payloads, AI prompt content, DB schema.

Approve to start with **Phase A (Landing + Auth)** and roll forward; or tell me to jump to Phase D (UX simplification) first if reducing overwhelm is the higher priority.
