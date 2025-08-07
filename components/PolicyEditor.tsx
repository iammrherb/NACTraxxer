'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Plus, Edit, Copy, Trash2, Save, Download, X, Settings, Network, Shield, Users, Database } from 'lucide-react'

interface Policy {
  id: string
  name: string
  description: string
  type: 'user' | 'device' | 'network' | 'compliance'
  status: 'active' | 'inactive'
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  createdAt: string
  modifiedAt: string
}

interface PolicyCondition {
  id: string
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance_status' | 'certificate_status'
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in'
  value: string
  description: string
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'vlan_assignment' | 'bandwidth_limit' | 'time_limit'
  parameters: { [key: string]: any }
  description: string
}

interface VLAN {
  id: number
  name: string
  description: string
  subnet: string
  gateway: string
  accessLevel: 'full' | 'limited' | 'guest' | 'quarantine'
}

interface PolicyEditorProps {
  onClose: () => void
}

export default function PolicyEditor({ onClose }: PolicyEditorProps) {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'pol-001',
      name: 'Corporate Device Access',
      description: 'Full network access for managed corporate devices',
      type: 'device',
      status: 'active',
      priority: 1,
      conditions: [
        {
          id: 'cond-001',
          type: 'device_type',
          operator: 'equals',
          value: 'managed',
          description: 'Device is managed by Intune'
        },
        {
          id: 'cond-002',
          type: 'compliance_status',
          operator: 'equals',
          value: 'compliant',
          description: 'Device meets compliance requirements'
        }
      ],
      actions: [
        {
          id: 'act-001',
          type: 'vlan_assignment',
          parameters: { vlan_id: 100, vlan_name: 'Corporate' },
          description: 'Assign to corporate VLAN'
        },
        {
          id: 'act-002',
          type: 'allow',
          parameters: { access_level: 'full' },
          description: 'Grant full network access'
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      modifiedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'pol-002',
      name: 'Guest Access Policy',
      description: 'Limited internet access for guest devices',
      type: 'user',
      status: 'active',
      priority: 5,
      conditions: [
        {
          id: 'cond-003',
          type: 'user_group',
          operator: 'equals',
          value: 'guests',
          description: 'User is in guest group'
        }
      ],
      actions: [
        {
          id: 'act-003',
          type: 'vlan_assignment',
          parameters: { vlan_id: 200, vlan_name: 'Guest' },
          description: 'Assign to guest VLAN'
        },
        {
          id: 'act-004',
          type: 'bandwidth_limit',
          parameters: { download: '10Mbps', upload: '5Mbps' },
          description: 'Limit bandwidth usage'
        },
        {
          id: 'act-005',
          type: 'time_limit',
          parameters: { duration: '8 hours' },
          description: 'Session expires after 8 hours'
        }
      ],
      createdAt: '2024-01-15T11:00:00Z',
      modifiedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'pol-003',
      name: 'Non-Compliant Device Quarantine',
      description: 'Quarantine devices that fail compliance checks',
      type: 'compliance',
      status: 'active',
      priority: 2,
      conditions: [
        {
          id: 'cond-004',
          type: 'compliance_status',
          operator: 'equals',
          value: 'non_compliant',
          description: 'Device fails compliance check'
        }
      ],
      actions: [
        {
          id: 'act-006',
          type: 'quarantine',
          parameters: { remediation_url: 'https://remediation.company.com' },
          description: 'Quarantine with remediation portal'
        },
        {
          id: 'act-007',
          type: 'vlan_assignment',
          parameters: { vlan_id: 999, vlan_name: 'Quarantine' },
          description: 'Assign to quarantine VLAN'
        }
      ],
      createdAt: '2024-01-15T12:00:00Z',
      modifiedAt: '2024-01-15T12:00:00Z'
    }
  ])

  const [vlans, setVlans] = useState<VLAN[]>([
    { id: 100, name: 'Corporate', description: 'Full access for corporate devices', subnet: '10.1.100.0/24', gateway: '10.1.100.1', accessLevel: 'full' },
    { id: 200, name: 'Guest', description: 'Limited access for guest users', subnet: '10.1.200.0/24', gateway: '10.1.200.1', accessLevel: 'guest' },
    { id: 300, name: 'IoT', description: 'Isolated network for IoT devices', subnet: '10.1.300.0/24', gateway: '10.1.300.1', accessLevel: 'limited' },
    { id: 999, name: 'Quarantine', description: 'Restricted access for non-compliant devices', subnet: '10.1.999.0/24', gateway: '10.1.999.1', accessLevel: 'quarantine' }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showVlanDesigner, setShowVlanDesigner] = useState(false)
  const [newVlan, setNewVlan] = useState<Partial<VLAN>>({})

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: policy.status === 'active' ? 'inactive' : 'active', modifiedAt: new Date().toISOString() }
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
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
    setPolicies([...policies, newPolicy])
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(policy => policy.id !== policyId))
  }

  const savePolicy = () => {
    if (editingPolicy) {
      if (policies.find(p => p.id === editingPolicy.id)) {
        // Update existing policy
        setPolicies(policies.map(p => 
          p.id === editingPolicy.id 
            ? { ...editingPolicy, modifiedAt: new Date().toISOString() }
            : p
        ))
      } else {
        // Add new policy
        setPolicies([...policies, { ...editingPolicy, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() }])
      }
      setShowPolicyEditor(false)
      setEditingPolicy(null)
    }
  }

  const createNewPolicy = () => {
    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      name: 'New Policy',
      description: 'Policy description',
      type: 'user',
      status: 'inactive',
      priority: 10,
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
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
        value: '',
        description: 'New condition'
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
        parameters: {},
        description: 'New action'
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

  const exportToPNG = async () => {
    const element = document.querySelector('.policy-editor-content')
    if (!element) return

    try {
      // Create a canvas to render the content
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size
      canvas.width = 1200
      canvas.height = 800

      // Add white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add header
      ctx.fillStyle = '#00c8d7'
      ctx.fillRect(0, 0, canvas.width, 80)
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Portnox NAC Policy Editor', canvas.width / 2, 35)
      ctx.font = '14px Arial'
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, canvas.width / 2, 60)

      // Add policy content
      ctx.fillStyle = '#333'
      ctx.font = '16px Arial'
      ctx.textAlign = 'left'
      let yPos = 120

      policies.forEach((policy, index) => {
        if (yPos > canvas.height - 100) return // Prevent overflow

        // Policy header
        ctx.fillStyle = policy.status === 'active' ? '#10B981' : '#6B7280'
        ctx.fillRect(50, yPos, canvas.width - 100, 30)
        
        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px Arial'
        ctx.fillText(`${policy.name} (${policy.type})`, 60, yPos + 20)
        
        yPos += 40
        
        // Policy details
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.fillText(`Description: ${policy.description}`, 60, yPos)
        yPos += 20
        ctx.fillText(`Priority: ${policy.priority} | Status: ${policy.status}`, 60, yPos)
        yPos += 20
        ctx.fillText(`Conditions: ${policy.conditions.length} | Actions: ${policy.actions.length}`, 60, yPos)
        yPos += 40
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `nac-policies-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Failed to export PNG:', error)
    }
  }

  const exportToSVG = () => {
    const svgContent = `
      <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .header { fill: #00c8d7; }
            .header-text { fill: white; font-family: Arial, sans-serif; }
            .policy-active { fill: #10B981; }
            .policy-inactive { fill: #6B7280; }
            .text { fill: #333; font-family: Arial, sans-serif; }
            .text-white { fill: white; font-family: Arial, sans-serif; }
          </style>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="800" fill="white"/>
        
        <!-- Header -->
        <rect x="0" y="0" width="1200" height="80" class="header"/>
        <text x="600" y="35" textAnchor="middle" class="header-text" fontSize="24" fontWeight="bold">
          Portnox NAC Policy Editor
        </text>
        <text x="600" y="60" textAnchor="middle" class="header-text" fontSize="14">
          Generated on ${new Date().toLocaleDateString()}
        </text>
        
        <!-- Policies -->
        ${policies.map((policy, index) => {
          const yPos = 120 + (index * 120)
          if (yPos > 700) return '' // Prevent overflow
          
          return `
            <g>
              <rect x="50" y="${yPos}" width="1100" height="30" class="${policy.status === 'active' ? 'policy-active' : 'policy-inactive'}"/>
              <text x="60" y="${yPos + 20}" class="text-white" fontSize="14" fontWeight="bold">
                ${policy.name} (${policy.type})
              </text>
              <text x="60" y="${yPos + 45}" class="text" fontSize="12">
                Description: ${policy.description}
              </text>
              <text x="60" y="${yPos + 65}" class="text" fontSize="12">
                Priority: ${policy.priority} | Status: ${policy.status}
              </text>
              <text x="60" y="${yPos + 85}" class="text" fontSize="12">
                Conditions: ${policy.conditions.length} | Actions: ${policy.actions.length}
              </text>
            </g>
          `
        }).join('')}
      </svg>
    `

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nac-policies-${Date.now()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const addVlan = () => {
    if (newVlan.id && newVlan.name) {
      const vlan: VLAN = {
        id: newVlan.id,
        name: newVlan.name,
        description: newVlan.description || '',
        subnet: newVlan.subnet || '',
        gateway: newVlan.gateway || '',
        accessLevel: newVlan.accessLevel || 'limited'
      }
      setVlans([...vlans, vlan])
      setNewVlan({})
      setShowVlanDesigner(false)
    }
  }

  const getPolicyTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />
      case 'device': return <Database className="w-4 h-4" />
      case 'network': return <Network className="w-4 h-4" />
      case 'compliance': return <Shield className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">NAC Policy Editor</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportToPNG}>
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportToSVG}>
              <Download className="w-4 h-4 mr-2" />
              Export SVG
            </Button>
            <Button variant="outline" size="sm" onClick={exportPolicies}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowVlanDesigner(true)}>
              <Network className="w-4 h-4 mr-2" />
              VLAN Designer
            </Button>
            <Button variant="outline" size="sm" onClick={createNewPolicy}>
              <Plus className="w-4 h-4 mr-2" />
              New Policy
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="policy-editor-content h-full p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Policy Statistics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Policies</p>
                        <p className="text-2xl font-bold">{policies.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-2xl font-bold">{policies.filter(p => p.status === 'active').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Inactive</p>
                        <p className="text-2xl font-bold">{policies.filter(p => p.status === 'inactive').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Network className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">VLANs</p>
                        <p className="text-2xl font-bold">{vlans.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Policy List */}
              <Card>
                <CardHeader>
                  <CardTitle>Policy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Policy</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Conditions</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell>
                            <div>
                              <div className="flex items-center space-x-2">
                                {getPolicyTypeIcon(policy.type)}
                                <span className="font-medium">{policy.name}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{policy.type}</Badge>
                          </TableCell>
                          <TableCell>{policy.priority}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={policy.status === 'active'}
                                onCheckedChange={() => togglePolicyStatus(policy.id)}
                              />
                              <Badge variant={getStatusBadgeVariant(policy.status)}>
                                {policy.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{policy.conditions.length}</TableCell>
                          <TableCell>{policy.actions.length}</TableCell>
                          <TableCell>
                            {new Date(policy.modifiedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
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
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Policy Editor Dialog */}
        <Dialog open={showPolicyEditor} onOpenChange={setShowPolicyEditor}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy?.id.startsWith('pol-') && policies.find(p => p.id === editingPolicy.id) ? 'Edit Policy' : 'Create New Policy'}
              </DialogTitle>
              <DialogDescription>
                Configure policy conditions and actions for network access control.
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
                      <Label htmlFor="policy-priority">Priority (1-10)</Label>
                      <Input
                        id="policy-priority"
                        type="number"
                        min="1"
                        max="10"
                        value={editingPolicy.priority}
                        onChange={(e) => setEditingPolicy({...editingPolicy, priority: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="policy-status"
                        checked={editingPolicy.status === 'active'}
                        onCheckedChange={(checked) => 
                          setEditingPolicy({...editingPolicy, status: checked ? 'active' : 'inactive'})}
                      />
                      <Label htmlFor="policy-status">Active</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="conditions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Policy Conditions</h3>
                    <Button onClick={addCondition} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {editingPolicy.conditions.map((condition) => (
                      <Card key={condition.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-4 gap-4">
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
                                  <SelectItem value="certificate_status">Certificate Status</SelectItem>
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
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCondition(condition.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Description</Label>
                            <Input
                              value={condition.description}
                              onChange={(e) => updateCondition(condition.id, { description: e.target.value })}
                              placeholder="Condition description"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Policy Actions</h3>
                    <Button onClick={addAction} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Action
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {editingPolicy.actions.map((action) => (
                      <Card key={action.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-4">
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
                                  <SelectItem value="allow">Allow Access</SelectItem>
                                  <SelectItem value="deny">Deny Access</SelectItem>
                                  <SelectItem value="quarantine">Quarantine</SelectItem>
                                  <SelectItem value="vlan_assignment">VLAN Assignment</SelectItem>
                                  <SelectItem value="bandwidth_limit">Bandwidth Limit</SelectItem>
                                  <SelectItem value="time_limit">Time Limit</SelectItem>
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
                                placeholder='{"key": "value"}'
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Description</Label>
                            <Input
                              value={action.description}
                              onChange={(e) => updateAction(action.id, { description: e.target.value })}
                              placeholder="Action description"
                            />
                          </div>
                        </CardContent>
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
              <Button onClick={savePolicy}>
                <Save className="w-4 h-4 mr-2" />
                Save Policy
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* VLAN Designer Dialog */}
        <Dialog open={showVlanDesigner} onOpenChange={setShowVlanDesigner}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>VLAN Designer</DialogTitle>
              <DialogDescription>
                Create and manage VLANs for network segmentation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Existing VLANs */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Existing VLANs</h3>
                <div className="space-y-2">
                  {vlans.map((vlan) => (
                    <div key={vlan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">VLAN {vlan.id}</Badge>
                          <span className="font-medium">{vlan.name}</span>
                          <Badge variant={
                            vlan.accessLevel === 'full' ? 'default' :
                            vlan.accessLevel === 'limited' ? 'secondary' :
                            vlan.accessLevel === 'guest' ? 'outline' : 'destructive'
                          }>
                            {vlan.accessLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{vlan.description}</p>
                        <p className="text-xs text-gray-500">{vlan.subnet} → {vlan.gateway}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add New VLAN */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Add New VLAN</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vlan-id">VLAN ID</Label>
                    <Input
                      id="vlan-id"
                      type="number"
                      min="1"
                      max="4094"
                      value={newVlan.id || ''}
                      onChange={(e) => setNewVlan({...newVlan, id: parseInt(e.target.value) || undefined})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vlan-name">VLAN Name</Label>
                    <Input
                      id="vlan-name"
                      value={newVlan.name || ''}
                      onChange={(e) => setNewVlan({...newVlan, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="vlan-description">Description</Label>
                  <Input
                    id="vlan-description"
                    value={newVlan.description || ''}
                    onChange={(e) => setNewVlan({...newVlan, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="vlan-subnet">Subnet</Label>
                    <Input
                      id="vlan-subnet"
                      value={newVlan.subnet || ''}
                      onChange={(e) => setNewVlan({...newVlan, subnet: e.target.value})}
                      placeholder="10.1.100.0/24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vlan-gateway">Gateway</Label>
                    <Input
                      id="vlan-gateway"
                      value={newVlan.gateway || ''}
                      onChange={(e) => setNewVlan({...newVlan, gateway: e.target.value})}
                      placeholder="10.1.100.1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="vlan-access">Access Level</Label>
                  <Select
                    value={newVlan.accessLevel || 'limited'}
                    onValueChange={(value: 'full' | 'limited' | 'guest' | 'quarantine') => 
                      setNewVlan({...newVlan, accessLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="guest">Guest Access</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowVlanDesigner(false)}>
                Close
              </Button>
              <Button onClick={addVlan} disabled={!newVlan.id || !newVlan.name}>
                <Plus className="w-4 h-4 mr-2" />
                Add VLAN
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
