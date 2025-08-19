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

export const storage = {
  // Sites management
  async getSites(): Promise<any[]> {
    if (typeof window === "undefined") return []
    try {
      const sites = localStorage.getItem("nac-sites")
      return sites ? JSON.parse(sites) : []
    } catch (error) {
      console.error("Error getting sites:", error)
      return []
    }
  },

  async saveSites(sites: any[]): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-sites", JSON.stringify(sites))
    } catch (error) {
      console.error("Error saving sites:", error)
    }
  },

  // Users management
  async getUsers(): Promise<any[]> {
    if (typeof window === "undefined") return []
    try {
      const users = localStorage.getItem("nac-users")
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error("Error getting users:", error)
      return []
    }
  },

  async saveUsers(users: any[]): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-users", JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  },

  // Events management
  async getEvents(): Promise<any[]> {
    if (typeof window === "undefined") return []
    try {
      const events = localStorage.getItem("nac-events")
      return events ? JSON.parse(events) : []
    } catch (error) {
      console.error("Error getting events:", error)
      return []
    }
  },

  async saveEvents(events: any[]): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-events", JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events:", error)
    }
  },

  // Global policies management
  async getGlobalPolicies(): Promise<any[]> {
    if (typeof window === "undefined") return []
    try {
      const policies = localStorage.getItem("nac-global-policies")
      return policies ? JSON.parse(policies) : []
    } catch (error) {
      console.error("Error getting global policies:", error)
      return []
    }
  },

  async saveGlobalPolicies(policies: any[]): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-global-policies", JSON.stringify(policies))
    } catch (error) {
      console.error("Error saving global policies:", error)
    }
  },

  // Architecture configuration
  async getArchitectureConfig(): Promise<any> {
    if (typeof window === "undefined") return null
    try {
      const config = localStorage.getItem("nac-architecture-config")
      return config ? JSON.parse(config) : null
    } catch (error) {
      console.error("Error getting architecture config:", error)
      return null
    }
  },

  async saveArchitectureConfig(config: any): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-architecture-config", JSON.stringify(config))
    } catch (error) {
      console.error("Error saving architecture config:", error)
    }
  },

  // Theme settings
  async getThemeSettings(): Promise<any> {
    if (typeof window === "undefined") return null
    try {
      const theme = localStorage.getItem("nac-theme-settings")
      return theme ? JSON.parse(theme) : null
    } catch (error) {
      console.error("Error getting theme settings:", error)
      return null
    }
  },

  async saveThemeSettings(settings: any): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-theme-settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving theme settings:", error)
    }
  },

  // User preferences
  async getUserPreferences(): Promise<any> {
    if (typeof window === "undefined") return null
    try {
      const prefs = localStorage.getItem("nac-user-preferences")
      return prefs ? JSON.parse(prefs) : null
    } catch (error) {
      console.error("Error getting user preferences:", error)
      return null
    }
  },

  async saveUserPreferences(preferences: any): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-user-preferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Error saving user preferences:", error)
    }
  },

  // Site workbook data
  async getSiteWorkbook(siteId: string): Promise<any> {
    if (typeof window === "undefined") return null
    try {
      const workbook = localStorage.getItem(`nac-site-workbook-${siteId}`)
      return workbook ? JSON.parse(workbook) : null
    } catch (error) {
      console.error("Error getting site workbook:", error)
      return null
    }
  },

  async saveSiteWorkbook(siteId: string, workbook: any): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(`nac-site-workbook-${siteId}`, JSON.stringify(workbook))
    } catch (error) {
      console.error("Error saving site workbook:", error)
    }
  },

  // Rollout progress
  async getRolloutProgress(): Promise<any[]> {
    if (typeof window === "undefined") return []
    try {
      const progress = localStorage.getItem("nac-rollout-progress")
      return progress ? JSON.parse(progress) : []
    } catch (error) {
      console.error("Error getting rollout progress:", error)
      return []
    }
  },

  async saveRolloutProgress(progress: any[]): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("nac-rollout-progress", JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving rollout progress:", error)
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    if (typeof window === "undefined") return
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("nac-"))
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  },

  // Export all data
  async exportAllData(): Promise<any> {
    if (typeof window === "undefined") return {}
    try {
      const data: any = {}
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("nac-"))
      keys.forEach((key) => {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "{}")
        } catch {
          data[key] = localStorage.getItem(key)
        }
      })
      return data
    } catch (error) {
      console.error("Error exporting data:", error)
      return {}
    }
  },

  // Import all data
  async importAllData(data: any): Promise<void> {
    if (typeof window === "undefined") return
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith("nac-")) {
          localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value))
        }
      })
    } catch (error) {
      console.error("Error importing data:", error)
    }
  },
}
