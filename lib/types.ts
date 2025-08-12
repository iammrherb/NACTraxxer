export interface Site {
  id: number
  name: string
  site_code?: string
  region: string
  country: string
  city?: string
  address?: string
  timezone?: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  project_manager_id?: number
  project_manager: string
  budget?: number
  currency?: string
  technical_owners: string[]
  wired_vendors: string[]
  wireless_vendors: string[]
  device_types: string[]
  radsec: boolean
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  status: "Scoping" | "Planning" | "In Progress" | "Testing" | "Complete" | "On Hold" | "Cancelled"
  completion_percent: number
  health_score?: number
  risk_level?: "Low" | "Medium" | "High" | "Critical"
  deployment_checklist: string[]
  notes?: string
  network_details?: any
  security_requirements?: any
  compliance_frameworks?: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  role: "Admin" | "Project Manager" | "Technical Owner" | "Viewer"
  department?: string
  phone?: string
  timezone?: string
  avatar_url?: string
  is_active: boolean
  last_login?: string
  preferences?: any
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: number
  name: string
  type: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  description?: string
  logo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DeviceType {
  id: number
  name: string
  category: string
  description?: string
  icon?: string
  authentication_methods?: string[]
  compliance_requirements?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UseCase {
  id: number
  title: string
  subtitle?: string
  description: string
  category: string
  priority: "High" | "Medium" | "Low"
  status: "Draft" | "Planning" | "In Progress" | "Testing" | "Completed" | "On Hold"
  completion_percentage: number
  estimated_effort_hours?: number
  actual_effort_hours?: number
  business_value?: string
  technical_requirements?: string
  acceptance_criteria?: string
  test_scenarios?: string
  dependencies?: string[]
  risks?: string[]
  assigned_to?: number
  reviewer_id?: number
  start_date?: string
  target_date?: string
  completed_date?: string
  tags?: string[]
  attachments?: any[]
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: number
  site_id: number
  title: string
  description?: string
  milestone_type: string
  due_date: string
  completed_date?: string
  status: "Pending" | "In Progress" | "Completed" | "Overdue"
  priority: "High" | "Medium" | "Low"
  assigned_to?: number
  dependencies?: string[]
  deliverables?: string[]
  success_criteria?: string
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: number
  site_id?: number
  use_case_id?: number
  title: string
  description?: string
  category?: string
  priority: "High" | "Medium" | "Low"
  completed: boolean
  completed_by?: number
  completed_at?: string
  verification_required: boolean
  verified_by?: number
  verified_at?: string
  notes?: string
  attachments?: any[]
  created_at: string
  updated_at: string
}

export interface ScopingQuestionnaire {
  id: number
  site_id: number
  questionnaire_data: any
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected"
  submitted_by?: number
  submitted_at?: string
  reviewed_by?: number
  reviewed_at?: string
  approval_status: string
  version: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  priority: "low" | "normal" | "high" | "urgent"
  read: boolean
  read_at?: string
  action_url?: string
  metadata?: any
  expires_at?: string
  created_at: string
}

export interface FileAttachment {
  id: number
  site_id?: number
  use_case_id?: number
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  file_path: string
  uploaded_by: number
  description?: string
  tags?: string[]
  is_public: boolean
  created_at: string
}

export interface ActivityLog {
  id: number
  user_id?: number
  entity_type: string
  entity_id: number
  action: string
  description?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface SiteStats {
  total: number
  completed: number
  inProgress: number
  planning: number
  testing: number
  onHold: number
  avgCompletion: number
  totalBudget: number
  totalUsers: number
  overdueMilestones: number
  highRiskSites: number
}

export interface DashboardMetrics {
  sites: SiteStats
  useCases: {
    total: number
    completed: number
    inProgress: number
    avgCompletion: number
  }
  milestones: {
    total: number
    completed: number
    overdue: number
    dueThisWeek: number
  }
  checklist: {
    total: number
    completed: number
    completionRate: number
  }
}

export interface ReportData {
  id: string
  title: string
  type: "site_summary" | "progress_report" | "milestone_report" | "compliance_report"
  parameters: any
  generated_at: string
  generated_by: number
  file_url?: string
  status: "generating" | "completed" | "failed"
}
