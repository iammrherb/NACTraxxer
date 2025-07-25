import type { Database } from "./database.types"

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

export type Site = Tables<"sites"> & {
  project_manager?: Pick<User, "id" | "name">
  technical_owners?: Pick<User, "id" | "name">[]
  vendors?: Pick<Vendor, "id" | "name">[]
  firewall_vendors?: Pick<BaseVendor, "id" | "name">[]
  vpn_vendors?: Pick<BaseVendor, "id" | "name">[]
  edr_xdr_vendors?: Pick<BaseVendor, "id" | "name">[]
  siem_vendors?: Pick<BaseVendor, "id" | "name">[]
  device_types?: Pick<DeviceType, "id" | "name">[]
  checklist_items?: Pick<ChecklistItem, "id" | "title" | "completed">[]
  use_cases?: Pick<UseCase, "id" | "title">[]
  test_matrix_entries?: Pick<TestMatrixEntry, "id" | "scenario">[]
}

export type User = Tables<"users">
export type Vendor = Tables<"vendors">
export type BaseVendor = Tables<"base_vendors">
export type DeviceType = Tables<"device_types">
export type ChecklistItem = Tables<"checklist_items">
export type UseCase = Tables<"use_cases">
export type TestMatrixEntry = Tables<"test_matrix">
export type ScopingResponse = Tables<"scoping_responses">
export type Project = Tables<"projects">

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
