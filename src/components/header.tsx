"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/providers";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useRef } from "react";

export function Header() {
  const router = useRouter();
  const { t } = useI18n();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username?: string; full_name?: string; avatar_url?: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user, supabase]);

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    router.push('/');
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
                  src="/logo.png" 
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

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
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

            {/* Notifications and Messages removed */}

            {/* Theme Toggle and Language Switcher - only show if not logged in */}
            {!user && (
              <>
                <ThemeToggle />
                <LanguageSwitcher />
              </>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}