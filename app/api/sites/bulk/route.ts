import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { ids, updates } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Site IDs are required" }, { status: 400 })
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Updates are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Build the update object with only provided fields
    const updateData: any = {}
    if (updates.status) updateData.status = updates.status
    if (updates.priority) updateData.priority = updates.priority
    if (updates.project_manager) updateData.project_manager = updates.project_manager
    if (updates.phase) updateData.phase = updates.phase
    if (updates.completion_percent !== undefined) updateData.completion_percent = updates.completion_percent

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("sites").update(updateData).in("id", ids).select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update sites" }, { status: 500 })
    }

    return NextResponse.json({
      message: `Successfully updated ${data.length} sites`,
      updatedSites: data,
    })
  } catch (error) {
    console.error("Bulk update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
