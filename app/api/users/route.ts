import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// In-memory storage for demo purposes
let users: any[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@portnox.com",
    role: "admin",
    department: "IT",
    status: "active",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@portnox.com",
    role: "user",
    department: "Operations",
    status: "active",
  },
]

export async function GET() {
  try {
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const newUser = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
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

    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    users[userIndex] = { ...users[userIndex], ...updateData }
    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
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
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    users = users.filter((user) => user.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
