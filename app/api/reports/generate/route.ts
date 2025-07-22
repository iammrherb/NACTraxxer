import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import { generateSiteSummaryPdf } from "@/lib/reports"
import type { ReportParameters } from "@/lib/reports"
import type { Site, User } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    const params: ReportParameters = await request.json()

    const sites: Site[] = await sql`SELECT * FROM sites`
    const users: User[] = await sql`SELECT id, name FROM users`

    let pdfBuffer: Buffer
    let reportTitle = ""

    switch (params.reportType) {
      case "site_summary":
      default:
        pdfBuffer = await generateSiteSummaryPdf(sites, users)
        reportTitle = "Site Summary Report"
        break
    }

    const filename = `${reportTitle.replace(/\s/g, "_")}_${new Date().toISOString()}.pdf`

    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    // In a real app with auth, you'd get the current user's ID
    const currentUserId = 1
    const generatedByNameResult = await sql`SELECT name FROM users WHERE id = ${currentUserId}`
    const generatedByName = generatedByNameResult[0]?.name || "System"

    const newReport = {
      id: Math.floor(Math.random() * 10000),
      title: reportTitle,
      report_type: params.reportType,
      generated_by_name: generatedByName,
      generated_at: new Date().toISOString(),
      download_count: 0,
      file_path: blob.url,
    }

    // This endpoint now returns the new report object so the frontend can add it to its state
    // without needing a separate DB table for reports in this demo.
    return NextResponse.json({
      message: "Report generated successfully",
      newReport: newReport,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Failed to generate report:", error)
    return NextResponse.json({ error: "Failed to generate report", details: errorMessage }, { status: 500 })
  }
}
