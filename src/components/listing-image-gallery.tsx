'use client';

import { Package } from "lucide-react";
import { Carousel } from "@/components/carousel";
import { useI18n } from "@/lib/providers";

export function ListingImageGallery({ images, title }: { images: string[]; title: string }) {
  const { t } = useI18n();
  
  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">{t('common.noResults')}</span>
      </div>
    );
  }

  return (
    <Carousel images={images} title={title} />
  );
}
