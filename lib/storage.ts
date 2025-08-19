// Storage utility functions for the NAC Designer application

export interface Site {
  id: string
  name: string
  location: string
  city?: string
  state?: string
  country?: string
  region: string
  type: string
  users: number
  devices: number
  status: string
  phase: string
  timeline: string
  notes: string
  infrastructure: {
    wired: { vendor: string; switches: number; model?: string }
    wireless: { vendor: string; aps: number; model?: string }
    firewall: { vendor: string; model: string }
  }
  compliance: string[]
  riskLevel: string
  securityRequirements: string[]
  networkSegments: string[]
  priority: "High" | "Medium" | "Low"
  budget: number
  projectManager: string
  technicalOwner: string
  deviceCounts: {
    total: number
    windows: number
    mac: number
    mobile: number
    iot: number
  }
  userCounts: {
    total: number
    employees: number
    contractors: number
    guests: number
  }
  industry: string
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
  status: "active" | "inactive"
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: "milestone" | "task" | "meeting" | "deployment"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  assignedTo: string[]
  siteId?: string
  priority: "low" | "medium" | "high" | "critical"
  tags: string[]
}

export interface Policy {
  id: string
  name: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "active" | "inactive" | "draft"
  conditions: any[]
  actions: any[]
  createdAt: string
  updatedAt: string
  appliedTo: string[]
  effectiveness: number
  violations: number
}

export interface ArchitectureConfig {
  industry: string
  deployment: string
  connectivity: string[]
  identityProvider: string
  mdm: string
  firewall: string
  wiredVendor: string
  wirelessVendor: string
  deviceTypes: string[]
  authTypes: string[]
  compliance: string[]
  customizations: {
    colors: Record<string, string>
    layout: string
    showMetrics: boolean
    animationSpeed: number
  }
}

export interface CustomerInfo {
  companyName: string
  industry: string
  contactName: string
  email: string
  phone: string
  logo?: string
}

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
    compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11"],
    specialties: [
      "Medical Device Security",
      "Patient Data Protection",
      "Compliance Automation",
      "Telemedicine Support",
    ],
    icon: "🏥",
    color: "bg-red-50 border-red-200",
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
  },
}

class Storage {
  private isClient = typeof window !== "undefined"

