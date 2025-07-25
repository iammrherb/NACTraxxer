import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const sites = await sql`
      SELECT 
        s.*,
        pm.name as project_manager_name,
        to_char(s.planned_start, 'YYYY-MM-DD') as planned_start,
        to_char(s.planned_end, 'YYYY-MM-DD') as planned_end
      FROM sites s
      LEFT JOIN users pm ON s.project_manager_id = pm.id
      ORDER BY s.name;
    `
    return NextResponse.json(sites)
  } catch (error) {
    console.error("Error fetching sites:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch sites", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()
    const {
      name,
      customer_name,
      country,
      region,
      site_code,
      status,
      deployment_type,
      project_manager_id,
      technical_owner_id,
      progress,
      health,
      auth_test_status,
      vendors,
      device_types,
      use_cases,
      planned_start,
      planned_end,
      completion_percent,
      users_count,
      project_id,
      vendor_ids,
      device_type_ids,
      use_case_ids,
    } = siteData

    const newSite = await sql`
      INSERT INTO sites (
        name, customer_name, country, region, site_code, status, deployment_type, 
        project_manager_id, technical_owner_id, progress, health, auth_test_status, 
        vendors, device_types, use_cases, planned_start, planned_end, completion_percent,
        users_count, project_id, vendor_ids, device_type_ids, use_case_ids
      ) VALUES (
        ${name}, ${customer_name}, ${country}, ${region}, ${site_code}, ${status}, ${deployment_type},
        ${project_manager_id || null}, ${technical_owner_id || null}, ${progress || 0}, ${health || 100}, ${auth_test_status || "Not Tested"},
        ${JSON.stringify(vendors || [])}, ${JSON.stringify(device_types || [])}, ${JSON.stringify(use_cases || [])},
        ${planned_start || null}, ${planned_end || null}, ${completion_percent || 0}, ${users_count || 0},
        ${project_id || null}, ${JSON.stringify(vendor_ids || [])}, ${JSON.stringify(device_type_ids || [])}, ${JSON.stringify(use_case_ids || [])}
      )
      RETURNING *;
    `
    return NextResponse.json(newSite[0], { status: 201 })
  } catch (error) {
    console.error("Error creating site:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to create site", details: errorMessage }, { status: 500 })
  }
}
