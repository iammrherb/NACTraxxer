import {
  mockUsers,
  initialWiredVendors,
  initialWirelessVendors,
  initialFirewallVendors,
  initialVpnVendors,
  initialEdrXdrVendors,
  initialSiemVendors,
  initialIdpVendors,
  initialMfaVendors,
  initialMdmVendors,
  initialDeviceTypes,
  initialChecklistItems,
  initialUseCases,
  initialTestMatrix,
  initialRequirements,
  initialTestCases,
  initialTasks,
  initialRegions,
  mockCountries,
} from "./library-data"

import type {
  Site,
  DatabaseUser,
  LibraryData,
  SiteStats,
  ScopingQuestionnaire,
  Vendor,
  DeviceType,
  ChecklistItem,
} from "./database"

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || "API request failed")
  }
  return response.json()
}

// --- Site Management ---
// NOTE: These are placeholders and will be implemented with a real sites API later.
export const getSites = async (): Promise<Site[]> => {
  console.warn("getSites is a mock implementation.")
  return []
}

export const createSite = async (siteData: Partial<Site>): Promise<Site> => {
  console.warn("createSite is a mock implementation.")
  return siteData as Site
}

export const getSite = async (id: string): Promise<Site | undefined> => {
  console.warn("getSite is a mock implementation.")
  return undefined
}

export const updateSite = async (id: string, updates: Partial<Site>): Promise<Site> => {
  console.warn("updateSite is a mock implementation.")
  return { ...updates, id } as Site
}

export const bulkUpdateSites = async (siteIds: string[], updates: Partial<Site>): Promise<Site[]> => {
  console.warn("bulkUpdateSites is a mock implementation.")
  return siteIds.map((id) => ({ ...updates, id })) as Site[]
}

export const deleteSite = async (id: string): Promise<void> => {
  console.warn("deleteSite is a mock implementation.")
}

// --- Scoping Questionnaire Management ---
export const getQuestionnaires = async (): Promise<ScopingQuestionnaire[]> => {
  const response = await fetch("/api/scoping")
  return handleResponse(response)
}

export const createQuestionnaire = async (data: Partial<ScopingQuestionnaire>): Promise<ScopingQuestionnaire> => {
  const response = await fetch("/api/scoping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export const updateQuestionnaire = async (
  id: string,
  updates: Partial<ScopingQuestionnaire>,
): Promise<ScopingQuestionnaire> => {
  const response = await fetch(`/api/scoping/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  return handleResponse(response)
}

export const deleteQuestionnaire = async (id: string): Promise<void> => {
  const response = await fetch(`/api/scoping/${id}`, {
    method: "DELETE",
  })
  // Don't throw on 404, just complete
  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || "API request failed")
  }
}

// --- Library & Data Management (using mock data for now) ---
export const getLibraryData = async (): Promise<LibraryData> => {
  return {
    wiredVendors: initialWiredVendors,
    wirelessVendors: initialWirelessVendors,
    firewallVendors: initialFirewallVendors,
    vpnVendors: initialVpnVendors,
    edrXdrVendors: initialEdrXdrVendors,
    siemVendors: initialSiemVendors,
    idpVendors: initialIdpVendors,
    mfaVendors: initialMfaVendors,
    mdmVendors: initialMdmVendors,
    deviceTypes: initialDeviceTypes,
    checklistItems: initialChecklistItems,
    useCases: initialUseCases,
    testMatrix: initialTestMatrix,
    requirements: initialRequirements,
    testCases: initialTestCases,
    tasks: initialTasks,
    regions: initialRegions.map((r) => ({ name: r })),
    countries: mockCountries,
  }
}

export const getUsers = async (): Promise<DatabaseUser[]> => {
  return mockUsers
}

export const getSiteStats = async (): Promise<SiteStats> => {
  // Mock implementation
  return {
    total_sites: 0,
    completed_sites: 0,
    in_progress_sites: 0,
    planned_sites: 0,
    delayed_sites: 0,
    total_users: 0,
    overall_completion: 0,
  }
}

// --- User Management (mock) ---
export const createUser = async (userData: any): Promise<DatabaseUser> => {
  console.log("Mock createUser", userData)
  return { ...userData, id: Date.now() } as DatabaseUser
}

export const updateUser = async (id: number, updates: any): Promise<DatabaseUser> => {
  console.log("Mock updateUser", id, updates)
  return { ...updates, id } as DatabaseUser
}

export const deleteUser = async (id: number): Promise<void> => {
  console.log("Mock deleteUser", id)
}

// --- Library Item CRUD (mock) ---
export const createLibraryItem = async (itemData: any, itemType: string): Promise<any> => {
  console.log("Mock createLibraryItem", itemType, itemData)
  return { ...itemData, id: Date.now(), is_custom: true }
}

export const updateLibraryItem = async (id: number, updates: any, itemType: string): Promise<any> => {
  console.log("Mock updateLibraryItem", itemType, id, updates)
  return { ...updates, id }
}

export const deleteLibraryItem = async (id: number, itemType: string): Promise<void> => {
  console.log("Mock deleteLibraryItem", itemType, id)
}

// --- Specific Library Functions (for compatibility) ---

// --- Vendor Specific ---
export const getVendors = async (): Promise<Vendor[]> => {
  console.log("Mock getVendors")
  return [...initialWiredVendors, ...initialWirelessVendors]
}

export const createVendor = async (vendorData: Omit<Vendor, "id" | "is_custom" | "created_at">): Promise<Vendor> => {
  console.log("Mock createVendor", vendorData)
  return createLibraryItem(vendorData, "vendor")
}

// --- Device Type Specific ---
export const getDeviceTypes = async (): Promise<DeviceType[]> => {
  console.log("Mock getDeviceTypes")
  return initialDeviceTypes
}

export const createDeviceType = async (item: { name: string }): Promise<DeviceType> => {
  console.log("Mock createDeviceType", item)
  return createLibraryItem(item, "device-types")
}

// --- Checklist Item Specific ---
export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
  console.log("Mock getChecklistItems")
  return initialChecklistItems
}

export const createChecklistItem = async (item: { name: string; category: string }): Promise<ChecklistItem> => {
  console.log("Mock createChecklistItem", item)
  return createLibraryItem(item, "checklist")
}

// --- Debug/Settings Functions (mock) ---
export const clearDatabase = async () => {
  console.log("Mock clearDatabase")
  return { message: "Mock database cleared." }
}

export const seedDatabase = async () => {
  console.log("Mock seedDatabase")
  return { message: "Mock database seeded." }
}
