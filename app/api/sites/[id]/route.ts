import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const site = await sql`
      SELECT 
        s.*,
        pm.name as project_manager_name,
        to_char(s.planned_start, 'YYYY-MM-DD') as planned_start,
        to_char(s.planned_end, 'YYYY-MM-DD') as planned_end
      FROM sites s
      LEFT JOIN users pm ON s.project_manager_id = pm.id
      WHERE s.id = ${params.id};
    `
    if (site.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }
    return NextResponse.json(site[0])
  } catch (error) {
    console.error("Error fetching site:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch site", details: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updatedSite = await sql`
      UPDATE sites
      SET
        name = ${name},
        customer_name = ${customer_name},
        country = ${country},
        region = ${region},
        site_code = ${site_code},
        status = ${status},
        deployment_type = ${deployment_type},
        project_manager_id = ${project_manager_id},
        technical_owner_id = ${technical_owner_id},
        progress = ${progress},
        health = ${health},
        auth_test_status = ${auth_test_status},
        vendors = ${JSON.stringify(vendors)},
        device_types = ${JSON.stringify(device_types)},
        use_cases = ${JSON.stringify(use_cases)},
        planned_start = ${planned_start},
        planned_end = ${planned_end},
        completion_percent = ${completion_percent},
        users_count = ${users_count},
        project_id = ${project_id},
        vendor_ids = ${JSON.stringify(vendor_ids)},
        device_type_ids = ${JSON.stringify(device_type_ids)},
        use_case_ids = ${JSON.stringify(use_case_ids)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *;
    `
    if (updatedSite.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }
    return NextResponse.json(updatedSite[0])
  } catch (error) {
    console.error("Error updating site:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to update site", details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`DELETE FROM sites WHERE id = ${params.id} RETURNING id;`
    if (result.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: `Site ${params.id} deleted.` })
  } catch (error) {
    console.error("Error deleting site:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to delete site", details: errorMessage }, { status: 500 })
  }
}
