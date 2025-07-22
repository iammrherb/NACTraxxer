import {
  mockSites,
  mockUsers,
  notifications,
  milestones,
  checklistItems as libraryChecklistItems,
  useCases,
  testCases,
  requirements,
  initialRegions,
  idpVendors,
  mfaVendors,
  edrVendors,
  siemVendors,
  wiredVendors,
  wirelessVendors,
  firewallVendors,
  vpnVendors,
  mdmVendors,
  deviceTypes,
} from "./library-data"
import type {
  Site,
  User,
  Notification,
  Milestone,
  LibraryData,
  SiteStats,
  ChecklistItem,
  DeviceType,
  Vendor,
  ScopingQuestionnaire,
} from "./types"

const state = {
  sites: JSON.parse(JSON.stringify(mockSites)),
  users: JSON.parse(JSON.stringify(mockUsers)),
  notifications: JSON.parse(JSON.stringify(notifications)),
  milestones: JSON.parse(JSON.stringify(milestones)),
}

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function getSites(): Promise<Site[]> {
  await simulateDelay(50)
  return JSON.parse(JSON.stringify(state.sites))
}

export async function getSite(id: string): Promise<Site | undefined> {
  await simulateDelay(50)
  const site = state.sites.find((s: Site) => s.id === id)
  return site ? JSON.parse(JSON.stringify(site)) : undefined
}

export async function createSite(siteData: Partial<Site>): Promise<Site> {
  await simulateDelay(100)
  const newSite: Site = {
    id: `site-${Date.now()}`,
    name: "New Site",
    customer: "",
    region: "",
    country: "",
    status: "Planned",
    projectManager: "",
    technicalOwners: [],
    wiredVendors: [],
    wirelessVendors: [],
    deviceTypes: [],
    radsec: "Native",
    plannedStart: new Date().toISOString(),
    plannedEnd: new Date().toISOString(),
    completionPercent: 0,
    deploymentChecklist: [],
    ...siteData,
  }
  state.sites.push(newSite)
  return JSON.parse(JSON.stringify(newSite))
}

export async function deleteSite(id: string): Promise<void> {
  await simulateDelay(100)
  const siteIndex = state.sites.findIndex((s: Site) => s.id === id)
  if (siteIndex > -1) {
    state.sites.splice(siteIndex, 1)
  }
}

export async function updateSite(id: string, updatedData: Partial<Site>): Promise<Site | null> {
  await simulateDelay(100)
  const siteIndex = state.sites.findIndex((s: Site) => s.id === id)
  if (siteIndex === -1) {
    return null
  }
  state.sites[siteIndex] = { ...state.sites[siteIndex], ...updatedData }
  return JSON.parse(JSON.stringify(state.sites[siteIndex]))
}

export async function getUsers(): Promise<User[]> {
  await simulateDelay(50)
  return JSON.parse(JSON.stringify(state.users))
}

export async function createUser(userData: Omit<User, "id" | "avatar">): Promise<User> {
  await simulateDelay(100)
  const newUser: User = {
    id: `user-${Date.now()}`,
    avatar: "/placeholder-user.jpg",
    ...userData,
  }
  state.users.push(newUser)
  return JSON.parse(JSON.stringify(newUser))
}

