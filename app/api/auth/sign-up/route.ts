import { createUser } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const user = await createUser(userData)
    return new Response(JSON.stringify(user))
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Internal Server Error", { status: 400 })
  }
}

