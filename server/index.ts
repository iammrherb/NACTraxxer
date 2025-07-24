import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createClient } from '@supabase/supabase-js'
import { sitesRouter } from './routes/sites.js'
import { usersRouter } from './routes/users.js'
import { projectsRouter } from './routes/projects.js'
import { organizationsRouter } from './routes/organizations.js'
import { analyticsRouter } from './routes/analytics.js'
import { authRouter } from './routes/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Authentication routes (public)
app.use('/api/auth', authRouter)

// Protected routes
app.use('/api', authMiddleware)
app.use('/api/sites', sitesRouter)
app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/analytics', analyticsRouter)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

export default app