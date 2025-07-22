import { type NextRequest, NextResponse } from "next/server"
import { getReports } from "@/lib/reports"

export async function GET(request: NextRequest) {
  try {
    // Using a mock user ID as auth is not fully implemented for this preview
    const mockUserId = 1

    const reports = await getReports(mockUserId)
    return NextResponse.json(reports)
  } catch (error) {
    console.error("API Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports due to a server error" }, { status: 500 })
  }
}
