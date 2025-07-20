import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const [useCase] = await sql`
      SELECT * FROM use_cases WHERE id = ${id}
    `
    if (!useCase) {
      return NextResponse.json({ message: "Use case not found" }, { status: 404 })
    }
    return NextResponse.json(useCase)
  } catch (error) {
    console.error(`Error fetching use case ${params.id}:`, error)
    return NextResponse.json({ message: "Error fetching use case" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Dynamically build the update query based on fields present in the body
    const fields = Object.keys(body)
    const values = Object.values(body)

    if (fields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }

    const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const query = `UPDATE use_cases SET ${setClauses}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`
    const queryParams = [...values, id]

    const [updatedUseCase] = await sql.query(query, queryParams)

    if (!updatedUseCase) {
      return NextResponse.json({ message: "Use case not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUseCase)
  } catch (error) {
    console.error(`Error updating use case ${params.id}:`, error)
    return NextResponse.json({ message: "Error updating use case" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`
      DELETE FROM use_cases WHERE id = ${id}
    `
    if (result.count === 0) {
      return NextResponse.json({ message: "Use case not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Use case deleted successfully" })
  } catch (error) {
    console.error(`Error deleting use case ${params.id}:`, error)
    return NextResponse.json({ message: "Error deleting use case" }, { status: 500 })
  }
}
