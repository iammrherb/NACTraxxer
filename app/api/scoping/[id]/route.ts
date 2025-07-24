import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

// GET a single questionnaire by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`SELECT * FROM scoping_questionnaires WHERE id = ${id}`
    if (result.length === 0) {
      return NextResponse.json({ message: "Questionnaire not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch questionnaire", error: error.message }, { status: 500 })
  }
}

// PUT (update) a questionnaire
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    // Destructure all fields from data
    const {
      organization_name,
      total_users,
      site_count,
      country,
      region,
      industry,
      project_goals,
      legacy_systems,
      wired_vendors,
      wireless_vendors,
      status,
    } = data

    const result = await sql`
      UPDATE scoping_questionnaires
      SET
        organization_name = ${organization_name},
        total_users = ${total_users},
        site_count = ${site_count},
        country = ${country},
        region = ${region},
        industry = ${JSON.stringify(industry || [])},
        project_goals = ${JSON.stringify(project_goals || [])},
        legacy_systems = ${JSON.stringify(legacy_systems || [])},
        wired_vendors = ${JSON.stringify(wired_vendors || [])},
        wireless_vendors = ${JSON.stringify(wireless_vendors || [])},
        status = ${status}
      WHERE id = ${id}
      RETURNING *
    `
    if (result.length === 0) {
      return NextResponse.json({ message: "Questionnaire not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update questionnaire", error: error.message }, { status: 500 })
  }
}

// DELETE a questionnaire
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`DELETE FROM scoping_questionnaires WHERE id = ${id} RETURNING id`
    if (result.length === 0) {
      return NextResponse.json({ message: "Questionnaire not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Questionnaire deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete questionnaire", error: error.message }, { status: 500 })
  }
}
