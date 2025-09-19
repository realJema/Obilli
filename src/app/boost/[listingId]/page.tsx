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
import { AdPlacementInfo } from "@/components/ad-placement-info";
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
  Eye,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Home,
  MapPin
} from "lucide-react";
import Link from "next/link";

// Helper function to validate required customer fields
const areCustomerFieldsValid = (phoneNumber: string): boolean => {
  return phoneNumber.trim().length > 0;
};

export default function BoostListingPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const { formatCurrency } = useI18n();
  
  const listingId = params?.listingId as string;
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Tier, 2: Select Days, 3: Payment, 4: Confirmation, 5: Payment Confirmation, 6: Processing, 7: Error
  
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
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!listingId) {
      router.push('/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load boost tiers, listing data, and user profile in parallel
        const [tiers, listingData] = await Promise.all([
          getBoostTiers(),
          listingsRepo.getById(listingId)
        ]);
        
        // Load user profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single() as { data: { phone?: string } | null };
        
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
        
        // Pre-fill phone number if available in profile
        if (profileData?.phone) {
          setPhoneNumber(profileData.phone);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [listingId, user, router, supabase]);

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
      setError(null);

      let transactionId = `boost_${Date.now()}`;

      // Process payment based on selected method
      if (selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') {
        if (!phoneNumber.trim()) {
          throw new Error('Phone number is required for mobile money payments');
        }

        // Validate customer information
        if (!areCustomerFieldsValid(phoneNumber)) {
          throw new Error('Please enter your phone number');
        }

        // Validate phone number
        if (!mesombService.validatePhoneNumber(phoneNumber, selectedPaymentMethod)) {
          throw new Error(`Invalid ${selectedPaymentMethod?.toUpperCase()} phone number format`);
        }

        // Immediately show confirmation step
        setCurrentStep(5);
        setPaymentStatus('Sending payment request...');

        // Make payment request
        const paymentRequest: PaymentRequest = {
          amount: calculatedPrice,
          phone: phoneNumber,
          service: selectedPaymentMethod?.toUpperCase() as 'MTN' | 'ORANGE',
          reference: transactionId,
          description: `${selectedTier.name} boost for "${listing.title}"`
        };

        const paymentResponse = await mesombService.makePayment(paymentRequest);
        
        if (!paymentResponse.success) {
          // Provide specific error messages for common MeSomb errors
          let errorMessage = paymentResponse.error || 'Payment request failed';
          
          if (errorMessage.includes('sender account is not active') || 
              errorMessage.includes('Service Provider does not know the recipient') ||
              errorMessage.includes('subscriber-not-found')) {
            errorMessage = 'The phone number you entered is not registered for mobile money services. Please ensure your MTN Mobile Money or Orange Money account is active and try again.';
          } else if (errorMessage.includes('Invalid phone number format')) {
            errorMessage = 'Invalid phone number format. Please check the number and try again.';
          }
          
          throw new Error(errorMessage);
        }

        transactionId = paymentResponse.transactionId || transactionId;
        
        // If payment is pending, continue on confirmation step
        if (paymentResponse.status === 'PENDING') {
          setPaymentStatus('Payment request sent. Please check your phone and confirm the payment...');
          
          // Start polling in the background
          setTimeout(async () => {
            try {
              setCurrentStep(6); // Go to processing step
              setPaymentStatus('Processing payment...');
              
              // Poll payment status
              const finalStatus = await mesombService.pollPaymentStatus(
                transactionId, 
                selectedPaymentMethod, 
                30, // 30 attempts
                2000 // 2 seconds between attempts
              );
              
              if (finalStatus.status === 'SUCCESS') {
                if (!isMounted) return;
                setPaymentStatus('Payment confirmed! Creating boost...');
                try {
                  await createBoost(transactionId);
                } catch (boostError) {
                  console.error('Boost creation failed after successful payment:', boostError);
                  if (isMounted) {
                    setCurrentStep(7);
                    setError(boostError instanceof Error ? boostError.message : 'Failed to create boost after payment');
                    setPaymentStatus('');
                  }
                }
              } else if (finalStatus.status === 'FAILED') {
                if (!isMounted) return;
                setCurrentStep(7); // Go to error step
                setError('Payment was declined or failed');
                setPaymentStatus('');
                return;
              } else if (finalStatus.status === 'CANCELLED') {
                if (!isMounted) return;
                setCurrentStep(7); // Go to error step
                setError('Payment was cancelled');
                setPaymentStatus('');
                return;
              } else {
                if (!isMounted) return;
                setCurrentStep(7); // Go to error step
                setError('Payment confirmation timed out');
                setPaymentStatus('');
                return;
              }
            } catch (pollError) {
              console.error('Payment polling failed:', pollError);
              if (isMounted) {
                setCurrentStep(7); // Go to error step
                setError(pollError instanceof Error ? pollError.message : 'Payment processing failed');
                setPaymentStatus('');
              }
              return;
            }
          }, 2000); // Wait 2 seconds before starting processing
        } else if (paymentResponse.status === 'SUCCESS') {
          setCurrentStep(6); // Go to processing step
          setPaymentStatus('Payment confirmed! Creating boost...');
          try {
            await createBoost(transactionId);
          } catch (boostError) {
            console.error('Boost creation failed after successful payment:', boostError);
            setCurrentStep(7);
            setError(boostError instanceof Error ? boostError.message : 'Failed to create boost after payment');
            setPaymentStatus('');
          }
        } else {
          throw new Error('Payment failed');
        }
      } else if (selectedPaymentMethod === 'paypal') {
        // PayPal payment processing
        throw new Error('PayPal payment integration is not yet implemented. Please use MTN or Orange Mobile Money.');
      } else {
        throw new Error('Please select a payment method');
      }
      
    } catch (err) {
      console.error('Failed to purchase boost:', err);
      
      // Ensure we're on the error step regardless of where the error occurred
      setCurrentStep(7);
      setError(err instanceof Error ? err.message : 'Failed to purchase boost');
      setPaymentStatus('');
    }
  };

  // Separate function to create boost after successful payment
  const createBoost = async (transactionId: string) => {
    if (!selectedTier || !user) {
      throw new Error('Missing required data for boost creation');
    }
    
    try {
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
      
      // Use setTimeout to ensure state updates are completed before navigation
      setTimeout(() => {
        router.push(successUrl);
      }, 100);
      
    } catch (err) {
      console.error('Failed to create boost:', err);
      // Re-throw the error to be handled by the caller
      throw err;
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
      case 'ads':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
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
      case 'ads':
        return 'from-green-500 to-green-600';
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

            {/* Ad Placement Info */}
            <AdPlacementInfo tier={tier} />
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

            {/* Ad Placement Info */}
            <AdPlacementInfo tier={tier} />
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

            {/* Ad Placement Info */}
            <AdPlacementInfo tier={tier} />

            {/* All other benefits */}
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">+ All Premium & Featured benefits</span>
              </div>
            </div>
          </div>
        )}

        {tier === 'ads' && (
          <div className="space-y-4">
            {/* Ad Placement in Feed */}
            <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Advertisement Placement</span>
              </div>
              <div className="bg-background border border-green-300 dark:border-green-700 rounded-lg p-2">
                {/* Feed ad preview */}
                <div className="space-y-3">
                  <div className="h-4 bg-green-200 dark:bg-green-800 rounded w-1/3"></div>
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-green-200 dark:bg-green-800 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-green-200 dark:bg-green-800 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-green-200/70 dark:bg-green-800/70 rounded w-1/2 mb-2"></div>
                      <div className="h-2 bg-green-200/70 dark:bg-green-800/70 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-green-200 dark:bg-green-800 rounded w-1/4"></div>
                    <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded font-medium">
                      Advertisement
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Placement Info */}
            <AdPlacementInfo tier={tier} />

            {/* All other benefits */}
            <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-800 dark:text-green-200">High visibility advertisement placement</span>
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
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-4 bg-muted rounded w-32 mr-6"></div>
                <div>
                  <div className="h-6 bg-muted rounded w-48 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-64"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                    {step < 4 && <div className="w-8 h-0.5 ml-2 bg-muted"></div>}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Panel Skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/3 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-64 bg-muted rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Panel Skeleton */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Summary Skeleton */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  {/* Preview Skeleton */}
                  <div>
                    <div className="h-6 bg-muted rounded w-20 mb-4"></div>
                    <div className="h-40 bg-muted rounded-lg"></div>
                  </div>
                </div>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Boost Your Listing</h1>
                <p className="text-muted-foreground">
                  Increase visibility for &ldquo;{listing?.title}&rdquo;
                </p>
              </div>
            </div>
            
            {/* Progress Indicator - Horizontal */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-0.5 ml-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Select Boost Tier */}
              {currentStep === 1 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">Choose Your Boost Type</h2>
                  <p className="text-muted-foreground mb-6">
                    Select the boost level that fits your needs. Higher tiers provide more visibility.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boostTiers.map((tier) => (
                      <div
                        key={tier.tier}
                        className={`relative bg-card border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedTier?.tier === tier.tier
                            ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedTier(tier)}
                      >
                        {/* Popular badge for premium */}
                        {tier.tier === 'premium' && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}

                        {/* Best Value badge for ads */}
                        {tier.tier === 'ads' && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Best Value
                            </span>
                          </div>
                        )}

                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${getTierColor(tier.tier)} text-white mb-3`}>
                            {getTierIcon(tier.tier)}
                          </div>
                          
                          <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{tier.description}</p>
                          
                          <div className="text-center mb-4">
                            <span className="text-lg font-bold text-foreground">
                              {formatCurrency(tier.pricePerDay)}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              per day
                            </div>
                          </div>

                          <div className="space-y-1">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-muted-foreground">
                                <Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                            {tier.features.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{tier.features.length - 3} more benefits
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Selection indicator */}
                        {selectedTier?.tier === tier.tier && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedTier}
                      className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Duration */}
              {currentStep === 2 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">Choose Boost Duration</h2>
                  <p className="text-muted-foreground mb-6">
                    Select how many days you want to boost your listing.
                  </p>
                  
                  {/* Duration Input */}
                  <div className="max-w-md">
                    <label htmlFor="days" className="block text-sm font-medium text-foreground mb-3">
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
                    <p className="mt-2 text-xs text-muted-foreground">
                      Minimum 1 day, maximum 365 days
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">Payment Method</h2>
                  <p className="text-muted-foreground mb-6">
                    Select your preferred payment method.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Payment Methods */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Choose Payment Method</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={() => setSelectedPaymentMethod('mtn')}
                          className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                            selectedPaymentMethod === 'mtn'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <Smartphone className="w-5 h-5 mb-1" />
                          <div className="text-xs font-medium">MTN</div>
                        </button>
                        
                        <button 
                          onClick={() => setSelectedPaymentMethod('orange')}
                          className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                            selectedPaymentMethod === 'orange'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <Smartphone className="w-5 h-5 mb-1" />
                          <div className="text-xs font-medium">Orange</div>
                        </button>
                        
                        <button 
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                            selectedPaymentMethod === 'paypal'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          <CreditCard className="w-5 h-5 mb-1" />
                          <div className="text-xs font-medium">PayPal</div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Phone Number Input for Mobile Money */}
                    {(selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder={selectedPaymentMethod === 'mtn' ? '670123456' : '691234567'}
                            className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedPaymentMethod === 'mtn' 
                            ? 'Enter your MTN Mobile Money number' 
                            : 'Enter your Orange Money number'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep(4)}
                      disabled={
                        !selectedPaymentMethod || 
                        ((selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'orange') && !phoneNumber.trim())
                      }
                      className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review & Activate
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Final Confirmation */}
              {currentStep === 4 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">Ready to Activate</h2>
                  <p className="text-muted-foreground mb-6">
                    Review your selection and activate your boost.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-md font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    
                    <button
                      onClick={handlePurchaseBoost}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md font-medium hover:from-green-600 hover:to-emerald-700 transition-colors"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Pay and Activate
                    </button>
                  </div>
                </div>
              )}


              {/* Processing and Error States */}
              {currentStep >= 5 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  {currentStep === 5 && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Confirm Payment on Your Phone</h2>
                      <p className="text-muted-foreground mb-6">
                        A payment request has been sent to your phone. Please check your device and confirm the payment.
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span className="ml-2">Waiting for confirmation...</span>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentStep(4);
                          setPaymentStatus('');
                        }}
                        className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-accent"
                      >
                        Cancel Payment
                      </button>
                    </div>
                  )}
                  
                  {currentStep === 6 && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Processing Payment</h2>
                      <p className="text-muted-foreground mb-6">
                        {paymentStatus || 'Please wait while we process your payment...'}
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 7 && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Payment Failed</h2>
                      <p className="text-muted-foreground mb-6">
                        {error || 'Your payment could not be processed. Please try again.'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            setCurrentStep(4);
                            setError(null);
                            setPaymentStatus('');
                          }}
                          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Try Again
                        </button>
                        <button
                          onClick={() => {
                            setCurrentStep(3);
                            setError(null);
                            setPaymentStatus('');
                          }}
                          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Change Payment Method
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Panel - Summary and Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
                  
                  {selectedTier && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getTierColor(selectedTier.tier)} text-white flex items-center justify-center`}>
                          {getTierIcon(selectedTier.tier)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{selectedTier.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedTier.description}</div>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{selectedDays} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price per day:</span>
                          <span className="font-medium">{formatCurrency(selectedTier.pricePerDay)}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-foreground">Total:</span>
                            <span className="font-bold text-xl text-primary">{formatCurrency(calculatedPrice)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedPaymentMethod && (
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment method:</span>
                            <span className="font-medium capitalize">{selectedPaymentMethod}</span>
                          </div>
                          {phoneNumber && (
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="font-medium">{phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!selectedTier && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Star className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">Select a boost tier to see pricing</p>
                    </div>
                  )}
                </div>
                
                {/* Preview Section - No nested cards */}
                {selectedTier && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Preview
                    </h3>
                    <SkeletonPreview tier={selectedTier.tier} />
                  </div>
                )}
                
                {!selectedTier && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Preview
                    </h3>
                    <div className="bg-card border border-border rounded-lg p-8 text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Select a boost tier to see how your listing will appear</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
