import { NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const { data: sites, error: sitesError } = await supabase.from('sites').select('status, completion_percent')
    const { data: users, error: usersError } = await supabase.from('users').select('id')
    
    if (sitesError || usersError) throw sitesError || usersError
    
    const total_sites = sites?.length || 0
    const completed_sites = sites?.filter(s => s.status === 'Complete').length || 0
    const in_progress_sites = sites?.filter(s => s.status === 'In Progress').length || 0
    const planned_sites = sites?.filter(s => s.status === 'Planned').length || 0
    const delayed_sites = sites?.filter(s => s.status === 'Delayed').length || 0
    const total_users = users?.length || 0
    const overall_completion = total_sites > 0 
      ? Math.round((sites?.reduce((acc, site) => acc + (site.completion_percent || 0), 0) || 0) / total_sites)
      : 0
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

    const stats = {
      total_sites,
      completed_sites,
      in_progress_sites,
      planned_sites,
      delayed_sites,
      total_users,
      overall_completion,
      checklist_completion: 0,
      completed_checklist_items: 0,
      total_checklist_items: 0,
      sites: sites || []
    }
    
    return NextResponse.json(stats)