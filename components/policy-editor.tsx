'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, Save, Shield, Users, Network, Clock, AlertTriangle } from 'lucide-react'

interface Policy {
  id: string
  name: string
  description: string
  priority: number
  enabled: boolean
  conditions: {
    deviceType: string[]
    userGroups: string[]
    timeRestrictions: string
    locationRestrictions: string[]
  }
  actions: {
    vlanAssignment: string
    bandwidthLimit: string
    accessLevel: string
    quarantine: boolean
  }
  createdDate: string
  lastModified: string
}

interface PolicyEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PolicyEditor({ open, onOpenChange }: PolicyEditorProps) {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Corporate Managed Devices',
      description: 'Policy for company-owned and managed devices with certificates',
      priority: 1,
      enabled: true,
      conditions: {
        deviceType: ['Windows Laptop', 'Mac Laptop', 'Corporate Phone'],
        userGroups: ['Employees', 'Contractors'],
        timeRestrictions: 'Business Hours',
        locationRestrictions: ['Corporate Network']
      },
      actions: {
        vlanAssignment: 'VLAN 10 - Corporate',
        bandwidthLimit: 'Unlimited',
        accessLevel: 'Full Access',
        quarantine: false
      },
      createdDate: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      name: 'BYOD Mobile Devices',
      description: 'Policy for personal mobile devices accessing corporate resources',
      priority: 2,
      enabled: true,
      conditions: {
        deviceType: ['Personal Phone', 'Personal Tablet'],
        userGroups: ['Employees'],
        timeRestrictions: 'Business Hours Only',
        locationRestrictions: ['Corporate Network', 'Branch Offices']
      },
      actions: {
        vlanAssignment: 'VLAN 20 - BYOD',
        bandwidthLimit: '50 Mbps',
        accessLevel: 'Limited Access',
        quarantine: false
      },
      createdDate: '2024-01-05',
      lastModified: '2024-01-12'
    },
    {
      id: '3',
      name: 'Guest Access',
      description: 'Policy for visitor and guest device access',
      priority: 3,
      enabled: true,
      conditions: {
        deviceType: ['Any'],
        userGroups: ['Guests', 'Visitors'],
        timeRestrictions: 'Business Hours Only',
        locationRestrictions: ['Guest Network']
      },
      actions: {
        vlanAssignment: 'VLAN 30 - Guest',
        bandwidthLimit: '10 Mbps',
        accessLevel: 'Internet Only',
        quarantine: false
      },
      createdDate: '2024-01-03',
      lastModified: '2024-01-10'
    },
    {
      id: '4',
      name: 'IoT Devices',
      description: 'Policy for Internet of Things devices and sensors',
      priority: 4,
      enabled: true,
      conditions: {
        deviceType: ['IoT Sensor', 'Smart Device', 'Printer'],
        userGroups: ['System'],
        timeRestrictions: '24/7',
        locationRestrictions: ['Corporate Network']
      },
      actions: {
        vlanAssignment: 'VLAN 40 - IoT',
        bandwidthLimit: '5 Mbps',
        accessLevel: 'Restricted',
        quarantine: false
      },
      createdDate: '2024-01-07',
      lastModified: '2024-01-14'
    }
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [showAddPolicy, setShowAddPolicy] = useState(false)

  const handleAddPolicy = (newPolicy: Omit<Policy, 'id'>) => {
    const policy: Policy = {
      ...newPolicy,
      id: (policies.length + 1).toString()
    }
    setPolicies([...policies, policy])
    setShowAddPolicy(false)
  }

  const handleEditPolicy = (updatedPolicy: Policy) => {
    setPolicies(policies.map(policy => policy.id === updatedPolicy.id ? updatedPolicy : policy))
    setEditingPolicy(null)
  }

  const handleDeletePolicy = (policyId: string) => {
    setPolicies(policies.filter(policy => policy.id !== policyId))
  }

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy
    ))
  }

  const getPriorityBadge = (priority: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800'
    }
    return (
      <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        Priority {priority}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Access Control Policy Editor</span>
          </DialogTitle>
          <DialogDescription>
            Create and manage network access control policies for different device types and user groups
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="policies">Policy Management</TabsTrigger>
            <TabsTrigger value="templates">Policy Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="text-sm">
                  <span className="font-medium">Total Policies:</span> {policies.length}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Active:</span> {policies.filter(p => p.enabled).length}
                </div>
              </div>
              <Button onClick={() => setShowAddPolicy(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>

            <div className="grid gap-4">
              {policies.map((policy) => (
                <Card key={policy.id} className={`${!policy.enabled ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => handleTogglePolicy(policy.id)}
                        />
                        <div>
                          <CardTitle className="text-lg">{policy.name}</CardTitle>
                          <CardDescription>{policy.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(policy.priority)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPolicy(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(policy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Conditions
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>Device Types:</strong> {policy.conditions.deviceType.join(', ')}</div>
                          <div><strong>User Groups:</strong> {policy.conditions.userGroups.join(', ')}</div>
                          <div><strong>Time:</strong> {policy.conditions.timeRestrictions}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Network className="h-4 w-4 mr-2" />
                          Actions
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>VLAN:</strong> {policy.actions.vlanAssignment}</div>
                          <div><strong>Bandwidth:</strong> {policy.actions.bandwidthLimit}</div>
                          <div><strong>Access Level:</strong> {policy.actions.accessLevel}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Policy Form */}
            {showAddPolicy && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyForm onSubmit={handleAddPolicy} onCancel={() => setShowAddPolicy(false)} />
                </CardContent>
              </Card>
            )}

            {/* Edit Policy Form */}
            {editingPolicy && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyForm 
                    policy={editingPolicy} 
                    onSubmit={handleEditPolicy} 
                    onCancel={() => setEditingPolicy(null)} 
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Templates</CardTitle>
                <CardDescription>
                  Pre-configured policy templates for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Zero Trust Corporate</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Strict policy for corporate devices with certificate-based authentication
                    </p>
                    <Button size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">BYOD Friendly</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Balanced policy allowing personal devices with appropriate restrictions
                    </p>
                    <Button size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Guest Network</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Internet-only access for visitors and temporary users
                    </p>
                    <Button size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">IoT Segmentation</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Isolated network access for IoT devices and sensors
                    </p>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Policy Form Component
function PolicyForm({ 
  policy, 
  onSubmit, 
  onCancel 
}: { 
  policy?: Policy
  onSubmit: (policy: Policy | Omit<Policy, 'id'>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: policy?.name || '',
    description: policy?.description || '',
    priority: policy?.priority || 1,
    enabled: policy?.enabled ?? true,
    conditions: {
      deviceType: policy?.conditions.deviceType || [],
      userGroups: policy?.conditions.userGroups || [],
      timeRestrictions: policy?.conditions.timeRestrictions || '',
      locationRestrictions: policy?.conditions.locationRestrictions || []
    },
    actions: {
      vlanAssignment: policy?.actions.vlanAssignment || '',
      bandwidthLimit: policy?.actions.bandwidthLimit || '',
      accessLevel: policy?.actions.accessLevel || '',
      quarantine: policy?.actions.quarantine || false
    },
    createdDate: policy?.createdDate || new Date().toISOString().split('T')[0],
    lastModified: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (policy) {
      onSubmit({ ...policy, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Policy Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Priority (1-10)</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Conditions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Device Types</Label>
            <Input
              placeholder="Windows Laptop, Mac Laptop, etc."
              value={formData.conditions.deviceType.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                conditions: {
                  ...formData.conditions,
                  deviceType: e.target.value.split(', ').filter(Boolean)
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>User Groups</Label>
            <Input
              placeholder="Employees, Contractors, etc."
              value={formData.conditions.userGroups.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                conditions: {
                  ...formData.conditions,
                  userGroups: e.target.value.split(', ').filter(Boolean)
                }
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Time Restrictions</Label>
          <Select 
            value={formData.conditions.timeRestrictions} 
            onValueChange={(value) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, timeRestrictions: value }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time restrictions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24/7">24/7 Access</SelectItem>
              <SelectItem value="Business Hours">Business Hours Only</SelectItem>
              <SelectItem value="Extended Hours">Extended Hours (6AM-10PM)</SelectItem>
              <SelectItem value="Weekdays Only">Weekdays Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>VLAN Assignment</Label>
            <Select 
              value={formData.actions.vlanAssignment} 
              onValueChange={(value) => setFormData({
                ...formData,
                actions: { ...formData.actions, vlanAssignment: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select VLAN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VLAN 10 - Corporate">VLAN 10 - Corporate</SelectItem>
                <SelectItem value="VLAN 20 - BYOD">VLAN 20 - BYOD</SelectItem>
                <SelectItem value="VLAN 30 - Guest">VLAN 30 - Guest</SelectItem>
                <SelectItem value="VLAN 40 - IoT">VLAN 40 - IoT</SelectItem>
                <SelectItem value="VLAN 50 - Quarantine">VLAN 50 - Quarantine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Bandwidth Limit</Label>
            <Select 
              value={formData.actions.bandwidthLimit} 
              onValueChange={(value) => setFormData({
                ...formData,
                actions: { ...formData.actions, bandwidthLimit: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bandwidth limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unlimited">Unlimited</SelectItem>
                <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                <SelectItem value="50 Mbps">50 Mbps</SelectItem>
                <SelectItem value="25 Mbps">25 Mbps</SelectItem>
                <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                <SelectItem value="5 Mbps">5 Mbps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Access Level</Label>
          <Select 
            value={formData.actions.accessLevel} 
            onValueChange={(value) => setFormData({
              ...formData,
              actions: { ...formData.actions, accessLevel: value }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Access">Full Access</SelectItem>
              <SelectItem value="Limited Access">Limited Access</SelectItem>
              <SelectItem value="Internet Only">Internet Only</SelectItem>
              <SelectItem value="Restricted">Restricted</SelectItem>
              <SelectItem value="Quarantine">Quarantine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.actions.quarantine}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              actions: { ...formData.actions, quarantine: checked }
            })}
          />
          <Label>Enable Quarantine for Non-Compliant Devices</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {policy ? 'Update Policy' : 'Create Policy'}
        </Button>
      </div>
    </form>
  )
}
