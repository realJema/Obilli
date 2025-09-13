import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

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
  async getAll(): Promise<CategoryWithChildren[]> {
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

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data?.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: category.parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data?.forEach(category => {
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
  }

  async getById(id: number): Promise<CategoryWithChildren | null> {
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
  }

  async getBySlug(slug: string): Promise<CategoryWithChildren | null> {
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
  }

  async getTopLevel(): Promise<CategoryWithChildren[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch top-level categories: ${error.message}`);
    }

    return data || [];
  }

  async getChildren(parentId: number): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch child categories: ${error.message}`);
    }

    return data || [];
  }

  async getByListingType(listingType: 'good' | 'service' | 'job'): Promise<CategoryWithChildren[]> {
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

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data?.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: category.parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data?.forEach(category => {
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
  }

  // Get all categories for a listing type as a flat list with hierarchy info
  async getAllByListingType(listingType: 'good' | 'service' | 'job'): Promise<CategoryWithChildren[]> {
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

    // Group categories by parent
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories
    data?.forEach(category => {
      const cat: CategoryWithChildren = {
        ...category,
        children: [],
        parent: category.parent || undefined
      };
      categoryMap.set(category.id, cat);
    });

    // Second pass: organize hierarchy
    data?.forEach(category => {
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
  }

  // Flatten categories for dropdown display with proper hierarchy
  private flattenCategories(categories: CategoryWithChildren[], level = 0): FlattenedCategory[] {
    const flattened: FlattenedCategory[] = [];
    
    categories.forEach(category => {
      // Create better visual hierarchy using different approaches for better dropdown display
      let displayName = '';
      if (level === 0) {
        // Root categories - bold and clear
        displayName = `📁 ${category.name_en}`;
      } else if (level === 1) {
        // First level subcategories - with clear indentation
        displayName = `    ├─ ${category.name_en}`;
      } else if (level === 2) {
        // Second level subcategories - much more indentation using different approach
        displayName = `        ├─ ${category.name_en}`;
      } else {
        // Deeper levels - maximum indentation
        displayName = `            ├─ ${category.name_en}`;
      }
      
      // Add the current category
      flattened.push({
        ...category,
        level,
        displayName,
        parent: category.parent
      });
      
      // Recursively add children
      if (category.children && category.children.length > 0) {
        flattened.push(...this.flattenCategories(category.children, level + 1));
      }
    });
    
    return flattened;
  }

  // Get flattened categories for dropdown display
  async getFlattenedByListingType(listingType: 'good' | 'service' | 'job'): Promise<FlattenedCategory[]> {
    const hierarchicalCategories = await this.getByListingType(listingType);
    return this.flattenCategories(hierarchicalCategories);
  }

  async getWithListingCounts(): Promise<CategoryWithChildren[]> {
    // Get categories with listing counts
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        listings!inner(count)
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories with counts: ${error.message}`);
    }

    return data || [];
  }

  async create(category: NewCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  }

  async update(id: number, updates: UpdateCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  // Get category breadcrumb path
  async getBreadcrumb(categoryId: number): Promise<Category[]> {
    const breadcrumb: Category[] = [];
    let currentId: number | null = categoryId;

    while (currentId) {
      const category = await this.getById(currentId);
      if (!category) break;
      
      breadcrumb.unshift(category);
      currentId = category.parent_id;
    }

    return breadcrumb;
  }

  // Get all descendant category IDs for a given category (includes the category itself)
  async getAllDescendantIds(categoryId: number): Promise<number[]> {
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
  }
}
