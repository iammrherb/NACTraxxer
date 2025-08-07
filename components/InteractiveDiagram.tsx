'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Wifi, Shield, Server, Monitor, Smartphone, Printer, Router, Database, Cloud, Lock, Key, CheckCircle, AlertTriangle, Zap, Play, Pause, RotateCcw } from 'lucide-react'

interface InteractiveDiagramProps {
  type: string
  isAnimated: boolean
  customerLogo: string
}

interface DiagramNode {
  id: string
  type: 'device' | 'network' | 'server' | 'cloud' | 'security'
  label: string
  description: string
  x: number
  y: number
  status: 'active' | 'inactive' | 'warning' | 'error'
  vendor?: string
  connections: string[]
  details: {
    ip?: string
    model?: string
    version?: string
    protocols?: string[]
    certificates?: string[]
    policies?: string[]
  }
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  type: 'ethernet' | 'wifi' | 'radius' | 'ldap' | 'https' | 'tls'
  label: string
  status: 'active' | 'inactive'
  encrypted: boolean
}

const diagrams = [
  {
    id: 'corporate-wifi',
    name: 'Corporate WiFi Authentication',
    description: 'EAP-TLS authentication flow for corporate wireless devices'
  },
  {
    id: 'corporate-wired',
    name: 'Corporate Wired Authentication',
    description: '802.1X authentication for wired corporate devices'
  },
  {
    id: 'guest-access',
    name: 'Guest Access Portal',
    description: 'Captive portal authentication for guest devices'
  },
  {
    id: 'radsec-proxy',
    name: 'RADSec Proxy Architecture',
    description: 'Secure RADIUS proxy for cloud NAC integration'
  },
  {
    id: 'fortigate-tacacs',
    name: 'FortiGate TACACS+ Integration',
    description: 'TACACS+ authentication for FortiGate firewall administration'
  },
  {
    id: 'palo-alto-tacacs',
    name: 'Palo Alto TACACS+ Integration',
    description: 'TACACS+ authentication for Palo Alto firewall administration'
  },
  {
    id: 'palo-alto-userid',
    name: 'Palo Alto User-ID Integration',
    description: 'User-ID mapping for identity-aware firewall policies'
  },
  {
    id: 'fortigate-fsso',
    name: 'FortiGate FSSO Integration',
    description: 'Fortinet Single Sign-On integration for user identity mapping'
  }
]

