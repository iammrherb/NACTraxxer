import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Header } from './components/Layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Sites } from './pages/Sites'
import { Projects } from './pages/Projects'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { useAuthStore } from './stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
          <div className="h-8 w-8 bg-white rounded-lg" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600">Initializing your deployment tracker</p>
      </motion.div>
    </div>
  )
}

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
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  )
}

export default App