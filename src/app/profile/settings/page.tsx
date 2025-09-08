"use client";

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import {
  User,
  Phone,
  Mail,
  Save,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { Database } from "@/lib/types/database";

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export default function SettingsPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy'>('profile');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    whatsapp_number: '',
    show_phone: true,
    show_whatsapp: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Direct query to the profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profileData) {
          setProfile(profileData);
          setFormData({
            username: profileData.username || '',
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            whatsapp_number: profileData.whatsapp_number || '',
            show_phone: profileData.show_phone ?? true,
            show_whatsapp: profileData.show_whatsapp ?? true,
          });
          
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, router, supabase]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) return false;
    
    // Exclude current user's ID when checking availability
    const { data, error, count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('username', username.toLowerCase())
      .neq('id', user?.id || '');
    
    if (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
    
    return (count || 0) === 0; // If count is 0, username is available
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      // Upload to Supabase storage
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
        
      return publicUrl;
    } catch (err) {
      console.error('Avatar upload error:', err);
      throw new Error('Failed to upload avatar. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Basic validation
      if (!formData.username.trim()) {
        setError('Username is required');
        return;
      }

      if (!formData.full_name.trim()) {
        setError('Full name is required');
        return;
      }
      
      // Username format validation
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setError('Username can only contain letters, numbers, and underscores');
        return;
      }
      
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }

      // Check username availability if changed
      if (formData.username.toLowerCase() !== profile?.username?.toLowerCase()) {
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          setError('Username is already taken');
          return;
        }
      }
      
      // Prepare profile update data
      let profileUpdate: ProfileUpdate = {
        username: formData.username.trim().toLowerCase(),
        full_name: formData.full_name.trim(),
        phone: formData.phone || null,
        whatsapp_number: formData.whatsapp_number || null,
        show_phone: formData.show_phone,
        show_whatsapp: formData.show_whatsapp,
        updated_at: new Date().toISOString()
      };
      
      // Upload avatar if selected
      if (avatarFile) {
        try {
          const avatarUrl = await uploadAvatar();
          if (avatarUrl) {
            profileUpdate.avatar_url = avatarUrl;
          }
        } catch (error) {
          console.error('Avatar upload failed:', error);
          setError('Failed to upload avatar. Profile update continued without avatar change.');
          // Continue with profile update even if avatar upload fails
        }
      }

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setProfile(data);
      setAvatarFile(null); // Clear the file input after successful upload
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={isSaving}
                    />
                    <span className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Photo
                    </span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG or PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Enter your username"
                      disabled={isSaving}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Letters, numbers, and underscores only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="Enter your full name"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Enter your phone number"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.whatsapp_number || ''}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Enter your WhatsApp number"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
              
              {/* Account Email (read-only) */}
              <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support for email updates.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={handleSaveProfile}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center disabled:opacity-50 disabled:pointer-events-none"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Visibility</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Control who can see your contact information on your listings
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Show Phone Number</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your phone number on listings
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('show_phone', !formData.show_phone)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.show_phone ? 'bg-primary' : 'bg-muted'
                  }`}
                  disabled={isSaving}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.show_phone ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Show WhatsApp Number</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your WhatsApp number on listings
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('show_whatsapp', !formData.show_whatsapp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.show_whatsapp ? 'bg-primary' : 'bg-muted'
                  }`}
                  disabled={isSaving}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.show_whatsapp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={handleSaveProfile}
                className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
