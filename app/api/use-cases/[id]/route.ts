import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const useCase = await sql`
      SELECT * FROM use_cases WHERE id = ${params.id}
    `

    if (useCase.length === 0) {
      return NextResponse.json({ error: "Use case not found" }, { status: 404 })
    }

    return NextResponse.json(useCase[0])
  } catch (error) {
    console.error("Error in GET /api/use-cases/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch use case" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const result = await sql`
      UPDATE use_cases SET
        title = COALESCE(${body.title}, title),
        subtitle = COALESCE(${body.subtitle}, subtitle),
        description = COALESCE(${body.description}, description),
        category = COALESCE(${body.category}, category),
        priority = COALESCE(${body.priority}, priority),
        status = COALESCE(${body.status}, status),
        completion_percentage = COALESCE(${body.completion_percentage}, completion_percentage),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error in PUT /api/use-cases/[id]:", error)
    return NextResponse.json({ error: "Failed to update use case" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM use_cases WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/use-cases/[id]:", error)
    return NextResponse.json({ error: "Failed to delete use case" }, { status: 500 })
  }
}
