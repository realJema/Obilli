import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch all locations in a single query
    const { data: allLocations, error: fetchError } = await supabase.from("locations").select("*").order("name")

    if (fetchError) {
      console.error("Database error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
    }

    if (!allLocations) {
      return NextResponse.json({ error: "No locations found" }, { status: 404 })
    }

    // Process locations into hierarchy
    const towns = allLocations.filter((loc) => loc.type === "town")
    const processedLocations = towns.map((town) => {
      const quarters = allLocations.filter((loc) => loc.parent_id === town.id)
      return {
        ...town,
        quarters,
      }
    })

    return NextResponse.json(processedLocations)
  } catch (error) {
    console.error("Error in locations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

