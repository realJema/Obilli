-- Update ad placements for the redesigned homepage
-- Remove old placements and add new ones
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-top';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-middle';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-bottom';