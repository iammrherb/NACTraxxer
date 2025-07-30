import { NextResponse } from "next/server"
import { getSiteStats } from "@/lib/data"

export async function GET() {
  try {
    const stats = await getSiteStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in GET /api/sites/stats:", error)
    return NextResponse.json({ error: "Failed to fetch site statistics" }, { status: 500 })
  }
}
