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
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useI18n();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

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
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
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
    <nav ref={navRef} className={`category-nav bg-card border-b border-border ${className} sticky top-0 z-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main category bar */}
        <div className="flex justify-between items-center py-2 overflow-x-auto overflow-y-visible">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative px-2 group"
              onMouseEnter={() => handleMouseEnter(category.id)}
            >
              <div className="flex items-center space-x-2 text-sm md:text-base font-normal text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap cursor-pointer">
                <span>{locale === 'fr' ? category.name_fr : category.name_en}</span>
                {category.children && category.children.length > 0 && (
                  <ChevronDown className={`h-4 w-4 group-hover:text-primary transition-colors ${activeCategory === category.id ? 'rotate-180' : ''}`} />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Expanded container for subcategories */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeCategory ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          onMouseEnter={() => activeCategory && setActiveCategory(activeCategory)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="pb-2">
            {activeCategory && categories.map((category) => (
              category.id === activeCategory && category.children && category.children.length > 0 && (
                <div key={`expanded-${category.id}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                  {category.children.map((subcategory) => (
                    <div key={subcategory.id} className="border-l border-border pl-3">
                      <Link
                        href={`/search?category=${subcategory.id}`}
                        className="block py-1 text-sm md:text-base font-normal text-foreground hover:text-primary transition-colors duration-300"
                      >
                        {locale === 'fr' ? subcategory.name_fr : subcategory.name_en}
                      </Link>
                      
                      {/* Sub-subcategories */}
                      {(subcategory as CategoryWithChildren).children && (subcategory as CategoryWithChildren).children!.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {(subcategory as CategoryWithChildren).children!.map((subsubcategory: CategoryWithChildren) => (
                            <Link
                              key={subsubcategory.id}
                              href={`/search?category=${subsubcategory.id}`}
                              className="block py-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 pl-3"
                            >
                              {locale === 'fr' ? subsubcategory.name_fr : subsubcategory.name_en}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CategoryNav;
