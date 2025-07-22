// lib/types.ts

export interface User {
  id: string
  name: string
  email: string
  role: string
}

// This Site type matches the stable, minimal data structure.
export interface Site {
  id: string
  name: string
  region?: string | null
  status?: string | null
  completion_percent: number
  project_manager?: User | null | string
  technical_owners: User[]
  // Other complex fields are temporarily removed.
}

export interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

export interface Milestone {
  id: string
  title: string
  date: string
  description: string
}

export interface ChecklistItem {
  id: string
  task: string
  category: string
  completed: boolean
  completed_by?: string
  completed_date?: string
}

export interface LibraryItem {
  id: string
  title: string
  description: string
  category: string
  content: string
}

export interface Vendor {
  id: number
  name: string
  is_custom?: boolean
}

export interface DeviceType {
  id: number | string
  name: string
  is_custom?: boolean
}

export interface Region {
  name: string
}

export interface UseCase {
  id: string
  title: string
  category: string
  priority: string
  is_custom?: boolean
  description?: string
}

export interface TestCase {
  id: string
  name: string
  expected_outcome: string
  is_custom?: boolean
}

export interface Requirement {
  id: string
  description: string
  is_custom?: boolean
}

export interface ScopingQuestionnaire {
  id?: string
  organization_name: string
  total_users: number
  site_count: number
  country: string
  region: string
  industry: string
  project_goals: string[]
  legacy_systems: string[]
  idp_vendors: string[]
  mfa_vendors: string[]
  wired_vendors: string[]
  wireless_vendors: string[]
  mdm_vendors: string[]
  edr_vendors: string[]
  siem_vendors: string[]
  firewall_vendors: string[]
  vpn_vendors: string[]
  status: "Draft" | "Completed"
}

export interface LibraryData {
  deployment_checklist: LibraryItem[]
  use_cases: UseCase[]
  test_cases: TestCase[]
  requirements: Requirement[]
  regions: Region[]
  idp_vendors: Vendor[]
  mfa_vendors: Vendor[]
  edr_vendors: Vendor[]
  siem_vendors: Vendor[]
  wired_vendors: Vendor[]
  wireless_vendors: Vendor[]
  firewall_vendors: Vendor[]
  vpn_vendors: Vendor[]
  mdm_vendors: Vendor[]
  device_types: DeviceType[]
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
