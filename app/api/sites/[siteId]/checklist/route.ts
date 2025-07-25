import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { siteId: string } }) {
  const supabase = createClient()
  const { itemId, completed } = await request.json()

  if (!itemId || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("site_checklist_items")
    .upsert(
      {
        site_id: params.siteId,
        checklist_item_id: itemId,
        completed: completed,
      },
      { onConflict: "site_id, checklist_item_id" },
    )
    .select()

  if (error) {
    console.error("Error updating checklist item:", error)
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 })
  }

  return NextResponse.json(data)
}
