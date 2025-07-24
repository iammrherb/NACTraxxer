import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        projects:projects(count),
        sites:sites(count)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgData = await request.json()
    
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        id: orgData.id || `org-${Date.now()}`,
        name: orgData.name || "New Organization",
        slug: orgData.slug || orgData.name?.toLowerCase().replace(/\s+/g, '-') || `org-${Date.now()}`,
        industry: orgData.industry || null,
        size_category: orgData.size_category || null,
        headquarters_country: orgData.headquarters_country || null,
        annual_revenue_range: orgData.annual_revenue_range || null,
        employee_count_range: orgData.employee_count_range || null,
        compliance_requirements: orgData.compliance_requirements || [],
        branding_config: orgData.branding_config || {},
        subscription_tier: orgData.subscription_tier || "standard",
        features_enabled: orgData.features_enabled || [],
        settings: orgData.settings || {}
      }])
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}