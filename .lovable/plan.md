## Problem

On mobile (≤390px), the top navigation packs Logo + Menu icon + Theme toggle + "Sign In" + "Get Started" into one row. There isn't enough horizontal space, so the "Get Started" button gets clipped by the viewport edge. The same crowding affects the logged-in state (Menu + ⌘K placeholder + Theme + User avatar) on narrower devices.

## Fix Plan

### 1. `src/components/DashboardHeader.tsx` — make the right cluster mobile-safe

- Logged-out state on mobile:
  - Hide the standalone "Sign In" ghost button below `sm` (it already lives inside the mobile dropdown as a fallback — I'll add a "Sign In" entry to the mobile `DropdownMenu` so it stays reachable).
  - Keep "Get Started" visible but compact (`size="sm"`, `px-3`, `text-xs` on mobile, normal on `sm+`), and use `shrink-0` + reduced `gap-1.5` on the right cluster so nothing overflows.
- Logged-in state on mobile:
  - Confirm the user avatar + theme + menu fit; tighten gap to `gap-1.5` and ensure `shrink-0` on the avatar trigger.
- Wrap the whole header row in `min-w-0` and add `overflow-hidden` on the inner container to guarantee no horizontal bleed.
- Add "Sign In" / "Get Started" links to the mobile dropdown menu (only when logged out) so the CTA is never lost.

### 2. Native-app experience audit (mobile)

Quick pass focused on the landing + auth + dashboard shells:

- Verify `viewport-fit=cover` and safe-area padding (`env(safe-area-inset-*)`) on the fixed header and bottom nav so notch/home-indicator don't overlap content.
- Ensure all tap targets in the header ≥ 44×44px (icon buttons already use shadcn `size="icon"` = 40px — bump to `h-11 w-11` on mobile where needed).
- Replace any `h-screen` on full-height mobile views with `h-dvh` to avoid the iOS URL-bar jump.
- Confirm the existing fixed bottom nav doesn't overlap the last item in scrollable lists (add `pb-[env(safe-area-inset-bottom)]` + bottom padding on main scroll containers).
- Sanity-check the hero CTA stack on 320–390px widths (no horizontal scroll, no clipped buttons).

I'll only touch the header + small CSS tweaks for safe-area / dvh — no business-logic changes.

## Files to edit

- `src/components/DashboardHeader.tsx` (header layout + mobile dropdown CTAs)
- `index.html` (viewport meta — add `viewport-fit=cover` if missing)
- `src/index.css` (safe-area utility class if not already present)
- Targeted `h-screen → h-dvh` swaps in landing/auth/dashboard shells if found

## Verification

After edits I'll open the preview at 390×797 and 320×640, screenshot the header in both logged-out and logged-in states, and confirm no clipping or overflow.
