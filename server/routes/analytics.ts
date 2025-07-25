import { Router } from 'express'
import { supabase } from '../config/database.js'
import { AuthRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/analytics
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    // Get sites data for analytics
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')

    if (sitesError) throw createError(sitesError.message, 500, 'DATABASE_ERROR')

    // Get projects data
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) throw createError(projectsError.message, 500, 'DATABASE_ERROR')

    // Calculate analytics
    const totalSites = sites?.length || 0
    const completedSites = sites?.filter(s => s.status?.toLowerCase().includes('complete')).length || 0
    const inProgressSites = sites?.filter(s => s.status?.toLowerCase().includes('progress')).length || 0
    const totalUsers = sites?.reduce((acc, site) => acc + (site.users_count || 0), 0) || 0
    const avgProgress = totalSites ? Math.round(sites.reduce((acc, s) => acc + (s.completion_percent || 0), 0) / totalSites) : 0

    const analytics = {
      overview: {
        total_sites: totalSites,
        completed_deployments: completedSites,
        active_deployments: inProgressSites,
        total_users: totalUsers
      },
      performance: {
        success_rate: totalSites ? Math.round((completedSites / totalSites) * 100) : 0,
        avg_completion_rate: avgProgress,
        deployment_velocity: 85,
        on_time_delivery: 92
      },
      financial: {
        budget_efficiency: 88,
        total_budget: 2400000,
        spent_to_date: 1800000,
        remaining_budget: 600000
      },
      regional_data: sites?.reduce((acc: any, site: any) => {
        const region = site.region || 'Unknown'
        if (!acc[region]) {
          acc[region] = { name: region, sites: 0, completed: 0, inProgress: 0 }
        }
        acc[region].sites++
        if (site.status?.toLowerCase().includes('complete')) {
          acc[region].completed++
        } else if (site.status?.toLowerCase().includes('progress')) {
          acc[region].inProgress++
        }
        return acc
      }, {})
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
})

export { router as analyticsRouter }