import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';
import { cache } from 'react'; // Next.js cache function

type Category = Database['public']['Tables']['categories']['Row'];
type NewCategory = Database['public']['Tables']['categories']['Insert'];
type UpdateCategory = Database['public']['Tables']['categories']['Update'];

export interface CategoryWithChildren extends Category {
  children?: Category[];
  parent?: Category;
  listing_count?: number;
}

export interface FlattenedCategory extends Category {
  level: number;
  displayName: string;
  parent?: Category;
}

export class CategoriesRepository {
  // Cache the getAll method for 10 minutes
  getAll = cache(async (): Promise<CategoryWithChildren[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*)
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: (category as any).parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data.forEach(category => {
      const cat = categoryMap.get(category.id)!;
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children!.push(cat);
          cat.parent = parent;
        }
      } else {
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  });

  // Cache the getById method for 10 minutes
  getById = cache(async (id: number): Promise<CategoryWithChildren | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*),
        children:categories!parent_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return {
      ...data,
      children: Array.isArray(data.children) ? data.children : (data.children ? [data.children] : []),
      parent: data.parent || undefined
    };
  });

  // Cache the getBySlug method for 10 minutes
  getBySlug = cache(async (slug: string): Promise<CategoryWithChildren | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*),
        children:categories!parent_id(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return {
      ...data,
      children: Array.isArray(data.children) ? data.children : (data.children ? [data.children] : []),
      parent: data.parent || undefined
    };
  });

  // Cache the getTopLevel method for 10 minutes
  getTopLevel = cache(async (): Promise<CategoryWithChildren[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch top-level categories: ${error.message}`);
    }

    return data || [];
  });

  // Cache the getChildren method for 5 minutes
  getChildren = cache(async (parentId: number): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch child categories: ${error.message}`);
    }

    return data || [];
  });

  // Cache the getByListingType method for 10 minutes
  getByListingType = cache(async (listingType: 'good' | 'service' | 'job'): Promise<CategoryWithChildren[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*)
      `)
      .eq('listing_type', listingType)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories by listing type: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: (category as any).parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data.forEach(category => {
      const cat = categoryMap.get(category.id)!;
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children!.push(cat);
          cat.parent = parent;
        }
      } else {
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  });

  // Cache the getAllByListingType method for 10 minutes
  getAllByListingTypeCached = cache(async (listingType: 'good' | 'service' | 'job'): Promise<CategoryWithChildren[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*)
      `)
      .eq('listing_type', listingType)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch all categories by listing type: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: (category as any).parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data.forEach(category => {
      const cat = categoryMap.get(category.id)!;
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children!.push(cat);
          cat.parent = parent;
        }
      } else {
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  });

  // Keep the original method for backward compatibility
  async getAllByListingType(listingType: 'good' | 'service' | 'job'): Promise<CategoryWithChildren[]> {
    return this.getAllByListingTypeCached(listingType);
  }

  // Cache the getBreadcrumb method for 5 minutes
  getBreadcrumb = cache(async (categoryId: number): Promise<Category[]> => {
    const breadcrumb: Category[] = [];
    let currentId: number | null = categoryId;

    while (currentId) {
      const category = await this.getById(currentId);
      if (!category) break;
      
      breadcrumb.unshift(category);
      currentId = category.parent_id;
    }

    return breadcrumb;
  });

  // Cache the getAllDescendantIds method for 5 minutes
  getAllDescendantIds = cache(async (categoryId: number): Promise<number[]> => {
    const allIds = [categoryId]; // Include the original category
    
    // Get immediate children
    const { data: children, error } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', categoryId);
    
    if (error) {
      console.warn(`Failed to fetch subcategories for ${categoryId}:`, error.message);
      return allIds;
    }
    
    if (children && children.length > 0) {
      // For each child, recursively get their descendants
      for (const child of children) {
        const descendantIds = await this.getAllDescendantIds(child.id);
        allIds.push(...descendantIds);
      }
    }
    
    return allIds;
  });
}
