import { MainLayout } from "@/components/main-layout";
import { listingsRepo, categoriesRepo, reviewsRepo } from "@/lib/repositories";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { ReviewWithProfiles } from "@/lib/repositories/reviews";
import { 
  MapPin, 
  Clock, 
  Star, 
  Share2, 
  Phone, 
  MessageCircle, 
  Eye, 
  Package, 
  Shield, 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  User, 
  Tag, 
  Facebook, 
  Twitter, 
  Copy,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// More granular suspense boundaries for better loading experience
function GranularSuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Server component for the listing detail page with background refresh
export default async function ListingDetailsPage({ params }: { params: { id: string } }) {
  const listingId = params.id;
  
  // Fetch listing details server-side with background refresh
  const listing = await listingsRepo.getById(listingId);
  
  if (!listing) {
    notFound();
  }
  
  // Fetch category info if exists
  const category = listing.category_id ? await categoriesRepo.getById(listing.category_id) : null;
  
  // Get seller info from listing
  const seller = listing.owner || null;
  
  // Get images
  const images = listing.media?.map(m => m.url) || [];
  
  // Build breadcrumb items
  const breadcrumbItems = [
    category ? { label: category.name_en, href: `/search?category=${category.id}` } : { label: 'Category' },
    { label: listing.title }
  ];
  
  // Fetch related listings and reviews in parallel with background refresh
  const [relatedListings, reviews] = await Promise.all([
    listing.category_id ? listingsRepo.getAll(
      { category_id: listing.category_id },
      { field: 'created_at', direction: 'desc' },
      4, // Limit to 4 related listings
      0
    ).then(result => result.data.filter(listing => listing.id !== listingId)) : Promise.resolve([]),
    reviewsRepo.getByListing(listingId, 10, 0)
  ]);

  return (
    <MainLayout>
      <GranularSuspenseWrapper fallback={<ListingSkeleton />}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Seller Info - above image */}
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  {seller?.avatar_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <DefaultImage 
                        src={seller.avatar_url}
                        alt={seller?.username || 'Seller'}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{seller?.username || 'Anonymous'}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      Seller
                      {seller?.is_verified && (
                        <>
                          <span className="mx-1">•</span>
                          <Shield className="h-3 w-3 mr-1 text-green-600" />
                          <span className="text-green-600">Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Title - below seller, above image */}
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {listing.title}
              </h1>
              
              {/* Image Gallery */}
              <ImageGallery images={images} title={listing.title} />
              
              {/* Listing Info */}
              <div className="mt-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {listing.category && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {listing.category.name_en}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </div>
              
              {/* Reviews Section - client component with pre-fetched data */}
              <div className="mt-12">
                <GranularSuspenseWrapper fallback={<ReviewsSkeleton />}>
                  <ClientReviewsSection 
                    listingId={listing.id} 
                    sellerId={listing.owner_id} 
                    initialReviews={reviews}
                  />
                </GranularSuspenseWrapper>
              </div>
            </div>
            
            {/* Sidebar - client component */}
            <div>
              <GranularSuspenseWrapper fallback={<ContactCardSkeleton />}>
                <ClientContactCard listing={listing} seller={seller} />
              </GranularSuspenseWrapper>
            </div>
          </div>
          
          {/* Similar Listings - client component with pre-fetched data */}
          {listing.category_id && (
            <div className="border-t border-border mt-16">
              <GranularSuspenseWrapper fallback={<SimilarListingsSkeleton />}>
                <ClientSimilarListings 
                  categoryId={listing.category_id} 
                  currentListingId={listing.id} 
                  initialListings={relatedListings}
                />
              </GranularSuspenseWrapper>
            </div>
          )}
        </div>
      </GranularSuspenseWrapper>
    </MainLayout>
  );
}

// Skeleton loader for the listing page
function ListingSkeleton() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="h-8 bg-muted rounded w-3/4 mb-6"></div>
              <div className="aspect-[4/3] bg-muted rounded-lg mb-6"></div>
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
            <div className="bg-muted rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Skeleton loader for reviews section
function ReviewsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 bg-muted rounded w-32 mb-2"></div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
        <div className="h-10 bg-muted rounded w-32"></div>
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted"></div>
              <div>
                <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton loader for contact card
function ContactCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-6 animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
      <div className="space-y-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="h-5 w-5 bg-muted rounded mt-0.5"></div>
            <div>
              <div className="h-4 bg-muted rounded w-24 mb-1"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex justify-between text-sm">
            <div className="h-3 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-12 bg-muted rounded"></div>
        <div className="h-12 bg-muted rounded"></div>
      </div>
      <div className="pt-4 border-t border-border">
        <div className="h-12 bg-muted rounded"></div>
      </div>
    </div>
  );
}

