import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: require a signed-in user (was open -> unbounded Perplexity spend). ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { tickers } = await req.json();

    if (!tickers || !Array.isArray(tickers) || tickers.length < 2 || tickers.length > 3) {
      return new Response(JSON.stringify({ error: 'Please provide 2-3 stock tickers to compare' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize tickers (defensive; they feed a prompt).
    const cleanTickers = tickers
      .map((t: string) => String(t).toUpperCase().replace(/[^A-Z0-9.\-]/g, '').slice(0, 12))
      .filter(Boolean);
    if (cleanTickers.length < 2) {
      return new Response(JSON.stringify({ error: 'Please provide 2-3 valid stock tickers to compare' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Comparing stocks:', cleanTickers);

    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Perplexity API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Date context (live server date — never hardcode)
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const todayISO = today.toISOString().slice(0, 10);
    const cutoff = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const cutoffMMDDYYYY = `${String(cutoff.getMonth() + 1).padStart(2, '0')}/${String(cutoff.getDate()).padStart(2, '0')}/${cutoff.getFullYear()}`;

    // Same hard freshness contract as the ai-search function (kept in sync).
    const freshnessRules = `CRITICAL FRESHNESS RULES — these override everything else:
- Today is ${todayStr} (${todayISO}). Always use this as "now".
- Cite ONLY data published within the last 7 days. If nothing fresh exists for a specific data point, say "no fresh data available" instead of falling back to old numbers.
- NEVER quote prices, P/E, book value, dividend, or volume figures older than 7 days without an explicit "as of <date>" warning on that exact line.
- Reject and do NOT cite: annual reports older than the last fiscal year, news older than 30 days, Wikipedia, archived/cached pages.
- If sources disagree, prefer PSX official data (psx.com.pk) over third-party aggregators.
- If you cannot verify a number against a source dated within the last 7 days, omit it.`;

    const systemPrompt = `You are a Pakistan Stock Exchange (PSX) equity analyst doing a head-to-head comparison.
${freshnessRules}

For EACH stock, also give a Sharia view: likely compliance status (compliant / non-compliant / doubtful) from its sector + the standard screens (interest-bearing debt, non-permissible income). Label it a heuristic, not a fatwa.

Provide accurate, data-driven analysis with specific dated numbers. Be decisive.`;

    const tickerList = cleanTickers.join(', ');
    const userPrompt = `Compare these PSX stocks: ${tickerList}.

Structure the answer:
1. Live snapshot per stock — last price, day change %, volume (each "as of <date>")
2. Valuation & fundamentals — P/E, market cap, dividend yield, latest reported period (labeled)
3. Sector & competitive positioning
4. Recent catalysts / news (last 30 days only)
5. Sharia view per stock (heuristic)
6. Risk assessment per stock
7. Verdict — which looks stronger right now, with concise pros and cons

Use a markdown table where it helps. Label every number with its date.

(Today is ${todayStr}. Only cite sources published on or after ${cutoffMMDDYYYY}. Refuse to use stale numbers.)`;

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${perplexityKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Upgraded to sonar-pro + temperature 0.2 + domain allow-list, matching ai-search.
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        search_recency_filter: 'week',
        search_after_date_filter: cutoffMMDDYYYY,
        search_domain_filter: ['psx.com.pk', 'dps.psx.com.pk', 'sarmaaya.pk', 'mettisglobal.news', 'businessrecorder.com', 'brecorder.com', 'dawn.com', 'tribune.com.pk', 'investing.com'],
        web_search_options: { search_context_size: 'high' },
        temperature: 0.2,
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', perplexityResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch comparison data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const perplexityData = await perplexityResponse.json();
    const comparison = perplexityData.choices?.[0]?.message?.content || 'No comparison data available';
    const citations = perplexityData.citations || perplexityData.search_results?.map((s: any) => s.url) || [];

    return new Response(JSON.stringify({
      tickers: cleanTickers,
      comparison,
      citations,
      generated_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in compare-stocks:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
