"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UserGrowthData {
  date: string;
  users: number;
}

interface ListingsPerCategoryData {
  name: string;
  listings: number;
}

interface RecentActivity {
  type: string;
  name: string;
  user: string;
  date: string;
}

interface BoostedStats {
  totalBoosted: number;
  activeBoosted: number;
  topTier: number;
  premiumTier: number;
  featuredTier: number;
  totalEarnings: number;
}

interface LocationStats {
  totalLocations: number;
  regions: number;
  cities: number;
  quarters: number;
}

interface EarningsData {
  date: string;
  earnings: number;
}

export function OverviewSection() {
  const supabase = useSupabaseClient();
  const { t, formatCurrency } = useI18n();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pausedListings: 0,
  });
  
  const [boostedStats, setBoostedStats] = useState<BoostedStats>({
    totalBoosted: 0,
    activeBoosted: 0,
    topTier: 0,
    premiumTier: 0,
    featuredTier: 0,
    totalEarnings: 0,
  });
  
  const [locationStats, setLocationStats] = useState<LocationStats>({
    totalLocations: 0,
    regions: 0,
    cities: 0,
    quarters: 0,
  });
  
  const [categoryStats, setCategoryStats] = useState({
    totalCategories: 0,
  });
  
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [listingsPerCategoryData, setListingsPerCategoryData] = useState<ListingsPerCategoryData[]>([]);
  const [boostedTierData, setBoostedTierData] = useState<{name: string, value: number}[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch basic stats
      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: totalListings } = await supabase.from("listings").select("*", { count: "exact", head: true });
      const { count: activeListings } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "published");
      const { count: pausedListings } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "paused");
      
      setStats({
        totalUsers: totalUsers || 0,
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        pausedListings: pausedListings || 0,
      });

      // Fetch boosted stats with earnings
      const { count: totalBoosted } = await supabase.from("boosts").select("*", { count: "exact", head: true });
      const { count: activeBoosted } = await supabase.from("boosts").select("*", { count: "exact", head: true }).eq("is_active", true);
      const { count: topTier } = await supabase.from("boosts").select("*", { count: "exact", head: true }).eq("tier", "top");
      const { count: premiumTier } = await supabase.from("boosts").select("*", { count: "exact", head: true }).eq("tier", "premium");
      const { count: featuredTier } = await supabase.from("boosts").select("*", { count: "exact", head: true }).eq("tier", "featured");
      
      // Calculate total earnings from boosts
      const { data: boostsWithPrices, error: boostError } = await supabase
        .from("boosts")
        .select("price_xaf");
      
      let totalEarnings = 0;
      if (!boostError && boostsWithPrices) {
        totalEarnings = boostsWithPrices.reduce((sum, boost) => sum + (boost.price_xaf || 0), 0);
      }
      
      setBoostedStats({
        totalBoosted: totalBoosted || 0,
        activeBoosted: activeBoosted || 0,
        topTier: topTier || 0,
        premiumTier: premiumTier || 0,
        featuredTier: featuredTier || 0,
        totalEarnings: totalEarnings,
      });
      
      // Prepare boosted tier data for pie chart
      setBoostedTierData([
        { name: t("boost.top"), value: topTier || 0 },
        { name: t("boost.premium"), value: premiumTier || 0 },
        { name: t("boost.featured"), value: featuredTier || 0 },
      ]);
      
      // Prepare earnings data for chart (group by month)
      if (!boostError && boostsWithPrices) {
        // We need to get the boost creation dates to group by month
        const { data: boostsData, error: boostsDataError } = await supabase
          .from("boosts")
          .select("price_xaf, created_at");
        
        if (!boostsDataError && boostsData) {
          // Group by month for chart
          const groupedData: Record<string, number> = boostsData.reduce((acc: Record<string, number>, boost) => {
            if (boost.created_at) {
              const date = new Date(boost.created_at);
              const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
              acc[monthYear] = (acc[monthYear] || 0) + (boost.price_xaf || 0);
            }
            return acc;
          }, {});
          
          const chartData: EarningsData[] = Object.entries(groupedData).map(([date, earnings]) => ({
            date,
            earnings,
          }));
          
          setEarningsData(chartData);
        }
      }

      // Fetch location stats
      const { count: totalLocations } = await supabase.from("locations").select("*", { count: "exact", head: true });
      const { count: regions } = await supabase.from("locations").select("*", { count: "exact", head: true }).is("parent_id", null);
      
      // For cities and quarters, we need to query differently
      const { data: allLocations } = await supabase.from("locations").select("id, parent_id");
      
      let cities = 0;
      let quarters = 0;
      
      if (allLocations) {
        cities = allLocations.filter(loc => loc.parent_id !== null && 
          allLocations.some(parent => parent.id === loc.parent_id && parent.parent_id === null)).length;
        quarters = allLocations.filter(loc => loc.parent_id !== null && 
          allLocations.some(parent => parent.id === loc.parent_id && parent.parent_id !== null)).length;
      }
      
      setLocationStats({
        totalLocations: totalLocations || 0,
        regions: regions || 0,
        cities: cities,
        quarters: quarters,
      });

      // Fetch category stats
      const { count: totalCategories } = await supabase.from("categories").select("*", { count: "exact", head: true });
      
      setCategoryStats({
        totalCategories: totalCategories || 0,
      });

      // Fetch user growth data (simplified)
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });
      
      if (!userError && userData) {
        // Group by month for chart
        const groupedData: Record<string, number> = userData.reduce((acc: Record<string, number>, user) => {
          const date = new Date(user.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {});
        
        const chartData: UserGrowthData[] = Object.entries(groupedData).map(([date, users]) => ({
          date,
          users,
        }));
        
        setUserGrowthData(chartData);
      }

      // Fetch listings per category data
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name_en, name_fr");
      
      if (!categoryError && categoryData) {
        // Get listing counts per category
        const categoryCounts = await Promise.all(
          categoryData.map(async (category) => {
            const { count } = await supabase
              .from("listings")
              .select("*", { count: "exact", head: true })
              .eq("category_id", category.id);
            
            return {
              name: category.name_en,
              listings: count || 0,
            };
          })
        );
        
        setListingsPerCategoryData(categoryCounts);
      }

      // Mock recent activity data
      setRecentActivity([
        { type: "User", name: "John Doe", user: "john@example.com", date: "2023-05-15" },
        { type: "Listing", name: "iPhone 12 Pro", user: "jane@example.com", date: "2023-05-14" },
        { type: "Category", name: "Electronics", user: "admin", date: "2023-05-13" },
        { type: "User", name: "Alice Smith", user: "alice@example.com", date: "2023-05-12" },
        { type: "Listing", name: "Web Development Services", user: "bob@example.com", date: "2023-05-11" },
      ]);
    };

    fetchData();
  }, [supabase, t]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.overview")}</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.totalUsers")}</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.totalListings")}</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalListings}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.activeListings")}</h3>
          <p className="text-3xl font-bold text-primary">{stats.activeListings}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.pausedListings")}</h3>
          <p className="text-3xl font-bold text-primary">{stats.pausedListings}</p>
        </div>
      </div>
      
      {/* Boosted Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.totalBoosted")}</h3>
          <p className="text-3xl font-bold text-primary">{boostedStats.totalBoosted}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.activeBoosted")}</h3>
          <p className="text-3xl font-bold text-primary">{boostedStats.activeBoosted}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.totalEarnings")}</h3>
          <p className="text-3xl font-bold text-primary">{formatCurrency(boostedStats.totalEarnings)}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{t("admin.totalCategories")}</h3>
          <p className="text-3xl font-bold text-primary">{categoryStats.totalCategories}</p>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">{t("admin.userGrowth")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Listings per Category Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">{t("admin.listingsPerCategory")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listingsPerCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="listings" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Earnings Over Time Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">{t("admin.earningsOverTime")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#ffc658" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Boosted Listings by Tier Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">{t("admin.boostedByTier")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={boostedTierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {boostedTierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, t("common.count")]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.recentActivity")}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.type")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.nameTitle")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.user")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-foreground">{activity.type}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{activity.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{activity.user}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}