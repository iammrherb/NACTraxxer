'use client'

import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
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
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  type: 'standard' | 'secure' | 'dashed'
  label?: string
  color?: string
}

export default function InteractiveDiagram({ 
  view, 
  cloudProvider, 
  networkVendor, 
  connectivityType, 
  animationSpeed 
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [connections, setConnections] = useState<DiagramConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isDrawingConnection, setIsDrawingConnection] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)

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
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        description: 'Cloud-based NAC engine with Private PKI, policy management, and RADIUS authentication services'
      },
      {
        id: 'cloud-proxy',
        x: 100, y: 250, width: 400, height: 150,
        label: `${cloudProvider.toUpperCase()} RADSec Proxy`,
        type: cloudProvider,
        color: cloudColor,
        description: `${cloudProvider.toUpperCase()} cloud infrastructure hosting RADSec proxies with high availability`
      },
      {
        id: 'connectivity',
        x: 100, y: 450, width: 400, height: 60,
        label: getConnectivityLabel(connectivityType),
        type: 'connectivity',
        color: '#f3e5f5',
        description: `${getConnectivityLabel(connectivityType)} network connectivity`
      },
      {
        id: 'site-infrastructure',
        x: 100, y: 600, width: 400, height: 120,
        label: `ABM Site - ${vendorLabel} Stack`,
        type: 'site',
        color: '#f3e5f5',
        description: `Physical location with ${vendorLabel} network infrastructure`
      },
      {
        id: 'intune',
        x: 800, y: 250, width: 300, height: 150,
        label: 'Microsoft Intune',
        type: 'intune',
        color: '#e1f5fe',
        description: 'MDM solution for certificate deployment and device configuration management'
      },
      {
        id: 'endpoints',
        x: 800, y: 500, width: 300, height: 200,
        label: 'Managed Endpoints',
        type: 'device',
        color: '#f5f5f5',
        description: 'Corporate devices with certificates deployed via Intune'
      }
    ]
  }

  const generateCompleteConnections = (): DiagramConnection[] => {
    return [
      { id: 'cloud-to-proxy', from: 'portnox-cloud', to: 'cloud-proxy', type: 'secure', label: 'RADSec/TLS' },
      { id: 'proxy-to-connectivity', from: 'cloud-proxy', to: 'connectivity', type: 'standard' },
      { id: 'connectivity-to-site', from: 'connectivity', to: 'site-infrastructure', type: getConnectivityType(connectivityType) },
      { id: 'site-to-endpoints', from: 'site-infrastructure', to: 'endpoints', type: 'standard', label: '802.1X' },
      { id: 'intune-to-endpoints', from: 'intune', to: 'endpoints', type: 'secure', label: 'Certificate Push' },
      { id: 'cloud-to-intune', from: 'portnox-cloud', to: 'intune', type: 'dashed', label: 'SCEP' }
    ]
  }

  const generateAuthFlowNodes = (): DiagramNode[] => {
    return [
      {
        id: 'device',
        x: 50, y: 300, width: 120, height: 60,
        label: 'End Device',
        type: 'device',
        color: '#e8f5e9',
        description: 'User device attempting network access'
      },
      {
        id: 'nas',
        x: 250, y: 300, width: 150, height: 60,
        label: `${networkVendor.toUpperCase()} NAS`,
        type: 'network',
        color: '#e8f5e9',
        description: 'Network Access Server (Switch/AP)'
      },
      {
        id: 'proxy',
        x: 500, y: 300, width: 180, height: 60,
        label: `RADSec Proxy (${cloudProvider.toUpperCase()})`,
        type: cloudProvider,
        color: getCloudColor(cloudProvider),
        description: 'RADIUS over TLS proxy with caching'
      },
      {
        id: 'portnox',
        x: 800, y: 300, width: 200, height: 80,
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        description: 'Cloud NAC authentication engine'
      },
      {
        id: 'identity',
        x: 800, y: 450, width: 200, height: 60,
        label: 'Azure AD',
        type: 'identity',
        color: '#e3f2fd',
        description: 'Identity provider for user authentication'
      }
    ]
  }

  const generateAuthFlowConnections = (): DiagramConnection[] => {
    return [
      { id: 'device-to-nas', from: 'device', to: 'nas', type: 'standard', label: '1' },
      { id: 'nas-to-proxy', from: 'nas', to: 'proxy', type: 'standard', label: '2' },
      { id: 'proxy-to-portnox', from: 'proxy', to: 'portnox', type: 'secure', label: '3' },
      { id: 'portnox-to-identity', from: 'portnox', to: 'identity', type: 'standard', label: '4' },
      { id: 'identity-to-portnox', from: 'identity', to: 'portnox', type: 'standard', label: '5' },
      { id: 'portnox-to-proxy-return', from: 'portnox', to: 'proxy', type: 'secure', label: '6' },
      { id: 'proxy-to-nas-return', from: 'proxy', to: 'nas', type: 'standard', label: '7' },
      { id: 'nas-to-device-return', from: 'nas', to: 'device', type: 'standard', label: '8' }
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
        description: 'Private Certificate Authority for issuing X.509 certificates'
      },
      {
        id: 'scep',
        x: 200, y: 200, width: 150, height: 60,
        label: 'SCEP Server',
        type: 'cert',
        color: '#e3f2fd',
        description: 'Simple Certificate Enrollment Protocol server'
      },
      {
        id: 'ocsp',
        x: 450, y: 200, width: 150, height: 60,
        label: 'OCSP Responder',
        type: 'cert',
        color: '#e3f2fd',
        description: 'Online Certificate Status Protocol responder'
      },
      {
        id: 'cdp',
        x: 700, y: 200, width: 150, height: 60,
        label: 'CRL/CDP',
        type: 'cert',
        color: '#e3f2fd',
        description: 'Certificate Revocation List and Distribution Point'
      },
      {
        id: 'intune-mdm',
        x: 200, y: 350, width: 150, height: 60,
        label: 'Intune MDM',
        type: 'mdm',
        color: '#fff3e0',
        description: 'Mobile Device Management for certificate deployment'
      },
      {
        id: 'end-device',
        x: 450, y: 350, width: 150, height: 60,
        label: 'End Device',
        type: 'device',
        color: '#e8f5e9',
        description: 'Device receiving certificates'
      },
      {
        id: 'network-device',
        x: 700, y: 350, width: 150, height: 60,
        label: 'Network Device',
        type: 'network',
        color: '#e8f5e9',
        description: 'Network infrastructure validating certificates'
      }
    ]
  }

  const generatePKIConnections = (): DiagramConnection[] => {
    return [
      { id: 'ca-to-scep', from: 'pki-ca', to: 'scep', type: 'standard', label: 'Issue' },
      { id: 'ca-to-ocsp', from: 'pki-ca', to: 'ocsp', type: 'standard', label: 'Validate' },
      { id: 'ca-to-cdp', from: 'pki-ca', to: 'cdp', type: 'standard', label: 'Revoke' },
      { id: 'scep-to-intune', from: 'scep', to: 'intune-mdm', type: 'standard' },
      { id: 'intune-to-device', from: 'intune-mdm', to: 'end-device', type: 'secure', label: 'Deploy' },
      { id: 'device-to-network', from: 'end-device', to: 'network-device', type: 'standard', label: 'Auth' },
      { id: 'network-to-ocsp', from: 'network-device', to: 'ocsp', type: 'dashed', label: 'Verify' }
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
        description: 'Central policy management and decision engine'
      },
      {
        id: 'user-policies',
        x: 100, y: 200, width: 200, height: 120,
        label: 'User Policies',
        type: 'policy',
        color: '#d4edda',
        description: 'Policies based on user identity and group membership'
      },
      {
        id: 'device-policies',
        x: 350, y: 200, width: 200, height: 120,
        label: 'Device Policies',
        type: 'policy',
        color: '#cce5ff',
        description: 'Policies based on device type and compliance status'
      },
      {
        id: 'network-policies',
        x: 600, y: 200, width: 200, height: 120,
        label: 'Network Policies',
        type: 'policy',
        color: '#fff3cd',
        description: 'Policies based on network location and time'
      },
      {
        id: 'compliance-policies',
        x: 850, y: 200, width: 200, height: 120,
        label: 'Compliance Policies',
        type: 'policy',
        color: '#f8d7da',
        description: 'Policies based on device compliance and security posture'
      }
    ]
  }

  const generatePolicyConnections = (): DiagramConnection[] => {
    return [
      { id: 'engine-to-user', from: 'policy-engine', to: 'user-policies', type: 'standard' },
      { id: 'engine-to-device', from: 'policy-engine', to: 'device-policies', type: 'standard' },
      { id: 'engine-to-network', from: 'policy-engine', to: 'network-policies', type: 'standard' },
      { id: 'engine-to-compliance', from: 'policy-engine', to: 'compliance-policies', type: 'standard' }
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
        description: 'Central NAC service'
      },
      {
        id: 'aws-proxy',
        x: 100, y: 100, width: 200, height: 80,
        label: 'AWS RADSec Proxy',
        type: 'aws',
        color: '#fff3e0',
        description: 'Amazon Web Services RADSec proxy'
      },
      {
        id: 'azure-proxy',
        x: 350, y: 100, width: 200, height: 80,
        label: 'Azure RADSec Proxy',
        type: 'azure',
        color: '#e1f5fe',
        description: 'Microsoft Azure RADSec proxy'
      },
      {
        id: 'gcp-proxy',
        x: 600, y: 100, width: 200, height: 80,
        label: 'GCP RADSec Proxy',
        type: 'gcp',
        color: '#e8f5e9',
        description: 'Google Cloud Platform RADSec proxy'
      },
      {
        id: 'onprem-proxy',
        x: 850, y: 100, width: 200, height: 80,
        label: 'On-Prem RADSec Proxy',
        type: 'onprem',
        color: '#ffeaa7',
        description: 'On-premises RADSec proxy'
      }
    ]
  }

  const generateConnectivityConnections = (): DiagramConnection[] => {
    return [
      { id: 'aws-to-center', from: 'aws-proxy', to: 'portnox-center', type: 'secure' },
      { id: 'azure-to-center', from: 'azure-proxy', to: 'portnox-center', type: 'secure' },
      { id: 'gcp-to-center', from: 'gcp-proxy', to: 'portnox-center', type: 'secure' },
      { id: 'onprem-to-center', from: 'onprem-proxy', to: 'portnox-center', type: 'secure' }
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
        description: 'Microsoft Mobile Device Management solution'
      },
      {
        id: 'portnox-pki',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox Private PKI',
        type: 'pki',
        color: '#e3f2fd',
        description: 'Private Certificate Authority'
      },
      {
        id: 'windows-devices',
        x: 100, y: 350, width: 150, height: 80,
        label: 'Windows Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Windows corporate devices'
      },
      {
        id: 'ios-devices',
        x: 100, y: 450, width: 150, height: 80,
        label: 'iOS Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Apple iOS devices'
      },
      {
        id: 'android-devices',
        x: 850, y: 350, width: 150, height: 80,
        label: 'Android Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Android devices'
      },
      {
        id: 'macos-devices',
        x: 850, y: 450, width: 150, height: 80,
        label: 'macOS Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Apple macOS devices'
      }
    ]
  }

  const generateIntuneConnections = (): DiagramConnection[] => {
    return [
      { id: 'pki-to-intune', from: 'portnox-pki', to: 'intune-main', type: 'dashed', label: 'SCEP' },
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
        description: 'Self-service device onboarding portal'
      },
      {
        id: 'corporate-flow',
        x: 100, y: 200, width: 200, height: 120,
        label: 'Corporate Device Flow',
        type: 'flow',
        color: '#d4edda',
        description: 'Automated onboarding for corporate managed devices'
      },
      {
        id: 'byod-flow',
        x: 350, y: 200, width: 200, height: 120,
        label: 'BYOD Flow',
        type: 'flow',
        color: '#cce5ff',
        description: 'Bring Your Own Device onboarding process'
      },
      {
        id: 'guest-flow',
        x: 600, y: 200, width: 200, height: 120,
        label: 'Guest Access Flow',
        type: 'flow',
        color: '#fff3cd',
        description: 'Guest user onboarding with sponsor approval'
      },
      {
        id: 'iot-flow',
        x: 850, y: 200, width: 200, height: 120,
        label: 'IoT Device Flow',
        type: 'flow',
        color: '#f8d7da',
        description: 'IoT device registration and MAC authentication'
      }
    ]
  }

  const generateOnboardingConnections = (): DiagramConnection[] => {
    return [
      { id: 'portal-to-corporate', from: 'onboarding-portal', to: 'corporate-flow', type: 'standard' },
      { id: 'portal-to-byod', from: 'onboarding-portal', to: 'byod-flow', type: 'standard' },
      { id: 'portal-to-guest', from: 'onboarding-portal', to: 'guest-flow', type: 'standard' },
      { id: 'portal-to-iot', from: 'onboarding-portal', to: 'iot-flow', type: 'standard' }
    ]
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
      case 'expressroute': return 'Express Route'
      case 'mpls': return 'MPLS Network'
      case 'vpn': return 'Site-to-Site VPN'
      case 'directconnect': return 'Direct Connect'
      default: return 'Network Connection'
    }
  }

  const getConnectivityType = (type: string): 'standard' | 'secure' | 'dashed' => {
    switch (type) {
      case 'sdwan': return 'dashed'
      case 'expressroute': return 'secure'
      case 'mpls': return 'dashed'
      case 'vpn': return 'secure'
      case 'directconnect': return 'standard'
      default: return 'standard'
    }
  }

  const handleNodeClick = (nodeId: string) => {
    if (isDrawingConnection) {
      if (connectionStart && connectionStart !== nodeId) {
        // Create new connection
        const newConnection: DiagramConnection = {
          id: `custom-${Date.now()}`,
          from: connectionStart,
          to: nodeId,
          type: 'standard',
          label: 'Custom'
        }
        setConnections(prev => [...prev, newConnection])
        setIsDrawingConnection(false)
        setConnectionStart(null)
      }
    } else {
      setSelectedNode(nodeId)
    }
  }

  const startConnection = (nodeId: string) => {
    setIsDrawingConnection(true)
    setConnectionStart(nodeId)
  }

  const renderNode = (node: DiagramNode) => {
    const isSelected = selectedNode === node.id
    const isConnectionStart = connectionStart === node.id

    return (
      <TooltipProvider key={node.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              className="cursor-pointer transition-all duration-200 hover:opacity-80"
              onClick={() => handleNodeClick(node.id)}
              onDoubleClick={() => startConnection(node.id)}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={8}
                fill={node.color}
                stroke={isSelected ? '#3b82f6' : isConnectionStart ? '#10b981' : '#6b7280'}
                strokeWidth={isSelected || isConnectionStart ? 3 : 2}
                className="transition-all duration-200"
              />
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800 dark:fill-gray-200 font-semibold text-sm pointer-events-none"
              >
                {node.label}
              </text>
              
              {/* Connection points */}
              <circle
                cx={node.x + node.width / 2}
                cy={node.y}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x + node.width}
                cy={node.y + node.height / 2}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x + node.width / 2}
                cy={node.y + node.height}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x}
                cy={node.y + node.height / 2}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
            </g>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <p className="font-semibold">{node.label}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{node.description}</p>
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
    let strokeWidth = 2
    let stroke = connection.color || '#6b7280'

    switch (connection.type) {
      case 'secure':
        stroke = '#10b981'
        strokeWidth = 3
        strokeDasharray = '5,5'
        break
      case 'dashed':
        strokeDasharray = '10,5'
        break
    }

    return (
      <g key={connection.id}>
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
            strokeDasharray: animationSpeed > 0 ? '1000' : strokeDasharray,
            strokeDashoffset: animationSpeed > 0 ? '1000' : '0',
            animation: animationSpeed > 0 ? `drawLine ${2 / animationSpeed}s ease-out forwards` : 'none'
          }}
        />
        
        {/* Arrow marker */}
        <defs>
          <marker
            id={`arrow-${connection.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
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
        
        {/* Connection label */}
        {connection.label && (
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 - 10}
            textAnchor="middle"
            className="fill-gray-600 dark:fill-gray-400 text-xs font-medium"
          >
            {connection.label}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="w-full h-[600px] overflow-auto">
      <svg
        ref={svgRef}
        width="1200"
        height="800"
        viewBox="0 0 1200 800"
        className="w-full h-full"
      >
        <style>
          {`
            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
        
        {/* Render connections first (behind nodes) */}
        {connections.map(renderConnection)}
        
        {/* Render nodes */}
        {nodes.map(renderNode)}
      </svg>
      
      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Instructions:</strong> Click nodes to select them. Double-click a node to start drawing a custom connection. 
          Hover over nodes to see connection points and detailed descriptions.
        </p>
      </div>
    </div>
  )
}
