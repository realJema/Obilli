"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { categoriesRepo } from "@/lib/repositories";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Package, 
  FileText, 
  Camera,
  X,
  Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ListingType = 'good' | 'service' | 'job';

interface ServicePackage {
  tier: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price_xaf: number;
  delivery_days: number;
}

export default function SellPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { t, formatCurrency } = useI18n();

  // Auth state
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Form state
  const [listingType, setListingType] = useState<ListingType>('good');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [condition, setCondition] = useState('new');
  const [locationCity, setLocationCity] = useState('');
  const [locationRegion, setLocationRegion] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);

  // Data
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const cameroonRegions = [
    'Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 
    'North', 'Northwest', 'South', 'Southwest', 'West'
  ];

  // Check authentication and profile on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Check if user has a profile with username
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error || !profile?.username) {
          router.push('/login');
          return;
        }

        setHasProfile(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, router, supabase]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoriesRepo.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    if (hasProfile) {
      loadCategories();
    }
  }, [hasProfile]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Add service package
  const addServicePackage = () => {
    if (servicePackages.length >= 3) {
      setError('Maximum 3 service packages allowed');
      return;
    }

    const tiers: ServicePackage['tier'][] = ['basic', 'standard', 'premium'];
    const nextTier = tiers[servicePackages.length];

    setServicePackages([
      ...servicePackages,
      {
        tier: nextTier,
        name: '',
        description: '',
        price_xaf: 0,
        delivery_days: 1,
      }
    ]);
  };

  // Update service package
  const updateServicePackage = (index: number, field: keyof ServicePackage, value: any) => {
    const updated = servicePackages.map((pkg, i) => 
      i === index ? { ...pkg, [field]: value } : pkg
    );
    setServicePackages(updated);
  };

  // Remove service package
  const removeServicePackage = (index: number) => {
    setServicePackages(servicePackages.filter((_, i) => i !== index));
  };

  // Submit listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!user || !categoryId) {
        throw new Error('Missing required information');
      }

      // Upload images first
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}_${image.name}`;
        const { data, error } = await supabase.storage
          .from('listings-media')
          .upload(fileName, image);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('listings-media')
          .getPublicUrl(data.path);

        imageUrls.push(publicUrl);
      }

      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          owner_id: user.id,
          type: listingType,
          category_id: categoryId,
          title,
          description,
          price_xaf: price ? parseInt(price) : null,
          negotiable,
          condition: listingType === 'good' ? condition : null,
          location_city: locationCity,
          location_region: locationRegion,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Add media
      if (imageUrls.length > 0) {
        const mediaData = imageUrls.map((url, index) => ({
          listing_id: listing.id,
          url,
          kind: 'image' as const,
          position: index,
        }));

        const { error: mediaError } = await supabase
          .from('listing_media')
          .insert(mediaData);

        if (mediaError) throw mediaError;
      }

      // Add service packages for services
      if (listingType === 'service' && servicePackages.length > 0) {
        const packagesData = servicePackages.map(pkg => ({
          listing_id: listing.id,
          tier: pkg.tier,
          name: pkg.name,
          description: pkg.description,
          price_xaf: pkg.price_xaf,
          delivery_days: pkg.delivery_days,
        }));

        const { error: packagesError } = await supabase
          .from('service_packages')
          .insert(packagesData);

        if (packagesError) throw packagesError;
      }

      // Redirect to listing
      router.push(`/listing/${listing.id}`);
    } catch (error: any) {
      console.error('Failed to create listing:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!hasProfile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to create a listing.
            </p>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Listing</h1>
            <p className="text-muted-foreground">
              Share your items, services, or job opportunities with the community
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Listing Type */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">What are you listing?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'good', label: 'Sell an Item', desc: 'Physical goods and products' },
                  { value: 'service', label: 'Offer a Service', desc: 'Skills and professional services' },
                  { value: 'job', label: 'Post a Job', desc: 'Employment opportunities' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setListingType(type.value as ListingType)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      listingType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">{type.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="What are you listing?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <optgroup key={category.id} label={category.name_en}>
                        <option value={category.id}>{category.name_en}</option>
                        {category.children?.map((child) => (
                          <option key={child.id} value={child.id}>
                            └ {child.name_en}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Provide details about your listing..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            {listingType !== 'job' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Price (XAF)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter price in XAF"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={negotiable}
                      onChange={(e) => setNegotiable(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="negotiable" className="text-sm text-foreground">
                      Price is negotiable
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Condition (for goods) */}
            {listingType === 'good' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Condition
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'new', label: 'New', desc: 'Never used, in original packaging' },
                    { value: 'used', label: 'Used', desc: 'Previously owned, good condition' },
                    { value: 'refurbished', label: 'Refurbished', desc: 'Restored to working condition' },
                  ].map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setCondition(cond.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        condition === cond.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-foreground">{cond.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{cond.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Service Packages */}
            {listingType === 'service' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Service Packages
                  </h2>
                  <button
                    type="button"
                    onClick={addServicePackage}
                    className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Package
                  </button>
                </div>

                <div className="space-y-4">
                  {servicePackages.map((pkg, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium capitalize">{pkg.tier} Package</h3>
                        <button
                          type="button"
                          onClick={() => removeServicePackage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Package Name</label>
                          <input
                            type="text"
                            value={pkg.name}
                            onChange={(e) => updateServicePackage(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g., Logo Design"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium mb-1">Price (XAF)</label>
                            <input
                              type="number"
                              value={pkg.price_xaf}
                              onChange={(e) => updateServicePackage(index, 'price_xaf', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Delivery (days)</label>
                            <input
                              type="number"
                              value={pkg.delivery_days}
                              onChange={(e) => updateServicePackage(index, 'delivery_days', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={pkg.description}
                            onChange={(e) => updateServicePackage(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="What's included in this package?"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {servicePackages.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Add service packages to offer different options to your customers
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Images */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photos
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images (max 5)
                    </p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Yaoundé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Region
                  </label>
                  <select
                    value={locationRegion}
                    onChange={(e) => setLocationRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select region</option>
                    {cameroonRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-border rounded-md font-medium text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
