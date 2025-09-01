-- Create a table to store boost pricing configuration
-- This allows easy updates to pricing without code changes
CREATE TABLE IF NOT EXISTS public.boost_pricing (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tier text NOT NULL UNIQUE CHECK (tier IN ('featured', 'premium', 'top')),
  price_per_day integer NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Insert initial pricing data based on requirements:
-- Featured: 1,000 XAF per day
-- Premium: 2,000 XAF per day
-- Top: 500 XAF per day
INSERT INTO public.boost_pricing (tier, price_per_day) 
VALUES 
  ('featured', 1000),
  ('premium', 2000),
  ('top', 500)
ON CONFLICT (tier) DO NOTHING;

-- Create a function to get boost price
CREATE OR REPLACE FUNCTION get_boost_price(boost_tier text, days integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  price_per_day integer;
BEGIN
  SELECT bp.price_per_day INTO price_per_day
  FROM public.boost_pricing bp
  WHERE bp.tier = boost_tier;
  
  IF price_per_day IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN price_per_day * days;
END;
$$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_boost_pricing_tier ON public.boost_pricing(tier);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_boost_pricing_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_boost_pricing_updated_at_trigger
  BEFORE UPDATE ON public.boost_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_boost_pricing_updated_at();

-- Add RLS policies for boost_pricing table
ALTER TABLE public.boost_pricing ENABLE ROW LEVEL SECURITY;

-- Allow public read access to boost pricing (needed for frontend calculations)
CREATE POLICY "Public can view boost pricing" ON public.boost_pricing
FOR SELECT USING (true);
