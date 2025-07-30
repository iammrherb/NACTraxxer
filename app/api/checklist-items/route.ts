import { type NextRequest, NextResponse } from "next/server"
import { getChecklistItems, createChecklistItem } from "@/lib/api"

export async function GET() {
  try {
    const checklistItems = await getChecklistItems()
    return NextResponse.json(checklistItems)
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    return NextResponse.json({ error: "Failed to fetch checklist items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()
    const item = await createChecklistItem(itemData)
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating checklist item:", error)
    return NextResponse.json({ error: "Failed to create checklist item" }, { status: 500 })
  }
}
