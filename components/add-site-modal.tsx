'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Building, Plus } from 'lucide-react'

interface Site {
  name: string
  region: string
  country: string
  priority: 'High' | 'Medium' | 'Low'
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  completionPercent: number
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: string
  plannedStart: string
  plannedEnd: string
  notes: string
}

interface AddSiteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSite: (site: Site) => void
}

export default function AddSiteModal({ open, onOpenChange, onAddSite }: AddSiteModalProps) {
  const [formData, setFormData] = useState<Site>({
    name: '',
    region: '',
    country: '',
    priority: 'Medium',
    phase: '1',
    users: 0,
    projectManager: '',
    technicalOwners: [],
    status: 'Planned',
    completionPercent: 0,
    wiredVendors: [],
    wirelessVendors: [],
    deviceTypes: [],
    radsec: 'Native',
    plannedStart: '',
    plannedEnd: '',
    notes: ''
  })

  const [newTechnicalOwner, setNewTechnicalOwner] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddSite(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      name: '',
      region: '',
      country: '',
      priority: 'Medium',
      phase: '1',
      users: 0,
      projectManager: '',
      technicalOwners: [],
      status: 'Planned',
      completionPercent: 0,
      wiredVendors: [],
      wirelessVendors: [],
      deviceTypes: [],
      radsec: 'Native',
      plannedStart: '',
      plannedEnd: '',
      notes: ''
    })
  }

  const addTechnicalOwner = () => {
    if (newTechnicalOwner.trim()) {
      setFormData(prev => ({
        ...prev,
        technicalOwners: [...prev.technicalOwners, newTechnicalOwner.trim()]
      }))
      setNewTechnicalOwner('')
    }
  }

  const removeTechnicalOwner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technicalOwners: prev.technicalOwners.filter((_, i) => i !== index)
    }))
  }

  const handleVendorChange = (vendor: string, type: 'wired' | 'wireless', checked: boolean) => {
    const field = type === 'wired' ? 'wiredVendors' : 'wirelessVendors'
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], vendor]
        : prev[field].filter(v => v !== vendor)
    }))
  }

  const handleDeviceTypeChange = (deviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deviceTypes: checked 
        ? [...prev.deviceTypes, deviceType]
        : prev.deviceTypes.filter(d => d !== deviceType)
    }))
  }

  const vendors = ['Cisco', 'Aruba', 'Juniper', 'HPE', 'Extreme', 'Fortinet', 'Meraki']
  const deviceTypes = ['Windows', 'Apple', 'Linux', 'Mobile', 'IoT', 'Printers']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Add New Site</span>
          </DialogTitle>
          <DialogDescription>
            Create a new site for the Zero Trust NAC deployment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                  <SelectItem value="APAC">APAC</SelectItem>
                  <SelectItem value="LATAM">LATAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'High' | 'Medium' | 'Low' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Select value={formData.phase} onValueChange={(value) => setFormData(prev => ({ ...prev, phase: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Phase 1</SelectItem>
                  <SelectItem value="2">Phase 2</SelectItem>
                  <SelectItem value="3">Phase 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="users">Number of Users</Label>
              <Input
                id="users"
                type="number"
                value={formData.users}
                onChange={(e) => setFormData(prev => ({ ...prev, users: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager</Label>
              <Input
                id="projectManager"
                value={formData.projectManager}
                onChange={(e) => setFormData(prev => ({ ...prev, projectManager: e.target.value }))}
              />
            </div>
          </div>

          {/* Technical Owners */}
          <div className="space-y-2">
            <Label>Technical Owners</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add technical owner"
                value={newTechnicalOwner}
                onChange={(e) => setNewTechnicalOwner(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnicalOwner())}
              />
              <Button type="button" onClick={addTechnicalOwner}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technicalOwners.map((owner, index) => (
                <div key={index} className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded">
                  <span className="text-sm">{owner}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnicalOwner(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedStart">Planned Start Date</Label>
              <Input
                id="plannedStart"
                type="date"
                value={formData.plannedStart}
                onChange={(e) => setFormData(prev => ({ ...prev, plannedStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEnd">Planned End Date</Label>
              <Input
                id="plannedEnd"
                type="date"
                value={formData.plannedEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, plannedEnd: e.target.value }))}
              />
            </div>
          </div>

          {/* Technical Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Wired Network Vendors</Label>
              <div className="grid grid-cols-4 gap-2">
                {vendors.map(vendor => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`wired-${vendor}`}
                      checked={formData.wiredVendors.includes(vendor)}
                      onCheckedChange={(checked) => handleVendorChange(vendor, 'wired', checked as boolean)}
                    />
                    <Label htmlFor={`wired-${vendor}`} className="text-sm">{vendor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Wireless Network Vendors</Label>
              <div className="grid grid-cols-4 gap-2">
                {vendors.map(vendor => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`wireless-${vendor}`}
                      checked={formData.wirelessVendors.includes(vendor)}
                      onCheckedChange={(checked) => handleVendorChange(vendor, 'wireless', checked as boolean)}
                    />
                    <Label htmlFor={`wireless-${vendor}`} className="text-sm">{vendor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Device Types</Label>
              <div className="grid grid-cols-3 gap-2">
                {deviceTypes.map(deviceType => (
                  <div key={deviceType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`device-${deviceType}`}
                      checked={formData.deviceTypes.includes(deviceType)}
                      onCheckedChange={(checked) => handleDeviceTypeChange(deviceType, checked as boolean)}
                    />
                    <Label htmlFor={`device-${deviceType}`} className="text-sm">{deviceType}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="radsec">RADSEC Implementation</Label>
              <Select value={formData.radsec} onValueChange={(value) => setFormData(prev => ({ ...prev, radsec: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="LRAD">LRAD</SelectItem>
                  <SelectItem value="Proxy">Proxy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this site..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Site
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
