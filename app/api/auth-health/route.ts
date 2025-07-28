import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      status: "healthy",
      authenticated: !!session?.user,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
          }
        : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth health check error:", error)
    return NextResponse.json({ status: "error", message: "Authentication service unavailable" }, { status: 500 })
  }
}
