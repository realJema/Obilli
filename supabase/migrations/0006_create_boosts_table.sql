-- Create boosts table for listing promotions
CREATE TABLE IF NOT EXISTS public.boosts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('featured', 'premium', 'top')),
  starts_at timestamp with time zone NOT NULL DEFAULT NOW(),
  expires_at timestamp with time zone NOT NULL,
  price_xaf integer NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_boosts_listing_id ON public.boosts(listing_id);
CREATE INDEX IF NOT EXISTS idx_boosts_owner_id ON public.boosts(owner_id);
CREATE INDEX IF NOT EXISTS idx_boosts_tier ON public.boosts(tier);
CREATE INDEX IF NOT EXISTS idx_boosts_active ON public.boosts(is_active, expires_at) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.boosts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all active boosts" ON public.boosts
FOR SELECT USING (is_active = true AND expires_at > NOW());

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
