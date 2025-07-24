import { NextResponse } from "next/server"
import type { Site } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const sitesData: Partial<Site>[] = await request.json()
    if (!Array.isArray(sitesData) || sitesData.length === 0) {
      return NextResponse.json({ error: "Invalid input: expected an array of sites." }, { status: 400 })
    }

    // In a real application, this is where you would interact with your database
    // to create the new sites. For now, we just log it and return a success response.
    console.log(`Received request to bulk create ${sitesData.length} sites.`)

    // We return the data that was passed in, simulating a successful creation.
    return NextResponse.json(sitesData, { status: 201 })
  } catch (error) {
    console.error("Failed to bulk create sites:", error)
    return NextResponse.json({ error: "Failed to create sites." }, { status: 500 })
  }
}
