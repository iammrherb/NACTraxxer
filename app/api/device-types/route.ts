import { type NextRequest, NextResponse } from "next/server"
import { getDeviceTypes, createDeviceType } from "@/lib/api"

export async function GET() {
  try {
    const deviceTypes = await getDeviceTypes()
    return NextResponse.json(deviceTypes)
  } catch (error) {
    console.error("Error fetching device types:", error)
    return NextResponse.json({ error: "Failed to fetch device types" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const deviceTypeData = await request.json()
    const deviceType = await createDeviceType(deviceTypeData)
    return NextResponse.json(deviceType)
  } catch (error) {
    console.error("Error creating device type:", error)
    return NextResponse.json({ error: "Failed to create device type" }, { status: 500 })
  }
}
