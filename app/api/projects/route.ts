import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { name, description, customer_name, project_manager_id, start_date, end_date, status } = body

    // Validate required fields
    if (!name || !customer_name || !project_manager_id) {
      return NextResponse.json(
        { error: "Missing required fields: name, customer_name, project_manager_id" },
        { status: 400 },
      )
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name,
        description: description || null,
        customer_name,
        project_manager_id,
        start_date: start_date || null,
        end_date: end_date || null,
        status: status || "Planning",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
