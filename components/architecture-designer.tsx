'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Cloud, Network, Shield, Settings, Zap, Eye, Download, RefreshCw, Play, Pause } from 'lucide-react'

interface ArchitectureConfig {
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  deploymentType: string
  authMethod: string
  mdmIntegration: string
}

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>({
    cloudProvider: 'portnox-cloud',
    networkVendor: 'cisco',
    connectivityType: 'wired-wireless',
    deploymentType: 'hybrid',
    authMethod: 'certificate',
    mdmIntegration: 'microsoft-intune'
  })

  const [currentView, setCurrentView] = useState('complete')
  const [animationSpeed, setAnimationSpeed] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)

  const updateConfig = (key: keyof ArchitectureConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const exportDiagram = () => {
    // Export functionality would be implemented here
    console.log('Exporting diagram with config:', config)
  }

  const resetConfig = () => {
    setConfig({
      cloudProvider: 'portnox-cloud',
      networkVendor: 'cisco',
      connectivityType: 'wired-wireless',
      deploymentType: 'hybrid',
      authMethod: 'certificate',
      mdmIntegration: 'microsoft-intune'
    })
  }

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Architecture Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="infrastructure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="infrastructure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cloudProvider">Cloud Provider</Label>
                  <Select value={config.cloudProvider} onValueChange={(value) => updateConfig('cloudProvider', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cloud provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portnox-cloud">Portnox Cloud</SelectItem>
                      <SelectItem value="aws">Amazon Web Services</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="networkVendor">Network Vendor</Label>
                  <Select value={config.networkVendor} onValueChange={(value) => updateConfig('networkVendor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cisco">Cisco</SelectItem>
                      <SelectItem value="aruba">Aruba Networks</SelectItem>
                      <SelectItem value="juniper">Juniper Networks</SelectItem>
                      <SelectItem value="fortinet">Fortinet</SelectItem>
                      <SelectItem value="extreme">Extreme Networks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connectivityType">Connectivity Type</Label>
                  <Select value={config.connectivityType} onValueChange={(value) => updateConfig('connectivityType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select connectivity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wired-only">Wired Only</SelectItem>
                      <SelectItem value="wireless-only">Wireless Only</SelectItem>
                      <SelectItem value="wired-wireless">Wired + Wireless</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deploymentType">Deployment Type</Label>
                  <Select value={config.deploymentType} onValueChange={(value) => updateConfig('deploymentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deployment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud-only">Cloud Only</SelectItem>
                      <SelectItem value="on-premises">On-Premises</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authMethod">Authentication Method</Label>
                  <Select value={config.authMethod} onValueChange={(value) => updateConfig('authMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select authentication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certificate">Certificate-based</SelectItem>
                      <SelectItem value="username-password">Username/Password</SelectItem>
                      <SelectItem value="mab">MAC Authentication Bypass</SelectItem>
                      <SelectItem value="multi-factor">Multi-Factor Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mdmIntegration">MDM Integration</Label>
                  <Select value={config.mdmIntegration} onValueChange={(value) => updateConfig('mdmIntegration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select MDM platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="microsoft-intune">Microsoft Intune</SelectItem>
                      <SelectItem value="jamf">Jamf Pro</SelectItem>
                      <SelectItem value="vmware-workspace-one">VMware Workspace ONE</SelectItem>
                      <SelectItem value="mobileiron">MobileIron</SelectItem>
                      <SelectItem value="none">No MDM Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Active Integrations</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Cloud className="h-3 w-3 mr-1" />
                      {config.cloudProvider}
                    </Badge>
                    <Badge variant="secondary">
                      <Network className="h-3 w-3 mr-1" />
                      {config.networkVendor}
                    </Badge>
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      {config.authMethod}
                    </Badge>
                    {config.mdmIntegration !== 'none' && (
                      <Badge variant="secondary">
                        <Settings className="h-3 w-3 mr-1" />
                        {config.mdmIntegration}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diagram Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Diagram Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <Label>View Type</Label>
                <Select value={currentView} onValueChange={setCurrentView}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete Architecture</SelectItem>
                    <SelectItem value="authentication">Authentication Flow</SelectItem>
                    <SelectItem value="network">Network Topology</SelectItem>
                    <SelectItem value="policies">Policy Enforcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-12" />

              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnimationSpeed(Math.max(1, animationSpeed - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{animationSpeed}x</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnimationSpeed(Math.min(5, animationSpeed + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportDiagram}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-[600px]">
            {/* This would contain the actual interactive diagram */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Zap className="h-16 w-16 mx-auto text-blue-500" />
                <h3 className="text-xl font-semibold">Interactive Diagram</h3>
                <p className="text-muted-foreground max-w-md">
                  The architecture diagram will be rendered here based on your configuration settings.
                  Current view: <Badge variant="outline">{currentView}</Badge>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
