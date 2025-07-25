import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Breadcrumbs } from './components/Breadcrumbs'
import { RelatedLinks } from './components/InternalLinkHelper'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Sites } from './pages/Sites'
import { Projects } from './pages/Projects'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <Breadcrumbs />
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <RelatedLinks currentPage={location.pathname.split('/')[1] || 'dashboard'} />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default App