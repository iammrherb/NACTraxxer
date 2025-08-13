"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddSiteModal from "@/components/add-site-modal"
import { toast } from "@/components/ui/use-toast"
import { storage, type Site } from "@/lib/storage"
import {
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Building,
  Globe,
  Zap,
} from "lucide-react"

interface SiteManagementProps {
  onSiteSelect?: (siteId: string) => void
}

const statusColors = {
  Planned: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Complete: "bg-green-100 text-green-800",
  Delayed: "bg-red-100 text-red-800",
}

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRegion, setFilterRegion] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [loading, setLoading] = useState(true)

  // Load sites from storage
  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      const loadedSites = await storage.getSites()
      setSites(loadedSites)
    } catch (error) {
      console.error("Error loading sites:", error)
      toast({
        title: "Error",
        description: "Failed to load sites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter sites
  useEffect(() => {
    let filtered = sites

    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.region.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterRegion !== "all") {
      filtered = filtered.filter((site) => site.region === filterRegion)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((site) => site.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((site) => site.priority === filterPriority)
    }

    setFilteredSites(filtered)
  }, [sites, searchTerm, filterRegion, filterStatus, filterPriority])

  const addSite = async (siteData: Omit<Site, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newSite = await storage.createSite(siteData)
      setSites((prev) => [...prev, newSite])
      toast({
        title: "Site added",
        description: "The site has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding site:", error)
      toast({
        title: "Error",
        description: "Failed to add site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateSite = async (siteId: string, updates: Partial<Site>) => {
    try {
      const updatedSite = await storage.updateSite(siteId, updates)
      if (updatedSite) {
        setSites((prev) => prev.map((site) => (site.id === siteId ? updatedSite : site)))
        toast({
          title: "Site updated",
          description: "The site has been updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating site:", error)
      toast({
        title: "Error",
        description: "Failed to update site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteSite = async (siteId: string) => {
    try {
      const success = await storage.deleteSite(siteId)
      if (success) {
        setSites((prev) => prev.filter((site) => site.id !== siteId))
        if (selectedSite?.id === siteId) {
          setSelectedSite(null)
        }
        toast({
          title: "Site deleted",
          description: "The site has been deleted successfully.",
        })
      }
    } catch (error) {
      console.error("Error deleting site:", error)
      toast({
        title: "Error",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateDemoSites = async () => {
    const demoSites = [
      {
        name: "New York Headquarters",
        region: "North America",
        country: "United States",
        priority: "High" as const,
        phase: "1",
        users: 850,
        projectManager: "John Smith",
        technicalOwners: ["Alice Johnson", "Bob Wilson"],
        status: "In Progress" as const,
        completionPercent: 65,
        wiredVendors: ["Cisco", "Aruba (HPE)"],
        wirelessVendors: ["Cisco"],
        deviceTypes: ["Windows Workstations", "macOS Devices", "iOS Devices", "Android Devices"],
        radsec: "Native",
        plannedStart: "2024-01-15",
        plannedEnd: "2024-03-30",
        notes: "Primary headquarters with critical infrastructure. High priority deployment.",
      },
      {
        name: "London Office",
        region: "EMEA",
        country: "United Kingdom",
        priority: "Medium" as const,
        phase: "2",
        users: 420,
        projectManager: "Sarah Davis",
        technicalOwners: ["David Brown", "Emma Taylor"],
        status: "Planned" as const,
        completionPercent: 0,
        wiredVendors: ["Juniper", "Extreme Networks"],
        wirelessVendors: ["Aruba (HPE)"],
        deviceTypes: ["Windows Workstations", "macOS Devices", "Linux Workstations"],
        radsec: "LRAD",
        plannedStart: "2024-04-01",
        plannedEnd: "2024-06-15",
        notes: "European regional office. Coordination with local IT team required.",
      },
      {
        name: "Tokyo Branch",
        region: "APAC",
        country: "Japan",
        priority: "Medium" as const,
        phase: "3",
        users: 280,
        projectManager: "Hiroshi Tanaka",
        technicalOwners: ["Yuki Sato", "Kenji Nakamura"],
        status: "Complete" as const,
        completionPercent: 100,
        wiredVendors: ["Cisco"],
        wirelessVendors: ["Cisco Meraki"],
        deviceTypes: ["Windows Workstations", "iOS Devices", "Android Devices"],
        radsec: "Native",
        plannedStart: "2023-10-01",
        plannedEnd: "2023-12-15",
        notes: "Successfully completed deployment. Excellent user adoption rates.",
      },
      {
        name: "São Paulo Office",
        region: "South America",
        country: "Brazil",
        priority: "Low" as const,
        phase: "4",
        users: 150,
        projectManager: "Carlos Rodriguez",
        technicalOwners: ["Maria Silva"],
        status: "Delayed" as const,
        completionPercent: 25,
        wiredVendors: ["D-Link", "TP-Link"],
        wirelessVendors: ["Ubiquiti"],
        deviceTypes: ["Windows Workstations", "Android Devices"],
        radsec: "None",
        plannedStart: "2024-02-01",
        plannedEnd: "2024-04-30",
        notes: "Delayed due to local infrastructure challenges. Working with local vendors.",
      },
    ]

    try {
      // Clear existing sites and add demo sites
      await storage.clearAllData()
      const newSites: Site[] = []

      for (const siteData of demoSites) {
        const newSite = await storage.createSite(siteData)
        newSites.push(newSite)
      }

      setSites(newSites)
      toast({
        title: "Demo data loaded",
        description: "Demo sites have been loaded successfully.",
      })
    } catch (error) {
      console.error("Error generating demo sites:", error)
      toast({
        title: "Error",
        description: "Failed to load demo data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearAllSites = async () => {
    try {
      await storage.clearAllData()
      setSites([])
      toast({
        title: "All data cleared",
        description: "All sites have been cleared successfully.",
      })
    } catch (error) {
      console.error("Error clearing sites:", error)
      toast({
        title: "Error",
        description: "Failed to clear sites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportSites = async () => {
    try {
      const exportData = await storage.exportAllData()
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(exportData)
      const exportFileDefaultName = `portnox-data-${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Data exported",
        description: "All data has been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const importSites = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonData = e.target?.result as string
          await storage.importAllData(jsonData)
          await loadSites() // Reload sites after import
          toast({
            title: "Data imported",
            description: "Data has been imported successfully.",
          })
        } catch (error) {
          console.error("Error importing data:", error)
          toast({
            title: "Error",
            description: "Failed to import data. Please check the file format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const getRegions = () => {
    const regions = Array.from(new Set(sites.map((site) => site.region)))
    return regions.sort()
  }

  const getSiteStats = () => {
    const total = sites.length
    const completed = sites.filter((s) => s.status === "Complete").length
    const inProgress = sites.filter((s) => s.status === "In Progress").length
    const planned = sites.filter((s) => s.status === "Planned").length
    const delayed = sites.filter((s) => s.status === "Delayed").length
    const totalUsers = sites.reduce((sum, site) => sum + site.users, 0)

    return { total, completed, inProgress, planned, delayed, totalUsers }
  }

  const stats = getSiteStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Master Site List</h2>
          <p className="text-gray-600">Manage all NAC deployment sites and track progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={generateDemoSites} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Load Demo Data
          </Button>
          <Button onClick={clearAllSites} variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={exportSites} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importSites}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Sites</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Complete</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Planned</p>
                <p className="text-2xl font-bold">{stats.planned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Delayed</p>
                <p className="text-2xl font-bold">{stats.delayed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {getRegions().map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Display */}
      {filteredSites.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No sites found. Add your first site to get started.</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {site.country}, {site.region}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Badge className={statusColors[site.status]}>{site.status}</Badge>
                    <Badge className={priorityColors[site.priority]}>{site.priority}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{site.completionPercent}%</span>
                </div>
                <Progress value={site.completionPercent} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{site.users} users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Phase {site.phase}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Project Manager:</p>
                  <p className="font-medium">{site.projectManager}</p>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Network Vendors:</p>
                  <div className="flex flex-wrap gap-1">
                    {site.wiredVendors.slice(0, 2).map((vendor) => (
                      <Badge key={vendor} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                    {site.wiredVendors.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{site.wiredVendors.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSite(site)
                      onSiteSelect?.(site.id)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => setSelectedSite(site)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteSite(site.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSites.map((site) => (
                    <tr key={site.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{site.name}</div>
                          <div className="flex space-x-1 mt-1">
                            <Badge className={priorityColors[site.priority]} variant="outline">
                              {site.priority}
                            </Badge>
                            <Badge variant="outline">Phase {site.phase}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{site.country}</div>
                        <div className="text-sm text-gray-500">{site.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[site.status]}>{site.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Progress value={site.completionPercent} className="w-16 h-2" />
                          <span className="text-sm text-gray-600">{site.completionPercent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.users}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.projectManager}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSite(site)
                              onSiteSelect?.(site.id)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelectedSite(site)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteSite(site.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Site Modal */}
      <AddSiteModal open={showAddModal} onOpenChange={setShowAddModal} onAddSite={addSite} />

      {/* Site Details Modal */}
      {selectedSite && (
        <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>{selectedSite.name}</span>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Site Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <p className="font-medium">
                          {selectedSite.country}, {selectedSite.region}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Priority:</span>
                        <Badge className={priorityColors[selectedSite.priority]} variant="outline">
                          {selectedSite.priority}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phase:</span>
                        <p className="font-medium">Phase {selectedSite.phase}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Users:</span>
                        <p className="font-medium">{selectedSite.users.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className={statusColors[selectedSite.status]}>{selectedSite.status}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Progress:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={selectedSite.completionPercent} className="flex-1" />
                          <span className="text-sm font-medium">{selectedSite.completionPercent}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Timeline:</span>
                        <p className="font-medium">
                          {selectedSite.plannedStart} - {selectedSite.plannedEnd}
                        </p>
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
                      <p className="text-gray-700">{selectedSite.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Infrastructure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Wired Vendors:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedSite.wiredVendors.map((vendor) => (
                            <Badge key={vendor} variant="outline">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Wireless Vendors:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedSite.wirelessVendors.map((vendor) => (
                            <Badge key={vendor} variant="outline">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">RADSEC:</span>
                        <p className="font-medium">{selectedSite.radsec}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Device Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.deviceTypes.map((deviceType) => (
                          <Badge key={deviceType} variant="secondary">
                            {deviceType}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Team</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Project Manager:</span>
                      <p className="font-medium">{selectedSite.projectManager}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Technical Owners:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.technicalOwners.map((owner) => (
                          <Badge key={owner} variant="outline">
                            {owner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Planned Start:</span>
                        <p className="font-medium">{selectedSite.plannedStart}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Planned End:</span>
                        <p className="font-medium">{selectedSite.plannedEnd}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Progress:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={selectedSite.completionPercent} className="flex-1" />
                        <span className="text-sm font-medium">{selectedSite.completionPercent}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedSite(null)}>
                Close
              </Button>
              <Button onClick={() => onSiteSelect?.(selectedSite.id)}>View Workbook</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
