"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { listingsRepo, reviewsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { ReviewWithProfiles } from "@/lib/repositories/reviews";
import { DefaultImage } from "@/components/default-image";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Share2,
  Flag,
  Heart,
  Phone,
  MessageCircle,
  Eye,
  Package,
  Shield,
  Truck,
  X,
  MessageSquare,
  ThumbsUp,
  Calendar,
  User,
  Tag,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ImageGalleryProps {
  images: string[];
  title: string;
}

interface SellerProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
  phone: string | null;
  whatsapp_number: string | null;
  show_phone: boolean | null;
  show_whatsapp: boolean | null;
}

interface CategoryInfo {
  id: number;
  name_en: string;
  name_fr: string;
  slug: string;
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div 
          className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setShowFullscreen(true)}
        >
          <DefaultImage
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-4xl max-h-full mx-4">
            <DefaultImage
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-screen"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
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

function ContactCard({ listing, seller }: { listing: ListingWithDetails; seller: SellerProfile | null }) {
  const { formatCurrency, formatRelativeTime } = useI18n();
  const [showContactForm, setShowContactForm] = useState(false);

  // Helper function to format location hierarchy
  const getLocationDisplay = () => {
    if (!listing.location) return 'Location not specified';
    
    const parts = [];
    parts.push(listing.location.location_en); // Quarter
    
    if (listing.location.city) {
      parts.push(listing.location.city.location_en); // City
      
      if (listing.location.city.region) {
        parts.push(listing.location.city.region.location_en); // Region
      }
    }
    
    return parts.join(', ');
  };

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in your listing: ${listing.title}`;
    const phone = seller?.whatsapp_number || seller?.phone;
    if (phone) {
      const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCallClick = () => {
    const phone = seller?.phone;
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
      {/* Price - Most Important */}
      {listing.price_xaf && (
        <div className="mb-6">
          <div className="text-3xl font-bold text-primary mb-1">
            {formatCurrency(listing.price_xaf)}
          </div>
          {listing.negotiable && (
            <div className="text-sm text-muted-foreground">Negotiable</div>
          )}
        </div>
      )}

      {/* Key Information - Location, Date, Views */}
      <div className="space-y-4 mb-6">
        {/* Location - High Priority */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">{getLocationDisplay()}</div>
            <div className="text-sm text-muted-foreground">Location</div>
          </div>
        </div>
        
        {/* Posted Date - High Priority */}
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">
              {listing.created_at ? formatRelativeTime(listing.created_at) : 'Unknown'}
            </div>
            <div className="text-sm text-muted-foreground">Posted</div>
          </div>
        </div>
        
        {/* Views - High Priority */}
        <div className="flex items-start space-x-3">
          <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">{listing.view_count || 0} views</div>
            <div className="text-sm text-muted-foreground">Interest level</div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
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

      {/* Contact Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Send WhatsApp Message
        </button>
        
        {seller?.show_phone && seller?.phone && (
          <button
            onClick={handleCallClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call {seller.phone}
          </button>
        )}
        
        <button
          onClick={() => setShowContactForm(true)}
          className="w-full border border-border hover:bg-accent py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Send Message
        </button>
      </div>

      {/* Seller Info - Compact */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
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

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t border-border">
        <button className="flex-1 border border-border hover:bg-accent py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm">
          <Heart className="h-4 w-4 mr-1" />
          Save
        </button>
        <button className="flex-1 border border-border hover:bg-accent py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </button>
        <button className="flex-1 border border-border hover:bg-accent py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-sm">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </button>
      </div>
    </div>
  );
}

function SimilarListings({ categoryId, currentListingId }: { categoryId: number; currentListingId: string }) {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { formatCurrency, formatRelativeTime } = useI18n();

  useEffect(() => {
    const loadSimilarListings = async () => {
      try {
        setIsLoading(true);
        const { data } = await listingsRepo.getAll(
          { category_id: categoryId },
          { field: 'created_at', direction: 'desc' },
          6,
          0
        );
        // Filter out current listing
        const filtered = data.filter(listing => listing.id !== currentListingId);
        setListings(filtered.slice(0, 4));
      } catch (error) {
        console.error('Failed to load similar listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSimilarListings();
  }, [categoryId, currentListingId]);

  if (isLoading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-6">Similar Listings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[3/2] bg-muted"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">Similar Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {listings.map((listing) => {
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
                  
                  {listing.price_xaf && (
                    <div className="text-lg font-bold text-primary mb-1">
                      {formatCurrency(listing.price_xaf)}
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {listing.created_at ? formatRelativeTime(listing.created_at) : 'Unknown'}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params?.id as string;
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency, formatRelativeTime } = useI18n();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get listing details
        const listingData = await listingsRepo.getById(listingId);
        if (!listingData) {
          setError('Listing not found');
          return;
        }
        
        setListing(listingData);
        
        // Get seller info
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, is_verified, phone, whatsapp_number, show_phone, show_whatsapp')
          .eq('id', listingData.owner_id)
          .single();
        
        setSeller(sellerData);
        
        // Get category info
        if (listingData.category_id) {
          const categoryData = await categoriesRepo.getById(listingData.category_id);
          setCategory(categoryData);
        }
        
        // Increment view count
        await supabase
          .from('listings')
          .update({ view_count: (listingData.view_count || 0) + 1 })
          .eq('id', listingId);
        
      } catch (err) {
        console.error('Failed to load listing:', err);
        setError('Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId, supabase]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-[4/3] bg-muted rounded-lg mb-6"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
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

  if (error || !listing) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {error || 'Listing not found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              The listing you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const images = listing.media?.map(m => m.url) || [];
  const breadcrumbItems: BreadcrumbItem[] = [
    category ? { label: category.name_en, href: `/search?category=${category.id}` } : { label: 'Category' },
    { label: listing.title }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <ImageGallery images={images} title={listing.title} />
            
            {/* Listing Info */}
            <div className="mt-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {listing.title}
                  </h1>
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
            
            {/* Reviews Section */}
            <div className="mt-12">
              <ReviewsSection listingId={listing.id} sellerId={listing.owner_id} />
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <ContactCard listing={listing} seller={seller} />
          </div>
        </div>
        
        {/* Similar Listings */}
        {listing.category_id && (
          <div className="border-t border-border mt-16">
            <SimilarListings categoryId={listing.category_id} currentListingId={listing.id} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function ReviewsSection({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const [reviews, setReviews] = useState<ReviewWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const reviewsData = await reviewsRepo.getByListing(listingId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [listingId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          reviewer_id: user.id,
          seller_id: sellerId,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment
        })
        .select()
        .single();

      if (error) throw error;

      // Reload reviews
      const reviewsData = await reviewsRepo.getByListing(listingId);
      setReviews(reviewsData);
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
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
            <span className="text-muted-foreground ml-1">({reviews.length} reviews)</span>
          </div>
        </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title (optional)</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder="Brief summary of your review"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md"
                rows={4}
                placeholder="Share your experience..."
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="border border-border px-4 py-2 rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
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
                
                {(review.helpful_votes || 0) > 0 && (
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
