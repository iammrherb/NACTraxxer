'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Copy, Trash2, Download, Save, Network, Shield, Users, Settings } from 'lucide-react'

interface Policy {
  id: string
  name: string
  description: string
  type: 'user' | 'device' | 'network' | 'compliance'
  status: 'active' | 'inactive' | 'draft'
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  createdAt: string
  updatedAt: string
}

interface PolicyCondition {
  id: string
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance_status' | 'certificate'
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in'
  value: string | string[]
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'vlan_assignment' | 'bandwidth_limit' | 'redirect'
  parameters: { [key: string]: any }
}

interface VLAN {
  id: number
  name: string
  description: string
  subnet: string
  gateway: string
  access: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'pol-001',
      name: 'Corporate Devices Full Access',
      description: 'Full network access for managed corporate devices',
      type: 'device',
      status: 'active',
      priority: 1,
      conditions: [
        {
          id: 'cond-001',
          type: 'device_type',
          operator: 'equals',
          value: 'managed'
        },
        {
          id: 'cond-002',
          type: 'compliance_status',
          operator: 'equals',
          value: 'compliant'
        }
      ],
      actions: [
        {
          id: 'act-001',
          type: 'vlan_assignment',
          parameters: { vlan_id: 100, vlan_name: 'Corporate' }
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'pol-002',
      name: 'Guest Network Access',
      description: 'Limited internet access for guest devices',
      type: 'user',
      status: 'active',
      priority: 2,
      conditions: [
        {
          id: 'cond-003',
          type: 'user_group',
          operator: 'equals',
          value: 'guests'
        }
      ],
      actions: [
        {
          id: 'act-002',
          type: 'vlan_assignment',
          parameters: { vlan_id: 200, vlan_name: 'Guest' }
        },
        {
          id: 'act-003',
          type: 'bandwidth_limit',
          parameters: { download: '10Mbps', upload: '5Mbps' }
        }
      ],
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'pol-003',
      name: 'IoT Device Isolation',
      description: 'Isolated network access for IoT devices',
      type: 'device',
      status: 'active',
      priority: 3,
      conditions: [
        {
          id: 'cond-004',
          type: 'device_type',
          operator: 'equals',
          value: 'iot'
        }
      ],
      actions: [
        {
          id: 'act-004',
          type: 'vlan_assignment',
          parameters: { vlan_id: 300, vlan_name: 'IoT' }
        }
      ],
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z'
    },
    {
      id: 'pol-004',
      name: 'Non-Compliant Quarantine',
      description: 'Quarantine non-compliant devices',
      type: 'compliance',
      status: 'active',
      priority: 4,
      conditions: [
        {
          id: 'cond-005',
          type: 'compliance_status',
          operator: 'equals',
          value: 'non_compliant'
        }
      ],
      actions: [
        {
          id: 'act-005',
          type: 'quarantine',
          parameters: { vlan_id: 999, vlan_name: 'Quarantine' }
        }
      ],
      createdAt: '2024-01-15T13:00:00Z',
      updatedAt: '2024-01-15T13:00:00Z'
    }
  ])

  const [vlans, setVlans] = useState<VLAN[]>([
    { id: 100, name: 'Corporate', description: 'Full access for corporate devices', subnet: '10.1.100.0/24', gateway: '10.1.100.1', access: 'Full Network Access' },
    { id: 200, name: 'Guest', description: 'Limited access for guest devices', subnet: '10.1.200.0/24', gateway: '10.1.200.1', access: 'Internet Only' },
    { id: 300, name: 'IoT', description: 'Isolated network for IoT devices', subnet: '10.1.300.0/24', gateway: '10.1.300.1', access: 'IoT Services Only' },
    { id: 999, name: 'Quarantine', description: 'Restricted access for non-compliant devices', subnet: '10.1.999.0/24', gateway: '10.1.999.1', access: 'Remediation Portal Only' }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showVlanDesigner, setShowVlanDesigner] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [newVlan, setNewVlan] = useState<VLAN>({
    id: 0,
    name: '',
    description: '',
    subnet: '',
    gateway: '',
    access: ''
  })

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: policy.status === 'active' ? 'inactive' : 'active' }
        : policy
    ))
  }

  const editPolicy = (policy: Policy) => {
    setEditingPolicy({ ...policy })
    setShowPolicyEditor(true)
  }

  const copyPolicy = (policy: Policy) => {
    const newPolicy: Policy = {
      ...policy,
      id: `pol-${Date.now()}`,
      name: `${policy.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPolicies([...policies, newPolicy])
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(policy => policy.id !== policyId))
  }

  const savePolicyChanges = () => {
    if (editingPolicy) {
      if (editingPolicy.id.startsWith('new-')) {
        // New policy
        const newPolicy = {
          ...editingPolicy,
          id: `pol-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setPolicies([...policies, newPolicy])
      } else {
        // Update existing policy
        setPolicies(policies.map(policy => 
          policy.id === editingPolicy.id 
            ? { ...editingPolicy, updatedAt: new Date().toISOString() }
            : policy
        ))
      }
      setShowPolicyEditor(false)
      setEditingPolicy(null)
    }
  }

  const createNewPolicy = () => {
    const newPolicy: Policy = {
      id: 'new-policy',
      name: 'New Policy',
      description: '',
      type: 'user',
      status: 'draft',
      priority: policies.length + 1,
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingPolicy(newPolicy)
    setShowPolicyEditor(true)
  }

  const addCondition = () => {
    if (editingPolicy) {
      const newCondition: PolicyCondition = {
        id: `cond-${Date.now()}`,
        type: 'user_group',
        operator: 'equals',
        value: ''
      }
      setEditingPolicy({
        ...editingPolicy,
        conditions: [...editingPolicy.conditions, newCondition]
      })
    }
  }

  const addAction = () => {
    if (editingPolicy) {
      const newAction: PolicyAction = {
        id: `act-${Date.now()}`,
        type: 'allow',
        parameters: {}
      }
      setEditingPolicy({
        ...editingPolicy,
        actions: [...editingPolicy.actions, newAction]
      })
    }
  }

  const removeCondition = (conditionId: string) => {
    if (editingPolicy) {
      setEditingPolicy({
        ...editingPolicy,
        conditions: editingPolicy.conditions.filter(c => c.id !== conditionId)
      })
    }
  }

  const removeAction = (actionId: string) => {
    if (editingPolicy) {
      setEditingPolicy({
        ...editingPolicy,
        actions: editingPolicy.actions.filter(a => a.id !== actionId)
      })
    }
  }

  const updateCondition = (conditionId: string, updates: Partial<PolicyCondition>) => {
    if (editingPolicy) {
      setEditingPolicy({
        ...editingPolicy,
        conditions: editingPolicy.conditions.map(c => 
          c.id === conditionId ? { ...c, ...updates } : c
        )
      })
    }
  }

  const updateAction = (actionId: string, updates: Partial<PolicyAction>) => {
    if (editingPolicy) {
      setEditingPolicy({
        ...editingPolicy,
        actions: editingPolicy.actions.map(a => 
          a.id === actionId ? { ...a, ...updates } : a
        )
      })
    }
  }

  const saveVlan = () => {
    if (newVlan.id === 0) {
      // Generate new VLAN ID
      const maxId = Math.max(...vlans.map(v => v.id))
      const vlan = { ...newVlan, id: maxId + 1 }
      setVlans([...vlans, vlan])
    } else {
      // Update existing VLAN
      setVlans(vlans.map(v => v.id === newVlan.id ? newVlan : v))
    }
    setNewVlan({ id: 0, name: '', description: '', subnet: '', gateway: '', access: '' })
    setShowVlanDesigner(false)
  }

  const exportPolicies = () => {
    const dataStr = JSON.stringify(policies, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nac-policies-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getPolicyTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />
      case 'device': return <Settings className="w-4 h-4" />
      case 'network': return <Network className="w-4 h-4" />
      case 'compliance': return <Shield className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policy Management</h2>
          <p className="text-gray-600">Create and manage NAC policies for network access control</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={createNewPolicy}>
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
          <Dialog open={showVlanDesigner} onOpenChange={setShowVlanDesigner}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Network className="w-4 h-4 mr-2" />
                VLAN Designer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>VLAN Designer</DialogTitle>
                <DialogDescription>
                  Create and configure VLANs for network segmentation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vlan-id">VLAN ID</Label>
                    <Input
                      id="vlan-id"
                      type="number"
                      value={newVlan.id || ''}
                      onChange={(e) => setNewVlan({...newVlan, id: parseInt(e.target.value) || 0})}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vlan-name">VLAN Name</Label>
                    <Input
                      id="vlan-name"
                      value={newVlan.name}
                      onChange={(e) => setNewVlan({...newVlan, name: e.target.value})}
                      placeholder="Corporate"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vlan-description">Description</Label>
                  <Input
                    id="vlan-description"
                    value={newVlan.description}
                    onChange={(e) => setNewVlan({...newVlan, description: e.target.value})}
                    placeholder="Full access for corporate devices"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vlan-subnet">Subnet</Label>
                    <Input
                      id="vlan-subnet"
                      value={newVlan.subnet}
                      onChange={(e) => setNewVlan({...newVlan, subnet: e.target.value})}
                      placeholder="10.1.100.0/24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vlan-gateway">Gateway</Label>
                    <Input
                      id="vlan-gateway"
                      value={newVlan.gateway}
                      onChange={(e) => setNewVlan({...newVlan, gateway: e.target.value})}
                      placeholder="10.1.100.1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vlan-access">Access Level</Label>
                  <Input
                    id="vlan-access"
                    value={newVlan.access}
                    onChange={(e) => setNewVlan({...newVlan, access: e.target.value})}
                    placeholder="Full Network Access"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowVlanDesigner(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveVlan}>
                    <Save className="w-4 h-4 mr-2" />
                    Save VLAN
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={exportPolicies}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Policy List */}
      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPolicyTypeIcon(policy.type)}
                  <div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(policy.status)}>
                    {policy.status}
                  </Badge>
                  <Badge variant="outline">
                    Priority {policy.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium">{policy.conditions.length}</span> conditions
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{policy.actions.length}</span> actions
                  </div>
                  <div className="text-sm text-gray-500">
                    Updated {new Date(policy.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={policy.status === 'active'}
                    onCheckedChange={() => togglePolicyStatus(policy.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editPolicy(policy)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyPolicy(policy)}
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Policy Editor Dialog */}
      <Dialog open={showPolicyEditor} onOpenChange={setShowPolicyEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPolicy?.id.startsWith('new-') ? 'Create New Policy' : 'Edit Policy'}
            </DialogTitle>
            <DialogDescription>
              Configure policy conditions and actions for network access control
            </DialogDescription>
          </DialogHeader>
          {editingPolicy && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policy-name">Policy Name</Label>
                    <Input
                      id="policy-name"
                      value={editingPolicy.name}
                      onChange={(e) => setEditingPolicy({...editingPolicy, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy-type">Policy Type</Label>
                    <Select
                      value={editingPolicy.type}
                      onValueChange={(value: 'user' | 'device' | 'network' | 'compliance') => 
                        setEditingPolicy({...editingPolicy, type: value})}
                    >
                      <SelectTrigger>
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
                <div>
                  <Label htmlFor="policy-description">Description</Label>
                  <Textarea
                    id="policy-description"
                    value={editingPolicy.description}
                    onChange={(e) => setEditingPolicy({...editingPolicy, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policy-priority">Priority</Label>
                    <Input
                      id="policy-priority"
                      type="number"
                      value={editingPolicy.priority}
                      onChange={(e) => setEditingPolicy({...editingPolicy, priority: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy-status">Status</Label>
                    <Select
                      value={editingPolicy.status}
                      onValueChange={(value: 'active' | 'inactive' | 'draft') => 
                        setEditingPolicy({...editingPolicy, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Policy Conditions</h4>
                  <Button onClick={addCondition} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
                <div className="space-y-3">
                  {editingPolicy.conditions.map((condition, index) => (
                    <Card key={condition.id} className="p-4">
                      <div className="grid grid-cols-4 gap-4 items-end">
                        <div>
                          <Label>Condition Type</Label>
                          <Select
                            value={condition.type}
                            onValueChange={(value: any) => updateCondition(condition.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user_group">User Group</SelectItem>
                              <SelectItem value="device_type">Device Type</SelectItem>
                              <SelectItem value="location">Location</SelectItem>
                              <SelectItem value="time">Time</SelectItem>
                              <SelectItem value="compliance_status">Compliance Status</SelectItem>
                              <SelectItem value="certificate">Certificate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value: any) => updateCondition(condition.id, { operator: value })}
                          >
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
                          <Input
                            value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                            placeholder="Enter value"
                          />
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCondition(condition.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Policy Actions</h4>
                  <Button onClick={addAction} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Action
                  </Button>
                </div>
                <div className="space-y-3">
                  {editingPolicy.actions.map((action, index) => (
                    <Card key={action.id} className="p-4">
                      <div className="grid grid-cols-3 gap-4 items-end">
                        <div>
                          <Label>Action Type</Label>
                          <Select
                            value={action.type}
                            onValueChange={(value: any) => updateAction(action.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="allow">Allow</SelectItem>
                              <SelectItem value="deny">Deny</SelectItem>
                              <SelectItem value="quarantine">Quarantine</SelectItem>
                              <SelectItem value="vlan_assignment">VLAN Assignment</SelectItem>
                              <SelectItem value="bandwidth_limit">Bandwidth Limit</SelectItem>
                              <SelectItem value="redirect">Redirect</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Parameters</Label>
                          <Input
                            value={JSON.stringify(action.parameters)}
                            onChange={(e) => {
                              try {
                                const params = JSON.parse(e.target.value)
                                updateAction(action.id, { parameters: params })
                              } catch (error) {
                                // Invalid JSON, ignore
                              }
                            }}
                            placeholder='{"vlan_id": 100}'
                          />
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAction(action.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowPolicyEditor(false)}>
              Cancel
            </Button>
            <Button onClick={savePolicyChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Policy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
