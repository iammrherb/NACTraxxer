// Enhanced storage utility for NAC deployment management
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

  // Enhanced User and device counts with detailed breakdown
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

  // Enhanced Team assignments with multiple users per role
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

  // Timeline
  startDate: string
  targetDate: string
  completionDate?: string
  progress: number
  milestones: Milestone[]

  // Enhanced Technical Infrastructure
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

  // Enhanced Authentication & Authorization
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

  // Infrastructure details
  vlans: number
  subnets: string[]
  dhcpScopes: number
  dnsServers: string[]

  // Enhanced Policies
  globalPolicies: string[]
  sitePolicies: SitePolicy[]
  policyEnforcement: {
    dynamic_vlan: boolean
    bandwidth_control: boolean
    time_based_access: boolean
    device_compliance: boolean
    location_based: boolean
  }

  // Compliance & Security
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
  applicableSites: string[] // empty means all sites
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

export interface ArchitectureTemplate {
  id: string
  name: string
  description: string
  category:
    | "complete"
    | "multi-site"
    | "healthcare"
    | "education"
    | "government"
    | "manufacturing"
    | "retail"
    | "financial"
    | "technology"
  components: ArchitectureComponent[]
  connections: ArchitectureConnection[]
  policies: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ArchitectureComponent {
  id: string
  type:
    | "cloud-service"
    | "identity-provider"
    | "mdm"
    | "firewall"
    | "switch"
    | "wireless"
    | "radius"
    | "certificate-authority"
    | "device"
    | "network-segment"
  name: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  vendor?: string
  model?: string
  specifications: { [key: string]: any }
  status: "planned" | "deployed" | "configured" | "active" | "maintenance"
  connections: string[]
  policies: string[]
}

export interface ArchitectureConnection {
  id: string
  source: string
  target: string
  type: "ethernet" | "wireless" | "vpn" | "api" | "radius" | "ldap" | "saml" | "tacacs"
  protocol: string
  bandwidth?: string
  latency?: string
  encrypted: boolean
  redundant: boolean
  qos?: string
}

export interface AppData {
  sites: Site[]
  events: Event[]
  users: User[]
  globalPolicies: GlobalPolicy[]
  architectureTemplates: ArchitectureTemplate[]
  preferences: UserPreferences
  version: string
  lastUpdated: string
}

// Extended vendor and configuration data
export const REGIONS = [
  "North America",
  "South America",
  "EMEA",
  "APAC",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East",
  "Caribbean",
]

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
  "Austria",
  "Switzerland",
  "Belgium",
  "Portugal",
  "Ireland",
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
  "Vietnam",
  "Taiwan",
  "Hong Kong",
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
  "Washington DC",
]

export const PHASES = [
  "Phase 1 - Planning",
  "Phase 1 - Discovery",
  "Phase 1 - Assessment",
  "Phase 2 - Design",
  "Phase 2 - Procurement",
  "Phase 2 - Preparation",
  "Phase 3 - Implementation",
  "Phase 3 - Configuration",
  "Phase 3 - Testing",
  "Phase 4 - Deployment",
  "Phase 4 - Go-Live",
  "Phase 4 - Validation",
  "Phase 5 - Optimization",
  "Phase 5 - Training",
  "Phase 5 - Documentation",
  "Phase 6 - Support",
  "Phase 6 - Maintenance",
  "Phase 6 - Monitoring",
]

export const WIRED_VENDORS = [
  {
    id: "cisco",
    name: "Cisco Systems",
    models: [
      "Catalyst 9300",
      "Catalyst 9500",
      "Catalyst 9200",
      "Catalyst 9400",
      "Catalyst 9600",
      "Nexus 7000",
      "Nexus 9000",
      "Nexus 3000",
      "IE 3300",
      "IE 4000",
      "IE 5000",
    ],
    firmwares: ["16.12.09", "17.03.04", "17.06.03", "17.09.02"],
  },
  {
    id: "aruba",
    name: "Aruba (HPE)",
    models: [
      "CX 6300",
      "CX 6400",
      "CX 8300",
      "CX 10000",
      "CX 8320",
      "CX 8325",
      "CX 6200",
      "2930F",
      "2930M",
      "3810M",
      "5400R",
    ],
    firmwares: ["10.08.1011", "10.09.1010", "10.10.1020", "16.11.0002"],
  },
  {
    id: "juniper",
    name: "Juniper Networks",
    models: ["EX4300", "EX4600", "QFX5100", "EX9200", "EX4650", "QFX10000", "EX3400", "EX2300", "SRX300", "SRX1500"],
    firmwares: ["20.4R3", "21.2R3", "21.4R2", "22.1R1"],
  },
  {
    id: "extreme",
    name: "Extreme Networks",
    models: ["X440-G2", "X450-G2", "X620", "X770", "X465", "X590", "X690", "X870", "5320", "5420", "5520"],
    firmwares: ["32.3.2.4", "32.4.1.2", "32.5.1.1", "31.7.1.4"],
  },
  {
    id: "fortinet",
    name: "Fortinet",
    models: [
      "FortiSwitch 248D",
      "FortiSwitch 424D",
      "FortiSwitch 548D",
      "FortiSwitch 1048E",
      "FortiSwitch 3032D",
      "FortiSwitch 448D",
    ],
    firmwares: ["7.0.6", "7.2.4", "7.4.1", "8.0.0"],
  },
  {
    id: "dell",
    name: "Dell Technologies",
    models: [
      "PowerSwitch N1500",
      "PowerSwitch N3200",
      "PowerSwitch S5200",
      "PowerSwitch Z9432F",
      "PowerSwitch S4100",
      "PowerSwitch N2200",
      "PowerSwitch S3100",
    ],
    firmwares: ["10.5.2.10", "10.5.3.4", "10.5.4.2", "9.14.2.23"],
  },
  {
    id: "hpe",
    name: "HPE Networking",
    models: [
      "FlexNetwork 5130",
      "FlexNetwork 5940",
      "FlexNetwork 12500",
      "A5800",
      "A5120",
      "OfficeConnect 1920S",
      "OfficeConnect 1950",
    ],
    firmwares: ["7.1.070", "7.1.075", "5.20.105", "5.20.99"],
  },
]

