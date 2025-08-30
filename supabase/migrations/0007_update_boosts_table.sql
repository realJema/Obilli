-- Update boosts table to add missing columns for payment and ownership tracking
ALTER TABLE public.boosts ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.boosts ADD COLUMN IF NOT EXISTS price_xaf integer NOT NULL DEFAULT 0;
ALTER TABLE public.boosts ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
ALTER TABLE public.boosts ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT false;
ALTER TABLE public.boosts ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT NOW();

-- Rename ends_at to expires_at for consistency
ALTER TABLE public.boosts RENAME COLUMN ends_at TO expires_at;

-- Update tier constraint to include 'premium' 
ALTER TABLE public.boosts DROP CONSTRAINT IF EXISTS boosts_tier_check;
ALTER TABLE public.boosts ADD CONSTRAINT boosts_tier_check CHECK (tier IN ('featured', 'premium', 'top'));

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_boosts_owner_id ON public.boosts(owner_id);
CREATE INDEX IF NOT EXISTS idx_boosts_tier ON public.boosts(tier);
CREATE INDEX IF NOT EXISTS idx_boosts_active ON public.boosts(is_active, expires_at) WHERE is_active = true;

-- Update RLS policies for the new owner_id column
DROP POLICY IF EXISTS "Users can view their own boosts" ON public.boosts;
DROP POLICY IF EXISTS "Users can create boosts for their listings" ON public.boosts;
DROP POLICY IF EXISTS "Users can update their own boosts" ON public.boosts;

CREATE POLICY "Users can view their own boosts" ON public.boosts
FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create boosts for their listings" ON public.boosts
FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND 
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = listing_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own boosts" ON public.boosts
FOR UPDATE USING (auth.uid() = owner_id);

-- Create function to automatically deactivate expired boosts
CREATE OR REPLACE FUNCTION deactivate_expired_boosts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.boosts 
  SET is_active = false, updated_at = NOW()
  WHERE is_active = true AND expires_at <= NOW();
END;
$$;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_boosts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_boosts_updated_at_trigger
  BEFORE UPDATE ON public.boosts
  FOR EACH ROW
  EXECUTE FUNCTION update_boosts_updated_at();
