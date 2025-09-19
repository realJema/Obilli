-- Add new ad placements for the redesigned homepage
-- Add the new placement types to the existing enum
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-top';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-middle';
ALTER TYPE ad_placement ADD VALUE IF NOT EXISTS 'rectangular-bottom';