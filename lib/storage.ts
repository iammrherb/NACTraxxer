"use client"

// Types
export interface User {
  id: string
  name: string
  email: string
  role:
    | "admin"
    | "project-manager"
    | "technical-owner"
    | "site-owner"
    | "systems-engineer"
    | "account-executive"
    | "technical-account-manager"
    | "technician"
    | "security-specialist"
  department?: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Site {
  id: string
  name: string
  location: string
  region: string
  country: string
  state?: string
  city?: string
  siteType: "headquarters" | "branch" | "campus" | "department" | "floor" | "building" | "datacenter" | "remote"
  status: "planning" | "design" | "implementation" | "testing" | "completed" | "on-hold" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  phase: string
  users: number
  devices: number
  deviceBreakdown: {
    windows: number
    mac: number
    linux: number
    ios: number
    android: number
    iot: number
    medical: number
    printers: number
    cameras: number
    voip: number
    kiosks: number
    tablets: number
    chromeos: number
    other: number
  }
  assignedUsers: {
    projectManagers: string[]
    technicalOwners: string[]
    siteOwners: string[]
    systemsEngineers: string[]
    accountExecutives: string[]
    technicalAccountManagers: string[]
    technicians: string[]
    securitySpecialists: string[]
  }
  startDate: string
  targetDate: string
  progress: number
  wiredInfrastructure: {
    vendor: string
    switchModels: string[]
    switchCount: number
    portCount: number
    stackingSupport: boolean
    poeSupport: boolean
    mgmtVlan: number
    firmware: string
  }
  wirelessInfrastructure: {
    vendor: string
    controllerModel: string
    apModels: string[]
    apCount: number
    wifiStandards: string[]
    bandSupport: string[]
    meshSupport: boolean
    firmware: string
  }
  connectivity: {
    type: string
    bandwidth: string
    provider: string
    redundancy: boolean
  }
  identityProvider: {
    type: string
    domain: string
    syncEnabled: boolean
    mfaEnabled: boolean
    conditionalAccess: boolean
  }
  mdmProvider: {
    type: string
    enrollmentType: string
    complianceEnabled: boolean
    appManagement: boolean
  }
  firewallInfrastructure: {
    vendor: string
    models: string[]
    haConfiguration: boolean
    userIdIntegration: boolean
    syslogEnabled: boolean
    firmware: string
  }
  radiusConfiguration: {
    type: string
    clustering: boolean
    loadBalancing: boolean
    certificates: boolean
    vendor?: string
  }
  deviceAdministration: {
    type: string
    privilegeLevels: number[]
    commandAuthorization: boolean
    vendor?: string
  }
  vlans: number
  subnets: string[]
  dhcpScopes: number
  dnsServers: string[]
  globalPolicies: string[]
  sitePolicies: string[]
  policyEnforcement: {
    dynamic_vlan: boolean
    bandwidth_control: boolean
    time_based_access: boolean
    device_compliance: boolean
    location_based: boolean
  }
  complianceRequirements: string[]
  securityStandards: string[]
  dataClassification: "public" | "internal" | "confidential" | "restricted"
  notes: string
  deploymentChecklist: string[]
  riskAssessment: string[]
  milestones: string[]
  createdAt: string
  updatedAt: string
}

export interface GlobalPolicy {
  id: string
  name: string
  description: string
  category: "authentication" | "authorization" | "accounting" | "security" | "compliance" | "qos" | "guest_access"
  type: "access" | "vlan" | "qos" | "security" | "compliance" | "bandwidth" | "time" | "location"
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  enabled: boolean
  applicableSites: string[]
  tags: string[]
  version: string
  approvedBy: string
  createdAt: string
  updatedAt: string
}

export interface PolicyCondition {
  type:
    | "user_group"
    | "device_type"
    | "location"
    | "time"
    | "compliance"
    | "certificate"
    | "os_type"
    | "device_health"
    | "ip_range"
    | "mac_address"
    | "ssid"
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "in"
    | "not_in"
    | "greater_than"
    | "less_than"
    | "matches_regex"
  value: string | string[]
  description: string
}

export interface PolicyAction {
  type:
    | "allow"
    | "deny"
    | "quarantine"
    | "redirect"
    | "notify"
    | "vlan_assign"
    | "qos_apply"
    | "bandwidth_limit"
    | "time_restrict"
    | "log_only"
  parameters: Record<string, any>
  description: string
  priority: number
}

export interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  type: "milestone" | "task" | "meeting" | "deadline" | "deployment"
  status: "planned" | "in-progress" | "completed" | "cancelled"
  siteId?: string
  assignedTo?: string[]
  priority: "low" | "medium" | "high" | "critical"
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  customerLogo?: string
  companyName?: string
  defaultView?: string
  theme?: "light" | "dark" | "system"
  notifications?: boolean
  autoSave?: boolean
}

