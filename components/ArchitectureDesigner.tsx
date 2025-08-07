'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Building2, Users, Network, Shield, Download, Save, Settings, Info, Zap, Globe } from 'lucide-react'

export default function ArchitectureDesigner() {
  const [customerInfo, setCustomerInfo] = useState({
    name: 'ABM Industries',
    industry: 'Facilities Management',
    size: 'Enterprise (10,000+ employees)',
    region: 'North America'
  })

  const [networkConfig, setNetworkConfig] = useState({
    sites: 125,
    users: 12500,
    devices: 18750,
    wiredVendor: 'Cisco',
    wirelessVendor: 'Cisco',
    existingNAC: 'Cisco ISE'
  })

  const [deploymentConfig, setDeploymentConfig] = useState({
    approach: 'Phased Rollout',
    priority: 'High-Security Sites First',
    timeline: '6 months',
    pilotSites: 3
  })

  const exportConfiguration = () => {
    const config = {
      customer: customerInfo,
      network: networkConfig,
      deployment: deploymentConfig,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${customerInfo.name.replace(/\s+/g, '-')}-nac-config-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span>Architecture Configuration</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportConfiguration}>
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Design
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Customer Info</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={customerInfo.industry} onValueChange={(value) => setCustomerInfo({...customerInfo, industry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facilities Management">Facilities Management</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Financial Services">Financial Services</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select value={customerInfo.size} onValueChange={(value) => setCustomerInfo({...customerInfo, size: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small (< 500 employees)">Small (&lt; 500 employees)</SelectItem>
                      <SelectItem value="Medium (500-2,500 employees)">Medium (500-2,500 employees)</SelectItem>
                      <SelectItem value="Large (2,500-10,000 employees)">Large (2,500-10,000 employees)</SelectItem>
                      <SelectItem value="Enterprise (10,000+ employees)">Enterprise (10,000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Network Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Network className="h-5 w-5 text-green-600" />
                <span>Network Config</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="sites">Number of Sites</Label>
                  <Input
                    id="sites"
                    type="number"
                    value={networkConfig.sites}
                    onChange={(e) => setNetworkConfig({...networkConfig, sites: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="users">Total Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={networkConfig.users}
                    onChange={(e) => setNetworkConfig({...networkConfig, users: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wired-vendor">Wired Vendor</Label>
                  <Select value={networkConfig.wiredVendor} onValueChange={(value) => setNetworkConfig({...networkConfig, wiredVendor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cisco">Cisco</SelectItem>
                      <SelectItem value="Aruba">Aruba</SelectItem>
                      <SelectItem value="Juniper">Juniper</SelectItem>
                      <SelectItem value="Extreme">Extreme Networks</SelectItem>
                      <SelectItem value="Mixed">Mixed Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="wireless-vendor">Wireless Vendor</Label>
                  <Select value={networkConfig.wirelessVendor} onValueChange={(value) => setNetworkConfig({...networkConfig, wirelessVendor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cisco">Cisco</SelectItem>
                      <SelectItem value="Aruba">Aruba</SelectItem>
                      <SelectItem value="Ruckus">Ruckus</SelectItem>
                      <SelectItem value="Meraki">Meraki</SelectItem>
                      <SelectItem value="Mixed">Mixed Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Security & Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Security Config</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label>Compliance Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['SOX', 'HIPAA', 'PCI-DSS', 'ISO 27001'].map((compliance) => (
                      <Badge key={compliance} variant="outline" className="cursor-pointer hover:bg-purple-50">
                        {compliance}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Authentication Methods</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['802.1X', 'MAC Auth', 'Web Auth', 'Certificate'].map((method) => (
                      <Badge key={method} variant="outline" className="cursor-pointer hover:bg-purple-50">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="existing-nac">Existing NAC</Label>
                  <Select value={networkConfig.existingNAC} onValueChange={(value) => setNetworkConfig({...networkConfig, existingNAC: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Cisco ISE">Cisco ISE</SelectItem>
                      <SelectItem value="Aruba ClearPass">Aruba ClearPass</SelectItem>
                      <SelectItem value="ForeScout">ForeScout</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Deployment Strategy */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span>Deployment</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="approach">Approach</Label>
                  <Select value={deploymentConfig.approach} onValueChange={(value) => setDeploymentConfig({...deploymentConfig, approach: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Big Bang">Big Bang</SelectItem>
                      <SelectItem value="Phased Rollout">Phased Rollout</SelectItem>
                      <SelectItem value="Pilot First">Pilot First</SelectItem>
                      <SelectItem value="Site by Site">Site by Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={deploymentConfig.timeline} onValueChange={(value) => setDeploymentConfig({...deploymentConfig, timeline: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="18 months">18 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="pilot-sites">Pilot Sites</Label>
                  <Input
                    id="pilot-sites"
                    type="number"
                    value={deploymentConfig.pilotSites}
                    onChange={(e) => setDeploymentConfig({...deploymentConfig, pilotSites: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-6 w-6 text-blue-600" />
            <span>Configuration Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Scale</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Sites:</span>
                  <span className="font-medium">{networkConfig.sites.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="font-medium">{networkConfig.users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Devices:</span>
                  <span className="font-medium">{networkConfig.devices.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Network className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Infrastructure</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Wired:</span>
                  <span className="font-medium">{networkConfig.wiredVendor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wireless:</span>
                  <span className="font-medium">{networkConfig.wirelessVendor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current NAC:</span>
                  <span className="font-medium">{networkConfig.existingNAC}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Security</span>
              </div>
              <div className="space-y-1 text-sm">
                <div>Zero Trust Architecture</div>
                <div>Certificate-based Auth</div>
                <div>Policy Enforcement</div>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-900">Deployment</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Approach:</span>
                  <span className="font-medium">{deploymentConfig.approach}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeline:</span>
                  <span className="font-medium">{deploymentConfig.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pilot Sites:</span>
                  <span className="font-medium">{deploymentConfig.pilotSites}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
