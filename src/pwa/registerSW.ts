// Guarded service worker registration.
// Refuses to register in dev, Lovable preview, iframes, or when ?sw=off is set.
// Cleans up any stale /sw.js registration in those refused contexts.

const SW_PATH = '/sw.js';

function isRefusedContext(): boolean {
  if (typeof window === 'undefined') return true;
  if (!import.meta.env.PROD) return true;

  try {
    if (window.top !== window.self) return true;
  } catch {
    // Cross-origin frame access throws — treat as iframe.
    return true;
  }

  const { hostname } = window.location;
  if (
    hostname.startsWith('id-preview--') ||
    hostname.startsWith('preview--') ||
    hostname === 'lovableproject.com' ||
    hostname.endsWith('.lovableproject.com') ||
    hostname === 'lovableproject-dev.com' ||
    hostname.endsWith('.lovableproject-dev.com') ||
    hostname === 'beta.lovable.dev' ||
    hostname.endsWith('.beta.lovable.dev')
  ) {
    return true;
  }

  if (new URLSearchParams(window.location.search).get('sw') === 'off') return true;

  return false;
}

async function unregisterMatching(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs
        .filter((r) => {
          const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || '';
          return url.endsWith(SW_PATH);
        })
        .map((r) => r.unregister()),
    );
  } catch {
    // no-op
  }
}

if (isRefusedContext()) {
  void unregisterMatching();
} else {
  // Dynamic import so the virtual module is only evaluated in real production contexts.
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {
      // Plugin not available — ignore.
    });
}
