## Goal
Confirm the homepage header renders the Learn / Tools / Picks / Blog nav (already coded in `src/components/DashboardHeader.tsx`), and force the preview to pick up the latest build.

## Findings
- `src/components/DashboardHeader.tsx` already defines `RESOURCE_LINKS` (Learn, Tools, Picks, Blog → `learn.marketcanvasai.com`) and renders them in the desktop `<nav>` plus the mobile hamburger sheet when not in dashboard mode.
- `src/pages/Index.tsx` already mounts `<DashboardHeader />`.
- No code changes needed — the issue is a stale preview build.

## Steps
1. Restart the dev server to clear any stale Vite cache and force a fresh build.
2. Open the homepage `/` in the preview at desktop width (e.g. 1280) and confirm the four links appear in the top nav and each points to the correct `learn.marketcanvasai.com` URL.
3. Resize to mobile width (e.g. 390) and confirm the hamburger menu shows the same four links inside the sheet.
4. Check console for any runtime errors; if found, report back before touching code.
5. If links still don't appear after a clean rebuild, inspect the rendered DOM via the browser tool to determine whether `isDashboardMode` is incorrectly true on `/` and only then propose a code fix.

## Out of scope
No new nav, no duplicate links, no edits to `DashboardHeader.tsx` or `Index.tsx` unless step 5 uncovers a real bug.