// Extended vendor and configuration data
export const REGIONS = ["North America", "South America", "EMEA", "APAC", "Europe", "Asia", "Africa", "Oceania"]

export const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "China",
  "Japan",
  "South Korea",
  "India",
  "Singapore",
  "Australia",
  "New Zealand",
  "Thailand",
  "Malaysia",
  "Philippines",
  "Indonesia",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Kenya",
  "Morocco",
  "Ghana",
  "UAE",
  "Saudi Arabia",
  "Israel",
  "Turkey",
  "Russia",
]

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export const PHASES = [
  "Phase 1 - Planning",
  "Phase 2 - Design",
  "Phase 3 - Implementation",
  "Phase 4 - Testing",
  "Phase 5 - Deployment",
  "Phase 6 - Go-Live",
]

export const WIRED_VENDORS = [
  { id: "cisco", name: "Cisco Systems" },
  { id: "aruba", name: "Aruba (HPE)" },
  { id: "juniper", name: "Juniper Networks" },
  { id: "extreme", name: "Extreme Networks" },
  { id: "dell", name: "Dell Technologies" },
  { id: "hp", name: "HP Enterprise" },
]

export const WIRELESS_VENDORS = [
  { id: "cisco", name: "Cisco Systems" },
  { id: "aruba", name: "Aruba (HPE)" },
  { id: "juniper", name: "Juniper Mist" },
  { id: "ruckus", name: "Ruckus (CommScope)" },
  { id: "meraki", name: "Cisco Meraki" },
  { id: "ubiquiti", name: "Ubiquiti Networks" },
]

export const FIREWALL_VENDORS = [
  { id: "palo-alto", name: "Palo Alto Networks" },
  { id: "fortinet", name: "Fortinet" },
  { id: "cisco", name: "Cisco ASA/FTD" },
  { id: "juniper", name: "Juniper SRX" },
  { id: "checkpoint", name: "Check Point" },
  { id: "sonicwall", name: "SonicWall" },
]

export const MDM_PROVIDERS = [
  { id: "intune", name: "Microsoft Intune", description: "Cloud-based MDM and MAM" },
  { id: "jamf", name: "Jamf Pro", description: "Apple device management" },
  { id: "workspace-one", name: "VMware Workspace ONE", description: "Unified endpoint management" },
  { id: "mobileiron", name: "Ivanti MobileIron", description: "Enterprise mobility management" },
]

// Utility function to check if we're on the client side
const isClient = () => typeof window !== "undefined"

