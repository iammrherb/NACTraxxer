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

export interface ScopingQuestionnaire {
  id: string
  organizationName: string
  totalUsers: number
  country: string
  region: string
  industry: string
  projectGoals: string[]
  legacySystems: { name: string }[]
  idpVendors: string[]
  mfaVendors: string[]
  wiredVendors: string[]
  wirelessVendors: string[]
  mdmVendors: string[]
  edrVendors: string[]
  siemVendors: string[]
  firewallVendors: string[]
  vpnVendors: string[]
  created_at: string
  updated_at: string
  status: "Draft" | "Completed"
}

export interface BaseVendor {
  id: number
  name: string
  is_custom?: boolean
}

export interface Vendor extends BaseVendor {
  type: "wired" | "wireless"
  created_at?: string
}

export interface DeviceType {
  id: number
  name: string
  is_custom?: boolean
  created_at?: string
}

export interface ChecklistItem {
  id: number
  name: string
  category: string
  is_custom?: boolean
  created_at?: string
}

export interface UseCase {
  id: string
  title: string
  description: string
  category: string
  priority: "mandatory" | "optional" | "nice-to-have"
  is_baseline: boolean
  is_custom?: boolean
  applicable_industries: string[]
  applicable_goals: string[]
  requirement_ids: string[]
  test_case_ids: string[]
  created_at?: string
  updated_at?: string
}

export interface TestMatrixEntry {
  id: string
  platform: string
  mode: string
  type: string
  config_portnox_cloud: string
  config_nas: string
  config_mdm: string
  test_8021x: string
  test_manual_block: string
  test_acl: string
  test_risk_assessment: string
  test_remediation: string
  notes: string
  is_custom?: boolean
}

export interface Requirement {
  id: string
  description: string
  justification: string
  is_custom?: boolean
  created_at?: string
  updated_at?: string
}

export interface TestCase {
  id: string
  name: string
  description: string
  expected_outcome: string
  is_custom?: boolean
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "Done"
  assignee_id?: number
}

export interface SiteTask extends Task {
  site_task_id: string
}

export interface DatabaseUser {
  id: number
  name: string
  email: string
  role: string
  user_type: "admin" | "project_manager" | "technical_owner" | "read_only"
  created_at: string
  updated_at: string
}

export interface SiteTestCaseStatus {
  test_case_id: string
  status: "passed" | "failed" | "wip" | "not-started"
}

export interface SiteRequirementStatus {
  requirement_id: string
  status: "met" | "not-met" | "partially-met" | "not-applicable"
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
  radsec: "Native" | "LRAD" | "Proxy" | "Not Used"
  vendor_ids: number[]
  firewall_vendor_ids: number[]
  vpn_vendor_ids: number[]
  edr_xdr_vendor_ids: number[]
  siem_vendor_ids: number[]
  idp_vendor_ids: number[]
  mfa_vendor_ids: number[]
  mdm_vendor_ids: number[]
  device_type_ids: number[]
  checklist_item_ids: number[]
  use_case_ids: string[]
  tasks: SiteTask[]
  test_case_statuses: SiteTestCaseStatus[]
  requirement_statuses: SiteRequirementStatus[]
  created_at: string
  updated_at: string
  // From scoping
  industry?: string
  project_goals?: string[]
  legacy_nac_systems?: { name: string; migration_timeline_months: number }[]
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
}

export interface Region {
  name: string
}

export interface Country {
  code: string
  name: string
  region: string
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
  mdmVendors: BaseVendor[]
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
