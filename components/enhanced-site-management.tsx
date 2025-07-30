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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  MapPin,
  Users,
  Network,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Download,
  Upload,
  Globe,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Star,
  StarOff,
  Layers,
  Flag,
  Target,
} from "lucide-react"

interface EnhancedSite {
  id: string
  name: string
  siteCode: string
  description: string
  status: "planning" | "in-progress" | "testing" | "completed" | "on-hold" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  phase: string
  region: string
  country: string
  city: string
  address: string
  timezone: string
  coordinates: { lat: number; lng: number }

  // Project Assignment
  projectId?: string
  projectName?: string

  // Timeline
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate?: string
  actualEndDate?: string

  // Progress & Health
  progress: number
  healthScore: number
  riskLevel: "low" | "medium" | "high" | "critical"

  // Team & Resources
  projectManager: string
  technicalOwner: string
  localContact: string
  stakeholders: string[]

  // Technical Details
  networkDetails: {
    totalUsers: number
    deviceCount: number
    networkSegments: string[]
    vlanCount: number
    switchCount: number
    apCount: number
    radiusServers: string[]
    adIntegration: boolean
    certificateAuth: boolean
    guestNetwork: boolean
    byodSupport: boolean
  }

  // Infrastructure
  infrastructure: {
    wiredVendors: string[]
    wirelessVendors: string[]
    deviceTypes: string[]
    operatingSystems: string[]
    applications: string[]
    complianceRequirements: string[]
  }

  // Deployment Configuration
  deploymentConfig: {
    rolloutStrategy: "big-bang" | "phased" | "pilot-first"
    pilotUserCount: number
    rolloutPhases: DeploymentPhase[]
    rollbackPlan: string
    testingPlan: string
    trainingPlan: string
  }

  // Success Criteria & KPIs
  successCriteria: SiteSuccessCriteria[]
  kpis: SiteKPI[]

  // Milestones & Tasks
  milestones: string[]
  tasks: SiteTask[]

  // Compliance & Security
  complianceFrameworks: string[]
  securityPolicies: string[]
  auditRequirements: string[]

  // Budget & Resources
  budget: number
  currency: string
  resourceAllocation: ResourceAllocation[]

  // Communication & Documentation
  communicationPlan: string
  documentationLinks: string[]
  notes: string
  tags: string[]

  // Metadata
  isStarred: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

interface DeploymentPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  userCount: number
  departments: string[]
  successCriteria: string[]
  rollbackTriggers: string[]
}

interface SiteSuccessCriteria {
  id: string
  category: "technical" | "business" | "operational" | "user-experience"
  description: string
  metric: string
  target: string
  current: string
  status: "not-started" | "in-progress" | "achieved" | "at-risk"
  dueDate: string
  owner: string
}

interface SiteKPI {
  id: string
  name: string
  description: string
  category: "performance" | "security" | "availability" | "user-satisfaction"
  currentValue: number
  targetValue: number
  unit: string
  trend: "up" | "down" | "stable"
  lastUpdated: string
}

interface SiteTask {
  id: string
  title: string
  description: string
  category: "planning" | "implementation" | "testing" | "documentation" | "training"
  status: "todo" | "in-progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  dueDate: string
  completedDate?: string
  dependencies: string[]
  estimatedHours: number
  actualHours?: number
}

interface ResourceAllocation {
  id: string
  type: "personnel" | "hardware" | "software" | "services"
  name: string
  quantity: number
  cost: number
  startDate: string
  endDate: string
  vendor?: string
  notes?: string
}

