// Mock data for the frontend application
export interface User {
  id: string
  name: string
  email: string
  role: string
  user_type: string
  avatar?: string
}

export interface Site {
  id: string
  name: string
  region: string
  country: string
  city?: string
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  phase: number
  users_count: number
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed' | 'On Hold'
  completion_percent: number
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  project_manager?: User
  technical_owners?: User[]
  vendors?: string[]
  device_types?: string[]
  notes?: string
  budget?: number
  risk_level?: 'Low' | 'Medium' | 'High' | 'Critical'
}

export interface Project {
  id: string
  name: string
  description?: string
  project_type: 'poc' | 'pilot' | 'production' | 'migration'
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  start_date?: string
  end_date?: string
  budget?: number
  health_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  project_manager?: User
  sponsor?: User
  sites?: Site[]
  created_at: string
}

export interface Analytics {
  overview: {
    total_sites: number
    completed_deployments: number
    active_deployments: number
    total_users: number
  }
  performance: {
    success_rate: number
    avg_completion_rate: number
    deployment_velocity: number
    on_time_delivery: number
  }
  financial: {
    budget_efficiency: number
    total_budget: number
    spent_to_date: number
    remaining_budget: number
  }
  regional_data: Record<string, {
    name: string
    sites: number
    completed: number
    inProgress: number
  }>
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@portnox.com',
    role: 'Senior Project Manager',
    user_type: 'project_manager'
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@portnox.com',
    role: 'Project Manager',
    user_type: 'project_manager'
  },
  {
    id: 'user-3',
    name: 'Sofia Linden',
    email: 'sofia.linden@portnox.com',
    role: 'Technical Lead',
    user_type: 'technical_owner'
  },
  {
    id: 'user-4',
    name: 'Michael Zhang',
    email: 'michael.zhang@portnox.com',
    role: 'Network Engineer',
    user_type: 'technical_owner'
  },
  {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@portnox.com',
    role: 'Administrator',
    user_type: 'admin'
  }
]

