"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/components/session-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Shield,
  Calendar,
  TrendingUp,
  Network,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Users,
  Activity,
  BarChart3,
  Zap,
  MapPin,
  AlertTriangle,
  Target,
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  ChevronRight,
  ExternalLink,
  Edit,
  Share,
  X,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import DemoDataModal from "@/components/demo-data-modal"
import InteractiveDiagram from "@/components/InteractiveDiagram"
import VisualPolicySimulation from "@/components/visual-policy-simulation"
import RolloutProgress from "@/components/RolloutProgress"
import SiteWorkbook from "@/components/SiteWorkbook"
import PolicyManagement from "@/components/policy-management" // Import PolicyManagement component
import MasterSiteList from "@/components/MasterSiteList" // Import MasterSiteList component

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

interface Site {
  id: string
  name: string
  location: string
  status: string
  progress: number
  users: number
  devices: number
  industry: string
  region: string
  priority: string
  budget: number
  riskLevel: string
}

interface Policy {
  id: string
  name: string
  category: string
  status: string
  effectiveness: number
  violations: number
}

interface Event {
  id: string
  title: string
  date: string
  type: string
  status: string
  priority: string
}

export default function Home() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  // Main state
  const [activeView, setActiveView] = useState("overview")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

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
  const [sites, setSites] = useState<Site[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // UI state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    sites: true,
    architecture: true,
    policies: true,
    simulation: true,
    timeline: true,
    analytics: true,
  })

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

      // Transform and set sites data
      const transformedSites = sitesData.map((site) => ({
        id: site.id,
        name: site.name,
        location: site.location,
        status: site.status || "planned",
        progress: Math.floor(Math.random() * 100),
        users: site.users || 0,
        devices: site.devices || 0,
        industry: site.industry || "technology",
        region: site.region || "north-america",
        priority: site.priority || "Medium",
        budget: site.budget || 0,
        riskLevel: site.riskLevel || "medium",
      }))
      setSites(transformedSites)

      // Transform and set policies data
      const transformedPolicies = policiesData.map((policy) => ({
        id: policy.id,
        name: policy.name,
        category: policy.category,
        status: policy.status,
        effectiveness: policy.effectiveness || 0,
        violations: policy.violations || 0,
      }))
      setPolicies(transformedPolicies)

      // Transform and set events data
      const transformedEvents = eventsData.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.startDate,
        type: event.type,
        status: event.status,
        priority: event.priority,
      }))
      setEvents(transformedEvents)

      // Calculate stats
      const completedSites = transformedSites.filter((s) => s.status === "completed").length
      const totalUsers = transformedSites.reduce((sum, site) => sum + site.users, 0)
      const totalDevices = transformedSites.reduce((sum, site) => sum + site.devices, 0)
      const activePolicies = transformedPolicies.filter((p) => p.status === "active").length
      const avgEffectiveness =
        transformedPolicies.reduce((sum, p) => sum + p.effectiveness, 0) / transformedPolicies.length || 0

      setStats({
        sites: transformedSites.length,
        policies: activePolicies,
        events: transformedEvents.length,
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
          item: "Headquarters",
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
          item: "Branch Office A",
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleItemSelect = (item: any, type: string) => {
    setSelectedItem({ ...item, type })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
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

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        {/* Left Sidebar - Navigation & Quick Stats */}
        <div className="col-span-3 space-y-4">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 gap-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Sites</p>
                    <p className="text-3xl font-bold">{stats.sites}</p>
                    <p className="text-blue-100 text-xs">{stats.completedSites} completed</p>
                  </div>
                  <Building2 className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Policies</p>
                    <p className="text-3xl font-bold">{stats.policies}</p>
                    <p className="text-green-100 text-xs">{stats.complianceScore}% effective</p>
                  </div>
                  <Shield className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold">{(stats.users / 1000).toFixed(1)}K</p>
                    <p className="text-purple-100 text-xs">{(stats.devices / 1000).toFixed(1)}K devices</p>
                  </div>
                  <Users className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Security Score</p>
                    <p className="text-3xl font-bold">{stats.complianceScore}%</p>
                    <p className="text-orange-100 text-xs">{stats.activeThreats} active threats</p>
                  </div>
                  <Target className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Menu */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3, count: null },
                { id: "sites", label: "Sites", icon: Building2, count: stats.sites },
                { id: "architecture", label: "Architecture", icon: Network, count: null },
                { id: "policies", label: "Policies", icon: Shield, count: stats.policies },
                { id: "simulation", label: "Simulation", icon: Play, count: null },
                { id: "timeline", label: "Timeline", icon: Calendar, count: stats.events },
                { id: "analytics", label: "Analytics", icon: TrendingUp, count: null },
              ].map((item) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      activeView === item.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "hover:bg-blue-50 hover:text-blue-700"
                    }`}
                    onClick={() => setActiveView(item.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <div className="bg-white/20 text-current border-0 rounded-full px-2 py-1">{item.count}</div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
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
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-span-6 space-y-4">
          {/* Search and Filter Bar */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sites, policies, events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
                <div className="w-48 bg-white/50">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="block w-full pl-10 pr-2 py-2 text-sm text-gray-900 bg-white/50 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="all">All Categories</option>
                      <option value="sites">Sites</option>
                      <option value="policies">Policies</option>
                      <option value="events">Events</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Content Based on Active View */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg flex-1">
            <CardContent className="p-0 h-full">
              {activeView === "overview" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-50 text-green-700 border-green-200 rounded-full px-2 py-1">
                        System Healthy
                      </div>
                      <div className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-2 py-1">
                        {stats.sites} Sites Active
                      </div>
                    </div>
                  </div>

                  {/* Overview Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Sites Overview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          Sites Overview
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveView("sites")}>
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {sites.slice(0, 3).map((site) => (
                          <div
                            key={site.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-blue-50"
                            onClick={() => handleItemSelect(site, "site")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{site.name}</h4>
                              <div
                                className={`bg-white/20 text-current border-0 rounded-full px-2 py-1 ${getStatusColor(site.status)}`}
                              >
                                {site.status}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {site.location}
                              </span>
                              <span>{site.users} users</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{site.progress}%</span>
                              </div>
                              <div className="bg-gray-200 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-2" style={{ width: `${site.progress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Policies Overview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Policies Overview
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveView("policies")}>
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {policies.slice(0, 3).map((policy) => (
                          <div
                            key={policy.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-green-50"
                            onClick={() => handleItemSelect(policy, "policy")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{policy.name}</h4>
                              <div
                                className={`bg-white/20 text-current border-0 rounded-full px-2 py-1 ${getStatusColor(policy.status)}`}
                              >
                                {policy.status}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span className="capitalize">{policy.category.replace("_", " ")}</span>
                              <span>{policy.violations} violations</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Effectiveness</span>
                                <span>{policy.effectiveness}%</span>
                              </div>
                              <div className="bg-gray-200 rounded-full overflow-hidden">
                                <div className="bg-green-600 h-2" style={{ width: `${policy.effectiveness}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
                      onClick={() => setActiveView("architecture")}
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
                      onClick={() => setActiveView("simulation")}
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
                      onClick={() => setActiveView("analytics")}
                    >
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <div className="text-center">
                        <div className="font-medium">View Analytics</div>
                        <div className="text-xs text-gray-600">Monitor performance</div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {activeView === "sites" && <MasterSiteList />}

              {activeView === "architecture" && (
                <div className="h-full">
                  <InteractiveDiagram
                    config={{
                      industry: "healthcare",
                      deployment: "hybrid",
                      connectivity: ["wired", "wireless"],
                      wiredVendor: "cisco",
                      wirelessVendor: "aruba",
                      firewallVendor: "palo_alto",
                      identityProvider: ["azure_ad"],
                      mdmProvider: ["intune"],
                      radiusType: "cloud",
                      deviceAdmin: "radius",
                      authTypes: ["802.1x", "mac_auth"],
                      deviceTypes: ["windows", "mac", "ios", "android"],
                      complianceFrameworks: ["hipaa"],
                      securityFeatures: ["encryption", "mfa"],
                      networkSegmentation: true,
                      guestAccess: true,
                      iotSupport: true,
                      cloudIntegration: true,
                      onPremiseIntegration: false,
                      hybridDeployment: true,
                      animations: true,
                      showMetrics: true,
                      showConnections: true,
                      animationSpeed: 50,
                      zoomLevel: 100,
                      selectedView: "complete",
                      customColors: {
                        primary: "#3b82f6",
                        secondary: "#10b981",
                        accent: "#f59e0b",
                      },
                    }}
                  />
                </div>
              )}

              {activeView === "policies" && <PolicyManagement />}

              {activeView === "simulation" && (
                <div className="h-full">
                  <VisualPolicySimulation />
                </div>
              )}

              {activeView === "timeline" && <RolloutProgress />}

              {activeView === "analytics" && <SiteWorkbook />}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Details Panel */}
        <div className="col-span-3 space-y-4">
          {selectedItem ? (
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {selectedItem.type === "site" && <Building2 className="h-5 w-5 text-blue-600" />}
                    {selectedItem.type === "policy" && <Shield className="h-5 w-5 text-green-600" />}
                    {selectedItem.type === "event" && <Calendar className="h-5 w-5 text-purple-600" />}
                    Details
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedItem.name || selectedItem.title}</h3>
                      {selectedItem.type === "site" && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {selectedItem.location}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-center">
                              <div className="font-semibold text-blue-600">{selectedItem.users}</div>
                              <div className="text-xs text-gray-600">Users</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-center">
                              <div className="font-semibold text-green-600">{selectedItem.devices}</div>
                              <div className="text-xs text-gray-600">Devices</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{selectedItem.progress}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-2" style={{ width: `${selectedItem.progress}%` }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              <div
                                className={`bg-white/20 text-current border-0 rounded-full px-2 py-1 ${getStatusColor(selectedItem.status)}`}
                              >
                                {selectedItem.status}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Priority:</span>
                              <div
                                className={`bg-white/20 text-current border-0 rounded-full px-2 py-1 ${getPriorityColor(selectedItem.priority)}`}
                              >
                                {selectedItem.priority}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Budget:</span>
                              <span className="font-medium">${(selectedItem.budget / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedItem.type === "policy" && (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Category</div>
                            <div className="font-medium capitalize">{selectedItem.category.replace("_", " ")}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{selectedItem.effectiveness}%</div>
                              <div className="text-xs text-gray-600">Effectiveness</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{selectedItem.violations}</div>
                              <div className="text-xs text-gray-600">Violations</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Performance</span>
                              <span className="font-medium">{selectedItem.effectiveness}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="bg-green-600 h-2"
                                style={{ width: `${selectedItem.effectiveness}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Eye className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Item</h3>
                <p className="text-gray-600">Click on any site, policy, or event to view detailed information here.</p>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cloud Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">RADIUS Servers</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">99.9% Uptime</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Policy Engine</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Threat Detection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">{stats.activeThreats} Alerts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Site
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Add Policy Rule
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Data Modal */}
      <DemoDataModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />

      <Toaster />
    </div>
  )
}
