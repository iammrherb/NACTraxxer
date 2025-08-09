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
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Edit, Save, X, Shield, Users, Network, Clock, AlertTriangle } from 'lucide-react'

interface Policy {
  id: string
  name: string
  type: 'user' | 'device' | 'network' | 'time' | 'risk'
  priority: number
  enabled: boolean
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  description: string
}

interface PolicyCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface PolicyAction {
  id: string
  type: string
  value: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Device Access',
      type: 'device',
      priority: 1,
      enabled: true,
      conditions: [
        { id: '1', field: 'device.compliance', operator: 'equals', value: 'compliant' },
        { id: '2', field: 'certificate.valid', operator: 'equals', value: 'true' }
      ],
      actions: [
        { id: '1', type: 'vlan', value: '100' },
        { id: '2', type: 'bandwidth', value: 'unlimited' }
      ],
      description: 'Allow full access for compliant corporate devices with valid certificates'
    },
    {
      id: '2',
      name: 'Guest User Access',
      type: 'user',
      priority: 2,
      enabled: true,
      conditions: [
        { id: '3', field: 'user.group', operator: 'equals', value: 'Guests' },
        { id: '4', field: 'time.business_hours', operator: 'equals', value: 'true' }
      ],
      actions: [
        { id: '3', type: 'vlan', value: '200' },
        { id: '4', type: 'bandwidth', value: '10Mbps' },
        { id: '5', type: 'duration', value: '8hours' }
      ],
      description: 'Limited access for guest users during business hours'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  const policyTypes = [
    { id: 'user', label: 'User-Based', icon: <Users className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
    { id: 'device', label: 'Device-Based', icon: <Shield className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'network', label: 'Network-Based', icon: <Network className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'time', label: 'Time-Based', icon: <Clock className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'risk', label: 'Risk-Based', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-red-100 text-red-800' }
  ]

  const conditionFields = {
    user: ['user.group', 'user.department', 'user.role', 'user.location'],
    device: ['device.type', 'device.os', 'device.compliance', 'certificate.valid', 'device.managed'],
    network: ['network.location', 'network.vlan', 'network.subnet', 'network.ssid'],
    time: ['time.business_hours', 'time.day_of_week', 'time.date_range', 'time.maintenance_window'],
    risk: ['risk.score', 'threat.detected', 'behavior.anomaly', 'geo.location']
  }

  const operators = ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'in_range']

  const actionTypes = ['vlan', 'bandwidth', 'duration', 'quarantine', 'redirect', 'block', 'allow', 'log']

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
    setEditingPolicy(newPolicy)
    setIsEditing(true)
  }

  const editPolicy = (policy: Policy) => {
    setEditingPolicy({ ...policy })
    setIsEditing(true)
  }

  const savePolicy = () => {
    if (!editingPolicy) return

    if (policies.find(p => p.id === editingPolicy.id)) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? editingPolicy : p))
    } else {
      setPolicies([...policies, editingPolicy])
    }

    setIsEditing(false)
    setEditingPolicy(null)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingPolicy(null)
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId))
    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy(null)
    }
  }

  const togglePolicyEnabled = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const addCondition = () => {
    if (!editingPolicy) return
    
    const newCondition: PolicyCondition = {
      id: Date.now().toString(),
      field: conditionFields[editingPolicy.type][0],
      operator: 'equals',
      value: ''
    }
    
    setEditingPolicy({
      ...editingPolicy,
      conditions: [...editingPolicy.conditions, newCondition]
    })
  }

  const updateCondition = (conditionId: string, field: keyof PolicyCondition, value: string) => {
    if (!editingPolicy) return
    
    setEditingPolicy({
      ...editingPolicy,
      conditions: editingPolicy.conditions.map(c =>
        c.id === conditionId ? { ...c, [field]: value } : c
      )
    })
  }

  const removeCondition = (conditionId: string) => {
    if (!editingPolicy) return
    
    setEditingPolicy({
      ...editingPolicy,
      conditions: editingPolicy.conditions.filter(c => c.id !== conditionId)
    })
  }

  const addAction = () => {
    if (!editingPolicy) return
    
    const newAction: PolicyAction = {
      id: Date.now().toString(),
      type: 'vlan',
      value: ''
    }
    
    setEditingPolicy({
      ...editingPolicy,
      actions: [...editingPolicy.actions, newAction]
    })
  }

  const updateAction = (actionId: string, field: keyof PolicyAction, value: string) => {
    if (!editingPolicy) return
    
    setEditingPolicy({
      ...editingPolicy,
      actions: editingPolicy.actions.map(a =>
        a.id === actionId ? { ...a, [field]: value } : a
      )
    })
  }

  const removeAction = (actionId: string) => {
    if (!editingPolicy) return
    
    setEditingPolicy({
      ...editingPolicy,
      actions: editingPolicy.actions.filter(a => a.id !== actionId)
    })
  }

  const getPolicyTypeInfo = (type: string) => {
    return policyTypes.find(pt => pt.id === type) || policyTypes[0]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-[#00c8d7]" />
              <span>Network Access Policy Editor</span>
            </CardTitle>
            <Button onClick={createNewPolicy} className="bg-[#00c8d7] hover:bg-[#0099cc]">
              <Plus className="w-4 h-4 mr-2" />
              New Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="policies" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policies">Policy List</TabsTrigger>
              <TabsTrigger value="editor">Policy Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="space-y-4">
              <div className="grid gap-4">
                {policies.map((policy) => {
                  const typeInfo = getPolicyTypeInfo(policy.type)
                  return (
                    <Card key={policy.id} className={`cursor-pointer transition-all ${selectedPolicy?.id === policy.id ? 'ring-2 ring-[#00c8d7]' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4" onClick={() => setSelectedPolicy(policy)}>
                            <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                              {typeInfo.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{policy.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Priority {policy.priority}
                                </Badge>
                                <Badge variant={policy.enabled ? 'default' : 'secondary'} className="text-xs">
                                  {policy.enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {policy.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{policy.conditions.length} conditions</span>
                                <span>{policy.actions.length} actions</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={policy.enabled}
                              onCheckedChange={() => togglePolicyEnabled(policy.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editPolicy(policy)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePolicy(policy.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              {isEditing && editingPolicy ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {policies.find(p => p.id === editingPolicy.id) ? 'Edit Policy' : 'Create New Policy'}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button onClick={savePolicy} className="bg-[#00c8d7] hover:bg-[#0099cc]">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-name">Policy Name</Label>
                        <Input
                          id="policy-name"
                          value={editingPolicy.name}
                          onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-type">Policy Type</Label>
                        <Select
                          value={editingPolicy.type}
                          onValueChange={(value) => setEditingPolicy({ ...editingPolicy, type: value as Policy['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {policyTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center space-x-2">
                                  {type.icon}
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="policy-description">Description</Label>
                      <Textarea
                        id="policy-description"
                        value={editingPolicy.description}
                        onChange={(e) => setEditingPolicy({ ...editingPolicy, description: e.target.value })}
                        placeholder="Describe what this policy does..."
                      />
                    </div>

                    <Separator />

                    {/* Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Conditions</h3>
                        <Button onClick={addCondition} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Condition
                        </Button>
                      </div>
                      
                      {editingPolicy.conditions.map((condition, index) => (
                        <Card key={condition.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                              <Label>Field</Label>
                              <Select
                                value={condition.field}
                                onValueChange={(value) => updateCondition(condition.id, 'field', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionFields[editingPolicy.type].map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Operator</Label>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {operators.map((operator) => (
                                    <SelectItem key={operator} value={operator}>
                                      {operator.replace('_', ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Value</Label>
                              <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                                placeholder="Enter value..."
                              />
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCondition(condition.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Actions</h3>
                        <Button onClick={addAction} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Action
                        </Button>
                      </div>
                      
                      {editingPolicy.actions.map((action) => (
                        <Card key={action.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                              <Label>Action Type</Label>
                              <Select
                                value={action.type}
                                onValueChange={(value) => updateAction(action.id, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {actionTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Value</Label>
                              <Input
                                value={action.value}
                                onChange={(e) => updateAction(action.id, 'value', e.target.value)}
                                placeholder="Enter action value..."
                              />
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAction(action.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Select a policy to edit or create a new one
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policyTypes.map((type) => (
                  <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className={`p-3 rounded-lg ${type.color} mb-3`}>
                        {type.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{type.label} Template</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Pre-configured template for {type.label.toLowerCase()} policies
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
