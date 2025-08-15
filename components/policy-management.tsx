"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { storage, type GlobalPolicy, type PolicyCondition, type PolicyAction, type Site } from "@/lib/storage"
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Settings,
  Zap,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Network,
  Globe,
  Lock,
  Router,
  Smartphone,
  Monitor,
} from "lucide-react"

interface PolicyDesignerProps {
  onClose?: () => void
}

export default function PolicyManagement({ onClose }: PolicyDesignerProps) {
  const [policies, setPolicies] = useState<GlobalPolicy[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<GlobalPolicy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<GlobalPolicy | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showSimulation, setShowSimulation] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Policy form state
  const [policyForm, setPolicyForm] = useState<Partial<GlobalPolicy>>({
    name: "",
    description: "",
    category: "authentication",
    type: "access",
    priority: 1,
    conditions: [],
    actions: [],
    enabled: true,
    applicableSites: [],
    tags: [],
    version: "1.0",
    approvedBy: "",
  })

  // Condition form state
  const [conditionForm, setConditionForm] = useState<Partial<PolicyCondition>>({
    type: "user_group",
    operator: "equals",
    value: "",
    description: "",
  })

  // Action form state
  const [actionForm, setActionForm] = useState<Partial<PolicyAction>>({
    type: "allow",
    parameters: {},
    description: "",
    priority: 1,
  })

  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [simulationResults, setSimulationResults] = useState<any>(null)

  const policyTypes = [
    {
      value: "access",
      label: "Access Control",
      icon: <Lock className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "vlan",
      label: "VLAN Assignment",
      icon: <Network className="h-4 w-4" />,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "qos",
      label: "Quality of Service",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "security", label: "Security", icon: <Shield className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
    {
      value: "compliance",
      label: "Compliance",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "bandwidth",
      label: "Bandwidth Control",
      icon: <RefreshCw className="h-4 w-4" />,
      color: "bg-orange-100 text-orange-800",
    },
    { value: "time", label: "Time-based", icon: <Clock className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-800" },
    {
      value: "location",
      label: "Location-based",
      icon: <Globe className="h-4 w-4" />,
      color: "bg-teal-100 text-teal-800",
    },
  ]

  const conditionTypes = [
    { value: "user_group", label: "User Group", description: "Based on Active Directory or LDAP groups" },
    { value: "device_type", label: "Device Type", description: "Windows, macOS, iOS, Android, IoT devices" },
    { value: "location", label: "Location", description: "Physical location, building, floor, or network segment" },
    { value: "time", label: "Time", description: "Time of day, day of week, or date range" },
    { value: "compliance", label: "Compliance Status", description: "Device compliance with corporate policies" },
    { value: "certificate", label: "Certificate", description: "Digital certificate presence and validity" },
    { value: "os_type", label: "Operating System", description: "Specific operating system versions" },
    { value: "device_health", label: "Device Health", description: "Antivirus, patches, and security posture" },
    { value: "ip_range", label: "IP Range", description: "Source IP address or subnet" },
    { value: "mac_address", label: "MAC Address", description: "Device hardware address" },
    { value: "ssid", label: "SSID", description: "Wireless network identifier" },
  ]

  const actionTypes = [
    { value: "allow", label: "Allow Access", description: "Grant network access", color: "text-green-600" },
    { value: "deny", label: "Deny Access", description: "Block network access", color: "text-red-600" },
    {
      value: "quarantine",
      label: "Quarantine",
      description: "Isolate to remediation network",
      color: "text-yellow-600",
    },
    { value: "redirect", label: "Redirect", description: "Redirect to captive portal", color: "text-blue-600" },
    { value: "notify", label: "Notify", description: "Send notification or alert", color: "text-purple-600" },
    {
      value: "vlan_assign",
      label: "VLAN Assignment",
      description: "Assign to specific VLAN",
      color: "text-indigo-600",
    },
    {
      value: "qos_apply",
      label: "Apply QoS",
      description: "Set quality of service parameters",
      color: "text-orange-600",
    },
    {
      value: "bandwidth_limit",
      label: "Bandwidth Limit",
      description: "Limit network bandwidth",
      color: "text-pink-600",
    },
    {
      value: "time_restrict",
      label: "Time Restriction",
      description: "Apply time-based restrictions",
      color: "text-gray-600",
    },
    { value: "log_only", label: "Log Only", description: "Log event without enforcement", color: "text-cyan-600" },
  ]

  const operators = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Not Contains" },
    { value: "in", label: "In List" },
    { value: "not_in", label: "Not In List" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "matches_regex", label: "Matches Regex" },
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPolicies()
  }, [policies, searchTerm, categoryFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [policiesData, sitesData] = await Promise.all([storage.getGlobalPolicies(), storage.getSites()])
      setPolicies(policiesData || [])
      setSites(sitesData || [])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load policy data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterPolicies = () => {
    let filtered = policies || []

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((policy) => policy.category === categoryFilter)
    }

    setFilteredPolicies(filtered)
  }

  const handleCreatePolicy = () => {
    setIsCreating(true)
    setSelectedPolicy(null)
    setPolicyForm({
      name: "",
      description: "",
      category: "authentication",
      type: "access",
      priority: 1,
      conditions: [],
      actions: [],
      enabled: true,
      applicableSites: [],
      tags: [],
      version: "1.0",
      approvedBy: "",
    })
  }

  const handleEditPolicy = (policy: GlobalPolicy) => {
    setIsCreating(false)
    setSelectedPolicy(policy)
    setPolicyForm(policy)
  }

  const handleSavePolicy = async () => {
    try {
      if (!policyForm.name || !policyForm.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (isCreating) {
        await storage.createGlobalPolicy({
          name: policyForm.name!,
          description: policyForm.description!,
          category: policyForm.category!,
          type: policyForm.type!,
          priority: policyForm.priority!,
          conditions: policyForm.conditions || [],
          actions: policyForm.actions || [],
          enabled: policyForm.enabled!,
          applicableSites: policyForm.applicableSites || [],
          tags: policyForm.tags || [],
          version: policyForm.version!,
          approvedBy: policyForm.approvedBy!,
        })
        toast({
          title: "Policy Created",
          description: `${policyForm.name} has been created successfully`,
        })
      } else if (selectedPolicy) {
        await storage.updateGlobalPolicy(selectedPolicy.id, policyForm)
        toast({
          title: "Policy Updated",
          description: `${policyForm.name} has been updated successfully`,
        })
      }

      setIsCreating(false)
      setSelectedPolicy(null)
      loadData()
    } catch (error) {
      console.error("Error saving policy:", error)
      toast({
        title: "Error",
        description: "Failed to save policy",
        variant: "destructive",
      })
    }
  }

  const handleDeletePolicy = async (policyId: string, policyName: string) => {
    if (window.confirm(`Are you sure you want to delete "${policyName}"?`)) {
      try {
        await storage.deleteGlobalPolicy(policyId)
        toast({
          title: "Policy Deleted",
          description: `${policyName} has been deleted successfully`,
        })
        loadData()
      } catch (error) {
        console.error("Error deleting policy:", error)
        toast({
          title: "Error",
          description: "Failed to delete policy",
          variant: "destructive",
        })
      }
    }
  }

  const handleDuplicatePolicy = async (policy: GlobalPolicy) => {
    try {
      await storage.createGlobalPolicy({
        ...policy,
        name: `${policy.name} (Copy)`,
        version: "1.0",
        approvedBy: "",
      })
      toast({
        title: "Policy Duplicated",
        description: `${policy.name} has been duplicated successfully`,
      })
      loadData()
    } catch (error) {
      console.error("Error duplicating policy:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate policy",
        variant: "destructive",
      })
    }
  }

  const addCondition = () => {
    if (!conditionForm.type || !conditionForm.operator || !conditionForm.value) {
      toast({
        title: "Validation Error",
        description: "Please fill in all condition fields",
        variant: "destructive",
      })
      return
    }

    const newCondition: PolicyCondition = {
      type: conditionForm.type!,
      operator: conditionForm.operator!,
      value: conditionForm.value!,
      description: conditionForm.description || "",
    }

    setPolicyForm({
      ...policyForm,
      conditions: [...(policyForm.conditions || []), newCondition],
    })

    setConditionForm({
      type: "user_group",
      operator: "equals",
      value: "",
      description: "",
    })
  }

  const removeCondition = (index: number) => {
    const updatedConditions = [...(policyForm.conditions || [])]
    updatedConditions.splice(index, 1)
    setPolicyForm({
      ...policyForm,
      conditions: updatedConditions,
    })
  }

  const addAction = () => {
    if (!actionForm.type || !actionForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all action fields",
        variant: "destructive",
      })
      return
    }

    const newAction: PolicyAction = {
      type: actionForm.type!,
      parameters: actionForm.parameters || {},
      description: actionForm.description!,
      priority: actionForm.priority!,
    }

    setPolicyForm({
      ...policyForm,
      actions: [...(policyForm.actions || []), newAction],
    })

    setActionForm({
      type: "allow",
      parameters: {},
      description: "",
      priority: 1,
    })
  }

  const removeAction = (index: number) => {
    const updatedActions = [...(policyForm.actions || [])]
    updatedActions.splice(index, 1)
    setPolicyForm({
      ...policyForm,
      actions: updatedActions,
    })
  }

  const simulatePolicy = async (policy: GlobalPolicy) => {
    setShowSimulation(true)

    // Simulate policy execution with sample devices
    const sampleDevices = [
      { type: "Windows", userGroup: "Employees", location: "Floor-1", compliant: true },
      { type: "iPhone", userGroup: "Executives", location: "Floor-40", compliant: true },
      { type: "Android", userGroup: "Contractors", location: "Floor-2", compliant: false },
      { type: "IoT", userGroup: "Devices", location: "Floor-1", compliant: true },
    ]

    const results = sampleDevices.map((device) => {
      const matchedConditions = policy.conditions.filter((condition) => {
        switch (condition.type) {
          case "device_type":
            return condition.operator === "equals" && condition.value === device.type
          case "user_group":
            return condition.operator === "equals" && condition.value === device.userGroup
          case "location":
            return condition.operator === "equals" && condition.value === device.location
          case "compliance":
            return condition.operator === "equals" && condition.value === device.compliant.toString()
          default:
            return false
        }
      })

      const allConditionsMet = matchedConditions.length === policy.conditions.length
      const applicableActions = allConditionsMet ? policy.actions : []

      return {
        device,
        conditionsMet: allConditionsMet,
        matchedConditions: matchedConditions.length,
        totalConditions: policy.conditions.length,
        actions: applicableActions,
      }
    })

    setSimulationResults(results)
  }

  const getPolicyTypeInfo = (type: string) => {
    return policyTypes.find((pt) => pt.value === type) || policyTypes[0]
  }

  const getConditionTypeInfo = (type: string) => {
    return conditionTypes.find((ct) => ct.value === type) || conditionTypes[0]
  }

  const getActionTypeInfo = (type: string) => {
    return actionTypes.find((at) => at.value === type) || actionTypes[0]
  }

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Policy Designer & Management</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={handleCreatePolicy}>
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="authorization">Authorization</SelectItem>
                <SelectItem value="accounting">Accounting</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="qos">Quality of Service</SelectItem>
                <SelectItem value="guest_access">Guest Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Policy Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Policies</p>
                  <p className="text-2xl font-bold text-blue-900">{policies?.length || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Policies</p>
                  <p className="text-2xl font-bold text-green-900">{policies?.filter((p) => p.enabled).length || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Site-Specific</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {policies?.filter((p) => p.applicableSites.length > 0).length || 0}
                  </p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Compliance</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {policies?.filter((p) => p.category === "compliance").length || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">Policy Library</TabsTrigger>
          <TabsTrigger value="designer">Policy Designer</TabsTrigger>
          <TabsTrigger value="simulation">Policy Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {/* Policy List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPolicies.map((policy) => {
              const typeInfo = getPolicyTypeInfo(policy.type)
              return (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {typeInfo.icon}
                            <h3 className="font-semibold text-lg">{policy.name}</h3>
                          </div>
                          <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                          <Badge variant={policy.enabled ? "default" : "secondary"}>
                            {policy.enabled ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Priority: {policy.priority}</Badge>
                        </div>

                        <p className="text-gray-600 mb-4">{policy.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Category:</span>
                            <p className="text-gray-600 capitalize">{policy.category}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Conditions:</span>
                            <p className="text-gray-600">{policy.conditions?.length || 0} rules</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Actions:</span>
                            <p className="text-gray-600">{policy.actions?.length || 0} actions</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sites:</span>
                            <p className="text-gray-600">
                              {policy.applicableSites.length === 0
                                ? "All sites"
                                : `${policy.applicableSites.length} sites`}
                            </p>
                          </div>
                        </div>

                        {policy.tags && policy.tags.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-1">
                              {policy.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => simulatePolicy(policy)}
                          title="Simulate Policy"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicatePolicy(policy)}
                          title="Duplicate Policy"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditPolicy(policy)} title="Edit Policy">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(policy.id, policy.name)}
                          title="Delete Policy"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredPolicies.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                  <p className="text-gray-600 mb-4">
                    {policies?.length === 0
                      ? "Get started by creating your first policy."
                      : "Try adjusting your search or filters."}
                  </p>
                  <Button onClick={handleCreatePolicy}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Policy
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="designer" className="space-y-4">
          {/* Policy Designer */}
          {(isCreating || selectedPolicy) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>{isCreating ? "Create New Policy" : "Edit Policy"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-name">Policy Name *</Label>
                    <Input
                      id="policy-name"
                      value={policyForm.name || ""}
                      onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })}
                      placeholder="Enter policy name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-priority">Priority</Label>
                    <Select
                      value={policyForm.priority?.toString()}
                      onValueChange={(value) => setPolicyForm({ ...policyForm, priority: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Highest</SelectItem>
                        <SelectItem value="2">2 - High</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - Low</SelectItem>
                        <SelectItem value="5">5 - Lowest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy-description">Description *</Label>
                  <Textarea
                    id="policy-description"
                    value={policyForm.description || ""}
                    onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                    placeholder="Describe what this policy does"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-category">Category</Label>
                    <Select
                      value={policyForm.category}
                      onValueChange={(value) => setPolicyForm({ ...policyForm, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="authorization">Authorization</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="qos">Quality of Service</SelectItem>
                        <SelectItem value="guest_access">Guest Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-type">Type</Label>
                    <Select
                      value={policyForm.type}
                      onValueChange={(value) => setPolicyForm({ ...policyForm, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {policyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              {type.icon}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-enabled">Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={policyForm.enabled}
                        onCheckedChange={(checked) => setPolicyForm({ ...policyForm, enabled: checked })}
                      />
                      <span className="text-sm">{policyForm.enabled ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Conditions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Conditions</h3>
                    <Badge variant="outline">{policyForm.conditions?.length || 0} conditions</Badge>
                  </div>

                  {/* Existing Conditions */}
                  {policyForm.conditions && policyForm.conditions.length > 0 && (
                    <div className="space-y-2">
                      {policyForm.conditions.map((condition, index) => {
                        const conditionInfo = getConditionTypeInfo(condition.type)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline">{conditionInfo.label}</Badge>
                                <Badge variant="secondary">{condition.operator.replace("_", " ")}</Badge>
                                <code className="text-sm bg-white px-2 py-1 rounded">
                                  {Array.isArray(condition.value) ? condition.value.join(", ") : condition.value}
                                </code>
                              </div>
                              {condition.description && (
                                <p className="text-sm text-gray-600">{condition.description}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCondition(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add Condition Form */}
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Condition Type</Label>
                          <Select
                            value={conditionForm.type}
                            onValueChange={(value) => setConditionForm({ ...conditionForm, type: value as any })}
                          >
                            <SelectTrigger className="h-8">
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
                        <div className="space-y-1">
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={conditionForm.operator}
                            onValueChange={(value) => setConditionForm({ ...conditionForm, operator: value as any })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Value</Label>
                          <Input
                            className="h-8"
                            value={conditionForm.value}
                            onChange={(e) => setConditionForm({ ...conditionForm, value: e.target.value })}
                            placeholder="Enter value"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            className="h-8"
                            value={conditionForm.description}
                            onChange={(e) => setConditionForm({ ...conditionForm, description: e.target.value })}
                            placeholder="Optional description"
                          />
                        </div>
                      </div>
                      <Button size="sm" onClick={addCondition} className="h-8">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Condition
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Actions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Actions</h3>
                    <Badge variant="outline">{policyForm.actions?.length || 0} actions</Badge>
                  </div>

                  {/* Existing Actions */}
                  {policyForm.actions && policyForm.actions.length > 0 && (
                    <div className="space-y-2">
                      {policyForm.actions.map((action, index) => {
                        const actionInfo = getActionTypeInfo(action.type)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className={`${actionInfo.color} bg-transparent border`}>
                                  {actionInfo.label}
                                </Badge>
                                <Badge variant="outline">Priority: {action.priority}</Badge>
                                {Object.keys(action.parameters).length > 0 && (
                                  <code className="text-sm bg-white px-2 py-1 rounded">
                                    {JSON.stringify(action.parameters)}
                                  </code>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAction(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add Action Form */}
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Action Type</Label>
                          <Select
                            value={actionForm.type}
                            onValueChange={(value) => setActionForm({ ...actionForm, type: value as any })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <span className={type.color}>{type.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Priority</Label>
                          <Select
                            value={actionForm.priority?.toString()}
                            onValueChange={(value) =>
                              setActionForm({ ...actionForm, priority: Number.parseInt(value) })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Highest</SelectItem>
                              <SelectItem value="2">2 - High</SelectItem>
                              <SelectItem value="3">3 - Medium</SelectItem>
                              <SelectItem value="4">4 - Low</SelectItem>
                              <SelectItem value="5">5 - Lowest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Parameters</Label>
                          <Input
                            className="h-8"
                            value={JSON.stringify(actionForm.parameters || {})}
                            onChange={(e) => {
                              try {
                                const params = JSON.parse(e.target.value)
                                setActionForm({ ...actionForm, parameters: params })
                              } catch {
                                // Invalid JSON, ignore
                              }
                            }}
                            placeholder='{"vlan": "100"}'
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            className="h-8"
                            value={actionForm.description}
                            onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })}
                            placeholder="Action description"
                          />
                        </div>
                      </div>
                      <Button size="sm" onClick={addAction} className="h-8">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Action
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Advanced Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Applicable Sites</Label>
                      <Select
                        value={policyForm.applicableSites?.join(",")}
                        onValueChange={(value) => {
                          const siteIds = value ? value.split(",") : []
                          setPolicyForm({ ...policyForm, applicableSites: siteIds })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All sites (default)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Sites</SelectItem>
                          {sites?.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input
                        value={policyForm.tags?.join(", ")}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag)
                          setPolicyForm({ ...policyForm, tags })
                        }}
                        placeholder="Enter tags separated by commas"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input
                        value={policyForm.version}
                        onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                        placeholder="1.0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Approved By</Label>
                      <Input
                        value={policyForm.approvedBy}
                        onChange={(e) => setPolicyForm({ ...policyForm, approvedBy: e.target.value })}
                        placeholder="Approver name"
                      />
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setSelectedPolicy(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSavePolicy}>{isCreating ? "Create Policy" : "Update Policy"}</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          {/* Policy Simulation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Policy Simulation Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showSimulation ? (
                <div className="text-center py-12">
                  <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Simulation</h3>
                  <p className="text-gray-600 mb-4">
                    Test your policies against sample devices to see how they would behave in real scenarios.
                  </p>
                  <p className="text-sm text-gray-500">
                    Click the play button on any policy in the Policy Library to start a simulation.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Animation Speed Control */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Simulation Results</h3>
                    <div className="flex items-center space-x-4">
                      <Label className="text-sm">Animation Speed:</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnimationSpeed(Math.max(0.5, animationSpeed - 0.5))}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{animationSpeed}x</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnimationSpeed(Math.min(3, animationSpeed + 0.5))}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Results */}
                  {simulationResults && (
                    <div className="space-y-4">
                      {simulationResults.map((result: any, index: number) => (
                        <Card
                          key={index}
                          className={`${result.conditionsMet ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {result.device.type === "Windows" && <Monitor className="h-5 w-5" />}
                                  {result.device.type === "iPhone" && <Smartphone className="h-5 w-5" />}
                                  {result.device.type === "Android" && <Smartphone className="h-5 w-5" />}
                                  {result.device.type === "IoT" && <Router className="h-5 w-5" />}
                                  <span className="font-medium">{result.device.type} Device</span>
                                </div>
                                <Badge variant="outline">{result.device.userGroup}</Badge>
                                <Badge variant="outline">{result.device.location}</Badge>
                                <Badge variant={result.device.compliant ? "default" : "destructive"}>
                                  {result.device.compliant ? "Compliant" : "Non-compliant"}
                                </Badge>
                              </div>
                              <Badge variant={result.conditionsMet ? "default" : "destructive"}>
                                {result.conditionsMet ? "Policy Applied" : "Policy Not Applied"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Condition Evaluation</h4>
                                <div className="flex items-center space-x-2 text-sm">
                                  <span>Matched:</span>
                                  <Badge variant="outline">
                                    {result.matchedConditions} / {result.totalConditions}
                                  </Badge>
                                  {result.conditionsMet ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Applied Actions</h4>
                                <div className="space-y-1">
                                  {result.actions.length > 0 ? (
                                    result.actions.map((action: any, actionIndex: number) => (
                                      <Badge key={actionIndex} variant="secondary" className="text-xs">
                                        {action.type}: {action.description}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-gray-500">No actions applied</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSimulation(false)
                        setSimulationResults(null)
                      }}
                    >
                      Close Simulation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
