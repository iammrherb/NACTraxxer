// Storage utility for managing application data
export interface Site {
  id: string
  name: string
  location: string
  city?: string
  state?: string
  country?: string
  region?: string
  industry?: string
  type?: string
  status: string
  priority?: string
  budget?: number
  timeline?: string
  users?: number
  devices?: number | { [key: string]: number }
  completionPercent?: number
  projectManager?: string
  technicalOwner?: string
  userCounts?: {
    total: number
    employees: number
    contractors: number
    guests: number
  }
  deviceCounts?: {
    total: number
    windows: number
    mac: number
    ios: number
    android: number
    linux: number
    iot: number
  }
  infrastructure?: {
    wiredVendor: string
    wirelessVendor: string
    firewallVendor: string
    switches: number
    accessPoints: number
    firewalls: number
  }
  connectivity?: {
    internet: boolean
    mpls: boolean
    vpn: boolean
    sdwan: boolean
    satellite: boolean
  }
  identityProviders?: string
  mdmProvider?: string
  authTypes?: string[]
  deviceTypes?: string[]
  phases?: Array<{
    name: string
    status: string
    progress: number
    startDate?: string
    endDate?: string
  }>
  compliance?: string[]
  specialRequirements?: string[]
  networkSegments?: string[]
  riskLevel?: string
  notes?: string
  phase?: string
}

export interface Policy {
  id: string
  name: string
  description: string
  type: string
  status: string
  priority?: string
  effectiveness?: number
  compliance?: string[]
  conditions?: string[]
  actions?: string[]
  appliedSites?: string[]
  violations?: number
  createdAt?: string
  updatedAt?: string
  category?: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: string
  status: string
  priority: string
  startDate: string
  endDate: string
  assignedTo: string[]
  siteId?: string
  progress?: number
  tags?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  sites: string[]
  permissions: string[]
  lastLogin: string
  status: string
}

export interface ArchitectureConfig {
  selectedSite?: string
  industry: string
  deployment: string
  connectivity: string[]
  wiredVendor: string
  wirelessVendor: string
  firewallVendor: string
  identityProvider: string[]
  mdmProvider: string[]
  radiusType: string
  deviceAdmin: string
  authTypes: string[]
  deviceTypes: string[]
  complianceFrameworks: string[]
  securityFeatures: string[]
  networkSegmentation: boolean
  guestAccess: boolean
  iotSupport: boolean
  cloudIntegration: boolean
  onPremiseIntegration: boolean
  hybridDeployment: boolean
  animations: boolean
  showMetrics: boolean
  showConnections: boolean
  animationSpeed: number
  zoomLevel: number
  selectedView: string
  customColors: {
    primary: string
    secondary: string
    accent: string
  }
}

