import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateReport, type ReportParameters } from "@/lib/reports"
import { logActivity } from "@/lib/activity-logger"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions
    if (!session.user.permissions?.can_generate_reports) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const parameters: ReportParameters = await request.json()

    const result = await generateReport(parameters, Number.parseInt(session.user.id))

    // Log activity
    await logActivity({
      userId: Number.parseInt(session.user.id),
      action: "report_generated",
      entityType: "report",
      entityId: result.reportId.toString(),
      newValues: {
        reportType: parameters.reportType,
        parameters,
      },
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent"),
    })

    // Send notification email with corrected parameters
    await sendEmail({
      to: session.user.email,
      subject: "Report Generated Successfully",
      html: `
        <h2>Report Generation Complete</h2>
        <p>Your ${parameters.reportType.replace(/_/g, " ")} report has been generated successfully.</p>
        <p>You can download it from the reports section in the application.</p>
        <p><em>This is an automated notification from the Portnox Deployment Tracker.</em></p>
      `,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
