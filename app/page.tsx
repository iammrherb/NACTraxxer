"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/components/session-provider"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Shield,
  Calendar,
  TrendingUp,
  Network,
  Download,
  Users,
  Activity,
  BarChart3,
  Zap,
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Target,
  Database,
  AlertTriangle,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import DemoDataModal from "@/components/demo-data-modal"
import VisualPolicySimulation from "@/components/visual-policy-simulation"
import RolloutProgress from "@/components/RolloutProgress"
import SiteWorkbook from "@/components/SiteWorkbook"
import PolicyManagement from "@/components/policy-management"
import MasterSiteList from "@/components/MasterSiteList"
import TimelineScheduler from "@/components/timeline-scheduler"
import ArchitectureDesigner from "@/components/ArchitectureDesigner"
import UserManagementModal from "@/components/UserManagementModal"
import ThemeCustomizer from "@/components/ThemeCustomizer"

interface DashboardStats {
  sites: number
  policies: number
  events: number
  completedSites: number
  users: number
  devices: number
  activeThreats: number
  complianceScore: number
}

export default function Home() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  // Main state
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Data state
  const [stats, setStats] = useState<DashboardStats>({
    sites: 0,
    policies: 0,
    events: 0,
    completedSites: 0,
    users: 0,
    devices: 0,
    activeThreats: 0,
    complianceScore: 0,
  })
  const [sites, setSites] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user])

  // Listen for demo data loaded event
  useEffect(() => {
    const handleDemoDataLoaded = () => {
      loadAllData()
      toast({
        title: "Demo Data Loaded",
        description: "Your demo environment is ready with realistic data.",
      })
    }

    window.addEventListener("demoDataLoaded", handleDemoDataLoaded)
    return () => window.removeEventListener("demoDataLoaded", handleDemoDataLoaded)
  }, [])

  const loadAllData = async () => {
    try {
      const [sitesData, policiesData, eventsData, usersData] = await Promise.all([
        storage.getSites(),
        storage.getGlobalPolicies(),
        storage.getEvents(),
        storage.getUsers(),
      ])

      setSites(sitesData)
      setPolicies(policiesData)
      setEvents(eventsData)
      setUsers(usersData)

      // Calculate stats
      const completedSites =
        sitesData.filter((s: any) => s.status === "completed" || s.status === "Complete").length || 0
      const totalUsers = sitesData.reduce((sum: number, site: any) => {
        const users = typeof site.users === "number" && !isNaN(site.users) ? site.users : 0
        return sum + users
      }, 0)
      const totalDevices = sitesData.reduce((sum: number, site: any) => {
        if (site.devices && typeof site.devices === "object") {
          return (
            sum +
            Object.values(site.devices).reduce((deviceSum: number, count: any) => {
              const deviceCount = typeof count === "number" && !isNaN(count) ? count : 0
              return deviceSum + deviceCount
            }, 0)
          )
        }
        const devices = typeof site.devices === "number" && !isNaN(site.devices) ? site.devices : 0
        return sum + devices
      }, 0)
      const activePolicies = policiesData.filter((p: any) => p.status === "active").length || 0
      const avgEffectiveness =
        policiesData.length > 0
          ? policiesData.reduce((sum: number, p: any) => {
              const effectiveness = typeof p.effectiveness === "number" && !isNaN(p.effectiveness) ? p.effectiveness : 0
              return sum + effectiveness
            }, 0) / policiesData.length
          : 0

      setStats({
        sites: sitesData.length,
        policies: activePolicies,
        events: eventsData.length,
        completedSites,
        users: totalUsers,
        devices: totalDevices,
        activeThreats: Math.floor(Math.random() * 10),
        complianceScore: Math.round(avgEffectiveness),
      })

      // Generate recent activity
      setRecentActivity([
        {
          id: 1,
          type: "site",
          action: "Site configuration updated",
          item: sitesData[0]?.name || "Site 1",
          time: "2 minutes ago",
          status: "success",
        },
        {
          id: 2,
          type: "policy",
          action: "New policy created",
          item: "Guest Access Policy",
          time: "1 hour ago",
          status: "info",
        },
        {
          id: 3,
          type: "event",
          action: "Deployment scheduled",
          item: sitesData[1]?.name || "Site 2",
          time: "3 hours ago",
          status: "warning",
        },
        {
          id: 4,
          type: "threat",
          action: "Security alert resolved",
          item: "Suspicious device blocked",
          time: "5 hours ago",
          status: "success",
        },
      ])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleItemSelect = (item: any, type: string) => {
    setSelectedItem({ ...item, type })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "complete":
      case "active":
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
      case "in_progress":
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
      case "error":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "on-hold":
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "site":
        return <Building2 className="h-4 w-4" />
      case "policy":
        return <Shield className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "threat":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Portnox NAC Designer...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Access Required</CardTitle>
            <CardDescription>Please sign in to access the Portnox NAC Designer</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/login")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${isFullscreen ? "p-0" : "p-4"}`}
    >
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Network className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portnox NAC Designer
                </h1>
                <p className="text-gray-600 font-medium">Unified Zero Trust Network Access Control Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemoModal(true)}
                className="bg-white/50 hover:bg-white/80 border-blue-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Load Demo Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUserModal(true)}
                className="bg-white/50 hover:bg-white/80 border-blue-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeCustomizer(true)}
                className="bg-white/50 hover:bg-white/80 border-blue-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-white/50 hover:bg-white/80 border-blue-200"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAllData}
                className="bg-white/50 hover:bg-white/80 border-blue-200"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-none border-b">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sites"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4" />
              Sites
            </TabsTrigger>
            <TabsTrigger
              value="architecture"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Network className="h-4 w-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Play className="h-4 w-4" />
              Simulation
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="workbook"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Database className="h-4 w-4" />
              Workbook
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            {/* Enhanced Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-blue-500/20 transition-colors"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{isNaN(stats.sites) ? 0 : stats.sites}</div>
                      <div className="text-sm text-gray-500">Total Sites</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-blue-600">
                      {isNaN(stats.completedSites) ? 0 : stats.completedSites}
                    </span>
                  </div>
                  <Progress
                    value={
                      isNaN((stats.completedSites / (stats.sites || 1)) * 100)
                        ? 0
                        : (stats.completedSites / (stats.sites || 1)) * 100
                    }
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-green-500/20 transition-colors"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {isNaN(stats.policies) ? 0 : stats.policies}
                      </div>
                      <div className="text-sm text-gray-500">Active Policies</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Effectiveness</span>
                    <span className="font-medium text-green-600">
                      {isNaN(stats.complianceScore) ? 0 : stats.complianceScore}%
                    </span>
                  </div>
                  <Progress value={isNaN(stats.complianceScore) ? 0 : stats.complianceScore} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-purple-500/20 transition-colors"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {isNaN(stats.users) ? 0 : (stats.users / 1000).toFixed(1)}K
                      </div>
                      <div className="text-sm text-gray-500">Total Users</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Devices</span>
                    <span className="font-medium text-purple-600">{(stats.devices / 1000).toFixed(1)}K</span>
                  </div>
                  <Progress value={75} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-orange-500/20 transition-colors"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {isNaN(stats.complianceScore) ? 0 : stats.complianceScore}%
                      </div>
                      <div className="text-sm text-gray-500">Security Score</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Threats</span>
                    <span className="font-medium text-orange-600">{stats.activeThreats}</span>
                  </div>
                  <Progress value={isNaN(stats.complianceScore) ? 0 : stats.complianceScore} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
                      onClick={() => setActiveTab("architecture")}
                    >
                      <Network className="h-8 w-8 text-blue-600" />
                      <div className="text-center">
                        <div className="font-medium">Design Architecture</div>
                        <div className="text-xs text-gray-600">Create network diagrams</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                      onClick={() => setActiveTab("simulation")}
                    >
                      <Play className="h-8 w-8 text-green-600" />
                      <div className="text-center">
                        <div className="font-medium">Run Simulation</div>
                        <div className="text-xs text-gray-600">Test policy behavior</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                      onClick={() => setActiveTab("sites")}
                    >
                      <Building2 className="h-8 w-8 text-purple-600" />
                      <div className="text-center">
                        <div className="font-medium">Manage Sites</div>
                        <div className="text-xs text-gray-600">Site configuration</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-8 w-8 text-orange-600" />
                      <div className="text-center">
                        <div className="font-medium">View Analytics</div>
                        <div className="text-xs text-gray-600">Monitor performance</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className={`p-1.5 rounded-full ${getStatusColor(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                          <p className="text-xs text-gray-600 truncate">{activity.item}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overview Charts and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Deployment Progress</CardTitle>
                  <CardDescription>Progress across all sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sites.slice(0, 5).map((site, index) => (
                      <div key={site.id || index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{site.name}</span>
                          <span>{isNaN(site.completionPercent) ? 0 : site.completionPercent || 0}%</span>
                        </div>
                        <Progress
                          value={isNaN(site.completionPercent) ? 0 : site.completionPercent || 0}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Policy Effectiveness</CardTitle>
                  <CardDescription>Top performing policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policies.slice(0, 5).map((policy, index) => (
                      <div key={policy.id || index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{policy.name}</span>
                          <span>{isNaN(policy.effectiveness) ? 0 : policy.effectiveness || 0}%</span>
                        </div>
                        <Progress value={isNaN(policy.effectiveness) ? 0 : policy.effectiveness || 0} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites" className="p-0">
            <MasterSiteList onSiteSelect={handleItemSelect} />
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="p-0 h-[calc(100vh-200px)]">
            <ArchitectureDesigner />
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="p-0">
            <PolicyManagement />
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="p-0 h-[calc(100vh-200px)]">
            <VisualPolicySimulation />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="p-0">
            <TimelineScheduler />
          </TabsContent>

          {/* Workbook Tab */}
          <TabsContent value="workbook" className="p-0">
            <SiteWorkbook />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="p-0">
            <RolloutProgress />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <DemoDataModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      <UserManagementModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} />
      <ThemeCustomizer isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />

      <Toaster />
    </div>
  )
}
