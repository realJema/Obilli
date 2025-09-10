"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { listingsRepo } from "@/lib/repositories";
import { getBoostTiers, calculateBoostPrice, type BoostTier } from "@/lib/repositories/boosts";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { Database } from "@/lib/types/database";
import { mesombService, type PaymentRequest } from "@/lib/services/mesomb";
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
  Home,
  Eye,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  MapPin
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Tier, 2: Select Days, 3: Payment, 4: Confirmation, 5: Payment Waiting
  
  // Ref for main container
  const mainContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when step changes
  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);
  
  // Data states
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [boostTiers, setBoostTiers] = useState<BoostTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<BoostTier | null>(null);
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mtn' | 'orange' | 'paypal' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
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

      let paymentSuccess = true;
      let transactionId = `boost_${Date.now()}`;

      // Process payment based on selected method
      if (selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') {
        if (!phoneNumber.trim()) {
          throw new Error('Phone number is required for mobile money payments');
        }

        // Validate phone number
        if (!mesombService.validatePhoneNumber(phoneNumber, selectedPaymentMethod)) {
          throw new Error(`Invalid ${selectedPaymentMethod?.toUpperCase()} phone number format`);
        }

        // Make payment request
        const paymentRequest: PaymentRequest = {
          amount: calculatedPrice,
          phone: phoneNumber,
          service: selectedPaymentMethod?.toUpperCase() as 'MTN' | 'ORANGE',
          reference: transactionId,
          description: `${selectedTier.name} boost for "${listing.title}"`
        };

        setPaymentStatus('Sending payment request...');
        const paymentResponse = await mesombService.makePayment(paymentRequest);
        
        if (!paymentResponse.success) {
          throw new Error(paymentResponse.error || 'Payment request failed');
        }

        transactionId = paymentResponse.transactionId || transactionId;
        
        // If payment is pending, go to waiting step
        if (paymentResponse.status === 'PENDING') {
          setIsPaymentPending(true);
          setCurrentStep(5); // Go to payment waiting step
          setPaymentStatus('Payment request sent. Please check your phone and confirm the payment...');
          
          // Poll payment status
          const finalStatus = await mesombService.pollPaymentStatus(
            transactionId, 
            selectedPaymentMethod, 
            30, // 30 attempts
            2000 // 2 seconds between attempts
          );
          
          if (finalStatus.status === 'SUCCESS') {
            setPaymentStatus('Payment confirmed! Creating boost...');
            paymentSuccess = true;
          } else if (finalStatus.status === 'FAILED') {
            throw new Error('Payment was declined or failed');
          } else if (finalStatus.status === 'CANCELLED') {
            throw new Error('Payment was cancelled');
          } else {
            throw new Error('Payment confirmation timed out');
          }
        } else if (paymentResponse.status === 'SUCCESS') {
          setPaymentStatus('Payment confirmed! Creating boost...');
          paymentSuccess = true;
        } else {
          throw new Error('Payment failed');
        }
      } else if (selectedPaymentMethod === 'paypal') {
        // PayPal payment processing
        setPaymentStatus('Processing PayPal payment...');
        
        // For now, simulate PayPal payment success
        // In production, you would integrate with PayPal API here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        setPaymentStatus('PayPal payment confirmed! Creating boost...');
        paymentSuccess = true;
      }

      if (paymentSuccess) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selectedDays);

      // Create boost record using authenticated client
        const boostData = {
            listing_id: listingId as string,
          owner_id: user.id,
          tier: selectedTier.tier,
            starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          price_xaf: calculatedPrice,
            payment_status: 'paid',
            is_active: true
          };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('boosts')
          .insert(boostData as Database['public']['Tables']['boosts']['Insert'])
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
        const successUrl = `/boost/${listingId}/success?tier=${selectedTier.tier}&duration=${selectedDays}&price=${calculatedPrice}&paymentMethod=${selectedPaymentMethod}&transactionId=${transactionId}`;
      router.push(successUrl);
      }
      
    } catch (err) {
      console.error('Failed to purchase boost:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase boost');
    } finally {
      setIsProcessing(false);
      setIsPaymentPending(false);
      setPaymentStatus('');
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
          <div className="space-y-4">
            {/* Homepage Hero Carousel Preview */}
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Homepage Hero Carousel</span>
              </div>
              <div className="bg-background border border-blue-300 dark:border-blue-700 rounded-lg p-2">
                {/* Carousel with proper dimensions */}
                <div className="relative h-[200px] overflow-hidden rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                  {/* Navigation arrows */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-1 rounded-full">
                    <ChevronLeft className="h-3 w-3" />
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-1 rounded-full">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-end justify-between">
                  <div className="flex-1">
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium inline-block mb-2">
                          Featured Listing
                  </div>
                        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-blue-200/70 dark:bg-blue-800/70 rounded w-1/2 mb-2"></div>
                        <div className="flex items-center space-x-3 text-xs text-blue-800/80 dark:text-blue-200/80">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <div className="h-2 bg-blue-200/70 dark:bg-blue-800/70 rounded w-16"></div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <div className="h-2 bg-blue-200/70 dark:bg-blue-800/70 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 bg-blue-200 dark:bg-blue-800 rounded w-20 mb-2"></div>
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                    <div className="w-1 h-1 rounded-full bg-blue-300"></div>
                    <div className="w-1 h-1 rounded-full bg-blue-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Listings Section Preview */}
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Featured Listings Section</span>
              </div>
              <div className="bg-background border border-blue-300 dark:border-blue-700 rounded-lg p-2">
                {/* Section header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <div className="h-5 bg-blue-200 dark:bg-blue-800 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronLeft className="h-3 w-3" />
                    </div>
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                
                {/* Horizontal scroll of listing cards */}
                <div className="flex space-x-3 overflow-hidden">
                  {/* Featured listing card (highlighted) */}
                  <div className="flex-shrink-0 w-32 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-blue-200 dark:bg-blue-800 relative">
                      <div className="absolute top-1 left-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-1 py-0.5 rounded font-medium">
                        Featured
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-blue-200/70 dark:bg-blue-800/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  {/* Other listing cards */}
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {tier === 'premium' && (
          <div className="space-y-4">
            {/* Featured Listings Section Preview */}
            <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Featured Listings Section</span>
              </div>
              <div className="bg-background border border-purple-300 dark:border-purple-700 rounded-lg p-2">
                {/* Section header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <div className="h-5 bg-purple-200 dark:bg-purple-800 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronLeft className="h-3 w-3" />
                  </div>
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
                
                {/* Horizontal scroll of listing cards */}
                <div className="flex space-x-3 overflow-hidden">
                  {/* Premium listing card (highlighted) */}
                  <div className="flex-shrink-0 w-32 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-purple-200 dark:bg-purple-800 relative">
                      <div className="absolute top-1 left-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-1 py-0.5 rounded font-medium">
                        Premium
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-purple-200/70 dark:bg-purple-800/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  {/* Other listing cards */}
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category Top Position */}
            <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Category Top Position</span>
              </div>
              <div className="bg-background border border-purple-300 dark:border-purple-700 rounded-lg p-2">
                {/* Category section header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-purple-200 dark:bg-purple-800 rounded w-24"></div>
                  <div className="flex items-center space-x-1">
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronLeft className="h-3 w-3" />
                    </div>
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                
                {/* Top listing cards */}
                <div className="flex space-x-3 overflow-hidden">
                  {/* Top listing card (highlighted) */}
                  <div className="flex-shrink-0 w-32 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-purple-200 dark:bg-purple-800 relative">
                      <div className="absolute top-1 left-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-1 py-0.5 rounded font-medium">
                        #1
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-purple-200/70 dark:bg-purple-800/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  {/* Other listing cards */}
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {tier === 'top' && (
          <div className="space-y-4">
            {/* Featured Listings Section - First Position */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Featured Listings Section - First Position</span>
              </div>
              <div className="bg-background border border-yellow-300 dark:border-yellow-700 rounded-lg p-2">
                {/* Section header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <div className="h-5 bg-yellow-200 dark:bg-yellow-800 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronLeft className="h-3 w-3" />
                </div>
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronRight className="h-3 w-3" />
              </div>
            </div>
                </div>
                
                {/* Horizontal scroll of listing cards */}
                <div className="flex space-x-3 overflow-hidden">
                  {/* Top listing card (highlighted) */}
                  <div className="flex-shrink-0 w-32 bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-yellow-200 dark:bg-yellow-800 relative">
                      <div className="absolute top-1 left-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs px-1 py-0.5 rounded font-medium">
                        Top
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="h-2 bg-yellow-200 dark:bg-yellow-800 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-yellow-200 dark:bg-yellow-800 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-yellow-200/70 dark:bg-yellow-800/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  {/* Other listing cards */}
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Section - First Position */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Trending Section - First Position</span>
              </div>
              <div className="bg-background border border-yellow-300 dark:border-yellow-700 rounded-lg p-2">
                {/* Section header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <div className="h-5 bg-yellow-200 dark:bg-yellow-800 rounded w-24"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronLeft className="h-3 w-3" />
                    </div>
                    <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                
                {/* Horizontal scroll of listing cards */}
                <div className="flex space-x-3 overflow-hidden">
                  {/* Top listing card (highlighted) */}
                  <div className="flex-shrink-0 w-32 bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-yellow-200 dark:bg-yellow-800 relative">
                      <div className="absolute top-1 left-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs px-1 py-0.5 rounded font-medium">
                        Top
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="h-2 bg-yellow-200 dark:bg-yellow-800 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-yellow-200 dark:bg-yellow-800 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-yellow-200/70 dark:bg-yellow-800/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  {/* Other listing cards */}
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200/70 dark:bg-gray-600/70 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All other benefits */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">+ All Premium & Featured benefits</span>
              </div>
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
      <div ref={mainContainerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

              {/* Preview Section - Only show on first step */}
              {selectedTier && currentStep === 1 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Preview: How your listing will appear
                  </h3>
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
                
                {/* Phone Number Input for Mobile Money */}
                {(selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={selectedPaymentMethod === 'mtn' ? '6XXXXXXXX' : '69XXXXXXXX or 655-659XXXX'}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedPaymentMethod === 'mtn' 
                        ? 'Enter your MTN Mobile Money number (e.g., 675123456)' 
                        : 'Enter your Orange Money number (e.g., 691234567 or 655123456)'
                      }
                    </p>
                  </div>
                )}
                
                {selectedPaymentMethod && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>
                        {selectedPaymentMethod === 'mtn' && 'MTN Mobile Money payment will be processed via MeSomb. You will receive a payment request on your phone.'}
                        {selectedPaymentMethod === 'orange' && 'Orange Money payment will be processed via MeSomb. You will receive a payment request on your phone.'}
                        {selectedPaymentMethod === 'paypal' && 'PayPal payment will be processed securely. You will be redirected to PayPal for payment confirmation.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

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
                  disabled={
                    !selectedPaymentMethod || 
                    ((selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') && !phoneNumber.trim())
                  }
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Activate
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Payment Waiting */}
          {currentStep === 5 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-2">Waiting for Payment</h2>
                <p className="text-muted-foreground mb-6">
                  {paymentStatus || 'Please check your phone and confirm the payment...'}
                </p>

                {/* Payment Details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold text-foreground">{formatCurrency(calculatedPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-semibold text-foreground">
                        {selectedPaymentMethod?.toUpperCase()} Mobile Money
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone Number</p>
                      <p className="font-semibold text-foreground">{phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Boost Tier</p>
                      <p className="font-semibold text-foreground">{selectedTier?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What to do next:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                    <li>• Check your phone for a payment request</li>
                    <li>• Enter your mobile money PIN when prompted</li>
                    <li>• Confirm the payment amount</li>
                    <li>• Wait for confirmation (this page will update automatically)</li>
                  </ul>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    setIsPaymentPending(false);
                    setPaymentStatus('');
                  }}
                  className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel Payment
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
                      <p className="text-sm text-muted-foreground">
                        Payment method: {selectedPaymentMethod?.toUpperCase()}
                        {(selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') && phoneNumber && (
                          <span className="block">Phone: {phoneNumber}</span>
                        )}
                      </p>
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

              {/* Payment Status Indicator */}
              {isPaymentPending && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 font-medium">{paymentStatus}</p>
                      <p className="text-blue-600 dark:text-blue-300 text-sm">
                        Please check your phone and confirm the payment request
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isProcessing || isPaymentPending || ((selectedPaymentMethod && ['mtn', 'orange'].includes(selectedPaymentMethod) && !phoneNumber) ?? false)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md font-medium hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing || isPaymentPending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      <span className="flex items-center">
                        {isPaymentPending ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2" />
                            {paymentStatus || 'Waiting for payment confirmation...'}
                          </>
                        ) : (
                          'Processing payment...'
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Pay & Activate
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
