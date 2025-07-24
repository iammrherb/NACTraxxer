export type Site = {
  id: string
  project_id: string
  name: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold"
  region: string
  country: string
  users_count: number
  completion_percentage: number
  go_live_date: string | null
  created_at: string
  updated_at: string
  // Foreign key IDs
  pm_id?: string
  tech_owner_ids?: string[]
  vendor_ids?: string[]
  mdm_vendor_ids?: string[]
  // Optional details
  details?: any
  config?: any
  progress?: any
}

export type Project = {
  id: string
  name: string
  customer: string
  status: "Planning" | "Active" | "Completed"
  created_at: string
  updated_at: string
  settings?: any
}

export type DatabaseUser = {
  id: string
  name: string
  role: "Admin" | "Project Manager" | "Technical Owner" | "Read-Only"
}

export type Vendor = {
  id: string
  name: string
  type: "wired" | "wireless" | "firewall" | "vpn" | "edr_xdr" | "siem" | "mdm"
}

export type DeviceType = {
  id: string
  name: string
}

export type ChecklistItem = {
  id: string
  name: string
  category: string
}

export type UseCase = {
  id: string
  name: string
  description: string
}

export type TestMatrixItem = {
  id: string
  name: string
  description: string
}

export type LibraryData = {
  users: DatabaseUser[]
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: Vendor[]
  vpnVendors: Vendor[]
  edrXdrVendors: Vendor[]
  siemVendors: Vendor[]
  mdmVendors: Vendor[]
  deviceTypes: DeviceType[]
  checklistItems: ChecklistItem[]
  useCases: UseCase[]
  testMatrix: TestMatrixItem[]
}

export type SiteStats = {
  totalSites: number
  completedSites: number
  inProgressSites: number
  onHoldSites: number
  planningSites: number
  overallCompletion: number
}

export type ScopingQuestionnaire = {
  id?: string
  organizationName: string
  industry: string
  region: string
  country: string
  totalUsers: number
  siteCount: number
  wiredVendors: string[]
  wirelessVendors: string[]
  mdmVendors: string[]
  status: "Draft" | "Completed"
  created_at?: string
  updated_at?: string
}
