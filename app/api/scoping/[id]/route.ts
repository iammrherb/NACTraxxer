import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`
      SELECT * FROM scoping_questionnaire WHERE id = ${Number(id)}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching questionnaire ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch questionnaire" }, { status: 500 })
  }
}
