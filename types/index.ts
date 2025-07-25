// types/index.ts

// Based on PRD Section 2.1, 2.3, 6.2
export type ProjectPhase = "Discovery" | "Design" | "Implementation" | "Testing" | "Deployment" | "Optimization"
export type DetailedStatus = "On Track" | "At Risk" | "Off Track" | "On Hold" | "Completed" | "Planning"

export interface HealthMetrics {
  overall: number // 0-100
  schedule: number
  technical_risk: number
  resource_adequacy: number
}

export interface Milestone {
  name: string
  status: "Completed" | "In Progress" | "Pending"
  due_date: string
}

export interface Project {
  id: string
  name: string
  type: "POC" | "Pilot" | "Production" | "Migration" | "Expansion"
  phase: ProjectPhase
  status: DetailedStatus
  health_score: HealthMetrics
  customer: string
  project_manager: string
  start_date: string
  end_date: string
  completion_percentage: number
  description: string
  milestones: Milestone[]
}

export interface Site {
  id: string
  name: string
  hierarchy_path: string
  priority: "P0-Critical" | "P1-High" | "P2-Medium" | "P3-Low"
  status: "Pending" | "In Progress" | "Completed" | "Failed"
  project_id: string
}

// Based on PRD Section 10.1: Real-Time Analytics Dashboard
export interface DashboardMetric {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease"
  description: string
}

export interface User {
  name: string
  email: string
  avatar: string
  role: "Admin" | "Project Manager" | "Engineer" | "Sales Engineer" | "Customer"
}
