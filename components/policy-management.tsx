"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { storage } from "@/lib/storage"
import PolicyBuilder from "./policy-builder"
import PolicySimulator from "./policy-simulator"
import { Settings, Plus, Edit, Trash2, Copy, Shield, CheckCircle, Activity, BarChart3 } from "lucide-react"

interface GlobalPolicy {
  id: string
  name: string
  description: string
  category: string
  type: string
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  enabled: boolean
  applicableSites: string[]
  tags: string[]
  version: string
  approvedBy: string
  createdAt: string
  updatedAt: string
}

interface Site {
  id: string
  name: string
  location: string
  status: string
}

interface PolicyTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  riskLevel: "low" | "medium" | "high" | "critical"
  agentRequired: boolean
  mdmIntegration: boolean
}

interface PolicyCondition {
  id: string
  type: string
  operator: string
  value: string | string[] | number
  description: string
  agentRequired?: boolean
  mdmRequired?: boolean
}

interface PolicyAction {
  id: string
  type: string
  parameters: { [key: string]: any }
  description: string
  priority: number
  vlanId?: number
  ssid?: string
  bandwidth?: string
  timeRestriction?: string
}

interface RiskAssessmentPolicy {
  id: string
  name: string
  description: string
  agentBased: boolean
  agentlessChecks: string[]
  agentChecks: string[]
  riskThresholds: {
    low: number
    medium: number
    high: number
    critical: number
  }
  actions: {
    low: PolicyAction[]
    medium: PolicyAction[]
    high: PolicyAction[]
    critical: PolicyAction[]
  }
}

