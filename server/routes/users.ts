import { Router } from 'express'
import { supabase } from '../config/database.js'
import { AuthRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/users
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, user_type, created_at')
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

// GET /api/users/:id
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, user_type, created_at')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError('User not found', 404, 'NOT_FOUND')
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

export { router as usersRouter }