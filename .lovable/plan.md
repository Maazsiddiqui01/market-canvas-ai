# Plan

## 1. Fix News "Show All" scroll UX (`src/components/NewsWidget.tsx`)

Problem: when expanded, `ScrollArea` is fixed at `h-80`, which on desktop looks like the card *shrinks*, and the Radix scrollbar only appears on hover, so users don't know it's scrollable.

Changes:
- Remove the fixed `h-80` ScrollArea wrapper when expanded. Instead, render **all** filtered items in the natural flow so the page itself scrolls (no clipped inner panel). Keeps "Show Less" to collapse back to 5.
- For the search-results case (which can be long), use a responsive max-height (`max-h-[70vh]`) only on `md+`, full flow on mobile.
- Replace `ScrollArea` with a native scroll container that uses our themed scrollbar (already defined globally in `index.css`) so the scrollbar is always visible when content overflows — works identically light/dark.
- Add a subtle bottom fade + a small "↓ more" hint that disappears once user scrolls, so it's obvious there's more content.

## 2. Redesign Recommendations page (`src/components/recommendations/RecommendationsFeed.tsx` + `src/pages/dashboard/RecommendationsPage.tsx`)

Goal: turn the current flat list into a visual masterpiece while staying inside Tailwind + design tokens (dark red / light blue dual theme).

Layout:
- Hero strip above tabs: 3 stat tiles (Total picks today, Avg conviction, Buy/Hold/Sell split as a thin segmented bar) using glass-subtle surfaces and brand gradient accents.
- Tabs (PSX / US / All) restyled as pill segmented control, sticky on scroll.
- Recommendation cards redesigned:
  - Bento-style grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`.
  - Each card: large ticker as display font, company subtitle, signal chip top-right with directional icon (TrendingUp/Down/Minus).
  - Conviction shown as a 5-dot meter + numeric.
  - Price row: Current → Target with arrow, % upside computed and color-coded.
  - Stop-loss as a muted secondary line.
  - Thesis truncated to 3 lines with "Read more" expand.
  - Sharia + data-confidence as small pill badges in footer.
  - Subtle gradient border / tint per signal using semantic tokens (no raw colors); BUY = primary/emerald glow, SELL = destructive glow, HOLD = muted.
  - Hover: lift + shadow-elegant + ticker scale.
- History drawer per card (kept) but redesigned as a slim timeline with date dots.
- Empty + loading states upgraded with skeleton cards matching the new layout.

Page shell (`RecommendationsPage.tsx`): keep `PageHeader`, add a subtle decorative gradient backdrop behind the hero stats.

## Scope guardrails
- Pure presentation: no business logic, data fetching, or schema changes.
- All colors via semantic tokens from `index.css` / `tailwind.config.ts`. No hard-coded hex.
- Works in both dark (black/red) and light (white/blue) themes.
- Mobile-first; verify in mobile viewport after build.
