-- Bonas Marketplace Database Schema
-- Initial migration for core tables and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
CREATE TYPE listing_type AS ENUM ('good', 'service', 'job');
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'published', 'paused', 'expired', 'removed');
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE boost_type AS ENUM ('featured', 'premium', 'highlighted');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    phone TEXT,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    location_city TEXT,
    location_region TEXT,
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_document_url TEXT,
    whatsapp_number TEXT,
    show_phone BOOLEAN DEFAULT TRUE,
    show_whatsapp BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    icon_name TEXT,
    listing_type listing_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE public.listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    listing_type listing_type NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    price DECIMAL(12,2),
    currency TEXT DEFAULT 'XAF',
    location_city TEXT,
    location_region TEXT,
    location_address TEXT,
    condition TEXT, -- for goods: 'new', 'used', 'refurbished'
    images JSONB DEFAULT '[]', -- Array of image URLs
    video_url TEXT,
    status listing_status DEFAULT 'draft',
    is_negotiable BOOLEAN DEFAULT FALSE,
    contact_preference TEXT DEFAULT 'both', -- 'phone', 'whatsapp', 'both', 'messages'
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    boost_expires_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service packages table (for service listings)
CREATE TABLE public.service_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Basic', 'Standard', 'Premium'
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    delivery_time_days INTEGER,
    features JSONB DEFAULT '[]', -- Array of feature strings
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- If transaction was completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boost orders table
CREATE TABLE public.boost_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    boost_type boost_type NOT NULL,
    duration_days INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    payment_method TEXT NOT NULL, -- 'mtn_momo', 'orange_money'
    payment_reference TEXT,
    payment_status payment_status DEFAULT 'pending',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moderation flags table
CREATE TABLE public.moderation_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    flagger_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status moderation_status DEFAULT 'pending',
    moderator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    moderator_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Ads table (for admin-managed advertisements)
CREATE TABLE public.ads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    placement TEXT NOT NULL, -- 'banner', 'sidebar', 'feed'
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'listing_view', 'listing_inquiry', 'search', 'boost_purchase'
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved searches table
CREATE TABLE public.saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    query_params JSONB NOT NULL,
    email_alerts BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_location ON listings(location_city, location_region);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_boost_expires ON listings(boost_expires_at DESC) WHERE boost_expires_at IS NOT NULL;
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type, created_at);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);
CREATE INDEX idx_reviews_seller ON reviews(seller_id);

-- Full-text search index
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description));

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE boost_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Listings policies
CREATE POLICY "Published listings are viewable by everyone" ON listings
    FOR SELECT USING (status = 'published' OR seller_id = auth.uid());

CREATE POLICY "Users can insert their own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings" ON listings
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own listings" ON listings
    FOR DELETE USING (auth.uid() = seller_id);

-- Service packages policies
CREATE POLICY "Service packages viewable with listings" ON service_packages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = service_packages.listing_id 
            AND (listings.status = 'published' OR listings.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage packages for their listings" ON service_packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = service_packages.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of received messages" ON messages
    FOR UPDATE USING (recipient_id = auth.uid());

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Boost orders policies
CREATE POLICY "Users can view their own boost orders" ON boost_orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create boost orders" ON boost_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Moderation flags policies
CREATE POLICY "Users can view flags they created" ON moderation_flags
    FOR SELECT USING (flagger_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('moderator', 'admin')));

CREATE POLICY "Users can create moderation flags" ON moderation_flags
    FOR INSERT WITH CHECK (auth.uid() = flagger_id);

-- Ads policies (public read)
CREATE POLICY "Active ads are viewable by everyone" ON ads
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Analytics events policies
CREATE POLICY "Users can create analytics events" ON analytics_events
    FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Saved searches policies
CREATE POLICY "Users can manage their own saved searches" ON saved_searches
    FOR ALL USING (user_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name_en, name_fr, slug, listing_type, sort_order) VALUES
-- Goods categories
('Electronics', 'Électronique', 'electronics', 'good', 1),
('Vehicles', 'Véhicules', 'vehicles', 'good', 2),
('Home & Garden', 'Maison et Jardin', 'home-garden', 'good', 3),
('Fashion', 'Mode', 'fashion', 'good', 4),
('Sports & Hobbies', 'Sports et Loisirs', 'sports-hobbies', 'good', 5),
('Books & Media', 'Livres et Médias', 'books-media', 'good', 6),

-- Services categories
('Professional Services', 'Services Professionnels', 'professional-services', 'service', 7),
('Home Services', 'Services à Domicile', 'home-services', 'service', 8),
('Beauty & Wellness', 'Beauté et Bien-être', 'beauty-wellness', 'service', 9),
('Education & Training', 'Éducation et Formation', 'education-training', 'service', 10),
('Events & Entertainment', 'Événements et Divertissement', 'events-entertainment', 'service', 11),

-- Jobs categories
('Full-time Jobs', 'Emplois à Temps Plein', 'full-time-jobs', 'job', 12),
('Part-time Jobs', 'Emplois à Temps Partiel', 'part-time-jobs', 'job', 13),
('Freelance', 'Freelance', 'freelance', 'job', 14),
('Internships', 'Stages', 'internships', 'job', 15);