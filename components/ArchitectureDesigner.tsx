'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, FileImage, FileText, Printer, Network, Shield, Cloud, Server, Wifi, Router, Smartphone, Monitor, HardDrive, Database, Lock, Key, Eye, Settings, Users, Globe, Zap, CheckCircle, AlertTriangle, Clock, Play } from 'lucide-react'
import InteractiveDiagram from '@/components/interactive-diagram'
import ArchitectureLegend from '@/components/architecture-legend'

interface ArchitectureView {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'core' | 'integration' | 'vendor' | 'wireless' | 'sdwan'
}

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('zero-trust-nac')
  const [selectedVendor, setSelectedVendor] = useState('cisco')
  const [selectedConnectivity, setSelectedConnectivity] = useState('direct')
  const [selectedIdentity, setSelectedIdentity] = useState('azure-ad')
  const [selectedDeployment, setSelectedDeployment] = useState('cloud')

  const architectureViews: ArchitectureView[] = [
    {
      id: 'zero-trust-nac',
      name: 'Zero Trust NAC Architecture',
      description: 'Complete Zero Trust Network Access Control with Portnox Cloud',
      icon: <Shield className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: '802.1x-auth',
      name: '802.1X Authentication Flow',
      description: 'EAP-TLS certificate-based authentication workflow',
      icon: <Key className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: 'pki-infrastructure',
      name: 'PKI Infrastructure',
      description: 'Portnox Private PKI with certificate lifecycle management',
      icon: <Lock className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: 'policy-framework',
      name: 'Policy Framework',
      description: 'Dynamic policy enforcement and VLAN assignment',
      icon: <Settings className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: 'multi-cloud',
      name: 'Multi-Cloud Connectivity',
      description: 'Hybrid cloud deployment with AWS, Azure, and GCP',
      icon: <Cloud className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: 'intune-integration',
      name: 'Microsoft Intune Integration',
      description: 'MDM integration for certificate deployment and compliance',
      icon: <Smartphone className="h-4 w-4" />,
      category: 'integration'
    },
    {
      id: 'device-onboarding',
      name: 'Device Onboarding Workflow',
      description: 'Automated device enrollment and certificate provisioning',
      icon: <Play className="h-4 w-4" />,
      category: 'integration'
    },
    {
      id: 'radsec-proxy',
      name: 'RADSec Proxy Architecture',
      description: 'Simplified RADSec proxy deployment without load balancers',
      icon: <Server className="h-4 w-4" />,
      category: 'core'
    },
    {
      id: 'fortigate-tacacs',
      name: 'FortiGate TACACS+ Integration',
      description: 'Fortinet firewall management with TACACS+ authentication',
      icon: <Shield className="h-4 w-4" />,
      category: 'vendor'
    },
    {
      id: 'paloalto-tacacs',
      name: 'Palo Alto TACACS+ Integration',
      description: 'Palo Alto firewall management with TACACS+ authentication',
      icon: <Shield className="h-4 w-4" />,
      category: 'vendor'
    },
    {
      id: 'ubiquiti-wireless',
      name: 'Ubiquiti UniFi Wireless',
      description: 'UniFi access points with 802.1X authentication',
      icon: <Wifi className="h-4 w-4" />,
      category: 'wireless'
    },
    {
      id: 'mikrotik-wireless',
      name: 'MikroTik Wireless',
      description: 'MikroTik access points and routers with NAC integration',
      icon: <Router className="h-4 w-4" />,
      category: 'wireless'
    },
    {
      id: 'meraki-wireless',
      name: 'Cisco Meraki Wireless',
      description: 'Meraki cloud-managed wireless with NAC',
      icon: <Wifi className="h-4 w-4" />,
      category: 'wireless'
    },
    {
      id: 'mist-wireless',
      name: 'Juniper Mist Wireless',
      description: 'AI-driven wireless with Mist cloud platform',
      icon: <Wifi className="h-4 w-4" />,
      category: 'wireless'
    },
    {
      id: 'cambium-wireless',
      name: 'Cambium Networks Wireless',
      description: 'Enterprise wireless solutions with NAC integration',
      icon: <Wifi className="h-4 w-4" />,
      category: 'wireless'
    },
    {
      id: 'vmware-sdwan',
      name: 'VMware VeloCloud SD-WAN',
      description: 'SD-WAN connectivity with NAC integration',
      icon: <Globe className="h-4 w-4" />,
      category: 'sdwan'
    },
    {
      id: 'fortinet-sdwan',
      name: 'Fortinet SD-WAN',
      description: 'Secure SD-WAN with integrated NAC policies',
      icon: <Globe className="h-4 w-4" />,
      category: 'sdwan'
    }
  ]

  const networkVendors = [
    { id: 'cisco', name: 'Cisco', description: 'Catalyst switches and wireless' },
    { id: 'juniper', name: 'Juniper', description: 'EX series switches and Mist wireless' },
    { id: 'aruba', name: 'Aruba', description: 'CX switches and wireless APs' },
    { id: 'extreme', name: 'Extreme Networks', description: 'ExtremeSwitch and wireless' },
    { id: 'fortinet', name: 'Fortinet', description: 'FortiSwitch and FortiAP' },
    { id: 'paloalto', name: 'Palo Alto', description: 'Next-gen firewalls' },
    { id: 'meraki', name: 'Cisco Meraki', description: 'Cloud-managed infrastructure' },
    { id: 'ubiquiti', name: 'Ubiquiti', description: 'UniFi ecosystem' },
    { id: 'mikrotik', name: 'MikroTik', description: 'RouterOS and wireless' },
    { id: 'cambium', name: 'Cambium Networks', description: 'Enterprise wireless' },
    { id: 'ruckus', name: 'Ruckus/CommScope', description: 'Enterprise wireless solutions' }
  ]

  const connectivityOptions = [
    { id: 'direct', name: 'Direct Cloud', description: 'Direct connection to Portnox Cloud' },
    { id: 'radsec', name: 'RADSec Proxy', description: 'On-premises RADSec proxy' },
    { id: 'hybrid', name: 'Hybrid', description: 'Mixed direct and proxy connections' },
    { id: 'sdwan', name: 'SD-WAN', description: 'SD-WAN integrated connectivity' }
  ]

  const identityProviders = [
    { id: 'azure-ad', name: 'Azure AD/Entra ID', description: 'Microsoft cloud identity' },
    { id: 'active-directory', name: 'Active Directory', description: 'On-premises AD' },
    { id: 'okta', name: 'Okta', description: 'Identity as a Service' },
    { id: 'ping', name: 'Ping Identity', description: 'Enterprise identity platform' }
  ]

  const deploymentTypes = [
    { id: 'cloud', name: 'Cloud-Only', description: 'Pure cloud deployment' },
    { id: 'hybrid', name: 'Hybrid', description: 'Cloud with on-premises components' },
    { id: 'edge', name: 'Edge Computing', description: 'Edge-based processing' }
  ]

  const currentView = architectureViews.find(view => view.id === selectedView)

  const handleExport = (format: 'png' | 'svg' | 'pdf') => {
    // Export functionality would be implemented here
    console.log(`Exporting diagram as ${format.toUpperCase()}`)
    alert(`Export as ${format.toUpperCase()} - Feature coming soon!`)
  }

  const getArchitectureInfo = () => {
    switch (selectedView) {
      case 'radsec-proxy':
        return {
          overview: 'The RADSec Proxy architecture provides a simplified, secure connection between on-premises network equipment and Portnox Cloud NAC services. This design eliminates the need for load balancers or Redis cache, providing a direct, encrypted tunnel for RADIUS authentication.',
          components: [
            'Site Network Equipment (Switches/APs)',
            'RADSec Proxy (Local)',
            'Internet/WAN Connection',
            'Portnox Cloud RADIUS',
            'Cloud Policy Engine',
            'Identity Store Integration'
          ],
          security: [
            'TLS 1.3 encryption for all RADIUS traffic',
            'Certificate-based proxy authentication',
            'No intermediate caching or load balancing',
            'Direct cloud connection for real-time policy updates',
            'Simplified attack surface'
          ],
          deployment: [
            'Deploy single RADSec proxy per site',
            'Configure network equipment to use proxy as RADIUS server',
            'Establish secure TLS connection to Portnox Cloud',
            'No additional infrastructure components required',
            'Automatic failover to backup cloud endpoints'
          ]
        }
      case 'zero-trust-nac':
        return {
          overview: 'Complete Zero Trust Network Access Control architecture leveraging Portnox Cloud NAC with comprehensive device authentication, policy enforcement, and continuous monitoring.',
          components: [
            'Portnox Cloud NAC Engine',
            'Private PKI Infrastructure',
            'Identity Provider Integration',
            'Network Infrastructure',
            'Endpoint Devices',
            'Policy Management Console'
          ],
          security: [
            'Certificate-based device authentication',
            'Continuous device compliance monitoring',
            'Dynamic VLAN assignment',
            'Real-time threat detection',
            'Encrypted communication channels'
          ],
          deployment: [
            'Cloud-first deployment model',
            'Minimal on-premises infrastructure',
            'Automated certificate provisioning',
            'Centralized policy management',
            'Scalable across multiple sites'
          ]
        }
      default:
        return {
          overview: 'This architecture diagram shows the integration between network infrastructure, identity providers, and Portnox Cloud NAC services.',
          components: ['Network Equipment', 'Identity Provider', 'Portnox Cloud', 'End Devices'],
          security: ['802.1X Authentication', 'Certificate-based Security', 'Policy Enforcement'],
          deployment: ['Cloud-managed', 'Scalable', 'High Availability']
        }
    }
  }

  const architectureInfo = getArchitectureInfo()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Portnox NAC Architecture Designer</span>
          </CardTitle>
          <CardDescription>
            Design and visualize your Zero Trust NAC deployment with support for multiple vendors and deployment scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Architecture Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Architecture View</label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select architecture" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2">CORE ARCHITECTURES</div>
                    {architectureViews.filter(view => view.category === 'core').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span>{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-gray-500 mb-2">INTEGRATIONS</div>
                    {architectureViews.filter(view => view.category === 'integration').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span>{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-gray-500 mb-2">VENDOR SPECIFIC</div>
                    {architectureViews.filter(view => view.category === 'vendor').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span>{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-gray-500 mb-2">WIRELESS VENDORS</div>
                    {architectureViews.filter(view => view.category === 'wireless').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span>{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-gray-500 mb-2">SD-WAN</div>
                    {architectureViews.filter(view => view.category === 'sdwan').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span>{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Network Vendor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-xs text-gray-500">{vendor.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Connectivity</label>
              <Select value={selectedConnectivity} onValueChange={setSelectedConnectivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connectivity" />
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
              <label className="text-sm font-medium">Identity Provider</label>
              <Select value={selectedIdentity} onValueChange={setSelectedIdentity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select identity" />
                </SelectTrigger>
                <SelectContent>
                  {identityProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-gray-500">{provider.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Selection Display */}
          {currentView && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                {currentView.icon}
                <h3 className="font-semibold text-blue-900">{currentView.name}</h3>
              </div>
              <p className="text-blue-700 text-sm">{currentView.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{networkVendors.find(v => v.id === selectedVendor)?.name}</Badge>
                <Badge variant="secondary">{connectivityOptions.find(c => c.id === selectedConnectivity)?.name}</Badge>
                <Badge variant="secondary">{identityProviders.find(i => i.id === selectedIdentity)?.name}</Badge>
              </div>
            </div>
          )}

          {/* Export Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Export Options:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('png')}
                className="flex items-center space-x-1"
              >
                <FileImage className="h-4 w-4" />
                <span>PNG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('svg')}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>SVG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Diagram */}
      <Card>
        <CardContent className="p-6">
          <InteractiveDiagram
            view={selectedView}
            vendor={selectedVendor}
            connectivity={selectedConnectivity}
            identity={selectedIdentity}
            deployment={selectedDeployment}
          />
        </CardContent>
      </Card>

      {/* Architecture Legend */}
      <ArchitectureLegend />

      {/* Architecture Information */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Details</CardTitle>
          <CardDescription>
            Detailed information about the selected architecture
          </CardDescription>
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
              <p className="text-gray-700">{architectureInfo.overview}</p>
              {selectedView === 'radsec-proxy' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Simplified Architecture Benefits</h4>
                  </div>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• No load balancer required - direct proxy to cloud connection</li>
                    <li>• No Redis cache needed - real-time authentication decisions</li>
                    <li>• Reduced infrastructure complexity and maintenance</li>
                    <li>• Lower total cost of ownership</li>
                    <li>• Faster deployment and easier troubleshooting</li>
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architectureInfo.components.map((component, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{component}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3">
                {architectureInfo.security.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="deployment" className="space-y-4">
              <div className="space-y-3">
                {architectureInfo.deployment.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
