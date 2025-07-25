import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  user_type: string
  organization_id?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const result = await apiClient.post('/api/auth/login', { email, password })

          if (!result.success) {
            throw new Error(result.error?.message || 'Login failed')
          }

          // Set token for future requests
          apiClient.setToken(result.data.token)

          set({
            user: result.data.user,
            token: result.data.token,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        apiClient.setToken(null)
        set({ user: null, token: null })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          apiClient.setToken(token)
          const result = await apiClient.get('/api/users')

          if (!result.success) {
            // Token is invalid, clear auth state
            apiClient.setToken(null)
            set({ user: null, token: null, isLoading: false })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          apiClient.setToken(null)
          set({ user: null, token: null, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
)