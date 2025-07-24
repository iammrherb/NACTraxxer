import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { mockSites, mockUsers } from "@/lib/library-data"

const sql = neon(process.env.DATABASE_URL!)

async function seed() {
  console.log("Starting database seed...")
  // Clear existing data
  await sql`DELETE FROM tasks;`
  console.log("Tasks cleared.")
  await sql`DELETE FROM sites;`
  console.log("Sites cleared.")
  await sql`DELETE FROM users;`
  console.log("Users cleared.")

  // Seed users
  console.log(`Seeding ${mockUsers.length} users...`)
  for (const user of mockUsers) {
    await sql`
      INSERT INTO users (id, name, email, role, user_type)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.role}, ${user.user_type})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        user_type = EXCLUDED.user_type;
    `
  }
  console.log("Users seeded.")

  // Seed sites
  console.log(`Seeding ${mockSites.length} sites...`)
  for (const site of mockSites) {
    await sql`
      INSERT INTO sites (id, name, customer_name, country, region, site_code, status, deployment_type, project_manager_id, technical_owner_id, progress, health, auth_test_status, vendors, device_types, use_cases)
      VALUES (
        ${site.id}, ${site.name}, ${site.customer_name}, ${site.country}, ${site.region}, ${site.site_code}, ${site.status}, ${site.deployment_type}, ${site.project_manager_id}, ${site.technical_owner_id}, ${site.progress}, ${site.health}, ${site.auth_test_status}, ${JSON.stringify(site.vendors)}, ${JSON.stringify(site.device_types)}, ${JSON.stringify(site.use_cases)}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        customer_name = EXCLUDED.customer_name,
        country = EXCLUDED.country,
        region = EXCLUDED.region,
        site_code = EXCLUDED.site_code,
        status = EXCLUDED.status,
        deployment_type = EXCLUDED.deployment_type,
        project_manager_id = EXCLUDED.project_manager_id,
        technical_owner_id = EXCLUDED.technical_owner_id,
        progress = EXCLUDED.progress,
        health = EXCLUDED.health,
        auth_test_status = EXCLUDED.auth_test_status,
        vendors = EXCLUDED.vendors,
        device_types = EXCLUDED.device_types,
        use_cases = EXCLUDED.use_cases;
    `
  }
  console.log("Sites seeded.")

  // Reset sequences
  await sql`SELECT setval('sites_id_seq', (SELECT COALESCE(MAX(id), 1) FROM sites));`
  await sql`SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));`
  console.log("Sequences reset.")

  return { message: "Database seeded successfully" }
}

async function clear() {
  console.log("Clearing site data...")
  await sql`DELETE FROM tasks;`
  await sql`DELETE FROM sites;`
  console.log("Site data cleared.")
  return { message: "Site data cleared successfully" }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    if (action === "seed") {
      const result = await seed()
      return NextResponse.json(result)
    }
    if (action === "clear") {
      const result = await clear()
      return NextResponse.json(result)
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Debug API Error:", errorMessage)
    return NextResponse.json({ error: "Internal Server Error", message: errorMessage }, { status: 500 })
  }
}
