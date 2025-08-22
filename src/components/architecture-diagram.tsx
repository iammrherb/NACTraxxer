'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Cloud, Server, Shield, Wifi, Database, Lock, BadgeIcon as Certificate, Smartphone, Laptop, Network, Globe, Zap, Activity } from 'lucide-react'

interface ArchitectureDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
}

interface DiagramNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  type: string
  color: string
  icon?: React.ReactNode
  description?: string
}

interface DiagramConnection {
  from: string
  to: string
  type: 'standard' | 'secure' | 'dashed'
  label?: string
  color?: string
}

export default function ArchitectureDiagram({ 
  view, 
  cloudProvider, 
  networkVendor, 
  connectivityType 
}: ArchitectureDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showDataFlow, setShowDataFlow] = useState(false)

  const getNodes = (): DiagramNode[] => {
    const baseNodes: DiagramNode[] = []

    switch (view) {
      case 'complete':
        return [
          {
            id: 'portnox-cloud',
            x: 400,
            y: 50,
            width: 300,
            height: 120,
            label: 'Portnox Cloud',
            type: 'cloud',
            color: '#e3f2fd',
            icon: <Cloud className="w-6 h-6" />,
            description: 'Cloud-based NAC engine with Private PKI, policy management, and RADIUS authentication services'
          },
          {
            id: 'cloud-provider',
            x: 100,
            y: 250,
            width: 400,
            height: 150,
            label: `${cloudProvider.toUpperCase()} Infrastructure`,
            type: cloudProvider,
            color: getCloudColor(cloudProvider),
            icon: <Server className="w-6 h-6" />,
            description: `${cloudProvider.toUpperCase()} cloud infrastructure hosting RADSec proxies with high availability`
          },
          {
            id: 'intune',
            x: 750,
            y: 250,
            width: 300,
            height: 150,
            label: 'Microsoft Intune',
            type: 'intune',
            color: '#e1f5fe',
            icon: <Shield className="w-6 h-6" />,
            description: 'MDM solution for certificate deployment and device configuration management'
          },
          {
            id: 'connectivity',
            x: 100,
            y: 450,
            width: 400,
            height: 60,
            label: getConnectivityLabel(connectivityType),
            type: 'connectivity',
            color: '#f3e5f5',
            icon: <Network className="w-6 h-6" />,
            description: `${getConnectivityLabel(connectivityType)} for secure site connectivity`
          },
          {
            id: 'site',
            x: 100,
            y: 600,
            width: 400,
            height: 120,
            label: `ABM Site - ${networkVendor.toUpperCase()} Stack`,
            type: 'site',
            color: '#e8f5e9',
            icon: <Wifi className="w-6 h-6" />,
            description: `Physical location with ${networkVendor} network infrastructure`
          },
          {
            id: 'endpoints',
            x: 750,
            y: 500,
            width: 300,
            height: 200,
            label: 'Managed Endpoints',
            type: 'device',
            color: '#f5f5f5',
            icon: <Laptop className="w-6 h-6" />,
            description: 'Corporate devices with certificates deployed via Intune'
          }
        ]

      case 'auth-flow':
        return [
          {
            id: 'device',
            x: 50,
            y: 300,
            width: 120,
            height: 60,
            label: 'End Device',
            type: 'device',
            color: '#e8f5e9',
            icon: <Laptop className="w-5 h-5" />,
            description: 'User device attempting network access'
          },
          {
            id: 'nas',
            x: 250,
            y: 300,
            width: 150,
            height: 60,
            label: `${networkVendor.toUpperCase()} NAS`,
            type: 'network',
            color: '#e8f5e9',
            icon: <Network className="w-5 h-5" />,
            description: 'Network Access Server handling 802.1X authentication'
          },
          {
            id: 'proxy',
            x: 500,
            y: 300,
            width: 180,
            height: 60,
            label: `RADSec Proxy (${cloudProvider.toUpperCase()})`,
            type: cloudProvider,
            color: getCloudColor(cloudProvider),
            icon: <Shield className="w-5 h-5" />,
            description: 'RADIUS over TLS proxy with 7-day cache'
          },
          {
            id: 'portnox',
            x: 800,
            y: 300,
            width: 200,
            height: 80,
            label: 'Portnox Cloud',
            type: 'cloud',
            color: '#e3f2fd',
            icon: <Cloud className="w-5 h-5" />,
            description: 'Cloud NAC service for authentication decisions'
          }
        ]

      case 'pki':
        return [
          {
            id: 'pki-ca',
            x: 400,
            y: 50,
            width: 200,
            height: 80,
            label: 'Portnox Private CA',
            type: 'pki',
            color: '#e3f2fd',
            icon: <Certificate className="w-5 h-5" />,
            description: 'Private Certificate Authority for issuing X.509 certificates'
          },
          {
            id: 'scep',
            x: 200,
            y: 200,
            width: 150,
            height: 60,
            label: 'SCEP Server',
            type: 'cert',
            color: '#e3f2fd',
            icon: <Lock className="w-5 h-5" />,
            description: 'Simple Certificate Enrollment Protocol server'
          },
          {
            id: 'ocsp',
            x: 450,
            y: 200,
            width: 150,
            height: 60,
            label: 'OCSP Responder',
            type: 'cert',
            color: '#e3f2fd',
            icon: <Activity className="w-5 h-5" />,
            description: 'Online Certificate Status Protocol for validation'
          },
          {
            id: 'intune-mdm',
            x: 200,
            y: 350,
            width: 150,
            height: 60,
            label: 'Intune MDM',
            type: 'mdm',
            color: '#fff3e0',
            icon: <Shield className="w-5 h-5" />,
            description: 'Mobile Device Management for certificate deployment'
          },
          {
            id: 'end-device',
            x: 450,
            y: 350,
            width: 150,
            height: 60,
            label: 'End Device',
            type: 'device',
            color: '#e8f5e9',
            icon: <Laptop className="w-5 h-5" />,
            description: 'Device receiving certificates for authentication'
          }
        ]

      case 'intune':
        return [
          {
            id: 'intune-main',
            x: 450,
            y: 300,
            width: 300,
            height: 200,
            label: 'Microsoft Intune',
            type: 'intune',
            color: '#e1f5fe',
            icon: <Shield className="w-6 h-6" />,
            description: 'Centralized device management and policy enforcement'
          },
          {
            id: 'portnox-pki',
            x: 450,
            y: 50,
            width: 300,
            height: 100,
            label: 'Portnox Private PKI',
            type: 'pki',
            color: '#e3f2fd',
            icon: <Certificate className="w-6 h-6" />,
            description: 'Certificate Authority integrated with Intune via SCEP'
          },
          {
            id: 'windows',
            x: 100,
            y: 350,
            width: 150,
            height: 80,
            label: 'Windows Devices',
            type: 'device',
            color: '#e8f5e9',
            icon: <Laptop className="w-5 h-5" />,
            description: 'Corporate Windows devices managed by Intune'
          },
          {
            id: 'mobile',
            x: 850,
            y: 350,
            width: 150,
            height: 80,
            label: 'Mobile Devices',
            type: 'device',
            color: '#e8f5e9',
            icon: <Smartphone className="w-5 h-5" />,
            description: 'iOS and Android devices with certificates'
          }
        ]

      case 'policies':
        return [
          {
            id: 'policy-engine',
            x: 400,
            y: 50,
            width: 400,
            height: 100,
            label: 'Portnox Policy Engine',
            type: 'policy',
            color: '#e3f2fd',
            icon: <Shield className="w-6 h-6" />,
            description: 'Centralized policy management and enforcement'
          },
          {
            id: 'user-policies',
            x: 100,
            y: 200,
            width: 200,
            height: 120,
            label: 'User Policies',
            type: 'policy',
            color: '#d4edda',
            icon: <Lock className="w-5 h-5" />,
            description: 'User-based access control policies'
          },
          {
            id: 'device-policies',
            x: 350,
            y: 200,
            width: 200,
            height: 120,
            label: 'Device Policies',
            type: 'policy',
            color: '#cce5ff',
            icon: <Laptop className="w-5 h-5" />,
            description: 'Device compliance and security policies'
          },
          {
            id: 'network-policies',
            x: 600,
            y: 200,
            width: 200,
            height: 120,
            label: 'Network Policies',
            type: 'policy',
            color: '#fff3cd',
            icon: <Network className="w-5 h-5" />,
            description: 'Network segmentation and access policies'
          }
        ]

      case 'connectivity':
        return [
          {
            id: 'portnox-center',
            x: 450,
            y: 300,
            width: 300,
            height: 100,
            label: 'Portnox Cloud',
            type: 'cloud',
            color: '#e3f2fd',
            icon: <Cloud className="w-6 h-6" />,
            description: 'Central authentication service'
          },
          {
            id: 'aws-proxy',
            x: 100,
            y: 100,
            width: 200,
            height: 80,
            label: 'AWS RADSec Proxy',
            type: 'aws',
            color: '#fff3e0',
            icon: <Server className="w-5 h-5" />,
            description: 'AWS-hosted RADIUS proxy'
          },
          {
            id: 'azure-proxy',
            x: 350,
            y: 100,
            width: 200,
            height: 80,
            label: 'Azure RADSec Proxy',
            type: 'azure',
            color: '#e1f5fe',
            icon: <Server className="w-5 h-5" />,
            description: 'Azure-hosted RADIUS proxy'
          },
          {
            id: 'gcp-proxy',
            x: 600,
            y: 100,
            width: 200,
            height: 80,
            label: 'GCP RADSec Proxy',
            type: 'gcp',
            color: '#e8f5e9',
            icon: <Server className="w-5 h-5" />,
            description: 'GCP-hosted RADIUS proxy'
          }
        ]

      case 'onboarding':
        return [
          {
            id: 'onboarding-portal',
            x: 400,
            y: 50,
            width: 400,
            height: 100,
            label: 'Device Onboarding Portal',
            type: 'portal',
            color: '#e3f2fd',
            icon: <Globe className="w-6 h-6" />,
            description: 'Self-service device registration and certificate enrollment'
          },
          {
            id: 'corporate-flow',
            x: 50,
            y: 200,
            width: 200,
            height: 300,
            label: 'Corporate Device Flow',
            type: 'flow',
            color: '#d4edda',
            icon: <Laptop className="w-5 h-5" />,
            description: 'Automated enrollment via Intune MDM'
          },
          {
            id: 'byod-flow',
            x: 300,
            y: 200,
            width: 200,
            height: 300,
            label: 'BYOD Flow',
            type: 'flow',
            color: '#cce5ff',
            icon: <Smartphone className="w-5 h-5" />,
            description: 'Self-service enrollment for personal devices'
          },
          {
            id: 'iot-flow',
            x: 550,
            y: 200,
            width: 200,
            height: 300,
            label: 'IoT Device Flow',
            type: 'flow',
            color: '#fff3cd',
            icon: <Zap className="w-5 h-5" />,
            description: 'MAC Authentication Bypass for IoT devices'
          },
          {
            id: 'guest-flow',
            x: 800,
            y: 200,
            width: 200,
            height: 300,
            label: 'Guest Access Flow',
            type: 'flow',
            color: '#f8d7da',
            icon: <Globe className="w-5 h-5" />,
            description: 'Sponsored guest access with time-limited credentials'
          }
        ]

      default:
        return baseNodes
    }
  }

  const getConnections = (): DiagramConnection[] => {
    switch (view) {
      case 'complete':
        return [
          { from: 'portnox-cloud', to: 'cloud-provider', type: 'secure', label: 'RADSec/TLS' },
          { from: 'portnox-cloud', to: 'intune', type: 'dashed', label: 'SCEP' },
          { from: 'cloud-provider', to: 'connectivity', type: 'standard' },
          { from: 'connectivity', to: 'site', type: getConnectionType(connectivityType) },
          { from: 'site', to: 'endpoints', type: 'standard', label: '802.1X' },
          { from: 'intune', to: 'endpoints', type: 'secure', label: 'Config Push' }
        ]

      case 'auth-flow':
        return [
          { from: 'device', to: 'nas', type: 'standard', label: '1' },
          { from: 'nas', to: 'proxy', type: 'standard', label: '2' },
          { from: 'proxy', to: 'portnox', type: 'secure', label: '3' }
        ]

      case 'pki':
        return [
          { from: 'pki-ca', to: 'scep', type: 'standard' },
          { from: 'pki-ca', to: 'ocsp', type: 'standard' },
          { from: 'scep', to: 'intune-mdm', type: 'dashed', label: 'SCEP' },
          { from: 'intune-mdm', to: 'end-device', type: 'standard', label: 'Deploy' }
        ]

      case 'intune':
        return [
          { from: 'portnox-pki', to: 'intune-main', type: 'dashed', label: 'SCEP' },
          { from: 'intune-main', to: 'windows', type: 'standard', label: 'Profile Push' },
          { from: 'intune-main', to: 'mobile', type: 'standard', label: 'Profile Push' }
        ]

      case 'policies':
        return [
          { from: 'policy-engine', to: 'user-policies', type: 'standard' },
          { from: 'policy-engine', to: 'device-policies', type: 'standard' },
          { from: 'policy-engine', to: 'network-policies', type: 'standard' }
        ]

      case 'connectivity':
        return [
          { from: 'aws-proxy', to: 'portnox-center', type: 'secure' },
          { from: 'azure-proxy', to: 'portnox-center', type: 'secure' },
          { from: 'gcp-proxy', to: 'portnox-center', type: 'secure' }
        ]

      case 'onboarding':
        return [
          { from: 'onboarding-portal', to: 'corporate-flow', type: 'standard' },
          { from: 'onboarding-portal', to: 'byod-flow', type: 'standard' },
          { from: 'onboarding-portal', to: 'iot-flow', type: 'standard' },
          { from: 'onboarding-portal', to: 'guest-flow', type: 'standard' }
        ]

      default:
        return []
    }
  }

  const getCloudColor = (provider: string): string => {
    switch (provider) {
      case 'aws': return '#fff3e0'
      case 'azure': return '#e1f5fe'
      case 'gcp': return '#e8f5e9'
      case 'onprem': return '#ffeaa7'
      default: return '#f5f5f5'
    }
  }

  const getConnectivityLabel = (type: string): string => {
    switch (type) {
      case 'sdwan': return 'SD-WAN Network'
      case 'expressroute': return 'Azure Express Route'
      case 'directconnect': return 'AWS Direct Connect'
      case 'mpls': return 'MPLS Network'
      case 'vpn': return 'Site-to-Site VPN'
      case 'internet': return 'Internet Connection'
      default: return 'Network Connection'
    }
  }

  const getConnectionType = (type: string): 'standard' | 'secure' | 'dashed' => {
    switch (type) {
      case 'sdwan': return 'dashed'
      case 'expressroute': return 'secure'
      case 'directconnect': return 'secure'
      case 'mpls': return 'dashed'
      case 'vpn': return 'secure'
      default: return 'standard'
    }
  }

  const exportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = `portnox-architecture-${view}-${Date.now()}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const exportPNG = () => {
    if (svgRef.current) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `portnox-architecture-${view}-${Date.now()}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
          }
        })
      }
      
      img.src = url
    }
  }

  const nodes = getNodes()
  const connections = getConnections()

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Animation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataFlow(!showDataFlow)}
            >
              {showDataFlow ? 'Hide' : 'Show'} Data Flow
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Animation Speed:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">{animationSpeed}x</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportPNG}>
              Export PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportSVG}>
              Export SVG
            </Button>
          </div>
        </div>

        {/* SVG Diagram */}
        <Card className="p-6">
          <CardContent className="p-0">
            <svg
              ref={svgRef}
              viewBox="0 0 1200 800"
              className="w-full h-auto border rounded-lg bg-white"
              style={{ minHeight: '600px' }}
            >
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                </pattern>
                
                {/* Connection Markers */}
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connections */}
              {connections.map((conn, index) => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                
                if (!fromNode || !toNode) return null

                const fromX = fromNode.x + fromNode.width / 2
                const fromY = fromNode.y + fromNode.height / 2
                const toX = toNode.x + toNode.width / 2
                const toY = toNode.y + toNode.height / 2

                return (
                  <g key={`connection-${index}`}>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke={conn.color || (conn.type === 'secure' ? '#22c55e' : conn.type === 'dashed' ? '#f59e0b' : '#6b7280')}
                      strokeWidth={conn.type === 'secure' ? 3 : 2}
                      strokeDasharray={conn.type === 'dashed' ? '10,5' : 'none'}
                      markerEnd="url(#arrowhead)"
                      className={showDataFlow ? 'animate-pulse' : ''}
                      style={{
                        animationDuration: `${2 / animationSpeed}s`
                      }}
                    />
                    {conn.label && (
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 10}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                        className="font-medium"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <Tooltip key={node.id}>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        rx="8"
                        fill={node.color}
                        stroke={selectedNode === node.id ? '#3b82f6' : hoveredNode === node.id ? '#6b7280' : '#d1d5db'}
                        strokeWidth={selectedNode === node.id ? 3 : 2}
                        className="transition-all duration-200"
                      />
                      
                      {/* Node Icon */}
                      <foreignObject
                        x={node.x + 10}
                        y={node.y + 10}
                        width="24"
                        height="24"
                      >
                        <div className="text-gray-600">
                          {node.icon}
                        </div>
                      </foreignObject>
                      
                      {/* Node Label */}
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="14"
                        fontWeight="600"
                        fill="#374151"
                      >
                        {node.label}
                      </text>

                      {/* Connection Points */}
                      {selectedNode === node.id && (
                        <>
                          <circle cx={node.x + node.width / 2} cy={node.y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                          <circle cx={node.x + node.width} cy={node.y + node.height / 2} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                          <circle cx={node.x + node.width / 2} cy={node.y + node.height} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                          <circle cx={node.x} cy={node.y + node.height / 2} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                        </>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-semibold">{node.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </svg>
          </CardContent>
        </Card>

        {/* Selected Node Details */}
        {selectedNode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {nodes.find(n => n.id === selectedNode)?.icon}
                <span>{nodes.find(n => n.id === selectedNode)?.label}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {nodes.find(n => n.id === selectedNode)?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Type: {nodes.find(n => n.id === selectedNode)?.type}</Badge>
                <Badge variant="outline">Interactive</Badge>
                <Badge variant="outline">Configurable</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
