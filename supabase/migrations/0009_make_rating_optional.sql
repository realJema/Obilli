-- Make rating field optional in reviews table and allow 0 as a valid value
ALTER TABLE public.reviews 
  ALTER COLUMN rating DROP NOT NULL;

-- Update the check constraint to allow 0 as a valid value
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_rating_check;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_check 
  CHECK (rating >= 0 AND rating <= 5);