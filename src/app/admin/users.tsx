"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";
import { ConfirmationModal } from "@/app/admin/confirmation-modal";

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  status: string;
  listings_count: number;
}

interface UserListing {
  id: string;
  title: string;
  category: string;
  status: string;
}

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
}

interface Listing {
  id: string;
  title: string;
  category_id: number;
  status: string;
}

interface Category {
  id: number;
  name_en: string;
}

export function UsersSection() {
  const supabase = useSupabaseClient();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("profiles").select("*");
      
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }
      
      if (filterRole !== "all") {
        query = query.eq("role", filterRole);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }
      
      // Get listing counts for each user
      const usersWithCounts = await Promise.all(
        data.map(async (user: Profile) => {
          const { count } = await supabase
            .from("listings")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user.id);
          
          return {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role || "user",
            created_at: user.created_at,
            status: "active", // For now, all users are considered active
            listings_count: count || 0,
          };
        })
      );
      
      setUsers(usersWithCounts);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, searchTerm, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    
    // Fetch listings for this user
    const { data: listings, error } = await supabase
      .from("listings")
      .select("id, title, category_id, status")
      .eq("owner_id", user.id);
    
    if (!error && listings) {
      // Get category names
      const categoryIds = [...new Set(listings.map(l => l.category_id))];
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name_en")
        .in("id", categoryIds);
      
      const categoryMap = categories?.reduce((acc, cat) => {
        acc[cat.id] = cat.name_en;
        return acc;
      }, {} as Record<number, string>) || {};
      
      const mappedListings: UserListing[] = listings.map((listing: Listing) => ({
        id: listing.id,
        title: listing.title,
        category: categoryMap[listing.category_id] || "Unknown",
        status: listing.status,
      }));
      
      setUserListings(mappedListings);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    // Set up confirmation modal
    const action = currentRole === "admin" ? "demote" : "promote";
    setConfirmTitle(`${action.charAt(0).toUpperCase() + action.slice(1)} User`);
    setConfirmMessage(`Are you sure you want to ${action} this user?`);
    setConfirmAction(() => async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);
      
      if (!error) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    });
    setShowConfirmModal(true);
  };

  const suspendUser = async (userId: string) => {
    // Set up confirmation modal
    setConfirmTitle("Suspend User");
    setConfirmMessage("Are you sure you want to suspend this user? This will prevent them from accessing their account.");
    setConfirmAction(() => async () => {
      // For now, we'll just show an alert since we don't have a specific suspension mechanism
      alert("User suspension functionality would be implemented here.");
      
      // In a real implementation, you might:
      // 1. Update the user's status in the database
      // 2. Revoke their auth tokens
      // 3. Prevent them from logging in
    });
    setShowConfirmModal(true);
  };

  const filteredUsers = users.filter(user => {
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.usersManagement")}</h2>
      
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("common.search")}</label>
            <input
              type="text"
              placeholder={t("admin.searchUsers")}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.role")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">{t("admin.allRoles")}</option>
              <option value="admin">{t("admin.admin")}</option>
              <option value="user">{t("admin.user")}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.status")}</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t("admin.allStatuses")}</option>
              <option value="active">{t("admin.active")}</option>
              <option value="suspended">{t("admin.suspended")}</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.email")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.role")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.status")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.createdAt")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.listings")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{user.full_name || user.username || "N/A"}</div>
                    {user.username && (
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {user.listings_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {t("common.view")}
                    </button>
                    <button
                      onClick={() => toggleUserRole(user.id, user.role)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {user.role === "admin" ? t("admin.demote") : t("admin.promote")}
                    </button>
                    <button
                      onClick={() => suspendUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t("admin.suspend")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t("admin.userDetails")}</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">{t("admin.basicInfo")}</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.name")}:</span>
                      <span className="ml-2">{selectedUser.full_name || selectedUser.username || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.username")}:</span>
                      <span className="ml-2">{selectedUser.username || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.email")}:</span>
                      <span className="ml-2">{selectedUser.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.role")}:</span>
                      <span className="ml-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedUser.role === "admin" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {selectedUser.role}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.status")}:</span>
                      <span className="ml-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {selectedUser.status}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t("admin.createdAt")}:</span>
                      <span className="ml-2">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t("admin.listings")} ({userListings.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userListings.length > 0 ? (
                      userListings.map((listing) => (
                        <div key={listing.id} className="border border-border rounded p-2">
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-muted-foreground">{listing.category}</div>
                          <div className="text-sm">
                            <span className={`px-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              listing.status === "published" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">{t("admin.noListings")}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => toggleUserRole(selectedUser.id, selectedUser.role)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {selectedUser.role === "admin" ? t("admin.demoteUser") : t("admin.promoteUser")}
                </button>
                <button
                  onClick={() => suspendUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t("admin.suspendUser")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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