import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import {
  mockUsers,
  mockWiredVendors,
  mockWirelessVendors,
  mockDeviceTypes,
  mockChecklistItems,
  mockSites,
  useCasesData,
  requirementsData,
  testMatrixData,
} from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function POST() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    console.log("Starting database seed process...")

    // Clear existing data in order
    console.log("Clearing existing data...")
    await sql`DELETE FROM site_technical_owners;`
    await sql`DELETE FROM site_vendors;`
    await sql`DELETE FROM site_device_types;`
    await sql`DELETE FROM site_checklist_items;`
    await sql`DELETE FROM site_use_cases;`
    await sql`DELETE FROM site_test_matrix;`
    await sql`DELETE FROM sites;`
    await sql`DELETE FROM users WHERE id > 0;`
    await sql`DELETE FROM vendors;`
    await sql`DELETE FROM device_types;`
    await sql`DELETE FROM checklist_items;`
    await sql`DELETE FROM use_cases;`
    await sql`DELETE FROM requirements;`
    await sql`DELETE FROM test_matrix;`
    console.log("Existing data cleared.")

    // Insert Users
    console.log("Seeding users...")
    if (mockUsers.length > 0) {
      await sql`
      INSERT INTO users (id, name, email, role, user_type)
      SELECT * FROM UNNEST(
        ${sql.array(mockUsers.map((u) => u.id))},
        ${sql.array(mockUsers.map((u) => u.name))},
        ${sql.array(mockUsers.map((u) => u.email))},
        ${sql.array(mockUsers.map((u) => u.role))},
        ${sql.array(mockUsers.map((u) => u.user_type))}
      )
    `
    }

    // Insert Vendors
    console.log("Seeding vendors...")
    const allVendors = [...mockWiredVendors, ...mockWirelessVendors]
    if (allVendors.length > 0) {
      await sql`
      INSERT INTO vendors (id, name, type, is_custom)
      SELECT * FROM UNNEST(
        ${sql.array(allVendors.map((v) => v.id))},
        ${sql.array(allVendors.map((v) => v.name))},
        ${sql.array(allVendors.map((v) => v.type))},
        ${sql.array(allVendors.map((v) => v.is_custom))}
      )
    `
    }

    // Insert Device Types
    console.log("Seeding device types...")
    if (mockDeviceTypes.length > 0) {
      await sql`
      INSERT INTO device_types (id, name, is_custom)
      SELECT * FROM UNNEST(
        ${sql.array(mockDeviceTypes.map((d) => d.id))},
        ${sql.array(mockDeviceTypes.map((d) => d.name))},
        ${sql.array(mockDeviceTypes.map((d) => d.is_custom))}
      )
    `
    }

    // Insert Checklist Items
    console.log("Seeding checklist items...")
    if (mockChecklistItems.length > 0) {
      await sql`
      INSERT INTO checklist_items (id, name, category, is_custom)
      SELECT * FROM UNNEST(
        ${sql.array(mockChecklistItems.map((c) => c.id))},
        ${sql.array(mockChecklistItems.map((c) => c.name))},
        ${sql.array(mockChecklistItems.map((c) => c.category))},
        ${sql.array(mockChecklistItems.map((c) => c.is_custom))}
      )
    `
    }

    // Insert Requirements
    console.log("Seeding requirements...")
    if (requirementsData.length > 0) {
      await sql`
      INSERT INTO requirements (id, description, justification, met_status)
      SELECT * FROM UNNEST(
        ${sql.array(requirementsData.map((r) => r.id))},
        ${sql.array(requirementsData.map((r) => r.description))},
        ${sql.array(requirementsData.map((r) => r.justification))},
        ${sql.array(requirementsData.map((r) => r.metStatus))}
      )
    `
    }

    // Insert Use Cases
    console.log("Seeding use cases...")
    if (useCasesData.length > 0) {
      await sql`
      INSERT INTO use_cases (id, title, category, description, priority, status, completion_percentage, requirement_ids)
      SELECT * FROM UNNEST(
        ${sql.array(useCasesData.map((u) => u.id))},
        ${sql.array(useCasesData.map((u) => u.title))},
        ${sql.array(useCasesData.map((u) => u.category))},
        ${sql.array(useCasesData.map((u) => u.description))},
        ${sql.array(useCasesData.map((u) => u.priority))},
        ${sql.array(useCasesData.map((u) => u.status))},
        ${sql.array(useCasesData.map((u) => u.completion_percentage))},
        ${sql.array(
          useCasesData.map((u) => u.requirement_ids),
          "text[]",
        )}
      )
    `
    }

    // Insert Test Matrix
    console.log("Seeding test matrix...")
    if (testMatrixData.length > 0) {
      await sql`
      INSERT INTO test_matrix (id, platform, mode, type, "configurationPortnoxCloud", "configurationCalixNAS", "configurationIntuneJamf", "dot1xConnectionTest", "manualBlockByAdmin", "aclTest", "riskAssessmentPolicyTest", "remediationPolicyTest", notes, "detectRisk", "blockAction", remark)
      SELECT * FROM UNNEST(
        ${sql.array(testMatrixData.map((t) => t.id))},
        ${sql.array(testMatrixData.map((t) => t.platform))},
        ${sql.array(testMatrixData.map((t) => t.mode))},
        ${sql.array(testMatrixData.map((t) => t.type))},
        ${sql.array(testMatrixData.map((t) => t.configurationPortnoxCloud))},
        ${sql.array(testMatrixData.map((t) => t.configurationCalixNAS))},
        ${sql.array(testMatrixData.map((t) => t.configurationIntuneJamf))},
        ${sql.array(testMatrixData.map((t) => t.dot1xConnectionTest))},
        ${sql.array(testMatrixData.map((t) => t.manualBlockByAdmin))},
        ${sql.array(testMatrixData.map((t) => t.aclTest))},
        ${sql.array(testMatrixData.map((t) => t.riskAssessmentPolicyTest))},
        ${sql.array(testMatrixData.map((t) => t.remediationPolicyTest))},
        ${sql.array(testMatrixData.map((t) => t.notes))},
        ${sql.array(testMatrixData.map((t) => t.detectRisk))},
        ${sql.array(testMatrixData.map((t) => t.blockAction))},
        ${sql.array(testMatrixData.map((t) => t.remark))}
      )
    `
    }

    // Insert Sites
    console.log("Seeding sites...")
    if (mockSites.length > 0) {
      await sql`
      INSERT INTO sites (id, name, region, country, priority, phase, users_count, project_manager_id, radsec, planned_start, planned_end, status, completion_percent, notes, deployment_type, auth_methods, os_details)
      SELECT * FROM UNNEST(
        ${sql.array(mockSites.map((s) => s.id))},
        ${sql.array(mockSites.map((s) => s.name))},
        ${sql.array(mockSites.map((s) => s.region))},
        ${sql.array(mockSites.map((s) => s.country))},
        ${sql.array(mockSites.map((s) => s.priority))},
        ${sql.array(mockSites.map((s) => s.phase))},
        ${sql.array(mockSites.map((s) => s.users_count))},
        ${sql.array(mockSites.map((s) => s.project_manager_id))},
        ${sql.array(mockSites.map((s) => s.radsec))},
        ${sql.array(mockSites.map((s) => s.planned_start))},
        ${sql.array(mockSites.map((s) => s.planned_end))},
        ${sql.array(mockSites.map((s) => s.status))},
        ${sql.array(mockSites.map((s) => s.completion_percent))},
        ${sql.array(mockSites.map((s) => s.notes))},
        ${sql.array(mockSites.map((s) => s.deployment_type))},
        ${sql.array(
          mockSites.map((s) => s.auth_methods),
          "text[]",
        )},
        ${sql.array(
          mockSites.map((s) => JSON.stringify(s.os_details)),
          "jsonb",
        )}
      )
    `
    }

    // Insert Site Relations
    console.log("Seeding site relations...")
    for (const site of mockSites) {
      if (site.technical_owners?.length) {
        await sql`
          INSERT INTO site_technical_owners (site_id, user_id)
          SELECT ${site.id}, UNNEST(${sql.array(site.technical_owners.map((u) => u.id))})
        `
      }
      const vendorIds = (site.vendors || []).map((v) => v.id)
      if (vendorIds.length) {
        await sql`
          INSERT INTO site_vendors (site_id, vendor_id)
          SELECT ${site.id}, UNNEST(${sql.array(vendorIds)})
        `
      }
      const deviceTypeIds = (site.device_types || []).map((d) => d.id)
      if (deviceTypeIds.length) {
        await sql`
          INSERT INTO site_device_types (site_id, device_type_id)
          SELECT ${site.id}, UNNEST(${sql.array(deviceTypeIds)})
        `
      }
      const checklistItems = site.checklist_items || []
      if (checklistItems.length) {
        await sql`
          INSERT INTO site_checklist_items (site_id, checklist_item_id, completed)
          SELECT ${site.id}, item_id, completed FROM UNNEST(
            ${sql.array(checklistItems.map((i) => i.id))},
            ${sql.array(checklistItems.map((i) => i.completed || false))}
          ) AS t(item_id, completed)
        `
      }
      if (site.use_case_ids?.length) {
        await sql`
          INSERT INTO site_use_cases (site_id, use_case_id)
          SELECT ${site.id}, UNNEST(${sql.array(site.use_case_ids)})
        `
      }
      if (site.test_matrix_ids?.length) {
        await sql`
          INSERT INTO site_test_matrix (site_id, test_matrix_id)
          SELECT ${site.id}, UNNEST(${sql.array(site.test_matrix_ids)})
        `
      }
    }

    console.log("Database seed process completed successfully.")
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Failed to seed database:", error)
    return NextResponse.json({ error: "Failed to seed database", details: errorMessage }, { status: 500 })
  }
}
