'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Star, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BoostSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boostDetails, setBoostDetails] = useState<any>(null);

  useEffect(() => {
    // Get boost details from URL params
    const tier = searchParams.get('tier');
    const duration = searchParams.get('duration');
    const price = searchParams.get('price');
    const paymentMethod = searchParams.get('paymentMethod');
    const transactionId = searchParams.get('transactionId');

    setBoostDetails({
      tier,
      duration,
      price,
      paymentMethod,
      transactionId
    });
  }, [searchParams]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'featured':
        return <Star className="w-8 h-8 text-yellow-500" />;
      case 'premium':
        return <TrendingUp className="w-8 h-8 text-blue-500" />;
      case 'top':
        return <Eye className="w-8 h-8 text-green-500" />;
      default:
        return <Star className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'featured':
        return 'Featured Listing';
      case 'premium':
        return 'Premium Listing';
      case 'top':
        return 'Top Listing';
      default:
        return 'Boosted Listing';
    }
  };

  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'featured':
        return 'Your listing will appear in the homepage carousel and featured sections';
      case 'premium':
        return 'Your listing will be highlighted in search results and category pages';
      case 'top':
        return 'Your listing will appear first in all relevant sections';
      default:
        return 'Your listing has been boosted successfully';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Boost Activated Successfully! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your listing boost has been activated and is now live
            </p>

            {/* Boost Details */}
            {boostDetails && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  {getTierIcon(boostDetails.tier)}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    {getTierName(boostDetails.tier)}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {getTierDescription(boostDetails.tier)}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {boostDetails.duration} days
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {boostDetails.price} XAF
                    </p>
                  </div>
                </div>

                {boostDetails.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Paid via {boostDetails.paymentMethod}
                      {boostDetails.transactionId && (
                        <span className="block mt-1">
                          Transaction ID: {boostDetails.transactionId}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Benefits List */}
            <div className="text-left mb-8">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                What happens next:
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Your listing is now boosted and visible to more users
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  You'll receive more views and potential buyers
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  The boost will automatically expire after the selected duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  You can boost again anytime to maintain visibility
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                View Homepage
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={() => router.push('/sell')}
                variant="outline"
                className="px-8 py-3 rounded-lg font-semibold"
              >
                Create Another Listing
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Pro Tip:</strong> Boost your listings regularly to maintain high visibility 
                and attract more potential buyers to your items.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

