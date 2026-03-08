

## Phase 2: UX Polish, Landing Page Features Section, and Dashboard Stats

### Verification of Phase 1 (All Complete)
- 404 page: Redesigned with brand theme, logo, background orbs, and proper buttons
- Auth redirect: Goes to `/dashboard` after sign-in (line 74) and checks existing auth (line 32)
- SEO: `sitemap.xml` with 2 public routes, `robots.txt` with Sitemap directive, JSON-LD structured data in `index.html`, canonical URL, `useDocumentTitle` hook used on all pages
- Watch Demo buttons: Replaced with "Learn More" linking to `/auth`
- Accessibility: `aria-label` on all nav buttons
- Empty states: Portfolio, Watchlist, and Alerts all have proper empty states already

### Phase 2 Implementation (This Session)

#### 1. Add a Features Section to the Landing Page
Insert a dedicated features section between the Stats/Counters section and the TrustedBy section in `src/pages/Index.tsx`. This section will showcase 6 core features with icons, titles, and short descriptions in a responsive grid. This improves SEO (more keyword-rich content) and conversion.

**Features to highlight:**
- AI-Powered Research (Brain icon)
- Real-Time Market Data (BarChart3 icon)
- Portfolio Tracking (Briefcase icon)
- Price Alerts (Bell icon)
- Watchlist Management (Eye icon)
- Data Export & Tools (Settings icon)

**File:** Create `src/components/landing/FeaturesSection.tsx`, update `src/pages/Index.tsx` to include it.

#### 2. Replace Hardcoded Dashboard Stats with Real Data
The quick stats on `DashboardHomePage.tsx` show fake numbers (+2.4%, 12, 3, 24). Replace these with live Supabase queries:
- **Portfolio Today**: Fetch from portfolio holdings + prices (or show "—" if no portfolio)
- **Watchlist Stocks**: `SELECT COUNT(*) FROM watchlists WHERE user_id = ...`
- **Active Alerts**: `SELECT COUNT(*) FROM price_alerts WHERE user_id = ... AND is_triggered = false`
- **AI Searches**: `SELECT COUNT(*) FROM ai_search_history WHERE user_id = ...`

**File:** `src/pages/dashboard/DashboardHomePage.tsx` -- add Supabase queries and loading skeletons.

#### 3. Add a Keyboard Shortcut for Search
Add a global `Cmd+K` / `Ctrl+K` shortcut to focus the search bar on dashboard pages. This is a power-user feature that adds polish.

**Files:** `src/components/dashboard/SearchHero.tsx` -- add `useEffect` with keydown listener.

#### 4. Add Loading Skeleton to Landing Page
The landing page currently shows no loading state while auth context loads. Add a brief branded loading screen.

**File:** Create `src/components/LoadingScreen.tsx` if not already polished, use it in `Index.tsx`.

### Phase 3 (Future Sessions)

These are identified but deferred:
- **Push notifications** for price alerts via service worker
- **Dark/light mode toggle persistence** across sessions
- **Performance optimization** -- lazy-load dashboard pages with `React.lazy` and `Suspense`
- **Animated page transitions** between dashboard routes
- **Social sharing** -- Open Graph images per page for better link previews
- **Offline mode** -- cache market data in IndexedDB for PWA offline access
- **Onboarding tour** -- guided walkthrough for first-time users using a tooltip stepper

### Technical Summary

**Files to create:**
- `src/components/landing/FeaturesSection.tsx`

**Files to modify:**
- `src/pages/Index.tsx` -- add FeaturesSection between Stats and TrustedBy
- `src/pages/dashboard/DashboardHomePage.tsx` -- replace hardcoded stats with Supabase queries
- `src/components/dashboard/SearchHero.tsx` -- add Cmd+K shortcut

**No new dependencies required.**

