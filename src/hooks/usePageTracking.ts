import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('pv_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('pv_session_id', sessionId);
  }
  return sessionId;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('page_views' as any).insert({
          page_url: location.pathname + location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId(),
          user_id: user?.id || null,
        });
      } catch (error) {
        // Silent fail - don't break UX for analytics
        console.error('Page tracking error:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
