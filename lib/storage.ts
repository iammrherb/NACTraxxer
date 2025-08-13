// Simple storage utility for managing application data
export interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent: number
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: string
  plannedStart: string
  plannedEnd: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "meeting" | "milestone" | "deployment" | "review" | "training"
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  assignee: string
  siteId?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  department?: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  customerLogo?: string
  defaultView: string
  notifications: {
    email: boolean
    browser: boolean
    timeline: boolean
  }
}

class StorageManager {
  private isClient = typeof window !== "undefined"

  // Sites management
  async getSites(): Promise<Site[]> {
    if (!this.isClient) return []

    try {
      const stored = localStorage.getItem("portnox-sites")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading sites:", error)
      return []
    }
  }

  async saveSites(sites: Site[]): Promise<void> {
    if (!this.isClient) return

    try {
      localStorage.setItem("portnox-sites", JSON.stringify(sites))
    } catch (error) {
      console.error("Error saving sites:", error)
      throw new Error("Failed to save sites")
    }
  }

  async createSite(siteData: Omit<Site, "id" | "createdAt" | "updatedAt">): Promise<Site> {
    const sites = await this.getSites()
    const newSite: Site = {
      ...siteData,
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    sites.push(newSite)
    await this.saveSites(sites)
    return newSite
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
    const sites = await this.getSites()
    const index = sites.findIndex((site) => site.id === id)

    if (index === -1) return null

    sites[index] = {
      ...sites[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await this.saveSites(sites)
    return sites[index]
  }

  async deleteSite(id: string): Promise<boolean> {
    const sites = await this.getSites()
    const filteredSites = sites.filter((site) => site.id !== id)

    if (filteredSites.length === sites.length) return false

    await this.saveSites(filteredSites)
    return true
  }

  // Events management
  async getEvents(): Promise<Event[]> {
    if (!this.isClient) return []

    try {
      const stored = localStorage.getItem("portnox-events")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading events:", error)
      return []
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    if (!this.isClient) return

    try {
      localStorage.setItem("portnox-events", JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events:", error)
      throw new Error("Failed to save events")
    }
  }

  async createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const events = await this.getEvents()
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    events.push(newEvent)
    await this.saveEvents(events)
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const events = await this.getEvents()
    const index = events.findIndex((event) => event.id === id)

    if (index === -1) return null

    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await this.saveEvents(events)
    return events[index]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const events = await this.getEvents()
    const filteredEvents = events.filter((event) => event.id !== id)

    if (filteredEvents.length === events.length) return false

    await this.saveEvents(filteredEvents)
    return true
  }

  // Users management
  async getUsers(): Promise<User[]> {
    if (!this.isClient) return []

    try {
      const stored = localStorage.getItem("portnox-users")
      if (stored) {
        return JSON.parse(stored)
      } else {
        // Initialize with default users
        const defaultUsers: User[] = [
          {
            id: "user-1",
            name: "Admin User",
            email: "admin@portnox.com",
            role: "admin",
            department: "IT",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "user-2",
            name: "Project Manager",
            email: "pm@portnox.com",
            role: "manager",
            department: "Operations",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "user-3",
            name: "Regular User",
            email: "user@portnox.com",
            role: "user",
            department: "Engineering",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        await this.saveUsers(defaultUsers)
        return defaultUsers
      }
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  }

  async saveUsers(users: User[]): Promise<void> {
    if (!this.isClient) return

    try {
      localStorage.setItem("portnox-users", JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
      throw new Error("Failed to save users")
    }
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    await this.saveUsers(users)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) return null

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await this.saveUsers(users)
    return users[index]
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) return false

    await this.saveUsers(filteredUsers)
    return true
  }

  // User preferences management
  async getUserPreferences(): Promise<UserPreferences> {
    if (!this.isClient) {
      return {
        theme: "system",
        defaultView: "architecture",
        notifications: {
          email: true,
          browser: true,
          timeline: true,
        },
      }
    }

    try {
      const stored = localStorage.getItem("portnox-preferences")
      if (stored) {
        return JSON.parse(stored)
      } else {
        const defaultPreferences: UserPreferences = {
          theme: "system",
          defaultView: "architecture",
          notifications: {
            email: true,
            browser: true,
            timeline: true,
          },
        }
        await this.saveUserPreferences(defaultPreferences)
        return defaultPreferences
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
      return {
        theme: "system",
        defaultView: "architecture",
        notifications: {
          email: true,
          browser: true,
          timeline: true,
        },
      }
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    if (!this.isClient) return

    try {
      localStorage.setItem("portnox-preferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Error saving preferences:", error)
      throw new Error("Failed to save preferences")
    }
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getUserPreferences()
    const updated = { ...current, ...updates }
    await this.saveUserPreferences(updated)
    return updated
  }

  // Data export/import
  async exportAllData(): Promise<string> {
    const [sites, events, users, preferences] = await Promise.all([
      this.getSites(),
      this.getEvents(),
      this.getUsers(),
      this.getUserPreferences(),
    ])

    const exportData = {
      sites,
      events,
      users,
      preferences,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    return JSON.stringify(exportData, null, 2)
  }

  async importAllData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)

      if (data.sites) await this.saveSites(data.sites)
      if (data.events) await this.saveEvents(data.events)
      if (data.users) await this.saveUsers(data.users)
      if (data.preferences) await this.saveUserPreferences(data.preferences)
    } catch (error) {
      console.error("Error importing data:", error)
      throw new Error("Failed to import data. Please check the file format.")
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.isClient) return

    localStorage.removeItem("portnox-sites")
    localStorage.removeItem("portnox-events")
    localStorage.removeItem("portnox-users")
    localStorage.removeItem("portnox-preferences")
  }
}

export const storage = new StorageManager()
