import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateReport, type ReportParameters } from "@/lib/reports"
import { logActivity } from "@/lib/activity-logger"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.permissions?.can_generate_reports) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const parameters: ReportParameters = await request.json()
    const userId = Number.parseInt(session.user.id, 10)

    const result = await generateReport(parameters, userId)

    await logActivity({
      userId: userId,
      action: "report_generated",
      entityType: "report",
      entityId: result.reportId.toString(),
      newValues: {
        reportType: parameters.reportType,
        url: result.url,
      },
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") || "Unknown",
    })

    if (session.user.email) {
      await sendEmail({
        to: session.user.email,
        subject: "Your Report is Ready",
        html: `
          <h2>Report Generation Complete</h2>
          <p>Your ${parameters.reportType.replace(/_/g, " ")} report has been generated successfully.</p>
          <p>You can now download it from the reports dashboard in the application.</p>
          <p><em>This is an automated notification from the Portnox Deployment Tracker.</em></p>
        `,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API Report generation error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unexpected internal error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
