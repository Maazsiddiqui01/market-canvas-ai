import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: identify the caller from their JWT. Never trust a body `user_id`
    //     (doing so was an IDOR — any UUID could read another user's alerts). ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);
    const userId = user.id;

    // Service-role client for the actual work (RLS-bypassing, but now strictly scoped
    // to the JWT-derived userId).
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_triggered', false);

    if (alertsError) throw alertsError;

    if (!alerts || alerts.length === 0) {
      return json({ message: 'No active alerts to check', checked: 0 });
    }

    // The n8n price-check webhook URL comes from server config ONLY — never from the
    // request body (a client-supplied fetch target is an SSRF vector).
    const webhookUrl = Deno.env.get('N8N_ALERT_WEBHOOK');
    if (webhookUrl) {
      const tickers = [...new Set(alerts.map((a) => a.ticker))];
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers,
          alerts: alerts.map((a) => ({
            id: a.id,
            ticker: a.ticker,
            target_price: a.target_price,
            alert_type: a.alert_type,
          })),
        }),
      });

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        if (Array.isArray(webhookData.triggered_alerts) && webhookData.triggered_alerts.length > 0) {
          for (const alertId of webhookData.triggered_alerts) {
            // Re-scope every update to this user so a rogue webhook response can't
            // flip arbitrary users' alerts.
            await supabase
              .from('price_alerts')
              .update({ is_triggered: true, triggered_at: new Date().toISOString(), n8n_notified: true })
              .eq('id', alertId)
              .eq('user_id', userId);
          }
          return json({
            message: `${webhookData.triggered_alerts.length} alerts triggered!`,
            triggered: webhookData.triggered_alerts.length,
            checked: alerts.length,
          });
        }
      } else {
        console.error('n8n webhook failed:', await webhookResponse.text());
      }
    }

    return json({
      message: `Checked ${alerts.length} alerts.`,
      checked: alerts.length,
      alerts: alerts.map((a) => ({ ticker: a.ticker, target: a.target_price, type: a.alert_type })),
    });
  } catch (error) {
    console.error('Error in check-alerts:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
