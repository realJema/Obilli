import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface MainCategory {
  name: string
  slug: string
  level: 'main'
}

interface Subgroup {
  name: string
  slug: string
  level: 'subgroup'
  parent: {
    name: string
    slug: string
  }
}

interface Subcategory {
  name: string
  slug: string
  level: 'subcategory'
  parent: {
    name: string
    slug: string
    parent: {
      name: string
      slug: string
    }
  }
}

type CategoryInfo = MainCategory | Subgroup | Subcategory

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const url = new URL(request.url)
    const subgroupSlug = url.searchParams.get('subgroup')
    const subcategorySlug = url.searchParams.get('subcategory')

    // If we have a subcategory parameter, fetch that first
    if (subcategorySlug) {
      const { data: subcategory, error: subcategoryError } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id")
        .eq("slug", subcategorySlug)
        .single()

      if (subcategoryError || !subcategory) {
        console.error("Error finding subcategory:", subcategoryError)
        return NextResponse.json(
          { error: "Subcategory not found" },
          { status: 404 }
        )
      }

      // Get the subgroup (parent)
      const { data: subgroup } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id")
        .eq("id", subcategory.parent_id)
        .single()

      if (!subgroup) {
        return NextResponse.json(
          { error: "Subgroup not found" },
          { status: 404 }
        )
      }

      // Get the main category (parent of parent)
      const { data: mainCategory } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("id", subgroup.parent_id)
        .single()

      if (!mainCategory) {
        return NextResponse.json(
          { error: "Main category not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        category: {
          name: subcategory.name,
          slug: subcategory.slug,
          level: 'subcategory',
          parent: {
            name: subgroup.name,
            slug: subgroup.slug,
            parent: {
              name: mainCategory.name,
              slug: mainCategory.slug
            }
          }
        }
      })
    }

    // If we have a subgroup parameter, fetch that
    if (subgroupSlug) {
      const { data: subgroup, error: subgroupError } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id")
        .eq("slug", subgroupSlug)
        .single()

      if (subgroupError || !subgroup) {
        console.error("Error finding subgroup:", subgroupError)
        return NextResponse.json(
          { error: "Subgroup not found" },
          { status: 404 }
        )
      }

      // Get the main category (parent)
      const { data: mainCategory } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("id", subgroup.parent_id)
        .single()

      if (!mainCategory) {
        return NextResponse.json(
          { error: "Main category not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        category: {
          name: subgroup.name,
          slug: subgroup.slug,
          level: 'subgroup',
          parent: {
            name: mainCategory.name,
            slug: mainCategory.slug
          }
        }
      })
    }

    // Otherwise, fetch the main category
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", params.slug)
      .single()

    if (categoryError || !category) {
      console.error("Error finding category:", categoryError)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      category: {
        name: category.name,
        slug: category.slug,
        level: 'main'
      }
    })
  } catch (error) {
    console.error("Error in category API:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error fetching category",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 
