import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Test database connection
    const { data, error } = await supabase.from("projects").select("count").limit(1)

    if (error) {
      console.error("Database health check failed:", error)
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Service unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
