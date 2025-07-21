import {
  mockSites,
  mockUsers,
  initialWiredVendors,
  initialWirelessVendors,
  initialFirewallVendors,
  initialVpnVendors,
  initialEdrXdrVendors,
  initialSiemVendors,
  initialIdpVendors,
  initialMfaVendors,
  initialDeviceTypes,
  initialChecklistItems,
  initialUseCases,
  initialTestMatrix,
  initialRequirements,
  initialTestCases,
  initialTasks,
  initialRegions,
  mockCountries,
  clearSites as clearData,
  loadSampleSites as loadData,
} from "./library-data"

import type { Site, User, LibraryData, BaseVendor, Vendor, DeviceType, ChecklistItem, SiteStats } from "./database"

// Hold data in memory
let sites: Site[] = JSON.parse(JSON.stringify(mockSites))
const users: User[] = JSON.parse(JSON.stringify(mockUsers))
const wiredVendors: Vendor[] = JSON.parse(JSON.stringify(initialWiredVendors))
const wirelessVendors: Vendor[] = JSON.parse(JSON.stringify(initialWirelessVendors))
const idpVendors: BaseVendor[] = JSON.parse(JSON.stringify(initialIdpVendors))
const deviceTypes: DeviceType[] = JSON.parse(JSON.stringify(initialDeviceTypes))
const checklistItems: ChecklistItem[] = JSON.parse(JSON.stringify(initialChecklistItems))

// --- Site Management ---
export const getSites = async (): Promise<Site[]> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 200))
  // In a real app, you'd populate related data here
  return sites.map((site) => ({
    ...site,
    project_manager_name: users.find((u) => u.id === site.project_manager_id)?.name,
  }))
}

export const getSite = async (id: string): Promise<Site | undefined> => {
  await new Promise((res) => setTimeout(res, 100))
  return sites.find((s) => s.id === id)
}

