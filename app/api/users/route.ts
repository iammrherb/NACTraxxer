import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as
      | "project_manager"
      | "technical_owner"
      | "engineer"
      | "sales_engineer"
      | "customer"
      | null

    let users
    if (type) {
      users = await sql`SELECT id, name, email, role, user_type FROM users WHERE user_type = ${type} ORDER BY name;`
    } else {
      users = await sql`SELECT id, name, email, role, user_type FROM users ORDER BY name;`
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch users", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { name, email, role, user_type } = userData

    if (!name || !email || !role || !user_type) {
      return NextResponse.json({ error: "Missing required fields: name, email, role, user_type" }, { status: 400 })
    }

    const newUser = await sql`
      INSERT INTO users (name, email, role, user_type)
      VALUES (${name}, ${email}, ${role}, ${user_type})
      RETURNING id, name, email, role, user_type;
    `
    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    if (errorMessage.includes('duplicate key value violates unique constraint "users_email_key"')) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create user", details: errorMessage }, { status: 500 })
  }
}
