import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { tickers } = await req.json();
    
    if (!tickers || !Array.isArray(tickers) || tickers.length < 2 || tickers.length > 3) {
      return new Response(JSON.stringify({ 
        error: 'Please provide 2-3 stock tickers to compare' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Comparing stocks:', tickers);

    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!perplexityKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Perplexity API key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tickerList = tickers.join(', ');
    const prompt = `Compare these Pakistan Stock Exchange (PSX) stocks: ${tickerList}

Provide a detailed comparison including:
1. Current market performance and recent price movements
2. Key financial metrics (P/E ratio, market cap, dividend yield if available)
3. Sector analysis and competitive positioning
4. Recent news and developments affecting each stock
5. Technical indicators and trading patterns
6. Risk assessment for each stock
7. Investment recommendation with pros and cons for each

Format the response clearly with sections for each comparison aspect. Be specific with numbers and data where available.`;

    console.log('Calling Perplexity API...');

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional financial analyst specializing in the Pakistan Stock Exchange (PSX). Provide accurate, data-driven analysis with specific numbers and actionable insights.' 
          },
          { role: 'user', content: prompt }
        ],
        search_recency_filter: 'week',
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', perplexityResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch comparison data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const perplexityData = await perplexityResponse.json();
    console.log('Perplexity response received');

    const comparison = perplexityData.choices?.[0]?.message?.content || 'No comparison data available';
    const citations = perplexityData.citations || [];

    return new Response(JSON.stringify({ 
      tickers,
      comparison,
      citations,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compare-stocks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
