import { neon } from "@neondatabase/serverless"
import type { Database } from "./database.types"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export async function testDatabaseConnection() {
  try {
    await sql`SELECT 1`
    console.log("Database connection successful.")
    return { success: true, message: "Database connection successful." }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, message: "Database connection failed.", error }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

export type Site = Tables<"sites"> & {
  project_id: string
  project_manager_name?: string
  technical_owners?: Pick<User, "id" | "name">[]
  vendors?: Pick<Vendor, "id" | "name">[]
  firewall_vendors?: Pick<BaseVendor, "id" | "name">[]
  vpn_vendors?: Pick<BaseVendor, "id" | "name">[]
  edr_xdr_vendors?: Pick<BaseVendor, "id" | "name">[]
  siem_vendors?: Pick<BaseVendor, "id" | "name">[]
  device_types?: Pick<DeviceType, "id" | "name">[]
  checklist_items?: (Pick<ChecklistItem, "id" | "title"> & { completed: boolean })[]
  use_cases?: Pick<UseCase, "id" | "title">[]
  test_matrix_entries?: Pick<TestMatrixEntry, "id" | "scenario">[]
  use_case_ids?: string[]
  test_matrix_ids?: string[]
  os_details?: {
    windows?: boolean
    macos?: boolean
    ios?: boolean
    android?: boolean
    linux?: boolean
    linux_distro?: string
  }
  auth_methods?: string[]
  project_goals?: string[]
}

export type User = Tables<"users"> & {
  role: Enums<"user_role">
}
export type Vendor = Tables<"vendors">
export type BaseVendor = Tables<"base_vendors">
export type DeviceType = Tables<"device_types">
export type ChecklistItem = Tables<"checklist_items">
export type UseCase = Tables<"use_cases">
export type TestMatrixEntry = Tables<"test_matrix">
export type ScopingResponse = Tables<"scoping_responses">
export type Project = Tables<"projects"> & { customer_name?: string }

export type SiteChecklistItem = {
  site_id: string
  checklist_item_id: number
  completed: boolean
  assigned_user_id: string | null
  due_date: string | null
  title: string
  description: string | null
  category: string
  assigned_user_name: string | null
  assigned_user_avatar: string | null
}

export interface LibraryData {
  users: User[]
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: BaseVendor[]
  vpnVendors: BaseVendor[]
  edrXdrVendors: BaseVendor[]
  siemVendors: BaseVendor[]
  deviceTypes: DeviceType[]
  checklistItems: ChecklistItem[]
  useCases: UseCase[]
  testMatrix: TestMatrixEntry[]
}

export interface SiteStats {
  total_sites: number
  completed_sites: number
  in_progress_sites: number
  planned_sites: number
  delayed_sites: number
  total_users: number
  overall_completion: number
  total_checklist_items: number
  completed_checklist_items: number
  checklist_completion: number
  sites: Site[]
}
