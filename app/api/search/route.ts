import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase()
  const category = searchParams.get("category")

  if (!query) {
    return new Response(JSON.stringify({ results: [] }))
  }

  try {
    // In a real app, you would search your database
    // This is a simple file-based implementation
    const listingsPath = path.join(process.cwd(), "_db", "listings.json")
    const data = await fs.readFile(listingsPath, "utf-8")
    const listings = JSON.parse(data)

    const results = listings.filter((listing: any) => {
      const matchesQuery =
        listing.title.toLowerCase().includes(query) || listing.description.toLowerCase().includes(query)

      if (category) {
        return matchesQuery && listing.category === category
      }

      return matchesQuery
    })

    return new Response(JSON.stringify({ results }))
  } catch (error) {
    return new Response(JSON.stringify({ results: [] }))
  }
}