// Enhanced industry scenarios with comprehensive data
const INDUSTRY_SCENARIOS = {
  healthcare: {
    id: "healthcare",
    name: "Regional Healthcare System",
    industry: "healthcare",
    description: "Multi-facility healthcare system with HIPAA compliance requirements and medical device integration",
    userCount: 2500,
    siteCount: 5,
    budget: 1500000,
    timeline: "6 months",
    compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11", "Joint Commission"],
    specialties: [
      "Medical Device Security",
      "Patient Data Protection",
      "Compliance Automation",
      "Telemedicine Support",
    ],
    icon: "🏥",
    color: "bg-red-50 border-red-200",
    sites: [
      {
        name: "Main Hospital Campus",
        type: "Hospital",
        location: "Downtown Medical Center",
        users: 1500,
        devices: 5250,
        priority: "Critical",
        budget: 900000,
        specialRequirements: ["24/7 Operations", "Emergency Access", "Medical Device Integration"],
      },
      {
        name: "Outpatient Clinic Network",
        type: "Clinic",
        location: "Suburban Locations (5 sites)",
        users: 450,
        devices: 1575,
        priority: "High",
        budget: 270000,
        specialRequirements: ["Telemedicine", "Mobile Device Support", "Patient Portal Access"],
      },
      {
        name: "Research Facility",
        type: "Research",
        location: "University Campus",
        users: 180,
        devices: 630,
        priority: "Medium",
        budget: 180000,
        specialRequirements: ["Data Isolation", "Collaboration Tools", "High-Performance Computing"],
      },
      {
        name: "Emergency Services Center",
        type: "Emergency",
        location: "Regional Hub",
        users: 220,
        devices: 770,
        priority: "Critical",
        budget: 150000,
        specialRequirements: ["24/7 Availability", "Redundant Systems", "Mobile Units"],
      },
      {
        name: "Administrative Offices",
        type: "Administrative",
        location: "Corporate Campus",
        users: 150,
        devices: 525,
        priority: "Medium",
        budget: 100000,
        specialRequirements: ["Business Operations", "Financial Systems", "HR Systems"],
      },
    ],
  },
  financial: {
    id: "financial",
    name: "Global Investment Bank",
    industry: "financial services",
    description: "International banking institution with strict regulatory compliance and high-frequency trading",
    userCount: 1800,
    siteCount: 3,
    budget: 1200000,
    timeline: "4 months",
    compliance: ["PCI DSS", "SOX", "GDPR", "MiFID II", "FFIEC"],
    specialties: ["Trading Floor Security", "Fraud Detection", "Regulatory Compliance", "High-Frequency Trading"],
    icon: "🏦",
    color: "bg-green-50 border-green-200",
    sites: [
      {
        name: "Corporate Headquarters",
        type: "Headquarters",
        location: "Financial District",
        users: 1200,
        devices: 4200,
        priority: "Critical",
        budget: 720000,
        specialRequirements: ["Trading Floor", "Executive Protection", "Disaster Recovery"],
      },
      {
        name: "Regional Branch Network",
        type: "Branch",
        location: "Multiple Cities (12 branches)",
        users: 400,
        devices: 1400,
        priority: "High",
        budget: 320000,
        specialRequirements: ["Customer Access", "ATM Integration", "Vault Security"],
      },
      {
        name: "Data Center Facility",
        type: "Data Center",
        location: "Secure Location",
        users: 200,
        devices: 700,
        priority: "Critical",
        budget: 160000,
        specialRequirements: ["Physical Security", "Environmental Monitoring", "Backup Systems"],
      },
    ],
  },
  manufacturing: {
    id: "manufacturing",
    name: "Advanced Manufacturing Corp",
    industry: "manufacturing",
    description: "Industrial manufacturing with OT/IT convergence and smart factory initiatives",
    userCount: 1200,
    siteCount: 4,
    budget: 900000,
    timeline: "5 months",
    compliance: ["IEC 62443", "NIST 800-82", "ISO 27001", "OSHA"],
    specialties: ["OT Security", "Industrial Control Systems", "Smart Factory", "Predictive Maintenance"],
    icon: "🏭",
    color: "bg-blue-50 border-blue-200",
    sites: [
      {
        name: "Primary Manufacturing Plant",
        type: "Manufacturing",
        location: "Industrial Complex",
        users: 600,
        devices: 2100,
        priority: "Critical",
        budget: 450000,
        specialRequirements: ["24/7 Production", "Safety Systems", "Environmental Monitoring"],
      },
      {
        name: "Assembly Facilities",
        type: "Assembly",
        location: "Multiple Locations (3 sites)",
        users: 300,
        devices: 1050,
        priority: "High",
        budget: 270000,
        specialRequirements: ["Just-in-Time Production", "Quality Control", "Logistics Integration"],
      },
      {
        name: "R&D Center",
        type: "Research",
        location: "Technology Park",
        users: 200,
        devices: 700,
        priority: "High",
        budget: 120000,
        specialRequirements: ["IP Protection", "Collaboration Tools", "Prototype Testing"],
      },
      {
        name: "Warehouse & Distribution",
        type: "Warehouse",
        location: "Logistics Hub",
        users: 100,
        devices: 350,
        priority: "Medium",
        budget: 60000,
        specialRequirements: ["Inventory Tracking", "Automated Systems", "Supply Chain Integration"],
      },
    ],
  },
  technology: {
    id: "technology",
    name: "Cloud-Native Tech Startup",
    industry: "technology",
    description: "Fast-growing technology company with cloud-first architecture and global remote workforce",
    userCount: 800,
    siteCount: 2,
    budget: 600000,
    timeline: "3 months",
    compliance: ["SOC 2", "GDPR", "ISO 27001", "FedRAMP"],
    specialties: ["Cloud Security", "DevSecOps", "Zero Trust", "Remote Work Security"],
    icon: "💻",
    color: "bg-purple-50 border-purple-200",
    sites: [
      {
        name: "Corporate Campus",
        type: "Campus",
        location: "Silicon Valley",
        users: 600,
        devices: 2100,
        priority: "Critical",
        budget: 450000,
        specialRequirements: ["Open Collaboration", "BYOD Support", "Cloud Integration"],
      },
      {
        name: "Development Centers",
        type: "Development",
        location: "Multiple Cities (4 sites)",
        users: 200,
        devices: 700,
        priority: "High",
        budget: 150000,
        specialRequirements: ["High-Performance Computing", "Secure Development", "Remote Access"],
      },
    ],
  },
  retail: {
    id: "retail",
    name: "Omnichannel Retail Chain",
    industry: "retail",
    description: "Multi-location retail chain with e-commerce integration and customer data analytics",
    userCount: 1500,
    siteCount: 8,
    budget: 1000000,
    timeline: "4 months",
    compliance: ["PCI DSS", "CCPA", "GDPR", "SOX"],
    specialties: ["POS Security", "Customer Data Protection", "Omnichannel Integration", "Loss Prevention"],
    icon: "🛍️",
    color: "bg-yellow-50 border-yellow-200",
    sites: [
      {
        name: "Flagship Store",
        type: "Retail Store",
        location: "Premium Shopping District",
        users: 150,
        devices: 525,
        priority: "High",
        budget: 150000,
        specialRequirements: ["High Customer Traffic", "Premium Experience", "Loss Prevention"],
      },
      {
        name: "Regional Store Network",
        type: "Store Network",
        location: "Multiple Locations (24 stores)",
        users: 960,
        devices: 3360,
        priority: "High",
        budget: 600000,
        specialRequirements: ["Standardized Deployment", "Remote Management", "Seasonal Scaling"],
      },
      {
        name: "Distribution Center",
        type: "Warehouse",
        location: "Logistics Hub",
        users: 200,
        devices: 700,
        priority: "Medium",
        budget: 120000,
        specialRequirements: ["Inventory Tracking", "Logistics Integration", "Automated Systems"],
      },
      {
        name: "Corporate Headquarters",
        type: "Corporate",
        location: "Business District",
        users: 190,
        devices: 665,
        priority: "High",
        budget: 130000,
        specialRequirements: ["Executive Operations", "Financial Systems", "Marketing Analytics"],
      },
    ],
  },
  education: {
    id: "education",
    name: "State University System",
    industry: "education",
    description: "Large university campus with research facilities, student housing, and administrative buildings",
    userCount: 25000,
    siteCount: 6,
    budget: 1800000,
    timeline: "8 months",
    compliance: ["FERPA", "CIPA", "FISMA", "HIPAA"],
    specialties: ["Student Privacy", "Research Security", "BYOD Management", "Campus Safety"],
    icon: "🎓",
    color: "bg-indigo-50 border-indigo-200",
    sites: [
      {
        name: "Main Campus",
        type: "University",
        location: "University Town",
        users: 15000,
        devices: 52500,
        priority: "Critical",
        budget: 1080000,
        specialRequirements: ["24/7 Student Access", "Research Support", "Campus-wide Coverage"],
      },
      {
        name: "Satellite Campuses",
        type: "Branch Campus",
        location: "Multiple Cities (3 campuses)",
        users: 6000,
        devices: 21000,
        priority: "High",
        budget: 432000,
        specialRequirements: ["Distance Learning", "Resource Sharing", "Unified Management"],
      },
      {
        name: "Research Facilities",
        type: "Research",
        location: "Science Park",
        users: 2000,
        devices: 7000,
        priority: "High",
        budget: 144000,
        specialRequirements: ["High-Security Labs", "Collaboration Tools", "Data Protection"],
      },
      {
        name: "Student Housing",
        type: "Residential",
        location: "Campus Dormitories",
        users: 1500,
        devices: 5250,
        priority: "Medium",
        budget: 108000,
        specialRequirements: ["Student Privacy", "24/7 Access", "Bandwidth Management"],
      },
      {
        name: "Administrative Buildings",
        type: "Administrative",
        location: "Campus Center",
        users: 400,
        devices: 1400,
        priority: "High",
        budget: 28800,
        specialRequirements: ["Student Records", "Financial Systems", "HR Operations"],
      },
      {
        name: "Library & Learning Centers",
        type: "Academic",
        location: "Multiple Campus Locations",
        users: 100,
        devices: 350,
        priority: "Medium",
        budget: 7200,
        specialRequirements: ["Study Spaces", "Digital Resources", "Collaboration Areas"],
      },
    ],
  },
  government: {
    id: "government",
    name: "Federal Agency",
    industry: "government",
    description: "Federal government agency with classified and unclassified networks",
    userCount: 2000,
    siteCount: 3,
    budget: 2500000,
    timeline: "12 months",
    compliance: ["FISMA", "NIST 800-53", "FedRAMP", "CJIS"],
    specialties: ["Classified Security", "FISMA Compliance", "Continuous Monitoring", "Insider Threat"],
    icon: "🏛️",
    color: "bg-gray-50 border-gray-200",
    sites: [
      {
        name: "Federal Building Complex",
        type: "Government",
        location: "Capital District",
        users: 1400,
        devices: 4900,
        priority: "Critical",
        budget: 1750000,
        specialRequirements: ["Security Clearance Levels", "Physical Security", "Continuity of Operations"],
      },
      {
        name: "Regional Offices",
        type: "Regional Office",
        location: "Multiple States (8 offices)",
        users: 480,
        devices: 1680,
        priority: "High",
        budget: 600000,
        specialRequirements: ["Secure Communications", "Public Access", "Disaster Recovery"],
      },
      {
        name: "Emergency Operations Center",
        type: "Emergency",
        location: "Secure Facility",
        users: 120,
        devices: 420,
        priority: "Critical",
        budget: 150000,
        specialRequirements: ["24/7 Operations", "Redundant Systems", "Multi-Agency Coordination"],
      },
    ],
  },
}

