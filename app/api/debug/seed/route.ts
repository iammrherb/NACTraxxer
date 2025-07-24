import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
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
  try {
    console.log("Starting database seed process...")

    // Clear existing data in order
    console.log("Clearing existing data...")
    await supabaseAdmin.from('site_technical_owners').delete().neq('site_id', '')
    await supabaseAdmin.from('site_vendors').delete().neq('site_id', '')
    await supabaseAdmin.from('site_device_types').delete().neq('site_id', '')
    await supabaseAdmin.from('site_checklist_items').delete().neq('site_id', '')
    await supabaseAdmin.from('site_use_cases').delete().neq('site_id', '')
    await supabaseAdmin.from('site_test_matrix').delete().neq('site_id', '')
    await supabaseAdmin.from('sites').delete().neq('id', '')
    await supabaseAdmin.from('users').delete().gt('id', 0)
    await supabaseAdmin.from('vendors').delete().neq('id', '')
    await supabaseAdmin.from('device_types').delete().neq('id', '')
    await supabaseAdmin.from('checklist_items').delete().neq('id', '')
    await supabaseAdmin.from('use_cases').delete().neq('id', '')
    await supabaseAdmin.from('requirements').delete().neq('id', '')
    await supabaseAdmin.from('test_matrix').delete().neq('id', '')
    console.log("Existing data cleared.")

    // Insert Users
    console.log("Seeding users...")
    if (mockUsers.length > 0) {
      const { error } = await supabaseAdmin.from('users').insert(mockUsers)
      if (error) throw error
    }

    // Insert Vendors
    console.log("Seeding vendors...")
    const allVendors = [...mockWiredVendors, ...mockWirelessVendors]
    if (allVendors.length > 0) {
      const { error } = await supabaseAdmin.from('vendors').insert(allVendors)
      if (error) throw error
    }

    // Insert Device Types
    console.log("Seeding device types...")
    if (mockDeviceTypes.length > 0) {
      const { error } = await supabaseAdmin.from('device_types').insert(mockDeviceTypes)
      if (error) throw error
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
      const { error } = await supabaseAdmin.from('sites').insert(mockSites)
      if (error) throw error
    }

    // Insert Site Relations
    console.log("Seeding site relations...")
    for (const site of mockSites) {
      if (site.technical_owners?.length) {
        const relations = site.technical_owners.map(u => ({ site_id: site.id, user_id: u.id }))
        await supabaseAdmin.from('site_technical_owners').insert(relations)
      }
      if (site.vendors?.length) {
        const relations = site.vendors.map(v => ({ site_id: site.id, vendor_id: v.id }))
        await supabaseAdmin.from('site_vendors').insert(relations)
      }
      if (site.device_types?.length) {
        const relations = site.device_types.map(d => ({ site_id: site.id, device_type_id: d.id }))
        await supabaseAdmin.from('site_device_types').insert(relations)
      }
      if (site.checklist_items?.length) {
        const relations = site.checklist_items.map(i => ({ 
          site_id: site.id, 
          checklist_item_id: i.id, 
          completed: i.completed || false 
        }))
        await supabaseAdmin.from('site_checklist_items').insert(relations)
      }
      if (site.use_case_ids?.length) {
        const relations = site.use_case_ids.map(id => ({ site_id: site.id, use_case_id: id }))
        await supabaseAdmin.from('site_use_cases').insert(relations)
      }
      if (site.test_matrix_ids?.length) {
        const relations = site.test_matrix_ids.map(id => ({ site_id: site.id, test_matrix_id: id }))
        await supabaseAdmin.from('site_test_matrix').insert(relations)
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
