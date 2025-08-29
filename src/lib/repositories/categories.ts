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
        children: []
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

    return data;
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

    return data;
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
}
