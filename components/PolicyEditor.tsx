'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit, Shield, Users, Monitor, Clock, MapPin } from 'lucide-react'

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
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance_status'
  operator: 'equals' | 'contains' | 'not_equals' | 'in_range'
  value: string
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'assign_vlan' | 'bandwidth_limit'
  value: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Users - Full Access',
      type: 'user',
      priority: 1,
      enabled: true,
      conditions: [
        { id: '1', type: 'user_group', operator: 'equals', value: 'Corporate' },
        { id: '2', type: 'device_type', operator: 'equals', value: 'Managed' }
      ],
      actions: [
        { id: '1', type: 'allow', value: 'full_access' },
        { id: '2', type: 'assign_vlan', value: '100' }
      ],
      description: 'Full network access for authenticated corporate users with managed devices'
    },
    {
      id: '2',
      name: 'Guest Users - Internet Only',
      type: 'user',
      priority: 2,
      enabled: true,
      conditions: [
        { id: '3', type: 'user_group', operator: 'equals', value: 'Guest' }
      ],
      actions: [
        { id: '3', type: 'assign_vlan', value: '200' },
        { id: '4', type: 'bandwidth_limit', value: '10Mbps' }
      ],
      description: 'Limited internet access for guest users'
    },
    {
      id: '3',
      name: 'IoT Devices - Restricted',
      type: 'device',
      priority: 3,
      enabled: true,
      conditions: [
        { id: '4', type: 'device_type', operator: 'equals', value: 'IoT' }
      ],
      actions: [
        { id: '5', type: 'assign_vlan', value: '300' },
        { id: '6', type: 'bandwidth_limit', value: '1Mbps' }
      ],
      description: 'Micro-segmented access for IoT devices'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
    name: '',
    type: 'user',
    priority: 1,
    enabled: true,
    conditions: [],
    actions: [],
    description: ''
  })

  const conditionTypes = [
    { value: 'user_group', label: 'User Group', icon: Users },
    { value: 'device_type', label: 'Device Type', icon: Monitor },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'time', label: 'Time Range', icon: Clock },
    { value: 'compliance_status', label: 'Compliance Status', icon: Shield }
  ]

  const actionTypes = [
    { value: 'allow', label: 'Allow Access' },
    { value: 'deny', label: 'Deny Access' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'assign_vlan', label: 'Assign VLAN' },
    { value: 'bandwidth_limit', label: 'Bandwidth Limit' }
  ]

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'device': return 'bg-green-100 text-green-800 border-green-200'
      case 'network': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'compliance': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const addCondition = () => {
    if (!selectedPolicy) return
    const newCondition: PolicyCondition = {
      id: Date.now().toString(),
      type: 'user_group',
      operator: 'equals',
      value: ''
    }
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: [...selectedPolicy.conditions, newCondition]
    })
  }

  const addAction = () => {
    if (!selectedPolicy) return
    const newAction: PolicyAction = {
      id: Date.now().toString(),
      type: 'allow',
      value: ''
    }
    setSelectedPolicy({
      ...selectedPolicy,
      actions: [...selectedPolicy.actions, newAction]
    })
  }

  const savePolicy = () => {
    if (!selectedPolicy) return
    setPolicies(prev => 
      prev.map(p => p.id === selectedPolicy.id ? selectedPolicy : p)
    )
    setIsEditing(false)
  }

  const createPolicy = () => {
    const policy: Policy = {
      id: Date.now().toString(),
      name: newPolicy.name || 'New Policy',
      type: newPolicy.type || 'user',
      priority: newPolicy.priority || 1,
      enabled: newPolicy.enabled ?? true,
      conditions: newPolicy.conditions || [],
      actions: newPolicy.actions || [],
      description: newPolicy.description || ''
    }
    setPolicies(prev => [...prev, policy])
    setNewPolicy({
      name: '',
      type: 'user',
      priority: 1,
      enabled: true,
      conditions: [],
      actions: [],
      description: ''
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Network Access Policy Editor</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Define and manage network access policies based on user identity, device type, location, and compliance status.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="policies" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="policies">Policy Management</TabsTrigger>
              <TabsTrigger value="create">Create New Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Policy List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Policies</h3>
                  <div className="space-y-3">
                    {policies.map((policy) => (
                      <div
                        key={policy.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPolicy?.id === policy.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{policy.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPolicyTypeColor(policy.type)}>
                              {policy.type}
                            </Badge>
                            <Switch
                              checked={policy.enabled}
                              onCheckedChange={(checked) => {
                                setPolicies(prev =>
                                  prev.map(p =>
                                    p.id === policy.id ? { ...p, enabled: checked } : p
                                  )
                                )
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {policy.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Priority: {policy.priority}</span>
                          <span>{policy.conditions.length} conditions, {policy.actions.length} actions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Editor */}
                <div className="space-y-4">
                  {selectedPolicy ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Policy Details</h3>
                        <Button
                          variant={isEditing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (isEditing) {
                              savePolicy()
                            } else {
                              setIsEditing(true)
                            }
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {isEditing ? 'Save' : 'Edit'}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Policy Name</label>
                          <Input
                            value={selectedPolicy.name}
                            onChange={(e) => setSelectedPolicy({ ...selectedPolicy, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={selectedPolicy.description}
                            onChange={(e) => setSelectedPolicy({ ...selectedPolicy, description: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <Select
                              value={selectedPolicy.type}
                              onValueChange={(value) => setSelectedPolicy({ ...selectedPolicy, type: value as Policy['type'] })}
                              disabled={!isEditing}
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

                          <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <Input
                              type="number"
                              value={selectedPolicy.priority}
                              onChange={(e) => setSelectedPolicy({ ...selectedPolicy, priority: parseInt(e.target.value) })}
                              disabled={!isEditing}
                              min="1"
                              max="100"
                            />
                          </div>
                        </div>

                        {/* Conditions */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Conditions</label>
                            {isEditing && (
                              <Button variant="outline" size="sm" onClick={addCondition}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {selectedPolicy.conditions.map((condition, index) => (
                              <div key={condition.id} className="flex items-center space-x-2 p-2 border rounded">
                                <Select
                                  value={condition.type}
                                  onValueChange={(value) => {
                                    const updatedConditions = [...selectedPolicy.conditions]
                                    updatedConditions[index] = { ...condition, type: value as PolicyCondition['type'] }
                                    setSelectedPolicy({ ...selectedPolicy, conditions: updatedConditions })
                                  }}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="w-32">
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
                                  onValueChange={(value) => {
                                    const updatedConditions = [...selectedPolicy.conditions]
                                    updatedConditions[index] = { ...condition, operator: value as PolicyCondition['operator'] }
                                    setSelectedPolicy({ ...selectedPolicy, conditions: updatedConditions })
                                  }}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">Equals</SelectItem>
                                    <SelectItem value="contains">Contains</SelectItem>
                                    <SelectItem value="not_equals">Not Equals</SelectItem>
                                    <SelectItem value="in_range">In Range</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Input
                                  value={condition.value}
                                  onChange={(e) => {
                                    const updatedConditions = [...selectedPolicy.conditions]
                                    updatedConditions[index] = { ...condition, value: e.target.value }
                                    setSelectedPolicy({ ...selectedPolicy, conditions: updatedConditions })
                                  }}
                                  disabled={!isEditing}
                                  placeholder="Value"
                                  className="flex-1"
                                />

                                {isEditing && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const updatedConditions = selectedPolicy.conditions.filter(c => c.id !== condition.id)
                                      setSelectedPolicy({ ...selectedPolicy, conditions: updatedConditions })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Actions</label>
                            {isEditing && (
                              <Button variant="outline" size="sm" onClick={addAction}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {selectedPolicy.actions.map((action, index) => (
                              <div key={action.id} className="flex items-center space-x-2 p-2 border rounded">
                                <Select
                                  value={action.type}
                                  onValueChange={(value) => {
                                    const updatedActions = [...selectedPolicy.actions]
                                    updatedActions[index] = { ...action, type: value as PolicyAction['type'] }
                                    setSelectedPolicy({ ...selectedPolicy, actions: updatedActions })
                                  }}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="w-40">
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
                                  onChange={(e) => {
                                    const updatedActions = [...selectedPolicy.actions]
                                    updatedActions[index] = { ...action, value: e.target.value }
                                    setSelectedPolicy({ ...selectedPolicy, actions: updatedActions })
                                  }}
                                  disabled={!isEditing}
                                  placeholder="Value (e.g., VLAN ID, bandwidth)"
                                  className="flex-1"
                                />

                                {isEditing && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const updatedActions = selectedPolicy.actions.filter(a => a.id !== action.id)
                                      setSelectedPolicy({ ...selectedPolicy, actions: updatedActions })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Policy Selected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Select a policy from the list to view and edit its details.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-semibold">Create New Policy</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Policy Name</label>
                    <Input
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                      placeholder="Enter policy name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newPolicy.description}
                      onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                      placeholder="Describe what this policy does"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <Select
                        value={newPolicy.type}
                        onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value as Policy['type'] })}
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

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <Input
                        type="number"
                        value={newPolicy.priority}
                        onChange={(e) => setNewPolicy({ ...newPolicy, priority: parseInt(e.target.value) })}
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newPolicy.enabled}
                      onCheckedChange={(checked) => setNewPolicy({ ...newPolicy, enabled: checked })}
                    />
                    <label className="text-sm font-medium">Enable policy immediately</label>
                  </div>

                  <Button onClick={createPolicy} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
