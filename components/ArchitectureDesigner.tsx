'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Cloud, Server, Wifi, Network, Settings, Play, Pause, RotateCcw, Eye, EyeOff, Zap, Shield } from 'lucide-react'

interface ArchitectureDesignerProps {
  config: any
  onConfigChange: (config: any) => void
  currentView: string
  onViewChange: (view: string) => void
}

export default function ArchitectureDesigner({ 
  config, 
  onConfigChange, 
  currentView, 
  onViewChange 
}: ArchitectureDesignerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [customSettings, setCustomSettings] = useState({
    siteName: 'Corporate HQ',
    region: 'North America',
    userCount: '500',
    deviceCount: '750'
  })

  const handleConfigUpdate = (key: string, value: any) => {
    onConfigChange({ [key]: value })
  }

  const handleCustomSettingUpdate = (key: string, value: string) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }))
  }

  const architectureViews = [
    { id: 'complete', label: 'Complete Architecture', icon: <Network className="h-4 w-4" /> },
    { id: 'auth-flow', label: 'Authentication Flow', icon: <Shield className="h-4 w-4" /> },
    { id: 'pki', label: 'PKI Infrastructure', icon: <Server className="h-4 w-4" /> },
    { id: 'policies', label: 'Policy Engine', icon: <Settings className="h-4 w-4" /> },
    { id: 'connectivity', label: 'Connectivity Map', icon: <Wifi className="h-4 w-4" /> },
    { id: 'intune', label: 'Intune Integration', icon: <Cloud className="h-4 w-4" /> },
    { id: 'onboarding', label: 'Device Onboarding', icon: <Zap className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Architecture View Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Architecture Views</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {architectureViews.map((view) => (
              <Button
                key={view.id}
                variant={currentView === view.id ? 'default' : 'outline'}
                onClick={() => onViewChange(view.id)}
                className={`justify-start ${
                  currentView === view.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : ''
                }`}
                size="sm"
              >
                {view.icon}
                <span className="ml-2">{view.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Site Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-green-600" />
            <span>Site Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={customSettings.siteName}
                onChange={(e) => handleCustomSettingUpdate('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={customSettings.region} onValueChange={(value) => handleCustomSettingUpdate('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userCount">User Count</Label>
                <Input
                  id="userCount"
                  value={customSettings.userCount}
                  onChange={(e) => handleCustomSettingUpdate('userCount', e.target.value)}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="deviceCount">Device Count</Label>
                <Input
                  id="deviceCount"
                  value={customSettings.deviceCount}
                  onChange={(e) => handleCustomSettingUpdate('deviceCount', e.target.value)}
                  placeholder="750"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            <span>Cloud Infrastructure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Cloud Provider</Label>
            <Select value={config.cloudProvider} onValueChange={(value) => handleConfigUpdate('cloudProvider', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cloud provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                <SelectItem value="azure">Microsoft Azure</SelectItem>
                <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                <SelectItem value="multi-cloud">Multi-Cloud Deployment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>High Availability</Label>
            <Switch 
              checked={config.highAvailability || false}
              onCheckedChange={(checked) => handleConfigUpdate('highAvailability', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Network Vendors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-purple-600" />
            <span>Network Infrastructure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Wired Network Vendor</Label>
            <Select value={config.wiredVendor} onValueChange={(value) => handleConfigUpdate('wiredVendor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select wired vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cisco">Cisco</SelectItem>
                <SelectItem value="juniper">Juniper</SelectItem>
                <SelectItem value="aruba">Aruba (HPE)</SelectItem>
                <SelectItem value="extreme">Extreme Networks</SelectItem>
                <SelectItem value="dell">Dell Networking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Wireless Network Vendor</Label>
            <Select value={config.wirelessVendor} onValueChange={(value) => handleConfigUpdate('wirelessVendor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select wireless vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cisco">Cisco</SelectItem>
                <SelectItem value="aruba">Aruba (HPE)</SelectItem>
                <SelectItem value="ruckus">Ruckus (CommScope)</SelectItem>
                <SelectItem value="meraki">Cisco Meraki</SelectItem>
                <SelectItem value="ubiquiti">Ubiquiti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-orange-600" />
            <span>Connectivity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Connection Type</Label>
            <Select value={config.connectivity} onValueChange={(value) => handleConfigUpdate('connectivity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select connectivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Internet</SelectItem>
                <SelectItem value="express-route">Express Route (Azure)</SelectItem>
                <SelectItem value="direct-connect">Direct Connect (AWS)</SelectItem>
                <SelectItem value="sd-wan">SD-WAN</SelectItem>
                <SelectItem value="mpls">MPLS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>RADSec Encryption</Label>
            <Switch 
              checked={config.radsecEnabled || true}
              onCheckedChange={(checked) => handleConfigUpdate('radsecEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Animation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-green-600" />
            <span>Visualization Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Animation Speed</Label>
            <Select value={config.animationSpeed} onValueChange={(value) => handleConfigUpdate('animationSpeed', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="none">No Animation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Show Labels</Label>
            <Switch 
              checked={config.showLabels}
              onCheckedChange={(checked) => handleConfigUpdate('showLabels', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Show Port Numbers</Label>
            <Switch 
              checked={config.showPorts}
              onCheckedChange={(checked) => handleConfigUpdate('showPorts', checked)}
            />
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="flex-1"
            >
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(false)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cloud Provider:</span>
              <Badge variant="outline">{config.cloudProvider?.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wired Vendor:</span>
              <Badge variant="outline">{config.wiredVendor}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wireless Vendor:</span>
              <Badge variant="outline">{config.wirelessVendor}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Connectivity:</span>
              <Badge variant="outline">{config.connectivity}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
