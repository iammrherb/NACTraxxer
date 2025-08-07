'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload, Users, Palette, Network, List, BarChart3, Book, Download, Save, Play, Moon, Sun } from 'lucide-react'
import ArchitectureDesigner from '@/components/ArchitectureDesigner'
import SiteManagement from '@/components/SiteManagement'
import ProgressTracking from '@/components/ProgressTracking'
import SiteWorkbook from '@/components/SiteWorkbook'
import UserManagementModal from '@/components/UserManagementModal'
import ThemeCustomizer from '@/components/ThemeCustomizer'
import { Badge } from '@/components/ui/badge'

export default function ABMDesigner() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [customerLogo, setCustomerLogo] = useState('https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true')

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('portnox-nac-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setActiveTab(config.currentTab || 'architecture')
        setIsDarkMode(config.theme === 'dark')
        setCustomerLogo(config.customerLogo || 'https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true')
      } catch (error) {
        console.error('Failed to load saved configuration:', error)
      }
    }
  }, [])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newLogo = e.target?.result as string
        setCustomerLogo(newLogo)
        saveConfiguration({ customerLogo: newLogo })
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    saveConfiguration({ theme: newTheme ? 'dark' : 'light' })
  }

  const saveConfiguration = (updates: any = {}) => {
    const config = {
      currentTab: activeTab,
      theme: isDarkMode ? 'dark' : 'light',
      customerLogo,
      savedAt: new Date().toISOString(),
      ...updates
    }
    localStorage.setItem('portnox-nac-config', JSON.stringify(config))
  }

  const handleExport = () => {
    const config = {
      timestamp: new Date().toISOString(),
      currentTab: activeTab,
      theme: isDarkMode ? 'dark' : 'light',
      customerLogo,
      version: '20.0'
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

    showNotification('Configuration exported successfully!', 'success')
  }

  const handleSave = () => {
    saveConfiguration()
    showNotification('Configuration saved successfully!', 'success')
  }

  const handleDeploy = () => {
    showNotification('Starting deployment process...', 'info')
    
    setTimeout(() => {
      showNotification('Deployment initiated successfully!', 'success')
    }, 2000)
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Enhanced Header with Portnox Colors */}
        <header className="bg-gradient-to-r from-[#00c8d7] via-[#0099cc] to-[#007acc] text-white shadow-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Portnox Logo Section */}
                <div className="flex items-center space-x-4">
                  <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img 
                      src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                      alt="Portnox Logo" 
                      className="h-10 w-auto filter drop-shadow-sm"
                    />
                  </div>
                  <div className="border-l border-white/30 pl-4">
                    <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                      NAC Architecture Designer
                    </h1>
                    <p className="text-sm text-white/90 font-medium">
                      Zero Trust Network Access Control
                    </p>
                  </div>
                </div>

                {/* Customer Logo Section */}
                <div className="flex items-center space-x-3 ml-8">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all duration-300">
                    <img 
                      src={customerLogo || "/placeholder.svg"} 
                      alt="Customer Logo" 
                      className="h-10 max-w-[160px] object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">Change Logo</span>
                      </div>
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
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-semibold">
                  Version 20.0
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeploy}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Deploy
                </Button>

                <Separator orientation="vertical" className="h-8 bg-white/30" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserModal(true)}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThemeCustomizer(true)}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2">
              <TabsTrigger 
                value="architecture" 
                className="flex items-center space-x-2 data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
              >
                <Network className="h-4 w-4" />
                <span>Architecture Designer</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sites" 
                className="flex items-center space-x-2 data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
              >
                <List className="h-4 w-4" />
                <span>Master Site List</span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex items-center space-x-2 data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Rollout Progress</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workbook" 
                className="flex items-center space-x-2 data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
              >
                <Book className="h-4 w-4" />
                <span>Site Workbook</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="architecture">
              <ArchitectureDesigner customerLogo={customerLogo} />
            </TabsContent>

            <TabsContent value="sites">
              <SiteManagement onSiteSelect={setSelectedSiteId} />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTracking />
            </TabsContent>

            <TabsContent value="workbook">
              <SiteWorkbook siteId={selectedSiteId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <UserManagementModal 
          open={showUserModal} 
          onOpenChange={setShowUserModal} 
        />
        
        <ThemeCustomizer 
          open={showThemeCustomizer} 
          onOpenChange={setShowThemeCustomizer} 
        />
      </div>
    </div>
  )
}
