-- Update database schema for reviews and media improvements
-- This builds on the existing schema from 0001_init_bonas_schema.sql

-- Update listings table to support location_id and remove old location fields
ALTER TABLE public.listings 
  ADD COLUMN location_id INTEGER REFERENCES locations(id),
  ADD COLUMN price_xaf INTEGER, -- Change from DECIMAL to INTEGER for XAF
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS currency,
  DROP COLUMN IF EXISTS location_city,
  DROP COLUMN IF EXISTS location_region,
  DROP COLUMN IF EXISTS location_address,
  DROP COLUMN IF EXISTS images; -- We'll use listing_media table instead

-- Update seller_id to be owner_id for consistency
ALTER TABLE public.listings 
  RENAME COLUMN seller_id TO owner_id;

-- Add negotiable column if not exists
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS negotiable BOOLEAN DEFAULT FALSE;

-- Create listing_media table for better media management
CREATE TABLE IF NOT EXISTS public.listing_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update reviews table to support better review system
-- Drop the existing reviews table and recreate with better structure
DROP TABLE IF EXISTS public.reviews;

CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- If transaction was completed
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_listing_media_listing_id ON listing_media(listing_id);
CREATE INDEX idx_listing_media_position ON listing_media(listing_id, position);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_listings_location_id ON listings(location_id);
CREATE INDEX idx_listings_price_xaf ON listings(price_xaf);

-- Update RLS policies for new tables
ALTER TABLE listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Listing media policies
CREATE POLICY "Listing media viewable with listings" ON listing_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_media.listing_id 
            AND (listings.status = 'published' OR listings.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage media for their listings" ON listing_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_media.listing_id 
            AND listings.owner_id = auth.uid()
        )
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Add triggers for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update categories table to use integer IDs instead of UUID for better performance
-- Note: This might need data migration in production
ALTER TABLE categories ALTER COLUMN id TYPE INTEGER USING id::text::integer;
ALTER TABLE categories ALTER COLUMN parent_id TYPE INTEGER USING parent_id::text::integer;
ALTER TABLE listings ALTER COLUMN category_id TYPE INTEGER USING category_id::text::integer;

-- Add some sample data updates for better testing
UPDATE categories SET 
  id = ROW_NUMBER() OVER (ORDER BY created_at),
  parent_id = NULL
WHERE parent_id IS NOT NULL;
