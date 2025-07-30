import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await sql`
      SELECT * FROM notification_preferences 
      WHERE user_id = ${Number.parseInt(session.user.id)}
    `

    return NextResponse.json(preferences[0] || {})
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await request.json()

    await sql`
      INSERT INTO notification_preferences (
        user_id, email_notifications, site_status_changes,
        deployment_milestones, user_assignments, weekly_reports
      ) VALUES (
        ${Number.parseInt(session.user.id)}, ${preferences.email_notifications},
        ${preferences.site_status_changes}, ${preferences.deployment_milestones},
        ${preferences.user_assignments}, ${preferences.weekly_reports}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        site_status_changes = EXCLUDED.site_status_changes,
        deployment_milestones = EXCLUDED.deployment_milestones,
        user_assignments = EXCLUDED.user_assignments,
        weekly_reports = EXCLUDED.weekly_reports,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
