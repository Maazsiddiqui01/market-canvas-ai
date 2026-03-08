

## Comprehensive UI/UX and SEO Audit

After reviewing the entire codebase, here are the issues and opportunities grouped by priority.

---

### A. SEO Improvements (Google Ranking)

**Current gaps:**
- No sitemap.xml
- robots.txt has no Sitemap directive
- No per-page `<title>` or meta description tags (only the static `index.html` title)
- No structured data (JSON-LD)
- No canonical URL tags
- No Open Graph tags per page (only generic ones in index.html)

**Plan:**
1. **Generate a static `public/sitemap.xml`** with all public routes (`/`, `/auth`) and proper lastmod/priority values
2. **Update `robots.txt`** to include `Sitemap: https://market-canvas-ai.lovable.app/sitemap.xml`
3. **Add a lightweight `useDocumentTitle` hook** that sets `document.title` and meta description per page (no library needed -- just `useEffect` with DOM manipulation)
4. **Add JSON-LD structured data** to the landing page (`index.html` or injected via component) for "SoftwareApplication" schema
5. **Add canonical link tag** in `index.html`

---

### B. UI/UX Improvements

#### 1. 404 Page is unstyled
The `NotFound.tsx` uses raw Tailwind with `bg-gray-100` and `text-blue-500` -- completely off-brand. Needs redesign with the app's theme, logo, and a proper "Go Home" button.

#### 2. Dashboard Home stats are hardcoded
The quick stats cards on `DashboardHomePage.tsx` show fake numbers (`+2.4%`, `12`, `3`, `24`). These should either pull real data from Supabase or be removed to avoid misleading users.

#### 3. "Watch Demo" button does nothing
Both the hero and CTA sections have a "Watch Demo" button with no `onClick` or `href`. Either link it to a video/demo or remove it.

#### 4. Landing page "Features" section is missing
There's no dedicated features section between the stats and testimonials. Adding a visual features breakdown (with icons, short descriptions) would improve conversion and SEO content.

#### 5. No onboarding/empty states
When a new user first visits the dashboard, Portfolio is empty, Watchlist is empty, no alerts. There should be friendly empty states with CTAs like "Add your first stock" instead of blank screens.

#### 6. No toast/feedback on successful navigation actions
When switching tabs on mobile (bottom nav), there's no haptic/visual feedback beyond the active state changing.

#### 7. Auth page redirects to `/` after sign-in instead of `/dashboard`
Lines 74 and 29-34 in Auth.tsx redirect to `/` (landing page). After sign-in, users should go straight to `/dashboard`.

#### 8. Accessibility gaps
- Bottom nav buttons lack `aria-label` attributes
- No `<main>` landmark on landing page (it uses `<main>` tag but nested divs obscure semantic structure)
- Feature cards in hero section lack focus-visible styles

#### 9. Landing page loading performance
- Multiple large blur effects (500px+ orbs) can cause jank on lower-end devices
- Consider reducing orb count or using `will-change: transform` / `contain: paint`

---

### C. Recommended Implementation Priority

**Phase 1 -- Quick wins (this session):**
1. Fix 404 page to match app theme
2. Fix Auth redirect to go to `/dashboard` instead of `/`
3. Add SEO essentials: sitemap.xml, updated robots.txt, per-page document titles, canonical URL
4. Remove or link the "Watch Demo" button
5. Add JSON-LD structured data to landing page

**Phase 2 -- UX polish (next session):**
6. Add empty states for Portfolio, Watchlist, and Alerts pages
7. Replace hardcoded dashboard home stats with real data or contextual CTAs
8. Add a Features section to the landing page
9. Accessibility improvements (aria-labels, focus styles)

---

### Technical Details

**Files to create:**
- `public/sitemap.xml`
- `src/hooks/useDocumentTitle.ts`

**Files to modify:**
- `public/robots.txt` -- add Sitemap directive
- `index.html` -- add canonical link, JSON-LD script
- `src/pages/NotFound.tsx` -- full redesign with app theme
- `src/pages/Auth.tsx` -- change redirect from `/` to `/dashboard` (lines 31, 74)
- `src/components/HeroSection.tsx` -- remove or link "Watch Demo" button
- `src/components/landing/CTASection.tsx` -- same for Watch Demo
- All dashboard page components -- add `useDocumentTitle` calls
- `src/components/dashboard/NavigationGuide.tsx` -- add aria-labels to nav buttons

