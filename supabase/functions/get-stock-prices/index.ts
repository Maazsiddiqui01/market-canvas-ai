import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockPrice {
  price: number;
  changePercent: number;
  absoluteChange: number;
  volume: number;
}

// US live prices via Yahoo Finance chart API (free, no key). Used when market === 'US'.
async function fetchYahoo(ticker: string): Promise<StockPrice | null> {
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }
    );
    if (!r.ok) return null;
    const j = await r.json();
    const meta = j?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = Number(meta.regularMarketPrice);
    const prev = Number(meta.chartPreviousClose ?? meta.previousClose);
    if (!isFinite(price)) return null;
    const abs = isFinite(prev) ? price - prev : 0;
    const pct = isFinite(prev) && prev !== 0 ? (abs / prev) * 100 : 0;
    return { price, changePercent: pct, absoluteChange: abs, volume: Number(meta.regularMarketVolume) || 0 };
  } catch (_e) {
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const tickers = body?.tickers;
    const market = (body?.market || 'PSX').toString().toUpperCase();

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Tickers array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching prices for', market, 'tickers:', tickers);

    const prices: Record<string, StockPrice> = {};
    const errors: string[] = [];

    // ---- US: Yahoo Finance (free) ----
    if (market === 'US') {
      await Promise.all(tickers.map(async (ticker: string) => {
        const p = await fetchYahoo(ticker);
        if (p) prices[ticker] = p; else errors.push(ticker);
      }));
      return new Response(
        JSON.stringify({ prices, errors: errors.length > 0 ? errors : undefined, timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ---- PSX: existing n8n webhook path (unchanged) ----
    const N8N_WEBHOOK = Deno.env.get('N8N_STOCK_PRICE_WEBHOOK');
    if (!N8N_WEBHOOK) {
      console.error('N8N_STOCK_PRICE_WEBHOOK not configured');
      return new Response(
        JSON.stringify({ error: 'Stock price service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fetchPromises = tickers.map(async (ticker: string) => {
      try {
        const symbol = ticker.startsWith('PSX:') ? ticker : `PSX:${ticker}`;

        const response = await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol }),
        });

        if (!response.ok) {
          console.error(`Failed to fetch price for ${ticker}:`, response.status);
          errors.push(ticker);
          return;
        }

        const data = await response.json();
        console.log(`Response for ${ticker}:`, JSON.stringify(data));

        if (Array.isArray(data) && data[0]?.data?.[0]?.d) {
          const [price, changePercent, absoluteChange, volume] = data[0].data[0].d;
          prices[ticker] = {
            price: price || 0,
            changePercent: changePercent || 0,
            absoluteChange: absoluteChange || 0,
            volume: volume || 0,
          };
        } else {
          console.error(`Unexpected response format for ${ticker}:`, data);
          errors.push(ticker);
        }
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
        errors.push(ticker);
      }
    });

    await Promise.all(fetchPromises);

    console.log('Prices fetched successfully:', Object.keys(prices).length);

    return new Response(
      JSON.stringify({
        prices,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get stock prices error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
