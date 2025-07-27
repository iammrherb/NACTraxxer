import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = createClient()
  try {
    const { ids, updates } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0 || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Ensure only allowed fields are updated
    const allowedUpdates: { [key: string]: any } = {}
    if (updates.status) allowedUpdates.status = updates.status
    if (updates.priority) allowedUpdates.priority = updates.priority
    // Add other allowed fields here in the future

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data, error } = await supabase.from("sites").update(allowedUpdates).in("id", ids).select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: `${data.length} sites updated successfully.`,
      data,
    })
  } catch (error: any) {
    console.error("Bulk update failed:", error)
    return NextResponse.json({ error: "Failed to perform bulk update.", details: error.message }, { status: 500 })
  }
}
