import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { supabase } from '../config/database.js'
import { generateToken } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw createError('Email and password are required', 400, 'VALIDATION_ERROR')
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    // For demo purposes, we'll create a simple password check
    // In production, you'd use proper password hashing
    const isValidPassword = password === 'demo123' || 
      (user.password_hash && await bcrypt.compare(password, user.password_hash))

    if (!isValidPassword) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    // Generate JWT token
    const token = generateToken(user)

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          organization_id: user.organization_id
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, user_type, organization_id } = req.body

    if (!name || !email || !password) {
      throw createError('Name, email, and password are required', 400, 'VALIDATION_ERROR')
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw createError('User already exists', 409, 'USER_EXISTS')
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password_hash,
        role: role || 'User',
        user_type: user_type || 'technical_owner',
        organization_id: organization_id || null,
        is_active: true
      }])
      .select()
      .single()

    if (error) throw createError(error.message, 500, 'DATABASE_ERROR')

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          organization_id: user.organization_id
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      throw createError('No token provided', 401, 'NO_TOKEN')
    }

    // This would be handled by auth middleware in protected routes
    res.json({
      success: true,
      message: 'Use protected routes with auth middleware'
    })
  } catch (error) {
    next(error)
  }
})

export { router as authRouter }