"use client";

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { analyticsService } from "@/lib/utils/analytics";
import type { UserAnalytics } from "@/lib/utils/analytics";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { Database } from "@/lib/types/database";
import {
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Package,
  Plus,
  Edit,
  Trash2,
  Pause,
  Play,
  Calendar,
  DollarSign,
  Grid3x3,
  List,
  Zap,
  Crown,
  Filter,
  BarChart3,
  Bell,
  Mail,
  User,
  Settings,
  X, // Add X icon for remove buttons
  AlertCircle, // Add AlertCircle icon for boost notification
} from "lucide-react";

export default function DashboardPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { t, formatCurrency, formatRelativeTime } = useI18n();

  // Add state for image management in the edit modal
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImagesToRemove, setExistingImagesToRemove] = useState<string[]>([]);

  // Add state for boost notification
  const [showBoostNotification, setShowBoostNotification] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [userListings, setUserListings] = useState<ListingWithDetails[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingWithDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPauseModal, setShowPauseModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<ListingWithDetails | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'paused'>('all');
  const [boostFilter, setBoostFilter] = useState<'all' | 'boosted' | 'not_boosted'>('all');
  const [activeMenu, setActiveMenu] = useState<'statistics' | 'listings' | 'notifications'>('listings');
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load analytics and user listings in parallel
        const [analyticsData, listingsData] = await Promise.all([
          analyticsService.getUserAnalytics(user.id),
          // Use authenticated supabase client to get all user listings with boost information
          supabase
            .from('listings')
            .select(`
              *,
              category:categories(*),
              media:listing_media(*),
              service_packages(*),
              boosts(
                id,
                tier,
                is_active,
                expires_at,
                created_at
              )
            `)
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
              if (error) throw new Error(`Failed to fetch user listings: ${error.message}`);
              return (data || []) as ListingWithDetails[];
            })
        ]);

        setAnalytics(analyticsData);
        setUserListings(listingsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, router, supabase]);

  // Filter listings based on selected filters
  useEffect(() => {
    let filtered = userListings;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Apply boost filter
    if (boostFilter !== 'all') {
      if (boostFilter === 'boosted') {
        filtered = filtered.filter(listing => hasActiveBoost(listing));
      } else if (boostFilter === 'not_boosted') {
        filtered = filtered.filter(listing => !hasActiveBoost(listing));
      }
    }

    setFilteredListings(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [userListings, statusFilter, boostFilter]);

  // Helper function to check if listing has active boost
  const hasActiveBoost = (listing: ListingWithDetails): boolean => {
    if (!listing.boosts || listing.boosts.length === 0) return false;
    
    const now = new Date();
    return listing.boosts.some((boost) => 
      boost.is_active && 
      boost.expires_at && 
      new Date(boost.expires_at) > now
    );
  };

  // Helper function to get active boost tier
  const getActiveBoostTier = (listing: ListingWithDetails): string | null => {
    if (!listing.boosts || listing.boosts.length === 0) return null;
    
    const now = new Date();
    const activeBoosts = listing.boosts.filter((boost) => 
      boost.is_active && 
      boost.expires_at && 
      new Date(boost.expires_at) > now
    );
    
    if (activeBoosts.length === 0) return null;
    
    // Return highest tier boost (top > premium > featured)
    const tierOrder = { 'top': 3, 'premium': 2, 'featured': 1 };
    return activeBoosts.reduce((highest, boost) => {
      const currentTier = tierOrder[boost.tier as keyof typeof tierOrder] || 0;
      const highestTier = tierOrder[highest.tier as keyof typeof tierOrder] || 0;
      return currentTier > highestTier ? boost : highest;
    }).tier;
  };

  // Helper function to get boost expiry
  const getBoostExpiry = (listing: ListingWithDetails): Date | null => {
    if (!listing.boosts || listing.boosts.length === 0) return null;
    
    const now = new Date();
    const activeBoosts = listing.boosts.filter((boost) => 
      boost.is_active && 
      boost.expires_at && 
      new Date(boost.expires_at) > now
    );
    
    if (activeBoosts.length === 0) return null;
    
    // Get the latest expiry date
    const latestBoost = activeBoosts.reduce((latest, boost) => {
      const boostExpiry = new Date(boost.expires_at!);
      const latestExpiry = latest.expires_at ? new Date(latest.expires_at) : new Date(0);
      return boostExpiry > latestExpiry ? boost : latest;
    });
    
    return latestBoost.expires_at ? new Date(latestBoost.expires_at) : null;
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      setProcessingAction(listingId);
      
      // Use the authenticated supabase client directly
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('owner_id', user!.id);  // Ensure user can only delete their own listings
      
      if (error) {
        throw new Error(`Failed to delete listing: ${error.message}`);
      }
      
      // Remove from local state
      setUserListings(prev => prev.filter(listing => listing.id !== listingId));
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Failed to delete listing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Failed to delete listing: ${errorMessage}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    try {
      setProcessingAction(listingId);
      const newStatus = currentStatus === 'published' ? 'paused' : 'published';
      
      // Use the authenticated supabase client directly
      const { data, error } = await supabase
        .from('listings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', listingId)
        .eq('owner_id', user!.id)  // Ensure user can only update their own listings
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to update listing: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Failed to update listing: No data returned');
      }
      
      // Update local state
      setUserListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: newStatus }
            : listing
        )
      );
    } catch (err) {
      console.error('Failed to update listing status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Failed to update listing status: ${errorMessage}`);
    } finally {
      setProcessingAction(null);
      setShowPauseModal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  // Handle image upload for edit modal
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processEditImageFiles(files);
    
    // Clear the input
    e.target.value = '';
  };

  // Process image files for edit modal
  const processEditImageFiles = (files: File[]) => {
    // Filter for valid image files
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isImage && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only images under 10MB are allowed.');
    }
    
    // Check if we would exceed the limit of 10 images
    const totalImages = (editingListing?.media?.length || 0) + newImages.length - existingImagesToRemove.length + validFiles.length;
    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setNewImages([...newImages, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
  };

  // Remove existing image
  const removeExistingImage = (imageId: string) => {
    setExistingImagesToRemove([...existingImagesToRemove, imageId]);
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    const newFiles = newImages.filter((_, i) => i !== index);
    const newPreviews = newImagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newImagePreviews[index]);
    
    setNewImages(newFiles);
    setNewImagePreviews(newPreviews);
  };

  // Move image (for reordering)
  const moveImage = (fromIndex: number, toIndex: number, isExisting: boolean) => {
    if (isExisting) {
      // For For existing images, we'll just update the UI order by sorting the media array
      if (editingListing) {
        const updatedMedia = [...(editingListing.media || [])];
        const [movedItem] = updatedMedia.splice(fromIndex, 1);
        updatedMedia.splice(toIndex, 0, movedItem);
        
        setEditingListing({
          ...editingListing,
          media: updatedMedia
        });
      }
    } else {
      // For new images, we need to update the arrays
      const newFiles = [...newImages];
      const newPreviews = [...newImagePreviews];
      
      // Swap positions
      [newFiles[fromIndex], newFiles[toIndex]] = [newFiles[toIndex], newFiles[fromIndex]];
      [newPreviews[fromIndex], newPreviews[toIndex]] = [newPreviews[toIndex], newPreviews[fromIndex]];
      
      setNewImages(newFiles);
      setNewImagePreviews(newPreviews);
    }
  };

  // Reset image state when closing the modal
  const resetImageState = () => {
    // Revoke object URLs to prevent memory leaks
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    setNewImages([]);
    setNewImagePreviews([]);
    setExistingImagesToRemove([]);
  };

  // Enhanced handleEditListing function to handle images
  const handleEditListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing || !user) return;

    try {
      setProcessingAction(editingListing.id);
      
      // Prepare update data
      const updateData = {
        title: editingListing.title,
        description: editingListing.description,
        price_xaf: editingListing.price_xaf,
        condition: editingListing.condition,
        updated_at: new Date().toISOString()
      };

      // Update listing in database
      const { error: updateError } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', editingListing.id)
        .eq('owner_id', user.id);

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      // Handle image removals
      if (existingImagesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('listing_media')
          .delete()
          .in('id', existingImagesToRemove.map(id => parseInt(id)));

        if (deleteError) {
          throw new Error(`Failed to remove images: ${deleteError.message}`);
        }
      }

      // Handle new image uploads
      if (newImages.length > 0) {
        // Upload new images
        const imageUrls: { url: string; path: string }[] = [];
        for (const image of newImages) {
          const fileName = `${user.id}/${editingListing.id}/${Date.now()}_${image.name}`;
          const { data, error } = await supabase.storage
            .from('listings-media')
            .upload(fileName, image);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('listings-media')
            .getPublicUrl(data.path);

          imageUrls.push({ url: publicUrl, path: data.path });
        }

        // Add new media records
        if (imageUrls.length > 0) {
          // Get the current max position
          let maxPosition = 0;
          if (editingListing.media && editingListing.media.length > 0) {
            maxPosition = Math.max(...editingListing.media.map(m => m.position || 0));
          }

          // Prepare media data
          const mediaData = imageUrls.map((img, index) => ({
            listing_id: editingListing.id,
            url: img.url,
            kind: 'image',
            position: maxPosition + index + 1,
          }));

          const { error: mediaError } = await supabase
            .from('listing_media')
            .insert(mediaData);

          if (mediaError) throw mediaError;
        }
      }

      // Update local state
      setUserListings(prev => 
        prev.map(listing => 
          listing.id === editingListing.id 
            ? { 
              ...listing, 
              title: editingListing.title,
              description: editingListing.description,
              price_xaf: editingListing.price_xaf,
              condition: editingListing.condition,
              updated_at: new Date().toISOString()
            }
          : listing
        )
      );

      // Close modal and reset state
      setShowEditModal(null);
      setEditingListing(null);
      resetImageState();
    } catch (err) {
      console.error('Failed to update listing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Failed to update listing: ${errorMessage}`);
    } finally {
      setProcessingAction(null);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Menu */}
            <div className="w-full lg:w-1/3">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-10 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="w-full lg:w-2/3">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-lg"></div>
                  ))}
                </div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Dashboard</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('nav.dashboard')}</h1>
            <p className="text-muted-foreground mt-1">{t('sell.shareItems')}</p>
          </div>
          <Link
            href="/sell/new"
            className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('sell.createNewListing')}
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Menu */}
          <div className="w-full lg:w-1/4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('nav.dashboard')}</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveMenu('statistics')}
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                    activeMenu === 'statistics'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  {t('nav.dashboard')}
                </button>
                <button
                  onClick={() => setActiveMenu('listings')}
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                    activeMenu === 'listings'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Package className="w-5 h-5 mr-3" />
                  {t('nav.sell')}
                </button>
                <button
                  onClick={() => setActiveMenu('notifications')}
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                    activeMenu === 'notifications'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  {t('nav.messages')}
                </button>
              </nav>
            </div>

            {/* Quick Stats Card */}
            {analytics && (
              <div className="bg-card border border-border rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('home.featuredListings')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('listing.title')}</p>
                        <p className="font-semibold">{analytics.listings.total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('listing.views')}</p>
                        <p className="font-semibold">{analytics.listings.totalViews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('nav.messages')}</p>
                        <p className="font-semibold">{analytics.messages.totalReceived}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content based on active menu */}
          <div className="w-full lg:w-3/4">
            {/* Statistics View */}
            {activeMenu === 'statistics' && analytics && (
              <div className="space-y-8">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Listings */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.listings.total}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analytics.listings.published} published • {analytics.listings.draft} draft
                        </p>
                      </div>
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Total Views */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.listings.totalViews}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Avg: {analytics.listings.averageViews} per listing
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.messages.totalReceived}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analytics.messages.unreadReceived} unread
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  {/* Average Rating */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold text-foreground">
                          {analytics.reviews.averageRating > 0 ? analytics.reviews.averageRating.toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analytics.reviews.totalReceived} reviews
                        </p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    This Month Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.performance.listingsThisMonth}</p>
                      <p className="text-sm text-muted-foreground">New Listings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.performance.viewsThisMonth}</p>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.performance.messagesThisMonth}</p>
                      <p className="text-sm text-muted-foreground">Messages</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Listings View */}
            {activeMenu === 'listings' && (
              <div className="bg-card border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{t('nav.sell')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('sell.shareItems')}
                      </p>
                    </div>
                    
                    {userListings.length > 0 && (
                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'list'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`}
                          title={t('search.listView')}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === 'grid'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`}
                          title={t('search.gridView')}
                        >
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Filters */}
                  {userListings.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{t('common.filter')}:</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* Status Filter */}
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'paused')}
                          className="px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="all">{t('search.allTypes')}</option>
                          <option value="published">{t('status.published')}</option>
                          <option value="draft">{t('status.draft')}</option>
                          <option value="paused">{t('status.paused')}</option>
                        </select>
                        
                        {/* Boost Filter */}
                        <select
                          value={boostFilter}
                          onChange={(e) => setBoostFilter(e.target.value as 'all' | 'boosted' | 'not_boosted')}
                          className="px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="all">{t('search.allTypes')}</option>
                          <option value="boosted">{t('boost.active')}</option>
                          <option value="not_boosted">{t('boost.listing')}</option>
                        </select>
                        
                        {/* Results count */}
                        <div className="flex items-center px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md">
                          {filteredListings.length} {t('search.of')} {userListings.length} {t('nav.sell')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {filteredListings.length === 0 ? (
                    <div className="text-center py-12">
                      {userListings.length === 0 ? (
                        <>
                          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">{t('common.noResults')}</h4>
                          <p className="text-muted-foreground mb-6">{t('sell.shareItems')}</p>
                          <Link
                            href="/sell/new"
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            {t('sell.createNewListing')}
                          </Link>
                        </>
                      ) : (
                        <>
                          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">{t('common.noResults')}</h4>
                          <p className="text-muted-foreground mb-6">{t('search.tryAdjusting')}</p>
                          <button
                            onClick={() => {
                              setStatusFilter('all');
                              setBoostFilter('all');
                            }}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                          >
                            {t('common.clear')}
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className={`${
                        viewMode === 'grid' 
                          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6' 
                          : 'space-y-4'
                      }`}>
                        {filteredListings
                          .slice((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage)
                          .map((listing) => {
                        return viewMode === 'grid' ? (
                          // Grid View Card
                          <div key={listing.id} className="block">
                            <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                              {/* Image */}
                              <div className="relative">
                                <Link href={`/listing/${listing.id}`} className="block">
                                  {listing.media && listing.media.length > 0 ? (
                                    <Image
                                      src={listing.media[0].url}
                                      alt={listing.title}
                                      width={400}
                                      height={128}
                                      className="w-full h-32 object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-32 bg-muted flex items-center justify-center">
                                      <Package className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </Link>
                                
                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                    {getStatusIcon(listing.status)}
                                    <span className="ml-1 capitalize">{listing.status}</span>
                                  </span>
                                </div>
                                
                                {/* Boost Badge */}
                                {hasActiveBoost(listing) && (
                                  <div className="absolute top-2 right-2">
                                    {(() => {
                                      const boostTier = getActiveBoostTier(listing);
                                      const boostExpiry = getBoostExpiry(listing);
                                      const daysLeft = boostExpiry ? Math.ceil((boostExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                                      
                                      return (
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          boostTier === 'top' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                                          boostTier === 'premium' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                                          'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        }`}>
                                          {boostTier === 'top' ? <Crown className="w-3 h-3 mr-1" /> :
                                           boostTier === 'premium' ? <Zap className="w-3 h-3 mr-1" /> :
                                           <Star className="w-3 h-3 mr-1" />}
                                          <span className="capitalize">{boostTier}</span>
                                          {daysLeft > 0 && (
                                            <span className="ml-1 opacity-90">({daysLeft}d)</span>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="p-4">
                                <Link href={`/listing/${listing.id}`} className="block mb-4">
                                  <h4 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm leading-tight hover:text-primary transition-colors">
                                    {listing.title}
                                  </h4>
                                  
                                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                    {listing.price_xaf && listing.price_xaf > 0 ? (
                                      <span className="font-semibold text-foreground text-base">
                                        {formatCurrency(listing.price_xaf)}
                                      </span>
                                    ) : (
                                      <span className="font-semibold text-foreground text-base">
                                        {t('listing.negotiable')}
                                      </span>
                                    )}
                                    <div className="flex items-center">
                                      <Eye className="w-3 h-3 mr-1" />
                                      {listing.view_count || 0}
                                    </div>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    <div className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {new Date(listing.created_at!).toLocaleDateString()}
                                    </div>
                                  </div>
                                </Link>
                                
                                {/* Action Buttons - Hierarchical Importance */}
                                <div className="space-y-2 mt-4">
                                  {/* Boost Action - Most Prominent (Primary Action) */}
                                  {listing.status === 'paused' ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowBoostNotification(listing.id);
                                      }}
                                      className="w-full inline-flex items-center justify-center px-3 py-2 text-sm rounded-md transition-all font-medium shadow-md bg-gray-300 text-gray-500 cursor-not-allowed"
                                      title={t('boost.listing')}
                                      disabled
                                    >
                                      <AlertCircle className="w-4 h-4 mr-1" />
                                      {t('boost.listing')}
                                    </button>
                                  ) : (
                                    <Link
                                      href={`/boost/${listing.id}`}
                                      className={`w-full inline-flex items-center justify-center px-3 py-2 text-sm rounded-md transition-all font-medium shadow-md ${
                                        hasActiveBoost(listing)
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                                      }`}
                                      title={hasActiveBoost(listing) ? t('boost.manage') : t('boost.listing')}
                                    >
                                      {hasActiveBoost(listing) ? (
                                        <>
                                          <Crown className="w-4 h-4 mr-1" />
                                          {t('boost.active')}
                                        </>
                                      ) : (
                                        <>
                                          <Zap className="w-4 h-4 mr-1" />
                                          {t('boost.listing')}
                                        </>
                                      )}
                                    </Link>
                                  )}
                                  
                                  {/* Edit Action - Secondary Importance */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setEditingListing(listing);
                                      setShowEditModal(listing.id);
                                    }}
                                    className="w-full inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium border border-blue-200"
                                    title={t('common.edit')}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    {t('common.edit')}
                                  </button>
                                  
                                  {/* Status Toggle Action - Tertiary Importance */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (listing.status === 'published') {
                                        setShowPauseModal(listing.id);
                                      } else {
                                        handleToggleStatus(listing.id, listing.status);
                                      }
                                    }}
                                    className={`w-full inline-flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors font-medium border ${
                                      listing.status === 'published'
                                        ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200'
                                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                    }`}
                                    disabled={processingAction === listing.id}
                                    title={listing.status === 'published' ? t('status.paused') : t('status.published')}
                                  >
                                    {listing.status === 'published' ? (
                                      <>
                                        <Pause className="w-4 h-4 mr-1" />
                                        {t('status.paused')}
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4 mr-1" />
                                        {t('status.published')}
                                      </>
                                    )}
                                  </button>
                                  
                                  {/* Delete Action - Least Important */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowDeleteModal(listing.id);
                                    }}
                                    className="w-full inline-flex items-center justify-center px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors font-medium border border-red-200"
                                    title={t('common.delete')}
                                    disabled={processingAction === listing.id}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    {t('common.delete')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div key={listing.id} className="block">
                            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <Link href={`/listing/${listing.id}`} className="block mb-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h4 className="font-semibold text-foreground hover:text-primary transition-colors">{listing.title}</h4>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                        {getStatusIcon(listing.status)}
                                        <span className="ml-1 capitalize">{listing.status}</span>
                                      </span>
                                      
                                      {/* Boost Badge for List View */}
                                      {hasActiveBoost(listing) && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          getActiveBoostTier(listing) === 'top' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                                          getActiveBoostTier(listing) === 'premium' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                                          'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        }`}>
                                          {getActiveBoostTier(listing) === 'top' ? <Crown className="w-3 h-3 mr-1" /> :
                                           getActiveBoostTier(listing) === 'premium' ? <Zap className="w-3 h-3 mr-1" /> :
                                           <Star className="w-3 h-3 mr-1" />}
                                          <span className="capitalize">{getActiveBoostTier(listing)}</span>
                                          {(() => {
                                            const boostExpiry = getBoostExpiry(listing);
                                            const daysLeft = boostExpiry ? Math.ceil((boostExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                                            return daysLeft > 0 ? ` (${daysLeft}d)` : '';
                                          })()}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatRelativeTime(listing.created_at!)}
                                      </div>
                                      {listing.price_xaf && listing.price_xaf > 0 ? (
                                        <div className="flex items-center">
                                          <DollarSign className="w-4 h-4 mr-1" />
                                          <span className="font-medium text-foreground">
                                            {formatCurrency(listing.price_xaf)}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          <DollarSign className="w-4 h-4 mr-1" />
                                          <span className="font-medium text-foreground">
                                            Negotiable
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {listing.view_count || 0} views
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                                
                                {/* Action Buttons - Hierarchical Importance */}
                                <div className="flex items-center space-x-2 ml-4">
                                  {/* Boost Action - Most Prominent (Primary Action) */}
                                  {listing.status === 'paused' ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowBoostNotification(listing.id);
                                      }}
                                      className="inline-flex items-center px-3 py-2 text-sm rounded-md transition-all font-medium shadow-md bg-gray-300 text-gray-500 cursor-not-allowed"
                                      title={t('boost.listing')}
                                      disabled
                                    >
                                      <AlertCircle className="w-4 h-4 mr-1" />
                                      {t('boost.listing')}
                                    </button>
                                  ) : (
                                    <Link
                                      href={`/boost/${listing.id}`}
                                      className={`inline-flex items-center px-3 py-2 text-sm rounded-md transition-all font-medium shadow-md ${
                                        hasActiveBoost(listing)
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                                      }`}
                                      title={hasActiveBoost(listing) ? t('boost.manage') : t('boost.listing')}
                                    >
                                      {hasActiveBoost(listing) ? (
                                        <>
                                          <Crown className="w-4 h-4 mr-1" />
                                          {t('boost.active')}
                                        </>
                                      ) : (
                                        <>
                                          <Zap className="w-4 h-4 mr-1" />
                                          {t('boost.listing')}
                                        </>
                                      )}
                                    </Link>
                                  )}
                                  
                                  {/* Edit Action - Secondary Importance */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setEditingListing(listing);
                                      setShowEditModal(listing.id);
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium border border-blue-200"
                                    title={t('common.edit')}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    {t('common.edit')}
                                  </button>
                                  
                                  {/* Status Toggle Action - Tertiary Importance */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (listing.status === 'published') {
                                        setShowPauseModal(listing.id);
                                      } else {
                                        handleToggleStatus(listing.id, listing.status);
                                      }
                                    }}
                                    className={`inline-flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium border ${
                                      listing.status === 'published'
                                        ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200'
                                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                    }`}
                                    disabled={processingAction === listing.id}
                                    title={listing.status === 'published' ? t('status.paused') : t('status.published')}
                                  >
                                    {listing.status === 'published' ? (
                                      <>
                                        <Pause className="w-4 h-4 mr-1" />
                                        {t('status.paused')}
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4 mr-1" />
                                        {t('status.published')}
                                      </>
                                    )}
                                  </button>
                                  
                                  {/* Delete Action - Least Important */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowDeleteModal(listing.id);
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors font-medium border border-red-200"
                                    title={t('common.delete')}
                                    disabled={processingAction === listing.id}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    {t('common.delete')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                      
                      {/* Pagination */}
                      {filteredListings.length > listingsPerPage && (
                        <div className="mt-8 flex justify-center">
                          <nav className="flex items-center space-x-2">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-2 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                            >
                              {t('common.previous')}
                            </button>
                            
                            {[...Array(Math.ceil(filteredListings.length / listingsPerPage)).keys()].map(page => (
                              <button
                                key={page + 1}
                                onClick={() => setCurrentPage(page + 1)}
                                className={`px-3 py-2 rounded-md transition-colors ${
                                  currentPage === page + 1
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border hover:bg-muted'
                                }`}
                              >
                                {page + 1}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredListings.length / listingsPerPage)))}
                              disabled={currentPage === Math.ceil(filteredListings.length / listingsPerPage)}
                              className="px-3 py-2 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                            >
                              {t('common.next')}
                            </button>
                          </nav>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Notifications View */}
            {activeMenu === 'notifications' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('nav.messages')}</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{t('listing.views')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('sell.imagesUploaded').replace('{count}', '15')}</p>
                        <p className="text-xs text-muted-foreground mt-2">2 {t('search.hours')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-green-500/10 p-2 rounded-full mr-3">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{t('messages.inbox')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('messages.compose')}</p>
                        <p className="text-xs text-muted-foreground mt-2">5 {t('search.hours')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-yellow-500/10 p-2 rounded-full mr-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{t('reviews.title')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('reviews.writeReview')}</p>
                        <p className="text-xs text-muted-foreground mt-2">1 {t('search.days')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">{t('common.noResults')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Boost Notification Modal */}
        {showBoostNotification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-foreground">{t('boost.listing')}</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                {t('boost.pausedListing')}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBoostNotification(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    // Find the listing and unpause it
                    const listingToUnpause = userListings.find(listing => listing.id === showBoostNotification);
                    if (listingToUnpause) {
                      handleToggleStatus(showBoostNotification, listingToUnpause.status);
                    }
                    setShowBoostNotification(null);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t('status.published')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('common.delete')} {t('nav.sell')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('sell.oncePublished')}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={processingAction === showDeleteModal}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => handleDeleteListing(showDeleteModal)}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                  disabled={processingAction === showDeleteModal}
                >
                  {processingAction === showDeleteModal ? `${t('common.deleting')}...` : t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Confirmation Modal */}
        {showPauseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('status.paused')} {t('nav.sell')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('sell.oncePublished')}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPauseModal(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={processingAction === showPauseModal}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => handleToggleStatus(showPauseModal!, 'published')}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                  disabled={processingAction === showPauseModal}
                >
                  {processingAction === showPauseModal ? `${t('status.paused')}...` : `${t('status.paused')} ${t('nav.sell')}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">{t('common.edit')} {t('nav.sell')}</h3>
                <button 
                  onClick={() => {
                    setShowEditModal(null);
                    setEditingListing(null);
                    resetImageState();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditListing} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.title')} *
                  </label>
                  <input
                    type="text"
                    value={editingListing.title || ''}
                    onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder={t('sell.whatListingPlaceholder')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.description')} *
                  </label>
                  <textarea
                    value={editingListing.description || ''}
                    onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder={t('sell.provideDetails')}
                    required
                  />
                </div>
                
                {/* Image Management Section */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('sell.photos')}
                  </label>
                  
                  {/* Existing Images */}
                  {editingListing.media && editingListing.media.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        {t('sell.uploadedImages').replace('{count}', editingListing.media.length.toString())}
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {editingListing.media
                          .filter(media => !existingImagesToRemove.includes(media.id.toString()))
                          .map((media, index) => (
                            <div 
                              key={media.id} 
                              className="relative group"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', `existing-${index}`);
                                e.currentTarget.classList.add('opacity-50');
                              }}
                              onDragEnd={(e) => {
                                e.currentTarget.classList.remove('opacity-50');
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('ring-2', 'ring-primary');
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('ring-2', 'ring-primary');
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('ring-2', 'ring-primary');
                                const data = e.dataTransfer.getData('text/plain');
                                if (data.startsWith('existing-')) {
                                  const fromIndex = parseInt(data.split('-')[1]);
                                  if (fromIndex !== index) {
                                    moveImage(fromIndex, index, true);
                                  }
                                } else if (data.startsWith('new-')) {
                                  // Handle dropping new images among existing ones
                                  // This would require more complex logic to merge the arrays
                                }
                              }}
                            >
                              <div className="relative aspect-square">
                                <Image
                                  src={media.url}
                                  alt={`Listing image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg border border-border"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                                
                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(media.id.toString())}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                
                                {/* Main photo indicator */}
                                {index === 0 && (
                                  <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                                
                                {/* Order indicators */}
                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center cursor-grab">
                                  {index + 1}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Images */}
                  {(newImages.length > 0) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        {t('sell.addMoreImages')}
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {newImagePreviews.map((preview, index) => (
                          <div 
                            key={`new-${index}`} 
                            className="relative group"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', `new-${index}`);
                              e.currentTarget.classList.add('opacity-50');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('opacity-50');
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('ring-2', 'ring-primary');
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-primary');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('ring-2', 'ring-primary');
                              const data = e.dataTransfer.getData('text/plain');
                              if (data.startsWith('new-')) {
                                const fromIndex = parseInt(data.split('-')[1]);
                                if (fromIndex !== index) {
                                  moveImage(fromIndex, index, false);
                                }
                              }
                            }}
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={preview}
                                alt={`New image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg border border-border"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                              
                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              
                              {/* Order indicators */}
                              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center cursor-grab">
                                N{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add Images Button */}
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="inline-flex items-center text-primary hover:text-primary/80 cursor-pointer text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t('sell.addMore')}
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('listing.price')} (XAF)
                    </label>
                    <input
                      type="number"
                      value={editingListing.price_xaf || ''}
                      onChange={(e) => setEditingListing({...editingListing, price_xaf: Number(e.target.value) || null})}
                      className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder={t('sell.enterPriceXaf')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('listing.condition')}
                    </label>
                    <select
                      value={editingListing.condition || ''}
                      onChange={(e) => setEditingListing({...editingListing, condition: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    >
                      <option value="">{t('sell.selectCategory')}</option>
                      <option value="new">{t('conditions.new')}</option>
                      <option value="used">{t('conditions.used')}</option>
                      <option value="refurbished">{t('conditions.refurbished')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(null);
                      setEditingListing(null);
                      resetImageState();
                    }}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={processingAction === editingListing.id}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    disabled={processingAction === editingListing.id}
                  >
                    {processingAction === editingListing.id ? `${t('common.saving')}...` : t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
