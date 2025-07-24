export interface Site {
  id: string
  name: string
  organization_id?: string
  parent_site_id?: string
  site_hierarchy_path?: string
  region: string
  country: string
  city?: string
  address?: any
  timezone?: string
  priority: 'High' | 'Medium' | 'Low'
  phase: number
  users_count: number
  project_manager_id?: number
  deployment_type?: 'poc' | 'pilot' | 'production' | 'migration'
  radsec: string
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  completion_percent: number
  health_score?: number
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  budget_allocated?: number
  budget_spent?: number
  industry?: string
  project_goals?: string[]
  go_live_date?: string
  notes?: string
  metadata?: any
  created_at: string
  updated_at: string
  // Relations
  project_manager?: User
  technical_owners?: User[]
  vendors?: Vendor[]
  device_types?: DeviceType[]
  checklist_items?: ChecklistItem[]
}

export interface Organization {
  id: string
  name: string
  slug: string
  industry?: string
  size_category?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  headquarters_country?: string
  annual_revenue_range?: string
  employee_count_range?: string
  compliance_requirements?: string[]
  branding_config?: any
  subscription_tier?: string
  features_enabled?: string[]
  settings?: any
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  organization_id: string
  description?: string
  project_type: 'poc' | 'pilot' | 'production' | 'migration' | 'expansion'
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  start_date?: string
  end_date?: string
  budget?: number
  project_manager_id?: number
  sponsor_id?: number
  health_score?: number
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  metadata?: any
  created_at: string
  updated_at: string
  // Relations
  organization?: Organization
  project_manager?: User
  sponsor?: User
  sites?: Site[]
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  user_type: 'project_manager' | 'technical_owner'
  department?: string
  manager_id?: number
  skills?: string[]
  certifications?: string[]
  timezone?: string
  preferences?: any
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Relations
  manager?: User
  direct_reports?: User[]
}

export interface ChecklistItem {
  id: number
  name: string
  category: string
  is_custom: boolean
  created_at: string
  // Relations
  completed?: boolean
  completed_at?: string
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
  organizationName: string
  totalUsers: number
  siteCount: number
  country: string
  region: string
  industry: string
  projectGoals: string[]
  legacySystems: string[]
  idpVendors: string[]
  mfaVendors: string[]
  wiredVendors: string[]
  wirelessVendors: string[]
  mdmVendors: string[]
  edrVendors: string[]
  siemVendors: string[]
  firewallVendors: string[]
  vpnVendors: string[]
  status: "Draft" | "Completed"
}

export interface LibraryData {
  deploymentChecklist: LibraryItem[]
  useCases: UseCase[]
  testCases: TestCase[]
  requirements: Requirement[]
  regions: Region[]
  idpVendors: Vendor[]
  mfaVendors: Vendor[]
  edrVendors: Vendor[]
  siemVendors: Vendor[]
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: Vendor[]
  vpnVendors: Vendor[]
  mdmVendors: Vendor[]
  deviceTypes: DeviceType[]
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
