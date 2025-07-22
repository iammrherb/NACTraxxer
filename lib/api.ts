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

// Helper to fetch data and handle errors
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    let errorDetails
    try {
      const errorData = await response.json()
      errorDetails = errorData.message || errorData.details || JSON.stringify(errorData)
    } catch (e) {
      errorDetails = response.statusText || `Request failed with status ${response.status}`
    }
    console.error("API Error:", errorDetails)
    throw new Error(errorDetails)
  }

  try {
    const text = await response.text()
    return text ? JSON.parse(text) : (null as T)
  } catch (e) {
    console.error("Failed to parse JSON response")
    throw new Error("Invalid JSON response from server.")
  }
}

// --- Site API ---
export async function getSites(): Promise<Site[]> {
  return fetchAPI<Site[]>("/api/sites")
}

export async function getSite(id: string): Promise<Site | undefined> {
  return fetchAPI<Site | undefined>(`/api/sites/${id}`)
}

export async function createSite(siteData: Partial<Site>): Promise<Site> {
  return fetchAPI<Site>("/api/sites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(siteData),
  })
}

export async function updateSite(id: string, updatedData: Partial<Site>): Promise<Site | null> {
  return fetchAPI<Site | null>(`/api/sites/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  })
}

export async function deleteSite(id: string): Promise<void> {
  return fetchAPI<void>(`/api/sites/${id}`, { method: "DELETE" })
}

export async function bulkUpdateSites(siteIds: string[], updates: any): Promise<void> {
  return fetchAPI<void>("/api/sites/bulk", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteIds, updates }),
  })
}

// --- User API ---
export async function getUsers(): Promise<User[]> {
  return fetchAPI<User[]>("/api/users")
}

export async function createUser(userData: Omit<User, "id" | "avatar">): Promise<User> {
  return fetchAPI<User>("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  return fetchAPI<User>(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(id: string): Promise<void> {
  return fetchAPI<void>(`/api/users/${id}`, { method: "DELETE" })
}

// --- Library & Static Data API ---
export async function getLibraryData(): Promise<LibraryData> {
  const {
    checklistItems,
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
  } = await import("./library-data")

  return {
    deploymentChecklist: checklistItems,
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
  }
}

export async function getChecklistItems(): Promise<ChecklistItem[]> {
  return fetchAPI<ChecklistItem[]>("/api/checklist-items")
}

export async function createChecklistItem(itemData: Omit<ChecklistItem, "id">): Promise<ChecklistItem> {
  return fetchAPI<ChecklistItem>("/api/checklist-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
}

export async function getChecklistStatus(siteId: string): Promise<Record<string, boolean>> {
  const site = await getSite(siteId)
  if (!site || !site.deploymentChecklist) {
    console.error(`Site with id ${siteId} or its checklist not found.`)
    return {}
  }
  const status: Record<string, boolean> = {}
  site.deploymentChecklist.forEach((item) => {
    status[item.id] = item.completed
  })
  return status
}

export async function updateChecklistStatus(siteId: string, newStatus: Record<string, boolean>): Promise<void> {
  return fetchAPI<void>(`/api/checklist-items`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteId, updates: newStatus }),
  })
}

export async function getDeviceTypes(): Promise<DeviceType[]> {
  return fetchAPI<DeviceType[]>("/api/device-types")
}

export async function createDeviceType(itemData: Omit<DeviceType, "id">): Promise<DeviceType> {
  return fetchAPI<DeviceType>("/api/device-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
}

export async function getVendors(): Promise<Vendor[]> {
  return fetchAPI<Vendor[]>("/api/vendors")
}

export async function createVendor(itemData: Omit<Vendor, "id">): Promise<Vendor> {
  return fetchAPI<Vendor>("/api/vendors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
}

// --- Scoping Questionnaire API ---
export async function getQuestionnaires(): Promise<ScopingQuestionnaire[]> {
  return fetchAPI<ScopingQuestionnaire[]>("/api/scoping")
}

export async function createQuestionnaire(data: Omit<ScopingQuestionnaire, "id">): Promise<ScopingQuestionnaire> {
  return fetchAPI<ScopingQuestionnaire>("/api/scoping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function updateQuestionnaire(
  id: number,
  data: Partial<ScopingQuestionnaire>,
): Promise<ScopingQuestionnaire> {
  return fetchAPI<ScopingQuestionnaire>(`/api/scoping/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function deleteQuestionnaire(id: number): Promise<void> {
  return fetchAPI<void>(`/api/scoping/${id}`, { method: "DELETE" })
}

// --- Other ---
export async function getNotifications(): Promise<Notification[]> {
  const { notifications } = await import("./library-data")
  return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getMilestones(): Promise<Milestone[]> {
  const { milestones } = await import("./library-data")
  return milestones
}

export async function getSiteStats(): Promise<SiteStats> {
  return fetchAPI<SiteStats>("/api/stats")
}

// --- Debug API ---
export async function seedDatabase(): Promise<void> {
  return fetchAPI<void>("/api/debug/seed", { method: "POST" })
}

export async function clearDatabase(): Promise<void> {
  return fetchAPI<void>("/api/debug/clear", { method: "DELETE" })
}
