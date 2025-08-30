"use client";

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { boostsRepo } from "@/lib/repositories";
import { analyticsService } from "@/lib/utils/analytics";
import type { UserAnalytics } from "@/lib/utils/analytics";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { Database } from "@/lib/types/database";
import {
  BarChart3,
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
  MoreVertical,
  Calendar,
  DollarSign,
  Grid3x3,
  List,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const { t, formatCurrency } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [userListings, setUserListings] = useState<ListingWithDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

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
          // Use authenticated supabase client to get all user listings
          supabase
            .from('listings')
            .select(`
              *,
              category:categories(*),
              media:listing_media(*),
              service_packages(*)
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
  }, [user, router]);

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
        // @ts-expect-error - Supabase type inference issue with update method
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your listings and view analytics</p>
          </div>
          <Link
            href="/sell/new"
            className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Listing
          </Link>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        )}

        {/* Performance Summary */}
        {analytics && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
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
        )}

        {/* Listings Management */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Listings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and edit your listings
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
                    title="List view"
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
                    title="Grid view"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {userListings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No listings yet</h4>
                <p className="text-muted-foreground mb-6">Create your first listing to get started</p>
                <Link
                  href="/sell/new"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              }`}>
                {userListings.map((listing) => (
                  viewMode === 'grid' ? (
                    // Grid View Card
                    <Link key={listing.id} href={`/listing/${listing.id}`} className="block">
                      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                        {/* Image */}
                        <div className="relative">
                          {listing.media && listing.media.length > 0 ? (
                            <img
                              src={listing.media[0].url}
                              alt={listing.title}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                              {getStatusIcon(listing.status)}
                              <span className="ml-1 capitalize">{listing.status}</span>
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm leading-tight">
                            {listing.title}
                          </h4>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            {listing.price_xaf && (
                              <span className="font-semibold text-foreground text-base">
                                {formatCurrency(listing.price_xaf)}
                              </span>
                            )}
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {listing.view_count || 0}
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(listing.created_at!).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-2" onClick={(e) => e.preventDefault()}>
                            {/* Boost Action - Most Prominent */}
                            <Link
                              href={`/boost/${listing.id}`}
                              className="w-full inline-flex items-center justify-center px-4 py-3 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium"
                              title="Boost listing"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              🚀 Boost Listing
                            </Link>
                            
                            {/* Primary Actions Row */}
                            <div className="flex gap-2">
                              <Link
                                href={`/sell/edit/${listing.id}`}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                                title="Edit listing"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Link>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleStatus(listing.id, listing.status);
                                }}
                                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs rounded-md transition-colors border ${
                                  listing.status === 'published'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                }`}
                                disabled={processingAction === listing.id}
                                title={listing.status === 'published' ? 'Pause listing' : 'Publish listing'}
                              >
                                {listing.status === 'published' ? (
                                  <>
                                    <Pause className="w-3 h-3 mr-1" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 mr-1" />
                                    Publish
                                  </>
                                )}
                              </button>
                            </div>
                            
                            {/* Danger Action */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setShowDeleteModal(listing.id);
                              }}
                              className="w-full inline-flex items-center justify-center px-3 py-2 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors border border-red-200"
                              title="Delete listing"
                              disabled={processingAction === listing.id}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // List View
                    <Link key={listing.id} href={`/listing/${listing.id}`} className="block">
                      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-foreground">{listing.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                                {getStatusIcon(listing.status)}
                                <span className="ml-1 capitalize">{listing.status}</span>
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(listing.created_at!).toLocaleDateString()}
                              </div>
                              {listing.price_xaf && (
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span className="font-medium text-foreground">
                                    {formatCurrency(listing.price_xaf)}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {listing.view_count || 0} views
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4" onClick={(e) => e.preventDefault()}>
                            <Link
                              href={`/boost/${listing.id}`}
                              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md font-medium"
                              title="Boost listing"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              🚀 Boost
                            </Link>
                            
                            <Link
                              href={`/sell/edit/${listing.id}`}
                              className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                              title="Edit listing"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleToggleStatus(listing.id, listing.status);
                              }}
                              className={`inline-flex items-center px-3 py-2 text-sm rounded-md transition-colors border ${
                                listing.status === 'published'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                  : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              }`}
                              disabled={processingAction === listing.id}
                              title={listing.status === 'published' ? 'Pause listing' : 'Publish listing'}
                            >
                              {listing.status === 'published' ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setShowDeleteModal(listing.id);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors border border-red-200"
                              title="Delete listing"
                              disabled={processingAction === listing.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Delete Listing</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={processingAction === showDeleteModal}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteListing(showDeleteModal)}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                  disabled={processingAction === showDeleteModal}
                >
                  {processingAction === showDeleteModal ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
