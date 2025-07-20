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
  clearMockSites as clearData,
  loadMockSites as loadData,
} from "./library-data"

import type {
  Site,
  User,
  LibraryData,
  Vendor,
  DeviceType,
  ChecklistItem,
  SiteStats,
  UseCase,
  TestCase,
  Requirement,
} from "./database"

// Hold data in memory
let sites: Site[] = JSON.parse(JSON.stringify(mockSites))
let users: User[] = JSON.parse(JSON.stringify(mockUsers))
const wiredVendors: Vendor[] = JSON.parse(JSON.stringify(initialWiredVendors))
const wirelessVendors: Vendor[] = JSON.parse(JSON.stringify(initialWirelessVendors))
const deviceTypes: DeviceType[] = JSON.parse(JSON.stringify(initialDeviceTypes))
const checklistItems: ChecklistItem[] = JSON.parse(JSON.stringify(initialChecklistItems))
const useCases: UseCase[] = JSON.parse(JSON.stringify(initialUseCases))
const testCases: TestCase[] = JSON.parse(JSON.stringify(initialTestCases))
const requirements: Requirement[] = JSON.parse(JSON.stringify(initialRequirements))

// --- Site Management ---
export const getSites = async (): Promise<Site[]> => {
  await new Promise((res) => setTimeout(res, 200))
  return sites.map((site) => ({
    ...site,
    project_manager_name: users.find((u) => u.id === site.project_manager_id)?.name,
  }))
}

export const getSite = async (id: string): Promise<Site | undefined> => {
  await new Promise((res) => setTimeout(res, 100))
  const site = sites.find((s) => s.id === id)
  if (site) {
    return {
      ...site,
      project_manager_name: users.find((u) => u.id === site.project_manager_id)?.name,
    }
  }
  return undefined
}

export const createSite = async (siteData: any): Promise<Site> => {
  await new Promise((res) => setTimeout(res, 200))
  const newSite: Site = {
    ...siteData,
    id: `SITE-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  sites.push(newSite)
  return newSite
}

export const updateSite = async (id: string, updates: Partial<Site>): Promise<Site> => {
  await new Promise((res) => setTimeout(res, 200))
  const siteIndex = sites.findIndex((s) => s.id === id)
  if (siteIndex === -1) throw new Error("Site not found")
  sites[siteIndex] = { ...sites[siteIndex], ...updates, updated_at: new Date().toISOString() }
  return sites[siteIndex]
}

export const deleteSite = async (id: string): Promise<{ message: string }> => {
  await new Promise((res) => setTimeout(res, 200))
  const initialLength = sites.length
  sites = sites.filter((s) => s.id !== id)
  if (sites.length === initialLength) {
    throw new Error("Site not found")
  }
  return { message: "Site deleted successfully" }
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
    idpVendors: initialIdpVendors,
    mfaVendors: initialMfaVendors,
    deviceTypes: deviceTypes,
    checklistItems: checklistItems,
    useCases: useCases,
    testMatrix: initialTestMatrix,
    requirements: requirements,
    testCases: testCases,
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

// --- Generic Library Item CRUD ---
const getLibraryList = (type: string) => {
  switch (type) {
    case "use-cases":
      return useCases
    case "test-cases":
      return testCases
    case "requirements":
      return requirements
    case "wired-vendors":
      return wiredVendors
    case "wireless-vendors":
      return wirelessVendors
    case "device-types":
      return deviceTypes
    default:
      throw new Error(`Unknown library type: ${type}`)
  }
}

export const createLibraryItem = async (itemData: any, type: string): Promise<any> => {
  await new Promise((res) => setTimeout(res, 200))
  const list = getLibraryList(type)
  const newItem = {
    ...itemData,
    id: `${type.toUpperCase()}-${Date.now()}`,
    is_custom: true,
  }
  list.push(newItem)
  return newItem
}

export const updateLibraryItem = async (id: string | number, updates: any, type: string): Promise<any> => {
  await new Promise((res) => setTimeout(res, 200))
  const list = getLibraryList(type)
  const itemIndex = list.findIndex((item: any) => item.id === id)
  if (itemIndex === -1) throw new Error("Item not found")
  list[itemIndex] = { ...list[itemIndex], ...updates }
  return list[itemIndex]
}

export const deleteLibraryItem = async (id: string | number, type: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200))
  const listRef = getLibraryList(type)
  const itemIndex = listRef.findIndex((item: any) => item.id === id)
  if (itemIndex > -1) {
    listRef.splice(itemIndex, 1)
  } else {
    throw new Error("Item not found for deletion")
  }
}

// --- User CRUD ---
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  await new Promise((res) => setTimeout(res, 200))
  const newUser = { ...userData, id: Date.now() }
  users.push(newUser)
  return newUser
}

export const updateUser = async (id: number, updates: Partial<User>): Promise<User> => {
  await new Promise((res) => setTimeout(res, 200))
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) throw new Error("User not found")
  users[userIndex] = { ...users[userIndex], ...updates }
  return users[userIndex]
}

export const deleteUser = async (id: number): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200))
  users = users.filter((u) => u.id !== id)
}

// --- Vendor Specific ---
export const getVendors = async (): Promise<Vendor[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return [...wiredVendors, ...wirelessVendors]
}

export const createVendor = async (vendorData: Omit<Vendor, "id">): Promise<Vendor> => {
  const list = vendorData.type === "wired" ? wiredVendors : wirelessVendors
  const newVendor = { ...vendorData, id: Date.now(), is_custom: true }
  list.push(newVendor)
  return newVendor
}

// --- Device Type Specific ---
export const getDeviceTypes = async (): Promise<DeviceType[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return deviceTypes
}

export const createDeviceType = async (deviceData: Omit<DeviceType, "id" | "is_custom">): Promise<DeviceType> => {
  await new Promise((res) => setTimeout(res, 200))
  const newDevice: DeviceType = {
    ...deviceData,
    id: Date.now(),
    is_custom: true,
  }
  deviceTypes.push(newDevice)
  return newDevice
}

// --- Checklist Item Specific ---
export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return checklistItems
}

export const createChecklistItem = async (
  itemData: Omit<ChecklistItem, "id" | "is_custom">,
): Promise<ChecklistItem> => {
  await new Promise((res) => setTimeout(res, 200))
  const newItem: ChecklistItem = {
    ...itemData,
    id: `CHK-CUSTOM-${Date.now()}`,
    is_custom: true,
  }
  checklistItems.push(newItem)
  return newItem
}

// --- Debug/Settings Functions ---
export const clearDatabase = async () => {
  await new Promise((res) => setTimeout(res, 500))
  clearData()
  sites = []
  return { message: "All site data has been cleared." }
}

export const seedDatabase = async () => {
  await new Promise((res) => setTimeout(res, 500))
  loadData()
  sites = JSON.parse(JSON.stringify(mockSites))
  return { message: "Sample site data has been loaded." }
}
