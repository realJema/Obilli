"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  const { locale } = useI18n();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  // Check scroll state
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Setup scroll listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollState();
      container.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);
      
      return () => {
        container.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [categories]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (categoryId: number) => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a 1-second delay before showing the dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(categoryId);
    }, 1000);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  const handleNavMouseLeave = () => {
    // Clear all timeouts and close dropdown immediately when leaving the nav area
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveCategory(null);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
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
    <nav 
      ref={navRef} 
      className={`category-nav bg-card border-b border-border ${className} sticky top-0 z-50`}
      onMouseLeave={handleNavMouseLeave}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main category bar with scroll controls */}
        <div className="relative flex items-center py-2">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-full p-1 shadow-sm hover:bg-accent transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          {/* Scrollable categories container */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto overflow-y-visible scrollbar-hide flex-1 mx-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative px-2 group flex-shrink-0"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={() => {
                  // Cancel the hover timeout if user leaves before 1 second
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                  }
                }}
              >
                <Link
                  href={`/search?category=${category.id}`}
                  className="flex items-center space-x-2 text-sm md:text-base font-normal text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap cursor-pointer"
                  prefetch={true}
                >
                  <span>{locale === 'fr' ? category.name_fr : category.name_en}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronDown className={`h-4 w-4 group-hover:text-primary transition-colors ${activeCategory === category.id ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-full p-1 shadow-sm hover:bg-accent transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Expanded container for subcategories */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            activeCategory ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="pb-3 overflow-y-auto max-h-96">
            {activeCategory && categories.map((category) => (
              category.id === activeCategory && category.children && category.children.length > 0 && (
                <div key={`expanded-${category.id}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-3">
                  {category.children.map((subcategory) => (
                    <div key={subcategory.id} className="border-l border-border pl-2 py-1">
                      <Link
                        href={`/search?category=${subcategory.id}`}
                        className="block py-1 text-base md:text-lg font-normal text-foreground hover:text-primary transition-colors duration-300"
                        prefetch={true}
                      >
                        {locale === 'fr' ? subcategory.name_fr : subcategory.name_en}
                      </Link>
                      
                      {/* Sub-subcategories */}
                      {(subcategory as CategoryWithChildren).children && (subcategory as CategoryWithChildren).children!.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {(subcategory as CategoryWithChildren).children!.map((subsubcategory: CategoryWithChildren) => (
                            <Link
                              key={subsubcategory.id}
                              href={`/search?category=${subsubcategory.id}`}
                              className="block py-0.5 text-base text-muted-foreground hover:text-foreground transition-colors duration-300 pl-2"
                              prefetch={true}
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