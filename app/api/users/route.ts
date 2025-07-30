import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/lib/data"

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await createUser(body)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/users:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
