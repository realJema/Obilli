"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/providers";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
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
      isActive: pathname.startsWith("/search"),
    },
    {
      href: "/sell/new",
      icon: Plus,
      label: t("nav.sell"),
      isActive: pathname.startsWith("/sell"),
    },
    {
      href: "/inbox",
      icon: MessageCircle,
      label: t("nav.messages"),
      isActive: pathname.startsWith("/inbox"),
    },
    {
      href: "/profile",
      icon: User,
      label: t("nav.profile"),
      isActive: pathname.startsWith("/profile"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
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