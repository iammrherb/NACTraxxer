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
const firewallVendors: Vendor[] = JSON.parse(JSON.stringify(initialFirewallVendors))
const vpnVendors: Vendor[] = JSON.parse(JSON.stringify(initialVpnVendors))
const edrXdrVendors: Vendor[] = JSON.parse(JSON.stringify(initialEdrXdrVendors))
const siemVendors: Vendor[] = JSON.parse(JSON.stringify(initialSiemVendors))
const idpVendors: Vendor[] = JSON.parse(JSON.stringify(initialIdpVendors))
const mfaVendors: Vendor[] = JSON.parse(JSON.stringify(initialMfaVendors))
const mdmVendors: Vendor[] = JSON.parse(JSON.stringify(initialMdmVendors))
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

export const createSite = async (siteData: Partial<Site>): Promise<Site> => {
  await new Promise((res) => setTimeout(res, 50))
  const newSite: Site = {
    id: siteData.id || `SITE-${Date.now()}`,
    name: siteData.name || "New Site",
    region: siteData.region || "North America",
    country: siteData.country || "United States",
    status: siteData.status || "Planned",
    phase: siteData.phase || 1,
    users_count: siteData.users_count || 0,
    planned_start: siteData.planned_start || new Date().toISOString().split("T")[0],
    planned_end: siteData.planned_end || new Date().toISOString().split("T")[0],
    completion_percent: 0,
    project_manager_id: siteData.project_manager_id || 0,
    technical_owner_ids: siteData.technical_owner_ids || [],
    radsec: "Native",
    vendor_ids: siteData.vendor_ids || [],
    firewall_vendor_ids: siteData.firewall_vendor_ids || [],
    vpn_vendor_ids: siteData.vpn_vendor_ids || [],
    edr_xdr_vendor_ids: siteData.edr_xdr_vendor_ids || [],
    siem_vendor_ids: siteData.siem_vendor_ids || [],
    idp_vendor_ids: siteData.idp_vendor_ids || [],
    mfa_vendor_ids: siteData.mfa_vendor_ids || [],
    mdm_vendor_ids: siteData.mdm_vendor_ids || [],
    device_type_ids: siteData.device_type_ids || [],
    checklist_item_ids: siteData.checklist_item_ids || [],
    use_case_ids: siteData.use_case_ids || [],
    tasks: [],
    test_case_statuses: [],
    requirement_statuses: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    wiredVendors,
    wirelessVendors,
    firewallVendors,
    vpnVendors,
    edrXdrVendors,
    siemVendors,
    idpVendors,
    mfaVendors,
    mdmVendors,
    deviceTypes,
    checklistItems,
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

// --- Library Item CRUD (Generic) ---
const getListByItemType = (itemType: string): any[] => {
  switch (itemType) {
    case "device-types":
      return deviceTypes
    case "checklist":
      return checklistItems
    default:
      throw new Error(`Invalid library item type for getList: ${itemType}`)
  }
}

const getVendorList = (type: Vendor["type"]): Vendor[] => {
  switch (type) {
    case "wired":
      return wiredVendors
    case "wireless":
      return wirelessVendors
    case "firewall":
      return firewallVendors
    case "vpn":
      return vpnVendors
    case "edr-xdr":
      return edrXdrVendors
    case "siem":
      return siemVendors
    case "idp":
      return idpVendors
    case "mfa":
      return mfaVendors
    case "mdm":
      return mdmVendors
    default:
      throw new Error(`Invalid vendor type: ${type}`)
  }
}

export const createLibraryItem = async (itemData: any, itemType: string): Promise<any> => {
  await new Promise((res) => setTimeout(res, 100))

  const newItem = {
    ...itemData,
    id: Date.now(),
    is_custom: true,
    created_at: new Date().toISOString(),
  }

  let list: any[]
  if (itemType.includes("vendor")) {
    list = getVendorList(itemData.type)
  } else {
    list = getListByItemType(itemType)
  }

  list.push(newItem)
  return newItem
}

export const updateLibraryItem = async (id: number, updates: any, itemType: string): Promise<any> => {
  await new Promise((res) => setTimeout(res, 100))

  let list: any[]
  if (itemType.includes("vendor")) {
    list = getVendorList(updates.type)
  } else {
    list = getListByItemType(itemType)
  }

  const index = list.findIndex((i) => i.id === id)
  if (index === -1) throw new Error("Item not found")
  list[index] = { ...list[index], ...updates }
  return list[index]
}

export const deleteLibraryItem = async (id: number, itemType: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 100))

  const allLists = [
    wiredVendors,
    wirelessVendors,
    firewallVendors,
    vpnVendors,
    edrXdrVendors,
    siemVendors,
    idpVendors,
    mfaVendors,
    mdmVendors,
    deviceTypes,
    checklistItems,
  ]

  for (const list of allLists) {
    const index = list.findIndex((i) => i.id === id)
    if (index > -1) {
      list.splice(index, 1)
      return
    }
  }
  throw new Error("Item not found in any library list")
}

// --- Specific Library Functions (re-added for compatibility) ---

// --- Vendor Specific ---
export const getVendors = async (): Promise<Vendor[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return [...wiredVendors, ...wirelessVendors]
}

export const createVendor = async (vendorData: Omit<Vendor, "id" | "is_custom" | "created_at">): Promise<Vendor> => {
  return createLibraryItem(vendorData, "vendor")
}

// --- Device Type Specific ---
export const getDeviceTypes = async (): Promise<DeviceType[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return deviceTypes
}

export const createDeviceType = async (item: { name: string }): Promise<DeviceType> => {
  return createLibraryItem(item, "device-types")
}

// --- Checklist Item Specific ---
export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
  await new Promise((res) => setTimeout(res, 100))
  return checklistItems
}

export const createChecklistItem = async (item: { name: string; category: string }): Promise<ChecklistItem> => {
  return createLibraryItem(item, "checklist")
}

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
