'use client';

import { useI18n } from "@/lib/providers";

export function ListingDescription({ description }: { description: string | null }) {
  const { t } = useI18n();
  
  return (
    <div className="prose max-w-none">
      <h3 className="text-lg font-semibold mb-3">{t('listing.description')}</h3>
      <p className="text-muted-foreground whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}