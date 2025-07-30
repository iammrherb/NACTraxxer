import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const reportId = Number.parseInt(params.id, 10)
    if (isNaN(reportId)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 })
    }

    await sql`
      UPDATE reports
      SET download_count = download_count + 1
      WHERE id = ${reportId}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to increment download count:", error)
    // This is a non-critical operation, so we don't want to block the user's download.
    // We log the error but return a success-like response to the client.
    return NextResponse.json({ error: "Failed to update count, but download can proceed." }, { status: 200 })
  }
}
