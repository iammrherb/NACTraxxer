"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Target,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Network,
  Shield,
  Plus,
  Bell,
  Search,
  Filter,
} from "lucide-react"
import { SiteManagement } from "@/components/site-management"
import { UseCaseManagement } from "@/components/use-case-management"
import { PocTrackerDashboard } from "@/components/poc-tracker-dashboard"
import { MilestoneTracker } from "@/components/milestone-tracker"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ReportsCenter } from "@/components/reports-center"
import { NotificationCenter } from "@/components/notification-center"
import type { Site, User, Vendor, DeviceType, UseCase, DashboardMetrics } from "@/lib/types"

interface MainDashboardProps {
  sites: Site[]
  users: User[]
  vendors: Vendor[]
  deviceTypes: DeviceType[]
  useCases: UseCase[]
  metrics: DashboardMetrics
}

export function MainDashboard({ sites, users, vendors, deviceTypes, useCases, metrics }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-green-600 bg-green-100"
      case "In Progress":
        return "text-blue-600 bg-blue-100"
      case "Testing":
        return "text-purple-600 bg-purple-100"
      case "Planning":
        return "text-yellow-600 bg-yellow-100"
      case "On Hold":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-red-700 bg-red-100"
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Portnox Deployment Tracker</h1>
                  <p className="text-sm text-gray-500">Enterprise NAC Implementation Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-3 py-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  {metrics.sites.total} Sites
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {users.length} Users
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sites</span>
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Use Cases</span>
            </TabsTrigger>
            <TabsTrigger value="poc-tracker" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">PoC Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Milestones</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Sites</CardTitle>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{metrics.sites.total}</div>
                  <p className="text-xs text-blue-600 mt-1">
                    {metrics.sites.completed} completed • {metrics.sites.inProgress} in progress
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Completion Rate</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{metrics.sites.avgCompletion}%</div>
                  <Progress value={metrics.sites.avgCompletion} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Active Use Cases</CardTitle>
                  <Target className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{metrics.useCases.inProgress}</div>
                  <p className="text-xs text-purple-600 mt-1">
                    {metrics.useCases.completed} completed • {metrics.useCases.avgCompletion}% avg progress
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Overdue Items</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">{metrics.milestones.overdue}</div>
                  <p className="text-xs text-orange-600 mt-1">{metrics.milestones.dueThisWeek} due this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                    <Building2 className="h-6 w-6" />
                    <span>Add New Site</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                    <Target className="h-6 w-6" />
                    <span>Create Use Case</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                    <Calendar className="h-6 w-6" />
                    <span>Add Milestone</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Site Status */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sites</CardTitle>
                  <CardDescription>Latest deployment sites and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sites.slice(0, 5).map((site) => (
                      <div
                        key={site.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{site.name}</h4>
                            <Badge variant={getPriorityColor(site.priority)} className="text-xs">
                              {site.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {site.region} • {site.country} • {site.users} users
                          </p>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}
                            >
                              {site.status}
                            </span>
                            {site.risk_level && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(site.risk_level)}`}
                              >
                                {site.risk_level} Risk
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-sm font-medium">{site.completion_percent}%</div>
                          <Progress value={site.completion_percent} className="w-20 h-2" />
                          <div className="text-xs text-gray-500">{site.health_score}/100 Health</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Case Progress</CardTitle>
                  <CardDescription>Current implementation status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {useCases.slice(0, 5).map((useCase) => (
                      <div key={useCase.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-sm">{useCase.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {useCase.category}
                              </Badge>
                              <Badge variant={getPriorityColor(useCase.priority)} className="text-xs">
                                {useCase.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{useCase.completion_percentage}%</div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(useCase.status)}`}
                            >
                              {useCase.status}
                            </span>
                          </div>
                        </div>
                        <Progress value={useCase.completion_percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resource Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="h-5 w-5" />
                    <span>Network Vendors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendors.slice(0, 5).map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between">
                        <span className="text-sm">{vendor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {vendor.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Device Types</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {deviceTypes.slice(0, 5).map((deviceType) => (
                      <div key={deviceType.id} className="flex items-center justify-between">
                        <span className="text-sm">{deviceType.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {deviceType.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <span className="text-sm">{user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sites">
            <SiteManagement sites={sites} users={users} vendors={vendors} deviceTypes={deviceTypes} />
          </TabsContent>

          <TabsContent value="use-cases">
            <UseCaseManagement useCases={useCases} users={users} />
          </TabsContent>

          <TabsContent value="poc-tracker">
            <PocTrackerDashboard useCases={useCases} />
          </TabsContent>

          <TabsContent value="milestones">
            <MilestoneTracker sites={sites} users={users} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard metrics={metrics} sites={sites} useCases={useCases} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsCenter sites={sites} useCases={useCases} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure your Portnox Deployment Tracker</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive email updates for important events</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Default Timezone</h4>
                          <p className="text-sm text-gray-500">Set your preferred timezone for dates and times</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Data Export</h4>
                          <p className="text-sm text-gray-500">Export your deployment data</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Panel */}
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  )
}
