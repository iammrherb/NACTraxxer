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
    firmwares: ["17.09.04", "17.06.05", "16.12.08", "17.03.06"],
  },
  {
    id: "aruba",
    name: "Aruba Wireless",
    controllers: ["7030", "7205", "7210", "7240XM", "9012", "MM", "Instant"],
    aps: ["AP-515", "AP-535", "AP-555", "AP-575", "AP-635", "AP-655", "AP-505", "AP-315", "AP-325", "AP-387"],
    firmwares: ["8.10.0.5", "8.8.0.8", "10.3.1.1", "10.4.0.3"],
  },
  {
    id: "juniper-mist",
    name: "Juniper Mist",
    controllers: ["Cloud", "Virtual"],
    aps: ["AP43", "AP45", "AP63", "AP33", "AP21", "AP61", "AP12", "AP32", "BT11"],
    firmwares: ["0.14.28011", "0.15.29876", "0.16.31245", "0.17.32145"],
  },
  {
    id: "extreme",
    name: "Extreme Wireless",
    controllers: ["ExtremeWireless", "WiNG 7", "Cloud IQ"],
    aps: ["AP410C", "AP460C", "AP560H", "AP305C", "AP302W", "AP650X", "AP310e"],
    firmwares: ["10.61.02.0011", "10.71.00.0023", "10.81.01.0008"],
  },
  {
    id: "ruckus",
    name: "Ruckus (CommScope)",
    controllers: ["SmartZone 100", "SmartZone 300", "SmartZone 144", "Virtual SmartZone"],
    aps: ["R350", "R550", "R750", "R650", "R150", "R320", "T350c", "T350d"],
    firmwares: ["104.0.0.0.408", "104.1.0.0.213", "105.0.0.0.123"],
  },
  {
    id: "meraki",
    name: "Cisco Meraki",
    controllers: ["Cloud Dashboard"],
    aps: ["MR36", "MR46", "MR56", "MR84", "MR86", "MR44", "MR33", "MR20", "MR18"],
    firmwares: ["28.7", "29.4", "29.6.1", "30.5"],
  },
  {
    id: "ubiquiti",
    name: "Ubiquiti Networks",
    controllers: ["UniFi Controller", "UniFi Cloud Key", "UDM Pro"],
    aps: ["U6 Enterprise", "U6 Pro", "U6 Lite", "U6 LR", "nanoHD", "AC Pro", "AC Lite"],
    firmwares: ["6.5.55", "7.2.92", "7.3.83", "7.4.162"],
  },
]

export const FIREWALL_VENDORS = [
  {
    id: "palo-alto",
    name: "Palo Alto Networks",
    models: [
      "PA-220",
      "PA-850",
      "PA-3250",
      "PA-5250",
      "PA-7080",
      "PA-5260",
      "PA-3260",
      "VM-50",
      "VM-100",
      "VM-300",
      "VM-500",
      "VM-700",
      "VM-1000",
    ],
    firmwares: ["10.2.7", "11.0.2", "11.1.0", "10.1.11"],
  },
  {
    id: "fortinet",
    name: "Fortinet",
    models: [
      "FortiGate 60F",
      "FortiGate 100F",
      "FortiGate 600F",
      "FortiGate 1800F",
      "FortiGate 3000D",
      "FortiGate 4200F",
      "FortiGate 7040E",
      "FortiGate VM",
    ],
    firmwares: ["7.0.12", "7.2.5", "7.4.1", "6.4.14"],
  },
  {
    id: "cisco",
    name: "Cisco Security",
    models: [
      "ASA 5506-X",
      "ASA 5516-X",
      "Firepower 2100",
      "Firepower 4100",
      "Firepower 9300",
      "ASA 5525-X",
      "ASA 5555-X",
      "ISR 4000",
    ],
    firmwares: ["9.19(1)", "9.16(4)", "7.2.5", "7.3.1"],
  },
  {
    id: "checkpoint",
    name: "Check Point",
    models: ["1490", "3200", "5200", "15600", "26000", "28600", "Quantum Spark", "CloudGuard", "Maestro"],
    firmwares: ["R81.20", "R82.30", "R80.40", "R81.10"],
  },
  {
    id: "sophos",
    name: "Sophos",
    models: ["XG 106", "XG 136", "XG 310", "XG 450", "XG 550", "XG 650", "XG 750", "SG UTM", "Cyberoam"],
    firmwares: ["19.0.2", "19.5.1", "20.0.0", "18.5.4"],
  },
  {
    id: "sonicwall",
    name: "SonicWall",
    models: ["TZ370", "TZ470", "TZ570", "TZ670", "NSa 2700", "NSa 3700", "NSa 4700", "NSa 6700", "NSv Virtual"],
    firmwares: ["7.0.1-5112", "7.1.1-7040", "6.5.4.4-44v-21"],
  },
]

export const MDM_PROVIDERS = [
  {
    id: "intune",
    name: "Microsoft Intune",
    description: "Microsoft device management and security",
    features: ["Windows", "iOS", "Android", "macOS", "Conditional Access", "App Protection"],
  },
  {
    id: "jamf",
    name: "Jamf Pro",
    description: "Apple device management platform",
    features: ["macOS", "iOS", "iPadOS", "tvOS", "DEP", "VPP", "Self Service"],
  },
  {
    id: "vmware-workspace-one",
    name: "VMware Workspace ONE",
    description: "Unified endpoint management platform",
    features: ["Windows", "iOS", "Android", "macOS", "Chrome OS", "IoT", "VDI"],
  },
  {
    id: "mobileiron",
    name: "Ivanti MobileIron",
    description: "Enterprise mobility management",
    features: ["iOS", "Android", "Windows", "macOS", "EMM", "UEM", "Zero Sign-On"],
  },
  {
    id: "cisco-meraki",
    name: "Cisco Meraki MDM",
    description: "Cloud-based device management",
    features: ["iOS", "Android", "Chrome OS", "Cloud Management", "SM"],
  },
  {
    id: "citrix",
    name: "Citrix Endpoint Management",
    description: "Mobile and desktop management",
    features: ["iOS", "Android", "Windows", "macOS", "XenMobile", "MAM"],
  },
  {
    id: "google",
    name: "Google Workspace",
    description: "Google device management",
    features: ["Android", "Chrome OS", "iOS", "G Suite", "Chrome Browser"],
  },
  {
    id: "blackberry",
    name: "BlackBerry UEM",
    description: "Unified endpoint management",
    features: ["BlackBerry", "iOS", "Android", "Windows", "macOS", "AtHoc"],
  },
]

export const COMPLIANCE_FRAMEWORKS = [
  "SOX (Sarbanes-Oxley)",
  "PCI-DSS",
  "HIPAA",
  "GDPR",
  "CCPA",
  "SOC 2 Type II",
  "ISO 27001",
  "ISO 27002",
  "NIST Cybersecurity Framework",
  "NIST 800-53",
  "CIS Controls",
  "COBIT",
  "FISMA",
  "FedRAMP",
  "CMMC",
  "PCI-PA-DSS",
  "FFIEC",
  "GLBA",
  "FERPA",
  "CJIS",
  "IEC 62443",
  "FDA 21 CFR Part 11",
]

export const SECURITY_STANDARDS = [
  "Zero Trust Architecture",
  "NIST Cybersecurity Framework",
  "ISO 27001/27002",
  "CIS Critical Security Controls",
  "OWASP Top 10",
  "SANS Top 25",
  "MITRE ATT&CK Framework",
  "CSF (Cybersecurity Framework)",
  "COBIT 2019",
  "Risk Management Framework (RMF)",
  "Cyber Kill Chain",
  "Diamond Model",
  "STRIDE Threat Model",
  "PASTA Threat Modeling",
  "OCTAVE Risk Assessment",
]

class StorageManager {
  private readonly STORAGE_KEY = "portnox-nac-designer"
  private readonly VERSION = "4.0.0"

  private getDefaultData(): AppData {
    return {
      sites: [],
      events: [],
      users: [],
      globalPolicies: [],
      architectureTemplates: [],
      preferences: {
        theme: "system",
        companyName: "TechCorp Global",
        defaultView: "architecture",
        notifications: true,
        autoSave: true,
        demoScenario: "corporate",
        language: "en",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        currency: "USD",
        dashboardLayout: ["architecture", "sites", "progress", "workbook", "timeline"],
      },
      version: this.VERSION,
      lastUpdated: new Date().toISOString(),
    }
  }

