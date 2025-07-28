import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const preferences = await sql`
      SELECT * FROM notification_preferences
      ORDER BY created_at DESC
    `

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email_notifications, push_notifications, sms_notifications } = body

    const preference = await sql`
      INSERT INTO notification_preferences (
        email_notifications, 
        push_notifications, 
        sms_notifications,
        created_at
      )
      VALUES (${email_notifications}, ${push_notifications}, ${sms_notifications}, NOW())
      RETURNING *
    `

    return NextResponse.json(preference[0])
  } catch (error) {
    console.error("Error saving notification preferences:", error)
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
