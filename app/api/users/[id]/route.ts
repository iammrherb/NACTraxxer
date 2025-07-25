import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET /api/users/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const [user] = await sql`SELECT id, name, email, user_type, avatar FROM users WHERE id = ${id}`
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json(user)
}

// PUT /api/users/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  // Exclude fields that shouldn't be updated this way
  delete body.id
  delete body.password_hash

  const [updatedUser] =
    await sql`UPDATE users SET ${sql(body)} WHERE id = ${id} RETURNING id, name, email, user_type, avatar`
  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json(updatedUser)
}

// DELETE /api/users/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const result = await sql`DELETE FROM users WHERE id = ${id}`
  if (result.count === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
