"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { 
  CheckCircle, 
  Home, 
  Eye, 
  Zap, 
  Share2, 
  Copy,
  ArrowRight,
  Star,
  TrendingUp,
  Crown,
  BarChart3,
  Users,
  Target
} from "lucide-react";
import Link from "next/link";

export default function BoostSuccessPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <BoostSuccessContent />
    </Suspense>
  );
}

function BoostSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatCurrency } = useI18n();
  const [copied, setCopied] = useState(false);
  
  const listingId = searchParams?.get('id');
  const listingTitle = searchParams?.get('title');
  const boostTier = searchParams?.get('tier') as 'featured' | 'premium' | 'top';
  const duration = searchParams?.get('duration');
  const price = searchParams?.get('price');

  useEffect(() => {
    // Redirect if no listing ID
    if (!listingId) {
      router.push('/dashboard');
    }
  }, [listingId, router]);

  const listingUrl = `${window.location.origin}/listing/${listingId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle || 'My Boosted Listing',
          text: `Check out my ${boostTier} listing on Obilli Marketplace`,
          url: listingUrl,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'featured':
        return <Star className="h-8 w-8 text-blue-600" />;
      case 'premium':
        return <Crown className="h-8 w-8 text-purple-600" />;
      case 'top':
        return <TrendingUp className="h-8 w-8 text-yellow-600" />;
      default:
        return <Zap className="h-8 w-8 text-primary" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'featured':
        return 'from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50';
      case 'premium':
        return 'from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50';
      case 'top':
        return 'from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50';
      default:
        return 'from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50';
    }
  };

  if (!listingId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Redirecting...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${getTierColor(boostTier)} rounded-full mb-6`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full">
                {getTierIcon(boostTier)}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              🎉 Boost Activated Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your listing &ldquo;{listingTitle}&rdquo; is now {boostTier} for {duration} days.
            </p>
            {price && (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Paid {formatCurrency(parseInt(price))} - Active Now
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 text-primary mr-2" />
              Your {boostTier.charAt(0).toUpperCase() + boostTier.slice(1)} Benefits
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {boostTier === 'featured' && (
                <>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Enhanced Visibility</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Stand out in search results</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Featured Badge</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Special badge on your listing</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">More Views</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Increased buyer engagement</p>
                  </div>
                </>
              )}
              
              {boostTier === 'premium' && (
                <>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Premium Badge</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Premium listing status</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Top of Category</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Priority in category pages</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <Home className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Homepage Featured</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Featured on homepage</p>
                  </div>
                </>
              )}
              
              {boostTier === 'top' && (
                <>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 fill-current" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Top Badge</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Highest tier status</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Maximum Visibility</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Top of all listings</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                    <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Hero Placement</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Homepage hero carousel</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* View Listing */}
            <Link 
              href={`/listing/${listingId}`}
              className="group bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">View Boosted Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your boosted listing appears to buyers
              </p>
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Open Listing
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Dashboard */}
            <Link 
              href="/dashboard"
              className="group bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">View Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor your boosted listings performance
              </p>
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Share Listing */}
            <button 
              onClick={handleShare}
              className="group bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <Share2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Share Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your boosted listing with others
              </p>
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Share Now
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Share Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Share2 className="h-5 w-5 text-primary mr-2" />
              Share Your Boosted Listing
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Maximize your boost impact by sharing your listing on social media.
            </p>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground font-mono overflow-hidden">
                {listingUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-muted hover:bg-accent border border-border rounded-md text-sm font-medium transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Maximize Your Boost Impact</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Share your boosted listing on social media for maximum reach</li>
              <li>• Respond quickly to buyer inquiries to maintain momentum</li>
              <li>• Monitor your listing performance in the dashboard</li>
              <li>• Consider boosting again when the current boost expires</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
