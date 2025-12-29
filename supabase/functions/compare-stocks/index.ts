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

    // Get today's date for context
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const tickerList = tickers.join(', ');
    const prompt = `Compare these Pakistan Stock Exchange (PSX) stocks: ${tickerList}

IMPORTANT: Today is ${todayStr}. Provide the LATEST available data. In financial markets, even a day can make significant differences.

Provide a detailed comparison including:
1. Current market performance and recent price movements (cite dates for all prices)
2. Key financial metrics (P/E ratio, market cap, dividend yield if available)
3. Sector analysis and competitive positioning
4. Recent news and developments affecting each stock (from the last 1-3 days if available)
5. Technical indicators and trading patterns
6. Risk assessment for each stock
7. Investment recommendation with pros and cons for each

Format the response clearly with sections for each comparison aspect. Be specific with numbers and data where available.
ALWAYS include the date for each data point you mention.`;

    console.log('Calling Perplexity API...');

    const systemPrompt = `You are a professional financial analyst specializing in the Pakistan Stock Exchange (PSX). 

CRITICAL: Today's date is ${todayStr}. You MUST prioritize the most recent information available.
In financial markets, even a single day can bring significant changes. Always search for and cite the LATEST available data first.
If information from today is not available, try yesterday, then the day before, and so on.
NEVER cite information that is more than a few days old unless absolutely necessary, and if you do, explicitly warn the user that the data may be outdated.

Provide accurate, data-driven analysis with specific numbers and actionable insights. Always include dates for all data points.`;

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        search_recency_filter: 'day',
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
