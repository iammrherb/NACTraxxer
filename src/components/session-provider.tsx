"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        if (typeof window !== "undefined") {
          const savedUser = localStorage.getItem("portnox_user")
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Demo users for testing
      const demoUsers = [
        {
          id: "1",
          email: "admin@portnox.com",
          password: "admin123",
          name: "Admin User",
          role: "admin",
        },
        {
          id: "2",
          email: "user@portnox.com",
          password: "user123",
          name: "Standard User",
          role: "user",
        },
      ]

      const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        }

        setUser(userSession)
        if (typeof window !== "undefined") {
          localStorage.setItem("portnox_user", JSON.stringify(userSession))
        }
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
      return false
    }
  }

  const signOut = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("portnox_user")
    }
  }

  return <SessionContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

export default SessionProvider
