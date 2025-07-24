import { Router } from 'express'
import { supabase } from '../config/database.js'
import { AuthRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/projects
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { organization_id, status, project_type } = req.query

    let query = supabase
      .from('projects')
      .select(`
        *,
        organization:organizations(id, name, slug),
        project_manager:users!projects_project_manager_id_fkey(id, name, email),
        sponsor:users!projects_sponsor_id_fkey(id, name, email)
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

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/projects
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const projectData = req.body

    if (!projectData.name) {
      throw createError('Project name is required', 400, 'VALIDATION_ERROR')
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: projectData.name,
        organization_id: projectData.organization_id || req.user?.organization_id,
        description: projectData.description || null,
        project_type: projectData.project_type || 'production',
        status: projectData.status || 'planning',
        priority: projectData.priority || 'medium',
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        budget: projectData.budget || null,
        project_manager_id: projectData.project_manager_id || null,
        sponsor_id: projectData.sponsor_id || null,
        health_score: projectData.health_score || 100,
        risk_level: projectData.risk_level || 'low',
        metadata: projectData.metadata || {}
      }])
      .select()
      .single()

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.status(201).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
})

export { router as projectsRouter }