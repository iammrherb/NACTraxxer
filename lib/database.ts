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
          department: string | null
          manager_id: number | null
          skills: string[] | null
          certifications: string[] | null
          timezone: string | null
          preferences: any | null
          last_login: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          role: string
          user_type: 'project_manager' | 'technical_owner'
          department?: string | null
          manager_id?: number | null
          skills?: string[] | null
          certifications?: string[] | null
          timezone?: string | null
          preferences?: any | null
        }
        Update: {
          name?: string
          email?: string
          role?: string
          user_type?: 'project_manager' | 'technical_owner'
          department?: string | null
          manager_id?: number | null
          skills?: string[] | null
          certifications?: string[] | null
          timezone?: string | null
          preferences?: any | null
          last_login?: string | null
          is_active?: boolean
        }
      }
      sites: {
        Row: {
          id: string
          name: string
          organization_id: string | null
          parent_site_id: string | null
          site_hierarchy_path: string | null
          region: string
          country: string
          city: string | null
          address: any | null
          timezone: string | null
          priority: 'High' | 'Medium' | 'Low'
          phase: number
          users_count: number
          project_manager_id: number | null
          deployment_type: 'poc' | 'pilot' | 'production' | 'migration' | null
          radsec: string
          planned_start: string
          planned_end: string
          actual_start: string | null
          actual_end: string | null
          status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent: number
          health_score: number | null
          risk_level: 'low' | 'medium' | 'high' | 'critical' | null
          budget_allocated: number | null
          budget_spent: number | null
          industry: string | null
          project_goals: string[] | null
          go_live_date: string | null
          notes: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          organization_id?: string | null
          parent_site_id?: string | null
          site_hierarchy_path?: string | null
          region: string
          country: string
          city?: string | null
          address?: any | null
          timezone?: string | null
          priority: 'High' | 'Medium' | 'Low'
          phase: number
          users_count: number
          project_manager_id?: number | null
          deployment_type?: 'poc' | 'pilot' | 'production' | 'migration' | null
          radsec: string
          planned_start: string
          planned_end: string
          actual_start?: string | null
          actual_end?: string | null
          status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent?: number
          health_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          budget_allocated?: number | null
          budget_spent?: number | null
          industry?: string | null
          project_goals?: string[] | null
          go_live_date?: string | null
          notes?: string | null
          metadata?: any | null
        }
        Update: {
          name?: string
          organization_id?: string | null
          parent_site_id?: string | null
          site_hierarchy_path?: string | null
          region?: string
          country?: string
          city?: string | null
          address?: any | null
          timezone?: string | null
          priority?: 'High' | 'Medium' | 'Low'
          phase?: number
          users_count?: number
          project_manager_id?: number | null
          deployment_type?: 'poc' | 'pilot' | 'production' | 'migration' | null
          radsec?: string
          planned_start?: string
          planned_end?: string
          actual_start?: string | null
          actual_end?: string | null
          status?: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
          completion_percent?: number
          health_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          budget_allocated?: number | null
          budget_spent?: number | null
          industry?: string | null
          project_goals?: string[] | null
          go_live_date?: string | null
          notes?: string | null
          metadata?: any | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          industry: string | null
          size_category: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          headquarters_country: string | null
          annual_revenue_range: string | null
          employee_count_range: string | null
          compliance_requirements: string[] | null
          branding_config: any | null
          subscription_tier: string | null
          features_enabled: string[] | null
          settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          industry?: string | null
          size_category?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          headquarters_country?: string | null
          annual_revenue_range?: string | null
          employee_count_range?: string | null
          compliance_requirements?: string[] | null
          branding_config?: any | null
          subscription_tier?: string | null
          features_enabled?: string[] | null
          settings?: any | null
        }
        Update: {
          name?: string
          slug?: string
          industry?: string | null
          size_category?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          headquarters_country?: string | null
          annual_revenue_range?: string | null
          employee_count_range?: string | null
          compliance_requirements?: string[] | null
          branding_config?: any | null
          subscription_tier?: string | null
          features_enabled?: string[] | null
          settings?: any | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          organization_id: string
          description: string | null
          project_type: 'poc' | 'pilot' | 'production' | 'migration' | 'expansion'
          status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'critical'
          start_date: string | null
          end_date: string | null
          budget: number | null
          project_manager_id: number | null
          sponsor_id: number | null
          health_score: number | null
          risk_level: 'low' | 'medium' | 'high' | 'critical' | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          organization_id: string
          description?: string | null
          project_type: 'poc' | 'pilot' | 'production' | 'migration' | 'expansion'
          status?: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          project_manager_id?: number | null
          sponsor_id?: number | null
          health_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          metadata?: any | null
        }
        Update: {
          name?: string
          organization_id?: string
          description?: string | null
          project_type?: 'poc' | 'pilot' | 'production' | 'migration' | 'expansion'
          status?: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          project_manager_id?: number | null
          sponsor_id?: number | null
          health_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
          metadata?: any | null
        }
      }
    }
  }
}