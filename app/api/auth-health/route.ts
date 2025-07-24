import { NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const healthInfo = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        isValid: true,
        errors: [] as string[],
        warnings: [] as string[],
        nodeEnv: process.env.NODE_ENV || "development",
      },
      database: {
        connected: false,
        url: process.env.DATABASE_URL ? "configured" : "not configured",
      },
      services: {
        api: "running",
        database: "checking...",
      },
    }

    // Test database connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      if (error) throw error
      healthInfo.database.connected = true
      healthInfo.services.database = "connected"
    } catch (error) {
      healthInfo.database.connected = false
      healthInfo.services.database = "disconnected"
      healthInfo.environment.errors.push("Database connection failed")
      healthInfo.environment.isValid = false
    }

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      healthInfo.environment.warnings.push("NEXT_PUBLIC_SUPABASE_URL not configured")
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      healthInfo.environment.warnings.push("NEXT_PUBLIC_SUPABASE_ANON_KEY not configured")
    }

    return NextResponse.json(healthInfo)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
