-- Add UPDATE policy for portfolio_history to allow upserts
CREATE POLICY "Users can update own portfolio history" 
ON public.portfolio_history 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM portfolios
  WHERE ((portfolios.id = portfolio_history.portfolio_id) AND (portfolios.user_id = auth.uid()))));