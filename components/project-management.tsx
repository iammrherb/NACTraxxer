"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FolderPlus,
  Building2,
  Target,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Play,
  Pause,
  Square,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Download,
  Upload,
  Star,
  StarOff,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Layers,
  GitBranch,
  Flag,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  type: "single-site" | "multi-site" | "enterprise-rollout" | "pilot" | "poc"
  phase: string
  startDate: string
  endDate: string
  actualStartDate?: string
  actualEndDate?: string
  budget: number
  currency: string
  progress: number
  healthScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  projectManager: string
  technicalLead: string
  stakeholders: string[]
  sites: string[]
  useCases: string[]
  milestones: string[]
  phases: ProjectPhase[]
  successCriteria: SuccessCriteria[]
  rolloutStrategy: RolloutStrategy
  complianceFrameworks: string[]
  tags: string[]
  isStarred: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

interface ProjectPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "not-started" | "in-progress" | "completed" | "delayed"
  progress: number
  dependencies: string[]
  deliverables: string[]
  successCriteria: string[]
  risks: string[]
  resources: string[]
  budget: number
  milestones: string[]
  sites: string[]
  useCases: string[]
}

interface SuccessCriteria {
  id: string
  category: "technical" | "business" | "operational" | "compliance"
  description: string
  metric: string
  target: string
  current: string
  status: "not-started" | "in-progress" | "achieved" | "at-risk"
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  owner: string
}

interface RolloutStrategy {
  type: "big-bang" | "phased" | "pilot-first" | "site-by-site"
  description: string
  phases: RolloutPhase[]
  rollbackPlan: string
  communicationPlan: string
  trainingPlan: string
  supportPlan: string
}

