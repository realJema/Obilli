-- Update the listings policies to properly handle insertions
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
CREATE POLICY "Authenticated users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id
);

-- Ensure the listings table has RLS enabled
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Add policies for viewing listings (if not already present)
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone"
ON listings FOR SELECT
TO public
USING (true);

-- Add policy for updating own listings
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id);

-- Add policy for deleting own listings
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

