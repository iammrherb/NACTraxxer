'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Cloud, Server, Wifi, Shield, Database, Globe, Lock, Zap, Activity, Target, CheckCircle, Clock, AlertTriangle, XCircle, BadgeIcon as Certificate, Key, Fingerprint, ComputerIcon as Desktop, Laptop, Smartphone, Tablet, Cpu, Network, Router, HardDrive } from 'lucide-react'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
}

export default function InteractiveDiagram({ view, cloudProvider, networkVendor, connectivityType }: InteractiveDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showDataFlow, setShowDataFlow] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  const components = {
    complete: [
      { id: 'portnox-cloud', type: 'cloud', x: 400, y: 50, label: 'Portnox Cloud NAC', icon: Cloud, color: '#3B82F6' },
      { id: 'azure-ad', type: 'identity', x: 200, y: 50, label: 'Azure AD / Entra ID', icon: Shield, color: '#0078D4' },
      { id: 'intune', type: 'mdm', x: 600, y: 50, label: 'Microsoft Intune', icon: Smartphone, color: '#0078D4' },
      { id: 'ca-server', type: 'pki', x: 100, y: 150, label: 'Certificate Authority', icon: Certificate, color: '#10B981' },
      { id: 'radius-proxy', type: 'proxy', x: 400, y: 150, label: 'RADIUS Proxy', icon: Router, color: '#F59E0B' },
      { id: 'network-switch', type: 'network', x: 400, y: 300, label: `${networkVendor} Switch`, icon: Network, color: '#6B7280' },
      { id: 'wireless-controller', type: 'wireless', x: 600, y: 300, label: 'Wireless Controller', icon: Wifi, color: '#8B5CF6' },
      { id: 'endpoint-1', type: 'endpoint', x: 200, y: 450, label: 'Corporate Laptop', icon: Laptop, color: '#EF4444' },
      { id: 'endpoint-2', type: 'endpoint', x: 400, y: 450, label: 'Mobile Device', icon: Smartphone, color: '#EF4444' },
      { id: 'endpoint-3', type: 'endpoint', x: 600, y: 450, label: 'IoT Device', icon: Cpu, color: '#EF4444' }
    ],
    'auth-flow': [
      { id: 'device', type: 'endpoint', x: 100, y: 200, label: 'Device', icon: Laptop, color: '#EF4444' },
      { id: 'switch', type: 'network', x: 300, y: 200, label: 'Network Switch', icon: Network, color: '#6B7280' },
      { id: 'radius-proxy', type: 'proxy', x: 500, y: 200, label: 'RADIUS Proxy', icon: Router, color: '#F59E0B' },
      { id: 'portnox', type: 'cloud', x: 700, y: 200, label: 'Portnox Cloud', icon: Cloud, color: '#3B82F6' }
    ],
    pki: [
      { id: 'ca-root', type: 'pki', x: 400, y: 50, label: 'Root CA', icon: Certificate, color: '#10B981' },
      { id: 'ca-issuing', type: 'pki', x: 400, y: 150, label: 'Issuing CA', icon: Certificate, color: '#10B981' },
      { id: 'scep-server', type: 'service', x: 200, y: 250, label: 'SCEP Server', icon: Key, color: '#F59E0B' },
      { id: 'ocsp-server', type: 'service', x: 600, y: 250, label: 'OCSP Server', icon: CheckCircle, color: '#10B981' },
      { id: 'device-cert', type: 'endpoint', x: 400, y: 350, label: 'Device Certificate', icon: Fingerprint, color: '#EF4444' }
    ],
    intune: [
      { id: 'intune-portal', type: 'cloud', x: 400, y: 50, label: 'Intune Portal', icon: Cloud, color: '#0078D4' },
      { id: 'compliance-policy', type: 'policy', x: 200, y: 150, label: 'Compliance Policy', icon: Shield, color: '#10B981' },
      { id: 'app-protection', type: 'policy', x: 600, y: 150, label: 'App Protection', icon: Lock, color: '#F59E0B' },
      { id: 'managed-device', type: 'endpoint', x: 400, y: 250, label: 'Managed Device', icon: Smartphone, color: '#EF4444' }
    ]
  }

  const connections = {
    complete: [
      { from: 'portnox-cloud', to: 'azure-ad', type: 'saml' },
      { from: 'portnox-cloud', to: 'intune', type: 'api' },
      { from: 'portnox-cloud', to: 'radius-proxy', type: 'radius' },
      { from: 'radius-proxy', to: 'network-switch', type: 'radius' },
      { from: 'radius-proxy', to: 'wireless-controller', type: 'radius' },
      { from: 'ca-server', to: 'endpoint-1', type: 'certificate' },
      { from: 'network-switch', to: 'endpoint-1', type: 'ethernet' },
      { from: 'wireless-controller', to: 'endpoint-2', type: 'wifi' },
      { from: 'network-switch', to: 'endpoint-3', type: 'ethernet' }
    ],
    'auth-flow': [
      { from: 'device', to: 'switch', type: 'auth-request' },
      { from: 'switch', to: 'radius-proxy', type: 'radius' },
      { from: 'radius-proxy', to: 'portnox', type: 'radius-tls' }
    ]
  }

  const currentComponents = components[view as keyof typeof components] || components.complete
  const currentConnections = connections[view as keyof typeof connections] || []

  const renderComponent = (component: any) => {
    const IconComponent = component.icon
    return (
      <TooltipProvider key={component.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              className={`cursor-pointer transition-all duration-200 ${
                selectedComponent === component.id ? 'scale-110' : 'hover:scale-105'
              }`}
              onClick={() => setSelectedComponent(component.id)}
              transform={`translate(${component.x}, ${component.y})`}
            >
              <rect
                x="-40"
                y="-30"
                width="80"
                height="60"
                rx="8"
                fill={component.color}
                fillOpacity="0.1"
                stroke={component.color}
                strokeWidth="2"
                className={selectedComponent === component.id ? 'stroke-4' : ''}
              />
              <foreignObject x="-12" y="-12" width="24" height="24">
                <IconComponent className="w-6 h-6" style={{ color: component.color }} />
              </foreignObject>
              <text
                x="0"
                y="25"
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {component.label}
              </text>
            </g>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <h4 className="font-semibold">{component.label}</h4>
              <p className="text-sm text-gray-600">
                {getComponentDescription(component.type, component.id)}
              </p>
              <div className="mt-2 text-xs">
                <Badge variant="outline">{component.type}</Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const renderConnection = (connection: any, index: number) => {
    const fromComponent = currentComponents.find(c => c.id === connection.from)
    const toComponent = currentComponents.find(c => c.id === connection.to)
    
    if (!fromComponent || !toComponent) return null

    const strokeColor = getConnectionColor(connection.type)
    const strokeDasharray = getConnectionStyle(connection.type)

    return (
      <g key={`connection-${index}`}>
        <line
          x1={fromComponent.x}
          y1={fromComponent.y}
          x2={toComponent.x}
          y2={toComponent.y}
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          className={showDataFlow ? 'animate-pulse' : ''}
        />
        {showDataFlow && (
          <circle
            r="3"
            fill={strokeColor}
            className="animate-ping"
            style={{
              animationDuration: `${2 / animationSpeed}s`
            }}
          >
            <animateMotion
              dur={`${2 / animationSpeed}s`}
              repeatCount="indefinite"
              path={`M${fromComponent.x},${fromComponent.y} L${toComponent.x},${toComponent.y}`}
            />
          </circle>
        )}
      </g>
    )
  }

  const getComponentDescription = (type: string, id: string) => {
    const descriptions: Record<string, string> = {
      cloud: 'Cloud-based NAC service providing centralized policy management and authentication',
      identity: 'Identity provider for user authentication and authorization',
      mdm: 'Mobile device management for endpoint compliance and security',
      pki: 'Public Key Infrastructure for certificate-based authentication',
      proxy: 'RADIUS proxy for secure communication between network devices and cloud',
      network: 'Network infrastructure device for wired connectivity',
      wireless: 'Wireless access point controller for Wi-Fi connectivity',
      endpoint: 'End-user device requiring network access',
      service: 'Supporting service for PKI operations',
      policy: 'Security policy enforcement component'
    }
    return descriptions[type] || 'Network component'
  }

  const getConnectionColor = (type: string) => {
    const colors: Record<string, string> = {
      saml: '#10B981',
      api: '#3B82F6',
      radius: '#F59E0B',
      certificate: '#10B981',
      ethernet: '#6B7280',
      wifi: '#8B5CF6',
      'auth-request': '#EF4444',
      'radius-tls': '#10B981'
    }
    return colors[type] || '#6B7280'
  }

  const getConnectionStyle = (type: string) => {
    const styles: Record<string, string> = {
      saml: '5,5',
      api: '10,5',
      radius: '',
      certificate: '2,2',
      ethernet: '',
      wifi: '8,4',
      'auth-request': '3,3',
      'radius-tls': '5,5'
    }
    return styles[type] || ''
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {view === 'complete' && 'Complete Architecture Overview'}
          {view === 'auth-flow' && 'Authentication Flow Diagram'}
          {view === 'pki' && 'PKI & Certificate Management'}
          {view === 'intune' && 'Microsoft Intune Integration'}
          {view === 'policies' && 'Access Control Policies'}
          {view === 'connectivity' && 'Connectivity Options'}
          {view === 'onboarding' && 'Device Onboarding Scenarios'}
        </h3>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataFlow(!showDataFlow)}
          >
            {showDataFlow ? 'Hide' : 'Show'} Data Flow
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm">{animationSpeed}x</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[500px]">
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox="0 0 800 500"
          className="overflow-visible"
        >
          {/* Render connections first (behind components) */}
          {currentConnections.map((connection, index) => renderConnection(connection, index))}
          
          {/* Render components */}
          {currentComponents.map(renderComponent)}
        </svg>
      </div>

      {selectedComponent && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Component Details</h4>
          <div className="text-sm space-y-1">
            <p><strong>ID:</strong> {selectedComponent}</p>
            <p><strong>Type:</strong> {currentComponents.find(c => c.id === selectedComponent)?.type}</p>
            <p><strong>Description:</strong> {getComponentDescription(
              currentComponents.find(c => c.id === selectedComponent)?.type || '',
              selectedComponent
            )}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
