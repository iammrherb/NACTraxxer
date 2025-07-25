import { mockApiResponses, Site, Project, User, Analytics } from './mockData'

// API configuration for different environments
const getApiUrl = () => {
  // Always use mock data for now - no backend needed
  return ''
}

export const API_BASE_URL = getApiUrl()

// Mock API client that simulates real API calls
export class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  // Simulate API request with mock data
  private async mockRequest<T>(
    endpoint: string,
    options: { method?: string; body?: any } = {}
  ): Promise<{ success: boolean; data?: T; error?: any }> {
    try {
      // Route to appropriate mock function
      if (endpoint === '/api/auth/login' && options.method === 'POST') {
        const { email, password } = options.body
        return await mockApiResponses.login(email, password) as any
      }

      if (endpoint === '/api/sites' && options.method === 'GET') {
        return await mockApiResponses.getSites() as any
      }

      if (endpoint === '/api/sites' && options.method === 'POST') {
        return await mockApiResponses.createSite(options.body) as any
      }

      if (endpoint === '/api/projects' && options.method === 'GET') {
        return await mockApiResponses.getProjects() as any
      }

      if (endpoint === '/api/projects' && options.method === 'POST') {
        return await mockApiResponses.createProject(options.body) as any
      }

      if (endpoint === '/api/analytics' && options.method === 'GET') {
        return await mockApiResponses.getAnalytics() as any
      }

      if (endpoint === '/api/users' && options.method === 'GET') {
        return await mockApiResponses.getUsers() as any
      }

      // Default response for unhandled endpoints
      return {
        success: true,
        data: [] as any
      }
    } catch (error) {
      console.error('Mock API request failed:', error)
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Request failed'
        }
      }
    }
  }

  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.mockRequest<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.mockRequest<T>(endpoint, { method: 'POST', body: data })
  }

  async put<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.mockRequest<T>(endpoint, { method: 'PUT', body: data })
  }

  async delete<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.mockRequest<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()