import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Note: You can enable role-based access control here once roles are established.
  // const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  // if (!profile || !['Admin', 'Manager'].includes(profile.role)) {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  // }

  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.customer_name || !body.start_date || !body.end_date) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const newProject = {
      id: uuidv4(),
      name: body.name,
      customer_name: body.customer_name,
      description: body.description || "",
      project_manager: body.project_manager || "Unassigned",
      start_date: body.start_date,
      end_date: body.end_date,
      status: body.status || "Planning",
      type: body.type || "Production",
      phase: "Discovery",
      completion_percentage: 0,
      health: {
        overall: 100,
        schedule: 100,
        technical_risk: 100,
        resource_adequacy: 100,
      },
      created_by: user.id,
    }

    const { data, error } = await supabase.from("projects").insert(newProject).select().single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project.", details: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    console.error("Error parsing request body:", e)
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }
}
