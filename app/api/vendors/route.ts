import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "wired" | "wireless" | "firewall" | "security" | null

    let vendors
    if (type) {
      vendors = await sql`SELECT id, name, type FROM vendors WHERE type = ${type} ORDER BY name;`
    } else {
      vendors = await sql`SELECT id, name, type FROM vendors ORDER BY name;`
    }

    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Error fetching vendors:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch vendors", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json()
    const { name, type } = vendorData

    if (!name || !type) {
      return NextResponse.json({ error: "Missing required fields: name, type" }, { status: 400 })
    }

    const newVendor = await sql`
      INSERT INTO vendors (name, type)
      VALUES (${name}, ${type})
      RETURNING id, name, type;
    `
    return NextResponse.json(newVendor[0], { status: 201 })
  } catch (error) {
    console.error("Error creating vendor:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to create vendor", details: errorMessage }, { status: 500 })
  }
}
