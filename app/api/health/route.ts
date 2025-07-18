import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/database"

export async function GET() {
  try {
    const dbConnected = await testDatabaseConnection()

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected",
      version: "1.0.0",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
