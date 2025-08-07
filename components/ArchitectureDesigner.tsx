'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, Settings, Eye, Layers, Network, Shield, Cloud, Building, Wifi, Router, Server, Lock, Key, Users, Monitor, Smartphone, Laptop, Printer, Camera, FileImage, FileText } from 'lucide-react'
import InteractiveDiagram from './interactive-diagram'
import ArchitectureLegend from './architecture-legend'
import PolicyEditor from './policy-editor'
import OnboardingScenarios from './onboarding-scenarios'

interface ArchitectureConfig {
  cloudProvider: string
  networkVendor: string
  authMethod: string
  connectivity: string
  mfaEnabled: boolean
  guestAccess: boolean
  byodSupport: boolean
  complianceMode: string
}

const defaultConfig: ArchitectureConfig = {
  cloudProvider: 'azure',
  networkVendor: 'cisco',
  authMethod: 'radius',
  connectivity: 'hybrid',
  mfaEnabled: true,
  guestAccess: true,
  byodSupport: true,
  complianceMode: 'hipaa'
}

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>(defaultConfig)
  const [selectedView, setSelectedView] = useState('complete')
  const [showDataFlow, setShowDataFlow] = useState(false)
  const [activeTab, setActiveTab] = useState('diagram')
  const diagramRef = useRef<HTMLDivElement>(null)

  const updateConfig = (key: keyof ArchitectureConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const exportDiagram = async (format: 'svg' | 'png' | 'pdf') => {
    try {
      // Find the SVG element in the diagram
      const diagramContainer = document.querySelector('.architecture-diagram')
      if (!diagramContainer) {
        alert('No diagram found for export')
        return
      }

      let svgElement = diagramContainer.querySelector('svg')
      
      // If no SVG found, try alternative selectors
      if (!svgElement) {
        svgElement = document.querySelector('#architecture-svg') || 
                    document.querySelector('.diagram-svg') ||
                    document.querySelector('svg')
      }

      if (!svgElement) {
        alert('No SVG element found for export')
        return
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      
      // Add title and metadata
      const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      headerGroup.setAttribute('transform', 'translate(20, 30)')
      
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', '0')
      titleText.setAttribute('y', '0')
      titleText.setAttribute('font-family', 'Arial, sans-serif')
      titleText.setAttribute('font-size', '24')
      titleText.setAttribute('font-weight', 'bold')
      titleText.setAttribute('fill', '#1f2937')
      titleText.textContent = `ABM Industries - Zero Trust NAC Architecture (${config.cloudProvider.toUpperCase()})`
      
      const subtitleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      subtitleText.setAttribute('x', '0')
      subtitleText.setAttribute('y', '50')
      subtitleText.setAttribute('font-family', 'Arial, sans-serif')
      subtitleText.setAttribute('font-size', '12')
      subtitleText.setAttribute('fill', '#6b7280')
      subtitleText.textContent = `Generated on ${new Date().toLocaleDateString()} | View: ${selectedView}`
      
      headerGroup.appendChild(titleText)
      headerGroup.appendChild(subtitleText)
      clonedSvg.insertBefore(headerGroup, clonedSvg.firstChild)

      if (format === 'svg') {
        // Export as SVG
        const svgData = new XMLSerializer().serializeToString(clonedSvg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const downloadLink = document.createElement('a')
        downloadLink.href = svgUrl
        downloadLink.download = `abm-nac-architecture-${selectedView}-${Date.now()}.svg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(svgUrl)
        
      } else if (format === 'png') {
        // Export as PNG
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        // Set canvas size
        canvas.width = 1200
        canvas.height = 800
        
        img.onload = () => {
          if (ctx) {
            // Fill white background
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // Draw the SVG
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            
            // Convert to PNG and download
            canvas.toBlob((blob) => {
              if (blob) {
                const pngUrl = URL.createObjectURL(blob)
                const downloadLink = document.createElement('a')
                downloadLink.href = pngUrl
                downloadLink.download = `abm-nac-architecture-${selectedView}-${Date.now()}.png`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
                URL.revokeObjectURL(pngUrl)
              }
            }, 'image/png')
          }
        }
        
        const svgData = new XMLSerializer().serializeToString(clonedSvg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        img.src = svgUrl
      } else if (format === 'pdf') {
        // For PDF, we'll export as PNG first and show a message
        alert('PDF export will download as PNG. Please convert using your preferred PDF tool.')
        exportDiagram('png')
      }
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const architectureViews = [
    { id: 'complete', name: 'Complete Architecture', icon: Network },
    { id: 'auth-flow', name: 'Authentication Flow', icon: Shield },
    { id: 'network-topology', name: 'Network Topology', icon: Layers },
    { id: 'policy-enforcement', name: 'Policy Enforcement', icon: Lock },
    { id: 'device-onboarding', name: 'Device Onboarding', icon: Smartphone }
  ]

  const sites = [
    { id: 'hq', name: 'Corporate HQ', location: 'New York, NY', users: 500, devices: 1200 },
    { id: 'west', name: 'West Coast Office', location: 'San Francisco, CA', users: 300, devices: 800 },
    { id: 'manufacturing', name: 'Manufacturing Plant', location: 'Detroit, MI', users: 200, devices: 600 },
    { id: 'distribution', name: 'Distribution Center', location: 'Chicago, IL', users: 150, devices: 400 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Architecture Designer</h2>
          <p className="text-gray-600">Design and customize your Zero Trust NAC architecture</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => exportDiagram('svg')}>
            <FileImage className="h-4 w-4 mr-2" />
            Export SVG
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportDiagram('png')}>
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportDiagram('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Architecture Configuration</span>
          </CardTitle>
          <CardDescription>
            Customize your Zero Trust NAC architecture based on your environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cloud-provider">Cloud Provider</Label>
              <Select value={config.cloudProvider} onValueChange={(value) => updateConfig('cloudProvider', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure">Microsoft Azure</SelectItem>
                  <SelectItem value="aws">Amazon AWS</SelectItem>
                  <SelectItem value="gcp">Google Cloud</SelectItem>
                  <SelectItem value="hybrid">Hybrid Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network-vendor">Network Vendor</Label>
              <Select value={config.networkVendor} onValueChange={(value) => updateConfig('networkVendor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cisco">Cisco</SelectItem>
                  <SelectItem value="aruba">Aruba</SelectItem>
                  <SelectItem value="juniper">Juniper</SelectItem>
                  <SelectItem value="fortinet">Fortinet</SelectItem>
                  <SelectItem value="palo-alto">Palo Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-method">Authentication Method</Label>
              <Select value={config.authMethod} onValueChange={(value) => updateConfig('authMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radius">RADIUS</SelectItem>
                  <SelectItem value="tacacs">TACACS+</SelectItem>
                  <SelectItem value="saml">SAML</SelectItem>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectivity">Connectivity</Label>
              <Select value={config.connectivity} onValueChange={(value) => updateConfig('connectivity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud-only">Cloud Only</SelectItem>
                  <SelectItem value="on-premises">On-Premises</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="mfa-enabled"
                checked={config.mfaEnabled}
                onCheckedChange={(checked) => updateConfig('mfaEnabled', checked)}
              />
              <Label htmlFor="mfa-enabled">Multi-Factor Authentication</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="guest-access"
                checked={config.guestAccess}
                onCheckedChange={(checked) => updateConfig('guestAccess', checked)}
              />
              <Label htmlFor="guest-access">Guest Access</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="byod-support"
                checked={config.byodSupport}
                onCheckedChange={(checked) => updateConfig('byodSupport', checked)}
              />
              <Label htmlFor="byod-support">BYOD Support</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-data-flow"
                checked={showDataFlow}
                onCheckedChange={setShowDataFlow}
              />
              <Label htmlFor="show-data-flow">Show Data Flow</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagram">Architecture Diagram</TabsTrigger>
          <TabsTrigger value="policies">Policy Configuration</TabsTrigger>
          <TabsTrigger value="onboarding">Device Onboarding</TabsTrigger>
          <TabsTrigger value="sites">Site Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* View Selector */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Architecture Views</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {architectureViews.map((view) => {
                  const IconComponent = view.icon
                  return (
                    <Button
                      key={view.id}
                      variant={selectedView === view.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedView(view.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {view.name}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Interactive Diagram */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>
                  {architectureViews.find(v => v.id === selectedView)?.name || 'Architecture Diagram'}
                </CardTitle>
                <CardDescription>
                  Interactive diagram showing your Zero Trust NAC architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={diagramRef} className="relative">
                  <InteractiveDiagram
                    config={config}
                    selectedView={selectedView}
                    showDataFlow={showDataFlow}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <ArchitectureLegend config={config} />
        </TabsContent>

        <TabsContent value="policies">
          <PolicyEditor config={config} />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingScenarios config={config} />
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Overview</CardTitle>
              <CardDescription>
                Overview of all sites in your Zero Trust NAC deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sites.map((site) => (
                  <Card key={site.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>{site.name}</span>
                      </CardTitle>
                      <CardDescription>{site.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Users</span>
                          </div>
                          <Badge variant="secondary">{site.users}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Devices</span>
                          </div>
                          <Badge variant="secondary">{site.devices}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Status</span>
                          </div>
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
