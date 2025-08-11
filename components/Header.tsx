'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Users, Moon, Sun, Upload, Download, Save, Play, Palette } from 'lucide-react'
import UserManagementModal from './UserManagementModal'
import ThemeCustomizer from './ThemeCustomizer'

interface HeaderProps {
  currentTab: string
  onTabChange: (tab: string) => void
  onThemeToggle: () => void
  isDarkMode: boolean
  customerLogo?: string
  onLogoUpload: (file: File) => void
}

export default function Header({ 
  currentTab, 
  onTabChange, 
  onThemeToggle, 
  isDarkMode,
  customerLogo,
  onLogoUpload 
}: HeaderProps) {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onLogoUpload(file)
    }
  }

  const handleExport = () => {
    // Export current configuration
    const config = {
      timestamp: new Date().toISOString(),
      currentTab,
      theme: isDarkMode ? 'dark' : 'light',
      customerLogo
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-nac-config-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    // Save to localStorage
    const config = {
      currentTab,
      theme: isDarkMode ? 'dark' : 'light',
      customerLogo,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem('portnox-nac-config', JSON.stringify(config))
    
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = 'Configuration saved successfully!'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  const handleDeploy = () => {
    // Simulate deployment process
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = 'Starting deployment process...'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.textContent = 'Deployment initiated successfully!'
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    }, 2000)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 5000)
  }

  return (
    <>
      <header className="bg-gradient-to-r from-[#00c8d7] to-[#0099cc] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              {/* Portnox Logo */}
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <img 
                    src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                    alt="Portnox" 
                    className="h-8 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">NAC Designer</h1>
                  <p className="text-sm opacity-90">Zero Trust Architecture</p>
                </div>
              </div>

              {/* Customer Logo */}
              <div className="flex items-center space-x-2 ml-8">
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <img 
                    src={customerLogo || "https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true"} 
                    alt="Customer Logo" 
                    className="h-8 w-auto max-w-[120px]"
                  />
                </div>
                <div>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-white/10"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Logo
                      </span>
                    </Button>
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Version 20
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-white hover:bg-white/10"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeploy}
                className="text-white hover:bg-white/10"
              >
                <Play className="w-4 h-4 mr-1" />
                Deploy
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserManagement(true)}
                className="text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-1" />
                Users
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThemeCustomizer(true)}
                className="text-white hover:bg-white/10"
              >
                <Palette className="w-4 h-4 mr-1" />
                Theme
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
                className="text-white hover:bg-white/10"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <UserManagementModal 
        isOpen={showUserManagement}
        onClose={() => setShowUserManagement(false)}
      />
      
      <ThemeCustomizer
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </>
  )
}