  // Generic storage methods
  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  }

  // Sites
  getSites(): Site[] {
    return this.getItem("nac-designer-sites", [])
  }

  saveSites(sites: Site[]): void {
    this.setItem("nac-designer-sites", sites)
  }

  // Users
  getUsers(): User[] {
    return this.getItem("nac-designer-users", [])
  }

  saveUsers(users: User[]): void {
    this.setItem("nac-designer-users", users)
  }

  // Events
  getEvents(): Event[] {
    return this.getItem("nac-designer-events", [])
  }

  saveEvents(events: Event[]): void {
    this.setItem("nac-designer-events", events)
  }

  // Global Policies
  getGlobalPolicies(): Policy[] {
    return this.getItem("nac-designer-global-policies", [])
  }

  saveGlobalPolicies(policies: Policy[]): void {
    this.setItem("nac-designer-global-policies", policies)
  }

  // Architecture Configuration
  getArchitectureConfig(): ArchitectureConfig {
    return this.getItem("nac-designer-architecture-config", {
      industry: "healthcare",
      deployment: "hybrid",
      connectivity: ["wired", "wireless"],
      identityProvider: "azure_ad",
      mdm: "intune",
      firewall: "palo_alto",
      wiredVendor: "cisco",
      wirelessVendor: "aruba",
      deviceTypes: ["windows", "mac", "mobile", "iot"],
      authTypes: ["certificate", "username_password", "mfa"],
      compliance: ["hipaa", "pci_dss"],
      customizations: {
        colors: {
          primary: "#3b82f6",
          secondary: "#10b981",
          accent: "#f59e0b",
        },
        layout: "standard",
        showMetrics: true,
        animationSpeed: 1,
      },
    })
  }

  saveArchitectureConfig(config: ArchitectureConfig): void {
    this.setItem("nac-designer-architecture-config", config)
  }

  // Customer Information
  getCustomerInfo(): CustomerInfo {
    return this.getItem("nac-designer-customer-info", {
      companyName: "Demo Company",
      industry: "healthcare",
      contactName: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
    })
  }

  saveCustomerInfo(info: CustomerInfo): void {
    this.setItem("nac-designer-customer-info", info)
  }

  // Theme Settings
  getThemeSettings(): any {
    return this.getItem("nac-designer-theme", {
      mode: "light",
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      accentColor: "#f59e0b",
    })
  }

  saveThemeSettings(settings: any): void {
    this.setItem("nac-designer-theme", settings)
  }

  // Demo Data Generation
  async generateDemoData(scenarioKey: string): Promise<void> {
    if (!this.isClient) return

    try {
      const scenario = INDUSTRY_SCENARIOS[scenarioKey as keyof typeof INDUSTRY_SCENARIOS]
      if (!scenario) {
        throw new Error(`Scenario ${scenarioKey} not found`)
      }

      console.log(`Generating demo data for ${scenario.name}...`)

      // Clear existing data first
      this.clearAllData()

      // Generate comprehensive demo sites
      const demoSites = this.generateDemoSites(scenario)
      console.log(`Generated ${demoSites.length} sites`)
      this.saveSites(demoSites)

      // Generate demo users
      const demoUsers = this.generateDemoUsers(scenario, demoSites)
      console.log(`Generated ${demoUsers.length} users`)
      this.saveUsers(demoUsers)

      // Generate demo events and timeline
      const demoEvents = this.generateDemoEvents(scenario, demoSites)
      console.log(`Generated ${demoEvents.length} events`)
      this.saveEvents(demoEvents)

      // Generate demo policies
      const demoPolicies = this.generateDemoPolicies(scenario)
      console.log(`Generated ${demoPolicies.length} policies`)
      this.saveGlobalPolicies(demoPolicies)

      // Update customer info
      this.saveCustomerInfo({
        companyName: scenario.name,
        industry: scenario.industry,
        contactName: "Demo Administrator",
        email: "admin@demo.com",
        phone: "+1 (555) 123-4567",
      })

      // Update architecture config for the industry
      this.saveArchitectureConfig({
        industry: scenario.industry,
        deployment: "hybrid",
        connectivity: ["wired", "wireless"],
        identityProvider: "azure_ad",
        mdm: "intune",
        firewall: "palo_alto",
        wiredVendor: "cisco",
        wirelessVendor: "aruba",
        deviceTypes: ["windows", "mac", "mobile", "iot"],
        authTypes: ["certificate", "username_password", "mfa"],
        compliance: scenario.compliance,
        customizations: {
          colors: {
            primary: "#3b82f6",
            secondary: "#10b981",
            accent: "#f59e0b",
          },
          layout: "standard",
          showMetrics: true,
          animationSpeed: 1,
        },
      })

      console.log(`Demo data generation completed for ${scenario.name}`)
    } catch (error) {
      console.error("Error generating demo data:", error)
      throw error
    }
  }

  private generateDemoSites(scenario: any): Site[] {
    const sites: Site[] = []
    const regions = ["North America", "EMEA", "APAC", "LATAM"]
    const cities = {
      "North America": [
        { name: "New York, NY", state: "NY", country: "USA" },
        { name: "Los Angeles, CA", state: "CA", country: "USA" },
        { name: "Chicago, IL", state: "IL", country: "USA" },
        { name: "Toronto, ON", state: "ON", country: "Canada" },
      ],
      EMEA: [
        { name: "London", state: "England", country: "UK" },
        { name: "Frankfurt", state: "Hesse", country: "Germany" },
        { name: "Paris", state: "Île-de-France", country: "France" },
        { name: "Amsterdam", state: "North Holland", country: "Netherlands" },
      ],
      APAC: [
        { name: "Tokyo", state: "Tokyo", country: "Japan" },
        { name: "Singapore", state: "Singapore", country: "Singapore" },
        { name: "Sydney", state: "NSW", country: "Australia" },
        { name: "Hong Kong", state: "Hong Kong", country: "China" },
      ],
      LATAM: [
        { name: "São Paulo", state: "SP", country: "Brazil" },
        { name: "Mexico City", state: "CDMX", country: "Mexico" },
        { name: "Buenos Aires", state: "CABA", country: "Argentina" },
        { name: "Santiago", state: "RM", country: "Chile" },
      ],
    }

    for (let i = 0; i < scenario.siteCount; i++) {
      const region = regions[i % regions.length]
      const cityList = cities[region as keyof typeof cities]
      const cityInfo = cityList[Math.floor(Math.random() * cityList.length)]

      const baseUsers = Math.floor(scenario.userCount / scenario.siteCount) + Math.floor(Math.random() * 200)
      const baseDevices = Math.floor(baseUsers * 1.8) + Math.floor(Math.random() * 300)

      sites.push({
        id: `site-${scenario.id}-${i + 1}`,
        name: `${scenario.name} - ${cityInfo.name.split(",")[0]}`,
        location: cityInfo.name,
        city: cityInfo.name.split(",")[0],
        state: cityInfo.state,
        country: cityInfo.country,
        region: region,
        type: this.getSiteType(scenario.industry),
        users: baseUsers,
        devices: baseDevices,
        status: this.getRandomSiteStatus(),
        phase: this.getRandomPhase(),
        timeline: this.getRandomTimeline(),
        notes: `${scenario.industry} facility with specialized requirements for ${scenario.specialties.join(", ")}`,
        infrastructure: this.generateInfrastructure(scenario.industry),
        compliance: scenario.compliance,
        riskLevel: this.getRandomRiskLevel(),
        securityRequirements: this.getSecurityRequirements(scenario.industry),
        networkSegments: this.getNetworkSegments(scenario.industry),
        priority: this.getRandomPriority() as "High" | "Medium" | "Low",
        budget: Math.floor(scenario.budget / scenario.siteCount) + Math.floor(Math.random() * 200000),
        projectManager: this.getRandomProjectManager(),
        technicalOwner: this.getRandomTechnicalOwner(),
        deviceCounts: {
          total: baseDevices,
          windows: Math.floor(baseDevices * 0.4),
          mac: Math.floor(baseDevices * 0.2),
          mobile: Math.floor(baseDevices * 0.3),
          iot: Math.floor(baseDevices * 0.1),
        },
        userCounts: {
          total: baseUsers,
          employees: Math.floor(baseUsers * 0.8),
          contractors: Math.floor(baseUsers * 0.15),
          guests: Math.floor(baseUsers * 0.05),
        },
        industry: scenario.industry,
      })
    }

    return sites
  }

  private generateDemoUsers(scenario: any, sites: Site[]): User[] {
    const users: User[] = []
    const roles = this.getRoles(scenario.industry)
    const departments = this.getDepartments(scenario.industry)

    for (let i = 0; i < Math.min(100, Math.floor(scenario.userCount / 25)); i++) {
      const firstName = this.getRandomFirstName()
      const lastName = this.getRandomLastName()

      users.push({
        id: `user-${scenario.id}-${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${scenario.id}.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        sites: [sites[Math.floor(Math.random() * sites.length)].id],
        permissions: this.getRandomPermissions(),
        lastLogin: this.getRecentDate(),
        status: Math.random() > 0.1 ? "active" : "inactive",
      })
    }

    return users
  }

  private generateDemoEvents(scenario: any, sites: Site[]): Event[] {
    const events: Event[] = []
    const eventTypes: ("milestone" | "task" | "meeting" | "deployment")[] = [
      "milestone",
      "task",
      "meeting",
      "deployment",
    ]
    const phases = [
      "Planning",
      "Design",
      "Implementation",
      "Testing",
      "Deployment",
      "Go-Live",
      "Training",
      "Documentation",
    ]

    for (let i = 0; i < 50; i++) {
      const site = sites[Math.floor(Math.random() * sites.length)]
      const startDate = new Date(Date.now() + (Math.random() - 0.5) * 180 * 24 * 60 * 60 * 1000)
      const endDate = new Date(startDate.getTime() + Math.random() * 21 * 24 * 60 * 60 * 1000)

      events.push({
        id: `event-${scenario.id}-${i + 1}`,
        title: `${phases[Math.floor(Math.random() * phases.length)]} - ${site.name}`,
        description: `${scenario.industry} deployment activity: ${this.getEventDescription(scenario.industry)}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: this.getRandomEventStatus() as any,
        assignedTo: [this.getRandomProjectManager(), this.getRandomTechnicalOwner()],
        siteId: site.id,
        priority: this.getRandomPriority() as any,
        tags: [scenario.industry, site.region, phases[Math.floor(Math.random() * phases.length)]],
      })
    }

    return events
  }

  private generateDemoPolicies(scenario: any): Policy[] {
    const policies: Policy[] = []
    const policyTemplates = this.getPolicyTemplates(scenario.industry)

    policyTemplates.forEach((template, index) => {
      policies.push({
        id: `policy-${scenario.id}-${index + 1}`,
        name: template.name,
        description: template.description,
        category: template.category,
        priority: template.priority as any,
        status: "active",
        conditions: template.conditions,
        actions: template.actions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appliedTo: [scenario.id],
        effectiveness: 85 + Math.random() * 15,
        violations: Math.floor(Math.random() * 10),
      })
    })

    return policies
  }

  // Helper methods for demo data generation
  private getSiteType(industry: string): string {
    const types = {
      healthcare: ["hospital", "clinic", "medical_center", "imaging_center", "lab"],
      financial: ["headquarters", "branch", "data_center", "trading_floor", "operations_center"],
      manufacturing: ["factory", "warehouse", "office", "r_and_d", "distribution_center"],
      technology: ["headquarters", "office", "lab", "data_center", "co_working"],
      retail: ["flagship_store", "store", "warehouse", "headquarters", "distribution_center"],
      education: ["main_campus", "satellite_campus", "research_facility", "student_housing", "administrative"],
      government: ["headquarters", "field_office", "secure_facility", "data_center", "operations_center"],
    }
    const industryTypes = types[industry as keyof typeof types] || ["office"]
    return industryTypes[Math.floor(Math.random() * industryTypes.length)]
  }

  private getRandomSiteStatus(): string {
    const statuses = ["planning", "in-progress", "testing", "completed", "on-hold"]
    const weights = [0.2, 0.4, 0.2, 0.15, 0.05] // More likely to be in-progress
    const random = Math.random()
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) return statuses[i]
    }
    return statuses[1] // Default to in-progress
  }

  private getRandomPhase(): string {
    const phases = ["Discovery", "Design", "Implementation", "Testing", "Deployment", "Go-Live", "Optimization"]
    return phases[Math.floor(Math.random() * phases.length)]
  }

  private getRandomTimeline(): string {
    const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"]
    return quarters[Math.floor(Math.random() * quarters.length)]
  }

  private generateInfrastructure(industry: string): any {
    const vendors = {
      wired: [
        { name: "cisco", models: ["Catalyst 9300", "Catalyst 9400", "Catalyst 9600", "Nexus 9000"] },
        { name: "aruba", models: ["CX 6200", "CX 6300", "CX 8360", "CX 10000"] },
        { name: "juniper", models: ["EX4300", "EX4650", "QFX5120", "QFX10000"] },
        { name: "extreme", models: ["X465", "X690", "X870", "SLX 9850"] },
      ],
      wireless: [
        { name: "cisco", models: ["Catalyst 9136", "Catalyst 9162", "Aironet 4800", "Meraki MR57"] },
        { name: "aruba", models: ["AP-515", "AP-635", "AP-655", "AP-675"] },
        { name: "ruckus", models: ["R550", "R650", "R750", "R850"] },
        { name: "mist", models: ["AP43", "AP45", "AP63", "AP33"] },
      ],
      firewall: [
        { name: "palo_alto", models: ["PA-220", "PA-850", "PA-3220", "PA-5220", "PA-7080"] },
        { name: "fortinet", models: ["FortiGate-100F", "FortiGate-600F", "FortiGate-1500D", "FortiGate-3000D"] },
        { name: "checkpoint", models: ["1570", "3200", "5800", "15600", "26000"] },
        { name: "cisco", models: ["ASA 5516", "ASA 5525", "FTD 2130", "FTD 4125"] },
      ],
    }

    const wiredVendor = vendors.wired[Math.floor(Math.random() * vendors.wired.length)]
    const wirelessVendor = vendors.wireless[Math.floor(Math.random() * vendors.wireless.length)]
    const firewallVendor = vendors.firewall[Math.floor(Math.random() * vendors.firewall.length)]

    return {
      wired: {
        vendor: wiredVendor.name,
        switches: Math.floor(Math.random() * 30) + 5,
        model: wiredVendor.models[Math.floor(Math.random() * wiredVendor.models.length)],
      },
      wireless: {
        vendor: wirelessVendor.name,
        aps: Math.floor(Math.random() * 80) + 10,
        model: wirelessVendor.models[Math.floor(Math.random() * wirelessVendor.models.length)],
      },
      firewall: {
        vendor: firewallVendor.name,
        model: firewallVendor.models[Math.floor(Math.random() * firewallVendor.models.length)],
      },
    }
  }

  private getRandomRiskLevel(): string {
    const levels = ["low", "medium", "high", "critical"]
    const weights = [0.3, 0.4, 0.25, 0.05] // Most sites are low-medium risk
    const random = Math.random()
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) return levels[i]
    }
    return levels[1] // Default to medium
  }

  private getSecurityRequirements(industry: string): string[] {
    const requirements = {
      healthcare: [
        "HIPAA Compliance",
        "Patient Data Protection",
        "Medical Device Security",
        "PHI Encryption",
        "Audit Logging",
      ],
      financial: ["PCI DSS", "SOX Compliance", "Fraud Prevention", "Transaction Security", "Regulatory Reporting"],
      manufacturing: [
        "OT Security",
        "Industrial Controls",
        "Safety Systems",
        "Production Continuity",
        "Supply Chain Security",
      ],
      technology: ["IP Protection", "Development Security", "Cloud Security", "API Security", "DevSecOps"],
      retail: [
        "POS Security",
        "Customer Data Protection",
        "Payment Processing",
        "Loss Prevention",
        "Omnichannel Security",
      ],
      education: ["Student Privacy", "Research Security", "BYOD Management", "Campus Safety", "Academic Freedom"],
      government: [
        "FISMA Compliance",
        "Classified Data Protection",
        "National Security",
        "Insider Threat",
        "Continuous Monitoring",
      ],
    }
    return (
      requirements[industry as keyof typeof requirements] || ["Standard Security", "Data Protection", "Access Control"]
    )
  }

  private getNetworkSegments(industry: string): string[] {
    const segments = {
      healthcare: [
        "Clinical Network",
        "Administrative",
        "Guest WiFi",
        "Medical Devices",
        "IoT Sensors",
        "Imaging Systems",
      ],
      financial: ["Trading Floor", "Corporate Network", "Guest Access", "ATM Network", "Secure Vault", "Market Data"],
      manufacturing: [
        "Production Network",
        "Office Network",
        "OT Network",
        "Guest Access",
        "IoT Devices",
        "Safety Systems",
      ],
      technology: ["Development", "Production", "Corporate", "Guest Network", "Lab Network", "Cloud Connectivity"],
      retail: ["POS Network", "Corporate", "Guest WiFi", "Inventory Systems", "Security Cameras", "Digital Signage"],
      education: [
        "Academic Network",
        "Administrative",
        "Student Network",
        "Research Network",
        "Guest Access",
        "Campus IoT",
      ],
      government: [
        "Classified Network",
        "Unclassified",
        "Administrative",
        "Public Access",
        "Secure Communications",
        "Visitor Network",
      ],
    }
    return segments[industry as keyof typeof segments] || ["Corporate Network", "Guest Access", "IoT Devices"]
  }

  private getRoles(industry: string): string[] {
    const roles = {
      healthcare: ["physician", "nurse", "administrator", "it_manager", "security_officer", "compliance_officer"],
      financial: ["trader", "analyst", "risk_manager", "compliance_officer", "it_admin", "security_analyst"],
      manufacturing: ["plant_manager", "engineer", "operator", "maintenance", "safety_officer", "it_coordinator"],
      technology: ["developer", "devops", "product_manager", "security_engineer", "it_admin", "data_scientist"],
      retail: [
        "store_manager",
        "sales_associate",
        "inventory_manager",
        "loss_prevention",
        "it_support",
        "regional_manager",
      ],
      education: ["professor", "administrator", "it_staff", "security_officer", "student_services", "facilities"],
      government: [
        "analyst",
        "administrator",
        "security_officer",
        "it_specialist",
        "program_manager",
        "compliance_officer",
      ],
    }
    return roles[industry as keyof typeof roles] || ["employee", "manager", "admin", "specialist"]
  }

  private getDepartments(industry: string): string[] {
    const departments = {
      healthcare: [
        "Clinical Services",
        "Administration",
        "IT",
        "Facilities",
        "Security",
        "Compliance",
        "Nursing",
        "Radiology",
      ],
      financial: [
        "Trading",
        "Risk Management",
        "IT",
        "Compliance",
        "Operations",
        "Wealth Management",
        "Investment Banking",
        "Treasury",
      ],
      manufacturing: [
        "Production",
        "Engineering",
        "IT",
        "Quality Assurance",
        "Safety",
        "Maintenance",
        "Supply Chain",
        "R&D",
      ],
      technology: [
        "Engineering",
        "Product Management",
        "IT",
        "Security",
        "Operations",
        "Data Science",
        "DevOps",
        "Customer Success",
      ],
      retail: [
        "Store Operations",
        "IT",
        "Loss Prevention",
        "Merchandising",
        "Customer Service",
        "Supply Chain",
        "Marketing",
        "Finance",
      ],
      education: [
        "IT Services",
        "Administration",
        "Facilities",
        "Security",
        "Academic Affairs",
        "Student Services",
        "Research",
        "Library",
      ],
      government: [
        "IT",
        "Security",
        "Operations",
        "Administration",
        "Intelligence",
        "Communications",
        "Logistics",
        "Training",
      ],
    }
    return departments[industry as keyof typeof departments] || ["IT", "Operations", "Administration", "Security"]
  }

  private getPolicyTemplates(industry: string): any[] {
    const templates = {
      healthcare: [
        {
          name: "HIPAA Device Compliance Policy",
          description: "Ensures all devices accessing PHI meet HIPAA security requirements",
          category: "compliance",
          priority: "critical",
          conditions: [
            { type: "device_type", operator: "equals", value: "medical_device", description: "Medical device type" },
            { type: "compliance_status", operator: "equals", value: "hipaa_compliant", description: "HIPAA compliant" },
          ],
          actions: [
            { type: "allow", parameters: { network: "clinical" }, description: "Allow clinical network access" },
            { type: "log", parameters: { level: "audit" }, description: "Create audit log entry" },
          ],
        },
        {
          name: "Patient Data Access Control",
          description: "Controls access to patient data systems based on role and location",
          category: "access_control",
          priority: "critical",
          conditions: [
            {
              type: "user_role",
              operator: "in",
              value: ["physician", "nurse", "clinical_staff"],
              description: "Clinical staff role",
            },
            { type: "location", operator: "equals", value: "clinical_area", description: "Clinical area location" },
          ],
          actions: [
            {
              type: "allow",
              parameters: { resources: ["patient_records", "ehr_system"] },
              description: "Allow patient data access",
            },
            {
              type: "require_mfa",
              parameters: { methods: ["certificate", "biometric"] },
              description: "Require strong authentication",
            },
          ],
        },
      ],
      financial: [
        {
          name: "Trading Floor High Security Access",
          description: "Ultra-secure access controls for trading floor systems",
          category: "access_control",
          priority: "critical",
          conditions: [
            { type: "location", operator: "equals", value: "trading_floor", description: "Trading floor location" },
            {
              type: "user_role",
              operator: "in",
              value: ["trader", "quant", "risk_manager"],
              description: "Trading role",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: { network: "trading", priority: "high" },
              description: "Allow trading network",
            },
            {
              type: "require_mfa",
              parameters: { methods: ["smartcard", "biometric"] },
              description: "Require strong MFA",
            },
          ],
        },
      ],
      manufacturing: [
        {
          name: "OT Network Segmentation Policy",
          description: "Isolates operational technology from IT networks",
          category: "network_security",
          priority: "critical",
          conditions: [
            {
              type: "device_type",
              operator: "equals",
              value: "industrial_control",
              description: "Industrial control system",
            },
          ],
          actions: [
            { type: "allow", parameters: { vlan: "ot_network" }, description: "Allow OT network access" },
            { type: "deny", parameters: { networks: ["corporate_it", "internet"] }, description: "Block IT networks" },
          ],
        },
      ],
      technology: [
        {
          name: "Developer Secure Access Policy",
          description: "Secure access to development resources with code protection",
          category: "development_security",
          priority: "high",
          conditions: [
            {
              type: "user_role",
              operator: "in",
              value: ["developer", "devops", "architect"],
              description: "Development role",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: { resources: ["git_repos", "ci_cd", "staging"] },
              description: "Allow dev resources",
            },
            { type: "require_mfa", parameters: { methods: ["certificate", "totp"] }, description: "Require MFA" },
          ],
        },
      ],
      retail: [
        {
          name: "POS System Security Policy",
          description: "Comprehensive security for point-of-sale systems",
          category: "payment_security",
          priority: "critical",
          conditions: [
            { type: "device_type", operator: "equals", value: "pos_terminal", description: "POS terminal device" },
          ],
          actions: [
            { type: "isolate", parameters: { vlan: "pos_network" }, description: "Isolate POS network" },
            { type: "encrypt", parameters: { method: "p2pe" }, description: "Point-to-point encryption" },
          ],
        },
      ],
      education: [
        {
          name: "Student Network Access Policy",
          description: "Balanced access for student devices with appropriate restrictions",
          category: "student_access",
          priority: "medium",
          conditions: [{ type: "user_type", operator: "equals", value: "student", description: "Student user" }],
          actions: [
            {
              type: "allow",
              parameters: { network: "student", bandwidth: "50Mbps" },
              description: "Student network access",
            },
            { type: "filter", parameters: { content: "educational" }, description: "Educational content filter" },
          ],
        },
      ],
      government: [
        {
          name: "Classified System Access Policy",
          description: "Maximum security for classified information systems",
          category: "classified_access",
          priority: "critical",
          conditions: [
            {
              type: "security_clearance",
              operator: "greater_equal",
              value: "secret",
              description: "Security clearance required",
            },
          ],
          actions: [
            {
              type: "allow",
              parameters: { network: "classified", air_gap: "required" },
              description: "Classified network access",
            },
            {
              type: "require_mfa",
              parameters: { methods: ["piv_card", "biometric"] },
              description: "PIV card + biometric",
            },
          ],
        },
      ],
    }

    return (
      templates[industry as keyof typeof templates] || [
        {
          name: "Standard Access Policy",
          description: "Basic network access control policy",
          category: "access_control",
          priority: "medium",
          conditions: [
            { type: "device_compliance", operator: "equals", value: "compliant", description: "Compliant device" },
          ],
          actions: [{ type: "allow", parameters: { network: "corporate" }, description: "Allow corporate access" }],
        },
      ]
    )
  }

  private getEventDescription(industry: string): string {
    const descriptions = {
      healthcare: "Medical device integration and HIPAA compliance validation",
      financial: "Trading system deployment with regulatory compliance testing",
      manufacturing: "Industrial control system integration and safety validation",
      technology: "Cloud infrastructure deployment and security hardening",
      retail: "POS system rollout and customer data protection implementation",
      education: "Campus network upgrade and student device management",
      government: "Classified system deployment with FISMA compliance validation",
    }
    return descriptions[industry as keyof typeof descriptions] || "Network access control deployment"
  }

  private getRandomEventStatus(): string {
    const statuses = ["pending", "in_progress", "completed", "cancelled"]
    const weights = [0.3, 0.4, 0.25, 0.05]
    const random = Math.random()
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) return statuses[i]
    }
    return statuses[1]
  }

  private getRandomPriority(): string {
    const priorities = ["low", "medium", "high", "critical"]
    const weights = [0.2, 0.4, 0.3, 0.1]
    const random = Math.random()
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) return priorities[i]
    }
    return priorities[1]
  }

  private getRandomProjectManager(): string {
    const managers = [
      "Sarah Johnson",
      "Michael Chen",
      "Lisa Rodriguez",
      "David Kim",
      "Emily Davis",
      "Robert Wilson",
      "Maria Garcia",
      "James Thompson",
      "Jennifer Lee",
      "Alex Martinez",
      "Amanda Taylor",
      "Christopher Brown",
      "Nicole Anderson",
      "Kevin Zhang",
      "Rachel Green",
    ]
    return managers[Math.floor(Math.random() * managers.length)]
  }

  private getRandomTechnicalOwner(): string {
    const owners = [
      "Alex Thompson",
      "Maria Garcia",
      "James Wilson",
      "Emily Davis",
      "Robert Lee",
      "Sarah Kim",
      "Michael Rodriguez",
      "Lisa Chen",
      "David Martinez",
      "Jennifer Brown",
      "Kevin Taylor",
      "Amanda Zhang",
      "Christopher Green",
      "Nicole Johnson",
      "Rachel Anderson",
    ]
    return owners[Math.floor(Math.random() * owners.length)]
  }

  private getRandomPermissions(): string[] {
    const allPermissions = ["read", "write", "admin", "deploy", "monitor", "audit", "configure", "approve"]
    return allPermissions.filter(() => Math.random() > 0.6)
  }

  private getRecentDate(): string {
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private getRandomFirstName(): string {
    const names = [
      "John",
      "Sarah",
      "Michael",
      "Lisa",
      "David",
      "Emily",
      "James",
      "Maria",
      "Robert",
      "Jennifer",
      "William",
      "Jessica",
      "Christopher",
      "Ashley",
      "Matthew",
      "Amanda",
      "Joshua",
      "Stephanie",
      "Andrew",
      "Nicole",
      "Daniel",
      "Elizabeth",
      "Anthony",
      "Helen",
      "Mark",
      "Sandra",
      "Donald",
      "Donna",
      "Steven",
      "Carol",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  private getRandomLastName(): string {
    const names = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  // Demo Data Management
  loadDemoData(industry: string): void {
    console.log(`Loading demo data for ${industry}`)
  }

  clearAllData(): void {
    if (!this.isClient) return
    const keys = [
      "nac-designer-sites",
      "nac-designer-users",
      "nac-designer-events",
      "nac-designer-global-policies",
      "nac-designer-architecture-config",
      "nac-designer-customer-info",
      "nac-designer-theme",
    ]
    keys.forEach((key) => localStorage.removeItem(key))
  }

  // Export/Import functionality
  exportData(): string {
    const data = {
      sites: this.getSites(),
      users: this.getUsers(),
      events: this.getEvents(),
      policies: this.getGlobalPolicies(),
      config: this.getArchitectureConfig(),
      customer: this.getCustomerInfo(),
      theme: this.getThemeSettings(),
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.sites) this.saveSites(data.sites)
      if (data.users) this.saveUsers(data.users)
      if (data.events) this.saveEvents(data.events)
      if (data.policies) this.saveGlobalPolicies(data.policies)
      if (data.config) this.saveArchitectureConfig(data.config)
      if (data.customer) this.saveCustomerInfo(data.customer)
      if (data.theme) this.saveThemeSettings(data.theme)

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

// Export the storage instance
export const storage = new Storage()
