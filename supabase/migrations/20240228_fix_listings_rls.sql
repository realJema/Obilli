-- First, let's make sure RLS is enabled
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for listings to start fresh
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

-- Create a simpler insert policy first
CREATE POLICY "Authenticated users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

-- Add policy for viewing listings
CREATE POLICY "Listings are viewable by everyone"
ON listings FOR SELECT
TO public
USING (true);

-- Add policy for updating own listings
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- Add policy for deleting own listings
CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

-- Make sure the location column is nullable for now
ALTER TABLE listings ALTER COLUMN location DROP NOT NULL; 
