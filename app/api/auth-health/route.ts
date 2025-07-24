import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

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
      await sql`SELECT 1 as test`
      healthInfo.database.connected = true
      healthInfo.services.database = "connected"
    } catch (error) {
      healthInfo.database.connected = false
      healthInfo.services.database = "disconnected"
      healthInfo.environment.errors.push("Database connection failed")
      healthInfo.environment.isValid = false
    }

    // Check environment variables
    if (!process.env.DATABASE_URL) {
      healthInfo.environment.warnings.push("DATABASE_URL not configured")
    }

    return NextResponse.json(healthInfo)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