export const createSite = async (siteData: Omit<Site, "id" | "created_at" | "updated_at">): Promise<Site> => {
  await new Promise((res) => setTimeout(res, 200))
  const newSite: Site = {
    ...siteData,
    id: `SITE-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completion_percent: 0,
    tasks: [],
    test_case_statuses: [],
    requirement_statuses: [],
  }
  sites.push(newSite)
  return newSite
}

export const updateSite = async (id: string, updates: Partial<Site>): Promise<Site> => {
  await new Promise((res) => setTimeout(res, 200))
  const siteIndex = sites.findIndex((s) => s.id === id)
  if (siteIndex === -1) {
    throw new Error("Site not found")
  }
  sites[siteIndex] = { ...sites[siteIndex], ...updates, updated_at: new Date().toISOString() }
  return sites[siteIndex]
}

export const deleteSite = async (id: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200))
  sites = sites.filter((s) => s.id !== id)
}

// --- Library & Data Management ---
export const getLibraryData = async (): Promise<LibraryData> => {
  await new Promise((res) => setTimeout(res, 100))
  return {
    wiredVendors: wiredVendors,
    wirelessVendors: wirelessVendors,
    firewallVendors: initialFirewallVendors,
    vpnVendors: initialVpnVendors,
    edrXdrVendors: initialEdrXdrVendors,
    siemVendors: initialSiemVendors,
    idpVendors: idpVendors,
    mfaVendors: initialMfaVendors,
    deviceTypes: deviceTypes,
    checklistItems: checklistItems,
    useCases: initialUseCases,
    testMatrix: initialTestMatrix,
    requirements: initialRequirements,
    testCases: initialTestCases,
    tasks: initialTasks,
    regions: initialRegions,
    countries: mockCountries,
  }
}

export const getUsers = async (): Promise<User[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return users
}

export const getSiteStats = async (): Promise<SiteStats> => {
  await new Promise((res) => setTimeout(res, 300))
  const total_sites = sites.length
  const completed_sites = sites.filter((s) => s.status === "Complete").length
  const in_progress_sites = sites.filter((s) => s.status === "In Progress").length
  const planned_sites = sites.filter((s) => s.status === "Planned").length
  const delayed_sites = sites.filter((s) => s.status === "Delayed").length
  const total_users = sites.reduce((acc, site) => acc + (site.users_count || 0), 0)
  const overall_completion =
    total_sites > 0 ? Math.round(sites.reduce((acc, site) => acc + (site.completion_percent || 0), 0) / total_sites) : 0
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

// --- User Management ---
export const createUser = async (userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> => {
  await new Promise((res) => setTimeout(res, 200))
  const newUser: User = {
    ...userData,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}

export const updateUser = async (id: number, updates: Partial<User>): Promise<User> => {
  await new Promise((res) => setTimeout(res, 200))
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) throw new Error("User not found")
  users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date().toISOString() }
  return users[userIndex]
}

export const deleteUser = async (id: number): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200))
  const index = users.findIndex((u) => u.id === id)
  if (index > -1) {
    users.splice(index, 1)
  } else {
    throw new Error("User not found")
  }
}

// --- Vendor Specific ---
export const getVendors = async (): Promise<Vendor[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return [...wiredVendors, ...wirelessVendors]
}

export const createVendor = async (vendorData: Omit<Vendor, "id" | "is_custom" | "created_at">): Promise<Vendor> => {
  const list = vendorData.type === "wired" ? wiredVendors : wirelessVendors
  const newVendor: Vendor = {
    ...vendorData,
    id: Date.now(),
    is_custom: true,
    created_at: new Date().toISOString(),
  }
  list.push(newVendor)
  return newVendor
}

// --- Device Type Specific ---
export const getDeviceTypes = async (): Promise<DeviceType[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return deviceTypes
}

// --- Checklist Item Specific ---
export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return checklistItems
}

// --- Library Item CRUD ---
const createLibraryItem = <T extends { id: number; name: string }>(list: T[], item: { name: string }): T => {
  const newItem = {
    ...item,
    id: Date.now(),
    is_custom: true,
    created_at: new Date().toISOString(),
  } as T
  list.push(newItem)
  return newItem
}

const updateLibraryItem = <T extends { id: number }>(list: T[], item: T): T => {
  const index = list.findIndex((i) => i.id === item.id)
  if (index > -1) {
    list[index] = item
    return item
  }
  throw new Error("Item not found")
}

const deleteLibraryItem = <T extends { id: number }>(list: T[], id: number): void => {
  const index = list.findIndex((i) => i.id === id)
  if (index > -1) {
    list.splice(index, 1)
  } else {
    throw new Error("Item not found")
  }
}

export const createWiredVendor = (item: { name: string }) => createLibraryItem(wiredVendors, { ...item, type: "wired" })
export const updateWiredVendor = (item: Vendor) => updateLibraryItem(wiredVendors, item)
export const deleteWiredVendor = (id: number) => deleteLibraryItem(wiredVendors, id)

export const createWirelessVendor = (item: { name: string }) =>
  createLibraryItem(wirelessVendors, { ...item, type: "wireless" })
export const updateWirelessVendor = (item: Vendor) => updateLibraryItem(wirelessVendors, item)
export const deleteWirelessVendor = (id: number) => deleteLibraryItem(wirelessVendors, id)

export const createDeviceType = (item: { name: string }) => createLibraryItem(deviceTypes, item)
export const updateDeviceType = (item: DeviceType) => updateLibraryItem(deviceTypes, item)
export const deleteDeviceType = (id: number) => deleteLibraryItem(deviceTypes, id)

export const createChecklistItem = (item: { name: string; category: string }) => createLibraryItem(checklistItems, item)
export const updateChecklistItem = (item: ChecklistItem) => updateLibraryItem(checklistItems, item)
export const deleteChecklistItem = (id: number) => deleteLibraryItem(checklistItems, id)

// --- Debug/Settings Functions ---
export const clearDatabase = async () => {
  await new Promise((res) => setTimeout(res, 500))
  clearData()
  sites = [] // Clear the in-memory array too
  return { message: "All site data has been cleared." }
}

export const seedDatabase = async () => {
  await new Promise((res) => setTimeout(res, 500))
  loadData()
  // Deep copy to prevent mutation issues
  sites = JSON.parse(JSON.stringify(mockSites))
  return { message: "Sample site data has been loaded." }
}
