

## Mobile UI/UX Optimization Plan

After reviewing the codebase, here are the key mobile issues and fixes:

### Problem Areas Identified

1. **NavigationGuide (Tab Bar)** -- 9 horizontal tabs with `overflow-x-auto` but no visual scroll affordance. On mobile, users can't discover tabs beyond the visible 3-4. This is likely the main pain point ("hard to go to other tabs").
2. **SearchHero** -- The search bar has a sector filter (140px), input, and button all in one row. On mobile this gets cramped or overflows.
3. **MarketOverview** -- `inline-flex` layout with multiple elements will overflow on small screens.
4. **DashboardLayout Welcome Section** -- Takes excessive vertical space on mobile before content appears.
5. **Landing page (HeroSection)** -- Font sizes (5xl-8xl) and large orb backgrounds may cause overflow or performance issues on mobile.
6. **Footer** -- Grid layout needs better mobile stacking.

### Implementation Plan

#### 1. Replace NavigationGuide with Mobile Bottom Navigation Bar
On mobile, convert the 9-tab horizontal scroll into a **fixed bottom navigation bar** showing 5 primary tabs (Home, Market, AI, Portfolio, More). The "More" tab opens a drawer/sheet with remaining tabs (Watchlist, Alerts, News, History, Tools). On desktop, keep the current horizontal nav.

#### 2. Fix SearchHero Mobile Layout
- Stack the sector filter above the search input on mobile instead of inline
- Make the search button full-width below the input on mobile
- Ensure the dropdown suggestions don't get clipped

#### 3. Fix MarketOverview for Mobile
- Stack the elements vertically or make them wrap
- Reduce font sizes on mobile
- Allow horizontal scroll with visible indicators

#### 4. Compact Welcome Section on Mobile
- Reduce padding and font sizes on mobile (`py-3` instead of `py-6`)
- Hide the subtitle text on mobile
- Make the sparkle icon smaller

#### 5. Landing Page Mobile Polish
- Reduce hero headline sizes further on small screens (4xl max on mobile)
- Ensure feature cards have proper mobile padding
- Fix DashboardMockup overflow on small screens
- Ensure CTA buttons stack properly

#### 6. Footer Mobile Fix
- Ensure single-column stacking on mobile
- Reduce padding

### Technical Details

**Files to modify:**
- `src/components/dashboard/NavigationGuide.tsx` -- Add mobile bottom nav with "More" drawer
- `src/components/layouts/DashboardLayout.tsx` -- Add bottom padding for mobile nav bar, compact welcome section
- `src/components/dashboard/SearchHero.tsx` -- Responsive search bar layout (lines 648-705)
- `src/components/MarketOverview.tsx` -- Mobile-responsive wrapping
- `src/components/HeroSection.tsx` -- Mobile typography and spacing tweaks
- `src/components/landing/DashboardMockup.tsx` -- Mobile overflow fix
- `src/components/Footer.tsx` -- Minor mobile spacing

**New dependencies:** None needed (using existing vaul Drawer component).

**Approach for bottom nav:**
```text
Desktop (>=768px):
┌──────────────────────────────────────┐
│  Home  Market  AI  Portfolio  ...    │  ← sticky horizontal bar (current)
└──────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────────────────┐
│           [page content]             │
│                                      │
├──────┬──────┬──────┬──────┬──────────┤
│ Home │Market│  AI  │Port. │  More ▲  │  ← fixed bottom bar
└──────┴──────┴──────┴──────┴──────────┘
       "More" opens a bottom sheet
       with: Watchlist, Alerts, News,
       History, Tools
```

