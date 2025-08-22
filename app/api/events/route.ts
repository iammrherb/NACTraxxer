import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// In-memory storage for demo purposes
let events: any[] = [
  {
    id: "1",
    title: "Project Kickoff",
    description: "Initial planning meeting with stakeholders",
    date: "2024-01-15",
    time: "09:00",
    type: "meeting",
    status: "scheduled",
    assignee: "Admin User",
  },
  {
    id: "2",
    title: "Architecture Review",
    description: "Review proposed NAC architecture",
    date: "2024-01-20",
    time: "14:00",
    type: "review",
    status: "scheduled",
    assignee: "Technical Lead",
  },
]

export async function GET() {
  try {
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const newEvent = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    events.push(newEvent)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    const eventIndex = events.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    events[eventIndex] = { ...events[eventIndex], ...updateData }
    return NextResponse.json(events[eventIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 })
    }

    events = events.filter((event) => event.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
