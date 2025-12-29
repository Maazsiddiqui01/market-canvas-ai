-- Create a comprehensive user activity log table
CREATE TABLE public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'ai_search', 'stock_view', 'portfolio_action', 'alert_created', 'watchlist_action', 'comparison'
  activity_data JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  ticker TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log(created_at DESC);
CREATE INDEX idx_user_activity_log_activity_type ON public.user_activity_log(activity_type);

-- Enable Row Level Security
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own activity log" 
ON public.user_activity_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity log" 
ON public.user_activity_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity log" 
ON public.user_activity_log 
FOR DELETE 
USING (auth.uid() = user_id);