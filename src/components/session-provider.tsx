import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0]
      }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const contextValue: SessionContextType = {
    user,
    isLoading,
    login,
    logout
  }

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}