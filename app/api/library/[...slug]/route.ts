import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

const TABLE_MAP: Record<string, string> = {
  "use-cases": "use_cases",
  "test-cases": "test_cases",
  requirements: "requirements",
  "device-types": "device_types",
  vendors: "vendors",
  "checklist-items": "checklist_items",
}

// GET /api/library/[itemType]
async function getCollection(itemType: string) {
  const tableName = TABLE_MAP[itemType]
  if (!tableName) {
    return NextResponse.json({ error: "Invalid library item type" }, { status: 400 })
  }
  const items = await sql`SELECT * FROM ${sql(tableName)} ORDER BY id`
  return NextResponse.json(items)
}

// POST /api/library/[itemType]
async function createItem(req: Request, itemType: string) {
  const tableName = TABLE_MAP[itemType]
  if (!tableName) {
    return NextResponse.json({ error: "Invalid library item type" }, { status: 400 })
  }
  const body = await req.json()
  // Basic validation
  if (!body.name && !body.title && !body.description) {
    return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
  }

  // Ensure is_custom is set for new items
  body.is_custom = true

  const [newItem] = await sql`INSERT INTO ${sql(tableName)} ${sql(body)} RETURNING *`
  return NextResponse.json(newItem, { status: 201 })
}

// GET /api/library/[itemType]/[id]
async function getItem(itemType: string, id: string) {
  const tableName = TABLE_MAP[itemType]
  if (!tableName) {
    return NextResponse.json({ error: "Invalid library item type" }, { status: 400 })
  }
  const [item] = await sql`SELECT * FROM ${sql(tableName)} WHERE id = ${id}`
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  return NextResponse.json(item)
}

// PUT /api/library/[itemType]/[id]
async function updateItem(req: Request, itemType: string, id: string) {
  const tableName = TABLE_MAP[itemType]
  if (!tableName) {
    return NextResponse.json({ error: "Invalid library item type" }, { status: 400 })
  }
  const body = await req.json()
  delete body.id // Prevent changing the ID

  const [updatedItem] = await sql`UPDATE ${sql(tableName)} SET ${sql(body)} WHERE id = ${id} RETURNING *`
  if (!updatedItem) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  return NextResponse.json(updatedItem)
}

// DELETE /api/library/[itemType]/[id]
async function deleteItem(itemType: string, id: string) {
  const tableName = TABLE_MAP[itemType]
  if (!tableName) {
    return NextResponse.json({ error: "Invalid library item type" }, { status: 400 })
  }
  const result = await sql`DELETE FROM ${sql(tableName)} WHERE id = ${id} AND is_custom = TRUE`
  if (result.count === 0) {
    return NextResponse.json({ error: "Item not found or is not a custom item" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = params
  if (slug.length === 1) {
    return getCollection(slug[0])
  }
  if (slug.length === 2) {
    return getItem(slug[0], slug[1])
  }
  return NextResponse.json({ error: "Invalid API route" }, { status: 400 })
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = params
  if (slug.length === 1) {
    return createItem(req, slug[0])
  }
  return NextResponse.json({ error: "Invalid API route" }, { status: 400 })
}

export async function PUT(req: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = params
  if (slug.length === 2) {
    return updateItem(req, slug[0], slug[1])
  }
  return NextResponse.json({ error: "Invalid API route" }, { status: 400 })
}

export async function DELETE(req: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = params
  if (slug.length === 2) {
    return deleteItem(slug[0], slug[1])
  }
  return NextResponse.json({ error: "Invalid API route" }, { status: 400 })
}
