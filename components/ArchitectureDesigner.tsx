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
import PolicyEditor from './PolicyEditor'
import OnboardingScenarios from './OnboardingScenarios'
import { Cloud, Network, Shield, Settings, Zap, Globe, Lock, Users, Database, Server, Download, FileText, Workflow } from 'lucide-react'

interface ArchitectureDesignerProps {
  customerLogo: string
}

export default function ArchitectureDesigner({ customerLogo }: ArchitectureDesignerProps) {
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
    { id: 'paloalto', label: 'Palo Alto Networks' }
  ]

  const connectivityOptions = [
    { id: 'sdwan', label: 'SD-WAN' },
    { id: 'expressroute', label: 'Azure Express Route' },
    { id: 'directconnect', label: 'AWS Direct Connect' },
    { id: 'mpls', label: 'MPLS Network' },
    { id: 'vpn', label: 'Site-to-Site VPN' },
    { id: 'internet', label: 'Internet Connection' }
  ]

  const currentView = architectureViews.find(view => view.id === selectedView)

  // Enhanced Export Functions with proper logo embedding
  const exportDiagram = async (format: 'svg' | 'png' | 'pdf') => {
    const diagramElement = document.querySelector('.architecture-diagram svg')
    if (!diagramElement) {
      console.error('Diagram element not found')
      return
    }

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
    const svgWithHeader = await addSVGHeader(svgData)
    const blob = new Blob([svgWithHeader], { type: 'image/svg+xml' })
    downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.svg`)
  }

  const exportAsPNG = async (svgElement: SVGElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 1600
    canvas.height = 1200
    
    // Add white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add header with logos
    await addPNGHeader(ctx, canvas.width)
    
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      ctx.drawImage(img, 50, 180, canvas.width - 100, canvas.height - 250)
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.png`)
        }
      }, 'image/png', 1.0)
      
      URL.revokeObjectURL(url)
    }
    
    img.onerror = (error) => {
      console.error('Failed to load SVG for PNG export:', error)
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  }

  const exportAsPDF = async (svgElement: SVGElement) => {
    // For now, export as high-quality PNG
    // In a real implementation, you would use a library like jsPDF
    await exportAsPNG(svgElement)
  }

  const addSVGHeader = async (svgData: string): Promise<string> => {
    const headerHeight = 120
    
    // Load logos as base64
    const portnoxLogoBase64 = await imageToBase64('https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png')
    const customerLogoBase64 = await imageToBase64(customerLogo)
    
    const header = `
      <g id="export-header">
        <rect x="0" y="0" width="100%" height="${headerHeight}" fill="url(#headerGradient)"/>
        <defs>
          <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00c8d7;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#0099cc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#007acc;stop-opacity:1" />
          </linearGradient>
        </defs>
        <image x="30" y="25" width="150" height="38" href="${portnoxLogoBase64}"/>
        <image x="1350" y="20" width="180" height="48" href="${customerLogoBase64}"/>
        <text x="50%" y="45" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">
          Portnox NAC Architecture - ${currentView?.label}
        </text>
        <text x="50%" y="70" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial, sans-serif">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </text>
        <text x="50%" y="90" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial, sans-serif">
          Cloud Provider: ${cloudProviders.find(p => p.id === cloudProvider)?.label} | Network Vendor: ${networkVendors.find(v => v.id === networkVendor)?.label}
        </text>
      </g>
    `
    
    // Insert header after opening svg tag and adjust viewBox
    const svgWithHeader = svgData.replace(
      /<svg([^>]*)>/,
      `<svg$1 viewBox="0 0 1600 ${1200 + headerHeight}">${header}<g transform="translate(0, ${headerHeight})">`
    ).replace('</svg>', '</g></svg>')
    
    return svgWithHeader
  }

  const addPNGHeader = async (ctx: CanvasRenderingContext2D, width: number): Promise<void> => {
    const headerHeight = 150
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, '#00c8d7')
    gradient.addColorStop(0.5, '#0099cc')
    gradient.addColorStop(1, '#007acc')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, headerHeight)
    
    try {
      // Load and draw Portnox logo
      const portnoxLogo = await loadImage('https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png')
      ctx.drawImage(portnoxLogo, 30, 25, 150, 38)
      
      // Load and draw customer logo
      const customerLogoImg = await loadImage(customerLogo)
      ctx.drawImage(customerLogoImg, width - 210, 20, 180, 48)
      
      // Add text
      ctx.fillStyle = 'white'
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Portnox NAC Architecture - ${currentView?.label}`, width / 2, 55)
      
      ctx.font = '16px Arial, sans-serif'
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, width / 2, 85)
      
      ctx.font = '14px Arial, sans-serif'
      ctx.fillText(
        `Cloud Provider: ${cloudProviders.find(p => p.id === cloudProvider)?.label} | Network Vendor: ${networkVendors.find(v => v.id === networkVendor)?.label}`,
        width / 2, 110
      )
      
      // Add border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, width, headerHeight)
      
    } catch (error) {
      console.error('Failed to load logos for PNG header:', error)
      // Fallback text-only header
      ctx.fillStyle = 'white'
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Portnox NAC Architecture - ${currentView?.label}`, width / 2, 75)
    }
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const imageToBase64 = async (src: string): Promise<string> => {
    try {
      const img = await loadImage(src)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Failed to convert image to base64:', error)
      return ''
    }
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-[#00c8d7] rounded-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#00c8d7] to-[#007acc] bg-clip-text text-transparent">
              Zero Trust NAC Architecture Designer
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Architecture View Selection */}
            <div className="space-y-3">
              <Label htmlFor="view-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Architecture View
              </Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="view-select" className="border-2 border-gray-200 focus:border-[#00c8d7]">
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
            <div className="space-y-3">
              <Label htmlFor="cloud-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Cloud Provider
              </Label>
              <Select value={cloudProvider} onValueChange={setCloudProvider}>
                <SelectTrigger id="cloud-select" className="border-2 border-gray-200 focus:border-[#00c8d7]">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {cloudProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: provider.color }}
                        />
                        <span>{provider.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network Vendor Selection */}
            <div className="space-y-3">
              <Label htmlFor="vendor-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Network Vendor
              </Label>
              <Select value={networkVendor} onValueChange={setNetworkVendor}>
                <SelectTrigger id="vendor-select" className="border-2 border-gray-200 focus:border-[#00c8d7]">
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
            <div className="space-y-3">
              <Label htmlFor="connectivity-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Connectivity
              </Label>
              <Select value={connectivityType} onValueChange={setConnectivityType}>
                <SelectTrigger id="connectivity-select" className="border-2 border-gray-200 focus:border-[#00c8d7]">
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
          <div className="mt-6 space-y-3">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Animation Speed: {animationSpeed[0]}x
            </Label>
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
            <div className="mt-6 p-6 bg-gradient-to-r from-[#00c8d7]/10 to-[#007acc]/10 dark:from-[#00c8d7]/20 dark:to-[#007acc]/20 rounded-xl border border-[#00c8d7]/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#00c8d7] rounded-lg">
                  {currentView.icon}
                </div>
                <h3 className="font-bold text-lg text-[#00c8d7]">
                  {currentView.label}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {currentView.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="diagram" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2">
          <TabsTrigger 
            value="diagram" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            <Network className="w-4 h-4 mr-2" />
            Interactive Diagram
          </TabsTrigger>
          <TabsTrigger 
            value="legend" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Components Legend
          </TabsTrigger>
          <TabsTrigger 
            value="policies" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            Policy Editor
          </TabsTrigger>
          <TabsTrigger 
            value="onboarding" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            <Workflow className="w-4 h-4 mr-2" />
            Onboarding Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-[#00c8d7] rounded-lg">
                    {currentView?.icon}
                  </div>
                  <span>{currentView?.label}</span>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="border-[#00c8d7] text-[#00c8d7]">
                      {cloudProviders.find(p => p.id === cloudProvider)?.label}
                    </Badge>
                    <Badge variant="outline" className="border-[#00c8d7] text-[#00c8d7]">
                      {networkVendors.find(v => v.id === networkVendor)?.label}
                    </Badge>
                    <Badge variant="outline" className="border-[#00c8d7] text-[#00c8d7]">
                      {connectivityOptions.find(c => c.id === connectivityType)?.label}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('svg')}
                      className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      SVG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('png')}
                      className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram('pdf')}
                      className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
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

        <TabsContent value="legend" className="space-y-6">
          <ArchitectureLegend currentView={selectedView} />
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <PolicyEditor />
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <OnboardingScenarios />
        </TabsContent>
      </Tabs>
    </div>
  )
}
