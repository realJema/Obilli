"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { listingsRepo, boostsRepo } from "@/lib/repositories";
import { BOOST_TIERS, type BoostTier } from "@/lib/repositories/boosts";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import {
  Star,
  Zap,
  Clock,
  Check,
  ArrowLeft,
  CreditCard,
  Smartphone,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function BoostListingPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const { formatCurrency } = useI18n();
  
  const listingId = params?.listingId as string;
  
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [selectedTier, setSelectedTier] = useState<BoostTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!listingId) {
      router.push('/dashboard');
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

        // Check if user owns this listing
        if (listingData.owner_id !== user.id) {
          setError('You can only boost your own listings');
          return;
        }

        setListing(listingData);
      } catch (err) {
        console.error('Failed to load listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId, user, router]);

  const handlePurchaseBoost = async () => {
    if (!selectedTier || !listing || !user) return;

    try {
      setIsProcessing(true);
      setError(null);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selectedTier.duration);

      // Create boost record
      await boostsRepo.create({
        listing_id: listingId,
        owner_id: user.id,
        tier: selectedTier.tier,
        expires_at: expiresAt.toISOString(),
        price_xaf: selectedTier.priceXaf,
        payment_status: 'pending',
        is_active: false // Will be activated after payment
      });

      // For now, simulate successful payment and activate immediately
      // In a real implementation, this would redirect to payment gateway
      alert(`Boost purchase successful! Your listing is now ${selectedTier.name} for ${selectedTier.duration} days.`);
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Failed to purchase boost:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase boost');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'featured':
        return <Star className="w-6 h-6" />;
      case 'premium':
        return <Zap className="w-6 h-6" />;
      case 'top':
        return <Star className="w-6 h-6 fill-current" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'featured':
        return 'from-blue-500 to-blue-600';
      case 'premium':
        return 'from-purple-500 to-purple-600';
      case 'top':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Boost Your Listing</h1>
            <p className="text-lg text-muted-foreground">
              Increase visibility and get more buyers for &ldquo;{listing?.title}&rdquo;
            </p>
          </div>

          {/* Boost Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {BOOST_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`relative bg-card border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTier?.tier === tier.tier
                    ? 'border-primary ring-2 ring-primary ring-opacity-50'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                {/* Popular badge for premium */}
                {tier.tier === 'premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${getTierColor(tier.tier)} text-white mb-4`}>
                    {getTierIcon(tier.tier)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
                  
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {formatCurrency(tier.priceXaf)}
                    </span>
                    <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {tier.duration} days
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedTier?.tier === tier.tier && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Purchase Section */}
          {selectedTier && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Purchase Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boost Type:</span>
                  <span className="font-medium text-foreground">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{selectedTier.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing:</span>
                  <span className="font-medium text-foreground">{listing?.title}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(selectedTier.priceXaf)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Payment Method</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <Smartphone className="w-5 h-5 mr-2" />
                    MTN Mobile Money
                  </button>
                  <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Orange Money
                  </button>
                </div>
              </div>

              <button
                onClick={handlePurchaseBoost}
                disabled={isProcessing}
                className="w-full mt-6 bg-primary text-primary-foreground py-3 px-6 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Purchase ${selectedTier.name} Boost`}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}