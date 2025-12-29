import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type } = await req.json();
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

    // Get today's date for context
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Build the prompt based on type
    let systemPrompt: string;
    let searchDomainFilter: string[] | undefined;
    
    const dateContext = `IMPORTANT: Today's date is ${todayStr}. You MUST prioritize the most recent information available. 
In financial markets, even a single day can bring significant changes. Always search for and cite the LATEST available data first.
If information from today (${todayStr}) is not available, try yesterday, then the day before, and so on.
NEVER cite information that is more than a few days old unless absolutely necessary, and if you do, explicitly warn the user that the data may be outdated.`;

    if (type === 'stock') {
      systemPrompt = `You are a financial analyst specializing in the Pakistan Stock Exchange (PSX). 
${dateContext}

Provide accurate, CURRENT information about PSX stocks, market trends, and financial analysis.
Be concise but thorough. Include specific data when available.
Focus on: stock performance, company fundamentals, sector trends, and market sentiment.
Always include the date of the data you're citing. If citing data older than today, clearly indicate "as of [date]".`;
      searchDomainFilter = ['psx.com.pk', 'investing.com', 'bloomberg.com', 'reuters.com'];
    } else if (type === 'general') {
      systemPrompt = `You are an expert financial analyst and market researcher specializing in the Pakistan Stock Exchange (PSX) and Pakistani economy.
${dateContext}

Provide comprehensive, well-researched answers to questions about:
- Sector analysis and outlook (banking, cement, oil & gas, textiles, etc.)
- Market trends and sentiment
- Economic indicators affecting PSX
- Investment strategies for Pakistani markets
- Company comparisons and recommendations
- Dividend stocks and value investing in PSX
Be thorough but organized. Use bullet points for clarity. Cite specific data when available.
Focus on actionable insights for investors. Always include dates for all data points.`;
      // For general queries, search more broadly
      searchDomainFilter = undefined;
    } else {
      systemPrompt = `You are a helpful financial assistant. ${dateContext} Provide accurate and helpful information with dates for all data.`;
      searchDomainFilter = ['psx.com.pk', 'investing.com', 'bloomberg.com', 'reuters.com'];
    }

    const requestBody: any = {
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${query}\n\n(Note: Today is ${todayStr}. Please provide the most recent information available.)` }
      ],
      search_recency_filter: 'day',
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
    const citations = data.citations || [];

    // Extract ticker from query if present
    const tickerMatch = query.toUpperCase().match(/([A-Z]{2,6})/);
    const ticker = tickerMatch ? tickerMatch[1] : null;

    console.log('AI Search completed successfully');

    return new Response(
      JSON.stringify({
        answer,
        citations,
        ticker,
        model: data.model,
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