// Mock Sites
export const mockSites: Site[] = [
  {
    id: 'HQ001',
    name: 'Global Headquarters',
    region: 'North America',
    country: 'United States',
    city: 'New York',
    priority: 'High',
    phase: 1,
    users_count: 2500,
    status: 'In Progress',
    completion_percent: 75,
    planned_start: '2024-01-15',
    planned_end: '2024-02-15',
    actual_start: '2024-01-15',
    project_manager: mockUsers[0],
    technical_owners: [mockUsers[2], mockUsers[3]],
    vendors: ['Cisco', 'Aruba'],
    device_types: ['Windows', 'macOS', 'Mobile'],
    budget: 150000,
    risk_level: 'Medium',
    notes: 'Executive network needs priority handling. CEO office requires special consideration.'
  },
  {
    id: 'DC002',
    name: 'Primary Data Center',
    region: 'North America',
    country: 'United States',
    city: 'Virginia',
    priority: 'Critical',
    phase: 1,
    users_count: 150,
    status: 'In Progress',
    completion_percent: 90,
    planned_start: '2024-01-05',
    planned_end: '2024-01-25',
    actual_start: '2024-01-05',
    project_manager: mockUsers[1],
    technical_owners: [mockUsers[3]],
    vendors: ['Cisco', 'Juniper'],
    device_types: ['Windows', 'Linux', 'IoT'],
    budget: 200000,
    risk_level: 'High',
    notes: '24/7 operation requires careful change windows. Critical services must not be disrupted.'
  },
  {
    id: 'EUR003',
    name: 'European Headquarters',
    region: 'EMEA',
    country: 'Germany',
    city: 'Frankfurt',
    priority: 'Medium',
    phase: 2,
    users_count: 1200,
    status: 'Planned',
    completion_percent: 0,
    planned_start: '2024-03-01',
    planned_end: '2024-03-30',
    project_manager: mockUsers[0],
    technical_owners: [mockUsers[2]],
    vendors: ['HPE', 'Aruba'],
    device_types: ['Windows', 'macOS', 'Mobile'],
    budget: 180000,
    risk_level: 'Low',
    notes: 'GDPR compliance required. Special attention to privacy notices for guest access.'
  },
  {
    id: 'APAC004',
    name: 'APAC Regional Office',
    region: 'APAC',
    country: 'Singapore',
    city: 'Singapore',
    priority: 'Medium',
    phase: 2,
    users_count: 800,
    status: 'Planned',
    completion_percent: 0,
    planned_start: '2024-04-01',
    planned_end: '2024-04-30',
    project_manager: mockUsers[1],
    technical_owners: [mockUsers[3]],
    vendors: ['Cisco', 'Meraki'],
    device_types: ['Windows', 'macOS', 'Mobile', 'IoT'],
    budget: 120000,
    risk_level: 'Medium',
    notes: 'Multi-tenant building with shared infrastructure. Need to coordinate with building management.'
  },
  {
    id: 'MFG006',
    name: 'Manufacturing Plant',
    region: 'LATAM',
    country: 'Mexico',
    city: 'Tijuana',
    priority: 'High',
    phase: 1,
    users_count: 450,
    status: 'Complete',
    completion_percent: 100,
    planned_start: '2023-12-01',
    planned_end: '2023-12-30',
    actual_start: '2023-12-01',
    actual_end: '2023-12-28',
    project_manager: mockUsers[0],
    technical_owners: [mockUsers[2], mockUsers[3]],
    vendors: ['Extreme', 'Ruckus'],
    device_types: ['Windows', 'IoT', 'Industrial'],
    budget: 95000,
    risk_level: 'Low',
    notes: 'Manufacturing floor required special considerations for IoT devices. Project completed ahead of schedule.'
  },
  {
    id: 'RD007',
    name: 'Research & Development',
    region: 'North America',
    country: 'United States',
    city: 'California',
    priority: 'High',
    phase: 1,
    users_count: 320,
    status: 'In Progress',
    completion_percent: 60,
    planned_start: '2024-01-10',
    planned_end: '2024-02-10',
    actual_start: '2024-01-10',
    project_manager: mockUsers[1],
    technical_owners: [mockUsers[2]],
    vendors: ['Cisco', 'Aruba'],
    device_types: ['Windows', 'macOS', 'Linux', 'IoT'],
    budget: 175000,
    risk_level: 'Medium',
    notes: 'Specialized lab equipment needs custom authentication. Research data security is a top priority.'
  },
  {
    id: 'RETAIL008',
    name: 'Flagship Retail Store',
    region: 'North America',
    country: 'United States',
    city: 'Chicago',
    priority: 'Medium',
    phase: 2,
    users_count: 85,
    status: 'Planned',
    completion_percent: 0,
    planned_start: '2024-05-01',
    planned_end: '2024-05-15',
    project_manager: mockUsers[0],
    technical_owners: [mockUsers[3]],
    vendors: ['Meraki'],
    device_types: ['Windows', 'Mobile', 'IoT'],
    budget: 45000,
    risk_level: 'Low',
    notes: 'POS systems and digital signage require special consideration. Customer guest Wi-Fi will be segmented.'
  },
  {
    id: 'EMEA010',
    name: 'London Office',
    region: 'EMEA',
    country: 'United Kingdom',
    city: 'London',
    priority: 'High',
    phase: 1,
    users_count: 620,
    status: 'Complete',
    completion_percent: 100,
    planned_start: '2023-11-01',
    planned_end: '2023-11-30',
    actual_start: '2023-11-01',
    actual_end: '2023-11-28',
    project_manager: mockUsers[1],
    technical_owners: [mockUsers[2]],
    vendors: ['Cisco', 'Juniper'],
    device_types: ['Windows', 'macOS', 'Mobile'],
    budget: 140000,
    risk_level: 'Low',
    notes: 'Site has high-security areas requiring special consideration. UK compliance requirements implemented successfully.'
  }
]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Global NAC Rollout Phase 1',
    description: 'Enterprise-wide NAC deployment across primary sites',
    project_type: 'production',
    status: 'active',
    priority: 'high',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    budget: 1200000,
    health_score: 85,
    risk_level: 'medium',
    project_manager: mockUsers[0],
    sponsor: mockUsers[0],
    sites: [mockSites[0], mockSites[1], mockSites[5]],
    created_at: '2023-12-01T00:00:00Z'
  },
  {
    id: 'proj-002',
    name: 'EMEA Expansion',
    description: 'NAC deployment across European and Middle Eastern offices',
    project_type: 'production',
    status: 'planning',
    priority: 'medium',
    start_date: '2024-03-01',
    end_date: '2024-08-31',
    budget: 800000,
    health_score: 95,
    risk_level: 'low',
    project_manager: mockUsers[1],
    sponsor: mockUsers[0],
    sites: [mockSites[2], mockSites[7]],
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'proj-003',
    name: 'APAC Pilot Program',
    description: 'Pilot deployment in Asia-Pacific region',
    project_type: 'pilot',
    status: 'planning',
    priority: 'medium',
    start_date: '2024-04-01',
    end_date: '2024-07-31',
    budget: 400000,
    health_score: 90,
    risk_level: 'low',
    project_manager: mockUsers[1],
    sponsor: mockUsers[0],
    sites: [mockSites[3]],
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'proj-004',
    name: 'Manufacturing Security Enhancement',
    description: 'Enhanced security for manufacturing and industrial sites',
    project_type: 'production',
    status: 'completed',
    priority: 'high',
    start_date: '2023-10-01',
    end_date: '2023-12-31',
    budget: 300000,
    health_score: 98,
    risk_level: 'low',
    project_manager: mockUsers[0],
    sponsor: mockUsers[0],
    sites: [mockSites[4]],
    created_at: '2023-09-15T00:00:00Z'
  }
]

