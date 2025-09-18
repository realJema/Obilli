"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";
import { OverviewSection } from "@/app/admin/overview";
import { UsersSection } from "@/app/admin/users";
import { ListingsSection } from "@/app/admin/listings";
import { CategoriesSection } from "@/app/admin/categories";
import { SettingsSection } from "@/app/admin/settings";
import { BoostedListingsSection } from "@/app/admin/boosted-listings";
import { LocationsSection } from "@/app/admin/locations";
import { ReportsSection } from "@/app/admin/reports";

export default function AdminPage() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const { t } = useI18n();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          router.push("/");
          return;
        }

        if (data.role !== "admin") {
          router.push("/");
          return;
        }

        setUserRole(data.role);
      } catch (err) {
        console.error("Error checking user role:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user, supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userRole || userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">{t("admin.accessDenied")}</h1>
          <p className="mt-2">{t("admin.noPermission")}</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "users":
        return <UsersSection />;
      case "listings":
        return <ListingsSection />;
      case "categories":
        return <CategoriesSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      case "boosted":
        return <BoostedListingsSection />;
      case "locations":
        return <LocationsSection />;
      default:
        return <OverviewSection />;
    }
  };

  const navigationItems = [
    { id: "overview", label: t("admin.overview"), emoji: t("admin.overviewEmoji") },
    { id: "users", label: t("admin.users"), emoji: t("admin.usersEmoji") },
    { id: "listings", label: t("admin.listings"), emoji: t("admin.listingsEmoji") },
    { id: "categories", label: t("admin.categories"), emoji: t("admin.categoriesEmoji") },
    { id: "reports", label: t("admin.reports"), emoji: t("admin.reportsEmoji") },
    { id: "boosted", label: t("admin.boosted"), emoji: t("admin.boostedEmoji") },
    { id: "locations", label: t("admin.locations"), emoji: t("admin.locationsEmoji") },
    { id: "settings", label: t("admin.settings"), emoji: t("admin.settingsEmoji") },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("admin.dashboard")}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className={`${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-1/4'} transition-all duration-300`}>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex justify-between items-center mb-4">
              {!isSidebarCollapsed && <h2 className="text-lg font-semibold">{t("admin.navigation")}</h2>}
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-md hover:bg-accent"
                aria-label={isSidebarCollapsed ? t("common.expand") : t("common.collapse")}
              >
                {isSidebarCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            
            <nav>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {isSidebarCollapsed ? (
                        <span className="flex justify-center w-full">
                          {item.emoji}
                        </span>
                      ) : (
                        <>
                          <span className="mr-2">{item.emoji}</span>
                          {item.label}
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={isSidebarCollapsed ? 'lg:w-[calc(100%-4rem)]' : 'lg:w-3/4'}>
          <div className="bg-card rounded-lg border border-border p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}