// Skeleton loader for similar listings
function SimilarListingsSkeleton() {
  return (
    <div className="py-8 animate-pulse">
      <div className="h-6 bg-muted rounded w-32 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[3/2] bg-muted"></div>
            <div className="p-3">
              <div className="h-4 bg-muted rounded mb-1"></div>
              <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="flex items-center text-xs mt-2">
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Breadcrumbs component
function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Image gallery component
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  // For server-side rendering, we'll show a simpler version
  const currentIndex = 0;
  
  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
        <DefaultImage
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              <DefaultImage
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Client components for interactive elements
function ClientContactCard({ listing, seller }: { listing: ListingWithDetails; seller: any }) {
  // This will be a client component that handles the contact card interactions
  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
      <div className="mb-6">
        <div className="text-3xl font-bold text-primary mb-1">
          {listing.price_xaf && listing.price_xaf > 0 
            ? `FCFA ${listing.price_xaf.toLocaleString()}` 
            : 'Negotiable'}
        </div>
        {listing.negotiable && (
          <div className="text-sm text-muted-foreground">Negotiable</div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">
              {listing.location ? listing.location.location_en : 'Not specified'}
            </div>
            <div className="text-sm text-muted-foreground">Location</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">
              {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Not specified'}
            </div>
            <div className="text-sm text-muted-foreground">Posted</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">{listing.view_count || 0} views</div>
            <div className="text-sm text-muted-foreground">Interest Level</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Condition:
          </span>
          <span className="font-medium capitalize">{listing.condition || 'Not specified'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <Package className="h-4 w-4 mr-1" />
            Type:
          </span>
          <span className="font-medium capitalize">{listing.type}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Send WhatsApp Message
        </button>
        
        {seller?.show_phone && seller?.phone && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call {seller.phone}
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-border">
        <button
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-primary/90"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </button>
      </div>
    </div>
  );
}

function ClientSimilarListings({ 
  categoryId, 
  currentListingId, 
  initialListings 
}: { 
  categoryId: number; 
  currentListingId: string;
  initialListings: ListingWithDetails[];
}) {
  // This will be a client component that fetches similar listings
  // But now it has initial data to show immediately
  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">Similar Listings</h3>
      {initialListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {initialListings.map((listing) => {
            const imageUrl = listing.media && listing.media.length > 0 
              ? listing.media[0].url 
              : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
            
            return (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="block group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[3/2]">
                    <DefaultImage
                      src={imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {listing.title}
                    </h4>
                    
                    {listing.price_xaf && listing.price_xaf > 0 ? (
                      <div className="text-lg font-bold text-primary mb-1">
                        {`FCFA ${listing.price_xaf.toLocaleString()}`}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-primary mb-1">
                        Negotiable
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground">
          No similar listings found.
        </div>
      )}
    </div>
  );
}

function ClientReviewsSection({ 
  listingId, 
  sellerId, 
  initialReviews 
}: { 
  listingId: string; 
  sellerId: string;
  initialReviews: ReviewWithProfiles[];
}) {
  // This will be a client component that handles reviews
  // But now it has initial data to show immediately
  
  // Calculate average rating
  const averageRating = initialReviews.length > 0 
    ? initialReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / initialReviews.length 
    : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({initialReviews.length} reviews)</span>
            </div>
          </div>
        </div>
        
        <button
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Write Review
        </button>
      </div>

      <div className="space-y-6">
        {initialReviews.length > 0 ? (
          initialReviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{review.reviewer?.username || 'Anonymous'}</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {review.helpful_votes !== null && review.helpful_votes !== undefined && review.helpful_votes > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {review.helpful_votes}
                  </div>
                )}
              </div>
              
              {review.title && (
                <h4 className="font-medium mb-2">{review.title}</h4>
              )}
              
              <p className="text-muted-foreground">{review.comment}</p>
              
              {review.is_verified && (
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified Purchase
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet. Be the first to review this listing!</p>
          </div>
        )}
      </div>
    </div>
  );
}