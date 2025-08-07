'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize, Info } from 'lucide-react'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
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
  type: 'radius' | 'https' | 'ldap' | 'syslog' | 'tacacs' | 'data' | 'radsec'
  animated: boolean
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
  const [isAnimating, setIsAnimating] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Define nodes and connections based on view
  const getDiagramData = () => {
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
        return { nodes: [], connections: [] }
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '💻',
        description: 'Windows, Mac, iOS, Android devices with certificates',
        connections: ['switch', 'wireless']
      },
      {
        id: 'switch',
        label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Switch`,
        type: 'network',
        x: 270,
        y: 150,
        width: 140,
        height: 90,
        color: '#059669',
        icon: '🔌',
        vendor: networkVendor,
        description: 'Network access switch with 802.1X authentication',
        connections: ['radsec-proxy']
      },
      {
        id: 'wireless',
        label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Wireless`,
        type: 'network',
        x: 270,
        y: 270,
        width: 140,
        height: 90,
        color: '#059669',
        icon: '📶',
        vendor: networkVendor,
        description: 'Wireless access point with 802.1X authentication',
        connections: ['radsec-proxy']
      },
      {
        id: 'radsec-proxy',
        label: `${cloudProvider.toUpperCase()} RADSec Proxy`,
        type: 'proxy',
        x: 490,
        y: 200,
        width: 160,
        height: 90,
        color: getCloudColor(cloudProvider),
        icon: '🔄',
        description: 'Secure RADIUS proxy for Portnox Local RADIUS deployments - provides encrypted RADIUS communication without load balancer or Redis cache dependencies',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 730,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC platform with RADIUS, PKI, and policy management',
        connections: ['azure-ad', 'intune']
      },
      {
        id: 'azure-ad',
        label: 'Azure AD',
        type: 'identity',
        x: 970,
        y: 120,
        width: 140,
        height: 90,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity provider and user authentication',
        connections: []
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 970,
        y: 280,
        width: 140,
        height: 90,
        color: '#0078D4',
        icon: '📱',
        description: 'Mobile device management and certificate deployment',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'dev-switch', from: 'devices', to: 'switch', label: '802.1X', type: 'radius', animated: true },
      { id: 'dev-wireless', from: 'devices', to: 'wireless', label: '802.1X', type: 'radius', animated: true },
      { id: 'switch-proxy', from: 'switch', to: 'radsec-proxy', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'wireless-proxy', from: 'wireless', to: 'radsec-proxy', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'proxy-portnox', from: 'radsec-proxy', to: 'portnox-cloud', label: 'RADSec/TLS', type: 'radsec', animated: true, color: '#00c8d7' },
      { id: 'portnox-azure', from: 'portnox-cloud', to: 'azure-ad', label: 'LDAP/SAML', type: 'ldap', animated: true },
      { id: 'portnox-intune', from: 'portnox-cloud', to: 'intune', label: 'REST API', type: 'https', animated: true }
    ]

    return { nodes, connections }
  }

  const getAuthenticationFlow = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'device',
        label: 'End Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'User device attempting network access',
        connections: ['authenticator']
      },
      {
        id: 'authenticator',
        label: 'Authenticator\n(Switch/AP)',
        type: 'network',
        x: 220,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '🔌',
        description: '802.1X authenticator (network access device)',
        connections: ['radsec-proxy']
      },
      {
        id: 'radsec-proxy',
        label: 'RADSec Proxy',
        type: 'proxy',
        x: 410,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '🔄',
        description: 'Secure RADIUS communication proxy for Portnox Local RADIUS - eliminates need for load balancer and Redis cache',
        connections: ['portnox-radius']
      },
      {
        id: 'portnox-radius',
        label: 'Portnox RADIUS',
        type: 'nac',
        x: 600,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'RADIUS authentication server with policy engine',
        connections: ['identity-store']
      },
      {
        id: 'identity-store',
        label: 'Identity Store',
        type: 'identity',
        x: 790,
        y: 200,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'User identity verification (Azure AD, LDAP)',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'dev-auth', from: 'device', to: 'authenticator', label: 'EAP-TLS', type: 'radius', animated: true },
      { id: 'auth-proxy', from: 'authenticator', to: 'radsec-proxy', label: 'RADIUS', type: 'radius', animated: true },
      { id: 'proxy-portnox', from: 'radsec-proxy', to: 'portnox-radius', label: 'RADSec', type: 'radsec', animated: true, color: '#00c8d7' },
      { id: 'portnox-identity', from: 'portnox-radius', to: 'identity-store', label: 'LDAP Query', type: 'ldap', animated: true }
    ]

    return { nodes, connections }
  }

  const getPKIInfrastructure = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'portnox-ca',
        label: 'Portnox Private CA',
        type: 'pki',
        x: 400,
        y: 50,
        width: 200,
        height: 80,
        color: '#DC2626',
        icon: '🔐',
        description: 'Private Certificate Authority with 2048-bit RSA keys',
        connections: ['scep-server', 'ocsp-responder']
      },
      {
        id: 'scep-server',
        label: 'SCEP Server',
        type: 'cert',
        x: 200,
        y: 200,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '📜',
        description: 'Simple Certificate Enrollment Protocol server',
        connections: ['intune-mdm']
      },
      {
        id: 'ocsp-responder',
        label: 'OCSP Responder',
        type: 'cert',
        x: 440,
        y: 200,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '✅',
        description: 'Online Certificate Status Protocol for validation',
        connections: []
      },
      {
        id: 'crl-distribution',
        label: 'CRL Distribution',
        type: 'cert',
        x: 680,
        y: 200,
        width: 160,
        height: 80,
        color: '#EA580C',
        icon: '📋',
        description: 'Certificate Revocation List distribution point',
        connections: []
      },
      {
        id: 'intune-mdm',
        label: 'Intune MDM',
        type: 'mdm',
        x: 200,
        y: 350,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '📱',
        description: 'Microsoft Intune for certificate deployment',
        connections: ['corporate-devices']
      },
      {
        id: 'corporate-devices',
        label: 'Corporate Devices',
        type: 'device',
        x: 440,
        y: 350,
        width: 160,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'Devices with deployed certificates',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'ca-scep', from: 'portnox-ca', to: 'scep-server', label: 'Issue Certs', type: 'data', animated: true },
      { id: 'ca-ocsp', from: 'portnox-ca', to: 'ocsp-responder', label: 'Status Updates', type: 'data', animated: true },
      { id: 'ca-crl', from: 'portnox-ca', to: 'crl-distribution', label: 'Revocation Lists', type: 'data', animated: true },
      { id: 'scep-intune', from: 'scep-server', to: 'intune-mdm', label: 'SCEP Profile', type: 'https', animated: true },
      { id: 'intune-devices', from: 'intune-mdm', to: 'corporate-devices', label: 'Deploy Certs', type: 'https', animated: true }
    ]

    return { nodes, connections }
  }

  const getPolicyFramework = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'policy-engine',
        label: 'Portnox Policy Engine',
        type: 'policy',
        x: 400,
        y: 200,
        width: 200,
        height: 100,
        color: '#DC2626',
        icon: '⚙️',
        description: 'Central policy management and decision engine',
        connections: ['user-policies', 'device-policies', 'network-policies', 'time-policies']
      },
      {
        id: 'user-policies',
        label: 'User Policies',
        type: 'policy',
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        color: '#7C3AED',
        icon: '👤',
        description: 'Identity-based access policies',
        connections: []
      },
      {
        id: 'device-policies',
        label: 'Device Policies',
        type: 'policy',
        x: 750,
        y: 100,
        width: 150,
        height: 80,
        color: '#059669',
        icon: '💻',
        description: 'Device compliance and type policies',
        connections: []
      },
      {
        id: 'network-policies',
        label: 'Network Policies',
        type: 'policy',
        x: 100,
        y: 350,
        width: 150,
        height: 80,
        color: '#EA580C',
        icon: '🌐',
        description: 'Location and network-based policies',
        connections: []
      },
      {
        id: 'time-policies',
        label: 'Time-Based Policies',
        type: 'policy',
        x: 750,
        y: 350,
        width: 150,
        height: 80,
        color: '#0891B2',
        icon: '⏰',
        description: 'Temporal access control policies',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'engine-user', from: 'policy-engine', to: 'user-policies', label: 'User Check', type: 'data', animated: true },
      { id: 'engine-device', from: 'policy-engine', to: 'device-policies', label: 'Device Check', type: 'data', animated: true },
      { id: 'engine-network', from: 'policy-engine', to: 'network-policies', label: 'Location Check', type: 'data', animated: true },
      { id: 'engine-time', from: 'policy-engine', to: 'time-policies', label: 'Time Check', type: 'data', animated: true }
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '🏢',
        description: 'Remote branch location with network infrastructure',
        connections: ['connectivity-hub']
      },
      {
        id: 'connectivity-hub',
        label: `${connectivityType.toUpperCase()} Hub`,
        type: 'connectivity',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#059669',
        icon: '🌐',
        description: `${connectivityType} connectivity solution for secure communication`,
        connections: ['cloud-services']
      },
      {
        id: 'cloud-services',
        label: `${cloudProvider.toUpperCase()} Cloud`,
        type: 'cloud',
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: getCloudColor(cloudProvider),
        icon: '☁️',
        description: `${cloudProvider} cloud services and infrastructure`,
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC platform with global reach',
        connections: []
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'branch-hub', from: 'branch-office', to: 'connectivity-hub', label: connectivityType.toUpperCase(), type: 'data', animated: true },
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '📱',
        description: 'Intune-managed corporate devices',
        connections: ['intune']
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#0078D4',
        icon: '🔧',
        description: 'Device management and compliance platform',
        connections: ['azure-ad', 'portnox-cloud']
      },
      {
        id: 'azure-ad',
        label: 'Azure AD',
        type: 'identity',
        x: 510,
        y: 100,
        width: 140,
        height: 90,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity provider and user directory',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 510,
        y: 300,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with Intune integration for compliance',
        connections: ['compliance-engine']
      },
      {
        id: 'compliance-engine',
        label: 'Compliance Engine',
        type: 'compliance',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#DC2626',
        icon: '✅',
        description: 'Device compliance validation and enforcement',
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
        width: 140,
        height: 90,
        color: '#6B7280',
        icon: '📱',
        description: 'Unmanaged device requiring onboarding',
        connections: ['captive-portal']
      },
      {
        id: 'captive-portal',
        label: 'Captive Portal',
        type: 'portal',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#7C3AED',
        icon: '🌐',
        description: 'Device registration and onboarding portal',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC orchestration and policy management',
        connections: ['certificate-authority', 'mdm-enrollment']
      },
      {
        id: 'certificate-authority',
        label: 'Certificate Authority',
        type: 'pki',
        x: 750,
        y: 100,
        width: 160,
        height: 90,
        color: '#DC2626',
        icon: '🔐',
        description: 'Certificate provisioning and management',
        connections: []
      },
      {
        id: 'mdm-enrollment',
        label: 'MDM Enrollment',
        type: 'mdm',
        x: 750,
        y: 300,
        width: 160,
        height: 90,
        color: '#059669',
        icon: '📋',
        description: 'Device management enrollment process',
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator accessing FortiGate',
        connections: ['fortigate']
      },
      {
        id: 'fortigate',
        label: 'FortiGate Firewall',
        type: 'firewall',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#DC2626',
        icon: '🔥',
        vendor: 'fortinet',
        description: 'FortiGate next-generation firewall',
        connections: ['portnox-tacacs']
      },
      {
        id: 'portnox-tacacs',
        label: 'Portnox TACACS+',
        type: 'tacacs',
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'TACACS+ authentication server for device administration',
        connections: ['active-directory']
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication and authorization store',
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator accessing Palo Alto devices',
        connections: ['palo-alto']
      },
      {
        id: 'palo-alto',
        label: 'Palo Alto Firewall',
        type: 'firewall',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#FF6B35',
        icon: '🔥',
        vendor: 'paloalto',
        description: 'Palo Alto next-generation firewall',
        connections: ['panorama', 'portnox-tacacs']
      },
      {
        id: 'panorama',
        label: 'Panorama',
        type: 'management',
        x: 270,
        y: 50,
        width: 160,
        height: 90,
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
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'TACACS+ authentication server for device administration',
        connections: ['active-directory']
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication and authorization store',
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated network users',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with User-ID integration capabilities',
        connections: ['syslog-container']
      },
      {
        id: 'syslog-container',
        label: 'Syslog Container',
        type: 'syslog',
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: '#7C3AED',
        icon: '📋',
        description: 'Syslog parsing service for User-ID mapping without load balancer dependencies',
        connections: ['palo-alto']
      },
      {
        id: 'palo-alto',
        label: 'Palo Alto Firewall',
        type: 'firewall',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#FF6B35',
        icon: '🔥',
        vendor: 'paloalto',
        description: 'User-ID enabled firewall with dynamic policies',
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
        width: 140,
        height: 90,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated network users',
        connections: ['portnox-cloud']
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 270,
        y: 200,
        width: 160,
        height: 90,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with FSSO integration capabilities',
        connections: ['syslog-container']
      },
      {
        id: 'syslog-container',
        label: 'Syslog Container',
        type: 'syslog',
        x: 510,
        y: 200,
        width: 160,
        height: 90,
        color: '#7C3AED',
        icon: '📋',
        description: 'Syslog parsing service for FSSO integration without Redis cache requirements',
        connections: ['fortigate']
      },
      {
        id: 'fortigate',
        label: 'FortiGate Firewall',
        type: 'firewall',
        x: 750,
        y: 200,
        width: 160,
        height: 90,
        color: '#DC2626',
        icon: '🔥',
        vendor: 'fortinet',
        description: 'FSSO enabled firewall with user-aware policies',
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

  const getCloudColor = (provider: string): string => {
    switch (provider) {
      case 'aws': return '#FF9900'
      case 'azure': return '#0078D4'
      case 'gcp': return '#4285F4'
      case 'onprem': return '#6B7280'
      default: return '#f5f5f5'
    }
  }

  const { nodes, connections } = getDiagramData()

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

    return `M ${fromX} ${fromY} Q ${midX} ${midY - 30} ${toX} ${toY}`
  }

  const getConnectionColor = (type: string, customColor?: string) => {
    if (customColor) return customColor
    
    switch (type) {
      case 'radius': return '#00c8d7'
      case 'radsec': return '#00c8d7'
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
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnimation}
          className="bg-white/95 backdrop-blur-sm border-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="bg-white/95 backdrop-blur-sm border-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-white/95 backdrop-blur-sm border-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-white/95 backdrop-blur-sm border-[#00c8d7] hover:bg-[#00c8d7] hover:text-white transition-all duration-300"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-white/95 backdrop-blur-sm border-[#00c8d7] text-[#00c8d7]">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* SVG Diagram */}
      <div className="w-full h-[700px] overflow-hidden border-2 border-[#00c8d7]/20 rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-inner">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 1000 600"
          className="w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Enhanced Definitions */}
          <defs>
            <style>
              {`
                .animated-path {
                  stroke-dasharray: 15 8;
                  animation: dash 2s linear infinite;
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -23;
                  }
                }
                .node-hover {
                  filter: drop-shadow(0 8px 16px rgba(0, 200, 215, 0.3));
                  transform: scale(1.05);
                  transition: all 0.3s ease;
                }
                .node-selected {
                  stroke: #00c8d7;
                  stroke-width: 4;
                  filter: drop-shadow(0 0 20px rgba(0, 200, 215, 0.5));
                }
                .connection-hover {
                  stroke-width: 4;
                  filter: drop-shadow(0 0 8px rgba(0, 200, 215, 0.4));
                }
              `}
            </style>
            
            {/* Arrow markers for different connection types */}
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
                fill="#00c8d7"
              />
            </marker>
            
            {/* Gradient definitions */}
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#f8fafc', stopOpacity: 0.9 }} />
            </linearGradient>
          </defs>

          {/* Background grid pattern */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connections */}
          {connections.map((connection) => {
            const fromNode = nodes.find(n => n.id === connection.from)
            const toNode = nodes.find(n => n.id === connection.to)
            if (!fromNode || !toNode) return null

            const connectionColor = getConnectionColor(connection.type, connection.color)

            return (
              <g key={connection.id}>
                <path
                  d={getConnectionPath(fromNode, toNode)}
                  stroke={connectionColor}
                  strokeWidth="3"
                  fill="none"
                  className={connection.animated ? 'animated-path' : ''}
                  markerEnd="url(#arrowhead)"
                  opacity="0.8"
                />
                <text
                  x={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2}
                  y={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2 - 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill={connectionColor}
                  className="font-semibold"
                  style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
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
                    {/* Node shadow */}
                    <rect
                      x={node.x + 3}
                      y={node.y + 3}
                      width={node.width}
                      height={node.height}
                      rx="12"
                      fill="rgba(0, 0, 0, 0.1)"
                      opacity="0.3"
                    />
                    
                    {/* Main node */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx="12"
                      fill="url(#nodeGradient)"
                      stroke={node.color}
                      strokeWidth="3"
                      opacity="0.95"
                    />
                    
                    {/* Node color accent */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height="8"
                      rx="12"
                      fill={node.color}
                      opacity="0.8"
                    />
                    
                    {/* Icon */}
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 35}
                      textAnchor="middle"
                      fontSize="28"
                      className="select-none"
                    >
                      {node.icon}
                    </text>
                    
                    {/* Label */}
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 60}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#1f2937"
                      className="font-bold select-none"
                      style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                    >
                      {node.label.split('\n')[0]}
                    </text>
                    {node.label.includes('\n') && (
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + 75}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#4b5563"
                        className="font-semibold select-none"
                        style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                      >
                        {node.label.split('\n')[1]}
                      </text>
                    )}
                    
                    {/* Vendor logo */}
                    {node.vendor && (
                      <g>
                        <circle
                          cx={node.x + node.width - 20}
                          cy={node.y + 20}
                          r="12"
                          fill="white"
                          stroke={node.color}
                          strokeWidth="2"
                        />
                        <text
                          x={node.x + node.width - 20}
                          y={node.y + 25}
                          textAnchor="middle"
                          fontSize="14"
                          className="select-none"
                        >
                          {getVendorLogo(node.vendor)}
                        </text>
                      </g>
                    )}
                    
                    {/* Connection points */}
                    <circle
                      cx={node.x + node.width / 2}
                      cy={node.y}
                      r="4"
                      fill="#00c8d7"
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                    <circle
                      cx={node.x + node.width}
                      cy={node.y + node.height / 2}
                      r="4"
                      fill="#00c8d7"
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                    <circle
                      cx={node.x + node.width / 2}
                      cy={node.y + node.height}
                      r="4"
                      fill="#00c8d7"
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y + node.height / 2}
                      r="4"
                      fill="#00c8d7"
                      stroke="white"
                      strokeWidth="2"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                  </g>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div>
                    <p className="font-semibold text-[#00c8d7]">{node.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                    {node.vendor && (
                      <p className="text-xs text-gray-500 mt-2 font-medium">
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

      {/* Enhanced Node Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/98 backdrop-blur-md border-2 border-[#00c8d7]/30 rounded-xl p-6 shadow-2xl">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode)
            if (!node) return null

            return (
              <div className="flex items-start space-x-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                  style={{ backgroundColor: node.color }}
                >
                  {node.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-xl text-gray-800">{node.label}</h3>
                    {node.vendor && (
                      <Badge variant="outline" className="border-[#00c8d7] text-[#00c8d7]">
                        {node.vendor.charAt(0).toUpperCase() + node.vendor.slice(1)}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-[#00c8d7]/10 text-[#00c8d7]">
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{node.description}</p>
                  {node.connections.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Connected Components:</p>
                      <div className="flex flex-wrap gap-2">
                        {node.connections.map(connId => {
                          const connectedNode = nodes.find(n => n.id === connId)
                          return connectedNode ? (
                            <Badge 
                              key={connId} 
                              variant="outline" 
                              className="text-xs border-gray-300 hover:border-[#00c8d7] hover:text-[#00c8d7] transition-colors cursor-pointer"
                              onClick={() => setSelectedNode(connId)}
                            >
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
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>
            )
          })()}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#00c8d7]/10 to-[#007acc]/10 dark:from-[#00c8d7]/20 dark:to-[#007acc]/20 rounded-xl border border-[#00c8d7]/20">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-[#00c8d7] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-[#00c8d7] font-semibold mb-1">
              Interactive Diagram Instructions
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Click on nodes to view detailed information. Hover over components to see connection points. 
              Use the controls in the top-right to manage animations and zoom level. 
              Animated connections show real-time data flow between components.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
