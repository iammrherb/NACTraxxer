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
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Plus,
  Search,
  CalendarIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  BarChart3,
} from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  status: "upcoming" | "in-progress" | "completed" | "overdue" | "at-risk"
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  completedDate?: string
  progress: number
  assignedTo: string
  siteId: string
  siteName: string
  deliverables: string[]
  dependencies: string[]
  category: "planning" | "implementation" | "testing" | "deployment" | "closure"
}

const mockMilestones: Milestone[] = [
  {
    id: "1",
    title: "Project Kickoff Complete",
    description: "Initial project setup, team assignments, and stakeholder alignment",
    status: "completed",
    priority: "high",
    dueDate: "2024-01-05",
    completedDate: "2024-01-04",
    progress: 100,
    assignedTo: "John Doe",
    siteId: "1",
    siteName: "Main Office",
    deliverables: ["Project charter", "Team assignments", "Communication plan"],
    dependencies: [],
    category: "planning",
  },
  {
    id: "2",
    title: "Infrastructure Assessment",
    description: "Complete network infrastructure assessment and readiness evaluation",
    status: "completed",
    priority: "critical",
    dueDate: "2024-01-10",
    completedDate: "2024-01-09",
    progress: 100,
    assignedTo: "Jane Smith",
    siteId: "1",
    siteName: "Main Office",
    deliverables: ["Network topology", "Hardware inventory", "Readiness report"],
    dependencies: ["1"],
    category: "planning",
  },
  {
    id: "3",
    title: "Portnox Cloud Configuration",
    description: "Configure Portnox Cloud platform with initial policies and settings",
    status: "in-progress",
    priority: "critical",
    dueDate: "2024-01-20",
    progress: 75,
    assignedTo: "Mike Johnson",
    siteId: "2",
    siteName: "Branch Office East",
    deliverables: ["Cloud tenant setup", "Policy configuration", "Integration testing"],
    dependencies: ["2"],
    category: "implementation",
  },
  {
    id: "4",
    title: "Pilot Deployment",
    description: "Deploy NAC solution to pilot group of 50 users",
    status: "upcoming",
    priority: "high",
    dueDate: "2024-01-25",
    progress: 25,
    assignedTo: "Sarah Wilson",
    siteId: "2",
    siteName: "Branch Office East",
    deliverables: ["Pilot user onboarding", "Initial testing", "Feedback collection"],
    dependencies: ["3"],
    category: "testing",
  },
  {
    id: "5",
    title: "Production Rollout Phase 1",
    description: "Roll out NAC solution to first 200 users in production",
    status: "at-risk",
    priority: "critical",
    dueDate: "2024-02-01",
    progress: 10,
    assignedTo: "John Doe",
    siteId: "1",
    siteName: "Main Office",
    deliverables: ["Production deployment", "User training", "Support documentation"],
    dependencies: ["4"],
    category: "deployment",
  },
  {
    id: "6",
    title: "Security Compliance Audit",
    description: "Complete security audit and compliance verification",
    status: "overdue",
    priority: "medium",
    dueDate: "2024-01-15",
    progress: 60,
    assignedTo: "Mike Johnson",
    siteId: "3",
    siteName: "Branch Office West",
    deliverables: ["Audit report", "Compliance certification", "Remediation plan"],
    dependencies: ["2"],
    category: "testing",
  },
]

