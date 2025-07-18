"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteTable } from "@/components/site-table"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { UserManagement } from "@/components/user-management"
import { NotificationSettings } from "@/components/notification-settings"
import { RoleManagement } from "@/components/role-management"
import { UseCasesDashboard } from "@/components/use-cases-dashboard"
import { ScopingQuestionnaire } from "@/components/scoping-questionnaire"
import { ArchitectureDiagram } from "@/components/architecture-diagram"
import { PermissionGuard } from "@/components/permission-guard"
import { Header } from "@/components/header"
import { BarChart3, Building2, FileText, Users, Bell, Shield, Target, ClipboardList, Network } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portnox Deployment Tracker</h1>
          <p className="text-xl text-muted-foreground">Master Site Deployment Plan and Use Case Tracker</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>

            <PermissionGuard permission="sites.view">
              <TabsTrigger value="sites" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sites</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="use_cases.view">
              <TabsTrigger value="use-cases" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Use Cases</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="scoping.view">
              <TabsTrigger value="scoping" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Scoping</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="architecture.view">
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span className="hidden sm:inline">Architecture</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="reports.view">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="users.view">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="users.manage_roles">
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Roles</span>
              </TabsTrigger>
            </PermissionGuard>

            <PermissionGuard permission="notifications.view">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </PermissionGuard>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">67% completion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Use Cases</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">18 validated, 6 pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Badge variant="secondary">92%</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% from last quarter</p>
                </CardContent>
              </Card>
            </div>

            <ProgressDashboard />
          </TabsContent>

          <PermissionGuard permission="sites.view">
            <TabsContent value="sites" className="space-y-6">
              <SiteTable />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="use_cases.view">
            <TabsContent value="use-cases" className="space-y-6">
              <UseCasesDashboard />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="scoping.view">
            <TabsContent value="scoping" className="space-y-6">
              <ScopingQuestionnaire />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="architecture.view">
            <TabsContent value="architecture" className="space-y-6">
              <ArchitectureDiagram />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="reports.view">
            <TabsContent value="reports" className="space-y-6">
              <ReportsDashboard />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="users.view">
            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="users.manage_roles">
            <TabsContent value="roles" className="space-y-6">
              <RoleManagement />
            </TabsContent>
          </PermissionGuard>

          <PermissionGuard permission="notifications.view">
            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings />
            </TabsContent>
          </PermissionGuard>
        </Tabs>
      </main>
    </div>
  )
}