// Storage utility class
class StorageManager {
  private getItem(key: string): string | null {
    if (!isClient()) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return null
    }
  }

  private setItem(key: string, value: string): void {
    if (!isClient()) return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }

  private removeItem(key: string): void {
    if (!isClient()) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    const data = this.getItem("portnox-users")
    return data ? JSON.parse(data) : []
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
    this.setItem("portnox-users", JSON.stringify(users))
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null

    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
    this.setItem("portnox-users", JSON.stringify(users))
    return users[index]
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const filteredUsers = users.filter((u) => u.id !== id)
    if (filteredUsers.length === users.length) return false

    this.setItem("portnox-users", JSON.stringify(filteredUsers))
    return true
  }

  // Sites
  async getSites(): Promise<Site[]> {
    const data = this.getItem("portnox-sites")
    return data ? JSON.parse(data) : []
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
    this.setItem("portnox-sites", JSON.stringify(sites))
    return newSite
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
    const sites = await this.getSites()
    const index = sites.findIndex((s) => s.id === id)
    if (index === -1) return null

    sites[index] = { ...sites[index], ...updates, updatedAt: new Date().toISOString() }
    this.setItem("portnox-sites", JSON.stringify(sites))
    return sites[index]
  }

  async deleteSite(id: string): Promise<boolean> {
    const sites = await this.getSites()
    const filteredSites = sites.filter((s) => s.id !== id)
    if (filteredSites.length === sites.length) return false

    this.setItem("portnox-sites", JSON.stringify(filteredSites))
    return true
  }

  // Global Policies
  async getGlobalPolicies(): Promise<GlobalPolicy[]> {
    const data = this.getItem("portnox-global-policies")
    return data ? JSON.parse(data) : []
  }

  async createGlobalPolicy(policyData: Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">): Promise<GlobalPolicy> {
    const policies = await this.getGlobalPolicies()
    const newPolicy: GlobalPolicy = {
      ...policyData,
      id: `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    policies.push(newPolicy)
    this.setItem("portnox-global-policies", JSON.stringify(policies))
    return newPolicy
  }

  async updateGlobalPolicy(id: string, updates: Partial<GlobalPolicy>): Promise<GlobalPolicy | null> {
    const policies = await this.getGlobalPolicies()
    const index = policies.findIndex((p) => p.id === id)
    if (index === -1) return null

    policies[index] = { ...policies[index], ...updates, updatedAt: new Date().toISOString() }
    this.setItem("portnox-global-policies", JSON.stringify(policies))
    return policies[index]
  }

  async deleteGlobalPolicy(id: string): Promise<boolean> {
    const policies = await this.getGlobalPolicies()
    const filteredPolicies = policies.filter((p) => p.id !== id)
    if (filteredPolicies.length === policies.length) return false

    this.setItem("portnox-global-policies", JSON.stringify(filteredPolicies))
    return true
  }

  // Events
  async getEvents(): Promise<Event[]> {
    const data = this.getItem("portnox-events")
    return data ? JSON.parse(data) : []
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
    this.setItem("portnox-events", JSON.stringify(events))
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const events = await this.getEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) return null

    events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() }
    this.setItem("portnox-events", JSON.stringify(events))
    return events[index]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const events = await this.getEvents()
    const filteredEvents = events.filter((e) => e.id !== id)
    if (filteredEvents.length === events.length) return false

    this.setItem("portnox-events", JSON.stringify(filteredEvents))
    return true
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    const data = this.getItem("portnox-user-preferences")
    return data
      ? JSON.parse(data)
      : {
          companyName: "TechCorp Global",
          theme: "light",
          notifications: true,
          autoSave: true,
        }
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getUserPreferences()
    const updated = { ...current, ...updates }
    this.setItem("portnox-user-preferences", JSON.stringify(updated))
    return updated
  }

  // Export/Import
  async exportData(): Promise<string> {
    const [users, sites, policies, events, preferences] = await Promise.all([
      this.getUsers(),
      this.getSites(),
      this.getGlobalPolicies(),
      this.getEvents(),
      this.getUserPreferences(),
    ])

    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        users,
        sites,
        globalPolicies: policies,
        events,
        preferences,
      },
    }

    return JSON.stringify(exportData, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData)

      if (importData.data) {
        if (importData.data.users) {
          this.setItem("portnox-users", JSON.stringify(importData.data.users))
        }
        if (importData.data.sites) {
          this.setItem("portnox-sites", JSON.stringify(importData.data.sites))
        }
        if (importData.data.globalPolicies) {
          this.setItem("portnox-global-policies", JSON.stringify(importData.data.globalPolicies))
        }
        if (importData.data.events) {
          this.setItem("portnox-events", JSON.stringify(importData.data.events))
        }
        if (importData.data.preferences) {
          this.setItem("portnox-user-preferences", JSON.stringify(importData.data.preferences))
        }
      }
    } catch (error) {
      throw new Error("Invalid import data format")
    }
  }

  // Demo Data Generation
  async generateDemoData(
    scenario: "corporate" | "education" | "healthcare" | "government" | "manufacturing" | "retail",
  ): Promise<void> {
    const demoData = this.getDemoDataForScenario(scenario)

    // Clear existing data
    this.removeItem("portnox-users")
    this.removeItem("portnox-sites")
    this.removeItem("portnox-global-policies")
    this.removeItem("portnox-events")

    // Set demo data
    this.setItem("portnox-users", JSON.stringify(demoData.users))
    this.setItem("portnox-sites", JSON.stringify(demoData.sites))
    this.setItem("portnox-global-policies", JSON.stringify(demoData.policies))
    this.setItem("portnox-events", JSON.stringify(demoData.events))

    // Update company name based on scenario
    const preferences = await this.getUserPreferences()
    await this.updateUserPreferences({
      ...preferences,
      companyName: demoData.companyName,
    })
  }

  private getDemoDataForScenario(scenario: string) {
    const baseTimestamp = new Date().toISOString()

    const scenarioConfig = {
      corporate: {
        companyName: "TechCorp Global",
        userCount: 25,
        siteCount: 12,
        policyCount: 15,
      },
      education: {
        companyName: "State University System",
        userCount: 30,
        siteCount: 8,
        policyCount: 20,
      },
      healthcare: {
        companyName: "Regional Medical Center",
        userCount: 20,
        siteCount: 6,
        policyCount: 25,
      },
      government: {
        companyName: "City Government",
        userCount: 15,
        siteCount: 10,
        policyCount: 30,
      },
      manufacturing: {
        companyName: "Industrial Manufacturing Corp",
        userCount: 18,
        siteCount: 15,
        policyCount: 18,
      },
      retail: {
        companyName: "Retail Chain Inc",
        userCount: 22,
        siteCount: 25,
        policyCount: 12,
      },
    }

    const config = scenarioConfig[scenario as keyof typeof scenarioConfig] || scenarioConfig.corporate

    // Generate demo users
    const users: User[] = []
    const roles: User["role"][] = ["admin", "project-manager", "technical-owner", "site-owner", "systems-engineer"]

    for (let i = 0; i < config.userCount; i++) {
      users.push({
        id: `user-demo-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@${scenario}.com`,
        role: roles[i % roles.length],
        department: ["IT", "Engineering", "Operations", "Security"][i % 4],
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      })
    }

    // Generate demo sites
    const sites: Site[] = []
    const regions = ["North America", "Europe", "APAC"]
    const countries = ["United States", "United Kingdom", "Germany", "Japan", "Australia"]

    for (let i = 0; i < config.siteCount; i++) {
      sites.push({
        id: `site-demo-${i + 1}`,
        name: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Site ${i + 1}`,
        location: `Location ${i + 1}`,
        region: regions[i % regions.length],
        country: countries[i % countries.length],
        siteType: ["headquarters", "branch", "campus"][i % 3] as Site["siteType"],
        status: ["planning", "implementation", "completed"][i % 3] as Site["status"],
        priority: ["low", "medium", "high"][i % 3] as Site["priority"],
        phase: PHASES[i % PHASES.length],
        users: Math.floor(Math.random() * 500) + 100,
        devices: Math.floor(Math.random() * 1000) + 200,
        deviceBreakdown: {
          windows: Math.floor(Math.random() * 300) + 50,
          mac: Math.floor(Math.random() * 100) + 20,
          linux: Math.floor(Math.random() * 50) + 10,
          ios: Math.floor(Math.random() * 200) + 30,
          android: Math.floor(Math.random() * 150) + 25,
          iot: Math.floor(Math.random() * 100) + 15,
          medical: Math.floor(Math.random() * 50) + 5,
          printers: Math.floor(Math.random() * 30) + 5,
          cameras: Math.floor(Math.random() * 40) + 8,
          voip: Math.floor(Math.random() * 60) + 10,
          kiosks: Math.floor(Math.random() * 20) + 2,
          tablets: Math.floor(Math.random() * 80) + 15,
          chromeos: Math.floor(Math.random() * 40) + 5,
          other: Math.floor(Math.random() * 30) + 5,
        },
        assignedUsers: {
          projectManagers: [users[0]?.id || ""],
          technicalOwners: [users[1]?.id || ""],
          siteOwners: [users[2]?.id || ""],
          systemsEngineers: [users[3]?.id || ""],
          accountExecutives: [],
          technicalAccountManagers: [],
          technicians: [],
          securitySpecialists: [],
        },
        startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        targetDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        progress: Math.floor(Math.random() * 100),
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["Catalyst 9300"],
          switchCount: Math.floor(Math.random() * 20) + 5,
          portCount: Math.floor(Math.random() * 500) + 100,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 100,
          firmware: "17.09.04",
        },
        wirelessInfrastructure: {
          vendor: "cisco",
          controllerModel: "9800-CL",
          apModels: ["9130AXI"],
          apCount: Math.floor(Math.random() * 50) + 10,
          wifiStandards: ["802.11ax"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: false,
          firmware: "17.09.04",
        },
        connectivity: {
          type: "internet",
          bandwidth: "1 Gbps",
          provider: "ISP Provider",
          redundancy: true,
        },
        identityProvider: {
          type: "azure-ad",
          domain: `${scenario}.com`,
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: true,
        },
        mdmProvider: {
          type: "intune",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "palo-alto",
          models: ["PA-220"],
          haConfiguration: false,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "11.0.2",
        },
        radiusConfiguration: {
          type: "cloud-radius",
          clustering: true,
          loadBalancing: true,
          certificates: true,
        },
        deviceAdministration: {
          type: "radius",
          privilegeLevels: [1, 15],
          commandAuthorization: true,
        },
        vlans: 5,
        subnets: ["10.1.0.0/24", "10.2.0.0/24"],
        dhcpScopes: 3,
        dnsServers: ["8.8.8.8", "8.8.4.4"],
        globalPolicies: [],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: false,
          time_based_access: true,
          device_compliance: true,
          location_based: false,
        },
        complianceRequirements: scenario === "healthcare" ? ["HIPAA"] : scenario === "government" ? ["FISMA"] : [],
        securityStandards: ["NIST"],
        dataClassification: "internal",
        notes: `Demo site for ${scenario} scenario`,
        deploymentChecklist: [],
        riskAssessment: [],
        milestones: [],
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      })
    }

    // Generate demo policies
    const policies: GlobalPolicy[] = []
    for (let i = 0; i < config.policyCount; i++) {
      policies.push({
        id: `policy-demo-${i + 1}`,
        name: `Demo Policy ${i + 1}`,
        description: `Sample policy for ${scenario} scenario`,
        category: ["authentication", "authorization", "security"][i % 3] as GlobalPolicy["category"],
        type: ["access", "vlan", "security"][i % 3] as GlobalPolicy["type"],
        priority: (i % 5) + 1,
        conditions: [],
        actions: [],
        enabled: true,
        applicableSites: [],
        tags: [scenario],
        version: "1.0",
        approvedBy: "System Admin",
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      })
    }

    // Generate demo events
    const events: Event[] = []
    for (let i = 0; i < 10; i++) {
      const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      const endDate = new Date(startDate.getTime() + Math.random() * 4 * 60 * 60 * 1000)

      events.push({
        id: `event-demo-${i + 1}`,
        title: `Demo Event ${i + 1}`,
        description: `Sample event for ${scenario} scenario`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type: ["milestone", "task", "meeting"][i % 3] as Event["type"],
        status: ["planned", "in-progress", "completed"][i % 3] as Event["status"],
        siteId: sites[i % sites.length]?.id,
        priority: ["low", "medium", "high"][i % 3] as Event["priority"],
        tags: [scenario],
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      })
    }

    return {
      companyName: config.companyName,
      users,
      sites,
      policies,
      events,
    }
  }
}

// Export singleton instance
export const storage = new StorageManager()
