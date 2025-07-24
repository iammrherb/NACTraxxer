import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET all questionnaires
export async function GET() {
  try {
    const questionnaires = await sql`SELECT * FROM scoping_questionnaires ORDER BY created_at DESC`
    return NextResponse.json(questionnaires)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch questionnaires", error: error.message }, { status: 500 })
  }
}

// POST a new questionnaire
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      organizationName,
      totalUsers,
      siteCount,
      country,
      region,
      industry,
      projectGoals,
      legacySystems,
      wiredVendors,
      wirelessVendors,
    } = data

    const result = await sql`
      INSERT INTO scoping_questionnaires (
        organization_name, total_users, site_count, country, region, industry,
        project_goals, legacy_systems, wired_vendors, wireless_vendors
      ) VALUES (
        ${organizationName}, ${totalUsers}, ${siteCount}, ${country}, ${region}, ${industry},
        ${JSON.stringify(projectGoals || [])},
        ${JSON.stringify(legacySystems || [])},
        ${JSON.stringify(wiredVendors || [])},
        ${JSON.stringify(wirelessVendors || [])}
      )
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create questionnaire", error: error.message }, { status: 500 })
  }
}
