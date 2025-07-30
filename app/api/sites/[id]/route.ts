import { type NextRequest, NextResponse } from "next/server"
import { getSiteById, updateSite, deleteSite } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const site = await getSiteById(Number.parseInt(params.id))
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }
    return NextResponse.json(site)
  } catch (error) {
    console.error("Error in GET /api/sites/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch site" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const site = await updateSite(Number.parseInt(params.id), body)
    return NextResponse.json(site)
  } catch (error) {
    console.error("Error in PUT /api/sites/[id]:", error)
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteSite(Number.parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/sites/[id]:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}
