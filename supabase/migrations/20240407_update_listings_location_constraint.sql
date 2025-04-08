-- First, drop the existing foreign key constraints
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_location_id_fkey;
ALTER TABLE listings DROP CONSTRAINT IF EXISTS fk_listing_location;

-- Create a temporary column to store the new location IDs
ALTER TABLE listings ADD COLUMN temp_location_id UUID;

-- Update the temp_location_id based on matching location names
UPDATE listings l
SET temp_location_id = l2.id
FROM locations old_loc
JOIN locations2 l2 ON old_loc.name = l2.name AND l2.type = 'quarter'
WHERE l.location_id = old_loc.id;

-- Now update the location_id with the new IDs
UPDATE listings
SET location_id = temp_location_id
WHERE temp_location_id IS NOT NULL;

-- Drop the temporary column
ALTER TABLE listings DROP COLUMN temp_location_id;

-- Add the new foreign key constraint to locations2
ALTER TABLE listings
ADD CONSTRAINT listings_location_id_fkey
FOREIGN KEY (location_id)
REFERENCES locations2(id)
ON DELETE SET NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
CREATE POLICY "Authenticated users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id AND
  (location_id IS NULL OR EXISTS (
    SELECT 1 FROM locations2 WHERE id = location_id
  ))
);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_listings_location_id ON listings(location_id);

-- Comment to explain the change
COMMENT ON CONSTRAINT listings_location_id_fkey ON listings IS 'Foreign key reference to locations2 table instead of the old locations table'; 
