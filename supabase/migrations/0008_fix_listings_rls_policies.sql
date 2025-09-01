-- Fix RLS policies for listings table to use owner_id instead of seller_id

-- Drop existing policies that reference seller_id
DROP POLICY IF EXISTS "Published listings are viewable by everyone" ON public.listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;

-- Create updated policies using owner_id
CREATE POLICY "Published listings are viewable by everyone" ON public.listings
    FOR SELECT USING (status = 'published' OR owner_id = auth.uid());

CREATE POLICY "Users can insert their own listings" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own listings" ON public.listings
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own listings" ON public.listings
    FOR DELETE USING (auth.uid() = owner_id);

-- Also fix service_packages policies to reference owner_id
DROP POLICY IF EXISTS "Service packages viewable with listings" ON public.service_packages;
DROP POLICY IF EXISTS "Users can manage packages for their listings" ON public.service_packages;

CREATE POLICY "Service packages viewable with listings" ON public.service_packages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE listings.id = service_packages.listing_id 
            AND (listings.status = 'published' OR listings.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage packages for their listings" ON public.service_packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE listings.id = service_packages.listing_id 
            AND listings.owner_id = auth.uid()
        )
    );
