import { useEffect } from 'react';

const SITE_ORIGIN = 'https://marketcanvasai.com';

/**
 * Sets per-route head metadata: <title>, <meta name="description">,
 * <link rel="canonical">, and og:title/og:description/og:url.
 * Each tag self-references the current route so social previews and
 * canonical signals stay aligned with what the user is viewing.
 */
export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const path = window.location.pathname + window.location.search;
    const canonicalUrl = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

    const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      const prev = el?.getAttribute(attr) ?? null;
      if (el) el.setAttribute(attr, value);
      return { el, prev };
    };

    const restorers: Array<() => void> = [];

    if (description) {
      const { el, prev } = setMeta('meta[name="description"]', 'content', description);
      if (el && prev !== null) restorers.push(() => el.setAttribute('content', prev));

      const ogd = setMeta('meta[property="og:description"]', 'content', description);
      if (ogd.el && ogd.prev !== null) restorers.push(() => ogd.el!.setAttribute('content', ogd.prev!));

      const twd = setMeta('meta[name="twitter:description"]', 'content', description);
      if (twd.el && twd.prev !== null) restorers.push(() => twd.el!.setAttribute('content', twd.prev!));
    }

    const ogt = setMeta('meta[property="og:title"]', 'content', title);
    if (ogt.el && ogt.prev !== null) restorers.push(() => ogt.el!.setAttribute('content', ogt.prev!));

    const twt = setMeta('meta[name="twitter:title"]', 'content', title);
    if (twt.el && twt.prev !== null) restorers.push(() => twt.el!.setAttribute('content', twt.prev!));

    const ogu = setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    if (ogu.el && ogu.prev !== null) restorers.push(() => ogu.el!.setAttribute('content', ogu.prev!));

    const can = setMeta('link[rel="canonical"]', 'href', canonicalUrl);
    if (can.el && can.prev !== null) restorers.push(() => can.el!.setAttribute('href', can.prev!));

    return () => {
      document.title = prevTitle;
      restorers.forEach((r) => r());
    };
  }, [title, description]);
};
