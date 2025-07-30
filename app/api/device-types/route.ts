import { type NextRequest, NextResponse } from "next/server"
import { getAllDeviceTypes, createDeviceType } from "@/lib/data"

export async function GET() {
  try {
    const deviceTypes = await getAllDeviceTypes()
    return NextResponse.json(deviceTypes)
  } catch (error) {
    console.error("Error in GET /api/device-types:", error)
    return NextResponse.json({ error: "Failed to fetch device types" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const deviceType = await createDeviceType(body)
    return NextResponse.json(deviceType, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/device-types:", error)
    return NextResponse.json({ error: "Failed to create device type" }, { status: 500 })
  }
}
