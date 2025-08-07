'use client'

import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: number
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
      case 'fortigate-tacacs':
        return getDiagramData('fortigate-tacacs')
      case 'palo-tacacs':
        return getDiagramData('palo-alto-tacacs')
      case 'palo-userid':
        return getDiagramData('palo-alto-userid')
      case 'fortigate-fsso':
        return getDiagramData('fortigate-fsso')
      case 'cisco-tacacs':
        return getDiagramData('cisco-tacacs')
      case 'aruba-tacacs':
        return getDiagramData('aruba-tacacs')
      case 'juniper-tacacs':
        return getDiagramData('juniper-tacacs')
      case 'mist-tacacs':
        return getDiagramData('mist-tacacs')
      case 'meraki-tacacs':
        return getDiagramData('meraki-tacacs')
      case 'cambium-tacacs':
        return getDiagramData('cambium-tacacs')
      case 'hpe-tacacs':
        return getDiagramData('hpe-tacacs')
      case 'extreme-tacacs':
        return getDiagramData('extreme-tacacs')
      case 'ruckus-tacacs':
        return getDiagramData('ruckus-tacacs')
      case 'ubiquiti-tacacs':
        return getDiagramData('ubiquiti-tacacs')
      case 'mikrotik-tacacs':
        return getDiagramData('mikrotik-tacacs')
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
        id: 'radsec-proxy',
        x: 100, y: 250, width: 400, height: 120,
        label: `${cloudProvider.toUpperCase()} RADSec Proxy`,
        type: cloudProvider,
        color: cloudColor,
        description: `${cloudProvider.toUpperCase()} hosted RADSec proxy for secure RADIUS communication`
      },
      {
        id: 'connectivity',
        x: 100, y: 420, width: 400, height: 80,
        label: getConnectivityLabel(connectivityType),
        type: 'connectivity',
        color: '#f3e5f5',
        description: `${getConnectivityLabel(connectivityType)} network connectivity`
      },
      {
        id: 'site-infrastructure',
        x: 100, y: 550, width: 400, height: 120,
        label: `ABM Site - ${vendorLabel} Stack`,
        type: 'site',
        color: '#f3e5f5',
        description: `Physical location with ${vendorLabel} network infrastructure`
      },
      {
        id: 'intune',
        x: 750, y: 250, width: 300, height: 120,
        label: 'Microsoft Intune',
        type: 'intune',
        color: '#e1f5fe',
        description: 'MDM solution for certificate deployment and device configuration management'
      },
      {
        id: 'endpoints',
        x: 750, y: 450, width: 300, height: 180,
        label: 'Managed Endpoints',
        type: 'device',
        color: '#f5f5f5',
        description: 'Corporate devices with certificates deployed via Intune'
      }
    ]
  }

  const generateCompleteConnections = (): DiagramConnection[] => {
    return [
      { id: 'cloud-to-proxy', from: 'portnox-cloud', to: 'radsec-proxy', type: 'secure', label: 'RADSec/TLS' },
      { id: 'proxy-to-connectivity', from: 'radsec-proxy', to: 'connectivity', type: 'standard' },
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
        x: 50, y: 300, width: 120, height: 80,
        label: 'End Device',
        type: 'device',
        color: '#e8f5e9',
        description: 'User device attempting network access'
      },
      {
        id: 'nas',
        x: 220, y: 300, width: 150, height: 80,
        label: `${networkVendor.toUpperCase()} NAS`,
        type: 'network',
        color: '#e8f5e9',
        description: 'Network Access Server (Switch/AP)',
        vendor: networkVendor
      },
      {
        id: 'proxy',
        x: 420, y: 300, width: 180, height: 80,
        label: `RADSec Proxy`,
        type: cloudProvider,
        color: getCloudColor(cloudProvider),
        description: 'RADIUS over TLS proxy for secure communication'
      },
      {
        id: 'portnox',
        x: 650, y: 280, width: 200, height: 120,
        label: 'Portnox Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        description: 'Cloud NAC authentication engine'
      },
      {
        id: 'identity',
        x: 900, y: 300, width: 200, height: 80,
        label: 'Azure AD',
        type: 'identity',
        color: '#e3f2fd',
        description: 'Identity provider for user authentication'
      }
    ]
  }

  const generateAuthFlowConnections = (): DiagramConnection[] => {
    return [
      { id: 'device-to-nas', from: 'device', to: 'nas', type: 'standard', label: '1. EAP Start' },
      { id: 'nas-to-proxy', from: 'nas', to: 'proxy', type: 'standard', label: '2. RADIUS' },
      { id: 'proxy-to-portnox', from: 'proxy', to: 'portnox', type: 'secure', label: '3. RADSec' },
      { id: 'portnox-to-identity', from: 'portnox', to: 'identity', type: 'standard', label: '4. Auth Check' },
      { id: 'identity-to-portnox', from: 'identity', to: 'portnox', type: 'standard', label: '5. Response' },
      { id: 'portnox-to-proxy-return', from: 'portnox', to: 'proxy', type: 'secure', label: '6. Accept/Reject' },
      { id: 'proxy-to-nas-return', from: 'proxy', to: 'nas', type: 'standard', label: '7. RADIUS Response' },
      { id: 'nas-to-device-return', from: 'nas', to: 'device', type: 'standard', label: '8. EAP Success' }
    ]
  }

  const generatePKINodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-ca',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox Private CA',
        type: 'pki',
        color: '#e3f2fd',
        description: 'Private Certificate Authority for issuing X.509 certificates with 2048-bit RSA keys'
      },
      {
        id: 'scep-server',
        x: 150, y: 200, width: 180, height: 80,
        label: 'SCEP Server',
        type: 'cert',
        color: '#e8f5e9',
        description: 'Simple Certificate Enrollment Protocol server for automated certificate enrollment'
      },
      {
        id: 'ocsp-responder',
        x: 380, y: 200, width: 180, height: 80,
        label: 'OCSP Responder',
        type: 'cert',
        color: '#e8f5e9',
        description: 'Online Certificate Status Protocol for real-time certificate validation'
      },
      {
        id: 'crl-cdp',
        x: 610, y: 200, width: 180, height: 80,
        label: 'CRL Distribution',
        type: 'cert',
        color: '#e8f5e9',
        description: 'Certificate Revocation List distribution point for offline validation'
      },
      {
        id: 'key-escrow',
        x: 840, y: 200, width: 180, height: 80,
        label: 'Key Escrow',
        type: 'cert',
        color: '#fff3e0',
        description: 'Secure key recovery service for enterprise compliance requirements'
      },
      {
        id: 'intune-mdm',
        x: 150, y: 350, width: 180, height: 80,
        label: 'Intune MDM',
        type: 'mdm',
        color: '#e1f5fe',
        description: 'Microsoft Intune for automated certificate deployment to managed devices'
      },
      {
        id: 'corporate-devices',
        x: 380, y: 350, width: 180, height: 80,
        label: 'Corporate Devices',
        type: 'device',
        color: '#f5f5f5',
        description: 'Company-owned devices receiving user and device certificates'
      },
      {
        id: 'network-devices',
        x: 610, y: 350, width: 180, height: 80,
        label: 'Network Devices',
        type: 'network',
        color: '#f3e5f5',
        description: 'Switches and access points validating device certificates'
      },
      {
        id: 'certificate-store',
        x: 840, y: 350, width: 180, height: 80,
        label: 'Certificate Store',
        type: 'storage',
        color: '#ffeaa7',
        description: 'Centralized certificate repository with audit logging'
      }
    ]
  }

  const generatePKIConnections = (): DiagramConnection[] => {
    return [
      { id: 'ca-to-scep', from: 'portnox-ca', to: 'scep-server', type: 'standard', label: 'Issue Certs' },
      { id: 'ca-to-ocsp', from: 'portnox-ca', to: 'ocsp-responder', type: 'standard', label: 'Status Updates' },
      { id: 'ca-to-crl', from: 'portnox-ca', to: 'crl-cdp', type: 'standard', label: 'Revocation Lists' },
      { id: 'ca-to-escrow', from: 'portnox-ca', to: 'key-escrow', type: 'secure', label: 'Key Backup' },
      { id: 'ca-to-store', from: 'portnox-ca', to: 'certificate-store', type: 'standard', label: 'Archive' },
      { id: 'scep-to-intune', from: 'scep-server', to: 'intune-mdm', type: 'dashed', label: 'SCEP Profile' },
      { id: 'intune-to-devices', from: 'intune-mdm', to: 'corporate-devices', type: 'secure', label: 'Deploy Certs' },
      { id: 'devices-to-network', from: 'corporate-devices', to: 'network-devices', type: 'standard', label: '802.1X Auth' },
      { id: 'network-to-ocsp', from: 'network-devices', to: 'ocsp-responder', type: 'dashed', label: 'Verify Status' }
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
        description: 'Central policy management and decision engine with real-time evaluation'
      },
      {
        id: 'user-policies',
        x: 50, y: 200, width: 180, height: 100,
        label: 'User Policies',
        type: 'policy',
        color: '#d4edda',
        description: 'Identity-based policies: AD groups, roles, departments, and user attributes'
      },
      {
        id: 'device-policies',
        x: 280, y: 200, width: 180, height: 100,
        label: 'Device Policies',
        type: 'policy',
        color: '#cce5ff',
        description: 'Device-based policies: OS type, compliance status, certificate validity'
      },
      {
        id: 'network-policies',
        x: 510, y: 200, width: 180, height: 100,
        label: 'Network Policies',
        type: 'policy',
        color: '#fff3cd',
        description: 'Location-based policies: site, building, VLAN assignments, and network zones'
      },
      {
        id: 'time-policies',
        x: 740, y: 200, width: 180, height: 100,
        label: 'Time-Based Policies',
        type: 'policy',
        color: '#f8d7da',
        description: 'Temporal policies: business hours, maintenance windows, and access schedules'
      },
      {
        id: 'risk-policies',
        x: 970, y: 200, width: 180, height: 100,
        label: 'Risk Policies',
        type: 'policy',
        color: '#e2e3e5',
        description: 'Risk-based policies: threat intelligence, behavioral analysis, and anomaly detection'
      },
      {
        id: 'guest-policies',
        x: 165, y: 350, width: 180, height: 100,
        label: 'Guest Policies',
        type: 'policy',
        color: '#d1ecf1',
        description: 'Guest access policies: sponsor approval, time limits, and restricted access'
      },
      {
        id: 'iot-policies',
        x: 395, y: 350, width: 180, height: 100,
        label: 'IoT Policies',
        type: 'policy',
        color: '#fdeaa7',
        description: 'IoT device policies: MAC authentication, device profiling, and micro-segmentation'
      },
      {
        id: 'compliance-policies',
        x: 625, y: 350, width: 180, height: 100,
        label: 'Compliance Policies',
        type: 'policy',
        color: '#fadbd8',
        description: 'Regulatory compliance: HIPAA, PCI-DSS, SOX, and industry-specific requirements'
      },
      {
        id: 'quarantine-policies',
        x: 855, y: 350, width: 180, height: 100,
        label: 'Quarantine Policies',
        type: 'policy',
        color: '#ebdef0',
        description: 'Remediation policies: non-compliant devices, security violations, and isolation'
      }
    ]
  }

  const generatePolicyConnections = (): DiagramConnection[] => {
    return [
      { id: 'engine-to-user', from: 'policy-engine', to: 'user-policies', type: 'standard', label: 'Identity Check' },
      { id: 'engine-to-device', from: 'policy-engine', to: 'device-policies', type: 'standard', label: 'Device Check' },
      { id: 'engine-to-network', from: 'policy-engine', to: 'network-policies', type: 'standard', label: 'Location Check' },
      { id: 'engine-to-time', from: 'policy-engine', to: 'time-policies', type: 'standard', label: 'Time Check' },
      { id: 'engine-to-risk', from: 'policy-engine', to: 'risk-policies', type: 'standard', label: 'Risk Assessment' },
      { id: 'user-to-guest', from: 'user-policies', to: 'guest-policies', type: 'dashed', label: 'Guest Flow' },
      { id: 'device-to-iot', from: 'device-policies', to: 'iot-policies', type: 'dashed', label: 'IoT Flow' },
      { id: 'network-to-compliance', from: 'network-policies', to: 'compliance-policies', type: 'dashed', label: 'Compliance Check' },
      { id: 'risk-to-quarantine', from: 'risk-policies', to: 'quarantine-policies', type: 'secure', label: 'Quarantine Action' }
    ]
  }

  const generateConnectivityNodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-global',
        x: 500, y: 300, width: 300, height: 120,
        label: 'Portnox Global Cloud',
        type: 'cloud',
        color: '#e3f2fd',
        description: 'Global Portnox cloud infrastructure with regional presence'
      },
      {
        id: 'aws-us-east',
        x: 50, y: 100, width: 180, height: 80,
        label: 'AWS US-East',
        type: 'aws',
        color: '#fff3e0',
        description: 'AWS Virginia region RADSec proxy with multi-AZ deployment'
      },
      {
        id: 'aws-us-west',
        x: 280, y: 100, width: 180, height: 80,
        label: 'AWS US-West',
        type: 'aws',
        color: '#fff3e0',
        description: 'AWS California region RADSec proxy for west coast sites'
      },
      {
        id: 'azure-central',
        x: 620, y: 100, width: 180, height: 80,
        label: 'Azure Central US',
        type: 'azure',
        color: '#e1f5fe',
        description: 'Azure Central US region with Express Route connectivity'
      },
      {
        id: 'azure-europe',
        x: 850, y: 100, width: 180, height: 80,
        label: 'Azure Europe',
        type: 'azure',
        color: '#e1f5fe',
        description: 'Azure West Europe region for EMEA operations'
      },
      {
        id: 'gcp-americas',
        x: 165, y: 500, width: 180, height: 80,
        label: 'GCP Americas',
        type: 'gcp',
        color: '#e8f5e9',
        description: 'Google Cloud Americas region with global load balancing'
      },
      {
        id: 'gcp-apac',
        x: 395, y: 500, width: 180, height: 80,
        label: 'GCP APAC',
        type: 'gcp',
        color: '#e8f5e9',
        description: 'Google Cloud Asia-Pacific region for regional sites'
      },
      {
        id: 'edge-locations',
        x: 625, y: 500, width: 180, height: 80,
        label: 'Edge Locations',
        type: 'edge',
        color: '#f3e5f5',
        description: 'CDN edge locations for improved latency and performance'
      },
      {
        id: 'onprem-dc',
        x: 855, y: 500, width: 180, height: 80,
        label: 'On-Premises DC',
        type: 'onprem',
        color: '#ffeaa7',
        description: 'Customer data center with hybrid cloud connectivity'
      }
    ]
  }

  const generateConnectivityConnections = (): DiagramConnection[] => {
    return [
      { id: 'aws-east-to-global', from: 'aws-us-east', to: 'portnox-global', type: 'secure', label: 'Primary' },
      { id: 'aws-west-to-global', from: 'aws-us-west', to: 'portnox-global', type: 'secure', label: 'Secondary' },
      { id: 'azure-central-to-global', from: 'azure-central', to: 'portnox-global', type: 'secure', label: 'Express Route' },
      { id: 'azure-europe-to-global', from: 'azure-europe', to: 'portnox-global', type: 'secure', label: 'EMEA' },
      { id: 'gcp-americas-to-global', from: 'gcp-americas', to: 'portnox-global', type: 'secure', label: 'Americas' },
      { id: 'gcp-apac-to-global', from: 'gcp-apac', to: 'portnox-global', type: 'secure', label: 'APAC' },
      { id: 'edge-to-global', from: 'edge-locations', to: 'portnox-global', type: 'dashed', label: 'CDN' },
      { id: 'onprem-to-global', from: 'onprem-dc', to: 'portnox-global', type: 'secure', label: 'Hybrid' }
    ]
  }

  const generateIntuneNodes = (): DiagramNode[] => {
    return [
      {
        id: 'intune-portal',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Microsoft Intune Portal',
        type: 'intune',
        color: '#e1f5fe',
        description: 'Centralized device management portal with policy configuration'
      },
      {
        id: 'portnox-scep',
        x: 450, y: 200, width: 300, height: 80,
        label: 'Portnox SCEP Connector',
        type: 'scep',
        color: '#e3f2fd',
        description: 'SCEP connector for automated certificate enrollment via Intune'
      },
      {
        id: 'compliance-policies',
        x: 100, y: 350, width: 200, height: 100,
        label: 'Compliance Policies',
        type: 'policy',
        color: '#d4edda',
        description: 'Device compliance requirements: encryption, PIN, antivirus, OS version'
      },
      {
        id: 'wifi-profiles',
        x: 350, y: 350, width: 200, height: 100,
        label: 'WiFi Profiles',
        type: 'profile',
        color: '#cce5ff',
        description: 'Enterprise WiFi profiles with EAP-TLS configuration and certificates'
      },
      {
        id: 'cert-profiles',
        x: 600, y: 350, width: 200, height: 100,
        label: 'Certificate Profiles',
        type: 'profile',
        color: '#fff3cd',
        description: 'SCEP certificate profiles for user and device authentication'
      },
      {
        id: 'app-protection',
        x: 850, y: 350, width: 200, height: 100,
        label: 'App Protection',
        type: 'policy',
        color: '#f8d7da',
        description: 'Mobile application management and data loss prevention policies'
      },
      {
        id: 'windows-devices',
        x: 50, y: 500, width: 150, height: 80,
        label: 'Windows 10/11',
        type: 'device',
        color: '#e8f5e9',
        description: 'Corporate Windows devices with Autopilot enrollment'
      },
      {
        id: 'ios-devices',
        x: 250, y: 500, width: 150, height: 80,
        label: 'iOS Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'iPhone and iPad devices with DEP/ABM enrollment'
      },
      {
        id: 'android-devices',
        x: 450, y: 500, width: 150, height: 80,
        label: 'Android Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Android Enterprise devices with zero-touch enrollment'
      },
      {
        id: 'macos-devices',
        x: 650, y: 500, width: 150, height: 80,
        label: 'macOS Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Mac computers with automated device enrollment'
      },
      {
        id: 'surface-devices',
        x: 850, y: 500, width: 150, height: 80,
        label: 'Surface Devices',
        type: 'device',
        color: '#e8f5e9',
        description: 'Microsoft Surface devices with Windows Autopilot'
      }
    ]
  }

  const generateIntuneConnections = (): DiagramConnection[] => {
    return [
      { id: 'portal-to-scep', from: 'intune-portal', to: 'portnox-scep', type: 'dashed', label: 'SCEP Config' },
      { id: 'portal-to-compliance', from: 'intune-portal', to: 'compliance-policies', type: 'standard', label: 'Deploy' },
      { id: 'portal-to-wifi', from: 'intune-portal', to: 'wifi-profiles', type: 'standard', label: 'Deploy' },
      { id: 'portal-to-cert', from: 'intune-portal', to: 'cert-profiles', type: 'standard', label: 'Deploy' },
      { id: 'portal-to-app', from: 'intune-portal', to: 'app-protection', type: 'standard', label: 'Deploy' },
      { id: 'compliance-to-windows', from: 'compliance-policies', to: 'windows-devices', type: 'secure', label: 'Enforce' },
      { id: 'wifi-to-ios', from: 'wifi-profiles', to: 'ios-devices', type: 'secure', label: 'Configure' },
      { id: 'cert-to-android', from: 'cert-profiles', to: 'android-devices', type: 'secure', label: 'Install' },
      { id: 'app-to-macos', from: 'app-protection', to: 'macos-devices', type: 'secure', label: 'Protect' },
      { id: 'scep-to-surface', from: 'portnox-scep', to: 'surface-devices', type: 'secure', label: 'Certificates' }
    ]
  }

  const generateOnboardingNodes = (): DiagramNode[] => {
    return [
      {
        id: 'onboarding-portal',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Device Onboarding Portal',
        type: 'portal',
        color: '#e3f2fd',
        description: 'Self-service device registration portal with multi-language support'
      },
      {
        id: 'corporate-workflow',
        x: 50, y: 200, width: 200, height: 150,
        label: 'Corporate Device Workflow',
        type: 'workflow',
        color: '#d4edda',
        description: 'Automated enrollment: Intune → Certificate → WiFi profile deployment'
      },
      {
        id: 'byod-workflow',
        x: 300, y: 200, width: 200, height: 150,
        label: 'BYOD Workflow',
        type: 'workflow',
        color: '#cce5ff',
        description: 'Self-service: User registration → Certificate request → Manual WiFi setup'
      },
      {
        id: 'guest-workflow',
        x: 550, y: 200, width: 200, height: 150,
        label: 'Guest Workflow',
        type: 'workflow',
        color: '#fff3cd',
        description: 'Sponsored access: Guest registration → Sponsor approval → Time-limited access'
      },
      {
        id: 'iot-workflow',
        x: 800, y: 200, width: 200, height: 150,
        label: 'IoT Workflow',
        type: 'workflow',
        color: '#f8d7da',
        description: 'Device registration: MAC address → Device profiling → Network assignment'
      },
      {
        id: 'certificate-authority',
        x: 200, y: 400, width: 200, height: 80,
        label: 'Certificate Authority',
        type: 'ca',
        color: '#e3f2fd',
        description: 'Portnox Private CA for certificate issuance and management'
      },
      {
        id: 'sponsor-system',
        x: 450, y: 400, width: 200, height: 80,
        label: 'Sponsor System',
        type: 'sponsor',
        color: '#fff3e0',
        description: 'Automated sponsor notification and approval workflow system'
      },
      {
        id: 'device-profiler',
        x: 700, y: 400, width: 200, height: 80,
        label: 'Device Profiler',
        type: 'profiler',
        color: '#f3e5f5',
        description: 'Automated device classification and policy assignment engine'
      },
      {
        id: 'provisioning-server',
        x: 325, y: 530, width: 200, height: 80,
        label: 'Provisioning Server',
        type: 'provisioning',
        color: '#e8f5e9',
        description: 'Automated device provisioning with zero-touch deployment'
      },
      {
        id: 'notification-service',
        x: 575, y: 530, width: 200, height: 80,
        label: 'Notification Service',
        type: 'notification',
        color: '#ffeaa7',
        description: 'Multi-channel notifications: email, SMS, push notifications'
      }
    ]
  }

  const generateOnboardingConnections = (): DiagramConnection[] => {
    return [
      { id: 'portal-to-corporate', from: 'onboarding-portal', to: 'corporate-workflow', type: 'standard', label: 'Auto Enroll' },
      { id: 'portal-to-byod', from: 'onboarding-portal', to: 'byod-workflow', type: 'standard', label: 'Self Service' },
      { id: 'portal-to-guest', from: 'onboarding-portal', to: 'guest-workflow', type: 'standard', label: 'Guest Access' },
      { id: 'portal-to-iot', from: 'onboarding-portal', to: 'iot-workflow', type: 'standard', label: 'IoT Register' },
      { id: 'corporate-to-ca', from: 'corporate-workflow', to: 'certificate-authority', type: 'secure', label: 'Request Cert' },
      { id: 'byod-to-ca', from: 'byod-workflow', to: 'certificate-authority', type: 'secure', label: 'Request Cert' },
      { id: 'guest-to-sponsor', from: 'guest-workflow', to: 'sponsor-system', type: 'dashed', label: 'Approval' },
      { id: 'iot-to-profiler', from: 'iot-workflow', to: 'device-profiler', type: 'standard', label: 'Profile' },
      { id: 'ca-to-provisioning', from: 'certificate-authority', to: 'provisioning-server', type: 'standard', label: 'Deploy' },
      { id: 'sponsor-to-notification', from: 'sponsor-system', to: 'notification-service', type: 'standard', label: 'Notify' },
      { id: 'profiler-to-notification', from: 'device-profiler', to: 'notification-service', type: 'standard', label: 'Alert' }
    ]
  }

  const generateFortigateTACACSNodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-tacacs',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox TACACS+ Server',
        type: 'tacacs',
        color: '#e3f2fd',
        description: 'Centralized TACACS+ authentication server for network device administration'
      },
      {
        id: 'fortigate-cluster',
        x: 100, y: 250, width: 250, height: 120,
        label: 'FortiGate Firewall Cluster',
        type: 'fortigate',
        color: '#ff6b6b',
        description: 'FortiGate firewall cluster with HA configuration and centralized management',
        vendor: 'fortinet'
      },
      {
        id: 'fortimanager',
        x: 400, y: 250, width: 200, height: 120,
        label: 'FortiManager',
        type: 'fortimanager',
        color: '#ff8e8e',
        description: 'Centralized management platform for FortiGate devices and policy deployment',
        vendor: 'fortinet'
      },
      {
        id: 'fortianalyzer',
        x: 650, y: 250, width: 200, height: 120,
        label: 'FortiAnalyzer',
        type: 'fortianalyzer',
        color: '#ffb3b3',
        description: 'Security analytics and logging platform for FortiGate devices',
        vendor: 'fortinet'
      },
      {
        id: 'admin-workstation',
        x: 900, y: 250, width: 180, height: 120,
        label: 'Admin Workstation',
        type: 'workstation',
        color: '#e8f5e9',
        description: 'Network administrator workstation with FortiClient and management tools'
      },
      {
        id: 'ad-server',
        x: 275, y: 450, width: 200, height: 100,
        label: 'Active Directory',
        type: 'ad',
        color: '#e1f5fe',
        description: 'Active Directory server for user authentication and group membership'
      },
      {
        id: 'privilege-groups',
        x: 525, y: 450, width: 200, height: 100,
        label: 'Privilege Groups',
        type: 'groups',
        color: '#fff3cd',
        description: 'AD security groups defining administrative privilege levels and access rights'
      },
      {
        id: 'audit-server',
        x: 775, y: 450, width: 200, height: 100,
        label: 'Audit & Logging',
        type: 'audit',
        color: '#f8d7da',
        description: 'Centralized audit logging for all administrative actions and command execution'
      }
    ]
  }

  const generateFortigateTACACSConnections = (): DiagramConnection[] => {
    return [
      { id: 'tacacs-to-fortigate', from: 'portnox-tacacs', to: 'fortigate-cluster', type: 'secure', label: 'TACACS+ Auth' },
      { id: 'tacacs-to-fortimanager', from: 'portnox-tacacs', to: 'fortimanager', type: 'secure', label: 'Admin Auth' },
      { id: 'tacacs-to-fortianalyzer', from: 'portnox-tacacs', to: 'fortianalyzer', type: 'secure', label: 'Admin Auth' },
      { id: 'tacacs-to-ad', from: 'portnox-tacacs', to: 'ad-server', type: 'standard', label: 'User Lookup' },
      { id: 'ad-to-groups', from: 'ad-server', to: 'privilege-groups', type: 'standard', label: 'Group Membership' },
      { id: 'admin-to-fortigate', from: 'admin-workstation', to: 'fortigate-cluster', type: 'secure', label: 'SSH/HTTPS' },
      { id: 'admin-to-fortimanager', from: 'admin-workstation', to: 'fortimanager', type: 'secure', label: 'HTTPS' },
      { id: 'fortigate-to-audit', from: 'fortigate-cluster', to: 'audit-server', type: 'standard', label: 'Command Log' },
      { id: 'fortimanager-to-audit', from: 'fortimanager', to: 'audit-server', type: 'standard', label: 'Config Log' },
      { id: 'fortianalyzer-to-audit', from: 'fortianalyzer', to: 'audit-server', type: 'standard', label: 'Access Log' }
    ]
  }

  const generatePaloTACACSNodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-tacacs-palo',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox TACACS+ Server',
        type: 'tacacs',
        color: '#e3f2fd',
        description: 'Centralized TACACS+ authentication server for Palo Alto device administration'
      },
      {
        id: 'palo-firewall',
        x: 100, y: 250, width: 250, height: 120,
        label: 'Palo Alto Firewall',
        type: 'palo',
        color: '#ff9500',
        description: 'Palo Alto Networks next-generation firewall with HA configuration',
        vendor: 'paloalto'
      },
      {
        id: 'panorama',
        x: 400, y: 250, width: 200, height: 120,
        label: 'Panorama',
        type: 'panorama',
        color: '#ffb84d',
        description: 'Centralized management and logging platform for Palo Alto firewalls',
        vendor: 'paloalto'
      },
      {
        id: 'prisma-access',
        x: 650, y: 250, width: 200, height: 120,
        label: 'Prisma Access',
        type: 'prisma',
        color: '#ffd699',
        description: 'Cloud-delivered security platform with global infrastructure',
        vendor: 'paloalto'
      },
      {
        id: 'admin-console',
        x: 900, y: 250, width: 180, height: 120,
        label: 'Admin Console',
        type: 'console',
        color: '#e8f5e9',
        description: 'Administrative console for Palo Alto device management and monitoring'
      },
      {
        id: 'ldap-server',
        x: 275, y: 450, width: 200, height: 100,
        label: 'LDAP Directory',
        type: 'ldap',
        color: '#e1f5fe',
        description: 'LDAP directory service for user authentication and authorization'
      },
      {
        id: 'admin-roles',
        x: 525, y: 450, width: 200, height: 100,
        label: 'Admin Roles',
        type: 'roles',
        color: '#fff3cd',
        description: 'Role-based access control with granular permissions and command authorization'
      },
      {
        id: 'siem-integration',
        x: 775, y: 450, width: 200, height: 100,
        label: 'SIEM Integration',
        type: 'siem',
        color: '#f8d7da',
        description: 'Security Information and Event Management integration for audit trails'
      }
    ]
  }

  const generatePaloTACACSConnections = (): DiagramConnection[] => {
    return [
      { id: 'tacacs-palo-to-firewall', from: 'portnox-tacacs-palo', to: 'palo-firewall', type: 'secure', label: 'TACACS+ Auth' },
      { id: 'tacacs-palo-to-panorama', from: 'portnox-tacacs-palo', to: 'panorama', type: 'secure', label: 'Admin Auth' },
      { id: 'tacacs-palo-to-prisma', from: 'portnox-tacacs-palo', to: 'prisma-access', type: 'secure', label: 'Cloud Auth' },
      { id: 'tacacs-palo-to-ldap', from: 'portnox-tacacs-palo', to: 'ldap-server', type: 'standard', label: 'User Lookup' },
      { id: 'ldap-to-roles', from: 'ldap-server', to: 'admin-roles', type: 'standard', label: 'Role Assignment' },
      { id: 'console-to-firewall', from: 'admin-console', to: 'palo-firewall', type: 'secure', label: 'HTTPS/SSH' },
      { id: 'console-to-panorama', from: 'admin-console', to: 'panorama', type: 'secure', label: 'Web UI' },
      { id: 'firewall-to-siem', from: 'palo-firewall', to: 'siem-integration', type: 'standard', label: 'Audit Logs' },
      { id: 'panorama-to-siem', from: 'panorama', to: 'siem-integration', type: 'standard', label: 'Config Logs' },
      { id: 'prisma-to-siem', from: 'prisma-access', to: 'siem-integration', type: 'standard', label: 'Cloud Logs' }
    ]
  }

  const generatePaloUserIDNodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-syslog',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox Syslog Container',
        type: 'syslog',
        color: '#e3f2fd',
        description: 'Containerized syslog service parsing authentication events and user sessions'
      },
      {
        id: 'palo-firewall-userid',
        x: 100, y: 250, width: 250, height: 120,
        label: 'Palo Alto Firewall',
        type: 'palo',
        color: '#ff9500',
        description: 'Palo Alto firewall with User-ID enabled for dynamic policy enforcement',
        vendor: 'paloalto'
      },
      {
        id: 'userid-agent',
        x: 400, y: 250, width: 200, height: 120,
        label: 'User-ID Agent',
        type: 'userid',
        color: '#ffb84d',
        description: 'User-ID agent collecting user-to-IP mappings from multiple sources',
        vendor: 'paloalto'
      },
      {
        id: 'panorama-userid',
        x: 650, y: 250, width: 200, height: 120,
        label: 'Panorama',
        type: 'panorama',
        color: '#ffd699',
        description: 'Centralized User-ID management and policy distribution platform',
        vendor: 'paloalto'
      },
      {
        id: 'domain-controller',
        x: 900, y: 250, width: 180, height: 120,
        label: 'Domain Controller',
        type: 'dc',
        color: '#e1f5fe',
        description: 'Windows domain controller providing user authentication and group information'
      },
      {
        id: 'user-mapping',
        x: 200, y: 450, width: 200, height: 100,
        label: 'User-IP Mapping',
        type: 'mapping',
        color: '#d4edda',
        description: 'Dynamic user-to-IP address mapping database with session tracking'
      },
      {
        id: 'group-mapping',
        x: 450, y: 450, width: 200, height: 100,
        label: 'Group Mapping',
        type: 'groups',
        color: '#cce5ff',
        description: 'Active Directory group membership mapping for policy application'
      },
      {
        id: 'policy-engine-palo',
        x: 700, y: 450, width: 200, height: 100,
        label: 'Policy Engine',
        type: 'policy',
        color: '#fff3cd',
        description: 'Dynamic security policy engine with user and group-based rules'
      },
      {
        id: 'session-monitor',
        x: 325, y: 600, width: 200, height: 80,
        label: 'Session Monitor',
        type: 'monitor',
        color: '#f8d7da',
        description: 'Real-time session monitoring and user activity tracking'
      },
      {
        id: 'threat-prevention',
        x: 575, y: 600, width: 200, height: 80,
        label: 'Threat Prevention',
        type: 'threat',
        color: '#e2e3e5',
        description: 'User-aware threat prevention with behavioral analysis'
      }
    ]
  }

  const generatePaloUserIDConnections = (): DiagramConnection[] => {
    return [
      { id: 'syslog-to-userid', from: 'portnox-syslog', to: 'userid-agent', type: 'standard', label: 'Auth Events' },
      { id: 'userid-to-firewall', from: 'userid-agent', to: 'palo-firewall-userid', type: 'secure', label: 'User Mappings' },
      { id: 'userid-to-panorama', from: 'userid-agent', to: 'panorama-userid', type: 'secure', label: 'Centralized Mgmt' },
      { id: 'dc-to-userid', from: 'domain-controller', to: 'userid-agent', type: 'standard', label: 'User Info' },
      { id: 'userid-to-user-mapping', from: 'userid-agent', to: 'user-mapping', type: 'standard', label: 'IP Mapping' },
      { id: 'userid-to-group-mapping', from: 'userid-agent', to: 'group-mapping', type: 'standard', label: 'Group Info' },
      { id: 'panorama-to-policy', from: 'panorama-userid', to: 'policy-engine-palo', type: 'standard', label: 'Policy Push' },
      { id: 'firewall-to-session', from: 'palo-firewall-userid', to: 'session-monitor', type: 'standard', label: 'Session Data' },
      { id: 'firewall-to-threat', from: 'palo-firewall-userid', to: 'threat-prevention', type: 'standard', label: 'Threat Intel' },
      { id: 'policy-to-threat', from: 'policy-engine-palo', to: 'threat-prevention', type: 'dashed', label: 'Policy Context' }
    ]
  }

  const generateFortigateFSSONodes = (): DiagramNode[] => {
    return [
      {
        id: 'portnox-syslog-forti',
        x: 450, y: 50, width: 300, height: 100,
        label: 'Portnox Syslog Container',
        type: 'syslog',
        color: '#e3f2fd',
        description: 'Containerized syslog service parsing NAC authentication events for FSSO integration'
      },
      {
        id: 'fortigate-fsso',
        x: 100, y: 250, width: 250, height: 120,
        label: 'FortiGate Firewall',
        type: 'fortigate',
        color: '#ff6b6b',
        description: 'FortiGate firewall with FSSO enabled for user-aware security policies',
        vendor: 'fortinet'
      },
      {
        id: 'fsso-agent',
        x: 400, y: 250, width: 200, height: 120,
        label: 'FSSO Agent',
        type: 'fsso',
        color: '#ff8e8e',
        description: 'Fortinet Single Sign-On agent collecting user logon information',
        vendor: 'fortinet'
      },
      {
        id: 'fsso-collector',
        x: 650, y: 250, width: 200, height: 120,
        label: 'FSSO Collector',
        type: 'collector',
        color: '#ffb3b3',
        description: 'FSSO collector agent gathering user information from multiple sources',
        vendor: 'fortinet'
      },
      {
        id: 'ad-server-fsso',
        x: 900, y: 250, width: 180, height: 120,
        label: 'Active Directory',
        type: 'ad',
        color: '#e1f5fe',
        description: 'Active Directory server providing user authentication and group membership'
      },
      {
        id: 'user-groups-forti',
        x: 200, y: 450, width: 200, height: 100,
        label: 'User Groups',
        type: 'groups',
        color: '#d4edda',
        description: 'Active Directory security groups for FortiGate policy application'
      },
      {
        id: 'firewall-policies',
        x: 450, y: 450, width: 200, height: 100,
        label: 'Firewall Policies',
        type: 'policy',
        color: '#cce5ff',
        description: 'User and group-based firewall policies with dynamic enforcement'
      },
      {
        id: 'security-fabric',
        x: 700, y: 450, width: 200, height: 100,
        label: 'Security Fabric',
        type: 'fabric',
        color: '#fff3cd',
        description: 'Fortinet Security Fabric integration for comprehensive threat intelligence',
        vendor: 'fortinet'
      },
      {
        id: 'user-monitor-forti',
        x: 325, y: 600, width: 200, height: 80,
        label: 'User Monitor',
        type: 'monitor',
        color: '#f8d7da',
        description: 'Real-time user session monitoring and activity logging'
      },
      {
        id: 'fortiguard',
        x: 575, y: 600, width: 200, height: 80,
        label: 'FortiGuard Services',
        type: 'fortiguard',
        color: '#e2e3e5',
        description: 'FortiGuard threat intelligence and security services integration',
        vendor: 'fortinet'
      }
    ]
  }

  const generateFortigateFSSOConnections = (): DiagramConnection[] => {
    return [
      { id: 'syslog-forti-to-fsso', from: 'portnox-syslog-forti', to: 'fsso-agent', type: 'standard', label: 'Auth Events' },
      { id: 'fsso-to-fortigate', from: 'fsso-agent', to: 'fortigate-fsso', type: 'secure', label: 'User Sessions' },
      { id: 'fsso-to-collector', from: 'fsso-agent', to: 'fsso-collector', type: 'standard', label: 'User Data' },
      { id: 'collector-to-ad', from: 'fsso-collector', to: 'ad-server-fsso', type: 'standard', label: 'LDAP Query' },
      { id: 'ad-to-groups', from: 'ad-server-fsso', to: 'user-groups-forti', type: 'standard', label: 'Group Membership' },
      { id: 'fortigate-to-policies', from: 'fortigate-fsso', to: 'firewall-policies', type: 'standard', label: 'Policy Enforcement' },
      { id: 'fortigate-to-fabric', from: 'fortigate-fsso', to: 'security-fabric', type: 'secure', label: 'Fabric Integration' },
      { id: 'fortigate-to-monitor', from: 'fortigate-fsso', to: 'user-monitor-forti', type: 'standard', label: 'Session Logs' },
      { id: 'fabric-to-fortiguard', from: 'security-fabric', to: 'fortiguard', type: 'secure', label: 'Threat Intel' },
      { id: 'policies-to-monitor', from: 'firewall-policies', to: 'user-monitor-forti', type: 'dashed', label: 'Policy Events' }
    ]
  }