const mockEnhancedSites: EnhancedSite[] = [
  {
    id: "1",
    name: "New York Headquarters",
    siteCode: "NYC-HQ-001",
    description: "Main corporate headquarters with 500+ employees and critical infrastructure",
    status: "in-progress",
    priority: "critical",
    phase: "Phase 2: Implementation",
    region: "North America",
    country: "United States",
    city: "New York",
    address: "123 Corporate Plaza, New York, NY 10001",
    timezone: "America/New_York",
    coordinates: { lat: 40.7128, lng: -74.006 },

    projectId: "1",
    projectName: "Global NAC Deployment 2024",

    plannedStartDate: "2024-01-15",
    plannedEndDate: "2024-03-30",
    actualStartDate: "2024-01-18",

    progress: 65,
    healthScore: 85,
    riskLevel: "medium",

    projectManager: "Sarah Johnson",
    technicalOwner: "Mike Chen",
    localContact: "John Smith",
    stakeholders: ["Lisa Wang", "David Brown", "Emma Wilson"],

    networkDetails: {
      totalUsers: 520,
      deviceCount: 1200,
      networkSegments: ["Corporate", "Guest", "IoT", "Management"],
      vlanCount: 15,
      switchCount: 24,
      apCount: 45,
      radiusServers: ["radius1.corp.com", "radius2.corp.com"],
      adIntegration: true,
      certificateAuth: true,
      guestNetwork: true,
      byodSupport: true,
    },

    infrastructure: {
      wiredVendors: ["Cisco", "Juniper"],
      wirelessVendors: ["Aruba", "Cisco"],
      deviceTypes: ["Laptops", "Desktops", "Mobile Devices", "Printers", "IoT Sensors"],
      operatingSystems: ["Windows 10/11", "macOS", "iOS", "Android", "Linux"],
      applications: ["Office 365", "Salesforce", "SAP", "Custom Apps"],
      complianceRequirements: ["SOX", "PCI-DSS", "NIST"],
    },

    deploymentConfig: {
      rolloutStrategy: "phased",
      pilotUserCount: 50,
      rolloutPhases: [
        {
          id: "1",
          name: "IT Department Pilot",
          description: "Initial rollout to IT department for testing",
          startDate: "2024-02-01",
          endDate: "2024-02-15",
          userCount: 25,
          departments: ["IT"],
          successCriteria: ["100% authentication success", "No network disruption"],
          rollbackTriggers: ["Authentication failure > 5%", "Network downtime > 1 hour"],
        },
        {
          id: "2",
          name: "Executive Floor",
          description: "Rollout to executive and management floors",
          startDate: "2024-02-16",
          endDate: "2024-03-01",
          userCount: 75,
          departments: ["Executive", "Management"],
          successCriteria: ["Seamless user experience", "Zero security incidents"],
          rollbackTriggers: ["User complaints > 10%", "Security policy violations"],
        },
      ],
      rollbackPlan: "Automated rollback to legacy authentication within 30 minutes",
      testingPlan: "Comprehensive testing including load, security, and user acceptance",
      trainingPlan: "Multi-phase training program with hands-on sessions",
    },

    successCriteria: [
      {
        id: "1",
        category: "technical",
        description: "Achieve 99.9% authentication success rate",
        metric: "Authentication Success Rate",
        target: "99.9%",
        current: "98.5%",
        status: "in-progress",
        dueDate: "2024-03-15",
        owner: "Mike Chen",
      },
      {
        id: "2",
        category: "business",
        description: "Zero business disruption during rollout",
        metric: "Business Continuity",
        target: "0 incidents",
        current: "1 minor incident",
        status: "at-risk",
        dueDate: "2024-03-30",
        owner: "Sarah Johnson",
      },
    ],

    kpis: [
      {
        id: "1",
        name: "Network Availability",
        description: "Overall network uptime percentage",
        category: "availability",
        currentValue: 99.8,
        targetValue: 99.9,
        unit: "%",
        trend: "up",
        lastUpdated: "2024-01-20",
      },
      {
        id: "2",
        name: "Authentication Response Time",
        description: "Average time for user authentication",
        category: "performance",
        currentValue: 1.2,
        targetValue: 1.0,
        unit: "seconds",
        trend: "down",
        lastUpdated: "2024-01-20",
      },
    ],

    milestones: ["1", "2", "3"],
    tasks: [
      {
        id: "1",
        title: "Configure RADIUS Integration",
        description: "Set up and configure RADIUS server integration with Active Directory",
        category: "implementation",
        status: "completed",
        priority: "high",
        assignedTo: "Mike Chen",
        dueDate: "2024-01-25",
        completedDate: "2024-01-24",
        dependencies: [],
        estimatedHours: 16,
        actualHours: 14,
      },
      {
        id: "2",
        title: "Deploy Pilot Group",
        description: "Deploy NAC solution to pilot group of 25 IT users",
        category: "implementation",
        status: "in-progress",
        priority: "critical",
        assignedTo: "John Smith",
        dueDate: "2024-02-15",
        dependencies: ["1"],
        estimatedHours: 24,
        actualHours: 18,
      },
    ],

    complianceFrameworks: ["SOX", "PCI-DSS", "NIST"],
    securityPolicies: ["Corporate Security Policy", "Network Access Policy", "BYOD Policy"],
    auditRequirements: ["Quarterly security audit", "Annual compliance review"],

    budget: 150000,
    currency: "USD",
    resourceAllocation: [
      {
        id: "1",
        type: "personnel",
        name: "Network Engineer",
        quantity: 2,
        cost: 80000,
        startDate: "2024-01-15",
        endDate: "2024-03-30",
        notes: "Full-time dedicated resources",
      },
      {
        id: "2",
        type: "hardware",
        name: "Network Switches",
        quantity: 4,
        cost: 25000,
        startDate: "2024-02-01",
        endDate: "2024-02-15",
        vendor: "Cisco",
        notes: "Catalyst 9300 series",
      },
    ],

    communicationPlan: "Weekly status updates to stakeholders, daily standups with technical team",
    documentationLinks: ["https://docs.company.com/nac-deployment", "https://wiki.company.com/network-architecture"],
    notes: "High-priority site due to regulatory requirements and business criticality",
    tags: ["headquarters", "critical", "sox-compliance", "high-priority"],

    isStarred: true,
    createdAt: "2023-12-15",
    updatedAt: "2024-01-20",
    createdBy: "Sarah Johnson",
    lastModifiedBy: "Mike Chen",
  },
  // Add more mock sites as needed...
]

