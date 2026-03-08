

## Phase 3: User Tracking, Newsletter Capture, and Onboarding

### Current State
- `useActivityLog` hook exists and logs to `user_activity_log` table, but is **only used in `AISearchWidget.tsx`**
- No page view tracking anywhere
- No activity logging in WatchlistManager, PortfolioManager, PriceAlertManager, or StockComparison
- No newsletter/email capture for anonymous visitors
- No onboarding flow for new users
- No anonymous visitor analytics

### Implementation Plan

#### 1. Wire Activity Logging Into All Dashboard Pages and Actions

Add `useActivityLog` with `page_view` events to every dashboard page via `DashboardLayout.tsx` (single integration point -- logs route changes automatically).

Add action-level logging to:
- **WatchlistManager.tsx** -- log `watchlist_action` on add/remove
- **PortfolioManager.tsx** -- log `portfolio_action` on add holding/delete
- **PriceAlertManager.tsx** -- log `alert_created` on new alert
- **StockComparison.tsx** -- log `comparison` on compare action
- **SearchHero.tsx** -- log `stock_view` when a ticker is selected

#### 2. Anonymous Visitor Analytics (page_views table)

Create a new `page_views` Supabase table to track all visitors (authenticated or not):
- `id`, `page_url`, `referrer`, `user_agent`, `session_id` (generated UUID stored in sessionStorage), `user_id` (nullable), `created_at`
- RLS: INSERT open to anon+authenticated, SELECT restricted to admins via `has_role`

Create a lightweight `usePageTracking` hook that fires on every route change (in `App.tsx`) and inserts into `page_views`. No cookies needed -- just sessionStorage for session grouping.

#### 3. Newsletter Email Capture Popup

Create a new `newsletter_subscribers` Supabase table:
- `id`, `email`, `subscribed_at`, `source` (e.g. 'landing_popup', 'footer')
- RLS: INSERT open to anon, SELECT restricted to admins

Create `src/components/NewsletterPopup.tsx`:
- Shows after 10 seconds on the landing page (or on scroll past 50%)
- Dismissible, stores dismissal in localStorage so it doesn't re-appear for 7 days
- Simple email input + "Subscribe to Daily Market Insights" CTA
- Add to `Index.tsx`

Also add a compact newsletter signup in the Footer.

#### 4. First-Time User Onboarding Checklist

Create `src/components/dashboard/OnboardingChecklist.tsx`:
- Shows on DashboardHomePage for new users (detected by checking if they have 0 holdings, 0 watchlist items, 0 alerts)
- Checklist items: "Add your first stock to watchlist", "Create your portfolio", "Set a price alert", "Try AI search"
- Each item links to the relevant page
- Dismissible with localStorage flag
- Compact card at the top of the dashboard

#### 5. Admin Analytics Dashboard (optional, light)

Add a simple stats summary to the History page showing:
- Total activities by type (pie/bar breakdown from existing `user_activity_log`)
- Activity trend over last 7 days

### Database Changes (Migration)

```sql
-- Anonymous page views tracking
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views
CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read page views
CREATE POLICY "Admins can read page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'landing_popup',
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
```

### Files to Create
- `src/hooks/usePageTracking.ts` -- anonymous + auth page view logger
- `src/components/NewsletterPopup.tsx` -- email capture popup
- `src/components/dashboard/OnboardingChecklist.tsx` -- new user checklist

### Files to Modify
- `src/App.tsx` -- add `usePageTracking` hook
- `src/components/layouts/DashboardLayout.tsx` -- add `useActivityLog` page_view on route change
- `src/components/watchlist/WatchlistManager.tsx` -- add activity logging on add/remove
- `src/components/portfolio/PortfolioManager.tsx` -- add activity logging on add/delete holding
- `src/components/alerts/PriceAlertManager.tsx` -- add activity logging on create alert
- `src/components/ai/StockComparison.tsx` -- add activity logging on comparison
- `src/components/dashboard/SearchHero.tsx` -- add activity logging on ticker select
- `src/pages/Index.tsx` -- add NewsletterPopup
- `src/pages/dashboard/DashboardHomePage.tsx` -- add OnboardingChecklist
- `src/components/Footer.tsx` -- add inline newsletter signup

