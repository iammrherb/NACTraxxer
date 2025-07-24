import { type NextRequest, NextResponse } from "next/server"
import { getVendors, createVendor } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "wired" | "wireless" | null

    const vendors = await getVendors(type || undefined)
    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json()
    const vendor = await createVendor(vendorData)
    return NextResponse.json(vendor)
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
