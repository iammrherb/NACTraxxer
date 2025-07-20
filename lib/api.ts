import {
  mockSites,
  mockUsers,
  mockWiredVendors,
  mockWirelessVendors,
  mockDeviceTypes,
  mockChecklistItems,
  mockFirewallVendors,
  mockVpnVendors,
  mockEdrXdrVendors,
  mockSiemVendors,
} from "./mock-data"
import type { User, Site, Vendor, DeviceType, ChecklistItem, SiteStats, BaseVendor } from "./database"

// Users API
export async function getUsers(type?: "project_manager" | "technical_owner"): Promise<User[]> {
  if (type) {
    return mockUsers.filter((u) => u.user_type === type)
  }
  return mockUsers
}

export async function createUser(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  const newUser: User = {
    id: Math.max(0, ...mockUsers.map((u) => u.id)) + 1,
    ...user,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return newUser
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const userIndex = mockUsers.findIndex((u) => u.id === id)
  if (userIndex === -1) throw new Error("User not found")
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updated_at: new Date().toISOString() }
  return mockUsers[userIndex]
}

export async function deleteUser(id: number): Promise<void> {
  const index = mockUsers.findIndex((u) => u.id === id)
  if (index > -1) {
    mockUsers.splice(index, 1)
  }
}

// Sites API
export async function getSites(): Promise<Site[]> {
  return mockSites.map((site) => ({
    ...site,
    project_manager_name: mockUsers.find((u) => u.id === site.project_manager_id)?.name,
  }))
}

export async function getSite(id: string): Promise<Site | null> {
  const site = mockSites.find((s) => s.id === id)
  if (!site) return null
  return {
    ...site,
    project_manager_name: mockUsers.find((u) => u.id === site.project_manager_id)?.name,
  }
}

export async function createSite(siteData: any): Promise<Site> {
  const newSite: Site = {
    ...siteData,
    id: `SITE${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockSites.push(newSite)
  return (await getSite(newSite.id))!
}

export async function updateSite(id: string, siteData: any): Promise<Site> {
  const siteIndex = mockSites.findIndex((s) => s.id === id)
  if (siteIndex === -1) throw new Error("Site not found")

  const currentSite = mockSites[siteIndex]

  // Deep merge for os_details
  const updatedOsDetails = {
    ...currentSite.os_details,
    ...siteData.os_details,
  }

  mockSites[siteIndex] = {
    ...currentSite,
    ...siteData,
    os_details: updatedOsDetails,
    updated_at: new Date().toISOString(),
  }
  return (await getSite(id))!
}

export async function deleteSite(id: string): Promise<void> {
  const index = mockSites.findIndex((s) => s.id === id)
  if (index > -1) {
    mockSites.splice(index, 1)
  }
}

// Vendors API
export async function getWiredVendors(): Promise<Vendor[]> {
  return mockWiredVendors
}

export async function getWirelessVendors(): Promise<Vendor[]> {
  return mockWirelessVendors
}

export async function getFirewallVendors(): Promise<BaseVendor[]> {
  return mockFirewallVendors
}

export async function getVpnVendors(): Promise<BaseVendor[]> {
  return mockVpnVendors
}

export async function getEdrXdrVendors(): Promise<BaseVendor[]> {
  return mockEdrXdrVendors
}

export async function getSiemVendors(): Promise<BaseVendor[]> {
  return mockSiemVendors
}

export async function getVendors(type?: "wired" | "wireless"): Promise<Vendor[]> {
  const allVendors = [...mockWiredVendors, ...mockWirelessVendors]
  if (type) {
    return allVendors.filter((v) => v.type === type)
  }
  return allVendors
}

export async function createVendor(vendor: Omit<Vendor, "id" | "created_at">): Promise<Vendor> {
  const allVendors = [...mockWiredVendors, ...mockWirelessVendors]
  const newVendor: Vendor = {
    id: Math.max(0, ...allVendors.map((v) => v.id)) + 1,
    ...vendor,
    created_at: new Date().toISOString(),
  }
  if (newVendor.type === "wired") {
    mockWiredVendors.push(newVendor)
  } else {
    mockWirelessVendors.push(newVendor)
  }
  return newVendor
}

// Device Types API
export async function getDeviceTypes(): Promise<DeviceType[]> {
  return mockDeviceTypes
}

export async function createDeviceType(deviceType: Omit<DeviceType, "id" | "created_at">): Promise<DeviceType> {
  const newDeviceType: DeviceType = {
    id: Math.max(0, ...mockDeviceTypes.map((d) => d.id)) + 1,
    ...deviceType,
    created_at: new Date().toISOString(),
  }
  mockDeviceTypes.push(newDeviceType)
  return newDeviceType
}

// Checklist Items API
export async function getChecklistItems(): Promise<ChecklistItem[]> {
  return mockChecklistItems
}

export async function createChecklistItem(
  item: Omit<ChecklistItem, "id" | "created_at" | "completed" | "completed_at">,
): Promise<ChecklistItem> {
  const newItem: ChecklistItem = {
    id: Math.max(0, ...mockChecklistItems.map((i) => i.id)) + 1,
    ...item,
    created_at: new Date().toISOString(),
  }
  mockChecklistItems.push(newItem)
  return newItem
}

// Statistics API
export async function getSiteStats(): Promise<SiteStats> {
  const total_sites = mockSites.length
  const completed_sites = mockSites.filter((s) => s.status === "Complete").length
  const in_progress_sites = mockSites.filter((s) => s.status === "In Progress").length
  const planned_sites = mockSites.filter((s) => s.status === "Planned").length
  const delayed_sites = mockSites.filter((s) => s.status === "Delayed").length
  const total_users = mockSites.reduce((sum, s) => sum + s.users_count, 0)
  const overall_completion =
    total_sites > 0 ? Math.round(mockSites.reduce((sum, s) => sum + s.completion_percent, 0) / total_sites) : 0

  return {
    total_sites,
    completed_sites,
    in_progress_sites,
    planned_sites,
    delayed_sites,
    total_users,
    overall_completion,
  }
}
