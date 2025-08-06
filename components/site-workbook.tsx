'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Save, Download, Upload, FileText, Network, Users, Shield, Settings, CheckCircle, AlertCircle } from 'lucide-react'

interface SiteInfo {
  name: string
  location: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
}

interface NetworkConfig {
  vlanId: string
  subnetRange: string
  gatewayIp: string
  dnsServers: string
  radiusServer: string
  radiusSecret: string
}

export default function SiteWorkbook() {
  const [selectedSite, setSelectedSite] = useState('site1')
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    name: 'Corporate Headquarters',
    location: 'New York, NY',
    contactPerson: 'John Smith',
    contactEmail: 'john.smith@company.com',
    contactPhone: '+1 (555) 123-4567'
  })

  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
    vlanId: '100',
    subnetRange: '192.168.100.0/24',
    gatewayIp: '192.168.100.1',
    dnsServers: '8.8.8.8, 8.8.4.4',
    radiusServer: '192.168.1.10',
    radiusSecret: 'shared-secret-123'
  })

  const [validationStatus, setValidationStatus] = useState({
    siteInfo: true,
    networkConfig: true,
    deviceConfig: false,
    policies: true
  })

  const sites = [
    { id: 'site1', name: 'Corporate Headquarters', status: 'active' },
    { id: 'site2', name: 'West Coast Office', status: 'pending' },
    { id: 'site3', name: 'Manufacturing Plant', status: 'draft' },
    { id: 'site4', name: 'Research Facility', status: 'draft' }
  ]

  const updateSiteInfo = (field: keyof SiteInfo, value: string) => {
    setSiteInfo(prev => ({ ...prev, [field]: value }))
  }

  const updateNetworkConfig = (field: keyof NetworkConfig, value: string) => {
    setNetworkConfig(prev => ({ ...prev, [field]: value }))
  }

  const exportWorkbook = () => {
    const workbookData = {
      siteInfo,
      networkConfig,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(workbookData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `site-workbook-${selectedSite}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Workbook</h2>
          <p className="text-muted-foreground">Configure and document site-specific settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportWorkbook}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Site Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Site Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="site-select">Select Site</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center space-x-2">
                        <span>{site.name}</span>
                        <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                          {site.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="site-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site-info" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Site Info</span>
            {getStatusIcon(validationStatus.siteInfo)}
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Network</span>
            {getStatusIcon(validationStatus.networkConfig)}
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Devices</span>
            {getStatusIcon(validationStatus.deviceConfig)}
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Policies</span>
            {getStatusIcon(validationStatus.policies)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={siteInfo.name}
                    onChange={(e) => updateSiteInfo('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={siteInfo.location}
                    onChange={(e) => updateSiteInfo('location', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <h4 className="font-semibold">Primary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    value={siteInfo.contactPerson}
                    onChange={(e) => updateSiteInfo('contactPerson', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={siteInfo.contactEmail}
                    onChange={(e) => updateSiteInfo('contactEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={siteInfo.contactPhone}
                    onChange={(e) => updateSiteInfo('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vlan-id">VLAN ID</Label>
                  <Input
                    id="vlan-id"
                    value={networkConfig.vlanId}
                    onChange={(e) => updateNetworkConfig('vlanId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subnet-range">Subnet Range</Label>
                  <Input
                    id="subnet-range"
                    value={networkConfig.subnetRange}
                    onChange={(e) => updateNetworkConfig('subnetRange', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateway-ip">Gateway IP</Label>
                  <Input
                    id="gateway-ip"
                    value={networkConfig.gatewayIp}
                    onChange={(e) => updateNetworkConfig('gatewayIp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dns-servers">DNS Servers</Label>
                  <Input
                    id="dns-servers"
                    value={networkConfig.dnsServers}
                    onChange={(e) => updateNetworkConfig('dnsServers', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <h4 className="font-semibold">RADIUS Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="radius-server">RADIUS Server</Label>
                  <Input
                    id="radius-server"
                    value={networkConfig.radiusServer}
                    onChange={(e) => updateNetworkConfig('radiusServer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius-secret">Shared Secret</Label>
                  <Input
                    id="radius-secret"
                    type="password"
                    value={networkConfig.radiusSecret}
                    onChange={(e) => updateNetworkConfig('radiusSecret', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Device Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  Configure network devices and access points for this site
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Device List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Corporate Devices</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Full network access for managed corporate devices
                  </p>
                  <div className="text-xs text-muted-foreground">
                    VLAN: 100 | Access Level: Full | Authentication: Certificate
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Guest Devices</h4>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Limited internet access for guest devices
                  </p>
                  <div className="text-xs text-muted-foreground">
                    VLAN: 200 | Access Level: Internet Only | Authentication: Captive Portal
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">IoT Devices</h4>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Restricted access for IoT and smart devices
                  </p>
                  <div className="text-xs text-muted-foreground">
                    VLAN: 300 | Access Level: Restricted | Authentication: MAC Address
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
