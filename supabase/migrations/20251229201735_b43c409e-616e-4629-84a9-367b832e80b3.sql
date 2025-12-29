-- Create portfolio_history table for daily snapshots
CREATE TABLE public.portfolio_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_value NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  total_pnl NUMERIC NOT NULL,
  pnl_percentage NUMERIC NOT NULL,
  holdings_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, snapshot_date)
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own portfolio history" 
ON public.portfolio_history 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_history.portfolio_id 
  AND portfolios.user_id = auth.uid()
));

CREATE POLICY "Users can insert own portfolio history" 
ON public.portfolio_history 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_history.portfolio_id 
  AND portfolios.user_id = auth.uid()
));

CREATE POLICY "Users can delete own portfolio history" 
ON public.portfolio_history 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_history.portfolio_id 
  AND portfolios.user_id = auth.uid()
));

-- Create index for faster queries
CREATE INDEX idx_portfolio_history_portfolio_date ON public.portfolio_history(portfolio_id, snapshot_date DESC);