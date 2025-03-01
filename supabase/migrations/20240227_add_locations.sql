-- Create locations table
CREATE TABLE locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL,
    parent_id UUID REFERENCES locations(id),
    type VARCHAR NOT NULL CHECK (type IN ('town', 'quarter')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(slug, type)
);

-- Add location fields to listings table
ALTER TABLE listings
ADD COLUMN location_id UUID REFERENCES locations(id),
ADD COLUMN address VARCHAR;

-- Create index for faster lookups
CREATE INDEX locations_parent_id_idx ON locations(parent_id);
CREATE INDEX listings_location_id_idx ON listings(location_id);

-- Enable RLS for locations table
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to locations
CREATE POLICY "Locations are viewable by everyone"
ON locations FOR SELECT
TO public
USING (true);

-- Drop old listings policies
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

-- Create updated listings policies
CREATE POLICY "Authenticated users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id AND
  location_id IS NOT NULL AND
  address IS NOT NULL
);

CREATE POLICY "Listings are viewable by everyone"
ON listings FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

-- Sample data for Cameroon locations
INSERT INTO locations (name, slug, type) VALUES
-- Towns
('Yaoundé', 'yaounde', 'town'),
('Douala', 'douala', 'town'),
('Bamenda', 'bamenda', 'town'),
('Bafoussam', 'bafoussam', 'town'),
('Garoua', 'garoua', 'town'),
('Maroua', 'maroua', 'town'),
('Buea', 'buea', 'town');

-- Get town IDs for adding quarters
DO $$
DECLARE
    yaounde_id UUID;
    douala_id UUID;
    bamenda_id UUID;
    bafoussam_id UUID;
BEGIN
    SELECT id INTO yaounde_id FROM locations WHERE slug = 'yaounde';
    SELECT id INTO douala_id FROM locations WHERE slug = 'douala';
    SELECT id INTO bamenda_id FROM locations WHERE slug = 'bamenda';
    SELECT id INTO bafoussam_id FROM locations WHERE slug = 'bafoussam';

    -- Yaoundé quarters
    INSERT INTO locations (name, slug, parent_id, type) VALUES
    ('Bastos', 'bastos', yaounde_id, 'quarter'),
    ('Mvan', 'mvan', yaounde_id, 'quarter'),
    ('Nsimeyong', 'nsimeyong', yaounde_id, 'quarter'),
    ('Mvog-Mbi', 'mvog-mbi', yaounde_id, 'quarter'),
    ('Biyem-Assi', 'biyem-assi', yaounde_id, 'quarter');

    -- Douala quarters
    INSERT INTO locations (name, slug, parent_id, type) VALUES
    ('Akwa', 'akwa', douala_id, 'quarter'),
    ('Bonanjo', 'bonanjo', douala_id, 'quarter'),
    ('Deido', 'deido', douala_id, 'quarter'),
    ('Bonapriso', 'bonapriso', douala_id, 'quarter'),
    ('New Bell', 'new-bell', douala_id, 'quarter');

    -- Bamenda quarters
    INSERT INTO locations (name, slug, parent_id, type) VALUES
    ('Old Town', 'old-town', bamenda_id, 'quarter'),
    ('Nkwen', 'nkwen', bamenda_id, 'quarter'),
    ('Mankon', 'mankon', bamenda_id, 'quarter'),
    ('Up Station', 'up-station', bamenda_id, 'quarter');

    -- Bafoussam quarters
    INSERT INTO locations (name, slug, parent_id, type) VALUES
    ('Tamdja', 'tamdja', bafoussam_id, 'quarter'),
    ('Djeleng', 'djeleng', bafoussam_id, 'quarter'),
    ('Tougang', 'tougang', bafoussam_id, 'quarter'),
    ('Kamkop', 'kamkop', bafoussam_id, 'quarter');
END $$;

