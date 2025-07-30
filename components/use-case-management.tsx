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
import { Progress } from "@/components/ui/progress"
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  Kanban,
  TimerIcon as Timeline,
} from "lucide-react"

interface UseCase {
  id: string
  title: string
  description: string
  category: "authentication" | "authorization" | "compliance" | "monitoring"
  status: "not-started" | "in-progress" | "testing" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  siteId: string
  siteName: string
  startDate: string
  dueDate: string
  completedDate?: string
  progress: number
  dependencies: string[]
  testCriteria: string[]
}

const mockUseCases: UseCase[] = [
  {
    id: "1",
    title: "802.1X Authentication",
    description: "Implement 802.1X authentication for wired and wireless devices",
    category: "authentication",
    status: "completed",
    priority: "critical",
    assignedTo: "John Doe",
    siteId: "1",
    siteName: "Main Office",
    startDate: "2024-01-01",
    dueDate: "2024-01-10",
    completedDate: "2024-01-08",
    progress: 100,
    dependencies: [],
    testCriteria: ["Device authentication", "Certificate validation", "RADIUS integration"],
  },
  {
    id: "2",
    title: "Guest Network Access",
    description: "Configure guest network with captive portal and time-based access",
    category: "authorization",
    status: "in-progress",
    priority: "high",
    assignedTo: "Jane Smith",
    siteId: "2",
    siteName: "Branch Office East",
    startDate: "2024-01-05",
    dueDate: "2024-01-20",
    progress: 65,
    dependencies: ["1"],
    testCriteria: ["Captive portal functionality", "Time-based restrictions", "Bandwidth limits"],
  },
  {
    id: "3",
    title: "Device Profiling",
    description: "Automatic device identification and classification",
    category: "monitoring",
    status: "testing",
    priority: "medium",
    assignedTo: "Mike Johnson",
    siteId: "1",
    siteName: "Main Office",
    startDate: "2024-01-10",
    dueDate: "2024-01-25",
    progress: 80,
    dependencies: ["1"],
    testCriteria: ["Device fingerprinting", "Classification accuracy", "Policy application"],
  },
  {
    id: "4",
    title: "Compliance Reporting",
    description: "Generate compliance reports for audit requirements",
    category: "compliance",
    status: "not-started",
    priority: "medium",
    assignedTo: "Sarah Wilson",
    siteId: "3",
    siteName: "Branch Office West",
    startDate: "2024-01-15",
    dueDate: "2024-02-01",
    progress: 0,
    dependencies: ["1", "2"],
    testCriteria: ["Report generation", "Data accuracy", "Audit trail"],
  },
  {
    id: "5",
    title: "MAC Authentication Bypass",
    description: "Configure MAB for devices that cannot support 802.1X",
    category: "authentication",
    status: "blocked",
    priority: "high",
    assignedTo: "John Doe",
    siteId: "4",
    siteName: "Remote Office",
    startDate: "2024-01-12",
    dueDate: "2024-01-28",
    progress: 30,
    dependencies: ["1"],
    testCriteria: ["MAC address validation", "Fallback authentication", "Policy enforcement"],
  },
]

