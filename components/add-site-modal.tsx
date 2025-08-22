"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Building, MapPin, Users, Network, Calendar } from "lucide-react"

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
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
  onAddSite: (site: Omit<Site, "id">) => void
}

const regions = ["North America", "South America", "EMEA", "APAC", "Europe", "Asia", "Africa", "Oceania"]

const countries = [
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "China",
  "Japan",
  "South Korea",
  "India",
  "Singapore",
  "Australia",
  "New Zealand",
  "Thailand",
  "Malaysia",
  "Philippines",
  "Indonesia",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Kenya",
  "Morocco",
]

const networkVendors = [
  "Cisco",
  "Aruba (HPE)",
  "Juniper",
  "Extreme Networks",
  "Ruckus (CommScope)",
  "Fortinet",
  "Palo Alto Networks",
  "Cisco Meraki",
  "Juniper Mist",
  "Ubiquiti",
  "Netgear",
  "D-Link",
  "TP-Link",
  "Huawei",
  "Alcatel-Lucent Enterprise",
  "Dell Technologies",
  "HPE Networking",
  "Brocade (Broadcom)",
]

const deviceTypes = [
  "Windows Workstations",
  "macOS Devices",
  "Linux Workstations",
  "iOS Devices",
  "Android Devices",
  "IoT Sensors",
  "IP Cameras",
  "Printers",
  "VoIP Phones",
  "Access Control Systems",
  "Building Automation",
  "Medical Devices",
  "Industrial Controllers",
  "Point of Sale",
  "Digital Signage",
  "Wireless Displays",
  "Network Attached Storage",
  "Servers",
]