export function MilestoneTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>(mockMilestones)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "calendar" | "gantt">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    status: "upcoming",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    siteId: "",
    siteName: "",
    deliverables: [],
    dependencies: [],
    category: "planning",
  })

  useEffect(() => {
    let filtered = milestones

    if (searchTerm) {
      filtered = filtered.filter(
        (milestone) =>
          milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          milestone.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          milestone.siteName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((milestone) => milestone.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((milestone) => milestone.category === categoryFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((milestone) => milestone.priority === priorityFilter)
    }

    setFilteredMilestones(filtered)
  }, [milestones, searchTerm, statusFilter, categoryFilter, priorityFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "upcoming":
        return <CalendarIcon className="h-4 w-4 text-gray-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "at-risk":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      "in-progress": "secondary",
      upcoming: "outline",
      overdue: "destructive",
      "at-risk": "destructive",
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

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMilestones.map((milestone) => {
        const daysUntilDue = getDaysUntilDue(milestone.dueDate)
        return (
          <Card key={milestone.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    {milestone.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{milestone.siteName}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingMilestone(milestone)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{milestone.description}</p>

              <div className="flex flex-wrap gap-2">
                {getStatusBadge(milestone.status)}
                {getPriorityBadge(milestone.priority)}
                {getCategoryBadge(milestone.category)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span>{milestone.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className={daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 3 ? "text-orange-600" : ""}>
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days Until Due:</span>
                  <span className={daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 3 ? "text-orange-600" : ""}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                  </span>
                </div>
                {milestone.deliverables.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deliverables:</span>
                    <span>{milestone.deliverables.length}</span>
                  </div>
                )}
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderCalendarView = () => {
    const milestonesForSelectedDate = selectedDate
      ? filteredMilestones.filter((milestone) => {
          const milestoneDate = new Date(milestone.dueDate)
          return milestoneDate.toDateString() === selectedDate.toDateString()
        })
      : []

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasMilestone: filteredMilestones.map((m) => new Date(m.dueDate)),
              }}
              modifiersStyles={{
                hasMilestone: { backgroundColor: "#3b82f6", color: "white" },
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Milestones for {selectedDate?.toLocaleDateString()}</CardTitle>
            <CardDescription>{milestonesForSelectedDate.length} milestone(s) due on this date</CardDescription>
          </CardHeader>
          <CardContent>
            {milestonesForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {milestonesForSelectedDate.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(milestone.status)}
                            {getPriorityBadge(milestone.priority)}
                            <span className="text-sm text-muted-foreground">
                              {milestone.siteName} • {milestone.assignedTo}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Progress</div>
                          <div className="text-lg font-medium">{milestone.progress}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No milestones due on this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderGanttView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Gantt Chart View
        </CardTitle>
        <CardDescription>Timeline view of all milestones and their dependencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive Gantt chart coming soon</p>
            <p className="text-sm text-muted-foreground mt-2">
              This will show milestone timelines, dependencies, and critical path
            </p>
          </div>
        </div>

        {/* Simple timeline representation */}
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Milestone Timeline</h4>
          {filteredMilestones
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((milestone, index) => (
              <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <h5 className="font-medium">{milestone.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {milestone.siteName} • Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(milestone.priority)}
                  <div className="w-24">
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                  <span className="text-sm w-12 text-right">{milestone.progress}%</span>
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
          <h2 className="text-2xl font-bold">Milestone Tracker</h2>
          <p className="text-muted-foreground">Track project milestones and deliverables</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogDescription>Create a new milestone for project tracking</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter milestone title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) =>
                    setNewMilestone((prev) => ({ ...prev, category: value as Milestone["category"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="implementation">Implementation</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="closure">Closure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter milestone description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newMilestone.priority}
                  onValueChange={(value) =>
                    setNewMilestone((prev) => ({ ...prev, priority: value as Milestone["priority"] }))
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
                  value={newMilestone.assignedTo}
                  onChange={(e) => setNewMilestone((prev) => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site</Label>
                <Input
                  id="siteName"
                  value={newMilestone.siteName}
                  onChange={(e) => setNewMilestone((prev) => ({ ...prev, siteName: e.target.value }))}
                  placeholder="Enter site name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Milestone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            status: "completed",
            label: "Completed",
            count: filteredMilestones.filter((m) => m.status === "completed").length,
            color: "text-green-600",
          },
          {
            status: "in-progress",
            label: "In Progress",
            count: filteredMilestones.filter((m) => m.status === "in-progress").length,
            color: "text-blue-600",
          },
          {
            status: "upcoming",
            label: "Upcoming",
            count: filteredMilestones.filter((m) => m.status === "upcoming").length,
            color: "text-gray-600",
          },
          {
            status: "at-risk",
            label: "At Risk",
            count: filteredMilestones.filter((m) => m.status === "at-risk").length,
            color: "text-orange-600",
          },
          {
            status: "overdue",
            label: "Overdue",
            count: filteredMilestones.filter((m) => m.status === "overdue").length,
            color: "text-red-600",
          },
        ].map((item) => (
          <Card key={item.status}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search milestones..."
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
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="closure">Closure</SelectItem>
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
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "gantt" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("gantt")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "grid" && renderGridView()}
      {viewMode === "calendar" && renderCalendarView()}
      {viewMode === "gantt" && renderGanttView()}

      {filteredMilestones.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No milestones found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by adding your first milestone."}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && priorityFilter === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Milestone
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