export function UseCaseManagement() {
  const [useCases, setUseCases] = useState<UseCase[]>(mockUseCases)
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>(mockUseCases)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table" | "kanban" | "timeline">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUseCase, setEditingUseCase] = useState<UseCase | null>(null)
  const [newUseCase, setNewUseCase] = useState<Partial<UseCase>>({
    title: "",
    description: "",
    category: "authentication",
    status: "not-started",
    priority: "medium",
    assignedTo: "",
    siteId: "",
    siteName: "",
    startDate: "",
    dueDate: "",
    progress: 0,
    dependencies: [],
    testCriteria: [],
  })

  useEffect(() => {
    let filtered = useCases

    if (searchTerm) {
      filtered = filtered.filter(
        (useCase) =>
          useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.siteName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((useCase) => useCase.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((useCase) => useCase.category === categoryFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((useCase) => useCase.priority === priorityFilter)
    }

    setFilteredUseCases(filtered)
  }, [useCases, searchTerm, statusFilter, categoryFilter, priorityFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "testing":
        return <CheckSquare className="h-4 w-4 text-purple-600" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "not-started":
        return <Calendar className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      "in-progress": "secondary",
      testing: "outline",
      blocked: "destructive",
      "not-started": "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: "destructive",
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

  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {category}
      </Badge>
    )
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUseCases.map((useCase) => (
        <Card key={useCase.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-base">{useCase.title}</CardTitle>
                <CardDescription className="mt-1">{useCase.siteName}</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditingUseCase(useCase)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{useCase.description}</p>

            <div className="flex flex-wrap gap-2">
              {getStatusBadge(useCase.status)}
              {getPriorityBadge(useCase.priority)}
              {getCategoryBadge(useCase.category)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{useCase.progress}%</span>
              </div>
              <Progress value={useCase.progress} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned to:</span>
                <span>{useCase.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{new Date(useCase.dueDate).toLocaleDateString()}</span>
              </div>
              {useCase.dependencies.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dependencies:</span>
                  <span>{useCase.dependencies.length}</span>
                </div>
              )}
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderKanbanView = () => {
    const statusColumns = [
      { key: "not-started", title: "Not Started", color: "bg-gray-100" },
      { key: "in-progress", title: "In Progress", color: "bg-blue-100" },
      { key: "testing", title: "Testing", color: "bg-purple-100" },
      { key: "completed", title: "Completed", color: "bg-green-100" },
      { key: "blocked", title: "Blocked", color: "bg-red-100" },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map((column) => (
          <Card key={column.key} className={column.color}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {column.title}
                <Badge variant="secondary" className="text-xs">
                  {filteredUseCases.filter((uc) => uc.status === column.key).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredUseCases
                .filter((useCase) => useCase.status === column.key)
                .map((useCase) => (
                  <Card
                    key={useCase.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-3 space-y-2">
                      <h4 className="font-medium text-sm">{useCase.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{useCase.description}</p>
                      <div className="flex justify-between items-center">
                        {getPriorityBadge(useCase.priority)}
                        <span className="text-xs text-muted-foreground">{useCase.progress}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {useCase.assignedTo}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderTimelineView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timeline className="h-5 w-5" />
          Use Case Timeline
        </CardTitle>
        <CardDescription>Chronological view of use case progress and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredUseCases
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .map((useCase, index) => (
              <div key={useCase.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      useCase.status === "completed"
                        ? "bg-green-500"
                        : useCase.status === "in-progress"
                          ? "bg-blue-500"
                          : useCase.status === "blocked"
                            ? "bg-red-500"
                            : "bg-gray-300"
                    }`}
                  />
                  {index < filteredUseCases.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{useCase.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{useCase.siteName}</span>
                        <span>•</span>
                        <span>{useCase.assignedTo}</span>
                        <span>•</span>
                        <span>
                          {new Date(useCase.startDate).toLocaleDateString()} -{" "}
                          {new Date(useCase.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(useCase.status)}
                      {getPriorityBadge(useCase.priority)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{useCase.progress}%</span>
                    </div>
                    <Progress value={useCase.progress} className="h-2" />
                  </div>
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
          <h2 className="text-2xl font-bold">Use Case Management</h2>
          <p className="text-muted-foreground">Track and manage deployment use cases</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Use Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Use Case</DialogTitle>
              <DialogDescription>Create a new use case for deployment tracking</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newUseCase.title}
                  onChange={(e) => setNewUseCase((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter use case title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newUseCase.category}
                  onValueChange={(value) =>
                    setNewUseCase((prev) => ({ ...prev, category: value as UseCase["category"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newUseCase.description}
                  onChange={(e) => setNewUseCase((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter use case description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newUseCase.priority}
                  onValueChange={(value) =>
                    setNewUseCase((prev) => ({ ...prev, priority: value as UseCase["priority"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newUseCase.assignedTo}
                  onChange={(e) => setNewUseCase((prev) => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newUseCase.startDate}
                  onChange={(e) => setNewUseCase((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newUseCase.dueDate}
                  onChange={(e) => setNewUseCase((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Use Case</Button>
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
                  placeholder="Search use cases..."
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
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="authorization">Authorization</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
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
                  <SelectItem value="critical">Critical</SelectItem>
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
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <Kanban className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                <Timeline className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "grid" && renderGridView()}
      {viewMode === "kanban" && renderKanbanView()}
      {viewMode === "timeline" && renderTimelineView()}

      {filteredUseCases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No use cases found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by adding your first use case."}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && priorityFilter === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Use Case
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
