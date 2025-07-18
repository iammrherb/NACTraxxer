import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

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

// Type definitions
export interface User {
  id: number
  name: string
  email: string
  role: string
  user_type: "project_manager" | "technical_owner"
  password_hash?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

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
  radsec: "Yes" | "No"
  planned_start?: Date
  planned_end?: Date
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completion_percent: number
  notes?: string
  created_at: Date
  updated_at: Date
  technical_owners?: User[]
  vendors?: Vendor[]
  device_types?: DeviceType[]
  checklist_items?: ChecklistItem[]
}

export interface Vendor {
  id: number
  name: string
  type: "wired" | "wireless"
  is_custom: boolean
  created_at: Date
}

export interface DeviceType {
  id: number
  name: string
  is_custom: boolean
  created_at: Date
}

export interface ChecklistItem {
  id: number
  name: string
  is_custom: boolean
  completed?: boolean
  completed_at?: Date
  created_at: Date
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
  id: number
  name: string
  description: string
  category: string
  priority: "High" | "Medium" | "Low"
  status: "Not Started" | "In Progress" | "Validated" | "Failed"
  validation_notes?: string
  created_at: Date
  updated_at: Date
}

export interface Report {
  id: number
  name: string
  type: "deployment" | "progress" | "summary"
  generated_at: Date
  file_path?: string
  parameters: any
}

export interface NotificationPreference {
  id: number
  user_id: number
  email_notifications: boolean
  deployment_updates: boolean
  weekly_reports: boolean
  critical_alerts: boolean
  created_at: Date
  updated_at: Date
}

// Keep backward compatibility
export interface DatabaseUser extends User {}
