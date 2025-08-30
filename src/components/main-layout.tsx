"use client";

import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

interface MainLayoutProps {
  children: React.ReactNode;
  showMobileNav?: boolean;
  showCategoryNav?: boolean;
}

export function MainLayout({ 
  children, 
  showMobileNav = true, 
  showCategoryNav = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-visible">
      <Header />
      {showCategoryNav && <CategoryNav />}
      <main className={`flex-1 ${showMobileNav ? 'pb-16 md:pb-0' : ''} relative`}>
        {children}
      </main>
      <Footer />
      {showMobileNav && <MobileNav />}
    </div>
  );
}
