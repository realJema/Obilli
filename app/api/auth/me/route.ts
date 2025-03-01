import { cookies } from "next/headers"
import { getUserById } from "@/lib/db"

export async function GET() {
  try {
    const sessionId = cookies().get("session")?.value

    if (!sessionId) {
      return new Response(JSON.stringify({ user: null }))
    }

    const user = await getUserById(sessionId)
    if (!user) {
      return new Response(JSON.stringify({ user: null }))
    }

    // Don't send the password hash
    const { password, ...userWithoutPassword } = user
    return new Response(JSON.stringify({ user: userWithoutPassword }))
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 })
  }
}

