import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Holding {
  id: string;
  portfolio_id: string;
  ticker: string;
  stock_name: string | null;
  shares: number;
  avg_buy_price: number | null;
}

interface StockPrice {
  price: number;
  changePercent: number;
  absoluteChange: number;
}

serve(async (req) => {
  console.log('[Cron] Starting portfolio snapshot save job');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookUrl = Deno.env.get('N8N_STOCK_PRICE_WEBHOOK');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all portfolios
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select('id, user_id, name');

    if (portfoliosError) {
      console.error('[Cron] Error fetching portfolios:', portfoliosError);
      throw portfoliosError;
    }

    console.log(`[Cron] Found ${portfolios?.length || 0} portfolios to process`);

    const today = new Date().toISOString().split('T')[0];
    let savedCount = 0;
    let skippedCount = 0;

    for (const portfolio of portfolios || []) {
      try {
        // Check if snapshot already exists for today
        const { data: existing } = await supabase
          .from('portfolio_history')
          .select('id')
          .eq('portfolio_id', portfolio.id)
          .eq('snapshot_date', today)
          .limit(1);

        if (existing && existing.length > 0) {
          console.log(`[Cron] Snapshot already exists for portfolio ${portfolio.id} on ${today}, skipping`);
          skippedCount++;
          continue;
        }

        // Get holdings for this portfolio
        const { data: holdings, error: holdingsError } = await supabase
          .from('portfolio_holdings')
          .select('*')
          .eq('portfolio_id', portfolio.id);

        if (holdingsError) {
          console.error(`[Cron] Error fetching holdings for portfolio ${portfolio.id}:`, holdingsError);
          continue;
        }

        if (!holdings || holdings.length === 0) {
          console.log(`[Cron] No holdings for portfolio ${portfolio.id}, skipping`);
          skippedCount++;
          continue;
        }

        // Fetch live prices
        const tickers = holdings.map((h: Holding) => h.ticker);
        let prices: Record<string, StockPrice> = {};

        if (webhookUrl) {
          try {
            const priceResponse = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tickers }),
            });

            if (priceResponse.ok) {
              const priceData = await priceResponse.json();
              prices = priceData.prices || {};
              console.log(`[Cron] Fetched prices for ${Object.keys(prices).length} tickers`);
            }
          } catch (priceError) {
            console.error('[Cron] Error fetching prices:', priceError);
          }
        }

        // Calculate portfolio metrics
        let totalValue = 0;
        let totalCost = 0;
        const holdingsSnapshot = holdings.map((h: Holding) => {
          const price = prices[h.ticker]?.price ?? h.avg_buy_price ?? 0;
          const cost = h.shares * (h.avg_buy_price || 0);
          const value = h.shares * price;
          totalCost += cost;
          totalValue += value;

          return {
            ticker: h.ticker,
            stockName: h.stock_name,
            shares: h.shares,
            avgBuyPrice: h.avg_buy_price,
            currentPrice: price,
            value: value,
            cost: cost,
          };
        });

        const totalPnl = totalValue - totalCost;
        const pnlPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

        // Save snapshot
        const { error: insertError } = await supabase
          .from('portfolio_history')
          .insert({
            portfolio_id: portfolio.id,
            snapshot_date: today,
            total_value: totalValue,
            total_cost: totalCost,
            total_pnl: totalPnl,
            pnl_percentage: pnlPercentage,
            holdings_snapshot: holdingsSnapshot,
          });

        if (insertError) {
          console.error(`[Cron] Error saving snapshot for portfolio ${portfolio.id}:`, insertError);
          continue;
        }

        savedCount++;
        console.log(`[Cron] Saved snapshot for portfolio ${portfolio.id}: value=${totalValue}, pnl=${totalPnl}`);
      } catch (portfolioError) {
        console.error(`[Cron] Error processing portfolio ${portfolio.id}:`, portfolioError);
      }
    }

    console.log(`[Cron] Job complete. Saved: ${savedCount}, Skipped: ${skippedCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Saved ${savedCount} snapshots, skipped ${skippedCount}`,
        date: today 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Cron] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
