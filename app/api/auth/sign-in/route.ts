import { cookies } from "next/headers"
import { verifyCredentials } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await verifyCredentials(email, password)
    if (!user) {
      return new Response("Invalid credentials", { status: 401 })
    }

    // Set session cookie
    cookies().set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return new Response(JSON.stringify(user))
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 })
  }
}

