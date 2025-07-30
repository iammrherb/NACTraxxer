import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    // Test NextAuth import
    let nextAuthImportStatus = "unknown"
    let nextAuthError = null
    let nextAuthVersion = "unknown"

    try {
      const NextAuth = await import("next-auth")
      const CredentialsProvider = await import("next-auth/providers/credentials")
      nextAuthImportStatus = "success"

      // Try to get NextAuth version from package.json
      try {
        const packageJsonPath = join(process.cwd(), "package.json")
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))
        nextAuthVersion = packageJson.dependencies["next-auth"] || "not found"
      } catch (error) {
        nextAuthVersion = "version check failed"
      }
    } catch (error) {
      nextAuthImportStatus = "failed"
      nextAuthError = error.message
    }

    // Get Next.js version
    let nextVersion = "unknown"
    try {
      const nextPackage = await import("next/package.json")
      nextVersion = nextPackage.version
    } catch (error) {
      nextVersion = "version check failed"
    }

    return NextResponse.json({
      status: "success",
      message: "Debug API working",
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "not set",
        NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "not set",
      },
      nextAuth: {
        importStatus: nextAuthImportStatus,
        version: nextAuthVersion,
        error: nextAuthError,
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        nextVersion: nextVersion,
        runtime: "edge" in globalThis ? "edge" : "nodejs",
      },
      urls: {
        current: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
        nextauth: process.env.NEXTAUTH_URL || "not configured",
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Debug API failed",
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
