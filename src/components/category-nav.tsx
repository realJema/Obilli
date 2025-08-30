"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { categoriesRepo } from "@/lib/repositories";
import { useI18n } from "@/lib/providers";
import type { CategoryWithChildren } from "@/lib/repositories/categories";

interface CategoryNavProps {
  className?: string;
}

export function CategoryNav({ className = "" }: CategoryNavProps) {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useI18n();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoriesRepo.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleMouseEnter = (categoryId: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  if (isLoading) {
    return (
      <nav className={`bg-card border-b border-border ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-muted rounded animate-pulse w-20"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`bg-card border-b border-border ${className} sticky top-0 z-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-3 overflow-x-auto overflow-y-visible">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={`/search?category=${category.id}`}
                className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap group"
              >
                <span>{locale === 'fr' ? category.name_fr : category.name_en}</span>
                {category.children && category.children.length > 0 && (
                  <ChevronDown className="h-3 w-3 group-hover:text-primary transition-colors" />
                )}
              </Link>

              {/* Dropdown Menu */}
              {category.children && category.children.length > 0 && activeDropdown === category.id && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg z-[9999] min-h-0">
                  <div className="py-2">
                    {category.children.map((subcategory) => (
                      <div key={subcategory.id}>
                        <Link
                          href={`/search?category=${subcategory.id}`}
                          className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <span>{locale === 'fr' ? subcategory.name_fr : subcategory.name_en}</span>
                          {(subcategory as CategoryWithChildren).children && (subcategory as CategoryWithChildren).children!.length > 0 && (
                            <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                          )}
                        </Link>
                        
                        {/* Sub-subcategories */}
                        {(subcategory as CategoryWithChildren).children && (subcategory as CategoryWithChildren).children!.length > 0 && (
                          <div className="pl-4 border-l border-border ml-4">
                            {(subcategory as CategoryWithChildren).children!.map((subsubcategory: CategoryWithChildren) => (
                              <Link
                                key={subsubcategory.id}
                                href={`/search?category=${subsubcategory.id}`}
                                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                              >
                                {locale === 'fr' ? subsubcategory.name_fr : subsubcategory.name_en}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