export const WIRELESS_VENDORS = [
  {
    id: "cisco",
    name: "Cisco Wireless",
    controllers: ["9800-CL", "9800-40", "9800-80", "9800-L", "5520", "8540"],
    aps: [
      "Catalyst 9130AXI",
      "Catalyst 9120AXI",
      "Catalyst 9115AXI",
      "Catalyst 9164I",
      "AIR-AP4800",
      "AIR-AP3800",
      "AIR-AP2800",
      "AIR-AP1800",
    ],
    firmwares: ["17.09.04", "17.06.05", "16.12.08", "8.10.185.0"],
  },
  {
    id: "aruba",
    name: "Aruba Wireless",
    controllers: ["7030", "7205", "7210", "7240XM", "9004", "9012"],
    aps: ["AP-635", "AP-655", "AP-675", "AP-535", "AP-555", "AP-575", "AP-515", "AP-505", "AP-515"],
    firmwares: ["8.10.0.8", "8.9.0.2", "8.8.0.8", "10.3.1.1"],
  },
  {
    id: "juniper",
    name: "Juniper Mist",
    controllers: ["Cloud", "AI Engine"],
    aps: ["AP45", "AP43", "AP41", "AP33", "AP32", "AP21", "AP12", "BT11"],
    firmwares: ["0.18.28021", "0.17.27065", "0.16.26789"],
  },
  {
    id: "ruckus",
    name: "Ruckus (CommScope)",
    controllers: ["SmartZone-100", "SmartZone-300", "vSZ-H", "vSZ-E"],
    aps: ["R770", "R750", "R730", "R650", "R550", "R350", "R320", "H550", "H350"],
    firmwares: ["6.1.1.0", "6.0.1.0", "5.2.2.0"],
  },
  {
    id: "fortinet",
    name: "Fortinet Wireless",
    controllers: ["FortiGate", "FortiWLC"],
    aps: ["FAP-431F", "FAP-433F", "FAP-231F", "FAP-234F", "FAP-221E", "FAP-223E"],
    firmwares: ["7.0.6", "7.2.4", "6.4.9"],
  },
]

export const FIREWALL_VENDORS = [
  {
    id: "palo-alto",
    name: "Palo Alto Networks",
    models: ["PA-220", "PA-850", "PA-3220", "PA-5220", "PA-7080", "VM-50", "VM-100", "VM-300", "VM-500", "VM-700"],
    firmwares: ["11.0.2", "10.2.7", "10.1.11", "9.1.14"],
  },
  {
    id: "fortinet",
    name: "Fortinet FortiGate",
    models: ["FG-60F", "FG-80F", "FG-100F", "FG-200F", "FG-400F", "FG-800F", "FG-1500D", "FG-3000D", "VM02", "VM04"],
    firmwares: ["7.4.1", "7.2.5", "7.0.12", "6.4.14"],
  },
  {
    id: "cisco",
    name: "Cisco ASA/FTD",
    models: ["ASA5506-X", "ASA5516-X", "ASA5525-X", "ASA5545-X", "FTD1120", "FTD1140", "FTD2110", "FTD4112"],
    firmwares: ["9.18.3", "9.16.4", "7.2.5", "7.1.0"],
  },
  {
    id: "checkpoint",
    name: "Check Point",
    models: ["1570", "1590", "3200", "5200", "5400", "6500", "15600", "26000", "R81.20", "R81.10"],
    firmwares: ["R81.20", "R81.10", "R80.40", "R80.30"],
  },
  {
    id: "sonicwall",
    name: "SonicWall",
    models: ["TZ370", "TZ470", "TZ570", "TZ670", "NSa2700", "NSa3700", "NSa4700", "NSa5700", "NSa6700", "NSv270"],
    firmwares: ["7.0.1", "6.5.4", "6.2.9", "7.1.1"],
  },
]

