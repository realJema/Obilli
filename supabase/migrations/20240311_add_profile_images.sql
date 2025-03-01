-- Enable storage if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS "storage";

-- Create storage tables if they don't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text NOT NULL,
  name text NOT NULL,
  owner uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false,
  avif_autodetection boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[],
  CONSTRAINT buckets_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bucket_id text,
  name text,
  owner uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  CONSTRAINT objects_pkey PRIMARY KEY (id),
  CONSTRAINT objects_buckets_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'profile_images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile image" ON storage.objects;

-- Allow authenticated users to upload their own profile images
CREATE POLICY "Users can upload own profile image"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to profile images
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile_images');

-- Allow users to update their own profile images
CREATE POLICY "Users can update own profile image"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete own profile image"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
); 
