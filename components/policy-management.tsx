"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { storage } from "@/lib/storage"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Lock,
  Globe,
  Smartphone,
  Database,
} from "lucide-react"

interface Policy {
  id: string
  name: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "active" | "inactive" | "draft"
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  createdAt: string
  updatedAt: string
  appliedTo: string[]
  effectiveness: number
  violations: number
  lastTriggered?: string
  tags: string[]
}

interface PolicyCondition {
  id: string
  type: "device_type" | "user_group" | "location" | "time" | "risk_score" | "compliance_status"
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in_range"
  value: string | number | string[]
  description: string
}

interface PolicyAction {
  id: string
  type: "allow" | "deny" | "quarantine" | "redirect" | "notify" | "log" | "require_mfa"
  parameters: Record<string, any>
  description: string
}

const policyCategories = [
  { value: "access_control", label: "Access Control", icon: Lock },
  { value: "device_management", label: "Device Management", icon: Smartphone },
  { value: "network_security", label: "Network Security", icon: Shield },
  { value: "compliance", label: "Compliance", icon: CheckCircle },
  { value: "guest_access", label: "Guest Access", icon: Users },
  { value: "iot_security", label: "IoT Security", icon: Activity },
  { value: "remote_access", label: "Remote Access", icon: Globe },
  { value: "data_protection", label: "Data Protection", icon: Database },
]

const conditionTypes = [
  { value: "device_type", label: "Device Type", description: "Match based on device operating system or type" },
  { value: "user_group", label: "User Group", description: "Match based on user group membership" },
  { value: "location", label: "Location", description: "Match based on network location or site" },
  { value: "time", label: "Time", description: "Match based on time of day or day of week" },
  { value: "risk_score", label: "Risk Score", description: "Match based on calculated risk score" },
  { value: "compliance_status", label: "Compliance Status", description: "Match based on device compliance" },
]

const actionTypes = [
  { value: "allow", label: "Allow Access", description: "Grant network access", color: "bg-green-100 text-green-800" },
  { value: "deny", label: "Deny Access", description: "Block network access", color: "bg-red-100 text-red-800" },
  {
    value: "quarantine",
    label: "Quarantine",
    description: "Isolate device to remediation network",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "redirect",
    label: "Redirect",
    description: "Redirect to captive portal",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "notify",
    label: "Send Notification",
    description: "Send alert to administrators",
    color: "bg-purple-100 text-purple-800",
  },
  { value: "log", label: "Log Event", description: "Create audit log entry", color: "bg-gray-100 text-gray-800" },
  {
    value: "require_mfa",
    label: "Require MFA",
    description: "Require multi-factor authentication",
    color: "bg-orange-100 text-orange-800",
  },
]

