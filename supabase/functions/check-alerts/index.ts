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
    const { user_id, webhook_url } = await req.json();
    
    console.log('Checking alerts for user:', user_id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch active (non-triggered) alerts for the user
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_triggered', false);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      throw alertsError;
    }

    if (!alerts || alerts.length === 0) {
      console.log('No active alerts found');
      return new Response(JSON.stringify({ 
        message: 'No active alerts to check',
        checked: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${alerts.length} active alerts`);

    // If webhook URL is provided, call n8n to check prices
    if (webhook_url) {
      console.log('Calling n8n webhook:', webhook_url);
      
      const tickers = [...new Set(alerts.map(a => a.ticker))];
      
      const webhookResponse = await fetch(webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers,
          alerts: alerts.map(a => ({
            id: a.id,
            ticker: a.ticker,
            target_price: a.target_price,
            alert_type: a.alert_type
          }))
        })
      });

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        console.log('n8n webhook response:', webhookData);

        // If n8n returns triggered alerts, update them
        if (webhookData.triggered_alerts && Array.isArray(webhookData.triggered_alerts)) {
          for (const alertId of webhookData.triggered_alerts) {
            await supabase
              .from('price_alerts')
              .update({ 
                is_triggered: true, 
                triggered_at: new Date().toISOString(),
                n8n_notified: true
              })
              .eq('id', alertId);
          }
          
          return new Response(JSON.stringify({ 
            message: `${webhookData.triggered_alerts.length} alerts triggered!`,
            triggered: webhookData.triggered_alerts.length,
            checked: alerts.length
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
        console.error('n8n webhook failed:', await webhookResponse.text());
      }
    }

    return new Response(JSON.stringify({ 
      message: `Checked ${alerts.length} alerts. Configure n8n webhook for price checking.`,
      checked: alerts.length,
      alerts: alerts.map(a => ({ ticker: a.ticker, target: a.target_price, type: a.alert_type }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-alerts:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
