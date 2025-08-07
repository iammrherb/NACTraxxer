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
        newNodes = generateFortigateTACACSNodes()
        newConnections = generateFortigateTACACSConnections()
        break
      case 'palo-tacacs':
        newNodes = generatePaloTACACSNodes()
        newConnections = generatePaloTACACSConnections()
        break
      case 'palo-userid':
        newNodes = generatePaloUserIDNodes()
        newConnections = generatePaloUserIDConnections()
        break
      case 'fortigate-fsso':
        newNodes = generateFortigateFSSONodes()
        newConnections = generateFortigateFSSOConnections()
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

  const getVendorLogo = (vendor: string): string => {
    switch (vendor) {
      case 'fortinet': return 'FG'
      case 'paloalto': return 'PA'
      case 'cisco': return 'C'
      case 'aruba': return 'A'
      case 'juniper': return 'J'
      default: return '?'
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
                stroke={isSelected ? '#00c8d7' : isConnectionStart ? '#10b981' : '#6b7280'}
                strokeWidth={isSelected || isConnectionStart ? 3 : 2}
                className="transition-all duration-200"
              />
            
              {/* Vendor logo/icon */}
              {node.vendor && (
                <g>
                  <circle
                    cx={node.x + 20}
                    cy={node.y + 20}
                    r={12}
                    fill="white"
                    stroke="#6b7280"
                    strokeWidth={1}
                  />
                  <text
                    x={node.x + 20}
                    y={node.y + 25}
                    textAnchor="middle"
                    fontSize="12"
                    className="pointer-events-none"
                  >
                    {getVendorLogo(node.vendor)}
                  </text>
                </g>
              )}
            
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800 dark:fill-gray-200 font-semibold text-sm pointer-events-none"
                style={{ fontSize: '14px', fontWeight: '600' }}
              >
                {node.label}
              </text>
            
              {/* Connection points with Portnox colors */}
              <circle
                cx={node.x + node.width / 2}
                cy={node.y}
                r={6}
                fill="#00c8d7"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x + node.width}
                cy={node.y + node.height / 2}
                r={6}
                fill="#00c8d7"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x + node.width / 2}
                cy={node.y + node.height}
                r={6}
                fill="#00c8d7"
                stroke="white"
                strokeWidth={2}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
              <circle
                cx={node.x}
                cy={node.y + node.height / 2}
                r={6}
                fill="#00c8d7"
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
              {node.vendor && (
                <p className="text-xs text-[#00c8d7] mt-1 font-medium">Vendor: {node.vendor}</p>
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
    let strokeWidth = 2
    let stroke = connection.color || '#6b7280'

    switch (connection.type) {
      case 'secure':
        stroke = '#10b981'
        strokeWidth = 3
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
    <div className="w-full h-[700px] overflow-auto architecture-diagram">
      <svg
        ref={svgRef}
        width="1200"
        height="800"
        viewBox="0 0 1200 800"
        className="w-full h-full bg-white"
        style={{ backgroundColor: 'white' }}
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
      <div className="mt-4 p-4 bg-[#00c8d7]/10 dark:bg-[#00c8d7]/20 rounded-lg border border-[#00c8d7]/20">
        <p className="text-sm text-[#00c8d7] dark:text-[#00c8d7]">
          <strong>Instructions:</strong> Click nodes to select them. Double-click a node to start drawing a custom connection. 
          Hover over nodes to see connection points and detailed descriptions.
        </p>
      </div>
    </div>
  )
}
