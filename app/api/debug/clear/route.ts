import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function DELETE() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    console.log("Starting database clear process...")

    // Clear existing data in order of dependencies
    await sql`DELETE FROM site_technical_owners;`
    await sql`DELETE FROM site_vendors;`
    await sql`DELETE FROM site_device_types;`
    await sql`DELETE FROM site_checklist_items;`
    await sql`DELETE FROM site_use_cases;`
    await sql`DELETE FROM site_test_matrix;`
    await sql`DELETE FROM sites;`
    await sql`DELETE FROM users WHERE id > 0;` // Keep user with ID 0 if it's a special admin
    await sql`DELETE FROM vendors;`
    await sql`DELETE FROM device_types;`
    await sql`DELETE FROM checklist_items;`
    await sql`DELETE FROM use_cases;`
    await sql`DELETE FROM requirements;`
    await sql`DELETE FROM test_matrix;`

    console.log("Database clear process completed successfully.")
    return NextResponse.json({ message: "All site data has been cleared." })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Failed to clear database:", error)
    return NextResponse.json({ error: "Failed to clear database", details: errorMessage }, { status: 500 })
  }
}
