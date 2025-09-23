"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, User, LogOut, Settings, Shield, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Folder, FolderOpen, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/providers";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useRef } from "react";
import { categoriesRepo } from "@/lib/repositories";
import type { CategoryWithChildren } from "@/lib/repositories/categories";

interface HeaderProps {
  logoUrl?: string;
}

export function Header({ logoUrl = "/logo.png" }: HeaderProps) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username?: string; full_name?: string; avatar_url?: string; role?: string } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [currentView, setCurrentView] = useState<'main' | 'subcategories'>('main');
  const [selectedSubgroup, setSelectedSubgroup] = useState<CategoryWithChildren | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, role')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user, supabase]);

  // Load categories for mobile menu
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoriesRepo.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
        // Reset view when closing menu
        setExpandedCategories(new Set());
        setCurrentView('main');
        setSelectedSubgroup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileMenu(false);
      // Reset view when closing menu
      setExpandedCategories(new Set());
      setCurrentView('main');
      setSelectedSubgroup(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    // Reset view when closing menu
    setExpandedCategories(new Set());
    setCurrentView('main');
    setSelectedSubgroup(null);
    router.push('/');
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const showSubcategories = (subgroup: CategoryWithChildren) => {
    setSelectedSubgroup(subgroup);
    setCurrentView('subcategories');
  };

  const goBackToMain = () => {
    setCurrentView('main');
    setSelectedSubgroup(null);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    // Reset view when closing menu
    setExpandedCategories(new Set());
    setCurrentView('main');
    setSelectedSubgroup(null);
  };

  return (
    <header className="z-[60] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" prefetch={true}>
              <div className="h-8 w-8 rounded-md flex items-center justify-center">
                <Image 
                  src={logoUrl} 
                  alt="Obilli Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-md"
                />
              </div>
              <span className="hidden sm:inline-block font-bold text-xl">
                {t("app.title")}
              </span>
            </Link>
          </div>

          {/* Search Bar - Visible on mobile and desktop */}
          <div className="flex-1 max-w-xl mx-4 md:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-l-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
                <button 
                  type="submit" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  {t("common.search")}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 mr-4">
              <Link
                href="/sell/new"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                prefetch={true}
              >
                {t("nav.sell")}
              </Link>
              
              {user && userProfile ? (
                <>
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {userProfile.avatar_url ? (
                        <Image
                          src={userProfile.avatar_url}
                          alt={userProfile.username || 'User'}
                          className="h-6 w-6 rounded-full object-cover"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-sm font-medium hidden lg:inline">
                        {userProfile.username || userProfile.full_name || 'User'}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-[60]">
                        <div className="py-2">
                          <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium text-foreground">
                              {userProfile.full_name || userProfile.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{userProfile.username}
                            </p>
                          </div>
                          
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setShowUserMenu(false)}
                            prefetch={true}
                          >
                            <User className="h-4 w-4 mr-3" />
                            {t("nav.dashboard")}
                          </Link>
                          
                          {/* Admin link - only show for admin users */}
                          {userProfile.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setShowUserMenu(false)}
                              prefetch={true}
                            >
                              <Shield className="h-4 w-4 mr-3" />
                              {t("nav.admin")}
                            </Link>
                          )}
                          
                          <Link
                            href="/profile/settings"
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setShowUserMenu(false)}
                            prefetch={true}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            {t("nav.settings")}
                          </Link>
                          
                          <div className="border-t border-border my-2"></div>
                          
                          {/* Theme Toggle in dropdown */}
                          <div className="px-4 py-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{t("common.theme")}</span>
                              <ThemeToggle />
                            </div>
                          </div>
                          
                          {/* Language Switcher in dropdown */}
                          <div className="px-4 py-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{t("common.language")}</span>
                              <LanguageSwitcher />
                            </div>
                          </div>
                          
                          <div className="border-t border-border my-2"></div>
                          
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            {t("nav.logout")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  prefetch={true}
                >
                  {t("nav.login")}
                </Link>
              )}
            </nav>

            {/* Theme Toggle and Language Switcher - only show if not logged in */}
            {!user && (
              <>
                <ThemeToggle />
                <LanguageSwitcher />
              </>
            )}

            {/* Mobile Menu */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar - Only Categories with Collapsible Top Level */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/70"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Sidebar */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-0 left-0 h-screen w-[90vw] max-w-[90vw] bg-background border-r border-border z-[101] flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h2 className="text-lg font-semibold">
                {currentView === 'subcategories' && selectedSubgroup 
                  ? (locale === 'fr' ? selectedSubgroup.name_fr : selectedSubgroup.name_en)
                  : t("admin.categories")}
              </h2>
              <button 
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Sidebar Content - Only Categories */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Sell Button - Always visible */}
              <Link
                href="/sell/new"
                className="block w-full bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors text-center mb-4"
                prefetch={true}
                onClick={closeMobileMenu}
              >
                {t("nav.sell")}
              </Link>
              
              {/* Back Button - Only visible when in subcategories view */}
              {currentView === 'subcategories' && (
                <button 
                  onClick={goBackToMain}
                  className="flex items-center text-primary hover:text-primary/80 transition-colors w-full mb-4 py-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("common.back")}
                </button>
              )}
              
              {/* Category Navigation */}
              <div className="space-y-2">
                {currentView === 'main' ? (
                  // Main categories view with collapsible categories
                  categories.map((category) => (
                    <div key={category.id} className="border-b border-border pb-2">
                      {category.children && category.children.length > 0 ? (
                        // Category with children - collapsible
                        <div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary transition-colors"
                            >
                              <span>{locale === 'fr' ? category.name_fr : category.name_en}</span>
                              {expandedCategories.has(category.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            {/* Search icon for category */}
                            <Link 
                              href={`/search?category=${category.id}`}
                              className="p-2 text-foreground hover:text-primary transition-colors"
                              onClick={closeMobileMenu}
                            >
                              <Search className="h-4 w-4" />
                            </Link>
                          </div>
                          
                          {/* Subgroups - shown when expanded */}
                          {expandedCategories.has(category.id) && (
                            <div className="ml-4 mt-2 space-y-2">
                              {(category as CategoryWithChildren).children!.map((subgroup) => (
                                <div key={subgroup.id} className="border-b border-border pb-2 last:border-b-0">
                                  {(subgroup as CategoryWithChildren).children && (subgroup as CategoryWithChildren).children!.length > 0 ? (
                                    // Subgroup with children - clickable to show subcategories
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={() => showSubcategories(subgroup)}
                                        className="flex items-center justify-between w-full py-2 text-foreground hover:text-primary transition-colors text-sm"
                                      >
                                        <span>{locale === 'fr' ? subgroup.name_fr : subgroup.name_en}</span>
                                        <ChevronRight className="h-4 w-4" />
                                      </button>
                                      {/* Search icon for subgroup */}
                                      <Link 
                                        href={`/search?category=${subgroup.id}`}
                                        className="p-2 text-foreground hover:text-primary transition-colors"
                                        onClick={closeMobileMenu}
                                      >
                                        <Search className="h-4 w-4" />
                                      </Link>
                                    </div>
                                  ) : (
                                    // Leaf subgroup (no children) - direct link
                                    <Link
                                      href={`/search?category=${subgroup.id}`}
                                      className="block py-2 text-foreground hover:text-primary transition-colors text-sm"
                                      prefetch={true}
                                      onClick={closeMobileMenu}
                                    >
                                      {locale === 'fr' ? subgroup.name_fr : subgroup.name_en}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Leaf category (no children) - direct link
                        <Link
                          href={`/search?category=${category.id}`}
                          className="block py-3 text-foreground hover:text-primary transition-colors"
                          prefetch={true}
                          onClick={closeMobileMenu}
                        >
                          {locale === 'fr' ? category.name_fr : category.name_en}
                        </Link>
                      )}
                    </div>
                  ))
                ) : (
                  // Subcategories view
                  selectedSubgroup && (selectedSubgroup as CategoryWithChildren).children && (
                    (selectedSubgroup as CategoryWithChildren).children!.map((subcategory) => (
                      <div key={subcategory.id} className="border-b border-border pb-2">
                        <Link
                          href={`/search?category=${subcategory.id}`}
                          className="block py-3 text-foreground hover:text-primary transition-colors"
                          prefetch={true}
                          onClick={closeMobileMenu}
                        >
                          {locale === 'fr' ? subcategory.name_fr : subcategory.name_en}
                        </Link>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}