"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";

interface BoostedListing {
  id: string;
  title: string;
  owner: {
    username: string | null;
    full_name: string | null;
  };
  category: {
    name_en: string;
  };
  tier: string;
  price_xaf: number;
  payment_status: string;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export function BoostedListingsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [boosted, setBoosted] = useState<BoostedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBoosted();
  }, [filterTier, filterStatus]);

  const fetchBoosted = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("boosts")
        .select(`
          id,
          tier,
          price_xaf,
          payment_status,
          is_active,
          starts_at,
          expires_at,
          created_at,
          listing:listings(
            id,
            title,
            owner:profiles(
              username,
              full_name
            ),
            category:categories(
              name_en
            )
          )
        `)
        .order("created_at", { ascending: false });
      
      if (filterTier !== "all") {
        query = query.eq("tier", filterTier);
      }
      
      if (filterStatus !== "all") {
        query = query.eq("payment_status", filterStatus);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching boosted listings:", error);
        return;
      }
      
      // Transform the data to flatten the nested structure
      const transformedData = data.map((item: any) => ({
        id: item.id,
        title: item.listing?.title || "Unknown Listing",
        owner: item.listing?.owner || { username: null, full_name: null },
        category: item.listing?.category || { name_en: "Unknown" },
        tier: item.tier,
        price_xaf: item.price_xaf,
        payment_status: item.payment_status,
        is_active: item.is_active,
        starts_at: item.starts_at,
        expires_at: item.expires_at,
        created_at: item.created_at,
      }));
      
      setBoosted(transformedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "top":
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Top</span>;
      case "premium":
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Premium</span>;
      case "featured":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Featured</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>;
      case "pending":
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
      case "failed":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Failed</span>;
      case "refunded":
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Refunded</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Inactive</span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.boostedListings")}</h2>
      
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.boostTier")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            >
              <option value="all">{t("admin.allTiers")}</option>
              <option value="top">{t("admin.top")}</option>
              <option value="premium">{t("admin.premium")}</option>
              <option value="featured">{t("admin.featured")}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.paymentStatus")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t("admin.allStatuses")}</option>
              <option value="paid">{t("admin.paid")}</option>
              <option value="pending">{t("admin.pending")}</option>
              <option value="failed">{t("admin.failed")}</option>
              <option value="refunded">{t("admin.refunded")}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
            onClick={fetchBoosted}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {t("admin.applyFilters")}
          </button>
        </div>
      </div>
      
      {/* Boosted Listings Table */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.boostedListings")}</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.listing")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.owner")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.category")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.tier")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.priceXAF")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.paymentStatus")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.active")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.dates")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {boosted.map((boost) => (
                  <tr key={boost.id}>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div className="font-medium">{boost.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {boost.owner.full_name || boost.owner.username || t("admin.unknownUser")}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {boost.category.name_en}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {getTierBadge(boost.tier)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {boost.price_xaf?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {getStatusBadge(boost.payment_status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {getActiveBadge(boost.is_active)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div>{t("admin.created")}: {new Date(boost.created_at).toLocaleDateString()}</div>
                      <div>{t("admin.starts")}: {new Date(boost.starts_at).toLocaleDateString()}</div>
                      <div>{t("admin.expires")}: {new Date(boost.expires_at).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}