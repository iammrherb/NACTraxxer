'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DiagramNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  type: 'cloud' | 'server' | 'device' | 'network' | 'security' | 'identity' | 'storage'
  color: string
  details?: string
  ports?: string[]
  protocols?: string[]
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  type: 'secure' | 'standard' | 'data-flow'
  label?: string
  protocol?: string
  port?: string
  animated?: boolean
}

export default function EnhancedArchitectureDiagrams() {
  const [selectedView, setSelectedView] = useState('zero-trust-overview')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showDataFlow, setShowDataFlow] = useState(true)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Zero Trust NAC Architecture nodes
  const zeroTrustNodes: DiagramNode[] = [
    {
      id: 'portnox-cloud',
      x: 100, y: 100, width: 200, height: 80,
      label: 'Portnox Cloud NAC',
      type: 'cloud',
      color: '#e3f2fd',
      details: 'Cloud-native NAC platform with Private PKI, Policy Engine, and Authentication Services',
      ports: ['443 (HTTPS)', '1812/1813 (RADIUS)'],
      protocols: ['HTTPS', 'RADIUS', 'RADSec', 'LDAP', 'SAML']
    },
    {
      id: 'azure-ad',
      x: 100, y: 220, width: 180, height: 60,
      label: 'Azure AD / Entra ID',
      type: 'identity',
      color: '#fff3e0',
      details: 'Identity provider for user authentication and group membership',
      ports: ['443 (HTTPS)', '636 (LDAPS)'],
      protocols: ['SAML 2.0', 'OAuth 2.0', 'LDAP', 'SCIM']
    },
    {
      id: 'intune',
      x: 100, y: 320, width: 180, height: 60,
      label: 'Microsoft Intune',
      type: 'device',
      color: '#e8f5e9',
      details: 'Mobile Device Management for certificate deployment',
      ports: ['443 (HTTPS)', '80 (SCEP)'],
      protocols: ['SCEP', 'HTTPS', 'OMA-DM']
    },
    {
      id: 'radsec-proxy-1',
      x: 400, y: 80, width: 160, height: 60,
      label: 'RADSec Proxy (Primary)',
      type: 'server',
      color: '#fff3e0',
      details: 'High-availability RADIUS proxy with 7-day cache',
      ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
      protocols: ['RADSec/TLS', 'RADIUS']
    },
    {
      id: 'radsec-proxy-2',
      x: 400, y: 160, width: 160, height: 60,
      label: 'RADSec Proxy (Standby)',
      type: 'server',
      color: '#fff3e0',
      details: 'Standby RADIUS proxy for failover',
      ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
      protocols: ['RADSec/TLS', 'RADIUS']
    },
    {
      id: 'meraki-switch',
      x: 650, y: 100, width: 150, height: 60,
      label: 'Meraki Switch',
      type: 'network',
      color: '#e8f5e9',
      details: 'Cisco Meraki MS series with 802.1X support',
      ports: ['1812/1813 (RADIUS)', '22 (SSH)', '443 (HTTPS)'],
      protocols: ['802.1X', 'RADIUS', 'SNMP']
    },
    {
      id: 'meraki-ap',
      x: 650, y: 180, width: 150, height: 60,
      label: 'Meraki Wireless AP',
      type: 'network',
      color: '#e8f5e9',
      details: 'Cisco Meraki MR series with WPA2/3-Enterprise',
      ports: ['1812/1813 (RADIUS)', '443 (HTTPS)'],
      protocols: ['802.11', '802.1X', 'WPA2/3-Enterprise']
    },
    {
      id: 'end-device',
      x: 850, y: 140, width: 120, height: 60,
      label: 'End Device',
      type: 'device',
      color: '#f3e5f5',
      details: 'Corporate device with X.509 certificate',
      ports: ['Dynamic (802.1X)'],
      protocols: ['EAP-TLS', '802.1X']
    },
    {
      id: 'splunk',
      x: 400, y: 280, width: 160, height: 60,
      label: 'Splunk SIEM',
      type: 'security',
      color: '#fce4ec',
      details: 'Security monitoring and log analysis',
      ports: ['514 (Syslog)', '8089 (API)', '8000 (Web)'],
      protocols: ['Syslog', 'HTTPS', 'REST API']
    }
  ]

  // Zero Trust connections
  const zeroTrustConnections: DiagramConnection[] = [
    {
      id: 'portnox-azure',
      from: 'portnox-cloud',
      to: 'azure-ad',
      type: 'secure',
      label: 'LDAP/SAML Auth',
      protocol: 'LDAPS',
      port: '636',
      animated: true
    },
    {
      id: 'portnox-intune',
      from: 'portnox-cloud',
      to: 'intune',
      type: 'secure',
      label: 'SCEP Certificate',
      protocol: 'SCEP',
      port: '80',
      animated: true
    },
    {
      id: 'portnox-radsec1',
      from: 'portnox-cloud',
      to: 'radsec-proxy-1',
      type: 'secure',
      label: 'RADSec/TLS',
      protocol: 'RADSec',
      port: '2083',
      animated: true
    },
    {
      id: 'portnox-radsec2',
      from: 'portnox-cloud',
      to: 'radsec-proxy-2',
      type: 'secure',
      label: 'RADSec/TLS',
      protocol: 'RADSec',
      port: '2083',
      animated: true
    },
    {
      id: 'radsec1-switch',
      from: 'radsec-proxy-1',
      to: 'meraki-switch',
      type: 'standard',
      label: 'RADIUS',
      protocol: 'RADIUS',
      port: '1812',
      animated: true
    },
    {
      id: 'radsec1-ap',
      from: 'radsec-proxy-1',
      to: 'meraki-ap',
      type: 'standard',
      label: 'RADIUS',
      protocol: 'RADIUS',
      port: '1812',
      animated: true
    },
    {
      id: 'switch-device',
      from: 'meraki-switch',
      to: 'end-device',
      type: 'data-flow',
      label: '802.1X Auth',
      protocol: 'EAP-TLS',
      animated: true
    },
    {
      id: 'ap-device',
      from: 'meraki-ap',
      to: 'end-device',
      type: 'data-flow',
      label: 'WPA2-Enterprise',
      protocol: 'EAP-TLS',
      animated: true
    },
    {
      id: 'radsec1-splunk',
      from: 'radsec-proxy-1',
      to: 'splunk',
      type: 'standard',
      label: 'Auth Logs',
      protocol: 'Syslog',
      port: '514'
    }
  ]

  // 802.1X Authentication Flow nodes
  const authFlowNodes: DiagramNode[] = [
    {
      id: 'device-auth',
      x: 50, y: 200, width: 120, height: 60,
      label: 'End Device',
      type: 'device',
      color: '#f3e5f5',
      details: 'Device with X.509 certificate initiates authentication'
    },
    {
      id: 'switch-auth',
      x: 250, y: 200, width: 150, height: 60,
      label: 'Network Switch',
      type: 'network',
      color: '#e8f5e9',
      details: 'Authenticator - validates device credentials'
    },
    {
      id: 'proxy-auth',
      x: 480, y: 200, width: 160, height: 60,
      label: 'RADSec Proxy',
      type: 'server',
      color: '#fff3e0',
      details: 'Forwards RADIUS over secure TLS tunnel'
    },
    {
      id: 'portnox-auth',
      x: 720, y: 200, width: 180, height: 60,
      label: 'Portnox Cloud',
      type: 'cloud',
      color: '#e3f2fd',
      details: 'Authentication server with policy engine'
    },
    {
      id: 'identity-auth',
      x: 720, y: 320, width: 180, height: 60,
      label: 'Identity Provider',
      type: 'identity',
      color: '#fff3e0',
      details: 'Validates user/device identity and group membership'
    }
  ]

  // PKI Infrastructure nodes
  const pkiNodes: DiagramNode[] = [
    {
      id: 'pki-ca',
      x: 400, y: 50, width: 200, height: 80,
      label: 'Portnox Private PKI',
      type: 'security',
      color: '#e3f2fd',
      details: 'Root Certificate Authority with automated certificate lifecycle',
      protocols: ['X.509', 'PKCS#10', 'PKCS#12']
    },
    {
      id: 'scep-server',
      x: 200, y: 180, width: 150, height: 60,
      label: 'SCEP Server',
      type: 'server',
      color: '#e3f2fd',
      details: 'Simple Certificate Enrollment Protocol endpoint',
      ports: ['80 (HTTP)', '443 (HTTPS)'],
      protocols: ['SCEP', 'HTTP/HTTPS']
    },
    {
      id: 'ocsp-responder',
      x: 400, y: 180, width: 150, height: 60,
      label: 'OCSP Responder',
      type: 'server',
      color: '#e3f2fd',
      details: 'Online Certificate Status Protocol for real-time validation',
      ports: ['80 (HTTP)', '443 (HTTPS)'],
      protocols: ['OCSP', 'HTTP/HTTPS']
    },
    {
      id: 'crl-cdp',
      x: 600, y: 180, width: 150, height: 60,
      label: 'CRL Distribution',
      type: 'server',
      color: '#e3f2fd',
      details: 'Certificate Revocation List distribution point',
      ports: ['80 (HTTP)', '443 (HTTPS)'],
      protocols: ['HTTP/HTTPS', 'LDAP']
    },
    {
      id: 'intune-mdm',
      x: 200, y: 320, width: 150, height: 60,
      label: 'Intune MDM',
      type: 'device',
      color: '#e8f5e9',
      details: 'Mobile Device Management for certificate deployment'
    },
    {
      id: 'client-device',
      x: 400, y: 320, width: 150, height: 60,
      label: 'Client Device',
      type: 'device',
      color: '#f3e5f5',
      details: 'End device with certificate store'
    },
    {
      id: 'network-device',
      x: 600, y: 320, width: 150, height: 60,
      label: 'Network Device',
      type: 'network',
      color: '#e8f5e9',
      details: 'Switch/AP performing certificate validation'
    }
  ]

  const renderNode = (node: DiagramNode, isSelected: boolean = false) => {
    const nodeClass = `diagram-node ${isSelected ? 'selected' : ''} ${node.type === 'security' ? 'pki-node' : ''}`
    
    return (
      <g
        key={node.id}
        className={nodeClass}
        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          rx={8}
          fill={node.color}
          stroke={isSelected ? '#3b82f6' : '#666'}
          strokeWidth={isSelected ? 3 : 2}
          filter={isSelected ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'}
        />
        <text
          x={node.x + node.width / 2}
          y={node.y + node.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="600"
          fill="#333"
        >
          {node.label}
        </text>
        {node.ports && isSelected && (
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height + 20}
            textAnchor="middle"
            fontSize="10"
            fill="#666"
          >
            {node.ports.join(', ')}
          </text>
        )}
      </g>
    )
  }

  const renderConnection = (connection: DiagramConnection, fromNode: DiagramNode, toNode: DiagramNode) => {
    const fromX = fromNode.x + fromNode.width / 2
    const fromY = fromNode.y + fromNode.height / 2
    const toX = toNode.x + toNode.width / 2
    const toY = toNode.y + toNode.height / 2

    const strokeColor = connection.type === 'secure' ? '#4caf50' : 
                       connection.type === 'data-flow' ? '#ff9800' : '#666'
    const strokeWidth = connection.type === 'secure' ? 3 : 2
    const strokeDasharray = connection.type === 'secure' ? '5,5' : 'none'

    return (
      <g key={connection.id}>
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className={connection.animated && showDataFlow ? 'diagram-connection animated' : 'diagram-connection'}
          markerEnd="url(#arrowhead)"
        />
        {connection.label && (
          <text
            x={(fromX + toX) / 2}
            y={(fromY + toY) / 2 - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#666"
            fontWeight="500"
          >
            {connection.label}
          </text>
        )}
        {connection.protocol && (
          <text
            x={(fromX + toX) / 2}
            y={(fromY + toY) / 2 + 5}
            textAnchor="middle"
            fontSize="9"
            fill="#999"
          >
            {connection.protocol} {connection.port && `(${connection.port})`}
          </text>
        )}
      </g>
    )
  }

  const renderDiagram = () => {
    let nodes: DiagramNode[] = []
    let connections: DiagramConnection[] = []

    switch (selectedView) {
      case 'zero-trust-overview':
        nodes = zeroTrustNodes
        connections = zeroTrustConnections
        break
      case 'auth-flow':
        nodes = authFlowNodes
        connections = []
        break
      case 'pki-infrastructure':
        nodes = pkiNodes
        connections = []
        break
      default:
        nodes = zeroTrustNodes
        connections = zeroTrustConnections
    }

    return (
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 1000 400"
        className="border rounded-lg bg-gray-50 dark:bg-gray-900"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#666"
            />
          </marker>
        </defs>
        
        {connections.map(connection => {
          const fromNode = nodes.find(n => n.id === connection.from)
          const toNode = nodes.find(n => n.id === connection.to)
          if (fromNode && toNode) {
            return renderConnection(connection, fromNode, toNode)
          }
          return null
        })}
        
        {nodes.map(node => renderNode(node, selectedNode === node.id))}
      </svg>
    )
  }

  const selectedNodeDetails = selectedNode ? 
    [...zeroTrustNodes, ...authFlowNodes, ...pkiNodes].find(n => n.id === selectedNode) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Enhanced Architecture Diagrams
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showDataFlow}
                  onCheckedChange={setShowDataFlow}
                />
                <span className="text-sm">Data Flow</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showPerformanceMetrics}
                  onCheckedChange={setShowPerformanceMetrics}
                />
                <span className="text-sm">Metrics</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="zero-trust-overview">Zero Trust NAC</TabsTrigger>
              <TabsTrigger value="auth-flow">802.1X Flow</TabsTrigger>
              <TabsTrigger value="pki-infrastructure">PKI Infrastructure</TabsTrigger>
              <TabsTrigger value="policy-framework">Policy Framework</TabsTrigger>
              <TabsTrigger value="multi-cloud">Multi-Cloud</TabsTrigger>
              <TabsTrigger value="intune-integration">Intune Integration</TabsTrigger>
              <TabsTrigger value="device-onboarding">Device Onboarding</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {renderDiagram()}
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Animation Speed:</span>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  max={3}
                  min={0.5}
                  step={0.5}
                  className="w-32"
                />
                <span className="text-sm">{animationSpeed[0]}x</span>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {selectedNodeDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedNodeDetails.label}</span>
              <Badge variant="outline">{selectedNodeDetails.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedNodeDetails.details}
              </p>
              
              {selectedNodeDetails.ports && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Ports:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeDetails.ports.map((port, index) => (
                      <Badge key={index} variant="secondary">{port}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedNodeDetails.protocols && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Protocols:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeDetails.protocols.map((protocol, index) => (
                      <Badge key={index} variant="outline">{protocol}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="text-sm">Cloud Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
              <span className="text-sm">Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-sm">Network Devices</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
              <span className="text-sm">End Devices</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg width="20" height="4">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#4caf50" strokeWidth="2" strokeDasharray="3,3" />
              </svg>
              <span className="text-sm">Secure Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg width="20" height="4">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#666" strokeWidth="2" />
              </svg>
              <span className="text-sm">Standard Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg width="20" height="4">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#ff9800" strokeWidth="2" />
              </svg>
              <span className="text-sm">Data Flow</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
