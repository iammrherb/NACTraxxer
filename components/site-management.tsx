"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  Plus,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  Map,
} from "lucide-react"

interface Site {
  id: string
  name: string
  location: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  progress: number
  assignedTo: string
  startDate: string
  targetDate: string
  completedUseCases: number
  totalUseCases: number
  description?: string
  priority: "low" | "medium" | "high"
}

const mockSites: Site[] = [
  {
    id: "1",
    name: "Main Office",
    location: "New York, NY",
    status: "completed",
    progress: 100,
    assignedTo: "John Doe",
    startDate: "2024-01-01",
    targetDate: "2024-01-15",
    completedUseCases: 16,
    totalUseCases: 16,
    description: "Primary headquarters deployment with full NAC implementation",
    priority: "high",
  },
  {
    id: "2",
    name: "Branch Office East",
    location: "Boston, MA",
    status: "in-progress",
    progress: 75,
    assignedTo: "Jane Smith",
    startDate: "2024-01-10",
    targetDate: "2024-01-25",
    completedUseCases: 12,
    totalUseCases: 16,
    description: "East coast branch office with 200 users",
    priority: "medium",
  },
  {
    id: "3",
    name: "Branch Office West",
    location: "San Francisco, CA",
    status: "planning",
    progress: 25,
    assignedTo: "Mike Johnson",
    startDate: "2024-01-20",
    targetDate: "2024-02-05",
    completedUseCases: 4,
    totalUseCases: 16,
    description: "West coast branch office deployment",
    priority: "medium",
  },
  {
    id: "4",
    name: "Remote Office",
    location: "Austin, TX",
    status: "on-hold",
    progress: 40,
    assignedTo: "Sarah Wilson",
    startDate: "2024-01-05",
    targetDate: "2024-01-30",
    completedUseCases: 6,
    totalUseCases: 16,
    description: "Small remote office with limited infrastructure",
    priority: "low",
  },
]

export function SiteManagement() {
  const [sites, setSites] = useState<Site[]>(mockSites)
  const [filteredSites, setFilteredSites] = useState<Site[]>(mockSites)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table" | "map">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: "",
    location: "",
    status: "planning",
    assignedTo: "",
    startDate: "",
    targetDate: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    let filtered = sites

    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((site) => site.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((site) => site.priority === priorityFilter)
    }

    setFilteredSites(filtered)
  }, [sites, searchTerm, statusFilter, priorityFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "planning":
        return <Calendar className="h-4 w-4 text-orange-600" />
      case "on-hold":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      "in-progress": "secondary",
      planning: "outline",
      "on-hold": "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "secondary"}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const handleAddSite = () => {
    if (!newSite.name || !newSite.location || !newSite.assignedTo) return

    const site: Site = {
      id: Date.now().toString(),
      name: newSite.name,
      location: newSite.location,
      status: newSite.status as Site["status"],
      progress: 0,
      assignedTo: newSite.assignedTo,
      startDate: newSite.startDate || new Date().toISOString().split("T")[0],
      targetDate: newSite.targetDate || "",
      completedUseCases: 0,
      totalUseCases: 16,
      description: newSite.description,
      priority: newSite.priority as Site["priority"],
    }

    setSites((prev) => [...prev, site])
    setIsAddDialogOpen(false)
    setNewSite({
      name: "",
      location: "",
      status: "planning",
      assignedTo: "",
      startDate: "",
      targetDate: "",
      description: "",
      priority: "medium",
    })
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setNewSite(site)
    setIsAddDialogOpen(true)
  }

  const handleUpdateSite = () => {
    if (!editingSite || !newSite.name || !newSite.location || !newSite.assignedTo) return

    setSites((prev) => prev.map((site) => (site.id === editingSite.id ? ({ ...site, ...newSite } as Site) : site)))
    setIsAddDialogOpen(false)
    setEditingSite(null)
    setNewSite({
      name: "",
      location: "",
      status: "planning",
      assignedTo: "",
      startDate: "",
      targetDate: "",
      description: "",
      priority: "medium",
    })
  }

  const handleDeleteSite = (id: string) => {
    setSites((prev) => prev.filter((site) => site.id !== id))
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSites.map((site) => (
        <Card key={site.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {site.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {site.location}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleEditSite(site)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteSite(site.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              {getStatusBadge(site.status)}
              {getPriorityBadge(site.priority)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{site.progress}%</span>
              </div>
              <Progress value={site.progress} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned to:</span>
                <span>{site.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Use Cases:</span>
                <span>
                  {site.completedUseCases}/{site.totalUseCases}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Date:</span>
                <span>{new Date(site.targetDate).toLocaleDateString()}</span>
              </div>
            </div>

            {site.description && <p className="text-sm text-muted-foreground line-clamp-2">{site.description}</p>}

            <Button className="w-full bg-transparent" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTableView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{site.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {site.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(site.status)}
                    {getStatusBadge(site.status)}
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(site.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={site.progress} className="h-2 w-16" />
                    <span className="text-sm">{site.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{site.assignedTo}</TableCell>
                <TableCell>{new Date(site.targetDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditSite(site)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSite(site.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderMapView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Site Locations
        </CardTitle>
        <CardDescription>Geographic distribution of deployment sites</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive map view coming soon</p>
            <p className="text-sm text-muted-foreground mt-2">This will show all sites plotted on an interactive map</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSites.map((site) => (
            <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(site.status)}
                  <span className="font-medium">{site.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{site.location}</span>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(site.priority)}
                <span className="text-sm">{site.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Management</h2>
          <p className="text-muted-foreground">Manage deployment sites and track progress</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSite ? "Edit Site" : "Add New Site"}</DialogTitle>
              <DialogDescription>
                {editingSite ? "Update site information" : "Create a new deployment site"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={newSite.name}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter site name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newSite.location}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newSite.status}
                  onValueChange={(value) => setNewSite((prev) => ({ ...prev, status: value as Site["status"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newSite.priority}
                  onValueChange={(value) => setNewSite((prev) => ({ ...prev, priority: value as Site["priority"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newSite.assignedTo}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newSite.targetDate}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSite.description}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setEditingSite(null)
                  setNewSite({
                    name: "",
                    location: "",
                    status: "planning",
                    assignedTo: "",
                    startDate: "",
                    targetDate: "",
                    description: "",
                    priority: "medium",
                  })
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingSite ? handleUpdateSite : handleAddSite}>
                {editingSite ? "Update Site" : "Add Site"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "grid" && renderGridView()}
      {viewMode === "table" && renderTableView()}
      {viewMode === "map" && renderMapView()}

      {filteredSites.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No sites found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by adding your first deployment site."}
            </p>
            {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Site
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