class Storage {
  private isClient = typeof window !== "undefined"

  // Sites
  async getSites(): Promise<Site[]> {
    if (!this.isClient) return []
    try {
      const data = localStorage.getItem("portnox_sites")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading sites:", error)
      return []
    }
  }

  async saveSites(sites: Site[]): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_sites", JSON.stringify(sites))
    } catch (error) {
      console.error("Error saving sites:", error)
    }
  }

  // Policies
  async getGlobalPolicies(): Promise<Policy[]> {
    if (!this.isClient) return []
    try {
      const data = localStorage.getItem("portnox_global_policies")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading global policies:", error)
      return []
    }
  }

  async saveGlobalPolicies(policies: Policy[]): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_global_policies", JSON.stringify(policies))
    } catch (error) {
      console.error("Error saving global policies:", error)
    }
  }

  // Events
  async getEvents(): Promise<Event[]> {
    if (!this.isClient) return []
    try {
      const data = localStorage.getItem("portnox_events")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading events:", error)
      return []
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_events", JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events:", error)
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    if (!this.isClient) return []
    try {
      const data = localStorage.getItem("portnox_users")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  }

  async saveUsers(users: User[]): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_users", JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  // Architecture Configuration
  async getArchitectureConfig(): Promise<ArchitectureConfig | null> {
    if (!this.isClient) return null
    try {
      const data = localStorage.getItem("portnox_architecture_config")
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error loading architecture config:", error)
      return null
    }
  }

  async saveArchitectureConfig(config: ArchitectureConfig): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_architecture_config", JSON.stringify(config))
    } catch (error) {
      console.error("Error saving architecture config:", error)
    }
  }

  // Theme and Preferences
  async getTheme(): Promise<string> {
    if (!this.isClient) return "light"
    try {
      return localStorage.getItem("portnox_theme") || "light"
    } catch (error) {
      console.error("Error loading theme:", error)
      return "light"
    }
  }

  async saveTheme(theme: string): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_theme", theme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  // Customer Logo and Branding
  async getCustomerLogo(): Promise<string | null> {
    if (!this.isClient) return null
    try {
      return localStorage.getItem("portnox_customer_logo")
    } catch (error) {
      console.error("Error loading customer logo:", error)
      return null
    }
  }

  async saveCustomerLogo(logoUrl: string): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_customer_logo", logoUrl)
    } catch (error) {
      console.error("Error saving customer logo:", error)
    }
  }

  async getCompanyName(): Promise<string> {
    if (!this.isClient) return "Your Company"
    try {
      return localStorage.getItem("portnox_company_name") || "Your Company"
    } catch (error) {
      console.error("Error loading company name:", error)
      return "Your Company"
    }
  }

  async saveCompanyName(name: string): Promise<void> {
    if (!this.isClient) return
    try {
      localStorage.setItem("portnox_company_name", name)
    } catch (error) {
      console.error("Error saving company name:", error)
    }
  }

  // Generate comprehensive demo data
  async generateDemoData(industryKey: string): Promise<void> {
    if (!this.isClient) return

    const scenario = INDUSTRY_SCENARIOS[industryKey as keyof typeof INDUSTRY_SCENARIOS]
    if (!scenario) {
      throw new Error(`Unknown industry scenario: ${industryKey}`)
    }

    try {
      // Generate sites based on scenario
      const sites: Site[] = scenario.sites.map((siteTemplate, index) => {
        const siteId = `${industryKey}-site-${index + 1}`
        const completionPercent = Math.floor(Math.random() * 100)
        const phases = this.generatePhases(completionPercent)

        return {
          id: siteId,
          name: siteTemplate.name,
          location: siteTemplate.location,
          city: this.getRandomCity(),
          state: this.getRandomState(),
          country: "United States",
          region: this.getRandomRegion(),
          industry: scenario.industry,
          type: siteTemplate.type,
          status: this.getRandomStatus(),
          priority: siteTemplate.priority,
          budget: siteTemplate.budget,
          timeline: scenario.timeline,
          users: siteTemplate.users,
          devices: siteTemplate.devices,
          completionPercent,
          projectManager: this.getRandomProjectManager(),
          technicalOwner: this.getRandomTechnicalOwner(),
          userCounts: {
            total: siteTemplate.users,
            employees: Math.floor(siteTemplate.users * 0.8),
            contractors: Math.floor(siteTemplate.users * 0.15),
            guests: Math.floor(siteTemplate.users * 0.05),
          },
          deviceCounts: {
            total: siteTemplate.devices,
            windows: Math.floor(siteTemplate.devices * 0.45),
            mac: Math.floor(siteTemplate.devices * 0.25),
            ios: Math.floor(siteTemplate.devices * 0.15),
            android: Math.floor(siteTemplate.devices * 0.1),
            linux: Math.floor(siteTemplate.devices * 0.03),
            iot: Math.floor(siteTemplate.devices * 0.02),
          },
          infrastructure: {
            wiredVendor: this.getRandomWiredVendor(),
            wirelessVendor: this.getRandomWirelessVendor(),
            firewallVendor: this.getRandomFirewallVendor(),
            switches: Math.floor(siteTemplate.devices / 48) + 1,
            accessPoints: Math.floor(siteTemplate.devices / 25) + 1,
            firewalls: Math.floor(Math.random() * 3) + 1,
          },
          connectivity: {
            internet: true,
            mpls: Math.random() > 0.5,
            vpn: true,
            sdwan: Math.random() > 0.3,
            satellite: Math.random() > 0.8,
          },
          identityProviders: this.getRandomIdentityProvider(),
          mdmProvider: this.getRandomMDMProvider(),
          authTypes: ["802.1x", "mac_auth", "web_auth"],
          deviceTypes: this.getIndustryDeviceTypes(scenario.industry),
          phases,
          compliance: scenario.compliance,
          specialRequirements: siteTemplate.specialRequirements,
          networkSegments: this.getIndustryNetworkSegments(scenario.industry),
          riskLevel: this.getRandomRiskLevel(),
          notes: `${siteTemplate.type} facility for ${scenario.name}`,
          phase: phases.find((p) => p.status === "In Progress")?.name || "Planning & Design",
        }
      })

      // Generate users
      const users: User[] = this.generateUsers(scenario, sites)

      // Generate events
      const events: Event[] = this.generateEvents(scenario, sites, users)

      // Generate policies
      const policies: Policy[] = this.generatePolicies(scenario, sites)

      // Save all data
      await this.saveSites(sites)
      await this.saveUsers(users)
      await this.saveEvents(events)
      await this.saveGlobalPolicies(policies)

      console.log(`Generated demo data for ${scenario.name}:`, {
        sites: sites.length,
        users: users.length,
        events: events.length,
        policies: policies.length,
      })
    } catch (error) {
      console.error("Error generating demo data:", error)
      throw error
    }
  }

  private generatePhases(
    completionPercent: number,
  ): Array<{ name: string; status: string; progress: number; startDate?: string; endDate?: string }> {
    const phases = [
      { name: "Planning & Design", progress: 0, status: "Pending" },
      { name: "Infrastructure Deployment", progress: 0, status: "Pending" },
      { name: "Policy Configuration", progress: 0, status: "Pending" },
      { name: "Testing & Validation", progress: 0, status: "Pending" },
      { name: "Production Rollout", progress: 0, status: "Pending" },
    ]

    let remainingProgress = completionPercent
    for (let i = 0; i < phases.length && remainingProgress > 0; i++) {
      if (remainingProgress >= 100) {
        phases[i].progress = 100
        phases[i].status = "Complete"
        remainingProgress -= 100
      } else if (remainingProgress > 0) {
        phases[i].progress = remainingProgress
        phases[i].status = "In Progress"
        remainingProgress = 0
      }
    }

    return phases.map((phase, index) => ({
      ...phase,
      startDate: new Date(Date.now() - (phases.length - index) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + index * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  private generateUsers(scenario: any, sites: Site[]): User[] {
    const roles = [
      "Network Administrator",
      "Security Analyst",
      "Project Manager",
      "System Engineer",
      "Compliance Officer",
      "IT Director",
      "Security Manager",
      "Network Engineer",
    ]

    const departments = ["IT", "Security", "Operations", "Compliance", "Engineering", "Management"]

    const users: User[] = []
    const userCount = Math.min(20, Math.floor(scenario.userCount / 100)) // Generate reasonable number of users

    for (let i = 0; i < userCount; i++) {
      const firstName = this.getRandomFirstName()
      const lastName = this.getRandomLastName()
      const role = roles[Math.floor(Math.random() * roles.length)]
      const department = departments[Math.floor(Math.random() * departments.length)]

      users.push({
        id: `${scenario.id}-user-${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${scenario.id}.com`,
        role,
        department,
        sites: sites.slice(0, Math.floor(Math.random() * sites.length) + 1).map((s) => s.id),
        permissions: this.getRolePermissions(role),
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? "active" : "inactive",
      })
    }

    return users
  }

  private generateEvents(scenario: any, sites: Site[], users: User[]): Event[] {
    const eventTypes = ["milestone", "task", "meeting", "deployment", "rollout", "planning"]
    const priorities = ["low", "medium", "high", "critical"]
    const statuses = ["pending", "in_progress", "completed", "cancelled", "scheduled"]

    const events: Event[] = []
    const eventCount = sites.length * 3 // 3 events per site

    for (let i = 0; i < eventCount; i++) {
      const site = sites[Math.floor(Math.random() * sites.length)]
      const assignedUsers = users.filter((u) => u.sites.includes(site.id)).slice(0, Math.floor(Math.random() * 3) + 1)

      events.push({
        id: `${scenario.id}-event-${i + 1}`,
        title: `${site.name} - ${this.getRandomEventTitle()}`,
        description: `${this.getRandomEventDescription()} for ${site.name}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        startDate: new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(
          Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000 + Math.random() * 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        assignedTo: assignedUsers.map((u) => u.name),
        siteId: site.id,
        progress: Math.floor(Math.random() * 100),
        tags: this.getRandomEventTags(),
      })
    }

    return events
  }

  private generatePolicies(scenario: any, sites: Site[]): Policy[] {
    const policyTypes = ["Device Access", "Network Access", "Guest Access", "IoT Access", "Admin Access"]
    const priorities = ["Low", "Medium", "High", "Critical"]
    const statuses = ["active", "inactive", "draft"]

    const policies: Policy[] = []

    // Generate global policies
    for (let i = 0; i < 5; i++) {
      policies.push({
        id: `${scenario.id}-policy-${i + 1}`,
        name: `${scenario.name} - ${policyTypes[i]} Policy`,
        description: `${policyTypes[i]} policy for ${scenario.name} environment`,
        type: policyTypes[i],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        effectiveness: Math.floor(Math.random() * 30) + 70, // 70-100%
        compliance: scenario.compliance,
        conditions: this.getPolicyConditions(policyTypes[i]),
        actions: this.getPolicyActions(policyTypes[i]),
        appliedSites: sites.map((s) => s.id),
        violations: Math.floor(Math.random() * 10),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: this.getPolicyCategory(policyTypes[i]),
      })
    }

    return policies
  }

  // Helper methods for random data generation
  private getRandomCity(): string {
    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
    ]
    return cities[Math.floor(Math.random() * cities.length)]
  }

  private getRandomState(): string {
    const states = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI"]
    return states[Math.floor(Math.random() * states.length)]
  }

  private getRandomRegion(): string {
    const regions = ["North America", "Europe", "Asia Pacific", "Latin America"]
    return regions[Math.floor(Math.random() * regions.length)]
  }

  private getRandomStatus(): string {
    const statuses = ["Planning", "In Progress", "Complete", "On Hold"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  private getRandomProjectManager(): string {
    const names = [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Lisa Chen",
      "David Wilson",
      "Emily Brown",
      "Chris Taylor",
      "Amanda Garcia",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRandomTechnicalOwner(): string {
    const names = [
      "Alex Rodriguez",
      "Jennifer Lee",
      "Robert Kim",
      "Michelle Wang",
      "Kevin Martinez",
      "Rachel Thompson",
      "Daniel Anderson",
      "Jessica Miller",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRandomWiredVendor(): string {
    const vendors = ["cisco", "aruba", "juniper", "extreme", "dell"]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  private getRandomWirelessVendor(): string {
    const vendors = ["cisco", "aruba", "ruckus", "meraki", "extreme"]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  private getRandomFirewallVendor(): string {
    const vendors = ["palo_alto", "fortinet", "checkpoint", "cisco", "juniper"]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  private getRandomIdentityProvider(): string {
    const providers = ["azure_ad", "okta", "ping", "active_directory", "onelogin"]
    return providers[Math.floor(Math.random() * providers.length)]
  }

  private getRandomMDMProvider(): string {
    const providers = ["intune", "jamf", "workspace_one", "mobileiron", "airwatch"]
    return providers[Math.floor(Math.random() * providers.length)]
  }

  private getRandomRiskLevel(): string {
    const levels = ["Low", "Medium", "High", "Critical"]
    return levels[Math.floor(Math.random() * levels.length)]
  }

  private getRandomFirstName(): string {
    const names = [
      "John",
      "Sarah",
      "Mike",
      "Lisa",
      "David",
      "Emily",
      "Chris",
      "Amanda",
      "Alex",
      "Jennifer",
      "Robert",
      "Michelle",
      "Kevin",
      "Rachel",
      "Daniel",
      "Jessica",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRandomLastName(): string {
    const names = [
      "Smith",
      "Johnson",
      "Davis",
      "Chen",
      "Wilson",
      "Brown",
      "Taylor",
      "Garcia",
      "Rodriguez",
      "Lee",
      "Kim",
      "Wang",
      "Martinez",
      "Thompson",
      "Anderson",
      "Miller",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRolePermissions(role: string): string[] {
    const permissionMap: { [key: string]: string[] } = {
      "Network Administrator": ["admin", "deploy", "configure", "monitor"],
      "Security Analyst": ["security", "audit", "monitor", "investigate"],
      "Project Manager": ["project", "schedule", "report", "coordinate"],
      "System Engineer": ["engineer", "deploy", "configure", "troubleshoot"],
      "Compliance Officer": ["compliance", "audit", "report", "review"],
      "IT Director": ["admin", "approve", "budget", "strategy"],
      "Security Manager": ["security", "admin", "approve", "investigate"],
      "Network Engineer": ["engineer", "configure", "monitor", "troubleshoot"],
    }
    return permissionMap[role] || ["basic", "read"]
  }

  private getIndustryDeviceTypes(industry: string): string[] {
    const deviceTypeMap: { [key: string]: string[] } = {
      healthcare: [
        "Medical Workstations",
        "Imaging Equipment",
        "Patient Monitors",
        "Infusion Pumps",
        "Mobile Carts",
        "Tablets",
        "Smartphones",
      ],
      "financial services": [
        "Trading Workstations",
        "ATM Networks",
        "POS Systems",
        "Mobile Banking Devices",
        "Compliance Systems",
        "Executive Devices",
      ],
      manufacturing: [
        "HMI Workstations",
        "PLC Controllers",
        "SCADA Systems",
        "Industrial Sensors",
        "Maintenance Tablets",
        "Quality Control Systems",
      ],
      technology: [
        "Developer Workstations",
        "Cloud Instances",
        "Mobile Devices",
        "Testing Equipment",
        "IoT Prototypes",
        "Remote Work Laptops",
      ],
      retail: [
        "POS Systems",
        "Inventory Scanners",
        "Security Cameras",
        "Mobile POS",
        "Customer Kiosks",
        "Staff Tablets",
        "RFID Readers",
      ],
      education: [
        "Student Laptops",
        "Classroom Tablets",
        "Interactive Whiteboards",
        "Research Workstations",
        "BYOD Smartphones",
        "Faculty Devices",
      ],
      government: [
        "Secure Workstations",
        "Mobile Command Units",
        "Surveillance Systems",
        "Communication Devices",
        "Biometric Scanners",
        "Field Tablets",
      ],
    }
    return deviceTypeMap[industry] || ["Workstations", "Mobile Devices", "IoT Devices"]
  }

  private getIndustryNetworkSegments(industry: string): string[] {
    const segmentMap: { [key: string]: string[] } = {
      healthcare: [
        "Clinical Network",
        "Administrative Network",
        "Medical Device Network",
        "Guest Network",
        "Research Network",
      ],
      "financial services": [
        "Trading Network",
        "Corporate Network",
        "Customer Network",
        "Compliance Network",
        "ATM Network",
      ],
      manufacturing: [
        "Production Network",
        "Corporate Network",
        "Safety Network",
        "Maintenance Network",
        "Quality Network",
      ],
      technology: [
        "Development Network",
        "Production Network",
        "Testing Network",
        "Corporate Network",
        "Guest Network",
      ],
      retail: ["POS Network", "Corporate Network", "Inventory Network", "Security Network", "Customer WiFi"],
      education: ["Student Network", "Faculty Network", "Research Network", "Administrative Network", "Guest Network"],
      government: [
        "Classified Network",
        "Unclassified Network",
        "Public Services Network",
        "Emergency Network",
        "Administrative Network",
      ],
    }
    return segmentMap[industry] || ["Corporate Network", "Guest Network", "IoT Network"]
  }

  private getRandomEventTitle(): string {
    const titles = [
      "Infrastructure Deployment",
      "Policy Configuration",
      "Security Assessment",
      "User Training",
      "System Integration",
      "Performance Testing",
      "Compliance Audit",
      "Network Upgrade",
      "Device Onboarding",
      "Security Review",
      "Maintenance Window",
      "Rollout Planning",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  private getRandomEventDescription(): string {
    const descriptions = [
      "Scheduled deployment activity",
      "Configuration and testing phase",
      "Security compliance review",
      "User training and onboarding",
      "System integration and validation",
      "Performance optimization",
      "Compliance audit and documentation",
      "Network infrastructure upgrade",
      "Device provisioning and setup",
      "Security policy review",
      "Scheduled maintenance activity",
      "Rollout planning and coordination",
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private getRandomEventTags(): string[] {
    const allTags = [
      "deployment",
      "security",
      "compliance",
      "training",
      "maintenance",
      "upgrade",
      "testing",
      "integration",
    ]
    const numTags = Math.floor(Math.random() * 3) + 1
    return allTags.sort(() => 0.5 - Math.random()).slice(0, numTags)
  }

  private getPolicyConditions(policyType: string): string[] {
    const conditionMap: { [key: string]: string[] } = {
      "Device Access": [
        "Device Compliance: Required",
        "User Authentication: Required",
        "Certificate Validation: Required",
      ],
      "Network Access": ["Network Segment: Authorized", "Time Restriction: Business Hours", "Location: On-Premises"],
      "Guest Access": ["User Type: Guest", "Sponsor Approval: Required", "Time Limit: 8 Hours"],
      "IoT Access": ["Device Type: IoT", "Certificate: Required", "Network Segment: IoT VLAN"],
      "Admin Access": ["User Role: Administrator", "MFA: Required", "Privileged Session: Monitored"],
    }
    return conditionMap[policyType] || ["Default Condition"]
  }

  private getPolicyActions(policyType: string): string[] {
    const actionMap: { [key: string]: string[] } = {
      "Device Access": ["Allow Access", "Monitor Traffic", "Log Activities", "Apply Security Policies"],
      "Network Access": ["Grant Network Access", "Apply Bandwidth Limits", "Monitor Usage", "Log Connections"],
      "Guest Access": ["Limited Access", "Time Restriction", "Content Filtering", "Bandwidth Throttling"],
      "IoT Access": ["Isolate to IoT VLAN", "Monitor Communications", "Block Internet Access", "Log All Traffic"],
      "Admin Access": ["Grant Privileged Access", "Record Session", "Monitor Activities", "Alert on Anomalies"],
    }
    return actionMap[policyType] || ["Default Action"]
  }

  private getPolicyCategory(policyType: string): string {
    const categoryMap: { [key: string]: string } = {
      "Device Access": "Access Control",
      "Network Access": "Network Security",
      "Guest Access": "Guest Management",
      "IoT Access": "IoT Security",
      "Admin Access": "Privileged Access",
    }
    return categoryMap[policyType] || "General"
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.isClient) return
    try {
      const keys = [
        "portnox_sites",
        "portnox_global_policies",
        "portnox_events",
        "portnox_users",
        "portnox_architecture_config",
        "portnox_theme",
        "portnox_customer_logo",
        "portnox_company_name",
      ]
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }

  // Export all data
  async exportAllData(): Promise<string> {
    if (!this.isClient) return "{}"
    try {
      const [sites, policies, events, users, config] = await Promise.all([
        this.getSites(),
        this.getGlobalPolicies(),
        this.getEvents(),
        this.getUsers(),
        this.getArchitectureConfig(),
      ])

      const exportData = {
        sites,
        policies,
        events,
        users,
        config,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error("Error exporting data:", error)
      return "{}"
    }
  }

  // Import all data
  async importAllData(jsonData: string): Promise<boolean> {
    if (!this.isClient) return false
    try {
      const data = JSON.parse(jsonData)

      if (data.sites) await this.saveSites(data.sites)
      if (data.policies) await this.saveGlobalPolicies(data.policies)
      if (data.events) await this.saveEvents(data.events)
      if (data.users) await this.saveUsers(data.users)
      if (data.config) await this.saveArchitectureConfig(data.config)

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

export const storage = new Storage()
