import { supabase } from "./client"
import { categories } from "@/lib/config/categories"

export async function seedCategories() {
  try {
    // First, insert main categories
    for (const category of categories) {
      const { data: mainCategory, error: mainError } = await supabase
        .from("categories")
        .insert({
          name: category.title,
          slug: category.title.toLowerCase().replace(/\s+/g, "-"),
        })
        .select("id")
        .single()

      if (mainError) throw mainError

      // Then insert subgroups
      for (const subgroup of category.subgroups) {
        const { data: subCategory, error: subError } = await supabase
          .from("categories")
          .insert({
            name: subgroup.name,
            slug: subgroup.name.toLowerCase().replace(/\s+/g, "-"),
            parent_id: mainCategory.id,
          })
          .select("id")
          .single()

        if (subError) throw subError

        // Finally insert subcategories
        const subcategoryInserts = subgroup.subcategories.map((subcategory) => ({
          name: subcategory,
          slug: subcategory.toLowerCase().replace(/\s+/g, "-"),
          parent_id: subCategory.id,
        }))

        const { error: subcatError } = await supabase.from("categories").insert(subcategoryInserts)

        if (subcatError) throw subcatError
      }
    }

    console.log("Categories seeded successfully")
  } catch (error) {
    console.error("Error seeding categories:", error)
    throw error
  }
}

