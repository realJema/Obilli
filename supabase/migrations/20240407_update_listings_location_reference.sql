-- First, drop the RLS policy that references location_id
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;

-- Drop the existing foreign key constraints
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_location_id_fkey;
ALTER TABLE listings DROP CONSTRAINT IF EXISTS fk_listing_location;

-- Change the location_id column type from UUID to TEXT
ALTER TABLE listings 
ALTER COLUMN location_id TYPE TEXT USING location_id::TEXT;

-- Update all existing listings to use the default location ID
UPDATE listings 
SET location_id = 'ctr23e4567-e89b-12d3-a456-426614174007'
WHERE location_id IS NOT NULL;

-- Add the new foreign key constraint to locations2
ALTER TABLE listings
ADD CONSTRAINT listings_location_id_fkey
FOREIGN KEY (location_id)
REFERENCES locations2(id)
ON DELETE SET NULL;

-- Recreate the RLS policy
CREATE POLICY "Authenticated users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id AND
  (location_id IS NULL OR EXISTS (
    SELECT 1 FROM locations2 WHERE id = location_id
  ))
); 
