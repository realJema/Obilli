-- Fix locations table to use proper hierarchy
-- Drop and recreate with correct structure

-- Drop the existing locations table
DROP TABLE IF EXISTS public.locations CASCADE;

-- Create new locations table with hierarchy
CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY,
    location_en TEXT NOT NULL,
    location_fr TEXT NOT NULL,
    parent_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_search_en ON locations USING gin(to_tsvector('english', location_en));
CREATE INDEX idx_locations_search_fr ON locations USING gin(to_tsvector('french', location_fr));

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to locations
CREATE POLICY "Locations are viewable by everyone" ON locations
    FOR SELECT USING (true);

-- Insert hierarchical Cameroon locations data
-- Level 1: Regions
INSERT INTO locations (id, location_en, location_fr, parent_id) VALUES
(1, 'Adamawa', 'Adamaoua', NULL),
(2, 'Centre', 'Centre', NULL),
(3, 'East', 'Est', NULL),
(4, 'Far North', 'Extrême-Nord', NULL),
(5, 'Littoral', 'Littoral', NULL),
(6, 'North', 'Nord', NULL),
(7, 'Northwest', 'Nord-Ouest', NULL),
(8, 'South', 'Sud', NULL),
(9, 'Southwest', 'Sud-Ouest', NULL),
(10, 'West', 'Ouest', NULL);

-- Level 2: Major Cities/Departments
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
-- Adamawa
('Ngaoundéré', 'Ngaoundéré', 1),
('Tibati', 'Tibati', 1),
('Banyo', 'Banyo', 1),
('Tignère', 'Tignère', 1),

-- Centre
('Yaoundé', 'Yaoundé', 2),
('Mbalmayo', 'Mbalmayo', 2),
('Bafia', 'Bafia', 2),
('Obala', 'Obala', 2),

-- East
('Bertoua', 'Bertoua', 3),
('Batouri', 'Batouri', 3),
('Yokadouma', 'Yokadouma', 3),

-- Far North
('Maroua', 'Maroua', 4),
('Kousséri', 'Kousséri', 4),
('Yagoua', 'Yagoua', 4),
('Mokolo', 'Mokolo', 4),

-- Littoral
('Douala', 'Douala', 5),
('Nkongsamba', 'Nkongsamba', 5),
('Edéa', 'Edéa', 5),

-- North
('Garoua', 'Garoua', 6),
('Guider', 'Guider', 6),
('Poli', 'Poli', 6),

-- Northwest
('Bamenda', 'Bamenda', 7),
('Kumbo', 'Kumbo', 7),
('Wum', 'Wum', 7),
('Fundong', 'Fundong', 7),

-- South
('Ebolowa', 'Ebolowa', 8),
('Kribi', 'Kribi', 8),
('Sangmélima', 'Sangmélima', 8),

-- Southwest
('Buea', 'Buea', 9),
('Limbe', 'Limbe', 9),
('Kumba', 'Kumba', 9),
('Mamfe', 'Mamfe', 9),

-- West
('Bafoussam', 'Bafoussam', 10),
('Dschang', 'Dschang', 10),
('Mbouda', 'Mbouda', 10),
('Foumban', 'Foumban', 10);

-- Level 3: Quarters for major cities
-- Yaoundé quarters
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
('Bastos', 'Bastos', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Centre-ville', 'Centre-ville', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Essos', 'Essos', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Mvog-Mbi', 'Mvog-Mbi', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Nlongkak', 'Nlongkak', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Nkoldongo', 'Nkoldongo', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Emana', 'Emana', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Kondengui', 'Kondengui', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Djoungolo', 'Djoungolo', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Efoulan', 'Efoulan', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Ekounou', 'Ekounou', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Madagascar', 'Madagascar', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Mokolo', 'Mokolo', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Nkomo', 'Nkomo', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Olembe', 'Olembe', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Omnisport', 'Omnisport', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Simbock', 'Simbock', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2)),
('Tsinga', 'Tsinga', (SELECT id FROM locations WHERE location_en = 'Yaoundé' AND parent_id = 2));

-- Douala quarters
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
('Akwa', 'Akwa', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Bonanjo', 'Bonanjo', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Bonapriso', 'Bonapriso', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Bassa', 'Bassa', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Bépanda', 'Bépanda', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Deido', 'Deido', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Makepe', 'Makepe', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('New Bell', 'New Bell', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Nylon', 'Nylon', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('PK 8', 'PK 8', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('PK 11', 'PK 11', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('PK 14', 'PK 14', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Village', 'Village', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5)),
('Yassa', 'Yassa', (SELECT id FROM locations WHERE location_en = 'Douala' AND parent_id = 5));

-- Bamenda quarters
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
('Commercial Avenue', 'Commercial Avenue', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7)),
('Government Station', 'Government Station', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7)),
('Mankon', 'Mankon', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7)),
('Nkwen', 'Nkwen', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7)),
('Old Town', 'Old Town', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7)),
('Up Station', 'Up Station', (SELECT id FROM locations WHERE location_en = 'Bamenda' AND parent_id = 7));

-- Bafoussam quarters
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
('Centre-ville', 'Centre-ville', (SELECT id FROM locations WHERE location_en = 'Bafoussam' AND parent_id = 10)),
('Djeleng', 'Djeleng', (SELECT id FROM locations WHERE location_en = 'Bafoussam' AND parent_id = 10)),
('Famla', 'Famla', (SELECT id FROM locations WHERE location_en = 'Bafoussam' AND parent_id = 10)),
('Tamdja', 'Tamdja', (SELECT id FROM locations WHERE location_en = 'Bafoussam' AND parent_id = 10)),
('Tougang', 'Tougang', (SELECT id FROM locations WHERE location_en = 'Bafoussam' AND parent_id = 10));

-- Buea quarters
INSERT INTO locations (location_en, location_fr, parent_id) VALUES
('Bonduma', 'Bonduma', (SELECT id FROM locations WHERE location_en = 'Buea' AND parent_id = 9)),
('Great Soppo', 'Great Soppo', (SELECT id FROM locations WHERE location_en = 'Buea' AND parent_id = 9)),
('Molyko', 'Molyko', (SELECT id FROM locations WHERE location_en = 'Buea' AND parent_id = 9)),
('Muea', 'Muea', (SELECT id FROM locations WHERE location_en = 'Buea' AND parent_id = 9)),
('Town', 'Town', (SELECT id FROM locations WHERE location_en = 'Buea' AND parent_id = 9));

-- Update listings table to use single location_id field
-- First drop the location_id column if it exists and add it back
ALTER TABLE public.listings 
  DROP COLUMN IF EXISTS location_id;

ALTER TABLE public.listings 
  ADD COLUMN location_id INTEGER REFERENCES locations(id);

-- Create index for location_id
CREATE INDEX IF NOT EXISTS idx_listings_location_id ON listings(location_id);

-- Update the database types
-- The location field in listings now points to the quarter level (most specific location)
-- To get the full hierarchy, we can use recursive queries
