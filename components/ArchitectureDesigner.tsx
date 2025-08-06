'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Cloud, Network, Wifi, Server, Settings, Play, Pause } from 'lucide-react'

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState({
    cloudProvider: 'portnox',
    networkVendor: 'cisco',
    wirelessVendor: 'cisco',
    connectivity: 'radsec',
    deployment: 'hybrid',
    features: ['pki', 'mdm', 'guest'],
    animationSpeed: [50]
  })

  const [isAnimating, setIsAnimating] = useState(true)

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleFeature = (feature: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Architecture Designer</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure your Zero Trust NAC architecture components and settings.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cloud Provider */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Cloud className="h-4 w-4 text-blue-600" />
            <span>Cloud Provider</span>
          </Label>
          <Select value={config.cloudProvider} onValueChange={(value) => updateConfig('cloudProvider', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portnox">Portnox Cloud</SelectItem>
              <SelectItem value="aws">AWS</SelectItem>
              <SelectItem value="azure">Microsoft Azure</SelectItem>
              <SelectItem value="gcp">Google Cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Network Vendor */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Network className="h-4 w-4 text-green-600" />
            <span>Network Vendor</span>
          </Label>
          <Select value={config.networkVendor} onValueChange={(value) => updateConfig('networkVendor', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cisco">Cisco</SelectItem>
              <SelectItem value="aruba">Aruba</SelectItem>
              <SelectItem value="juniper">Juniper</SelectItem>
              <SelectItem value="extreme">Extreme Networks</SelectItem>
              <SelectItem value="fortinet">Fortinet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wireless Vendor */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-purple-600" />
            <span>Wireless Vendor</span>
          </Label>
          <Select value={config.wirelessVendor} onValueChange={(value) => updateConfig('wirelessVendor', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cisco">Cisco</SelectItem>
              <SelectItem value="aruba">Aruba</SelectItem>
              <SelectItem value="ruckus">Ruckus</SelectItem>
              <SelectItem value="meraki">Meraki</SelectItem>
              <SelectItem value="ubiquiti">Ubiquiti</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Connectivity Type */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-orange-600" />
            <span>Connectivity Type</span>
          </Label>
          <Select value={config.connectivity} onValueChange={(value) => updateConfig('connectivity', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radsec">RADSec (Native)</SelectItem>
              <SelectItem value="lrad">LRAD Proxy</SelectItem>
              <SelectItem value="traditional">Traditional RADIUS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deployment Model */}
        <div className="space-y-2">
          <Label>Deployment Model</Label>
          <Select value={config.deployment} onValueChange={(value) => updateConfig('deployment', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloud">Cloud Only</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-premises">On-Premises</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Additional Features</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'pki', label: 'PKI Integration', color: 'bg-blue-100 text-blue-800' },
              { id: 'mdm', label: 'MDM Integration', color: 'bg-green-100 text-green-800' },
              { id: 'guest', label: 'Guest Portal', color: 'bg-purple-100 text-purple-800' },
              { id: 'iot', label: 'IoT Onboarding', color: 'bg-orange-100 text-orange-800' },
              { id: 'byod', label: 'BYOD Support', color: 'bg-pink-100 text-pink-800' },
              { id: 'compliance', label: 'Compliance', color: 'bg-red-100 text-red-800' }
            ].map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={config.features.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
                <Label htmlFor={feature.id} className="text-sm">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {config.features.map((feature) => {
              const featureData = [
                { id: 'pki', label: 'PKI Integration', color: 'bg-blue-100 text-blue-800' },
                { id: 'mdm', label: 'MDM Integration', color: 'bg-green-100 text-green-800' },
                { id: 'guest', label: 'Guest Portal', color: 'bg-purple-100 text-purple-800' },
                { id: 'iot', label: 'IoT Onboarding', color: 'bg-orange-100 text-orange-800' },
                { id: 'byod', label: 'BYOD Support', color: 'bg-pink-100 text-pink-800' },
                { id: 'compliance', label: 'Compliance', color: 'bg-red-100 text-red-800' }
              ].find(f => f.id === feature)
              
              return featureData ? (
                <Badge key={feature} className={featureData.color}>
                  {featureData.label}
                </Badge>
              ) : null
            })}
          </div>
        </div>

        {/* Animation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Animation Speed</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>
          </div>
          <Slider
            value={config.animationSpeed}
            onValueChange={(value) => updateConfig('animationSpeed', value)}
            max={100}
            min={10}
            step={10}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {config.animationSpeed[0]}% Speed
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
