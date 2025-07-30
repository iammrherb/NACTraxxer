import { type NextRequest, NextResponse } from "next/server"
import { getAllChecklistItems, createChecklistItem } from "@/lib/data"

export async function GET() {
  try {
    const items = await getAllChecklistItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error in GET /api/checklist:", error)
    return NextResponse.json({ error: "Failed to fetch checklist items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await createChecklistItem(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/checklist:", error)
    return NextResponse.json({ error: "Failed to create checklist item" }, { status: 500 })
  }
}
