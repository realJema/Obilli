-- Migration to add indexes for better performance on categories, locations, and trending lookups

-- Index on listings.category_id for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);

-- Index on listings.location_id for faster location-based queries
CREATE INDEX IF NOT EXISTS idx_listings_location_id ON listings(location_id);

-- Index on listings.status for filtering published listings
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Index on listings.created_at for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);

-- Index on listings.view_count for trending queries
CREATE INDEX IF NOT EXISTS idx_listings_view_count ON listings(view_count);

-- Composite index for category and status for common queries
CREATE INDEX IF NOT EXISTS idx_listings_category_status ON listings(category_id, status);

-- Composite index for location and status for common queries
CREATE INDEX IF NOT EXISTS idx_listings_location_status ON listings(location_id, status);

-- Composite index for created_at and status for recent listings
CREATE INDEX IF NOT EXISTS idx_listings_created_status ON listings(created_at DESC, status);

-- Index on categories.parent_id for hierarchical category queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Index on categories.listing_type for filtering by listing type
CREATE INDEX IF NOT EXISTS idx_categories_listing_type ON categories(listing_type);

-- Index on locations.parent_id for location hierarchy queries
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);

-- Index on boosts.is_active and boosts.expires_at for active boosts
CREATE INDEX IF NOT EXISTS idx_boosts_active_expires ON boosts(is_active, expires_at);

-- Index on boosts.tier for sorting by boost tier
CREATE INDEX IF NOT EXISTS idx_boosts_tier ON boosts(tier);

-- Composite index for boosts active status, expiration, and tier
CREATE INDEX IF NOT EXISTS idx_boosts_active_expires_tier ON boosts(is_active, expires_at, tier);