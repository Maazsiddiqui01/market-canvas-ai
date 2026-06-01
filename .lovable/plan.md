## Goal

Reclaim vertical space by merging the navigation into the top header on desktop, and make the mobile experience feel like a native app with a fixed bottom tab bar.

## Desktop changes

**`DashboardHeader.tsx`** — turn the header into a single row: `[Logo] [Inline nav groups: Markets · My Stuff · Tools] [⌘K search] [Theme] [Avatar]`.
- Move the grouped pill nav (Markets / My Stuff / Tools) from `NavigationGuide` into the header center, using the same glass pill styling so it looks intentional.
- Header stays `fixed top-0`. On scroll, shrink padding (`py-3 → py-2`) and logo, but keep nav visible — this is the "sticks slightly so we can see" behavior the user asked for.
- Drop the separate sticky `NavigationGuide` row on desktop entirely → saves ~56px of vertical space.

**`NavigationGuide.tsx`** — desktop branch becomes a small exported `<DesktopNavPill activeTab onTabChange />` consumed by the header. Mobile branch is rewritten (below).

**`DashboardLayout.tsx`** — remove the desktop `<NavigationGuide>` render from the main content area; pass `activeTab` / `handleTabChange` into `DashboardHeader` instead. Reduce `pt-20` accordingly.

## Mobile changes (native-app feel)

**Bottom tab bar** — replace the current sticky top mobile nav with a fixed bottom tab bar, styled like the reference screenshot:
- `fixed bottom-0 inset-x-0 z-40`, `glass-strong` background, `hairline-t`, `pb-[env(safe-area-inset-bottom)]` for iPhone home indicator.
- 5 slots: **Home · AI · Portfolio · Watchlist · More**. Each slot = icon above label, active state shows colored icon + label + a 2px primary underline accent (matching the pink underline in the reference).
- "More" opens the existing bottom `Sheet` with secondary items (Alerts, News, History, Tools, Analytics).
- Min tap target 56px height, evenly distributed with `flex-1`.

**Mobile header** — keep slim top bar with just Logo + Theme + Avatar (no nav, no ⌘K — search lives in pages).

**Layout padding** — add `pb-20` to `<main>` on mobile so content doesn't hide behind the bottom bar. Mobile `PWAInstallPrompt` and any floating elements get bumped above the tab bar.

## Files touched

- `src/components/DashboardHeader.tsx` — add inline desktop nav, accept `activeTab`/`onTabChange`
- `src/components/dashboard/NavigationGuide.tsx` — export desktop pill as sub-component; rewrite mobile branch as bottom tab bar
- `src/components/layouts/DashboardLayout.tsx` — stop rendering NavigationGuide on desktop in content flow; wire props to header; add mobile bottom padding
- (verify) `src/components/PWAInstallPrompt.tsx` — bump above bottom bar on mobile

## Out of scope

n8n, Supabase, edge functions, AI search behavior, page content. Pure nav/chrome refactor.