const getRadsecProxyData = () => {
  const nodes: DiagramNode[] = [
    {
      id: 'client',
      type: 'device',
      label: 'Client Device',
      description: 'Authenticated endpoint with certificate',
      x: 100,
      y: 200,
      status: 'active',
      connections: ['nas'],
      details: {
        protocols: ['802.1X', 'EAP-TLS'],
        certificates: ['Device Certificate', 'User Certificate']
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
        protocols: ['RADIUS', '802.1X'],
        ip: '192.168.1.10',
        model: 'CX 6300'
      }
    },
    {
      id: 'radsec-proxy',
      type: 'server',
      label: 'RADSec Proxy',
      description: 'Secure RADIUS proxy server with TLS termination',
      x: 500,
      y: 200,
      status: 'active',
      vendor: 'Portnox',
      connections: ['nas', 'portnox-cloud'],
      details: {
        protocols: ['RADSEC', 'TLS 1.3', 'RADIUS'],
        ip: '10.0.1.100',
        version: 'LRAD 3.0',
        certificates: ['Server Certificate']
      }
    },
    {
      id: 'portnox-cloud',
      type: 'cloud',
      label: 'Portnox Cloud NAC',
      description: 'Cloud-based NAC service with policy engine',
      x: 700,
      y: 200,
      status: 'active',
      vendor: 'Portnox',
      connections: ['radsec-proxy', 'entra-id'],
      details: {
        protocols: ['RADSEC', 'HTTPS', 'LDAP', 'SCEP'],
        version: '20.0',
        policies: ['Corporate Policy', 'Device Compliance', 'Certificate Validation']
      }
    },
    {
      id: 'entra-id',
      type: 'cloud',
      label: 'Microsoft Entra ID',
      description: 'Cloud identity and access management',
      x: 900,
      y: 200,
      status: 'active',
      vendor: 'Microsoft',
      connections: ['portnox-cloud'],
      details: {
        protocols: ['LDAP', 'SAML', 'OAuth 2.0', 'OpenID Connect'],
        features: ['Conditional Access', 'MFA', 'Identity Protection']
      }
    }
  ]

  const connections: DiagramConnection[] = [
    {
      id: 'client-nas',
      from: 'client',
      to: 'nas',
      type: 'ethernet',
      label: '802.1X EAP-TLS',
      status: 'active',
      encrypted: true
    },
    {
      id: 'nas-proxy',
      from: 'nas',
      to: 'radsec-proxy',
      type: 'radius',
      label: 'RADIUS (UDP:1812)',
      status: 'active',
      encrypted: false
    },
    {
      id: 'proxy-cloud',
      from: 'radsec-proxy',
      to: 'portnox-cloud',
      type: 'tls',
      label: 'RADSEC (TLS:2083)',
      status: 'active',
      encrypted: true
    },
    {
      id: 'cloud-entra',
      from: 'portnox-cloud',
      to: 'entra-id',
      type: 'ldap',
      label: 'LDAP/SAML Auth',
      status: 'active',
      encrypted: true
    }
  ]

  return { nodes, connections }
}

const generateFortigateTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with session and command authorization for FortiGate devices'
    },
    {
      id: 'fortigate-cluster',
      x: 100, y: 250, width: 250, height: 120,
      label: 'FortiGate Firewall Cluster',
      type: 'fortigate',
      color: '#ff6b6b',
      description: 'FortiGate NGFW cluster with HA configuration and TACACS+ authentication',
      vendor: 'fortinet'
    },
    {
      id: 'fortimanager',
      x: 400, y: 250, width: 200, height: 120,
      label: 'FortiManager',
      type: 'fortimanager',
      color: '#ff8e8e',
      description: 'Centralized management platform with TACACS+ admin authentication',
      vendor: 'fortinet'
    },
    {
      id: 'fortianalyzer',
      x: 650, y: 250, width: 200, height: 120,
      label: 'FortiAnalyzer',
      type: 'fortianalyzer',
      color: '#ffb3b3',
      description: 'Security analytics platform with TACACS+ access control',
      vendor: 'fortinet'
    },
    {
      id: 'admin-workstation',
      x: 900, y: 250, width: 180, height: 120,
      label: 'Admin Workstation',
      type: 'workstation',
      color: '#e8f5e9',
      description: 'Network administrator workstation with FortiClient and management tools'
    },
    {
      id: 'entra-id-forti',
      x: 200, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity provider with user authentication and group membership'
    },
    {
      id: 'ad-server-forti',
      x: 450, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'On-premises AD with security groups and organizational units'
    },
    {
      id: 'privilege-groups-forti',
      x: 700, y: 450, width: 200, height: 100,
      label: 'Admin Privilege Groups',
      type: 'groups',
      color: '#fff3cd',
      description: 'Security groups: FortiGate-Admins, FortiGate-ReadOnly, FortiGate-SuperAdmin'
    },
    {
      id: 'session-tracking',
      x: 200, y: 600, width: 200, height: 80,
      label: 'Session Tracking',
      type: 'session',
      color: '#d4edda',
      description: 'Real-time session monitoring with command authorization logging'
    },
    {
      id: 'command-authorization',
      x: 450, y: 600, width: 200, height: 80,
      label: 'Command Authorization',
      type: 'command',
      color: '#cce5ff',
      description: 'Granular command-level authorization based on user roles and groups'
    },
    {
      id: 'audit-logging',
      x: 700, y: 600, width: 200, height: 80,
      label: 'Audit & Compliance',
      type: 'audit',
      color: '#f8d7da',
      description: 'Comprehensive audit logging for SOX, PCI-DSS, and regulatory compliance'
    }
  ]
}

const generateFortigateTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-to-fortigate', from: 'portnox-tacacs', to: 'fortigate-cluster', type: 'secure', label: 'TACACS+ Auth/Authz' },
    { id: 'tacacs-to-fortimanager', from: 'portnox-tacacs', to: 'fortimanager', type: 'secure', label: 'Admin Authentication' },
    { id: 'tacacs-to-fortianalyzer', from: 'portnox-tacacs', to: 'fortianalyzer', type: 'secure', label: 'Access Control' },
    { id: 'tacacs-to-entra', from: 'portnox-tacacs', to: 'entra-id-forti', type: 'standard', label: 'Cloud Identity Lookup' },
    { id: 'tacacs-to-ad', from: 'portnox-tacacs', to: 'ad-server-forti', type: 'standard', label: 'On-Prem User Lookup' },
    { id: 'entra-to-groups', from: 'entra-id-forti', to: 'privilege-groups-forti', type: 'standard', label: 'Group Membership' },
    { id: 'ad-to-groups', from: 'ad-server-forti', to: 'privilege-groups-forti', type: 'standard', label: 'Security Groups' },
    { id: 'admin-to-fortigate', from: 'admin-workstation', to: 'fortigate-cluster', type: 'secure', label: 'SSH/HTTPS Admin' },
    { id: 'admin-to-fortimanager', from: 'admin-workstation', to: 'fortimanager', type: 'secure', label: 'Web Management' },
    { id: 'fortigate-to-session', from: 'fortigate-cluster', to: 'session-tracking', type: 'standard', label: 'Session Events' },
    { id: 'fortigate-to-command', from: 'fortigate-cluster', to: 'command-authorization', type: 'standard', label: 'Command Requests' },
    { id: 'session-to-audit', from: 'session-tracking', to: 'audit-logging', type: 'standard', label: 'Session Logs' },
    { id: 'command-to-audit', from: 'command-authorization', to: 'audit-logging', type: 'standard', label: 'Command Logs' }
  ]
}

const generatePaloTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-palo',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with advanced authorization policies for Palo Alto devices'
    },
    {
      id: 'palo-firewall',
      x: 100, y: 250, width: 250, height: 120,
      label: 'Palo Alto NGFW',
      type: 'palo',
      color: '#ff9500',
      description: 'Palo Alto next-generation firewall with TACACS+ authentication and role-based access',
      vendor: 'paloalto'
    },
    {
      id: 'panorama',
      x: 400, y: 250, width: 200, height: 120,
      label: 'Panorama',
      type: 'panorama',
      color: '#ffb84d',
      description: 'Centralized management platform with TACACS+ administrator authentication',
      vendor: 'paloalto'
    },
    {
      id: 'prisma-access',
      x: 650, y: 250, width: 200, height: 120,
      label: 'Prisma Access',
      type: 'prisma',
      color: '#ffd699',
      description: 'Cloud-delivered security platform with centralized TACACS+ authentication',
      vendor: 'paloalto'
    },
    {
      id: 'admin-console-palo',
      x: 900, y: 250, width: 180, height: 120,
      label: 'Admin Console',
      type: 'console',
      color: '#e8f5e9',
      description: 'Administrative console for Palo Alto device management with MFA support'
    },
    {
      id: 'entra-id-palo',
      x: 200, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity provider with conditional access and privileged identity management'
    },
    {
      id: 'ldap-server',
      x: 450, y: 450, width: 200, height: 100,
      label: 'LDAP Directory',
      type: 'ldap',
      color: '#e1f5fe',
      description: 'Enterprise LDAP directory with hierarchical organizational structure'
    },
    {
      id: 'admin-roles-palo',
      x: 700, y: 450, width: 200, height: 100,
      label: 'Admin Role Profiles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Granular role-based access: superuser, deviceadmin, auditadmin, readonly'
    },
    {
      id: 'session-mgmt-palo',
      x: 200, y: 600, width: 200, height: 80,
      label: 'Session Management',
      type: 'session',
      color: '#d4edda',
      description: 'Active session tracking with concurrent session limits and timeout policies'
    },
    {
      id: 'command-authz-palo',
      x: 450, y: 600, width: 200, height: 80,
      label: 'Command Authorization',
      type: 'command',
      color: '#cce5ff',
      description: 'Fine-grained command authorization with operational and configuration commands'
    },
    {
      id: 'siem-integration',
      x: 700, y: 600, width: 200, height: 80,
      label: 'SIEM Integration',
      type: 'siem',
      color: '#f8d7da',
      description: 'Security event correlation with Splunk, QRadar, and Azure Sentinel integration'
    }
  ]
}

const generatePaloTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-palo-to-firewall', from: 'portnox-tacacs-palo', to: 'palo-firewall', type: 'secure', label: 'TACACS+ AAA' },
    { id: 'tacacs-palo-to-panorama', from: 'portnox-tacacs-palo', to: 'panorama', type: 'secure', label: 'Management Auth' },
    { id: 'tacacs-palo-to-prisma', from: 'portnox-tacacs-palo', to: 'prisma-access', type: 'secure', label: 'Cloud Admin Auth' },
    { id: 'tacacs-palo-to-entra', from: 'portnox-tacacs-palo', to: 'entra-id-palo', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-palo-to-ldap', from: 'portnox-tacacs-palo', to: 'ldap-server', type: 'standard', label: 'Directory Lookup' },
    { id: 'entra-to-roles', from: 'entra-id-palo', to: 'admin-roles-palo', type: 'standard', label: 'Role Assignment' },
    { id: 'ldap-to-roles', from: 'ldap-server', to: 'admin-roles-palo', type: 'standard', label: 'Group Mapping' },
    { id: 'console-to-firewall', from: 'admin-console-palo', to: 'palo-firewall', type: 'secure', label: 'HTTPS/SSH' },
    { id: 'console-to-panorama', from: 'admin-console-palo', to: 'panorama', type: 'secure', label: 'Web Interface' },
    { id: 'firewall-to-session', from: 'palo-firewall', to: 'session-mgmt-palo', type: 'standard', label: 'Session Data' },
    { id: 'firewall-to-command', from: 'palo-firewall', to: 'command-authz-palo', type: 'standard', label: 'Command Requests' },
    { id: 'session-to-siem', from: 'session-mgmt-palo', to: 'siem-integration', type: 'standard', label: 'Session Events' },
    { id: 'command-to-siem', from: 'command-authz-palo', to: 'siem-integration', type: 'standard', label: 'Command Audit' }
  ]
}

