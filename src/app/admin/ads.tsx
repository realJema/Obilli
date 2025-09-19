"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ConfirmationModal } from "@/app/admin/confirmation-modal";
import { useI18n } from "@/lib/providers";
import { adsRepo } from "@/lib/repositories";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  click_count: number;
  impression_count: number;
  created_at: string;
}

export function AdsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    placement: "feed",
    is_active: true,
    starts_at: "",
    expires_at: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 10;
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching ads:", error);
        return;
      }
      
      setAds(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      placement: ad.placement,
      is_active: ad.is_active,
      starts_at: ad.starts_at ? ad.starts_at.substring(0, 16) : "",
      expires_at: ad.expires_at ? ad.expires_at.substring(0, 16) : "",
    });
    setShowAddForm(true);
  };

  const handleAddAd = () => {
    setEditingAd(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      placement: "feed",
      is_active: true,
      starts_at: "",
      expires_at: "",
    });
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingAd(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAd) {
        // Update existing ad
        const { error } = await supabase
          .from("ads")
          .update({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            link_url: formData.link_url || null,
            placement: formData.placement,
            is_active: formData.is_active,
            starts_at: formData.starts_at || null,
            expires_at: formData.expires_at || null,
          })
          .eq("id", editingAd.id);

        if (error) throw error;
      } else {
        // Create new ad
        const { error } = await supabase
          .from("ads")
          .insert([{
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url || null,
            link_url: formData.link_url || null,
            placement: formData.placement,
            is_active: formData.is_active,
            starts_at: formData.starts_at || null,
            expires_at: formData.expires_at || null,
          }]);

        if (error) throw error;
      }

      fetchAds(); // Refresh the list
      handleCloseForm();
    } catch (error) {
      console.error("Error saving ad:", error);
      alert("Error saving ad. Please try again.");
    }
  };

  const deleteAd = async (adId: string) => {
    // Set up confirmation modal
    setConfirmTitle("Delete Ad");
    setConfirmMessage("Are you sure you want to delete this ad?");
    setConfirmAction(() => async () => {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", adId);
      
      if (!error) {
        fetchAds(); // Refresh the list
      }
    });
    setShowConfirmModal(true);
  };

  // Apply pagination
  const paginatedAds = ads.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  const totalPages = Math.ceil(ads.length / adsPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ads Management</h2>
      
      {/* Add/Edit Ad Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingAd ? "Edit Ad" : "Add New Ad"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Placement</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.placement}
                  onChange={(e) => setFormData({...formData, placement: e.target.value})}
                >
                  <option value="banner">Banner (Top of page)</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="feed">Feed (Between sections)</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Expiration Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  className="mr-2"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 border border-input rounded-md hover:bg-accent"
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Save Ad
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Add Ad Button */}
      <div className="mb-6">
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
          onClick={handleAddAd}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Ad
        </button>
      </div>
      
      {/* Ads List */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">All Ads</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No ads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4">Title</th>
                  <th className="text-left py-2 px-4">Placement</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Clicks</th>
                  <th className="text-left py-2 px-4">Impressions</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAds.map((ad) => (
                  <tr key={ad.id} className="border-b border-border hover:bg-accent">
                    <td className="py-2 px-4">
                      <div className="font-medium">{ad.title}</div>
                      {ad.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {ad.description}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {ad.placement}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {ad.is_active ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">{ad.click_count}</td>
                    <td className="py-2 px-4">{ad.impression_count}</td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center"
                          onClick={() => handleEditAd(ad)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center"
                          onClick={() => deleteAd(ad.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
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
              Showing {(currentPage - 1) * adsPerPage + 1} to {Math.min(currentPage * adsPerPage, ads.length)} of {ads.length} ads
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-primary text-primary-foreground">
                {currentPage}
              </span>
              <button
                className="px-3 py-1 rounded-md border border-border disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
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