"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Upload, Users, Palette, Network, List, BarChart3, Book } from "lucide-react"
import ArchitectureDesigner from "@/components/architecture-designer"
import SiteManagement from "@/components/site-management"
import ProgressTracking from "@/components/progress-tracking"
import SiteWorkbook from "@/components/site-workbook"
import UserManagementModal from "@/components/user-management-modal"
import ThemeCustomizer from "@/components/theme-customizer"
import { SitesProvider } from "@/hooks/use-sites"
import { ThemeProvider } from "@/lib/theme"

export default function ABMDesigner() {
  const [activeTab, setActiveTab] = useState("architecture")
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [customerLogo, setCustomerLogo] = useState<string>(
    "https://servicecenter.uk.abm.com/Portal/assets/images/logo-light.png",
  )

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match("image.*")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newLogo = e.target?.result as string
        setCustomerLogo(newLogo)
        localStorage.setItem("customerLogo", newLogo)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const savedLogo = localStorage.getItem("customerLogo")
    if (savedLogo) setCustomerLogo(savedLogo)
  }, [])

  return (
    <ThemeProvider>
      <SitesProvider>
        <div className="min-h-screen bg-neutral-50">
          {/* Header */}
          <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-4">
                    <img src="/logos/portnox.png" alt="Portnox Logo" className="h-10 object-contain drop-shadow" />
                    <Separator orientation="vertical" className="h-10 bg-white/30" />
                    <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                      <img
                        src={customerLogo || "/placeholder.svg?height=40&width=150&query=customer%20logo%20placeholder"}
                        alt="Customer Logo"
                        className="h-10 max-w-[150px] object-contain"
                      />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold">Zero Trust NAC Architecture Designer</h1>
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
          <main className="container mx-auto px-4 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
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
          </main>

          {/* Modals */}
          <UserManagementModal open={showUserModal} onOpenChange={setShowUserModal} />
          <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />
        </div>
      </SitesProvider>
    </ThemeProvider>
  )
}
