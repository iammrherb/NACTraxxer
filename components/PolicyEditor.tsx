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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Shield, Users, Smartphone, Network, Plus, Edit, Trash2, Copy, Save, Download, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Policy {
  id: string
  name: string
  type: 'user' | 'device' | 'network' | 'application' | 'vlan' | 'compliance'
  status: 'active' | 'inactive' | 'draft'
  priority: number
  conditions: PolicyCondition[]
  actions: PolicyAction[]
  description: string
  createdAt: string
  updatedAt: string
  vlanAssignment?: VLANAssignment
  complianceRules?: ComplianceRule[]
}

interface PolicyCondition {
  id: string
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance' | 'certificate' | 'intune_compliance' | 'risk_score'
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than'
  value: string
  description: string
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'redirect' | 'notify' | 'vlan_assign' | 'bandwidth_limit' | 'remediate'
  parameters: { [key: string]: string }
  description: string
}

interface VLANAssignment {
  vlanId: number
  vlanName: string
  subnet: string
  gateway: string
  accessLevel: 'full' | 'limited' | 'internet_only' | 'quarantine'
  bandwidth?: string
}

interface ComplianceRule {
  id: string
  name: string
  type: 'antivirus' | 'encryption' | 'os_version' | 'patch_level' | 'jailbreak' | 'app_protection'
  required: boolean
  value?: string
  description: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Device Full Access',
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
          type: 'intune_compliance',
          operator: 'equals',
          value: 'compliant',
          description: 'Device must be Intune compliant'
        },
        {
          id: '3',
          type: 'certificate',
          operator: 'equals',
          value: 'valid',
          description: 'Valid corporate certificate required'
        }
      ],
      actions: [
        {
          id: '1',
          type: 'vlan_assign',
          parameters: { vlan: '100', bandwidth: 'unlimited' },
          description: 'Assign to corporate VLAN'
        }
      ],
      description: 'Full network access for compliant corporate devices',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      vlanAssignment: {
        vlanId: 100,
        vlanName: 'Corporate',
        subnet: '10.1.100.0/24',
        gateway: '10.1.100.1',
        accessLevel: 'full',
        bandwidth: 'unlimited'
      },
      complianceRules: [
        {
          id: '1',
          name: 'Antivirus Protection',
          type: 'antivirus',
          required: true,
          description: 'Real-time antivirus protection enabled'
        },
        {
          id: '2',
          name: 'Device Encryption',
          type: 'encryption',
          required: true,
          description: 'Full disk encryption enabled'
        },
        {
          id: '3',
          name: 'OS Version',
          type: 'os_version',
          required: true,
          value: 'Windows 10 1909+',
          description: 'Minimum supported OS version'
        }
      ]
    },
    {
      id: '2',
      name: 'BYOD Limited Access',
      type: 'device',
      status: 'active',
      priority: 2,
      conditions: [
        {
          id: '4',
          type: 'user_group',
          operator: 'equals',
          value: 'Employees',
          description: 'Employee users'
        },
        {
          id: '5',
          type: 'device_type',
          operator: 'in',
          value: 'iOS,Android',
          description: 'Personal mobile devices'
        },
        {
          id: '6',
          type: 'intune_compliance',
          operator: 'equals',
          value: 'compliant',
          description: 'Basic compliance requirements met'
        }
      ],
      actions: [
        {
          id: '2',
          type: 'vlan_assign',
          parameters: { vlan: '150', bandwidth: '50Mbps' },
          description: 'Assign to BYOD VLAN with bandwidth limit'
        }
      ],
      description: 'Limited access for employee personal devices',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T11:15:00Z',
      vlanAssignment: {
        vlanId: 150,
        vlanName: 'BYOD',
        subnet: '10.1.150.0/24',
        gateway: '10.1.150.1',
        accessLevel: 'limited',
        bandwidth: '50Mbps'
      },
      complianceRules: [
        {
          id: '4',
          name: 'Screen Lock',
          type: 'app_protection',
          required: true,
          description: 'Device screen lock enabled'
        },
        {
          id: '5',
          name: 'Jailbreak Detection',
          type: 'jailbreak',
          required: true,
          description: 'Device must not be jailbroken/rooted'
        }
      ]
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('policies')
  const [showVLANDialog, setShowVLANDialog] = useState(false)

  const conditionTypes = [
    { value: 'user_group', label: 'User Group', icon: <Users className="w-4 h-4" /> },
    { value: 'device_type', label: 'Device Type', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'location', label: 'Location', icon: <Network className="w-4 h-4" /> },
    { value: 'time', label: 'Time', icon: <Clock className="w-4 h-4" /> },
    { value: 'compliance', label: 'Compliance', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'certificate', label: 'Certificate', icon: <Shield className="w-4 h-4" /> },
    { value: 'intune_compliance', label: 'Intune Compliance', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'risk_score', label: 'Risk Score', icon: <AlertTriangle className="w-4 h-4" /> }
  ]

  const actionTypes = [
    { value: 'allow', label: 'Allow', color: 'bg-green-500' },
    { value: 'deny', label: 'Deny', color: 'bg-red-500' },
    { value: 'quarantine', label: 'Quarantine', color: 'bg-yellow-500' },
    { value: 'redirect', label: 'Redirect', color: 'bg-blue-500' },
    { value: 'notify', label: 'Notify', color: 'bg-purple-500' },
    { value: 'vlan_assign', label: 'VLAN Assignment', color: 'bg-indigo-500' },
    { value: 'bandwidth_limit', label: 'Bandwidth Limit', color: 'bg-orange-500' },
    { value: 'remediate', label: 'Remediate', color: 'bg-teal-500' }
  ]

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
      version: '2.0'
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

  const getAccessLevelColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'full': return 'bg-green-500'
      case 'limited': return 'bg-blue-500'
      case 'internet_only': return 'bg-yellow-500'
      case 'quarantine': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
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
                        {policy.vlanAssignment && (
                          <Badge className={getAccessLevelColor(policy.vlanAssignment.accessLevel)}>
                            VLAN {policy.vlanAssignment.vlanId}
                          </Badge>
                        )}
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                      {policy.vlanAssignment && (
                        <div>
                          <h4 className="font-medium mb-2">VLAN Assignment</h4>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              VLAN {policy.vlanAssignment.vlanId} - {policy.vlanAssignment.vlanName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {policy.vlanAssignment.subnet}
                            </div>
                            <div className="text-sm text-gray-600">
                              Access: {policy.vlanAssignment.accessLevel.replace('_', ' ')}
                            </div>
                            {policy.vlanAssignment.bandwidth && (
                              <div className="text-sm text-gray-600">
                                Bandwidth: {policy.vlanAssignment.bandwidth}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="policy-name">Policy Name</Label>
                      <Input
                        id="policy-name"
                        value={selectedPolicy.name}
                        readOnly={!isEditing}
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
                          <SelectItem value="vlan">VLAN Policy</SelectItem>
                          <SelectItem value="compliance">Compliance Policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policy-description">Description</Label>
                    <Textarea
                      id="policy-description"
                      value={selectedPolicy.description}
                      readOnly={!isEditing}
                      rows={3}
                    />
                  </div>

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
                <p className="text-gray-500 mb-4">Select a policy from the Active Policies tab to edit</p>
                <Button onClick={() => setActiveTab('policies')}>
                  View Policies
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showVLANDialog} onOpenChange={setShowVLANDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>VLAN Designer</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vlan-id">VLAN ID</Label>
                <Input id="vlan-id" placeholder="e.g., 100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vlan-name">VLAN Name</Label>
                <Input id="vlan-name" placeholder="e.g., Corporate" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vlan-subnet">Subnet</Label>
                <Input id="vlan-subnet" placeholder="e.g., 10.1.100.0/24" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vlan-gateway">Gateway</Label>
                <Input id="vlan-gateway" placeholder="e.g., 10.1.100.1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-level">Access Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Network Access</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                  <SelectItem value="internet_only">Internet Only</SelectItem>
                  <SelectItem value="quarantine">Quarantine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bandwidth">Bandwidth Limit</Label>
              <Input id="bandwidth" placeholder="e.g., 50Mbps, unlimited" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vlan-description">Description</Label>
              <Textarea id="vlan-description" placeholder="Describe the purpose of this VLAN..." />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowVLANDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowVLANDialog(false)}>
                Create VLAN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
