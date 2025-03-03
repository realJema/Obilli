import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")
    const category = searchParams.get("category")

    if (!q) {
      return NextResponse.json({ results: [] })
    }

    const supabase = createRouteHandlerClient({ cookies })

    let query = supabase
      .from("listings")
      .select("id, title, description, price")
      .textSearch("title", q, {
        type: "websearch",
        config: "english"
      })
      .order("created_at", { ascending: false })
      .limit(10)

    if (category) {
      query = query.eq("category", category)
    }

    const { data: results, error } = await query

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

