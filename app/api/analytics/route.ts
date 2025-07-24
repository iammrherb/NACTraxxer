import { NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    // Fetch comprehensive analytics data
    const [
      { data: sites, error: sitesError },
      { data: projects, error: projectsError },
      { data: users, error: usersError },
      { data: organizations, error: orgsError }
    ] = await Promise.all([
      supabase.from('sites').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('users').select('*'),
      supabase.from('organizations').select('*')
    ])

    if (sitesError || projectsError || usersError || orgsError) {
      throw sitesError || projectsError || usersError || orgsError
    }

    // Calculate comprehensive metrics
    const analytics = {
      overview: {
        total_sites: sites?.length || 0,
        total_projects: projects?.length || 0,
        total_organizations: organizations?.length || 0,
        total_users: users?.length || 0,
        active_deployments: sites?.filter(s => s.status === 'In Progress').length || 0,
        completed_deployments: sites?.filter(s => s.status === 'Complete').length || 0
      },
      
      performance: {
        avg_completion_rate: sites?.length ? 
          Math.round(sites.reduce((acc, site) => acc + (site.completion_percent || 0), 0) / sites.length) : 0,
        success_rate: sites?.length ? 
          Math.round((sites.filter(s => s.status === 'Complete').length / sites.length) * 100) : 0,
        on_time_delivery: Math.floor(Math.random() * 20) + 75, // Mock data
        customer_satisfaction: 4.8 // Mock data
      },
      
      financial: {
        total_budget: sites?.reduce((acc, site) => acc + (site.budget_allocated || 0), 0) || 0,
        total_spent: sites?.reduce((acc, site) => acc + (site.budget_spent || 0), 0) || 0,
        budget_efficiency: 0,
        cost_per_site: 0
      },
      
      regional: sites?.reduce((acc, site) => {
        acc[site.region] = (acc[site.region] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {},
      
      status_distribution: {
        planned: sites?.filter(s => s.status === 'Planned').length || 0,
        in_progress: sites?.filter(s => s.status === 'In Progress').length || 0,
        completed: sites?.filter(s => s.status === 'Complete').length || 0,
        delayed: sites?.filter(s => s.status === 'Delayed').length || 0
      },
      
      risk_analysis: {
        low_risk: sites?.filter(s => s.risk_level === 'low').length || 0,
        medium_risk: sites?.filter(s => s.risk_level === 'medium').length || 0,
        high_risk: sites?.filter(s => s.risk_level === 'high').length || 0,
        critical_risk: sites?.filter(s => s.risk_level === 'critical').length || 0
      },
      
      trends: {
        // Mock trend data - in real implementation, this would come from historical data
        monthly_completions: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
          completed: Math.floor(Math.random() * 10) + i * 2,
          planned: Math.floor(Math.random() * 15) + 20,
          budget_spent: Math.floor(Math.random() * 500000) + i * 100000
        })),
        
        deployment_velocity: Array.from({ length: 8 }, (_, i) => ({
          week: `Week ${i + 1}`,
          velocity: Math.floor(Math.random() * 5) + 3,
          target: 5
        }))
      },
      
      predictions: {
        next_quarter_completions: Math.floor(Math.random() * 10) + 15,
        resource_needs: {
          project_managers: Math.floor(Math.random() * 3) + 1,
          engineers: Math.floor(Math.random() * 5) + 2,
          specialists: Math.floor(Math.random() * 2) + 1
        },
        budget_forecast: {
          q1_2025: Math.floor(Math.random() * 1000000) + 2000000,
          q2_2025: Math.floor(Math.random() * 1000000) + 2500000
        }
      }
    }

    // Calculate derived metrics
    if (analytics.financial.total_budget > 0) {
      analytics.financial.budget_efficiency = Math.round(
        (analytics.financial.total_spent / analytics.financial.total_budget) * 100
      )
    }
    
    if (analytics.overview.total_sites > 0) {
      analytics.financial.cost_per_site = Math.round(
        analytics.financial.total_spent / analytics.overview.total_sites
      )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}