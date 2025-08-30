"use client";

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { profilesRepo } from "@/lib/repositories";
import type { Database } from "@/lib/types/database";
import {
  User,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Save,
  Upload,
  Shield,
  Bell,
  Globe,
  Trash2
} from "lucide-react";

type Profile = Database['public']['Tables']['profiles']['Row'];

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

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    whatsapp_number: '',
    show_phone: true,
    show_whatsapp: true,
    avatar_url: ''
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

        const profileData = await profilesRepo.getById(user.id);
        if (profileData) {
          setProfile(profileData);
          setFormData({
            username: profileData.username || '',
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            whatsapp_number: profileData.whatsapp_number || '',
            show_phone: profileData.show_phone ?? true,
            show_whatsapp: profileData.show_whatsapp ?? true,
            avatar_url: profileData.avatar_url || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Validate required fields
      if (!formData.username.trim()) {
        setError('Username is required');
        return;
      }

      if (!formData.full_name.trim()) {
        setError('Full name is required');
        return;
      }

      // Check username availability if changed
      if (formData.username !== profile.username) {
        const isAvailable = await profilesRepo.checkUsernameAvailable(formData.username, user.id);
        if (!isAvailable) {
          setError('Username is already taken');
          return;
        }
      }

      // Update profile
      const updatedProfile = await profilesRepo.update(user.id, {
        username: formData.username.trim().toLowerCase(),
        full_name: formData.full_name.trim(),
        phone: formData.phone?.trim() || null,
        whatsapp_number: formData.whatsapp_number?.trim() || null,
        show_phone: formData.show_phone,
        show_whatsapp: formData.show_whatsapp,
        avatar_url: formData.avatar_url || null
      });

      setProfile(updatedProfile);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsSaving(true);
      setError(null);

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
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

      // Update form data
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      // Auto-save avatar
      if (profile) {
        const updatedProfile = await profilesRepo.update(user.id, { avatar_url: publicUrl });
        setProfile(updatedProfile);
        setSuccessMessage('Avatar updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="animate-pulse">
            {/* Header */}
            <div className="mb-8">
              <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile */}
              <div className="lg:col-span-2 space-y-8">
                {/* Avatar Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-muted"></div>
                    <div>
                      <div className="h-10 bg-muted rounded w-32 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                      <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-muted rounded w-28 mb-2"></div>
                      <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                      <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="h-10 bg-muted rounded w-32"></div>
                  </div>
                </div>
              </div>

              {/* Right Column - Privacy & Account */}
              <div className="space-y-8">
                {/* Privacy Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-6"></div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                      </div>
                      <div className="w-11 h-6 bg-muted rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-4/5 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                      </div>
                      <div className="w-11 h-6 bg-muted rounded-full"></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </div>
                </div>

                {/* Account Email */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-5 h-5 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <p className="text-green-700 dark:text-green-300">{successMessage}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Avatar Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isSaving}
                    />
                    <span className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      {isSaving ? 'Uploading...' : 'Upload Photo'}
                    </span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={formData.phone}
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
                      value={formData.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                      placeholder="Enter your WhatsApp number"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={handleSaveProfile}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Privacy & Account Info */}
          <div className="space-y-8">
            {/* Privacy Settings */}
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
                  className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>

            {/* Account Email */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Email</h3>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">{user?.email}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This is the email address associated with your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}