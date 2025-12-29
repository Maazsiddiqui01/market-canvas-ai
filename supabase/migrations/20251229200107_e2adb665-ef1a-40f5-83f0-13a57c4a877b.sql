-- Create portfolio_positions table for tracking multiple buy positions per holding
CREATE TABLE public.portfolio_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  holding_id UUID NOT NULL REFERENCES public.portfolio_holdings(id) ON DELETE CASCADE,
  shares NUMERIC NOT NULL,
  buy_price NUMERIC NOT NULL,
  buy_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using the holding's portfolio ownership
CREATE POLICY "Users can view own positions"
ON public.portfolio_positions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM portfolio_holdings h
    JOIN portfolios p ON p.id = h.portfolio_id
    WHERE h.id = portfolio_positions.holding_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own positions"
ON public.portfolio_positions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM portfolio_holdings h
    JOIN portfolios p ON p.id = h.portfolio_id
    WHERE h.id = portfolio_positions.holding_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own positions"
ON public.portfolio_positions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM portfolio_holdings h
    JOIN portfolios p ON p.id = h.portfolio_id
    WHERE h.id = portfolio_positions.holding_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own positions"
ON public.portfolio_positions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM portfolio_holdings h
    JOIN portfolios p ON p.id = h.portfolio_id
    WHERE h.id = portfolio_positions.holding_id
    AND p.user_id = auth.uid()
  )
);

-- Add index for faster lookups
CREATE INDEX idx_portfolio_positions_holding_id ON public.portfolio_positions(holding_id);