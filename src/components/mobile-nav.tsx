"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, LayoutDashboard, Settings, LogIn, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { useUser } from "@supabase/auth-helpers-react";

export function MobileNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const user = useUser();

  // Define nav items based on user authentication status
  const getNavItems = () => {
    if (user) {
      // User is logged in - show dashboard and settings
      return [
        {
          href: "/",
          icon: Home,
          label: t("nav.home"),
          isActive: pathname === "/",
        },
        {
          href: "/search",
          icon: Search,
          label: t("nav.search"),
          isActive: pathname?.startsWith("/search") || false,
        },
        {
          href: "/sell/new",
          icon: Plus,
          label: t("nav.sell"),
          isActive: pathname?.startsWith("/sell") || false,
        },
        {
          href: "/dashboard",
          icon: LayoutDashboard,
          label: t("nav.dashboard"),
          isActive: pathname?.startsWith("/dashboard") || false,
        },
        {
          href: "/profile/settings",
          icon: Settings,
          label: t("nav.settings"),
          isActive: pathname?.startsWith("/profile/settings") || false,
        },
      ];
    } else {
      // User is not logged in - show login and signup
      return [
        {
          href: "/",
          icon: Home,
          label: t("nav.home"),
          isActive: pathname === "/",
        },
        {
          href: "/search",
          icon: Search,
          label: t("nav.search"),
          isActive: pathname?.startsWith("/search") || false,
        },
        {
          href: "/sell/new",
          icon: Plus,
          label: t("nav.sell"),
          isActive: pathname?.startsWith("/sell") || false,
        },
        {
          href: "/login",
          icon: LogIn,
          label: t("nav.login"),
          isActive: pathname?.startsWith("/login") || false,
        },
        {
          href: "/signup",
          icon: UserPlus,
          label: t("nav.signup"),
          isActive: pathname?.startsWith("/signup") || false,
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border ${className}`}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                item.isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              prefetch={true}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}