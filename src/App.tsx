import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AccessibilityProvider } from './components/ui/AccessibilityProvider'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Sites } from './pages/Sites'
import { Projects } from './pages/Projects'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { AccessibilityDemo } from './pages/AccessibilityDemo'
import { useAuthStore } from './stores/authStore'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

function App() {
  const { user, isLoading, checkAuth } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth()
      setIsInitialized(true)
    }
    initializeAuth()
  }, [checkAuth])

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AccessibilityProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/accessibility-demo" element={<AccessibilityDemo />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </AccessibilityProvider>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccessibilityProvider>
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accessibility-demo" element={<AccessibilityDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </AccessibilityProvider>
    </div>
  )
}

export default App