"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Users,
  Monitor,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Edit,
  Eye,
  Download,
  BookOpen,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Network,
  Settings,
} from "lucide-react"
import { storage, type Site, type User } from "@/lib/storage"
import BulkSiteCreator from "./bulk-site-creator"
import SiteWorkbook from "./SiteWorkbook"
import { toast } from "@/components/ui/use-toast"

interface MasterSiteListProps {
  onSiteSelect?: (site: Site) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [showBulkCreator, setShowBulkCreator] = useState(false)
  const [showWorkbook, setShowWorkbook] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    planned: 0,
    delayed: 0,
    totalBudget: 0,
    totalUsers: 0,
    totalDevices: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterSites()
    calculateStats()
  }, [sites, searchTerm, statusFilter, priorityFilter, regionFilter])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [sitesData, usersData] = await Promise.all([storage.getSites(), storage.getUsers()])
      setSites(sitesData)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load site data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterSites = () => {
    let filtered = sites

    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.industry.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((site) => site.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((site) => site.priority === priorityFilter)
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((site) => site.region === regionFilter)
    }

    setFilteredSites(filtered)
  }

  const calculateStats = () => {
    const total = sites.length
    const completed = sites.filter((s) => s.status === "Complete").length
    const inProgress = sites.filter((s) => s.status === "In Progress").length
    const planned = sites.filter((s) => s.status === "Planned").length
    const delayed = sites.filter((s) => s.status === "Delayed").length
    const totalBudget = sites.reduce((sum, site) => sum + (site.budget || 0), 0)
    const totalUsers = sites.reduce((sum, site) => sum + (site.users || 0), 0)
    const totalDevices = sites.reduce((sum, site) => {
      if (site.devices && typeof site.devices === "object") {
        return (
          sum +
          Object.values(site.devices).reduce(
            (deviceSum: number, count: any) => deviceSum + (typeof count === "number" ? count : 0),
            0,
          )
        )
      }
      return sum
    }, 0)

    setStats({
      total,
      completed,
      inProgress,
      planned,
      delayed,
      totalBudget,
      totalUsers,
      totalDevices,
    })
  }

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site)
    setShowSiteModal(true)
    if (onSiteSelect) {
      onSiteSelect(site)
    }
  }

  const handleViewWorkbook = (site: Site, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedSite(site)
    setShowWorkbook(true)
  }

  const getStatusIcon = (status: Site["status"]) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "Delayed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "On Hold":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Site["status"]) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Delayed":
        return "bg-red-100 text-red-800 border-red-200"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case "healthcare":
        return "🏥"
      case "financial":
        return "🏦"
      case "manufacturing":
        return "🏭"
      case "technology":
        return "💻"
      case "retail":
        return "🛍️"
      case "education":
        return "🎓"
      case "government":
        return "🏛️"
      default:
        return "🏢"
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User"
  }

  const exportSites = () => {
    const csvContent = [
      [
        "Name",
        "Location",
        "Status",
        "Priority",
        "Users",
        "Devices",
        "Budget",
        "Completion %",
        "Industry",
        "Region",
      ].join(","),
      ...filteredSites.map((site) => {
        const deviceCount =
          site.devices && typeof site.devices === "object"
            ? Object.values(site.devices).reduce(
                (sum: number, count: any) => sum + (typeof count === "number" ? count : 0),
                0,
              )
            : 0

        return [
          `"${site.name}"`,
          `"${site.location}"`,
          site.status,
          site.priority,
          site.users || 0,
          deviceCount,
          site.budget || 0,
          site.completionPercent || 0,
          site.industry,
          site.region,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sites-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Site data has been exported successfully.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Site Management Dashboard</h1>
            <p className="text-blue-100">Manage and monitor all deployment sites across your organization</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={exportSites}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowBulkCreator(true)} className="bg-white text-blue-600 hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Create
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Sites</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Across all regions</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-purple-600">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500 mt-1">Investment value</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-orange-600">{(stats.totalUsers / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-1">{stats.totalDevices.toLocaleString()} devices</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sites by name, location, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="emea">EMEA</SelectItem>
                  <SelectItem value="apac">Asia Pacific</SelectItem>
                  <SelectItem value="latam">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => {
          const deviceCount =
            site.devices && typeof site.devices === "object"
              ? Object.values(site.devices).reduce(
                  (sum: number, count: any) => sum + (typeof count === "number" ? count : 0),
                  0,
                )
              : 0

          return (
            <Card
              key={site.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              onClick={() => handleSiteClick(site)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>

              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getIndustryIcon(site.industry)}</span>
                      <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                        {site.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {site.location}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={getPriorityColor(site.priority)} variant="outline">
                      {site.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Phase {site.phase}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(site.status)}
                    <Badge className={getStatusColor(site.status)} variant="outline">
                      {site.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{site.region?.replace("-", " ")}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold">{site.completionPercent || 0}%</span>
                  </div>
                  <Progress value={site.completionPercent || 0} className="h-2 bg-gray-100" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{(site.users || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">users</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Monitor className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">{deviceCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">devices</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">${((site.budget || 0) / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">budget</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-medium text-xs">
                        {site.targetDate ? new Date(site.targetDate).toLocaleDateString() : "TBD"}
                      </div>
                      <div className="text-xs text-gray-500">target</div>
                    </div>
                  </div>
                </div>

                {/* Infrastructure indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {site.infrastructure?.wired && (
                      <div className="flex items-center gap-1">
                        <Network className="h-3 w-3" />
                        <span className="capitalize">{site.infrastructure.wired.vendor}</span>
                      </div>
                    )}
                    {site.infrastructure?.wireless && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span className="capitalize">{site.infrastructure.wireless.vendor}</span>
                      </div>
                    )}
                    {site.infrastructure?.firewall && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span className="capitalize">{site.infrastructure.firewall.vendor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    onClick={() => handleSiteClick(site)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    onClick={(e) => handleViewWorkbook(site, e)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Workbook
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enhanced Empty State */}
      {filteredSites.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || regionFilter !== "all"
                ? "No sites match your criteria"
                : "No sites found"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || regionFilter !== "all"
                ? "Try adjusting your filters or search terms to find the sites you're looking for."
                : "Get started by creating your first site or importing existing site data."}
            </p>
            {!searchTerm && statusFilter === "all" && priorityFilter === "all" && regionFilter === "all" && (
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowBulkCreator(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sites
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Site Details Modal */}
      {selectedSite && (
        <Dialog open={showSiteModal} onOpenChange={setShowSiteModal}>
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getIndustryIcon(selectedSite.industry)}</span>
                    <span>{selectedSite.name}</span>
                  </div>
                  <DialogDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {selectedSite.location}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Infrastructure
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Site Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Status:</span>
                            <Badge className={getStatusColor(selectedSite.status)}>{selectedSite.status}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Priority:</span>
                            <Badge className={getPriorityColor(selectedSite.priority)}>{selectedSite.priority}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Phase:</span>
                            <span className="text-sm">Phase {selectedSite.phase}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Region:</span>
                            <span className="text-sm capitalize">{selectedSite.region?.replace("-", " ")}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Industry:</span>
                            <span className="text-sm capitalize">{selectedSite.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Time Zone:</span>
                            <span className="text-sm">{selectedSite.timeZone || "UTC"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Budget:</span>
                            <span className="text-sm font-medium">${(selectedSite.budget || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {selectedSite.completionPercent || 0}%
                        </div>
                        <Progress value={selectedSite.completionPercent || 0} className="h-3 mb-2" />
                        <p className="text-sm text-gray-600">Overall Completion</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span>
                            {selectedSite.startDate ? new Date(selectedSite.startDate).toLocaleDateString() : "TBD"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target Date:</span>
                          <span>
                            {selectedSite.targetDate ? new Date(selectedSite.targetDate).toLocaleDateString() : "TBD"}
                          </span>
                        </div>
                        {selectedSite.actualDate && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Actual Date:</span>
                            <span>{new Date(selectedSite.actualDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {(selectedSite.users || 0).toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600">Total Users</p>
                        </div>
                        {selectedSite.userCounts && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Employees:</span>
                              <span className="font-medium">
                                {selectedSite.userCounts.employees?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contractors:</span>
                              <span className="font-medium">
                                {selectedSite.userCounts.contractors?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guests:</span>
                              <span className="font-medium">
                                {selectedSite.userCounts.guests?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {selectedSite.devices && typeof selectedSite.devices === "object"
                              ? Object.values(selectedSite.devices)
                                  .reduce((sum: number, count: any) => sum + (typeof count === "number" ? count : 0), 0)
                                  .toLocaleString()
                              : "0"}
                          </div>
                          <p className="text-sm text-gray-600">Total Devices</p>
                        </div>
                        {selectedSite.devices && typeof selectedSite.devices === "object" && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(selectedSite.devices).map(([type, count]) => (
                              <div key={type} className="flex justify-between">
                                <span className="capitalize">{type}:</span>
                                <span className="font-medium">
                                  {typeof count === "number" ? count.toLocaleString() : 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedSite.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{selectedSite.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="infrastructure" className="space-y-6 mt-6">
                {selectedSite.infrastructure && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedSite.infrastructure.wired && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Network className="h-5 w-5" />
                            Wired Infrastructure
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Vendor:</span>
                            <span className="text-sm capitalize">{selectedSite.infrastructure.wired.vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Model:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wired.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Switches:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wired.switches}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Ports:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wired.ports}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedSite.infrastructure.wireless && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Wireless Infrastructure
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Vendor:</span>
                            <span className="text-sm capitalize">{selectedSite.infrastructure.wireless.vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Model:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wireless.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Access Points:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wireless.accessPoints}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Controllers:</span>
                            <span className="text-sm">{selectedSite.infrastructure.wireless.controllers}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedSite.infrastructure.firewall && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Firewall
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Vendor:</span>
                            <span className="text-sm capitalize">{selectedSite.infrastructure.firewall.vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Model:</span>
                            <span className="text-sm">{selectedSite.infrastructure.firewall.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Throughput:</span>
                            <span className="text-sm">{selectedSite.infrastructure.firewall.throughput}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedSite.infrastructure.radius && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            RADIUS
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Type:</span>
                            <span className="text-sm capitalize">{selectedSite.infrastructure.radius.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Vendor:</span>
                            <span className="text-sm capitalize">{selectedSite.infrastructure.radius.vendor}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {selectedSite.authentication && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Authentication Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedSite.authentication.identityProvider && (
                        <div>
                          <Label className="text-sm font-medium">Identity Providers</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.identityProvider.map((provider) => (
                              <Badge key={provider} variant="secondary">
                                {provider}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSite.authentication.mdm && (
                        <div>
                          <Label className="text-sm font-medium">MDM Solutions</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.mdm.map((mdm) => (
                              <Badge key={mdm} variant="secondary">
                                {mdm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSite.authentication.authMethods && (
                        <div>
                          <Label className="text-sm font-medium">Authentication Methods</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.authMethods.map((method) => (
                              <Badge key={method} variant="outline">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="team" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Project Manager</Label>
                        <p className="mt-1 text-sm">
                          {getUserName(selectedSite.projectManager) || selectedSite.projectManager}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Technical Owner</Label>
                        <p className="mt-1 text-sm">
                          {getUserName(selectedSite.technicalOwner) || selectedSite.technicalOwner}
                        </p>
                      </div>
                      {selectedSite.technicalOwners && selectedSite.technicalOwners.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Technical Owners</Label>
                          <div className="mt-2 space-y-1">
                            {selectedSite.technicalOwners.map((ownerId) => (
                              <p key={ownerId} className="text-sm">
                                {getUserName(ownerId)}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSite.assignedUsers && selectedSite.assignedUsers.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Assigned Users</Label>
                          <div className="mt-2 space-y-1">
                            {selectedSite.assignedUsers.map((userId) => (
                              <p key={userId} className="text-sm">
                                {getUserName(userId)}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Site Contact</Label>
                        <p className="mt-1 text-sm">{selectedSite.contactName || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="mt-1 text-sm">{selectedSite.contactEmail || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="mt-1 text-sm">{selectedSite.contactPhone || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="mt-1 text-sm">
                          {selectedSite.address || "Not specified"}
                          {selectedSite.city && selectedSite.state && (
                            <>
                              <br />
                              {selectedSite.city}, {selectedSite.state} {selectedSite.zipCode}
                            </>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedSite.compliance && selectedSite.compliance.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.compliance.map((comp) => (
                          <Badge key={comp} variant="secondary" className="uppercase">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedSite.securityRequirements && selectedSite.securityRequirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedSite.securityRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">Start Date:</span>
                          <span>
                            {selectedSite.startDate ? new Date(selectedSite.startDate).toLocaleDateString() : "TBD"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Actual Date:</span>
                          <span>
                            {selectedSite.actualDate ? new Date(selectedSite.actualDate).toLocaleDateString() : "TBD"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Overall Progress</span>
                          <span className="font-bold">{selectedSite.completionPercent || 0}%</span>
                        </div>
                        <Progress value={selectedSite.completionPercent || 0} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {selectedSite.risks && selectedSite.risks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedSite.risks.map((risk) => (
                            <div key={risk.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{risk.description}</h4>
                                <div className="flex gap-2">
                                  <Badge
                                    className={
                                      risk.severity === "Critical"
                                        ? "bg-red-100 text-red-800"
                                        : risk.severity === "High"
                                          ? "bg-orange-100 text-orange-800"
                                          : risk.severity === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                    }
                                  >
                                    {risk.severity}
                                  </Badge>
                                  <Badge
                                    className={
                                      risk.status === "Open"
                                        ? "bg-red-100 text-red-800"
                                        : risk.status === "Mitigated"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                    }
                                  >
                                    {risk.status}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{risk.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {selectedSite.networkSegments && selectedSite.networkSegments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedSite.networkSegments.map((segment) => (
                          <div key={segment.vlan} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{segment.name}</h4>
                              <Badge variant="outline">VLAN {segment.vlan}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{segment.subnet}</p>
                            <p className="text-xs text-gray-500">{segment.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedSite.compliance && selectedSite.compliance.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Compliance Frameworks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedSite.compliance.map((comp) => (
                            <Badge key={comp} variant="secondary" className="uppercase">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedSite.securityRequirements && selectedSite.securityRequirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Security Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedSite.securityRequirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {selectedSite.authentication && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Authentication & Access Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedSite.authentication.identityProvider && (
                        <div>
                          <Label className="text-sm font-medium">Identity Providers</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.identityProvider.map((provider) => (
                              <Badge key={provider} variant="secondary">
                                {provider}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSite.authentication.mdm && (
                        <div>
                          <Label className="text-sm font-medium">MDM Solutions</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.mdm.map((mdm) => (
                              <Badge key={mdm} variant="secondary">
                                {mdm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedSite.authentication.authMethods && (
                        <div>
                          <Label className="text-sm font-medium">Authentication Methods</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSite.authentication.authMethods.map((method) => (
                              <Badge key={method} variant="outline">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {selectedSite.networkSegments && selectedSite.networkSegments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Segmentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedSite.networkSegments.map((segment) => (
                          <div key={segment.vlan} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Network className="h-4 w-4" />
                                {segment.name}
                              </h4>
                              <Badge variant="outline">VLAN {segment.vlan}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1 font-mono">{segment.subnet}</p>
                            <p className="text-xs text-gray-500">{segment.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowSiteModal(false)}>
                Close
              </Button>
              <Button onClick={(e) => handleViewWorkbook(selectedSite, e)} className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="h-4 w-4 mr-2" />
                View Workbook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bulk Site Creator Modal */}
      {showBulkCreator && (
        <BulkSiteCreator
          isOpen={showBulkCreator}
          onClose={() => setShowBulkCreator(false)}
          onSitesCreated={() => {
            setShowBulkCreator(false)
            loadData()
          }}
        />
      )}

      {/* Site Workbook Modal */}
      {showWorkbook && selectedSite && (
        <Dialog open={showWorkbook} onOpenChange={setShowWorkbook}>
          <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-hidden p-0">
            <SiteWorkbook siteId={selectedSite.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
