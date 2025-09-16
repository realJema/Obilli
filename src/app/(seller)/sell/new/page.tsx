"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { categoriesRepo, locationsRepo } from "@/lib/repositories";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import type { LocationWithChildren } from "@/lib/repositories/locations";
import { CategoryTree, type CategoryNode } from "@/components/ui/category-tree";
import { LocationTree, type LocationNode } from "@/components/ui/location-tree";
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Package, 
  FileText, 
  Camera,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ListingType = 'good' | 'service' | 'job';
type Step = 1 | 2 | 3 | 4 | 5;

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
  const { formatCurrency, t } = useI18n();

  // Auth state
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form state
  const [listingType, setListingType] = useState<ListingType>('good');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [condition, setCondition] = useState('new');
  const [locationId, setLocationId] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);

  // Data
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [locations, setLocations] = useState<LocationWithChildren[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { number: 1, title: t('sell.typeCategoryLocation'), icon: Package },
    { number: 2, title: t('sell.basicInfo'), icon: FileText },
    { number: 3, title: t('sell.pricingDetails'), icon: DollarSign },
    { number: 4, title: t('sell.photos'), icon: Camera },
    { number: 5, title: t('sell.previewPublish'), icon: Eye },
  ];

  // Helper function to format number with thousand separators
  const formatNumberWithSeparators = (value: string): string => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) return '';
    return parseInt(cleanValue).toLocaleString();
  };

  // Helper function to parse number from formatted string
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  // Local storage key
  const STORAGE_KEY = 'sell-listing-draft';

  // Save form data to localStorage

  // Load form data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const formData = JSON.parse(saved);
        setListingType(formData.listingType || 'good');
        setTitle(formData.title || '');
        setDescription(formData.description || '');
        setCategoryId(formData.categoryId || null);
        setPrice(formData.price || '');
        setNegotiable(formData.negotiable || false);
        setCondition(formData.condition || 'new');
        setLocationId(formData.locationId || null);
        setServicePackages(formData.servicePackages || []);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  // Clear saved data
  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  // Add useEffect to monitor step changes
  useEffect(() => {
    // Clean up debugging code
  }, [currentStep]);

  // Add useEffect to check for any automatic form submission
  useEffect(() => {
    // Clean up debugging code
  });

  // Add another useEffect to monitor form submission
  useEffect(() => {
    // Clean up debugging code
  }, []);

  // Add useEffect to monitor for any automatic form submission
  useEffect(() => {
    // Clean up debugging code
  }, []);

  // Add useEffect to check if there's any automatic submission
  useEffect(() => {
    // Clean up debugging code
  }, [currentStep]);

  // Step validation
  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!listingType && !!categoryId;
      case 2:
        return !!title.trim() && !!description.trim();
      case 3:
        if (listingType === 'service') {
          return servicePackages.length > 0 && servicePackages.every(pkg => 
            pkg.name.trim() && pkg.description.trim() && pkg.price_xaf > 0
          );
        }
        return true; // Price is optional for jobs
      case 4:
        return images.length > 0;
      case 5:
        return true; // Preview step, just needs to review
      default:
        return false;
    }
  };

  const canProceed = (step: Step): boolean => {
    return validateStep(step);
  };

  const nextStep = () => {
    if (currentStep < 5 && canProceed(currentStep)) {
      setCurrentStep((prev) => (prev + 1) as Step);
      setError('');
    } else {
      setError('Please complete all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      setError('');
    }
  };

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

  // Load categories and locations
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          categoriesRepo.getAll(),
          locationsRepo.getHierarchical()
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
        
        // Load saved form data
        loadFromLocalStorage();
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    if (hasProfile) {
      loadData();
    }
  }, [hasProfile]);

  // Load filtered categories based on listing type
  useEffect(() => {
    const loadFilteredCategories = async () => {
      try {
        const filteredData = await categoriesRepo.getByListingType(listingType);
        setCategories(filteredData);
        
        // Reset category selection when listing type changes
        setCategoryId(null);
      } catch (error) {
        console.error('Failed to load filtered categories:', error);
      }
    };

    if (hasProfile) {
      loadFilteredCategories();
    }
  }, [listingType, hasProfile]);

  // Convert categories to tree format recursively
  const convertToTree = (categories: CategoryWithChildren[]): CategoryNode[] => {
    return categories.map(category => ({
      id: category.id,
      name: category.name_en,
      children: category.children ? convertToTree(category.children as CategoryWithChildren[]) : []
    }));
  };

  // Convert locations to tree format recursively
  const convertLocationsToTree = (locations: LocationWithChildren[]): LocationNode[] => {
    return locations.map(location => ({
      id: location.id,
      name: location.location_en,
      children: location.children ? convertLocationsToTree(location.children as LocationWithChildren[]) : []
    }));
  };

  // Get location name by ID
  const getLocationName = (locationId: number): string => {
    const findLocation = (nodes: LocationWithChildren[], id: number): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.location_en;
        if (node.children) {
          const found = findLocation(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    return findLocation(locations, locationId) || 'Location';
  };

  // Save form data whenever it changes
  useEffect(() => {
    if (hasProfile) {
      const formData = {
        listingType,
        title,
        description,
        categoryId,
        price,
        negotiable,
        condition,
        locationId,
        servicePackages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [listingType, title, description, categoryId, price, negotiable, condition, locationId, servicePackages, hasProfile]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processImageFiles(files);
    
    // Clear the input
    e.target.value = '';
  };

  // Handle file drop
  const handleFileDrop = (files: File[]) => {
    processImageFiles(files);
  };

  // Process image files (shared logic for both upload and drop)
  const processImageFiles = (files: File[]) => {
    // Filter for valid image files
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isImage && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only images under 10MB are allowed.');
    }
    
    if (validFiles.length + images.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
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

  // Move image (for reordering)
  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    // Swap positions
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    [newPreviews[fromIndex], newPreviews[toIndex]] = [newPreviews[toIndex], newPreviews[fromIndex]];
    
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
  const updateServicePackage = (index: number, field: keyof ServicePackage, value: string | number) => {
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
          location_id: locationId,
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

      // Clear saved data and redirect to success page
      clearLocalStorage();
      console.log('Redirecting to success page with listing ID:', listing.id);
      router.push(`/sell/success?id=${listing.id}&title=${encodeURIComponent(title)}`);
    } catch (error: unknown) {
      console.error('Failed to create listing:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-muted rounded w-80 mb-2 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-96 animate-pulse"></div>
            </div>
            
            {/* Progress steps skeleton */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                    {i < 5 && <div className="flex-1 h-0.5 mx-4 bg-muted animate-pulse"></div>}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="h-6 bg-muted rounded w-64 mx-auto animate-pulse"></div>
              </div>
            </div>
            
            {/* Form skeleton */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-48 mb-6 animate-pulse"></div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-12 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Navigation skeleton */}
            <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
              <div className="h-12 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-12 bg-muted rounded w-24 animate-pulse"></div>
            </div>
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
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('sell.authenticationRequired')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('sell.signInCreate')}
            </p>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
            >
{t('sell.signIn')}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('sell.createNewListing')}</h1>
            <p className="text-muted-foreground">
              {t('sell.shareItems')}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const canAccess = currentStep >= step.number || isCompleted;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <button
                      type="button"  // This fix prevents the buttons from submitting the form
                      onClick={() => {
                        // Only allow navigation if the target step is accessible and the current step is valid
                        if (canAccess && validateStep(currentStep)) {
                          setCurrentStep(step.number as Step);
                        }
                      }}
                      disabled={!canAccess}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isActive
                          ? 'border-primary text-primary'
                          : canAccess
                          ? 'border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary'
                          : 'border-muted text-muted cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </button>
                    
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Step Content */}
            {currentStep === 1 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6">{t('sell.whatListing')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: 'good', label: t('sell.sellItem'), desc: t('sell.physicalGoods') },
                    { value: 'service', label: t('sell.offerService'), desc: t('sell.skillsServices') },
                    { value: 'job', label: t('sell.postJob'), desc: t('sell.employmentOpportunities') },
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

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('sell.categoryRequired')}
                    </label>
                    <CategoryTree
                      categories={convertToTree(categories)}
                      selectedId={categoryId}
                      onSelect={setCategoryId}
                      placeholder={t('sell.selectCategory')}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('sell.locationOptional')}
                    </label>
                    <LocationTree
                      locations={convertLocationsToTree(locations)}
                      selectedId={locationId}
                      onSelect={setLocationId}
                      placeholder={t('sell.selectLocation')}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6">{t('sell.basicInformation')}</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('sell.titleRequired')}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={t('sell.whatListingPlaceholder')}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('sell.descriptionRequired')}
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={t('sell.provideDetails')}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {description.length}/1000 characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6">
                  {listingType === 'job' ? t('sell.jobDetails') : listingType === 'service' ? t('sell.servicePackages') : t('sell.pricingDetails')}
                </h3>
                
                {listingType === 'service' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">{t('sell.createPackages')}</p>
                      <button
                        type="button"
                        onClick={addServicePackage}
                        disabled={servicePackages.length >= 3}
                        className="flex items-center text-primary hover:text-primary/80 text-sm font-medium disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t('sell.addPackage')}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {servicePackages.map((pkg, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium capitalize">{pkg.tier} Package</h4>
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
                              <label className="block text-sm font-medium mb-1">{t('sell.packageNameRequired')}</label>
                              <input
                                type="text"
                                required
                                value={pkg.name}
                                onChange={(e) => updateServicePackage(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={t('sell.logoDesign')}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium mb-1">{t('sell.priceXafRequired')}</label>
                                <input
                                  type="text"
                                  required
                                  value={formatNumberWithSeparators(pkg.price_xaf?.toString() || '')}
                                  onChange={(e) => updateServicePackage(index, 'price_xaf', parseInt(parseFormattedNumber(e.target.value)) || 0)}
                                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">{t('sell.deliveryDaysRequired')}</label>
                                <input
                                  type="number"
                                  required
                                  min="1"
                                  value={pkg.delivery_days || ''}
                                  onChange={(e) => updateServicePackage(index, 'delivery_days', parseInt(e.target.value) || 1)}
                                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">{t('sell.descriptionRequired')}</label>
                              <textarea
                                required
                                value={pkg.description}
                                onChange={(e) => updateServicePackage(index, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={t('sell.includedPackage')}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {servicePackages.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            {t('sell.addServicePackages')}
                          </p>
                          <button
                            type="button"
                            onClick={addServicePackage}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
                          >
                            {t('sell.createFirstPackage')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {listingType === 'good' && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('sell.condition')}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: 'new', label: t('sell.new'), desc: t('sell.neverUsed') },
                            { value: 'used', label: t('sell.used'), desc: t('sell.previouslyOwned') },
                            { value: 'refurbished', label: t('sell.refurbished'), desc: t('sell.restoredWorking') },
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

                    {listingType !== 'job' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t('sell.priceXaf')}
                          </label>
                          <input
                            type="text"
                            value={formatNumberWithSeparators(price)}
                            onChange={(e) => setPrice(parseFormattedNumber(e.target.value))}
                            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder={t('sell.enterPriceXaf')}
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
                            {t('sell.priceNegotiable')}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6">{t('sell.addPhotos')}</h3>

                <div 
                  className="space-y-6 border-2 border-dashed border-border rounded-lg p-6 transition-colors hover:border-primary"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                    
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      // Handle file drop
                      const files = Array.from(e.dataTransfer.files);
                      handleFileDrop(files);
                    } else if (e.dataTransfer.getData('text/plain')) {
                      // Handle image reordering drop (this will be handled by individual image handlers)
                    }
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  
                  {imagePreviews.length === 0 ? (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium text-lg mb-2">{t('sell.dragDropImages')}</h4>
                      <p className="text-muted-foreground mb-4">
                        {t('sell.clickBrowseFiles')}
                      </p>
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 cursor-pointer"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {t('sell.selectImages')}
                      </label>
                      <p className="text-xs text-muted-foreground mt-4">
                        {t('sell.supportedFormats')}<br />
                        {t('sell.maxImages')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Uploaded Images ({imagePreviews.length}/10)</h4>
                        <label
                          htmlFor="image-upload"
                          className="text-sm text-primary hover:text-primary/80 cursor-pointer"
                        >
{t('sell.addMore')}
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div 
                            key={index} 
                            className="relative group"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', index.toString());
                              e.currentTarget.classList.add('opacity-50');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('opacity-50');
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('ring-2', 'ring-primary');
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-primary');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('ring-2', 'ring-primary');
                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                              if (fromIndex !== index) {
                                moveImage(fromIndex, index);
                              }
                            }}
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg border border-border"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                              
                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              
                              {/* Main photo indicator */}
                              {index === 0 && (
                                <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Main
                                </div>
                              )}
                              
                              {/* Order indicators */}
                              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center cursor-grab">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center text-primary hover:text-primary/80 cursor-pointer text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t('sell.addMoreImages')}
                        </label>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>{t('sell.tipsBetterPhotos')}</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• {t('sell.useGoodLighting')}</li>
                      <li>• {t('sell.showMultipleAngles')}</li>
                      <li>• {t('sell.includeDetails')}</li>
                      <li>• {t('sell.dragReorder')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">{t('sell.previewListing')}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
{t('sell.howBuyersSee')}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Listing Preview Card */}
                  <div className="border border-border rounded-lg overflow-hidden bg-background">
                    <div className="relative aspect-[4/3] bg-muted">
                      {imagePreviews.length > 0 ? (
                        <>
                          <Image
                            src={imagePreviews[0]}
                            alt="Listing preview"
                            fill
                            className="object-cover"
                          />
                          {imagePreviews.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              +{imagePreviews.length - 1} more
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                        {title || t('sell.listingTitleAppear')}
                      </h4>
                      
                      {(price && listingType !== 'job') && (
                        <div className="text-xl font-bold text-primary mb-2">
                          {formatCurrency(parseInt(price))}
                          {negotiable && (
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              ({t('sell.negotiable')})
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {locationId 
                            ? getLocationName(locationId)
                            : 'No location specified'
                          }
                        </div>
                        <div className="capitalize">
                          {listingType} • {categories.find(c => c.id === categoryId)?.name_en || 'Category'}
                        </div>
                      </div>
                      
                      {description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">{t('sell.listingSummary')}</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('sell.type')}</span>
                          <span className="capitalize font-medium">{listingType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('sell.category')}</span>
                          <span className="font-medium">
                            {categories.find(c => c.id === categoryId)?.name_en || 'Not selected'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('sell.location')}</span>
                          <span className="font-medium">
                            {locationId 
                              ? getLocationName(locationId) 
                              : 'Not specified'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('sell.images')}</span>
                          <span className="font-medium">{imagePreviews.length} uploaded</span>
                        </div>
                        {listingType !== 'job' && price && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('sell.price')}</span>
                            <span className="font-medium">
                              {formatCurrency(parseInt(price))} 
                              {negotiable && <span className="text-xs text-muted-foreground ml-1">(Negotiable)</span>}
                            </span>
                          </div>
                        )}
                        {listingType === 'good' && condition && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('sell.conditionLabel')}</span>
                            <span className="font-medium capitalize">{condition}</span>
                          </div>
                        )}
                        {listingType === 'service' && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('sell.servicePackagesLabel')}</span>
                            <span className="font-medium">{servicePackages.length} configured</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {description && (
                      <div>
                        <h4 className="font-semibold mb-3">{t('sell.description')}</h4>
                        <div className="text-sm bg-muted/50 p-3 rounded border max-h-32 overflow-y-auto">
                          {description}
                        </div>
                      </div>
                    )}

                    {listingType === 'service' && servicePackages.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">{t('sell.servicePackages')}</h4>
                        <div className="space-y-2">
                          {servicePackages.map((pkg, index) => (
                            <div key={index} className="text-sm border rounded p-2">
                              <div className="font-medium capitalize">{pkg.tier}: {pkg.name}</div>
                              <div className="text-muted-foreground">
                                {formatCurrency(pkg.price_xaf)} • {pkg.delivery_days} days delivery
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{t('sell.readyPublish')}</strong> {t('sell.oncePublished')}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  prevStep();
                }}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 border border-border rounded-md font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
{t('sell.previous')}
              </button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </div>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    nextStep();
                  }}
                  disabled={!canProceed(currentStep)}
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
  {t('sell.next')}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !canProceed(currentStep)}
                  className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
{t('sell.publishing')}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
{t('sell.publishListing')}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}