// Add Cisco TACACS+ diagram
const generateCiscoTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-cisco',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with Cisco device support and privilege level authorization'
    },
    {
      id: 'cisco-catalyst',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Cisco Catalyst Switch',
      type: 'cisco-switch',
      color: '#1ba0d7',
      description: 'Cisco Catalyst switch with TACACS+ authentication and command authorization',
      vendor: 'cisco'
    },
    {
      id: 'cisco-nexus',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Cisco Nexus Switch',
      type: 'cisco-nexus',
      color: '#1ba0d7',
      description: 'Cisco Nexus data center switch with role-based access control',
      vendor: 'cisco'
    },
    {
      id: 'cisco-asa',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Cisco ASA Firewall',
      type: 'cisco-asa',
      color: '#1ba0d7',
      description: 'Cisco ASA firewall with TACACS+ administrative authentication',
      vendor: 'cisco'
    },
    {
      id: 'cisco-ise',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Cisco ISE',
      type: 'cisco-ise',
      color: '#1ba0d7',
      description: 'Cisco Identity Services Engine with TACACS+ device administration',
      vendor: 'cisco'
    },
    {
      id: 'entra-id-cisco',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with Azure AD Connect for hybrid identity management'
    },
    {
      id: 'ad-server-cisco',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Windows Active Directory with network administrator groups'
    },
    {
      id: 'privilege-levels',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Cisco Privilege Levels',
      type: 'privilege',
      color: '#fff3cd',
      description: 'Cisco privilege levels 0-15 with custom command authorization'
    },
    {
      id: 'aaa-accounting',
      x: 900, y: 450, width: 200, height: 100,
      label: 'AAA Accounting',
      type: 'accounting',
      color: '#d4edda',
      description: 'Comprehensive accounting for all administrative sessions and commands'
    },
    {
      id: 'session-control',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Session Control',
      type: 'session',
      color: '#cce5ff',
      description: 'Active session management with idle timeout and concurrent session limits'
    },
    {
      id: 'command-sets',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Command Sets',
      type: 'command',
      color: '#fff3cd',
      description: 'Predefined command sets for different administrative roles and responsibilities'
    },
    {
      id: 'compliance-reporting',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Compliance Reporting',
      type: 'compliance',
      color: '#f8d7da',
      description: 'Automated compliance reporting for SOX, HIPAA, and industry regulations'
    }
  ]
}

const generateCiscoTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-cisco-to-catalyst', from: 'portnox-tacacs-cisco', to: 'cisco-catalyst', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-cisco-to-nexus', from: 'portnox-tacacs-cisco', to: 'cisco-nexus', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-cisco-to-asa', from: 'portnox-tacacs-cisco', to: 'cisco-asa', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-cisco-to-ise', from: 'portnox-tacacs-cisco', to: 'cisco-ise', type: 'secure', label: 'Device Admin' },
    { id: 'tacacs-cisco-to-entra', from: 'portnox-tacacs-cisco', to: 'entra-id-cisco', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-cisco-to-ad', from: 'portnox-tacacs-cisco', to: 'ad-server-cisco', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-privilege', from: 'entra-id-cisco', to: 'privilege-levels', type: 'standard', label: 'Role Mapping' },
    { id: 'ad-to-privilege', from: 'ad-server-cisco', to: 'privilege-levels', type: 'standard', label: 'Group Mapping' },
    { id: 'catalyst-to-accounting', from: 'cisco-catalyst', to: 'aaa-accounting', type: 'standard', label: 'Accounting Records' },
    { id: 'nexus-to-accounting', from: 'cisco-nexus', to: 'aaa-accounting', type: 'standard', label: 'Session Logs' },
    { id: 'asa-to-session', from: 'cisco-asa', to: 'session-control', type: 'standard', label: 'Session Management' },
    { id: 'ise-to-command', from: 'cisco-ise', to: 'command-sets', type: 'standard', label: 'Command Authorization' },
    { id: 'accounting-to-compliance', from: 'aaa-accounting', to: 'compliance-reporting', type: 'standard', label: 'Audit Data' }
  ]
}

// Add Aruba TACACS+ diagram
const generateArubaTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-aruba',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Aruba device support and ClearPass integration'
    },
    {
      id: 'aruba-cx-switch',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Aruba CX Switch',
      type: 'aruba-cx',
      color: '#ff6600',
      description: 'Aruba CX switch with TACACS+ authentication and role-based CLI access',
      vendor: 'aruba'
    },
    {
      id: 'aruba-controller',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Aruba Controller',
      type: 'aruba-controller',
      color: '#ff6600',
      description: 'Aruba wireless controller with TACACS+ administrative access control',
      vendor: 'aruba'
    },
    {
      id: 'aruba-clearpass',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Aruba ClearPass',
      type: 'aruba-clearpass',
      color: '#ff6600',
      description: 'Aruba ClearPass policy manager with TACACS+ device administration',
      vendor: 'aruba'
    },
    {
      id: 'aruba-central',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Aruba Central',
      type: 'aruba-central',
      color: '#ff6600',
      description: 'Aruba Central cloud management with TACACS+ administrator authentication',
      vendor: 'aruba'
    },
    {
      id: 'entra-id-aruba',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity provider with Azure AD application proxy integration'
    },
    {
      id: 'ad-server-aruba',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with network operations and security groups'
    },
    {
      id: 'aruba-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Aruba Admin Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Aruba-specific roles: admin, operator, guest-provisioning, read-only'
    },
    {
      id: 'policy-enforcement',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Policy Enforcement',
      type: 'policy',
      color: '#d4edda',
      description: 'Dynamic policy enforcement with real-time authorization decisions'
    },
    {
      id: 'session-monitoring',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Session Monitoring',
      type: 'session',
      color: '#cce5ff',
      description: 'Real-time session monitoring with WebUI and CLI session tracking'
    },
    {
      id: 'command-filtering',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Command Filtering',
      type: 'command',
      color: '#fff3cd',
      description: 'Granular command filtering with allow/deny lists and regex patterns'
    },
    {
      id: 'audit-trail',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Audit Trail',
      type: 'audit',
      color: '#f8d7da',
      description: 'Comprehensive audit trail with syslog integration and forensic analysis'
    }
  ]
}

const generateArubaTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-aruba-to-cx', from: 'portnox-tacacs-aruba', to: 'aruba-cx-switch', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-aruba-to-controller', from: 'portnox-tacacs-aruba', to: 'aruba-controller', type: 'secure', label: 'Admin Auth' },
    { id: 'tacacs-aruba-to-clearpass', from: 'portnox-tacacs-aruba', to: 'aruba-clearpass', type: 'secure', label: 'Device Admin' },
    { id: 'tacacs-aruba-to-central', from: 'portnox-tacacs-aruba', to: 'aruba-central', type: 'secure', label: 'Cloud Admin' },
    { id: 'tacacs-aruba-to-entra', from: 'portnox-tacacs-aruba', to: 'entra-id-aruba', type: 'standard', label: 'Identity Lookup' },
    { id: 'tacacs-aruba-to-ad', from: 'portnox-tacacs-aruba', to: 'ad-server-aruba', type: 'standard', label: 'User Authentication' },
    { id: 'entra-to-roles', from: 'entra-id-aruba', to: 'aruba-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles', from: 'ad-server-aruba', to: 'aruba-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-policy', from: 'aruba-roles', to: 'policy-enforcement', type: 'standard', label: 'Policy Application' },
    { id: 'cx-to-session', from: 'aruba-cx-switch', to: 'session-monitoring', type: 'standard', label: 'Session Events' },
    { id: 'controller-to-command', from: 'aruba-controller', to: 'command-filtering', type: 'standard', label: 'Command Requests' },
    { id: 'clearpass-to-audit', from: 'aruba-clearpass', to: 'audit-trail', type: 'standard', label: 'Admin Actions' },
    { id: 'central-to-audit', from: 'aruba-central', to: 'audit-trail', type: 'standard', label: 'Cloud Actions' }
  ]
}

// Add Juniper TACACS+ diagram
const generateJuniperTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-juniper',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with Juniper device support and JUNOS authorization'
    },
    {
      id: 'juniper-ex-switch',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Juniper EX Switch',
      type: 'juniper-ex',
      color: '#00a651',
      description: 'Juniper EX series switch with TACACS+ authentication and login classes',
      vendor: 'juniper'
    },
    {
      id: 'juniper-mx-router',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Juniper MX Router',
      type: 'juniper-mx',
      color: '#00a651',
      description: 'Juniper MX series router with TACACS+ and template-based authorization',
      vendor: 'juniper'
    },
    {
      id: 'juniper-srx-firewall',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Juniper SRX Firewall',
      type: 'juniper-srx',
      color: '#00a651',
      description: 'Juniper SRX firewall with TACACS+ and security administrator roles',
      vendor: 'juniper'
    },
    {
      id: 'juniper-space',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Juniper Space',
      type: 'juniper-space',
      color: '#00a651',
      description: 'Juniper Space network management with TACACS+ administrative access',
      vendor: 'juniper'
    },
    {
      id: 'entra-id-juniper',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Juniper device management'
    },
    {
      id: 'ad-server-juniper',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Juniper network administrator groups'
    },
    {
      id: 'juniper-login-classes',
      x: 650, y: 450, width: 200, height: 100,
      label: 'JUNOS Login Classes',
      type: 'login-classes',
      color: '#fff3cd',
      description: 'JUNOS login classes: super-user, operator, read-only, unauthorized'
    },
    {
      id: 'template-authorization',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Template Authorization',
      type: 'template',
      color: '#d4edda',
      description: 'Template-based command authorization with hierarchical permission inheritance'
    },
    {
      id: 'commit-control',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Commit Control',
      type: 'commit',
      color: '#cce5ff',
      description: 'Configuration commit control with approval workflows and rollback capabilities'
    },
    {
      id: 'operational-commands',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Operational Commands',
      type: 'operational',
      color: '#fff3cd',
      description: 'Operational command authorization with show, ping, traceroute permissions'
    },
    {
      id: 'junos-logging',
      x: 775, y: 600, width: 200, height: 80,
      label: 'JUNOS Logging',
      type: 'logging',
      color: '#f8d7da',
      description: 'Comprehensive JUNOS logging with syslog and SNMP trap integration'
    }
  ]
}

const generateJuniperTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-juniper-to-ex', from: 'portnox-tacacs-juniper', to: 'juniper-ex-switch', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-juniper-to-mx', from: 'portnox-tacacs-juniper', to: 'juniper-mx-router', type: 'secure', label: 'Admin Auth' },
    { id: 'tacacs-juniper-to-srx', from: 'portnox-tacacs-juniper', to: 'juniper-srx-firewall', type: 'secure', label: 'Security Admin' },
    { id: 'tacacs-juniper-to-space', from: 'portnox-tacacs-juniper', to: 'juniper-space', type: 'secure', label: 'Management Auth' },
    { id: 'tacacs-juniper-to-entra', from: 'portnox-tacacs-juniper', to: 'entra-id-juniper', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-juniper-to-ad', from: 'portnox-tacacs-juniper', to: 'ad-server-juniper', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-login-classes', from: 'entra-id-juniper', to: 'juniper-login-classes', type: 'standard', label: 'Class Assignment' },
    { id: 'ad-to-login-classes', from: 'ad-server-juniper', to: 'juniper-login-classes', type: 'standard', label: 'Group Mapping' },
    { id: 'login-classes-to-template', from: 'juniper-login-classes', to: 'template-authorization', type: 'standard', label: 'Permission Templates' },
    { id: 'ex-to-commit', from: 'juniper-ex-switch', to: 'commit-control', type: 'standard', label: 'Config Changes' },
    { id: 'mx-to-operational', from: 'juniper-mx-router', to: 'operational-commands', type: 'standard', label: 'Show Commands' },
    { id: 'srx-to-logging', from: 'juniper-srx-firewall', to: 'junos-logging', type: 'standard', label: 'Security Events' },
    { id: 'space-to-logging', from: 'juniper-space', to: 'junos-logging', type: 'standard', label: 'Management Events' }
  ]
}

