import { type NextRequest, NextResponse } from "next/server"
import { getAllSites, createSite } from "@/lib/data"

export async function GET() {
  try {
    const sites = await getAllSites()
    return NextResponse.json(sites)
  } catch (error) {
    console.error("Error in GET /api/sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const site = await createSite(body)
    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/sites:", error)
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 })
  }
}
