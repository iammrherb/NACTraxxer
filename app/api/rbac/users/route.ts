import { NextResponse } from "next/server"
import { checkPermissionMiddleware } from "@/lib/rbac"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  const authCheck = await checkPermissionMiddleware("users.view")

  if (!authCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status })
  }

  try {
    const users = await sql`
      SELECT DISTINCT 
        u.id,
        u.name,
        u.email,
        COALESCE(
          JSON_AGG(r.name) FILTER (WHERE r.name IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.email = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE (ur.expires_at IS NULL OR ur.expires_at > NOW())
      GROUP BY u.id, u.name, u.email
      ORDER BY u.name
    `

    return NextResponse.json(
      users.map((user) => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles : [],
      })),
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
