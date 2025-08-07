'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Download, FileImage, FileText, Settings, Eye, EyeOff, Zap, Shield, Network, Cloud, Building, Users, Lock, Key, Wifi, Router, Server, Database, Globe, Monitor, Smartphone, Laptop, Tablet } from 'lucide-react'
import { InteractiveDiagram } from './InteractiveDiagram'
import { ArchitectureLegend } from './ArchitectureLegend'

interface ArchitectureConfig {
  cloudProvider: string
  networkVendor: string
  authMethod: string
  connectivity: string
  deviceTypes: string[]
  showDataFlow: boolean
  showSecurityZones: boolean
  showRedundancy: boolean
}

const defaultConfig: ArchitectureConfig = {
  cloudProvider: 'azure',
  networkVendor: 'cisco',
  authMethod: '802.1x',
  connectivity: 'hybrid',
  deviceTypes: ['windows', 'mac', 'mobile', 'iot'],
  showDataFlow: false,
  showSecurityZones: true,
  showRedundancy: false
}

export function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>(defaultConfig)
  const [selectedView, setSelectedView] = useState('complete')
  const [isExporting, setIsExporting] = useState(false)
  const diagramRef = useRef<HTMLDivElement>(null)

  const updateConfig = (key: keyof ArchitectureConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleDeviceType = (deviceType: string) => {
    setConfig(prev => ({
      ...prev,
      deviceTypes: prev.deviceTypes.includes(deviceType)
        ? prev.deviceTypes.filter(d => d !== deviceType)
        : [...prev.deviceTypes, deviceType]
    }))
  }

  const exportDiagram = async (format: 'svg' | 'png') => {
    setIsExporting(true)
    
    try {
      // Find the SVG element in the diagram
      const diagramContainer = document.querySelector('.architecture-diagram')
      if (!diagramContainer) {
        throw new Error('Diagram container not found')
      }

      const svgElement = diagramContainer.querySelector('svg')
      if (!svgElement) {
        throw new Error('No SVG element found for export')
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement
      
      // Add a header with title and timestamp
      const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      headerGroup.setAttribute('transform', 'translate(20, 30)')
      
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', '0')
      titleText.setAttribute('y', '0')
      titleText.setAttribute('font-family', 'Arial, sans-serif')
      titleText.setAttribute('font-size', '24')
      titleText.setAttribute('font-weight', 'bold')
      titleText.setAttribute('fill', '#1f2937')
      titleText.textContent = 'Zero Trust NAC Architecture'
      
      const subtitleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      subtitleText.setAttribute('x', '0')
      subtitleText.setAttribute('y', '25')
      subtitleText.setAttribute('font-family', 'Arial, sans-serif')
      subtitleText.setAttribute('font-size', '14')
      subtitleText.setAttribute('fill', '#6b7280')
      subtitleText.textContent = `Generated on ${new Date().toLocaleDateString()} - ${config.cloudProvider.toUpperCase()} + ${config.networkVendor.charAt(0).toUpperCase() + config.networkVendor.slice(1)}`
      
      headerGroup.appendChild(titleText)
      headerGroup.appendChild(subtitleText)
      svgClone.insertBefore(headerGroup, svgClone.firstChild)

      if (format === 'svg') {
        // Export as SVG
        const svgData = new XMLSerializer().serializeToString(svgClone)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const downloadLink = document.createElement('a')
        downloadLink.href = svgUrl
        downloadLink.download = `nac-architecture-${config.cloudProvider}-${config.networkVendor}.svg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(svgUrl)
      } else {
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
                downloadLink.download = `nac-architecture-${config.cloudProvider}-${config.networkVendor}.png`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
                URL.revokeObjectURL(pngUrl)
              }
            }, 'image/png')
          }
        }
        
        const svgData = new XMLSerializer().serializeToString(svgClone)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        img.src = svgUrl
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Architecture Designer</h2>
          <p className="text-muted-foreground">
            Design and visualize your Zero Trust NAC architecture
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDiagram('svg')}
            disabled={isExporting}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDiagram('png')}
            disabled={isExporting}
          >
            <FileImage className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cloud Provider */}
              <div className="space-y-2">
                <Label>Cloud Provider</Label>
                <Select
                  value={config.cloudProvider}
                  onValueChange={(value) => updateConfig('cloudProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="azure">
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4" />
                        <span>Microsoft Azure</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="aws">
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4" />
                        <span>Amazon AWS</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gcp">
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4" />
                        <span>Google Cloud</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="on-premise">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>On-Premise</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Network Vendor */}
              <div className="space-y-2">
                <Label>Network Vendor</Label>
                <Select
                  value={config.networkVendor}
                  onValueChange={(value) => updateConfig('networkVendor', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cisco">
                      <div className="flex items-center space-x-2">
                        <Network className="h-4 w-4" />
                        <span>Cisco</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="aruba">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4" />
                        <span>Aruba</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="juniper">
                      <div className="flex items-center space-x-2">
                        <Router className="h-4 w-4" />
                        <span>Juniper</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="extreme">
                      <div className="flex items-center space-x-2">
                        <Network className="h-4 w-4" />
                        <span>Extreme Networks</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Authentication Method */}
              <div className="space-y-2">
                <Label>Authentication Method</Label>
                <Select
                  value={config.authMethod}
                  onValueChange={(value) => updateConfig('authMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="802.1x">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>802.1X</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mac-auth">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4" />
                        <span>MAC Authentication</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="web-auth">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Web Authentication</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Hybrid (Multiple)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Connectivity */}
              <div className="space-y-2">
                <Label>Connectivity</Label>
                <Select
                  value={config.connectivity}
                  onValueChange={(value) => updateConfig('connectivity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wired">Wired Only</SelectItem>
                    <SelectItem value="wireless">Wireless Only</SelectItem>
                    <SelectItem value="hybrid">Wired + Wireless</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Device Types */}
              <div className="space-y-3">
                <Label>Device Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'windows', label: 'Windows', icon: Monitor },
                    { id: 'mac', label: 'macOS', icon: Laptop },
                    { id: 'mobile', label: 'Mobile', icon: Smartphone },
                    { id: 'iot', label: 'IoT', icon: Tablet }
                  ].map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={id}
                        checked={config.deviceTypes.includes(id)}
                        onChange={() => toggleDeviceType(id)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={id} className="flex items-center space-x-1 text-sm">
                        <Icon className="h-3 w-3" />
                        <span>{label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Display Options */}
              <div className="space-y-4">
                <Label>Display Options</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-flow" className="text-sm">Show Data Flow</Label>
                  <Switch
                    id="data-flow"
                    checked={config.showDataFlow}
                    onCheckedChange={(checked) => updateConfig('showDataFlow', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="security-zones" className="text-sm">Security Zones</Label>
                  <Switch
                    id="security-zones"
                    checked={config.showSecurityZones}
                    onCheckedChange={(checked) => updateConfig('showSecurityZones', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="redundancy" className="text-sm">Show Redundancy</Label>
                  <Switch
                    id="redundancy"
                    checked={config.showRedundancy}
                    onCheckedChange={(checked) => updateConfig('showRedundancy', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>View</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { id: 'complete', label: 'Complete Architecture' },
                  { id: 'auth-flow', label: 'Authentication Flow' },
                  { id: 'network-topology', label: 'Network Topology' },
                  { id: 'security-zones', label: 'Security Zones' }
                ].map(({ id, label }) => (
                  <Button
                    key={id}
                    variant={selectedView === id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedView(id)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diagram Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Architecture Diagram</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {config.cloudProvider.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {config.networkVendor.charAt(0).toUpperCase() + config.networkVendor.slice(1)}
                  </Badge>
                  <Badge variant="secondary">
                    {config.authMethod.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={diagramRef} className="min-h-[600px]">
                <InteractiveDiagram
                  config={config}
                  selectedView={selectedView}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <ArchitectureLegend config={config} />
        </div>
      </div>
    </div>
  )
}
