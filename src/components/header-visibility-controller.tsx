"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// This component controls the visibility of CategoryNav and Header
// based on the current route
export function HeaderVisibilityController() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Routes where we want to hide the category navigation
    const hideCategoryNavRoutes = [
      '/login',
      '/register',
      '/reset-password',
      '/dashboard',
      '/sell/new',
      '/profile'
    ];
    
    // Check if the current path starts with any of the paths to hide category nav
    const shouldHideCategoryNav = hideCategoryNavRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    // Get the category nav element
    const categoryNav = document.querySelector('.category-nav') as HTMLElement;
    
    // Apply visibility
    if (categoryNav) {
      if (shouldHideCategoryNav) {
        categoryNav.style.display = 'none';
      } else {
        categoryNav.style.display = 'block';
      }
    }
  }, [pathname]);
  
  return null; // This component doesn't render anything
}