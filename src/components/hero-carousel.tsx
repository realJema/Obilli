'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DefaultImage } from '@/components/default-image';
import { useI18n } from '@/lib/providers';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

interface HeroListing {
  id: string;
  title: string;
  price_xaf: number | null;
  description: string | null;
  created_at: string | null;
  category?: {
    id: number;
    name_en: string;
    name_fr: string;
  };
  owner?: {
    id: string;
    username: string | null;
  };
  media?: {
    url: string;
  }[];
  location?: {
    id: number;
    location_en: string;
    location_fr: string;
  } | null;
}

interface HeroCarouselProps {
  listings: HeroListing[];
}

export function HeroCarousel({ listings }: HeroCarouselProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? listings.length - 1 : prevIndex - 1
    );
  }, [listings.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === listings.length - 1 ? 0 : prevIndex + 1
    );
  }, [listings.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (listings.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNext, isHovered, listings.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (listings.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, listings.length]);

  if (listings.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[400px] bg-gradient-to-r from-primary to-primary/80 rounded-2xl">
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <h1 className="text-4xl font-bold mb-4">{t('home.welcomeTitle')}</h1>
                <p className="text-xl opacity-90">{t('home.welcomeDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentListing = listings[currentIndex];
  const imageUrl = currentListing.media && currentListing.media.length > 0 
    ? currentListing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1200&h=400&auto=format&fit=crop';
    
  const locationDisplay = currentListing.location 
    ? (currentListing.location.location_fr || currentListing.location.location_en)
    : null;
    
  const priceDisplay = currentListing.price_xaf && currentListing.price_xaf > 0 
    ? `FCFA ${currentListing.price_xaf.toLocaleString()}`
    : t('listing.negotiable');

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative h-[400px] rounded-2xl overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image */}
          <div className="absolute inset-0">
            <DefaultImage
              src={imageUrl}
              alt={currentListing.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>

          {/* Navigation Arrows */}
          {listings.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label={t('common.previous')}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label={t('common.next')}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-medium text-primary-foreground mb-3">
                  {t('home.featuredListing')}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                  {currentListing.title}
                </h2>
                
                {currentListing.description && (
                  <p className="text-white/80 mb-4 line-clamp-2 md:line-clamp-3">
                    {currentListing.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70">
                  {locationDisplay && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-primary" />
                      <span>{locationDisplay}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-4">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {priceDisplay}
                </div>
                
                <Link
                  href={`/listing/${currentListing.id}`}
                  className="inline-flex items-center bg-primary/90 text-primary-foreground px-4 py-2 text-sm rounded-md font-medium hover:bg-primary transition-colors"
                >
                  {t('common.viewDetails')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          {listings.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {listings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`${t('common.view')} ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}