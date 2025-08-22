"use client"

import { useState } from "react"
import { Toaster } from "./components/ui/toaster"
import { ThemeProvider } from "./components/ui/theme-provider"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleLogin = (email: string, password: string) => {
    // Simple authentication check
    const validCredentials = [
      { email: "admin@portnox.com", password: "admin123" },
      { email: "user@portnox.com", password: "user123" }
    ]

    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    )

    if (isValid) {
      setIsAuthenticated(true)
      setUserEmail(email)
    } else {
      alert("Invalid credentials. Please use the demo credentials provided.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail("")
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="portnox-theme">
      <div className="App">
        {isAuthenticated ? (
          <Dashboard userEmail={userEmail} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App