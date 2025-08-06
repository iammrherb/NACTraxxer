'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Shield, Users, Laptop, Network, AlertTriangle } from 'lucide-react'

interface PolicyEditorProps {
  onClose: () => void
}

interface Policy {
  id: string
  name: string
  type: 'user' | 'device' | 'network' | 'compliance'
  priority: number
  enabled: boolean
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  description: string
}

interface PolicyCondition {
  id: string
  type: string
  operator: string
  value: string
}

interface PolicyAction {
  id: string
  type: string
  value: string
}

export default function PolicyEditor({ onClose }: PolicyEditorProps) {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Windows Devices',
      type: 'device',
      priority: 1,
      enabled: true,
      conditions: [
        { id: '1', type: 'device_type', operator: 'equals', value: 'Windows' },
        { id: '2', type: 'certificate_valid', operator: 'equals', value: 'true' }
      ],
      actions: [
        { id: '1', type: 'vlan_assignment', value: '100' },
        { id: '2', type: 'access_level', value: 'full' }
      ],
      description: 'Allow full access for corporate Windows devices with valid certificates'
    },
    {
      id: '2',
      name: 'Guest Users',
      type: 'user',
      priority: 3,
      enabled: true,
      conditions: [
        { id: '3', type: 'user_group', operator: 'equals', value: 'Guests' }
      ],
      actions: [
        { id: '3', type: 'vlan_assignment', value: '200' },
        { id: '4', type: 'bandwidth_limit', value: '10Mbps' },
        { id: '5', type: 'session_timeout', value: '8h' }
      ],
      description: 'Limited access for guest users with time restrictions'
    },
    {
      id: '3',
      name: 'IoT Devices',
      type: 'device',
      priority: 2,
      enabled: true,
      conditions: [
        { id: '4', type: 'device_category', operator: 'equals', value: 'IoT' },
        { id: '5', type: 'mac_address', operator: 'in_list', value: 'approved_iot_macs' }
      ],
      actions: [
        { id: '6', type: 'vlan_assignment', value: '300' },
        { id: '7', type: 'access_level', value: 'restricted' }
      ],
      description: 'Restricted access for approved IoT devices with network segmentation'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const conditionTypes = [
    { value: 'user_group', label: 'User Group' },
    { value: 'device_type', label: 'Device Type' },
    { value: 'device_category', label: 'Device Category' },
    { value: 'certificate_valid', label: 'Certificate Valid' },
    { value: 'mac_address', label: 'MAC Address' },
    { value: 'ip_address', label: 'IP Address' },
    { value: 'time_of_day', label: 'Time of Day' },
    { value: 'location', label: 'Location' },
    { value: 'compliance_status', label: 'Compliance Status' }
  ]

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'in_list', label: 'In List' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' }
  ]

  const actionTypes = [
    { value: 'vlan_assignment', label: 'VLAN Assignment' },
    { value: 'access_level', label: 'Access Level' },
    { value: 'bandwidth_limit', label: 'Bandwidth Limit' },
    { value: 'session_timeout', label: 'Session Timeout' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'block_access', label: 'Block Access' },
    { value: 'redirect_url', label: 'Redirect URL' }
  ]

  const createNewPolicy = () => {
    const newPolicy: Policy = {
      id: Date.now().toString(),
      name: 'New Policy',
      type: 'user',
      priority: policies.length + 1,
      enabled: true,
      conditions: [],
      actions: [],
      description: ''
    }
    setSelectedPolicy(newPolicy)
    setIsCreating(true)
  }

  const savePolicy = (policy: Policy) => {
    if (isCreating) {
      setPolicies([...policies, policy])
      setIsCreating(false)
    } else {
      setPolicies(policies.map(p => p.id === policy.id ? policy : p))
    }
    setSelectedPolicy(null)
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId))
    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy(null)
    }
  }

  const togglePolicy = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const addCondition = (policy: Policy) => {
    const newCondition: PolicyCondition = {
      id: Date.now().toString(),
      type: 'user_group',
      operator: 'equals',
      value: ''
    }
    setSelectedPolicy({
      ...policy,
      conditions: [...policy.conditions, newCondition]
    })
  }

  const removeCondition = (policy: Policy, conditionId: string) => {
    setSelectedPolicy({
      ...policy,
      conditions: policy.conditions.filter(c => c.id !== conditionId)
    })
  }

  const updateCondition = (policy: Policy, conditionId: string, field: string, value: string) => {
    setSelectedPolicy({
      ...policy,
      conditions: policy.conditions.map(c =>
        c.id === conditionId ? { ...c, [field]: value } : c
      )
    })
  }

  const addAction = (policy: Policy) => {
    const newAction: PolicyAction = {
      id: Date.now().toString(),
      type: 'vlan_assignment',
      value: ''
    }
    setSelectedPolicy({
      ...policy,
      actions: [...policy.actions, newAction]
    })
  }

  const removeAction = (policy: Policy, actionId: string) => {
    setSelectedPolicy({
      ...policy,
      actions: policy.actions.filter(a => a.id !== actionId)
    })
  }

  const updateAction = (policy: Policy, actionId: string, field: string, value: string) => {
    setSelectedPolicy({
      ...policy,
      actions: policy.actions.map(a =>
        a.id === actionId ? { ...a, [field]: value } : a
      )
    })
  }

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />
      case 'device': return <Laptop className="h-4 w-4" />
      case 'network': return <Network className="h-4 w-4" />
      case 'compliance': return <Shield className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800'
    if (priority <= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>NAC Policy Editor</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Policies</h3>
              <Button onClick={createNewPolicy} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Policy
              </Button>
            </div>

            <div className="space-y-2">
              {policies.sort((a, b) => a.priority - b.priority).map((policy) => (
                <Card 
                  key={policy.id} 
                  className={`cursor-pointer transition-all ${
                    selectedPolicy?.id === policy.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPolicyIcon(policy.type)}
                        <div>
                          <h4 className="font-medium">{policy.name}</h4>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(policy.priority)}>
                          Priority {policy.priority}
                        </Badge>
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => togglePolicy(policy.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {policy.conditions.slice(0, 2).map((condition) => (
                        <Badge key={condition.id} variant="outline" className="text-xs">
                          {condition.type}: {condition.value}
                        </Badge>
                      ))}
                      {policy.conditions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{policy.conditions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Policy Editor */}
          <div className="space-y-4">
            {selectedPolicy ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{isCreating ? 'Create Policy' : 'Edit Policy'}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePolicy(selectedPolicy.id)}
                      disabled={isCreating}
                    >
                      Delete
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="conditions">Conditions</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="policy-name">Policy Name</Label>
                          <Input
                            id="policy-name"
                            value={selectedPolicy.name}
                            onChange={(e) => setSelectedPolicy({
                              ...selectedPolicy,
                              name: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="policy-type">Policy Type</Label>
                          <Select
                            value={selectedPolicy.type}
                            onValueChange={(value) => setSelectedPolicy({
                              ...selectedPolicy,
                              type: value as Policy['type']
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User Policy</SelectItem>
                              <SelectItem value="device">Device Policy</SelectItem>
                              <SelectItem value="network">Network Policy</SelectItem>
                              <SelectItem value="compliance">Compliance Policy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="policy-priority">Priority</Label>
                          <Input
                            id="policy-priority"
                            type="number"
                            min="1"
                            value={selectedPolicy.priority}
                            onChange={(e) => setSelectedPolicy({
                              ...selectedPolicy,
                              priority: parseInt(e.target.value) || 1
                            })}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            checked={selectedPolicy.enabled}
                            onCheckedChange={(checked) => setSelectedPolicy({
                              ...selectedPolicy,
                              enabled: checked
                            })}
                          />
                          <Label>Policy Enabled</Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="policy-description">Description</Label>
                        <Textarea
                          id="policy-description"
                          value={selectedPolicy.description}
                          onChange={(e) => setSelectedPolicy({
                            ...selectedPolicy,
                            description: e.target.value
                          })}
                          placeholder="Describe what this policy does..."
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="conditions" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Policy Conditions</h4>
                        <Button
                          onClick={() => addCondition(selectedPolicy)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Condition
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {selectedPolicy.conditions.map((condition, index) => (
                          <Card key={condition.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium">
                                Condition {index + 1}
                              </span>
                              <Button
                                onClick={() => removeCondition(selectedPolicy, condition.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={condition.type}
                                onValueChange={(value) => updateCondition(selectedPolicy, condition.id, 'type', value)}
                              >
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
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => updateCondition(selectedPolicy, condition.id, 'operator', value)}
                              >
                                <SelectTrigger>
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
                              <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(selectedPolicy, condition.id, 'value', e.target.value)}
                                placeholder="Value"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>

                      {selectedPolicy.conditions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <p>No conditions defined. Add conditions to specify when this policy applies.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="actions" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Policy Actions</h4>
                        <Button
                          onClick={() => addAction(selectedPolicy)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Action
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {selectedPolicy.actions.map((action, index) => (
                          <Card key={action.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium">
                                Action {index + 1}
                              </span>
                              <Button
                                onClick={() => removeAction(selectedPolicy, action.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={action.type}
                                onValueChange={(value) => updateAction(selectedPolicy, action.id, 'type', value)}
                              >
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
                              <Input
                                value={action.value}
                                onChange={(e) => updateAction(selectedPolicy, action.id, 'value', e.target.value)}
                                placeholder="Value"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>

                      {selectedPolicy.actions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <p>No actions defined. Add actions to specify what happens when conditions are met.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPolicy(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => savePolicy(selectedPolicy)}
                      disabled={!selectedPolicy.name || selectedPolicy.conditions.length === 0 || selectedPolicy.actions.length === 0}
                    >
                      {isCreating ? 'Create Policy' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a policy to edit or create a new one</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