  private getData(): AppData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        const defaultData = this.getDefaultData()
        this.saveData(defaultData)
        return defaultData
      }

      const data = JSON.parse(stored) as AppData

      // Version migration if needed
      if (data.version !== this.VERSION) {
        const migratedData = this.migrateData(data)
        this.saveData(migratedData)
        return migratedData
      }

      return data
    } catch (error) {
      console.error("Error loading data from storage:", error)
      return this.getDefaultData()
    }
  }

  private saveData(data: AppData): void {
    try {
      data.lastUpdated = new Date().toISOString()
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving data to storage:", error)
      throw new Error("Failed to save data")
    }
  }

  private migrateData(data: AppData): AppData {
    // Handle version migrations here
    return {
      ...data,
      globalPolicies: data.globalPolicies || [],
      architectureTemplates: data.architectureTemplates || [],
      version: this.VERSION,
    }
  }

  // Site Management
  async getSites(): Promise<Site[]> {
    return this.getData().sites
  }

  async getSite(id: string): Promise<Site | null> {
    const sites = await this.getSites()
    return sites.find((site) => site.id === id) || null
  }

  async createSite(siteData: Omit<Site, "id" | "createdAt" | "updatedAt">): Promise<Site> {
    const data = this.getData()
    const newSite: Site = {
      ...siteData,
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.sites.push(newSite)
    this.saveData(data)
    return newSite
  }

  async createBulkSites(count: number, template: Partial<Site>, namingConvention: string): Promise<Site[]> {
    const data = this.getData()
    const newSites: Site[] = []

    for (let i = 1; i <= count; i++) {
      const siteName = namingConvention.replace("{n}", i.toString().padStart(2, "0"))

      const newSite: Site = {
        ...template,
        id: `site-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        name: siteName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Site

      newSites.push(newSite)
      data.sites.push(newSite)
    }

    this.saveData(data)
    return newSites
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
    const data = this.getData()
    const siteIndex = data.sites.findIndex((site) => site.id === id)

    if (siteIndex === -1) return null

    data.sites[siteIndex] = {
      ...data.sites[siteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveData(data)
    return data.sites[siteIndex]
  }

  async deleteSite(id: string): Promise<boolean> {
    const data = this.getData()
    const initialLength = data.sites.length
    data.sites = data.sites.filter((site) => site.id !== id)

    if (data.sites.length < initialLength) {
      this.saveData(data)
      return true
    }
    return false
  }

  // Global Policy Management
  async getGlobalPolicies(): Promise<GlobalPolicy[]> {
    return this.getData().globalPolicies
  }

  async createGlobalPolicy(policyData: Omit<GlobalPolicy, "id" | "createdAt" | "updatedAt">): Promise<GlobalPolicy> {
    const data = this.getData()
    const newPolicy: GlobalPolicy = {
      ...policyData,
      id: `global-policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.globalPolicies.push(newPolicy)
    this.saveData(data)
    return newPolicy
  }

  async updateGlobalPolicy(id: string, updates: Partial<GlobalPolicy>): Promise<GlobalPolicy | null> {
    const data = this.getData()
    const policyIndex = data.globalPolicies.findIndex((policy) => policy.id === id)

    if (policyIndex === -1) return null

    data.globalPolicies[policyIndex] = {
      ...data.globalPolicies[policyIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveData(data)
    return data.globalPolicies[policyIndex]
  }

  async deleteGlobalPolicy(id: string): Promise<boolean> {
    const data = this.getData()
    const initialLength = data.globalPolicies.length
    data.globalPolicies = data.globalPolicies.filter((policy) => policy.id !== id)

    if (data.globalPolicies.length < initialLength) {
      this.saveData(data)
      return true
    }
    return false
  }

  // Event Management
  async getEvents(): Promise<Event[]> {
    return this.getData().events
  }

  async createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const data = this.getData()
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.events.push(newEvent)
    this.saveData(data)
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const data = this.getData()
    const eventIndex = data.events.findIndex((event) => event.id === id)

    if (eventIndex === -1) return null

    data.events[eventIndex] = {
      ...data.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveData(data)
    return data.events[eventIndex]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const data = this.getData()
    const initialLength = data.events.length
    data.events = data.events.filter((event) => event.id !== id)

    if (data.events.length < initialLength) {
      this.saveData(data)
      return true
    }
    return false
  }

  // User Management
  async getUsers(): Promise<User[]> {
    return this.getData().users
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const data = this.getData()
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.users.push(newUser)
    this.saveData(data)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const data = this.getData()
    const userIndex = data.users.findIndex((user) => user.id === id)

    if (userIndex === -1) return null

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveData(data)
    return data.users[userIndex]
  }

  async deleteUser(id: string): Promise<boolean> {
    const data = this.getData()
    const initialLength = data.users.length
    data.users = data.users.filter((user) => user.id !== id)

    if (data.users.length < initialLength) {
      this.saveData(data)
      return true
    }
    return false
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    return this.getData().preferences
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const data = this.getData()
    data.preferences = {
      ...data.preferences,
      ...updates,
    }

    this.saveData(data)
    return data.preferences
  }

  // Architecture Templates
  async getArchitectureTemplates(): Promise<ArchitectureTemplate[]> {
    return this.getData().architectureTemplates
  }

  async createArchitectureTemplate(
    templateData: Omit<ArchitectureTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<ArchitectureTemplate> {
    const data = this.getData()
    const newTemplate: ArchitectureTemplate = {
      ...templateData,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.architectureTemplates.push(newTemplate)
    this.saveData(data)
    return newTemplate
  }

  // Enhanced Demo Data Generation with Multiple Scenarios
  async generateDemoData(
    scenario:
      | "corporate"
      | "education"
      | "healthcare"
      | "government"
      | "manufacturing"
      | "retail"
      | "technology"
      | "financial",
  ): Promise<void> {
    const data = this.getDefaultData()

    // Update preferences
    data.preferences.demoScenario = scenario

    switch (scenario) {
      case "corporate":
        data.preferences.companyName = "GlobalTech Industries"
        data.users = this.generateCorporateUsers()
        data.sites = this.generateCorporateSites()
        data.events = this.generateCorporateEvents()
        data.globalPolicies = this.generateCorporateGlobalPolicies()
        break
      case "financial":
        data.preferences.companyName = "SecureBank Financial Group"
        data.users = this.generateFinancialUsers()
        data.sites = this.generateFinancialSites()
        data.events = this.generateFinancialEvents()
        data.globalPolicies = this.generateFinancialGlobalPolicies()
        break
      case "education":
        data.preferences.companyName = "Riverside University System"
        data.users = this.generateEducationUsers()
        data.sites = this.generateEducationSites()
        data.events = this.generateEducationEvents()
        data.globalPolicies = this.generateEducationGlobalPolicies()
        break
      case "healthcare":
        data.preferences.companyName = "Metropolitan Health Network"
        data.users = this.generateHealthcareUsers()
        data.sites = this.generateHealthcareSites()
        data.events = this.generateHealthcareEvents()
        data.globalPolicies = this.generateHealthcareGlobalPolicies()
        break
      case "manufacturing":
        data.preferences.companyName = "Advanced Manufacturing Corp"
        data.users = this.generateManufacturingUsers()
        data.sites = this.generateManufacturingSites()
        data.events = this.generateManufacturingEvents()
        data.globalPolicies = this.generateManufacturingGlobalPolicies()
        break
      case "technology":
        data.preferences.companyName = "InnovateTech Solutions"
        data.users = this.generateTechnologyUsers()
        data.sites = this.generateTechnologySites()
        data.events = this.generateTechnologyEvents()
        data.globalPolicies = this.generateTechnologyGlobalPolicies()
        break
      case "retail":
        data.preferences.companyName = "Premium Retail Chain"
        data.users = this.generateRetailUsers()
        data.sites = this.generateRetailSites()
        data.events = this.generateRetailEvents()
        data.globalPolicies = this.generateRetailGlobalPolicies()
        break
      case "government":
        data.preferences.companyName = "Federal Technology Services"
        data.users = this.generateGovernmentUsers()
        data.sites = this.generateGovernmentSites()
        data.events = this.generateGovernmentEvents()
        data.globalPolicies = this.generateGovernmentGlobalPolicies()
        break
    }

    this.saveData(data)
  }

  // Corporate Demo Data Generators
  private generateCorporateUsers(): User[] {
    return [
      {
        id: "user-corp-1",
        name: "Alexandra Sterling",
        email: "alexandra.sterling@globaltech.com",
        role: "admin",
        department: "IT Security",
        title: "Chief Information Security Officer",
        phone: "+1 (555) 123-4567",
        isActive: true,
        specialties: ["Zero Trust", "Network Security", "Compliance", "Risk Management"],
        certifications: ["CISSP", "CISM", "CCNP Security", "CISSP"],
        skills: ["Strategic Planning", "Team Leadership", "Vendor Management", "Budget Planning"],
        languages: ["English", "Spanish"],
        timeZone: "America/New_York",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "business-hours",
          vacationDays: ["2024-07-15", "2024-12-23", "2024-12-24"],
        },
        vendorRelationships: ["Portnox", "Cisco", "Microsoft"],
        projectHistory: ["Global Security Upgrade 2023", "SASE Implementation"],
        performanceRating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user-corp-2",
        name: "Marcus Rodriguez",
        email: "marcus.rodriguez@globaltech.com",
        role: "project-manager",
        department: "IT Operations",
        title: "Senior Project Manager",
        phone: "+1 (555) 234-5678",
        isActive: true,
        specialties: ["Project Management", "Infrastructure", "Change Management", "Stakeholder Communication"],
        certifications: ["PMP", "ITIL v4", "Agile Certified", "Scrum Master"],
        skills: ["Risk Assessment", "Resource Planning", "Quality Assurance", "Process Improvement"],
        languages: ["English", "Portuguese"],
        timeZone: "America/New_York",
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: "flexible",
          vacationDays: ["2024-08-01", "2024-08-02", "2024-11-28"],
        },
        vendorRelationships: ["Portnox", "Aruba", "Palo Alto"],
        projectHistory: ["Network Modernization 2023", "Cloud Migration Phase 2"],
        performanceRating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more corporate users...
    ]
  }

  private generateCorporateSites(): Site[] {
    const sites = [
      {
        id: "site-corp-1",
        name: "New York Headquarters",
        location: "Manhattan, NY",
        region: "North America",
        country: "United States",
        state: "New York",
        city: "New York",
        siteType: "headquarters" as const,
        status: "implementation" as const,
        priority: "critical" as const,
        phase: "Phase 3 - Implementation",
        users: 2500,
        devices: 4200,
        deviceBreakdown: {
          windows: 1800,
          mac: 450,
          linux: 150,
          ios: 850,
          android: 420,
          iot: 320,
          medical: 0,
          printers: 180,
          cameras: 45,
          voip: 250,
          kiosks: 12,
          tablets: 85,
          chromeos: 35,
          other: 30,
        },
        assignedUsers: {
          projectManagers: ["user-corp-2"],
          technicalOwners: ["user-corp-3"],
          siteOwners: ["user-corp-4"],
          systemsEngineers: ["user-corp-5"],
          accountExecutives: ["user-corp-6"],
          technicalAccountManagers: ["user-corp-7"],
          technicians: ["user-corp-8", "user-corp-9"],
          securitySpecialists: ["user-corp-1"],
        },
        startDate: "2024-01-15",
        targetDate: "2024-04-30",
        progress: 75,
        milestones: [
          {
            id: "milestone-1",
            name: "Infrastructure Assessment Complete",
            description: "Complete network infrastructure assessment and readiness evaluation",
            targetDate: "2024-01-30",
            completionDate: "2024-01-28",
            status: "completed",
            dependencies: [],
            assignedTo: "user-corp-3",
          },
        ],
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["Catalyst 9300", "Catalyst 9500"],
          switchCount: 48,
          portCount: 1152,
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
          type: "mpls",
          bandwidth: "1Gbps",
          provider: "Verizon Business",
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
          models: ["PA-5250", "PA-3250"],
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
          vendor: "cisco-ise",
          privilegeLevels: [1, 15],
          commandAuthorization: true,
        },
        vlans: 25,
        subnets: ["10.1.0.0/16", "10.2.0.0/16"],
        dhcpScopes: 15,
        dnsServers: ["10.1.1.10", "10.1.1.11"],
        globalPolicies: ["global-policy-1", "global-policy-2", "global-policy-3"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["SOX", "PCI-DSS", "GDPR"],
        securityStandards: ["NIST Cybersecurity Framework", "ISO 27001"],
        dataClassification: "confidential",
        notes:
          "Primary headquarters with critical business operations. High visibility deployment requiring executive oversight.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more corporate sites...
    ]

    // Generate additional randomized sites
    const additionalSites = this.generateRandomizedSites("corporate", 11)
    return [...sites, ...additionalSites]
  }

  private generateCorporateGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-corp-1",
        name: "Corporate Device Authentication Standard",
        description: "Standard authentication policy for all corporate-managed devices across all sites",
        category: "authentication",
        type: "access",
        priority: 1,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["Windows", "macOS", "iOS", "Android"],
            description: "Corporate managed devices",
          },
          {
            type: "certificate",
            operator: "equals",
            value: "valid",
            description: "Valid corporate certificate required",
          },
        ],
        actions: [
          {
            type: "allow",
            parameters: { vlan: "100", qos: "standard", bandwidth: "unlimited" },
            description: "Corporate network access with standard QoS",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [], // All sites
        schedule: {
          type: "always",
          timeZone: "UTC",
        },
        tags: ["corporate", "authentication", "standard"],
        version: "1.0",
        approvedBy: "user-corp-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more corporate global policies...
    ]
  }

  private generateCorporateEvents(): Event[] {
    return [
      {
        id: "event-corp-1",
        title: "Global NAC Deployment Kickoff",
        description: "Project kickoff meeting for the global NAC deployment initiative across all corporate sites",
        startDate: "2024-01-10T09:00:00",
        endDate: "2024-01-10T11:00:00",
        type: "kickoff",
        priority: "critical",
        assignedTo: "user-corp-2",
        siteId: "site-corp-1",
        status: "completed",
        attendees: ["user-corp-1", "user-corp-2", "user-corp-3", "user-corp-5"],
        location: "New York HQ - Executive Conference Room A",
        meetingType: "hybrid",
        meetingUrl: "https://teams.microsoft.com/l/meetup-join/...",
        prerequisites: ["Network assessment reports", "Budget approval"],
        deliverables: ["Project charter", "Resource allocation plan", "Timeline approval"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more corporate events...
    ]
  }

  // Financial Services Demo Data Generators
  private generateFinancialUsers(): User[] {
    return [
      {
        id: "user-fin-1",
        name: "Robert Chen",
        email: "robert.chen@securebank.com",
        role: "admin",
        department: "Information Security",
        title: "Chief Security Officer",
        phone: "+1 (555) 987-6543",
        isActive: true,
        specialties: ["Financial Security", "Regulatory Compliance", "Risk Assessment", "Fraud Prevention"],
        certifications: ["CISSP", "CISA", "FRM", "PCI-DSS QSA"],
        skills: ["Regulatory Knowledge", "Audit Management", "Incident Response", "Vendor Risk"],
        languages: ["English", "Mandarin"],
        timeZone: "America/New_York",
        availability: {
          hoursPerWeek: 50,
          preferredSchedule: "business-hours",
          vacationDays: ["2024-06-15", "2024-12-25"],
        },
        vendorRelationships: ["Portnox", "Palo Alto", "CyberArk"],
        projectHistory: ["PCI-DSS Compliance 2023", "Zero Trust Implementation"],
        performanceRating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more financial users...
    ]
  }

  private generateFinancialSites(): Site[] {
    const sites = [
      {
        id: "site-fin-1",
        name: "Wall Street Trading Floor",
        location: "New York, NY",
        region: "North America",
        country: "United States",
        state: "New York",
        city: "New York",
        siteType: "headquarters" as const,
        status: "implementation" as const,
        priority: "critical" as const,
        phase: "Phase 4 - Deployment",
        users: 850,
        devices: 2100,
        deviceBreakdown: {
          windows: 600,
          mac: 120,
          linux: 80,
          ios: 200,
          android: 50,
          iot: 150,
          medical: 0,
          printers: 45,
          cameras: 25,
          voip: 180,
          kiosks: 30,
          tablets: 60,
          chromeos: 0,
          other: 20,
        },
        assignedUsers: {
          projectManagers: ["user-fin-2"],
          technicalOwners: ["user-fin-3"],
          siteOwners: ["user-fin-4"],
          systemsEngineers: ["user-fin-5"],
          accountExecutives: ["user-fin-6"],
          technicalAccountManagers: ["user-fin-7"],
          technicians: ["user-fin-8"],
          securitySpecialists: ["user-fin-1"],
        },
        startDate: "2024-02-01",
        targetDate: "2024-05-15",
        progress: 85,
        milestones: [],
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["Catalyst 9500", "Nexus 9000"],
          switchCount: 32,
          portCount: 768,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 10,
          firmware: "17.09.02",
        },
        wirelessInfrastructure: {
          vendor: "aruba",
          controllerModel: "7240XM",
          apModels: ["AP-635", "AP-555"],
          apCount: 85,
          wifiStandards: ["802.11ax"],
          bandSupport: ["5GHz", "6GHz"],
          meshSupport: false,
          firmware: "10.4.0.3",
        },
        connectivity: {
          type: "directconnect",
          bandwidth: "10Gbps",
          provider: "AWS Direct Connect",
          redundancy: true,
          backupType: "expressroute",
        },
        identityProvider: {
          type: "azure-ad",
          domain: "securebank.com",
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
          models: ["PA-7080", "PA-5260"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "11.1.0",
        },
        radiusConfiguration: {
          type: "cloud-radius",
          clustering: true,
          loadBalancing: true,
          certificates: true,
        },
        deviceAdministration: {
          type: "both",
          vendor: "cisco-ise",
          privilegeLevels: [1, 7, 15],
          commandAuthorization: true,
        },
        vlans: 45,
        subnets: ["172.16.0.0/16", "172.17.0.0/16"],
        dhcpScopes: 25,
        dnsServers: ["172.16.1.10", "172.16.1.11"],
        globalPolicies: ["global-policy-fin-1", "global-policy-fin-2"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["PCI-DSS", "SOX", "GLBA", "FFIEC"],
        securityStandards: ["NIST Cybersecurity Framework", "ISO 27001", "CIS Controls"],
        dataClassification: "restricted",
        notes: "High-frequency trading environment requiring ultra-low latency and maximum security.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Add more financial sites...
    ]

    const additionalSites = this.generateRandomizedSites("financial", 17)
    return [...sites, ...additionalSites]
  }

  private generateFinancialGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-fin-1",
        name: "PCI-DSS Compliance Policy",
        description: "Payment card industry compliance for all payment processing systems",
        category: "compliance",
        type: "security",
        priority: 1,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["Payment Terminal", "POS System"],
            description: "Payment processing devices",
          },
        ],
        actions: [
          {
            type: "vlan_assign",
            parameters: { vlan: "200", isolation: true, monitoring: "enhanced" },
            description: "Isolated PCI-DSS compliant network segment",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "UTC" },
        tags: ["financial", "pci-dss", "compliance"],
        version: "1.0",
        approvedBy: "user-fin-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateFinancialEvents(): Event[] {
    return [
      {
        id: "event-fin-1",
        title: "PCI-DSS Compliance Assessment",
        description: "Quarterly PCI-DSS compliance review and network security assessment",
        startDate: "2024-03-15T10:00:00",
        endDate: "2024-03-15T16:00:00",
        type: "review",
        priority: "high",
        assignedTo: "user-fin-1",
        siteId: "site-fin-1",
        status: "scheduled",
        attendees: ["user-fin-1", "user-fin-3", "user-fin-5"],
        location: "Wall Street Trading Floor - Compliance Room",
        meetingType: "in-person",
        prerequisites: ["Security documentation", "Network diagrams"],
        deliverables: ["Compliance report", "Remediation plan"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  // Helper method to generate randomized sites for each scenario
  private generateRandomizedSites(scenario: string, count: number): Site[] {
    const sites: Site[] = []
    const siteTypes: Site["siteType"][] = ["branch", "campus", "datacenter", "remote", "building"]
    const statuses: Site["status"][] = ["planning", "design", "implementation", "testing", "completed", "on-hold"]
    const priorities: Site["priority"][] = ["low", "medium", "high", "critical"]

    const siteNames = {
      corporate: [
        "Los Angeles Office",
        "Chicago Branch",
        "Dallas Headquarters",
        "Miami Operations",
        "Seattle Tech Hub",
        "Boston Research Center",
        "Atlanta Regional",
        "Denver Facility",
        "Phoenix Branch",
        "Detroit Operations",
        "San Francisco Office",
      ],
      financial: [
        "Downtown Branch",
        "Investment Center",
        "Retail Banking Hub",
        "Corporate Banking",
        "Wealth Management",
        "Trading Desk",
        "Risk Management Center",
        "Compliance Office",
        "Operations Center",
        "Customer Service Hub",
        "Private Banking",
        "Commercial Lending",
        "Treasury Operations",
        "Credit Analysis",
        "Mortgage Center",
        "International Banking",
        "Trust Services",
      ],
      healthcare: [
        "Main Hospital",
        "Emergency Department",
        "Surgical Center",
        "Outpatient Clinic",
        "Radiology Center",
        "Laboratory",
        "Pharmacy",
        "Administrative Office",
      ],
      education: ["Main Campus", "Library", "Student Center", "Research Lab", "Dormitory", "Athletic Center"],
      manufacturing: [
        "Production Facility",
        "Quality Control",
        "Warehouse",
        "R&D Lab",
        "Assembly Line",
        "Shipping Center",
        "Maintenance Shop",
        "Administrative Building",
        "Safety Office",
        "Testing Facility",
        "Raw Materials",
        "Finished Goods",
        "Equipment Storage",
        "Training Center",
      ],
      technology: [
        "Development Center",
        "QA Lab",
        "Cloud Operations",
        "Security Operations",
        "Customer Support",
        "Sales Office",
        "Product Management",
        "Data Center",
        "Innovation Lab",
      ],
      retail: [
        "Flagship Store",
        "Outlet Store",
        "Mall Location",
        "Strip Mall",
        "Warehouse",
        "Distribution Center",
        "Customer Service",
        "Regional Office",
        "Pop-up Store",
        "Seasonal Store",
        "Concept Store",
        "Showroom",
        "Training Center",
        "Call Center",
        "E-commerce Fulfillment",
        "Returns Processing",
        "Loss Prevention",
        "Store Support",
        "Inventory Management",
        "Category Management",
        "Marketing Office",
        "Finance Office",
        "HR Office",
        "IT Support",
        "Vendor Relations",
      ],
    }

    const names = siteNames[scenario as keyof typeof siteNames] || siteNames.corporate

    for (let i = 0; i < count; i++) {
      const randomName = names[i % names.length]
      const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
      const randomRegion = REGIONS[Math.floor(Math.random() * REGIONS.length)]
      const randomSiteType = siteTypes[Math.floor(Math.random() * siteTypes.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
      const randomUsers = Math.floor(Math.random() * 1000) + 50
      const randomDevices = Math.floor(randomUsers * 1.5) + Math.floor(Math.random() * 500)
      const randomProgress =
        randomStatus === "completed" ? 100 : randomStatus === "planning" ? 0 : Math.floor(Math.random() * 80) + 10

      sites.push({
        id: `site-${scenario}-${i + 2}`,
        name: `${randomName} ${i + 1}`,
        location: `${randomCountry}`,
        region: randomRegion,
        country: randomCountry,
        state: randomCountry === "United States" ? US_STATES[Math.floor(Math.random() * US_STATES.length)] : undefined,
        city: `City ${i + 1}`,
        siteType: randomSiteType,
        status: randomStatus,
        priority: randomPriority,
        phase: PHASES[Math.floor(Math.random() * PHASES.length)],
        users: randomUsers,
        devices: randomDevices,
        deviceBreakdown: {
          windows: Math.floor(randomDevices * 0.4),
          mac: Math.floor(randomDevices * 0.15),
          linux: Math.floor(randomDevices * 0.05),
          ios: Math.floor(randomDevices * 0.2),
          android: Math.floor(randomDevices * 0.1),
          iot: Math.floor(randomDevices * 0.05),
          medical: scenario === "healthcare" ? Math.floor(randomDevices * 0.15) : 0,
          printers: Math.floor(randomDevices * 0.03),
          cameras: Math.floor(randomDevices * 0.02),
          voip: Math.floor(randomDevices * 0.08),
          kiosks: Math.floor(randomDevices * 0.01),
          tablets: Math.floor(randomDevices * 0.04),
          chromeos: Math.floor(randomDevices * 0.02),
          other: Math.floor(randomDevices * 0.05),
        },
        assignedUsers: {
          projectManagers: [],
          technicalOwners: [],
          siteOwners: [],
          systemsEngineers: [],
          accountExecutives: [],
          technicalAccountManagers: [],
          technicians: [],
          securitySpecialists: [],
        },
        startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString()
          .split("T")[0],
        targetDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString()
          .split("T")[0],
        progress: randomProgress,
        milestones: [],
        wiredInfrastructure: {
          vendor: WIRED_VENDORS[Math.floor(Math.random() * WIRED_VENDORS.length)].id,
          switchModels: [WIRED_VENDORS[0].models[Math.floor(Math.random() * WIRED_VENDORS[0].models.length)]],
          switchCount: Math.floor(Math.random() * 20) + 5,
          portCount: (Math.floor(Math.random() * 20) + 5) * 48,
          stackingSupport: Math.random() > 0.5,
          poeSupport: Math.random() > 0.3,
          mgmtVlan: Math.floor(Math.random() * 100) + 100,
          firmware: WIRED_VENDORS[0].firmwares[Math.floor(Math.random() * WIRED_VENDORS[0].firmwares.length)],
        },
        wirelessInfrastructure: {
          vendor: WIRELESS_VENDORS[Math.floor(Math.random() * WIRELESS_VENDORS.length)].id,
          controllerModel:
            WIRELESS_VENDORS[0].controllers[Math.floor(Math.random() * WIRELESS_VENDORS[0].controllers.length)],
          apModels: [WIRELESS_VENDORS[0].aps[Math.floor(Math.random() * WIRELESS_VENDORS[0].aps.length)]],
          apCount: Math.floor(Math.random() * 50) + 10,
          wifiStandards: ["802.11ax", "802.11ac"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: Math.random() > 0.7,
          firmware: WIRELESS_VENDORS[0].firmwares[Math.floor(Math.random() * WIRELESS_VENDORS[0].firmwares.length)],
        },
        connectivity: {
          type: ["mpls", "sdwan", "internet", "vpn"][Math.floor(Math.random() * 4)],
          bandwidth: ["100Mbps", "1Gbps", "500Mbps", "10Gbps"][Math.floor(Math.random() * 4)],
          provider: ["Verizon", "AT&T", "Comcast", "Level3"][Math.floor(Math.random() * 4)],
          redundancy: Math.random() > 0.5,
        },
        identityProvider: {
          type: "azure-ad",
          domain: `${scenario}.com`,
          syncEnabled: true,
          mfaEnabled: Math.random() > 0.3,
          conditionalAccess: Math.random() > 0.4,
        },
        mdmProvider: {
          type: MDM_PROVIDERS[Math.floor(Math.random() * MDM_PROVIDERS.length)].id,
          enrollmentType: ["automatic", "manual"][Math.floor(Math.random() * 2)],
          complianceEnabled: Math.random() > 0.4,
          appManagement: Math.random() > 0.3,
        },
        firewallInfrastructure: {
          vendor: FIREWALL_VENDORS[Math.floor(Math.random() * FIREWALL_VENDORS.length)].id,
          models: [FIREWALL_VENDORS[0].models[Math.floor(Math.random() * FIREWALL_VENDORS[0].models.length)]],
          haConfiguration: Math.random() > 0.6,
          userIdIntegration: Math.random() > 0.5,
          syslogEnabled: Math.random() > 0.4,
          firmware: FIREWALL_VENDORS[0].firmwares[Math.floor(Math.random() * FIREWALL_VENDORS[0].firmwares.length)],
        },
        radiusConfiguration: {
          type: "cloud-radius",
          clustering: Math.random() > 0.5,
          loadBalancing: Math.random() > 0.4,
          certificates: Math.random() > 0.3,
        },
        deviceAdministration: {
          type: ["radius", "tacacs", "both"][Math.floor(Math.random() * 3)],
          privilegeLevels: [1, 15],
          commandAuthorization: Math.random() > 0.5,
        },
        vlans: Math.floor(Math.random() * 30) + 5,
        subnets: [`10.${i + 10}.0.0/16`],
        dhcpScopes: Math.floor(Math.random() * 10) + 3,
        dnsServers: [`10.${i + 10}.1.10`, `10.${i + 10}.1.11`],
        globalPolicies: [],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: Math.random() > 0.5,
          bandwidth_control: Math.random() > 0.4,
          time_based_access: Math.random() > 0.3,
          device_compliance: Math.random() > 0.6,
          location_based: Math.random() > 0.4,
        },
        complianceRequirements: COMPLIANCE_FRAMEWORKS.slice(0, Math.floor(Math.random() * 5) + 2),
        securityStandards: SECURITY_STANDARDS.slice(0, Math.floor(Math.random() * 4) + 2),
        dataClassification: ["internal", "confidential", "restricted"][Math.floor(Math.random() * 3)] as const,
        notes: `Randomized ${scenario} site with ${randomUsers} users and ${randomDevices} devices.`,
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    return sites
  }

  // Placeholder generators for other scenarios (to be expanded)
  private generateEducationUsers(): User[] {
    return [
      {
        id: "user-edu-1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@riverside.edu",
        role: "admin",
        department: "IT Services",
        title: "Chief Technology Officer",
        phone: "+1 (555) 321-9876",
        isActive: true,
        specialties: ["Campus Networks", "Student Services", "Research Computing", "EdTech"],
        certifications: ["CISSP", "CCNP", "ITIL", "EDUCAUSE"],
        skills: ["Higher Education", "Large Scale Deployments", "Student Privacy", "Research Support"],
        languages: ["English", "French"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "flexible",
          vacationDays: ["2024-07-04", "2024-12-25"],
        },
        vendorRelationships: ["Portnox", "Cisco", "Aruba"],
        projectHistory: ["Campus WiFi Upgrade 2023", "Student Portal Migration"],
        performanceRating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateEducationSites(): Site[] {
    const sites = [
      {
        id: "site-edu-1",
        name: "Main Campus",
        location: "Riverside, CA",
        region: "North America",
        country: "United States",
        state: "California",
        city: "Riverside",
        siteType: "campus" as const,
        status: "testing" as const,
        priority: "high" as const,
        phase: "Phase 4 - Go-Live",
        users: 15000,
        devices: 28000,
        deviceBreakdown: {
          windows: 8000,
          mac: 4500,
          linux: 1200,
          ios: 7000,
          android: 4200,
          iot: 1800,
          medical: 0,
          printers: 450,
          cameras: 180,
          voip: 600,
          kiosks: 120,
          tablets: 800,
          chromeos: 150,
          other: 200,
        },
        assignedUsers: {
          projectManagers: ["user-edu-2"],
          technicalOwners: ["user-edu-3"],
          siteOwners: ["user-edu-4"],
          systemsEngineers: ["user-edu-5"],
          accountExecutives: ["user-edu-6"],
          technicalAccountManagers: ["user-edu-7"],
          technicians: ["user-edu-8", "user-edu-9"],
          securitySpecialists: ["user-edu-1"],
        },
        startDate: "2024-01-08",
        targetDate: "2024-06-15",
        progress: 92,
        milestones: [],
        wiredInfrastructure: {
          vendor: "aruba",
          switchModels: ["CX 6300", "CX 8300"],
          switchCount: 180,
          portCount: 4320,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 1,
          firmware: "10.10.1020",
        },
        wirelessInfrastructure: {
          vendor: "aruba",
          controllerModel: "9012",
          apModels: ["AP-635", "AP-515", "AP-505"],
          apCount: 850,
          wifiStandards: ["802.11ax", "802.11ac"],
          bandSupport: ["2.4GHz", "5GHz", "6GHz"],
          meshSupport: true,
          firmware: "10.3.1.1",
        },
        connectivity: {
          type: "fiber",
          bandwidth: "10Gbps",
          provider: "Internet2",
          redundancy: true,
          backupType: "mpls",
        },
        identityProvider: {
          type: "azure-ad",
          domain: "riverside.edu",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: true,
        },
        mdmProvider: {
          type: "jamf",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "palo-alto",
          models: ["PA-5250", "PA-3250"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "11.0.2",
        },
        radiusConfiguration: {
          type: "on-premise-radius",
          vendor: "aruba-clearpass",
          clustering: true,
          loadBalancing: true,
          certificates: true,
        },
        deviceAdministration: {
          type: "radius",
          vendor: "aruba-clearpass",
          privilegeLevels: [1, 15],
          commandAuthorization: false,
        },
        vlans: 85,
        subnets: ["172.20.0.0/16", "172.21.0.0/16", "172.22.0.0/16"],
        dhcpScopes: 45,
        dnsServers: ["172.20.1.10", "172.20.1.11"],
        globalPolicies: ["global-policy-edu-1", "global-policy-edu-2"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["FERPA", "GDPR", "CCPA"],
        securityStandards: ["NIST Cybersecurity Framework", "CIS Controls", "EDUCAUSE Security Framework"],
        dataClassification: "internal",
        notes: "Large university campus with high-density wireless requirements for dormitories and classrooms.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("education", 5)
    return [...sites, ...additionalSites]
  }

  private generateEducationGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-edu-1",
        name: "Student BYOD Policy",
        description: "Bring Your Own Device policy for students with bandwidth management",
        category: "authorization",
        type: "bandwidth",
        priority: 2,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "Students",
            description: "Student user group",
          },
        ],
        actions: [
          {
            type: "bandwidth_limit",
            parameters: { download: "50Mbps", upload: "25Mbps", vlan: "300" },
            description: "Student network with bandwidth limits",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "America/Los_Angeles" },
        tags: ["education", "byod", "students"],
        version: "1.0",
        approvedBy: "user-edu-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateEducationEvents(): Event[] {
    return [
      {
        id: "event-edu-1",
        title: "Campus WiFi Upgrade",
        description: "WiFi 6 upgrade across all dormitories and academic buildings",
        startDate: "2024-05-15T08:00:00",
        endDate: "2024-05-15T18:00:00",
        type: "deployment",
        priority: "high",
        assignedTo: "user-edu-2",
        siteId: "site-edu-1",
        status: "scheduled",
        attendees: ["user-edu-1", "user-edu-2", "user-edu-5"],
        location: "Main Campus - IT Building",
        meetingType: "in-person",
        prerequisites: ["AP installations", "Controller configuration"],
        deliverables: ["WiFi coverage validation", "Performance testing"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateHealthcareUsers(): User[] {
    return [
      {
        id: "user-health-1",
        name: "Dr. Maria Gonzalez",
        email: "maria.gonzalez@metrohealthnet.org",
        role: "admin",
        department: "Health IT",
        title: "Chief Medical Information Officer",
        phone: "+1 (555) 456-7890",
        isActive: true,
        specialties: ["Healthcare IT", "Medical Device Security", "HIPAA Compliance", "Clinical Workflows"],
        certifications: ["CISSP", "CPHIMS", "CHPS", "HIMSS"],
        skills: ["Clinical Systems", "Patient Safety", "Regulatory Compliance", "Medical Informatics"],
        languages: ["English", "Spanish"],
        timeZone: "America/Chicago",
        availability: {
          hoursPerWeek: 50,
          preferredSchedule: "24x7",
          vacationDays: ["2024-08-15", "2024-12-24"],
        },
        vendorRelationships: ["Portnox", "Cisco", "Palo Alto"],
        projectHistory: ["HIPAA Security Upgrade 2023", "Medical Device Integration"],
        performanceRating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateHealthcareSites(): Site[] {
    const sites = [
      {
        id: "site-health-1",
        name: "Metropolitan General Hospital",
        location: "Chicago, IL",
        region: "North America",
        country: "United States",
        state: "Illinois",
        city: "Chicago",
        siteType: "headquarters" as const,
        status: "implementation" as const,
        priority: "critical" as const,
        phase: "Phase 3 - Configuration",
        users: 1200,
        devices: 3500,
        deviceBreakdown: {
          windows: 800,
          mac: 120,
          linux: 50,
          ios: 350,
          android: 180,
          iot: 450,
          medical: 750,
          printers: 85,
          cameras: 35,
          voip: 280,
          kiosks: 45,
          tablets: 200,
          chromeos: 15,
          other: 170,
        },
        assignedUsers: {
          projectManagers: ["user-health-2"],
          technicalOwners: ["user-health-3"],
          siteOwners: ["user-health-4"],
          systemsEngineers: ["user-health-5"],
          accountExecutives: ["user-health-6"],
          technicalAccountManagers: ["user-health-7"],
          technicians: ["user-health-8"],
          securitySpecialists: ["user-health-1"],
        },
        startDate: "2024-02-01",
        targetDate: "2024-07-30",
        progress: 68,
        milestones: [],
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["Catalyst 9300", "IE 5000"],
          switchCount: 65,
          portCount: 1560,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 50,
          firmware: "17.06.03",
        },
        wirelessInfrastructure: {
          vendor: "cisco",
          controllerModel: "9800-40",
          apModels: ["Catalyst 9130AXI", "AIR-AP3800"],
          apCount: 180,
          wifiStandards: ["802.11ax", "802.11ac"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: false,
          firmware: "17.06.05",
        },
        connectivity: {
          type: "fiber",
          bandwidth: "1Gbps",
          provider: "Regional Health Network",
          redundancy: true,
          backupType: "mpls",
        },
        identityProvider: {
          type: "active-directory",
          domain: "metrohealthnet.local",
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
          models: ["FortiGate 1800F", "FortiGate 600F"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "7.2.5",
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
        vlans: 35,
        subnets: ["192.168.10.0/16", "192.168.11.0/16"],
        dhcpScopes: 20,
        dnsServers: ["192.168.10.10", "192.168.10.11"],
        globalPolicies: ["global-policy-health-1"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: false,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["HIPAA", "HITECH", "FDA 21 CFR Part 11"],
        securityStandards: ["NIST Cybersecurity Framework", "NIST 800-66", "HHS Security Risk Assessment"],
        dataClassification: "restricted",
        notes:
          "Critical healthcare facility requiring zero-latency for life-support systems and strict HIPAA compliance.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("healthcare", 7)
    return [...sites, ...additionalSites]
  }

  private generateHealthcareGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-health-1",
        name: "Medical Device Priority Policy",
        description: "Critical medical device traffic prioritization and isolation",
        category: "security",
        type: "qos",
        priority: 1,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["Medical Device", "Life Support", "Patient Monitor"],
            description: "Critical medical equipment",
          },
        ],
        actions: [
          {
            type: "qos_apply",
            parameters: { priority: "critical", vlan: "10", latency: "1ms" },
            description: "Critical priority with minimal latency",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "UTC" },
        tags: ["healthcare", "medical-device", "critical"],
        version: "1.0",
        approvedBy: "user-health-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateHealthcareEvents(): Event[] {
    return [
      {
        id: "event-health-1",
        title: "Medical Device Security Assessment",
        description: "Quarterly security assessment of all networked medical devices",
        startDate: "2024-04-15T09:00:00",
        endDate: "2024-04-15T17:00:00",
        type: "review",
        priority: "critical",
        assignedTo: "user-health-1",
        siteId: "site-health-1",
        status: "scheduled",
        attendees: ["user-health-1", "user-health-3", "user-health-5"],
        location: "Metropolitan General Hospital - IT Security Room",
        meetingType: "in-person",
        prerequisites: ["Medical device inventory", "Network documentation"],
        deliverables: ["Security assessment report", "Remediation recommendations"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateManufacturingUsers(): User[] {
    return [
      {
        id: "user-mfg-1",
        name: "James Anderson",
        email: "james.anderson@advancedmfg.com",
        role: "admin",
        department: "Industrial IT",
        title: "OT/IT Security Manager",
        phone: "+1 (555) 789-0123",
        isActive: true,
        specialties: ["Industrial Networks", "OT Security", "SCADA Systems", "Manufacturing IT"],
        certifications: ["CISSP", "GICSP", "ISA/IEC 62443", "SANS ICS"],
        skills: ["Industrial Protocols", "Network Segmentation", "Safety Systems", "Automation"],
        languages: ["English", "German"],
        timeZone: "America/Detroit",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "business-hours",
          vacationDays: ["2024-07-04", "2024-12-25"],
        },
        vendorRelationships: ["Portnox", "Cisco", "Rockwell Automation"],
        projectHistory: ["OT Network Segmentation 2023", "SCADA Security Upgrade"],
        performanceRating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateManufacturingSites(): Site[] {
    const sites = [
      {
        id: "site-mfg-1",
        name: "Primary Production Facility",
        location: "Detroit, MI",
        region: "North America",
        country: "United States",
        state: "Michigan",
        city: "Detroit",
        siteType: "building" as const,
        status: "design" as const,
        priority: "high" as const,
        phase: "Phase 2 - Design",
        users: 850,
        devices: 4200,
        deviceBreakdown: {
          windows: 400,
          mac: 50,
          linux: 120,
          ios: 200,
          android: 150,
          iot: 2800,
          medical: 0,
          printers: 45,
          cameras: 85,
          voip: 180,
          kiosks: 25,
          tablets: 100,
          chromeos: 15,
          other: 230,
        },
        assignedUsers: {
          projectManagers: ["user-mfg-2"],
          technicalOwners: ["user-mfg-3"],
          siteOwners: ["user-mfg-4"],
          systemsEngineers: ["user-mfg-5"],
          accountExecutives: ["user-mfg-6"],
          technicalAccountManagers: ["user-mfg-7"],
          technicians: ["user-mfg-8", "user-mfg-9"],
          securitySpecialists: ["user-mfg-1"],
        },
        startDate: "2024-03-01",
        targetDate: "2024-09-30",
        progress: 35,
        milestones: [],
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["IE 5000", "Catalyst 9300", "IE 3300"],
          switchCount: 95,
          portCount: 2280,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 1,
          firmware: "17.09.02",
        },
        wirelessInfrastructure: {
          vendor: "cisco",
          controllerModel: "9800-CL",
          apModels: ["Catalyst 9164I", "AIR-AP1800"],
          apCount: 220,
          wifiStandards: ["802.11ax", "802.11ac"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: true,
          firmware: "17.09.04",
        },
        connectivity: {
          type: "fiber",
          bandwidth: "10Gbps",
          provider: "Industrial Network Solutions",
          redundancy: true,
          backupType: "mpls",
        },
        identityProvider: {
          type: "active-directory",
          domain: "advancedmfg.local",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: true,
        },
        mdmProvider: {
          type: "vmware-workspace-one",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "fortinet",
          models: ["FortiGate 3000D", "FortiGate 1800F"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "7.4.1",
        },
        radiusConfiguration: {
          type: "on-premise-radius",
          vendor: "cisco-ise",
          clustering: true,
          loadBalancing: true,
          certificates: true,
        },
        deviceAdministration: {
          type: "both",
          vendor: "cisco-ise",
          privilegeLevels: [1, 7, 15],
          commandAuthorization: true,
        },
        vlans: 55,
        subnets: ["10.100.0.0/16", "10.101.0.0/16", "10.102.0.0/16"],
        dhcpScopes: 35,
        dnsServers: ["10.100.1.10", "10.100.1.11"],
        globalPolicies: ["global-policy-mfg-1"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["IEC 62443", "ISO 27001", "OSHA"],
        securityStandards: ["NIST Cybersecurity Framework", "IEC 62443", "ISA/IEC 62443"],
        dataClassification: "confidential",
        notes: "Industrial facility with critical OT/IT convergence requiring strict network segmentation.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("manufacturing", 13)
    return [...sites, ...additionalSites]
  }

  private generateManufacturingGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-mfg-1",
        name: "OT/IT Network Segmentation Policy",
        description: "Strict segmentation between operational technology and information technology networks",
        category: "security",
        type: "vlan",
        priority: 1,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["PLC", "HMI", "SCADA", "Industrial Controller"],
            description: "Operational technology devices",
          },
        ],
        actions: [
          {
            type: "vlan_assign",
            parameters: { vlan: "100", isolation: true, monitoring: "continuous" },
            description: "Isolated OT network with continuous monitoring",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "UTC" },
        tags: ["manufacturing", "ot-security", "segmentation"],
        version: "1.0",
        approvedBy: "user-mfg-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateManufacturingEvents(): Event[] {
    return [
      {
        id: "event-mfg-1",
        title: "OT Security Assessment",
        description: "Comprehensive security assessment of operational technology networks",
        startDate: "2024-06-10T08:00:00",
        endDate: "2024-06-10T16:00:00",
        type: "review",
        priority: "high",
        assignedTo: "user-mfg-1",
        siteId: "site-mfg-1",
        status: "scheduled",
        attendees: ["user-mfg-1", "user-mfg-3", "user-mfg-5"],
        location: "Primary Production Facility - Control Room",
        meetingType: "in-person",
        prerequisites: ["Network topology", "Asset inventory"],
        deliverables: ["Security assessment report", "Risk mitigation plan"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateTechnologyUsers(): User[] {
    return [
      {
        id: "user-tech-1",
        name: "Priya Sharma",
        email: "priya.sharma@innovatetech.com",
        role: "admin",
        department: "DevSecOps",
        title: "Head of Security Engineering",
        phone: "+1 (555) 654-3210",
        isActive: true,
        specialties: ["Cloud Security", "DevSecOps", "Container Security", "API Security"],
        certifications: ["CISSP", "AWS Security", "CKAD", "GSEC"],
        skills: ["Kubernetes", "Terraform", "Python", "Security Automation"],
        languages: ["English", "Hindi"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 50,
          preferredSchedule: "flexible",
          vacationDays: ["2024-10-15", "2024-12-31"],
        },
        vendorRelationships: ["Portnox", "Palo Alto", "AWS"],
        projectHistory: ["Cloud Migration Security 2023", "Zero Trust Implementation"],
        performanceRating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateTechnologySites(): Site[] {
    const sites = [
      {
        id: "site-tech-1",
        name: "Silicon Valley HQ",
        location: "San Jose, CA",
        region: "North America",
        country: "United States",
        state: "California",
        city: "San Jose",
        siteType: "headquarters" as const,
        status: "implementation" as const,
        priority: "high" as const,
        phase: "Phase 3 - Implementation",
        users: 1200,
        devices: 2800,
        deviceBreakdown: {
          windows: 600,
          mac: 950,
          linux: 400,
          ios: 450,
          android: 200,
          iot: 120,
          medical: 0,
          printers: 35,
          cameras: 25,
          voip: 150,
          kiosks: 8,
          tablets: 60,
          chromeos: 20,
          other: 50,
        },
        assignedUsers: {
          projectManagers: ["user-tech-2"],
          technicalOwners: ["user-tech-3"],
          siteOwners: ["user-tech-4"],
          systemsEngineers: ["user-tech-5"],
          accountExecutives: ["user-tech-6"],
          technicalAccountManagers: ["user-tech-7"],
          technicians: ["user-tech-8"],
          securitySpecialists: ["user-tech-1"],
        },
        startDate: "2024-01-15",
        targetDate: "2024-06-30",
        progress: 78,
        milestones: [],
        wiredInfrastructure: {
          vendor: "aruba",
          switchModels: ["CX 8320", "CX 6300"],
          switchCount: 35,
          portCount: 840,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 10,
          firmware: "10.09.1010",
        },
        wirelessInfrastructure: {
          vendor: "aruba",
          controllerModel: "9012",
          apModels: ["AP-635", "AP-555"],
          apCount: 120,
          wifiStandards: ["802.11ax"],
          bandSupport: ["5GHz", "6GHz"],
          meshSupport: false,
          firmware: "10.4.0.3",
        },
        connectivity: {
          type: "fiber",
          bandwidth: "10Gbps",
          provider: "Level3",
          redundancy: true,
          backupType: "directconnect",
        },
        identityProvider: {
          type: "okta",
          domain: "innovatetech.com",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: true,
        },
        mdmProvider: {
          type: "jamf",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "palo-alto",
          models: ["PA-5250", "PA-3250"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "11.1.0",
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
        vlans: 25,
        subnets: ["10.50.0.0/16", "10.51.0.0/16"],
        dhcpScopes: 15,
        dnsServers: ["10.50.1.10", "10.50.1.11"],
        globalPolicies: ["global-policy-tech-1"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: false,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["SOC 2 Type II", "ISO 27001", "GDPR"],
        securityStandards: ["NIST Cybersecurity Framework", "OWASP Top 10", "Cloud Security Alliance"],
        dataClassification: "confidential",
        notes: "Technology company headquarters with cloud-first architecture and developer-focused security.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("technology", 8)
    return [...sites, ...additionalSites]
  }

  private generateTechnologyGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-tech-1",
        name: "Developer Network Access Policy",
        description: "Secure network access for development environments with appropriate isolation",
        category: "authorization",
        type: "vlan",
        priority: 2,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "Developers",
            description: "Development team members",
          },
        ],
        actions: [
          {
            type: "vlan_assign",
            parameters: { vlan: "200", qos: "high", isolation: "partial" },
            description: "Development network with high QoS",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "America/Los_Angeles" },
        tags: ["technology", "development", "access"],
        version: "1.0",
        approvedBy: "user-tech-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateTechnologyEvents(): Event[] {
    return [
      {
        id: "event-tech-1",
        title: "Cloud Security Review",
        description: "Quarterly review of cloud infrastructure security and compliance",
        startDate: "2024-05-20T14:00:00",
        endDate: "2024-05-20T17:00:00",
        type: "review",
        priority: "high",
        assignedTo: "user-tech-1",
        siteId: "site-tech-1",
        status: "scheduled",
        attendees: ["user-tech-1", "user-tech-3", "user-tech-5"],
        location: "Silicon Valley HQ - Security Operations Center",
        meetingType: "hybrid",
        prerequisites: ["Cloud architecture diagrams", "Security scan results"],
        deliverables: ["Security review report", "Improvement recommendations"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateRetailUsers(): User[] {
    return [
      {
        id: "user-retail-1",
        name: "Jennifer Kim",
        email: "jennifer.kim@premiumretail.com",
        role: "admin",
        department: "Retail IT",
        title: "Director of Store Technology",
        phone: "+1 (555) 876-5432",
        isActive: true,
        specialties: ["Retail Technology", "POS Security", "Guest WiFi", "Multi-Location Management"],
        certifications: ["CISSP", "PCI-DSS QSA", "Retail Technology Certified"],
        skills: ["Store Operations", "Customer Experience", "Loss Prevention", "Inventory Systems"],
        languages: ["English", "Korean"],
        timeZone: "America/Los_Angeles",
        availability: {
          hoursPerWeek: 45,
          preferredSchedule: "business-hours",
          vacationDays: ["2024-11-28", "2024-12-25"],
        },
        vendorRelationships: ["Portnox", "Cisco Meraki", "Square"],
        projectHistory: ["Holiday Season WiFi Upgrade 2023", "POS Security Enhancement"],
        performanceRating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateRetailSites(): Site[] {
    const sites = [
      {
        id: "site-retail-1",
        name: "Flagship Store - Times Square",
        location: "New York, NY",
        region: "North America",
        country: "United States",
        state: "New York",
        city: "New York",
        siteType: "branch" as const,
        status: "completed" as const,
        priority: "high" as const,
        phase: "Phase 6 - Support",
        users: 180,
        devices: 420,
        deviceBreakdown: {
          windows: 45,
          mac: 25,
          linux: 8,
          ios: 85,
          android: 65,
          iot: 120,
          medical: 0,
          printers: 18,
          cameras: 35,
          voip: 15,
          kiosks: 12,
          tablets: 32,
          chromeos: 5,
          other: 25,
        },
        assignedUsers: {
          projectManagers: ["user-retail-2"],
          technicalOwners: ["user-retail-3"],
          siteOwners: ["user-retail-4"],
          systemsEngineers: ["user-retail-5"],
          accountExecutives: ["user-retail-6"],
          technicalAccountManagers: ["user-retail-7"],
          technicians: ["user-retail-8"],
          securitySpecialists: ["user-retail-1"],
        },
        startDate: "2024-01-02",
        targetDate: "2024-03-15",
        progress: 100,
        milestones: [],
        wiredInfrastructure: {
          vendor: "cisco",
          switchModels: ["Catalyst 9200", "Catalyst 9300"],
          switchCount: 8,
          portCount: 192,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 99,
          firmware: "16.12.09",
        },
        wirelessInfrastructure: {
          vendor: "meraki",
          controllerModel: "Cloud Dashboard",
          apModels: ["MR46", "MR36"],
          apCount: 25,
          wifiStandards: ["802.11ax", "802.11ac"],
          bandSupport: ["2.4GHz", "5GHz"],
          meshSupport: true,
          firmware: "29.6.1",
        },
        connectivity: {
          type: "fiber",
          bandwidth: "1Gbps",
          provider: "Verizon Business",
          redundancy: true,
          backupType: "internet",
        },
        identityProvider: {
          type: "azure-ad",
          domain: "premiumretail.com",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: false,
        },
        mdmProvider: {
          type: "cisco-meraki",
          enrollmentType: "manual",
          complianceEnabled: false,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "cisco",
          models: ["ASA 5516-X"],
          haConfiguration: false,
          userIdIntegration: false,
          syslogEnabled: true,
          firmware: "9.19(1)",
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
        subnets: ["192.168.1.0/24"],
        dhcpScopes: 5,
        dnsServers: ["8.8.8.8", "8.8.4.4"],
        globalPolicies: ["global-policy-retail-1"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: false,
          location_based: false,
        },
        complianceRequirements: ["PCI-DSS"],
        securityStandards: ["Retail Security Standards"],
        dataClassification: "internal",
        notes: "High-traffic flagship store with extensive guest WiFi and POS security requirements.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("retail", 24)
    return [...sites, ...additionalSites]
  }

  private generateRetailGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-retail-1",
        name: "Guest WiFi Access Policy",
        description: "Secure guest WiFi with time-based access and bandwidth limits",
        category: "guest_access",
        type: "bandwidth",
        priority: 3,
        conditions: [
          {
            type: "user_group",
            operator: "equals",
            value: "Guest",
            description: "Guest network users",
          },
        ],
        actions: [
          {
            type: "bandwidth_limit",
            parameters: { download: "25Mbps", upload: "5Mbps", duration: "4h" },
            description: "Limited bandwidth for guest access",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "business_hours", timeZone: "America/New_York" },
        tags: ["retail", "guest-wifi", "bandwidth"],
        version: "1.0",
        approvedBy: "user-retail-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateRetailEvents(): Event[] {
    return [
      {
        id: "event-retail-1",
        title: "Black Friday Network Preparation",
        description: "Network capacity and security preparation for Black Friday shopping event",
        startDate: "2024-11-20T08:00:00",
        endDate: "2024-11-20T18:00:00",
        type: "deployment",
        priority: "critical",
        assignedTo: "user-retail-1",
        siteId: "site-retail-1",
        status: "scheduled",
        attendees: ["user-retail-1", "user-retail-3", "user-retail-5"],
        location: "Flagship Store - Times Square",
        meetingType: "in-person",
        prerequisites: ["Capacity planning", "Performance testing"],
        deliverables: ["Network readiness confirmation", "Monitoring setup"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateGovernmentUsers(): User[] {
    return [
      {
        id: "user-gov-1",
        name: "Colonel David Mitchell",
        email: "david.mitchell@fedtech.gov",
        role: "admin",
        department: "Cybersecurity",
        title: "Chief Information Security Officer",
        phone: "+1 (555) 234-8901",
        isActive: true,
        specialties: ["Government Security", "FISMA Compliance", "FedRAMP", "CMMC"],
        certifications: ["CISSP", "CISM", "CAP", "Security+"],
        skills: ["Risk Management Framework", "Authority to Operate", "STIG Implementation"],
        languages: ["English"],
        timeZone: "America/Washington",
        availability: {
          hoursPerWeek: 50,
          preferredSchedule: "business-hours",
          vacationDays: ["2024-07-04", "2024-11-11", "2024-12-25"],
        },
        vendorRelationships: ["Portnox", "Cisco", "Juniper"],
        projectHistory: ["FedRAMP Authorization 2023", "CMMC Implementation"],
        performanceRating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateGovernmentSites(): Site[] {
    const sites = [
      {
        id: "site-gov-1",
        name: "Federal Building - Washington DC",
        location: "Washington, DC",
        region: "North America",
        country: "United States",
        state: "Washington DC",
        city: "Washington",
        siteType: "headquarters" as const,
        status: "implementation" as const,
        priority: "critical" as const,
        phase: "Phase 3 - Configuration",
        users: 2200,
        devices: 4800,
        deviceBreakdown: {
          windows: 3200,
          mac: 180,
          linux: 250,
          ios: 520,
          android: 280,
          iot: 180,
          medical: 0,
          printers: 120,
          cameras: 85,
          voip: 380,
          kiosks: 25,
          tablets: 180,
          chromeos: 25,
          other: 150,
        },
        assignedUsers: {
          projectManagers: ["user-gov-2"],
          technicalOwners: ["user-gov-3"],
          siteOwners: ["user-gov-4"],
          systemsEngineers: ["user-gov-5"],
          accountExecutives: ["user-gov-6"],
          technicalAccountManagers: ["user-gov-7"],
          technicians: ["user-gov-8", "user-gov-9"],
          securitySpecialists: ["user-gov-1"],
        },
        startDate: "2024-02-01",
        targetDate: "2024-08-31",
        progress: 62,
        milestones: [],
        wiredInfrastructure: {
          vendor: "juniper",
          switchModels: ["EX4650", "QFX5100"],
          switchCount: 85,
          portCount: 2040,
          stackingSupport: true,
          poeSupport: true,
          mgmtVlan: 1,
          firmware: "21.4R2",
        },
        wirelessInfrastructure: {
          vendor: "juniper-mist",
          controllerModel: "Cloud",
          apModels: ["AP63", "AP43"],
          apCount: 280,
          wifiStandards: ["802.11ax"],
          bandSupport: ["2.4GHz", "5GHz", "6GHz"],
          meshSupport: false,
          firmware: "0.16.31245",
        },
        connectivity: {
          type: "mpls",
          bandwidth: "10Gbps",
          provider: "General Services Administration",
          redundancy: true,
          backupType: "fiber",
        },
        identityProvider: {
          type: "active-directory",
          domain: "fedtech.local",
          syncEnabled: true,
          mfaEnabled: true,
          conditionalAccess: true,
        },
        mdmProvider: {
          type: "blackberry",
          enrollmentType: "automatic",
          complianceEnabled: true,
          appManagement: true,
        },
        firewallInfrastructure: {
          vendor: "juniper",
          models: ["SRX1500", "SRX4600"],
          haConfiguration: true,
          userIdIntegration: true,
          syslogEnabled: true,
          firmware: "21.2R3",
        },
        radiusConfiguration: {
          type: "on-premise-radius",
          vendor: "freeradius",
          clustering: true,
          loadBalancing: true,
          certificates: true,
        },
        deviceAdministration: {
          type: "both",
          vendor: "freeradius",
          privilegeLevels: [1, 7, 15],
          commandAuthorization: true,
        },
        vlans: 45,
        subnets: ["172.31.0.0/16", "172.32.0.0/16"],
        dhcpScopes: 25,
        dnsServers: ["172.31.1.10", "172.31.1.11"],
        globalPolicies: ["global-policy-gov-1"],
        sitePolicies: [],
        policyEnforcement: {
          dynamic_vlan: true,
          bandwidth_control: true,
          time_based_access: true,
          device_compliance: true,
          location_based: true,
        },
        complianceRequirements: ["FISMA", "FedRAMP", "NIST 800-53", "CMMC Level 3"],
        securityStandards: ["NIST Risk Management Framework", "NIST 800-171", "DISA STIGs"],
        dataClassification: "restricted",
        notes: "Federal government facility requiring highest security standards and continuous monitoring.",
        deploymentChecklist: [],
        riskAssessment: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const additionalSites = this.generateRandomizedSites("government", 7)
    return [...sites, ...additionalSites]
  }

  private generateGovernmentGlobalPolicies(): GlobalPolicy[] {
    return [
      {
        id: "global-policy-gov-1",
        name: "FISMA Compliance Policy",
        description: "Federal Information Security Management Act compliance for all government systems",
        category: "compliance",
        type: "security",
        priority: 1,
        conditions: [
          {
            type: "device_type",
            operator: "in",
            value: ["Government Workstation", "Classified System"],
            description: "Government managed devices",
          },
        ],
        actions: [
          {
            type: "vlan_assign",
            parameters: { vlan: "1", encryption: "mandatory", monitoring: "continuous" },
            description: "Secure government network with mandatory encryption",
            priority: 1,
          },
        ],
        enabled: true,
        applicableSites: [],
        schedule: { type: "always", timeZone: "UTC" },
        tags: ["government", "fisma", "compliance"],
        version: "1.0",
        approvedBy: "user-gov-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private generateGovernmentEvents(): Event[] {
    return [
      {
        id: "event-gov-1",
        title: "Authority to Operate (ATO) Review",
        description: "Annual security assessment for Authority to Operate renewal",
        startDate: "2024-07-15T09:00:00",
        endDate: "2024-07-15T17:00:00",
        type: "review",
        priority: "critical",
        assignedTo: "user-gov-1",
        siteId: "site-gov-1",
        status: "scheduled",
        attendees: ["user-gov-1", "user-gov-3", "user-gov-5"],
        location: "Federal Building - SCIF Room",
        meetingType: "in-person",
        prerequisites: ["Security documentation", "Risk assessment"],
        deliverables: ["ATO renewal documentation", "Security controls validation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  // Data Import/Export
  async exportData(): Promise<string> {
    const data = this.getData()
    return JSON.stringify(data, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonData) as AppData

      // Validate the imported data structure
      if (!importedData.sites || !importedData.events || !importedData.users || !importedData.preferences) {
        throw new Error("Invalid data format")
      }

      // Merge with current data or replace completely
      this.saveData({
        ...importedData,
        version: this.VERSION,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error importing data:", error)
      throw new Error("Failed to import data")
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  // Get storage statistics
  async getStorageStats(): Promise<{
    sitesCount: number
    eventsCount: number
    usersCount: number
    globalPoliciesCount: number
    storageSize: number
    lastUpdated: string
  }> {
    const data = this.getData()
    const storageSize = new Blob([JSON.stringify(data)]).size

    return {
      sitesCount: data.sites.length,
      eventsCount: data.events.length,
      usersCount: data.users.length,
      globalPoliciesCount: data.globalPolicies.length,
      storageSize,
      lastUpdated: data.lastUpdated,
    }
  }
}

export const storage = new StorageManager()
