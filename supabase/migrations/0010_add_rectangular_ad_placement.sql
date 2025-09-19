-- Add rectangular ad placement type to the ads table
-- First, create the new enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ad_placement') THEN
    CREATE TYPE ad_placement AS ENUM ('banner', 'sidebar', 'feed', 'footer', 'rectangular');
  END IF;
END $$;

-- Add the new placement type to the existing enum
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular';

-- Ensure the ads table has all required columns
ALTER TABLE public.ads 
  ALTER COLUMN placement TYPE ad_placement 
  USING placement::ad_placement;

-- Add missing columns if they don't exist
ALTER TABLE public.ads 
  ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to have proper default values
UPDATE public.ads 
SET starts_at = created_at 
WHERE starts_at IS NULL;