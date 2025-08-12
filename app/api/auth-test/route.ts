import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Auth test endpoint called")

    // Test NextAuth imports
    const NextAuth = await import("next-auth")
    const CredentialsProvider = await import("next-auth/providers/credentials")

    console.log("NextAuth imports successful")

    // Test if we can create a basic configuration
    const testConfig = {
      providers: [
        CredentialsProvider.default({
          name: "test",
          credentials: {
            email: { label: "Email", type: "email" },
          },
          async authorize() {
            return null
          },
        }),
      ],
    }

    console.log("Test configuration created successfully")

    return NextResponse.json({
      status: "success",
      message: "NextAuth imports and configuration test successful",
      imports: {
        NextAuth: "imported successfully",
        CredentialsProvider: "imported successfully",
      },
      configuration: "test config created successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("NextAuth test error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "NextAuth test failed",
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
