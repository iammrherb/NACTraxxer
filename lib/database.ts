import { neon } from "@neondatabase/serverless"

// Check if the database URL is set
if (!process.env.POSTGRES_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.POSTGRES_URL)

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT now()`
    console.log("Database connection successful:", result)
    return { success: true, result }
  } catch (error) {
    console.error("Database connection failed:", error)
    throw new Error("Database connection failed")
  }
}

export interface BaseVendor {
  id: number
  name: string
  is_custom?: boolean
}

export interface Vendor extends BaseVendor {
  type: "wired" | "wireless"
}

export interface DeviceType {
  id: number
  name: string
  is_custom?: boolean
}

export interface ChecklistItem {
  id: number
  name: string
  category: string
  is_custom?: boolean
}

export interface UseCase {
  id: number
  name: string
  description: string
  is_custom?: boolean
}

export interface TestMatrixEntry {
  id: number
  device_type_id: number
  use_case_id: number
  is_supported: boolean
}

export interface Requirement {
  id: number
  name: string
  description: string
  is_custom?: boolean
}

export interface TestCase {
  id: number
  name: string
  description: string
  is_custom?: boolean
}

export interface Task {
  id: number
  name: string
  description: string
  due_date?: string
  status: "To Do" | "In Progress" | "Done"
  assignee_id?: number
}

export interface SiteTask extends Task {
  site_task_id: string // Unique ID for the task instance on a site
}

export interface User {
  id: number
  name: string
  email: string
  role: "Admin" | "Project Manager" | "Technical Owner" | "Read Only"
}

export interface Site {
  id: string
  name: string
  region: string
  country: string
  status: "Planned" | "In Progress" | "Delayed" | "Complete"
  phase: number
  users_count: number
  planned_start: string
  planned_end: string
  completion_percent: number
  project_manager_id: number
  project_manager_name?: string
  technical_owner_ids: number[]
  radsec: "Native" | "Proxy" | "Not Used"
  vendor_ids: number[]
  firewall_vendor_ids: number[]
  vpn_vendor_ids: number[]
  edr_xdr_vendor_ids: number[]
  siem_vendor_ids: number[]
  idp_vendor_ids: number[]
  mfa_vendor_ids: number[]
  device_type_ids: number[]
  checklist_item_ids: number[]
  use_case_ids: number[]
  tasks: SiteTask[]
  test_case_statuses: { test_case_id: number; status: "Pass" | "Fail" | "Not Tested" }[]
  requirement_statuses: { requirement_id: number; status: "Met" | "Not Met" | "Not Applicable" }[]
  created_at: string
  updated_at: string
}

export interface Region {
  id: number
  name: string
}

export interface Country {
  code: string
  name: string
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

export interface LibraryData {
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: BaseVendor[]
  vpnVendors: BaseVendor[]
  edrXdrVendors: BaseVendor[]
  siemVendors: BaseVendor[]
  idpVendors: BaseVendor[]
  mfaVendors: BaseVendor[]
  deviceTypes: DeviceType[]
  checklistItems: ChecklistItem[]
  useCases: UseCase[]
  testMatrix: TestMatrixEntry[]
  requirements: Requirement[]
  testCases: TestCase[]
  tasks: Task[]
  regions: Region[]
  countries: Country[]
}
