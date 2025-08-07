'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
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
  vendor?: string
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
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4)
    }, 2000 / animationSpeed)

    return () => clearInterval(interval)
  }, [animationSpeed])

  const getDiagramData = () => {
    switch (view) {
      case 'complete':
        return getCompleteArchitecture()
      case 'auth-flow':
        return getAuthFlowDiagram()
      case 'pki':
        return getPKIDiagram()
      case 'policies':
        return getPolicyDiagram()
      case 'connectivity':
        return getConnectivityDiagram()
      case 'intune':
        return getIntuneDiagram()
      case 'onboarding':
        return getOnboardingDiagram()
      case 'radsec-proxy':
        return getRADSecProxyDiagram()
      case 'fortigate-tacacs':
        return getFortigateTacacsDiagram()
      case 'palo-tacacs':
        return getPaloTacacsDiagram()
      case 'palo-userid':
        return getPaloUserIDDiagram()
      case 'fortigate-fsso':
        return getFortigateFSSODiagram()
      case 'ubiquiti-wireless':
        return getUbiquitiWirelessDiagram()
      case 'mikrotik-wireless':
        return getMikroTikWirelessDiagram()
      case 'meraki-wireless':
        return getMerakiWirelessDiagram()
      case 'mist-wireless':
        return getMistWirelessDiagram()
      case 'cambium-wireless':
        return getCambiumWirelessDiagram()
      default:
        return getCompleteArchitecture()
    }
  }

  const getCompleteArchitecture = () => ({
    title: 'Complete Zero Trust NAC Architecture',
    components: [
      { id: 'cloud', type: 'cloud', label: 'Portnox Cloud', x: 600, y: 100, color: '#00c8d7' },
      { id: 'radius', type: 'server', label: 'RADIUS Proxy', x: 400, y: 200, color: '#4CAF50' },
      { id: 'switch', type: 'network', label: `${networkVendor.toUpperCase()} Switch`, x: 200, y: 300, color: '#FF9800' },
      { id: 'ap', type: 'wireless', label: `${networkVendor.toUpperCase()} AP`, x: 600, y: 300, color: '#FF9800' },
      { id: 'device1', type: 'device', label: 'Managed Device', x: 100, y: 400, color: '#2196F3' },
      { id: 'device2', type: 'device', label: 'BYOD Device', x: 700, y: 400, color: '#9C27B0' },
      { id: 'ad', type: 'identity', label: 'Active Directory', x: 800, y: 200, color: '#607D8B' },
      { id: 'intune', type: 'mdm', label: 'Microsoft Intune', x: 1000, y: 200, color: '#3F51B5' }
    ],
    connections: [
      { from: 'cloud', to: 'radius', type: 'secure', animated: true },
      { from: 'radius', to: 'switch', type: 'radius', animated: animationPhase === 1 },
      { from: 'radius', to: 'ap', type: 'radius', animated: animationPhase === 2 },
      { from: 'switch', to: 'device1', type: 'wired', animated: animationPhase === 3 },
      { from: 'ap', to: 'device2', type: 'wireless', animated: animationPhase === 0 },
      { from: 'cloud', to: 'ad', type: 'integration', animated: false },
      { from: 'cloud', to: 'intune', type: 'integration', animated: false }
    ]
  })

  const getRADSecProxyDiagram = () => ({
    title: 'RADSec Proxy Architecture - Simplified & Secure',
    components: [
      { id: 'device1', type: 'device', label: 'Corporate Device', x: 100, y: 250, color: '#2196F3' },
      { id: 'device2', type: 'device', label: 'BYOD Device', x: 100, y: 350, color: '#9C27B0' },
      { id: 'switch', type: 'network', label: 'Network Switch', x: 250, y: 250, color: '#FF9800' },
      { id: 'ap', type: 'wireless', label: 'Wireless AP', x: 250, y: 350, color: '#4CAF50' },
      { id: 'radsec-proxy', type: 'server', label: 'RADSec Proxy', x: 450, y: 300, color: '#00c8d7' },
      { id: 'internet', type: 'cloud', label: 'Internet/WAN', x: 650, y: 300, color: '#FFC107' },
      { id: 'portnox-cloud', type: 'cloud', label: 'Portnox Cloud', x: 850, y: 250, color: '#00c8d7' },
      { id: 'radius-server', type: 'server', label: 'Cloud RADIUS', x: 850, y: 350, color: '#4CAF50' },
      { id: 'policy-engine', type: 'engine', label: 'Policy Engine', x: 850, y: 450, color: '#FF5722' }
    ],
    connections: [
      { from: 'device1', to: 'switch', type: 'wired', animated: animationPhase === 0, label: '802.1X' },
      { from: 'device2', to: 'ap', type: 'wireless', animated: animationPhase === 1, label: 'Wi-Fi Auth' },
      { from: 'switch', to: 'radsec-proxy', type: 'radius', animated: animationPhase === 2, label: 'RADIUS' },
      { from: 'ap', to: 'radsec-proxy', type: 'radius', animated: animationPhase === 3, label: 'RADIUS' },
      { from: 'radsec-proxy', to: 'internet', type: 'secure', animated: true, label: 'RADSec/TLS' },
      { from: 'internet', to: 'portnox-cloud', type: 'secure', animated: true, label: 'Encrypted' },
      { from: 'portnox-cloud', to: 'radius-server', type: 'internal', animated: false },
      { from: 'portnox-cloud', to: 'policy-engine', type: 'internal', animated: false }
    ]
  })

  const getAuthFlowDiagram = () => ({
    title: '802.1X Authentication Flow',
    components: [
      { id: 'device', type: 'device', label: 'Endpoint Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'switch', type: 'network', label: 'Network Switch', x: 300, y: 300, color: '#FF9800' },
      { id: 'radius', type: 'server', label: 'RADIUS Server', x: 500, y: 300, color: '#4CAF50' },
      { id: 'ad', type: 'identity', label: 'Active Directory', x: 700, y: 300, color: '#607D8B' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 300, color: '#00c8d7' }
    ],
    connections: [
      { from: 'device', to: 'switch', type: 'auth-request', animated: animationPhase === 0, label: '1. EAP Start' },
      { from: 'switch', to: 'radius', type: 'radius', animated: animationPhase === 1, label: '2. Access-Request' },
      { from: 'radius', to: 'ad', type: 'ldap', animated: animationPhase === 2, label: '3. LDAP Query' },
      { from: 'radius', to: 'portnox', type: 'policy', animated: animationPhase === 3, label: '4. Policy Check' }
    ]
  })

  const getPKIDiagram = () => ({
    title: 'PKI Infrastructure',
    components: [
      { id: 'root-ca', type: 'certificate', label: 'Root CA', x: 500, y: 100, color: '#E91E63' },
      { id: 'issuing-ca', type: 'certificate', label: 'Issuing CA', x: 500, y: 200, color: '#E91E63' },
      { id: 'portnox-ca', type: 'certificate', label: 'Portnox CA', x: 300, y: 300, color: '#00c8d7' },
      { id: 'scep', type: 'protocol', label: 'SCEP Server', x: 700, y: 300, color: '#4CAF50' },
      { id: 'device-cert', type: 'certificate', label: 'Device Certificate', x: 200, y: 400, color: '#2196F3' },
      { id: 'user-cert', type: 'certificate', label: 'User Certificate', x: 800, y: 400, color: '#FF9800' }
    ],
    connections: [
      { from: 'root-ca', to: 'issuing-ca', type: 'trust', animated: false },
      { from: 'issuing-ca', to: 'portnox-ca', type: 'trust', animated: false },
      { from: 'issuing-ca', to: 'scep', type: 'trust', animated: false },
      { from: 'portnox-ca', to: 'device-cert', type: 'issue', animated: animationPhase === 0 },
      { from: 'scep', to: 'user-cert', type: 'issue', animated: animationPhase === 1 }
    ]
  })

  const getPolicyDiagram = () => ({
    title: 'Policy Framework',
    components: [
      { id: 'policy-engine', type: 'engine', label: 'Policy Engine', x: 500, y: 200, color: '#00c8d7' },
      { id: 'device-policy', type: 'policy', label: 'Device Policies', x: 200, y: 300, color: '#4CAF50' },
      { id: 'user-policy', type: 'policy', label: 'User Policies', x: 500, y: 300, color: '#FF9800' },
      { id: 'network-policy', type: 'policy', label: 'Network Policies', x: 800, y: 300, color: '#9C27B0' },
      { id: 'compliance', type: 'compliance', label: 'Compliance Rules', x: 350, y: 400, color: '#F44336' },
      { id: 'enforcement', type: 'enforcement', label: 'Policy Enforcement', x: 650, y: 400, color: '#607D8B' }
    ],
    connections: [
      { from: 'policy-engine', to: 'device-policy', type: 'control', animated: animationPhase === 0 },
      { from: 'policy-engine', to: 'user-policy', type: 'control', animated: animationPhase === 1 },
      { from: 'policy-engine', to: 'network-policy', type: 'control', animated: animationPhase === 2 },
      { from: 'device-policy', to: 'compliance', type: 'check', animated: false },
      { from: 'network-policy', to: 'enforcement', type: 'apply', animated: false }
    ]
  })

  const getConnectivityDiagram = () => ({
    title: 'Multi-Cloud Connectivity',
    components: [
      { id: 'onprem', type: 'datacenter', label: 'On-Premises', x: 200, y: 300, color: '#607D8B' },
      { id: 'aws', type: 'cloud', label: 'AWS', x: 500, y: 200, color: '#FF9900' },
      { id: 'azure', type: 'cloud', label: 'Azure', x: 500, y: 400, color: '#0078D4' },
      { id: 'gcp', type: 'cloud', label: 'Google Cloud', x: 800, y: 300, color: '#4285F4' },
      { id: 'sdwan', type: 'network', label: `${connectivityType.toUpperCase()}`, x: 500, y: 300, color: '#00c8d7' }
    ],
    connections: [
      { from: 'onprem', to: 'sdwan', type: connectivityType, animated: animationPhase === 0 },
      { from: 'sdwan', to: 'aws', type: connectivityType, animated: animationPhase === 1 },
      { from: 'sdwan', to: 'azure', type: connectivityType, animated: animationPhase === 2 },
      { from: 'sdwan', to: 'gcp', type: connectivityType, animated: animationPhase === 3 }
    ]
  })

  const getIntuneDiagram = () => ({
    title: 'Microsoft Intune Integration',
    components: [
      { id: 'intune', type: 'mdm', label: 'Microsoft Intune', x: 500, y: 100, color: '#3F51B5' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 500, y: 250, color: '#00c8d7' },
      { id: 'compliance', type: 'compliance', label: 'Compliance Policies', x: 300, y: 400, color: '#4CAF50' },
      { id: 'enrollment', type: 'process', label: 'Device Enrollment', x: 700, y: 400, color: '#FF9800' },
      { id: 'windows', type: 'device', label: 'Windows Device', x: 200, y: 500, color: '#2196F3' },
      { id: 'ios', type: 'device', label: 'iOS Device', x: 500, y: 500, color: '#9C27B0' },
      { id: 'android', type: 'device', label: 'Android Device', x: 800, y: 500, color: '#4CAF50' }
    ],
    connections: [
      { from: 'intune', to: 'portnox', type: 'integration', animated: false },
      { from: 'portnox', to: 'compliance', type: 'sync', animated: animationPhase === 0 },
      { from: 'portnox', to: 'enrollment', type: 'sync', animated: animationPhase === 1 },
      { from: 'compliance', to: 'windows', type: 'policy', animated: animationPhase === 2 },
      { from: 'enrollment', to: 'ios', type: 'certificate', animated: animationPhase === 3 },
      { from: 'enrollment', to: 'android', type: 'certificate', animated: animationPhase === 0 }
    ]
  })

  const getOnboardingDiagram = () => ({
    title: 'Device Onboarding Workflow',
    components: [
      { id: 'device', type: 'device', label: 'New Device', x: 100, y: 300, color: '#9E9E9E' },
      { id: 'captive', type: 'portal', label: 'Captive Portal', x: 300, y: 200, color: '#FF9800' },
      { id: 'enrollment', type: 'process', label: 'Enrollment Service', x: 500, y: 200, color: '#4CAF50' },
      { id: 'certificate', type: 'certificate', label: 'Certificate Issuance', x: 700, y: 200, color: '#E91E63' },
      { id: 'provisioned', type: 'device', label: 'Provisioned Device', x: 900, y: 300, color: '#2196F3' },
      { id: 'network', type: 'network', label: 'Corporate Network', x: 500, y: 400, color: '#607D8B' }
    ],
    connections: [
      { from: 'device', to: 'captive', type: 'redirect', animated: animationPhase === 0 },
      { from: 'captive', to: 'enrollment', type: 'authenticate', animated: animationPhase === 1 },
      { from: 'enrollment', to: 'certificate', type: 'request', animated: animationPhase === 2 },
      { from: 'certificate', to: 'provisioned', type: 'install', animated: animationPhase === 3 },
      { from: 'provisioned', to: 'network', type: 'access', animated: animationPhase === 0 }
    ]
  })

  const getFortigateTacacsDiagram = () => ({
    title: 'FortiGate TACACS+ Integration',
    components: [
      { id: 'admin', type: 'user', label: 'Network Admin', x: 100, y: 300, color: '#2196F3' },
      { id: 'fortigate', type: 'firewall', label: 'FortiGate Firewall', x: 300, y: 300, color: '#FF4444' },
      { id: 'tacacs', type: 'server', label: 'TACACS+ Server', x: 500, y: 300, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 700, y: 200, color: '#00c8d7' },
      { id: 'ad', type: 'identity', label: 'Active Directory', x: 700, y: 400, color: '#607D8B' }
    ],
    connections: [
      { from: 'admin', to: 'fortigate', type: 'ssh', animated: animationPhase === 0, label: 'SSH/HTTPS Login' },
      { from: 'fortigate', to: 'tacacs', type: 'tacacs', animated: animationPhase === 1, label: 'TACACS+ Auth' },
      { from: 'tacacs', to: 'portnox', type: 'policy', animated: animationPhase === 2, label: 'Policy Check' },
      { from: 'tacacs', to: 'ad', type: 'ldap', animated: animationPhase === 3, label: 'User Lookup' }
    ]
  })

  const getPaloTacacsDiagram = () => ({
    title: 'Palo Alto TACACS+ Integration',
    components: [
      { id: 'admin', type: 'user', label: 'Security Admin', x: 100, y: 300, color: '#2196F3' },
      { id: 'palo', type: 'firewall', label: 'Palo Alto NGFW', x: 300, y: 300, color: '#FF6B35' },
      { id: 'tacacs', type: 'server', label: 'TACACS+ Server', x: 500, y: 300, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 700, y: 200, color: '#00c8d7' },
      { id: 'entra', type: 'identity', label: 'Microsoft Entra ID', x: 700, y: 400, color: '#0078D4' }
    ],
    connections: [
      { from: 'admin', to: 'palo', type: 'web', animated: animationPhase === 0, label: 'Web UI Access' },
      { from: 'palo', to: 'tacacs', type: 'tacacs', animated: animationPhase === 1, label: 'TACACS+ Request' },
      { from: 'tacacs', to: 'portnox', type: 'authorization', animated: animationPhase === 2, label: 'Authorization' },
      { from: 'tacacs', to: 'entra', type: 'oauth', animated: animationPhase === 3, label: 'OAuth/SAML' }
    ]
  })

  const getPaloUserIDDiagram = () => ({
    title: 'Palo Alto User-ID Integration',
    components: [
      { id: 'user', type: 'user', label: 'Domain User', x: 100, y: 300, color: '#2196F3' },
      { id: 'switch', type: 'network', label: 'Network Switch', x: 300, y: 300, color: '#FF9800' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 500, y: 200, color: '#00c8d7' },
      { id: 'palo', type: 'firewall', label: 'Palo Alto NGFW', x: 700, y: 300, color: '#FF6B35' },
      { id: 'syslog', type: 'log', label: 'Syslog Messages', x: 500, y: 400, color: '#9C27B0' }
    ],
    connections: [
      { from: 'user', to: 'switch', type: 'auth', animated: animationPhase === 0, label: '802.1X Auth' },
      { from: 'switch', to: 'portnox', type: 'radius', animated: animationPhase === 1, label: 'RADIUS' },
      { from: 'portnox', to: 'syslog', type: 'log', animated: animationPhase === 2, label: 'User Mapping' },
      { from: 'syslog', to: 'palo', type: 'userid', animated: animationPhase === 3, label: 'User-ID Update' }
    ]
  })

  const getFortigateFSSODiagram = () => ({
    title: 'FortiGate FSSO Integration',
    components: [
      { id: 'user', type: 'user', label: 'Corporate User', x: 100, y: 300, color: '#2196F3' },
      { id: 'ap', type: 'wireless', label: 'Wireless AP', x: 300, y: 300, color: '#FF9800' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 500, y: 200, color: '#00c8d7' },
      { id: 'fortigate', type: 'firewall', label: 'FortiGate NGFW', x: 700, y: 300, color: '#FF4444' },
      { id: 'fsso', type: 'service', label: 'FSSO Agent', x: 500, y: 400, color: '#4CAF50' }
    ],
    connections: [
      { from: 'user', to: 'ap', type: 'wifi', animated: animationPhase === 0, label: 'Wi-Fi Auth' },
      { from: 'ap', to: 'portnox', type: 'radius', animated: animationPhase === 1, label: 'RADIUS' },
      { from: 'portnox', to: 'fsso', type: 'notification', animated: animationPhase === 2, label: 'Login Event' },
      { from: 'fsso', to: 'fortigate', type: 'fsso', animated: animationPhase === 3, label: 'FSSO Update' }
    ]
  })

  // New wireless vendor diagrams
  const getUbiquitiWirelessDiagram = () => ({
    title: 'Ubiquiti UniFi Wireless Integration',
    components: [
      { id: 'device', type: 'device', label: 'Mobile Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'unifi-ap', type: 'wireless', label: 'UniFi Access Point', x: 300, y: 300, color: '#0559C9' },
      { id: 'controller', type: 'controller', label: 'UniFi Controller', x: 500, y: 200, color: '#0559C9' },
      { id: 'radius', type: 'server', label: 'RADIUS Proxy', x: 700, y: 200, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 200, color: '#00c8d7' },
      { id: 'guest-portal', type: 'portal', label: 'Guest Portal', x: 500, y: 400, color: '#FF9800' }
    ],
    connections: [
      { from: 'device', to: 'unifi-ap', type: 'wifi', animated: animationPhase === 0, label: 'Wi-Fi Connect' },
      { from: 'unifi-ap', to: 'controller', type: 'capwap', animated: animationPhase === 1, label: 'CAPWAP' },
      { from: 'controller', to: 'radius', type: 'radius', animated: animationPhase === 2, label: 'RADIUS Auth' },
      { from: 'radius', to: 'portnox', type: 'cloud', animated: animationPhase === 3, label: 'Cloud Policy' },
      { from: 'controller', to: 'guest-portal', type: 'redirect', animated: false, label: 'Guest Access' }
    ]
  })

  const getMikroTikWirelessDiagram = () => ({
    title: 'MikroTik Wireless Integration',
    components: [
      { id: 'device', type: 'device', label: 'Client Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'mikrotik-ap', type: 'wireless', label: 'MikroTik AP', x: 300, y: 300, color: '#293239' },
      { id: 'routeros', type: 'router', label: 'RouterOS', x: 500, y: 200, color: '#293239' },
      { id: 'radius', type: 'server', label: 'RADIUS Server', x: 700, y: 200, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 200, color: '#00c8d7' },
      { id: 'hotspot', type: 'portal', label: 'HotSpot Portal', x: 500, y: 400, color: '#FF9800' }
    ],
    connections: [
      { from: 'device', to: 'mikrotik-ap', type: 'wifi', animated: animationPhase === 0, label: 'Wireless Auth' },
      { from: 'mikrotik-ap', to: 'routeros', type: 'internal', animated: animationPhase === 1, label: 'Internal' },
      { from: 'routeros', to: 'radius', type: 'radius', animated: animationPhase === 2, label: 'RADIUS' },
      { from: 'radius', to: 'portnox', type: 'policy', animated: animationPhase === 3, label: 'Policy Engine' },
      { from: 'routeros', to: 'hotspot', type: 'captive', animated: false, label: 'Captive Portal' }
    ]
  })

  const getMerakiWirelessDiagram = () => ({
    title: 'Cisco Meraki Wireless Integration',
    components: [
      { id: 'device', type: 'device', label: 'Wireless Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'meraki-ap', type: 'wireless', label: 'Meraki Access Point', x: 300, y: 300, color: '#00BCEB' },
      { id: 'meraki-cloud', type: 'cloud', label: 'Meraki Dashboard', x: 500, y: 200, color: '#00BCEB' },
      { id: 'radius', type: 'server', label: 'RADIUS Proxy', x: 700, y: 200, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 200, color: '#00c8d7' },
      { id: 'splash', type: 'portal', label: 'Splash Page', x: 500, y: 400, color: '#FF9800' }
    ],
    connections: [
      { from: 'device', to: 'meraki-ap', type: 'wifi', animated: animationPhase === 0, label: 'Wi-Fi Connect' },
      { from: 'meraki-ap', to: 'meraki-cloud', type: 'cloud', animated: animationPhase === 1, label: 'Cloud Managed' },
      { from: 'meraki-cloud', to: 'radius', type: 'radius', animated: animationPhase === 2, label: 'RADIUS Auth' },
      { from: 'radius', to: 'portnox', type: 'integration', animated: animationPhase === 3, label: 'NAC Integration' },
      { from: 'meraki-cloud', to: 'splash', type: 'redirect', animated: false, label: 'Splash Portal' }
    ]
  })

  const getMistWirelessDiagram = () => ({
    title: 'Juniper Mist Wireless Integration',
    components: [
      { id: 'device', type: 'device', label: 'IoT Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'mist-ap', type: 'wireless', label: 'Mist Access Point', x: 300, y: 300, color: '#00A9CE' },
      { id: 'mist-cloud', type: 'cloud', label: 'Mist AI Cloud', x: 500, y: 200, color: '#00A9CE' },
      { id: 'radius', type: 'server', label: 'Cloud RADIUS', x: 700, y: 200, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 200, color: '#00c8d7' },
      { id: 'ai-engine', type: 'ai', label: 'Mist AI Engine', x: 500, y: 400, color: '#9C27B0' }
    ],
    connections: [
      { from: 'device', to: 'mist-ap', type: 'wifi', animated: animationPhase === 0, label: 'Wi-Fi 6E' },
      { from: 'mist-ap', to: 'mist-cloud', type: 'cloud', animated: animationPhase === 1, label: 'AI-Driven' },
      { from: 'mist-cloud', to: 'radius', type: 'radius', animated: animationPhase === 2, label: 'Cloud RADIUS' },
      { from: 'radius', to: 'portnox', type: 'policy', animated: animationPhase === 3, label: 'Dynamic Policy' },
      { from: 'mist-cloud', to: 'ai-engine', type: 'analytics', animated: false, label: 'AI Analytics' }
    ]
  })

  const getCambiumWirelessDiagram = () => ({
    title: 'Cambium Networks Wireless Integration',
    components: [
      { id: 'device', type: 'device', label: 'Enterprise Device', x: 100, y: 300, color: '#2196F3' },
      { id: 'cambium-ap', type: 'wireless', label: 'Cambium Access Point', x: 300, y: 300, color: '#E31E24' },
      { id: 'cnmaestro', type: 'controller', label: 'cnMaestro', x: 500, y: 200, color: '#E31E24' },
      { id: 'radius', type: 'server', label: 'RADIUS Server', x: 700, y: 200, color: '#4CAF50' },
      { id: 'portnox', type: 'cloud', label: 'Portnox Cloud', x: 900, y: 200, color: '#00c8d7' },
      { id: 'pmp', type: 'backhaul', label: 'PMP Backhaul', x: 500, y: 400, color: '#FF9800' }
    ],
    connections: [
      { from: 'device', to: 'cambium-ap', type: 'wifi', animated: animationPhase === 0, label: 'Wi-Fi 6' },
      { from: 'cambium-ap', to: 'cnmaestro', type: 'management', animated: animationPhase === 1, label: 'Cloud Mgmt' },
      { from: 'cnmaestro', to: 'radius', type: 'radius', animated: animationPhase === 2, label: 'RADIUS Auth' },
      { from: 'radius', to: 'portnox', type: 'nac', animated: animationPhase === 3, label: 'NAC Policy' },
      { from: 'cambium-ap', to: 'pmp', type: 'backhaul', animated: false, label: 'Wireless Backhaul' }
    ]
  })

  const renderComponent = (component: any) => {
    const getComponentIcon = (type: string) => {
      switch (type) {
        case 'cloud': return '☁️'
        case 'server': return '🖥️'
        case 'network': return '🔀'
        case 'wireless': return '📡'
        case 'device': return '💻'
        case 'identity': return '👤'
        case 'mdm': return '📱'
        case 'certificate': return '🔐'
        case 'firewall': return '🛡️'
        case 'controller': return '🎛️'
        case 'router': return '📶'
        case 'portal': return '🌐'
        case 'ai': return '🤖'
        case 'backhaul': return '📶'
        case 'engine': return '⚙️'
        case 'policy': return '📋'
        case 'compliance': return '✅'
        case 'enforcement': return '🚫'
        case 'user': return '👨‍💼'
        case 'log': return '📊'
        case 'service': return '🔧'
        case 'datacenter': return '🏢'
        case 'protocol': return '🔗'
        case 'process': return '⚡'
        default: return '⚙️'
      }
    }

    return (
      <g key={component.id}>
        <circle
          cx={component.x}
          cy={component.y}
          r="30"
          fill={component.color}
          stroke="#fff"
          strokeWidth="2"
          className="drop-shadow-lg"
        />
        <text
          x={component.x}
          y={component.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
        >
          {getComponentIcon(component.type)}
        </text>
        <text
          x={component.x}
          y={component.y + 50}
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          className="font-medium"
        >
          {component.label}
        </text>
      </g>
    )
  }

  const renderConnection = (connection: any, components: any[]) => {
    const fromComponent = components.find(c => c.id === connection.from)
    const toComponent = components.find(c => c.id === connection.to)
    
    if (!fromComponent || !toComponent) return null

    const getStrokeStyle = (type: string, animated: boolean) => {
      const baseStyle = {
        strokeWidth: animated ? 3 : 2,
        stroke: animated ? '#00c8d7' : '#9CA3AF'
      }

      if (animated) {
        return {
          ...baseStyle,
          strokeDasharray: '5,5',
          className: 'animate-pulse'
        }
      }

      return baseStyle
    }

    const style = getStrokeStyle(connection.type, connection.animated)

    return (
      <g key={`${connection.from}-${connection.to}`}>
        <line
          x1={fromComponent.x}
          y1={fromComponent.y}
          x2={toComponent.x}
          y2={toComponent.y}
          {...style}
          className={style.className}
        />
        {connection.label && (
          <text
            x={(fromComponent.x + toComponent.x) / 2}
            y={(fromComponent.y + toComponent.y) / 2 - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#6B7280"
            className="font-medium"
          >
            {connection.label}
          </text>
        )}
      </g>
    )
  }

  const diagramData = getDiagramData()

  return (
    <Card className="w-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">{diagramData.title}</h3>
        <div className="architecture-diagram flex justify-center">
          <svg width="1000" height="600" viewBox="0 0 1000 600" className="border rounded-lg bg-gray-50 dark:bg-gray-900">
            {diagramData.connections.map(connection => 
              renderConnection(connection, diagramData.components)
            )}
            {diagramData.components.map(component => 
              renderComponent(component)
            )}
          </svg>
        </div>
        
        {/* RADSec specific information */}
        {view === 'radsec-proxy' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              RADSec Architecture Benefits
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Simplified Design:</strong> No load balancers or Redis cache required</li>
              <li>• <strong>Direct Encryption:</strong> TLS encryption from proxy to cloud</li>
              <li>• <strong>Certificate Security:</strong> Mutual TLS authentication</li>
              <li>• <strong>High Availability:</strong> Built-in cloud redundancy</li>
              <li>• <strong>Reduced Complexity:</strong> Fewer components to manage and maintain</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
