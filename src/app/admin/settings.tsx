"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  footer_text: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export function SettingsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [settings, setSettings] = useState<SiteSettings>({
    id: "",
    site_name: "Obilli Marketplace",
    site_description: "Buy and sell goods, services, and find jobs in Cameroon",
    footer_text: "© 2023 Obilli Marketplace. All rights reserved.",
    logo_url: null,
    favicon_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch settings from database
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching settings:", error);
        // If no settings exist, we'll use defaults
        return;
      }
      
      setSettings({
        id: data.id,
        site_name: data.site_name || "Obilli Marketplace",
        site_description: data.site_description || "Buy and sell goods, services, and find jobs in Cameroon",
        footer_text: data.footer_text || "© 2023 Obilli Marketplace. All rights reserved.",
        logo_url: data.logo_url || null,
        favicon_url: data.favicon_url || null,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      // Save settings to database
      let result;
      if (settings.id) {
        // Update existing settings
        result = await supabase
          .from("site_settings")
          .update({
            site_name: settings.site_name,
            site_description: settings.site_description,
            footer_text: settings.footer_text,
          })
          .eq("id", settings.id);
      } else {
        // Insert new settings
        result = await supabase
          .from("site_settings")
          .insert([{
            site_name: settings.site_name,
            site_description: settings.site_description,
            footer_text: settings.footer_text,
          }]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: `Failed to save settings: ${error.message || "Please try again."}` });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Upload the file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      // First, remove the existing file if it exists
      await supabase
        .storage
        .from('public')
        .remove([fileName]);
      
      const { data, error } = await supabase
        .storage
        .from('public')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('public')
        .getPublicUrl(fileName);
      
      // Update the settings with the new logo URL
      const updateResult = await supabase
        .from("site_settings")
        .update({ logo_url: publicUrl })
        .eq("id", settings.id || '00000000-0000-0000-0000-000000000000');
      
      if (updateResult.error) {
        throw updateResult.error;
      }
      
      // Update local state
      setSettings(prev => ({ ...prev, logo_url: publicUrl }));
      
      setMessage({ type: "success", text: "Logo uploaded successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      setMessage({ type: "error", text: `Failed to upload logo: ${error.message || "Please try again."}` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is .ico format
    if (!file.name.endsWith('.ico')) {
      setMessage({ type: "error", text: "Please upload a .ico file for favicon." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    try {
      // Upload the file to Supabase storage
      const fileName = 'favicon.ico';
      
      // First, remove the existing file if it exists
      await supabase
        .storage
        .from('public')
        .remove([fileName]);
      
      const { data, error } = await supabase
        .storage
        .from('public')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('public')
        .getPublicUrl(fileName);
      
      // Update the settings with the new favicon URL
      const updateResult = await supabase
        .from("site_settings")
        .update({ favicon_url: publicUrl })
        .eq("id", settings.id || '00000000-0000-0000-0000-000000000000');
      
      if (updateResult.error) {
        throw updateResult.error;
      }
      
      // Update local state
      setSettings(prev => ({ ...prev, favicon_url: publicUrl }));
      
      setMessage({ type: "success", text: "Favicon uploaded successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error uploading favicon:", error);
      setMessage({ type: "error", text: `Failed to upload favicon: ${error.message || "Please try again."}` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.siteSettings")}</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("admin.siteInformation")}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.siteName")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={settings.site_name}
                  onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.siteDescription")}</label>
                <textarea
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  rows={3}
                  value={settings.site_description}
                  onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.footerText")}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={settings.footer_text}
                  onChange={(e) => setSettings({...settings, footer_text: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          {/* Branding Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("admin.branding")}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.logo")}</label>
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-500 text-xs">{t("admin.logo")}</span>
                    )}
                  </div>
                  <div>
                    <label className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm cursor-pointer">
                      {t("admin.uploadNew")}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoUpload}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">{t("admin.recommendedLogo")}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.favicon")}</label>
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    {settings.favicon_url ? (
                      <img src={settings.favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-500 text-xs">{t("admin.favicon")}</span>
                    )}
                  </div>
                  <div>
                    <label className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm cursor-pointer">
                      {t("admin.uploadNew")}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".ico" 
                        onChange={handleFaviconUpload}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">{t("admin.recommendedFavicon")}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center"
                  onClick={saveSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("admin.saving")}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t("admin.saveSettings")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}