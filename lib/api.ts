import type {
  Site,
  SiteStats,
  UseCase,
  User,
  Vendor,
  DeviceType,
  Milestone,
  ChecklistItem,
  ScopingQuestionnaire,
  Notification,
  FileAttachment,
  ActivityLog,
  DashboardMetrics,
  ReportData,
} from "./types"

const fetcher = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      const errorInfo = await res.json().catch(() => ({ error: "An unknown error occurred" }))
      console.error(`API Error on ${url}:`, errorInfo)
      throw new Error(errorInfo.error || `An error occurred while fetching from ${url}`)
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return {}
    }
    return res.json()
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    throw error
  }
}

// Comprehensive API object with all endpoints
export const api = {
  // Sites API
  sites: {
    getAll: (): Promise<Site[]> => fetcher("/api/sites"),
    getById: (id: string): Promise<Site> => fetcher(`/api/sites/${id}`),
    create: (data: Partial<Site>): Promise<Site> =>
      fetcher("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Site>): Promise<Site> =>
      fetcher(`/api/sites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/sites/${id}`, {
        method: "DELETE",
      }),
    getStats: (): Promise<SiteStats> => fetcher("/api/sites/stats"),
  },

  // Users API
  users: {
    getAll: (): Promise<User[]> => fetcher("/api/users"),
    getById: (id: string): Promise<User> => fetcher(`/api/users/${id}`),
    create: (data: Partial<User>): Promise<User> =>
      fetcher("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<User>): Promise<User> =>
      fetcher(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/users/${id}`, {
        method: "DELETE",
      }),
  },

  // Vendors API
  vendors: {
    getAll: (): Promise<Vendor[]> => fetcher("/api/vendors"),
    getById: (id: string): Promise<Vendor> => fetcher(`/api/vendors/${id}`),
    create: (data: Partial<Vendor>): Promise<Vendor> =>
      fetcher("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Vendor>): Promise<Vendor> =>
      fetcher(`/api/vendors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/vendors/${id}`, {
        method: "DELETE",
      }),
  },

  // Device Types API
  deviceTypes: {
    getAll: (): Promise<DeviceType[]> => fetcher("/api/device-types"),
    getById: (id: string): Promise<DeviceType> => fetcher(`/api/device-types/${id}`),
    create: (data: Partial<DeviceType>): Promise<DeviceType> =>
      fetcher("/api/device-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<DeviceType>): Promise<DeviceType> =>
      fetcher(`/api/device-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/device-types/${id}`, {
        method: "DELETE",
      }),
  },

  // Use Cases API
  useCases: {
    getAll: (): Promise<UseCase[]> => fetcher("/api/use-cases"),
    getById: (id: string): Promise<UseCase> => fetcher(`/api/use-cases/${id}`),
    create: (data: Partial<UseCase>): Promise<UseCase> =>
      fetcher("/api/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<UseCase>): Promise<UseCase> =>
      fetcher(`/api/use-cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/use-cases/${id}`, {
        method: "DELETE",
      }),
  },

  // Milestones API
  milestones: {
    getAll: (): Promise<Milestone[]> => fetcher("/api/milestones"),
    getBySite: (siteId: string): Promise<Milestone[]> => fetcher(`/api/sites/${siteId}/milestones`),
    getById: (id: string): Promise<Milestone> => fetcher(`/api/milestones/${id}`),
    create: (data: Partial<Milestone>): Promise<Milestone> =>
      fetcher("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Milestone>): Promise<Milestone> =>
      fetcher(`/api/milestones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/milestones/${id}`, {
        method: "DELETE",
      }),
  },

  // Checklist API
  checklist: {
    getAll: (): Promise<ChecklistItem[]> => fetcher("/api/checklist"),
    getBySite: (siteId: string): Promise<ChecklistItem[]> => fetcher(`/api/sites/${siteId}/checklist`),
    getByUseCase: (useCaseId: string): Promise<ChecklistItem[]> => fetcher(`/api/use-cases/${useCaseId}/checklist`),
    getById: (id: string): Promise<ChecklistItem> => fetcher(`/api/checklist/${id}`),
    create: (data: Partial<ChecklistItem>): Promise<ChecklistItem> =>
      fetcher("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ChecklistItem>): Promise<ChecklistItem> =>
      fetcher(`/api/checklist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/checklist/${id}`, {
        method: "DELETE",
      }),
  },

  // Scoping API
  scoping: {
    getAll: (): Promise<ScopingQuestionnaire[]> => fetcher("/api/scoping"),
    getBySite: (siteId: string): Promise<ScopingQuestionnaire[]> => fetcher(`/api/sites/${siteId}/scoping`),
    getById: (id: string): Promise<ScopingQuestionnaire> => fetcher(`/api/scoping/${id}`),
    create: (data: Partial<ScopingQuestionnaire>): Promise<ScopingQuestionnaire> =>
      fetcher("/api/scoping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ScopingQuestionnaire>): Promise<ScopingQuestionnaire> =>
      fetcher(`/api/scoping/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/scoping/${id}`, {
        method: "DELETE",
      }),
  },

  // Notifications API
  notifications: {
    getAll: (): Promise<Notification[]> => fetcher("/api/notifications"),
    getUnread: (): Promise<Notification[]> => fetcher("/api/notifications?unread=true"),
    markAsRead: (id: string): Promise<void> =>
      fetcher(`/api/notifications/${id}/read`, {
        method: "POST",
      }),
    markAllAsRead: (): Promise<void> =>
      fetcher("/api/notifications/read-all", {
        method: "POST",
      }),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/notifications/${id}`, {
        method: "DELETE",
      }),
  },

  // File Attachments API
  files: {
    upload: (file: File, metadata: any): Promise<FileAttachment> => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("metadata", JSON.stringify(metadata))
      return fetcher("/api/files/upload", {
        method: "POST",
        body: formData,
      })
    },
    getById: (id: string): Promise<FileAttachment> => fetcher(`/api/files/${id}`),
    getBySite: (siteId: string): Promise<FileAttachment[]> => fetcher(`/api/sites/${siteId}/files`),
    getByUseCase: (useCaseId: string): Promise<FileAttachment[]> => fetcher(`/api/use-cases/${useCaseId}/files`),
    delete: (id: string): Promise<void> =>
      fetcher(`/api/files/${id}`, {
        method: "DELETE",
      }),
  },

  // Activity Logs API
  activity: {
    getAll: (): Promise<ActivityLog[]> => fetcher("/api/activity"),
    getByEntity: (entityType: string, entityId: string): Promise<ActivityLog[]> =>
      fetcher(`/api/activity?entity_type=${entityType}&entity_id=${entityId}`),
    getByUser: (userId: string): Promise<ActivityLog[]> => fetcher(`/api/activity?user_id=${userId}`),
  },

  // Dashboard API
  dashboard: {
    getMetrics: (): Promise<DashboardMetrics> => fetcher("/api/dashboard/metrics"),
    getRecentActivity: (): Promise<ActivityLog[]> => fetcher("/api/dashboard/activity"),
    getUpcomingMilestones: (): Promise<Milestone[]> => fetcher("/api/dashboard/milestones"),
  },

  // Reports API
  reports: {
    generate: (type: string, parameters: any): Promise<ReportData> =>
      fetcher("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, parameters }),
      }),
    getAll: (): Promise<ReportData[]> => fetcher("/api/reports"),
    getById: (id: string): Promise<ReportData> => fetcher(`/api/reports/${id}`),
    download: (id: string): Promise<Blob> => fetch(`/api/reports/${id}/download`).then((res) => res.blob()),
  },

  // Analytics API
  analytics: {
    getSiteProgress: (): Promise<any> => fetcher("/api/analytics/site-progress"),
    getUseCaseMetrics: (): Promise<any> => fetcher("/api/analytics/use-case-metrics"),
    getResourceUtilization: (): Promise<any> => fetcher("/api/analytics/resource-utilization"),
    getComplianceStatus: (): Promise<any> => fetcher("/api/analytics/compliance-status"),
  },
}

