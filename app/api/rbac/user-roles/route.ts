import { type NextRequest, NextResponse } from "next/server"
import { checkPermissionMiddleware, assignRoleToUser, removeRoleFromUser } from "@/lib/rbac"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const session = await getServerSession(authOptions)
    const { userId, roleId } = await request.json()

    if (!userId || !roleId) {
      return NextResponse.json({ error: "User ID and Role ID are required" }, { status: 400 })
    }

    const success = await assignRoleToUser(userId, roleId, session?.user?.email || "system")

    if (!success) {
      return NextResponse.json({ error: "Failed to assign role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error assigning role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const { userId, roleId } = await request.json()

    if (!userId || !roleId) {
      return NextResponse.json({ error: "User ID and Role ID are required" }, { status: 400 })
    }

    const success = await removeRoleFromUser(userId, roleId)

    if (!success) {
      return NextResponse.json({ error: "Failed to remove role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
