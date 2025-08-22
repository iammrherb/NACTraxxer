"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trash2,
  Settings,
  Users,
  Network,
  Shield,
  Clock,
  Globe,
  Smartphone,
  Router,
  Database,
  Key,
  Lock,
  Activity,
  AlertTriangle,
} from "lucide-react"

interface PolicyBuilderProps {
  onSave: () => void
  agentMode: "agentless" | "agent"
  sites: any[]
  newPolicy: any
  setNewPolicy: (policy: any) => void
  addConditionToPolicy: () => void
  addActionToPolicy: () => void
}

export default function PolicyBuilder({
  onSave,
  agentMode,
  sites,
  newPolicy,
  setNewPolicy,
  addConditionToPolicy,
  addActionToPolicy,
}: PolicyBuilderProps) {
  const [activeBuilderTab, setActiveBuilderTab] = useState("basic")
  const [draggedItem, setDraggedItem] = useState<any>(null)

  const conditionTypes = [
    {
      id: "user_group",
      name: "User Group",
      description: "Filter by user group membership",
      icon: <Users className="h-4 w-4" />,
      category: "identity",
      agentRequired: false,
    },
    {
      id: "device_type",
      name: "Device Type",
      description: "Filter by device category",
      icon: <Smartphone className="h-4 w-4" />,
      category: "device",
      agentRequired: false,
    },
    {
      id: "device_compliance",
      name: "Device Compliance",
      description: "Check device compliance status",
      icon: <Shield className="h-4 w-4" />,
      category: "security",
      agentRequired: false,
      mdmRequired: true,
    },
    {
      id: "device_trust",
      name: "Device Trust Level",
      description: "Evaluate device trust score",
      icon: <Lock className="h-4 w-4" />,
      category: "security",
      agentRequired: true,
    },
    {
      id: "location",
      name: "Location",
      description: "Filter by geographic location",
      icon: <Globe className="h-4 w-4" />,
      category: "context",
      agentRequired: false,
    },
    {
      id: "time_of_day",
      name: "Time of Day",
      description: "Time-based access control",
      icon: <Clock className="h-4 w-4" />,
      category: "context",
      agentRequired: false,
    },
    {
      id: "network_segment",
      name: "Network Segment",
      description: "Filter by network location",
      icon: <Network className="h-4 w-4" />,
      category: "network",
      agentRequired: false,
    },
    {
      id: "risk_score",
      name: "Risk Score",
      description: "AI-calculated risk assessment",
      icon: <AlertTriangle className="h-4 w-4" />,
      category: "security",
      agentRequired: true,
    },
    {
      id: "device_posture",
      name: "Device Posture",
      description: "Comprehensive device health check",
      icon: <Activity className="h-4 w-4" />,
      category: "security",
      agentRequired: true,
    },
    {
      id: "certificate_status",
      name: "Certificate Status",
      description: "PKI certificate validation",
      icon: <Key className="h-4 w-4" />,
      category: "security",
      agentRequired: false,
    },
  ]

  const actionTypes = [
    {
      id: "vlan_assignment",
      name: "VLAN Assignment",
      description: "Assign device to specific VLAN",
      icon: <Network className="h-4 w-4" />,
      category: "network",
      parameters: ["vlanId", "vlanName"],
    },
    {
      id: "bandwidth_limit",
      name: "Bandwidth Limit",
      description: "Apply bandwidth restrictions",
      icon: <Activity className="h-4 w-4" />,
      category: "qos",
      parameters: ["downloadLimit", "uploadLimit"],
    },
    {
      id: "quarantine",
      name: "Quarantine",
      description: "Isolate device for remediation",
      icon: <Shield className="h-4 w-4" />,
      category: "security",
      parameters: ["quarantineVlan", "remediationUrl"],
    },
    {
      id: "block_access",
      name: "Block Access",
      description: "Deny network access",
      icon: <Lock className="h-4 w-4" />,
      category: "security",
      parameters: ["blockReason", "notificationMessage"],
    },
    {
      id: "time_restriction",
      name: "Time Restriction",
      description: "Limit access duration",
      icon: <Clock className="h-4 w-4" />,
      category: "context",
      parameters: ["duration", "autoLogout"],
    },
    {
      id: "session_monitoring",
      name: "Session Monitoring",
      description: "Enhanced session tracking",
      icon: <Database className="h-4 w-4" />,
      category: "security",
      parameters: ["recordSession", "alertOnSuspicious"],
    },
    {
      id: "micro_segmentation",
      name: "Micro-segmentation",
      description: "Apply granular network policies",
      icon: <Router className="h-4 w-4" />,
      category: "network",
      parameters: ["allowedPorts", "isolateDevices"],
    },
    {
      id: "certificate_provisioning",
      name: "Certificate Provisioning",
      description: "Deploy device certificates",
      icon: <Key className="h-4 w-4" />,
      category: "security",
      parameters: ["certificateTemplate", "validityPeriod"],
    },
  ]

  const handleDragStart = (e: React.DragEvent, item: any, type: "condition" | "action") => {
    setDraggedItem({ ...item, type })
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = (e: React.DragEvent, dropZone: "conditions" | "actions") => {
    e.preventDefault()
    if (!draggedItem) return

    if (dropZone === "conditions" && draggedItem.type === "condition") {
      const newCondition = {
        id: `${Date.now()}-${Math.random()}`,
        type: draggedItem.id,
        operator: "equals",
        value: "",
        description: draggedItem.name,
        agentRequired: draggedItem.agentRequired,
        mdmRequired: draggedItem.mdmRequired,
      }
      setNewPolicy({
        ...newPolicy,
        conditions: [...(newPolicy.conditions || []), newCondition],
      })
    } else if (dropZone === "actions" && draggedItem.type === "action") {
      const newAction = {
        id: `${Date.now()}-${Math.random()}`,
        type: draggedItem.id,
        parameters: {},
        description: draggedItem.name,
        priority: (newPolicy.actions?.length || 0) + 1,
      }
      setNewPolicy({
        ...newPolicy,
        actions: [...(newPolicy.actions || []), newAction],
      })
    }

    setDraggedItem(null)
  }

  const removeCondition = (conditionId: string) => {
    setNewPolicy({
      ...newPolicy,
      conditions: newPolicy.conditions?.filter((c: any) => c.id !== conditionId) || [],
    })
  }

  const removeAction = (actionId: string) => {
    setNewPolicy({
      ...newPolicy,
      actions: newPolicy.actions?.filter((a: any) => a.id !== actionId) || [],
    })
  }

  const updateCondition = (conditionId: string, field: string, value: any) => {
    setNewPolicy({
      ...newPolicy,
      conditions: newPolicy.conditions?.map((c: any) => (c.id === conditionId ? { ...c, [field]: value } : c)) || [],
    })
  }

  const updateAction = (actionId: string, field: string, value: any) => {
    setNewPolicy({
      ...newPolicy,
      actions: newPolicy.actions?.map((a: any) => (a.id === actionId ? { ...a, [field]: value } : a)) || [],
    })
  }

  const getFilteredConditions = () => {
    return conditionTypes.filter((condition) => {
      if (agentMode === "agentless" && condition.agentRequired) return false
      return true
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Advanced Policy Builder</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag and drop components to build comprehensive NAC policies with visual rule creation
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeBuilderTab} onValueChange={setActiveBuilderTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="preview">Preview & Test</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Policy Name</Label>
                    <Input
                      value={newPolicy.name || ""}
                      onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                      placeholder="Enter policy name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newPolicy.category}
                      onValueChange={(value) => setNewPolicy({ ...newPolicy, category: value })}
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
                    <Label>Policy Type</Label>
                    <Select
                      value={newPolicy.type}
                      onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="access">Access Control</SelectItem>
                        <SelectItem value="vlan">VLAN Assignment</SelectItem>
                        <SelectItem value="qos">QoS Policy</SelectItem>
                        <SelectItem value="security">Security Policy</SelectItem>
                        <SelectItem value="compliance">Compliance Policy</SelectItem>
                        <SelectItem value="bandwidth">Bandwidth Control</SelectItem>
                        <SelectItem value="time">Time-based Access</SelectItem>
                        <SelectItem value="location">Location-based Access</SelectItem>
                        <SelectItem value="quarantine">Quarantine Policy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Priority: {newPolicy.priority || 50}</Label>
                    <Slider
                      value={[newPolicy.priority || 50]}
                      onValueChange={(value) => setNewPolicy({ ...newPolicy, priority: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low Priority</span>
                      <span>High Priority</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newPolicy.description || ""}
                      onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                      placeholder="Describe the policy purpose and scope"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={newPolicy.enabled !== false}
                      onCheckedChange={(checked) => setNewPolicy({ ...newPolicy, enabled: checked })}
                    />
                    <Label htmlFor="enabled">Enable policy immediately</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Condition Library */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Conditions</CardTitle>
                <p className="text-xs text-muted-foreground">Drag conditions to the policy builder</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getFilteredConditions().map((condition) => (
                    <div
                      key={condition.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, condition, "condition")}
                      className="flex items-center space-x-2 p-2 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                    >
                      {condition.icon}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{condition.name}</div>
                        <div className="text-xs text-muted-foreground">{condition.description}</div>
                      </div>
                      {condition.agentRequired && (
                        <Badge variant="outline" className="text-xs">
                          Agent
                        </Badge>
                      )}
                      {condition.mdmRequired && (
                        <Badge variant="outline" className="text-xs">
                          MDM
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Conditions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Policy Conditions</CardTitle>
                <p className="text-xs text-muted-foreground">All conditions must be met for the policy to apply</p>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "conditions")}
                >
                  {newPolicy.conditions?.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Drag conditions here to build your policy</p>
                    </div>
                  )}

                  {newPolicy.conditions?.map((condition: any, index: number) => (
                    <Card key={condition.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{condition.type.replace("_", " ")}</Badge>
                          {condition.agentRequired && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Agent Required
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCondition(condition.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="in">In List</SelectItem>
                              <SelectItem value="not_in">Not In List</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-xs">Value</Label>
                          <Input
                            className="h-8"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                            placeholder="Enter condition value"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action Library */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Actions</CardTitle>
                <p className="text-xs text-muted-foreground">Drag actions to the policy builder</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {actionTypes.map((action) => (
                    <div
                      key={action.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, action, "action")}
                      className="flex items-center space-x-2 p-2 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                    >
                      {action.icon}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{action.name}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Policy Actions</CardTitle>
                <p className="text-xs text-muted-foreground">Actions executed when conditions are met</p>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "actions")}
                >
                  {newPolicy.actions?.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                      <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Drag actions here to define policy behavior</p>
                    </div>
                  )}

                  {newPolicy.actions?.map((action: any, index: number) => (
                    <Card key={action.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{action.type.replace("_", " ")}</Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority: {action.priority}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {action.type === "vlan_assignment" && (
                            <>
                              <div className="space-y-1">
                                <Label className="text-xs">VLAN ID</Label>
                                <Input
                                  className="h-8"
                                  type="number"
                                  placeholder="100"
                                  onChange={(e) =>
                                    updateAction(action.id, "parameters", {
                                      ...action.parameters,
                                      vlanId: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">VLAN Name</Label>
                                <Input
                                  className="h-8"
                                  placeholder="Corporate"
                                  onChange={(e) =>
                                    updateAction(action.id, "parameters", {
                                      ...action.parameters,
                                      vlanName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </>
                          )}

                          {action.type === "bandwidth_limit" && (
                            <>
                              <div className="space-y-1">
                                <Label className="text-xs">Download Limit</Label>
                                <Input
                                  className="h-8"
                                  placeholder="100Mbps"
                                  onChange={(e) =>
                                    updateAction(action.id, "parameters", {
                                      ...action.parameters,
                                      downloadLimit: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Upload Limit</Label>
                                <Input
                                  className="h-8"
                                  placeholder="50Mbps"
                                  onChange={(e) =>
                                    updateAction(action.id, "parameters", {
                                      ...action.parameters,
                                      uploadLimit: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Preview</CardTitle>
              <p className="text-sm text-muted-foreground">Review your policy configuration before saving</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Policy Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {newPolicy.name || "Untitled Policy"}
                      </div>
                      <div>
                        <strong>Category:</strong> {newPolicy.category}
                      </div>
                      <div>
                        <strong>Type:</strong> {newPolicy.type}
                      </div>
                      <div>
                        <strong>Priority:</strong> {newPolicy.priority}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge variant={newPolicy.enabled ? "default" : "secondary"}>
                          {newPolicy.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Policy Logic</h3>
                    <div className="text-sm">
                      <div className="mb-2">
                        <strong>Conditions:</strong> {newPolicy.conditions?.length || 0}
                      </div>
                      <div>
                        <strong>Actions:</strong> {newPolicy.actions?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Policy will be applied to {agentMode === "agent" ? "agent-based" : "agentless"} deployments
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">Test Policy</Button>
                    <Button onClick={onSave}>Save Policy</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
