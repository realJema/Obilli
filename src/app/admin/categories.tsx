"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ConfirmationModal } from "@/app/admin/confirmation-modal";
import { useI18n } from "@/lib/providers";

interface Category {
  id: number;
  name_en: string;
  name_fr: string;
  parent_id: number | null;
  listing_type: string;
  listings_count: number;
  children?: Category[];
}

interface SupabaseCategory {
  id: number;
  name_en: string;
  name_fr: string;
  parent_id: number | null;
  listing_type: string;
}

interface ProfileCount {
  count: number | null;
}

// Extended interface for flattened categories with level information
interface FlattenedCategory extends Category {
  level: number;
}

export function CategoriesSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name_en: "",
    name_fr: "",
    listing_type: "good",
    parent_id: null as number | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const categoriesPerPage = 10;
  const [collapsedStates, setCollapsedStates] = useState<Record<number, boolean>>({});
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // Function to count listings in a category and all its descendants
  const countListingsInCategory = async (categoryId: number): Promise<number> => {
    // Get all descendant category IDs (including the category itself)
    const getAllDescendantIds = async (catId: number): Promise<number[]> => {
      const allIds = [catId]; // Include the original category
      
      // Get immediate children
      const { data: children, error } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", catId);
      
      if (error) {
        console.warn(`Failed to fetch subcategories for ${catId}:`, error.message);
        return allIds;
      }
      
      if (children && children.length > 0) {
        // For each child, recursively get their descendants
        for (const child of children) {
          const descendantIds = await getAllDescendantIds(child.id);
          allIds.push(...descendantIds);
        }
      }
      
      return allIds;
    };

    const categoryIds = await getAllDescendantIds(categoryId);
    
    // Count listings in all these categories
    const { count, error } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .in("category_id", categoryIds);
    
    if (error) {
      console.error("Error counting listings:", error);
      return 0;
    }
    
    return count || 0;
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all categories (we'll handle pagination in the UI)
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id, 
          name_en, 
          name_fr, 
          parent_id, 
          listing_type
        `)
        .order("name_en", { ascending: true });
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      // Build hierarchical structure with listing counts
      const categoryMap = new Map<number, Category>();
      const rootCategories: Category[] = [];
      
      // First pass: create all category objects with listing counts
      const categoriesWithCounts = await Promise.all(
        data.map(async (category: SupabaseCategory) => {
          const listings_count = await countListingsInCategory(category.id);
          
          return {
            ...category,
            listings_count,
            children: []
          };
        })
      );
      
      // Populate the map
      categoriesWithCounts.forEach(category => {
        categoryMap.set(category.id, category);
      });
      
      // Second pass: build the tree structure
      categoriesWithCounts.forEach(category => {
        if (category.parent_id === null) {
          // This is a root category
          rootCategories.push(category);
        } else {
          // This is a child category
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(category);
          }
        }
      });
      
      setCategories(rootCategories);
      setTotalCategories(rootCategories.length);
      
      // Initialize all categories as collapsed by default
      const initialCollapsedStates: Record<number, boolean> = {};
      const initializeCollapsedStates = (categories: Category[]) => {
        categories.forEach(category => {
          initialCollapsedStates[category.id] = true; // Collapsed by default
          if (category.children && category.children.length > 0) {
            initializeCollapsedStates(category.children);
          }
        });
      };
      initializeCollapsedStates(rootCategories);
      setCollapsedStates(initialCollapsedStates);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, currentPage]);

  const toggleCollapse = (categoryId: number) => {
    setCollapsedStates(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_fr: category.name_fr,
      listing_type: category.listing_type,
      parent_id: category.parent_id,
    });
    setShowAddForm(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name_en: "",
      name_fr: "",
      listing_type: "good",
      parent_id: null,
    });
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            name_en: formData.name_en,
            name_fr: formData.name_fr,
            listing_type: formData.listing_type,
            parent_id: formData.parent_id,
          })
          .eq("id", editingCategory.id);

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

      fetchCategories(); // Refresh the list
      handleCloseForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category. Please try again.");
    }
  };

  const deleteCategory = async (categoryId: number) => {
    // Set up confirmation modal
    setConfirmTitle("Delete Category");
    setConfirmMessage("Are you sure you want to delete this category? All listings in this category will be affected.");
    setConfirmAction(() => async () => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);
      
      if (!error) {
        fetchCategories(); // Refresh the list
      }
    });
    setShowConfirmModal(true);
  };

  // Helper function to flatten categories with level information
  const flattenCategories = (categories: Category[], level: number = 0): FlattenedCategory[] => {
    return categories.flatMap(category => {
      const flattenedCategory: FlattenedCategory = {
        ...category,
        level
      };
      
      const result: FlattenedCategory[] = [flattenedCategory];
      
      if (category.children) {
        result.push(...flattenCategories(category.children, level + 1));
      }
      
      return result;
    });
  };

  // Recursive function to render categories with hierarchy
  const renderCategory = (category: Category, level: number = 0) => {
    const isCollapsed = collapsedStates[category.id] ?? true;
    
    return (
      <div key={category.id} className="mb-2">
        <div className="flex items-center justify-between p-2 hover:bg-accent rounded">
          <div className="flex items-center">
            <div style={{ width: `${level * 20}px` }}></div>
            <button 
              className="mr-2 text-muted-foreground hover:text-foreground"
              onClick={() => toggleCollapse(category.id)}
            >
              {category.children && category.children.length > 0 ? (
                isCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )
              ) : (
                <span className="inline-block w-4"></span>
              )}
            </button>
            <span className="font-medium">{category.name_en}</span>
            <span className="text-muted-foreground ml-2">({category.name_fr || "-"})</span>
            
            {/* Display listing counts with enhanced visibility */}
            <span className="ml-2 px-2 py-1 text-sm font-bold bg-blue-500 text-white rounded-full">
              {category.listings_count}
            </span>
            
            {/* Show category type for clarity */}
            {category.parent_id === null && (
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                Category
              </span>
            )}
            {category.parent_id !== null && category.children?.length && (
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                Subgroup
              </span>
            )}
            {category.parent_id !== null && !category.children?.length && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                Subcategory
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center"
              onClick={() => handleEditCategory(category)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center"
              onClick={() => deleteCategory(category.id)}
              disabled={category.listings_count > 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        
        {category.children && category.children.length > 0 && !isCollapsed && (
          <div className="ml-4 border-l-2 border-border pl-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Apply pagination to root categories only
  const paginatedCategories = categories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.categoriesManagement")}</h2>
      
      {/* Add/Edit Category Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? t("admin.editCategory") : t("admin.addNewCategory")}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.englishName")} *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.frenchName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.name_fr}
                  onChange={(e) => setFormData({...formData, name_fr: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.listingType")}</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.listing_type}
                  onChange={(e) => setFormData({...formData, listing_type: e.target.value})}
                >
                  <option value="good">{t("admin.good")}</option>
                  <option value="service">{t("admin.service")}</option>
                  <option value="job">{t("admin.job")}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.parentCategory")}</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.parent_id || ""}
                  onChange={(e) => setFormData({...formData, parent_id: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">{t("admin.noneTopLevelCategory")}</option>
                  {flattenCategories(categories)
                    .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.level > 0 ? '—'.repeat(category.level) + ' ' : ''}
                        {category.name_en}
                        {category.parent_id === null && ` (${t("admin.category")})`}
                        {category.parent_id !== null && category.children?.length && ` (${t("admin.subgroup")})`}
                        {category.parent_id !== null && !category.children?.length && ` (${t("admin.subcategory")})`}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 border border-input rounded-md hover:bg-accent"
                onClick={handleCloseForm}
              >
                {t("admin.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {t("admin.saveCategory")}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Add Category Button */}
      <div className="mb-6">
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
          onClick={handleAddCategory}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t("admin.addNewCategory")}
        </button>
      </div>
      
      {/* Categories Hierarchy */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.categoriesHierarchy")}</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("admin.noCategoriesFound")}
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {paginatedCategories.map(category => renderCategory(category))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {t("admin.showing")} {(currentPage - 1) * categoriesPerPage + 1} {t("admin.to")} {Math.min(currentPage * categoriesPerPage, categories.length)} {t("admin.of")} {categories.length} {t("admin.categories")}
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