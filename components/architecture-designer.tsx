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
    const exportData = {
      architecture: currentView?.name,
      vendor: networkVendors.find(v => v.id === selectedVendor)?.name,
      connectivity: connectivityOptions.find(c => c.id === selectedConnectivity)?.name,
      identity: identityProviders.find(i => i.id === selectedIdentity)?.name,
      exportDate: new Date().toISOString(),
      format: format
    }

    if (format === 'png') {
      // Create a canvas and draw the diagram
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 800
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Set background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add title
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 24px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${currentView?.name} - ${exportData.vendor}`, canvas.width / 2, 50)
        
        // Add export info
        ctx.font = '14px Inter, system-ui, sans-serif'
        ctx.fillText(`Exported: ${new Date().toLocaleDateString()}`, canvas.width / 2, 80)
        
        // Add architecture details
        ctx.textAlign = 'left'
        ctx.font = '16px Inter, system-ui, sans-serif'
        ctx.fillText(`Network Vendor: ${exportData.vendor}`, 50, 150)
        ctx.fillText(`Connectivity: ${exportData.connectivity}`, 50, 180)
        ctx.fillText(`Identity Provider: ${exportData.identity}`, 50, 210)
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `portnox-architecture-${selectedView}-${Date.now()}.png`
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    } else if (format === 'svg') {
      // Create SVG content
      const svgContent = `
        <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="white"/>
          <text x="600" y="50" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937" fontFamily="Inter, system-ui, sans-serif">
            ${currentView?.name} - ${exportData.vendor}
          </text>
          <text x="600" y="80" textAnchor="middle" fontSize="14" fill="#6b7280" fontFamily="Inter, system-ui, sans-serif">
            Exported: ${new Date().toLocaleDateString()}
          </text>
          <text x="50" y="150" fontSize="16" fill="#1f2937" fontFamily="Inter, system-ui, sans-serif">Network Vendor: ${exportData.vendor}</text>
          <text x="50" y="180" fontSize="16" fill="#1f2937" fontFamily="Inter, system-ui, sans-serif">Connectivity: ${exportData.connectivity}</text>
          <text x="50" y="210" fontSize="16" fill="#1f2937" fontFamily="Inter, system-ui, sans-serif">Identity Provider: ${exportData.identity}</text>
          
          <!-- Architecture diagram elements would go here -->
          <rect x="100" y="250" width="200" height="150" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" rx="8"/>
          <text x="200" y="335" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2e7d32" fontFamily="Inter, system-ui, sans-serif">Network Infrastructure</text>
          
          <rect x="400" y="250" width="200" height="150" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" rx="8"/>
          <text x="500" y="335" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e65100" fontFamily="Inter, system-ui, sans-serif">Identity Provider</text>
          
          <rect x="700" y="250" width="200" height="150" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" rx="8"/>
          <text x="800" y="335" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1565c0" fontFamily="Inter, system-ui, sans-serif">Portnox Cloud</text>
          
          <!-- Connection lines -->
          <line x1="300" y1="325" x2="400" y2="325" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <line x1="600" y1="325" x2="700" y2="325" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
            </marker>
          </defs>
        </svg>
      `
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `portnox-architecture-${selectedView}-${Date.now()}.svg`
      link.click()
      URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      // Create PDF-like content (text format for now)
      const pdfContent = `
PORTNOX NAC ARCHITECTURE REPORT
Generated: ${new Date().toLocaleDateString()}

Architecture: ${currentView?.name}
Description: ${currentView?.description}

Configuration:
- Network Vendor: ${exportData.vendor}
- Connectivity: ${exportData.connectivity}
- Identity Provider: ${exportData.identity}
- Deployment Type: ${deploymentTypes.find(d => d.id === selectedDeployment)?.name}

Architecture Overview:
${getArchitectureInfo().overview}

Key Components:
${getArchitectureInfo().components.map((component, index) => `${index + 1}. ${component}`).join('\n')}

Security Features:
${getArchitectureInfo().security.map((item, index) => `• ${item}`).join('\n')}

Deployment Steps:
${getArchitectureInfo().deployment.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---
Report generated by Portnox NAC Architecture Designer
      `
      
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `portnox-architecture-report-${selectedView}-${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const getArchitectureInfo = () => {
    switch (selectedView) {
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
      case '802.1x-auth':
        return {
          overview: 'EAP-TLS certificate-based authentication workflow showing the complete 802.1X authentication process from device connection to network access.',
          components: [
            'End Device with Certificate',
            'Network Access Server (NAS)',
            'RADIUS Server',
            'Certificate Authority',
            'Policy Decision Point'
          ],
          security: [
            'Mutual certificate authentication',
            'EAP-TLS encryption',
            'Certificate validation',
            'Policy-based access control',
            'Session monitoring'
          ],
          deployment: [
            'Deploy certificates to devices',
            'Configure NAS for 802.1X',
            'Set up RADIUS authentication',
            'Define access policies',
            'Test authentication flow'
          ]
        }
      case 'pki-infrastructure':
        return {
          overview: 'Portnox Private PKI infrastructure with comprehensive certificate lifecycle management, SCEP enrollment, and OCSP validation.',
          components: [
            'Portnox Private CA',
            'SCEP Server',
            'OCSP Responder',
            'Certificate Store',
            'Management Console'
          ],
          security: [
            'Private certificate authority',
            'Automated certificate enrollment',
            'Real-time certificate validation',
            'Certificate revocation lists',
            'Secure key management'
          ],
          deployment: [
            'Set up private CA',
            'Configure SCEP enrollment',
            'Deploy OCSP responder',
            'Integrate with MDM',
            'Test certificate lifecycle'
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
    <div className="space-y-6 font-inter">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-semibold">
            <Network className="h-5 w-5" />
            <span>Portnox NAC Architecture Designer</span>
          </CardTitle>
          <CardDescription className="font-medium">
            Design and visualize your Zero Trust NAC deployment with support for multiple vendors and deployment scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Architecture Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Architecture View</label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Select architecture" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="text-xs font-bold text-gray-500 mb-2">CORE ARCHITECTURES</div>
                    {architectureViews.filter(view => view.category === 'core').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span className="font-medium">{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-bold text-gray-500 mb-2">INTEGRATIONS</div>
                    {architectureViews.filter(view => view.category === 'integration').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span className="font-medium">{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-bold text-gray-500 mb-2">VENDOR SPECIFIC</div>
                    {architectureViews.filter(view => view.category === 'vendor').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span className="font-medium">{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-bold text-gray-500 mb-2">WIRELESS VENDORS</div>
                    {architectureViews.filter(view => view.category === 'wireless').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span className="font-medium">{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-2" />
                    <div className="text-xs font-bold text-gray-500 mb-2">SD-WAN</div>
                    {architectureViews.filter(view => view.category === 'sdwan').map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        <div className="flex items-center space-x-2">
                          {view.icon}
                          <span className="font-medium">{view.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Network Vendor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      <div>
                        <div className="font-semibold">{vendor.name}</div>
                        <div className="text-xs text-gray-500">{vendor.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Connectivity</label>
              <Select value={selectedConnectivity} onValueChange={setSelectedConnectivity}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div>
                        <div className="font-semibold">{option.name}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Identity Provider</label>
              <Select value={selectedIdentity} onValueChange={setSelectedIdentity}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Select identity" />
                </SelectTrigger>
                <SelectContent>
                  {identityProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div>
                        <div className="font-semibold">{provider.name}</div>
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
                <h3 className="font-bold text-blue-900">{currentView.name}</h3>
              </div>
              <p className="text-blue-700 text-sm font-medium">{currentView.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="font-medium">{networkVendors.find(v => v.id === selectedVendor)?.name}</Badge>
                <Badge variant="secondary" className="font-medium">{connectivityOptions.find(c => c.id === selectedConnectivity)?.name}</Badge>
                <Badge variant="secondary" className="font-medium">{identityProviders.find(i => i.id === selectedIdentity)?.name}</Badge>
              </div>
            </div>
          )}

          {/* Export Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">Export Options:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('png')}
                className="flex items-center space-x-1 font-medium"
              >
                <FileImage className="h-4 w-4" />
                <span>PNG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('svg')}
                className="flex items-center space-x-1 font-medium"
              >
                <Download className="h-4 w-4" />
                <span>SVG</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-1 font-medium"
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
          <CardTitle className="font-bold">Architecture Details</CardTitle>
          <CardDescription className="font-medium">
            Detailed information about the selected architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="font-medium">Overview</TabsTrigger>
              <TabsTrigger value="components" className="font-medium">Components</TabsTrigger>
              <TabsTrigger value="security" className="font-medium">Security</TabsTrigger>
              <TabsTrigger value="deployment" className="font-medium">Deployment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <p className="text-gray-700 font-medium leading-relaxed">{architectureInfo.overview}</p>
            </TabsContent>
            
            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architectureInfo.components.map((component, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{component}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3">
                {architectureInfo.security.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="deployment" className="space-y-4">
              <div className="space-y-3">
                {architectureInfo.deployment.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{step}</span>
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
