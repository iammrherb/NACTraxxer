import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: "High" | "Medium" | "Low"
  phase: number
  users_count: number
  project_manager_id?: number
  project_manager_name?: string
  radsec: string
  planned_start: string
  planned_end: string
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completion_percent: number
  notes?: string
  created_at: string
  updated_at: string
  technical_owners?: User[]
  vendors?: Vendor[]
  device_types?: DeviceType[]
  checklist_items?: ChecklistItem[]
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  user_type: "project_manager" | "technical_owner"
  password_hash?: string
  email_verified?: boolean
  image?: string
  last_login?: string
  is_active?: boolean
  permissions?: any
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: number
  name: string
  is_custom: boolean
  completed?: boolean
  completed_at?: string
  created_at: string
}

export interface DeviceType {
  id: number
  name: string
  is_custom: boolean
  created_at: string
}

export interface Vendor {
  id: number
  name: string
  type: "wired" | "wireless"
  is_custom: boolean
  created_at: string
}

export interface SiteStats {
  total_sites: number
  completed_sites: number
  in_progress_sites: number
  planned_sites: number
  delayed_sites: number
  total_users: number
  overall_completion: number
}

export interface UseCase {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  status: "pending" | "in-progress" | "completed" | "failed"
  priority: "mandatory" | "optional" | "nice-to-have"
  completion_percentage: number
  notes?: string
  created_at: string
  updated_at: string
  test_cases?: TestCase[]
  requirements?: Requirement[]
  documentation_links?: DocumentationLink[]
  success_criteria?: SuccessCriteria[]
}

export interface TestCase {
  id: string
  name: string
  description: string
  expected_outcome: string
  status: "pending" | "in-progress" | "completed" | "failed"
  actual_outcome?: string
  test_date?: string
  tester_name?: string
  created_at: string
  updated_at: string
}

export interface Requirement {
  id: string
  type: "functional" | "non-functional"
  description: string
  justification?: string
  status: "met" | "not-met" | "partially-met"
  created_at: string
  updated_at: string
}

export interface BusinessObjective {
  id: string
  title: string
  description: string
  success_criteria?: string
  created_at: string
  updated_at: string
}

export interface DocumentationLink {
  id: number
  use_case_id: string
  title: string
  url: string
  description?: string
  created_at: string
}

export interface SuccessCriteria {
  id: number
  use_case_id: string
  criteria: string
  is_met: boolean
  created_at: string
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as test`
    return result.length > 0
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    console.log("Initializing database...")

    // Test connection first
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    console.log("Database connection successful, creating tables...")

    // The tables are already created by the SQL scripts in the scripts folder
    // This function just verifies the connection and logs the status

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}
