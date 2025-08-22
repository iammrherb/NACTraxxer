"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Switch } from "./ui/switch"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Copy,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Lock,
  Unlock,
  Zap,
  Eye,
  Settings
} from "lucide-react"
import { storage, type Policy } from "../lib/storage"
import { simulationMetrics } from "../lib/simulation-metrics"

const SAMPLE_POLICIES: Policy[] = [
  {
    id: "policy-1",
    name: "Corporate Device Authentication",
    description: "Enforce certificate-based authentication for all corporate-owned devices",
    type: "authentication",
    status: "active",
    priority: "high",
    effectiveness: 94,
    compliance: ["ISO 27001", "SOX"],
    conditions: [
      "Device ownership = Corporate",
      "Certificate present = True",
      "Device compliance = Compliant"
    ],
    actions: [
      "Allow network access",
      "Apply corporate VLAN",
      "Enable full bandwidth",
      "Log access event"
    ],
    appliedSites: ["healthcare-main", "financial-hq", "tech-campus"],
    violations: 12,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    category: "device-control"
  },
  {
    id: "policy-2", 
    name: "Guest Network Access",
    description: "Provide limited network access for guest users with web portal authentication",
    type: "guest-access",
    status: "active",
    priority: "medium",
    effectiveness: 87,
    compliance: ["GDPR"],
    conditions: [
      "User group = Guest",
      "Web portal auth = Completed",
      "Terms accepted = True"
    ],
    actions: [
      "Allow internet access only",
      "Apply guest VLAN",
      "Limit bandwidth to 10 Mbps",
      "Block internal resources",
      "Auto-disconnect after 4 hours"
    ],
    appliedSites: ["retail-stores", "university-main"],
    violations: 3,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    category: "access-control"
  },
  {
    id: "policy-3",
    name: "IoT Device Quarantine", 
    description: "Automatically quarantine unknown IoT devices for security assessment",
    type: "quarantine",
    status: "active",
    priority: "critical",
    effectiveness: 98,
    compliance: ["NIST", "IEC 62443"],
    conditions: [
      "Device type = IoT",
      "Device fingerprint = Unknown",
      "Manufacturer = Unrecognized"
    ],
    actions: [
      "Place in quarantine VLAN",
      "Block all traffic except assessment",
      "Trigger security scan",
      "Send alert to security team",
      "Log for manual review"
    ],
    appliedSites: ["manufacturing-plant", "healthcare-main"],
    violations: 45,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-18",
    category: "threat-protection"
  },
  {
    id: "policy-4",
    name: "BYOD Compliance Check",
    description: "Verify compliance requirements for personal devices accessing corporate resources",
    type: "compliance",
    status: "active", 
    priority: "high",
    effectiveness: 91,
    compliance: ["HIPAA", "GDPR", "SOX"],
    conditions: [
      "Device ownership = Personal",
      "MDM enrollment = Required",
      "Security patch level = Current"
    ],
    actions: [
      "Check MDM compliance status",
      "Verify encryption enabled",
      "Validate patch level",
      "Allow conditional access",
      "Monitor continuously"
    ],
    appliedSites: ["tech-campus", "financial-hq"],
    violations: 8,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-20",
    category: "compliance"
  },
  {
    id: "policy-5",
    name: "After-Hours Access Control",
    description: "Restrict network access during non-business hours except for authorized personnel",
    type: "time-based",
    status: "draft",
    priority: "medium", 
    effectiveness: 0,
    compliance: ["ISO 27001"],
    conditions: [
      "Time = Outside business hours",
      "User authorization = Required",
      "Emergency access = Conditional"
    ],
    actions: [
      "Check authorization level",
      "Apply time-based restrictions",
      "Log access attempts",
      "Send manager notification",
      "Monitor session activity"
    ],
    appliedSites: [],
    violations: 0,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20", 
    category: "access-control"
  }
]

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>(SAMPLE_POLICIES)
  const [sites] = useState(storage.getSites())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isCreating, setIsCreating] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [metrics] = useState(simulationMetrics.getMetrics())

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    type: "authentication",
    priority: "medium",
    category: "access-control",
    conditions: [""],
    actions: [""],
    appliedSites: [] as string[]
  })

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || policy.status === selectedStatus  
      const matchesPriority = selectedPriority === "all" || policy.priority === selectedPriority
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority
    })
  }, [policies, searchTerm, selectedCategory, selectedStatus, selectedPriority])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200"
      case "draft": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200"
      case "deprecated": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50"
      case "high": return "text-orange-600 bg-orange-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "access-control": return <Lock className="h-4 w-4" />
      case "device-control": return <Shield className="h-4 w-4" />
      case "compliance": return <CheckCircle className="h-4 w-4" />
      case "threat-protection": return <AlertTriangle className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const handleCreatePolicy = () => {
    const policy: Policy = {
      id: `policy-${Date.now()}`,
      ...newPolicy,
      status: "draft",
      effectiveness: 0,
      compliance: [],
      violations: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setPolicies(prev => [...prev, policy])
    setIsCreating(false)
    resetNewPolicy()
  }

  const resetNewPolicy = () => {
    setNewPolicy({
      name: "",
      description: "",
      type: "authentication",
      priority: "medium",
      category: "access-control",
      conditions: [""],
      actions: [""],
      appliedSites: []
    })
  }

  const duplicatePolicy = (policy: Policy) => {
    const duplicated: Policy = {
      ...policy,
      id: `policy-${Date.now()}`,
      name: `${policy.name} (Copy)`,
      status: "draft",
      appliedSites: [],
      effectiveness: 0,
      violations: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setPolicies(prev => [...prev, duplicated])
  }

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(prev => prev.map(policy => {
      if (policy.id === policyId) {
        const newStatus = policy.status === "active" ? "inactive" : "active"
        return { ...policy, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
      }
      return policy
    }))
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(prev => prev.filter(policy => policy.id !== policyId))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Policy Management</h2>
            <p className="text-muted-foreground">Configure and manage network access control policies</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Policy</DialogTitle>
                  <DialogDescription>Define a new network access control policy</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policyName">Policy Name *</Label>
                      <Input
                        id="policyName"
                        value={newPolicy.name}
                        onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                        placeholder="Enter policy name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select value={newPolicy.type} onValueChange={(value) => setNewPolicy({...newPolicy, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="authorization">Authorization</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="quarantine">Quarantine</SelectItem>
                          <SelectItem value="guest-access">Guest Access</SelectItem>
                          <SelectItem value="time-based">Time-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPolicy.description}
                      onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                      placeholder="Describe the policy purpose and behavior"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newPolicy.category} onValueChange={(value) => setNewPolicy({...newPolicy, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="access-control">Access Control</SelectItem>
                          <SelectItem value="device-control">Device Control</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="threat-protection">Threat Protection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newPolicy.priority} onValueChange={(value) => setNewPolicy({...newPolicy, priority: value})}>
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
                  </div>
                  
                  <div>
                    <Label>Conditions</Label>
                    <div className="space-y-2">
                      {newPolicy.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={condition}
                            onChange={(e) => {
                              const newConditions = [...newPolicy.conditions]
                              newConditions[index] = e.target.value
                              setNewPolicy({...newPolicy, conditions: newConditions})
                            }}
                            placeholder="e.g., Device type = Mobile"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newConditions = newPolicy.conditions.filter((_, i) => i !== index)
                              setNewPolicy({...newPolicy, conditions: newConditions})
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewPolicy({...newPolicy, conditions: [...newPolicy.conditions, ""]})}
                      >
                        Add Condition
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Actions</Label>
                    <div className="space-y-2">
                      {newPolicy.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={action}
                            onChange={(e) => {
                              const newActions = [...newPolicy.actions]
                              newActions[index] = e.target.value
                              setNewPolicy({...newPolicy, actions: newActions})
                            }}
                            placeholder="e.g., Allow network access"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newActions = newPolicy.actions.filter((_, i) => i !== index)
                              setNewPolicy({...newPolicy, actions: newActions})
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewPolicy({...newPolicy, actions: [...newPolicy.actions, ""]})}
                      >
                        Add Action
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button onClick={handleCreatePolicy} disabled={!newPolicy.name || !newPolicy.description}>
                      Create Policy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="access-control">Access Control</SelectItem>
              <SelectItem value="device-control">Device Control</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="threat-protection">Threat Protection</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          >
            <Filter className="h-4 w-4 mr-2" />
            {viewMode === "list" ? "Grid" : "List"} View
          </Button>
        </div>
      </div>

      {/* Policy Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">
              {policies.filter(p => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Evaluations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.policiesEvaluated.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +{Math.floor(Math.random() * 1000)} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Effectiveness</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(policies.reduce((sum, p) => sum + (p.effectiveness || 0), 0) / policies.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Policy success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.reduce((sum, p) => sum + (p.violations || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Policy List */}
      <div className="space-y-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getCategoryIcon(policy.category || "access-control")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{policy.name}</h3>
                        <Badge className={getStatusColor(policy.status)} variant="outline">
                          {policy.status}
                        </Badge>
                        <Badge className={getPriorityColor(policy.priority || "medium")} variant="outline">
                          {policy.priority || "medium"}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3">{policy.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium">Type:</span>
                          <span className="ml-2">{policy.type}</span>
                        </div>
                        <div>
                          <span className="font-medium">Applied Sites:</span>
                          <span className="ml-2">{policy.appliedSites?.length || 0} sites</span>
                        </div>
                        <div>
                          <span className="font-medium">Violations:</span>
                          <span className="ml-2 text-red-600">{policy.violations || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <span className="ml-2">{policy.updatedAt}</span>
                        </div>
                      </div>
                      
                      {policy.effectiveness !== undefined && policy.effectiveness > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Effectiveness</span>
                            <span className="font-medium">{policy.effectiveness}%</span>
                          </div>
                          <Progress value={policy.effectiveness} className="h-2" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium text-sm mb-1">Conditions:</div>
                          <div className="flex flex-wrap gap-1">
                            {policy.conditions?.slice(0, 2).map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                            {(policy.conditions?.length || 0) > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(policy.conditions?.length || 0) - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-sm mb-1">Actions:</div>
                          <div className="flex flex-wrap gap-1">
                            {policy.actions?.slice(0, 2).map((action, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                            {(policy.actions?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(policy.actions?.length || 0) - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {policy.compliance && policy.compliance.length > 0 && (
                        <div className="mt-3">
                          <div className="font-medium text-sm mb-1">Compliance:</div>
                          <div className="flex flex-wrap gap-1">
                            {policy.compliance.map(framework => (
                              <Badge key={framework} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {framework}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicatePolicy(policy)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePolicyStatus(policy.id)}
                  >
                    {policy.status === "active" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePolicy(policy.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No policies found matching your criteria.</p>
          <Button className="mt-4" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Policy
          </Button>
        </div>
      )}

      {/* Policy Detail Modal */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        {selectedPolicy && (
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getCategoryIcon(selectedPolicy.category || "access-control")}
                <span>{selectedPolicy.name}</span>
              </DialogTitle>
              <DialogDescription>{selectedPolicy.description}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedPolicy.status)} variant="outline">
                      {selectedPolicy.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Priority</Label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(selectedPolicy.priority || "medium")} variant="outline">
                      {selectedPolicy.priority || "medium"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedPolicy.effectiveness !== undefined && (
                <div>
                  <Label className="font-medium">Effectiveness</Label>
                  <div className="mt-2">
                    <Progress value={selectedPolicy.effectiveness} className="h-3" />
                    <div className="text-sm text-muted-foreground mt-1">{selectedPolicy.effectiveness}% success rate</div>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <Label className="font-medium">Conditions</Label>
                <div className="mt-2 space-y-1">
                  {selectedPolicy.conditions?.map((condition, index) => (
                    <div key={index} className="text-sm bg-muted p-2 rounded">
                      {condition}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="font-medium">Actions</Label>
                <div className="mt-2 space-y-1">
                  {selectedPolicy.actions?.map((action, index) => (
                    <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedPolicy.appliedSites && selectedPolicy.appliedSites.length > 0 && (
                <div>
                  <Label className="font-medium">Applied Sites</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {selectedPolicy.appliedSites.map(siteId => {
                      const site = sites.find(s => s.id === siteId)
                      return site ? (
                        <div key={siteId} className="text-sm bg-green-50 p-2 rounded flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{site.name}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              
              {selectedPolicy.compliance && selectedPolicy.compliance.length > 0 && (
                <div>
                  <Label className="font-medium">Compliance Frameworks</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPolicy.compliance.map(framework => (
                      <Badge key={framework} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}