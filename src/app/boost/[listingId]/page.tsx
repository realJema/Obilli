"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { listingsRepo } from "@/lib/repositories";
import { getBoostTiers, calculateBoostPrice, type BoostTier } from "@/lib/repositories/boosts";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { Database } from "@/lib/types/database";
import {
  Star,
  Zap,
  Clock,
  Check,
  ArrowLeft,
  CreditCard,
  Smartphone,
  AlertCircle,
  Crown,
  TrendingUp,
  Calendar,
  Image,
  Search,
  Home,
  Eye,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";

export default function BoostListingPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const { formatCurrency } = useI18n();
  
  const listingId = params?.listingId as string;
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Tier, 2: Select Days, 3: Payment, 4: Confirmation
  
  // Data states
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [boostTiers, setBoostTiers] = useState<BoostTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<BoostTier | null>(null);
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mtn' | 'orange' | 'paypal' | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  
  // UI states
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
        
        // Load boost tiers and listing in parallel
        const [tiers, listingData] = await Promise.all([
          getBoostTiers(),
          listingsRepo.getById(listingId)
        ]);
        
        setBoostTiers(tiers);
        
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
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId, user, router]);

  // Calculate price when tier or days change
  useEffect(() => {
    const calculatePrice = async () => {
      if (selectedTier) {
        const price = await calculateBoostPrice(selectedTier.tier, selectedDays);
        setCalculatedPrice(price);
      }
    };
    
    calculatePrice();
  }, [selectedTier, selectedDays]);

  const handlePurchaseBoost = async () => {
    if (!selectedTier || !listing || !user) return;

    try {
      setIsProcessing(true);
      setError(null);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selectedDays);

      // Create boost record using authenticated client
      const { data, error } = await supabase
        .from('boosts')
        .insert({
          listing_id: listingId,
          owner_id: user.id,
          tier: selectedTier.tier,
          expires_at: expiresAt.toISOString(),
          price_xaf: calculatedPrice,
          payment_status: 'paid', // For now, mark as paid immediately
          is_active: true // Activate immediately for demo
        })
        .select()
        .single();

      if (error) {
        console.error('Boost creation error:', error);
        throw new Error(`Failed to create boost: ${error.message}`);
      }

      if (!data) {
        throw new Error('Failed to create boost: No data returned');
      }

      // Show success message and redirect
      const successUrl = `/boost/success?id=${listingId}&title=${encodeURIComponent(listing.title)}&tier=${selectedTier.tier}&duration=${selectedDays}&price=${calculatedPrice}`;
      router.push(successUrl);
      
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
        return <Crown className="w-6 h-6" />;
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

  const SkeletonPreview = ({ tier }: { tier: string }) => {
    return (
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Where your listing will appear with {tier} boost:
        </h4>
        
        {tier === 'featured' && (
          <div className="space-y-3">
            {/* Search Results Preview */}
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Search Results</span>
              </div>
              <div className="bg-background border border-blue-300 dark:border-blue-700 rounded p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center">
                    <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {tier === 'premium' && (
          <div className="space-y-3">
            {/* Homepage Featured Section */}
            <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Homepage Featured</span>
              </div>
              <div className="bg-background border border-purple-300 dark:border-purple-700 rounded p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-medium">Premium</span>
                </div>
              </div>
            </div>
            {/* Category Top */}
            <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Category Top Position</span>
              </div>
            </div>
          </div>
        )}
        
        {tier === 'top' && (
          <div className="space-y-3">
            {/* Homepage Hero */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Homepage Hero Carousel</span>
              </div>
              <div className="bg-background border border-yellow-300 dark:border-yellow-700 rounded p-2">
                <div className="aspect-video bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                    <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Your Listing Here</span>
                  </div>
                </div>
              </div>
            </div>
            {/* All other premium features */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <span className="text-sm text-yellow-800 dark:text-yellow-200">+ All Premium & Featured benefits</span>
            </div>
          </div>
        )}
      </div>
    );
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

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10"></div>
              <div 
                className="absolute top-4 left-0 h-0.5 bg-primary -z-10 transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
              
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 1 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <span className="text-xs text-center font-medium">Select Boost</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 2 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className="text-xs text-center font-medium">Duration</span>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 3 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  3
                </div>
                <span className="text-xs text-center font-medium">Payment</span>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= 4 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  4
                </div>
                <span className="text-xs text-center font-medium">Activate</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Boost Tier */}
          {currentStep === 1 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Your Boost Type</h2>
              <p className="text-muted-foreground mb-6">
                Select the boost level that fits your needs. Higher tiers provide more visibility.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {boostTiers.map((tier) => (
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
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrency(tier.pricePerDay)}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          per day
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

              {/* Preview Section */}
              {selectedTier && (
                <div className="mt-8">
                  <SkeletonPreview tier={selectedTier.tier} />
                </div>
              )}

              {/* Next Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedTier}
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Duration
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Duration */}
          {currentStep === 2 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Boost Duration</h2>
              <p className="text-muted-foreground mb-6">
                Select how many days you want to boost your listing. Longer durations offer better value.
              </p>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedTier?.name} Boost</h3>
                  <p className="text-sm text-muted-foreground">
                    Price per day: {formatCurrency(selectedTier?.pricePerDay || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(calculatedPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total for {selectedDays} days
                  </div>
                </div>
              </div>

              {/* Duration Input */}
              <div className="max-w-md mx-auto mb-8">
                <label htmlFor="days" className="block text-sm font-medium text-foreground mb-2">
                  Number of Days
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                    disabled={selectedDays <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="number"
                    id="days"
                    min="1"
                    max="365"
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  <button
                    onClick={() => setSelectedDays(Math.min(365, selectedDays + 1))}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                    disabled={selectedDays >= 365}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Minimum 1 day, maximum 365 days
                </p>
              </div>

              {/* Preview Section */}
              {selectedTier && (
                <div className="mt-8">
                  <SkeletonPreview tier={selectedTier.tier} />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center px-6 py-3 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Boost Type
                </button>
                
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Continue to Payment
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Payment Method</h2>
              <p className="text-muted-foreground mb-6">
                Select your preferred payment method. Your boost will be activated immediately for demo purposes.
              </p>
              
              <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedTier?.name} Boost</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDays} days
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(calculatedPrice)}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-medium text-foreground">Payment Method</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setSelectedPaymentMethod('mtn')}
                    className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
                      selectedPaymentMethod === 'mtn'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    <div className="text-center">
                      <div className="font-medium">MTN</div>
                      <div className="text-xs">Mobile Money</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedPaymentMethod('orange')}
                    className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
                      selectedPaymentMethod === 'orange'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    <div className="text-center">
                      <div className="font-medium">Orange</div>
                      <div className="text-xs">Money</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedPaymentMethod('paypal')}
                    className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
                      selectedPaymentMethod === 'paypal'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    <div className="text-center">
                      <div className="font-medium">PayPal</div>
                      <div className="text-xs">& Cards</div>
                    </div>
                  </button>
                </div>
                
                {selectedPaymentMethod && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>
                        {selectedPaymentMethod === 'mtn' && 'MTN Mobile Money payment integration coming soon. For now, boost will be activated immediately.'}
                        {selectedPaymentMethod === 'orange' && 'Orange Money payment integration coming soon. For now, boost will be activated immediately.'}
                        {selectedPaymentMethod === 'paypal' && 'PayPal payment integration coming soon. For now, boost will be activated immediately.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              {selectedTier && (
                <div className="mt-8">
                  <SkeletonPreview tier={selectedTier.tier} />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center px-6 py-3 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Duration
                </button>
                
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!selectedPaymentMethod}
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Activate
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">Review & Activate Boost</h2>
              <p className="text-muted-foreground mb-6">
                Review your boost details before activation.
              </p>
              
              {/* Summary Card */}
              <div className="bg-muted rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Boost Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <h4 className="font-medium text-foreground">Listing</h4>
                      <p className="text-sm text-muted-foreground">{listing?.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{selectedTier?.name}</div>
                      <div className="text-sm text-muted-foreground">Boost Tier</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <h4 className="font-medium text-foreground">Duration</h4>
                      <p className="text-sm text-muted-foreground">Boost period</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{selectedDays} days</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()} - {new Date(Date.now() + selectedDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-foreground">Total Cost</h4>
                      <p className="text-sm text-muted-foreground">Payment method: {selectedPaymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(calculatedPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {selectedTier && (
                <div className="mt-8">
                  <SkeletonPreview tier={selectedTier.tier} />
                </div>
              )}

              {/* Terms */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Demo Activation</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      This is a demo version. Your boost will be activated immediately without actual payment processing. 
                      In the production version, you would be redirected to your selected payment method to complete the transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center px-6 py-3 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Payment
                </button>
                
                <button
                  onClick={handlePurchaseBoost}
                  disabled={isProcessing}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md font-medium hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Activating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Activate Boost Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
