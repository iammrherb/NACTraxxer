'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Zap, Shield, Wifi, Server, Cloud, Settings } from 'lucide-react'

type DiagramView = 'complete' | 'auth-flow' | 'pki' | 'policies' | 'connectivity' | 'intune' | 'onboarding'
type CloudProvider = 'aws' | 'azure' | 'gcp' | 'onprem'
type NetworkVendor = 'cisco' | 'meraki' | 'juniper' | 'aruba' | 'hpe' | 'extreme' | 'fortinet'
type ConnectivityType = 'sdwan' | 'expressroute' | 'mpls' | 'vpn' | 'directconnect'

interface ArchitectureDesignerProps {
  config: any
  setConfig: (config: any) => void
  currentView: string
  setCurrentView: (view: string) => void
  animationSpeed: number
  setAnimationSpeed: (speed: number) => void
}

export default function ArchitectureDesigner({ 
  config, 
  setConfig, 
  currentView, 
  setCurrentView, 
  animationSpeed, 
  setAnimationSpeed 
}: ArchitectureDesignerProps) {
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>('azure')
  const [networkVendor, setNetworkVendor] = useState<NetworkVendor>('cisco')
  const [connectivityType, setConnectivityType] = useState<ConnectivityType>('sdwan')
  const diagramRef = useRef<HTMLDivElement>(null)

  const diagramViews = [
    { id: 'complete', label: 'Complete Architecture', icon: Server },
    { id: 'auth-flow', label: 'Authentication Flow', icon: Shield },
    { id: 'pki', label: 'PKI & Certificate', icon: Zap },
    { id: 'policies', label: 'Access Policies', icon: Settings },
    { id: 'connectivity', label: 'Connectivity Options', icon: Wifi },
    { id: 'intune', label: 'Intune Integration', icon: Cloud },
    { id: 'onboarding', label: 'Device Onboarding', icon: Settings }
  ]

  const cloudProviders = [
    { id: 'aws', label: 'AWS', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'azure', label: 'Azure', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'gcp', label: 'GCP', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'onprem', label: 'On-Premises', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ]

  const exportDiagram = async (format: 'svg' | 'png') => {
    if (!diagramRef.current) return

    const svg = diagramRef.current.querySelector('svg')
    if (!svg) return

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `portnox-architecture-${currentView}-${Date.now()}.svg`
      link.click()
      
      URL.revokeObjectURL(url)
    } else {
      // For PNG export, we'd need to convert SVG to canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `portnox-architecture-${currentView}-${Date.now()}.png`
            link.click()
            URL.revokeObjectURL(pngUrl)
          }
        }, 'image/png')
        
        URL.revokeObjectURL(url)
      }
      
      img.src = url
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-blue-600" />
            <span>Architecture Designer</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your Zero Trust NAC architecture components and settings.
          </p>
        </CardHeader>
        <CardContent>
          {/* View Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {diagramViews.map((view) => {
              const Icon = view.icon
              return (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView(view.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Export Controls */}
          <div className="flex items-center space-x-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportDiagram('svg')}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export SVG</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportDiagram('png')}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PNG</span>
            </Button>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cloud Provider</label>
              <div className="flex flex-wrap gap-2">
                {cloudProviders.map((provider) => (
                  <Badge
                    key={provider.id}
                    variant={cloudProvider === provider.id ? 'default' : 'outline'}
                    className={`cursor-pointer ${cloudProvider === provider.id ? '' : provider.color}`}
                    onClick={() => setCloudProvider(provider.id as CloudProvider)}
                  >
                    {provider.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Network Vendor</label>
              <Select value={networkVendor} onValueChange={(value) => setNetworkVendor(value as NetworkVendor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cisco">Cisco</SelectItem>
                  <SelectItem value="meraki">Cisco Meraki</SelectItem>
                  <SelectItem value="juniper">Juniper</SelectItem>
                  <SelectItem value="aruba">Aruba</SelectItem>
                  <SelectItem value="hpe">HPE</SelectItem>
                  <SelectItem value="extreme">Extreme Networks</SelectItem>
                  <SelectItem value="fortinet">Fortinet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Connectivity</label>
              <Select value={connectivityType} onValueChange={(value) => setConnectivityType(value as ConnectivityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sdwan">SD-WAN</SelectItem>
                  <SelectItem value="expressroute">Express Route</SelectItem>
                  <SelectItem value="mpls">MPLS</SelectItem>
                  <SelectItem value="vpn">Site-to-Site VPN</SelectItem>
                  <SelectItem value="directconnect">Direct Connect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Animation Speed</label>
              <Select value={animationSpeed.toString()} onValueChange={(value) => setAnimationSpeed(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">Slow</SelectItem>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Fast</SelectItem>
                  <SelectItem value="0">No Animation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
