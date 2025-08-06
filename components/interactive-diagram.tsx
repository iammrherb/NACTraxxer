'use client'

import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
  showDataFlow: boolean
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
  description: string
  icon?: string
  status?: 'active' | 'standby' | 'offline'
  ports?: string
  latency?: string
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  type: 'standard' | 'secure' | 'dashed'
  label?: string
  color?: string
  protocol?: string
  bandwidth?: string
}

export default function InteractiveDiagram({ 
  view, 
  cloudProvider, 
  networkVendor, 
  connectivityType, 
  animationSpeed,
  showDataFlow
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [connections, setConnections] = useState<DiagramConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    generateDiagram()
  }, [view, cloudProvider, networkVendor, connectivityType])

  const generateDiagram = () => {
    let newNodes: DiagramNode[] = []
    let newConnections: DiagramConnection[] = []

    switch (view) {
      case 'complete':
        newNodes = generateCompleteArchitecture()
        newConnections = generateCompleteConnections()
        break
      case 'auth-flow':
        newNodes = generateAuthFlowNodes()
        newConnections = generateAuthFlowConnections()
        break
      case 'pki':
        newNodes = generatePKINodes()
        newConnections = generatePKIConnections()
        break
      case 'radsec-proxy':
        newNodes = generateRADSecProxyNodes()
        newConnections = generateRADSecProxyConnections()
        break
      case 'policies':
        newNodes = generatePolicyNodes()
        newConnections = generatePolicyConnections()
        break
      case 'connectivity':
        newNodes = generateConnectivityNodes()
        newConnections = generateConnectivityConnections()
        break
      case 'intune':
        newNodes = generateIntuneNodes()
        newConnections = generateIntuneConnections()
        break
      case 'onboarding':
        newNodes = generateOnboardingNodes()
        newConnections = generateOnboardingConnections()
        break
    }

    setNodes(newNodes)
    setConnections(newConnections)
  }

  const generateCompleteArchitecture = (): DiagramNode[] => {
    const cloudColor = getCloudColor(cloudProvider)
    const vendorLabel = networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)
    
    return [
      {
        id: 'portnox-cloud',
        x: 450, y: 50, width: 300, height: 120,
        label: 'Portnox Cloud NAC',
        type: 'cloud',
        color: '#e3f2fd',
        icon: '☁️',
        description: 'Cloud-based NAC engine with Private PKI, policy management, and RADIUS authentication services',
        ports: 'HTTPS: 443, RADSec: 2083',
        latency: '< 50ms global'
      },
      {
        id: 'cloud-proxy-primary',
        x: 100, y: 250, width: 180, height: 100,
        label: `${cloudProvider.toUpperCase()} RADSec Proxy (Primary)`,
        type: cloudProvider,
        color: cloudColor,
        icon: '🔄',
        status: 'active',
        description: `Primary ${cloudProvider.toUpperCase()} RADSec proxy with 7-day authentication cache`,
        ports: 'RADSec: 2083, RADIUS: 1812/1813',
        latency: '< 10ms regional'
      },
      {
        id: 'cloud-proxy-standby',
        x: 320, y: 250, width: 180, height: 100,
        label: `${cloudProvider.toUpperCase()} RADSec Proxy (Standby)`,
        type: cloudProvider,
        color: cloudColor,
        icon: '🔄',
        status: 'standby',
        description: `Standby ${cloudProvider.toUpperCase()} RADSec proxy for high availability`,
        ports: 'RADSec: 2083, RADIUS: 1812/1813',
        latency: '< 10ms regional'
      },
      {
        id: 'connectivity',
        x: 100, y: 400, width: 400, height: 60,
        label: getConnectivityLabel(connectivityType),
        type: 'connectivity',
        color: '#f3e5f5',
        icon: '🌐',
        description: `${getConnectivityLabel(connectivityType)} network connectivity with redundancy and failover`,
        ports: getConnectivityPorts(connectivityType)
      },
      {
        id: 'site-infrastructure',
        x: 100, y: 520, width: 400, height: 120,
        label: `ABM Site - ${vendorLabel} Stack`,
        type: 'site',
        color: '#e8f5e9',
        icon: '🏢',
        description: `Physical location with ${vendorLabel} network infrastructure including switches, wireless controllers, and firewalls`,
        ports: '802.1X, RADIUS, SNMP'
      },
      {
        id: 'intune',
        x: 800, y: 250, width: 300, height: 150,
        label: 'Microsoft Intune MDM',
        type: 'intune',
        color: '#e1f5fe',
        icon: '📱',
        description: 'Mobile Device Management solution for certificate deployment, device configuration management, and compliance enforcement',
        ports: 'HTTPS: 443, SCEP: 80/443'
      },
      {
        id: 'endpoints',
        x: 800, y: 450, width: 300, height: 200,
        label: 'Managed Endpoints',
        type: 'device',
        color: '#f5f5f5',
        icon: '💻',
        description: 'Corporate devices with certificates deployed via Intune including Windows, macOS, iOS, and Android devices',
        ports: '802.1X EAP-TLS, HTTPS'
      }
    ]
  }

  const generateCompleteConnections = (): DiagramConnection[] => {
    return [
      { 
        id: 'cloud-to-primary', 
        from: 'portnox-cloud', 
        to: 'cloud-proxy-primary', 
        type: 'secure', 
        label: 'RADSec/TLS 1.3',
        protocol: 'RADSec',
        bandwidth: '1 Gbps'
      },
      { 
        id: 'cloud-to-standby', 
        from: 'portnox-cloud', 
        to: 'cloud-proxy-standby', 
        type: 'secure', 
        label: 'RADSec/TLS 1.3',
        protocol: 'RADSec',
        bandwidth: '1 Gbps'
      },
      { 
        id: 'primary-to-connectivity', 
        from: 'cloud-proxy-primary', 
        to: 'connectivity', 
        type: 'standard',
        protocol: 'RADIUS',
        bandwidth: '100 Mbps'
      },
      { 
        id: 'standby-to-connectivity', 
        from: 'cloud-proxy-standby', 
        to: 'connectivity', 
        type: 'dashed',
        protocol: 'RADIUS',
        bandwidth: '100 Mbps'
      },
      { 
        id: 'connectivity-to-site', 
        from: 'connectivity', 
        to: 'site-infrastructure', 
        type: getConnectivityType(connectivityType),
        protocol: getConnectivityProtocol(connectivityType),
        bandwidth: getConnectivityBandwidth(connectivityType)
      },
      { 
        id: 'site-to-endpoints', 
        from: 'site-infrastructure', 
        to: 'endpoints', 
        type: 'standard', 
        label: '802.1X EAP-TLS',
        protocol: '802.1X',
        bandwidth: '1 Gbps'
      },
      { 
        id: 'intune-to-endpoints', 
        from: 'intune', 
        to: 'endpoints', 
        type: 'secure', 
        label: 'Certificate Push',
        protocol: 'HTTPS',
        bandwidth: '10 Mbps'
      },
      { 
        id: 'cloud-to-intune', 
        from: 'portnox-cloud', 
        to: 'intune', 
        type: 'dashed', 
        label: 'SCEP',
        protocol: 'SCEP',
        bandwidth: '1 Mbps'
      }
    ]
  }

  const generateAuthFlowNodes = (): DiagramNode[] => {
    return [
      {
        id: 'device',
        x: 50, y: 300, width: 120, height: 80,
        label: 'End Device',
        type: 'device',
        color: '#e8f5e9',
        icon: '💻',
        description: 'User device with EAP-TLS certificate attempting network access',
        ports: '802.1X Supplicant'
      },
      {
        id: 'nas',
        x: 250, y: 300, width: 150, height: 80,
        label: `${networkVendor.toUpperCase()} NAS`,
        type: 'network',
        color: '#e8f5e9',
        icon: '🔧',
        description: 'Network Access Server (Switch/AP) acting as 802.1X Authenticator',
        ports: 'RADIUS: 1812/1813'
      },
      {
        id: 'proxy',
        x: 500, y: 300, width: 180, height: 80,
        label: `RADSec Proxy (${cloudProvider.toUpperCase()})`,
        type: cloudProvider,
        color: getCloudColor(cloudProvider),
        icon: '🔄',
        description: 'RADIUS over TLS proxy with 7-day authentication cache for offline support',
        ports: 'RADSec: 2083'
      },
      {
        id: 'portnox',
        x: 800, y: 300, width: 200, height: 100,
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        icon: '☁️',
        description: 'Cloud NAC authentication engine with policy evaluation and certificate validation',
        ports: 'HTTPS: 443, OCSP: 80'
      },
      {
        id: 'identity',
        x: 800, y: 450, width: 200, height: 80,
        label: 'Azure AD/Entra ID',
        type: 'identity',
        color: '#e3f2fd',
        icon: '🔐',
        description: 'Identity provider for user authentication and group membership validation',
        ports: 'LDAPS: 636, HTTPS: 443'
      }
    ]
  }

  const generateAuthFlowConnections = (): DiagramConnection[] => {
    return [
      { id: 'device-to-nas', from: 'device', to: 'nas', type: 'standard', label: '1. EAP-Start' },
      { id: 'nas-to-proxy', from: 'nas', to: 'proxy', type: 'standard', label: '2. Access-Request' },
      { id: 'proxy-to-portnox', from: 'proxy', to: 'portnox', type: 'secure', label: '3. RADSec' },
      { id: 'portnox-to-identity', from: 'portnox', to: 'identity', type: 'standard', label: '4. LDAP Query' },
      { id: 'identity-to-portnox', from: 'identity', to: 'portnox', type: 'standard', label: '5. User Info' },
      { id: 'portnox-to-proxy-return', from: 'portnox', to: 'proxy', type: 'secure', label: '6. Access-Accept' },
      { id: 'proxy-to-nas-return', from: 'proxy', to: 'nas', type: 'standard', label: '7. VLAN Assignment' },
      { id: 'nas-to-device-return', from: 'nas', to: 'device', type: 'standard', label: '8. EAP-Success' }
    ]
  }

  const generatePKINodes = (): DiagramNode[] => {
    return [
      {
        id: 'pki-ca',
        x: 400, y: 50, width: 200, height: 80,
        label: 'Portnox Private CA',
        type: 'pki',
        color: '#e3f2fd',
        icon: '🔐',
        description: 'Private Certificate Authority for issuing X.509 certificates with RSA 2048-bit keys and SHA-256 signatures',
        ports: 'HTTPS: 443'
      },
      {
        id: 'scep',
        x: 200, y: 200, width: 150, height: 60,
        label: 'SCEP Server',
        type: 'cert',
        color: '#e3f2fd',
        icon: '📜',
        description: 'Simple Certificate Enrollment Protocol server for automated certificate enrollment',
        ports: 'HTTP: 80, HTTPS: 443'
      },
      {
        id: 'ocsp',
        x: 450, y: 200, width: 150, height: 60,
        label: 'OCSP Responder',
        type: 'cert',
        color: '#e3f2fd',
        icon: '✅',
        description: 'Online Certificate Status Protocol responder for real-time certificate validation',
        ports: 'HTTP: 80, HTTPS: 443'
      },
      {
        id: 'cdp',
        x: 700, y: 200, width: 150, height: 60,
        label: 'CRL/CDP',
        type: 'cert',
        color: '#e3f2fd',
        icon: '📋',
        description: 'Certificate Revocation List and Distribution Point for certificate status updates',
        ports: 'HTTP: 80, HTTPS: 443'
      },
      {
        id: 'intune-mdm',
        x: 200, y: 350, width: 150, height: 60,
        label: 'Intune MDM',
        type: 'mdm',
        color: '#fff3e0',
        icon: '📱',
        description: 'Mobile Device Management for certificate deployment with SCEP profiles',
        ports: 'HTTPS: 443'
      },
      {
        id: 'end-device',
        x: 450, y: 350, width: 150, height: 60,
        label: 'End Device',
        type: 'device',
        color: '#e8f5e9',
        icon: '💻',
        description: 'Device receiving certificates with automatic renewal 30 days before expiry',
        ports: 'HTTPS: 443'
      },
      {
        id: 'network-device',
        x: 700, y: 350, width: 150, height: 60,
        label: 'Network Device',
        type: 'network',
        color: '#e8f5e9',
        icon: '🔧',
        description: 'Network infrastructure validating certificates during 802.1X authentication',
        ports: 'OCSP: 80, RADIUS: 1812'
      }
    ]
  }

  const generatePKIConnections = (): DiagramConnection[] => {
    return [
      { id: 'ca-to-scep', from: 'pki-ca', to: 'scep', type: 'standard', label: 'Issue Cert' },
      { id: 'ca-to-ocsp', from: 'pki-ca', to: 'ocsp', type: 'standard', label: 'Status Update' },
      { id: 'ca-to-cdp', from: 'pki-ca', to: 'cdp', type: 'standard', label: 'CRL Update' },
      { id: 'scep-to-intune', from: 'scep', to: 'intune-mdm', type: 'dashed', label: 'SCEP Profile' },
      { id: 'intune-to-device', from: 'intune-mdm', to: 'end-device', type: 'secure', label: 'Deploy Cert' },
      { id: 'device-to-network', from: 'end-device', to: 'network-device', type: 'standard', label: '802.1X Auth' },
      { id: 'network-to-ocsp', from: 'network-device', to: 'ocsp', type: 'dashed', label: 'Verify Status' }
    ]
  }

  const generateRADSecProxyNodes = (): DiagramNode[] => {
    const cloudColor = getCloudColor(cloudProvider)
    
    return [
      {
        id: 'portnox-cloud',
        x: 50, y: 300, width: 200, height: 100,
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        icon: '☁️',
        description: 'Cloud NAC service with global load balancing and regional failover',
        ports: 'HTTPS: 443, RADSec: 2083'
      },
      {
        id: 'load-balancer',
        x: 350, y: 50, width: 200, height: 80,
        label: `${cloudProvider.toUpperCase()} Load Balancer`,
        type: 'load-balancer',
        color: cloudColor,
        icon: '⚖️',
        description: 'Application Load Balancer with health checks and auto-scaling',
        ports: 'HTTP: 80, HTTPS: 443'
      },
      {
        id: 'proxy-container-1',
        x: 300, y: 200, width: 150, height: 100,
        label: 'RADSec Proxy Container 1',
        type: 'container',
        color: '#e8f5e9',
        icon: '📦',
        status: 'active',
        description: 'Docker container running RADSec proxy with 7-day authentication cache',
        ports: 'RADSec: 2083, Health: 8080'
      },
      {
        id: 'proxy-container-2',
        x: 500, y: 200, width: 150, height: 100,
        label: 'RADSec Proxy Container 2',
        type: 'container',
        color: '#e8f5e9',
        icon: '📦',
        status: 'active',
        description: 'Docker container running RADSec proxy with 7-day authentication cache',
        ports: 'RADSec: 2083, Health: 8080'
      },
      {
        id: 'cache-storage',
        x: 700, y: 200, width: 150, height: 100,
        label: 'Redis Cache Cluster',
        type: 'storage',
        color: '#fff3e0',
        icon: '💾',
        description: 'Shared cache for authentication decisions with 7-day retention',
        ports: 'Redis: 6379'
      },
      {
        id: 'monitoring',
        x: 700, y: 350, width: 150, height: 80,
        label: 'Monitoring & Logs',
        type: 'monitoring',
        color: '#f3e5f5',
        icon: '📊',
        description: 'CloudWatch/Prometheus monitoring with alerting and log aggregation',
        ports: 'HTTPS: 443, Syslog: 514'
      },
      {
        id: 'site-nas',
        x: 350, y: 450, width: 200, height: 100,
        label: `${networkVendor.toUpperCase()} NAS`,
        type: 'network',
        color: '#e8f5e9',
        icon: '🔧',
        description: 'Network Access Server with RADIUS client configuration',
        ports: 'RADIUS: 1812/1813'
      }
    ]
  }

  const generateRADSecProxyConnections = (): DiagramConnection[] => {
    return [
      {
        id: 'cloud-to-lb',
        from: 'portnox-cloud',
        to: 'load-balancer',
        type: 'secure',
        label: 'RADSec/TLS 1.3',
        protocol: 'RADSec',
        bandwidth: '10 Gbps'
      },
      {
        id: 'lb-to-proxy1',
        from: 'load-balancer',
        to: 'proxy-container-1',
        type: 'standard',
        protocol: 'HTTP',
        bandwidth: '1 Gbps'
      },
      {
        id: 'lb-to-proxy2',
        from: 'load-balancer',
        to: 'proxy-container-2',
        type: 'standard',
        protocol: 'HTTP',
        bandwidth: '1 Gbps'
      },
      {
        id: 'proxy1-to-cache',
        from: 'proxy-container-1',
        to: 'cache-storage',
        type: 'dashed',
        label: 'Cache Sync',
        protocol: 'Redis',
        bandwidth: '100 Mbps'
      },
      {
        id: 'proxy2-to-cache',
        from: 'proxy-container-2',
        to: 'cache-storage',
        type: 'dashed',
        label: 'Cache Sync',
        protocol: 'Redis',
        bandwidth: '100 Mbps'
      },
      {
        id: 'proxy1-to-monitoring',
        from: 'proxy-container-1',
        to: 'monitoring',
        type: 'dashed',
        protocol: 'HTTPS',
        bandwidth: '10 Mbps'
      },
      {
        id: 'proxy2-to-monitoring',
        from: 'proxy-container-2',
        to: 'monitoring',
        type: 'dashed',
        protocol: 'HTTPS',
        bandwidth: '10 Mbps'
      },
      {
        id: 'nas-to-proxy1',
        from: 'site-nas',
        to: 'proxy-container-1',
        type: 'standard',
        label: 'RADIUS',
        protocol: 'RADIUS',
        bandwidth: '100 Mbps'
      },
      {
        id: 'nas-to-proxy2',
        from: 'site-nas',
        to: 'proxy-container-2',
        type: 'dashed',
        label: 'Failover',
        protocol: 'RADIUS',
        bandwidth: '100 Mbps'
      }
    ]
  }

  const generatePolicyNodes = (): DiagramNode[] => {
    return [
      {
        id: 'policy-engine',
        x: 400, y: 50, width: 400, height: 100,
        label: 'Portnox Policy Engine',
        type: 'policy',
        color: '#e3f2fd',
        icon: '⚙️',
        description: 'Central policy management and decision engine with real-time policy updates via RADIUS CoA',
        ports: 'HTTPS: 443, RADIUS CoA: 3799'
      },
      {
        id: 'user-policies',
        x: 100, y: 200, width: 200, height: 120,
        label: 'User Policies',
        type: 'policy',
        color: '#d4edda',
        icon: '👤',
        description: 'Policies based on user identity, group membership, and time-based access controls',
        ports: 'LDAP: 389/636'
      },
      {
        id: 'device-policies',
        x: 350, y: 200, width: 200, height: 120,
        label: 'Device Policies',
        type: 'policy',
        color: '#cce5ff',
        icon: '💻',
        description: 'Policies based on device type, compliance status, and certificate validity',
        ports: 'MDM APIs, OCSP: 80'
      },
      {
        id: 'network-policies',
        x: 600, y: 200, width: 200, height: 120,
        label: 'Network Policies',
        type: 'policy',
        color: '#fff3cd',
        icon: '🌐',
        description: 'Policies based on network location, VLAN assignment, and geolocation',
        ports: 'SNMP: 161, NetFlow'
      },
      {
        id: 'compliance-policies',
        x: 850, y: 200, width: 200, height: 120,
        label: 'Compliance Policies',
        type: 'policy',
        color: '#f8d7da',
        icon: '🛡️',
        description: 'Policies based on device compliance, security posture, and vulnerability status',
        ports: 'MDM APIs, HTTPS: 443'
      }
    ]
  }

  const generatePolicyConnections = (): DiagramConnection[] => {
    return [
      { id: 'engine-to-user', from: 'policy-engine', to: 'user-policies', type: 'standard', label: 'User Context' },
      { id: 'engine-to-device', from: 'policy-engine', to: 'device-policies', type: 'standard', label: 'Device Info' },
      { id: 'engine-to-network', from: 'policy-engine', to: 'network-policies', type: 'standard', label: 'Network Context' },
      { id: 'engine-to-compliance', from: 'policy-engine', to: 'compliance-policies', type: 'standard', label: 'Compliance Status' }
    ]
  }

  const generateConnectivityNodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-center',
        x: 450, y: 300, width: 300, height: 100,
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        icon: '☁️',
        description: 'Central NAC service with global load balancing and regional failover',
        ports: 'HTTPS: 443, RADSec: 2083'
      },
      {
        id: 'aws-proxy',
        x: 100, y: 100, width: 200, height: 80,
        label: 'AWS RADSec Proxy',
        type: 'aws',
        color: '#fff3e0',
        icon: '🟠',
        description: 'Amazon Web Services RADSec proxy with auto-scaling and high availability',
        ports: 'RADSec: 2083, Health Check: 8080'
      },
      {
        id: 'azure-proxy',
        x: 350, y: 100, width: 200, height: 80,
        label: 'Azure RADSec Proxy',
        type: 'azure',
        color: '#e1f5fe',
        icon: '🔷',
        description: 'Microsoft Azure RADSec proxy with Express Route connectivity',
        ports: 'RADSec: 2083, Health Check: 8080'
      },
      {
        id: 'gcp-proxy',
        x: 600, y: 100, width: 200, height: 80,
        label: 'GCP RADSec Proxy',
        type: 'gcp',
        color: '#e8f5e9',
        icon: '🌐',
        description: 'Google Cloud Platform RADSec proxy with Cloud Interconnect',
        ports: 'RADSec: 2083, Health Check: 8080'
      },
      {
        id: 'onprem-proxy',
        x: 850, y: 100, width: 200, height: 80,
        label: 'On-Prem RADSec Proxy',
        type: 'onprem',
        color: '#ffeaa7',
        icon: '🏢',
        description: 'On-premises RADSec proxy for air-gapped environments',
        ports: 'RADSec: 2083, RADIUS: 1812/1813'
      }
    ]
  }

  const generateConnectivityConnections = (): DiagramConnection[] => {
    return [
      { id: 'aws-to-center', from: 'aws-proxy', to: 'portnox-center', type: 'secure', label: 'TLS 1.3' },
      { id: 'azure-to-center', from: 'azure-proxy', to: 'portnox-center', type: 'secure', label: 'TLS 1.3' },
      { id: 'gcp-to-center', from: 'gcp-proxy', to: 'portnox-center', type: 'secure', label: 'TLS 1.3' },
      { id: 'onprem-to-center', from: 'onprem-proxy', to: 'portnox-center', type: 'secure', label: 'VPN/TLS' }
    ]
  }

  const generateIntuneNodes = (): DiagramNode[] => {
    return [
      {
        id: 'intune-main',
        x: 450, y: 300, width: 300, height: 200,
        label: 'Microsoft Intune',
        type: 'intune',
        color: '#e1f5fe',
        icon: '📱',
        description: 'Microsoft Mobile Device Management solution with certificate profiles and compliance policies',
        ports: 'HTTPS: 443, Graph API'
      },
      {
        id: 'portnox-pki',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox Private PKI',
        type: 'pki',
        color: '#e3f2fd',
        icon: '🔐',
        description: 'Private Certificate Authority integrated with Intune via SCEP for automated certificate deployment',
        ports: 'SCEP: 80/443, OCSP: 80'
      },
      {
        id: 'windows-devices',
        x: 100, y: 350, width: 150, height: 80,
        label: 'Windows Devices',
        type: 'device',
        color: '#e8f5e9',
        icon: '🖥️',
        description: 'Windows 10/11 corporate devices with Intune management and certificate-based authentication',
        ports: 'HTTPS: 443, 802.1X'
      },
      {
        id: 'ios-devices',
        x: 100, y: 450, width: 150, height: 80,
        label: 'iOS Devices',
        type: 'device',
        color: '#e8f5e9',
        icon: '📱',
        description: 'Apple iOS devices with supervised enrollment and certificate profiles',
        ports: 'HTTPS: 443, 802.1X'
      },
      {
        id: 'android-devices',
        x: 850, y: 350, width: 150, height: 80,
        label: 'Android Devices',
        type: 'device',
        color: '#e8f5e9',
        icon: '📱',
        description: 'Android Enterprise devices with work profile and certificate deployment',
        ports: 'HTTPS: 443, 802.1X'
      },
      {
        id: 'macos-devices',
        x: 850, y: 450, width: 150, height: 80,
        label: 'macOS Devices',
        type: 'device',
        color: '#e8f5e9',
        icon: '💻',
        description: 'Apple macOS devices with device enrollment program and certificate management',
        ports: 'HTTPS: 443, 802.1X'
      }
    ]
  }

  const generateIntuneConnections = (): DiagramConnection[] => {
    return [
      { id: 'pki-to-intune', from: 'portnox-pki', to: 'intune-main', type: 'dashed', label: 'SCEP Integration' },
      { id: 'intune-to-windows', from: 'intune-main', to: 'windows-devices', type: 'secure', label: 'Profile Push' },
      { id: 'intune-to-ios', from: 'intune-main', to: 'ios-devices', type: 'secure', label: 'Profile Push' },
      { id: 'intune-to-android', from: 'intune-main', to: 'android-devices', type: 'secure', label: 'Profile Push' },
      { id: 'intune-to-macos', from: 'intune-main', to: 'macos-devices', type: 'secure', label: 'Profile Push' }
    ]
  }

  const generateOnboardingNodes = (): DiagramNode[] => {
    return [
      {
        id: 'onboarding-portal',
        x: 400, y: 50, width: 400, height: 100,
        label: 'Device Onboarding Portal',
        type: 'portal',
        color: '#e3f2fd',
        icon: '🌐',
        description: 'Self-service device onboarding portal with multi-language support and QR code generation',
        ports: 'HTTPS: 443, WebSocket: 443'
      },
      {
        id: 'corporate-flow',
        x: 100, y: 200, width: 200, height: 120,
        label: 'Corporate Device Flow',
        type: 'flow',
        color: '#d4edda',
        icon: '🏢',
        description: 'Automated onboarding for corporate managed devices via Intune with zero-touch deployment',
        ports: 'MDM APIs, SCEP: 80/443'
      },
      {
        id: 'byod-flow',
        x: 350, y: 200, width: 200, height: 120,
        label: 'BYOD Flow',
        type: 'flow',
        color: '#cce5ff',
        icon: '📱',
        description: 'Bring Your Own Device onboarding with user certificate enrollment and policy acceptance',
        ports: 'HTTPS: 443, SCEP: 80'
      },
      {
        id: 'guest-flow',
        x: 600, y: 200, width: 200, height: 120,
        label: 'Guest Access Flow',
        type: 'flow',
        color: '#fff3cd',
        icon: '👥',
        description: 'Guest user onboarding with sponsor approval workflow and time-limited access',
        ports: 'HTTPS: 443, SMS Gateway'
      },
      {
        id: 'iot-flow',
        x: 850, y: 200, width: 200, height: 120,
        label: 'IoT Device Flow',
        type: 'flow',
        color: '#f8d7da',
        icon: '🔌',
        description: 'IoT device registration with MAC Authentication Bypass and device profiling',
        ports: 'HTTPS: 443, SNMP: 161'
      }
    ]
  }

  const generateOnboardingConnections = (): DiagramConnection[] => {
    return [
      { id: 'portal-to-corporate', from: 'onboarding-portal', to: 'corporate-flow', type: 'standard', label: 'MDM Redirect' },
      { id: 'portal-to-byod', from: 'onboarding-portal', to: 'byod-flow', type: 'standard', label: 'Self-Service' },
      { id: 'portal-to-guest', from: 'onboarding-portal', to: 'guest-flow', type: 'standard', label: 'Sponsor Request' },
      { id: 'portal-to-iot', from: 'onboarding-portal', to: 'iot-flow', type: 'standard', label: 'MAC Registration' }
    ]
  }

  // Helper functions
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
      case 'expressroute': return 'Azure ExpressRoute'
      case 'directconnect': return 'AWS Direct Connect'
      case 'mpls': return 'MPLS Network'
      case 'vpn': return 'Site-to-Site VPN'
      case 'internet': return 'Internet Connection'
      default: return 'Network Connection'
    }
  }

  const getConnectivityType = (type: string): 'standard' | 'secure' | 'dashed' => {
    switch (type) {
      case 'sdwan': return 'dashed'
      case 'expressroute': return 'secure'
      case 'directconnect': return 'secure'
      case 'mpls': return 'dashed'
      case 'vpn': return 'secure'
      default: return 'standard'
    }
  }

  const getConnectivityProtocol = (type: string): string => {
    switch (type) {
      case 'sdwan': return 'SD-WAN'
      case 'expressroute': return 'ExpressRoute'
      case 'directconnect': return 'Direct Connect'
      case 'mpls': return 'MPLS'
      case 'vpn': return 'IPSec'
      default: return 'IP'
    }
  }

  const getConnectivityBandwidth = (type: string): string => {
    switch (type) {
      case 'sdwan': return '100 Mbps'
      case 'expressroute': return '1 Gbps'
      case 'directconnect': return '1 Gbps'
      case 'mpls': return '100 Mbps'
      case 'vpn': return '50 Mbps'
      default: return '10 Mbps'
    }
  }

  const getConnectivityPorts = (type: string): string => {
    switch (type) {
      case 'sdwan': return 'IPSec: 500/4500, BGP: 179'
      case 'expressroute': return 'BGP: 179, VLAN Tagging'
      case 'directconnect': return 'BGP: 179, VLAN: 802.1Q'
      case 'mpls': return 'BGP: 179, OSPF, IS-IS'
      case 'vpn': return 'IPSec: 500/4500, IKE'
      default: return 'Various protocols'
    }
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const renderNode = (node: DiagramNode) => {
    const isSelected = selectedNode === node.id
    const isHovered = hoveredNode === node.id

    return (
      <TooltipProvider key={node.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              className="cursor-pointer transition-all duration-200 hover:opacity-90"
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node background with gradient */}
              <defs>
                <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={node.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={node.color} stopOpacity="0.7" />
                </linearGradient>
                <filter id={`shadow-${node.id}`}>
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={12}
                fill={`url(#gradient-${node.id})`}
                stroke={isSelected ? '#3b82f6' : isHovered ? '#6b7280' : '#d1d5db'}
                strokeWidth={isSelected ? 3 : 2}
                filter={`url(#shadow-${node.id})`}
                className="transition-all duration-200"
              />
              
              {/* Status indicator */}
              {node.status && (
                <circle
                  cx={node.x + node.width - 15}
                  cy={node.y + 15}
                  r={6}
                  fill={
                    node.status === 'active' ? '#10b981' :
                    node.status === 'standby' ? '#f59e0b' : '#ef4444'
                  }
                  stroke="white"
                  strokeWidth={2}
                />
              )}
              
              {/* Node icon */}
              <text
                x={node.x + 15}
                y={node.y + 30}
                fontSize="24"
                className="pointer-events-none"
              >
                {node.icon}
              </text>
              
              {/* Node label with better positioning */}
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 + 5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800 font-semibold text-sm pointer-events-none"
                style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
              >
                {node.label}
              </text>

              {/* Connection points for selected nodes */}
              {isSelected && (
                <>
                  <circle cx={node.x + node.width / 2} cy={node.y} r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                  <circle cx={node.x + node.width} cy={node.y + node.height / 2} r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                  <circle cx={node.x + node.width / 2} cy={node.y + node.height} r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                  <circle cx={node.x} cy={node.y + node.height / 2} r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                </>
              )}
            </g>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <span>{node.icon}</span>
                {node.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
              {node.ports && (
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Ports:</strong> {node.ports}
                </p>
              )}
              {node.latency && (
                <p className="text-xs text-muted-foreground">
                  <strong>Latency:</strong> {node.latency}
                </p>
              )}
              {node.status && (
                <Badge variant="outline" className="mt-2">
                  Status: {node.status}
                </Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const renderConnection = (connection: DiagramConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from)
    const toNode = nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const x1 = fromNode.x + fromNode.width / 2
    const y1 = fromNode.y + fromNode.height / 2
    const x2 = toNode.x + toNode.width / 2
    const y2 = toNode.y + toNode.height / 2

    let strokeDasharray = 'none'
    let strokeWidth = 3
    let stroke = connection.color || '#6b7280'

    switch (connection.type) {
      case 'secure':
        stroke = '#10b981'
        strokeWidth = 4
        break
      case 'dashed':
        strokeDasharray = '10,5'
        stroke = '#f59e0b'
        break
      default:
        stroke = '#3b82f6'
    }

    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2

    return (
      <g key={connection.id}>
        {/* Connection line with animation */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className="transition-all duration-200"
          style={{
            strokeDasharray: showDataFlow ? '1000' : strokeDasharray,
            strokeDashoffset: showDataFlow ? '1000' : '0',
            animation: showDataFlow ? `drawLine ${2 / animationSpeed}s ease-out forwards` : 'none'
          }}
        />
        
        {/* Arrow marker */}
        <defs>
          <marker
            id={`arrow-${connection.id}`}
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 12 6 L 0 12 z"
              fill={stroke}
            />
          </marker>
        </defs>
        
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={strokeWidth}
          markerEnd={`url(#arrow-${connection.id})`}
        />
        
        {/* Connection label with better visibility */}
        {connection.label && (
          <g>
            <rect
              x={midX - connection.label.length * 3}
              y={midY - 12}
              width={connection.label.length * 6}
              height={20}
              rx={10}
              fill="white"
              stroke={stroke}
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-700 text-xs font-medium"
            >
              {connection.label}
            </text>
          </g>
        )}

        {/* Protocol and bandwidth info on hover */}
        {(connection.protocol || connection.bandwidth) && (
          <g className="opacity-0 hover:opacity-100 transition-opacity">
            <rect
              x={midX - 50}
              y={midY + 20}
              width={100}
              height={30}
              rx={5}
              fill="rgba(0,0,0,0.8)"
            />
            <text
              x={midX}
              y={midY + 30}
              textAnchor="middle"
              className="fill-white text-xs"
            >
              {connection.protocol}
            </text>
            <text
              x={midX}
              y={midY + 42}
              textAnchor="middle"
              className="fill-white text-xs"
            >
              {connection.bandwidth}
            </text>
          </g>
        )}
      </g>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full h-[700px] overflow-auto border rounded-lg bg-gradient-to-br from-gray-50 to-white">
        <svg
          ref={svgRef}
          width="1200"
          height="700"
          viewBox="0 0 1200 700"
          className="w-full h-full"
        >
          <style>
            {`
              @keyframes drawLine {
                to {
                  stroke-dashoffset: 0;
                }
              }
              .connection-flow {
                animation: flow 2s linear infinite;
              }
              @keyframes flow {
                0% { stroke-dashoffset: 20; }
                100% { stroke-dashoffset: 0; }
              }
            `}
          </style>
          
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Render connections first (behind nodes) */}
          {connections.map(renderConnection)}
          
          {/* Render nodes */}
          {nodes.map(renderNode)}
        </svg>
      </div>
      
      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{nodes.find(n => n.id === selectedNode)?.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{nodes.find(n => n.id === selectedNode)?.label}</h3>
                  <p className="text-muted-foreground">{nodes.find(n => n.id === selectedNode)?.description}</p>
                  {nodes.find(n => n.id === selectedNode)?.ports && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Ports:</strong> {nodes.find(n => n.id === selectedNode)?.ports}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Type: {nodes.find(n => n.id === selectedNode)?.type}</Badge>
                {nodes.find(n => n.id === selectedNode)?.status && (
                  <Badge variant={
                    nodes.find(n => n.id === selectedNode)?.status === 'active' ? 'default' :
                    nodes.find(n => n.id === selectedNode)?.status === 'standby' ? 'secondary' : 'destructive'
                  }>
                    {nodes.find(n => n.id === selectedNode)?.status}
                  </Badge>
                )}
                <Badge variant="outline">Interactive</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Click on nodes to view detailed information. Hover over connections to see protocol and bandwidth details. 
          Use the animation controls above to visualize data flow through the architecture.
        </p>
      </div>
    </div>
  )
}
