import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const deviceTypes = await sql`SELECT id, name, description FROM device_types ORDER BY name;`
    return NextResponse.json(deviceTypes)
  } catch (error) {
    console.error("Error fetching device types:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch device types", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const deviceTypeData = await request.json()
    const { name, description } = deviceTypeData

    if (!name) {
      return NextResponse.json({ error: "Missing required field: name" }, { status: 400 })
    }

    const newDeviceType = await sql`
      INSERT INTO device_types (name, description)
      VALUES (${name}, ${description || null})
      RETURNING id, name, description;
    `
    return NextResponse.json(newDeviceType[0], { status: 201 })
  } catch (error) {
    console.error("Error creating device type:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to create device type", details: errorMessage }, { status: 500 })
  }
}
