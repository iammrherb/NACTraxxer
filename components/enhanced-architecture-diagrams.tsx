'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Cloud, Shield, Server, Smartphone, Laptop, Wifi, Network, Key, Lock, Play, Pause, RotateCcw, Info, Zap, Clock, CheckCircle } from 'lucide-react'

export default function EnhancedArchitectureDiagrams() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState([2])
  const [showAnimations, setShowAnimations] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  const nodeDetails = {
    'portnox-cloud': {
      title: 'Portnox Cloud',
      description: 'Cloud-native NAC platform providing RADIUS authentication and policy enforcement',
      specs: {
        'Deployment': 'AWS US-East-1',
        'Availability': '99.9% SLA',
        'Capacity': '50,000 concurrent users',
        'Protocols': 'RADSec, RADIUS, LDAP, SAML'
      },
      ports: ['443 (HTTPS)', '2083 (RADSec)', '636 (LDAPS)'],
      performance: {
        'Latency': '< 50ms',
        'Throughput': '10,000 auth/sec',
        'Uptime': '99.95%'
      }
    },
    'radsec-proxy': {
      title: 'RADSec Proxy',
      description: 'Secure RADIUS over TLS proxy for encrypted authentication traffic',
      specs: {
        'Protocol': 'RADSec (RFC 6614)',
        'Encryption': 'TLS 1.3',
        'Port': '2083',
        'Redundancy': 'Active/Standby'
      },
      ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
      performance: {
        'Latency': '< 5ms',
        'Throughput': '5,000 auth/sec',
        'Availability': '99.99%'
      }
    },
    'intune': {
      title: 'Microsoft Intune',
      description: 'Mobile Device Management and certificate distribution platform',
      specs: {
        'Integration': 'SCEP, Graph API',
        'Certificates': 'EAP-TLS, Device Auth',
        'Platforms': 'Windows, iOS, Android, macOS',
        'Enrollment': 'Automatic via Azure AD'
      },
      ports: ['443 (HTTPS)', '80 (SCEP)'],
      performance: {
        'Cert Issuance': '< 30 seconds',
        'Sync Frequency': '8 hours',
        'Success Rate': '99.5%'
      }
    }
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const OverviewDiagram = () => (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Cloud Zone */}
        <rect x="50" y="50" width="300" height="150" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.3"/>
        <text x="200" y="40" textAnchor="middle" className="text-sm font-semibold fill-blue-700">Portnox Cloud</text>
        
        {/* Site Zone */}
        <rect x="500" y="200" width="650" height="350" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" opacity="0.3"/>
        <text x="825" y="190" textAnchor="middle" className="text-sm font-semibold fill-green-700">Customer Site</text>
        
        {/* Connection Lines */}
        <line x1="350" y1="125" x2="500" y2="300" stroke="#3b82f6" strokeWidth="3" className={showAnimations ? 'draw-animation' : ''} markerEnd="url(#arrowhead)"/>
        <line x1="200" y1="200" x2="200" y2="280" stroke="#8b5cf6" strokeWidth="3" className={showAnimations ? 'draw-animation' : ''} markerEnd="url(#arrowhead)"/>
        
        {/* Arrow Markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
        
        {/* Portnox Cloud */}
        <g onClick={() => handleNodeClick('portnox-cloud')} className="cursor-pointer">
          <rect x="150" y="80" width="100" height="80" rx="8" fill="white" stroke="#3b82f6" strokeWidth="2" className="hover:stroke-blue-600 transition-colors"/>
          <Cloud className="w-8 h-8" x="175" y="100" fill="#3b82f6"/>
          <text x="200" y="140" textAnchor="middle" className="text-xs font-medium">Portnox Cloud</text>
          <text x="200" y="155" textAnchor="middle" className="text-xs text-gray-600">RADIUS/RADSec</text>
        </g>
        
        {/* RADSec Proxy */}
        <g onClick={() => handleNodeClick('radsec-proxy')} className="cursor-pointer">
          <rect x="520" y="250" width="100" height="80" rx="8" fill="white" stroke="#8b5cf6" strokeWidth="2" className="hover:stroke-purple-600 transition-colors"/>
          <Shield className="w-8 h-8" x="545" y="270" fill="#8b5cf6"/>
          <text x="570" y="310" textAnchor="middle" className="text-xs font-medium">RADSec Proxy</text>
          <text x="570" y="325" textAnchor="middle" className="text-xs text-gray-600">Port 2083</text>
        </g>
        
        {/* Network Switch */}
        <g className="cursor-pointer">
          <rect x="700" y="250" width="100" height="80" rx="8" fill="white" stroke="#059669" strokeWidth="2" className="hover:stroke-green-600 transition-colors"/>
          <Network className="w-8 h-8" x="725" y="270" fill="#059669"/>
          <text x="750" y="310" textAnchor="middle" className="text-xs font-medium">Core Switch</text>
          <text x="750" y="325" textAnchor="middle" className="text-xs text-gray-600">802.1X</text>
        </g>
        
        {/* Wireless Controller */}
        <g className="cursor-pointer">
          <rect x="880" y="250" width="100" height="80" rx="8" fill="white" stroke="#dc2626" strokeWidth="2" className="hover:stroke-red-600 transition-colors"/>
          <Wifi className="w-8 h-8" x="905" y="270" fill="#dc2626"/>
          <text x="930" y="310" textAnchor="middle" className="text-xs font-medium">Wireless</text>
          <text x="930" y="325" textAnchor="middle" className="text-xs text-gray-600">Controller</text>
        </g>
        
        {/* Intune */}
        <g onClick={() => handleNodeClick('intune')} className="cursor-pointer">
          <rect x="150" y="300" width="100" height="80" rx="8" fill="white" stroke="#f59e0b" strokeWidth="2" className="hover:stroke-amber-600 transition-colors"/>
          <Smartphone className="w-8 h-8" x="175" y="320" fill="#f59e0b"/>
          <text x="200" y="360" textAnchor="middle" className="text-xs font-medium">Microsoft</text>
          <text x="200" y="375" textAnchor="middle" className="text-xs font-medium">Intune</text>
        </g>
        
        {/* End Devices */}
        <g className="cursor-pointer">
          <rect x="700" y="450" width="80" height="60" rx="6" fill="white" stroke="#6b7280" strokeWidth="2"/>
          <Laptop className="w-6 h-6" x="720" y="470" fill="#6b7280"/>
          <text x="740" y="500" textAnchor="middle" className="text-xs">Laptops</text>
        </g>
        
        <g className="cursor-pointer">
          <rect x="800" y="450" width="80" height="60" rx="6" fill="white" stroke="#6b7280" strokeWidth="2"/>
          <Smartphone className="w-6 h-6" x="820" y="470" fill="#6b7280"/>
          <text x="840" y="500" textAnchor="middle" className="text-xs">Mobile</text>
        </g>
        
        <g className="cursor-pointer">
          <rect x="900" y="450" width="80" height="60" rx="6" fill="white" stroke="#6b7280" strokeWidth="2"/>
          <Server className="w-6 h-6" x="920" y="470" fill="#6b7280"/>
          <text x="940" y="500" textAnchor="middle" className="text-xs">IoT</text>
        </g>
        
        {/* Performance Metrics */}
        <g className="performance-overlay">
          <rect x="50" y="450" width="200" height="120" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1" opacity="0.95"/>
          <text x="60" y="470" className="text-sm font-semibold">Performance Metrics</text>
          <text x="60" y="490" className="text-xs">Authentication: &lt; 2s</text>
          <text x="60" y="505" className="text-xs">Throughput: 5,000/sec</text>
          <text x="60" y="520" className="text-xs">Availability: 99.9%</text>
          <text x="60" y="535" className="text-xs">Active Users: 2,847</text>
          <text x="60" y="550" className="text-xs">Success Rate: 99.2%</text>
        </g>
      </svg>
      
      {/* Node Details Panel */}
      {selectedNode && nodeDetails[selectedNode as keyof typeof nodeDetails] && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {nodeDetails[selectedNode as keyof typeof nodeDetails].title}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>×</Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {nodeDetails[selectedNode as keyof typeof nodeDetails].description}
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Specifications</h4>
              <div className="space-y-1">
                {Object.entries(nodeDetails[selectedNode as keyof typeof nodeDetails].specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ports & Protocols</h4>
              <div className="flex flex-wrap gap-1">
                {nodeDetails[selectedNode as keyof typeof nodeDetails].ports.map((port, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{port}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(nodeDetails[selectedNode as keyof typeof nodeDetails].performance).map(([key, value]) => (
                  <div key={key} className="performance-metric">
                    <div className="metric-label">{key}</div>
                    <div className="metric-value text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const AuthFlowDiagram = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { step: 1, title: 'Device Connection', icon: <Laptop className="w-6 h-6" />, description: 'Device connects to network port or wireless SSID', timing: '0ms' },
          { step: 2, title: 'EAP Request', icon: <Network className="w-6 h-6" />, description: 'Switch/AP sends EAP-Request Identity', timing: '10ms' },
          { step: 3, title: 'Certificate Auth', icon: <Key className="w-6 h-6" />, description: 'Device presents EAP-TLS certificate', timing: '50ms' },
          { step: 4, title: 'Policy Decision', icon: <Shield className="w-6 h-6" />, description: 'Portnox evaluates policy and grants access', timing: '100ms' }
        ].map((step, index) => (
          <div key={index} className="flow-step">
            <div className="flex items-center mb-3">
              <div className="flow-icon w-12 h-12 text-lg">
                {step.icon}
              </div>
              <div className="ml-3">
                <div className="flow-title text-base">Step {step.step}</div>
                <div className="text-xs text-gray-500">{step.timing}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="flow-description">{step.description}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Authentication Timeline
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Authentication Time:</span>
            <span className="font-semibold text-blue-700">&lt; 2 seconds</span>
          </div>
          <div className="flex justify-between">
            <span>Certificate Validation:</span>
            <span className="font-semibold">50ms</span>
          </div>
          <div className="flex justify-between">
            <span>Policy Lookup:</span>
            <span className="font-semibold">30ms</span>
          </div>
          <div className="flex justify-between">
            <span>VLAN Assignment:</span>
            <span className="font-semibold">20ms</span>
          </div>
        </div>
      </div>
    </div>
  )

  const PKIDiagram = () => (
    <div className="space-y-6">
      <div className="relative w-full h-[400px] bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400">
          {/* PKI Components */}
          <g className="cursor-pointer">
            <rect x="50" y="50" width="120" height="80" rx="8" fill="white" stroke="#059669" strokeWidth="2"/>
            <Key className="w-8 h-8" x="85" y="70" fill="#059669"/>
            <text x="110" y="105" textAnchor="middle" className="text-xs font-medium">Root CA</text>
            <text x="110" y="120" textAnchor="middle" className="text-xs text-gray-600">Internal PKI</text>
          </g>
          
          <g className="cursor-pointer">
            <rect x="250" y="50" width="120" height="80" rx="8" fill="white" stroke="#dc2626" strokeWidth="2"/>
            <Server className="w-8 h-8" x="285" y="70" fill="#dc2626"/>
            <text x="310" y="105" textAnchor="middle" className="text-xs font-medium">SCEP Server</text>
            <text x="310" y="120" textAnchor="middle" className="text-xs text-gray-600">Port 80/443</text>
          </g>
          
          <g className="cursor-pointer">
            <rect x="450" y="50" width="120" height="80" rx="8" fill="white" stroke="#7c3aed" strokeWidth="2"/>
            <CheckCircle className="w-8 h-8" x="485" y="70" fill="#7c3aed"/>
            <text x="510" y="105" textAnchor="middle" className="text-xs font-medium">OCSP</text>
            <text x="510" y="120" textAnchor="middle" className="text-xs text-gray-600">Validation</text>
          </g>
          
          <g className="cursor-pointer">
            <rect x="650" y="50" width="120" height="80" rx="8" fill="white" stroke="#f59e0b" strokeWidth="2"/>
            <Lock className="w-8 h-8" x="685" y="70" fill="#f59e0b"/>
            <text x="710" y="105" textAnchor="middle" className="text-xs font-medium">CRL</text>
            <text x="710" y="120" textAnchor="middle" className="text-xs text-gray-600">Revocation</text>
          </g>
          
          {/* Intune Integration */}
          <g className="cursor-pointer">
            <rect x="250" y="250" width="120" height="80" rx="8" fill="white" stroke="#0078d4" strokeWidth="2"/>
            <Smartphone className="w-8 h-8" x="285" y="270" fill="#0078d4"/>
            <text x="310" y="305" textAnchor="middle" className="text-xs font-medium">Intune</text>
            <text x="310" y="320" textAnchor="middle" className="text-xs text-gray-600">MDM/SCEP</text>
          </g>
          
          {/* Connection Lines */}
          <line x1="170" y1="90" x2="250" y2="90" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <line x1="370" y1="90" x2="450" y2="90" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <line x1="570" y1="90" x2="650" y2="90" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <line x1="310" y1="130" x2="310" y2="250" stroke="#0078d4" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        </svg>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Key className="w-5 h-5 mr-2 text-green-600" />
            Certificate Lifecycle
          </h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Automatic enrollment via Intune</li>
            <li>• 2-year certificate validity</li>
            <li>• Auto-renewal at 75% lifetime</li>
            <li>• EAP-TLS authentication</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
            Validation Process
          </h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Real-time OCSP checking</li>
            <li>• CRL fallback mechanism</li>
            <li>• Certificate chain validation</li>
            <li>• Revocation status verification</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Performance Metrics
          </h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• OCSP response: &lt; 100ms</li>
            <li>• Certificate issuance: &lt; 30s</li>
            <li>• Validation success: 99.8%</li>
            <li>• Auto-enrollment: 99.5%</li>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-6 w-6 text-blue-600" />
            <span>Enhanced Architecture Diagrams</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="animations" className="text-sm">Animations</Label>
              <Switch
                id="animations"
                checked={showAnimations}
                onCheckedChange={setShowAnimations}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Speed</Label>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={5}
                min={0.5}
                step={0.5}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Zero Trust NAC Overview</span>
            </TabsTrigger>
            <TabsTrigger value="auth-flow" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>802.1X Authentication Flow</span>
            </TabsTrigger>
            <TabsTrigger value="pki" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>PKI Infrastructure</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Complete Architecture Overview</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Legend
                  </Button>
                </div>
              </div>
              <OverviewDiagram />
            </div>
          </TabsContent>

          <TabsContent value="auth-flow">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">802.1X Authentication Process</h3>
              <AuthFlowDiagram />
            </div>
          </TabsContent>

          <TabsContent value="pki">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">PKI & Certificate Management</h3>
              <PKIDiagram />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
