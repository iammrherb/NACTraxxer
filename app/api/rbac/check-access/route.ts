import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { hasPermission, hasAnyPermission, hasRole, hasAnyRole } from "@/lib/rbac"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const { permission, permissions, role, roles } = await request.json()
    const userId = session.user.email

    let hasAccess = false

    if (permission) {
      hasAccess = await hasPermission(userId, permission)
    } else if (permissions && Array.isArray(permissions)) {
      hasAccess = await hasAnyPermission(userId, permissions)
    } else if (role) {
      hasAccess = await hasRole(userId, role)
    } else if (roles && Array.isArray(roles)) {
      hasAccess = await hasAnyRole(userId, roles)
    }

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking access:", error)
    return NextResponse.json({ hasAccess: false }, { status: 500 })
  }
}
