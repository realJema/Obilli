"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categoriesRepo } from "@/lib/repositories";
import { useI18n } from "@/lib/providers";
import type { CategoryWithChildren } from "@/lib/repositories/categories";

export function Footer() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useI18n();

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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-6">Browse Categories</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse w-24"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded animate-pulse w-20"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <Link
                    href={`/search?category=${category.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors block"
                  >
                    {locale === 'fr' ? category.name_fr : category.name_en}
                  </Link>
                  
                  {category.children && category.children.length > 0 && (
                    <div className="space-y-2">
                      {category.children.slice(0, 5).map((subcategory) => (
                        <div key={subcategory.id}>
                          <Link
                            href={`/search?category=${subcategory.id}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                          >
                            {locale === 'fr' ? subcategory.name_fr : subcategory.name_en}
                          </Link>
                          
                          {(subcategory as CategoryWithChildren).children && (subcategory as CategoryWithChildren).children!.length > 0 && (
                            <div className="ml-3 mt-1 space-y-1">
                              {(subcategory as CategoryWithChildren).children!.slice(0, 3).map((subsubcategory: CategoryWithChildren) => (
                                <Link
                                  key={subsubcategory.id}
                                  href={`/search?category=${subsubcategory.id}`}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors block"
                                >
                                  {locale === 'fr' ? subsubcategory.name_fr : subsubcategory.name_en}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h4 className="font-semibold mb-4">About Bonas</h4>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-primary transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-primary transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-primary transition-colors">
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/prohibited" className="hover:text-primary transition-colors">
                    Prohibited Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li>
                  <a href="https://facebook.com/bonas" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/bonas" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/bonas" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/company/bonas" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} Bonas Marketplace. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ in Cameroon</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
