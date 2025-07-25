import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { siteId: string } }) {
  const supabase = createClient()
  const { itemId, completed, assignedUserId, dueDate } = await request.json()

  if (!itemId) {
    return NextResponse.json({ error: "Checklist item ID is required" }, { status: 400 })
  }

  const updateData: {
    site_id: string
    checklist_item_id: number
    completed?: boolean
    assigned_user_id?: string | null
    due_date?: string | null
  } = {
    site_id: params.siteId,
    checklist_item_id: itemId,
  }

  if (typeof completed === "boolean") {
    updateData.completed = completed
  }
  if (assignedUserId !== undefined) {
    updateData.assigned_user_id = assignedUserId
  }
  if (dueDate !== undefined) {
    updateData.due_date = dueDate
  }

  const { data, error } = await supabase
    .from("site_checklist_items")
    .upsert(updateData, { onConflict: "site_id, checklist_item_id" })
    .select()
    .single()

  if (error) {
    console.error("Error updating checklist item:", error)
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 })
  }

  return NextResponse.json(data)
}
