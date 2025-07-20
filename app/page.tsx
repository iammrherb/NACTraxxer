"use client"

import { useState, useEffect } from "react"
import type { Site } from "@/lib/database"
import { Header } from "@/components/header"
import { SiteTable } from "@/components/site-table"
import { SiteForm } from "@/components/site-form"
import { SiteWorkbook } from "@/components/site-workbook"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { UserManagement } from "@/components/user-management"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { NotificationSettings } from "@/components/notification-settings"
import { POCTrackerDashboard } from "@/components/poc-tracker-dashboard"
import { EnhancedArchitectureDiagram } from "@/components/enhanced-architecture-diagram"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, BarChart3, FileText, Bell, Target, Network, BookOpen } from "lucide-react"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [selectedSiteForWorkbook, setSelectedSiteForWorkbook] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sites")
      if (response.ok) {
        const data = await response.json()
        setSites(data)
      } else {
        console.error("Failed to load sites:", response.statusText)
      }
    } catch (error) {
      console.error("Error loading sites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteSubmit = async (siteData: Partial<Site>) => {
    try {
      const url = editingSite ? `/api/sites/${editingSite.id}` : "/api/sites"
      const method = editingSite ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData),
      })

      if (response.ok) {
        await loadSites()
        setShowSiteForm(false)
        setEditingSite(null)
      } else {
        console.error("Error saving site:", await response.text())
      }
    } catch (error) {
      console.error("Error saving site:", error)
    }
  }

  const handleAddSite = () => {
    setEditingSite(null)
    setShowSiteForm(true)
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setShowSiteForm(true)
  }

  const handleDeleteSite = async (id: string) => {
    try {
      const response = await fetch(`/api/sites/${id}`, { method: "DELETE" })
      if (response.ok) {
        await loadSites()
      } else {
        console.error("Error deleting site:", await response.text())
      }
    } catch (error) {
      console.error("Error deleting site:", error)
    }
  }

  const handleViewWorkbook = (site: Site) => {
    setSelectedSiteForWorkbook(site)
    setActiveTab("workbook")
  }

  const handleShowNotes = (site: Site) => {
    alert(`Notes for ${site.name}:\n\n${site.notes || "No notes available."}`)
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "overview":
        return <BarChart3 className="h-4 w-4" />
      case "sites":
        return <Building2 className="h-4 w-4" />
      case "workbook":
        return <BookOpen className="h-4 w-4" />
      case "poc-tracker":
        return <Target className="h-4 w-4" />
      case "architecture":
        return <Network className="h-4 w-4" />
      case "reports":
        return <FileText className="h-4 w-4" />
      case "settings":
        return <Bell className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header onManageUsers={() => setShowUserManagement(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header onManageUsers={() => setShowUserManagement(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Portnox NAC Deployment Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive site deployment and use case validation platform
              </p>
            </div>
            <div className="flex space-x-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700"
              >
                POC Environment
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700"
              >
                v2.1.0
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              {getTabIcon("overview")} <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center space-x-2">
              {getTabIcon("sites")} <span className="hidden sm:inline">Sites</span>
            </TabsTrigger>
            <TabsTrigger value="workbook" className="flex items-center space-x-2" disabled={!selectedSiteForWorkbook}>
              {getTabIcon("workbook")} <span className="hidden sm:inline">Workbook</span>
            </TabsTrigger>
            <TabsTrigger value="poc-tracker" className="flex items-center space-x-2">
              {getTabIcon("poc-tracker")} <span className="hidden sm:inline">POC Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              {getTabIcon("architecture")} <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              {getTabIcon("reports")} <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              {getTabIcon("settings")} <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProgressDashboard sites={sites} />
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <SiteTable
              sites={sites}
              onAddSite={handleAddSite}
              onEditSite={handleEditSite}
              onDeleteSite={handleDeleteSite}
              onViewWorkbook={handleViewWorkbook}
              onShowNotes={handleShowNotes}
            />
          </TabsContent>

          <TabsContent value="workbook" className="space-y-6">
            {selectedSiteForWorkbook ? (
              <SiteWorkbook site={selectedSiteForWorkbook} onUpdate={loadSites} />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <p>Select a site from the Master Site List to view its workbook.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="poc-tracker" className="space-y-6">
            <POCTrackerDashboard />
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <EnhancedArchitectureDiagram />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>

      {showSiteForm && (
        <SiteForm
          site={editingSite}
          onSubmit={handleSiteSubmit}
          onCancel={() => {
            setShowSiteForm(false)
            setEditingSite(null)
          }}
        />
      )}

      {showUserManagement && <UserManagement onClose={() => setShowUserManagement(false)} />}
    </div>
  )
}