export const MDM_PROVIDERS = [
  {
    id: "intune",
    name: "Microsoft Intune",
    description: "Cloud-based mobile device management",
    features: ["Device compliance", "App management", "Conditional access", "Certificate deployment"],
  },
  {
    id: "jamf",
    name: "Jamf Pro",
    description: "Apple device management platform",
    features: ["macOS management", "iOS deployment", "App store integration", "Security policies"],
  },
  {
    id: "workspace-one",
    name: "VMware Workspace ONE",
    description: "Digital workspace platform",
    features: ["Unified endpoint management", "Identity management", "App delivery", "Analytics"],
  },
  {
    id: "mobileiron",
    name: "Ivanti MobileIron",
    description: "Enterprise mobility management",
    features: ["Device security", "App wrapping", "Content management", "Threat defense"],
  },
  {
    id: "airwatch",
    name: "VMware AirWatch",
    description: "Enterprise mobility management",
    features: ["Device lifecycle", "Application catalog", "Content locker", "Email management"],
  },
  {
    id: "citrix-endpoint",
    name: "Citrix Endpoint Management",
    description: "Unified endpoint management",
    features: ["Device provisioning", "Policy enforcement", "App deployment", "Remote support"],
  },
]

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
    return sites[siteIndex]
  }

  async deleteSite(id: string): Promise<boolean> {
    const sites = await this.getSites()
    const filteredSites = sites.filter((site) => site.id !== id)

    if (filteredSites.length === sites.length) return false

    this.setData("sites", filteredSites)
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

  // Bulk operations
  async createBulkSites(count: number, template: Partial<Site>, namingConvention: string): Promise<Site[]> {
    const sites: Site[] = []

    for (let i = 1; i <= count; i++) {
      const siteName = namingConvention.replace("{n}", i.toString().padStart(2, "0"))

      const site = await this.createSite({
        ...template,
        name: siteName,
        location: template.location || `${siteName} Location`,
        region: template.region || "North America",
        country: template.country || "United States",
        siteType: template.siteType || "branch",
        status: template.status || "planning",
        priority: template.priority || "medium",
        phase: template.phase || "Phase 1 - Planning",
        users: template.users || Math.floor(Math.random() * 500) + 50,
        devices: template.devices || Math.floor(Math.random() * 1000) + 100,
        deviceBreakdown: template.deviceBreakdown || {
          windows: Math.floor(Math.random() * 100) + 20,
          mac: Math.floor(Math.random() * 50) + 10,
          linux: Math.floor(Math.random() * 20) + 5,
          ios: Math.floor(Math.random() * 80) + 15,
          android: Math.floor(Math.random() * 60) + 10,
          iot: Math.floor(Math.random() * 30) + 5,
          medical: 0,
          printers: Math.floor(Math.random() * 10) + 2,
          cameras: Math.floor(Math.random() * 15) + 3,
          voip: Math.floor(Math.random() * 25) + 5,
          kiosks: Math.floor(Math.random() * 5) + 1,
          tablets: Math.floor(Math.random() * 20) + 3,
          chromeos: Math.floor(Math.random() * 15) + 2,
          other: Math.floor(Math.random() * 10) + 2,
        },
        assignedUsers: template.assignedUsers || {
          projectManagers: [],
          technicalOwners: [],
          siteOwners: [],
          systemsEngineers: [],
          accountExecutives: [],
          technicalAccountManagers: [],
          technicians: [],
          securitySpecialists: [],
        },
        startDate: template.startDate || new Date().toISOString().split("T")[0],
        targetDate: template.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        progress: template.progress || 0,
        milestones: [],
        wiredInfrastructure: template.wiredInfrastructure || {
          vendor: "cisco",
          switchModels: ["Catalyst 9300"],
          switchCount: Math.floor(Math.random() * 20) + 5,
          portCount: Math.floor(Math.random() * 500) + 100,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 100,
          firmware: "17.09.02",
        },
        wirelessInfrastructure: template.wirelessInfrastructure || {
          vendor: "cisco",
          controllerModel: "9800-CL",
          apModels: ["Catalyst 9130AXI"],
          apCount: Math.floor(Math.random() * 30) + 10,
          wifiStandards: ["802.11ax"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: false,
          firmware: "17.09.04",
        },
        connectivity: template.connectivity || {
          type: "internet",
          bandwidth: "100Mbps",
          provider: "Local ISP",
          redundancy: false,
        },
        identityProvider: template.identityProvider || {
          type: "azure-ad",
          domain: "company.com",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: false,
        },
        mdmProvider: template.mdmProvider || {
          type: "intune",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: template.firewallInfrastructure || {
          vendor: "palo-alto",
          models: ["PA-220"],
          haConfiguration: false,
          userIdIntegration: false,
          syslogEnabled: true,
          firmware: "11.0.2",
        },
        radiusConfiguration: template.radiusConfiguration || {
          type: "cloud-radius",
          clustering: false,
          loadBalancing: false,
          certificates: true,
        },
        deviceAdministration: template.deviceAdministration || {
          type: "radius",
          privilegeLevels: [1, 15],
          commandAuthorization: false,
        },
        vlans: template.vlans || Math.floor(Math.random() * 15) + 5,
        subnets: template.subnets || [`192.168.${i}.0/24`],
        dhcpScopes: template.dhcpScopes || Math.floor(Math.random() * 8) + 3,
        dnsServers: template.dnsServers || ["8.8.8.8", "8.8.4.4"],
        globalPolicies: template.globalPolicies || [],
        sitePolicies: template.sitePolicies || [],
        policyEnforcement: template.policyEnforcement || {
          dynamic_vlan: true,
          bandwidth_control: false,
          time_based_access: false,
          device_compliance: true,
          location_based: false,
        },
        complianceRequirements: template.complianceRequirements || [],
        securityStandards: template.securityStandards || [],
        dataClassification: template.dataClassification || "internal",
        notes: template.notes || "Bulk created site",
        deploymentChecklist: [],
        riskAssessment: [],
      } as Omit<Site, "id" | "createdAt" | "updatedAt">)

      sites.push(site)
    }

    return sites
  }

  // Demo data generation
  async generateDemoData(
    scenario: "corporate" | "education" | "healthcare" | "financial" | "manufacturing" | "retail" | "technology",
  ): Promise<void> {
    console.log(`Starting demo data generation for scenario: ${scenario}`)

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

    console.log("Demo data generation completed successfully!")
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
      {
        name: "Jennifer Walsh",
        email: "jennifer.walsh@example.com",
        role: "account-executive",
        department: "Sales",
        title: "Senior Account Executive",
        phone: "555-369-1470",
        avatar: "https://i.pravatar.cc/150?img=5",
        isActive: true,
        specialties: ["Enterprise Sales", "Solution Consulting", "Customer Relations"],
        certifications: ["Salesforce Certified", "Cisco Partner Certification"],
        skills: ["Solution Selling", "Relationship Management", "Negotiation", "Presentation"],
        languages: ["English", "French"],
        timeZone: "America/New_York",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Cisco", "Microsoft", "Salesforce", "Oracle"],
        projectHistory: ["Enterprise Account Growth", "Strategic Partnership Development", "Customer Success Program"],
        performanceRating: 4,
      },
      {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "technical-account-manager",
        department: "Customer Success",
        title: "Technical Account Manager",
        phone: "555-741-2581",
        avatar: "https://i.pravatar.cc/150?img=6",
        isActive: true,
        specialties: ["Customer Support", "Technical Training", "Solution Implementation"],
        certifications: ["CompTIA Network+", "Cisco CCNA", "ITIL Foundation"],
        skills: ["Technical Support", "Training Delivery", "Customer Communication", "Problem Solving"],
        languages: ["English"],
        timeZone: "America/Chicago",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Cisco", "Aruba", "Portnox", "Microsoft"],
        projectHistory: ["Customer Onboarding Program", "Technical Training Initiative", "Support Process Improvement"],
        performanceRating: 4,
      },
      {
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        role: "technician",
        department: "Field Services",
        title: "Senior Network Technician",
        phone: "555-852-3692",
        avatar: "https://i.pravatar.cc/150?img=7",
        isActive: true,
        specialties: ["Network Installation", "Hardware Configuration", "Field Support"],
        certifications: ["CompTIA A+", "CompTIA Network+", "Cisco CCENT"],
        skills: ["Hardware Installation", "Network Configuration", "Troubleshooting", "Documentation"],
        languages: ["English", "Spanish"],
        timeZone: "America/Denver",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Cisco", "Dell", "HPE", "Lenovo"],
        projectHistory: ["Multi-Site Hardware Deployment", "Network Infrastructure Installation", "Equipment Refresh"],
        performanceRating: 4,
      },
      {
        name: "Mark Wilson",
        email: "mark.wilson@example.com",
        role: "security-specialist",
        department: "Information Security",
        title: "Senior Security Analyst",
        phone: "555-963-4703",
        avatar: "https://i.pravatar.cc/150?img=8",
        isActive: true,
        specialties: ["Network Security", "Threat Analysis", "Compliance"],
        certifications: ["CISSP", "CEH", "CISM", "SANS GIAC"],
        skills: ["Security Assessment", "Penetration Testing", "Incident Response", "Compliance Auditing"],
        languages: ["English"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "business-hours",
          vacationDays: [],
        },
        vendorRelationships: ["Palo Alto Networks", "Fortinet", "CrowdStrike", "Splunk"],
        projectHistory: ["Security Assessment Program", "Incident Response Framework", "Compliance Automation"],
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

    // Get user IDs for assignments
    const projectManager = users.find((u) => u.role === "project-manager")?.id || ""
    const technicalOwner = users.find((u) => u.role === "technical-owner")?.id || ""
    const siteOwner = users.find((u) => u.role === "site-owner")?.id || ""
    const systemsEngineer = users.find((u) => u.role === "systems-engineer")?.id || ""
    const accountExecutive = users.find((u) => u.role === "account-executive")?.id || ""
    const technicalAccountManager = users.find((u) => u.role === "technical-account-manager")?.id || ""
    const technician = users.find((u) => u.role === "technician")?.id || ""
    const securitySpecialist = users.find((u) => u.role === "security-specialist")?.id || ""

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
            cameras: 30,
            voip: 150,
            kiosks: 20,
            tablets: 100,
            chromeos: 50,
            other: 50,
          },
          startDate: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 65,
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [accountExecutive],
            technicalAccountManagers: [technicalAccountManager],
            technicians: [technician],
            securitySpecialists: [securitySpecialist],
          },
          milestones: [
            {
              id: "hq-m1",
              name: "Infrastructure Assessment Complete",
              description: "Complete network infrastructure assessment and gap analysis",
              targetDate: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              completionDate: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "completed",
              dependencies: [],
              assignedTo: technicalOwner,
            },
            {
              id: "hq-m2",
              name: "NAC Platform Deployment",
              description: "Deploy and configure Portnox NAC platform",
              targetDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "in-progress",
              dependencies: ["hq-m1"],
              assignedTo: systemsEngineer,
            },
            {
              id: "hq-m3",
              name: "User Acceptance Testing",
              description: "Complete user acceptance testing and validation",
              targetDate: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "pending",
              dependencies: ["hq-m2"],
              assignedTo: siteOwner,
            },
          ],
          wiredInfrastructure: {
            vendor: "cisco",
            switchModels: ["Catalyst 9500", "Catalyst 9300"],
            switchCount: 48,
            portCount: 2400,
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
            wifiStandards: ["802.11ax", "802.11ac"],
            bandSupport: ["2.4GHz", "5GHz", "6GHz"],
            meshSupport: false,
            firmware: "17.09.04",
          },
          connectivity: {
            type: "expressroute",
            bandwidth: "1Gbps",
            provider: "Microsoft Azure",
            redundancy: true,
            backupType: "internet",
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
            models: ["PA-5220"],
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
            privilegeLevels: [1, 5, 15],
            commandAuthorization: true,
          },
          vlans: 25,
          subnets: ["10.1.0.0/16", "10.2.0.0/16"],
          dhcpScopes: 15,
          dnsServers: ["10.1.1.10", "10.1.1.11"],
          globalPolicies: ["employee-access", "executive-vip", "byod-policy"],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: true,
            time_based_access: true,
            device_compliance: true,
            location_based: true,
          },
          complianceRequirements: ["SOX", "PCI-DSS"],
          securityStandards: ["NIST", "ISO 27001"],
          dataClassification: "confidential",
          notes:
            "Primary headquarters with executive offices and data center. Critical infrastructure requiring 24/7 monitoring and support.",
          deploymentChecklist: [
            {
              id: "hq-c1",
              category: "planning",
              task: "Site Survey and Assessment",
              description: "Complete physical and logical network assessment",
              completed: true,
              assignedTo: technicalOwner,
              dueDate: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              completionDate: new Date(baseDate.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              dependencies: [],
              estimatedHours: 40,
              actualHours: 35,
              attachments: [],
            },
            {
              id: "hq-c2",
              category: "design",
              task: "Architecture Design Review",
              description: "Review and approve technical architecture design",
              completed: true,
              assignedTo: technicalOwner,
              dueDate: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              completionDate: new Date(baseDate.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              dependencies: ["hq-c1"],
              estimatedHours: 24,
              actualHours: 28,
              attachments: [],
            },
            {
              id: "hq-c3",
              category: "implementation",
              task: "NAC Platform Installation",
              description: "Install and configure Portnox NAC platform",
              completed: false,
              assignedTo: systemsEngineer,
              dueDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              dependencies: ["hq-c2"],
              estimatedHours: 32,
              attachments: [],
            },
          ],
          riskAssessment: [
            {
              id: "hq-r1",
              description: "Executive floor network disruption during implementation",
              impact: "high",
              probability: "medium",
              mitigation: "Schedule implementation during maintenance windows and provide backup connectivity",
              owner: projectManager,
              status: "mitigated",
            },
            {
              id: "hq-r2",
              description: "Integration complexity with legacy systems",
              impact: "medium",
              probability: "high",
              mitigation: "Phased rollout approach with extensive testing",
              owner: technicalOwner,
              status: "open",
            },
          ],
        },
        {
          name: "Chicago Regional Office",
          location: "Chicago, IL",
          region: "North America",
          country: "United States",
          state: "Illinois",
          city: "Chicago",
          siteType: "branch",
          status: "design",
          priority: "high",
          phase: "Phase 2 - Design",
          users: 450,
          devices: 800,
          deviceBreakdown: {
            windows: 320,
            mac: 80,
            linux: 20,
            ios: 150,
            android: 100,
            iot: 50,
            medical: 0,
            printers: 15,
            cameras: 10,
            voip: 35,
            kiosks: 5,
            tablets: 20,
            chromeos: 10,
            other: 15,
          },
          startDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 25,
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [accountExecutive],
            technicalAccountManagers: [technicalAccountManager],
            technicians: [technician],
            securitySpecialists: [securitySpecialist],
          },
          milestones: [
            {
              id: "chi-m1",
              name: "Site Assessment",
              description: "Complete site assessment and requirements gathering",
              targetDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "pending",
              dependencies: [],
              assignedTo: technicalOwner,
            },
            {
              id: "chi-m2",
              name: "Design Approval",
              description: "Complete technical design and obtain stakeholder approval",
              targetDate: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "pending",
              dependencies: ["chi-m1"],
              assignedTo: technicalOwner,
            },
          ],
          wiredInfrastructure: {
            vendor: "aruba",
            switchModels: ["CX 6300", "CX 6200"],
            switchCount: 12,
            portCount: 576,
            stackingSupport: true,
            poeSupport: true,
            mgmtVlan: 100,
            firmware: "10.09.1010",
          },
          wirelessInfrastructure: {
            vendor: "aruba",
            controllerModel: "7030",
            apModels: ["AP-635", "AP-555"],
            apCount: 32,
            wifiStandards: ["802.11ax", "802.11ac"],
            bandSupport: ["2.4GHz", "5GHz"],
            meshSupport: false,
            firmware: "8.10.0.8",
          },
          connectivity: {
            type: "sdwan",
            bandwidth: "500Mbps",
            provider: "Verizon",
            redundancy: true,
            backupType: "4G LTE",
          },
          identityProvider: {
            type: "azure-ad",
            domain: "globaltech.com",
            syncEnabled: true,
            mfaEnabled: true,
            conditionalAccess: false,
          },
          mdmProvider: {
            type: "intune",
            enrollmentType: "automatic",
            complianceEnabled: true,
            appManagement: true,
          },
          firewallInfrastructure: {
            vendor: "fortinet",
            models: ["FortiGate 200F"],
            haConfiguration: false,
            userIdIntegration: true,
            syslogEnabled: true,
            firmware: "7.4.1",
          },
          radiusConfiguration: {
            type: "cloud-radius",
            clustering: false,
            loadBalancing: false,
            certificates: true,
          },
          deviceAdministration: {
            type: "radius",
            privilegeLevels: [1, 15],
            commandAuthorization: false,
          },
          vlans: 12,
          subnets: ["10.10.0.0/16"],
          dhcpScopes: 8,
          dnsServers: ["10.10.1.10", "10.10.1.11"],
          globalPolicies: ["employee-access", "byod-policy"],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: false,
            time_based_access: false,
            device_compliance: true,
            location_based: false,
          },
          complianceRequirements: ["SOX"],
          securityStandards: ["NIST"],
          dataClassification: "internal",
          notes: "Regional branch office with sales and support teams. Standard deployment with moderate complexity.",
          deploymentChecklist: [],
          riskAssessment: [],
        },
        {
          name: "West Coast Branch",
          location: "San Francisco, CA",
          region: "North America",
          country: "United States",
          state: "California",
          city: "San Francisco",
          siteType: "branch",
          status: "planning",
          priority: "medium",
          phase: "Phase 1 - Planning",
          users: 280,
          devices: 520,
          deviceBreakdown: {
            windows: 200,
            mac: 120,
            linux: 15,
            ios: 90,
            android: 60,
            iot: 20,
            medical: 0,
            printers: 8,
            cameras: 5,
            voip: 20,
            kiosks: 2,
            tablets: 15,
            chromeos: 8,
            other: 7,
          },
          startDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 10,
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [accountExecutive],
            technicalAccountManagers: [technicalAccountManager],
            technicians: [technician],
            securitySpecialists: [securitySpecialist],
          },
          milestones: [],
          wiredInfrastructure: {
            vendor: "cisco",
            switchModels: ["Catalyst 9300"],
            switchCount: 8,
            portCount: 384,
            stackingSupport: true,
            poeSupport: true,
            mgmtVlan: 100,
            firmware: "17.09.02",
          },
          wirelessInfrastructure: {
            vendor: "cisco",
            controllerModel: "9800-CL",
            apModels: ["Catalyst 9130AXI"],
            apCount: 20,
            wifiStandards: ["802.11ax"],
            bandSupport: ["2.4GHz", "5GHz"],
            meshSupport: false,
            firmware: "17.09.04",
          },
          connectivity: {
            type: "internet",
            bandwidth: "200Mbps",
            provider: "Comcast Business",
            redundancy: false,
          },
          identityProvider: {
            type: "azure-ad",
            domain: "globaltech.com",
            syncEnabled: true,
            mfaEnabled: true,
            conditionalAccess: false,
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
            userIdIntegration: false,
            syslogEnabled: true,
            firmware: "11.0.2",
          },
          radiusConfiguration: {
            type: "cloud-radius",
            clustering: false,
            loadBalancing: false,
            certificates: true,
          },
          deviceAdministration: {
            type: "radius",
            privilegeLevels: [1, 15],
            commandAuthorization: false,
          },
          vlans: 8,
          subnets: ["10.20.0.0/16"],
          dhcpScopes: 5,
          dnsServers: ["10.20.1.10", "10.20.1.11"],
          globalPolicies: ["employee-access", "byod-policy"],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: false,
            time_based_access: false,
            device_compliance: true,
            location_based: false,
          },
          complianceRequirements: ["SOX"],
          securityStandards: ["NIST"],
          dataClassification: "internal",
          notes: "West coast branch office with development and sales teams.",
          deploymentChecklist: [],
          riskAssessment: [],
        },
      ],
      healthcare: [
        {
          name: "Metropolitan Medical Center",
          location: "Boston, MA",
          region: "North America",
          country: "United States",
          state: "Massachusetts",
          city: "Boston",
          siteType: "headquarters",
          status: "testing",
          priority: "critical",
          phase: "Phase 4 - Testing",
          users: 1200,
          devices: 3500,
          deviceBreakdown: {
            windows: 800,
            mac: 150,
            linux: 50,
            ios: 400,
            android: 200,
            iot: 150,
            medical: 600,
            printers: 80,
            cameras: 40,
            voip: 120,
            kiosks: 30,
            tablets: 200,
            chromeos: 20,
            other: 50,
          },
          startDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 85,
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [accountExecutive],
            technicalAccountManagers: [technicalAccountManager],
            technicians: [technician],
            securitySpecialists: [securitySpecialist],
          },
          milestones: [
            {
              id: "med-m1",
              name: "Medical Device Integration",
              description: "Complete integration with critical medical devices",
              targetDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "in-progress",
              dependencies: [],
              assignedTo: technicalOwner,
            },
            {
              id: "med-m2",
              name: "HIPAA Compliance Validation",
              description: "Complete HIPAA compliance testing and validation",
              targetDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "pending",
              dependencies: ["med-m1"],
              assignedTo: securitySpecialist,
            },
          ],
          wiredInfrastructure: {
            vendor: "cisco",
            switchModels: ["Catalyst 9400", "Catalyst 9300"],
            switchCount: 36,
            portCount: 1728,
            stackingSupport: true,
            poeSupport: true,
            mgmtVlan: 100,
            firmware: "17.09.02",
          },
          wirelessInfrastructure: {
            vendor: "cisco",
            controllerModel: "9800-40",
            apModels: ["MR36H", "Catalyst 9130AXI"],
            apCount: 85,
            wifiStandards: ["802.11ax", "802.11ac"],
            bandSupport: ["2.4GHz", "5GHz"],
            meshSupport: true,
            firmware: "17.09.04",
          },
          connectivity: {
            type: "expressroute",
            bandwidth: "2Gbps",
            provider: "Microsoft Azure",
            redundancy: true,
            backupType: "mpls",
          },
          identityProvider: {
            type: "azure-ad",
            domain: "metrohealth.org",
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
            models: ["PA-3220"],
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
            privilegeLevels: [1, 5, 15],
            commandAuthorization: true,
          },
          vlans: 35,
          subnets: ["10.20.0.0/16", "10.21.0.0/16", "10.22.0.0/16"],
          dhcpScopes: 25,
          dnsServers: ["10.20.1.10", "10.20.1.11"],
          globalPolicies: ["healthcare-staff", "medical-device", "hipaa-compliance"],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: true,
            time_based_access: true,
            device_compliance: true,
            location_based: true,
          },
          complianceRequirements: ["HIPAA", "HITECH"],
          securityStandards: ["NIST", "ISO 27001"],
          dataClassification: "restricted",
          notes:
            "Primary hospital facility with critical care units and medical devices requiring zero-latency access.",
          deploymentChecklist: [],
          riskAssessment: [],
        },
        {
          name: "Outpatient Clinic Network",
          location: "Cambridge, MA",
          region: "North America",
          country: "United States",
          state: "Massachusetts",
          city: "Cambridge",
          siteType: "branch",
          status: "design",
          priority: "high",
          phase: "Phase 2 - Design",
          users: 180,
          devices: 420,
          deviceBreakdown: {
            windows: 120,
            mac: 30,
            linux: 10,
            ios: 80,
            android: 50,
            iot: 30,
            medical: 80,
            printers: 12,
            cameras: 8,
            voip: 20,
            kiosks: 5,
            tablets: 40,
            chromeos: 5,
            other: 10,
          },
          startDate: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          targetDate: new Date(baseDate.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          progress: 30,
          assignedUsers: {
            projectManagers: [projectManager],
            technicalOwners: [technicalOwner],
            siteOwners: [siteOwner],
            systemsEngineers: [systemsEngineer],
            accountExecutives: [accountExecutive],
            technicalAccountManagers: [technicalAccountManager],
            technicians: [technician],
            securitySpecialists: [securitySpecialist],
          },
          milestones: [],
          wiredInfrastructure: {
            vendor: "aruba",
            switchModels: ["CX 6300"],
            switchCount: 6,
            portCount: 288,
            stackingSupport: true,
            poeSupport: true,
            mgmtVlan: 100,
            firmware: "10.09.1010",
          },
          wirelessInfrastructure: {
            vendor: "aruba",
            controllerModel: "7030",
            apModels: ["AP-635"],
            apCount: 15,
            wifiStandards: ["802.11ax"],
            bandSupport: ["2.4GHz", "5GHz"],
            meshSupport: false,
            firmware: "8.10.0.8",
          },
          connectivity: {
            type: "vpn",
            bandwidth: "100Mbps",
            provider: "Verizon",
            redundancy: false,
          },
          identityProvider: {
            type: "azure-ad",
            domain: "metrohealth.org",
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
            vendor: "fortinet",
            models: ["FortiGate 100F"],
            haConfiguration: false,
            userIdIntegration: true,
            syslogEnabled: true,
            firmware: "7.4.1",
          },
          radiusConfiguration: {
            type: "cloud-radius",
            clustering: false,
            loadBalancing: false,
            certificates: true,
          },
          deviceAdministration: {
            type: "radius",
            privilegeLevels: [1, 15],
            commandAuthorization: false,
          },
          vlans: 15,
          subnets: ["10.30.0.0/16"],
          dhcpScopes: 10,
          dnsServers: ["10.30.1.10", "10.30.1.11"],
          globalPolicies: ["healthcare-staff", "medical-device"],
          sitePolicies: [],
          policyEnforcement: {
            dynamic_vlan: true,
            bandwidth_control: false,
            time_based_access: true,
            device_compliance: true,
            location_based: true,
          },
          complianceRequirements: ["HIPAA"],
          securityStandards: ["NIST"],
          dataClassification: "restricted",
          notes: "Outpatient clinic with medical devices and patient data systems.",
          deploymentChecklist: [],
          riskAssessment: [],
        },
      ],
      // Add more scenarios...
    }

    return templates[scenario] || templates.corporate
  }

  private async generateDemoEvents(scenario: string, sites: Site[], users: User[]): Promise<Event[]> {
    const currentDate = new Date()
    const events: Omit<Event, "id" | "createdAt" | "updatedAt">[] = []

    // Get user names for assignments
    const projectManager = users.find((u) => u.role === "project-manager")?.name || "Alex Rivera"
    const technicalOwner = users.find((u) => u.role === "technical-owner")?.name || "Sarah Chen"
    const siteOwner = users.find((u) => u.role === "site-owner")?.name || "Michael Thompson"
    const systemsEngineer = users.find((u) => u.role === "systems-engineer")?.name || "David Kim"

    // Project kickoff (past event)
    const kickoffDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    events.push({
      title: "NAC Deployment Project Kickoff",
      description:
        "Initial project planning, stakeholder alignment, and resource allocation for zero trust NAC implementation",
      startDate: kickoffDate.toISOString(),
      endDate: new Date(kickoffDate.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      type: "kickoff",
      priority: "critical",
      assignedTo: projectManager,
      status: "completed",
      attendees: [projectManager, technicalOwner, siteOwner, systemsEngineer],
      location: "Conference Room A / Microsoft Teams",
      meetingType: "hybrid",
      prerequisites: ["Project charter approval", "Budget allocation"],
      deliverables: ["Project plan", "Resource allocation", "Timeline approval"],
    })

    // Design phase events
    const designStart = new Date(currentDate.getTime() - 25 * 24 * 60 * 60 * 1000)
    events.push({
      title: "Architecture Design Workshop",
      description:
        "Detailed architecture design session covering network topology, security zones, and integration points",
      startDate: designStart.toISOString(),
      endDate: new Date(designStart.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      type: "design",
      priority: "high",
      assignedTo: technicalOwner,
      status: "completed",
      attendees: [technicalOwner, siteOwner, systemsEngineer],
      location: "Engineering Lab",
      meetingType: "in-person",
      prerequisites: ["Network assessment", "Security requirements"],
      deliverables: ["Architecture diagrams", "Integration specifications"],
    })

    // Generate events for each site
    sites.forEach((site, index) => {
      const siteStartDate = new Date(currentDate.getTime() + (index * 7 + 5) * 24 * 60 * 60 * 1000)

      // Site assessment
      events.push({
        title: `Site Assessment - ${site.name}`,
        description: `On-site network assessment and infrastructure evaluation for ${site.name}`,
        startDate: siteStartDate.toISOString(),
        endDate: new Date(siteStartDate.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        type: "deployment",
        priority: site.priority as Event["priority"],
        assignedTo: siteOwner,
        siteId: site.id,
        status: index < 2 ? "completed" : index < 4 ? "in-progress" : "scheduled",
        attendees: [siteOwner, "Site IT Team"],
        location: site.location,
        meetingType: "in-person",
        prerequisites: ["Site access approval", "Network documentation"],
        deliverables: ["Assessment report", "Implementation plan"],
      })

      // Implementation
      const implDate = new Date(siteStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      events.push({
        title: `NAC Implementation - ${site.name}`,
        description: `Portnox NAC deployment and configuration for ${site.name}`,
        startDate: implDate.toISOString(),
        endDate: new Date(implDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: "deployment",
        priority: site.priority as Event["priority"],
        assignedTo: systemsEngineer,
        siteId: site.id,
        status: index < 1 ? "completed" : index < 3 ? "in-progress" : "scheduled",
        attendees: [systemsEngineer, technicalOwner, "Site Network Team"],
        location: site.location,
        meetingType: "in-person",
        prerequisites: ["Infrastructure ready", "Certificates deployed"],
        deliverables: ["NAC configuration", "Policy implementation"],
      })

      // Testing
      const testDate = new Date(implDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      events.push({
        title: `Testing & Validation - ${site.name}`,
        description: `Comprehensive testing of NAC implementation and user acceptance testing`,
        startDate: testDate.toISOString(),
        endDate: new Date(testDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: "testing",
        priority: site.priority as Event["priority"],
        assignedTo: siteOwner,
        siteId: site.id,
        status: index < 1 ? "completed" : index < 2 ? "in-progress" : "scheduled",
        attendees: [siteOwner, "End Users", "IT Support"],
        location: site.location,
        meetingType: "in-person",
        prerequisites: ["Implementation complete", "Test scenarios"],
        deliverables: ["Test results", "User feedback", "Go-live approval"],
      })

      // Go-live
      const goLiveDate = new Date(testDate.getTime() + 2 * 24 * 60 * 60 * 1000)
      events.push({
        title: `Go-Live - ${site.name}`,
        description: `Production cutover and go-live support for ${site.name}`,
        startDate: goLiveDate.toISOString(),
        endDate: new Date(goLiveDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        type: "go-live",
        priority: site.priority as Event["priority"],
        assignedTo: projectManager,
        siteId: site.id,
        status: index < 1 ? "completed" : "scheduled",
        attendees: [projectManager, technicalOwner, siteOwner, "Site Team"],
        location: site.location,
        meetingType: "in-person",
        prerequisites: ["Testing complete", "Change approval"],
        deliverables: ["Production system", "Support handover"],
      })
    })

    // Training events
    const trainingDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
    events.push({
      title: "Administrator Training Session",
      description: "Comprehensive training for IT administrators on Portnox NAC management and troubleshooting",
      startDate: trainingDate.toISOString(),
      endDate: new Date(trainingDate.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      type: "training",
      priority: "medium",
      assignedTo: technicalOwner,
      status: "scheduled",
      attendees: ["IT Administrators", "Network Team", "Security Team"],
      location: "Training Center / Virtual",
      meetingType: "hybrid",
      prerequisites: ["Training materials", "Lab environment"],
      deliverables: ["Training completion certificates", "Documentation"],
    })

    // Create all events
    const createdEvents: Event[] = []
    for (const eventData of events) {
      const event = await this.createEvent(eventData)
      createdEvents.push(event)
    }

    return createdEvents
  }

  private async generateDemoPolicies(scenario: string): Promise<GlobalPolicy[]> {
    const policies: Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "Employee Access Policy",
        description: "Standard access policy for authenticated employees with valid certificates",
        category: "authentication",
        type: "access",
        priority: 1,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "employee",
            description: "Applies to all authenticated employees",
          },
          {
            type: "certificate",
            operator: "equals",
            value: "valid",
            description: "Requires valid certificate authentication",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: {
              access_type: "full",
              vlan: "corporate",
            },
            description: "Grants full access to corporate network resources",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["access", "employee", "certificate"],
        version: "1.0",
        approvedBy: "Alex Rivera",
        schedule: {
          type: "always",
          timeZone: "UTC",
        },
      },
      {
        name: "Executive VIP Policy",
        description: "Enhanced access policy for executive users with priority network access",
        category: "authorization",
        type: "access",
        priority: 0,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "executive",
            description: "Applies to executive users",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: {
              access_type: "priority",
              vlan: "executive",
              qos: "high",
            },
            description: "Grants priority access with high QoS",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["access", "executive", "priority"],
        version: "1.0",
        approvedBy: "Alex Rivera",
        schedule: {
          type: "always",
          timeZone: "UTC",
        },
      },
      {
        name: "BYOD Policy",
        description: "Bring Your Own Device policy with limited network access and compliance requirements",
        category: "authentication",
        type: "access",
        priority: 3,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["mobile", "tablet", "personal"],
            description: "Applies to personal mobile devices",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: {
              access_type: "limited",
              vlan: "byod",
            },
            description: "Grants limited access to BYOD network segment",
            priority: 1,
          },
          {
            type: "bandwidth_limit",
            parameters: {
              limit: "10Mbps",
            },
            description: "Limits bandwidth to 10Mbps",
            priority: 2,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["access", "byod", "mobile"],
        version: "1.0",
        approvedBy: "Alex Rivera",
        schedule: {
          type: "business_hours",
          timeZone: "UTC",
          businessHours: {
            start: "08:00",
            end: "18:00",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
        },
      },
      {
        name: "Guest Access Policy",
        description: "Temporary internet-only access for guest users with time restrictions",
        category: "guest_access",
        type: "access",
        priority: 4,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "guest",
            description: "Applies to guest users",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: {
              access_type: "internet_only",
              vlan: "guest",
            },
            description: "Grants internet-only access",
            priority: 1,
          },
          {
            type: "time_restrict",
            parameters: {
              duration: "8hours",
            },
            description: "Limits session to 8 hours",
            priority: 2,
          },
          {
            type: "bandwidth_limit",
            parameters: {
              limit: "5Mbps",
            },
            description: "Limits bandwidth to 5Mbps",
            priority: 3,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["access", "guest", "temporary"],
        version: "1.0",
        approvedBy: "Alex Rivera",
        schedule: {
          type: "always",
          timeZone: "UTC",
        },
      },
      {
        name: "IoT Device Policy",
        description: "Segmented network access for IoT devices with monitoring and restrictions",
        category: "security",
        type: "access",
        priority: 2,
        conditions: [
          {
            type: "device_type",
            operator: "equals",
            value: "iot",
            description: "Applies to IoT devices",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: {
              access_type: "segmented",
              vlan: "iot",
            },
            description: "Places IoT devices in isolated network segment",
            priority: 1,
          },
          {
            type: "log_only",
            parameters: {
              level: "detailed",
            },
            description: "Enables detailed logging for security monitoring",
            priority: 2,
          },
        ],
        enabled: true,
        applicableSites: [],
        tags: ["access", "iot", "segmentation"],
        version: "1.0",
        approvedBy: "Mark Wilson",
        schedule: {
          type: "always",
          timeZone: "UTC",
        },
      },
    ]

    const createdPolicies: GlobalPolicy[] = []
    for (const policyData of policies) {
      const policy = await this.createGlobalPolicy(policyData)
      createdPolicies.push(policy)
    }

    return createdPolicies
  }

  private getCompanyNameForScenario(scenario: string): string {
    const companyNames: { [key: string]: string } = {
      corporate: "GlobalTech Solutions",
      healthcare: "MetroHealth Systems",
      education: "Riverside University",
      financial: "SecureBank Financial Group",
      manufacturing: "Advanced Manufacturing Corp",
      retail: "Premium Retail Chain",
      technology: "InnovateTech Solutions",
    }

    return companyNames[scenario] || "TechCorp Global"
  }

  private async clearAllData(): Promise<void> {
    if (typeof window === "undefined") return

    try {
      // Clear all portnox-nac related data
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith("portnox-nac-")) {
          localStorage.removeItem(key)
        }
      })
      console.log("Cleared all existing data")
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }

  // Export data
  async exportData(): Promise<string> {
    const data: AppData = {
      sites: await this.getSites(),
      events: await this.getEvents(),
      users: await this.getUsers(),
      globalPolicies: await this.getGlobalPolicies(),
      architectureTemplates: [],
      preferences: await this.getUserPreferences(),
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
    }

    return JSON.stringify(data, null, 2)
  }
}

export const storage = new Storage()
export default storage
