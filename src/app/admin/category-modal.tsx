"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface Category {
  id: number;
  name_en: string;
  name_fr: string;
  listing_type: string;
  parent_id: number | null;
}

interface CategoryModalProps {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export function CategoryModal({ category, categories, onClose, onSave }: CategoryModalProps) {
  const supabase = useSupabaseClient();
  const [formData, setFormData] = useState({
    name_en: "",
    name_fr: "",
    listing_type: "good",
    parent_id: null as number | null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name_en: category.name_en,
        name_fr: category.name_fr,
        listing_type: category.listing_type,
        parent_id: category.parent_id,
      });
    } else {
      setFormData({
        name_en: "",
        name_fr: "",
        listing_type: "good",
        parent_id: null,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            name_en: formData.name_en,
            name_fr: formData.name_fr,
            listing_type: formData.listing_type,
            parent_id: formData.parent_id,
          })
          .eq("id", category.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([{
            name_en: formData.name_en,
            name_fr: formData.name_fr,
            listing_type: formData.listing_type,
            parent_id: formData.parent_id,
          }]);

        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {category ? "Edit Category" : "Add New Category"}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">English Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={formData.name_en}
                onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">French Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={formData.name_fr}
                onChange={(e) => setFormData({...formData, name_fr: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Listing Type</label>
              <select
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={formData.listing_type}
                onChange={(e) => setFormData({...formData, listing_type: e.target.value})}
              >
                <option value="good">Good</option>
                <option value="service">Service</option>
                <option value="job">Job</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category</label>
              <select
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={formData.parent_id || ""}
                onChange={(e) => setFormData({...formData, parent_id: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">None (Top-level category)</option>
                {categories
                  .filter(cat => category ? cat.id !== category.id : true)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
          <div className="p-4 border-t border-border flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border border-input rounded-md hover:bg-accent"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}