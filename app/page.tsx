"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { SiteTable } from "@/components/site-table"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteWorkbook } from "@/components/site-workbook"
import { SiteForm } from "@/components/site-form"
import { UserManagement } from "@/components/user-management"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { NotificationSettings } from "@/components/notification-settings"
import type { Site, User as DatabaseUser, Vendor, DeviceType, ChecklistItem } from "@/lib/database"

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([])
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeView, setActiveView] = useState<"dashboard" | "sites" | "workbook" | "reports">("dashboard")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data in parallel
      const [sitesRes, usersRes, vendorsRes, deviceTypesRes, checklistRes] = await Promise.all([
        fetch("/api/sites").catch(() => ({ ok: false })),
        fetch("/api/users").catch(() => ({ ok: false })),
        fetch("/api/vendors").catch(() => ({ ok: false })),
        fetch("/api/device-types").catch(() => ({ ok: false })),
        fetch("/api/checklist-items").catch(() => ({ ok: false })),
      ])

      if (sitesRes.ok) {
        const sitesData = await sitesRes.json()
        setSites(sitesData)
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }
      if (vendorsRes.ok) {
        const vendorsData = await vendorsRes.json()
        setVendors(vendorsData)
      }
      if (deviceTypesRes.ok) {
        const deviceTypesData = await deviceTypesRes.json()
        setDeviceTypes(deviceTypesData)
      }
      if (checklistRes.ok) {
        const checklistData = await checklistRes.json()
        setChecklistItems(checklistData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please check your database connection.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onManageUsers={() => setShowUserManagement(true)} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Portnox Deployment Tracker</h2>
                <p className="text-muted-foreground">Master Site Deployment Plan Dashboard</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowReports(true)} variant="outline">
                  Reports
                </Button>
                <Button onClick={() => setShowNotifications(true)} variant="outline">
                  Notifications
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {error && (
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
                <Button onClick={loadData} className="mt-2" size="sm">
                  Retry
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex space-x-2">
          <Button
            variant={activeView === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </Button>
          <Button variant={activeView === "sites" ? "default" : "outline"} onClick={() => setActiveView("sites")}>
            Sites
          </Button>
          <Button variant={activeView === "workbook" ? "default" : "outline"} onClick={() => setActiveView("workbook")}>
            Workbook
          </Button>
          <Button variant={activeView === "reports" ? "default" : "outline"} onClick={() => setActiveView("reports")}>
            Reports
          </Button>
        </div>

        {/* Content */}
        {activeView === "dashboard" && <ProgressDashboard sites={sites} />}

        {activeView === "sites" && (
          <SiteTable
            sites={sites}
            onAddSite={() => {
              setEditingSite(null)
              setShowSiteForm(true)
            }}
            onEditSite={(site) => {
              setEditingSite(site)
              setShowSiteForm(true)
            }}
            onViewWorkbook={(site) => {
              setSelectedSite(site)
              setActiveView("workbook")
            }}
            onShowNotes={(site) => {
              console.log("Show notes for:", site.name)
            }}
            onSelectSite={setSelectedSite}
          />
        )}

        {activeView === "workbook" && <SiteWorkbook site={selectedSite} />}

        {activeView === "reports" && <ReportsDashboard />}
      </div>

      {/* Modals */}
      {showSiteForm && (
        <SiteForm
          site={editingSite}
          isOpen={showSiteForm}
          onClose={() => {
            setShowSiteForm(false)
            setEditingSite(null)
          }}
          onSave={async (siteData) => {
            try {
              const url = editingSite ? `/api/sites/${editingSite.id}` : "/api/sites"
              const method = editingSite ? "PUT" : "POST"

              const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(siteData),
              })

              if (response.ok) {
                await loadData()
                setShowSiteForm(false)
                setEditingSite(null)
              }
            } catch (error) {
              console.error("Error saving site:", error)
            }
          }}
          users={users}
          vendors={vendors}
          deviceTypes={deviceTypes}
          checklistItems={checklistItems}
        />
      )}

      {showUserManagement && (
        <UserManagement
          users={users}
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
          onCreateUser={async (userData) => {
            try {
              const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
              })
              if (response.ok) {
                await loadData()
              }
            } catch (error) {
              console.error("Error creating user:", error)
            }
          }}
          onUpdateUser={async (id, userData) => {
            try {
              const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
              })
              if (response.ok) {
                await loadData()
              }
            } catch (error) {
              console.error("Error updating user:", error)
            }
          }}
          onDeleteUser={async (id) => {
            try {
              const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
              })
              if (response.ok) {
                await loadData()
              }
            } catch (error) {
              console.error("Error deleting user:", error)
            }
          }}
        />
      )}

      {showReports && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Reports Dashboard</h2>
              <Button onClick={() => setShowReports(false)} variant="outline">
                Close
              </Button>
            </div>
            <ReportsDashboard />
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Notification Settings</h2>
              <Button onClick={() => setShowNotifications(false)} variant="outline">
                Close
              </Button>
            </div>
            <NotificationSettings />
          </div>
        </div>
      )}
    </div>
  )
}
