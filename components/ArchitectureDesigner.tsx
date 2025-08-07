'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Download, Settings, Eye, Zap, Shield, Network, Wifi, Server, Cloud, Users, Database, Router, Smartphone, Laptop, Monitor, Printer, Globe, Lock, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import InteractiveDiagram from './InteractiveDiagram'

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('complete')
  const [selectedVendor, setSelectedVendor] = useState('cisco')
  const [selectedCloudProvider, setSelectedCloudProvider] = useState('aws')
  const [selectedConnectivity, setSelectedConnectivity] = useState('mpls')
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)

  const architectureViews = [
    { id: 'complete', name: 'Complete Architecture', icon: Network, description: 'Full Zero Trust NAC deployment' },
    { id: 'auth-flow', name: '802.1X Authentication Flow', icon: Shield, description: 'Step-by-step authentication process' },
    { id: 'pki', name: 'PKI Infrastructure', icon: Lock, description: 'Certificate authority and PKI components' },
    { id: 'policies', name: 'Policy Framework', icon: Settings, description: 'Policy engine and enforcement points' },
    { id: 'connectivity', name: 'Multi-Cloud Connectivity', icon: Cloud, description: 'Cloud and hybrid connectivity options' },
    { id: 'intune', name: 'Microsoft Intune Integration', icon: Smartphone, description: 'Mobile device management integration' },
    { id: 'onboarding', name: 'Device Onboarding', icon: Zap, description: 'Automated device provisioning workflow' },
    { id: 'radsec-proxy', name: 'RADSec Proxy', icon: Server, description: 'Simplified RADSec proxy architecture' },
    { id: 'fortigate-tacacs', name: 'FortiGate TACACS+', icon: Shield, description: 'FortiGate firewall admin authentication' },
    { id: 'palo-tacacs', name: 'Palo Alto TACACS+', icon: Shield, description: 'Palo Alto NGFW admin authentication' },
    { id: 'palo-userid', name: 'Palo Alto User-ID', icon: Users, description: 'User identity mapping for firewall policies' },
    { id: 'fortigate-fsso', name: 'FortiGate FSSO', icon: Users, description: 'Fortinet Single Sign-On integration' },
    { id: 'ubiquiti-wireless', name: 'Ubiquiti UniFi Wireless', icon: Wifi, description: 'UniFi wireless infrastructure integration' },
    { id: 'mikrotik-wireless', name: 'MikroTik Wireless', icon: Wifi, description: 'MikroTik wireless and RouterOS integration' },
    { id: 'meraki-wireless', name: 'Cisco Meraki Wireless', icon: Wifi, description: 'Meraki cloud-managed wireless' },
    { id: 'mist-wireless', name: 'Juniper Mist Wireless', icon: Wifi, description: 'Mist AI-driven wireless platform' },
    { id: 'cambium-wireless', name: 'Cambium Networks Wireless', icon: Wifi, description: 'Cambium wireless and cnMaestro' }
  ]

  const networkVendors = [
    { id: 'cisco', name: 'Cisco', description: 'Catalyst switches, ISE integration' },
    { id: 'aruba', name: 'Aruba (HPE)', description: 'ClearPass integration, ArubaOS' },
    { id: 'juniper', name: 'Juniper', description: 'EX/QFX switches, Mist wireless' },
    { id: 'extreme', name: 'Extreme Networks', description: 'ExtremeXOS, wireless controllers' },
    { id: 'ruckus', name: 'Ruckus (CommScope)', description: 'SmartZone controllers, APs' },
    { id: 'fortinet', name: 'Fortinet', description: 'FortiGate, FortiSwitch, FortiAP' },
    { id: 'palo-alto', name: 'Palo Alto', description: 'NGFW, User-ID integration' },
    { id: 'ubiquiti', name: 'Ubiquiti', description: 'UniFi ecosystem, Dream Machine' },
    { id: 'mikrotik', name: 'MikroTik', description: 'RouterOS, wireless solutions' },
    { id: 'meraki', name: 'Cisco Meraki', description: 'Cloud-managed infrastructure' },
    { id: 'cambium', name: 'Cambium Networks', description: 'cnPilot APs, cnMaestro' }
  ]

  const cloudProviders = [
    { id: 'aws', name: 'Amazon Web Services', description: 'EC2, VPC, Direct Connect' },
    { id: 'azure', name: 'Microsoft Azure', description: 'Virtual Networks, ExpressRoute' },
    { id: 'gcp', name: 'Google Cloud Platform', description: 'VPC, Cloud Interconnect' },
    { id: 'multi-cloud', name: 'Multi-Cloud', description: 'Hybrid cloud deployment' }
  ]

  const connectivityOptions = [
    { id: 'mpls', name: 'MPLS', description: 'Traditional MPLS networks' },
    { id: 'sd-wan', name: 'SD-WAN', description: 'Software-defined WAN' },
    { id: 'internet', name: 'Internet VPN', description: 'IPSec over internet' },
    { id: 'direct-connect', name: 'Direct Connect', description: 'Dedicated cloud connections' },
    { id: 'velocloud', name: 'VMware VeloCloud', description: 'VMware SD-WAN solution' },
    { id: 'silver-peak', name: 'Silver Peak', description: 'Aruba EdgeConnect SD-WAN' },
    { id: 'viptela', name: 'Cisco Viptela', description: 'Cisco SD-WAN platform' },
    { id: 'fortinet-sdwan', name: 'Fortinet SD-WAN', description: 'FortiGate SD-WAN' }
  ]

  const exportDiagram = (format: 'png' | 'svg' | 'pdf') => {
    // Export functionality would be implemented here
    console.log(`Exporting diagram as ${format}`)
    // This would capture the SVG and convert to the requested format
  }

  const selectedViewData = architectureViews.find(view => view.id === selectedView)
  const selectedVendorData = networkVendors.find(vendor => vendor.id === selectedVendor)
  const selectedCloudData = cloudProviders.find(cloud => cloud.id === selectedCloudProvider)
  const selectedConnectivityData = connectivityOptions.find(conn => conn.id === selectedConnectivity)

  return (
    <div className="w-full space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-blue-600" />
                <span>Architecture Designer</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Design and visualize your Portnox NAC deployment
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportDiagram('png')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Export PNG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportDiagram('svg')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Export SVG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportDiagram('pdf')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="architecture-view" className="text-sm font-medium">
                Architecture View
              </Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="architecture-view">
                  <SelectValue placeholder="Select architecture view" />
                </SelectTrigger>
                <SelectContent>
                  {architectureViews.map((view) => (
                    <SelectItem key={view.id} value={view.id}>
                      <div className="flex items-center space-x-2">
                        <view.icon className="h-4 w-4" />
                        <span>{view.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="network-vendor" className="text-sm font-medium">
                Network Vendor
              </Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger id="network-vendor">
                  <SelectValue placeholder="Select network vendor" />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cloud-provider" className="text-sm font-medium">
                Cloud Provider
              </Label>
              <Select value={selectedCloudProvider} onValueChange={setSelectedCloudProvider}>
                <SelectTrigger id="cloud-provider">
                  <SelectValue placeholder="Select cloud provider" />
                </SelectTrigger>
                <SelectContent>
                  {cloudProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="connectivity" className="text-sm font-medium">
                Connectivity
              </Label>
              <Select value={selectedConnectivity} onValueChange={setSelectedConnectivity}>
                <SelectTrigger id="connectivity">
                  <SelectValue placeholder="Select connectivity type" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Display selected options */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedViewData && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <selectedViewData.icon className="h-3 w-3" />
                <span>{selectedViewData.name}</span>
              </Badge>
            )}
            {selectedVendorData && (
              <Badge variant="outline">{selectedVendorData.name}</Badge>
            )}
            {selectedCloudData && (
              <Badge variant="outline">{selectedCloudData.name}</Badge>
            )}
            {selectedConnectivityData && (
              <Badge variant="outline">{selectedConnectivityData.name}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diagram Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Diagram Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="animation-speed" className="text-sm font-medium">
                Animation Speed: {animationSpeed}x
              </Label>
              <Slider
                id="animation-speed"
                min={0.5}
                max={3}
                step={0.5}
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-labels"
                checked={showLabels}
                onCheckedChange={setShowLabels}
              />
              <Label htmlFor="show-labels" className="text-sm font-medium">
                Show Labels
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-connections"
                checked={showConnections}
                onCheckedChange={setShowConnections}
              />
              <Label htmlFor="show-connections" className="text-sm font-medium">
                Show Connections
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Diagram */}
      <InteractiveDiagram
        view={selectedView}
        cloudProvider={selectedCloudProvider}
        networkVendor={selectedVendor}
        connectivityType={selectedConnectivity}
        animationSpeed={animationSpeed}
      />

      {/* Architecture Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Architecture Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Selected Architecture</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedViewData?.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Benefits</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Zero Trust network access control</li>
                    <li>• Automated device onboarding</li>
                    <li>• Policy-based network segmentation</li>
                    <li>• Real-time threat detection</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">Portnox Cloud</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Cloud RADIUS service</li>
                    <li>• Policy engine</li>
                    <li>• Device profiling</li>
                    <li>• Analytics dashboard</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Network className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-sm">Network Infrastructure</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• {selectedVendorData?.name} equipment</li>
                    <li>• 802.1X authentication</li>
                    <li>• Dynamic VLAN assignment</li>
                    <li>• CoA support</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-sm">Security Features</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Certificate-based auth</li>
                    <li>• Device compliance</li>
                    <li>• Threat detection</li>
                    <li>• Automated remediation</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Security Controls</span>
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Multi-factor authentication</li>
                    <li>• Device certificate validation</li>
                    <li>• Network access policies</li>
                    <li>• Real-time monitoring</li>
                    <li>• Automated threat response</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Compliance Features</span>
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• HIPAA compliance support</li>
                    <li>• PCI DSS requirements</li>
                    <li>• SOX audit trails</li>
                    <li>• GDPR data protection</li>
                    <li>• Custom compliance policies</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Deployment Steps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm">Configure Portnox Cloud tenant</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm">Deploy RADIUS proxy (if using RADSec)</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm">Configure network equipment</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-sm">Set up identity provider integration</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                      <span className="text-sm">Configure policies and test</span>
                    </div>
                  </div>
                </div>

                {selectedView === 'radsec-proxy' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      RADSec Proxy Deployment Notes
                    </h5>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• No load balancer required - simplified architecture</li>
                      <li>• No Redis cache needed - direct cloud connection</li>
                      <li>• TLS encryption provides security in transit</li>
                      <li>• Single proxy can handle multiple sites</li>
                      <li>• Built-in high availability through cloud redundancy</li>
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
