'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Network, Cloud, Settings, Eye, Download, Save } from 'lucide-react'
import InteractiveDiagram from '@/components/InteractiveDiagram'
import ArchitectureLegend from '@/components/ArchitectureLegend'
import PolicyEditor from '@/components/PolicyEditor'
import OnboardingScenarios from '@/components/OnboardingScenarios'

export default function ArchitectureDesigner() {
  const [activeView, setActiveView] = useState('complete')
  const [cloudProvider, setCloudProvider] = useState('azure')
  const [networkVendor, setNetworkVendor] = useState('cisco')
  const [connectivityType, setConnectivityType] = useState('expressroute')
  const [animationSpeed, setAnimationSpeed] = useState([1])

  const architectureViews = [
    { id: 'complete', name: 'Complete Architecture', description: 'Full end-to-end architecture view' },
    { id: 'auth-flow', name: 'Authentication Flow', description: 'Step-by-step authentication process' },
    { id: 'pki', name: 'PKI Infrastructure', description: 'Certificate management and PKI components' },
    { id: 'policies', name: 'Policy Framework', description: 'Network access policy structure' },
    { id: 'connectivity', name: 'Connectivity Options', description: 'Different connectivity approaches' },
    { id: 'intune', name: 'Intune Integration', description: 'Microsoft Intune certificate deployment' },
    { id: 'onboarding', name: 'Device Onboarding', description: 'Device onboarding workflows' }
  ]

  const cloudProviders = [
    { id: 'azure', name: 'Microsoft Azure', color: '#0078d4' },
    { id: 'aws', name: 'Amazon AWS', color: '#ff9900' },
    { id: 'gcp', name: 'Google Cloud', color: '#4285f4' },
    { id: 'onprem', name: 'On-Premises', color: '#6c757d' }
  ]

  const networkVendors = [
    { id: 'cisco', name: 'Cisco' },
    { id: 'aruba', name: 'HPE Aruba' },
    { id: 'juniper', name: 'Juniper' },
    { id: 'extreme', name: 'Extreme Networks' }
  ]

  const connectivityTypes = [
    { id: 'expressroute', name: 'Azure ExpressRoute' },
    { id: 'directconnect', name: 'AWS Direct Connect' },
    { id: 'sdwan', name: 'SD-WAN' },
    { id: 'mpls', name: 'MPLS' },
    { id: 'vpn', name: 'Site-to-Site VPN' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Zero Trust NAC Architecture Designer</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Design
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="view-select">Architecture View</Label>
                <Select value={activeView} onValueChange={setActiveView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {architectureViews.map((view) => (
                      <SelectItem key={view.id} value={view.id}>
                        {view.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {architectureViews.find(v => v.id === activeView)?.description}
                </p>
              </div>

              <div>
                <Label htmlFor="cloud-provider">Cloud Provider</Label>
                <Select value={cloudProvider} onValueChange={setCloudProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cloudProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: provider.color }}
                          />
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="network-vendor">Network Vendor</Label>
                <Select value={networkVendor} onValueChange={setNetworkVendor}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="connectivity">Connectivity Type</Label>
                <Select value={connectivityType} onValueChange={setConnectivityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {connectivityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="animation-speed">Animation Speed</Label>
                <div className="px-2">
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    max={3}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Off</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Current Selection</h4>
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-start">
                    <Cloud className="h-3 w-3 mr-1" />
                    {cloudProviders.find(p => p.id === cloudProvider)?.name}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Network className="h-3 w-3 mr-1" />
                    {networkVendors.find(v => v.id === networkVendor)?.name}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Eye className="h-3 w-3 mr-1" />
                    {architectureViews.find(v => v.id === activeView)?.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <ArchitectureLegend view={activeView} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="diagram" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diagram">Interactive Diagram</TabsTrigger>
              <TabsTrigger value="policies">Policy Editor</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding Flows</TabsTrigger>
            </TabsList>

            <TabsContent value="diagram" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <InteractiveDiagram
                    view={activeView}
                    cloudProvider={cloudProvider}
                    networkVendor={networkVendor}
                    connectivityType={connectivityType}
                    animationSpeed={animationSpeed[0]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="mt-4">
              <PolicyEditor />
            </TabsContent>

            <TabsContent value="onboarding" className="mt-4">
              <OnboardingScenarios />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
