import { Star, TrendingUp, Home, MapPin, ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { Eye } from "lucide-react";

export function AdPlacementInfo({ tier }: { tier: string }) {
  // Special handling for ads tier
  if (tier === 'ads') {
    return (
      <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 rounded-md p-3">
        <div className="flex items-center space-x-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-sm font-medium text-green-900 dark:text-green-100">Advertisement Placement</span>
        </div>
        <div className="bg-background border border-green-300 dark:border-green-700 rounded-lg p-2">
          <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium inline-block mb-2">
                  Advertisement
                </div>
                <div className="h-3 bg-green-200 dark:bg-green-800 rounded w-24 mx-auto mb-1"></div>
                <div className="h-2 bg-green-200/70 dark:bg-green-800/70 rounded w-16 mx-auto"></div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-800 dark:text-green-200">
            Your listing will appear as a prominent rectangular advertisement between homepage sections and in search results
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-md p-3">
      <div className="flex items-center space-x-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Homepage Ad Placement</span>
      </div>
      <div className="bg-background border border-blue-300 dark:border-blue-700 rounded-lg p-2">
        <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium inline-block mb-2">
                {tier === 'top' ? 'Top Ad' : tier === 'premium' ? 'Premium Ad' : 'Featured Ad'}
              </div>
              <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-24 mx-auto mb-1"></div>
              <div className="h-2 bg-blue-200/70 dark:bg-blue-800/70 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-800 dark:text-blue-200">
          {tier === 'top' 
            ? 'Your listing will appear as a prominent rectangular ad between homepage sections and in search results'
            : tier === 'premium'
            ? 'Your listing will appear as a rectangular ad between homepage sections'
            : 'Your listing will appear as a rectangular ad between homepage sections'}
        </div>
      </div>
    </div>
  );
}