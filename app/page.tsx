import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CategorySection } from "@/components/category-section"

async function getListingsForCategory(categoryId: string) {
  const supabase = createServerSupabaseClient()

  // First, get all subcategories for this main category recursively
  const { data: allCategories } = await supabase.from("categories").select("id, parent_id")

  if (!allCategories) return []

  // Helper function to get all child category IDs recursively
  function getAllChildCategories(parentId: string): string[] {
    if (!allCategories) return []
    const children = allCategories.filter((cat) => cat.parent_id === parentId)
    const childIds = children.map((child) => child.id)
    const grandChildIds = children.flatMap((child) => getAllChildCategories(child.id))
    return [...childIds, ...grandChildIds]
  }

  // Get all category IDs including the main category and all its descendants
  const allCategoryIds = [categoryId, ...getAllChildCategories(categoryId)]

  // Helper function to get parent location
  const getParentLocation = async (parentId: string) => {
    const { data } = await supabase
      .from('locations2')
      .select('id, name, slug, type')
      .eq('id', parentId)
      .single()
    return data
  }

  // Fetch listings from all these categories
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      seller:profiles!seller_id(
        username,
        full_name,
        avatar_url
      ),
      category:categories!category_id(
        name,
        slug
      ),
      location:locations2!listings_location_id_fkey(
        id,
        name,
        slug,
        parent_id,
        type
      )
    `)
    .in("category_id", allCategoryIds)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!listings) return []

  // Get parent locations for each listing
  const listingsWithParentLocations = await Promise.all(
    listings.map(async (listing) => {
      if (listing.location?.parent_id) {
        const parentLocation = await getParentLocation(listing.location.parent_id)
        return {
          ...listing,
          location: {
            ...listing.location,
            parent: parentLocation
          }
        }
      }
      return listing
    })
  )

  return listingsWithParentLocations
}

export default async function Home() {
  const supabase = createServerSupabaseClient()

  // Get main categories
  const { data: categories } = await supabase.from("categories").select("*").is("parent_id", null)

  // Get listings for each category
  const categoriesWithListings = await Promise.all(
    (categories || []).map(async (category) => {
      const listings = await getListingsForCategory(category.id)
      return {
        ...category,
        listings,
      }
    }),
  )

  return (
    <div>
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Find the perfect service for your needs</h1>
          <p className="text-xl">
            From design to development, marketing to music - get any service you need, when you need it.
          </p>
        </div>
      </div>

      {categoriesWithListings.map((category) => (
        <CategorySection
          key={category.id}
          title={category.name}
          subtitle={`Browse ${category.name.toLowerCase()} services`}
          listings={category.listings}
        />
      ))}
    </div>
  )
}

