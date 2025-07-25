import { Router } from 'express'
import { supabase } from '../config/database.js'
import { AuthRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/organizations
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/organizations
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const orgData = req.body

    if (!orgData.name) {
      throw createError('Organization name is required', 400, 'VALIDATION_ERROR')
    }

    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name: orgData.name,
        slug: orgData.slug || orgData.name.toLowerCase().replace(/\s+/g, '-'),
        industry: orgData.industry || null,
        size_category: orgData.size_category || 'medium',
        headquarters_country: orgData.headquarters_country || null,
        settings: orgData.settings || {}
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

export { router as organizationsRouter }