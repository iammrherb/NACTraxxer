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
import { Plus, Trash2, Edit, Shield, Users, Network, AlertTriangle } from 'lucide-react'

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
  type: 'user_group' | 'device_type' | 'location' | 'time' | 'compliance'
  operator: 'equals' | 'contains' | 'not_equals' | 'in_range'
  value: string
}

interface PolicyAction {
  id: string
  type: 'allow' | 'deny' | 'quarantine' | 'redirect' | 'notify'
  parameters: Record<string, string>
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
        { id: '1', type: 'device_type', operator: 'equals', value: 'corporate_managed' },
        { id: '2', type: 'compliance', operator: 'equals', value: 'compliant' }
      ],
      actions: [
        { id: '1', type: 'allow', parameters: { vlan: 'corporate', bandwidth: 'unlimited' } }
      ],
      description: 'Allow full access for compliant corporate devices'
    },
    {
      id: '2',
      name: 'Guest Network Access',
      type: 'user',
      priority: 5,
      enabled: true,
      conditions: [
        { id: '3', type: 'user_group', operator: 'equals', value: 'guest' }
      ],
      actions: [
        { id: '2', type: 'redirect', parameters: { vlan: 'guest', portal: 'guest_portal' } }
      ],
      description: 'Redirect guest users to captive portal'
    },
    {
      id: '3',
      name: 'Non-Compliant Device Quarantine',
      type: 'compliance',
      priority: 2,
      enabled: true,
      conditions: [
        { id: '4', type: 'compliance', operator: 'equals', value: 'non_compliant' }
      ],
      actions: [
        { id: '3', type: 'quarantine', parameters: { vlan: 'quarantine', remediation_url: 'https://remediation.company.com' } }
      ],
      description: 'Quarantine non-compliant devices for remediation'
    }
  ])

  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const policyTypes = [
    { value: 'user', label: 'User Policy', icon: Users },
    { value: 'device', label: 'Device Policy', icon: Network },
    { value: 'network', label: 'Network Policy', icon: Shield },
    { value: 'compliance', label: 'Compliance Policy', icon: AlertTriangle }
  ]

  const conditionTypes = [
    { value: 'user_group', label: 'User Group' },
    { value: 'device_type', label: 'Device Type' },
    { value: 'location', label: 'Location' },
    { value: 'time', label: 'Time Range' },
    { value: 'compliance', label: 'Compliance Status' }
  ]

  const actionTypes = [
    { value: 'allow', label: 'Allow Access' },
    { value: 'deny', label: 'Deny Access' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'redirect', label: 'Redirect to Portal' },
    { value: 'notify', label: 'Send Notification' }
  ]

  const getPolicyTypeIcon = (type: string) => {
    const policyType = policyTypes.find(pt => pt.value === type)
    return policyType ? policyType.icon : Shield
  }

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800'
      case 'device': return 'bg-green-100 text-green-800'
      case 'network': return 'bg-purple-100 text-purple-800'
      case 'compliance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow': return 'bg-green-100 text-green-800'
      case 'deny': return 'bg-red-100 text-red-800'
      case 'quarantine': return 'bg-orange-100 text-orange-800'
      case 'redirect': return 'bg-blue-100 text-blue-800'
      case 'notify': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const togglePolicy = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Network Access Policies</h3>
          <p className="text-sm text-gray-600">Define and manage network access control policies</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {/* Policy List */}
      <div className="space-y-4">
        {policies
          .sort((a, b) => a.priority - b.priority)
          .map((policy) => {
            const Icon = getPolicyTypeIcon(policy.type)
            return (
              <Card key={policy.id} className={`${!policy.enabled ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-semibold">{policy.name}</h4>
                          <p className="text-sm text-gray-600">{policy.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getPolicyTypeColor(policy.type)}>
                          {policy.type}
                        </Badge>
                        <Badge variant="outline">
                          Priority: {policy.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => togglePolicy(policy.id)}
                        />
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
                          onClick={() => deletePolicy(policy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Conditions</h5>
                      <div className="space-y-1">
                        {policy.conditions.map((condition) => (
                          <div key={condition.id} className="text-sm bg-gray-50 p-2 rounded">
                            {condition.type.replace('_', ' ')} {condition.operator} "{condition.value}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Actions</h5>
                      <div className="space-y-1">
                        {policy.actions.map((action) => (
                          <Badge key={action.id} className={getActionColor(action.type)}>
                            {action.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* Add/Edit Policy Form */}
      {(showAddForm || editingPolicy) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  placeholder="Enter policy name"
                  defaultValue={editingPolicy?.name || ''}
                />
              </div>
              <div>
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select defaultValue={editingPolicy?.type || 'user'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policy-priority">Priority</Label>
                <Input
                  id="policy-priority"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1-10"
                  defaultValue={editingPolicy?.priority || 5}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked={editingPolicy?.enabled ?? true} />
                <Label>Enable Policy</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="policy-description">Description</Label>
              <Textarea
                id="policy-description"
                placeholder="Enter policy description"
                defaultValue={editingPolicy?.description || ''}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingPolicy(null)
                }}
              >
                Cancel
              </Button>
              <Button>
                {editingPolicy ? 'Update Policy' : 'Create Policy'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
