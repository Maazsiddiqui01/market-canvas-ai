import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export type ActivityType = 
  | 'ai_search' 
  | 'stock_view' 
  | 'portfolio_action' 
  | 'alert_created' 
  | 'watchlist_action' 
  | 'comparison'
  | 'page_view';

interface LogActivityParams {
  activityType: ActivityType;
  description: string;
  ticker?: string;
  data?: Json;
}

export const useActivityLog = () => {
  const { user } = useAuth();

  const logActivity = useCallback(async ({
    activityType,
    description,
    ticker,
    data,
  }: LogActivityParams) => {
    if (!user) return;

    // supabase-js resolves with { error } rather than throwing, so a try/catch
    // here is dead code — check the returned error explicitly.
    const { error } = await supabase.from('user_activity_log').insert([{
      user_id: user.id,
      activity_type: activityType,
      description,
      ticker: ticker || null,
      activity_data: data ?? {},
    }]);
    if (error) console.error('Failed to log activity:', error);
  }, [user]);

  return { logActivity };
};
