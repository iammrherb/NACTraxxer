import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        *,
        project_manager:users!sites_project_manager_id_fkey(name),
        technical_owners:site_technical_owners(user:users(name)),
        vendors:site_vendors(vendor:vendors(name, type)),
        device_types:site_device_types(device_type:device_types(name))
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()
    
    const { data, error } = await supabase
      .from('sites')
      .insert([{
        id: siteData.id || `site-${Date.now()}`,
        name: siteData.name || "New Site",
        region: siteData.region || "",
        country: siteData.country || "",
        priority: siteData.priority || "Medium",
        phase: siteData.phase || 1,
        users_count: siteData.users_count || 0,
        project_manager_id: siteData.project_manager_id || null,
        radsec: siteData.radsec || "Native",
        planned_start: siteData.planned_start || new Date().toISOString().split('T')[0],
        planned_end: siteData.planned_end || new Date().toISOString().split('T')[0],
        status: siteData.status || "Planned",
        completion_percent: siteData.completion_percent || 0,
        notes: siteData.notes || null
      }])
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating site:", error)
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 })
  }
}