export default function AddSiteModal({ open, onOpenChange, onAddSite }: AddSiteModalProps) {
  const [currentTab, setCurrentTab] = useState("basic")
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    country: "",
    priority: "Medium" as const,
    phase: "1",
    users: 0,
    projectManager: "",
    technicalOwners: [] as string[],
    status: "Planned" as const,
    completionPercent: 0,
    wiredVendors: [] as string[],
    wirelessVendors: [] as string[],
    deviceTypes: [] as string[],
    radsec: "Native",
    plannedStart: "",
    plannedEnd: "",
    notes: "",
  })

  const [newTechnicalOwner, setNewTechnicalOwner] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.region || !formData.country) {
      alert("Please fill in all required fields")
      return
    }

    onAddSite(formData)

    // Reset form
    setFormData({
      name: "",
      region: "",
      country: "",
      priority: "Medium",
      phase: "1",
      users: 0,
      projectManager: "",
      technicalOwners: [],
      status: "Planned",
      completionPercent: 0,
      wiredVendors: [],
      wirelessVendors: [],
      deviceTypes: [],
      radsec: "Native",
      plannedStart: "",
      plannedEnd: "",
      notes: "",
    })
    setCurrentTab("basic")
    onOpenChange(false)
  }

  const addTechnicalOwner = () => {
    if (newTechnicalOwner.trim() && !formData.technicalOwners.includes(newTechnicalOwner.trim())) {
      setFormData((prev) => ({
        ...prev,
        technicalOwners: [...prev.technicalOwners, newTechnicalOwner.trim()],
      }))
      setNewTechnicalOwner("")
    }
  }

  const removeTechnicalOwner = (owner: string) => {
    setFormData((prev) => ({
      ...prev,
      technicalOwners: prev.technicalOwners.filter((o) => o !== owner),
    }))
  }

  const toggleVendor = (vendor: string, type: "wired" | "wireless") => {
    const field = type === "wired" ? "wiredVendors" : "wirelessVendors"
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(vendor) ? prev[field].filter((v) => v !== vendor) : [...prev[field], vendor],
    }))
  }

  const toggleDeviceType = (deviceType: string) => {
    setFormData((prev) => ({
      ...prev,
      deviceTypes: prev.deviceTypes.includes(deviceType)
        ? prev.deviceTypes.filter((d) => d !== deviceType)
        : [...prev.deviceTypes, deviceType],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Add New Site</span>
          </DialogTitle>
          <DialogDescription>
            Configure a new site for NAC deployment. Fill in all required information across the tabs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Project Team</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>Technical</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Site Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Site Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., New York Headquarters"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="users">Number of Users</Label>
                      <Input
                        id="users"
                        type="number"
                        value={formData.users}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, users: Number.parseInt(e.target.value) || 0 }))
                        }
                        placeholder="e.g., 500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
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
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
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
                      <Label htmlFor="phase">Deployment Phase</Label>
                      <Select
                        value={formData.phase}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, phase: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Phase 1</SelectItem>
                          <SelectItem value="2">Phase 2</SelectItem>
                          <SelectItem value="3">Phase 3</SelectItem>
                          <SelectItem value="4">Phase 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about this site..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Project Team</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectManager">Project Manager</Label>
                    <Input
                      id="projectManager"
                      value={formData.projectManager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, projectManager: e.target.value }))}
                      placeholder="e.g., John Smith"
                    />
                  </div>

                  <div>
                    <Label>Technical Owners</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={newTechnicalOwner}
                        onChange={(e) => setNewTechnicalOwner(e.target.value)}
                        placeholder="Add technical owner..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnicalOwner())}
                      />
                      <Button type="button" onClick={addTechnicalOwner} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technicalOwners.map((owner) => (
                        <Badge key={owner} variant="secondary" className="flex items-center space-x-1">
                          <span>{owner}</span>
                          <button
                            type="button"
                            onClick={() => removeTechnicalOwner(owner)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Current Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
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
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Wired Network Vendors</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {networkVendors.map((vendor) => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`wired-${vendor}`}
                              checked={formData.wiredVendors.includes(vendor)}
                              onCheckedChange={() => toggleVendor(vendor, "wired")}
                            />
                            <Label htmlFor={`wired-${vendor}`} className="text-sm">
                              {vendor}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Wireless Network Vendors</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {networkVendors.map((vendor) => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`wireless-${vendor}`}
                              checked={formData.wirelessVendors.includes(vendor)}
                              onCheckedChange={() => toggleVendor(vendor, "wireless")}
                            />
                            <Label htmlFor={`wireless-${vendor}`} className="text-sm">
                              {vendor}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="radsec">RADSEC Configuration</Label>
                      <Select
                        value={formData.radsec}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, radsec: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Native">Native RADSEC</SelectItem>
                          <SelectItem value="LRAD">LRAD Proxy</SelectItem>
                          <SelectItem value="Tunnel">Tunnel Mode</SelectItem>
                          <SelectItem value="None">Not Configured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                      {deviceTypes.map((deviceType) => (
                        <div key={deviceType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`device-${deviceType}`}
                            checked={formData.deviceTypes.includes(deviceType)}
                            onCheckedChange={() => toggleDeviceType(deviceType)}
                          />
                          <Label htmlFor={`device-${deviceType}`} className="text-sm">
                            {deviceType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Project Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plannedStart">Planned Start Date</Label>
                      <Input
                        id="plannedStart"
                        type="date"
                        value={formData.plannedStart}
                        onChange={(e) => setFormData((prev) => ({ ...prev, plannedStart: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="plannedEnd">Planned End Date</Label>
                      <Input
                        id="plannedEnd"
                        type="date"
                        value={formData.plannedEnd}
                        onChange={(e) => setFormData((prev) => ({ ...prev, plannedEnd: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="completionPercent">Completion Percentage</Label>
                    <Input
                      id="completionPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.completionPercent}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, completionPercent: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="0-100"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Project Milestones</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>• Site Assessment & Planning</span>
                        <span>Week 1-2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Infrastructure Preparation</span>
                        <span>Week 3-4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• NAC Deployment & Configuration</span>
                        <span>Week 5-6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Testing & Validation</span>
                        <span>Week 7-8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Go-Live & Support</span>
                        <span>Week 9-10</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              {currentTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "team", "technical", "timeline"]
                    const currentIndex = tabs.indexOf(currentTab)
                    if (currentIndex > 0) {
                      setCurrentTab(tabs[currentIndex - 1])
                    }
                  }}
                >
                  Previous
                </Button>
              )}
              {currentTab !== "timeline" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "team", "technical", "timeline"]
                    const currentIndex = tabs.indexOf(currentTab)
                    if (currentIndex < tabs.length - 1) {
                      setCurrentTab(tabs[currentIndex + 1])
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Site</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
