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
    console.log(`Starting demo data generation for scenario: ${scenario}`)

    try {
      // Clear existing data
      await this.clearAllData()

      // Update preferences with scenario
      await this.updateUserPreferences({
        demoScenario: scenario,
        companyName: this.getCompanyNameForScenario(scenario),
      })

      // Generate demo users first (needed for site assignments)
      console.log("Generating demo users...")
      const users = await this.generateDemoUsers(scenario)
      console.log(`Generated ${users.length} users`)

      // Generate demo sites with full data
      console.log("Generating demo sites...")
      const sites = await this.generateDemoSites(scenario, users)
      console.log(`Generated ${sites.length} sites`)

      // Generate demo events based on sites
      console.log("Generating demo events...")
      const events = await this.generateDemoEvents(scenario, sites, users)
      console.log(`Generated ${events.length} events`)

      // Generate demo policies
      console.log("Generating demo policies...")
      const policies = await this.generateDemoPolicies(scenario)
      console.log(`Generated ${policies.length} policies`)

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

      console.log("Demo data generation completed successfully!")
    } catch (error) {
      console.error("Error generating demo data:", error)
      throw new Error(`Failed to generate demo data for ${scenario} scenario: ${error}`)
    }
  }

  private async generateDemoUsers(scenario: string): Promise<User[]> {
    const users: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        role: "project-manager",
        department: "Project Management",
        title: "Senior Project Manager",
        phone: "555-123-4567",
        avatar: "https://i.pravatar.cc/150?img=1",
        isActive: true,
        specialties: ["NAC Deployment", "Zero Trust Architecture", "Project Planning"],
        certifications: ["PMP", "CCNP Security", "CISSP"],
        skills: ["Project Planning", "Risk Management", "Team Leadership", "Stakeholder Management"],
        languages: ["English", "Spanish"],
        timeZone: "America/New_York",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Cisco", "Aruba", "Portnox", "Microsoft"],
        projectHistory: ["NAC Deployment Phase 1", "Security Infrastructure Upgrade", "Multi-Site Rollout"],
        performanceRating: 5,
      },
      {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        role: "technical-owner",
        department: "Network Engineering",
        title: "Lead Network Architect",
        phone: "555-987-6543",
        avatar: "https://i.pravatar.cc/150?img=2",
        isActive: true,
        specialties: ["Network Architecture", "Security Design", "Wireless Infrastructure"],
        certifications: ["CCIE Security", "CISSP", "CWNE"],
        skills: ["Network Design", "Security Architecture", "Troubleshooting", "Automation"],
        languages: ["English", "Mandarin"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "flexible",
          vacationDays: [],
        },
        vendorRelationships: ["Cisco", "Aruba", "Juniper", "Palo Alto Networks"],
        projectHistory: ["Enterprise Network Redesign", "Wireless Infrastructure Upgrade", "Security Modernization"],
        performanceRating: 5,
      },
      {
        name: "Michael Thompson",
        email: "michael.thompson@example.com",
        role: "site-owner",
        department: "IT Operations",
        title: "Regional IT Manager",
        phone: "555-246-8013",
        avatar: "https://i.pravatar.cc/150?img=3",
        isActive: true,
        specialties: ["Site Operations", "Infrastructure Management", "Team Leadership"],
        certifications: ["ITIL v4", "CompTIA Network+", "Microsoft Azure Administrator"],
        skills: ["Operations Management", "Budget Planning", "Vendor Management", "Problem Resolution"],
        languages: ["English"],
        timeZone: "America/Chicago",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Dell", "HPE", "Microsoft", "VMware"],
        projectHistory: ["Regional Infrastructure Consolidation", "Help Desk Modernization", "Cloud Migration"],
        performanceRating: 4,
      },
      {
        name: "David Kim",
        email: "david.kim@example.com",
        role: "systems-engineer",
        department: "Systems Engineering",
        title: "Senior Systems Engineer",
        phone: "555-135-7912",
        avatar: "https://i.pravatar.cc/150?img=4",
        isActive: true,
        specialties: ["Systems Integration", "Cloud Platforms", "Automation"],
        certifications: ["AWS Solutions Architect", "VMware VCP", "Red Hat Certified Engineer"],
        skills: ["System Design", "Cloud Architecture", "Scripting", "DevOps"],
        languages: ["English", "Korean"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 42,
          preferredSchedule: "flexible",
          vacationDays: [],
        },
        vendorRelationships: ["AWS", "Microsoft", "VMware", "Red Hat"],
        projectHistory: ["Cloud Migration Project", "Infrastructure Automation", "Hybrid Cloud Implementation"],
        performanceRating: 5,
      },
    ]

    const createdUsers: User[] = []
    for (const userData of users) {
      const user = await this.createUser(userData)
      createdUsers.push(user)
    }

    return createdUsers
  }

  private async generateDemoSites(scenario: string, users: User[]): Promise<Site[]> {
    const sites: Site[] = []
    const siteTemplates = this.getSiteTemplatesForScenario(scenario, users)

    for (const template of siteTemplates) {
      const site = await this.createSite(template as Omit<Site, "id" | "createdAt" | "updatedAt">)
      sites.push(site)
    }

    return sites
  }

  private getSiteTemplatesForScenario(scenario: string, users: User[]): Partial<Site>[] {
    const baseDate = new Date()
    const projectManager = users.find((u) => u.role === "project-manager")?.id || ""
    const technicalOwner = users.find((u) => u.role === "technical-owner")?.id || ""
    const siteOwner = users.find((u) => u.role === "site-owner")?.id || ""
    const systemsEngineer = users.find((u) => u.role === "systems-engineer")?.id || ""

    const templates: { [key: string]: Partial<Site>[] } = {
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
          milestones: [],
          wiredInfrastructure: {
            vendor: "cisco",
            switchModels: ["Catalyst 9300", "Catalyst 9400"],
            switchCount: 45,
            portCount: 2000,
            stackingSupport: true,
            poeSupport: true,
            mgmtVlan: 100,
            firmware: "17.09.02",
          },
          wirelessInfrastructure: {
            vendor: "cisco",
            controllerModel: "9800-CL",
            apModels: ["Catalyst 9130AXI", "Catalyst 9120AXI"],
            apCount: 120,
            wifiStandards: ["802.11ax"],
            bandSupport: ["2.4GHz", "5GHz", "6GHz"],
            meshSupport: true,
            firmware: "17.09.04",
          },
          connectivity: {
            type: "mpls",
            bandwidth: "1Gbps",
            provider: "Verizon Business",
            redundancy: true,
          },
          identityProvider: {
            type: "azure-ad",
            domain: "globaltech.com",
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
            models: ["PA-5220", "PA-3220"],
            haConfiguration: true,
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
            type: "tacacs",
            vendor: "portnox",
            privilegeLevels: [1, 15],
            commandAuthorization: true,
          },
          vlans: 25,
          subnets: ["10.1.0.0/16", "10.2.0.0/16"],
          dhcpScopes: 15,
          dnsServers: ["10.1.1.10", "10.1.1.11"],
          globalPolicies: [],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: true,
            time_based_access: true,
            device_compliance: true,
            location_based: true,
          },
          complianceRequirements: ["SOX", "ISO 27001"],
          securityStandards: ["NIST", "CIS Controls"],
          dataClassification: "confidential",
          notes: "Primary headquarters with executive offices and data center",
          deploymentChecklist: [],
          riskAssessment: [],
        },
      ],
    }

    return templates[scenario] || templates.corporate
  }

  private async generateDemoEvents(scenario: string, sites: Site[], users: User[]): Promise<Event[]> {
    const events: Event[] = []
    const eventTemplates = this.getEventTemplatesForScenario(scenario, sites, users)

    for (const template of eventTemplates) {
      const event = await this.createEvent(template as Omit<Event, "id" | "createdAt" | "updatedAt">)
      events.push(event)
    }

    return events
  }

  private getEventTemplatesForScenario(scenario: string, sites: Site[], users: User[]): Partial<Event>[] {
    const baseDate = new Date()
    const projectManager = users.find((u) => u.role === "project-manager")?.id || ""

    return [
      {
        title: "Project Kickoff",
        description: "NAC deployment project kickoff meeting",
        startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        type: "kickoff",
        priority: "high",
        assignedTo: projectManager,
        siteId: sites[0]?.id,
        status: "completed",
        attendees: [projectManager],
        location: "Conference Room A",
        meetingType: "in-person",
        prerequisites: [],
        deliverables: ["Project Charter", "Kickoff Presentation"],
      },
    ]
  }

  private async generateDemoPolicies(scenario: string): Promise<GlobalPolicy[]> {
    const policies: GlobalPolicy[] = []
    const policyTemplates = this.getPolicyTemplatesForScenario(scenario)

    for (const template of policyTemplates) {
      const policy = await this.createGlobalPolicy(template as Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">)
      policies.push(policy)
    }

    return policies
  }

  private getPolicyTemplatesForScenario(scenario: string): Partial<GlobalPolicy>[] {
    return [
      {
        name: "Guest Access Policy",
        description: "Default guest access policy",
        category: "guest_access",
        type: "access",
        priority: 10,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "guest",
            description: "Guest users",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: { vlan: "guest" },
            description: "Allow guest access",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["guest"],
        version: "1.0",
        approvedBy: "System Administrator",
      },
    ]
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
}

// Create and export the storage instance
const storageInstance = new Storage()

// Export as named export
export const storage = storageInstance

// Export as default export for backward compatibility
export default storageInstance