export default function InteractiveDiagram({ type, isAnimated, customerLogo }: InteractiveDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnimated && isPlaying) {
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % getAnimationSteps(type))
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isAnimated, isPlaying, type])

  const getAnimationSteps = (diagramType: string): number => {
    switch (diagramType) {
      case 'corporate-wifi':
      case 'corporate-wired':
        return 6
      case 'guest-access':
        return 4
      case 'radsec-proxy':
        return 5
      default:
        return 4
    }
  }

  const getDiagramData = (diagramType: string) => {
    switch (diagramType) {
      case 'corporate-wifi':
        return getCorporateWifiData()
      case 'corporate-wired':
        return getCorporateWiredData()
      case 'guest-access':
        return getGuestAccessData()
      case 'radsec-proxy':
        return getRadsecProxyData()
      case 'fortigate-tacacs':
        return getFortigateTacacsData()
      case 'palo-alto-tacacs':
        return getPaloAltoTacacsData()
      case 'palo-alto-userid':
        return getPaloAltoUserIdData()
      case 'fortigate-fsso':
        return getFortigateFssoData()
      default:
        return getCorporateWifiData()
    }
  }

  const getCorporateWifiData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'laptop',
        type: 'device',
        label: 'Corporate Laptop',
        description: 'Windows 11 device with certificate',
        x: 100,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['ap'],
        details: {
          model: 'Surface Laptop',
          protocols: ['802.1X', 'EAP-TLS'],
          certificates: ['User Certificate', 'Machine Certificate']
        }
      },
      {
        id: 'ap',
        type: 'network',
        label: 'Wireless AP',
        description: 'Aruba Access Point',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Aruba',
        connections: ['switch', 'laptop'],
        details: {
          model: 'AP-515',
          ip: '192.168.1.10',
          protocols: ['802.11ax', '802.1X']
        }
      },
      {
        id: 'switch',
        type: 'network',
        label: 'Core Switch',
        description: 'Aruba CX Switch',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Aruba',
        connections: ['ap', 'portnox-cloud'],
        details: {
          model: 'CX 6300',
          ip: '192.168.1.1',
          protocols: ['RADIUS', 'RADSEC']
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'NAC Policy Engine',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['switch', 'azure-ad'],
        details: {
          version: '20.0',
          protocols: ['RADIUS', 'LDAP', 'SCEP'],
          policies: ['Corporate Policy', 'Guest Policy', 'IoT Policy']
        }
      },
      {
        id: 'azure-ad',
        type: 'cloud',
        label: 'Azure AD',
        description: 'Identity Provider',
        x: 900,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['portnox-cloud'],
        details: {
          protocols: ['LDAP', 'SAML', 'OAuth'],
          certificates: ['CA Certificate']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'laptop-ap',
        from: 'laptop',
        to: 'ap',
        type: 'wifi',
        label: '802.1X EAP-TLS',
        status: 'active',
        encrypted: true
      },
      {
        id: 'ap-switch',
        from: 'ap',
        to: 'switch',
        type: 'ethernet',
        label: 'RADIUS Request',
        status: 'active',
        encrypted: false
      },
      {
        id: 'switch-portnox',
        from: 'switch',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'RADSEC (TLS)',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-azure',
        from: 'portnox-cloud',
        to: 'azure-ad',
        type: 'ldap',
        label: 'LDAP Query',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getCorporateWiredData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'desktop',
        type: 'device',
        label: 'Corporate Desktop',
        description: 'Windows 11 workstation',
        x: 100,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['switch'],
        details: {
          model: 'Dell OptiPlex',
          protocols: ['802.1X', 'EAP-TLS'],
          certificates: ['Machine Certificate']
        }
      },
      {
        id: 'switch',
        type: 'network',
        label: 'Access Switch',
        description: 'Cisco Catalyst Switch',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Cisco',
        connections: ['desktop', 'core-switch'],
        details: {
          model: 'C9300-24T',
          ip: '192.168.1.20',
          protocols: ['802.1X', 'RADIUS']
        }
      },
      {
        id: 'core-switch',
        type: 'network',
        label: 'Core Switch',
        description: 'Distribution Layer',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Cisco',
        connections: ['switch', 'portnox-cloud'],
        details: {
          model: 'C9500-32C',
          ip: '192.168.1.1'
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'NAC Authentication',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['core-switch', 'azure-ad'],
        details: {
          version: '20.0',
          protocols: ['RADIUS', 'LDAP']
        }
      },
      {
        id: 'azure-ad',
        type: 'cloud',
        label: 'Azure AD',
        description: 'Directory Services',
        x: 900,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['portnox-cloud'],
        details: {
          protocols: ['LDAP', 'SAML']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'desktop-switch',
        from: 'desktop',
        to: 'switch',
        type: 'ethernet',
        label: '802.1X Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'switch-core',
        from: 'switch',
        to: 'core-switch',
        type: 'ethernet',
        label: 'RADIUS Proxy',
        status: 'active',
        encrypted: false
      },
      {
        id: 'core-portnox',
        from: 'core-switch',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'RADSEC',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-azure',
        from: 'portnox-cloud',
        to: 'azure-ad',
        type: 'ldap',
        label: 'User Lookup',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getGuestAccessData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'guest-device',
        type: 'device',
        label: 'Guest Device',
        description: 'Personal smartphone',
        x: 100,
        y: 200,
        status: 'warning',
        connections: ['guest-ap'],
        details: {
          model: 'iPhone/Android',
          protocols: ['Captive Portal']
        }
      },
      {
        id: 'guest-ap',
        type: 'network',
        label: 'Guest AP',
        description: 'Isolated guest network',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Aruba',
        connections: ['guest-device', 'guest-controller'],
        details: {
          model: 'AP-515',
          protocols: ['Captive Portal']
        }
      },
      {
        id: 'guest-controller',
        type: 'network',
        label: 'Guest Controller',
        description: 'Captive portal controller',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['guest-ap', 'portnox-cloud'],
        details: {
          protocols: ['HTTP/HTTPS', 'RADIUS']
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'Guest management',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['guest-controller'],
        details: {
          policies: ['Guest Policy', 'Time Limits', 'Bandwidth Limits']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'guest-ap-conn',
        from: 'guest-device',
        to: 'guest-ap',
        type: 'wifi',
        label: 'Guest SSID',
        status: 'active',
        encrypted: false
      },
      {
        id: 'ap-controller',
        from: 'guest-ap',
        to: 'guest-controller',
        type: 'https',
        label: 'Portal Redirect',
        status: 'active',
        encrypted: true
      },
      {
        id: 'controller-cloud',
        from: 'guest-controller',
        to: 'portnox-cloud',
        type: 'https',
        label: 'Policy Check',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getRadsecProxyData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'client',
        type: 'device',
        label: 'Client Device',
        description: 'Authenticated endpoint',
        x: 100,
        y: 200,
        status: 'active',
        connections: ['nas'],
        details: {
          protocols: ['802.1X', 'EAP-TLS']
        }
      },
      {
        id: 'nas',
        type: 'network',
        label: 'Network Access Server',
        description: 'Switch/AP with RADIUS client',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Aruba',
        connections: ['client', 'radsec-proxy'],
        details: {
          protocols: ['RADIUS', 'RADSEC'],
          ip: '192.168.1.10'
        }
      },
      {
        id: 'radsec-proxy',
        type: 'server',
        label: 'RADSec Proxy',
        description: 'Secure RADIUS proxy server',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['nas', 'portnox-cloud'],
        details: {
          protocols: ['RADSEC', 'TLS 1.3'],
          ip: '10.0.1.100',
          version: 'LRAD 2.0'
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'Cloud-based NAC service',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['radsec-proxy'],
        details: {
          protocols: ['RADSEC', 'HTTPS', 'LDAP'],
          version: '20.0'
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'client-nas',
        from: 'client',
        to: 'nas',
        type: 'ethernet',
        label: '802.1X Request',
        status: 'active',
        encrypted: true
      },
      {
        id: 'nas-proxy',
        from: 'nas',
        to: 'radsec-proxy',
        type: 'radius',
        label: 'RADIUS (UDP)',
        status: 'active',
        encrypted: false
      },
      {
        id: 'proxy-cloud',
        from: 'radsec-proxy',
        to: 'portnox-cloud',
        type: 'tls',
        label: 'RADSEC (TLS)',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getFortigateTacacsData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        type: 'device',
        label: 'Network Admin',
        description: 'Administrator workstation',
        x: 100,
        y: 200,
        status: 'active',
        connections: ['fortigate'],
        details: {
          protocols: ['SSH', 'HTTPS']
        }
      },
      {
        id: 'fortigate',
        type: 'security',
        label: 'FortiGate NGFW',
        description: 'Next-generation firewall',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Fortinet',
        connections: ['admin', 'portnox-cloud'],
        details: {
          model: 'FortiGate 200F',
          protocols: ['TACACS+', 'HTTPS'],
          version: 'FortiOS 7.4'
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'TACACS+ authentication',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['fortigate', 'azure-ad'],
        details: {
          protocols: ['TACACS+', 'LDAP'],
          version: '20.0'
        }
      },
      {
        id: 'azure-ad',
        type: 'cloud',
        label: 'Azure AD',
        description: 'User directory',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['portnox-cloud'],
        details: {
          protocols: ['LDAP', 'SAML']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'admin-fortigate',
        from: 'admin',
        to: 'fortigate',
        type: 'https',
        label: 'Admin Login',
        status: 'active',
        encrypted: true
      },
      {
        id: 'fortigate-portnox',
        from: 'fortigate',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'TACACS+ Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-azure',
        from: 'portnox-cloud',
        to: 'azure-ad',
        type: 'ldap',
        label: 'User Lookup',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getPaloAltoTacacsData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        type: 'device',
        label: 'Security Admin',
        description: 'Administrator console',
        x: 100,
        y: 200,
        status: 'active',
        connections: ['palo-alto'],
        details: {
          protocols: ['SSH', 'HTTPS']
        }
      },
      {
        id: 'palo-alto',
        type: 'security',
        label: 'Palo Alto NGFW',
        description: 'Next-generation firewall',
        x: 300,
        y: 200,
        status: 'active',
        vendor: 'Palo Alto',
        connections: ['admin', 'portnox-cloud'],
        details: {
          model: 'PA-3220',
          protocols: ['TACACS+', 'HTTPS'],
          version: 'PAN-OS 11.0'
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'TACACS+ server',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['palo-alto', 'azure-ad'],
        details: {
          protocols: ['TACACS+', 'LDAP'],
          version: '20.0'
        }
      },
      {
        id: 'azure-ad',
        type: 'cloud',
        label: 'Azure AD',
        description: 'Identity provider',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Microsoft',
        connections: ['portnox-cloud'],
        details: {
          protocols: ['LDAP', 'SAML']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'admin-palo',
        from: 'admin',
        to: 'palo-alto',
        type: 'https',
        label: 'Management',
        status: 'active',
        encrypted: true
      },
      {
        id: 'palo-portnox',
        from: 'palo-alto',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'TACACS+ Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-azure',
        from: 'portnox-cloud',
        to: 'azure-ad',
        type: 'ldap',
        label: 'Directory Query',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getPaloAltoUserIdData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'user-device',
        type: 'device',
        label: 'User Device',
        description: 'Authenticated endpoint',
        x: 100,
        y: 200,
        status: 'active',
        connections: ['switch'],
        details: {
          protocols: ['802.1X']
        }
      },
      {
        id: 'switch',
        type: 'network',
        label: 'Access Switch',
        description: 'Network access point',
        x: 300,
        y: 200,
        status: 'active',
        connections: ['user-device', 'portnox-cloud'],
        details: {
          protocols: ['RADIUS', '802.1X']
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'NAC with User-ID integration',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['switch', 'palo-alto'],
        details: {
          protocols: ['RADIUS', 'User-ID API'],
          version: '20.0'
        }
      },
      {
        id: 'palo-alto',
        type: 'security',
        label: 'Palo Alto NGFW',
        description: 'Identity-aware firewall',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Palo Alto',
        connections: ['portnox-cloud'],
        details: {
          model: 'PA-5220',
          protocols: ['User-ID', 'XML API'],
          version: 'PAN-OS 11.0'
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'device-switch',
        from: 'user-device',
        to: 'switch',
        type: 'ethernet',
        label: '802.1X Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'switch-portnox',
        from: 'switch',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'RADIUS Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-palo',
        from: 'portnox-cloud',
        to: 'palo-alto',
        type: 'https',
        label: 'User-ID Mapping',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getFortigateFssoData = () => {
    const nodes: DiagramNode[] = [
      {
        id: 'user-device',
        type: 'device',
        label: 'Corporate Device',
        description: 'Domain-joined workstation',
        x: 100,
        y: 200,
        status: 'active',
        connections: ['switch'],
        details: {
          protocols: ['802.1X', 'Kerberos']
        }
      },
      {
        id: 'switch',
        type: 'network',
        label: 'Network Switch',
        description: 'Access layer switch',
        x: 300,
        y: 200,
        status: 'active',
        connections: ['user-device', 'portnox-cloud'],
        details: {
          protocols: ['RADIUS', '802.1X']
        }
      },
      {
        id: 'portnox-cloud',
        type: 'cloud',
        label: 'Portnox Cloud',
        description: 'NAC with FSSO integration',
        x: 500,
        y: 200,
        status: 'active',
        vendor: 'Portnox',
        connections: ['switch', 'fortigate'],
        details: {
          protocols: ['RADIUS', 'FSSO'],
          version: '20.0'
        }
      },
      {
        id: 'fortigate',
        type: 'security',
        label: 'FortiGate NGFW',
        description: 'FSSO-enabled firewall',
        x: 700,
        y: 200,
        status: 'active',
        vendor: 'Fortinet',
        connections: ['portnox-cloud'],
        details: {
          model: 'FortiGate 600F',
          protocols: ['FSSO', 'HTTPS'],
          version: 'FortiOS 7.4'
        }
      }
    ]

    const connections: DiagramConnection[] = [
      {
        id: 'device-switch',
        from: 'user-device',
        to: 'switch',
        type: 'ethernet',
        label: 'Network Access',
        status: 'active',
        encrypted: true
      },
      {
        id: 'switch-portnox',
        from: 'switch',
        to: 'portnox-cloud',
        type: 'radius',
        label: 'RADIUS Auth',
        status: 'active',
        encrypted: true
      },
      {
        id: 'portnox-fortigate',
        from: 'portnox-cloud',
        to: 'fortigate',
        type: 'https',
        label: 'FSSO Login Event',
        status: 'active',
        encrypted: true
      }
    ]

    return { nodes, connections }
  }

  const getNodeIcon = (node: DiagramNode) => {
    switch (node.type) {
      case 'device':
        if (node.label.toLowerCase().includes('laptop') || node.label.toLowerCase().includes('desktop')) {
          return <Monitor className="h-6 w-6" />
        }
        if (node.label.toLowerCase().includes('phone') || node.label.toLowerCase().includes('mobile')) {
          return <Smartphone className="h-6 w-6" />
        }
        return <Monitor className="h-6 w-6" />
      case 'network':
        if (node.label.toLowerCase().includes('ap') || node.label.toLowerCase().includes('wireless')) {
          return <Wifi className="h-6 w-6" />
        }
        return <Router className="h-6 w-6" />
      case 'server':
        return <Server className="h-6 w-6" />
      case 'cloud':
        return <Cloud className="h-6 w-6" />
      case 'security':
        return <Shield className="h-6 w-6" />
      default:
        return <Server className="h-6 w-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 border-green-500 bg-green-50'
      case 'warning':
        return 'text-yellow-500 border-yellow-500 bg-yellow-50'
      case 'error':
        return 'text-red-500 border-red-500 bg-red-50'
      default:
        return 'text-gray-500 border-gray-500 bg-gray-50'
    }
  }

  const getVendorColor = (vendor?: string) => {
    switch (vendor?.toLowerCase()) {
      case 'portnox':
        return 'bg-[#00c8d7] text-white'
      case 'cisco':
        return 'bg-blue-600 text-white'
      case 'aruba':
        return 'bg-orange-500 text-white'
      case 'microsoft':
        return 'bg-blue-500 text-white'
      case 'fortinet':
        return 'bg-red-600 text-white'
      case 'palo alto':
        return 'bg-orange-600 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const { nodes, connections } = getDiagramData(type)

  return (
    <TooltipProvider>
      <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border overflow-hidden">
        {/* Animation Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isAnimated}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnimationStep(0)}
            disabled={!isAnimated}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Badge variant="outline">
            Step {animationStep + 1} of {getAnimationSteps(type)}
          </Badge>
        </div>

        {/* SVG Diagram */}
        <svg className="w-full h-full" viewBox="0 0 1000 400">
          {/* Connections */}
          {connections.map((connection) => {
            const fromNode = nodes.find(n => n.id === connection.from)
            const toNode = nodes.find(n => n.id === connection.to)
            if (!fromNode || !toNode) return null

            const isActive = isAnimated ? animationStep >= connections.indexOf(connection) : true

            return (
              <g key={connection.id}>
                <line
                  x1={fromNode.x + 50}
                  y1={fromNode.y + 25}
                  x2={toNode.x + 50}
                  y2={toNode.y + 25}
                  stroke={isActive ? (connection.encrypted ? '#10b981' : '#6b7280') : '#d1d5db'}
                  strokeWidth="3"
                  strokeDasharray={connection.encrypted ? '0' : '5,5'}
                  className={isActive ? 'animate-pulse' : ''}
                />
                {connection.encrypted && (
                  <Lock
                    className="h-4 w-4 text-green-500"
                    style={{
                      position: 'absolute',
                      left: (fromNode.x + toNode.x) / 2 + 40,
                      top: (fromNode.y + toNode.y) / 2 + 15
                    }}
                  />
                )}
                <text
                  x={(fromNode.x + toNode.x) / 2 + 50}
                  y={(fromNode.y + toNode.y) / 2 + 10}
                  fill="#374151"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {connection.label}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = isAnimated ? animationStep >= nodes.indexOf(node) : true
            const isSelected = selectedNode === node.id

            return (
              <g key={node.id}>
                <foreignObject
                  x={node.x}
                  y={node.y}
                  width="100"
                  height="50"
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          w-full h-full rounded-lg border-2 p-2 transition-all duration-300
                          ${getStatusColor(node.status)}
                          ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
                          ${isActive ? 'opacity-100' : 'opacity-30'}
                          hover:scale-105 hover:shadow-lg
                        `}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {getNodeIcon(node)}
                        </div>
                        <div className="text-xs font-medium text-center truncate">
                          {node.label}
                        </div>
                        {node.vendor && (
                          <div className={`text-xs px-1 rounded text-center mt-1 ${getVendorColor(node.vendor)}`}>
                            {node.vendor}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="font-semibold">{node.label}</div>
                        <div className="text-sm">{node.description}</div>
                        {node.details.model && (
                          <div className="text-xs">Model: {node.details.model}</div>
                        )}
                        {node.details.ip && (
                          <div className="text-xs">IP: {node.details.ip}</div>
                        )}
                        {node.details.protocols && (
                          <div className="text-xs">
                            Protocols: {node.details.protocols.join(', ')}
                          </div>
                        )}
                        {node.details.version && (
                          <div className="text-xs">Version: {node.details.version}</div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </foreignObject>
              </g>
            )
          })}
        </svg>

        {/* Node Details Panel */}
        {selectedNode && (
          <Card className="absolute bottom-4 left-4 w-80 max-h-60 overflow-y-auto">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getNodeIcon(nodes.find(n => n.id === selectedNode)!)}
                  <div>
                    <div className="font-semibold text-sm">
                      {nodes.find(n => n.id === selectedNode)?.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nodes.find(n => n.id === selectedNode)?.description}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode)
                if (!node) return null
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(node.status)}>
                        {node.status.toUpperCase()}
                      </Badge>
                      {node.vendor && (
                        <Badge className={getVendorColor(node.vendor)}>
                          {node.vendor}
                        </Badge>
                      )}
                    </div>
                    
                    {node.details.model && (
                      <div className="text-sm">
                        <span className="font-medium">Model:</span> {node.details.model}
                      </div>
                    )}
                    
                    {node.details.ip && (
                      <div className="text-sm">
                        <span className="font-medium">IP Address:</span> {node.details.ip}
                      </div>
                    )}
                    
                    {node.details.version && (
                      <div className="text-sm">
                        <span className="font-medium">Version:</span> {node.details.version}
                      </div>
                    )}
                    
                    {node.details.protocols && node.details.protocols.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Protocols:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {node.details.protocols.map((protocol, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {protocol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {node.details.certificates && node.details.certificates.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Certificates:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {node.details.certificates.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Key className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {node.details.policies && node.details.policies.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Policies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {node.details.policies.map((policy, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              {policy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <span className="font-medium">Connections:</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        Connected to: {node.connections.map(connId => 
                          nodes.find(n => n.id === connId)?.label
                        ).filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Diagram Title */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h3 className="font-semibold text-lg text-gray-800">
              {diagrams.find(d => d.id === type)?.name || 'Network Diagram'}
            </h3>
            <p className="text-sm text-gray-600">
              {diagrams.find(d => d.id === type)?.description || 'Interactive network architecture'}
            </p>
          </div>
        </div>

        {/* Animation Progress */}
        {isAnimated && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-[#00c8d7]" />
                <div className="text-sm font-medium">
                  Authentication Flow
                </div>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-[#00c8d7] rounded-full transition-all duration-500"
                  style={{ width: `${((animationStep + 1) / getAnimationSteps(type)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
