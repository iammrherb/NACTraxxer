import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

async function getCurrentUserRole(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  return profile?.role
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id: targetUserId } = params
  const { role: newRole } = await req.json()

  if (!newRole || !["admin", "manager", "viewer"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role specified." }, { status: 400 })
  }

  // Check if the current user is an admin
  const currentUserRole = await getCurrentUserRole(supabase)
  if (currentUserRole !== "admin") {
    return NextResponse.json({ error: "Forbidden: You do not have permission to change user roles." }, { status: 403 })
  }

  // Prevent an admin from demoting themselves if they are the only one
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  if (currentUser?.id === targetUserId && newRole !== "admin") {
    const { count } = await supabase.from("users").select("*", { count: "exact" }).eq("role", "admin")
    if (count === 1) {
      return NextResponse.json({ error: "Cannot demote the only administrator." }, { status: 400 })
    }
  }

  // Update the user's role in the public.users table
  const { data, error } = await sql`
    UPDATE users
    SET role = ${newRole}
    WHERE id = ${targetUserId}
    RETURNING *
  `

  if (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
