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
  Crown
} from "lucide-react";
import Link from "next/link";

export default function SellSuccessPage() {
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
      <SellSuccessContent />
    </Suspense>
  );
}

function SellSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { } = useI18n();
  const [copied, setCopied] = useState(false);
  
  const listingId = searchParams?.get('id');
  const listingTitle = searchParams?.get('title');

  useEffect(() => {
    // Redirect if no listing ID
    if (!listingId) {
      router.push('/sell/new');
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
          title: listingTitle || 'My Listing',
          text: 'Check out my listing on Obilli Marketplace',
          url: listingUrl,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyLink();
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Listing Published Successfully!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your listing &ldquo;{listingTitle}&rdquo; is now live and visible to buyers.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* View Listing */}
            <Link 
              href={`/listing/${listingId}`}
              className="group bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">View Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your listing appears to buyers
              </p>
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Open Listing
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Go Home */}
            <Link 
              href="/"
              className="group bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Go Home</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Return to the marketplace homepage
              </p>
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Browse Marketplace
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Boost Listing */}
            <Link 
              href={`/boost/${listingId}`}
              className="group bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:border-yellow-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 group-hover:bg-yellow-200 transition-colors">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Boost Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get more visibility with premium features
              </p>
              <div className="flex items-center justify-center text-yellow-600 text-sm font-medium">
                Explore Boosts
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Boost Options Preview */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              Boost Your Listing for Better Results
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Increase your listing&apos;s visibility and attract more buyers with our boost options.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Featured Boost */}
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Featured</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Stand out in search results
                </p>
                <div className="text-sm font-semibold text-blue-600">From 1,500 XAF</div>
              </div>

              {/* Premium Boost */}
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-3">
                  <Crown className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Premium</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Priority placement & badges
                </p>
                <div className="text-sm font-semibold text-purple-600">From 3,000 XAF</div>
              </div>

              {/* Top Boost */}
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Top</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Appear at the top of listings
                </p>
                <div className="text-sm font-semibold text-green-600">From 5,000 XAF</div>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                href={`/boost/${listingId}`}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4 mr-2" />
                Boost My Listing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Share2 className="h-5 w-5 text-primary mr-2" />
              Share Your Listing
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help potential buyers find your listing by sharing it on social media.
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
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Success</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Respond quickly to buyer inquiries to build trust</li>
              <li>• Keep your listing updated with accurate information</li>
              <li>• Consider boosting your listing for better visibility</li>
              <li>• Share your listing on social media to reach more buyers</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