export async function getNotifications(): Promise<Notification[]> {
  await simulateDelay(100)
  const sortedNotifications = [...state.notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  return JSON.parse(JSON.stringify(sortedNotifications))
}

export async function getMilestones(): Promise<Milestone[]> {
  await simulateDelay(50)
  return JSON.parse(JSON.stringify(state.milestones))
}

export async function getLibraryData(): Promise<LibraryData> {
  await simulateDelay(20)
  return JSON.parse(
    JSON.stringify({
      deploymentChecklist: libraryChecklistItems,
      useCases,
      testCases,
      requirements,
      regions: initialRegions,
      idpVendors,
      mfaVendors,
      edrVendors,
      siemVendors,
      wiredVendors,
      wirelessVendors,
      firewallVendors,
      vpnVendors,
      mdmVendors,
      deviceTypes,
    }),
  )
}

export async function getSiteStats(): Promise<SiteStats> {
  await simulateDelay(150)
  const total_sites = state.sites.length
  const completed_sites = state.sites.filter((s: Site) => s.status === "Completed").length
  const in_progress_sites = state.sites.filter((s: Site) => s.status === "In Progress").length
  const planned_sites = state.sites.filter((s: Site) => s.status === "Planning").length
  const delayed_sites = state.sites.filter((s: Site) => s.status === "At Risk").length
  const total_users = state.users.length
  const overall_completion =
    total_sites > 0
      ? Math.round(
          state.sites.reduce((acc: number, site: Site) => {
            const totalItems = site.deploymentChecklist.length
            const completedItems = site.deploymentChecklist.filter((i) => i.completed).length
            return acc + (totalItems > 0 ? (completedItems / totalItems) * 100 : 0)
          }, 0) / total_sites,
        )
      : 0

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

export async function getChecklistStatus(siteId: string): Promise<Record<string, boolean>> {
  await simulateDelay(50)
  const site = state.sites.find((s: Site) => s.id === siteId)
  if (!site) {
    console.error(`Site with id ${siteId} not found in getChecklistStatus`)
    return {}
  }
  const status: Record<string, boolean> = {}
  site.deploymentChecklist.forEach((item) => {
    status[item.id] = item.completed
  })
  return status
}

export async function updateChecklistStatus(siteId: string, newStatus: Record<string, boolean>): Promise<void> {
  await simulateDelay(100)
  const siteIndex = state.sites.findIndex((s: Site) => s.id === siteId)

  if (siteIndex === -1) {
    console.error(`Site with id ${siteId} not found in updateChecklistStatus`)
    return
  }

  const site = state.sites[siteIndex]
  const updatedChecklist = site.deploymentChecklist.map((item) => ({
    ...item,
    completed: newStatus[item.id] ?? item.completed,
  }))

  state.sites[siteIndex].deploymentChecklist = updatedChecklist
}

export async function bulkUpdateSites(siteIds: string[], updates: any): Promise<void> {
  await simulateDelay(200)

  const updatedSites = state.sites.map((site: Site) => {
    if (siteIds.includes(site.id)) {
      const newSiteData = { ...site }
      if (updates.project_manager_id) {
        const pm = state.users.find((u: User) => u.id === updates.project_manager_id)
        if (pm) newSiteData.projectManager = pm.name
      }
      if (updates.technical_owner_ids) {
        newSiteData.technicalOwners = state.users
          .filter((u: User) => updates.technical_owner_ids.includes(u.id))
          .map((u: User) => u.name)
      }
      return newSiteData
    }
    return site
  })
  state.sites = updatedSites
}

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  const data = await getLibraryData()
  return data.deploymentChecklist
}

export async function createChecklistItem(itemData: Omit<ChecklistItem, "id">): Promise<ChecklistItem> {
  await simulateDelay(100)
  const newItem = { id: `chk-${Date.now()}`, ...itemData }
  console.log("Created checklist item (mock):", newItem)
  return newItem
}

export async function getDeviceTypes(): Promise<DeviceType[]> {
  const data = await getLibraryData()
  return data.deviceTypes
}

export async function createDeviceType(itemData: Omit<DeviceType, "id">): Promise<DeviceType> {
  await simulateDelay(100)
  const newItem = { id: `dev-${Date.now()}`, ...itemData }
  console.log("Created device type (mock):", newItem)
  return newItem
}

export async function getVendors(): Promise<Vendor[]> {
  const data = await getLibraryData()
  return [
    ...data.wiredVendors,
    ...data.wirelessVendors,
    ...data.firewallVendors,
    ...data.vpnVendors,
    ...data.mdmVendors,
    ...data.idpVendors,
    ...data.mfaVendors,
    ...data.edrVendors,
    ...data.siemVendors,
  ]
}

export async function createVendor(itemData: Omit<Vendor, "id">): Promise<Vendor> {
  await simulateDelay(100)
  const newItem = { id: `vendor-${Date.now()}`, ...itemData }
  console.log("Created vendor (mock):", newItem)
  return newItem
}

export async function getQuestionnaires(): Promise<ScopingQuestionnaire[]> {
  await simulateDelay(50)
  return []
}

export async function createQuestionnaire(data: Omit<ScopingQuestionnaire, "id">): Promise<ScopingQuestionnaire> {
  await simulateDelay(100)
  const newQuestionnaire = { id: Date.now(), ...data }
  console.log("Created questionnaire (mock):", newQuestionnaire)
  return newQuestionnaire
}

export async function updateQuestionnaire(
  id: number,
  data: Partial<ScopingQuestionnaire>,
): Promise<ScopingQuestionnaire> {
  await simulateDelay(100)
  console.log(`Updating questionnaire ${id} (mock):`, data)
  const mockQuestionnaire: ScopingQuestionnaire = {
    id,
    siteName: "Updated Site",
    customerName: "Updated Customer",
    region: "North America",
    country: "US",
    projectManager: "Alice",
    technicalOwner: "Bob",
    ...data,
  }
  return mockQuestionnaire
}

export async function deleteQuestionnaire(id: number): Promise<void> {
  await simulateDelay(100)
  console.log(`Deleting questionnaire ${id} (mock)`)
}

export async function deleteLibraryItem(id: number | string, type: string): Promise<void> {
  console.log(`Deleting item with id ${id} of type ${type}`)
  await simulateDelay(100)
}

export async function updateLibraryItem(id: number | string, data: any, type: string): Promise<void> {
  console.log(`Updating item with id ${id} of type ${type} with data:`, data)
  await simulateDelay(100)
}

export async function createLibraryItem(data: any, type: string): Promise<void> {
  console.log(`Creating item of type ${type} with data:`, data)
  await simulateDelay(100)
}
