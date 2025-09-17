'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/providers";

export function ListingBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { t } = useI18n();
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-primary transition-colors">
        {t('nav.home')}
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}