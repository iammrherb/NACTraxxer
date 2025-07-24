import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organization_id = searchParams.get("organization_id")
    const status = searchParams.get("status")
    const project_type = searchParams.get("project_type")
    
    let query = supabase
      .from('projects')
      .select(`
        *,
        organization:organizations(name, slug),
        project_manager:users!projects_project_manager_id_fkey(name, email),
        sponsor:users!projects_sponsor_id_fkey(name, email),
        sites:sites(id, name, status, completion_percent)
      `)
    
    if (organization_id) {
      query = query.eq('organization_id', organization_id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (project_type) {
      query = query.eq('project_type', project_type)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        id: projectData.id || `proj-${Date.now()}`,
        name: projectData.name || "New Project",
        organization_id: projectData.organization_id || "default-org",
        description: projectData.description || null,
        project_type: projectData.project_type || "production",
        status: projectData.status || "planning",
        priority: projectData.priority || "medium",
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        budget: projectData.budget || null,
        project_manager_id: projectData.project_manager_id || null,
        sponsor_id: projectData.sponsor_id || null,
        health_score: projectData.health_score || 100,
        risk_level: projectData.risk_level || "low",
        metadata: projectData.metadata || {}
      }])
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}