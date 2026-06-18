## Root cause of "I keep seeing the previous version"

The project uses `vite-plugin-pwa` (see `vite.config.ts`) with `registerType: 'autoUpdate'` and the plugin's default auto-injected registration. Two things go wrong from that setup:

1. **No preview/dev guard.** The service worker registers in every context, including Lovable's `id-preview--*.lovable.app` iframe and dev preview. Once it installs, it keeps serving its cached HTML/JS even after you ship new code.
2. **HTML is precached, not network-first.** The Workbox config only sets `globPatterns` + font runtime caching — it does not override the default navigation handler. The precached `index.html` wins on revisit, so users see the old shell pointing at chunks that may no longer exist (the "previous version" / occasional white screen / stale UI you're describing).

There is no manual `serviceWorker.register` in `src/`, so the auto-injected registration from `vite-plugin-pwa` is the only registrar — which means we control it entirely from `vite.config.ts` + one wrapper module.

## Fix plan (follows the built-in PWA skill)

### 1. `vite.config.ts` — make the SW safe and network-first

- `injectRegister: null` so the plugin stops injecting its own registration.
- `devOptions: { enabled: false }` so no SW is emitted in dev.
- Keep `registerType: 'autoUpdate'` and the existing manifest/icons.
- Add an explicit Workbox `NetworkFirst` runtime route for HTML navigations (`request.mode === 'navigate'`) with a short network timeout, so new HTML always wins when online and only falls back to cache offline.
- Keep `navigateFallbackDenylist: [/^\/~oauth/]`.
- Keep `CacheFirst` only for same-origin hashed built assets (the existing `globPatterns` precache is fine for hashed JS/CSS/images).

### 2. New `src/pwa/registerSW.ts` — single guarded registration wrapper

Refuses to register when any of these are true (and unregisters any matching `/sw.js` it finds):

- `!import.meta.env.PROD`
- `window.top !== window.self` (inside an iframe — Lovable preview)
- hostname starts with `id-preview--` or `preview--`
- hostname is or ends with `.lovableproject.com`, `.lovableproject-dev.com`, `.beta.lovable.dev`
- URL contains `?sw=off` (kill switch)

Otherwise calls `registerSW({ immediate: true })` from `virtual:pwa-register`.

### 3. `src/main.tsx` — import the wrapper once

Single `import './pwa/registerSW'` so the guarded registrar runs exactly once at boot.

### 4. Cleanup for users already stuck on the old SW

Because the SW path stays at `/sw.js`, the new Workbox build will replace the old registration on next visit. With `registerType: 'autoUpdate'` + `clientsClaim` + `skipWaiting` (Workbox defaults under autoUpdate) and the new NetworkFirst HTML rule, the next load fetches fresh HTML, the new SW activates, and the old precache is purged.

I'll also document the manual escape hatch in chat: visit `https://marketcanvasai.com/?sw=off` once to force-unregister, or hard-reload (DevTools → Application → Service Workers → Unregister) — useful if you want to clear your own browser immediately rather than wait for the auto-update.

### 5. Verification

- Build locally to confirm `sw.js` is generated and `virtual:pwa-register` resolves.
- Inspect the generated SW to confirm the NetworkFirst navigation route is present.
- Confirm in Lovable preview that no SW is registered (DevTools → Application → Service Workers should be empty inside the iframe).

## Files to change

- `vite.config.ts` (PWA options: `injectRegister`, `devOptions`, navigation NetworkFirst route)
- `src/pwa/registerSW.ts` (new — guarded wrapper)
- `src/main.tsx` (import the wrapper)

No other code paths, no business logic, no UI changes.
