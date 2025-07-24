import { Router } from 'express'
import { supabase } from '../config/database.js'
import { AuthRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/sites - List all sites with filtering
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { organization_id, status, region, priority, search } = req.query

    let query = supabase
      .from('sites')
      .select(`
        *,
        project_manager:users!sites_project_manager_id_fkey(id, name, email),
        organization:organizations(id, name, slug)
      `)

    // Apply filters
    if (organization_id) {
      query = query.eq('organization_id', organization_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (region) {
      query = query.eq('region', region)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,id.ilike.%${search}%,country.ilike.%${search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.json({
      success: true,
      data: data || [],
      meta: {
        total: data?.length || 0,
        filters: { organization_id, status, region, priority, search }
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/sites - Create a new site
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const siteData = req.body

    // Validate required fields
    if (!siteData.name || !siteData.region || !siteData.country) {
      throw createError('Missing required fields: name, region, country', 400, 'VALIDATION_ERROR')
    }

    const { data, error } = await supabase
      .from('sites')
      .insert([{
        id: siteData.id || `site-${Date.now()}`,
        name: siteData.name,
        organization_id: siteData.organization_id || req.user?.organization_id,
        region: siteData.region,
        country: siteData.country,
        city: siteData.city || null,
        priority: siteData.priority || 'Medium',
        phase: siteData.phase || 1,
        users_count: siteData.users_count || 0,
        project_manager_id: siteData.project_manager_id || null,
        deployment_type: siteData.deployment_type || 'production',
        radsec: siteData.radsec || 'Native',
        planned_start: siteData.planned_start || new Date().toISOString().split('T')[0],
        planned_end: siteData.planned_end || new Date().toISOString().split('T')[0],
        status: siteData.status || 'Planned',
        completion_percent: siteData.completion_percent || 0,
        budget_allocated: siteData.budget_allocated || null,
        industry: siteData.industry || null,
        notes: siteData.notes || null,
        metadata: siteData.metadata || {}
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

// GET /api/sites/:id - Get site by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('sites')
      .select(`
        *,
        project_manager:users!sites_project_manager_id_fkey(id, name, email),
        organization:organizations(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError('Site not found', 404, 'NOT_FOUND')
      }
      throw createError(error.message, 500, 'DATABASE_ERROR')
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/sites/:id - Update site
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const { data, error } = await supabase
      .from('sites')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError('Site not found', 404, 'NOT_FOUND')
      }
      throw createError(error.message, 500, 'DATABASE_ERROR')
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/sites/:id - Delete site
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id)

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.json({
      success: true,
      message: 'Site deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/sites/bulk - Bulk create sites
router.post('/bulk', async (req: AuthRequest, res, next) => {
  try {
    const { sites } = req.body

    if (!Array.isArray(sites) || sites.length === 0) {
      throw createError('Invalid sites array', 400, 'VALIDATION_ERROR')
    }

    const sitesData = sites.map((site, index) => ({
      id: site.id || `bulk-site-${Date.now()}-${index}`,
      name: site.name || `Site ${index + 1}`,
      organization_id: site.organization_id || req.user?.organization_id,
      region: site.region || 'North America',
      country: site.country || 'United States',
      priority: site.priority || 'Medium',
      phase: site.phase || 1,
      users_count: site.users_count || 0,
      radsec: site.radsec || 'Native',
      planned_start: site.planned_start || new Date().toISOString().split('T')[0],
      planned_end: site.planned_end || new Date().toISOString().split('T')[0],
      status: site.status || 'Planned',
      completion_percent: 0
    }))

    const { data, error } = await supabase
      .from('sites')
      .insert(sitesData)
      .select()

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.status(201).json({
      success: true,
      data,
      meta: {
        created_count: data?.length || 0
      }
    })
  } catch (error) {
    next(error)
  }
})

export { router as sitesRouter }