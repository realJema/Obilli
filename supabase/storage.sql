-- Enable storage
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to listing images
CREATE POLICY "Anyone can view listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing_images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