export function EnhancedSiteManagement() {
  const [sites, setSites] = useState<EnhancedSite[]>(mockEnhancedSites)
  const [filteredSites, setFilteredSites] = useState<EnhancedSite[]>(mockEnhancedSites)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table" | "map" | "kanban">("grid")
  const [selectedSite, setSelectedSite] = useState<EnhancedSite | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // New site form state
  const [newSite, setNewSite] = useState<Partial<EnhancedSite>>({
    name: "",
    siteCode: "",
    description: "",
    status: "planning",
    priority: "medium",
    phase: "Phase 1: Planning",
    region: "",
    country: "",
    city: "",
    address: "",
    timezone: "UTC",
    plannedStartDate: "",
    plannedEndDate: "",
    projectManager: "",
    technicalOwner: "",
    localContact: "",
    budget: 0,
    currency: "USD",
    tags: [],
    isStarred: false,
  })

  useEffect(() => {
    let filtered = sites

    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.siteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
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
  }, [sites, searchTerm, statusFilter, priorityFilter, regionFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "in-progress":
        return <Activity className="h-4 w-4 text-green-600" />
      case "testing":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "on-hold":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      planning: "secondary",
      "in-progress": "default",
      testing: "outline",
      completed: "default",
      "on-hold": "outline",
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

  const handleCreateSite = () => {
    const site: EnhancedSite = {
      ...newSite,
      id: Date.now().toString(),
      coordinates: { lat: 0, lng: 0 },
      progress: 0,
      healthScore: 100,
      riskLevel: "low",
      stakeholders: [],
      networkDetails: {
        totalUsers: 0,
        deviceCount: 0,
        networkSegments: [],
        vlanCount: 0,
        switchCount: 0,
        apCount: 0,
        radiusServers: [],
        adIntegration: false,
        certificateAuth: false,
        guestNetwork: false,
        byodSupport: false,
      },
      infrastructure: {
        wiredVendors: [],
        wirelessVendors: [],
        deviceTypes: [],
        operatingSystems: [],
        applications: [],
        complianceRequirements: [],
      },
      deploymentConfig: {
        rolloutStrategy: "phased",
        pilotUserCount: 0,
        rolloutPhases: [],
        rollbackPlan: "",
        testingPlan: "",
        trainingPlan: "",
      },
      successCriteria: [],
      kpis: [],
      milestones: [],
      tasks: [],
      complianceFrameworks: [],
      securityPolicies: [],
      auditRequirements: [],
      resourceAllocation: [],
      communicationPlan: "",
      documentationLinks: [],
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      lastModifiedBy: "Current User",
    } as EnhancedSite

    setSites([...sites, site])
    setIsCreateDialogOpen(false)
    resetNewSiteForm()
  }

  const resetNewSiteForm = () => {
    setNewSite({
      name: "",
      siteCode: "",
      description: "",
      status: "planning",
      priority: "medium",
      phase: "Phase 1: Planning",
      region: "",
      country: "",
      city: "",
      address: "",
      timezone: "UTC",
      plannedStartDate: "",
      plannedEndDate: "",
      projectManager: "",
      technicalOwner: "",
      localContact: "",
      budget: 0,
      currency: "USD",
      tags: [],
      isStarred: false,
    })
  }

  const handleEditSite = (site: EnhancedSite) => {
    setSelectedSite(site)
    setNewSite(site)
    setIsEditDialogOpen(true)
  }

  const handleUpdateSite = () => {
    if (selectedSite) {
      const updatedSites = sites.map((s) =>
        s.id === selectedSite.id ? { ...newSite, id: selectedSite.id, updatedAt: new Date().toISOString() } : s,
      )
      setSites(updatedSites as EnhancedSite[])
      setIsEditDialogOpen(false)
      setSelectedSite(null)
    }
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter((s) => s.id !== siteId))
  }

  const handleToggleStar = (siteId: string) => {
    setSites(sites.map((s) => (s.id === siteId ? { ...s, isStarred: !s.isStarred } : s)))
  }

  const handleViewDetails = (site: EnhancedSite) => {
    setSelectedSite(site)
    setIsDetailDialogOpen(true)
  }

  const renderSiteCard = (site: EnhancedSite) => (
    <Card key={site.id} className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(site.status)}
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{site.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStar(site.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {site.isStarred ? (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="outline" className="text-xs">
                {site.siteCode}
              </Badge>
              <MapPin className="h-3 w-3" />
              <span>
                {site.city}, {site.country}
              </span>
            </div>
            <CardDescription className="line-clamp-2">{site.description}</CardDescription>
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
              <DropdownMenuItem onClick={() => handleViewDetails(site)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditSite(site)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Site
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
              <DropdownMenuItem onClick={() => handleDeleteSite(site.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(site.status)}
          {getPriorityBadge(site.priority)}
          {getRiskBadge(site.riskLevel)}
          {site.projectName && (
            <Badge variant="outline" className="text-xs">
              {site.projectName}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{site.progress}%</span>
          </div>
          <Progress value={site.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Users:</span>
            </div>
            <div className="font-medium">{site.networkDetails.totalUsers}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Devices:</span>
            </div>
            <div className="font-medium">{site.networkDetails.deviceCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Start Date</span>
            <div className="font-medium">{new Date(site.plannedStartDate).toLocaleDateString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">End Date</span>
            <div className="font-medium">{new Date(site.plannedEndDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Health: {site.healthScore}/100</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {site.currency} {site.budget.toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(site)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleEditSite(site)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSiteForm = (isEdit = false) => (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={newSite.name}
                onChange={(e) => setNewSite((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteCode">Site Code *</Label>
              <Input
                id="siteCode"
                value={newSite.siteCode}
                onChange={(e) => setNewSite((prev) => ({ ...prev, siteCode: e.target.value }))}
                placeholder="e.g., NYC-HQ-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newSite.description}
              onChange={(e) => setNewSite((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the site and its purpose"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newSite.status}
                onValueChange={(value) => setNewSite((prev) => ({ ...prev, status: value as EnhancedSite["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newSite.priority}
                onValueChange={(value) =>
                  setNewSite((prev) => ({ ...prev, priority: value as EnhancedSite["priority"] }))
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
                value={newSite.phase}
                onChange={(e) => setNewSite((prev) => ({ ...prev, phase: e.target.value }))}
                placeholder="e.g., Phase 1: Planning"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedStartDate">Planned Start Date</Label>
              <Input
                id="plannedStartDate"
                type="date"
                value={newSite.plannedStartDate}
                onChange={(e) => setNewSite((prev) => ({ ...prev, plannedStartDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEndDate">Planned End Date</Label>
              <Input
                id="plannedEndDate"
                type="date"
                value={newSite.plannedEndDate}
                onChange={(e) => setNewSite((prev) => ({ ...prev, plannedEndDate: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={newSite.region}
                onValueChange={(value) => setNewSite((prev) => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Latin America">Latin America</SelectItem>
                  <SelectItem value="Middle East & Africa">Middle East & Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={newSite.country}
                onChange={(e) => setNewSite((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={newSite.city}
                onChange={(e) => setNewSite((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={newSite.timezone}
                onValueChange={(value) => setNewSite((prev) => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">GMT</SelectItem>
                  <SelectItem value="Europe/Paris">CET</SelectItem>
                  <SelectItem value="Asia/Tokyo">JST</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={newSite.address}
              onChange={(e) => setNewSite((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Enter full address"
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Users</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setNewSite((prev) => ({
                    ...prev,
                    networkDetails: {
                      ...prev.networkDetails,
                      totalUsers: Number(e.target.value),
                    } as any,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Device Count</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setNewSite((prev) => ({
                    ...prev,
                    networkDetails: {
                      ...prev.networkDetails,
                      deviceCount: Number(e.target.value),
                    } as any,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>VLAN Count</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setNewSite((prev) => ({
                    ...prev,
                    networkDetails: {
                      ...prev.networkDetails,
                      vlanCount: Number(e.target.value),
                    } as any,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Switch Count</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setNewSite((prev) => ({
                    ...prev,
                    networkDetails: {
                      ...prev.networkDetails,
                      switchCount: Number(e.target.value),
                    } as any,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Access Point Count</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setNewSite((prev) => ({
                    ...prev,
                    networkDetails: {
                      ...prev.networkDetails,
                      apCount: Number(e.target.value),
                    } as any,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Network Features</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="adIntegration" />
                <Label htmlFor="adIntegration">Active Directory Integration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="certificateAuth" />
                <Label htmlFor="certificateAuth">Certificate Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="guestNetwork" />
                <Label htmlFor="guestNetwork">Guest Network</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="byodSupport" />
                <Label htmlFor="byodSupport">BYOD Support</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Network Segments</Label>
            <Input
              placeholder="Enter network segments separated by commas"
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  networkDetails: {
                    ...prev.networkDetails,
                    networkSegments: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  } as any,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pilot User Count</Label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  deploymentConfig: {
                    ...prev.deploymentConfig,
                    pilotUserCount: Number(e.target.value),
                  } as any,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Rollback Plan</Label>
            <Textarea
              placeholder="Describe the rollback strategy and procedures"
              rows={3}
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  deploymentConfig: {
                    ...prev.deploymentConfig,
                    rollbackPlan: e.target.value,
                  } as any,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Testing Plan</Label>
            <Textarea
              placeholder="Outline testing procedures and acceptance criteria"
              rows={3}
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  deploymentConfig: {
                    ...prev.deploymentConfig,
                    testingPlan: e.target.value,
                  } as any,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Training Plan</Label>
            <Textarea
              placeholder="Describe training requirements and delivery method"
              rows={3}
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  deploymentConfig: {
                    ...prev.deploymentConfig,
                    trainingPlan: e.target.value,
                  } as any,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager *</Label>
              <Input
                id="projectManager"
                value={newSite.projectManager}
                onChange={(e) => setNewSite((prev) => ({ ...prev, projectManager: e.target.value }))}
                placeholder="Enter project manager name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technicalOwner">Technical Owner</Label>
              <Input
                id="technicalOwner"
                value={newSite.technicalOwner}
                onChange={(e) => setNewSite((prev) => ({ ...prev, technicalOwner: e.target.value }))}
                placeholder="Enter technical owner name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localContact">Local Contact</Label>
              <Input
                id="localContact"
                value={newSite.localContact}
                onChange={(e) => setNewSite((prev) => ({ ...prev, localContact: e.target.value }))}
                placeholder="Enter local contact name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="flex gap-2">
                <Select
                  value={newSite.currency}
                  onValueChange={(value) => setNewSite((prev) => ({ ...prev, currency: value }))}
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
                  value={newSite.budget}
                  onChange={(e) => setNewSite((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                  placeholder="0"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Communication Plan</Label>
              <Input
                placeholder="e.g., Weekly updates, Daily standups"
                value={newSite.communicationPlan}
                onChange={(e) => setNewSite((prev) => ({ ...prev, communicationPlan: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Resource Allocation</Label>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Resource allocation details will be configured here. Add personnel, hardware, software, and services.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label>Compliance Frameworks</Label>
            <div className="grid grid-cols-3 gap-4">
              {["SOX", "HIPAA", "PCI-DSS", "GDPR", "ISO27001", "NIST"].map((framework) => (
                <div key={framework} className="flex items-center space-x-2">
                  <Checkbox id={framework} />
                  <Label htmlFor={framework}>{framework}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Infrastructure Vendors</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Wired Vendors</Label>
                <Input placeholder="e.g., Cisco, Juniper" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Wireless Vendors</Label>
                <Input placeholder="e.g., Aruba, Cisco" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Enter tags separated by commas"
              value={newSite.tags?.join(", ")}
              onChange={(e) =>
                setNewSite((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={newSite.notes}
              onChange={(e) => setNewSite((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes and comments"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="starred"
              checked={newSite.isStarred}
              onCheckedChange={(checked) => setNewSite((prev) => ({ ...prev, isStarred: checked }))}
            />
            <Label htmlFor="starred">Mark as starred site</Label>
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
          <h2 className="text-3xl font-bold tracking-tight">Enhanced Site Management</h2>
          <p className="text-muted-foreground">
            Comprehensive site management with detailed configuration and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Sites
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Building2 className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Site</DialogTitle>
                <DialogDescription>
                  Create a new site with comprehensive configuration and deployment planning
                </DialogDescription>
              </DialogHeader>
              {renderSiteForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSite}>Create Site</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            status: "in-progress",
            label: "Active",
            count: filteredSites.filter((s) => s.status === "in-progress").length,
            color: "text-green-600",
            icon: Activity,
          },
          {
            status: "planning",
            label: "Planning",
            count: filteredSites.filter((s) => s.status === "planning").length,
            color: "text-blue-600",
            icon: Clock,
          },
          {
            status: "completed",
            label: "Completed",
            count: filteredSites.filter((s) => s.status === "completed").length,
            color: "text-emerald-600",
            icon: CheckCircle,
          },
          {
            status: "testing",
            label: "Testing",
            count: filteredSites.filter((s) => s.status === "testing").length,
            color: "text-purple-600",
            icon: Target,
          },
          {
            status: "high-risk",
            label: "High Risk",
            count: filteredSites.filter((s) => s.riskLevel === "high" || s.riskLevel === "critical").length,
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
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
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
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Latin America">Latin America</SelectItem>
                  <SelectItem value="Middle East & Africa">Middle East & Africa</SelectItem>
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
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredSites.map(renderSiteCard)}</div>
      )}

      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>PM</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {site.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground">{site.siteCode}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {site.city}, {site.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(site.status)}</TableCell>
                    <TableCell>{getPriorityBadge(site.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={site.progress} className="w-16 h-2" />
                        <span className="text-sm">{site.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.networkDetails.totalUsers}</TableCell>
                    <TableCell className="text-sm">{site.projectManager}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(site)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditSite(site)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteSite(site.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === "map" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Global Site Map
            </CardTitle>
            <CardDescription>Interactive map view of all deployment sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive world map will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Sites will be plotted based on their coordinates with status indicators
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredSites.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No sites found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || regionFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by adding your first deployment site."}
            </p>
            {!searchTerm && statusFilter === "all" && priorityFilter === "all" && regionFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                Add Your First Site
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Site Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
            <DialogDescription>Update site details and configuration</DialogDescription>
          </DialogHeader>
          {renderSiteForm(true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSite}>Update Site</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSite && getStatusIcon(selectedSite.status)}
              {selectedSite?.name}
              {selectedSite?.isStarred && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
            </DialogTitle>
            <DialogDescription>
              {selectedSite?.siteCode} • {selectedSite?.city}, {selectedSite?.country}
            </DialogDescription>
          </DialogHeader>
          {selectedSite && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="deployment">Deployment</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="kpis">KPIs</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Site Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Progress</span>
                        <span className="font-medium">{selectedSite.progress}%</span>
                      </div>
                      <Progress value={selectedSite.progress} className="h-2" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health Score</span>
                          <span className="font-medium">{selectedSite.healthScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Level</span>
                          {getRiskBadge(selectedSite.riskLevel)}
                        </div>
                        <div className="flex justify-between">
                          <span>Priority</span>
                          {getPriorityBadge(selectedSite.priority)}
                        </div>
                        <div className="flex justify-between">
                          <span>Phase</span>
                          <Badge variant="outline">{selectedSite.phase}</Badge>
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
                        <span className="text-muted-foreground">Planned Start</span>
                        <span>{new Date(selectedSite.plannedStartDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planned End</span>
                        <span>{new Date(selectedSite.plannedEndDate).toLocaleDateString()}</span>
                      </div>
                      {selectedSite.actualStartDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actual Start</span>
                          <span>{new Date(selectedSite.actualStartDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>
                          {Math.ceil(
                            (new Date(selectedSite.plannedEndDate).getTime() -
                              new Date(selectedSite.plannedStartDate).getTime()) /
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
                          {selectedSite.currency} {selectedSite.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Users</span>
                        <span>{selectedSite.networkDetails.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Devices</span>
                        <span>{selectedSite.networkDetails.deviceCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VLANs</span>
                        <span>{selectedSite.networkDetails.vlanCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Team & Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium">Project Manager</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSite.projectManager}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Technical Owner</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSite.technicalOwner}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Local Contact</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSite.localContact}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Stakeholders</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSite.stakeholders.map((stakeholder, index) => (
                          <Badge key={index} variant="outline">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Location Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region</span>
                        <span>{selectedSite.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country</span>
                        <span>{selectedSite.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City</span>
                        <span>{selectedSite.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timezone</span>
                        <span>{selectedSite.timezone}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Address</span>
                        <p className="text-sm">{selectedSite.address}</p>
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
                          {selectedSite.complianceFrameworks.map((framework, index) => (
                            <Badge key={index} variant="secondary">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedSite.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedSite.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedSite.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Network Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Users</span>
                          <span className="font-medium">{selectedSite.networkDetails.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Device Count</span>
                          <span className="font-medium">{selectedSite.networkDetails.deviceCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">VLANs</span>
                          <span className="font-medium">{selectedSite.networkDetails.vlanCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Switches</span>
                          <span className="font-medium">{selectedSite.networkDetails.switchCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Access Points</span>
                          <span className="font-medium">{selectedSite.networkDetails.apCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Network Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Directory Integration</span>
                        <Badge variant={selectedSite.networkDetails.adIntegration ? "default" : "outline"}>
                          {selectedSite.networkDetails.adIntegration ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Certificate Authentication</span>
                        <Badge variant={selectedSite.networkDetails.certificateAuth ? "default" : "outline"}>
                          {selectedSite.networkDetails.certificateAuth ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Guest Network</span>
                        <Badge variant={selectedSite.networkDetails.guestNetwork ? "default" : "outline"}>
                          {selectedSite.networkDetails.guestNetwork ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">BYOD Support</span>
                        <Badge variant={selectedSite.networkDetails.byodSupport ? "default" : "outline"}>
                          {selectedSite.networkDetails.byodSupport ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Network Segments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSite.networkDetails.networkSegments.map((segment, index) => (
                        <Badge key={index} variant="outline">
                          {segment}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Infrastructure Vendors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Wired Vendors</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSite.infrastructure.wiredVendors.map((vendor, index) => (
                          <Badge key={index} variant="secondary">
                            {vendor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Wireless Vendors</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSite.infrastructure.wirelessVendors.map((vendor, index) => (
                          <Badge key={index} variant="secondary">
                            {vendor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Rollout Strategy</Label>
                        <Badge variant="outline" className="mt-1">
                          {selectedSite.deploymentConfig.rolloutStrategy
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Pilot User Count</Label>
                        <div className="mt-1 font-medium">{selectedSite.deploymentConfig.pilotUserCount}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Rollback Plan</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSite.deploymentConfig.rollbackPlan}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Testing Plan</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSite.deploymentConfig.testingPlan}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Training Plan</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSite.deploymentConfig.trainingPlan}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rollout Phases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedSite.deploymentConfig.rolloutPhases.map((phase, index) => (
                        <Card key={phase.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{phase.name}</h4>
                              <Badge variant="outline">{phase.userCount} users</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>
                                <span className="ml-2">{new Date(phase.startDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">End Date:</span>
                                <span className="ml-2">{new Date(phase.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Label className="text-xs font-medium">Departments</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {phase.departments.map((dept, deptIndex) => (
                                  <Badge key={deptIndex} variant="outline" className="text-xs">
                                    {dept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Site Tasks</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedSite.tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge
                                variant={
                                  task.status === "completed"
                                    ? "default"
                                    : task.status === "in-progress"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {task.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Badge>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Assigned to:</span>
                                <span className="ml-2">{task.assignedTo}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Due Date:</span>
                                <span className="ml-2">{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Hours:</span>
                                <span className="ml-2">
                                  {task.actualHours || 0}/{task.estimatedHours}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Site Milestones</h3>
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
                        Monitor and manage all site-specific milestones and deliverables
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kpis" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Key Performance Indicators</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add KPI
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSite.kpis.map((kpi) => (
                    <Card key={kpi.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{kpi.name}</h4>
                            <p className="text-sm text-muted-foreground">{kpi.description}</p>
                          </div>
                          <Badge variant="outline">{kpi.category}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current</span>
                            <span className="font-medium">
                              {kpi.currentValue} {kpi.unit}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Target</span>
                            <span className="font-medium">
                              {kpi.targetValue} {kpi.unit}
                            </span>
                          </div>
                          <Progress value={(kpi.currentValue / kpi.targetValue) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Trend: {kpi.trend}</span>
                            <span>Updated: {new Date(kpi.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Resource Allocation</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedSite.resourceAllocation.map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{resource.name}</h4>
                              <Badge variant="outline">{resource.type}</Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Quantity:</span>
                                <span className="ml-2">{resource.quantity}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cost:</span>
                                <span className="ml-2">
                                  {selectedSite.currency} {resource.cost.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Start:</span>
                                <span className="ml-2">{new Date(resource.startDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">End:</span>
                                <span className="ml-2">{new Date(resource.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {resource.vendor && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Vendor:</span>
                                <span className="ml-2">{resource.vendor}</span>
                              </div>
                            )}
                            {resource.notes && <p className="text-sm text-muted-foreground mt-2">{resource.notes}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                        Site Status Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <PieChart className="h-4 w-4 mr-2" />
                        Network Analysis
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Progress Report
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
            <Button onClick={() => selectedSite && handleEditSite(selectedSite)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
