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
  id: string
  category: string
  item: string
  status: "Not Started" | "In Progress" | "Completed"
  notes?: string
  is_custom?: boolean
}

export interface UseCase {
  id: string
  title: string
  description: string
  requirements: string[]
  scope: "Mandatory" | "Optional"
  portnox_status: boolean
  notes?: string
  is_custom?: boolean
}

export interface TestMatrixEntry {
  id: string
  platform: "Windows" | "macOS" | "iOS/iPadOS" | "Special"
  mode: string
  connection_type: "Wired" | "Wireless" | "N/A"
  test_8021x?: "Passed" | "Failed" | "N/A"
  manual_block?: string
  acl_test?: "Passed" | "Failed" | "N/A"
  dacl_test?: "Passed" | "Failed" | "N/A"
  risk_detection?: string
  block_action?: string
  notes?: string
  is_custom?: boolean
}

export interface Requirement {
  id: string
  type: "Functional" | "Non-Functional"
  description: string
  justification: string
  status: "Met" | "Not Met"
  is_custom?: boolean
}

export interface TestCase {
  id: string
  name: string
  description: string
  expected_outcome: string
  status: "Pass" | "Fail" | "WIP" | "Not Started"
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
  role: string // Changed from specific roles to string
  user_type: "project_manager" | "technical_owner" | "admin"
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
  checklist_item_ids: string[]
  use_case_ids: string[]
  tasks: SiteTask[]
  test_case_statuses: { test_case_id: string; status: "Pass" | "Fail" | "WIP" | "Not Tested" }[]
  requirement_statuses: { requirement_id: string; status: "Met" | "Not Met" | "Not Applicable" }[]
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
