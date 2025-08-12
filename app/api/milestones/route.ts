import { type NextRequest, NextResponse } from "next/server"
import { getAllMilestones, createMilestone } from "@/lib/data"

export async function GET() {
  try {
    const milestones = await getAllMilestones()
    return NextResponse.json(milestones)
  } catch (error) {
    console.error("Error in GET /api/milestones:", error)
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const milestone = await createMilestone(body)
    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/milestones:", error)
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 })
  }
}
