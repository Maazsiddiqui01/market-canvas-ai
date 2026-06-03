import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: require a signed-in user (was open -> unbounded Perplexity spend +
    //     prompt-injection on the owner's key). ---
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

    const body = await req.json();
    const type = body?.type;
    // Clamp length to bound token cost and shrink the prompt-injection surface.
    const query = String(body?.query ?? '').slice(0, 500);
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI search service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Search query:', query, 'type:', type);

    // Date context (always use the live server date — never hardcode)
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const todayISO = today.toISOString().slice(0, 10);

    // Only accept sources from the last 30 days
    const cutoff = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const cutoffMMDDYYYY = `${String(cutoff.getMonth() + 1).padStart(2, '0')}/${String(cutoff.getDate()).padStart(2, '0')}/${cutoff.getFullYear()}`;

    const freshnessRules = `CRITICAL FRESHNESS RULES — these override everything else:
- Today is ${todayStr} (${todayISO}). Always use this as "now".
- Cite ONLY data published within the last 7 days. If nothing fresh exists for a specific data point, say "no fresh data available" instead of falling back to old numbers.
- NEVER quote prices, P/E, book value, dividend, or volume figures that are older than 7 days without an explicit "as of <date>" warning on that exact line.
- Reject and do NOT cite: annual reports older than the last fiscal year, news older than 30 days, Wikipedia, archived/cached pages.
- If sources disagree, prefer PSX official data (psx.com.pk, psx data portal) over third-party aggregators.
- If you cannot verify a number against a source dated within the last 7 days, omit the number entirely.
- At the END of your answer, add a line: "Data freshness: <most recent source date>".`;

    let systemPrompt: string;
    let searchDomainFilter: string[] | undefined;

    if (type === 'stock') {
      systemPrompt = `You are a Pakistan Stock Exchange (PSX) equity analyst.
${freshnessRules}

For any stock query, structure the answer as:
1. Live snapshot — last traded price, day change %, volume (each with "as of <date/time>")
2. Recent action — what moved in the last 5 trading sessions
3. Fundamentals — only the latest reported quarter/year, with the period clearly labeled
4. Risks & catalysts — based on news from the last 30 days only

Be concise. Use bullet points. Do not pad with generic descriptions of the company.`;
      searchDomainFilter = ['psx.com.pk', 'dps.psx.com.pk', 'sarmaaya.pk', 'mettisglobal.news', 'businessrecorder.com', 'brecorder.com', 'dawn.com', 'tribune.com.pk', 'investing.com'];
    } else if (type === 'general') {
      systemPrompt = `You are a Pakistan markets analyst (PSX, macro, sectors).
${freshnessRules}

Cover sectors, macro indicators, KSE-100 sentiment, regulatory news, and investment ideas — but only with data from the last 7-30 days. Use bullet points and label every number with its date.`;
      searchDomainFilter = ['psx.com.pk', 'dps.psx.com.pk', 'sbp.org.pk', 'sarmaaya.pk', 'mettisglobal.news', 'businessrecorder.com', 'brecorder.com', 'dawn.com', 'tribune.com.pk', 'investing.com', 'bloomberg.com', 'reuters.com'];
    } else {
      systemPrompt = `You are a helpful PSX financial assistant. ${freshnessRules}`;
      searchDomainFilter = ['psx.com.pk', 'dps.psx.com.pk', 'sarmaaya.pk', 'mettisglobal.news', 'businessrecorder.com', 'dawn.com', 'investing.com'];
    }

    const requestBody: any = {
      // sonar-pro gives stronger reasoning + better citation grounding than sonar
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${query}\n\n(Today is ${todayStr}. Only cite sources published on or after ${cutoffMMDDYYYY}. Refuse to use stale numbers.)`,
        },
      ],
      // Strict recency: last day; PSX trading days mean we still get the freshest available
      search_recency_filter: 'week',
      search_after_date_filter: cutoffMMDDYYYY,
      web_search_options: { search_context_size: 'high' },
      temperature: 0.2,
    };

    if (searchDomainFilter) {
      requestBody.search_domain_filter = searchDomainFilter;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Perplexity API error:', data);
      return new Response(
        JSON.stringify({ error: data.error?.message || 'AI search failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const answer = data.choices?.[0]?.message?.content || 'No results found.';
    const citations = data.citations || data.search_results?.map((s: any) => s.url) || [];

    const tickerMatch = query.toUpperCase().match(/([A-Z]{2,6})/);
    const ticker = tickerMatch ? tickerMatch[1] : null;

    console.log('AI Search completed successfully');

    return new Response(
      JSON.stringify({
        answer,
        citations,
        ticker,
        model: data.model,
        generatedAt: today.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
