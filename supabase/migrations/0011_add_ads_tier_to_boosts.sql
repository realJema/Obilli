-- Add 'ads' tier to the boosts table tier constraint
-- First, drop the existing constraint
ALTER TABLE public.boosts 
DROP CONSTRAINT IF EXISTS boosts_tier_check;

-- Add the new constraint with 'ads' included
ALTER TABLE public.boosts 
ADD CONSTRAINT boosts_tier_check 
CHECK (tier IN ('featured', 'premium', 'top', 'ads'));