// Generate Analytics from Mock Data
export const generateMockAnalytics = (): Analytics => {
  const totalSites = mockSites.length
  const completedSites = mockSites.filter(s => s.status === 'Complete').length
  const inProgressSites = mockSites.filter(s => s.status === 'In Progress').length
  const totalUsers = mockSites.reduce((acc, site) => acc + site.users_count, 0)
  
  const regionalData = mockSites.reduce((acc, site) => {
    if (!acc[site.region]) {
      acc[site.region] = { name: site.region, sites: 0, completed: 0, inProgress: 0 }
    }
    acc[site.region].sites++
    if (site.status === 'Complete') acc[site.region].completed++
    if (site.status === 'In Progress') acc[site.region].inProgress++
    return acc
  }, {} as Record<string, { name: string; sites: number; completed: number; inProgress: number }>)

  return {
    overview: {
      total_sites: totalSites,
      completed_deployments: completedSites,
      active_deployments: inProgressSites,
      total_users: totalUsers
    },
    performance: {
      success_rate: Math.round((completedSites / totalSites) * 100),
      avg_completion_rate: Math.round(mockSites.reduce((acc, s) => acc + s.completion_percent, 0) / totalSites),
      deployment_velocity: 85,
      on_time_delivery: 92
    },
    financial: {
      budget_efficiency: 94,
      total_budget: mockSites.reduce((acc, s) => acc + (s.budget || 0), 0),
      spent_to_date: Math.round(mockSites.reduce((acc, s) => acc + (s.budget || 0), 0) * 0.75),
      remaining_budget: Math.round(mockSites.reduce((acc, s) => acc + (s.budget || 0), 0) * 0.25)
    },
    regional_data: regionalData
  }
}

// Mock API delay simulation
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
export const mockApiResponses = {
  login: async (email: string, password: string) => {
    await delay(800)
    if (email === 'demo@portnox.com' && password === 'demo123') {
      return {
        success: true,
        data: {
          user: mockUsers[4], // Demo user
          token: 'mock-jwt-token-' + Date.now()
        }
      }
    }
    throw new Error('Invalid credentials')
  },

  getSites: async () => {
    await delay(500)
    return {
      success: true,
      data: mockSites
    }
  },

  createSite: async (siteData: Partial<Site>) => {
    await delay(600)
    const newSite: Site = {
      id: `SITE-${Date.now()}`,
      name: siteData.name || 'New Site',
      region: siteData.region || 'North America',
      country: siteData.country || 'United States',
      city: siteData.city,
      priority: siteData.priority || 'Medium',
      phase: siteData.phase || 1,
      users_count: siteData.users_count || 100,
      status: siteData.status || 'Planned',
      completion_percent: siteData.completion_percent || 0,
      planned_start: siteData.planned_start || new Date().toISOString().split('T')[0],
      planned_end: siteData.planned_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: siteData.budget || 50000,
      risk_level: siteData.risk_level || 'Low',
      notes: siteData.notes
    }
    mockSites.push(newSite)
    return {
      success: true,
      data: newSite
    }
  },

  getProjects: async () => {
    await delay(400)
    return {
      success: true,
      data: mockProjects
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    await delay(700)
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'New Project',
      description: projectData.description,
      project_type: projectData.project_type || 'production',
      status: projectData.status || 'planning',
      priority: projectData.priority || 'medium',
      start_date: projectData.start_date,
      end_date: projectData.end_date,
      budget: projectData.budget,
      health_score: projectData.health_score || 100,
      risk_level: projectData.risk_level || 'low',
      project_manager: projectData.project_manager,
      sponsor: projectData.sponsor,
      sites: projectData.sites || [],
      created_at: new Date().toISOString()
    }
    mockProjects.push(newProject)
    return {
      success: true,
      data: newProject
    }
  },

  getAnalytics: async () => {
    await delay(300)
    return {
      success: true,
      data: generateMockAnalytics()
    }
  },

  getUsers: async () => {
    await delay(200)
    return {
      success: true,
      data: mockUsers
    }
  }
}