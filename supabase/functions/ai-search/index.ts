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

    // Build the prompt based on type
    const systemPrompt = type === 'stock' 
      ? `You are a financial analyst specializing in the Pakistan Stock Exchange (PSX). 
         Provide accurate, current information about PSX stocks, market trends, and financial analysis.
         Be concise but thorough. Include specific data when available.
         Focus on: stock performance, company fundamentals, sector trends, and market sentiment.
         Always mention if the information might be outdated and recommend checking latest prices.`
      : `You are a helpful financial assistant. Provide accurate and helpful information.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        search_domain_filter: ['psx.com.pk', 'investing.com', 'bloomberg.com', 'reuters.com'],
        search_recency_filter: 'week',
      }),
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
