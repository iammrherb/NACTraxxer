"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { storage, type Site, REGIONS, COUNTRIES, US_STATES, PHASES } from "@/lib/storage"
import { Building2, Settings, Shuffle, Plus } from "lucide-react"

interface BulkSiteCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSitesCreated?: () => void
}

export default function BulkSiteCreator({ open, onOpenChange, onSitesCreated }: BulkSiteCreatorProps) {
  const [siteCount, setSiteCount] = useState(5)
  const [namingConvention, setNamingConvention] = useState("Site-{n}")
  const [template, setTemplate] = useState<Partial<Site>>({
    region: "North America",
    country: "United States",
    state: "California",
    siteType: "branch",
    status: "planning",
    priority: "medium",
    phase: "Phase 1 - Planning",
    users: 100,
    devices: 200,
    deviceBreakdown: {
      windows: 80,
      mac: 20,
      linux: 10,
      ios: 40,
      android: 30,
      iot: 15,
      medical: 0,
      printers: 5,
      cameras: 3,
      voip: 15,
      kiosks: 2,
      tablets: 8,
      chromeos: 2,
      other: 5,
    },
    assignedUsers: {
      projectManagers: [],
      technicalOwners: [],
      siteOwners: [],
      systemsEngineers: [],
      accountExecutives: [],
      technicalAccountManagers: [],
      technicians: [],
      securitySpecialists: [],
    },
    wiredInfrastructure: {
      vendor: "cisco",
      switchModels: ["Catalyst 9300"],
      switchCount: 5,
      portCount: 240,
      stackingSupport: true,
      poeSupport: true,
      mgmtVlan: 100,
      firmware: "17.09.02",
    },
    wirelessInfrastructure: {
      vendor: "cisco",
      controllerModel: "9800-CL",
      apModels: ["Catalyst 9130AXI"],
      apCount: 12,
      wifiStandards: ["802.11ax"],
      bandSupport: ["2.4GHz", "5GHz"],
      meshSupport: false,
      firmware: "17.09.04",
    },
    connectivity: {
      type: "internet",
      bandwidth: "100Mbps",
      provider: "Local ISP",
      redundancy: false,
    },
    identityProvider: {
      type: "azure-ad",
      domain: "company.com",
      syncEnabled: true,
      mfaEnabled: true,
      conditionalAccess: false,
    },
    mdmProvider: {
      type: "intune",
      enrollmentType: "automatic",
      complianceEnabled: true,
      appManagement: true,
    },
    firewallInfrastructure: {
      vendor: "palo-alto",
      models: ["PA-220"],
      haConfiguration: false,
      userIdIntegration: false,
      syslogEnabled: true,
      firmware: "11.0.2",
    },
    radiusConfiguration: {
      type: "cloud-radius",
      clustering: false,
      loadBalancing: false,
      certificates: true,
    },
    deviceAdministration: {
      type: "radius",
      privilegeLevels: [1, 15],
      commandAuthorization: false,
    },
    vlans: 10,
    subnets: ["192.168.1.0/24"],
    dhcpScopes: 5,
    dnsServers: ["8.8.8.8", "8.8.4.4"],
    globalPolicies: [],
    sitePolicies: [],
    policyEnforcement: {
      dynamic_vlan: true,
      bandwidth_control: false,
      time_based_access: false,
      device_compliance: true,
      location_based: false,
    },
    complianceRequirements: [],
    securityStandards: [],
    dataClassification: "internal",
    notes: "Bulk created site",
    deploymentChecklist: [],
    riskAssessment: [],
    milestones: [],
    startDate: new Date().toISOString().split("T")[0],
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    progress: 0,
  })

  const [randomizeOptions, setRandomizeOptions] = useState({
    location: true,
    users: true,
    devices: true,
    vendors: true,
    priority: false,
    phase: false,
  })

  const handleCreateSites = async () => {
    try {
      if (siteCount < 1 || siteCount > 100) {
        toast({
          title: "Invalid Count",
          description: "Please enter a number between 1 and 100",
          variant: "destructive",
        })
        return
      }

      if (!namingConvention.includes("{n}")) {
        toast({
          title: "Invalid Naming Convention",
          description: "Naming convention must include {n} placeholder",
          variant: "destructive",
        })
        return
      }

      const sites = await storage.createBulkSites(siteCount, template, namingConvention)

      toast({
        title: "Sites Created",
        description: `Successfully created ${sites.length} sites`,
      })

      onSitesCreated?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating bulk sites:", error)
      toast({
        title: "Error",
        description: "Failed to create sites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRandomizeOptionChange = (option: string, checked: boolean) => {
    setRandomizeOptions((prev) => ({
      ...prev,
      [option]: checked,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>Bulk Site Creator</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Bulk Creation Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteCount">Number of Sites</Label>
                    <Input
                      id="siteCount"
                      type="number"
                      min="1"
                      max="100"
                      value={siteCount}
                      onChange={(e) => setSiteCount(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="namingConvention">Naming Convention</Label>
                    <Input
                      id="namingConvention"
                      value={namingConvention}
                      onChange={(e) => setNamingConvention(e.target.value)}
                      placeholder="Site-{n}"
                    />
                    <p className="text-xs text-gray-500">Use {"{n}"} for sequential numbering</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Shuffle className="h-4 w-4" />
                    <span>Randomization Options</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(randomizeOptions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`randomize-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => handleRandomizeOptionChange(key, checked as boolean)}
                        />
                        <Label htmlFor={`randomize-${key}`} className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Site Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={template.region}
                      onValueChange={(value) => setTemplate({ ...template, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                      value={template.country}
                      onValueChange={(value) => setTemplate({ ...template, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {template.country === "United States" && (
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select
                      value={template.state}
                      onValueChange={(value) => setTemplate({ ...template, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Site Type</Label>
                    <Select
                      value={template.siteType}
                      onValueChange={(value) => setTemplate({ ...template, siteType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="headquarters">Headquarters</SelectItem>
                        <SelectItem value="branch">Branch Office</SelectItem>
                        <SelectItem value="campus">Campus</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="floor">Floor</SelectItem>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="datacenter">Data Center</SelectItem>
                        <SelectItem value="remote">Remote Site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={template.priority}
                      onValueChange={(value) => setTemplate({ ...template, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phase</Label>
                    <Select
                      value={template.phase}
                      onValueChange={(value) => setTemplate({ ...template, phase: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PHASES.map((phase) => (
                          <SelectItem key={phase} value={phase}>
                            {phase}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Users</Label>
                    <Input
                      type="number"
                      value={template.users}
                      onChange={(e) => setTemplate({ ...template, users: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Devices</Label>
                    <Input
                      type="number"
                      value={template.devices}
                      onChange={(e) => setTemplate({ ...template, devices: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sites to be created:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {Array.from({ length: Math.min(siteCount, 10) }, (_, i) => (
                        <div key={i} className="text-sm text-gray-600">
                          {namingConvention.replace("{n}", (i + 1).toString().padStart(2, "0"))}
                        </div>
                      ))}
                      {siteCount > 10 && <div className="text-sm text-gray-500">... and {siteCount - 10} more</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Region:</span>
                      <p className="text-gray-600">{template.region}</p>
                    </div>
                    <div>
                      <span className="font-medium">Country:</span>
                      <p className="text-gray-600">{template.country}</p>
                    </div>
                    <div>
                      <span className="font-medium">Site Type:</span>
                      <p className="text-gray-600 capitalize">{template.siteType}</p>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>
                      <p className="text-gray-600 capitalize">{template.priority}</p>
                    </div>
                    <div>
                      <span className="font-medium">Users:</span>
                      <p className="text-gray-600">{template.users}</p>
                    </div>
                    <div>
                      <span className="font-medium">Devices:</span>
                      <p className="text-gray-600">{template.devices}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Randomization Active:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(randomizeOptions)
                        .filter(([, value]) => value)
                        .map(([key]) => (
                          <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Wired Vendor:</span>
                    <p className="text-gray-600 capitalize">{template.wiredInfrastructure?.vendor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Wireless Vendor:</span>
                    <p className="text-gray-600 capitalize">{template.wirelessInfrastructure?.vendor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Firewall Vendor:</span>
                    <p className="text-gray-600 capitalize">{template.firewallInfrastructure?.vendor}</p>
                  </div>
                  <div>
                    <span className="font-medium">MDM Provider:</span>
                    <p className="text-gray-600 capitalize">{template.mdmProvider?.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Identity Provider:</span>
                    <p className="text-gray-600 capitalize">{template.identityProvider?.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">RADIUS Type:</span>
                    <p className="text-gray-600 capitalize">{template.radiusConfiguration?.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSites} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create {siteCount} Sites</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