const policyTemplates = [
  {
    id: "byod-basic",
    name: "BYOD Basic Access",
    description: "Basic policy for personal devices with limited network access",
    category: "device_management",
    conditions: [
      { type: "device_type", operator: "equals", value: "personal", description: "Personal device" },
      { type: "compliance_status", operator: "equals", value: "compliant", description: "Device is compliant" },
    ],
    actions: [
      { type: "allow", parameters: { network: "guest" }, description: "Allow guest network access" },
      { type: "log", parameters: { level: "info" }, description: "Log access event" },
    ],
  },
  {
    id: "high-risk-quarantine",
    name: "High Risk Device Quarantine",
    description: "Quarantine devices with high risk scores",
    category: "network_security",
    conditions: [{ type: "risk_score", operator: "greater_than", value: 80, description: "High risk score" }],
    actions: [
      { type: "quarantine", parameters: { vlan: "quarantine" }, description: "Move to quarantine VLAN" },
      { type: "notify", parameters: { recipients: ["security@company.com"] }, description: "Notify security team" },
    ],
  },
  {
    id: "guest-wifi",
    name: "Guest WiFi Access",
    description: "Standard guest access policy with time limits",
    category: "guest_access",
    conditions: [
      { type: "user_group", operator: "equals", value: "guests", description: "Guest user" },
      { type: "time", operator: "in_range", value: ["08:00", "18:00"], description: "Business hours only" },
    ],
    actions: [
      {
        type: "allow",
        parameters: { network: "guest", duration: "8h" },
        description: "Allow guest access for 8 hours",
      },
      { type: "redirect", parameters: { url: "https://portal.company.com/terms" }, description: "Show terms of use" },
    ],
  },
  {
    id: "iot-segmentation",
    name: "IoT Device Segmentation",
    description: "Isolate IoT devices to dedicated network segment",
    category: "iot_security",
    conditions: [{ type: "device_type", operator: "equals", value: "iot", description: "IoT device" }],
    actions: [
      { type: "allow", parameters: { network: "iot_vlan" }, description: "Allow IoT VLAN access" },
      { type: "deny", parameters: { networks: ["corporate", "guest"] }, description: "Block other networks" },
    ],
  },
]

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("policies")

  // Form state for creating/editing policies
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "medium" as const,
    status: "draft" as const,
    conditions: [] as PolicyCondition[],
    actions: [] as PolicyAction[],
    tags: [] as string[],
  })

  useEffect(() => {
    loadPolicies()
  }, [])

  useEffect(() => {
    filterPolicies()
  }, [policies, searchTerm, filterCategory, filterStatus])

  const loadPolicies = async () => {
    try {
      const savedPolicies = await storage.getGlobalPolicies()
      setPolicies(savedPolicies || [])
    } catch (error) {
      console.error("Error loading policies:", error)
      toast({
        title: "Error",
        description: "Failed to load policies",
        variant: "destructive",
      })
    }
  }

  const savePolicies = async (updatedPolicies: Policy[]) => {
    try {
      await storage.saveGlobalPolicies(updatedPolicies)
      setPolicies(updatedPolicies)
      toast({
        title: "Success",
        description: "Policies saved successfully",
      })
    } catch (error) {
      console.error("Error saving policies:", error)
      toast({
        title: "Error",
        description: "Failed to save policies",
        variant: "destructive",
      })
    }
  }

  const filterPolicies = () => {
    let filtered = policies

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((policy) => policy.category === filterCategory)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((policy) => policy.status === filterStatus)
    }

    setFilteredPolicies(filtered)
  }

  const createPolicy = async () => {
    const newPolicy: Policy = {
      id: `policy-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appliedTo: [],
      effectiveness: Math.floor(Math.random() * 100),
      violations: Math.floor(Math.random() * 10),
    }

    const updatedPolicies = [...policies, newPolicy]
    await savePolicies(updatedPolicies)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const updatePolicy = async () => {
    if (!selectedPolicy) return

    const updatedPolicy: Policy = {
      ...selectedPolicy,
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    const updatedPolicies = policies.map((p) => (p.id === selectedPolicy.id ? updatedPolicy : p))
    await savePolicies(updatedPolicies)
    setIsEditDialogOpen(false)
    setSelectedPolicy(null)
    resetForm()
  }

  const deletePolicy = async (policyId: string) => {
    const updatedPolicies = policies.filter((p) => p.id !== policyId)
    await savePolicies(updatedPolicies)
  }

  const togglePolicyStatus = async (policyId: string) => {
    const updatedPolicies = policies.map((p) =>
      p.id === policyId ? { ...p, status: p.status === "active" ? ("inactive" as const) : ("active" as const) } : p,
    )
    await savePolicies(updatedPolicies)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      priority: "medium",
      status: "draft",
      conditions: [],
      actions: [],
      tags: [],
    })
  }

  const loadTemplate = (template: any) => {
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      priority: "medium",
      status: "draft",
      conditions: template.conditions.map((c: any, index: number) => ({
        id: `condition-${index}`,
        type: c.type,
        operator: c.operator,
        value: c.value,
        description: c.description,
      })),
      actions: template.actions.map((a: any, index: number) => ({
        id: `action-${index}`,
        type: a.type,
        parameters: a.parameters,
        description: a.description,
      })),
      tags: [],
    })
    setIsCreateDialogOpen(true)
  }

  const addCondition = () => {
    const newCondition: PolicyCondition = {
      id: `condition-${Date.now()}`,
      type: "device_type",
      operator: "equals",
      value: "",
      description: "",
    }
    setFormData({ ...formData, conditions: [...formData.conditions, newCondition] })
  }

  const updateCondition = (index: number, field: keyof PolicyCondition, value: any) => {
    const updatedConditions = formData.conditions.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    setFormData({ ...formData, conditions: updatedConditions })
  }

  const removeCondition = (index: number) => {
    const updatedConditions = formData.conditions.filter((_, i) => i !== index)
    setFormData({ ...formData, conditions: updatedConditions })
  }

  const addAction = () => {
    const newAction: PolicyAction = {
      id: `action-${Date.now()}`,
      type: "allow",
      parameters: {},
      description: "",
    }
    setFormData({ ...formData, actions: [...formData.actions, newAction] })
  }

  const updateAction = (index: number, field: keyof PolicyAction, value: any) => {
    const updatedActions = formData.actions.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    setFormData({ ...formData, actions: updatedActions })
  }

  const removeAction = (index: number) => {
    const updatedActions = formData.actions.filter((_, i) => i !== index)
    setFormData({ ...formData, actions: updatedActions })
  }

  const getPolicyStats = () => {
    const totalPolicies = policies.length
    const activePolicies = policies.filter((p) => p.status === "active").length
    const avgEffectiveness = policies.reduce((sum, p) => sum + p.effectiveness, 0) / totalPolicies || 0
    const totalViolations = policies.reduce((sum, p) => sum + p.violations, 0)

    return { totalPolicies, activePolicies, avgEffectiveness, totalViolations }
  }

  const stats = getPolicyStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Policy Management</h2>
          <p className="text-gray-600">Create, manage, and monitor network access control policies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
                <DialogDescription>Define conditions and actions for network access control</DialogDescription>
              </DialogHeader>
              <PolicyForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={createPolicy}
                onCancel={() => setIsCreateDialogOpen(false)}
                addCondition={addCondition}
                updateCondition={(index: number, field: string, value: any) => updateCondition(index, field as keyof PolicyCondition, value)}
                removeCondition={removeCondition}
                addAction={addAction}
                updateAction={(index: number, field: string, value: any) => updateAction(index, field as keyof PolicyAction, value)}
                removeAction={removeAction}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          {/* Policy Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Policies</p>
                    <p className="text-2xl font-bold">{stats.totalPolicies}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Policies</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activePolicies}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Effectiveness</p>
                    <p className="text-2xl font-bold">{Math.round(stats.avgEffectiveness)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Violations</p>
                    <p className="text-2xl font-bold text-red-600">{stats.totalViolations}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {policyCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Policies Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{policy.name}</div>
                          <div className="text-sm text-gray-500">{policy.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {policyCategories.find((c) => c.value === policy.category)?.label || policy.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            policy.priority === "critical"
                              ? "destructive"
                              : policy.priority === "high"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {policy.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
          <Switch
            checked={policy.status === "active"}
            onCheckedChange={() => togglePolicyStatus(policy.id)}
          />
                          <span className="text-sm">{policy.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={policy.effectiveness} className="w-16" />
                          <span className="text-sm">{policy.effectiveness}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={policy.violations > 5 ? "text-red-600 font-medium" : ""}>
                          {policy.violations}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPolicy(policy)
                              setFormData({
                                name: policy.name,
                                description: policy.description,
                                category: policy.category,
                                priority: policy.priority as any,
                                status: policy.status as any,
                                conditions: policy.conditions,
                                actions: policy.actions,
                                tags: policy.tags,
                              })
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deletePolicy(policy.id)}>
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PolicyAnalytics policies={policies} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policyTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    <Badge variant="outline">
                      {policyCategories.find((c) => c.value === template.category)?.label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Conditions ({template.conditions.length})</h4>
                      <div className="space-y-1">
                        {template.conditions.slice(0, 2).map((condition, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {condition.description}
                          </div>
                        ))}
                        {template.conditions.length > 2 && (
                          <div className="text-sm text-gray-500">+{template.conditions.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Actions ({template.actions.length})</h4>
                      <div className="space-y-1">
                        {template.actions.slice(0, 2).map((action, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {action.description}
                          </div>
                        ))}
                        {template.actions.length > 2 && (
                          <div className="text-sm text-gray-500">+{template.actions.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                    <Button onClick={() => loadTemplate(template)} className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Simulation</CardTitle>
              <CardDescription>Test policy behavior with simulated scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Simulation Coming Soon</h3>
                <p className="text-gray-600">
                  Advanced policy simulation and testing capabilities will be available in the next release.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>Modify policy conditions and actions</DialogDescription>
          </DialogHeader>
          <PolicyForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={updatePolicy}
            onCancel={() => setIsEditDialogOpen(false)}
            addCondition={addCondition}
          updateCondition={(index: number, field: string, value: any) => updateCondition(index, field as keyof PolicyCondition, value)}
          removeCondition={removeCondition}
          addAction={addAction}
          updateAction={(index: number, field: string, value: any) => updateAction(index, field as keyof PolicyAction, value)}
            removeAction={removeAction}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PolicyForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  addCondition,
  updateCondition,
  removeCondition,
  addAction,
  updateAction,
  removeAction,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
  addCondition: () => void
  updateCondition: (index: number, field: string, value: any) => void
  removeCondition: (index: number) => void
  addAction: () => void
  updateAction: (index: number, field: string, value: any) => void
  removeAction: (index: number) => void
}) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Policy Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter policy name"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {policyCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this policy does"
          rows={3}
        />
      </div>

      {/* Conditions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Conditions</h3>
          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
        <div className="space-y-4">
          {formData.conditions.map((condition: PolicyCondition, index: number) => (
            <Card key={condition.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Condition {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={condition.type} onValueChange={(value) => updateCondition(index, "type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Operator</Label>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, "operator", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="in_range">In Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={condition.value as string}
                      onChange={(e) => updateCondition(index, "value", e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Description</Label>
                  <Input
                    value={condition.description}
                    onChange={(e) => updateCondition(index, "description", e.target.value)}
                    placeholder="Describe this condition"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Actions</h3>
          <Button type="button" variant="outline" size="sm" onClick={addAction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>
        <div className="space-y-4">
          {formData.actions.map((action: PolicyAction, index: number) => (
            <Card key={action.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Action {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAction(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Action Type</Label>
                    <Select value={action.type} onValueChange={(value) => updateAction(index, "type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={action.description}
                      onChange={(e) => updateAction(index, "description", e.target.value)}
                      placeholder="Describe this action"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit}>
          Save Policy
        </Button>
      </div>
    </div>
  )
}

function PolicyAnalytics({ policies }: { policies: Policy[] }) {
  const categoryStats = policyCategories.map((category) => {
    const categoryPolicies = policies.filter((p) => p.category === category.value)
    return {
      ...category,
      count: categoryPolicies.length,
      effectiveness: categoryPolicies.reduce((sum, p) => sum + p.effectiveness, 0) / categoryPolicies.length || 0,
      violations: categoryPolicies.reduce((sum, p) => sum + p.violations, 0),
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.value}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{category.label}</h3>
                      <p className="text-sm text-gray-600">{category.count} policies</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Effectiveness</span>
                    <span className="font-medium">{Math.round(category.effectiveness)}%</span>
                  </div>
                  <Progress value={category.effectiveness} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Violations</span>
                    <span className={`font-medium ${category.violations > 10 ? "text-red-600" : "text-green-600"}`}>
                      {category.violations}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Effectiveness Trends</CardTitle>
          <CardDescription>Monitor policy performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard Coming Soon</h3>
            <p className="text-gray-600">
              Detailed analytics and reporting capabilities will be available in the next release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
