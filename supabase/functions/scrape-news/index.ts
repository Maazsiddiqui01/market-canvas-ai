import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

// Only allow scraping of known PSX / Pakistani financial-news domains. An open,
// arbitrary-URL proxy on someone else's Firecrawl credits is an SSRF / cost-drain hole.
const ALLOWED_DOMAINS = [
  'psx.com.pk', 'dps.psx.com.pk', 'sarmaaya.pk', 'mettisglobal.news',
  'businessrecorder.com', 'brecorder.com', 'dawn.com', 'tribune.com.pk',
  'thenews.com.pk', 'profit.pakistantoday.com.pk', 'nation.com.pk',
  'pakobserver.net', 'investing.com',
];

function isAllowedUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: require a signed-in user (was a fully open proxy). ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const { url, ticker } = await req.json();
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return json({ error: 'News scraping service not configured' }, 500);
    }

    if (url) {
      if (!isAllowedUrl(url)) {
        return json({ error: 'URL not allowed. Only approved PSX/news domains may be scraped.' }, 400);
      }
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formats: ['markdown', 'summary'], onlyMainContent: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Firecrawl API error:', data);
        return json({ error: data.error || 'Scraping failed' }, response.status);
      }
      return json(data);
    }

    if (ticker) {
      const safeTicker = String(ticker).replace(/[^A-Za-z0-9.\- ]/g, '').slice(0, 24);
      const response = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `${safeTicker} PSX Pakistan Stock Exchange news`,
          limit: 10,
          scrapeOptions: { formats: ['markdown'] },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Firecrawl API error:', data);
        return json({ error: data.error || 'Search failed' }, response.status);
      }
      return json(data);
    }

    return json({ error: 'Either url or ticker is required' }, 400);
  } catch (error) {
    console.error('Scrape news error:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
