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
import { Download, Eye, Settings, Zap, Shield, Network, Wifi, Router, Cloud } from 'lucide-react'
import InteractiveDiagram from './InteractiveDiagram'
import ArchitectureLegend from './ArchitectureLegend'
import PolicyEditor from './PolicyEditor'
import OnboardingScenarios from './OnboardingScenarios'

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('complete')
  const [cloudProvider, setCloudProvider] = useState('portnox')
  const [networkVendor, setNetworkVendor] = useState('cisco')
  const [connectivityType, setConnectivityType] = useState('radsec')
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [enableAnimations, setEnableAnimations] = useState(true)

  const architectureViews = [
    { id: 'complete', name: 'Complete Architecture', icon: Network, description: 'Full Zero Trust NAC deployment' },
    { id: 'auth-flow', name: 'Authentication Flow', icon: Shield, description: '802.1X authentication process' },
    { id: 'pki', name: 'PKI Infrastructure', icon: Shield, description: 'Certificate management and PKI' },
    { id: 'policies', name: 'Policy Framework', icon: Settings, description: 'Dynamic policy enforcement' },
    { id: 'connectivity', name: 'Multi-Cloud Connectivity', icon: Cloud, description: 'Cloud and hybrid connectivity' },
    { id: 'intune', name: 'Microsoft Intune Integration', icon: Settings, description: 'MDM and device management' },
    { id: 'onboarding', name: 'Device Onboarding', icon: Zap, description: 'Automated device provisioning' },
    { id: 'radsec-proxy', name: 'RADSec Proxy', icon: Shield, description: 'Secure RADIUS over TLS' },
    { id: 'fortigate-tacacs', name: 'FortiGate TACACS+', icon: Shield, description: 'Fortinet firewall admin auth' },
    { id: 'palo-tacacs', name: 'Palo Alto TACACS+', icon: Shield, description: 'Palo Alto admin authentication' },
    { id: 'palo-userid', name: 'Palo Alto User-ID', icon: Shield, description: 'User identity integration' },
    { id: 'fortigate-fsso', name: 'FortiGate FSSO', icon: Shield, description: 'Fortinet single sign-on' },
    { id: 'ubiquiti-wireless', name: 'Ubiquiti UniFi Wireless', icon: Wifi, description: 'UniFi wireless integration' },
    { id: 'mikrotik-wireless', name: 'MikroTik Wireless', icon: Wifi, description: 'MikroTik wireless solution' },
    { id: 'meraki-wireless', name: 'Cisco Meraki Wireless', icon: Wifi, description: 'Meraki cloud wireless' },
    { id: 'mist-wireless', name: 'Juniper Mist Wireless', icon: Wifi, description: 'Mist AI-driven wireless' },
    { id: 'cambium-wireless', name: 'Cambium Networks Wireless', icon: Wifi, description: 'Cambium wireless solution' }
  ]

  const networkVendors = [
    'Cisco', 'Aruba/HPE', 'Juniper', 'Extreme Networks', 'Fortinet', 'Palo Alto', 
    'Ubiquiti', 'MikroTik', 'Ruckus/CommScope', 'Meraki', 'Mist', 'Cambium Networks'
  ]

  const connectivityOptions = [
    { id: 'radsec', name: 'RADSec (RADIUS over TLS)', description: 'Secure RADIUS communication' },
    { id: 'ipsec', name: 'IPSec VPN', description: 'Site-to-site VPN connectivity' },
    { id: 'sd-wan', name: 'SD-WAN', description: 'Software-defined WAN' },
    { id: 'mpls', name: 'MPLS', description: 'Multi-protocol label switching' },
    { id: 'internet', name: 'Internet/Broadband', description: 'Direct internet connectivity' },
    { id: 'velocloud', name: 'VMware VeloCloud', description: 'VMware SD-WAN solution' },
    { id: 'silver-peak', name: 'Silver Peak', description: 'Aruba EdgeConnect SD-WAN' },
    { id: 'viptela', name: 'Cisco Viptela', description: 'Cisco SD-WAN solution' },
    { id: 'fortinet-sdwan', name: 'Fortinet SD-WAN', description: 'FortiGate SD-WAN' }
  ]

  const handleExport = (format: string) => {
    console.log(`Exporting diagram as ${format}`)
    // Implementation for export functionality
  }

  const getRADSecProxyDiagram = () => {
    return (
      <div className="w-full">
        <svg width="1000" height="600" viewBox="0 0 1000 600" className="border rounded-lg bg-gray-50 dark:bg-gray-900">
          {/* Site Network */}
          <g>
            <rect x="50" y="200" width="200" height="200" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2" rx="10" />
            <text x="150" y="190" textAnchor="middle" className="font-semibold" fontSize="14" fill="#1976D2">Site Network</text>
            
            {/* Network Switch */}
            <rect x="80" y="230" width="60" height="40" fill="#FF9800" stroke="#F57C00" strokeWidth="2" rx="5" />
            <text x="110" y="255" textAnchor="middle" fontSize="10" fill="white">Switch</text>
            
            {/* Wireless AP */}
            <rect x="80" y="290" width="60" height="40" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" rx="5" />
            <text x="110" y="315" textAnchor="middle" fontSize="10" fill="white">Wireless AP</text>
            
            {/* Devices */}
            <circle cx="200" cy="250" r="15" fill="#2196F3" stroke="#1565C0" strokeWidth="2" />
            <text x="200" y="255" textAnchor="middle" fontSize="8" fill="white">PC</text>
            
            <circle cx="200" cy="310" r="15" fill="#9C27B0" stroke="#7B1FA2" strokeWidth="2" />
            <text x="200" y="315" textAnchor="middle" fontSize="8" fill="white">Mobile</text>
          </g>

          {/* RADSec Proxy */}
          <g>
            <rect x="350" y="250" width="120" height="100" fill="#00C8D7" stroke="#0097A7" strokeWidth="3" rx="10" />
            <text x="410" y="240" textAnchor="middle" className="font-semibold" fontSize="14" fill="#00C8D7">RADSec Proxy</text>
            <text x="410" y="285" textAnchor="middle" fontSize="12" fill="white">Local RADIUS</text>
            <text x="410" y="305" textAnchor="middle" fontSize="12" fill="white">TLS Encryption</text>
            <text x="410" y="325" textAnchor="middle" fontSize="12" fill="white">Certificate Auth</text>
          </g>

          {/* Internet/WAN */}
          <g>
            <ellipse cx="600" cy="300" rx="80" ry="40" fill="#FFC107" stroke="#FF8F00" strokeWidth="2" />
            <text x="600" y="295" textAnchor="middle" className="font-semibold" fontSize="12" fill="#FF8F00">Internet/WAN</text>
            <text x="600" y="310" textAnchor="middle" fontSize="10" fill="#FF8F00">Encrypted Traffic</text>
          </g>

          {/* Portnox Cloud */}
          <g>
            <rect x="750" y="200" width="200" height="200" fill="#E8F5E8" stroke="#4CAF50" strokeWidth="2" rx="10" />
            <text x="850" y="190" textAnchor="middle" className="font-semibold" fontSize="14" fill="#4CAF50">Portnox Cloud</text>
            
            {/* Cloud RADIUS */}
            <rect x="780" y="230" width="80" height="40" fill="#00C8D7" stroke="#0097A7" strokeWidth="2" rx="5" />
            <text x="820" y="255" textAnchor="middle" fontSize="10" fill="white">Cloud RADIUS</text>
            
            {/* Policy Engine */}
            <rect x="780" y="290" width="80" height="40" fill="#FF5722" stroke="#D84315" strokeWidth="2" rx="5" />
            <text x="820" y="315" textAnchor="middle" fontSize="10" fill="white">Policy Engine</text>
            
            {/* Identity Sources */}
            <rect x="870" y="230" width="60" height="40" fill="#9C27B0" stroke="#7B1FA2" strokeWidth="2" rx="5" />
            <text x="900" y="255" textAnchor="middle" fontSize="9" fill="white">AD/Entra</text>
            
            <rect x="870" y="290" width="60" height="40" fill="#607D8B" stroke="#455A64" strokeWidth="2" rx="5" />
            <text x="900" y="315" textAnchor="middle" fontSize="9" fill="white">Certificate</text>
          </g>

          {/* Connections */}
          {/* Switch to RADSec Proxy */}
          <line x1="140" y1="250" x2="350" y2="280" stroke="#1976D2" strokeWidth="3" markerEnd="url(#arrowhead)" />
          <text x="245" y="260" textAnchor="middle" fontSize="10" fill="#1976D2">RADIUS</text>
          
          {/* AP to RADSec Proxy */}
          <line x1="140" y1="310" x2="350" y2="320" stroke="#4CAF50" strokeWidth="3" markerEnd="url(#arrowhead)" />
          <text x="245" y="320" textAnchor="middle" fontSize="10" fill="#4CAF50">RADIUS</text>
          
          {/* RADSec Proxy to Internet */}
          <line x1="470" y1="300" x2="520" y2="300" stroke="#00C8D7" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <text x="495" y="290" textAnchor="middle" fontSize="10" fill="#00C8D7">RADSec/TLS</text>
          
          {/* Internet to Portnox Cloud */}
          <line x1="680" y1="300" x2="750" y2="300" stroke="#00C8D7" strokeWidth="4" markerEnd="url(#arrowhead)" />
          <text x="715" y="290" textAnchor="middle" fontSize="10" fill="#00C8D7">RADSec/TLS</text>

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
          </defs>

          {/* Labels and annotations */}
          <text x="500" y="50" textAnchor="middle" className="font-bold" fontSize="18" fill="#333">RADSec Proxy Architecture</text>
          <text x="500" y="70" textAnchor="middle" fontSize="12" fill="#666">Secure RADIUS over TLS - No Load Balancer or Cache Required</text>
          
          {/* Key Benefits */}
          <g>
            <text x="50" y="450" className="font-semibold" fontSize="12" fill="#333">Key Benefits:</text>
            <text x="50" y="470" fontSize="11" fill="#666">• Direct encrypted RADIUS communication</text>
            <text x="50" y="485" fontSize="11" fill="#666">• Certificate-based authentication</text>
            <text x="50" y="500" fontSize="11" fill="#666">• Simplified architecture without additional components</text>
            <text x="50" y="515" fontSize="11" fill="#666">• High availability through cloud redundancy</text>
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Architecture Designer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* View Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {architectureViews.map((view) => (
              <Card 
                key={view.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedView === view.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedView(view.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <view.icon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">{view.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{view.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Network Vendor</Label>
              <Select value={networkVendor} onValueChange={setNetworkVendor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.toLowerCase()} value={vendor.toLowerCase()}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connectivity Type</Label>
              <Select value={connectivityType} onValueChange={setConnectivityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cloud Provider</Label>
              <Select value={cloudProvider} onValueChange={setCloudProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portnox">Portnox Cloud</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Microsoft Azure</SelectItem>
                  <SelectItem value="gcp">Google Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-options"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label htmlFor="advanced-options">Show Advanced Options</Label>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animations"
                    checked={enableAnimations}
                    onCheckedChange={setEnableAnimations}
                  />
                  <Label htmlFor="animations">Enable Animations</Label>
                </div>
              </div>
              
              {enableAnimations && (
                <div className="space-y-2">
                  <Label>Animation Speed: {animationSpeed[0]}x</Label>
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    max={3}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Export Options */}
          <div className="flex items-center space-x-2">
            <Button onClick={() => handleExport('png')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
            <Button onClick={() => handleExport('svg')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export SVG
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="diagram" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diagram">Architecture Diagram</TabsTrigger>
          <TabsTrigger value="policies">Policy Configuration</TabsTrigger>
          <TabsTrigger value="scenarios">Onboarding Scenarios</TabsTrigger>
          <TabsTrigger value="legend">Legend & Components</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-4">
          {selectedView === 'radsec-proxy' ? (
            <Card>
              <CardContent className="p-6">
                {getRADSecProxyDiagram()}
              </CardContent>
            </Card>
          ) : (
            <InteractiveDiagram
              view={selectedView}
              cloudProvider={cloudProvider}
              networkVendor={networkVendor}
              connectivityType={connectivityType}
              animationSpeed={enableAnimations ? animationSpeed[0] : 0}
            />
          )}
        </TabsContent>

        <TabsContent value="policies">
          <PolicyEditor />
        </TabsContent>

        <TabsContent value="scenarios">
          <OnboardingScenarios />
        </TabsContent>

        <TabsContent value="legend">
          <ArchitectureLegend />
        </TabsContent>
      </Tabs>
    </div>
  )
}
