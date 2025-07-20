// The database connection has been temporarily removed.
// The application will use mock data from /lib/mock-data.ts
// To re-integrate, restore the original content of this file.

// Mocked exports to prevent deployment errors.
export const sql = () => {
  throw new Error("Database is disabled. The application is running in mock data mode.")
}

export async function testDatabaseConnection() {
  console.log("Database connection check skipped (mock mode).")
  return true
}

// Types remain to ensure the application's type safety.
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

  // Expanded Network & Security
  vendors?: Vendor[]
  firewall_vendors?: BaseVendor[]
  vpn_vendors?: BaseVendor[]
  edr_xdr_vendors?: BaseVendor[]
  siem_vendors?: BaseVendor[]

  // Expanded Deployment Details
  device_types?: DeviceType[]
  deployment_type?: "agent" | "agentless" | "hybrid"
  auth_methods?: string[]
  os_details?: {
    windows: boolean
    macos: boolean
    ios: boolean
    android: boolean
    linux: boolean
    linux_distro?: string
  }

  // Expanded Checklist
  checklist_items?: ChecklistItem[]
}

export interface BaseVendor {
  id: number
  name: string
}

export interface Vendor extends BaseVendor {
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
  category: string
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

// New Use Case related types
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
