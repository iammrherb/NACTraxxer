import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

// POST /api/users
export async function POST(req: Request) {
  const { name, email, password, user_type, avatar } = await req.json()

  if (!name || !email || !password || !user_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // In a real app, use a strong hashing library like bcrypt
  const password_hash = `hashed_${password}`

  try {
    const [newUser] =
      await sql`INSERT INTO users (name, email, password_hash, user_type, avatar) VALUES (${name}, ${email}, ${password_hash}, ${user_type}, ${avatar}) RETURNING id, name, email, user_type, avatar`
    return NextResponse.json(newUser, { status: 201 })
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
