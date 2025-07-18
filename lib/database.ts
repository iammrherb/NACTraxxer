import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL)

// Test database connection
export async function testDatabaseConnection() {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export { sql }

// Types
export interface DatabaseUser {
  id: number
  name: string
  email: string
  role: string
  user_type: "project_manager" | "technical_owner"
  created_at: string
  updated_at: string
  password_hash?: string
  email_verified?: boolean
  image?: string
  last_login?: string
  is_active?: boolean
  permissions?: any
}

// Keep the original User interface for backward compatibility
export interface User extends DatabaseUser {}

export interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: "High" | "Medium" | "Low"
  phase: number
  users_count: number
  project_manager_id: number
  project_manager_name?: string
  radsec: string
  planned_start: string
  planned_end: string
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completion_percent: number
  notes?: string
  created_at: string
  updated_at: string
  technical_owners?: DatabaseUser[]
  vendors?: Vendor[]
  device_types?: DeviceType[]
  checklist_items?: ChecklistItem[]
}

export interface Vendor {
  id: number
  name: string
  type: "wired" | "wireless"
  is_custom: boolean
  created_at: string
}

export interface DeviceType {
  id: number
  name: string
  is_custom: boolean
  created_at: string
}

export interface ChecklistItem {
  id: number
  name: string
  is_custom: boolean
  completed?: boolean
  completed_at?: string
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
