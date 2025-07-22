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
  mockScopingQuestionnaires,
  clearSites as clearData,
  loadSampleSites as loadData,
} from "./library-data"

import type {
  Site,
  DatabaseUser,
  LibraryData,
  BaseVendor,
  Vendor,
  DeviceType,
  ChecklistItem,
  SiteStats,
  ScopingQuestionnaire,
} from "./database"

// Hold data in memory
let sites: Site[] = JSON.parse(JSON.stringify(mockSites))
const users: DatabaseUser[] = JSON.parse(JSON.stringify(mockUsers))
let questionnaires: ScopingQuestionnaire[] = JSON.parse(JSON.stringify(mockScopingQuestionnaires))
const wiredVendors: Vendor[] = JSON.parse(JSON.stringify(initialWiredVendors))
const wirelessVendors: Vendor[] = JSON.parse(JSON.stringify(initialWirelessVendors))
const idpVendors: BaseVendor[] = JSON.parse(JSON.stringify(initialIdpVendors))
const deviceTypes: DeviceType[] = JSON.parse(JSON.stringify(initialDeviceTypes))
const checklistItems: ChecklistItem[] = JSON.parse(JSON.stringify(initialChecklistItems))

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

export const bulkUpdateSites = async (siteIds: string[], updates: Partial<Site>): Promise<Site[]> => {
  await new Promise((res) => setTimeout(res, 500))
  const updatedSites: Site[] = []
  siteIds.forEach((id) => {
    const siteIndex = sites.findIndex((s) => s.id === id)
    if (siteIndex !== -1) {
      sites[siteIndex] = { ...sites[siteIndex], ...updates, updated_at: new Date().toISOString() }
      updatedSites.push(sites[siteIndex])
    }
  })
  return updatedSites
}

export const deleteSite = async (id: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 200))
  sites = sites.filter((s) => s.id !== id)
}

// --- Scoping Questionnaire Management ---
export const getQuestionnaires = async (): Promise<ScopingQuestionnaire[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return questionnaires
}

export const createQuestionnaire = async (data: Omit<ScopingQuestionnaire, "id" | "created_at" | "updated_at">) => {
  await new Promise((res) => setTimeout(res, 200))
  const newQuestionnaire: ScopingQuestionnaire = {
    ...data,
    id: `SCOPE-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  questionnaires.push(newQuestionnaire)
  return newQuestionnaire
}

export const updateQuestionnaire = async (id: string, updates: Partial<ScopingQuestionnaire>) => {
  await new Promise((res) => setTimeout(res, 200))
  const index = questionnaires.findIndex((q) => q.id === id)
  if (index === -1) throw new Error("Questionnaire not found")
  questionnaires[index] = { ...questionnaires[index], ...updates, updated_at: new Date().toISOString() }
  return questionnaires[index]
}

export const deleteQuestionnaire = async (id: string) => {
  await new Promise((res) => setTimeout(res, 200))
  questionnaires = questionnaires.filter((q) => q.id !== id)
}

// --- Library & Data Management ---
export const getLibraryData = async (): Promise<LibraryData> => {
  await new Promise((res) => setTimeout(res, 100))
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
export const createUser = async (
  userData: Omit<DatabaseUser, "id" | "created_at" | "updated_at">,
): Promise<DatabaseUser> => {
  await new Promise((res) => setTimeout(res, 200))
  const newUser: DatabaseUser = {
    ...userData,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}

export const updateUser = async (id: number, updates: Partial<DatabaseUser>): Promise<DatabaseUser> => {
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
