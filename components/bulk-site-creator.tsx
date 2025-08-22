"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Building2, MapPin, Users, Settings, Shield, Network, Plus } from "lucide-react"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

interface BulkSiteCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSitesCreated: () => void
}

interface SiteTemplate {
  namePrefix: string
  namingSuffix: string
  count: number
  region: string
  country: string
  state: string
  industry: string
  priority: "High" | "Medium" | "Low"
  userRange: [number, number]
  deviceRange: [number, number]
  budgetRange: [number, number]
  infrastructure: {
    wiredVendor: string
    wirelessVendor: string
    firewallVendor: string
  }
  authentication: {
    identityProviders: string[]
    mdmSolutions: string[]
    authMethods: string[]
  }
  compliance: string[]
  randomizeSettings: boolean
}

const REGIONS = [
  { value: "north-america", label: "North America" },
  { value: "emea", label: "EMEA" },
  { value: "apac", label: "Asia Pacific" },
  { value: "latam", label: "Latin America" },
]

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
]

const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "financial", label: "Financial Services", icon: "🏦" },
  { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "retail", label: "Retail", icon: "🛍️" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "government", label: "Government", icon: "🏛️" },
  { value: "energy", label: "Energy & Utilities", icon: "⚡" },
]

const VENDORS = {
  wired: [
    { value: "cisco", label: "Cisco" },
    { value: "aruba", label: "Aruba" },
    { value: "juniper", label: "Juniper" },
    { value: "extreme", label: "Extreme Networks" },
  ],
  wireless: [
    { value: "cisco", label: "Cisco" },
    { value: "aruba", label: "Aruba" },
    { value: "ruckus", label: "Ruckus" },
    { value: "mist", label: "Mist" },
  ],
  firewall: [
    { value: "palo-alto", label: "Palo Alto" },
    { value: "fortinet", label: "Fortinet" },
    { value: "checkpoint", label: "Check Point" },
    { value: "cisco", label: "Cisco ASA" },
  ],
}

const IDENTITY_PROVIDERS = [
  { value: "azure-ad", label: "Azure AD" },
  { value: "active-directory", label: "Active Directory" },
  { value: "okta", label: "Okta" },
  { value: "ping", label: "Ping Identity" },
]

const MDM_SOLUTIONS = [
  { value: "intune", label: "Microsoft Intune" },
  { value: "jamf", label: "Jamf Pro" },
  { value: "workspace-one", label: "VMware Workspace ONE" },
  { value: "mobileiron", label: "MobileIron" },
]

const COMPLIANCE_FRAMEWORKS = [
  { value: "hipaa", label: "HIPAA" },
  { value: "sox", label: "SOX" },
  { value: "pci-dss", label: "PCI DSS" },
  { value: "gdpr", label: "GDPR" },
  { value: "iso27001", label: "ISO 27001" },
  { value: "nist", label: "NIST" },
]

