'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Save, Trash2, Copy, Download, Upload } from 'lucide-react'

interface PolicyEditorProps {
  onClose: () => void
}

interface Policy {
  id: string
  name: string
  type: 'user' | 'device' | 'network' | 'compliance'
  priority: number
  conditions: string[]
  actions: string[]
  vlan: number
  description: string
  enabled: boolean
  template?: string
}

export default function PolicyEditor({ onClose }: PolicyEditorProps) {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Windows Devices',
      type: 'device',
      priority: 1,
      conditions: ['Device Type: Windows', 'Certificate Present: True', 'Domain Joined: True'],
      actions: ['Allow Access', 'Assign VLAN 100', 'Apply Corporate ACL'],
      vlan: 100,
      description: 'Policy for corporate Windows devices with valid certificates',
      enabled: true,
      template: 'corporate-device'
    },
    {
      id: '2',
      name: 'Guest Access',
      type: 'user',
      priority: 3,
      conditions: ['User Group: Guests', 'Sponsor Approval: Required', 'Time Limit: 8 hours'],
      actions: ['Limited Access', 'Assign VLAN 200', 'Apply Guest ACL', 'Bandwidth Limit: 10Mbps'],
      vlan: 200,
      description: 'Temporary access for guest users with sponsor approval',
      enabled: true,
      template: 'guest-access'
    },
    {
      id: '3',
      name: 'IoT Devices',
      type: 'device',
      priority: 2,
      conditions: ['Authentication: MAC', 'Device Category: IoT', 'Certificate: Not Required'],
      actions: ['Allow Access', 'Assign VLAN 300', 'Apply IoT ACL', 'Bandwidth Limit: 5Mbps'],
      vlan: 300,
      description: 'Policy for IoT devices using MAC authentication bypass',
      enabled: true,
      template: 'iot-device'
    },
    {
      id: '4',
      name: 'BYOD Mobile Devices',
      type: 'device',
      priority: 4,
      conditions: ['Device Type: Mobile', 'MDM Enrolled: True', 'Compliance Status: Compliant'],
      actions: ['Allow Access', 'Assign VLAN 400', 'Apply BYOD ACL'],
      vlan: 400,
      description: 'Policy for personal mobile devices enrolled in MDM',
      enabled: false,
      template: 'byod-mobile'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const policyTemplates = [
    { id: 'corporate-device', name: 'Corporate Device', description: 'Standard corporate endpoint policy' },
    { id: 'guest-access', name: 'Guest Access', description: 'Temporary guest user access' },
    { id: 'iot-device', name: 'IoT Device', description: 'Internet of Things device policy' },
    { id: 'byod-mobile', name: 'BYOD Mobile', description: 'Bring Your Own Device mobile policy' },
    { id: 'contractor', name: 'Contractor Access', description: 'External contractor access policy' },
    { id: 'server-access', name: 'Server Access', description: 'Server and infrastructure access' }
  ]

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy({ ...policy })
    setIsEditing(true)
  }

  const handleSavePolicy = () => {
    if (!selectedPolicy) return

    if (selectedPolicy.id === 'new') {
      const newPolicy = {
        ...selectedPolicy,
        id: Date.now().toString()
      }
      setPolicies([...policies, newPolicy])
    } else {
      setPolicies(policies.map(p => p.id === selectedPolicy.id ? selectedPolicy : p))
    }

    setSelectedPolicy(null)
    setIsEditing(false)
    showNotification('Policy saved successfully!', 'success')
  }

  const handleDeletePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id))
    if (selectedPolicy?.id === id) {
      setSelectedPolicy(null)
      setIsEditing(false)
    }
    showNotification('Policy deleted successfully!', 'success')
  }

  const handleDuplicatePolicy = (policy: Policy) => {
    const duplicatedPolicy = {
      ...policy,
      id: Date.now().toString(),
      name: `${policy.name} (Copy)`,
      enabled: false
    }
    setPolicies([...policies, duplicatedPolicy])
    showNotification('Policy duplicated successfully!', 'success')
  }

  const handleAddPolicy = (templateId?: string) => {
    const template = policyTemplates.find(t => t.id === templateId)
    const newPolicy: Policy = {
      id: 'new',
      name: template ? template.name : 'New Policy',
      type: 'user',
      priority: policies.length + 1,
      conditions: [],
      actions: [],
      vlan: 100,
      description: template ? template.description : '',
      enabled: true,
      template: templateId
    }

    // Apply template defaults
    if (templateId) {
      switch (templateId) {
        case 'corporate-device':
          newPolicy.type = 'device'
          newPolicy.conditions = ['Device Type: Windows', 'Certificate Present: True']
          newPolicy.actions = ['Allow Access', 'Assign VLAN 100']
          newPolicy.vlan = 100
          break
        case 'guest-access':
          newPolicy.type = 'user'
          newPolicy.conditions = ['User Group: Guests', 'Sponsor Approval: Required']
          newPolicy.actions = ['Limited Access', 'Assign VLAN 200']
          newPolicy.vlan = 200
          break
        case 'iot-device':
          newPolicy.type = 'device'
          newPolicy.conditions = ['Authentication: MAC', 'Device Category: IoT']
          newPolicy.actions = ['Allow Access', 'Assign VLAN 300']
          newPolicy.vlan = 300
          break
      }
    }

    setSelectedPolicy(newPolicy)
    setIsEditing(true)
  }

  const handleTogglePolicy = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const handleExportPolicies = () => {
    const exportData = {
      policies,
      exportDate: new Date().toISOString(),
      version: '20.0'
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
    
    showNotification('Policies exported successfully!', 'success')
  }

  const addCondition = () => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: [...selectedPolicy.conditions, '']
    })
  }

  const updateCondition = (index: number, value: string) => {
    if (!selectedPolicy) return
    const newConditions = [...selectedPolicy.conditions]
    newConditions[index] = value
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: newConditions
    })
  }

  const removeCondition = (index: number) => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      conditions: selectedPolicy.conditions.filter((_, i) => i !== index)
    })
  }

  const addAction = () => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      actions: [...selectedPolicy.actions, '']
    })
  }

  const updateAction = (index: number, value: string) => {
    if (!selectedPolicy) return
    const newActions = [...selectedPolicy.actions]
    newActions[index] = value
    setSelectedPolicy({
      ...selectedPolicy,
      actions: newActions
    })
  }

  const removeAction = (index: number) => {
    if (!selectedPolicy) return
    setSelectedPolicy({
      ...selectedPolicy,
      actions: selectedPolicy.actions.filter((_, i) => i !== index)
    })
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full max-w-7xl mx-auto max-h-[90vh] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-xl">NAC Policy Editor</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage network access control policies and rules
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPolicies}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(90vh-120px)]">
          {/* Policy List */}
          <div className="border-r overflow-y-auto">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Policies ({filteredPolicies.length})</h3>
                <div className="flex items-center space-x-2">
                  <Select onValueChange={(value) => handleAddPolicy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Add from template" />
                    </SelectTrigger>
                    <SelectContent>
                      {policyTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleAddPolicy()} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Policy
                  </Button>
                </div>
              </div>
              
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="p-4 space-y-3">
              {filteredPolicies.map((policy) => (
                <Card 
                  key={policy.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPolicy?.id === policy.id ? 'ring-2 ring-[#00c8d7] shadow-md' : ''
                  }`}
                  onClick={() => handleEditPolicy(policy)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-sm">{policy.name}</h4>
                          <Switch
                            checked={policy.enabled}
                            onCheckedChange={() => handleTogglePolicy(policy.id)}
                            onClick={(e) => e.stopPropagation()}
                            size="sm"
                          />
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {policy.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge 
                            variant={policy.enabled ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {policy.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority {policy.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {policy.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            VLAN {policy.vlan}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {policy.conditions.length} conditions, {policy.actions.length} actions
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicatePolicy(policy)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePolicy(policy.id)
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Policy Editor */}
          <div className="overflow-y-auto">
            {isEditing && selectedPolicy ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {selectedPolicy.id === 'new' ? 'Create New Policy' : 'Edit Policy'}
                  </h3>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePolicy} className="bg-[#00c8d7] hover:bg-[#0099cc]">
                      <Save className="h-4 w-4 mr-2" />
                      Save Policy
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-name">Policy Name *</Label>
                      <Input
                        id="policy-name"
                        value={selectedPolicy.name}
                        onChange={(e) => setSelectedPolicy({
                          ...selectedPolicy,
                          name: e.target.value
                        })}
                        placeholder="Enter policy name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-type">Policy Type</Label>
                      <Select
                        value={selectedPolicy.type}
                        onValueChange={(value: 'user' | 'device' | 'network' | 'compliance') =>
                          setSelectedPolicy({
                            ...selectedPolicy,
                            type: value
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User-based</SelectItem>
                          <SelectItem value="device">Device-based</SelectItem>
                          <SelectItem value="network">Network-based</SelectItem>
                          <SelectItem value="compliance">Compliance-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-priority">Priority (1-10)</Label>
                      <Input
                        id="policy-priority"
                        type="number"
                        value={selectedPolicy.priority}
                        onChange={(e) => setSelectedPolicy({
                          ...selectedPolicy,
                          priority: parseInt(e.target.value) || 1
                        })}
                        min="1"
                        max="10"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-vlan">VLAN Assignment</Label>
                      <Input
                        id="policy-vlan"
                        type="number"
                        value={selectedPolicy.vlan}
                        onChange={(e) => setSelectedPolicy({
                          ...selectedPolicy,
                          vlan: parseInt(e.target.value) || 100
                        })}
                        min="1"
                        max="4094"
                        className="mt-1"
                      />
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
                      placeholder="Enter policy description"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Conditions</Label>
                      <Button variant="outline" size="sm" onClick={addCondition}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedPolicy.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={condition}
                            onChange={(e) => updateCondition(index, e.target.value)}
                            placeholder="Enter condition (e.g., Device Type: Windows)"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedPolicy.conditions.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          No conditions defined. Click "Add Condition" to add rules.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Actions</Label>
                      <Button variant="outline" size="sm" onClick={addAction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedPolicy.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={action}
                            onChange={(e) => updateAction(index, e.target.value)}
                            placeholder="Enter action (e.g., Allow Access)"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAction(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedPolicy.actions.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          No actions defined. Click "Add Action" to specify what happens when conditions are met.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Policy Status */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedPolicy.enabled}
                      onCheckedChange={(checked) => setSelectedPolicy({
                        ...selectedPolicy,
                        enabled: checked
                      })}
                    />
                    <Label>Enable this policy</Label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">No Policy Selected</div>
                  <div className="text-sm">
                    Select a policy from the list to edit, or create a new one
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
