'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InteractiveDiagram from './InteractiveDiagram'
import ArchitectureLegend from './ArchitectureLegend'
import { Cloud, Network, Shield, Settings, Zap, Globe, Lock, Users, Database, Server, Download } from 'lucide-react'

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('complete')
  const [cloudProvider, setCloudProvider] = useState('aws')
  const [networkVendor, setNetworkVendor] = useState('cisco')
  const [connectivityType, setConnectivityType] = useState('sdwan')
  const [animationSpeed, setAnimationSpeed] = useState([1])

  const architectureViews = [
    { 
      id: 'complete', 
      label: 'Complete Architecture', 
      icon: <Cloud className="w-4 h-4" />,
      description: 'Full end-to-end NAC deployment with all components'
    },
    { 
      id: 'auth-flow', 
      label: 'Authentication Flow', 
      icon: <Shield className="w-4 h-4" />,
      description: '802.1X authentication sequence and RADIUS flow'
    },
    { 
      id: 'pki', 
      label: 'PKI Infrastructure', 
      icon: <Lock className="w-4 h-4" />,
      description: 'Certificate authority and PKI components'
    },
    { 
      id: 'policies', 
      label: 'Policy Framework', 
      icon: <Settings className="w-4 h-4" />,
      description: 'Policy engine and rule management'
    },
    { 
      id: 'connectivity', 
      label: 'Connectivity Options', 
      icon: <Network className="w-4 h-4" />,
      description: 'Multi-cloud and network connectivity patterns'
    },
    { 
      id: 'intune', 
      label: 'Intune Integration', 
      icon: <Users className="w-4 h-4" />,
      description: 'Microsoft Intune MDM integration'
    },
    { 
      id: 'onboarding', 
      label: 'Device Onboarding', 
      icon: <Zap className="w-4 h-4" />,
      description: 'Device enrollment and provisioning workflows'
    },
    { 
      id: 'fortigate-tacacs', 
      label: 'FortiGate TACACS+', 
      icon: <Server className="w-4 h-4" />,
      description: 'FortiGate device administration with TACACS+'
    },
    { 
      id: 'palo-tacacs', 
      label: 'Palo Alto TACACS+', 
      icon: <Server className="w-4 h-4" />,
      description: 'Palo Alto device administration with TACACS+'
    },
    { 
      id: 'palo-userid', 
      label: 'Palo Alto User-ID', 
      icon: <Users className="w-4 h-4" />,
      description: 'Palo Alto User-ID integration with syslog'
    },
    { 
      id: 'fortigate-fsso', 
      label: 'FortiGate FSSO', 
      icon: <Users className="w-4 h-4" />,
      description: 'FortiGate FSSO integration with syslog'
    },
    { 
      id: 'ubiquiti-wireless', 
      label: 'Ubiquiti UniFi', 
      icon: <Network className="w-4 h-4" />,
      description: 'Ubiquiti UniFi wireless integration with NAC'
    },
    { 
      id: 'mikrotik-wireless', 
      label: 'MikroTik Wireless', 
      icon: <Network className="w-4 h-4" />,
      description: 'MikroTik RouterOS wireless integration'
    },
    { 
      id: 'meraki-wireless', 
      label: 'Cisco Meraki', 
      icon: <Network className="w-4 h-4" />,
      description: 'Cisco Meraki cloud-managed wireless'
    },
    { 
      id: 'mist-wireless', 
      label: 'Juniper Mist', 
      icon: <Network className="w-4 h-4" />,
      description: 'Juniper Mist AI-driven wireless platform'
    },
    { 
      id: 'cambium-wireless', 
      label: 'Cambium Networks', 
      icon: <Network className="w-4 h-4" />,
      description: 'Cambium Networks wireless solutions'
    }
  ]

  const cloudProviders = [
    { id: 'aws', label: 'Amazon Web Services', color: '#FF9900' },
    { id: 'azure', label: 'Microsoft Azure', color: '#0078D4' },
    { id: 'gcp', label: 'Google Cloud Platform', color: '#4285F4' },
    { id: 'onprem', label: 'On-Premises', color: '#6B7280' }
  ]

  const networkVendors = [
    { id: 'cisco', label: 'Cisco' },
    { id: 'aruba', label: 'Aruba (HPE)' },
    { id: 'juniper', label: 'Juniper' },
    { id: 'extreme', label: 'Extreme Networks' },
    { id: 'ruckus', label: 'Ruckus (CommScope)' },
    { id: 'fortinet', label: 'Fortinet' },
    { id: 'paloalto', label: 'Palo Alto Networks' },
    { id: 'ubiquiti', label: 'Ubiquiti' },
    { id: 'mikrotik', label: 'MikroTik' },
    { id: 'meraki', label: 'Cisco Meraki' },
    { id: 'mist', label: 'Juniper Mist' },
    { id: 'cambium', label: 'Cambium Networks' }
  ]

  const connectivityOptions = [
    { id: 'sdwan', label: 'SD-WAN' },
    { id: 'expressroute', label: 'Azure Express Route' },
    { id: 'directconnect', label: 'AWS Direct Connect' },
    { id: 'mpls', label: 'MPLS Network' },
    { id: 'vpn', label: 'Site-to-Site VPN' },
    { id: 'internet', label: 'Internet Connection' },
    { id: 'velocloud', label: 'VMware VeloCloud' },
    { id: 'silverpeak', label: 'Silver Peak' },
    { id: 'viptela', label: 'Cisco Viptela' },
    { id: 'fortinet-sdwan', label: 'Fortinet SD-WAN' }
  ]

  const currentView = architectureViews.find(view => view.id === selectedView)

  // Export Functions
  const exportDiagram = async (format: 'svg' | 'png' | 'pdf') => {
    const diagramElement = document.querySelector('.architecture-diagram svg')
    if (!diagramElement) return

    try {
      if (format === 'svg') {
        await exportAsSVG(diagramElement as SVGElement)
      } else if (format === 'png') {
        await exportAsPNG(diagramElement as SVGElement)
      } else if (format === 'pdf') {
        await exportAsPDF(diagramElement as SVGElement)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const exportAsSVG = async (svgElement: SVGElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgWithHeader = addExportHeader(svgData, 'svg')
    const blob = new Blob([svgWithHeader], { type: 'image/svg+xml' })
    downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.svg`)
  }

  const exportAsPNG = async (svgElement: SVGElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = 1400
    canvas.height = 1000
    
    // Add white background
    ctx!.fillStyle = 'white'
    ctx!.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add header with logos
    await addPNGHeader(ctx!, canvas.width)
    
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      ctx!.drawImage(img, 50, 150, canvas.width - 100, canvas.height - 200)
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.png`)
        }
      }, 'image/png')
      
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  }

  const exportAsPDF = async (svgElement: SVGElement) => {
    // This would require a PDF library like jsPDF
    // For now, we'll export as PNG and let user convert if needed
    await exportAsPNG(svgElement)
  }

  const addExportHeader = (svgData: string, format: string) => {
    const headerHeight = 100
    const header = `
      <g id="export-header">
        <rect x="0" y="0" width="1200" height="${headerHeight}" fill="#00c8d7"/>
        <image x="20" y="20" width="120" height="30" href="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"/>
        <image x="1050" y="15" width="130" height="40" href="https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true"/>
        <text x="600" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
          Portnox NAC Architecture - ${currentView?.label}
        </text>
        <text x="600" y="55" textAnchor="middle" fill="white" fontSize="12">
          Generated on ${new Date().toLocaleDateString()}
        </text>
      </g>
    `
    
    return svgData.replace('<svg', `<svg`).replace('>', `>${header}`)
  }

  const addPNGHeader = async (ctx: CanvasRenderingContext2D, width: number) => {
    // Header background
    ctx.fillStyle = '#00c8d7'
    ctx.fillRect(0, 0, width, 100)
    
    // Load and draw Portnox logo
    const portnoxLogo = new Image()
    portnoxLogo.crossOrigin = 'anonymous'
    portnoxLogo.src = 'https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png'
    
    // Load and draw ABM logo
    const abmLogo = new Image()
    abmLogo.crossOrigin = 'anonymous'
    abmLogo.src = 'https://companieslogo.com/img/orig/ABM_BIG-47f1fb05.png?t=1720244490&download=true'
    
    return new Promise((resolve) => {
      let loadedCount = 0
      const onLoad = () => {
        loadedCount++
        if (loadedCount === 2) {
          ctx.drawImage(portnoxLogo, 20, 20, 120, 30)
          ctx.drawImage(abmLogo, width - 150, 15, 130, 40)
          
          // Add text
          ctx.fillStyle = 'white'
          ctx.font = 'bold 18px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(`Portnox NAC Architecture - ${currentView?.label}`, width / 2, 35)
          
          ctx.font = '12px Arial'
          ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, width / 2, 55)
          
          resolve(undefined)
        }
      }
      
      portnoxLogo.onload = onLoad
      abmLogo.onload = onLoad
    })
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <span>Zero Trust NAC Architecture Designer</span>
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
                    <SelectItem key={view.id} value={view.id}>
                      <div className="flex items-center space-x-2">
                        {view.icon}
                        <span>{view.label}</span>
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
                    <SelectItem key={provider.id} value={provider.id}>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: provider.color }}
                      />
                      <span>{provider.label}</span>
                    </div>
                  </SelectItem>
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
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Connectivity Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="connectivity-select">Connectivity</Label>
              <Select value={connectivityType} onValueChange={setConnectivityType}>
                <SelectTrigger id="connectivity-select">
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Animation Speed Control */}
          <div className="mt-4 space-y-2">
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

          {/* Current View Info */}
          {currentView && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {currentView.icon}
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  {currentView.label}
                </h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {currentView.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="diagram" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diagram">Interactive Diagram</TabsTrigger>
          <TabsTrigger value="legend">Components Legend</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {currentView?.icon}
                  <span>{currentView?.label}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <Badge variant="outline">
                      {cloudProviders.find(p => p.id === cloudProvider)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {networkVendors.find(v => v.id === networkVendor)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {connectivityOptions.find(c => c.id === connectivityType)?.label}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('svg')}
                      className="flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>SVG</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('png')}
                      className="flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>PNG</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('pdf')}
                      className="flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <InteractiveDiagram
                view={selectedView}
                cloudProvider={cloudProvider}
                networkVendor={networkVendor}
                connectivityType={connectivityType}
                animationSpeed={animationSpeed[0]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legend" className="space-y-4">
          <ArchitectureLegend currentView={selectedView} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
