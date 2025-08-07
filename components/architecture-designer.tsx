'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import InteractiveDiagram from '@/components/interactive-diagram'
import ArchitectureLegend from '@/components/architecture-legend'
import PolicyEditor from '@/components/policy-editor'
import OnboardingScenarios from '@/components/onboarding-scenarios'
import { Download, Settings, Play, Pause, RotateCcw } from 'lucide-react'

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('complete')
  const [cloudProvider, setCloudProvider] = useState('aws')
  const [networkVendor, setNetworkVendor] = useState('cisco')
  const [connectivityType, setConnectivityType] = useState('expressroute')
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showDataFlow, setShowDataFlow] = useState(false)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showOnboardingScenarios, setShowOnboardingScenarios] = useState(false)

  const architectureViews = [
    { value: 'complete', label: 'Complete Architecture', description: 'Full end-to-end NAC deployment' },
    { value: 'auth-flow', label: 'Authentication Flow', description: 'Step-by-step authentication process' },
    { value: 'pki', label: 'PKI Architecture', description: 'Certificate management and PKI components' },
    { value: 'radsec-proxy', label: 'RADSec Proxy Design', description: 'Detailed proxy architecture and deployment' },
    { value: 'policies', label: 'Policy Framework', description: 'NAC policies and enforcement points' },
    { value: 'connectivity', label: 'Connectivity Options', description: 'Network connectivity patterns' },
    { value: 'intune', label: 'Intune Integration', description: 'Microsoft Intune certificate deployment' },
    { value: 'onboarding', label: 'Device Onboarding', description: 'Device enrollment and onboarding flows' }
  ]

  const cloudProviders = [
    { value: 'aws', label: 'Amazon Web Services', icon: '☁️' },
    { value: 'azure', label: 'Microsoft Azure', icon: '🔷' },
    { value: 'gcp', label: 'Google Cloud Platform', icon: '🌐' },
    { value: 'onprem', label: 'On-Premises', icon: '🏢' }
  ]

  const networkVendors = [
    { value: 'cisco', label: 'Cisco Meraki', icon: '🔧' },
    { value: 'aruba', label: 'Aruba Networks', icon: '📡' },
    { value: 'juniper', label: 'Juniper Networks', icon: '🌿' },
    { value: 'extreme', label: 'Extreme Networks', icon: '⚡' },
    { value: 'fortinet', label: 'Fortinet', icon: '🛡️' }
  ]

  const connectivityOptions = [
    { value: 'expressroute', label: 'Azure ExpressRoute', description: 'Dedicated private connection' },
    { value: 'directconnect', label: 'AWS Direct Connect', description: 'Dedicated network connection to AWS' },
    { value: 'sdwan', label: 'SD-WAN', description: 'Software-defined WAN connectivity' },
    { value: 'mpls', label: 'MPLS Network', description: 'Traditional MPLS connectivity' },
    { value: 'vpn', label: 'Site-to-Site VPN', description: 'IPSec VPN tunnels' },
    { value: 'internet', label: 'Internet', description: 'Public internet connectivity' }
  ]

  const exportDiagram = (format: 'svg' | 'png' | 'pdf') => {
    // Find the SVG element in the InteractiveDiagram component
    const diagramContainer = document.querySelector('.architecture-diagram')
    const svgElement = diagramContainer?.querySelector('svg')
    
    if (!svgElement) {
      console.error('No SVG element found for export')
      alert('No diagram found to export. Please ensure the diagram is loaded.')
      return
    }

    try {
      if (format === 'svg') {
        exportAsSVG(svgElement)
      } else if (format === 'png') {
        exportAsPNG(svgElement)
      } else if (format === 'pdf') {
        // For PDF, we'll export as PNG first and let user convert
        exportAsPNG(svgElement)
        alert('PDF export: PNG file downloaded. You can convert it to PDF using online tools or print to PDF.')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`)
    }
  }

  const exportAsSVG = (svgElement: SVGElement) => {
    // Clone and enhance the SVG
    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute('width', '1400')
    svgClone.setAttribute('height', '1000')
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    
    // Add export header
    const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    headerGroup.setAttribute('id', 'export-header')
    
    const headerBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    headerBg.setAttribute('x', '0')
    headerBg.setAttribute('y', '0')
    headerBg.setAttribute('width', '1400')
    headerBg.setAttribute('height', '80')
    headerBg.setAttribute('fill', '#00c8d7')
    headerGroup.appendChild(headerBg)
    
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    titleText.setAttribute('x', '700')
    titleText.setAttribute('y', '30')
    titleText.setAttribute('text-anchor', 'middle')
    titleText.setAttribute('fill', 'white')
    titleText.setAttribute('font-size', '18')
    titleText.setAttribute('font-weight', 'bold')
    titleText.textContent = `Portnox NAC Architecture - ${architectureViews.find(v => v.value === selectedView)?.label || 'Architecture'}`
    headerGroup.appendChild(titleText)
    
    const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    dateText.setAttribute('x', '700')
    dateText.setAttribute('y', '50')
    dateText.setAttribute('text-anchor', 'middle')
    dateText.setAttribute('fill', 'white')
    dateText.setAttribute('font-size', '12')
    dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
    headerGroup.appendChild(dateText)
    
    svgClone.insertBefore(headerGroup, svgClone.firstChild)
    
    // Adjust existing content
    const existingContent = Array.from(svgClone.children).find(child => 
      child.getAttribute('id') !== 'export-header'
    )
    if (existingContent) {
      existingContent.setAttribute('transform', 'translate(0, 80) scale(0.9)')
    }
    
    // Download SVG
    const svgData = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-architecture-${selectedView}-${Date.now()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsPNG = (svgElement: SVGElement) => {
    // Create enhanced SVG
    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute('width', '1400')
    svgClone.setAttribute('height', '1000')
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    
    // Add white background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    background.setAttribute('x', '0')
    background.setAttribute('y', '0')
    background.setAttribute('width', '1400')
    background.setAttribute('height', '1000')
    background.setAttribute('fill', 'white')
    svgClone.insertBefore(background, svgClone.firstChild)
    
    // Add header
    const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const headerBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    headerBg.setAttribute('x', '0')
    headerBg.setAttribute('y', '0')
    headerBg.setAttribute('width', '1400')
    headerBg.setAttribute('height', '80')
    headerBg.setAttribute('fill', '#00c8d7')
    headerGroup.appendChild(headerBg)
    
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    titleText.setAttribute('x', '700')
    titleText.setAttribute('y', '30')
    titleText.setAttribute('text-anchor', 'middle')
    titleText.setAttribute('fill', 'white')
    titleText.setAttribute('font-size', '18')
    titleText.setAttribute('font-weight', 'bold')
    titleText.textContent = `Portnox NAC Architecture - ${architectureViews.find(v => v.value === selectedView)?.label || 'Architecture'}`
    headerGroup.appendChild(titleText)
    
    const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    dateText.setAttribute('x', '700')
    dateText.setAttribute('y', '50')
    dateText.setAttribute('text-anchor', 'middle')
    dateText.setAttribute('fill', 'white')
    dateText.setAttribute('font-size', '12')
    dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
    headerGroup.appendChild(dateText)
    
    svgClone.insertBefore(headerGroup, background.nextSibling)
    
    // Adjust content position
    const existingContent = Array.from(svgClone.children).find(child => 
      child.tagName !== 'rect' && child.getAttribute('id') !== 'export-header'
    )
    if (existingContent) {
      existingContent.setAttribute('transform', 'translate(0, 80) scale(0.9)')
    }
    
    // Convert to PNG
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = 1400
    canvas.height = 1000
    
    const svgData = new XMLSerializer().serializeToString(svgClone)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx!.drawImage(img, 0, 0, 1400, 1000)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = pngUrl
          link.download = `portnox-architecture-${selectedView}-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(pngUrl)
        }
      }, 'image/png')
      
      URL.revokeObjectURL(url)
    }
    
    img.onerror = () => {
      console.error('Failed to load SVG for PNG conversion')
      alert('Failed to export PNG. Please try again.')
    }
    
    img.src = url
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Portnox NAC Architecture Designer</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => exportDiagram('png')}>
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportDiagram('svg')}>
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Architecture View Selection */}
            <div className="space-y-2">
              <Label htmlFor="view-select">Architecture View</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="view-select">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {architectureViews.map((view) => (
                    <SelectItem key={view.value} value={view.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{view.label}</span>
                        <span className="text-xs text-muted-foreground">{view.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cloud Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="cloud-select">Cloud Provider</Label>
              <Select value={cloudProvider} onValueChange={setCloudProvider}>
                <SelectTrigger id="cloud-select">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {cloudProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <span className="flex items-center space-x-2">
                        <span>{provider.icon}</span>
                        <span>{provider.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network Vendor Selection */}
            <div className="space-y-2">
              <Label htmlFor="vendor-select">Network Vendor</Label>
              <Select value={networkVendor} onValueChange={setNetworkVendor}>
                <SelectTrigger id="vendor-select">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.value} value={vendor.value}>
                      <span className="flex items-center space-x-2">
                        <span>{vendor.icon}</span>
                        <span>{vendor.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Connectivity Type */}
            <div className="space-y-2">
              <Label htmlFor="connectivity-select">Connectivity</Label>
              <Select value={connectivityType} onValueChange={setConnectivityType}>
                <SelectTrigger id="connectivity-select">
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="data-flow"
                  checked={showDataFlow}
                  onCheckedChange={setShowDataFlow}
                />
                <Label htmlFor="data-flow">Show Data Flow</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="animation-speed">Animation Speed:</Label>
                <div className="w-32">
                  <Slider
                    id="animation-speed"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                  />
                </div>
                <Badge variant="outline">{animationSpeed[0]}x</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPolicyEditor(!showPolicyEditor)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Policy Editor
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnboardingScenarios(!showOnboardingScenarios)}
              >
                <Play className="h-4 w-4 mr-2" />
                Onboarding Flows
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>
            {architectureViews.find(v => v.value === selectedView)?.label || 'Architecture Diagram'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InteractiveDiagram
            view={selectedView}
            cloudProvider={cloudProvider}
            networkVendor={networkVendor}
            connectivityType={connectivityType}
            animationSpeed={animationSpeed[0]}
            showDataFlow={showDataFlow}
          />
        </CardContent>
      </Card>

      {/* Architecture Legend */}
      <ArchitectureLegend 
        view={selectedView}
        cloudProvider={cloudProvider}
        networkVendor={networkVendor}
      />

      {/* Policy Editor */}
      {showPolicyEditor && (
        <PolicyEditor 
          onClose={() => setShowPolicyEditor(false)}
        />
      )}

      {/* Onboarding Scenarios */}
      {showOnboardingScenarios && (
        <OnboardingScenarios 
          onClose={() => setShowOnboardingScenarios(false)}
        />
      )}

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RADSec Proxy Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Container-Based Deployment</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Docker containers for easy deployment and scaling</li>
                  <li>• Kubernetes orchestration for high availability</li>
                  <li>• Auto-scaling based on RADIUS request volume</li>
                  <li>• Health checks and automatic failover</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">High Availability Features</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Active/Active proxy pairs in different AZs</li>
                  <li>• 7-day authentication cache for offline operation</li>
                  <li>• Load balancing across multiple proxy instances</li>
                  <li>• Automatic failback when primary comes online</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Security & Compliance</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• TLS 1.3 encryption for all RADSec communications</li>
                  <li>• Certificate-based mutual authentication</li>
                  <li>• Audit logging for all authentication events</li>
                  <li>• FIPS 140-2 Level 2 compliance ready</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Deploy RADSec proxy containers', status: 'complete' },
                { task: 'Configure TLS certificates', status: 'complete' },
                { task: 'Set up load balancer', status: 'in-progress' },
                { task: 'Configure RADIUS shared secrets', status: 'in-progress' },
                { task: 'Test authentication flow', status: 'pending' },
                { task: 'Enable monitoring and alerting', status: 'pending' },
                { task: 'Document runbook procedures', status: 'pending' },
                { task: 'Conduct failover testing', status: 'pending' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'complete' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    item.status === 'complete' ? 'line-through text-gray-500' : ''
                  }`}>
                    {item.task}
                  </span>
                  <Badge variant={
                    item.status === 'complete' ? 'default' :
                    item.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
