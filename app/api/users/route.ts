import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { users } from "@/lib/database/schema"

export async function GET() {
  try {
    // This query is now `SELECT id, name, email, role FROM users`, which is much more likely to succeed.
    const allUsers = await db.select().from(users)
    return NextResponse.json(allUsers)
  } catch (error: any) {
    console.error("API_USERS_GET_ERROR:", error)
    return NextResponse.json({ message: `Failed to fetch users. ${error.message}` }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newUser = await db.insert(users).values(body).returning()
    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error: any) {
    console.error("API_USERS_POST_ERROR:", error)
    return NextResponse.json({ message: `Failed to create user. ${error.message}` }, { status: 500 })
  }
}
