'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Shield, Users, Clock, MapPin } from 'lucide-react'

interface PolicyRule {
  id: string
  name: string
  deviceType: string
  userRole: string
  timeRestriction: string
  locationRestriction: string
  vlanAssignment: string
  bandwidthLimit: string
  action: string
}

export default function PolicyEditor() {
  const [policies, setPolicies] = useState<PolicyRule[]>([
    {
      id: '1',
      name: 'Corporate Laptops',
      deviceType: 'laptop',
      userRole: 'employee',
      timeRestriction: 'business-hours',
      locationRestriction: 'office',
      vlanAssignment: 'vlan-100',
      bandwidthLimit: 'unlimited',
      action: 'allow'
    },
    {
      id: '2',
      name: 'Guest Devices',
      deviceType: 'any',
      userRole: 'guest',
      timeRestriction: 'any',
      locationRestriction: 'guest-area',
      vlanAssignment: 'vlan-200',
      bandwidthLimit: '10mbps',
      action: 'allow'
    },
    {
      id: '3',
      name: 'IoT Sensors',
      deviceType: 'iot',
      userRole: 'system',
      timeRestriction: 'any',
      locationRestriction: 'any',
      vlanAssignment: 'vlan-300',
      bandwidthLimit: '1mbps',
      action: 'allow'
    }
  ])

  const [newPolicy, setNewPolicy] = useState<Partial<PolicyRule>>({
    name: '',
    deviceType: 'laptop',
    userRole: 'employee',
    timeRestriction: 'any',
    locationRestriction: 'any',
    vlanAssignment: 'vlan-100',
    bandwidthLimit: 'unlimited',
    action: 'allow'
  })

  const addPolicy = () => {
    if (newPolicy.name) {
      const policy: PolicyRule = {
        id: Date.now().toString(),
        name: newPolicy.name,
        deviceType: newPolicy.deviceType || 'laptop',
        userRole: newPolicy.userRole || 'employee',
        timeRestriction: newPolicy.timeRestriction || 'any',
        locationRestriction: newPolicy.locationRestriction || 'any',
        vlanAssignment: newPolicy.vlanAssignment || 'vlan-100',
        bandwidthLimit: newPolicy.bandwidthLimit || 'unlimited',
        action: newPolicy.action || 'allow'
      }
      setPolicies([...policies, policy])
      setNewPolicy({
        name: '',
        deviceType: 'laptop',
        userRole: 'employee',
        timeRestriction: 'any',
        locationRestriction: 'any',
        vlanAssignment: 'vlan-100',
        bandwidthLimit: 'unlimited',
        action: 'allow'
      })
    }
  }

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id))
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'allow': return 'bg-green-100 text-green-800'
      case 'deny': return 'bg-red-100 text-red-800'
      case 'quarantine': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Access Policy Editor</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Define and manage network access policies based on device type, user role, time, and location.
          </p>
        </CardHeader>
        <CardContent>
          {/* Add New Policy */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-4">Add New Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Policy Name</label>
                <Input
                  value={newPolicy.name || ''}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="Enter policy name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <Select value={newPolicy.deviceType} onValueChange={(value) => setNewPolicy({ ...newPolicy, deviceType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Mobile Device</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="iot">IoT Device</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="printer">Printer</SelectItem>
                    <SelectItem value="any">Any Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">User Role</label>
                <Select value={newPolicy.userRole} onValueChange={(value) => setNewPolicy({ ...newPolicy, userRole: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="system">System Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Action</label>
                <Select value={newPolicy.action} onValueChange={(value) => setNewPolicy({ ...newPolicy, action: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time Restriction</label>
                <Select value={newPolicy.timeRestriction} onValueChange={(value) => setNewPolicy({ ...newPolicy, timeRestriction: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="business-hours">Business Hours</SelectItem>
                    <SelectItem value="after-hours">After Hours</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Select value={newPolicy.locationRestriction} onValueChange={(value) => setNewPolicy({ ...newPolicy, locationRestriction: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="guest-area">Guest Area</SelectItem>
                    <SelectItem value="datacenter">Data Center</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">VLAN Assignment</label>
                <Select value={newPolicy.vlanAssignment} onValueChange={(value) => setNewPolicy({ ...newPolicy, vlanAssignment: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vlan-100">VLAN 100 (Corporate)</SelectItem>
                    <SelectItem value="vlan-200">VLAN 200 (Guest)</SelectItem>
                    <SelectItem value="vlan-300">VLAN 300 (IoT)</SelectItem>
                    <SelectItem value="vlan-400">VLAN 400 (Quarantine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bandwidth Limit</label>
                <Select value={newPolicy.bandwidthLimit} onValueChange={(value) => setNewPolicy({ ...newPolicy, bandwidthLimit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                    <SelectItem value="100mbps">100 Mbps</SelectItem>
                    <SelectItem value="50mbps">50 Mbps</SelectItem>
                    <SelectItem value="10mbps">10 Mbps</SelectItem>
                    <SelectItem value="1mbps">1 Mbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={addPolicy} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Policy</span>
            </Button>
          </div>

          {/* Policy List */}
          <div className="space-y-4">
            <h3 className="font-semibold">Current Policies</h3>
            {policies.map((policy) => (
              <div key={policy.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{policy.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionBadgeColor(policy.action)}>
                      {policy.action.charAt(0).toUpperCase() + policy.action.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePolicy(policy.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Device:</span>
                    <span className="font-medium">{policy.deviceType}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-medium">{policy.userRole}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="font-medium">{policy.timeRestriction}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium">{policy.locationRestriction}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">VLAN:</span>
                    <span className="font-medium ml-2">{policy.vlanAssignment}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Bandwidth:</span>
                    <span className="font-medium ml-2">{policy.bandwidthLimit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
