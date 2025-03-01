import { cookies } from "next/headers"

export async function POST() {
  cookies().delete("session")
  return new Response(null, { status: 200 })
}

