import { NextResponse } from "next/server"
import * as api from "@/lib/api"
import type { Site } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const sitesData: Partial<Site>[] = await request.json()
    if (!Array.isArray(sitesData) || sitesData.length === 0) {
      return NextResponse.json({ error: "Invalid input: expected an array of sites." }, { status: 400 })
    }

    const newSites = await api.bulkCreateSites(sitesData)
    return NextResponse.json(newSites, { status: 201 })
  } catch (error) {
    console.error("Failed to bulk create sites:", error)
    return NextResponse.json({ error: "Failed to create sites." }, { status: 500 })
  }
}
