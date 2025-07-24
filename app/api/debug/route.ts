import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import { mockSites, mockUsers } from "@/lib/library-data"

async function seed() {
  console.log("Starting database seed...")
  // Clear existing data
  await supabaseAdmin.from('tasks').delete().neq('id', '')
  console.log("Tasks cleared.")
  await supabaseAdmin.from('sites').delete().neq('id', '')
  console.log("Sites cleared.")
  await supabaseAdmin.from('users').delete().neq('id', '')
  console.log("Users cleared.")

  // Seed users
  console.log(`Seeding ${mockUsers.length} users...`)
  const { error: usersError } = await supabaseAdmin.from('users').insert(mockUsers)
  if (usersError) throw usersError
  console.log("Users seeded.")

  // Seed sites
  console.log(`Seeding ${mockSites.length} sites...`)
  const { error: sitesError } = await supabaseAdmin.from('sites').insert(mockSites)
  if (sitesError) throw sitesError
  console.log("Sites seeded.")

  return { message: "Database seeded successfully" }
}

async function clear() {
  console.log("Clearing site data...")
  await supabaseAdmin.from('tasks').delete().neq('id', '')
  await supabaseAdmin.from('sites').delete().neq('id', '')
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
