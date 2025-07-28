import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Authentication successful",
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json({ error: "Authentication test failed" }, { status: 500 })
  }
}
