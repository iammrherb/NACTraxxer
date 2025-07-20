"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SiteTable } from "@/components/site-table"
import { SiteForm } from "@/components/site-form"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { UserManagement } from "@/components/user-management"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { NotificationSettings } from "@/components/notification-settings"
import { UseCasesDashboard } from "@/components/use-cases-dashboard"
import { EnhancedArchitectureDiagram } from "@/components/enhanced-architecture-diagram"
import { TestMatrixDashboard } from "@/components/test-matrix-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, BarChart3, FileText, Bell, Target, Network, Plus, TestTube } from "lucide-react"

interface Site {
  id: string
  name: string
  location: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  progress: number
  vendor: string
  deviceType: string
  lastUpdated: string
  assignedTo: string
  priority: "high" | "medium" | "low"
  notes?: string
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
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
      }
    } catch (error) {
      console.error("Error loading sites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteSubmit = async (siteData: Omit<Site, "id" | "lastUpdated">) => {
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
      }
    } catch (error) {
      console.error("Error saving site:", error)
    }
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
      }
    } catch (error) {
      console.error("Error deleting site:", error)
    }
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "overview":
        return <BarChart3 className="h-4 w-4" />
      case "sites":
        return <Building2 className="h-4 w-4" />
      case "use-cases":
        return <Target className="h-4 w-4" />
      case "test-matrix":
        return <TestTube className="h-4 w-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header onManageUsers={() => setShowUserManagement(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onManageUsers={() => setShowUserManagement(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portnox NAC Deployment Tracker</h1>
              <p className="text-gray-600">Comprehensive site deployment and use case validation platform</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                POC Environment
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                v2.1.0
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              {getTabIcon("overview")}
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center space-x-2">
              {getTabIcon("sites")}
              <span className="hidden sm:inline">Sites</span>
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="flex items-center space-x-2">
              {getTabIcon("use-cases")}
              <span className="hidden sm:inline">Use Cases</span>
            </TabsTrigger>
            <TabsTrigger value="test-matrix" className="flex items-center space-x-2">
              {getTabIcon("test-matrix")}
              <span className="hidden sm:inline">Test Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              {getTabIcon("architecture")}
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              {getTabIcon("reports")}
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              {getTabIcon("settings")}
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProgressDashboard sites={sites} />
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Site Deployments</span>
                  </CardTitle>
                  <Button onClick={() => setShowSiteForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SiteTable sites={sites} onEdit={handleEditSite} onDelete={handleDeleteSite} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="use-cases" className="space-y-6">
            <UseCasesDashboard />
          </TabsContent>

          <TabsContent value="test-matrix" className="space-y-6">
            <TestMatrixDashboard />
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

      {/* Modals */}
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