interface RolloutPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  sites: string[]
  userCount: number
  successCriteria: string[]
  rollbackTriggers: string[]
  goLiveChecklist: string[]
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Global NAC Deployment 2024",
    description: "Enterprise-wide deployment of Portnox NAC solution across all global offices",
    status: "active",
    priority: "critical",
    type: "enterprise-rollout",
    phase: "Phase 2: Implementation",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    actualStartDate: "2024-01-03",
    budget: 2500000,
    currency: "USD",
    progress: 45,
    healthScore: 85,
    riskLevel: "medium",
    projectManager: "Sarah Johnson",
    technicalLead: "Mike Chen",
    stakeholders: ["John Smith", "Lisa Wang", "David Brown"],
    sites: ["1", "2", "3", "4", "5"],
    useCases: ["1", "2", "3", "4"],
    milestones: ["1", "2", "3", "4", "5"],
    phases: [],
    successCriteria: [],
    rolloutStrategy: {
      type: "phased",
      description: "Phased rollout starting with pilot sites",
      phases: [],
      rollbackPlan: "Automated rollback procedures in place",
      communicationPlan: "Weekly stakeholder updates",
      trainingPlan: "Comprehensive training program",
      supportPlan: "24/7 support during rollout",
    },
    complianceFrameworks: ["SOX", "HIPAA", "PCI-DSS"],
    tags: ["enterprise", "global", "high-priority"],
    isStarred: true,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
    createdBy: "Sarah Johnson",
    lastModifiedBy: "Mike Chen",
  },
  {
    id: "2",
    name: "EMEA Regional Pilot",
    description: "Pilot deployment for European, Middle East, and African offices",
    status: "planning",
    priority: "high",
    type: "pilot",
    phase: "Phase 1: Planning",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    budget: 500000,
    currency: "EUR",
    progress: 15,
    healthScore: 92,
    riskLevel: "low",
    projectManager: "Emma Wilson",
    technicalLead: "Alex Rodriguez",
    stakeholders: ["Robert Taylor", "Maria Garcia"],
    sites: ["6", "7", "8"],
    useCases: ["1", "2"],
    milestones: ["6", "7"],
    phases: [],
    successCriteria: [],
    rolloutStrategy: {
      type: "pilot-first",
      description: "Start with London office as pilot",
      phases: [],
      rollbackPlan: "Quick rollback to legacy system",
      communicationPlan: "Bi-weekly updates",
      trainingPlan: "On-site training sessions",
      supportPlan: "Regional support team",
    },
    complianceFrameworks: ["GDPR", "ISO27001"],
    tags: ["pilot", "emea", "regional"],
    isStarred: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    createdBy: "Emma Wilson",
    lastModifiedBy: "Emma Wilson",
  },
]

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table" | "kanban" | "timeline">("grid")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // New project form state
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    type: "single-site",
    phase: "Phase 1: Planning",
    startDate: "",
    endDate: "",
    budget: 0,
    currency: "USD",
    projectManager: "",
    technicalLead: "",
    stakeholders: [],
    sites: [],
    useCases: [],
    milestones: [],
    complianceFrameworks: [],
    tags: [],
    isStarred: false,
  })

  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.projectManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((project) => project.priority === priorityFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.type === typeFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, priorityFilter, typeFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "active":
        return <Play className="h-4 w-4 text-green-600" />
      case "on-hold":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <Square className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      planning: "secondary",
      active: "default",
      "on-hold": "outline",
      completed: "default",
      cancelled: "destructive",
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

  const getRiskBadge = (risk: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const

    return (
      <Badge variant={variants[risk as keyof typeof variants] || "secondary"}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    )
  }

  const handleCreateProject = () => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      progress: 0,
      healthScore: 100,
      riskLevel: "low",
      phases: [],
      successCriteria: [],
      rolloutStrategy: {
        type: "phased",
        description: "",
        phases: [],
        rollbackPlan: "",
        communicationPlan: "",
        trainingPlan: "",
        supportPlan: "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      lastModifiedBy: "Current User",
    } as Project

    setProjects([...projects, project])
    setIsCreateDialogOpen(false)
    setNewProject({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      type: "single-site",
      phase: "Phase 1: Planning",
      startDate: "",
      endDate: "",
      budget: 0,
      currency: "USD",
      projectManager: "",
      technicalLead: "",
      stakeholders: [],
      sites: [],
      useCases: [],
      milestones: [],
      complianceFrameworks: [],
      tags: [],
      isStarred: false,
    })
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setNewProject(project)
    setIsEditDialogOpen(true)
  }

  const handleUpdateProject = () => {
    if (selectedProject) {
      const updatedProjects = projects.map((p) =>
        p.id === selectedProject.id
          ? { ...newProject, id: selectedProject.id, updatedAt: new Date().toISOString() }
          : p,
      )
      setProjects(updatedProjects as Project[])
      setIsEditDialogOpen(false)
      setSelectedProject(null)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleToggleStar = (projectId: string) => {
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, isStarred: !p.isStarred } : p)))
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsDetailDialogOpen(true)
  }

  const renderProjectCard = (project: Project) => (
    <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(project.status)}
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStar(project.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {project.isStarred ? (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(project.status)}
          {getPriorityBadge(project.priority)}
          {getRiskBadge(project.riskLevel)}
          <Badge variant="outline">{project.type.replace("-", " ")}</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">PM:</span>
            </div>
            <div className="font-medium">{project.projectManager}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sites:</span>
            </div>
            <div className="font-medium">{project.sites.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Start Date</span>
            <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">End Date</span>
            <div className="font-medium">{new Date(project.endDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Health: {project.healthScore}/100</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {project.currency} {project.budget.toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(project)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleEditProject(project)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderKanbanView = () => {
    const statusColumns = [
      { key: "planning", title: "Planning", color: "bg-blue-50 border-blue-200" },
      { key: "active", title: "Active", color: "bg-green-50 border-green-200" },
      { key: "on-hold", title: "On Hold", color: "bg-yellow-50 border-yellow-200" },
      { key: "completed", title: "Completed", color: "bg-emerald-50 border-emerald-200" },
      { key: "cancelled", title: "Cancelled", color: "bg-red-50 border-red-200" },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map((column) => (
          <Card key={column.key} className={`${column.color} min-h-[600px]`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {column.title}
                <Badge variant="secondary" className="text-xs">
                  {filteredProjects.filter((p) => p.status === column.key).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredProjects
                .filter((project) => project.status === column.key)
                .map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewDetails(project)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{project.name}</h4>
                        {project.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center">
                        {getPriorityBadge(project.priority)}
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{project.projectManager}</span>
                        <span>{project.sites.length} sites</span>
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

  const renderProjectForm = (isEdit = false) => (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Project Type *</Label>
              <Select
                value={newProject.type}
                onValueChange={(value) => setNewProject((prev) => ({ ...prev, type: value as Project["type"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-site">Single Site</SelectItem>
                  <SelectItem value="multi-site">Multi-Site</SelectItem>
                  <SelectItem value="enterprise-rollout">Enterprise Rollout</SelectItem>
                  <SelectItem value="pilot">Pilot Project</SelectItem>
                  <SelectItem value="poc">Proof of Concept</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProject.description}
              onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the project objectives and scope"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newProject.status}
                onValueChange={(value) => setNewProject((prev) => ({ ...prev, status: value as Project["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newProject.priority}
                onValueChange={(value) =>
                  setNewProject((prev) => ({ ...prev, priority: value as Project["priority"] }))
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
              <Label htmlFor="phase">Current Phase</Label>
              <Input
                id="phase"
                value={newProject.phase}
                onChange={(e) => setNewProject((prev) => ({ ...prev, phase: e.target.value }))}
                placeholder="e.g., Phase 1: Planning"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="flex gap-2">
                <Select
                  value={newProject.currency}
                  onValueChange={(value) => setNewProject((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                  placeholder="0"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Enter tags separated by commas"
                value={newProject.tags?.join(", ")}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualStartDate">Actual Start Date</Label>
                <Input
                  id="actualStartDate"
                  type="date"
                  value={newProject.actualStartDate}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, actualStartDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualEndDate">Actual End Date</Label>
                <Input
                  id="actualEndDate"
                  type="date"
                  value={newProject.actualEndDate}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, actualEndDate: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Project Phases</Label>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Project phases will be configured here. Each phase can have its own timeline, deliverables, and success
                criteria.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager *</Label>
              <Input
                id="projectManager"
                value={newProject.projectManager}
                onChange={(e) => setNewProject((prev) => ({ ...prev, projectManager: e.target.value }))}
                placeholder="Enter project manager name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technicalLead">Technical Lead</Label>
              <Input
                id="technicalLead"
                value={newProject.technicalLead}
                onChange={(e) => setNewProject((prev) => ({ ...prev, technicalLead: e.target.value }))}
                placeholder="Enter technical lead name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stakeholders</Label>
            <Input
              placeholder="Enter stakeholder names separated by commas"
              value={newProject.stakeholders?.join(", ")}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  stakeholders: e.target.value
                    .split(",")
                    .map((name) => name.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Assigned Sites</Label>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Sites
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Select and assign sites to this project. Sites can be added individually or in bulk.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Use Cases</Label>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Use Cases
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Define and assign use cases that will be implemented as part of this project.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rollout Strategy</Label>
              <Select defaultValue="phased">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="big-bang">Big Bang</SelectItem>
                  <SelectItem value="phased">Phased Rollout</SelectItem>
                  <SelectItem value="pilot-first">Pilot First</SelectItem>
                  <SelectItem value="site-by-site">Site by Site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rollback Plan</Label>
              <Textarea placeholder="Describe the rollback strategy and procedures" rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Communication Plan</Label>
              <Textarea placeholder="Outline communication strategy and stakeholder updates" rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Training Plan</Label>
              <Textarea placeholder="Describe training requirements and delivery method" rows={3} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label>Compliance Frameworks</Label>
            <div className="grid grid-cols-3 gap-4">
              {["SOX", "HIPAA", "PCI-DSS", "GDPR", "ISO27001", "NIST"].map((framework) => (
                <div key={framework} className="flex items-center space-x-2">
                  <Checkbox
                    id={framework}
                    checked={newProject.complianceFrameworks?.includes(framework)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewProject((prev) => ({
                          ...prev,
                          complianceFrameworks: [...(prev.complianceFrameworks || []), framework],
                        }))
                      } else {
                        setNewProject((prev) => ({
                          ...prev,
                          complianceFrameworks: prev.complianceFrameworks?.filter((f) => f !== framework),
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={framework}>{framework}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="starred"
              checked={newProject.isStarred}
              onCheckedChange={(checked) => setNewProject((prev) => ({ ...prev, isStarred: checked }))}
            />
            <Label htmlFor="starred">Mark as starred project</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Success Criteria</Label>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Criteria
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Define measurable success criteria for this project. Each criterion should have clear metrics and
                targets.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">Create and manage deployment projects with comprehensive tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Set up a new deployment project with detailed configuration and planning
                </DialogDescription>
              </DialogHeader>
              {renderProjectForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            status: "active",
            label: "Active",
            count: filteredProjects.filter((p) => p.status === "active").length,
            color: "text-green-600",
            icon: Play,
          },
          {
            status: "planning",
            label: "Planning",
            count: filteredProjects.filter((p) => p.status === "planning").length,
            color: "text-blue-600",
            icon: Clock,
          },
          {
            status: "completed",
            label: "Completed",
            count: filteredProjects.filter((p) => p.status === "completed").length,
            color: "text-emerald-600",
            icon: CheckCircle,
          },
          {
            status: "on-hold",
            label: "On Hold",
            count: filteredProjects.filter((p) => p.status === "on-hold").length,
            color: "text-yellow-600",
            icon: Pause,
          },
          {
            status: "high-risk",
            label: "High Risk",
            count: filteredProjects.filter((p) => p.riskLevel === "high" || p.riskLevel === "critical").length,
            color: "text-red-600",
            icon: AlertTriangle,
          },
        ].map((item) => (
          <Card key={item.status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
                <item.icon className={`h-8 w-8 ${item.color}`} />
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
                  placeholder="Search projects..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-site">Single Site</SelectItem>
                  <SelectItem value="multi-site">Multi-Site</SelectItem>
                  <SelectItem value="enterprise-rollout">Enterprise</SelectItem>
                  <SelectItem value="pilot">Pilot</SelectItem>
                  <SelectItem value="poc">PoC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <GitBranch className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(renderProjectCard)}
        </div>
      )}

      {viewMode === "kanban" && renderKanbanView()}

      {viewMode === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>Gantt chart view of all projects and their timelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive timeline view coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will show project timelines, dependencies, and critical path
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by creating your first deployment project."}
            </p>
            {!searchTerm && statusFilter === "all" && priorityFilter === "all" && typeFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and configuration</DialogDescription>
          </DialogHeader>
          {renderProjectForm(true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject}>Update Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProject && getStatusIcon(selectedProject.status)}
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription>{selectedProject?.description}</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Project Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Progress</span>
                        <span className="font-medium">{selectedProject.progress}%</span>
                      </div>
                      <Progress value={selectedProject.progress} className="h-2" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health Score</span>
                          <span className="font-medium">{selectedProject.healthScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Level</span>
                          {getRiskBadge(selectedProject.riskLevel)}
                        </div>
                        <div className="flex justify-between">
                          <span>Priority</span>
                          {getPriorityBadge(selectedProject.priority)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span>{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date</span>
                        <span>{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                      </div>
                      {selectedProject.actualStartDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actual Start</span>
                          <span>{new Date(selectedProject.actualStartDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>
                          {Math.ceil(
                            (new Date(selectedProject.endDate).getTime() -
                              new Date(selectedProject.startDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">
                          {selectedProject.currency} {selectedProject.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sites</span>
                        <span>{selectedProject.sites.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Use Cases</span>
                        <span>{selectedProject.useCases.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Milestones</span>
                        <span>{selectedProject.milestones.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Team & Stakeholders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium">Project Manager</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedProject.projectManager}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Technical Lead</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedProject.technicalLead}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Stakeholders</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProject.stakeholders.map((stakeholder, index) => (
                          <Badge key={index} variant="outline">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Compliance Frameworks</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProject.complianceFrameworks.map((framework, index) => (
                          <Badge key={index} variant="secondary">
                            {framework}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProject.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sites" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Assigned Sites</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sites
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Site management interface will be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        View, edit, and manage all sites assigned to this project
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="use-cases" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Project Use Cases</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Use Cases
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Use case management interface will be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Track progress and manage all use cases for this project
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Project Milestones</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Milestone tracking interface will be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Monitor and manage all project milestones and deliverables
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline & Gantt Chart</CardTitle>
                    <CardDescription>Visual timeline of all project activities and dependencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Interactive Gantt chart will be displayed here</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Timeline view with phases, milestones, and dependencies
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Generate Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Project Status Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <PieChart className="h-4 w-4 mr-2" />
                        Progress Dashboard
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Risk Assessment
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Activity className="h-4 w-4 mr-2" />
                        Resource Utilization
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No reports generated yet</p>{" "}
                        <p className="text-sm text-muted-foreground">No reports generated yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedProject && handleEditProject(selectedProject)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
