import { cache } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export interface Category {
  id: string
  name: string
  slug: string
  subgroups: {
    id: string
    name: string
    slug: string
    subcategories: {
      id: string
      name: string
      slug: string
    }[]
  }[]
}

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch all categories
    const { data: allCategories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name")

    if (error) {
      console.error("Supabase error in getCategories:", error)
      return []
    }

    if (!allCategories || !Array.isArray(allCategories)) {
      return []
    }

    // Process categories into hierarchy
    const mainCategories = allCategories.filter((cat) => !cat.parent_id)
    
    const processedCategories = mainCategories.map((mainCat) => {
      const subgroups = allCategories
        .filter((cat) => cat.parent_id === mainCat.id)
        .map((subgroup) => ({
          id: subgroup.id,
          name: subgroup.name,
          slug: subgroup.slug,
          subcategories: allCategories
            .filter((cat) => cat.parent_id === subgroup.id)
            .map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
            })),
        }))

      return {
        id: mainCat.id,
        name: mainCat.name,
        slug: mainCat.slug,
        subgroups,
      }
    })

    return processedCategories
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
})

