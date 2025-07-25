import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const checklistItems =
      await sql`SELECT id, name, description, category FROM checklist_items ORDER BY category, name;`
    return NextResponse.json(checklistItems)
  } catch (error) {
    console.error("Error fetching checklist items:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch checklist items", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()
    const { name, description, category } = itemData

    if (!name || !category) {
      return NextResponse.json({ error: "Missing required fields: name, category" }, { status: 400 })
    }

    const newItem = await sql`
      INSERT INTO checklist_items (name, description, category)
      VALUES (${name}, ${description || null}, ${category})
      RETURNING id, name, description, category;
    `
    return NextResponse.json(newItem[0], { status: 201 })
  } catch (error) {
    console.error("Error creating checklist item:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to create checklist item", details: errorMessage }, { status: 500 })
  }
}
