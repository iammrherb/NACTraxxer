"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Building,
  Activity,
  BarChart3,
  Users,
  AlertTriangle,
  Calendar,
  MapPin,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

interface Site {
  id: string
  name: string
  location: string
  status: "not-started" | "planning" | "in-progress" | "testing" | "completed" | "on-hold"
  progress: number
  startDate: string
  targetDate: string
  actualDate?: string
  phase: string
  assignedTo: string[]
  devices: number
  users: number
  lastUpdate: string
  issues: number
  budget: number
  priority: "High" | "Medium" | "Low"
  region: string
  industry: string
  milestones: {
    name: string
    status: "completed" | "in-progress" | "pending"
    date: string
    progress: number
  }[]
}

interface ProgressStats {
  totalSites: number
  completedSites: number
  inProgressSites: number
  notStartedSites: number
  onHoldSites: number
  overallProgress: number
  onTimeDelivery: number
  totalUsers: number
  totalDevices: number
  activeIssues: number
  totalBudget: number
  budgetUtilized: number
  averageProgress: number
  criticalSites: number
}

export default function RolloutProgress() {
  const [mounted, setMounted] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [stats, setStats] = useState<ProgressStats>({
    totalSites: 0,
    completedSites: 0,
    inProgressSites: 0,
    notStartedSites: 0,
    onHoldSites: 0,
    overallProgress: 0,
    onTimeDelivery: 0,
    totalUsers: 0,
    totalDevices: 0,
    activeIssues: 0,
    totalBudget: 0,
    budgetUtilized: 0,
    averageProgress: 0,
    criticalSites: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")

  useEffect(() => {
    setMounted(true)
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    if (typeof window === "undefined") return

    try {
      setLoading(true)
      const sitesData = await storage.getSites()

      // Transform sites data to include progress information
      const progressSites: Site[] = sitesData.map((site) => ({
        id: site.id,
        name: site.name,
        location: `${site.city || "Unknown"}, ${site.state || "Unknown"}`,
        status: getRandomStatus(),
        progress: Math.floor(Math.random() * 100),
        startDate: getValidDateString(new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)),
        targetDate: getValidDateString(new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)),
        actualDate: Math.random() > 0.7 ? getValidDateString(new Date()) : undefined,
        phase: getRandomPhase(),
        assignedTo: [`${site.projectManager}`, `${site.technicalOwner}`],
        devices: site.deviceCounts?.total || Math.floor(Math.random() * 500) + 100,
        users: site.userCounts?.total || Math.floor(Math.random() * 1000) + 200,
        lastUpdate: getValidDateString(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)),
        issues: Math.floor(Math.random() * 5),
        budget: site.budget || Math.floor(Math.random() * 500000) + 100000,
        priority: site.priority || (["High", "Medium", "Low"] as const)[Math.floor(Math.random() * 3)],
        region: site.region || "Unknown",
        industry: site.industry || "Unknown",
        milestones: generateMilestones(),
      }))

      setSites(progressSites)
      calculateStats(progressSites)
    } catch (error) {
      console.error("Error loading progress data:", error)
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getValidDateString = (date: Date): string => {
    try {
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split("T")[0]
      }
      return date.toISOString().split("T")[0]
    } catch (error) {
      return new Date().toISOString().split("T")[0]
    }
  }

  const getRandomStatus = (): Site["status"] => {
    const statuses: Site["status"][] = ["not-started", "planning", "in-progress", "testing", "completed", "on-hold"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  const getRandomPhase = (): string => {
    const phases = ["Discovery", "Design", "Implementation", "Testing", "Deployment", "Go-Live"]
    return phases[Math.floor(Math.random() * phases.length)]
  }

  const generateMilestones = () => {
    const milestoneNames = ["Site Survey", "Equipment Delivery", "Installation", "Configuration", "Testing", "Go-Live"]
    return milestoneNames.map((name) => ({
      name,
      status: Math.random() > 0.5 ? "completed" : Math.random() > 0.5 ? "in-progress" : ("pending" as const),
      date: getValidDateString(new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)),
      progress: Math.floor(Math.random() * 100),
    }))
  }

  const calculateStats = (sitesData: Site[]) => {
    const totalSites = sitesData.length
    const completedSites = sitesData.filter((s) => s.status === "completed").length
    const inProgressSites = sitesData.filter((s) => s.status === "in-progress").length
    const notStartedSites = sitesData.filter((s) => s.status === "not-started").length
    const onHoldSites = sitesData.filter((s) => s.status === "on-hold").length
    const overallProgress = totalSites > 0 ? Math.round((completedSites / totalSites) * 100) : 0
    const onTimeDelivery = Math.round(Math.random() * 30 + 70) // Mock data
    const totalUsers = sitesData.reduce((sum, site) => sum + site.users, 0)
    const totalDevices = sitesData.reduce((sum, site) => sum + site.devices, 0)
    const activeIssues = sitesData.reduce((sum, site) => sum + site.issues, 0)
    const totalBudget = sitesData.reduce((sum, site) => sum + site.budget, 0)
    const budgetUtilized = Math.round(Math.random() * 30 + 60) // Mock data
    const averageProgress =
      totalSites > 0 ? Math.round(sitesData.reduce((sum, site) => sum + site.progress, 0) / totalSites) : 0
    const criticalSites = sitesData.filter((s) => s.priority === "High" && s.status !== "completed").length

    setStats({
      totalSites,
      completedSites,
      inProgressSites,
      notStartedSites,
      onHoldSites,
      overallProgress,
      onTimeDelivery,
      totalUsers,
      totalDevices,
      activeIssues,
      totalBudget,
      budgetUtilized,
      averageProgress,
      criticalSites,
    })
  }

  const getStatusColor = (status: Site["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "testing":
        return "bg-yellow-500"
      case "planning":
        return "bg-purple-500"
      case "on-hold":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Site["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Activity className="h-4 w-4" />
      case "testing":
        return <Clock className="h-4 w-4" />
      case "on-hold":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: Site["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportProgress = () => {
    const csvContent = [
      [
        "Site Name",
        "Location",
        "Status",
        "Progress",
        "Start Date",
        "Target Date",
        "Phase",
        "Users",
        "Devices",
        "Issues",
        "Budget",
        "Priority",
        "Region",
        "Industry",
      ].join(","),
      ...sites.map((site) =>
        [
          `"${site.name}"`,
          `"${site.location}"`,
          site.status,
          `${site.progress}%`,
          site.startDate,
          site.targetDate,
          site.phase,
          site.users,
          site.devices,
          site.issues,
          site.budget,
          site.priority,
          site.region,
          site.industry,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rollout-progress-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Progress report has been exported successfully.",
    })
  }

  const calculateOverallProgress = () => {
    if (sites.length === 0) return 0
    const totalProgress = sites.reduce((sum, site) => sum + (site.progress || 0), 0)
    return Math.round(totalProgress / sites.length)
  }

  const getPhaseStats = () => {
    const phases = {
      planning: 0,
      design: 0,
      implementation: 0,
      testing: 0,
      completed: 0,
    }

    sites.forEach((site) => {
      const phase = site.phase?.toLowerCase() || "planning"
      if (phases.hasOwnProperty(phase)) {
        phases[phase as keyof typeof phases]++
      }
    })

    return phases
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const phaseStats = getPhaseStats()
  const overallProgress = calculateOverallProgress()

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart3 className="h-8 w-8" />
                </div>
                Rollout Progress Dashboard
              </h1>
              <p className="text-blue-100 text-lg">Real-time deployment tracking and analytics</p>
            </div>
            <Button
              onClick={exportProgress}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-blue-500/20 transition-colors"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalSites}</div>
                <div className="text-sm text-gray-500">Total Sites</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-medium text-blue-600">{stats.inProgressSites + stats.notStartedSites}</span>
            </div>
            <Progress value={(stats.completedSites / stats.totalSites) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-green-500/20 transition-colors"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.completedSites}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium text-green-600">{stats.onTimeDelivery}%</span>
            </div>
            <Progress value={stats.onTimeDelivery} className="mt-2 h-2" />
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
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Devices</span>
              <span className="font-medium text-purple-600">{stats.totalDevices.toLocaleString()}</span>
            </div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-orange-500/20 transition-colors"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.activeIssues}</div>
                <div className="text-sm text-gray-500">Active Issues</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Critical Sites</span>
              <span className="font-medium text-orange-600">{stats.criticalSites}</span>
            </div>
            <Progress value={(stats.activeIssues / stats.totalSites) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            </div>
            <Progress value={overallProgress} className="mb-4 h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed: {stats.completedSites}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Progress: {stats.inProgressSites}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Not Started: {stats.notStartedSites}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>On Hold: {stats.onHoldSites}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Budget Overview</h3>
              <div className="text-2xl font-bold text-green-600">${(stats.totalBudget / 1000000).toFixed(1)}M</div>
            </div>
            <Progress value={stats.budgetUtilized} className="mb-4 h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Budget Utilized</div>
                <div className="font-semibold">{stats.budgetUtilized}%</div>
              </div>
              <div>
                <div className="text-gray-600">Remaining</div>
                <div className="font-semibold">
                  ${((stats.totalBudget * (100 - stats.budgetUtilized)) / 100 / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Details Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Site Progress Details</h3>
            <div className="flex gap-2">
              <Button
                variant={activeView === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("timeline")}
              >
                Timeline
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Site</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Progress</th>
                  <th className="text-left p-3 font-medium">Phase</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Target Date</th>
                  <th className="text-left p-3 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody>
                {sites.slice(0, 10).map((site) => (
                  <tr key={site.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {site.location}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(site.status)}`}
                      >
                        {getStatusIcon(site.status)}
                        {site.status.replace("-", " ").toUpperCase()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={site.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{site.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {site.phase}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(site.priority)}`}
                      >
                        {site.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {site.targetDate}
                      </div>
                    </td>
                    <td className="p-3">
                      {site.issues > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          {site.issues}
                        </span>
                      ) : (
                        <span className="text-green-600 text-sm">No Issues</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sites.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Sites ({sites.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
