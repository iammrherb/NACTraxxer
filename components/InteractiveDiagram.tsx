'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize, Info, Shield, Cloud, Network, Server, Database, Lock, Users, Settings } from 'lucide-react'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
  showDataFlow?: boolean
}

interface DiagramNode {
  id: string
  label: string
  type: string
  x: number
  y: number
  width: number
  height: number
  color: string
  icon: string
  vendor?: string
  description: string
  connections: string[]
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  label: string
  type: 'radius' | 'https' | 'ldap' | 'syslog' | 'tacacs' | 'data'
  animated: boolean
}

export default function InteractiveDiagram({
  view,
  cloudProvider,
  networkVendor,
  connectivityType,
  animationSpeed,
  showDataFlow = false
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Define nodes and connections based on view
  const getDiagramData = () => {
    const baseNodes: DiagramNode[] = []
    const baseConnections: DiagramConnection[] = []

    switch (view) {
      case 'complete':
        return getCompleteArchitecture()
      case 'auth-flow':
        return getAuthenticationFlow()
      case 'pki':
        return getPKIInfrastructure()
      case 'policies':
        return getPolicyFramework()
      case 'connectivity':
        return getConnectivityOptions()
      case 'intune':
        return getIntuneIntegration()
      case 'onboarding':
        return getDeviceOnboarding()
      case 'fortigate-tacacs':
        return getFortiGateTACACS()
      case 'palo-tacacs':
        return getPaloAltoTACACS()
      case 'palo-userid':
        return getPaloAltoUserID()
      case 'fortigate-fsso':
        return getFortiGateFSSO()
      default:
        return { nodes: baseNodes, connections: baseConnections }
    }
  }

  const getCompleteArchitecture = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'devices',
        label: 'Corporate Devices',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'Windows, Mac, iOS, Android devices',
        connections: ['switch', 'wireless']
      },
      {
        id: 'switch',
        label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Switch`,
        type: 'network',
        x: 250,
        y: 150,
        width: 120,
        height: 80,
        color: '#059669',
        icon: '🔌',
        vendor: networkVendor,
        description: 'Network access switch with 802.1X',
        connections: ['portnox-cloud']
      },
      {
        id: 'wireless',
        label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Wireless`,
        type: 'network',
        x: 250,
        y: 250,
        width: 120,
        height: 80,
        color: '#059669',
        icon: '📶',
        vendor: networkVendor,
        description: 'Wireless access point with 802.1X',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC platform with RADIUS',
        connections: ['azure-ad', 'intune', 'policy-engine']
      },
      {
        id: 'azure-ad',
        label: 'Azure AD',
        type: 'identity',
        x: 650,
        y: 100,
        width: 120,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity provider and authentication',
        connections: []
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 650,
        y: 200,
        width: 120,
        height: 80,
        color: '#0078D4',
        icon: '📱',
        description: 'Mobile device management',
        connections: []
      },
      {
        id: 'policy-engine',
        label: 'Policy Engine',
        type: 'policy',
        x: 650,
        y: 300,
        width: 120,
        height: 80,
        color: '#DC2626',
        icon: '⚙️',
        description: 'Dynamic policy enforcement',
        connections: ['firewall']
      },
      {
        id: 'firewall',
        label: 'Next-Gen Firewall',
        type: 'security',
        x: 850,
        y: 300,
        width: 120,
        height: 80,
        color: '#7C2D12',
        icon: '🔥',
        description: 'Network security enforcement',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'dev-switch', from: 'devices', to: 'switch', label: '802.1X', type: 'radius', animated: true },
      { id: 'dev-wireless', from: 'devices', to: 'wireless', label: '802.1X', type: 'radius', animated: true },
      { id: 'switch-portnox', from: 'switch', to: 'portnox-cloud', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'wireless-portnox', from: 'wireless', to: 'portnox-cloud', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'portnox-azure', from: 'portnox-cloud', to: 'azure-ad', label: 'LDAP/SAML', type: 'ldap', animated: true },
      { id: 'portnox-intune', from: 'portnox-cloud', to: 'intune', label: 'REST API', type: 'https', animated: true },
      { id: 'portnox-policy', from: 'portnox-cloud', to: 'policy-engine', label: 'Policy Sync', type: 'https', animated: true },
      { id: 'policy-firewall', from: 'policy-engine', to: 'firewall', label: 'Enforcement', type: 'data', animated: true }
    ]

    return { nodes, connections }
  }

  const getAuthenticationFlow = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'device',
        label: 'Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 100,
        height: 60,
        color: '#4F46E5',
        icon: '💻',
        description: 'Authenticating device',
        connections: ['authenticator']
      },
      {
        id: 'authenticator',
        label: 'Authenticator\n(Switch/AP)',
        type: 'network',
        x: 200,
        y: 200,
        width: 120,
        height: 60,
        color: '#059669',
        icon: '🔌',
        description: '802.1X authenticator',
        connections: ['radius-proxy', 'portnox-radius']
      },
      {
        id: 'radius-proxy',
        label: 'RADSec Proxy',
        type: 'proxy',
        x: 350,
        y: 150,
        width: 120,
        height: 60,
        color: '#7C3AED',
        icon: '🔄',
        description: 'Secure RADIUS communication for Portnox Local RADIUS deployments',
        connections: ['portnox-radius']
      },
      {
        id: 'portnox-radius',
        label: 'Portnox RADIUS',
        type: 'nac',
        x: 500,
        y: 200,
        width: 120,
        height: 60,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'RADIUS authentication server',
        connections: ['identity-store']
      },
      {
        id: 'identity-store',
        label: 'Identity Store',
        type: 'identity',
        x: 650,
        y: 200,
        width: 120,
        height: 60,
        color: '#0078D4',
        icon: '👤',
        description: 'User identity verification',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'dev-auth', from: 'device', to: 'authenticator', label: 'EAP', type: 'radius', animated: true },
      { id: 'auth-proxy', from: 'authenticator', to: 'radius-proxy', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'proxy-portnox', from: 'radius-proxy', to: 'portnox-radius', label: 'RADSec', type: 'radius', animated: true },
      { id: 'auth-portnox', from: 'authenticator', to: 'portnox-radius', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'portnox-identity', from: 'portnox-radius', to: 'identity-store', label: 'LDAP', type: 'ldap', animated: true }
    ]

    return { nodes, connections }
  }

  const getPKIInfrastructure = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'root-ca',
        label: 'Root CA',
        type: 'pki',
        x: 400,
        y: 50,
        width: 120,
        height: 60,
        color: '#DC2626',
        icon: '🔐',
        description: 'Root Certificate Authority',
        connections: ['issuing-ca']
      },
      {
        id: 'issuing-ca',
        label: 'Issuing CA',
        type: 'pki',
        x: 400,
        y: 150,
        width: 120,
        height: 60,
        color: '#EA580C',
        icon: '📜',
        description: 'Certificate issuing authority',
        connections: ['radius-cert', 'device-cert']
      },
      {
        id: 'radius-cert',
        label: 'RADIUS Certificate',
        type: 'certificate',
        x: 250,
        y: 250,
        width: 120,
        height: 60,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Server authentication certificate',
        connections: []
      },
      {
        id: 'device-cert',
        label: 'Device Certificates',
        type: 'certificate',
        x: 550,
        y: 250,
        width: 120,
        height: 60,
        color: '#4F46E5',
        icon: '💻',
        description: 'Client authentication certificates',
        connections: []
      },
      {
        id: 'crl',
        label: 'CRL Distribution',
        type: 'pki',
        x: 400,
        y: 350,
        width: 120,
        height: 60,
        color: '#7C2D12',
        icon: '📋',
        description: 'Certificate revocation list',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'root-issuing', from: 'root-ca', to: 'issuing-ca', label: 'Signs', type: 'data', animated: true },
      { id: 'issuing-radius', from: 'issuing-ca', to: 'radius-cert', label: 'Issues', type: 'data', animated: true },
      { id: 'issuing-device', from: 'issuing-ca', to: 'device-cert', label: 'Issues', type: 'data', animated: true },
      { id: 'issuing-crl', from: 'issuing-ca', to: 'crl', label: 'Publishes', type: 'data', animated: true }
    ]

    return { nodes, connections }
  }

  const getPolicyFramework = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'policy-engine',
        label: 'Policy Engine',
        type: 'policy',
        x: 400,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '⚙️',
        description: 'Central policy management',
        connections: ['user-policies', 'device-policies', 'network-policies']
      },
      {
        id: 'user-policies',
        label: 'User Policies',
        type: 'policy',
        x: 200,
        y: 100,
        width: 120,
        height: 60,
        color: '#7C3AED',
        icon: '👤',
        description: 'User-based access rules',
        connections: []
      },
      {
        id: 'device-policies',
        label: 'Device Policies',
        type: 'policy',
        x: 600,
        y: 100,
        width: 120,
        height: 60,
        color: '#059669',
        icon: '💻',
        description: 'Device compliance rules',
        connections: []
      },
      {
        id: 'network-policies',
        label: 'Network Policies',
        type: 'policy',
        x: 400,
        y: 350,
        width: 120,
        height: 60,
        color: '#EA580C',
        icon: '🌐',
        description: 'Network access rules',
        connections: []
      },
      {
        id: 'enforcement',
        label: 'Policy Enforcement',
        type: 'enforcement',
        x: 200,
        y: 300,
        width: 120,
        height: 60,
        color: '#7C2D12',
        icon: '🔒',
        description: 'Real-time enforcement',
        connections: []
      },
      {
        id: 'compliance',
        label: 'Compliance Check',
        type: 'compliance',
        x: 600,
        y: 300,
        width: 120,
        height: 60,
        color: '#0891B2',
        icon: '✅',
        description: 'Continuous compliance monitoring',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'engine-user', from: 'policy-engine', to: 'user-policies', label: 'Evaluates', type: 'data', animated: true },
      { id: 'engine-device', from: 'policy-engine', to: 'device-policies', label: 'Evaluates', type: 'data', animated: true },
      { id: 'engine-network', from: 'policy-engine', to: 'network-policies', label: 'Evaluates', type: 'data', animated: true },
      { id: 'engine-enforcement', from: 'policy-engine', to: 'enforcement', label: 'Triggers', type: 'data', animated: true },
      { id: 'engine-compliance', from: 'policy-engine', to: 'compliance', label: 'Monitors', type: 'data', animated: true }
    ]

    return { nodes, connections }
  }

  const getConnectivityOptions = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'branch-office',
        label: 'Branch Office',
        type: 'location',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '🏢',
        description: 'Remote branch location',
        connections: ['connectivity-hub']
      },
      {
        id: 'connectivity-hub',
        label: `${connectivityType.toUpperCase()} Hub`,
        type: 'connectivity',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '🌐',
        description: `${connectivityType} connectivity solution`,
        connections: ['cloud-services']
      },
      {
        id: 'cloud-services',
        label: `${cloudProvider.toUpperCase()} Cloud`,
        type: 'cloud',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: cloudProvider === 'aws' ? '#FF9900' : cloudProvider === 'azure' ? '#0078D4' : '#4285F4',
        icon: '☁️',
        description: `${cloudProvider} cloud services`,
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC platform',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'branch-hub', from: 'branch-office', to: 'connectivity-hub', label: connectivityType, type: 'data', animated: true },
      { id: 'hub-cloud', from: 'connectivity-hub', to: 'cloud-services', label: 'Secure Tunnel', type: 'data', animated: true },
      { id: 'cloud-portnox', from: 'cloud-services', to: 'portnox-cloud', label: 'API/RADIUS', type: 'https', animated: true }
    ]

    return { nodes, connections }
  }

  const getIntuneIntegration = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'devices',
        label: 'Managed Devices',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '📱',
        description: 'Intune-managed devices',
        connections: ['intune']
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🔧',
        description: 'Device management platform',
        connections: ['azure-ad', 'portnox-cloud']
      },
      {
        id: 'azure-ad',
        label: 'Azure AD',
        type: 'identity',
        x: 450,
        y: 100,
        width: 120,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity provider',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 450,
        y: 300,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with Intune integration',
        connections: ['compliance-engine']
      },
      {
        id: 'compliance-engine',
        label: 'Compliance Engine',
        type: 'compliance',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '✅',
        description: 'Device compliance validation',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'devices-intune', from: 'devices', to: 'intune', label: 'MDM Enrollment', type: 'https', animated: true },
      { id: 'intune-azure', from: 'intune', to: 'azure-ad', label: 'Identity Sync', type: 'https', animated: true },
      { id: 'intune-portnox', from: 'intune', to: 'portnox-cloud', label: 'Compliance Data', type: 'https', animated: true },
      { id: 'azure-portnox', from: 'azure-ad', to: 'portnox-cloud', label: 'Authentication', type: 'ldap', animated: true },
      { id: 'portnox-compliance', from: 'portnox-cloud', to: 'compliance-engine', label: 'Policy Check', type: 'data', animated: true }
    ]

    return { nodes, connections }
  }

  const getDeviceOnboarding = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'new-device',
        label: 'New Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#6B7280',
        icon: '📱',
        description: 'Unmanaged device',
        connections: ['captive-portal']
      },
      {
        id: 'captive-portal',
        label: 'Captive Portal',
        type: 'portal',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '🌐',
        description: 'Device registration portal',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC orchestration',
        connections: ['certificate-authority', 'mdm-enrollment']
      },
      {
        id: 'certificate-authority',
        label: 'Certificate Authority',
        type: 'pki',
        x: 650,
        y: 100,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔐',
        description: 'Certificate provisioning',
        connections: []
      },
      {
        id: 'mdm-enrollment',
        label: 'MDM Enrollment',
        type: 'mdm',
        x: 650,
        y: 300,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '📋',
        description: 'Device management enrollment',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'device-portal', from: 'new-device', to: 'captive-portal', label: 'Registration', type: 'https', animated: true },
      { id: 'portal-portnox', from: 'captive-portal', to: 'portnox-cloud', label: 'Device Info', type: 'https', animated: true },
      { id: 'portnox-ca', from: 'portnox-cloud', to: 'certificate-authority', label: 'Cert Request', type: 'https', animated: true },
      { id: 'portnox-mdm', from: 'portnox-cloud', to: 'mdm-enrollment', label: 'Enrollment', type: 'https', animated: true }
    ]

    return { nodes, connections }
  }

  const getFortiGateTACACS = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        label: 'Network Admin',
        type: 'user',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator',
        connections: ['fortigate']
      },
      {
        id: 'fortigate',
        label: 'FortiGate Firewall',
        type: 'firewall',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔥',
        vendor: 'fortinet',
        description: 'FortiGate next-gen firewall',
        connections: ['portnox-tacacs']
      },
      {
        id: 'portnox-tacacs',
        label: 'Portnox TACACS+',
        type: 'tacacs',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'TACACS+ authentication server',
        connections: ['active-directory']
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication store',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'admin-fortigate', from: 'admin', to: 'fortigate', label: 'SSH/HTTPS', type: 'https', animated: true },
      { id: 'fortigate-tacacs', from: 'fortigate', to: 'portnox-tacacs', label: 'TACACS+', type: 'tacacs', animated: true },
      { id: 'tacacs-ad', from: 'portnox-tacacs', to: 'active-directory', label: 'LDAP', type: 'ldap', animated: true }
    ]

    return { nodes, connections }
  }

  const getPaloAltoTACACS = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        label: 'Network Admin',
        type: 'user',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator',
        connections: ['palo-alto']
      },
      {
        id: 'palo-alto',
        label: 'Palo Alto Firewall',
        type: 'firewall',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#FF6B35',
        icon: '🔥',
        vendor: 'paloalto',
        description: 'Palo Alto next-gen firewall',
        connections: ['panorama', 'portnox-tacacs']
      },
      {
        id: 'panorama',
        label: 'Panorama',
        type: 'management',
        x: 250,
        y: 50,
        width: 140,
        height: 80,
        color: '#FF6B35',
        icon: '🎛️',
        vendor: 'paloalto',
        description: 'Centralized management platform',
        connections: ['portnox-tacacs']
      },
      {
        id: 'portnox-tacacs',
        label: 'Portnox TACACS+',
        type: 'tacacs',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'TACACS+ authentication server',
        connections: ['active-directory']
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication store',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'admin-palo', from: 'admin', to: 'palo-alto', label: 'SSH/HTTPS', type: 'https', animated: true },
      { id: 'palo-panorama', from: 'palo-alto', to: 'panorama', label: 'Management', type: 'https', animated: true },
      { id: 'palo-tacacs', from: 'palo-alto', to: 'portnox-tacacs', label: 'TACACS+', type: 'tacacs', animated: true },
      { id: 'panorama-tacacs', from: 'panorama', to: 'portnox-tacacs', label: 'TACACS+', type: 'tacacs', animated: true },
      { id: 'tacacs-ad', from: 'portnox-tacacs', to: 'active-directory', label: 'LDAP', type: 'ldap', animated: true }
    ]

    return { nodes, connections }
  }

  const getPaloAltoUserID = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'users',
        label: 'Network Users',
        type: 'user',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated users',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with User-ID integration',
        connections: ['syslog-container']
      },
      {
        id: 'syslog-container',
        label: 'Syslog Container',
        type: 'syslog',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '📋',
        description: 'User session logging for User-ID mapping',
        connections: ['palo-alto']
      },
      {
        id: 'palo-alto',
        label: 'Palo Alto Firewall',
        type: 'firewall',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#FF6B35',
        icon: '🔥',
        vendor: 'paloalto',
        description: 'User-ID enabled firewall',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'users-portnox', from: 'users', to: 'portnox-cloud', label: 'Authentication', type: 'radius', animated: true },
      { id: 'portnox-syslog', from: 'portnox-cloud', to: 'syslog-container', label: 'User Sessions', type: 'syslog', animated: true },
      { id: 'syslog-palo', from: 'syslog-container', to: 'palo-alto', label: 'User-ID Mapping', type: 'syslog', animated: true }
    ]

    return { nodes, connections }
  }

  const getFortiGateFSSO = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'users',
        label: 'Network Users',
        type: 'user',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated users',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with FSSO integration',
        connections: ['syslog-container']
      },
      {
        id: 'syslog-container',
        label: 'Syslog Container',
        type: 'syslog',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '📋',
        description: 'User session logging for FSSO integration',
        connections: ['fortigate']
      },
      {
        id: 'fortigate',
        label: 'FortiGate Firewall',
        type: 'firewall',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔥',
        vendor: 'fortinet',
        description: 'FSSO enabled firewall',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'users-portnox', from: 'users', to: 'portnox-cloud', label: 'Authentication', type: 'radius', animated: true },
      { id: 'portnox-syslog', from: 'portnox-cloud', to: 'syslog-container', label: 'User Sessions', type: 'syslog', animated: true },
      { id: 'syslog-fortigate', from: 'syslog-container', to: 'fortigate', label: 'FSSO Integration', type: 'syslog', animated: true }
    ]

    return { nodes, connections }
  }

  const { nodes, connections } = getDiagramData()

  // Add these methods after the existing helper functions

  const exportSVG = () => {
    if (svgRef.current) {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement
      
      // Set proper dimensions and namespace
      svgClone.setAttribute('width', '1400')
      svgClone.setAttribute('height', '1000')
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      
      // Add white background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      background.setAttribute('x', '0')
      background.setAttribute('y', '0')
      background.setAttribute('width', '1400')
      background.setAttribute('height', '1000')
      background.setAttribute('fill', 'white')
      svgClone.insertBefore(background, svgClone.firstChild)
      
      // Add header with title and branding
      const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      headerGroup.setAttribute('id', 'export-header')
      
      // Header background
      const headerBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      headerBg.setAttribute('x', '0')
      headerBg.setAttribute('y', '0')
      headerBg.setAttribute('width', '1400')
      headerBg.setAttribute('height', '80')
      headerBg.setAttribute('fill', '#00c8d7')
      headerGroup.appendChild(headerBg)
      
      // Title
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', '700')
      titleText.setAttribute('y', '30')
      titleText.setAttribute('text-anchor', 'middle')
      titleText.setAttribute('fill', 'white')
      titleText.setAttribute('font-size', '18')
      titleText.setAttribute('font-weight', 'bold')
      titleText.textContent = `Portnox NAC Architecture - ${view.charAt(0).toUpperCase() + view.slice(1)}`
      headerGroup.appendChild(titleText)
      
      // Date
      const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      dateText.setAttribute('x', '700')
      dateText.setAttribute('y', '50')
      dateText.setAttribute('text-anchor', 'middle')
      dateText.setAttribute('fill', 'white')
      dateText.setAttribute('font-size', '12')
      dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
      headerGroup.appendChild(dateText)
      
      svgClone.insertBefore(headerGroup, background.nextSibling)
      
      // Adjust existing content position
      const existingContent = Array.from(svgClone.children).find(child => 
        child.tagName !== 'rect' && child.getAttribute('id') !== 'export-header' && child.tagName !== 'defs' && child.tagName !== 'style'
      )
      if (existingContent) {
        existingContent.setAttribute('transform', 'translate(0, 80) scale(0.9)')
      }
      
      // Export the SVG
      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = `portnox-architecture-${view}-${Date.now()}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(svgUrl)
    }
  }

  const exportPNG = () => {
    if (svgRef.current) {
      // Create enhanced SVG for PNG export
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement
      svgClone.setAttribute('width', '1400')
      svgClone.setAttribute('height', '1000')
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      
      // Add white background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      background.setAttribute('x', '0')
      background.setAttribute('y', '0')
      background.setAttribute('width', '1400')
      background.setAttribute('height', '1000')
      background.setAttribute('fill', 'white')
      svgClone.insertBefore(background, svgClone.firstChild)
      
      // Add header
      const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const headerBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      headerBg.setAttribute('x', '0')
      headerBg.setAttribute('y', '0')
      headerBg.setAttribute('width', '1400')
      headerBg.setAttribute('height', '80')
      headerBg.setAttribute('fill', '#00c8d7')
      headerGroup.appendChild(headerBg)
      
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', '700')
      titleText.setAttribute('y', '30')
      titleText.setAttribute('text-anchor', 'middle')
      titleText.setAttribute('fill', 'white')
      titleText.setAttribute('font-size', '18')
      titleText.setAttribute('font-weight', 'bold')
      titleText.textContent = `Portnox NAC Architecture - ${view.charAt(0).toUpperCase() + view.slice(1)}`
      headerGroup.appendChild(titleText)
      
      const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      dateText.setAttribute('x', '700')
      dateText.setAttribute('y', '50')
      dateText.setAttribute('text-anchor', 'middle')
      dateText.setAttribute('fill', 'white')
      dateText.setAttribute('font-size', '12')
      dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
      headerGroup.appendChild(dateText)
      
      svgClone.insertBefore(headerGroup, background.nextSibling)
      
      // Adjust content position
      const existingContent = Array.from(svgClone.children).find(child => 
        child.tagName !== 'rect' && child.getAttribute('id') !== 'export-header' && child.tagName !== 'defs' && child.tagName !== 'style'
      )
      if (existingContent) {
        existingContent.setAttribute('transform', 'translate(0, 80) scale(0.9)')
      }
      
      // Convert to PNG
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      canvas.width = 1400
      canvas.height = 1000
      
      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      img.onload = () => {
        ctx!.drawImage(img, 0, 0, 1400, 1000)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `portnox-architecture-${view}-${Date.now()}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            URL.revokeObjectURL(pngUrl)
          }
        }, 'image/png')
        
        URL.revokeObjectURL(url)
      }
      
      img.onerror = () => {
        console.error('Failed to load SVG for PNG conversion')
        alert('Failed to export PNG. Please try again.')
      }
      
      img.src = url
    }
  }

  // Animation control
  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const animatedPaths = svg.querySelectorAll('.animated-path')

    if (isAnimating) {
      animatedPaths.forEach((path) => {
        const element = path as SVGPathElement
        element.style.animationDuration = `${2 / animationSpeed}s`
        element.style.animationPlayState = 'running'
      })
    } else {
      animatedPaths.forEach((path) => {
        const element = path as SVGPathElement
        element.style.animationPlayState = 'paused'
      })
    }
  }, [isAnimating, animationSpeed])

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const resetView = () => {
    setZoom(1)
    setSelectedNode(null)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  const getConnectionPath = (from: DiagramNode, to: DiagramNode) => {
    const fromX = from.x + from.width / 2
    const fromY = from.y + from.height / 2
    const toX = to.x + to.width / 2
    const toY = to.y + to.height / 2

    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2

    return `M ${fromX} ${fromY} Q ${midX} ${midY - 20} ${toX} ${toY}`
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'radius': return '#00c8d7'
      case 'https': return '#059669'
      case 'ldap': return '#0078D4'
      case 'syslog': return '#7C3AED'
      case 'tacacs': return '#DC2626'
      case 'data': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getVendorLogo = (vendor: string) => {
    const logos: { [key: string]: string } = {
      cisco: '🔵',
      aruba: '🟠',
      juniper: '🟢',
      extreme: '🟣',
      ruckus: '🟡',
      fortinet: '🔴',
      paloalto: '🟠'
    }
    return logos[vendor] || '⚪'
  }

  return (
    <div className="architecture-diagram relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnimation}
          className="bg-white/90 backdrop-blur-sm"
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="bg-white/90 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-white/90 backdrop-blur-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-white/90 backdrop-blur-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportPNG}
          className="bg-white/90 backdrop-blur-sm"
          title="Export as PNG"
        >
          PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportSVG}
          className="bg-white/90 backdrop-blur-sm"
          title="Export as SVG"
        >
          SVG
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* SVG Diagram */}
      <div className="w-full h-[600px] overflow-hidden border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 900 500"
          className="w-full h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Definitions for animations and patterns */}
          <defs>
            <style>
              {`
                .animated-path {
                  stroke-dasharray: 10 5;
                  animation: dash 2s linear infinite;
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -15;
                  }
                }
                .node-hover {
                  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                  transform: scale(1.05);
                  transition: all 0.2s ease;
                }
                .node-selected {
                  stroke: #00c8d7;
                  stroke-width: 3;
                }
              `}
            </style>
          </defs>

          {/* Connections */}
          {connections.map((connection) => {
            const fromNode = nodes.find(n => n.id === connection.from)
            const toNode = nodes.find(n => n.id === connection.to)
            if (!fromNode || !toNode) return null

            return (
              <g key={connection.id}>
                <path
                  d={getConnectionPath(fromNode, toNode)}
                  stroke={getConnectionColor(connection.type)}
                  strokeWidth="2"
                  fill="none"
                  className={connection.animated ? 'animated-path' : ''}
                />
                <text
                  x={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2}
                  y={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2 - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                  className="font-medium"
                >
                  {connection.label}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g
                    className={`cursor-pointer ${hoveredNode === node.id ? 'node-hover' : ''} ${selectedNode === node.id ? 'node-selected' : ''}`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx="8"
                      fill={node.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 20}
                      textAnchor="middle"
                      fontSize="24"
                    >
                      {node.icon}
                    </text>
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 45}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      className="font-semibold"
                    >
                      {node.label.split('\n')[0]}
                    </text>
                    {node.label.includes('\n') && (
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + 60}
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        className="font-medium"
                      >
                        {node.label.split('\n')[1]}
                      </text>
                    )}
                    {node.vendor && (
                      <text
                        x={node.x + node.width - 15}
                        y={node.y + 15}
                        textAnchor="middle"
                        fontSize="12"
                      >
                        {getVendorLogo(node.vendor)}
                      </text>
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-semibold">{node.label}</p>
                    <p className="text-sm text-gray-600">{node.description}</p>
                    {node.vendor && (
                      <p className="text-xs text-gray-500 mt-1">
                        Vendor: {node.vendor.charAt(0).toUpperCase() + node.vendor.slice(1)}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </svg>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode)
            if (!node) return null

            return (
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: node.color }}
                >
                  {node.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{node.label}</h3>
                    {node.vendor && (
                      <Badge variant="outline">
                        {node.vendor.charAt(0).toUpperCase() + node.vendor.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{node.description}</p>
                  {node.connections.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Connected to:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {node.connections.map(connId => {
                          const connectedNode = nodes.find(n => n.id === connId)
                          return connectedNode ? (
                            <Badge key={connId} variant="secondary" className="text-xs">
                              {connectedNode.label}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
