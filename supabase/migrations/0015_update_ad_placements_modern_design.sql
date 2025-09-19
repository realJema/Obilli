-- Ensure all ad placements are available for the modern ad design
-- Add any missing placement types
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-top';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-middle';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-bottom';