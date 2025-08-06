'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Upload, Users, Palette, Sun, Moon, Network, List, BarChart3, Book } from 'lucide-react'
import ArchitectureDesigner from '@/components/architecture-designer'
import SiteManagement from '@/components/site-management'
import ProgressTracking from '@/components/progress-tracking'
import SiteWorkbook from '@/components/site-workbook'
import UserManagementModal from '@/components/user-management-modal'
import ThemeCustomizer from '@/components/theme-customizer'
import { ThemeProvider } from '@/components/theme-provider'

export default function ABMDesigner() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [customerLogo, setCustomerLogo] = useState('/placeholder.svg?height=40&width=150&text=ABM+Industries')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomerLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <img 
                    src="/placeholder.svg?height=50&width=150&text=Portnox+Logo" 
                    alt="Portnox Logo" 
                    className="h-12 filter drop-shadow-md hover:scale-105 transition-transform"
                  />
                  <Separator orientation="vertical" className="h-10 bg-white/30" />
                  <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                    <img 
                      src={customerLogo || "/placeholder.svg"} 
                      alt="Customer Logo" 
                      className="h-10 max-w-[150px] object-contain"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-shadow">
                  Zero Trust NAC Architecture Designer
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Change Logo</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full">
                  <Sun className="h-4 w-4" />
                  <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                  <Moon className="h-4 w-4" />
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserModal(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThemeCustomizer(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture" className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>Architecture Designer</span>
              </TabsTrigger>
              <TabsTrigger value="sites" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>Master Site List</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Rollout Progress</span>
              </TabsTrigger>
              <TabsTrigger value="workbook" className="flex items-center space-x-2">
                <Book className="h-4 w-4" />
                <span>Site Workbook</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="architecture">
              <ArchitectureDesigner />
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
    </ThemeProvider>
  )
}
