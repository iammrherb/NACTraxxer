'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, MapPin, Users, Network, Calendar } from 'lucide-react'

interface AddSiteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSite: (site: any) => void
}

interface SiteFormData {
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

export default function AddSiteModal({ open, onOpenChange, onAddSite }: AddSiteModalProps) {
  const [formData, setFormData] = useState<SiteFormData>({
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

  const [currentStep, setCurrentStep] = useState(0)

  const regions = ['North America', 'EMEA', 'APAC', 'LATAM']
  const vendors = ['Cisco', 'Aruba', 'Juniper', 'Extreme Networks', 'Fortinet', 'Palo Alto', 'HPE']
  const deviceTypes = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'IoT', 'Printers']
  const projectManagers = ['Alex Rivera', 'John Smith', 'Emily Jones', 'Michael Zhang', 'Sarah Thompson']
  const technicalOwners = ['John Smith', 'Emily Jones', 'Mark Wilson', 'Carlos Mendez', 'Jennifer Lee', 'Paul Davis', 'Diego Ruiz']

  const steps = [
    { id: 0, title: 'Basic Information', icon: <MapPin className="h-4 w-4" /> },
    { id: 1, title: 'Project Details', icon: <Users className="h-4 w-4" /> },
    { id: 2, title: 'Technical Configuration', icon: <Network className="h-4 w-4" /> },
    { id: 3, title: 'Timeline & Notes', icon: <Calendar className="h-4 w-4" /> }
  ]

  const handleSubmit = () => {
    if (!formData.name || !formData.region || !formData.projectManager) {
      showNotification('Please fill in all required fields', 'error')
      return
    }

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
    setCurrentStep(0)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleArrayToggle = (array: string[], value: string, setter: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value))
    } else {
      setter([...array, value])
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-[#00c8d7]" />
            <span>Add New Site</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep
                    ? 'bg-[#00c8d7] border-[#00c8d7] text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              <div className="ml-2">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-[#00c8d7]' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-[#00c8d7]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site-name">Site Name *</Label>
                      <Input
                        id="site-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData({ ...formData, region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })}
                      >
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
                    <div>
                      <Label htmlFor="phase">Phase</Label>
                      <Select
                        value={formData.phase}
                        onValueChange={(value) => setFormData({ ...formData, phase: value })}
                      >
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

                  <div>
                    <Label htmlFor="users">Number of Users</Label>
                    <Input
                      id="users"
                      type="number"
                      value={formData.users}
                      onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) || 0 })}
                      placeholder="Enter number of users"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project-manager">Project Manager *</Label>
                    <Select
                      value={formData.projectManager}
                      onValueChange={(value) => setFormData({ ...formData, projectManager: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectManagers.map((pm) => (
                          <SelectItem key={pm} value={pm}>
                            {pm}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Technical Owners</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {technicalOwners.map((owner) => (
                        <div key={owner} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.technicalOwners.includes(owner)}
                            onCheckedChange={() => 
                              handleArrayToggle(
                                formData.technicalOwners,
                                owner,
                                (newArray) => setFormData({ ...formData, technicalOwners: newArray })
                              )
                            }
                          />
                          <Label className="text-sm">{owner}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'Planned' | 'In Progress' | 'Complete' | 'Delayed') => 
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Technical Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Wired Vendors</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {vendors.map((vendor) => (
                        <div key={vendor} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.wiredVendors.includes(vendor)}
                            onCheckedChange={() => 
                              handleArrayToggle(
                                formData.wiredVendors,
                                vendor,
                                (newArray) => setFormData({ ...formData, wiredVendors: newArray })
                              )
                            }
                          />
                          <Label className="text-sm">{vendor}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Wireless Vendors</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {vendors.map((vendor) => (
                        <div key={vendor} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.wirelessVendors.includes(vendor)}
                            onCheckedChange={() => 
                              handleArrayToggle(
                                formData.wirelessVendors,
                                vendor,
                                (newArray) => setFormData({ ...formData, wirelessVendors: newArray })
                              )
                            }
                          />
                          <Label className="text-sm">{vendor}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Device Types</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {deviceTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.deviceTypes.includes(type)}
                            onCheckedChange={() => 
                              handleArrayToggle(
                                formData.deviceTypes,
                                type,
                                (newArray) => setFormData({ ...formData, deviceTypes: newArray })
                              )
                            }
                          />
                          <Label className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="radsec">RADSec Configuration</Label>
                    <Select
                      value={formData.radsec}
                      onValueChange={(value) => setFormData({ ...formData, radsec: value })}
                    >
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Timeline & Notes */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="planned-start">Planned Start Date</Label>
                      <Input
                        id="planned-start"
                        type="date"
                        value={formData.plannedStart}
                        onChange={(e) => setFormData({ ...formData, plannedStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="planned-end">Planned End Date</Label>
                      <Input
                        id="planned-end"
                        type="date"
                        value={formData.plannedEnd}
                        onChange={(e) => setFormData({ ...formData, plannedEnd: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Enter any additional notes or requirements"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-[#00c8d7] hover:bg-[#0099cc]"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#00c8d7] hover:bg-[#0099cc]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
