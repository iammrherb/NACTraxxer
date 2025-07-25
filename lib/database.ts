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

export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Site = Database["public"]["Tables"]["sites"]["Row"]
export type ScopingQuestionnaire = Database["public"]["Tables"]["scoping_questionnaires"]["Row"]
export type DatabaseUser = Database["public"]["Tables"]["users"]["Row"]
export type Vendor = Database["public"]["Tables"]["vendors"]["Row"]
export type DeviceType = Database["public"]["Tables"]["device_types"]["Row"]
export type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"]
export type UseCase = Database["public"]["Tables"]["use_cases"]["Row"]

// You can keep these composite types if they are still useful for your frontend logic
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