const policyTemplates: PolicyTemplate[] = [
  {
    id: "byod-basic",
    name: "BYOD Basic Access",
    description: "Basic bring-your-own-device policy with device compliance checks",
    category: "authentication",
    type: "access",
    riskLevel: "medium",
    agentRequired: false,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "device_type",
        operator: "in",
        value: ["smartphone", "tablet", "laptop"],
        description: "Personal devices",
      },
      {
        id: "2",
        type: "device_compliance",
        operator: "equals",
        value: "compliant",
        description: "Device must be compliant",
        mdmRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assignment",
        parameters: { vlanId: 100, vlanName: "BYOD" },
        description: "Assign to BYOD VLAN",
        priority: 1,
        vlanId: 100,
      },
      {
        id: "2",
        type: "bandwidth_limit",
        parameters: { downloadLimit: "50Mbps", uploadLimit: "25Mbps" },
        description: "Limit bandwidth for personal devices",
        priority: 2,
        bandwidth: "50/25 Mbps",
      },
    ],
  },
  {
    id: "guest-wifi",
    name: "Guest WiFi Access",
    description: "Secure guest access with time limitations and internet-only access",
    category: "guest_access",
    type: "access",
    riskLevel: "low",
    agentRequired: false,
    mdmIntegration: false,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "equals",
        value: "guests",
        description: "Guest users only",
      },
      {
        id: "2",
        type: "ssid",
        operator: "equals",
        value: "Guest-WiFi",
        description: "Guest network SSID",
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assignment",
        parameters: { vlanId: 200, vlanName: "Guest" },
        description: "Assign to guest VLAN",
        priority: 1,
        vlanId: 200,
      },
      {
        id: "2",
        type: "time_restriction",
        parameters: { duration: "8 hours", autoLogout: true },
        description: "8-hour session limit",
        priority: 2,
        timeRestriction: "8 hours",
      },
      {
        id: "3",
        type: "internet_only",
        parameters: { blockInternalAccess: true },
        description: "Internet access only",
        priority: 3,
      },
    ],
  },
  {
    id: "iot-devices",
    name: "IoT Device Management",
    description: "Automated IoT device onboarding with device profiling",
    category: "security",
    type: "access",
    riskLevel: "medium",
    agentRequired: true,
    mdmIntegration: false,
    conditions: [
      {
        id: "1",
        type: "device_category",
        operator: "equals",
        value: "iot",
        description: "IoT devices",
        agentRequired: true,
      },
      {
        id: "2",
        type: "device_profiling",
        operator: "equals",
        value: "completed",
        description: "Device profiling completed",
        agentRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assignment",
        parameters: { vlanId: 300, vlanName: "IoT" },
        description: "Assign to IoT VLAN",
        priority: 1,
        vlanId: 300,
      },
      {
        id: "2",
        type: "micro_segmentation",
        parameters: { isolateDevices: true, allowedPorts: [80, 443, 8080] },
        description: "Micro-segmentation with limited ports",
        priority: 2,
      },
    ],
  },
  {
    id: "privileged-access",
    name: "Privileged User Access",
    description: "High-security access for administrators with MFA requirements",
    category: "authentication",
    type: "access",
    riskLevel: "critical",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "user_group",
        operator: "in",
        value: ["administrators", "security_team"],
        description: "Privileged users",
      },
      {
        id: "2",
        type: "mfa_status",
        operator: "equals",
        value: "verified",
        description: "MFA verification required",
      },
      {
        id: "3",
        type: "device_trust",
        operator: "equals",
        value: "trusted",
        description: "Trusted device required",
        agentRequired: true,
        mdmRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assignment",
        parameters: { vlanId: 10, vlanName: "Admin" },
        description: "Assign to admin VLAN",
        priority: 1,
        vlanId: 10,
      },
      {
        id: "2",
        type: "session_monitoring",
        parameters: { recordSession: true, alertOnSuspicious: true },
        description: "Enhanced session monitoring",
        priority: 2,
      },
      {
        id: "3",
        type: "time_restriction",
        parameters: { businessHoursOnly: true, maxDuration: "4 hours" },
        description: "Business hours access only",
        priority: 3,
        timeRestriction: "Business hours, 4h max",
      },
    ],
  },
  {
    id: "compliance-healthcare",
    name: "HIPAA Compliance Policy",
    description: "Healthcare compliance policy with audit logging and encryption",
    category: "compliance",
    type: "security",
    riskLevel: "critical",
    agentRequired: true,
    mdmIntegration: true,
    conditions: [
      {
        id: "1",
        type: "user_department",
        operator: "in",
        value: ["medical", "nursing", "administration"],
        description: "Healthcare staff",
      },
      {
        id: "2",
        type: "device_encryption",
        operator: "equals",
        value: "enabled",
        description: "Device encryption required",
        agentRequired: true,
      },
      {
        id: "3",
        type: "antivirus_status",
        operator: "equals",
        value: "active",
        description: "Active antivirus required",
        agentRequired: true,
      },
    ],
    actions: [
      {
        id: "1",
        type: "vlan_assignment",
        parameters: { vlanId: 50, vlanName: "Healthcare" },
        description: "Assign to healthcare VLAN",
        priority: 1,
        vlanId: 50,
      },
      {
        id: "2",
        type: "audit_logging",
        parameters: { logLevel: "detailed", retentionPeriod: "7 years" },
        description: "HIPAA audit logging",
        priority: 2,
      },
      {
        id: "3",
        type: "data_encryption",
        parameters: { enforceEncryption: true, algorithm: "AES-256" },
        description: "Enforce data encryption",
        priority: 3,
      },
    ],
  },
]

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<GlobalPolicy[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<GlobalPolicy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("policies")
  const [showPolicyBuilder, setShowPolicyBuilder] = useState(false)
  const [showRiskBuilder, setShowRiskBuilder] = useState(false)
  const [simulationMode, setSimulationMode] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState("normal")
  const [agentMode, setAgentMode] = useState<"agentless" | "agent">("agentless")

  // Add simulation state
  const [simulationResults, setSimulationResults] = useState<any[]>([])
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  // Policy Builder State
  const [newPolicy, setNewPolicy] = useState<Partial<GlobalPolicy>>({
    name: "",
    description: "",
    category: "authentication",
    type: "access",
    priority: 50,
    conditions: [],
    actions: [],
    enabled: true,
    applicableSites: [],
    tags: [],
    version: "1.0",
    approvedBy: "System Administrator",
  })

  // Risk Assessment State
  const [riskPolicy, setRiskPolicy] = useState<RiskAssessmentPolicy>({
    id: "",
    name: "",
    description: "",
    agentBased: false,
    agentlessChecks: [],
    agentChecks: [],
    riskThresholds: {
      low: 30,
      medium: 60,
      high: 80,
      critical: 95,
    },
    actions: {
      low: [],
      medium: [],
      high: [],
      critical: [],
    },
  })

  const addConditionToPolicy = () => {
    const newCondition: PolicyCondition = {
      id: `${Date.now()}-${Math.random()}`,
      type: "user_group",
      operator: "equals",
      value: "",
      description: "New condition",
    }
    setNewPolicy({
      ...newPolicy,
      conditions: [...(newPolicy.conditions || []), newCondition],
    })
  }

  const addActionToPolicy = () => {
    const newAction: PolicyAction = {
      id: `${Date.now()}-${Math.random()}`,
      type: "vlan_assignment",
      parameters: {},
      description: "New action",
      priority: 1,
    }
    setNewPolicy({
      ...newPolicy,
      actions: [...(newPolicy.actions || []), newAction],
    })
  }

  const savePolicyFromBuilder = async () => {
    if (!newPolicy.name || !newPolicy.description) {
      toast({
        title: "Error",
        description: "Policy name and description are required.",
        variant: "destructive",
      })
      return
    }

    const policyToSave: GlobalPolicy = {
      id: `${Date.now()}-${Math.random()}`,
      name: newPolicy.name,
      description: newPolicy.description,
      category: newPolicy.category || "authentication",
      type: newPolicy.type || "access",
      priority: newPolicy.priority || 50,
      conditions: newPolicy.conditions || [],
      actions: newPolicy.actions || [],
      enabled: newPolicy.enabled !== false,
      applicableSites: newPolicy.applicableSites || [],
      tags: newPolicy.tags || [],
      version: newPolicy.version || "1.0",
      approvedBy: newPolicy.approvedBy || "System Administrator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await storage.createGlobalPolicy(policyToSave)
      toast({
        title: "Policy Saved",
        description: "Policy has been saved successfully",
      })
      setShowPolicyBuilder(false)
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save policy",
        variant: "destructive",
      })
    }
  }

  const loadData = async () => {
    const storedPolicies = await storage.getGlobalPolicies()
    setPolicies(storedPolicies)

    const storedSites = await storage.getSites()
    setSites(storedSites)
  }

  useEffect(() => {
    loadData()
  }, [])

  const createPolicyFromTemplate = async (template: PolicyTemplate) => {
    const newPolicyFromTemplate: GlobalPolicy = {
      id: `${Date.now()}-${Math.random()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      type: template.type,
      priority: 50,
      conditions: template.conditions,
      actions: template.actions,
      enabled: true,
      applicableSites: [],
      tags: [template.riskLevel, template.agentRequired ? "agent-required" : ""].filter(Boolean),
      version: "1.0",
      approvedBy: "System Administrator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await storage.createGlobalPolicy(newPolicyFromTemplate)
      toast({
        title: "Policy Created",
        description: `Policy created from ${template.name} template`,
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create policy from template",
        variant: "destructive",
      })
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <span>Advanced Policy Management</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create, manage, and simulate comprehensive NAC policies with AI-powered recommendations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {policies.length} Policies
              </Badge>
              <Badge variant="outline" className={agentMode === "agent" ? "bg-green-50 text-green-700" : ""}>
                {agentMode === "agent" ? "Agent-Based" : "Agentless"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="policies">Policy Library</TabsTrigger>
          <TabsTrigger value="builder">Policy Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulator">Policy Simulator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          {/* Policy Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Policy Library</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="agent-mode"
                      checked={agentMode === "agent"}
                      onCheckedChange={(checked) => setAgentMode(checked ? "agent" : "agentless")}
                    />
                    <Label htmlFor="agent-mode" className="text-sm">
                      Agent-Based Policies
                    </Label>
                  </div>
                  <Button onClick={() => setShowPolicyBuilder(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policies.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">{policy.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {policy.category}
                          </Badge>
                          <Switch checked={policy.enabled} size="sm" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{policy.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            Priority: {policy.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {policy.conditions.length} Rules
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <PolicyBuilder
            onSave={savePolicyFromBuilder}
            agentMode={agentMode}
            sites={sites}
            newPolicy={newPolicy}
            setNewPolicy={setNewPolicy}
            addConditionToPolicy={addConditionToPolicy}
            addActionToPolicy={addActionToPolicy}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pre-built policy templates for common use cases and compliance requirements
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policyTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={getRiskColor(template.riskLevel)}>{template.riskLevel}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.type}
                          </Badge>
                          {template.agentRequired && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Agent Required
                            </Badge>
                          )}
                          {template.mdmIntegration && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              MDM Integration
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>Conditions: {template.conditions.length}</div>
                          <div>Actions: {template.actions.length}</div>
                        </div>
                      </div>

                      <Button onClick={() => createPolicyFromTemplate(template)} className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create from Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="space-y-6">
          <PolicySimulator
            config={{
              policies,
              agentMode,
              sites,
            }}
            simulationMode={selectedScenario}
            onModeChange={setSelectedScenario}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{policies.length}</p>
                    <p className="text-sm text-muted-foreground">Total Policies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{policies.filter((p) => p.enabled).length}</p>
                    <p className="text-sm text-muted-foreground">Active Policies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">98.5%</p>
                    <p className="text-sm text-muted-foreground">Policy Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-sm text-muted-foreground">Policy Evaluations/min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Policy Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication Policies</span>
                  <span className="text-sm text-muted-foreground">95% success rate</span>
                </div>
                <Progress value={95} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authorization Policies</span>
                  <span className="text-sm text-muted-foreground">98% success rate</span>
                </div>
                <Progress value={98} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Policies</span>
                  <span className="text-sm text-muted-foreground">99% success rate</span>
                </div>
                <Progress value={99} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Guest Access Policies</span>
                  <span className="text-sm text-muted-foreground">92% success rate</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
