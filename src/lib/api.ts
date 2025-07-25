// API configuration for different environments
const getApiUrl = () => {
  // In production (Netlify), use the same domain for API calls
  if (import.meta.env.PROD) {
    return window.location.origin
  }
  
  // In development, use environment variable or fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:3001'
}

export const API_BASE_URL = getApiUrl()

// API client with proper error handling
export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: any }> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error'
        }
      }
    }
  }

  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: any }> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()