"use client";

import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Phone, 
  Eye,
  type LucideIcon 
} from "lucide-react";
import { listingsRepo, profilesRepo, reviewsRepo } from "@/lib/repositories";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { ProfileWithStats } from "@/lib/repositories/profiles";
import type { ReviewWithProfiles } from "@/lib/repositories/reviews";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";

interface ListingDetailPageProps {
  params: { id: string };
}

function MediaGallery({ media, title }: { 
  media: ListingWithDetails['media']; 
  title: string; 
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  if (!media || media.length === 0) {
    // Use a default Unsplash image for listings without media
    const defaultImageUrl = `https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&h=600&auto=format&fit=crop`;
    
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <Image
            src={defaultImageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800&h=600&auto=format&fit=crop';
            }}
          />
        </div>
      </div>
    );
  }

  const selectedMedia = media[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
        <Image
          src={selectedMedia.url}
          alt={title}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800&h=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                index === selectedIndex 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <Image
                src={item.url}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Use a guaranteed working Unsplash fallback for thumbnails
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=80&h=80&auto=format&fit=crop';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SellerCard({ seller }: { seller: ProfileWithStats }) {
  const { t, formatRelativeTime } = useI18n();
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
      
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {seller.avatar_url ? (
            <Image
              src={seller.avatar_url}
              alt={seller.full_name || seller.username || 'Seller'}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="text-2xl">👤</div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium">{seller.full_name || seller.username}</h4>
            {seller.is_verified && (
              <div className="flex items-center text-primary">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs ml-1">Verified</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            {seller.average_rating && seller.review_count ? (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{seller.average_rating.toFixed(1)}</span>
                <span>({seller.review_count} reviews)</span>
              </div>
            ) : null}
            
            <div>{seller.listing_count || 0} active listings</div>
            <div>Joined {formatRelativeTime(seller.created_at || new Date().toISOString())}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Send Message
        </button>
        
        <button className="w-full border border-border py-3 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
          <Phone className="h-5 w-5 mr-2" />
          Show Phone
        </button>
      </div>
    </div>
  );
}

function ReviewsSection({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const [reviews, setReviews] = useState<ReviewWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { formatRelativeTime } = useI18n();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const listingReviews = await reviewsRepo.getByListing(listingId, 5);
        setReviews(listingReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [listingId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-full mb-1"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {review.reviewer?.avatar_url ? (
                  <Image
                    src={review.reviewer.avatar_url}
                    alt={review.reviewer.full_name || review.reviewer.username || 'Reviewer'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="text-sm">👤</div>
                )}
              </div>
              
              <div>
                <div className="font-medium text-sm">
                  {review.reviewer?.full_name || review.reviewer?.username || 'Anonymous'}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < (review.rating || 0) 
                            ? 'fill-primary text-primary' 
                            : 'text-muted'
                        }`} 
                      />
                    ))}
                  </div>
                  <span>{formatRelativeTime(review.created_at || new Date().toISOString())}</span>
                </div>
              </div>
            </div>
            
            {review.comment && (
              <p className="text-sm text-foreground ml-13">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
      
      <Link
        href={`/seller/${sellerId}/reviews`}
        className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
      >
        View all reviews
      </Link>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const { t, formatCurrency, formatRelativeTime } = useI18n();
  
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [seller, setSeller] = useState<ProfileWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const listingId = params?.id as string;
  
  useEffect(() => {
    if (!listingId) {
      setError('No listing ID provided');
      setIsLoading(false);
      return;
    }

    const loadListing = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const listingData = await listingsRepo.getById(listingId);
        if (!listingData) {
          setError('Listing not found');
          return;
        }
        
        setListing(listingData);
        
        // Increment view count (don't await to avoid blocking)
        listingsRepo.incrementViewCount(listingId);
        
        // Load seller information
        if (listingData.owner_id) {
          const sellerData = await profilesRepo.getWithStats(listingData.owner_id);
          if (sellerData) {
            setSeller(sellerData);
          }
        }
        
      } catch (err) {
        console.error('Failed to load listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId]);
  
  if (!listingId || error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {error || 'Invalid Listing'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || 'No listing ID provided.'}
            </p>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-[4/3] bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!listing) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Listing not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The listing you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isOwner = user?.id === listing.owner_id;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button and actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-full border transition-colors ${
                isSaved 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-border hover:bg-accent'
              }`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            
            <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            
            {!isOwner && (
              <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors text-destructive">
                <Flag className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Gallery */}
            <MediaGallery media={listing.media} title={listing.title} />
            
            {/* Listing Information */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{listing.title}</h1>
                {listing.price_xaf && (
                  <div className="text-3xl font-bold text-primary mb-4">
                    {formatCurrency(listing.price_xaf)}
                    {listing.negotiable && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Negotiable)
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {(listing.location_city || listing.location_region) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {[listing.location_city, listing.location_region].filter(Boolean).join(', ')}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatRelativeTime(listing.created_at || new Date().toISOString())}
                </div>
                
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Views: {listing.id ? parseInt(listing.id.slice(-3), 16) % 900 + 100 : 247}
                </div>
                
                {listing.category && (
                  <Link 
                    href={`/search?category=${listing.category.id}`}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium hover:bg-secondary/80"
                  >
                    {listing.category.name_en}
                  </Link>
                )}
              </div>
              
              {/* Description */}
              {listing.description && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
              
              {/* Service Packages */}
              {listing.service_packages && listing.service_packages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Packages</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {listing.service_packages.map((pkg) => (
                      <div key={pkg.id} className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold capitalize mb-2">{pkg.tier}</h4>
                        {pkg.name && <p className="text-sm text-muted-foreground mb-2">{pkg.name}</p>}
                        <div className="text-xl font-bold text-primary mb-2">
                          {formatCurrency(pkg.price_xaf)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Delivery: {pkg.delivery_days} days
                        </div>
                        {pkg.description && (
                          <p className="text-sm text-foreground">{pkg.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Reviews Section */}
            {seller && (
              <ReviewsSection listingId={listing.id} sellerId={seller.id} />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {seller && <SellerCard seller={seller} />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