// Add HPE/H3C TACACS+ diagram
const generateHPETACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-hpe',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with HPE/H3C device support and IMC integration'
    },
    {
      id: 'hpe-comware-switch',
      x: 100, y: 250, width: 200, height: 120,
      label: 'HPE Comware Switch',
      type: 'hpe-comware',
      color: '#01a982',
      description: 'HPE Comware switch with TACACS+ authentication and user privilege levels',
      vendor: 'hpe'
    },
    {
      id: 'hpe-procurve-switch',
      x: 350, y: 250, width: 200, height: 120,
      label: 'HPE ProCurve Switch',
      type: 'hpe-procurve',
      color: '#01a982',
      description: 'HPE ProCurve switch with TACACS+ and manager/operator privilege levels',
      vendor: 'hpe'
    },
    {
      id: 'h3c-router',
      x: 600, y: 250, width: 200, height: 120,
      label: 'H3C Router',
      type: 'h3c-router',
      color: '#01a982',
      description: 'H3C router with TACACS+ authentication and command authorization',
      vendor: 'h3c'
    },
    {
      id: 'hpe-imc',
      x: 850, y: 250, width: 200, height: 120,
      label: 'HPE IMC',
      type: 'hpe-imc',
      color: '#01a982',
      description: 'HPE Intelligent Management Center with TACACS+ admin authentication',
      vendor: 'hpe'
    },
    {
      id: 'entra-id-hpe',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with HPE device management integration'
    },
    {
      id: 'ad-server-hpe',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with HPE network administrator groups'
    },
    {
      id: 'hpe-user-levels',
      x: 650, y: 450, width: 200, height: 100,
      label: 'HPE User Levels',
      type: 'user-levels',
      color: '#fff3cd',
      description: 'HPE user privilege levels: network-admin, network-operator, level-0 to level-15'
    },
    {
      id: 'command-authorization-hpe',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Command Authorization',
      type: 'command',
      color: '#d4edda',
      description: 'Granular command authorization with view-based access control'
    },
    {
      id: 'session-control-hpe',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Session Control',
      type: 'session',
      color: '#cce5ff',
      description: 'Active session management with idle timeout and privilege escalation'
    },
    {
      id: 'view-based-access',
      x: 525, y: 600, width: 200, height: 80,
      label: 'View-Based Access',
      type: 'view',
      color: '#fff3cd',
      description: 'View-based access control with custom command sets and restrictions'
    },
    {
      id: 'hpe-logging',
      x: 775, y: 600, width: 200, height: 80,
      label: 'HPE Logging',
      type: 'logging',
      color: '#f8d7da',
      description: 'Comprehensive logging with syslog and SNMP integration'
    }
  ]
}

const generateHPETACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-hpe-to-comware', from: 'portnox-tacacs-hpe', to: 'hpe-comware-switch', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-hpe-to-procurve', from: 'portnox-tacacs-hpe', to: 'hpe-procurve-switch', type: 'secure', label: 'Admin Auth' },
    { id: 'tacacs-hpe-to-h3c', from: 'portnox-tacacs-hpe', to: 'h3c-router', type: 'secure', label: 'Router Auth' },
    { id: 'tacacs-hpe-to-imc', from: 'portnox-tacacs-hpe', to: 'hpe-imc', type: 'secure', label: 'Management Auth' },
    { id: 'tacacs-hpe-to-entra', from: 'portnox-tacacs-hpe', to: 'entra-id-hpe', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-hpe-to-ad', from: 'portnox-tacacs-hpe', to: 'ad-server-hpe', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-levels', from: 'entra-id-hpe', to: 'hpe-user-levels', type: 'standard', label: 'Level Assignment' },
    { id: 'ad-to-levels', from: 'ad-server-hpe', to: 'hpe-user-levels', type: 'standard', label: 'Group Mapping' },
    { id: 'levels-to-command', from: 'hpe-user-levels', to: 'command-authorization-hpe', type: 'standard', label: 'Command Rights' },
    { id: 'comware-to-session', from: 'hpe-comware-switch', to: 'session-control-hpe', type: 'standard', label: 'Session Events' },
    { id: 'procurve-to-view', from: 'hpe-procurve-switch', to: 'view-based-access', type: 'standard', label: 'View Access' },
    { id: 'h3c-to-logging', from: 'h3c-router', to: 'hpe-logging', type: 'standard', label: 'Router Logs' },
    { id: 'imc-to-logging', from: 'hpe-imc', to: 'hpe-logging', type: 'standard', label: 'Management Logs' }
  ]
}

// Add Extreme Networks TACACS+ diagram
const generateExtremeTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-extreme',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Extreme Networks device support and ExtremeCloud integration'
    },
    {
      id: 'extreme-x-series',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Extreme X-Series',
      type: 'extreme-x',
      color: '#7b2cbf',
      description: 'Extreme X-Series switch with TACACS+ authentication and role-based access',
      vendor: 'extreme'
    },
    {
      id: 'extreme-summit',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Extreme Summit',
      type: 'extreme-summit',
      color: '#7b2cbf',
      description: 'Extreme Summit switch with TACACS+ and policy-based management',
      vendor: 'extreme'
    },
    {
      id: 'extreme-wing-ap',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Extreme Wing AP',
      type: 'extreme-wing',
      color: '#7b2cbf',
      description: 'Extreme Wing wireless access point with TACACS+ controller authentication',
      vendor: 'extreme'
    },
    {
      id: 'extreme-cloud-iq',
      x: 850, y: 250, width: 200, height: 120,
      label: 'ExtremeCloud IQ',
      type: 'extreme-cloud',
      color: '#7b2cbf',
      description: 'ExtremeCloud IQ management platform with TACACS+ administrative access',
      vendor: 'extreme'
    },
    {
      id: 'entra-id-extreme',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Extreme device management'
    },
    {
      id: 'ad-server-extreme',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Extreme network administrator groups'
    },
    {
      id: 'extreme-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Extreme User Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Extreme user roles: admin, operator, user with custom policy assignments'
    },
    {
      id: 'policy-management',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Policy Management',
      type: 'policy',
      color: '#d4edda',
      description: 'Dynamic policy management with role-based network access control'
    },
    {
      id: 'session-tracking-extreme',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Session Tracking',
      type: 'session',
      color: '#cce5ff',
      description: 'Real-time session tracking with user activity monitoring'
    },
    {
      id: 'command-filtering-extreme',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Command Filtering',
      type: 'command',
      color: '#fff3cd',
      description: 'Advanced command filtering with context-aware authorization'
    },
    {
      id: 'extreme-analytics',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Extreme Analytics',
      type: 'analytics',
      color: '#f8d7da',
      description: 'Advanced analytics with machine learning-based anomaly detection'
    }
  ]
}

const generateExtremeTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-extreme-to-x', from: 'portnox-tacacs-extreme', to: 'extreme-x-series', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-extreme-to-summit', from: 'portnox-tacacs-extreme', to: 'extreme-summit', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-extreme-to-wing', from: 'portnox-tacacs-extreme', to: 'extreme-wing-ap', type: 'secure', label: 'AP Auth' },
    { id: 'tacacs-extreme-to-cloud', from: 'portnox-tacacs-extreme', to: 'extreme-cloud-iq', type: 'secure', label: 'Cloud Auth' },
    { id: 'tacacs-extreme-to-entra', from: 'portnox-tacacs-extreme', to: 'entra-id-extreme', type: 'standard', label: 'Identity Lookup' },
    { id: 'tacacs-extreme-to-ad', from: 'portnox-tacacs-extreme', to: 'ad-server-extreme', type: 'standard', label: 'User Auth' },
    { id: 'entra-to-roles-extreme', from: 'entra-id-extreme', to: 'extreme-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-extreme', from: 'ad-server-extreme', to: 'extreme-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-policy', from: 'extreme-roles', to: 'policy-management', type: 'standard', label: 'Policy Application' },
    { id: 'x-to-session', from: 'extreme-x-series', to: 'session-tracking-extreme', type: 'standard', label: 'Session Data' },
    { id: 'summit-to-command', from: 'extreme-summit', to: 'command-filtering-extreme', type: 'standard', label: 'Command Requests' },
    { id: 'wing-to-analytics', from: 'extreme-wing-ap', to: 'extreme-analytics', type: 'standard', label: 'AP Analytics' },
    { id: 'cloud-to-analytics', from: 'extreme-cloud-iq', to: 'extreme-analytics', type: 'standard', label: 'Cloud Analytics' }
  ]
}

// Add Ruckus/CommScope TACACS+ diagram
const generateRuckusTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-ruckus',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Ruckus/CommScope device support and SmartZone integration'
    },
    {
      id: 'ruckus-icx-switch',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Ruckus ICX Switch',
      type: 'ruckus-icx',
      color: '#f39c12',
      description: 'Ruckus ICX switch with TACACS+ authentication and privilege levels',
      vendor: 'ruckus'
    },
    {
      id: 'ruckus-ap',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Ruckus Access Point',
      type: 'ruckus-ap',
      color: '#f39c12',
      description: 'Ruckus wireless access point with TACACS+ controller authentication',
      vendor: 'ruckus'
    },
    {
      id: 'ruckus-smartzone',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Ruckus SmartZone',
      type: 'ruckus-smartzone',
      color: '#f39c12',
      description: 'Ruckus SmartZone controller with TACACS+ administrative access',
      vendor: 'ruckus'
    },
    {
      id: 'ruckus-cloudpath',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Ruckus CloudPath',
      type: 'ruckus-cloudpath',
      color: '#f39c12',
      description: 'Ruckus CloudPath enrollment system with TACACS+ integration',
      vendor: 'ruckus'
    },
    {
      id: 'entra-id-ruckus',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with Ruckus device management integration'
    },
    {
      id: 'ad-server-ruckus',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Ruckus network administrator groups'
    },
    {
      id: 'ruckus-admin-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Ruckus Admin Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Ruckus administrative roles: super-admin, admin, operator, monitor'
    },
    {
      id: 'wireless-policy',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Wireless Policy',
      type: 'policy',
      color: '#d4edda',
      description: 'Wireless policy management with dynamic VLAN assignment'
    },
    {
      id: 'session-mgmt-ruckus',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Session Management',
      type: 'session',
      color: '#cce5ff',
      description: 'Wireless session management with roaming and handoff control'
    },
    {
      id: 'rf-management',
      x: 525, y: 600, width: 200, height: 80,
      label: 'RF Management',
      type: 'rf',
      color: '#fff3cd',
      description: 'Radio frequency management with adaptive antenna and power control'
    },
    {
      id: 'ruckus-analytics',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Ruckus Analytics',
      type: 'analytics',
      color: '#f8d7da',
      description: 'Advanced wireless analytics with location services and user behavior'
    }
  ]
}

const generateRuckusTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-ruckus-to-icx', from: 'portnox-tacacs-ruckus', to: 'ruckus-icx-switch', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-ruckus-to-ap', from: 'portnox-tacacs-ruckus', to: 'ruckus-ap', type: 'secure', label: 'AP Auth' },
    { id: 'tacacs-ruckus-to-smartzone', from: 'portnox-tacacs-ruckus', to: 'ruckus-smartzone', type: 'secure', label: 'Controller Auth' },
    { id: 'tacacs-ruckus-to-cloudpath', from: 'portnox-tacacs-ruckus', to: 'ruckus-cloudpath', type: 'secure', label: 'Enrollment Auth' },
    { id: 'tacacs-ruckus-to-entra', from: 'portnox-tacacs-ruckus', to: 'entra-id-ruckus', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-ruckus-to-ad', from: 'portnox-tacacs-ruckus', to: 'ad-server-ruckus', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-roles-ruckus', from: 'entra-id-ruckus', to: 'ruckus-admin-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-ruckus', from: 'ad-server-ruckus', to: 'ruckus-admin-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-wireless-policy', from: 'ruckus-admin-roles', to: 'wireless-policy', type: 'standard', label: 'Policy Rights' },
    { id: 'icx-to-session', from: 'ruckus-icx-switch', to: 'session-mgmt-ruckus', type: 'standard', label: 'Switch Sessions' },
    { id: 'ap-to-rf', from: 'ruckus-ap', to: 'rf-management', type: 'standard', label: 'RF Control' },
    { id: 'smartzone-to-analytics', from: 'ruckus-smartzone', to: 'ruckus-analytics', type: 'standard', label: 'Controller Analytics' },
    { id: 'cloudpath-to-analytics', from: 'ruckus-cloudpath', to: 'ruckus-analytics', type: 'standard', label: 'Enrollment Analytics' }
  ]
}

// Add Ubiquiti TACACS+ diagram
const generateUbiquitiTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-ubiquiti',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Ubiquiti device support and UniFi integration'
    },
    {
      id: 'unifi-switch',
      x: 100, y: 250, width: 200, height: 120,
      label: 'UniFi Switch',
      type: 'unifi-switch',
      color: '#0559c9',
      description: 'UniFi managed switch with TACACS+ authentication and role-based access',
      vendor: 'ubiquiti'
    },
    {
      id: 'unifi-ap',
      x: 350, y: 250, width: 200, height: 120,
      label: 'UniFi Access Point',
      type: 'unifi-ap',
      color: '#0559c9',
      description: 'UniFi wireless access point with controller-based TACACS+ authentication',
      vendor: 'ubiquiti'
    },
    {
      id: 'unifi-gateway',
      x: 600, y: 250, width: 200, height: 120,
      label: 'UniFi Gateway',
      type: 'unifi-gateway',
      color: '#0559c9',
      description: 'UniFi security gateway with TACACS+ administrative access',
      vendor: 'ubiquiti'
    },
    {
      id: 'unifi-controller',
      x: 850, y: 250, width: 200, height: 120,
      label: 'UniFi Controller',
      type: 'unifi-controller',
      color: '#0559c9',
      description: 'UniFi Network Controller with TACACS+ user management',
      vendor: 'ubiquiti'
    },
    {
      id: 'entra-id-ubiquiti',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with UniFi SSO integration'
    },
    {
      id: 'ad-server-ubiquiti',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with UniFi administrator groups'
    },
    {
      id: 'unifi-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'UniFi User Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'UniFi user roles: admin, limited-admin, read-only with custom permissions'
    },
    {
      id: 'network-topology',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Network Topology',
      type: 'topology',
      color: '#d4edda',
      description: 'Dynamic network topology management with auto-discovery'
    },
    {
      id: 'device-adoption',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Device Adoption',
      type: 'adoption',
      color: '#cce5ff',
      description: 'Automated device adoption with zero-touch provisioning'
    },
    {
      id: 'traffic-analysis',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Traffic Analysis',
      type: 'traffic',
      color: '#fff3cd',
      description: 'Deep packet inspection with application-aware traffic shaping'
    },
    {
      id: 'unifi-insights',
      x: 775, y: 600, width: 200, height: 80,
      label: 'UniFi Insights',
      type: 'insights',
      color: '#f8d7da',
      description: 'Network insights with predictive analytics and optimization'
    }
  ]
}

const generateUbiquitiTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-ubiquiti-to-switch', from: 'portnox-tacacs-ubiquiti', to: 'unifi-switch', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-ubiquiti-to-ap', from: 'portnox-tacacs-ubiquiti', to: 'unifi-ap', type: 'secure', label: 'AP Auth' },
    { id: 'tacacs-ubiquiti-to-gateway', from: 'portnox-tacacs-ubiquiti', to: 'unifi-gateway', type: 'secure', label: 'Gateway Auth' },
    { id: 'tacacs-ubiquiti-to-controller', from: 'portnox-tacacs-ubiquiti', to: 'unifi-controller', type: 'secure', label: 'Controller Auth' },
    { id: 'tacacs-ubiquiti-to-entra', from: 'portnox-tacacs-ubiquiti', to: 'entra-id-ubiquiti', type: 'standard', label: 'SSO Integration' },
    { id: 'tacacs-ubiquiti-to-ad', from: 'portnox-tacacs-ubiquiti', to: 'ad-server-ubiquiti', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-roles-ubiquiti', from: 'entra-id-ubiquiti', to: 'unifi-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-ubiquiti', from: 'ad-server-ubiquiti', to: 'unifi-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-topology', from: 'unifi-roles', to: 'network-topology', type: 'standard', label: 'Topology Access' },
    { id: 'switch-to-adoption', from: 'unifi-switch', to: 'device-adoption', type: 'standard', label: 'Device Discovery' },
    { id: 'ap-to-traffic', from: 'unifi-ap', to: 'traffic-analysis', type: 'standard', label: 'Traffic Data' },
    { id: 'gateway-to-insights', from: 'unifi-gateway', to: 'unifi-insights', type: 'standard', label: 'Gateway Analytics' },
    { id: 'controller-to-insights', from: 'unifi-controller', to: 'unifi-insights', type: 'standard', label: 'Network Insights' }
  ]
}

// Add Mikrotik TACACS+ diagram
const generateMikrotikTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-mikrotik',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with MikroTik RouterOS support and Winbox integration'
    },
    {
      id: 'mikrotik-router',
      x: 100, y: 250, width: 200, height: 120,
      label: 'MikroTik Router',
      type: 'mikrotik-router',
      color: '#293133',
      description: 'MikroTik router with RouterOS and TACACS+ authentication support',
      vendor: 'mikrotik'
    },
    {
      id: 'mikrotik-switch',
      x: 350, y: 250, width: 200, height: 120,
      label: 'MikroTik Switch',
      type: 'mikrotik-switch',
      color: '#293133',
      description: 'MikroTik managed switch with SwOS and TACACS+ integration',
      vendor: 'mikrotik'
    },
    {
      id: 'mikrotik-wireless',
      x: 600, y: 250, width: 200, height: 120,
      label: 'MikroTik Wireless',
      type: 'mikrotik-wireless',
      color: '#293133',
      description: 'MikroTik wireless device with CAPsMAN and TACACS+ authentication',
      vendor: 'mikrotik'
    },
    {
      id: 'mikrotik-capsman',
      x: 850, y: 250, width: 200, height: 120,
      label: 'MikroTik CAPsMAN',
      type: 'mikrotik-capsman',
      color: '#293133',
      description: 'MikroTik CAPsMAN controller with centralized wireless management',
      vendor: 'mikrotik'
    },
    {
      id: 'entra-id-mikrotik',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with RADIUS integration for MikroTik devices'
    },
    {
      id: 'ad-server-mikrotik',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with MikroTik administrator groups'
    },
    {
      id: 'mikrotik-user-groups',
      x: 650, y: 450, width: 200, height: 100,
      label: 'MikroTik User Groups',
      type: 'groups',
      color: '#fff3cd',
      description: 'RouterOS user groups: full, read, write, reboot, test with custom policies'
    },
    {
      id: 'routeros-policies',
      x: 900, y: 450, width: 200, height: 100,
      label: 'RouterOS Policies',
      type: 'policies',
      color: '#d4edda',
      description: 'RouterOS policy framework with granular permission control'
    },
    {
      id: 'winbox-access',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Winbox Access',
      type: 'winbox',
      color: '#cce5ff',
      description: 'Winbox GUI access control with TACACS+ authentication'
    },
    {
      id: 'api-access',
      x: 525, y: 600, width: 200, height: 80,
      label: 'API Access',
      type: 'api',
      color: '#fff3cd',
      description: 'RouterOS API access with programmatic device management'
    },
    {
      id: 'mikrotik-logging',
      x: 775, y: 600, width: 200, height: 80,
      label: 'MikroTik Logging',
      type: 'logging',
      color: '#f8d7da',
      description: 'Comprehensive RouterOS logging with remote syslog support'
    }
  ]
}

const generateMikrotikTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-mikrotik-to-router', from: 'portnox-tacacs-mikrotik', to: 'mikrotik-router', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-mikrotik-to-switch', from: 'portnox-tacacs-mikrotik', to: 'mikrotik-switch', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-mikrotik-to-wireless', from: 'portnox-tacacs-mikrotik', to: 'mikrotik-wireless', type: 'secure', label: 'Wireless Auth' },
    { id: 'tacacs-mikrotik-to-capsman', from: 'portnox-tacacs-mikrotik', to: 'mikrotik-capsman', type: 'secure', label: 'CAPsMAN Auth' },
    { id: 'tacacs-mikrotik-to-entra', from: 'portnox-tacacs-mikrotik', to: 'entra-id-mikrotik', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-mikrotik-to-ad', from: 'portnox-tacacs-mikrotik', to: 'ad-server-mikrotik', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-groups-mikrotik', from: 'entra-id-mikrotik', to: 'mikrotik-user-groups', type: 'standard', label: 'Group Assignment' },
    { id: 'ad-to-groups-mikrotik', from: 'ad-server-mikrotik', to: 'mikrotik-user-groups', type: 'standard', label: 'Group Mapping' },
    { id: 'groups-to-policies', from: 'mikrotik-user-groups', to: 'routeros-policies', type: 'standard', label: 'Policy Application' },
    { id: 'router-to-winbox', from: 'mikrotik-router', to: 'winbox-access', type: 'standard', label: 'GUI Access' },
    { id: 'switch-to-api', from: 'mikrotik-switch', to: 'api-access', type: 'standard', label: 'API Management' },
    { id: 'wireless-to-logging', from: 'mikrotik-wireless', to: 'mikrotik-logging', type: 'standard', label: 'Wireless Logs' },
    { id: 'capsman-to-logging', from: 'mikrotik-capsman', to: 'mikrotik-logging', type: 'standard', label: 'Controller Logs' }
  ]
}

// Add Mist TACACS+ diagram
const generateMistTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-mist',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with Mist AI integration and cloud-native management'
    },
    {
      id: 'mist-access-points',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Mist Access Points',
      type: 'mist-ap',
      color: '#00d4aa',
      description: 'Mist AI-driven access points with cloud management and TACACS+ authentication',
      vendor: 'mist'
    },
    {
      id: 'mist-switches',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Mist EX Switches',
      type: 'mist-switch',
      color: '#00d4aa',
      description: 'Mist-managed EX switches with AI-driven operations and TACACS+ support',
      vendor: 'mist'
    },
    {
      id: 'mist-cloud',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Mist Cloud',
      type: 'mist-cloud',
      color: '#00d4aa',
      description: 'Mist AI-driven cloud platform with machine learning and automation',
      vendor: 'mist'
    },
    {
      id: 'mist-insights',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Mist AI Insights',
      type: 'mist-insights',
      color: '#00d4aa',
      description: 'AI-powered network insights with predictive analytics and troubleshooting',
      vendor: 'mist'
    },
    {
      id: 'entra-id-mist',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Mist cloud management'
    },
    {
      id: 'ad-server-mist',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Mist network administrator groups'
    },
    {
      id: 'mist-org-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Mist Org Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Mist organization roles: admin, write, read, helpdesk with site-level permissions'
    },
    {
      id: 'ai-operations',
      x: 900, y: 450, width: 200, height: 100,
      label: 'AI Operations',
      type: 'ai-ops',
      color: '#d4edda',
      description: 'AI-driven network operations with self-healing and optimization'
    },
    {
      id: 'location-services',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Location Services',
      type: 'location',
      color: '#cce5ff',
      description: 'Real-time location services with asset tracking and wayfinding'
    },
    {
      id: 'user-engagement',
      x: 525, y: 600, width: 200, height: 80,
      label: 'User Engagement',
      type: 'engagement',
      color: '#fff3cd',
      description: 'User engagement analytics with proximity and dwell time insights'
    },
    {
      id: 'mist-sle',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Mist SLE',
      type: 'sle',
      color: '#f8d7da',
      description: 'Service Level Expectations with proactive issue detection and resolution'
    }
  ]
}

const generateMistTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-mist-to-ap', from: 'portnox-tacacs-mist', to: 'mist-access-points', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-mist-to-switch', from: 'portnox-tacacs-mist', to: 'mist-switches', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-mist-to-cloud', from: 'portnox-tacacs-mist', to: 'mist-cloud', type: 'secure', label: 'Cloud Auth' },
    { id: 'tacacs-mist-to-insights', from: 'portnox-tacacs-mist', to: 'mist-insights', type: 'secure', label: 'AI Auth' },
    { id: 'tacacs-mist-to-entra', from: 'portnox-tacacs-mist', to: 'entra-id-mist', type: 'standard', label: 'SSO Integration' },
    { id: 'tacacs-mist-to-ad', from: 'portnox-tacacs-mist', to: 'ad-server-mist', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-roles-mist', from: 'entra-id-mist', to: 'mist-org-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-mist', from: 'ad-server-mist', to: 'mist-org-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-ai-ops', from: 'mist-org-roles', to: 'ai-operations', type: 'standard', label: 'AI Access Control' },
    { id: 'ap-to-location', from: 'mist-access-points', to: 'location-services', type: 'standard', label: 'Location Data' },
    { id: 'switch-to-engagement', from: 'mist-switches', to: 'user-engagement', type: 'standard', label: 'User Analytics' },
    { id: 'cloud-to-sle', from: 'mist-cloud', to: 'mist-sle', type: 'standard', label: 'SLE Monitoring' },
    { id: 'insights-to-sle', from: 'mist-insights', to: 'mist-sle', type: 'standard', label: 'AI Insights' }
  ]
}

// Add Meraki TACACS+ diagram
const generateMerakiTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-meraki',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Cisco Meraki cloud integration and dashboard SSO'
    },
    {
      id: 'meraki-access-points',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Meraki Access Points',
      type: 'meraki-ap',
      color: '#00bceb',
      description: 'Cisco Meraki wireless access points with cloud management and TACACS+ support',
      vendor: 'meraki'
    },
    {
      id: 'meraki-switches',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Meraki Switches',
      type: 'meraki-switch',
      color: '#00bceb',
      description: 'Cisco Meraki cloud-managed switches with TACACS+ authentication',
      vendor: 'meraki'
    },
    {
      id: 'meraki-security-appliances',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Meraki MX Security',
      type: 'meraki-mx',
      color: '#00bceb',
      description: 'Cisco Meraki MX security appliances with SD-WAN and TACACS+ integration',
      vendor: 'meraki'
    },
    {
      id: 'meraki-dashboard',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Meraki Dashboard',
      type: 'meraki-dashboard',
      color: '#00bceb',
      description: 'Cisco Meraki cloud dashboard with centralized management and TACACS+ SSO',
      vendor: 'meraki'
    },
    {
      id: 'entra-id-meraki',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Meraki dashboard access'
    },
    {
      id: 'ad-server-meraki',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Meraki administrator groups and organizational units'
    },
    {
      id: 'meraki-admin-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Meraki Admin Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Meraki administrative roles: full, read-only, enterprise with network-level permissions'
    },
    {
      id: 'cloud-monitoring',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Cloud Monitoring',
      type: 'monitoring',
      color: '#d4edda',
      description: 'Comprehensive cloud-based monitoring with real-time alerts and reporting'
    },
    {
      id: 'network-topology',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Network Topology',
      type: 'topology',
      color: '#cce5ff',
      description: 'Dynamic network topology visualization with auto-discovery and mapping'
    },
    {
      id: 'client-tracking',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Client Tracking',
      type: 'tracking',
      color: '#fff3cd',
      description: 'Real-time client tracking with location analytics and behavior insights'
    },
    {
      id: 'meraki-api',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Meraki API',
      type: 'api',
      color: '#f8d7da',
      description: 'RESTful API for automation, integration, and custom application development'
    }
  ]
}

const generateMerakiTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-meraki-to-ap', from: 'portnox-tacacs-meraki', to: 'meraki-access-points', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-meraki-to-switch', from: 'portnox-tacacs-meraki', to: 'meraki-switches', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-meraki-to-mx', from: 'portnox-tacacs-meraki', to: 'meraki-security-appliances', type: 'secure', label: 'MX Auth' },
    { id: 'tacacs-meraki-to-dashboard', from: 'portnox-tacacs-meraki', to: 'meraki-dashboard', type: 'secure', label: 'Dashboard SSO' },
    { id: 'tacacs-meraki-to-entra', from: 'portnox-tacacs-meraki', to: 'entra-id-meraki', type: 'standard', label: 'SAML Integration' },
    { id: 'tacacs-meraki-to-ad', from: 'portnox-tacacs-meraki', to: 'ad-server-meraki', type: 'standard', label: 'User Authentication' },
    { id: 'entra-to-roles-meraki', from: 'entra-id-meraki', to: 'meraki-admin-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-meraki', from: 'ad-server-meraki', to: 'meraki-admin-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-monitoring', from: 'meraki-admin-roles', to: 'cloud-monitoring', type: 'standard', label: 'Monitoring Access' },
    { id: 'ap-to-topology', from: 'meraki-access-points', to: 'network-topology', type: 'standard', label: 'Topology Data' },
    { id: 'switch-to-tracking', from: 'meraki-switches', to: 'client-tracking', type: 'standard', label: 'Client Data' },
    { id: 'dashboard-to-api', from: 'meraki-dashboard', to: 'meraki-api', type: 'standard', label: 'API Access' },
    { id: 'mx-to-api', from: 'meraki-security-appliances', to: 'meraki-api', type: 'standard', label: 'SD-WAN API' }
  ]
}

// Add Cambium TACACS+ diagram
const generateCambiumTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-cambium',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with Cambium Networks integration and cnMaestro support'
    },
    {
      id: 'cambium-access-points',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Cambium Access Points',
      type: 'cambium-ap',
      color: '#ff6b35',
      description: 'Cambium wireless access points with enterprise-grade security and TACACS+ support',
      vendor: 'cambium'
    },
    {
      id: 'cambium-switches',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Cambium Switches',
      type: 'cambium-switch',
      color: '#ff6b35',
      description: 'Cambium managed switches with PoE+ and TACACS+ authentication',
      vendor: 'cambium'
    },
    {
      id: 'cambium-ptp-backhaul',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Cambium PTP Backhaul',
      type: 'cambium-ptp',
      color: '#ff6b35',
      description: 'Cambium point-to-point wireless backhaul with high-capacity links',
      vendor: 'cambium'
    },
    {
      id: 'cnmaestro',
      x: 850, y: 250, width: 200, height: 120,
      label: 'cnMaestro',
      type: 'cnmaestro',
      color: '#ff6b35',
      description: 'Cambium cnMaestro cloud management platform with TACACS+ integration'
    },
    {
      id: 'entra-id-cambium',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with RADIUS integration for Cambium device management'
    },
    {
      id: 'ad-server-cambium',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Cambium network administrator groups'
    },
    {
      id: 'cambium-user-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Cambium User Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Cambium user roles: admin, installer, monitor with device-level permissions'
    },
    {
      id: 'wireless-optimization',
      x: 900, y: 450, width: 200, height: 100,
      label: 'Wireless Optimization',
      type: 'optimization',
      color: '#d4edda',
      description: 'Advanced wireless optimization with interference mitigation and capacity planning'
    },
    {
      id: 'spectrum-analysis',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Spectrum Analysis',
      type: 'spectrum',
      color: '#cce5ff',
      description: 'Real-time spectrum analysis with interference detection and channel optimization'
    },
    {
      id: 'link-planning',
      x: 525, y: 600, width: 200, height: 80,
      label: 'Link Planning',
      type: 'planning',
      color: '#fff3cd',
      description: 'Advanced link planning tools with path analysis and capacity modeling'
    },
    {
      id: 'cambium-analytics',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Cambium Analytics',
      type: 'analytics',
      color: '#f8d7da',
      description: 'Comprehensive network analytics with performance monitoring and reporting'
    }
  ]
}

const generateCambiumTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-cambium-to-ap', from: 'portnox-tacacs-cambium', to: 'cambium-access-points', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-cambium-to-switch', from: 'portnox-tacacs-cambium', to: 'cambium-switches', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-cambium-to-ptp', from: 'portnox-tacacs-cambium', to: 'cambium-ptp-backhaul', type: 'secure', label: 'Backhaul Auth' },
    { id: 'tacacs-cambium-to-cnmaestro', from: 'portnox-tacacs-cambium', to: 'cnmaestro', type: 'secure', label: 'Cloud Management' },
    { id: 'tacacs-cambium-to-entra', from: 'portnox-tacacs-cambium', to: 'entra-id-cambium', type: 'standard', label: 'Cloud Identity' },
    { id: 'tacacs-cambium-to-ad', from: 'portnox-tacacs-cambium', to: 'ad-server-cambium', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-roles-cambium', from: 'entra-id-cambium', to: 'cambium-user-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-cambium', from: 'ad-server-cambium', to: 'cambium-user-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-optimization', from: 'cambium-user-roles', to: 'wireless-optimization', type: 'standard', label: 'Optimization Access' },
    { id: 'ap-to-spectrum', from: 'cambium-access-points', to: 'spectrum-analysis', type: 'standard', label: 'Spectrum Data' },
    { id: 'ptp-to-planning', from: 'cambium-ptp-backhaul', to: 'link-planning', type: 'standard', label: 'Link Data' },
    { id: 'cnmaestro-to-analytics', from: 'cnmaestro', to: 'cambium-analytics', type: 'standard', label: 'Network Analytics' },
    { id: 'switch-to-analytics', from: 'cambium-switches', to: 'cambium-analytics', type: 'standard', label: 'Switch Analytics' }
  ]
}

// Add Mist TACACS+ diagram
const generateMistTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-mist',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Enterprise TACACS+ server with Mist AI integration and cloud-native management'
    },
    {
      id: 'mist-access-points',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Mist Access Points',
      type: 'mist-ap',
      color: '#00d4aa',
      description: 'Mist AI-driven access points with cloud management and TACACS+ authentication',
      vendor: 'mist'
    },
    {
      id: 'mist-switches',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Mist EX Switches',
      type: 'mist-switch',
      color: '#00d4aa',
      description: 'Mist-managed EX switches with AI-driven operations and TACACS+ support',
      vendor: 'mist'
    },
    {
      id: 'mist-cloud',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Mist Cloud',
      type: 'mist-cloud',
      color: '#00d4aa',
      description: 'Mist AI-driven cloud platform with machine learning and automation',
      vendor: 'mist'
    },
    {
      id: 'mist-insights',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Mist AI Insights',
      type: 'mist-insights',
      color: '#00d4aa',
      description: 'AI-powered network insights with predictive analytics and troubleshooting',
      vendor: 'mist'
    },
    {
      id: 'entra-id-mist',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Mist cloud management'
    },
    {
      id: 'ad-server-mist',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Mist network administrator groups'
    },
    {
      id: 'mist-org-roles',
      x: 650, y: 450, width: 200, height: 100,
      label: 'Mist Org Roles',
      type: 'roles',
      color: '#fff3cd',
      description: 'Mist organization roles: admin, write, read, helpdesk with site-level permissions'
    },
    {
      id: 'ai-operations',
      x: 900, y: 450, width: 200, height: 100,
      label: 'AI Operations',
      type: 'ai-ops',
      color: '#d4edda',
      description: 'AI-driven network operations with self-healing and optimization'
    },
    {
      id: 'location-services',
      x: 275, y: 600, width: 200, height: 80,
      label: 'Location Services',
      type: 'location',
      color: '#cce5ff',
      description: 'Real-time location services with asset tracking and wayfinding'
    },
    {
      id: 'user-engagement',
      x: 525, y: 600, width: 200, height: 80,
      label: 'User Engagement',
      type: 'engagement',
      color: '#fff3cd',
      description: 'User engagement analytics with proximity and dwell time insights'
    },
    {
      id: 'mist-sle',
      x: 775, y: 600, width: 200, height: 80,
      label: 'Mist SLE',
      type: 'sle',
      color: '#f8d7da',
      description: 'Service Level Expectations with proactive issue detection and resolution'
    }
  ]
}

const generateMistTACACSConnections = (): DiagramConnection[] => {
  return [
    { id: 'tacacs-mist-to-ap', from: 'portnox-tacacs-mist', to: 'mist-access-points', type: 'secure', label: 'TACACS+ Auth' },
    { id: 'tacacs-mist-to-switch', from: 'portnox-tacacs-mist', to: 'mist-switches', type: 'secure', label: 'Switch Auth' },
    { id: 'tacacs-mist-to-cloud', from: 'portnox-tacacs-mist', to: 'mist-cloud', type: 'secure', label: 'Cloud Auth' },
    { id: 'tacacs-mist-to-insights', from: 'portnox-tacacs-mist', to: 'mist-insights', type: 'secure', label: 'AI Auth' },
    { id: 'tacacs-mist-to-entra', from: 'portnox-tacacs-mist', to: 'entra-id-mist', type: 'standard', label: 'SSO Integration' },
    { id: 'tacacs-mist-to-ad', from: 'portnox-tacacs-mist', to: 'ad-server-mist', type: 'standard', label: 'User Lookup' },
    { id: 'entra-to-roles-mist', from: 'entra-id-mist', to: 'mist-org-roles', type: 'standard', label: 'Role Assignment' },
    { id: 'ad-to-roles-mist', from: 'ad-server-mist', to: 'mist-org-roles', type: 'standard', label: 'Group Mapping' },
    { id: 'roles-to-ai-ops', from: 'mist-org-roles', to: 'ai-operations', type: 'standard', label: 'AI Access Control' },
    { id: 'ap-to-location', from: 'mist-access-points', to: 'location-services', type: 'standard', label: 'Location Data' },
    { id: 'switch-to-engagement', from: 'mist-switches', to: 'user-engagement', type: 'standard', label: 'User Analytics' },
    { id: 'cloud-to-sle', from: 'mist-cloud', to: 'mist-sle', type: 'standard', label: 'SLE Monitoring' },
    { id: 'insights-to-sle', from: 'mist-insights', to: 'mist-sle', type: 'standard', label: 'AI Insights' }
  ]
}

// Add Meraki TACACS+ diagram
const generateMerakiTACACSNodes = (): DiagramNode[] => {
  return [
    {
      id: 'portnox-tacacs-meraki',
      x: 450, y: 50, width: 300, height: 100,
      label: 'Portnox TACACS+ Server',
      type: 'tacacs',
      color: '#e3f2fd',
      description: 'Centralized TACACS+ server with Cisco Meraki cloud integration and dashboard SSO'
    },
    {
      id: 'meraki-access-points',
      x: 100, y: 250, width: 200, height: 120,
      label: 'Meraki Access Points',
      type: 'meraki-ap',
      color: '#00bceb',
      description: 'Cisco Meraki wireless access points with cloud management and TACACS+ support',
      vendor: 'meraki'
    },
    {
      id: 'meraki-switches',
      x: 350, y: 250, width: 200, height: 120,
      label: 'Meraki Switches',
      type: 'meraki-switch',
      color: '#00bceb',
      description: 'Cisco Meraki cloud-managed switches with TACACS+ authentication',
      vendor: 'meraki'
    },
    {
      id: 'meraki-security-appliances',
      x: 600, y: 250, width: 200, height: 120,
      label: 'Meraki MX Security',
      type: 'meraki-mx',
      color: '#00bceb',
      description: 'Cisco Meraki MX security appliances with SD-WAN and TACACS+ integration',
      vendor: 'meraki'
    },
    {
      id: 'meraki-dashboard',
      x: 850, y: 250, width: 200, height: 120,
      label: 'Meraki Dashboard',
      type: 'meraki-dashboard',
      color: '#00bceb',
      description: 'Cisco Meraki cloud dashboard with centralized management and TACACS+ SSO',
      vendor: 'meraki'
    },
    {
      id: 'entra-id-meraki',
      x: 150, y: 450, width: 200, height: 100,
      label: 'Microsoft Entra ID',
      type: 'entra',
      color: '#e1f5fe',
      description: 'Cloud identity with SAML integration for Meraki dashboard access'
    },
    {
      id: 'ad-server-meraki',
      x: 400, y: 450, width: 200, height: 100,
      label: 'Active Directory',
      type: 'ad',
      color: '#e1f5fe',
      description: 'Active Directory with Meraki administrator groups and organizational units'
    },
    {
      id: 'meraki-admin-roles',
      x: 650, y: 450, width: 200, height:
