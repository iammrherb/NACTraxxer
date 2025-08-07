'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import InteractiveDiagram from './InteractiveDiagram'
import ArchitectureLegend from './ArchitectureLegend'
import PolicyEditor from './PolicyEditor'
import OnboardingScenarios from './OnboardingScenarios'
import { Network, Shield, Users, Settings, Download, Save } from 'lucide-react'

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState('overview')
  const [selectedCloudProvider, setSelectedCloudProvider] = useState('azure')
  const [selectedNetworkVendor, setSelectedNetworkVendor] = useState('cisco')
  const [selectedConnectivity, setSelectedConnectivity] = useState('hybrid')

  const architectureViews = [
    { id: 'overview', name: 'Network Overview', icon: Network },
    { id: 'security', name: 'Security Zones', icon: Shield },
    { id: 'users', name: 'User Access', icon: Users },
    { id: 'policies', name: 'Policy Flow', icon: Settings }
  ]

  const cloudProviders = [
    { id: 'azure', name: 'Microsoft Azure', logo: '/placeholder.svg?height=32&width=32&text=Azure' },
    { id: 'aws', name: 'Amazon AWS', logo: '/placeholder.svg?height=32&width=32&text=AWS' },
    { id: 'gcp', name: 'Google Cloud', logo: '/placeholder.svg?height=32&width=32&text=GCP' },
    { id: 'hybrid', name: 'Multi-Cloud', logo: '/placeholder.svg?height=32&width=32&text=Multi' }
  ]

  const networkVendors = [
    { id: 'cisco', name: 'Cisco', logo: '/placeholder.svg?height=32&width=32&text=Cisco' },
    { id: 'juniper', name: 'Juniper', logo: '/placeholder.svg?height=32&width=32&text=Juniper' },
    { id: 'aruba', name: 'Aruba', logo: '/placeholder.svg?height=32&width=32&text=Aruba' },
    { id: 'mixed', name: 'Mixed Vendor', logo: '/placeholder.svg?height=32&width=32&text=Mixed' }
  ]

  const connectivityTypes = [
    { id: 'onprem', name: 'On-Premises Only', description: 'Traditional on-site infrastructure' },
    { id: 'cloud', name: 'Cloud-First', description: 'Cloud-native deployment' },
    { id: 'hybrid', name: 'Hybrid Cloud', description: 'Mixed on-premises and cloud' },
    { id: 'edge', name: 'Edge Computing', description: 'Distributed edge locations' }
  ]

  return (
    { id: 'edge', name: 'Edge Computing', description: 'Distributed edge locations' }
  ]

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Architecture Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cloud Provider Selection */}
            <div>
              <h4 className="font-semibold mb-3">Cloud Provider</h4>
              <div className="space-y-2">
                {cloudProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    variant={selectedCloudProvider === provider.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCloudProvider(provider.id)}
                  >
                    <img src={provider.logo || "/placeholder.svg"} alt={provider.name} className="w-6 h-6 mr-2" />
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Network Vendor Selection */}
            <div>
              <h4 className="font-semibold mb-3">Network Vendor</h4>
              <div className="space-y-2">
                {networkVendors.map((vendor) => (
                  <Button
                    key={vendor.id}
                    variant={selectedNetworkVendor === vendor.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedNetworkVendor(vendor.id)}
                  >
                    <img src={vendor.logo || "/placeholder.svg"} alt={vendor.name} className="w-6 h-6 mr-2" />
                    {vendor.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Connectivity Type Selection */}
            <div>
              <h4 className="font-semibold mb-3">Connectivity Type</h4>
              <div className="space-y-2">
                {connectivityTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedConnectivity === type.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedConnectivity(type.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Views */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Zero Trust NAC Architecture</CardTitle>
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
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              {architectureViews.map((view) => (
                <TabsTrigger key={view.id} value={view.id} className="flex items-center space-x-2">
                  <view.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{view.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline">Cloud: {cloudProviders.find(p => p.id === selectedCloudProvider)?.name}</Badge>
                <Badge variant="outline">Network: {networkVendors.find(v => v.id === selectedNetworkVendor)?.name}</Badge>
                <Badge variant="outline">Type: {connectivityTypes.find(t => t.id === selectedConnectivity)?.name}</Badge>
              </div>
              <InteractiveDiagram 
                view="overview"
                cloudProvider={selectedCloudProvider}
                networkVendor={selectedNetworkVendor}
                connectivityType={selectedConnectivity}
              />
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <InteractiveDiagram 
                view="security"
                cloudProvider={selectedCloudProvider}
                networkVendor={selectedNetworkVendor}
                connectivityType={selectedConnectivity}
              />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <InteractiveDiagram 
                view="users"
                cloudProvider={selectedCloudProvider}
                networkVendor={selectedNetworkVendor}
                connectivityType={selectedConnectivity}
              />
            </TabsContent>

            <TabsContent value="policies" className="space-y-4">
              <PolicyEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Architecture Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <ArchitectureLegend />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingScenarios />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
