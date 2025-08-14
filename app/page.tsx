"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Upload, Users, Palette, Network, List, BarChart3, Book, Calendar, Database } from "lucide-react"
import ArchitectureDesigner from "@/components/architecture-designer"
import SiteManagement from "@/components/site-management"
import ProgressTracking from "@/components/progress-tracking"
import SiteWorkbook from "@/components/site-workbook"
import TimelineScheduler from "@/components/timeline-scheduler"
import UserManagementModal from "@/components/UserManagementModal"
import ThemeCustomizer from "@/components/theme-customizer"
import DemoDataModal from "@/components/demo-data-modal"
import { toast } from "@/components/ui/use-toast"
import { storage } from "@/lib/storage"

export default function NACDesigner() {
  const [activeTab, setActiveTab] = useState("architecture")
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [customerLogo, setCustomerLogo] = useState("")
  const [companyName, setCompanyName] = useState("TechCorp Global")
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load user preferences
  useEffect(() => {
    if (isClient) {
      loadUserPreferences()
    }
  }, [isClient])

  const loadUserPreferences = async () => {
    try {
      const preferences = await storage.getUserPreferences()
      if (preferences.customerLogo) {
        setCustomerLogo(preferences.customerLogo)
      }
      if (preferences.companyName) {
        setCompanyName(preferences.companyName)
      }
      if (preferences.defaultView) {
        setActiveTab(preferences.defaultView)
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.match("image.*")) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setCustomerLogo(result)

        try {
          await storage.updateUserPreferences({ customerLogo: result })
          toast({
            title: "Logo updated",
            description: "Customer logo has been updated successfully.",
          })
        } catch (error) {
          console.error("Error saving logo:", error)
          toast({
            title: "Error",
            description: "Failed to save logo. Please try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTabChange = async (newTab: string) => {
    setActiveTab(newTab)

    try {
      await storage.updateUserPreferences({ defaultView: newTab })
    } catch (error) {
      console.error("Error saving tab preference:", error)
    }
  }

  const handleDemoDataLoad = async (
    scenario: "corporate" | "education" | "healthcare" | "government" | "manufacturing" | "retail",
  ) => {
    try {
      await storage.generateDemoData(scenario)

      // Update company name based on scenario
      const preferences = await storage.getUserPreferences()
      setCompanyName(preferences.companyName)

      toast({
        title: "Demo data loaded",
        description: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} demo data has been loaded successfully.`,
      })

      // Refresh the current view
      window.location.reload()
    } catch (error) {
      console.error("Error loading demo data:", error)
      toast({
        title: "Error",
        description: "Failed to load demo data. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading NAC Designer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <img
                  src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"
                  alt="Portnox Logo"
                  className="h-12 filter brightness-0 invert drop-shadow-md hover:scale-105 transition-transform"
                />
                <Separator orientation="vertical" className="h-10 bg-white/30" />
                <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <img
                    src={
                      customerLogo ||
                      "https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt="Customer Logo"
                    className="h-10 max-w-[150px] object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Zero Trust NAC Architecture Designer</h1>
                <p className="text-sm opacity-90">{companyName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
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
                onClick={() => setShowDemoModal(true)}
                className="text-white hover:bg-white/20"
              >
                <Database className="h-4 w-4 mr-2" />
                Demo Data
              </Button>

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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
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
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Timeline & Schedule</span>
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

          <TabsContent value="timeline">
            <TimelineScheduler />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <UserManagementModal open={showUserModal} onOpenChange={setShowUserModal} />

      <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />

      <DemoDataModal
        open={showDemoModal}
        onOpenChange={setShowDemoModal}
        onDataLoaded={() => window.location.reload()}
      />
    </div>
  )
}
