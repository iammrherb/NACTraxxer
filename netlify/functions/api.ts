import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET!

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Helper function to parse JWT token
const parseToken = (authHeader?: string) => {
  if (!authHeader?.startsWith('Bearer ')) return null
  
  try {
    const token = authHeader.substring(7)
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

// Main API handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    }
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '')
    const method = event.httpMethod
    const body = event.body ? JSON.parse(event.body) : null
    const user = parseToken(event.headers.authorization)

    // Route handling
    if (path === '/auth/login' && method === 'POST') {
      return await handleLogin(body)
    }

    if (path === '/sites' && method === 'GET') {
      return await handleGetSites(user)
    }

    if (path === '/sites' && method === 'POST') {
      return await handleCreateSite(body, user)
    }

    if (path === '/projects' && method === 'GET') {
      return await handleGetProjects(user)
    }

    if (path === '/projects' && method === 'POST') {
      return await handleCreateProject(body, user)
    }

    if (path === '/analytics' && method === 'GET') {
      return await handleGetAnalytics(user)
    }

    if (path === '/users' && method === 'GET') {
      return await handleGetUsers(user)
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Not found' } }),
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: { message: 'Internal server error' } 
      }),
    }
  }
}

// Auth handlers
async function handleLogin(body: { email: string; password: string }) {
  const { email, password } = body

  if (!email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: { message: 'Email and password are required' } 
      }),
    }
  }

  // For demo purposes, check demo credentials
  if (email === 'demo@portnox.com' && password === 'demo123') {
    const demoUser = {
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@portnox.com',
      role: 'Admin',
      user_type: 'project_manager'
    }

    const token = jwt.sign(demoUser, JWT_SECRET, { expiresIn: '24h' })

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: { user: demoUser, token }
      }),
    }
  }

  return {
    statusCode: 401,
    headers: corsHeaders,
    body: JSON.stringify({ 
      success: false, 
      error: { message: 'Invalid credentials' } 
    }),
  }
}

// Sites handlers
async function handleGetSites(user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  // Mock data for demo
  const mockSites = [
    {
      id: 'HQ001',
      name: 'Global Headquarters',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: 1,
      users_count: 2500,
      status: 'In Progress',
      completion_percent: 75,
      planned_start: '2024-01-15',
      planned_end: '2024-02-15',
      project_manager: { name: 'Alex Rivera', email: 'alex@example.com' }
    },
    {
      id: 'EUR003',
      name: 'European HQ',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Medium',
      phase: 2,
      users_count: 1200,
      status: 'Planned',
      completion_percent: 0,
      planned_start: '2024-03-01',
      planned_end: '2024-03-30',
      project_manager: { name: 'Sofia Linden', email: 'sofia@example.com' }
    }
  ]

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: mockSites }),
  }
}

async function handleCreateSite(body: any, user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  const newSite = {
    id: `SITE-${Date.now()}`,
    ...body,
    created_at: new Date().toISOString()
  }

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: newSite }),
  }
}

// Projects handlers
async function handleGetProjects(user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  const mockProjects = [
    {
      id: 'proj-001',
      name: 'Global NAC Rollout',
      description: 'Enterprise-wide NAC deployment',
      project_type: 'production',
      status: 'active',
      priority: 'high',
      health_score: 85,
      risk_level: 'medium',
      budget: 500000,
      created_at: '2024-01-01T00:00:00Z'
    }
  ]

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: mockProjects }),
  }
}

async function handleCreateProject(body: any, user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  const newProject = {
    id: `proj-${Date.now()}`,
    ...body,
    created_at: new Date().toISOString()
  }

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: newProject }),
  }
}

// Analytics handler
async function handleGetAnalytics(user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  const mockAnalytics = {
    overview: {
      total_sites: 12,
      completed_deployments: 8,
      active_deployments: 4,
      total_users: 15000
    },
    performance: {
      success_rate: 92,
      avg_completion_rate: 78,
      deployment_velocity: 85,
      on_time_delivery: 88
    },
    financial: {
      budget_efficiency: 94,
      total_budget: 2400000,
      spent_to_date: 1800000,
      remaining_budget: 600000
    }
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: mockAnalytics }),
  }
}

// Users handler
async function handleGetUsers(user: any) {
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: { message: 'Unauthorized' } }),
    }
  }

  const mockUsers = [
    {
      id: 'user-1',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      role: 'Project Manager',
      user_type: 'project_manager',
      created_at: '2024-01-01T00:00:00Z'
    }
  ]

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, data: mockUsers }),
  }
}