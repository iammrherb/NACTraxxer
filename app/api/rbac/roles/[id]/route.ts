import { type NextRequest, NextResponse } from "next/server"
import { checkPermissionMiddleware, updateRole, deleteRole } from "@/lib/rbac"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const roleId = Number.parseInt(params.id)
    const { name, description, permissionIds } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const success = await updateRole(roleId, name, description, permissionIds || [])

    if (!success) {
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissionMiddleware("users.manage_roles")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const roleId = Number.parseInt(params.id)
    const success = await deleteRole(roleId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
