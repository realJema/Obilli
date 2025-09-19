"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  is_active: boolean;
  click_count: number;
  impression_count: number;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface Listing {
  id: string;
  title: string;
  price_xaf: number | null;
  description: string | null;
  created_at: string | null;
  category?: {
    id: number;
    name_en: string;
    name_fr: string;
  } | null;
  owner?: {
    id: string;
    username: string | null;
  } | null;
  listing_media?: {
    url: string;
  }[] | null;
  location?: {
    id: number;
    location_en: string;
    location_fr: string;
  } | null;
}

// Helper function to extract single object from array
function extractSingle<T>(arr: T[] | T | null | undefined): T | null {
  if (Array.isArray(arr)) {
    return arr.length > 0 ? arr[0] : null;
  }
  return arr || null;
}

// Helper function to ensure array
function ensureArray<T>(arr: T[] | T | null | undefined): T[] {
  if (Array.isArray(arr)) {
    return arr;
  }
  return arr ? [arr] : [];
}

export function AdBanner({ placement = "feed" }: { placement?: string }) {
  const supabase = useSupabaseClient();
  const [ads, setAds] = useState<Ad[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showListings, setShowListings] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("placement", placement)
          .eq("is_active", true)
          .lte("starts_at", new Date().toISOString())
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching ads:", error);
          console.error("Error details:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          // Continue to fetch listings as fallback
        }
        
        setAds(data || []);
        
        // If no ads or error occurred, fetch latest listings
        if (!data || data.length === 0 || error) {
          const { data: listingsData, error: listingsError } = await supabase
            .from("listings")
            .select(`
              id, title, price_xaf, description, created_at,
              category:categories(id, name_en, name_fr),
              owner:profiles(id, username),
              listing_media(url),
              location:locations!location_id(
                id,
                location_en,
                location_fr
              )
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (listingsError) {
            console.error("Error fetching latest listings:", listingsError);
            console.error("Listings error details:", {
              message: listingsError.message,
              code: listingsError.code,
              details: listingsError.details,
              hint: listingsError.hint
            });
          } else {
            // Transform the data to match our Listing interface
            const transformedListings = (listingsData || []).map((listing: any) => ({
              id: listing.id,
              title: listing.title,
              price_xaf: listing.price_xaf,
              description: listing.description,
              created_at: listing.created_at,
              category: extractSingle(listing.category),
              owner: extractSingle(listing.owner),
              listing_media: ensureArray(listing.listing_media),
              location: extractSingle(listing.location)
            }));
            
            setListings(transformedListings);
            setShowListings(true);
          }
        }
      } catch (error) {
        console.error("Error in fetchAds:", error);
        // Even if there's a catch error, try to fetch listings as fallback
        try {
          const { data: listingsData, error: listingsError } = await supabase
            .from("listings")
            .select(`
              id, title, price_xaf, description, created_at,
              category:categories(id, name_en, name_fr),
              owner:profiles(id, username),
              listing_media(url),
              location:locations!location_id(
                id,
                location_en,
                location_fr
              )
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (listingsError) {
            console.error("Error fetching latest listings in catch block:", listingsError);
          } else {
            // Transform the data to match our Listing interface
            const transformedListings = (listingsData || []).map((listing: any) => ({
              id: listing.id,
              title: listing.title,
              price_xaf: listing.price_xaf,
              description: listing.description,
              created_at: listing.created_at,
              category: extractSingle(listing.category),
              owner: extractSingle(listing.owner),
              listing_media: ensureArray(listing.listing_media),
              location: extractSingle(listing.location)
            }));
            
            setListings(transformedListings);
            setShowListings(true);
          }
        } catch (listingsError) {
          console.error("Error fetching listings as fallback:", listingsError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [supabase, placement]);

  // Rotate ads every 10 seconds
  useEffect(() => {
    // Since we're only showing one item now, no need to rotate
    return;
  }, [ads.length, listings.length, showListings]);

  // Increment impression count when ad is shown
  useEffect(() => {
    if (ads.length > 0 && !showListings && ads[currentIndex]) {
      const ad = ads[currentIndex];
      // Increment impression count (non-blocking)
      supabase
        .from("ads")
        .update({ impression_count: ad.impression_count + 1 })
        .eq("id", ad.id);
    }
  }, [currentIndex, ads, supabase, showListings]);

  const handleAdClick = async (adId: string) => {
    // Increment click count
    const ad = ads.find(a => a.id === adId);
    if (ad) {
      await supabase
        .from("ads")
        .update({ click_count: ad.click_count + 1 })
        .eq("id", adId);
    }
  };

  if (loading) {
    return null;
  }

  // If no ads and no listings, return null
  if (ads.length === 0 && listings.length === 0) {
    return null;
  }

  // Show listings if no ads or if explicitly showing listings
  if (showListings && listings.length > 0) {
    const currentListing = listings[0]; // Always show the first listing
    const imageUrl = currentListing.listing_media && currentListing.listing_media.length > 0 
      ? currentListing.listing_media[0].url 
      : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
      
    const locationDisplay = currentListing.location 
      ? (currentListing.location.location_fr || currentListing.location.location_en)
      : null;
      
    const priceDisplay = currentListing.price_xaf && currentListing.price_xaf > 0 
      ? `FCFA ${currentListing.price_xaf.toLocaleString()}`
      : "Negotiable";

    return (
      <section className="mb-8 relative">
        {/* Image content */}
        <div className="relative rounded-xl overflow-hidden group">
          <div className="relative h-64 w-full">
            <DefaultImage
              src={imageUrl}
              alt={currentListing.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        </div>
        
        {/* Squared info card overlapping the top of the image with reduced width */}
        <div className="absolute -top-4 left-4 w-64 bg-card border border-border rounded-lg shadow-xl p-4 transform transition-transform group-hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <h3 className="font-bold text-foreground line-clamp-1">{currentListing.title}</h3>
              <div className="text-sm font-bold text-primary mt-1">
                {priceDisplay}
              </div>
              {locationDisplay && (
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locationDisplay}
                </div>
              )}
            </div>
            <Link 
              href={`/listing/${currentListing.id}`} 
              className="flex-shrink-0 bg-primary text-primary-foreground rounded-lg p-2 hover:bg-primary/90 transition-colors h-10 w-10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Show ads if available
  if (ads.length > 0) {
    const currentAd = ads[0]; // Always show the first ad

    return (
      <section className="mb-8 relative">
        
        {/* Image content */}
        {currentAd.image_url ? (
          <>
            <div className="relative rounded-xl overflow-hidden group">
              <div className="relative h-64 w-2/3">
                <DefaultImage
                  src={currentAd.image_url}
                  alt={currentAd.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </div>
            
            {/* Squared info card overlapping the top of the image with reduced width */}
            <div className="absolute -top-4 left-4 w-64 bg-card border border-border rounded-lg shadow-xl p-4 transform transition-transform group-hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <h3 className="font-bold text-foreground line-clamp-1">{currentAd.title}</h3>
                  {currentAd.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{currentAd.description}</p>
                  )}
                  {currentAd.link_url && (
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Advertisement</span>
                    </div>
                  )}
                </div>
                {currentAd.link_url ? (
                  <a 
                    href={currentAd.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleAdClick(currentAd.id)}
                    className="flex-shrink-0 bg-primary text-primary-foreground rounded-lg p-2 hover:bg-primary/90 transition-colors h-10 w-10 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                ) : (
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-lg p-2 h-10 w-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h3 className="font-bold text-foreground mb-2">{currentAd.title}</h3>
            {currentAd.description && (
              <p className="text-muted-foreground">{currentAd.description}</p>
            )}
            {currentAd.link_url && (
              <a 
                href={currentAd.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleAdClick(currentAd.id)}
                className="inline-flex items-center mt-4 text-primary hover:text-primary/80 font-medium"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        )}
      </section>
    );
  }

  return null;
}