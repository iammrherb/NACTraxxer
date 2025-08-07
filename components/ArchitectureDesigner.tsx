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
import { Cloud, Network, Shield, Settings, Zap, Globe, Lock, Users, Database, Server } from 'lucide-react'

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
