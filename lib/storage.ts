// Enhanced storage utility for NAC deployment management

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Singapore",
  "Netherlands",
  "Sweden",
  "Switzerland",
  "Brazil",
  "Mexico",
  "India",
  "South Korea",
]

export const PHASES = ["Planning", "Design", "Implementation", "Testing", "Deployment", "Monitoring"]

export const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]

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

export const FIREWALL_VENDORS = [
  "Palo Alto Networks",
  "Fortinet",
  "Cisco",
  "Check Point",
  "SonicWall",
  "Juniper Networks",
  "pfSense",
  "WatchGuard",
  "Barracuda",
  "Sophos",
]

export const WIRED_VENDORS = [
  "Cisco",
  "Aruba",
  "Juniper Networks",
  "Extreme Networks",
  "Dell Technologies",
  "HPE",
  "Ubiquiti",
  "Netgear",
  "D-Link",
  "TP-Link",
]

export const WIRELESS_VENDORS = [
  "Cisco",
  "Aruba",
  "Ruckus",
  "Ubiquiti",
  "Meraki",
  "Extreme Networks",
  "Mist",
  "Cambium Networks",
  "Fortinet",
  "SonicWall",
]

export const MDM_PROVIDERS = [
  "Microsoft Intune",
  "JAMF",
  "VMware Workspace ONE",
  "IBM MaaS360",
  "Citrix Endpoint Management",
  "BlackBerry UEM",
  "SOTI MobiControl",
  "ManageEngine Mobile Device Manager Plus",
  "Hexnode",
  "Miradore",
]

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
  completionDate?: string
  progress: number
  milestones: Milestone[]
  wiredInfrastructure: {
    vendor: string
    switchModels: string[]
    switchCount: number
    portCount: number
    stackingSupport: boolean
    poeSupport: boolean
    mgmtVlan: number
    firmware?: string
  }
  wirelessInfrastructure: {
    vendor: string
    controllerModel: string
    apModels: string[]
    apCount: number
    wifiStandards: string[]
    bandSupport: string[]
    meshSupport: boolean
    firmware?: string
  }
  connectivity: {
    type: string
    bandwidth: string
    provider: string
    redundancy: boolean
    backupType?: string
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
    firmware?: string
  }
  radiusConfiguration: {
    type: string
    vendor?: string
    clustering: boolean
    loadBalancing: boolean
    certificates: boolean
  }
  deviceAdministration: {
    type: string
    vendor?: string
    privilegeLevels: number[]
    commandAuthorization: boolean
  }
  vlans: number
  subnets: string[]
  dhcpScopes: number
  dnsServers: string[]
  globalPolicies: string[]
  sitePolicies: SitePolicy[]
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
  deploymentChecklist: ChecklistItem[]
  riskAssessment: RiskItem[]
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  name: string
  description: string
  targetDate: string
  completionDate?: string
  status: "pending" | "in-progress" | "completed" | "delayed"
  dependencies: string[]
  assignedTo: string
}

export interface RiskItem {
  id: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  probability: "low" | "medium" | "high"
  mitigation: string
  owner: string
  status: "open" | "mitigated" | "closed"
}

export interface SitePolicy {
  id: string
  name: string
  description: string
  type: "access" | "vlan" | "qos" | "security" | "compliance" | "bandwidth" | "time" | "location"
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  enabled: boolean
  schedule?: PolicySchedule
  exceptions: string[]
  createdAt: string
  lastModified: string
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
  value: string | string[] | number
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
  parameters: { [key: string]: any }
  description: string
  priority: number
}

export interface PolicySchedule {
  type: "always" | "business_hours" | "custom" | "recurring"
  timeZone: string
  businessHours?: {
    start: string
    end: string
    days: string[]
  }
  customSchedule?: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    days: string[]
  }
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
  schedule?: PolicySchedule
  tags: string[]
  version: string
  approvedBy: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  category:
    | "planning"
    | "design"
    | "procurement"
    | "installation"
    | "configuration"
    | "testing"
    | "training"
    | "documentation"
  task: string
  description: string
  completed: boolean
  assignedTo: string
  dueDate: string
  completionDate?: string
  dependencies: string[]
  estimatedHours: number
  actualHours?: number
  notes?: string
  attachments: string[]
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type:
    | "kickoff"
    | "design"
    | "deployment"
    | "testing"
    | "training"
    | "go-live"
    | "review"
    | "maintenance"
    | "meeting"
    | "milestone"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  siteId?: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "postponed"
  attendees: string[]
  location: string
  meetingType: "in-person" | "virtual" | "hybrid"
  meetingUrl?: string
  prerequisites: string[]
  deliverables: string[]
  createdAt: string
  updatedAt: string
}

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
    | "viewer"
  department: string
  title: string
  phone?: string
  avatar?: string
  isActive: boolean
  specialties: string[]
  certifications: string[]
  skills: string[]
  languages: string[]
  timeZone: string
  availability: {
    hoursPerWeek: number
    preferredSchedule: "business-hours" | "flexible" | "24x7"
    vacationDays: string[]
  }
  vendorRelationships: string[]
  projectHistory: string[]
  performanceRating: number
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  customerLogo?: string
  companyName: string
  defaultView: string
  notifications: boolean
  autoSave: boolean
  demoScenario:
    | "corporate"
    | "education"
    | "healthcare"
    | "government"
    | "manufacturing"
    | "retail"
    | "technology"
    | "financial"
  language: string
  dateFormat: string
  timeFormat: "12h" | "24h"
  currency: string
  dashboardLayout: string[]
}

// Storage class implementation
class Storage {
  private getStorageKey(key: string): string {
    return `portnox-nac-${key}`
  }

  private getData<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue

    try {
      const stored = localStorage.getItem(this.getStorageKey(key))
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return defaultValue
    }
  }

  private setData<T>(key: string, data: T): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
    }
  }

  // Sites
  async getSites(): Promise<Site[]> {
    return this.getData("sites", [])
  }

  async createSite(site: Omit<Site, "id" | "createdAt" | "updatedAt">): Promise<Site> {
    const sites = await this.getSites()
    const newSite: Site = {
      ...site,
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    sites.push(newSite)
    this.setData("sites", sites)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("siteCreated", { detail: newSite }))
    }

    return newSite
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
    const sites = await this.getSites()
    const siteIndex = sites.findIndex((site) => site.id === id)

    if (siteIndex === -1) return null

    sites[siteIndex] = {
      ...sites[siteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.setData("sites", sites)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("siteUpdated", { detail: sites[siteIndex] }))
    }

    return sites[siteIndex]
  }

  async deleteSite(id: string): Promise<boolean> {
    const sites = await this.getSites()
    const filteredSites = sites.filter((site) => site.id !== id)

    if (filteredSites.length === sites.length) return false

    this.setData("sites", filteredSites)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("siteDeleted", { detail: { id } }))
    }

    return true
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return this.getData("events", [])
  }

  async createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const events = await this.getEvents()
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attendees: event.attendees || [],
      prerequisites: event.prerequisites || [],
      deliverables: event.deliverables || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    events.push(newEvent)
    this.setData("events", events)
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const events = await this.getEvents()
    const eventIndex = events.findIndex((event) => event.id === id)

    if (eventIndex === -1) return null

    events[eventIndex] = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.setData("events", events)
    return events[eventIndex]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const events = await this.getEvents()
    const filteredEvents = events.filter((event) => event.id !== id)

    if (filteredEvents.length === events.length) return false

    this.setData("events", filteredEvents)
    return true
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.getData("users", [])
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: user.title || "",
      specialties: user.specialties || [],
      certifications: user.certifications || [],
      skills: user.skills || [],
      languages: user.languages || ["English"],
      timeZone: user.timeZone || "UTC",
      availability: user.availability || {
        hoursPerWeek: 40,
        preferredSchedule: "business-hours",
        vacationDays: [],
      },
      vendorRelationships: user.vendorRelationships || [],
      projectHistory: user.projectHistory || [],
      performanceRating: user.performanceRating || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    this.setData("users", users)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.setData("users", users)
    return users[userIndex]
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) return false

    this.setData("users", filteredUsers)
    return true
  }

  // Global Policies
  async getGlobalPolicies(): Promise<GlobalPolicy[]> {
    return this.getData("globalPolicies", [])
  }

  async createGlobalPolicy(policy: Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">): Promise<GlobalPolicy> {
    const policies = await this.getGlobalPolicies()
    const newPolicy: GlobalPolicy = {
      ...policy,
      id: `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    policies.push(newPolicy)
    this.setData("globalPolicies", policies)
    return newPolicy
  }

  async updateGlobalPolicy(id: string, updates: Partial<GlobalPolicy>): Promise<GlobalPolicy | null> {
    const policies = await this.getGlobalPolicies()
    const policyIndex = policies.findIndex((policy) => policy.id === id)

    if (policyIndex === -1) return null

    policies[policyIndex] = {
      ...policies[policyIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.setData("globalPolicies", policies)
    return policies[policyIndex]
  }

  async deleteGlobalPolicy(id: string): Promise<boolean> {
    const policies = await this.getGlobalPolicies()
    const filteredPolicies = policies.filter((policy) => policy.id !== id)

    if (filteredPolicies.length === policies.length) return false

    this.setData("globalPolicies", filteredPolicies)
    return true
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    return this.getData("preferences", {
      theme: "light",
      companyName: "TechCorp Global",
      defaultView: "architecture",
      notifications: true,
      autoSave: true,
      demoScenario: "corporate",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      currency: "USD",
      dashboardLayout: [],
    })
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const preferences = await this.getUserPreferences()
    const updatedPreferences = { ...preferences, ...updates }
    this.setData("preferences", updatedPreferences)
    return updatedPreferences
  }

  // Demo data generation
  async generateDemoData(
    scenario: "corporate" | "education" | "healthcare" | "financial" | "manufacturing" | "retail" | "technology",
  ): Promise<void> {
    console.log(`[v0] Starting demo data generation for scenario: ${scenario}`)

    try {
      // Clear existing data
      console.log(`[v0] Clearing existing data...`)
      await this.clearAllData()

      // Update preferences with scenario
      console.log(`[v0] Updating preferences...`)
      await this.updateUserPreferences({
        demoScenario: scenario,
        companyName: this.getCompanyNameForScenario(scenario),
      })

      // Generate demo users first (needed for site assignments)
      console.log(`[v0] Generating demo users...`)
      const users = await this.generateDemoUsers(scenario)
      console.log(`[v0] Generated ${users.length} users`)

      // Generate demo sites with full data
      console.log(`[v0] Generating demo sites...`)
      const sites = await this.generateDemoSites(scenario, users)
      console.log(`[v0] Generated ${sites.length} sites`)

      // Generate demo events based on sites - FIXED parameter order
      console.log(`[v0] Generating demo events...`)
      const events = await this.generateDemoEvents(scenario, sites, users)
      console.log(`[v0] Generated ${events.length} events`)

      // Generate demo policies
      console.log(`[v0] Generating demo policies...`)
      const policies = await this.generateDemoPolicies(scenario)
      console.log(`[v0] Generated ${policies.length} policies`)

      // Verify data was stored
      const storedSites = await this.getSites()
      const storedUsers = await this.getUsers()
      const storedEvents = await this.getEvents()
      const storedPolicies = await this.getGlobalPolicies()

      console.log(
        `[v0] Verification - Stored sites: ${storedSites.length}, users: ${storedUsers.length}, events: ${storedEvents.length}, policies: ${storedPolicies.length}`,
      )

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("demoDataGenerated", {
            detail: { scenario, sites, users, events, policies },
          }),
        )
        window.dispatchEvent(new CustomEvent("sitesUpdated"))
        window.dispatchEvent(new CustomEvent("usersUpdated"))
        window.dispatchEvent(new CustomEvent("timelineUpdated"))
      }

      console.log(`[v0] Demo data generation completed successfully!`)
    } catch (error) {
      console.error(`[v0] Error generating demo data:`, error)
      throw new Error(`Failed to generate demo data for ${scenario} scenario: ${error}`)
    }
  }

  async generateDemoUsers(scenario: string): Promise<User[]> {
    console.log(`[v0] Generating demo users for scenario: ${scenario}`)
    const userTemplates = this.getUserTemplatesForScenario(scenario)
    const users: User[] = []

    for (const template of userTemplates) {
      try {
        const user = await this.createUser(template as Omit<User, "id" | "createdAt" | "updatedAt">)
        users.push(user)
        console.log(`[v0] Created user: ${user.name} (${user.role})`)
      } catch (error) {
        console.error(`[v0] Error creating user:`, error)
      }
    }

    console.log(`[v0] Generated ${users.length} demo users`)
    return users
  }

  async generateDemoSites(scenario: string, users: User[]): Promise<Site[]> {
    console.log(`[v0] Generating demo sites for scenario: ${scenario}`)
    const siteTemplates = this.getSiteTemplatesForScenario(scenario, users)
    const sites: Site[] = []

    for (const template of siteTemplates) {
      try {
        const site = await this.createSite(template as Omit<Site, "id" | "createdAt" | "updatedAt">)
        sites.push(site)
        console.log(`[v0] Created site: ${site.name} (${site.siteType})`)
      } catch (error) {
        console.error(`[v0] Error creating site:`, error)
      }
    }

    console.log(`[v0] Generated ${sites.length} demo sites`)
    return sites
  }

  private getSiteTemplatesForScenario(scenario: string, users: User[]): Partial<Site>[] {
    const baseDate = new Date()
    const projectManager = users.find((u) => u.role === "project-manager")?.id || ""
    const technicalOwner = users.find((u) => u.role === "technical-owner")?.id || ""
    const siteOwner = users.find((u) => u.role === "site-owner")?.id || ""
    const systemsEngineer = users.find((u) => u.role === "systems-engineer")?.id || ""

    const templates: { [key: string]: Partial<Site>[] } = {
      financial: [
        {
          name: "Wall Street Trading Floor",
          location: "New York, NY",
          region: "North America",
          country: "United States",
          state: "New York",
          city: "New York",
          siteType: "trading-floor",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 850,
          devices: 2100,
          deviceBreakdown: {
            windows: 600,
            mac: 150,
            linux: 50,
            ios: 200,
            android: 100,
            iot: 80,
            medical: 0,
            printers: 25,
            cameras: 120,
            voip: 400,
            kiosks: 15,
            tablets: 50,
            chromeos: 0,
            other: 300, // Trading terminals
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 75,
          complianceRequirements: ["PCI-DSS", "SOX", "FINRA", "SEC"],
          riskLevel: "critical",
          businessCriticality: "critical",
          notes: "High-frequency trading floor with ultra-low latency requirements",
        },
        {
          name: "Chicago Data Center",
          location: "Chicago, IL",
          region: "North America",
          country: "United States",
          state: "Illinois",
          city: "Chicago",
          siteType: "data-center",
          status: "design",
          priority: "critical",
          phase: "Phase 2 - Design",
          users: 120,
          devices: 800,
          deviceBreakdown: {
            windows: 80,
            mac: 20,
            linux: 200,
            ios: 30,
            android: 20,
            iot: 150,
            medical: 0,
            printers: 10,
            cameras: 80,
            voip: 50,
            kiosks: 5,
            tablets: 15,
            chromeos: 0,
            other: 130, // Servers and infrastructure
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 35,
          complianceRequirements: ["PCI-DSS", "SOX", "SSAE 18"],
          riskLevel: "critical",
          businessCriticality: "critical",
          notes: "Primary financial data center with disaster recovery capabilities",
        },
        {
          name: "Miami Branch Office",
          location: "Miami, FL",
          region: "North America",
          country: "United States",
          state: "Florida",
          city: "Miami",
          siteType: "branch",
          status: "planning",
          priority: "high",
          phase: "Phase 1 - Planning",
          users: 320,
          devices: 650,
          deviceBreakdown: {
            windows: 200,
            mac: 80,
            linux: 20,
            ios: 120,
            android: 80,
            iot: 40,
            medical: 0,
            printers: 15,
            cameras: 35,
            voip: 180,
            kiosks: 8,
            tablets: 25,
            chromeos: 0,
            other: 47,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 150 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 10,
          complianceRequirements: ["PCI-DSS", "SOX"],
          riskLevel: "medium",
          businessCriticality: "high",
          notes: "Regional branch office serving Latin American markets",
        },
        {
          name: "London Trading Desk",
          location: "London, UK",
          region: "Europe",
          country: "United Kingdom",
          state: "England",
          city: "London",
          siteType: "trading-floor",
          status: "testing",
          priority: "critical",
          phase: "Phase 4 - Testing",
          users: 450,
          devices: 1200,
          deviceBreakdown: {
            windows: 300,
            mac: 100,
            linux: 30,
            ios: 150,
            android: 80,
            iot: 60,
            medical: 0,
            printers: 20,
            cameras: 80,
            voip: 250,
            kiosks: 10,
            tablets: 30,
            chromeos: 0,
            other: 180, // Trading terminals
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 85,
          complianceRequirements: ["MiFID II", "GDPR", "PCI-DSS"],
          riskLevel: "critical",
          businessCriticality: "critical",
          notes: "European trading operations with regulatory compliance requirements",
        },
        {
          name: "Singapore Operations Center",
          location: "Singapore",
          region: "Asia Pacific",
          country: "Singapore",
          state: "",
          city: "Singapore",
          siteType: "operations-center",
          status: "planning",
          priority: "high",
          phase: "Phase 1 - Planning",
          users: 280,
          devices: 580,
          deviceBreakdown: {
            windows: 180,
            mac: 60,
            linux: 25,
            ios: 100,
            android: 70,
            iot: 45,
            medical: 0,
            printers: 12,
            cameras: 40,
            voip: 150,
            kiosks: 6,
            tablets: 20,
            chromeos: 0,
            other: 72,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 5,
          complianceRequirements: ["MAS", "PDPA"],
          riskLevel: "medium",
          businessCriticality: "high",
          notes: "Asia-Pacific operations hub with 24/7 trading support",
        },
        {
          name: "Compliance Center",
          location: "Charlotte, NC",
          region: "North America",
          country: "United States",
          state: "North Carolina",
          city: "Charlotte",
          siteType: "compliance-center",
          status: "design",
          priority: "critical",
          phase: "Phase 2 - Design",
          users: 180,
          devices: 420,
          deviceBreakdown: {
            windows: 120,
            mac: 40,
            linux: 15,
            ios: 60,
            android: 40,
            iot: 30,
            medical: 0,
            printers: 15,
            cameras: 50,
            voip: 80,
            kiosks: 3,
            tablets: 12,
            chromeos: 0,
            other: 55,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 25,
          complianceRequirements: ["SOX", "FINRA", "SEC", "CFTC"],
          riskLevel: "high",
          businessCriticality: "critical",
          notes: "Dedicated compliance and risk management facility",
        },
        {
          name: "Disaster Recovery Site",
          location: "Atlanta, GA",
          region: "North America",
          country: "United States",
          state: "Georgia",
          city: "Atlanta",
          siteType: "disaster-recovery",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 50,
          devices: 300,
          deviceBreakdown: {
            windows: 40,
            mac: 10,
            linux: 80,
            ios: 15,
            android: 10,
            iot: 50,
            medical: 0,
            printers: 5,
            cameras: 30,
            voip: 25,
            kiosks: 2,
            tablets: 8,
            chromeos: 0,
            other: 65, // DR infrastructure
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 60,
          complianceRequirements: ["SOX", "PCI-DSS"],
          riskLevel: "critical",
          businessCriticality: "critical",
          notes: "Hot disaster recovery site with 4-hour RTO requirement",
        },
        {
          name: "Executive Offices",
          location: "San Francisco, CA",
          region: "North America",
          country: "United States",
          state: "California",
          city: "San Francisco",
          siteType: "executive",
          status: "completed",
          priority: "high",
          phase: "Phase 5 - Completed",
          users: 150,
          devices: 380,
          deviceBreakdown: {
            windows: 80,
            mac: 60,
            linux: 10,
            ios: 80,
            android: 40,
            iot: 35,
            medical: 0,
            printers: 12,
            cameras: 25,
            voip: 100,
            kiosks: 5,
            tablets: 20,
            chromeos: 0,
            other: 13,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 100,
          complianceRequirements: ["SOX"],
          riskLevel: "medium",
          businessCriticality: "high",
          notes: "Executive offices with enhanced security and privacy controls",
        },
      ],
      healthcare: [
        {
          name: "Main Hospital Campus",
          location: "Boston, MA",
          region: "North America",
          country: "United States",
          state: "Massachusetts",
          city: "Boston",
          siteType: "hospital",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 3200,
          devices: 8500,
          deviceBreakdown: {
            windows: 1800,
            mac: 400,
            linux: 200,
            ios: 1200,
            android: 800,
            iot: 500,
            medical: 2800, // Medical devices
            printers: 150,
            cameras: 200,
            voip: 800,
            kiosks: 50,
            tablets: 400,
            chromeos: 100,
            other: 100,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 45,
          complianceRequirements: ["HIPAA", "HITECH", "FDA", "Joint Commission"],
          riskLevel: "critical",
          businessCriticality: "critical",
          notes: "Level 1 trauma center with 800 beds and critical care units",
        },
        {
          name: "Outpatient Surgery Center",
          location: "Cambridge, MA",
          region: "North America",
          country: "United States",
          state: "Massachusetts",
          city: "Cambridge",
          siteType: "outpatient",
          status: "design",
          priority: "high",
          phase: "Phase 2 - Design",
          users: 280,
          devices: 750,
          deviceBreakdown: {
            windows: 150,
            mac: 50,
            linux: 20,
            ios: 120,
            android: 80,
            iot: 60,
            medical: 180, // Surgical equipment
            printers: 15,
            cameras: 25,
            voip: 80,
            kiosks: 8,
            tablets: 40,
            chromeos: 12,
            other: 0,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 20,
          complianceRequirements: ["HIPAA", "HITECH", "FDA"],
          riskLevel: "high",
          businessCriticality: "high",
          notes: "Ambulatory surgery center with 12 operating rooms",
        },
        {
          name: "Medical Research Lab",
          location: "Philadelphia, PA",
          region: "North America",
          country: "United States",
          state: "Pennsylvania",
          city: "Philadelphia",
          siteType: "research",
          status: "planning",
          priority: "high",
          phase: "Phase 1 - Planning",
          users: 180,
          devices: 520,
          deviceBreakdown: {
            windows: 100,
            mac: 60,
            linux: 80,
            ios: 50,
            android: 30,
            iot: 40,
            medical: 120, // Lab equipment
            printers: 12,
            cameras: 15,
            voip: 40,
            kiosks: 3,
            tablets: 20,
            chromeos: 0,
            other: 40,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 5,
          complianceRequirements: ["HIPAA", "HITECH", "FDA", "NIH", "IRB"],
          riskLevel: "high",
          businessCriticality: "high",
          notes: "Clinical research facility with patient data and drug trials",
        },
      ],
      manufacturing: [
        {
          name: "Detroit Assembly Plant",
          location: "Detroit, MI",
          region: "North America",
          country: "United States",
          state: "Michigan",
          city: "Detroit",
          siteType: "manufacturing",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 1200,
          devices: 3500,
          deviceBreakdown: {
            windows: 400,
            mac: 50,
            linux: 300,
            ios: 200,
            android: 150,
            iot: 1800, // Industrial IoT
            medical: 0,
            printers: 30,
            cameras: 150,
            voip: 200,
            kiosks: 80,
            tablets: 120,
            chromeos: 20,
            other: 0,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 55,
          complianceRequirements: ["ISO 27001", "NIST", "IEC 62443"],
          riskLevel: "high",
          businessCriticality: "critical",
          notes: "Automotive assembly plant with OT/IT convergence requirements",
        },
      ],
      technology: [
        {
          name: "Silicon Valley HQ",
          location: "Palo Alto, CA",
          region: "North America",
          country: "United States",
          state: "California",
          city: "Palo Alto",
          siteType: "headquarters",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 2800,
          devices: 6200,
          deviceBreakdown: {
            windows: 1200,
            mac: 1800,
            linux: 800,
            ios: 1000,
            android: 600,
            iot: 300,
            medical: 0,
            printers: 80,
            cameras: 120,
            voip: 400,
            kiosks: 30,
            tablets: 200,
            chromeos: 150,
            other: 420,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 65,
          complianceRequirements: ["SOC 2", "ISO 27001", "GDPR"],
          riskLevel: "medium",
          businessCriticality: "critical",
          notes: "Technology company headquarters with high BYOD adoption",
        },
      ],
      corporate: [
        {
          name: "Global Headquarters",
          location: "New York, NY",
          region: "North America",
          country: "United States",
          state: "New York",
          city: "New York",
          siteType: "headquarters",
          status: "implementation",
          priority: "critical",
          phase: "Phase 3 - Implementation",
          users: 2500,
          devices: 5000,
          deviceBreakdown: {
            windows: 1800,
            mac: 400,
            linux: 100,
            ios: 800,
            android: 600,
            iot: 200,
            medical: 0,
            printers: 50,
            cameras: 80,
            voip: 300,
            kiosks: 20,
            tablets: 150,
            chromeos: 50,
            other: 100,
          },
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [],
            technicalAccountManagers: [],
            technicians: [],
            securitySpecialists: [],
          },
          startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 65,
          complianceRequirements: ["SOX", "PCI-DSS"],
          riskLevel: "medium",
          businessCriticality: "high",
          notes: "Primary corporate headquarters with full NAC deployment",
        },
      ],
    }

    return templates[scenario] || templates.corporate
  }

  async generateDemoEvents(scenario: string, sites: Site[], users: User[]): Promise<Event[]> {
    console.log(`[v0] Generating demo events for scenario: ${scenario}`)
    const eventTemplates = this.getEventTemplatesForScenario(scenario, sites, users)
    const events: Event[] = []

    for (const template of eventTemplates) {
      try {
        const event = await this.createEvent(template as Omit<Event, "id" | "createdAt" | "updatedAt">)
        events.push(event)
        console.log(`[v0] Created event: ${event.title} (${event.type})`)
      } catch (error) {
        console.error(`[v0] Error creating event:`, error)
      }
    }

    console.log(`[v0] Generated ${events.length} demo events`)
    return events
  }

  async generateDemoPolicies(scenario: string): Promise<GlobalPolicy[]> {
    console.log(`[v0] Generating demo policies for scenario: ${scenario}`)
    const policyTemplates = this.getPolicyTemplatesForScenario(scenario)
    const policies: GlobalPolicy[] = []

    for (const template of policyTemplates) {
      try {
        const policy = await this.createGlobalPolicy(template as Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">)
        policies.push(policy)
        console.log(`[v0] Created policy: ${policy.name} (${policy.category})`)
      } catch (error) {
        console.error(`[v0] Error creating policy:`, error)
      }
    }

    console.log(`[v0] Generated ${policies.length} demo policies`)
    return policies
  }

  private getUserTemplatesForScenario(scenario: string): Partial<User>[] {
    const baseTemplates = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        role: "project-manager",
        department: "IT",
        title: "Senior Project Manager",
        phone: "+1-555-0101",
        location: "New York, NY",
        status: "active",
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          timezone: "America/New_York",
        },
        permissions: ["read", "write", "admin"],
        certifications: ["PMP", "CISSP"],
        specialties: ["Network Security", "Project Management"],
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        role: "technical-owner",
        department: "IT Security",
        title: "Network Security Architect",
        phone: "+1-555-0102",
        location: "New York, NY",
        status: "active",
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "dark",
          notifications: true,
          timezone: "America/New_York",
        },
        permissions: ["read", "write", "admin"],
        certifications: ["CISSP", "CCNP Security", "CISM"],
        specialties: ["Network Architecture", "Security Design"],
      },
      {
        name: "Mike Chen",
        email: "mike.chen@company.com",
        role: "systems-engineer",
        department: "IT Operations",
        title: "Senior Systems Engineer",
        phone: "+1-555-0103",
        location: "San Francisco, CA",
        status: "active",
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          timezone: "America/Los_Angeles",
        },
        permissions: ["read", "write"],
        certifications: ["CCNA", "CCNP", "VMware VCP"],
        specialties: ["Network Implementation", "System Integration"],
      },
      {
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@company.com",
        role: "site-owner",
        department: "Facilities",
        title: "Site Operations Manager",
        phone: "+1-555-0104",
        location: "Chicago, IL",
        status: "active",
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          timezone: "America/Chicago",
        },
        permissions: ["read", "write"],
        certifications: ["FMP", "LEED AP"],
        specialties: ["Facilities Management", "Site Operations"],
      },
    ]

    const scenarioUsers: { [key: string]: Partial<User>[] } = {
      financial: [
        {
          name: "Robert Kim",
          email: "robert.kim@bank.com",
          role: "compliance-officer",
          department: "Risk Management",
          title: "PCI Compliance Manager",
          phone: "+1-555-0301",
          location: "Charlotte, NC",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "audit"],
          certifications: ["PCI-DSS", "CISA", "FRM"],
          specialties: ["Financial Compliance", "Payment Security"],
        },
        {
          name: "Jennifer Walsh",
          email: "jennifer.walsh@bank.com",
          role: "trader",
          department: "Trading",
          title: "Senior Equity Trader",
          phone: "+1-555-0302",
          location: "New York, NY",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["Series 7", "Series 63", "CFA"],
          specialties: ["Equity Trading", "Market Analysis"],
        },
        {
          name: "Marcus Thompson",
          email: "marcus.thompson@bank.com",
          role: "risk-manager",
          department: "Risk Management",
          title: "Chief Risk Officer",
          phone: "+1-555-0303",
          location: "New York, NY",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["FRM", "PRM", "CFA"],
          specialties: ["Market Risk", "Operational Risk"],
        },
        {
          name: "Amanda Foster",
          email: "amanda.foster@bank.com",
          role: "quant-analyst",
          department: "Quantitative Research",
          title: "Senior Quantitative Analyst",
          phone: "+1-555-0304",
          location: "Chicago, IL",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["CQF", "FRM", "PhD Mathematics"],
          specialties: ["Algorithmic Trading", "Risk Modeling"],
        },
        {
          name: "David Park",
          email: "david.park@bank.com",
          role: "operations-manager",
          department: "Operations",
          title: "Trading Operations Manager",
          phone: "+1-555-0305",
          location: "London, UK",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["Series 7", "CAMS", "Six Sigma"],
          specialties: ["Trade Settlement", "Operations Management"],
        },
        {
          name: "Rachel Green",
          email: "rachel.green@bank.com",
          role: "compliance-analyst",
          department: "Compliance",
          title: "Senior Compliance Analyst",
          phone: "+1-555-0306",
          location: "Charlotte, NC",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "audit"],
          certifications: ["CAMS", "CISA", "Series 7"],
          specialties: ["AML Compliance", "Regulatory Reporting"],
        },
        {
          name: "Kevin Liu",
          email: "kevin.liu@bank.com",
          role: "it-security",
          department: "Information Security",
          title: "Financial Security Specialist",
          phone: "+1-555-0307",
          location: "Singapore",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["CISSP", "CISM", "PCI-DSS"],
          specialties: ["Financial Security", "Fraud Prevention"],
        },
        {
          name: "Maria Santos",
          email: "maria.santos@bank.com",
          role: "branch-manager",
          department: "Retail Banking",
          title: "Regional Branch Manager",
          phone: "+1-555-0308",
          location: "Miami, FL",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["MBA Finance", "Series 6", "CRCM"],
          specialties: ["Branch Operations", "Customer Relations"],
        },
        {
          name: "Thomas Anderson",
          email: "thomas.anderson@bank.com",
          role: "data-analyst",
          department: "Data Analytics",
          title: "Senior Data Analyst",
          phone: "+1-555-0309",
          location: "Chicago, IL",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["CFA", "SAS", "Tableau"],
          specialties: ["Financial Analytics", "Data Visualization"],
        },
        {
          name: "Catherine Moore",
          email: "catherine.moore@bank.com",
          role: "audit-manager",
          department: "Internal Audit",
          title: "IT Audit Manager",
          phone: "+1-555-0310",
          location: "Atlanta, GA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "audit"],
          certifications: ["CIA", "CISA", "CPA"],
          specialties: ["IT Audit", "SOX Compliance"],
        },
      ],
      healthcare: [
        {
          name: "Dr. Emily Watson",
          email: "emily.watson@hospital.com",
          role: "compliance-officer",
          department: "Compliance",
          title: "HIPAA Compliance Officer",
          phone: "+1-555-0201",
          location: "Boston, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "audit"],
          certifications: ["HIPAA", "CISA", "CHPS"],
          specialties: ["Healthcare Compliance", "Medical Device Security"],
        },
        {
          name: "Dr. Michael Rodriguez",
          email: "michael.rodriguez@hospital.com",
          role: "chief-medical-officer",
          department: "Medical Staff",
          title: "Chief Medical Officer",
          phone: "+1-555-0202",
          location: "Boston, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["MD", "MBA", "Board Certified"],
          specialties: ["Clinical Operations", "Medical Leadership"],
        },
        {
          name: "Nancy Johnson",
          email: "nancy.johnson@hospital.com",
          role: "nurse-manager",
          department: "Nursing",
          title: "Chief Nursing Officer",
          phone: "+1-555-0203",
          location: "Boston, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["RN", "MSN", "CNAA"],
          specialties: ["Nursing Operations", "Patient Care"],
        },
        {
          name: "Dr. James Wilson",
          email: "james.wilson@hospital.com",
          role: "radiologist",
          department: "Radiology",
          title: "Chief of Radiology",
          phone: "+1-555-0204",
          location: "Boston, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["MD", "Board Certified Radiology"],
          specialties: ["Medical Imaging", "PACS Systems"],
        },
        {
          name: "Susan Davis",
          email: "susan.davis@hospital.com",
          role: "privacy-officer",
          department: "Privacy",
          title: "Chief Privacy Officer",
          phone: "+1-555-0205",
          location: "Boston, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "audit"],
          certifications: ["CHPS", "CIPP", "CIPM"],
          specialties: ["Healthcare Privacy", "HIPAA Compliance"],
        },
        {
          name: "Robert Chen",
          email: "robert.chen@hospital.com",
          role: "biomedical-engineer",
          department: "Biomedical Engineering",
          title: "Senior Biomedical Engineer",
          phone: "+1-555-0206",
          location: "Cambridge, MA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["PE", "CBET", "CRES"],
          specialties: ["Medical Device Management", "Clinical Engineering"],
        },
      ],
      manufacturing: [
        {
          name: "David Thompson",
          email: "david.thompson@factory.com",
          role: "ot-specialist",
          department: "Operations Technology",
          title: "OT Security Specialist",
          phone: "+1-555-0401",
          location: "Detroit, MI",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["GICSP", "CISSP", "Six Sigma"],
          specialties: ["Industrial Control Systems", "OT/IT Convergence"],
        },
        {
          name: "Jennifer Martinez",
          email: "jennifer.martinez@factory.com",
          role: "plant-manager",
          department: "Manufacturing",
          title: "Plant Operations Manager",
          phone: "+1-555-0402",
          location: "Detroit, MI",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["Six Sigma Black Belt", "Lean Manufacturing"],
          specialties: ["Manufacturing Operations", "Process Improvement"],
        },
        {
          name: "Carlos Rodriguez",
          email: "carlos.rodriguez@factory.com",
          role: "maintenance-manager",
          department: "Maintenance",
          title: "Maintenance Engineering Manager",
          phone: "+1-555-0403",
          location: "Detroit, MI",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["CMRP", "CRL", "Six Sigma"],
          specialties: ["Predictive Maintenance", "Asset Management"],
        },
        {
          name: "Angela Foster",
          email: "angela.foster@factory.com",
          role: "quality-manager",
          department: "Quality Assurance",
          title: "Quality Systems Manager",
          phone: "+1-555-0404",
          location: "Detroit, MI",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["ASQ CQE", "ISO 9001", "Six Sigma"],
          specialties: ["Quality Systems", "Statistical Process Control"],
        },
      ],
      technology: [
        {
          name: "Alex Chen",
          email: "alex.chen@techcorp.com",
          role: "devops-engineer",
          department: "Engineering",
          title: "Senior DevOps Engineer",
          phone: "+1-555-0501",
          location: "Palo Alto, CA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["AWS Solutions Architect", "Kubernetes", "Docker"],
          specialties: ["Cloud Infrastructure", "CI/CD Pipelines"],
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techcorp.com",
          role: "security-engineer",
          department: "Security",
          title: "Principal Security Engineer",
          phone: "+1-555-0502",
          location: "Palo Alto, CA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write", "admin"],
          certifications: ["CISSP", "OSCP", "AWS Security"],
          specialties: ["Application Security", "Cloud Security"],
        },
        {
          name: "Jordan Kim",
          email: "jordan.kim@techcorp.com",
          role: "product-manager",
          department: "Product",
          title: "Senior Product Manager",
          phone: "+1-555-0503",
          location: "Palo Alto, CA",
          status: "active",
          lastLogin: new Date().toISOString(),
          permissions: ["read", "write"],
          certifications: ["PMP", "Agile", "Scrum Master"],
          specialties: ["Product Strategy", "User Experience"],
        },
      ],
    }

    return [...baseTemplates, ...(scenarioUsers[scenario] || [])]
  }

  private getCompanyNameForScenario(scenario: string): string {
    const companyNames: { [key: string]: string } = {
      corporate: "GlobalTech Solutions",
      healthcare: "MediCare Health Systems",
      financial: "SecureBank Financial Group",
      technology: "InnovateTech Corp",
      manufacturing: "Advanced Manufacturing Inc.",
      education: "Riverside University",
      retail: "Premium Retail Group",
    }

    return companyNames[scenario] || "TechCorp Global"
  }

  async clearAllData(): Promise<void> {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(this.getStorageKey("sites"))
      localStorage.removeItem(this.getStorageKey("events"))
      localStorage.removeItem(this.getStorageKey("users"))
      localStorage.removeItem(this.getStorageKey("globalPolicies"))
      localStorage.removeItem(this.getStorageKey("preferences"))
    } catch (error) {
      console.error("Error clearing local storage:", error)
    }
  }

  private getEventTemplatesForScenario(scenario: string, sites: Site[], users: User[]): Partial<Event>[] {
    const baseDate = new Date()
    const projectManager = users.find((u) => u.role === "project-manager")?.id || ""
    const technicalOwner = users.find((u) => u.role === "technical-owner")?.id || ""
    const systemsEngineer = users.find((u) => u.role === "systems-engineer")?.id || ""

    const templates: { [key: string]: Partial<Event>[] } = {
      financial: [
        {
          title: "Financial Services NAC Kickoff",
          description: "Project initiation for financial services NAC deployment with PCI-DSS compliance requirements",
          type: "milestone",
          status: "completed",
          priority: "critical",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 85 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Project Charter", "Stakeholder Analysis", "PCI-DSS Requirements", "Risk Assessment"],
          dependencies: [],
          tags: ["kickoff", "financial", "pci-dss"],
        },
        {
          title: "Trading Floor Network Assessment",
          description: "Comprehensive network assessment of high-frequency trading infrastructure",
          type: "assessment",
          status: "completed",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Network Topology", "Latency Analysis", "Security Assessment", "Compliance Gap Analysis"],
          dependencies: ["Financial Services NAC Kickoff"],
          tags: ["assessment", "trading", "latency"],
        },
        {
          title: "PCI-DSS Compliance Design",
          description: "Design NAC policies and controls for PCI-DSS compliance across all financial sites",
          type: "design",
          status: "in-progress",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["PCI-DSS Policy Framework", "Network Segmentation Design", "Access Control Matrix"],
          dependencies: ["Trading Floor Network Assessment"],
          tags: ["design", "pci-dss", "compliance"],
        },
        {
          title: "SOX Compliance Integration",
          description: "Integrate SOX compliance requirements into NAC framework",
          type: "compliance",
          status: "in-progress",
          priority: "high",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["SOX Controls Mapping", "Audit Trail Configuration", "Compliance Reporting"],
          dependencies: ["PCI-DSS Compliance Design"],
          tags: ["compliance", "sox", "audit"],
        },
        {
          title: "Trading Terminal Deployment",
          description: "Deploy NAC controls for specialized trading terminals and market data systems",
          type: "deployment",
          status: "planned",
          priority: "critical",
          assignedTo: systemsEngineer,
          startDate: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Terminal Configuration", "Market Data Access Controls", "Latency Testing"],
          dependencies: ["SOX Compliance Integration"],
          tags: ["deployment", "trading", "terminals"],
        },
        {
          title: "FINRA Compliance Validation",
          description: "Validate NAC implementation against FINRA regulatory requirements",
          type: "validation",
          status: "planned",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["FINRA Compliance Report", "Regulatory Testing", "Documentation Package"],
          dependencies: ["Trading Terminal Deployment"],
          tags: ["validation", "finra", "regulatory"],
        },
      ],
      healthcare: [
        {
          title: "Healthcare NAC Initiative Launch",
          description: "Launch NAC project for healthcare environment with HIPAA compliance focus",
          type: "milestone",
          status: "completed",
          priority: "critical",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 115 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Project Charter", "HIPAA Requirements", "Medical Device Inventory", "Risk Assessment"],
          dependencies: [],
          tags: ["kickoff", "healthcare", "hipaa"],
        },
        {
          title: "Medical Device Security Assessment",
          description: "Comprehensive security assessment of medical devices and IoMT infrastructure",
          type: "assessment",
          status: "completed",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 110 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 95 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: [
            "Device Inventory",
            "Vulnerability Assessment",
            "Network Segmentation Plan",
            "FDA Compliance Review",
          ],
          dependencies: ["Healthcare NAC Initiative Launch"],
          tags: ["assessment", "medical-devices", "iomt"],
        },
        {
          title: "HIPAA Compliance Framework",
          description: "Design comprehensive HIPAA-compliant NAC framework for patient data protection",
          type: "design",
          status: "in-progress",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: [
            "HIPAA Policy Framework",
            "PHI Access Controls",
            "Audit Logging Design",
            "Encryption Standards",
          ],
          dependencies: ["Medical Device Security Assessment"],
          tags: ["design", "hipaa", "phi"],
        },
        {
          title: "Clinical Workflow Integration",
          description: "Integrate NAC controls with clinical workflows and EHR systems",
          type: "integration",
          status: "in-progress",
          priority: "high",
          assignedTo: systemsEngineer,
          startDate: new Date(baseDate.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["EHR Integration", "Clinical Device Policies", "Workflow Documentation", "User Training"],
          dependencies: ["HIPAA Compliance Framework"],
          tags: ["integration", "clinical", "ehr"],
        },
        {
          title: "Medical Device Deployment",
          description: "Deploy NAC controls for medical devices and IoMT infrastructure",
          type: "deployment",
          status: "planned",
          priority: "critical",
          assignedTo: systemsEngineer,
          startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Device Configuration", "Network Segmentation", "Monitoring Setup", "Incident Response"],
          dependencies: ["Clinical Workflow Integration"],
          tags: ["deployment", "medical-devices", "monitoring"],
        },
        {
          title: "HITECH Compliance Validation",
          description: "Validate NAC implementation against HITECH Act requirements",
          type: "validation",
          status: "planned",
          priority: "high",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["HITECH Compliance Report", "Breach Notification Procedures", "Audit Documentation"],
          dependencies: ["Medical Device Deployment"],
          tags: ["validation", "hitech", "compliance"],
        },
      ],
      manufacturing: [
        {
          title: "Industrial NAC Project Kickoff",
          description: "Launch NAC project for manufacturing environment with OT/IT convergence focus",
          type: "milestone",
          status: "completed",
          priority: "critical",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 95 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Project Charter", "OT/IT Assessment", "Safety Requirements", "Production Impact Analysis"],
          dependencies: [],
          tags: ["kickoff", "manufacturing", "ot-it"],
        },
        {
          title: "Industrial Control Systems Assessment",
          description: "Security assessment of SCADA, PLC, and industrial control systems",
          type: "assessment",
          status: "completed",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["ICS Inventory", "Vulnerability Assessment", "Network Architecture", "Safety Analysis"],
          dependencies: ["Industrial NAC Project Kickoff"],
          tags: ["assessment", "ics", "scada"],
        },
        {
          title: "OT Network Segmentation Design",
          description: "Design network segmentation strategy for operational technology networks",
          type: "design",
          status: "in-progress",
          priority: "critical",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: [
            "Segmentation Architecture",
            "Zone Definitions",
            "Access Control Policies",
            "Safety Protocols",
          ],
          dependencies: ["Industrial Control Systems Assessment"],
          tags: ["design", "segmentation", "ot"],
        },
        {
          title: "Production Line Integration",
          description: "Integrate NAC controls with production line systems and manufacturing execution systems",
          type: "integration",
          status: "planned",
          priority: "high",
          assignedTo: systemsEngineer,
          startDate: new Date(baseDate.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["MES Integration", "Production Policies", "Downtime Minimization", "Quality Controls"],
          dependencies: ["OT Network Segmentation Design"],
          tags: ["integration", "production", "mes"],
        },
      ],
      technology: [
        {
          title: "Tech Company NAC Initiative",
          description: "Launch NAC project for technology company with cloud-first approach",
          type: "milestone",
          status: "completed",
          priority: "high",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Project Charter", "Cloud Architecture Review", "BYOD Assessment", "DevOps Integration Plan"],
          dependencies: [],
          tags: ["kickoff", "technology", "cloud"],
        },
        {
          title: "Cloud Infrastructure Assessment",
          description: "Assess cloud infrastructure and hybrid connectivity for NAC integration",
          type: "assessment",
          status: "completed",
          priority: "high",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Cloud Architecture", "Hybrid Connectivity", "Security Posture", "Compliance Review"],
          dependencies: ["Tech Company NAC Initiative"],
          tags: ["assessment", "cloud", "hybrid"],
        },
        {
          title: "Zero Trust Architecture Design",
          description: "Design zero trust network architecture for modern technology environment",
          type: "design",
          status: "in-progress",
          priority: "high",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Zero Trust Framework", "Identity Integration", "Micro-segmentation", "Policy Engine"],
          dependencies: ["Cloud Infrastructure Assessment"],
          tags: ["design", "zero-trust", "identity"],
        },
      ],
      corporate: [
        {
          title: "Corporate NAC Project Launch",
          description: "Launch enterprise NAC deployment project",
          type: "milestone",
          status: "completed",
          priority: "high",
          assignedTo: projectManager,
          startDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Project Charter", "Stakeholder Analysis", "Requirements Gathering", "Risk Assessment"],
          dependencies: [],
          tags: ["kickoff", "corporate", "enterprise"],
        },
        {
          title: "Network Infrastructure Assessment",
          description: "Comprehensive assessment of existing network infrastructure",
          type: "assessment",
          status: "completed",
          priority: "high",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          deliverables: ["Network Topology", "Device Inventory", "Security Assessment", "Capacity Analysis"],
          dependencies: ["Corporate NAC Project Launch"],
          tags: ["assessment", "infrastructure", "security"],
        },
        {
          title: "NAC Architecture Design",
          description: "Design comprehensive NAC architecture for corporate environment",
          type: "design",
          status: "in-progress",
          priority: "high",
          assignedTo: technicalOwner,
          startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(baseDate.getTime()).toISOString().split("T")[0],
          deliverables: ["Architecture Design", "Policy Framework", "Integration Plan", "Security Controls"],
          dependencies: ["Network Infrastructure Assessment"],
          tags: ["design", "architecture", "policies"],
        },
      ],
    }

    return templates[scenario] || templates.corporate
  }

  private getPolicyTemplatesForScenario(scenario: string): Partial<GlobalPolicy>[] {
    const baseDate = new Date()

    const templates: { [key: string]: Partial<GlobalPolicy>[] } = {
      financial: [
        {
          name: "PCI-DSS Compliance Policy",
          description: "Enforce PCI-DSS compliance for all financial transactions",
          category: "compliance",
          type: "access",
          priority: 1,
          conditions: [
            {
              type: "user_group",
              operator: "equals",
              value: "finance",
              description: "Applies to users in the finance group",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: {
                access: "full",
              },
              description: "Allows full access to financial resources",
              priority: 1,
            },
          ],
          enabled: true,
          applicableSites: [],
          tags: ["pci-dss", "compliance", "finance"],
          version: "1.0",
          approvedBy: "John Smith",
          createdAt: baseDate.toISOString(),
          updatedAt: baseDate.toISOString(),
        },
      ],
      healthcare: [
        {
          name: "HIPAA Compliance Policy",
          description: "Enforce HIPAA compliance for all patient data access",
          category: "compliance",
          type: "access",
          priority: 1,
          conditions: [
            {
              type: "user_group",
              operator: "equals",
              value: "medical",
              description: "Applies to users in the medical group",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: {
                access: "limited",
              },
              description: "Allows limited access to patient data",
              priority: 1,
            },
          ],
          enabled: true,
          applicableSites: [],
          tags: ["hipaa", "compliance", "medical"],
          version: "1.0",
          approvedBy: "John Smith",
          createdAt: baseDate.toISOString(),
          updatedAt: baseDate.toISOString(),
        },
      ],
      manufacturing: [
        {
          name: "OT Security Policy",
          description: "Enforce security for operational technology networks",
          category: "security",
          type: "access",
          priority: 1,
          conditions: [
            {
              type: "device_type",
              operator: "equals",
              value: "plc",
              description: "Applies to programmable logic controllers",
            },
          ],
          actions: [
            {
              type: "deny",
              parameters: {
                access: "none",
              },
              description: "Denies access to unauthorized devices",
              priority: 1,
            },
          ],
          enabled: true,
          applicableSites: [],
          tags: ["ot", "security", "manufacturing"],
          version: "1.0",
          approvedBy: "John Smith",
          createdAt: baseDate.toISOString(),
          updatedAt: baseDate.toISOString(),
        },
      ],
      technology: [
        {
          name: "BYOD Access Policy",
          description: "Enforce security for bring your own devices",
          category: "security",
          type: "access",
          priority: 1,
          conditions: [
            {
              type: "device_type",
              operator: "equals",
              value: "mobile",
              description: "Applies to mobile devices",
            },
          ],
          actions: [
            {
              type: "quarantine",
              parameters: {
                vlan: "guest",
              },
              description: "Quarantines devices to guest VLAN",
              priority: 1,
            },
          ],
          enabled: true,
          applicableSites: [],
          tags: ["byod", "security", "technology"],
          version: "1.0",
          approvedBy: "John Smith",
          createdAt: baseDate.toISOString(),
          updatedAt: baseDate.toISOString(),
        },
      ],
      corporate: [
        {
          name: "Default Access Policy",
          description: "Default access policy for all users",
          category: "authentication",
          type: "access",
          priority: 1,
          conditions: [
            {
              type: "user_group",
              operator: "equals",
              value: "all",
              description: "Applies to all users",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: {
                access: "limited",
              },
              description: "Allows limited access to network resources",
              priority: 1,
            },
          ],
          enabled: true,
          applicableSites: [],
          tags: ["default", "access", "corporate"],
          version: "1.0",
          approvedBy: "John Smith",
          createdAt: baseDate.toISOString(),
          updatedAt: baseDate.toISOString(),
        },
      ],
    }

    return templates[scenario] || templates.corporate
  }
}

// Create and export the storage instance
const storageInstance = new Storage()

// Export as named export
export const storage = storageInstance

// Export as default export for backward compatibility
export default storageInstance
