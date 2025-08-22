// Simple storage utility for Portnox NAC Designer

export interface User {
  id: string
  name: string
  email: string
  role: string
  sites: string[]
  firstName?: string
  lastName?: string
}

export interface Site {
  id: string
  name: string
  location: string
  industry: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  config: any
  region?: string
  status?: 'Complete' | 'In Progress' | 'Planned' | 'Delayed' | 'On Hold'
  priority?: 'High' | 'Medium' | 'Low'
  users?: number
  devices?: number
  budget?: number
  completionPercent?: number
  phase?: string
  timeZone?: string
  startDate?: string
  targetDate?: string
  actualDate?: string
  notes?: string
  userCounts?: {
    employees?: number
    contractors?: number
    guests?: number
  }
  infrastructure?: {
    switches?: number
    accessPoints?: number
    firewalls?: number
    wired?: {
      vendor?: string
      model?: string
      switches?: number
      ports?: number
    }
    wireless?: {
      vendor?: string
      model?: string
      accessPoints?: number
      controllers?: number
    }
    firewall?: {
      vendor?: string
      model?: string
      throughput?: string
    }
    radius?: {
      type?: string
      vendor?: string
    }
  }
  authentication?: {
    identityProviders?: string[]
    mdmProviders?: string[]
    authMethods?: string[]
  }
  projectManager?: string
  technicalOwner?: string
  technicalOwners?: string[]
  assignedUsers?: string[]
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  compliance?: string[]
  securityRequirements?: string[]
  risks?: Array<{
    description: string
    severity: 'Low' | 'Medium' | 'High' | 'Critical'
    mitigation: string
  }>
  networkSegments?: Array<{
    name: string
    vlan: number
    subnet: string
    description: string
  }>
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

class StorageService {
  private readonly STORAGE_PREFIX = 'portnox_nac_'

  private getKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined') return null
      const item = localStorage.getItem(this.getKey(key))
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key}:`, error)
      return null
    }
  }

  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key}:`, error)
    }
  }

  // Architecture Configuration
  async getArchitectureConfig(): Promise<ArchitectureConfig | null> {
    return this.getItem<ArchitectureConfig>('architecture_config')
  }

  async saveArchitectureConfig(config: ArchitectureConfig): Promise<void> {
    return this.setItem('architecture_config', config)
  }

  // Sites Management
  async getSites(): Promise<Site[]> {
    const sites = await this.getItem<Site[]>('sites')
    return sites || []
  }

  async saveSites(sites: Site[]): Promise<void> {
    return this.setItem('sites', sites)
  }

  async addSite(site: Site): Promise<void> {
    const sites = await this.getSites()
    sites.push(site)
    return this.saveSites(sites)
  }

  async updateSite(siteId: string, updates: Partial<Site>): Promise<void> {
    const sites = await this.getSites()
    const index = sites.findIndex(site => site.id === siteId)
    if (index !== -1) {
      sites[index] = { ...sites[index], ...updates }
      return this.saveSites(sites)
    }
  }

  async deleteSite(siteId: string): Promise<void> {
    const sites = await this.getSites()
    const filteredSites = sites.filter(site => site.id !== siteId)
    return this.saveSites(filteredSites)
  }

  // Policies
  async getPolicies(): Promise<any[]> {
    return this.getItem<any[]>('policies') || []
  }

  async savePolicies(policies: any[]): Promise<void> {
    return this.setItem('policies', policies)
  }

  // Simulations
  async getSimulations(): Promise<any[]> {
    return this.getItem<any[]>('simulations') || []
  }

  async saveSimulations(simulations: any[]): Promise<void> {
    return this.setItem('simulations', simulations)
  }

  // Users Management
  async getUsers(): Promise<User[]> {
    const users = await this.getItem<User[]>('users')
    return users || []
  }

  async saveUsers(users: User[]): Promise<void> {
    return this.setItem('users', users)
  }

  // User Preferences
  async getUserPreferences(): Promise<any> {
    return this.getItem<any>('user_preferences') || {}
  }

  async saveUserPreferences(preferences: any): Promise<void> {
    return this.setItem('user_preferences', preferences)
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX)
      )
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }
}

export const storage = new StorageService()