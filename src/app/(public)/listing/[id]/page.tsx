import { MainLayout } from "@/components/main-layout";
import { listingsRepo, categoriesRepo, reviewsRepo } from "@/lib/repositories";
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
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  User, 
  Tag,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ListingReviews } from "@/components/listing-reviews";
import { ListingContactCard } from "@/components/listing-contact-card";
import { SimilarListings } from "@/components/similar-listings";
import { ListingImageGallery } from "@/components/listing-image-gallery";
import { ListingBreadcrumbs } from "@/components/listing-breadcrumbs";
import { ListingDescription } from "@/components/listing-description";
import type { Metadata } from "next";

// Dynamic metadata for social sharing (OG/Twitter)
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params;
    const listing = await listingsRepo.getById(id);

    const siteName = "Obilli";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.obilli.com";
    const title = listing?.title ? `${listing.title} | ${siteName}` : siteName;
    const description = listing?.description
      ? String(listing.description).slice(0, 200)
      : "Buy and sell goods, services, and find jobs in Cameroon";
    const rawImage = listing?.media?.[0]?.url || `${baseUrl}/logo.png`;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage}`;
    const url = `${baseUrl}/listing/${id}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName,
        type: "article",
        images: [
          {
            url: imageUrl,
            secureUrl: imageUrl,
            width: 1200,
            height: 630,
            type: 'image/jpeg',
            alt: listing?.title || siteName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Obilli",
      description: "Buy and sell goods, services, and find jobs in Cameroon",
    };
  }
}

// More granular suspense boundaries for better loading experience
function GranularSuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Server component for the listing detail page with background refresh
export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: listingId } = await params;
  
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
          <ListingBreadcrumbs items={breadcrumbItems} />
          
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
              <ListingImageGallery images={images} title={listing.title} />
              
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
                <ListingDescription description={listing.description} />
              </div>
              
              {/* Reviews Section - client component with pre-fetched data */}
              <div className="mt-12">
                <GranularSuspenseWrapper fallback={<ReviewsSkeleton />}>
                  <ListingReviews 
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
                <ListingContactCard listing={listing} seller={seller} />
              </GranularSuspenseWrapper>
            </div>
          </div>
          
          {/* Similar Listings - client component with pre-fetched data */}
          {listing.category_id && (
            <div className="border-t border-border mt-16">
              <GranularSuspenseWrapper fallback={<SimilarListingsSkeleton />}>
                <SimilarListings 
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
              <div className="space-y-33">
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
