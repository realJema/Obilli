import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch only town locations
    const { data: locations, error } = await supabase
      .from("locations")
      .select("id, name, slug")
      .eq("type", "town")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching locations from database:", error)
      throw error
    }

    if (!locations || locations.length === 0) {
      return NextResponse.json({
        locations: []
      })
    }

    // Format locations
    const formattedLocations = locations.map(town => ({
      ...town,
      display_name: town.name
    }))

    return NextResponse.json({
      locations: formattedLocations
    })
  } catch (error) {
    console.error("Error in locations API:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error fetching locations",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

