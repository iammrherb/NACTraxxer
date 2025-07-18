import { NextResponse } from "next/server"
import { checkPermissionMiddleware, getAllPermissions } from "@/lib/rbac"

export async function GET() {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const permissions = await getAllPermissions()
    return NextResponse.json(permissions)
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
