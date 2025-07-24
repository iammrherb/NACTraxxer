import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("FATAL: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("FATAL: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.")
}

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// For server-side operations that need elevated permissions
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * A utility function to test the database connection.
 * It performs a simple query to ensure the connection is alive.
 */
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error("Database connection failed:", error)
      return { success: false, message: "Database connection failed.", error }
    }
    
    console.log("Database connection successful.")
    return { success: true, message: "Database connection successful." }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, message: "Database connection failed.", error }
  }
}

// Helper function for executing raw SQL queries when needed
export async function executeQuery(query: string, params?: any[]) {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', {
      query,
      params: params || []
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error("Query execution error:", error)
    throw error
  }
}

// Export types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          email: string
          role: string
          user_type: 'project_manager' | 'technical_owner'
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          role: string
          user_type: 'project_manager' | 'technical_owner'
        }
        Update: {
          name?: string
          email?: string
          role?: string
          user_type?: 'project_manager' | 'technical_owner'
        }
      }
      sites: {
        Row: {
          id: string
          name: string
          region: string
          country: string
          priority: 'High' | 'Medium' | 'Low'
          phase: number
          users_count: number
          project_manager_id: number | null
          radsec: string
          planned_start: string
          planned_end: string
          status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          region: string
          country: string
          priority: 'High' | 'Medium' | 'Low'
          phase: number
          users_count: number
          project_manager_id?: number | null
          radsec: string
          planned_start: string
          planned_end: string
          status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent?: number
          notes?: string | null
        }
        Update: {
          name?: string
          region?: string
          country?: string
          priority?: 'High' | 'Medium' | 'Low'
          phase?: number
          users_count?: number
          project_manager_id?: number | null
          radsec?: string
          planned_start?: string
          planned_end?: string
          status?: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent?: number
          notes?: string | null
        }
      }
    }
  }
}