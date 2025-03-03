-- Add phone_number column to profiles table
ALTER TABLE profiles ADD COLUMN phone_number TEXT;

-- Update RLS policies to include phone_number
ALTER POLICY "Public profiles are viewable by everyone" ON profiles
  USING (true);

ALTER POLICY "Users can update own profile" ON profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add phone_number to the profiles_public view if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'profiles_public') THEN
    DROP VIEW profiles_public;
    CREATE VIEW profiles_public AS
    SELECT
      id,
      username,
      full_name,
      avatar_url,
      bio,
      location,
      phone_number,
      created_at,
      updated_at
    FROM profiles;
  END IF;
END $$; 
