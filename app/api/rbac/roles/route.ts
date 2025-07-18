import { type NextRequest, NextResponse } from "next/server"
import { checkPermissionMiddleware, getAllRoles, createRole } from "@/lib/rbac"

export async function GET() {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const roles = await getAllRoles()
    return NextResponse.json(roles)
  } catch (error) {
    console.error("Error fetching roles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const { name, description, permissionIds } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const role = await createRole(name, description, permissionIds || [])

    if (!role) {
      return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
    }

    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    console.error("Error creating role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
