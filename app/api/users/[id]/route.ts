import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { User } from "@/lib/database"

export const dynamic = "force-dynamic"

// Update a user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL!)
  const id = Number.parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
  }

  try {
    const userData: Partial<User> = await request.json()
    const { name, email, role, user_type } = userData

    // Build the update query dynamically
    const updates: string[] = []
    const values: (string | number)[] = []
    let valueIndex = 1

    if (name) {
      updates.push(`name = $${valueIndex++}`)
      values.push(name)
    }
    if (email) {
      updates.push(`email = $${valueIndex++}`)
      values.push(email)
    }
    if (role) {
      updates.push(`role = $${valueIndex++}`)
      values.push(role)
    }
    if (user_type) {
      updates.push(`user_type = $${valueIndex++}`)
      values.push(user_type)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 })
    }

    values.push(id)
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${valueIndex} RETURNING *`

    const result = await sql(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error(`Failed to update user ${id}:`, error)
    return NextResponse.json({ error: "Failed to update user", details: errorMessage }, { status: 500 })
  }
}

// Delete a user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL!)
  const id = Number.parseInt(params.id, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
  }

  try {
    // First, check if the user is a project manager for any sites
    const sitesManaged = await sql`SELECT id FROM sites WHERE project_manager_id = ${id}`
    if (sitesManaged.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete user",
          details: `User is assigned as Project Manager for site(s): ${sitesManaged.map((s: any) => s.id).join(", ")}. Please reassign before deleting.`,
        },
        { status: 409 }, // Conflict
      )
    }

    // Unassign from technical owner roles
    await sql`DELETE FROM site_technical_owners WHERE user_id = ${id}`

    // Delete the user
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: `User ${id} deleted successfully` })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error(`Failed to delete user ${id}:`, error)
    return NextResponse.json({ error: "Failed to delete user", details: errorMessage }, { status: 500 })
  }
}
