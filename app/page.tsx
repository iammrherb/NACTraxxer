'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ArchitectureDesigner from '@/components/architecture-designer'
import SiteManagement from '@/components/site-management'
import ProgressTracking from '@/components/progress-tracking'
import SiteWorkbook from '@/components/site-workbook'
import UserManagementModal from '@/components/user-management-modal'
import ThemeCustomizer from '@/components/theme-customizer'
import { Users, Palette, Upload } from 'lucide-react'

export default function Home() {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                  alt="Portnox Logo" 
                  className="h-12 filter brightness-0 invert"
                />
                <div className="h-8 w-px bg-white/30" />
                <img 
                  src="https://ahorrainvierte.com/wp-content/uploads/abm-industries-inc.png" 
                  alt="ABM Industries Logo" 
                  className="h-10 bg-white/10 px-3 py-1 rounded filter brightness-0 invert"
                />
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">Zero Trust NAC Architecture Designer</h1>
              <p className="text-blue-100 text-sm">Enterprise Network Access Control Platform</p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setShowUserManagement(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setShowThemeCustomizer(true)}
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="architecture" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="architecture">Architecture Designer</TabsTrigger>
            <TabsTrigger value="sites">Site Management</TabsTrigger>
            <TabsTrigger value="workbook">Site Workbook</TabsTrigger>
            <TabsTrigger value="progress">Rollout Progress</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <ArchitectureDesigner />
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <SiteManagement />
          </TabsContent>

          <TabsContent value="workbook" className="space-y-6">
            <SiteWorkbook />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTracking />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive reporting and analytics dashboard coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <UserManagementModal 
        open={showUserManagement} 
        onClose={() => setShowUserManagement(false)} 
      />
      <ThemeCustomizer 
        open={showThemeCustomizer} 
        onClose={() => setShowThemeCustomizer(false)} 
      />
    </div>
  )
}
