import { type NextRequest, NextResponse } from "next/server"
import { getSites, createSite } from "@/lib/api"

export async function GET() {
  try {
    const sites = await getSites()
    return NextResponse.json(sites)
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()
    const site = await createSite(siteData)
    return NextResponse.json(site)
  } catch (error) {
    console.error("Error creating site:", error)
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 })
  }
}
