"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { ConfirmationModal } from "@/app/admin/confirmation-modal";
import { useI18n } from "@/lib/providers";

interface Listing {
  id: string;
  title: string;
  owner: string;
  owner_id: string;
  category: string;
  status: string;
  created_at: string;
}

export function ListingsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const listingsPerPage = 10;
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchListings();
  }, [currentPage]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name_en");
    
    if (!error && data) {
      setCategories(data.map(cat => ({ id: cat.id, name: cat.name_en })));
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name");
    
    if (!error && data) {
      setUsers(data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || "Unknown User"
      })));
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Fetch listings with owner and category info
      let query = supabase
        .from("listings")
        .select(`
          id, 
          title, 
          owner_id, 
          category_id, 
          status, 
          created_at,
          profiles(username, full_name),
          categories(name_en)
        `, { count: "exact" });
      
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }
      
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      
      if (filterCategory !== "all") {
        query = query.eq("category_id", filterCategory);
      }
      
      if (filterUser !== "all") {
        query = query.eq("owner_id", filterUser);
      }
      
      // Add pagination
      const from = (currentPage - 1) * listingsPerPage;
      const to = from + listingsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching listings:", error);
        return;
      }
      
      // Map the data to our Listing interface
      const mappedListings: Listing[] = data.map((listing: any) => ({
        id: listing.id,
        title: listing.title,
        owner: listing.profiles?.full_name || listing.profiles?.username || "Unknown User",
        owner_id: listing.owner_id,
        category: listing.categories?.name_en || "Unknown Category",
        status: listing.status,
        created_at: listing.created_at,
      }));
      
      setListings(mappedListings);
      setTotalListings(count || 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (listingId: string, newStatus: string) => {
    // Set up confirmation modal
    const action = newStatus === "paused" ? "pause" : "publish";
    setConfirmTitle(`${action.charAt(0).toUpperCase() + action.slice(1)} Listing`);
    setConfirmMessage(`Are you sure you want to ${action} this listing?`);
    setConfirmAction(() => async () => {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", listingId);
      
      if (!error) {
        // Update local state
        setListings(listings.map(listing => 
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        ));
      }
    });
    setShowConfirmModal(true);
  };

  const deleteListing = async (listingId: string) => {
    // Set up confirmation modal
    setConfirmTitle("Delete Listing");
    setConfirmMessage("Are you sure you want to delete this listing? This action cannot be undone.");
    setConfirmAction(() => async () => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);
      
      if (!error) {
        // Update local state
        setListings(listings.filter(listing => listing.id !== listingId));
        setTotalListings(totalListings - 1);
      }
    });
    setShowConfirmModal(true);
  };

  const handleUserSearch = (searchValue: string) => {
    setFilterUser(searchValue);
    // In a real implementation, you might want to filter the users list in real-time
    // For now, we'll just update the filter value
  };

  const totalPages = Math.ceil(totalListings / listingsPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.listingsManagement")}</h2>
      
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.search")}</label>
            <input
              type="text"
              placeholder={t("admin.searchByTitle")}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.status")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t("admin.allStatuses")}</option>
              <option value="draft">{t("admin.draft")}</option>
              <option value="pending">{t("admin.pending")}</option>
              <option value="published">{t("admin.published")}</option>
              <option value="paused">{t("admin.paused")}</option>
              <option value="expired">{t("admin.expired")}</option>
              <option value="removed">{t("admin.removed")}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.category")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">{t("admin.allCategories")}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.user")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="all">{t("admin.allUsers")}</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 w-full flex items-center justify-center"
              onClick={() => {
                setCurrentPage(1);
                fetchListings();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              {t("admin.applyFilters")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Listings Table */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.listings")}</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.title")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.owner")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.category")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.status")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.created")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <Link href={`/listing/${listing.id}`} target="_blank" className="text-primary hover:underline">
                        {listing.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <Link href={`/profile/${listing.owner_id}`} target="_blank" className="text-primary hover:underline">
                        {listing.owner}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{listing.category}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        listing.status === "published" 
                          ? "bg-green-100 text-green-800"
                          : listing.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : listing.status === "paused"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {t(`admin.status_${listing.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div className="flex flex-wrap gap-2">
                        {listing.status === "published" && (
                          <button
                            className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center"
                            onClick={() => updateListingStatus(listing.id, "paused")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {t("admin.pause")}
                          </button>
                        )}
                        {listing.status === "paused" && (
                          <button
                            className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200 flex items-center"
                            onClick={() => updateListingStatus(listing.id, "published")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {t("admin.publish")}
                          </button>
                        )}
                        <button
                          className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {t("admin.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {t("admin.showing")} {(currentPage - 1) * listingsPerPage + 1} {t("admin.to")} {Math.min(currentPage * listingsPerPage, totalListings)} {t("admin.of")} {totalListings} {t("admin.listings")}
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t("admin.previous")}
              </button>
              <span className="px-3 py-1 rounded-md bg-primary text-primary-foreground">
                {currentPage}
              </span>
              <button
                className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {t("admin.next")}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}