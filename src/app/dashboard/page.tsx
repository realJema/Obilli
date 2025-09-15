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
} from "lucide-react";

export default function DashboardPage() {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const { formatCurrency } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [userListings, setUserListings] = useState<ListingWithDetails[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingWithDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'paused'>('all');
  const [boostFilter, setBoostFilter] = useState<'all' | 'boosted' | 'not_boosted'>('all');

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
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
            
            {/* Filters */}
            {userListings.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filters:</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'paused')}
                    className="px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                  </select>
                  
                  {/* Boost Filter */}
                  <select
                    value={boostFilter}
                    onChange={(e) => setBoostFilter(e.target.value as 'all' | 'boosted' | 'not_boosted')}
                    className="px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Listings</option>
                    <option value="boosted">Boosted Only</option>
                    <option value="not_boosted">Not Boosted</option>
                  </select>
                  
                  {/* Results count */}
                  <div className="flex items-center px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md">
                    {filteredListings.length} of {userListings.length} listings
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
                    <h4 className="text-lg font-medium text-foreground mb-2">No listings yet</h4>
                    <p className="text-muted-foreground mb-6">Create your first listing to get started</p>
                    <Link
                      href="/sell/new"
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Listing
                    </Link>
                  </>
                ) : (
                  <>
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No listings match your filters</h4>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters to see more listings</p>
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setBoostFilter('all');
                      }}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredListings.map((listing) => {
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
                                  Negotiable
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
                          
                          {/* Action Buttons */}
                          <div className="space-y-2">
                            {/* Boost Action - Most Prominent */}
                            <Link
                              href={`/boost/${listing.id}`}
                              className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm rounded-md transition-all shadow-md hover:shadow-lg font-medium ${
                                hasActiveBoost(listing)
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                              }`}
                              title={hasActiveBoost(listing) ? 'Manage boost' : 'Boost listing'}
                            >
                              {hasActiveBoost(listing) ? (
                                <>
                                  <Crown className="w-4 h-4 mr-2" />
                                  ✨ Boost Active
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  🚀 Boost Listing
                                </>
                              )}
                            </Link>
                            
                            {/* Primary Actions Row */}
                            <div className="flex gap-2">
                              <Link
                                href={`/sell/edit/${listing.id}`}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                                title="Edit listing"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Link>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleStatus(listing.id, listing.status);
                                }}
                                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs rounded-md transition-colors border ${
                                  listing.status === 'published'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40'
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
                                e.stopPropagation();
                                setShowDeleteModal(listing.id);
                              }}
                              className="w-full inline-flex items-center justify-center px-3 py-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
                              title="Delete listing"
                              disabled={processingAction === listing.id}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
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
                                  {new Date(listing.created_at!).toLocaleDateString()}
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
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            <Link
                              href={`/boost/${listing.id}`}
                              className={`inline-flex items-center px-4 py-2 text-sm rounded-md transition-all shadow-md font-medium ${
                                hasActiveBoost(listing)
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                              }`}
                              title={hasActiveBoost(listing) ? 'Manage boost' : 'Boost listing'}
                            >
                              {hasActiveBoost(listing) ? (
                                <>
                                  <Crown className="w-4 h-4 mr-2" />
                                  ✨ Active
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  🚀 Boost
                                </>
                              )}
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
                                e.stopPropagation();
                                handleToggleStatus(listing.id, listing.status);
                              }}
                              className={`inline-flex items-center px-3 py-2 text-sm rounded-md transition-colors border ${
                                listing.status === 'published'
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40'
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
                                e.stopPropagation();
                                setShowDeleteModal(listing.id);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
                              title="Delete listing"
                              disabled={processingAction === listing.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
