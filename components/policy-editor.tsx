'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save } from 'lucide-react'

interface PolicyEditorProps {
  onClose: () => void
}

export default function PolicyEditor({ onClose }: PolicyEditorProps) {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Corporate Devices',
      condition: 'Device Type = Windows AND Certificate Valid = True',
      action: 'Allow Full Access',
      vlan: '100',
      priority: 1
    },
    {
      id: 2,
      name: 'Guest Devices',
      condition: 'Device Type = Unknown',
      action: 'Quarantine',
      vlan: '200',
      priority: 2
    }
  ])

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    condition: '',
    action: 'Allow',
    vlan: '',
    priority: 3
  })

  const addPolicy = () => {
    if (newPolicy.name && newPolicy.condition) {
      setPolicies([...policies, { ...newPolicy, id: Date.now() }])
      setNewPolicy({ name: '', condition: '', action: 'Allow', vlan: '', priority: policies.length + 1 })
    }
  }

  const removePolicy = (id: number) => {
    setPolicies(policies.filter(p => p.id !== id))
  }

  return (
    <Card className="fixed inset-4 z-50 bg-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>NAC Policy Editor</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Policies</h3>
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">Priority {policy.priority}</Badge>
                    <span className="font-medium">{policy.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <strong>Condition:</strong> {policy.condition}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Action:</strong> {policy.action} (VLAN {policy.vlan})
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePolicy(policy.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Policy */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Add New Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policy-name">Policy Name</Label>
              <Input
                id="policy-name"
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                placeholder="e.g., Mobile Devices"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policy-action">Action</Label>
              <Select value={newPolicy.action} onValueChange={(value) => setNewPolicy({ ...newPolicy, action: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allow">Allow Full Access</SelectItem>
                  <SelectItem value="Quarantine">Quarantine</SelectItem>
                  <SelectItem value="Deny">Deny Access</SelectItem>
                  <SelectItem value="Limited">Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policy-vlan">VLAN ID</Label>
              <Input
                id="policy-vlan"
                value={newPolicy.vlan}
                onChange={(e) => setNewPolicy({ ...newPolicy, vlan: e.target.value })}
                placeholder="e.g., 300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policy-priority">Priority</Label>
              <Input
                id="policy-priority"
                type="number"
                value={newPolicy.priority}
                onChange={(e) => setNewPolicy({ ...newPolicy, priority: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="policy-condition">Condition</Label>
              <Textarea
                id="policy-condition"
                value={newPolicy.condition}
                onChange={(e) => setNewPolicy({ ...newPolicy, condition: e.target.value })}
                placeholder="e.g., Device Type = iOS AND Certificate Valid = True"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setNewPolicy({ name: '', condition: '', action: 'Allow', vlan: '', priority: policies.length + 1 })}>
              Clear
            </Button>
            <Button onClick={addPolicy}>
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
