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
import { Shield, Users, Smartphone, Network, Plus, Edit, Trash2, Copy, Save, Download, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Policy {
  id: string
  name: string
  type: 'user' | 'device' | 'network' | 'application'
  status: 'active' | 'inactive' | 'draft'
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  description: string
  createdAt: string
  updatedAt: string
}

interface PolicyCondition {
  id: string
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance' | 'certificate'
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in'
  value: string
  description: string
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'redirect' | 'notify'
  parameters: { [key: string]: string }
  description: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Device Access',
      type: 'device',
      status: 'active',
      priority: 1,
      conditions: [
        {
          id: '1',
          type: 'device_type',
          operator: 'in',
          value: 'Windows,macOS,iOS,Android',
          description: 'Corporate managed devices'
        },
        {
          id: '2',
          type: 'compliance',
          operator: 'equals',
          value: 'compliant',
          description: 'Device must be compliant'
        }
      ],
      actions: [
        {
          id: '1',
          type: 'allow',
          parameters: { vlan: '100', bandwidth: 'unlimited' },
          description: 'Full network access'
        }
      ],
      description: 'Allow full access for compliant corporate devices',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      name: 'Guest Device Quarantine',
      type: 'device',
      status: 'active',
      priority: 2,
      conditions: [
        {
          id: '3',
          type: 'user_group',
          operator: 'equals',
          value: 'Guests',
          description: 'Guest users'
        }
      ],
      actions: [
        {
          id: '2',
          type: 'quarantine',
          parameters: { vlan: '200', bandwidth: '10Mbps' },
          description: 'Limited guest access'
        }
      ],
      description: 'Quarantine guest devices with limited access',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T11:15:00Z'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('policies')

  const policyTemplates = [
    {
      id: 'corporate-byod',
      name: 'Corporate BYOD Policy',
      description: 'Standard policy for bring-your-own-device scenarios',
      type: 'device' as const,
      conditions: [
        { type: 'user_group', operator: 'in', value: 'Employees,Contractors', description: 'Authorized users' },
        { type: 'certificate', operator: 'equals', value: 'valid', description: 'Valid certificate required' }
      ],
      actions: [
        { type: 'allow', parameters: { vlan: '150', bandwidth: '50Mbps' }, description: 'Limited corporate access' }
      ]
    },
    {
      id: 'iot-devices',
      name: 'IoT Device Policy',
      description: 'Policy for Internet of Things devices',
      type: 'device' as const,
      conditions: [
        { type: 'device_type', operator: 'in', value: 'IoT,Sensor,Camera', description: 'IoT device types' },
        { type: 'location', operator: 'in', value: 'Building-A,Building-B', description: 'Authorized locations' }
      ],
      actions: [
        { type: 'allow', parameters: { vlan: '300', bandwidth: '5Mbps' }, description: 'IoT network access' }
      ]
    },
    {
      id: 'time-based',
      name: 'Time-Based Access Policy',
      description: 'Access control based on time of day',
      type: 'user' as const,
      conditions: [
        { type: 'time', operator: 'in', value: '08:00-18:00', description: 'Business hours only' },
        { type: 'user_group', operator: 'equals', value: 'Employees', description: 'Employee access' }
      ],
      actions: [
        { type: 'allow', parameters: { vlan: '100' }, description: 'Full access during business hours' }
      ]
    }
  ]

  const conditionTypes = [
    { value: 'user_group', label: 'User Group', icon: <Users className="w-4 h-4" /> },
    { value: 'device_type', label: 'Device Type', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'location', label: 'Location', icon: <Network className="w-4 h-4" /> },
    { value: 'time', label: 'Time', icon: <Clock className="w-4 h-4" /> },
    { value: 'compliance', label: 'Compliance', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'certificate', label: 'Certificate', icon: <Shield className="w-4 h-4" /> }
  ]

  const actionTypes = [
    { value: 'allow', label: 'Allow', color: 'bg-green-500' },
    { value: 'deny', label: 'Deny', color: 'bg-red-500' },
    { value: 'quarantine', label: 'Quarantine', color: 'bg-yellow-500' },
    { value: 'redirect', label: 'Redirect', color: 'bg-blue-500' },
    { value: 'notify', label: 'Notify', color: 'bg-purple-500' }
  ]

  const createPolicyFromTemplate = (template: typeof policyTemplates[0]) => {
    const newPolicy: Policy = {
      id: Date.now().toString(),
      name: template.name,
      type: template.type,
      status: 'draft',
      priority: policies.length + 1,
      conditions: template.conditions.map((cond, index) => ({
        id: `${Date.now()}-${index}`,
        type: cond.type as PolicyCondition['type'],
        operator: cond.operator as PolicyCondition['operator'],
        value: cond.value,
        description: cond.description
      })),
      actions: template.actions.map((action, index) => ({
        id: `${Date.now()}-${index}`,
        type: action.type as PolicyAction['type'],
        parameters: action.parameters,
        description: action.description
      })),
      description: template.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPolicies([...policies, newPolicy])
    setSelectedPolicy(newPolicy)
    setIsEditing(true)
  }

  const duplicatePolicy = (policy: Policy) => {
    const newPolicy: Policy = {
      ...policy,
      id: Date.now().toString(),
      name: `${policy.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPolicies([...policies, newPolicy])
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId))
    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy(null)
      setIsEditing(false)
    }
  }

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
        : p
    ))
  }

  const exportPolicies = () => {
    const exportData = {
      policies,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-policies-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: Policy['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'draft': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'text-red-600'
    if (priority <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Policy Management</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportPolicies}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="templates">Policy Templates</TabsTrigger>
          <TabsTrigger value="editor">Policy Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(policy.status)}`} />
                        <h3 className="font-semibold">{policy.name}</h3>
                        <Badge variant="outline" className={getPriorityColor(policy.priority)}>
                          Priority {policy.priority}
                        </Badge>
                        <Badge variant="secondary">
                          {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={policy.status === 'active'}
                          onCheckedChange={() => togglePolicyStatus(policy.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPolicy(policy)
                            setIsEditing(true)
                            setActiveTab('editor')
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicatePolicy(policy)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePolicy(policy.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{policy.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Conditions ({policy.conditions.length})</h4>
                        <div className="space-y-1">
                          {policy.conditions.slice(0, 2).map((condition) => (
                            <div key={condition.id} className="text-sm text-gray-600">
                              • {condition.description}
                            </div>
                          ))}
                          {policy.conditions.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{policy.conditions.length - 2} more conditions
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Actions ({policy.actions.length})</h4>
                        <div className="space-y-1">
                          {policy.actions.map((action) => (
                            <div key={action.id} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${actionTypes.find(a => a.value === action.type)?.color}`} />
                              <span className="text-sm text-gray-600">{action.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Updated: {new Date(policy.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policyTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-medium text-gray-700">Conditions:</div>
                      {template.conditions.map((condition, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {condition.description}
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => createPolicyFromTemplate(template)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {selectedPolicy ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Policy' : 'View Policy'}: {selectedPolicy.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="policy-name">Policy Name</Label>
                      <Input
                        id="policy-name"
                        value={selectedPolicy.name}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy-type">Policy Type</Label>
                      <Select value={selectedPolicy.type} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User Policy</SelectItem>
                          <SelectItem value="device">Device Policy</SelectItem>
                          <SelectItem value="network">Network Policy</SelectItem>
                          <SelectItem value="application">Application Policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policy-description">Description</Label>
                    <Textarea
                      id="policy-description"
                      value={selectedPolicy.description}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Conditions</h3>
                      {isEditing && (
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Condition
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedPolicy.conditions.map((condition) => (
                        <div key={condition.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label>Type</Label>
                              <Select value={condition.type} disabled={!isEditing}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionTypes.map((type) => (
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
                            <div>
                              <Label>Operator</Label>
                              <Select value={condition.operator} disabled={!isEditing}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="not_equals">Not Equals</SelectItem>
                                  <SelectItem value="contains">Contains</SelectItem>
                                  <SelectItem value="in">In</SelectItem>
                                  <SelectItem value="not_in">Not In</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Value</Label>
                              <Input value={condition.value} disabled={!isEditing} />
                            </div>
                            <div className="flex items-end">
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Description</Label>
                            <Input value={condition.description} disabled={!isEditing} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Actions</h3>
                      {isEditing && (
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Action
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedPolicy.actions.map((action) => (
                        <div key={action.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Action Type</Label>
                              <Select value={action.type} disabled={!isEditing}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {actionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                                        <span>{type.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Parameters</Label>
                              <Input 
                                value={JSON.stringify(action.parameters)} 
                                disabled={!isEditing} 
                                placeholder="JSON parameters"
                              />
                            </div>
                            <div className="flex items-end">
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Description</Label>
                            <Input value={action.description} disabled={!isEditing} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Policy
                        </Button>
                      ) : (
                        <>
                          <Button>
                            <Save className="w-4 h-4 mr-1" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => duplicatePolicy(selectedPolicy)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Policy Selected</h3>
                <p className="text-gray-500 mb-4">Select a policy from the Active Policies tab or create one from a template</p>
                <Button onClick={() => setActiveTab('policies')}>
                  View Policies
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
