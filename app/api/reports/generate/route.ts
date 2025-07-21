import { type NextRequest, NextResponse } from "next/server"
import { generateReport, type ReportParameters } from "@/lib/reports"

export async function POST(request: NextRequest) {
  try {
    // Using a mock user ID as auth is not fully implemented for this preview
    const mockUserId = 1

    const params = (await request.json()) as ReportParameters
    const newReport = await generateReport(params, mockUserId)

    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error("Error generating report:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: `Failed to generate report: ${errorMessage}` }, { status: 500 })
  }
}
