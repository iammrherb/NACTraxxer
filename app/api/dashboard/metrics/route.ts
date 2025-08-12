import { NextResponse } from "next/server"
import { getDashboardMetrics } from "@/lib/data"

export async function GET() {
  try {
    const metrics = await getDashboardMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error in GET /api/dashboard/metrics:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
}
