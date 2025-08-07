'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Network, Shield, Key, Settings, Cloud, Smartphone, Play, Server, Database, Lock, Wifi, Router, Monitor, Globe, Zap, CheckCircle, AlertTriangle, Clock, Eye } from 'lucide-react'

interface DiagramNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  type: string
  color: string
  details: string
  ports?: string[]
  protocols?: string[]
}

interface DiagramConnection {
  from: string
  to: string
  label?: string
  type: 'standard' | 'secure' | 'data-flow'
  protocol?: string
  port?: string
}

export default function EnhancedArchitectureDiagrams() {
  const [selectedView, setSelectedView] = useState('zero-trust-overview')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showAnimations, setShowAnimations] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const architectureViews = {
    'zero-trust-overview': {
      name: 'Zero Trust NAC Overview',
      description: 'Complete end-to-end Zero Trust Network Access Control architecture',
      icon: <Shield className="h-4 w-4" />,
      nodes: [
        {
          id: 'portnox-cloud',
          x: 100, y: 100, width: 200, height: 80,
          label: 'Portnox Cloud NAC',
          type: 'cloud',
          color: '#e3f2fd',
          details: 'Cloud-native NAC engine with Private PKI, Policy Management, and Authentication Services. Handles 10M+ authentications/day with 99.9% uptime.',
          ports: ['443 (HTTPS)', '1812/1813 (RADIUS)', '2083 (RADSec)'],
          protocols: ['HTTPS', 'RADIUS', 'RADSec', 'LDAP', 'SAML']
        },
        {
          id: 'azure-ad',
          x: 100, y: 250, width: 200, height: 60,
          label: 'Azure AD/Entra ID',
          type: 'identity',
          color: '#fff3e0',
          details: 'Microsoft cloud identity provider with 50,000+ users. Provides SAML/LDAP authentication and group membership.',
          protocols: ['SAML 2.0', 'LDAP', 'OAuth 2.0', 'OpenID Connect']
        },
        {
          id: 'intune',
          x: 100, y: 350, width: 200, height: 60,
          label: 'Microsoft Intune',
          type: 'mdm',
          color: '#e8f5e9',
          details: 'Mobile Device Management for certificate deployment via SCEP. Manages 25,000+ devices across Windows, iOS, and Android.',
          protocols: ['SCEP', 'HTTPS', 'Push Notifications']
        },
        {
          id: 'radsec-proxy-1',
          x: 450, y: 150, width: 180, height: 60,
          label: 'RADSec Proxy (Primary)',
          type: 'proxy',
          color: '#fff3e0',
          details: 'AWS-hosted RADSec proxy with 7-day cache. Handles 100K+ auth/day with <50ms latency. Located in us-east-1a.',
          ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
          protocols: ['RADSec/TLS', 'RADIUS']
        },
        {
          id: 'radsec-proxy-2',
          x: 450, y: 250, width: 180, height: 60,
          label: 'RADSec Proxy (Standby)',
          type: 'proxy',
          color: '#fff3e0',
          details: 'Standby RADSec proxy for high availability. Auto-failover in <30 seconds. Located in us-east-1b.',
          ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
          protocols: ['RADSec/TLS', 'RADIUS']
        },
        {
          id: 'abm-hq',
          x: 750, y: 100, width: 150, height: 60,
          label: 'ABM HQ',
          type: 'site',
          color: '#e8f5e9',
          details: 'Global headquarters with 2,500 users. Cisco Meraki full-stack deployment with 802.1X on all ports.',
          protocols: ['802.1X', 'RADIUS', 'DHCP']
        },
        {
          id: 'data-center',
          x: 750, y: 200, width: 150, height: 60,
          label: 'Data Center',
          type: 'site',
          color: '#e8f5e9',
          details: 'Primary data center with 150 users. Critical infrastructure with 24/7 monitoring and redundant connections.',
          protocols: ['802.1X', 'RADIUS', 'SNMP']
        },
        {
          id: 'branch-office',
          x: 750, y: 300, width: 150, height: 60,
          label: 'Branch Office',
          type: 'site',
          color: '#e8f5e9',
          details: 'Remote branch office with 75 users. Meraki wireless deployment with guest portal.',
          protocols: ['802.1X', 'Captive Portal', 'RADIUS']
        },
        {
          id: 'splunk',
          x: 100, y: 450, width: 200, height: 60,
          label: 'Splunk SIEM',
          type: 'monitoring',
          color: '#f3e5f5',
          details: 'Security Information and Event Management. Ingests 1TB+ logs/day from all authentication events.',
          ports: ['514 (Syslog)', '8089 (API)'],
          protocols: ['Syslog', 'HTTPS API', 'TCP/UDP']
        }
      ],
      connections: [
        { from: 'portnox-cloud', to: 'radsec-proxy-1', type: 'secure', protocol: 'RADSec/TLS', port: '2083', label: 'Encrypted RADIUS' },
        { from: 'portnox-cloud', to: 'radsec-proxy-2', type: 'secure', protocol: 'RADSec/TLS', port: '2083', label: 'Backup Connection' },
        { from: 'radsec-proxy-1', to: 'abm-hq', type: 'standard', protocol: 'RADIUS', port: '1812', label: 'Auth Requests' },
        { from: 'radsec-proxy-1', to: 'data-center', type: 'standard', protocol: 'RADIUS', port: '1812', label: 'Auth Requests' },
        { from: 'radsec-proxy-2', to: 'branch-office', type: 'standard', protocol: 'RADIUS', port: '1812', label: 'Auth Requests' },
        { from: 'azure-ad', to: 'portnox-cloud', type: 'secure', protocol: 'SAML/LDAP', port: '443', label: 'Identity Lookup' },
        { from: 'intune', to: 'portnox-cloud', type: 'secure', protocol: 'SCEP', port: '443', label: 'Certificate Enrollment' },
        { from: 'portnox-cloud', to: 'splunk', type: 'data-flow', protocol: 'Syslog', port: '514', label: 'Auth Logs' }
      ]
    },
    'auth-flow': {
      name: '802.1X Authentication Flow',
      description: 'Step-by-step EAP-TLS certificate-based authentication process',
      icon: <Key className="h-4 w-4" />,
      nodes: [
        {
          id: 'end-device',
          x: 50, y: 200, width: 120, height: 60,
          label: 'End Device',
          type: 'device',
          color: '#e8f5e9',
          details: 'Corporate laptop with installed certificate. Supports EAP-TLS authentication with automatic reconnection.',
          protocols: ['EAP-TLS', '802.1X', 'DHCP']
        },
        {
          id: 'meraki-switch',
          x: 250, y: 200, width: 150, height: 60,
          label: 'Meraki Switch',
          type: 'network',
          color: '#e8f5e9',
          details: 'Cisco Meraki MS series switch with 802.1X port authentication. Configured for dynamic VLAN assignment.',
          ports: ['1812/1813 (RADIUS)'],
          protocols: ['802.1X', 'RADIUS', 'SNMP']
        },
        {
          id: 'radsec-proxy',
          x: 500, y: 200, width: 180, height: 60,
          label: 'RADSec Proxy',
          type: 'proxy',
          color: '#fff3e0',
          details: 'Local RADSec proxy with intelligent caching. Reduces authentication latency to <20ms.',
          ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
          protocols: ['RADSec/TLS', 'RADIUS']
        },
        {
          id: 'portnox-cloud-auth',
          x: 800, y: 200, width: 200, height: 80,
          label: 'Portnox Cloud',
          type: 'cloud',
          color: '#e3f2fd',
          details: 'Cloud NAC engine performs certificate validation, policy lookup, and VLAN assignment decision.',
          protocols: ['EAP-TLS', 'OCSP', 'LDAP', 'Policy Engine']
        },
        {
          id: 'azure-ad-auth',
          x: 800, y: 350, width: 200, height: 60,
          label: 'Azure AD',
          type: 'identity',
          color: '#fff3e0',
          details: 'Identity provider lookup for user attributes and group membership. Response time <100ms.',
          protocols: ['LDAP', 'SAML', 'Graph API']
        }
      ],
      connections: [
        { from: 'end-device', to: 'meraki-switch', type: 'standard', protocol: '802.1X', label: '1. EAP Start' },
        { from: 'meraki-switch', to: 'radsec-proxy', type: 'standard', protocol: 'RADIUS', label: '2. Access-Request' },
        { from: 'radsec-proxy', to: 'portnox-cloud-auth', type: 'secure', protocol: 'RADSec', label: '3. Encrypted Forward' },
        { from: 'portnox-cloud-auth', to: 'azure-ad-auth', type: 'secure', protocol: 'LDAP', label: '4. Identity Lookup' },
        { from: 'azure-ad-auth', to: 'portnox-cloud-auth', type: 'data-flow', protocol: 'Response', label: '5. User Attributes' },
        { from: 'portnox-cloud-auth', to: 'radsec-proxy', type: 'data-flow', protocol: 'Access-Accept', label: '6. Auth Decision' },
        { from: 'radsec-proxy', to: 'meraki-switch', type: 'data-flow', protocol: 'RADIUS', label: '7. VLAN Assignment' },
        { from: 'meraki-switch', to: 'end-device', type: 'data-flow', protocol: 'EAP-Success', label: '8. Network Access' }
      ]
    },
    'pki-infrastructure': {
      name: 'PKI Infrastructure',
      description: 'Portnox Private PKI with certificate lifecycle management',
      icon: <Lock className="h-4 w-4" />,
      nodes: [
        {
          id: 'portnox-pki-ca',
          x: 400, y: 50, width: 200, height: 80,
          label: 'Portnox PKI CA',
          type: 'pki',
          color: '#e3f2fd',
          details: 'Private Certificate Authority with HSM-backed root key. Issues 10,000+ certificates with 2-year validity.',
          protocols: ['X.509', 'PKCS#10', 'CMP']
        },
        {
          id: 'scep-server',
          x: 200, y: 200, width: 150, height: 60,
          label: 'SCEP Server',
          type: 'cert',
          color: '#e3f2fd',
          details: 'Simple Certificate Enrollment Protocol server for automated certificate issuance via MDM.',
          ports: ['443 (HTTPS)'],
          protocols: ['SCEP', 'HTTPS']
        },
        {
          id: 'ocsp-responder',
          x: 450, y: 200, width: 150, height: 60,
          label: 'OCSP Responder',
          type: 'cert',
          color: '#e3f2fd',
          details: 'Online Certificate Status Protocol for real-time certificate validation. 99.9% availability.',
          ports: ['80 (HTTP)', '443 (HTTPS)'],
          protocols: ['OCSP', 'HTTP/HTTPS']
        },
        {
          id: 'crl-cdp',
          x: 700, y: 200, width: 150, height: 60,
          label: 'CRL/CDP',
          type: 'cert',
          color: '#e3f2fd',
          details: 'Certificate Revocation List and Distribution Point. Updated every 24 hours with revoked certificates.',
          protocols: ['HTTP', 'LDAP']
        },
        {
          id: 'intune-mdm',
          x: 200, y: 350, width: 150, height: 60,
          label: 'Intune MDM',
          type: 'mdm',
          color: '#fff3e0',
          details: 'Microsoft Intune for certificate deployment to managed devices. Supports Windows, iOS, Android.',
          protocols: ['SCEP', 'HTTPS', 'Push Notifications']
        },
        {
          id: 'end-device-pki',
          x: 450, y: 350, width: 150, height: 60,
          label: 'End Device',
          type: 'device',
          color: '#e8f5e9',
          details: 'Corporate device with installed certificate in local certificate store. Auto-renewal enabled.',
          protocols: ['EAP-TLS', 'SCEP']
        },
        {
          id: 'nas-switch',
          x: 700, y: 350, width: 150, height: 60,
          label: 'NAS/Switch',
          type: 'network',
          color: '#e8f5e9',
          details: 'Network Access Server performing 802.1X authentication with certificate validation.',
          protocols: ['802.1X', 'RADIUS', 'EAP-TLS']
        }
      ],
      connections: [
        { from: 'portnox-pki-ca', to: 'scep-server', type: 'secure', protocol: 'Certificate Issuance', label: 'Issue Cert' },
        { from: 'portnox-pki-ca', to: 'ocsp-responder', type: 'secure', protocol: 'Status Updates', label: 'Cert Status' },
        { from: 'portnox-pki-ca', to: 'crl-cdp', type: 'secure', protocol: 'CRL Updates', label: 'Revocation List' },
        { from: 'scep-server', to: 'intune-mdm', type: 'secure', protocol: 'SCEP', label: 'Enrollment' },
        { from: 'intune-mdm', to: 'end-device-pki', type: 'secure', protocol: 'Certificate Deploy', label: 'Install Cert' },
        { from: 'end-device-pki', to: 'nas-switch', type: 'secure', protocol: 'EAP-TLS', label: 'Auth with Cert' },
        { from: 'nas-switch', to: 'ocsp-responder', type: 'standard', protocol: 'OCSP', label: 'Validate Cert' }
      ]
    }
  }

  const currentView = architectureViews[selectedView as keyof typeof architectureViews]

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    setSelectedNode(nodeId)
    const node = currentView.nodes.find(n => n.id === nodeId)
    if (node && tooltipRef.current) {
      tooltipRef.current.style.left = `${event.pageX + 10}px`
      tooltipRef.current.style.top = `${event.pageY + 10}px`
      tooltipRef.current.classList.add('active')
      
      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.classList.remove('active')
        }
      }, 5000)
    }
  }

  const createSVGNode = (node: DiagramNode) => {
    const isSelected = selectedNode === node.id
    return (
      <g 
        key={node.id} 
        className="diagram-node" 
        onClick={(e) => handleNodeClick(node.id, e as any)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          rx={8}
          fill={node.color}
          stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-all duration-300"
        />
        <text
          x={node.x + node.width / 2}
          y={node.y + node.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="diagram-label"
          fontSize="14"
          fontWeight="600"
        >
          {node.label}
        </text>
        {node.type === 'cloud' && (
          <Cloud 
            className="absolute" 
            style={{ 
              left: node.x + 10, 
              top: node.y + 10,
              width: 20,
              height: 20,
              fill: 'hsl(var(--primary))'
            }} 
          />
        )}
      </g>
    )
  }

  const createSVGConnection = (connection: DiagramConnection, index: number) => {
    const fromNode = currentView.nodes.find(n => n.id === connection.from)
    const toNode = currentView.nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const x1 = fromNode.x + fromNode.width
    const y1 = fromNode.y + fromNode.height / 2
    const x2 = toNode.x
    const y2 = toNode.y + toNode.height / 2

    const strokeColor = connection.type === 'secure' ? 'hsl(var(--chart-2))' : 
                       connection.type === 'data-flow' ? 'hsl(var(--chart-1))' : 
                       'hsl(var(--primary))'
    
    const strokeWidth = connection.type === 'secure' ? 3 : 2
    const strokeDasharray = connection.type === 'secure' ? '5,5' : 'none'

    return (
      <g key={`connection-${index}`}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className={showAnimations ? 'diagram-connection' : ''}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: `${2 / animationSpeed}s`
          }}
        />
        <defs>
          <marker
            id={`arrowhead-${index}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={strokeColor}
            />
          </marker>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth="1"
          markerEnd={`url(#arrowhead-${index})`}
        />
        {connection.label && (
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 - 10}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
            fontSize="12"
          >
            {connection.label}
          </text>
        )}
        {connection.protocol && (
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 + 5}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
            fontSize="10"
          >
            {connection.protocol} {connection.port && `(${connection.port})`}
          </text>
        )}
      </g>
    )
  }

  const selectedNodeDetails = selectedNode ? 
    currentView.nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Enhanced Architecture Diagrams</span>
          </CardTitle>
          <CardDescription>
            Interactive technical architecture diagrams with detailed component information and data flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="zero-trust-overview" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Zero Trust Overview</span>
              </TabsTrigger>
              <TabsTrigger value="auth-flow" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Authentication Flow</span>
              </TabsTrigger>
              <TabsTrigger value="pki-infrastructure" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>PKI Infrastructure</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={showAnimations ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAnimations(!showAnimations)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {showAnimations ? 'Animations On' : 'Animations Off'}
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
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {currentView.nodes.length} Components
                </Badge>
                <Badge variant="outline">
                  {currentView.connections.length} Connections
                </Badge>
              </div>
            </div>

            <TabsContent value={selectedView} className="space-y-4">
              <div className="architecture-container">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    {currentView.icon}
                    <span>{currentView.name}</span>
                  </h3>
                  <p className="text-muted-foreground">{currentView.description}</p>
                </div>

                <div className="relative">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 1200 600"
                    className="w-full h-auto border border-border rounded-lg bg-background"
                    style={{ minHeight: '400px' }}
                  >
                    {/* Render connections first (behind nodes) */}
                    {currentView.connections.map((connection, index) => 
                      createSVGConnection(connection, index)
                    )}
                    
                    {/* Render nodes */}
                    {currentView.nodes.map(node => createSVGNode(node))}
                  </svg>

                  {/* Tooltip */}
                  <div
                    ref={tooltipRef}
                    className="diagram-tooltip"
                  >
                    {selectedNodeDetails && (
                      <div>
                        <div className="font-semibold text-base mb-2">
                          {selectedNodeDetails.label}
                        </div>
                        <div className="text-sm mb-3">
                          {selectedNodeDetails.details}
                        </div>
                        {selectedNodeDetails.protocols && (
                          <div className="mb-2">
                            <div className="font-medium text-xs mb-1">Protocols:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedNodeDetails.protocols.map((protocol, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {protocol}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedNodeDetails.ports && (
                          <div>
                            <div className="font-medium text-xs mb-1">Ports:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedNodeDetails.ports.map((port, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {port}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Connection Types</h4>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-0.5 bg-primary"></div>
                      <span className="text-sm">Standard Connection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-0.5 bg-chart-2" style={{ borderTop: '2px dashed' }}></div>
                      <span className="text-sm">Secure/Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-0.5 bg-chart-1"></div>
                      <span className="text-sm">Data Flow</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Technical Details Card */}
      {selectedNodeDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Component Details: {selectedNodeDetails.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNodeDetails.details}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Technical Specifications</h4>
                <div className="space-y-2">
                  {selectedNodeDetails.protocols && (
                    <div>
                      <span className="text-sm font-medium">Protocols: </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedNodeDetails.protocols.join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedNodeDetails.ports && (
                    <div>
                      <span className="text-sm font-medium">Ports: </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedNodeDetails.ports.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
