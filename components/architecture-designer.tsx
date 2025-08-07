'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Network, Shield, Cloud, Server, Wifi, Database, Globe, Lock, Zap, Activity, Target, CheckCircle, Clock, AlertTriangle, XCircle, BadgeIcon as Certificate, Key, Fingerprint, ComputerIcon as Desktop, Laptop, Smartphone, Tablet, Cpu } from 'lucide-react'
import InteractiveDiagram from '@/components/interactive-diagram'
import ArchitectureLegend from '@/components/architecture-legend'
import PolicyEditor from '@/components/policy-editor'
import OnboardingScenarios from '@/components/onboarding-scenarios'

export default function ArchitectureDesigner() {
  const [currentView, setCurrentView] = useState('complete')
  const [cloudProvider, setCloudProvider] = useState('azure')
  const [networkVendor, setNetworkVendor] = useState('cisco')
  const [connectivityType, setConnectivityType] = useState('sdwan')
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const architectureViews = [
    { id: 'complete', label: 'Complete Architecture', icon: Network },
    { id: 'auth-flow', label: 'Authentication Flow', icon: Shield },
    { id: 'pki', label: 'PKI & Certificate Management', icon: Certificate },
    { id: 'policies', label: 'Access Control Policies', icon: Lock },
    { id: 'connectivity', label: 'Connectivity Options', icon: Globe },
    { id: 'intune', label: 'Intune Integration', icon: Cloud },
    { id: 'onboarding', label: 'Device Onboarding Scenarios', icon: Smartphone }
  ]

  const handleExportPNG = () => {
    // Implementation for PNG export
    console.log('Exporting as PNG...')
  }

  const handleExportSVG = () => {
    // Implementation for SVG export
    console.log('Exporting as SVG...')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Interactive Architecture Designer</span>
          </CardTitle>
          <CardDescription>
            Design and customize your Zero Trust NAC architecture with interactive diagrams, 
            export capabilities, and comprehensive documentation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Architecture View Controls */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              {architectureViews.map((view) => {
                const IconComponent = view.icon
                return (
                  <Button
                    key={view.id}
                    variant={currentView === view.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView(view.id)}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{view.label}</span>
                  </Button>
                )
              })}
              
              <div className="flex space-x-2 ml-auto">
                <Button variant="outline" size="sm" onClick={handleExportPNG}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PNG
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportSVG}>
                  <Download className="h-4 w-4 mr-2" />
                  Export SVG
                </Button>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cloud Provider</label>
                <Select value={cloudProvider} onValueChange={setCloudProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cloud provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                    <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    <SelectItem value="onprem">On-Premises</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Network Vendor</label>
                <Select value={networkVendor} onValueChange={setNetworkVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cisco">Cisco</SelectItem>
                    <SelectItem value="meraki">Cisco Meraki</SelectItem>
                    <SelectItem value="juniper">Juniper Networks</SelectItem>
                    <SelectItem value="aruba">Aruba Networks</SelectItem>
                    <SelectItem value="hpe">HPE</SelectItem>
                    <SelectItem value="extreme">Extreme Networks</SelectItem>
                    <SelectItem value="fortinet">Fortinet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Connectivity Type</label>
                <Select value={connectivityType} onValueChange={setConnectivityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select connectivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sdwan">SD-WAN</SelectItem>
                    <SelectItem value="expressroute">Azure Express Route</SelectItem>
                    <SelectItem value="directconnect">AWS Direct Connect</SelectItem>
                    <SelectItem value="mpls">MPLS</SelectItem>
                    <SelectItem value="vpn">Site-to-Site VPN</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Interactive Diagram */}
          <InteractiveDiagram 
            view={currentView}
            cloudProvider={cloudProvider}
            networkVendor={networkVendor}
            connectivityType={connectivityType}
          />

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button onClick={() => setShowPolicyEditor(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Edit Policies
            </Button>
            <Button onClick={() => setShowOnboarding(true)}>
              <Smartphone className="h-4 w-4 mr-2" />
              View Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legend and Help */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArchitectureLegend />
        
        <Card>
          <CardHeader>
            <CardTitle>Interactive Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">How to Use</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click diagram view buttons to switch between different architecture perspectives</li>
                  <li>• Hover over components for detailed tooltips and descriptions</li>
                  <li>• Use the customization controls to adapt the architecture to your environment</li>
                  <li>• Export diagrams as PNG or SVG for documentation and presentations</li>
                  <li>• Click connection points on components to create custom connections</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Interactive component tooltips with technical details</li>
                  <li>• Animated data flow visualization</li>
                  <li>• Customizable colors and styling</li>
                  <li>• Multi-cloud deployment options</li>
                  <li>• Vendor-agnostic network support</li>
                  <li>• Comprehensive onboarding scenarios</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Details</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• RADIUS over TLS: Port 2083</li>
                  <li>• RADIUS: Ports 1812/1813</li>
                  <li>• SCEP: Port 80/443 for certificate enrollment</li>
                  <li>• OCSP: Port 80/443 for certificate validation</li>
                  <li>• 7-day authentication cache for offline support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Editor Modal */}
      {showPolicyEditor && (
        <PolicyEditor 
          open={showPolicyEditor} 
          onOpenChange={setShowPolicyEditor} 
        />
      )}

      {/* Onboarding Scenarios Modal */}
      {showOnboarding && (
        <OnboardingScenarios 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding} 
        />
      )}
    </div>
  )
}
