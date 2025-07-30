import { type NextRequest, NextResponse } from "next/server"
import { getAllVendors, createVendor } from "@/lib/data"

export async function GET() {
  try {
    const vendors = await getAllVendors()
    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Error in GET /api/vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vendor = await createVendor(body)
    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/vendors:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
