import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: allCategories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name")

    if (error) {
      console.error("Supabase error in categories API:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    if (!allCategories || !Array.isArray(allCategories)) {
      return NextResponse.json({ data: [] }, { status: 200 })
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

    return NextResponse.json({ data: processedCategories }, { status: 200 })
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