export default function BulkSiteCreator({ isOpen, onClose, onSitesCreated }: BulkSiteCreatorProps) {
  const [template, setTemplate] = useState<SiteTemplate>({
    namePrefix: "Site",
    namingSuffix: "001",
    count: 5,
    region: "north-america",
    country: "us",
    state: "CA",
    industry: "healthcare",
    priority: "Medium",
    userRange: [100, 500],
    deviceRange: [150, 750],
    budgetRange: [100000, 500000],
    infrastructure: {
      wiredVendor: "cisco",
      wirelessVendor: "cisco",
      firewallVendor: "palo-alto",
    },
    authentication: {
      identityProviders: ["azure-ad"],
      mdmSolutions: ["intune"],
      authMethods: ["802.1x", "captive-portal"],
    },
    compliance: ["hipaa"],
    randomizeSettings: true,
  })

  const [isCreating, setIsCreating] = useState(false)
  const [previewSites, setPreviewSites] = useState<string[]>([])

  const generatePreview = () => {
    const sites = []
    for (let i = 0; i < Math.min(template.count, 10); i++) {
      const siteNumber = String(Number.parseInt(template.namingSuffix) + i).padStart(3, "0")
      sites.push(`${template.namePrefix}-${siteNumber}`)
    }
    setPreviewSites(sites)
  }

  const handleCreateSites = async () => {
    try {
      setIsCreating(true)

      const sites = []
      for (let i = 0; i < template.count; i++) {
        const siteNumber = String(Number.parseInt(template.namingSuffix) + i).padStart(3, "0")
        const userCount = template.randomizeSettings
          ? Math.floor(Math.random() * (template.userRange[1] - template.userRange[0])) + template.userRange[0]
          : template.userRange[0]
        const deviceCount = template.randomizeSettings
          ? Math.floor(Math.random() * (template.deviceRange[1] - template.deviceRange[0])) + template.deviceRange[0]
          : template.deviceRange[0]
        const budget = template.randomizeSettings
          ? Math.floor(Math.random() * (template.budgetRange[1] - template.budgetRange[0])) + template.budgetRange[0]
          : template.budgetRange[0]

        const site = {
          id: `bulk-${Date.now()}-${i}`,
          name: `${template.namePrefix}-${siteNumber}`,
          location: `${template.state}, ${template.country.toUpperCase()}`,
          region: template.region,
          country: template.country,
          city: `City ${i + 1}`,
          state: template.state,
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          address: `${100 + i} Business Blvd`,
          contactName: `Site Manager ${i + 1}`,
          contactEmail: `manager${i + 1}@company.com`,
          contactPhone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          projectManager: `PM-${i + 1}`,
          technicalOwner: `Tech-${i + 1}`,
          technicalOwners: [`tech-${i + 1}`],
          assignedUsers: [`user-${i + 1}`, `user-${i + 2}`],
          industry: template.industry,
          priority: template.randomizeSettings
            ? (["High", "Medium", "Low"] as const)[Math.floor(Math.random() * 3)]
            : template.priority,
          status: (["Planned", "In Progress"] as const)[Math.floor(Math.random() * 2)],
          phase: String(Math.floor(Math.random() * 3) + 1),
          users: userCount,
          devices: Math.floor(deviceCount * 0.4) + Math.floor(deviceCount * 0.2) + Math.floor(deviceCount * 0.1) + Math.floor(deviceCount * 0.2) + Math.floor(deviceCount * 0.1) + Math.floor(deviceCount * 0.05),
          deviceBreakdown: {
            windows: Math.floor(deviceCount * 0.4),
            mac: Math.floor(deviceCount * 0.2),
            linux: Math.floor(deviceCount * 0.1),
            ios: Math.floor(deviceCount * 0.2),
            android: Math.floor(deviceCount * 0.1),
            iot: Math.floor(deviceCount * 0.05),
          },
          budget,
          startDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
          targetDate: new Date(Date.now() + (i + 12) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          completionPercent: Math.floor(Math.random() * 30),
          timeZone: "America/Los_Angeles",
          notes: `Bulk created site for ${template.industry} deployment`,
          infrastructure: {
            wired: {
              vendor: template.infrastructure.wiredVendor,
              model: `SW-${Math.floor(Math.random() * 9000) + 1000}`,
              switches: Math.floor(Math.random() * 10) + 5,
              ports: Math.floor(Math.random() * 200) + 100,
            },
            wireless: {
              vendor: template.infrastructure.wirelessVendor,
              model: `AP-${Math.floor(Math.random() * 9000) + 1000}`,
              accessPoints: Math.floor(Math.random() * 30) + 10,
              controllers: Math.floor(Math.random() * 3) + 1,
            },
            firewall: {
              vendor: template.infrastructure.firewallVendor,
              model: `FW-${Math.floor(Math.random() * 9000) + 1000}`,
              throughput: `${Math.floor(Math.random() * 5) + 1}Gbps`,
            },
            radius: {
              type: "cloud",
              vendor: "portnox",
            },
          },
          authentication: {
            identityProvider: template.authentication.identityProviders,
            mdm: template.authentication.mdmSolutions,
            authMethods: template.authentication.authMethods,
          },
          compliance: template.compliance,
          securityRequirements: ["802.1X Authentication", "Device Compliance", "Network Segmentation"],
          risks: [],
          networkSegments: [
            {
              name: "Corporate Network",
              vlan: 10,
              subnet: `10.${i + 1}.0.0/24`,
              description: "Main corporate network segment",
            },
          ],
          userCounts: {
            employees: Math.floor(userCount * 0.8),
            contractors: Math.floor(userCount * 0.15),
            guests: Math.floor(userCount * 0.05),
            total: userCount,
          },
          deviceCounts: {
            windows: Math.floor(deviceCount * 0.4),
            mac: Math.floor(deviceCount * 0.2),
            linux: Math.floor(deviceCount * 0.1),
            ios: Math.floor(deviceCount * 0.2),
            android: Math.floor(deviceCount * 0.1),
            iot: Math.floor(deviceCount * 0.05),
            total: deviceCount,
          },
          complianceFrameworks: template.compliance,
          identityProvider: template.authentication.identityProviders,
          mdmSolution: template.authentication.mdmSolutions,
          radiusType: "Cloud RADIUS",
          deviceAdmin: "TACACS+",
        }

        sites.push(site)
      }

      // Save all sites
      for (const site of sites) {
        await storage.addSite({
          ...site,
          size: "medium",
          config: {
            identityProviders: ["azure_ad"],
            mdmProviders: ["intune"],
            authMethods: ["802.1x", "mac_auth"]
          }
        })
      }

      toast({
        title: "Sites Created Successfully",
        description: `${template.count} sites have been created and added to your project.`,
      })

      onSitesCreated()
      onClose()
    } catch (error) {
      console.error("Error creating sites:", error)
      toast({
        title: "Error",
        description: "Failed to create sites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bulk Site Creator
          </DialogTitle>
          <DialogDescription>Create multiple sites at once with consistent configuration templates</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Site Name Prefix</Label>
                    <Input
                      value={template.namePrefix}
                      onChange={(e) => setTemplate({ ...template, namePrefix: e.target.value })}
                      placeholder="e.g., Site, Branch, Office"
                    />
                  </div>
                  <div>
                    <Label>Starting Number</Label>
                    <Input
                      value={template.namingSuffix}
                      onChange={(e) => setTemplate({ ...template, namingSuffix: e.target.value })}
                      placeholder="001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Number of Sites</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[template.count]}
                        onValueChange={(value) => setTemplate({ ...template, count: value[0] })}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-500">{template.count} sites</div>
                    </div>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={template.priority}
                      onValueChange={(value: "High" | "Medium" | "Low") =>
                        setTemplate({ ...template, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="Low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="randomize"
                    checked={template.randomizeSettings}
                    onCheckedChange={(checked) => setTemplate({ ...template, randomizeSettings: !!checked })}
                  />
                  <Label htmlFor="randomize">Randomize settings for variety</Label>
                </div>
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
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
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
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
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>State/Province</Label>
                    <Input
                      value={template.state}
                      onChange={(e) => setTemplate({ ...template, state: e.target.value })}
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select
                    value={template.industry}
                    onValueChange={(value) => setTemplate({ ...template, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          <span className="flex items-center gap-2">
                            <span>{industry.icon}</span>
                            {industry.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Capacity & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>User Count Range</Label>
                  <div className="space-y-2">
                    <Slider
                      value={template.userRange}
                      onValueChange={(value) => setTemplate({ ...template, userRange: value as [number, number] })}
                      max={2000}
                      min={50}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{template.userRange[0]} users</span>
                      <span>{template.userRange[1]} users</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Device Count Range</Label>
                  <div className="space-y-2">
                    <Slider
                      value={template.deviceRange}
                      onValueChange={(value) => setTemplate({ ...template, deviceRange: value as [number, number] })}
                      max={3000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{template.deviceRange[0]} devices</span>
                      <span>{template.deviceRange[1]} devices</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Budget Range (USD)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={template.budgetRange}
                      onValueChange={(value) => setTemplate({ ...template, budgetRange: value as [number, number] })}
                      max={1000000}
                      min={50000}
                      step={25000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${(template.budgetRange[0] / 1000).toFixed(0)}K</span>
                      <span>${(template.budgetRange[1] / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Wired Vendor</Label>
                    <Select
                      value={template.infrastructure.wiredVendor}
                      onValueChange={(value) =>
                        setTemplate({
                          ...template,
                          infrastructure: { ...template.infrastructure, wiredVendor: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDORS.wired.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            {vendor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Wireless Vendor</Label>
                    <Select
                      value={template.infrastructure.wirelessVendor}
                      onValueChange={(value) =>
                        setTemplate({
                          ...template,
                          infrastructure: { ...template.infrastructure, wirelessVendor: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDORS.wireless.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            {vendor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Firewall Vendor</Label>
                    <Select
                      value={template.infrastructure.firewallVendor}
                      onValueChange={(value) =>
                        setTemplate({
                          ...template,
                          infrastructure: { ...template.infrastructure, firewallVendor: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDORS.firewall.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            {vendor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Authentication & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Identity Providers</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {IDENTITY_PROVIDERS.map((provider) => (
                      <div key={provider.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`idp-${provider.value}`}
                          checked={template.authentication.identityProviders.includes(provider.value)}
                          onCheckedChange={(checked) => {
                            const providers = checked
                              ? [...template.authentication.identityProviders, provider.value]
                              : template.authentication.identityProviders.filter((p) => p !== provider.value)
                            setTemplate({
                              ...template,
                              authentication: { ...template.authentication, identityProviders: providers },
                            })
                          }}
                        />
                        <Label htmlFor={`idp-${provider.value}`} className="text-sm">
                          {provider.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>MDM Solutions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {MDM_SOLUTIONS.map((mdm) => (
                      <div key={mdm.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mdm-${mdm.value}`}
                          checked={template.authentication.mdmSolutions.includes(mdm.value)}
                          onCheckedChange={(checked) => {
                            const solutions = checked
                              ? [...template.authentication.mdmSolutions, mdm.value]
                              : template.authentication.mdmSolutions.filter((m) => m !== mdm.value)
                            setTemplate({
                              ...template,
                              authentication: { ...template.authentication, mdmSolutions: solutions },
                            })
                          }}
                        />
                        <Label htmlFor={`mdm-${mdm.value}`} className="text-sm">
                          {mdm.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Compliance Frameworks</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {COMPLIANCE_FRAMEWORKS.map((framework) => (
                      <div key={framework.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`comp-${framework.value}`}
                          checked={template.compliance.includes(framework.value)}
                          onCheckedChange={(checked) => {
                            const frameworks = checked
                              ? [...template.compliance, framework.value]
                              : template.compliance.filter((c) => c !== framework.value)
                            setTemplate({ ...template, compliance: frameworks })
                          }}
                        />
                        <Label htmlFor={`comp-${framework.value}`} className="text-sm">
                          {framework.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>Preview of sites that will be created</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generatePreview} variant="outline" className="w-full bg-transparent" size="sm">
                  Generate Preview
                </Button>

                {previewSites.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Site Names:</Label>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {previewSites.map((siteName, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded border">
                          {siteName}
                        </div>
                      ))}
                    </div>
                    {template.count > 10 && (
                      <div className="text-xs text-gray-500 text-center">... and {template.count - 10} more sites</div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sites:</span>
                    <Badge>{template.count}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Region:</span>
                    <span className="capitalize">{template.region.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <span className="capitalize">{template.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Range:</span>
                    <span>
                      {template.userRange[0]}-{template.userRange[1]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Range:</span>
                    <span>
                      ${(template.budgetRange[0] / 1000).toFixed(0)}K-${(template.budgetRange[1] / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Options:</Label>
                  <div className="space-y-1">
                    {template.authentication.identityProviders.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.authentication.identityProviders.map((idp) => (
                          <Badge key={idp} variant="secondary" className="text-xs">
                            {IDENTITY_PROVIDERS.find((p) => p.value === idp)?.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {template.compliance.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.compliance.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {COMPLIANCE_FRAMEWORKS.find((c) => c.value === comp)?.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button onClick={handleCreateSites} disabled={isCreating || template.count === 0} className="w-full">
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Sites...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create {template.count} Sites
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
