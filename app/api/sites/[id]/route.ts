import { type NextRequest, NextResponse } from "next/server"
import { getSite, updateSite, deleteSite } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const site = await getSite(params.id)
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }
    return NextResponse.json(site)
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json({ error: "Failed to fetch site" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const siteData = await request.json()
    const site = await updateSite(params.id, siteData)
    return NextResponse.json(site)
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteSite(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}