// Legacy exports for backward compatibility
export const getSites = api.sites.getAll
export const fetchSites = api.sites.getAll
export const getSite = api.sites.getById
export const getSiteById = api.sites.getById
export const createSite = api.sites.create
export const updateSite = api.sites.update
export const deleteSite = api.sites.delete

export const getSiteStats = api.sites.getStats
export const fetchStats = api.sites.getStats

export const getUseCases = api.useCases.getAll
export const fetchUseCases = api.useCases.getAll
export const getUseCaseById = api.useCases.getById
export const createUseCase = api.useCases.create
export const updateUseCase = api.useCases.update
export const deleteUseCase = api.useCases.delete

export const getUsers = api.users.getAll
export const fetchUsers = api.users.getAll
export const createUser = api.users.create

export const getVendors = api.vendors.getAll
export const fetchVendors = api.vendors.getAll
export const createVendor = api.vendors.create

export const getDeviceTypes = api.deviceTypes.getAll
export const fetchDeviceTypes = api.deviceTypes.getAll
export const createDeviceType = api.deviceTypes.create

export const getChecklistItems = api.checklist.getAll
export const createChecklistItem = api.checklist.create

export const getScopingQuestionnaires = api.scoping.getAll
export const createScopingQuestionnaire = api.scoping.create
