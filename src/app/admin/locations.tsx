"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";
import { ConfirmationModal } from "@/app/admin/confirmation-modal";

interface Location {
  id: number;
  location_en: string;
  location_fr: string;
  parent_id: number | null;
  created_at: string | null;
  children?: Location[];
}

export function LocationsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    location_en: "",
    location_fr: "",
    parent_id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedStates, setCollapsedStates] = useState<Record<number, boolean>>({});
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("location_en", { ascending: true });
      
      if (error) {
        console.error("Error fetching locations:", error);
        return;
      }
      
      // Build hierarchical structure
      const locationMap = new Map<number, Location>();
      const rootLocations: Location[] = [];
      
      // First pass: create all location objects
      data.forEach(location => {
        locationMap.set(location.id, {
          ...location,
          children: []
        });
      });
      
      // Second pass: build the tree structure
      data.forEach(location => {
        const locationObj = locationMap.get(location.id)!;
        
        if (location.parent_id === null) {
          // This is a root location (region)
          rootLocations.push(locationObj);
        } else {
          // This is a child location (city or quarter)
          const parent = locationMap.get(location.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(locationObj);
          }
        }
      });
      
      setLocations(rootLocations);
      
      // Initialize all locations as collapsed by default
      const initialCollapsedStates: Record<number, boolean> = {};
      const initializeCollapsedStates = (locations: Location[]) => {
        locations.forEach(location => {
          initialCollapsedStates[location.id] = true; // Collapsed by default
          if (location.children && location.children.length > 0) {
            initializeCollapsedStates(location.children);
          }
        });
      };
      initializeCollapsedStates(rootLocations);
      setCollapsedStates(initialCollapsedStates);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const toggleCollapse = (locationId: number) => {
    setCollapsedStates(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({
      location_en: "",
      location_fr: "",
      parent_id: "",
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      location_en: location.location_en,
      location_fr: location.location_fr,
      parent_id: location.parent_id?.toString() || "",
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocation) {
        // Update existing location
        const { error } = await supabase
          .from("locations")
          .update({
            location_en: formData.location_en,
            location_fr: formData.location_fr,
            parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
          })
          .eq("id", editingLocation.id);
        
        if (error) throw error;
      } else {
        // Create new location
        const { error } = await supabase
          .from("locations")
          .insert({
            location_en: formData.location_en,
            location_fr: formData.location_fr,
            parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
          });
        
        if (error) throw error;
      }
      
      // Refresh the list
      fetchLocations();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location. Please try again.");
    }
  };

  const deleteLocation = async (locationId: number) => {
    // Set up confirmation modal
    setConfirmTitle(t("admin.deleteLocation"));
    setConfirmMessage(t("admin.deleteLocationMessage"));
    setConfirmAction(() => async () => {
      try {
        const { error } = await supabase
          .from("locations")
          .delete()
          .eq("id", locationId);
        
        if (error) throw error;
        
        // Refresh the list
        fetchLocations();
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location. Please try again.");
      }
    });
    setShowConfirmModal(true);
  };

  // Recursive function to render locations with hierarchy
  const renderLocation = (location: Location, level: number = 0) => {
    const isCollapsed = collapsedStates[location.id] ?? true;
    
    return (
      <div key={location.id} className="mb-2">
        <div className="flex items-center justify-between p-2 hover:bg-accent rounded">
          <div className="flex items-center">
            <div style={{ width: `${level * 20}px` }}></div>
            <button 
              className="mr-2 text-muted-foreground hover:text-foreground"
              onClick={() => toggleCollapse(location.id)}
            >
              {location.children && location.children.length > 0 ? (
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
            <span className="font-medium">{location.location_en}</span>
            <span className="text-muted-foreground ml-2">({location.location_fr})</span>
            {location.parent_id === null && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Region</span>
            )}
            {location.parent_id !== null && !location.children?.length && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Quarter</span>
            )}
            {location.parent_id !== null && location.children?.length && (
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">City</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center"
              onClick={() => handleEditLocation(location)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center"
              onClick={() => deleteLocation(location.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        
        {location.children && location.children.length > 0 && !isCollapsed && (
          <div className="ml-4 border-l-2 border-border pl-2">
            {location.children.map(child => renderLocation(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter locations based on search term
  const filterLocations = (locations: Location[]): Location[] => {
    if (!searchTerm) return locations;
    
    return locations.filter(location => {
      const matches = location.location_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     location.location_fr.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matches) return true;
      
      // Check children recursively
      if (location.children) {
        const filteredChildren = filterLocations(location.children);
        if (filteredChildren.length > 0) {
          // Update the location with filtered children for rendering
          return true;
        }
      }
      
      return false;
    });
  };

  const filteredLocations = filterLocations(locations);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.locationsManagement")}</h2>
      
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("admin.searchLocations")}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
          onClick={handleAddLocation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t("admin.addNewLocation")}
        </button>
      </div>
      
      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("admin.addNewLocation")}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.englishName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.location_en}
                  onChange={(e) => setFormData({...formData, location_en: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.frenchName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.location_fr}
                  onChange={(e) => setFormData({...formData, location_fr: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.parentLocation")}</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                >
                  <option value="">{t("admin.noneRegion")}</option>
                  {locations.flatMap(region => [
                    <option key={region.id} value={region.id}>
                      {region.location_en} ({region.location_fr}) - {t("admin.region")}
                    </option>,
                    ...(region.children || []).map(city => (
                      <option key={city.id} value={city.id}>
                        -- {city.location_en} ({city.location_fr}) - {t("admin.city")}
                      </option>
                    ))
                  ])}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent"
                onClick={handleCloseForm}
              >
                {t("admin.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {t("admin.createLocation")}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Location Form */}
      {showEditForm && editingLocation && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("admin.editLocation")}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.englishName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.location_en}
                  onChange={(e) => setFormData({...formData, location_en: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.frenchName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.location_fr}
                  onChange={(e) => setFormData({...formData, location_fr: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.parentLocation")}</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                >
                  <option value="">{t("admin.noneRegion")}</option>
                  {locations.flatMap(region => [
                    <option key={region.id} value={region.id}>
                      {region.location_en} ({region.location_fr}) - {t("admin.region")}
                    </option>,
                    ...(region.children || []).map(city => (
                      <option key={city.id} value={city.id}>
                        -- {city.location_en} ({city.location_fr}) - {t("admin.city")}
                      </option>
                    ))
                  ])}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent"
                onClick={handleCloseForm}
              >
                {t("admin.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {t("admin.updateLocation")}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Locations Hierarchy */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.locationsHierarchy")}</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("admin.noLocationsFound")} {searchTerm && t("admin.tryDifferentSearch")}
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {filteredLocations.map(location => renderLocation(location))}
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