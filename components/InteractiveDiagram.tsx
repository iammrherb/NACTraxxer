'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Edit, Trash2, Plus, Save, Download, Upload, Settings, Container, Server, Database, Shield, Network, Cloud } from 'lucide-react'

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
  editable?: boolean
  deploymentType?: 'container' | 'vm' | 'cloud' | 'physical'
  metadata?: {
    [key: string]: any
  }
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  label: string
  type: 'radius' | 'https' | 'ldap' | 'syslog' | 'tacacs' | 'data' | 'radsec' | 'vpn' | 'direct' | 'coa' | 'saml'
  animated: boolean
  editable?: boolean
  bidirectional?: boolean
}

interface DeploymentOption {
  id: string
  name: string
  description: string
  components: string[]
  enabled: boolean
  deploymentType: 'container' | 'vm' | 'cloud'
}

interface DiagramState {
  nodes: DiagramNode[]
  connections: DiagramConnection[]
  deploymentOptions: DeploymentOption[]
  metadata: {
    lastModified: string
    version: string
    author: string
  }
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
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [isDrawingConnection, setIsDrawingConnection] = useState(false)
  const [startPoint, setStartPoint] = useState<{x: number, y: number, nodeId: string} | null>(null)
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [showConnectionEditor, setShowConnectionEditor] = useState(false)
  const [showDeploymentOptions, setShowDeploymentOptions] = useState(false)
  const [editingNode, setEditingNode] = useState<DiagramNode | null>(null)
  const [editingConnection, setEditingConnection] = useState<DiagramConnection | null>(null)
  const [deploymentOptions, setDeploymentOptions] = useState<DeploymentOption[]>([])
  const [diagramState, setDiagramState] = useState<DiagramState | null>(null)

  // Persistent state management
  const saveState = useCallback((state: DiagramState) => {
    const stateKey = `diagram-${view}-${cloudProvider}-${networkVendor}`
    localStorage.setItem(stateKey, JSON.stringify(state))
    console.log('State saved:', stateKey)
  }, [view, cloudProvider, networkVendor])

  const loadState = useCallback((): DiagramState | null => {
    const stateKey = `diagram-${view}-${cloudProvider}-${networkVendor}`
    const saved = localStorage.getItem(stateKey)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
    return null
  }, [view, cloudProvider, networkVendor])

  // Enhanced diagram data with new deployment options
  const getDiagramData = () => {
    const savedState = loadState()
    if (savedState) {
      return savedState
    }

    switch (view) {
      case 'complete':
        return getCompleteArchitecture()
      case 'auth-flow':
        return getAuthenticationFlow()
      case 'radsec-proxy':
        return getEnhancedRADSecProxyArchitecture()
      case 'vlan-assignment':
        return getVLANAssignmentDiagram()
      case 'pki':
        return getPKIInfrastructure()
      case 'policies':
        return getPolicyFramework()
      case 'connectivity':
        return getConnectivityOptions()
      case 'intune':
        return getIntuneIntegration()
      case 'intune-compliance':
        return getIntuneComplianceDiagram()
      case 'onboarding':
        return getDeviceOnboarding()
      case 'tacacs-entra':
        return getTACACSEntraIntegration()
      case 'tacacs-workflow':
        return getTACACSWorkflow()
      case 'siem-integration':
        return getSIEMIntegration()
      case 'coa-deployment':
        return getCOADeployment()
      case 'fortigate-tacacs':
        return getFortiGateTACACS()
      case 'palo-tacacs':
        return getPaloAltoTACACS()
      case 'palo-userid':
        return getPaloAltoUserID()
      case 'fortigate-fsso':
        return getFortiGateFSSO()
      case 'zero-trust':
        return getZeroTrustArchitecture()
      case 'cloud-native':
        return getCloudNativeDeployment()
      default:
        return getCompleteArchitecture()
    }
  }

  const getEnhancedRADSecProxyArchitecture = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'site-network',
        label: 'ABM Site Network',
        type: 'site',
        x: 50,
        y: 200,
        width: 160,
        height: 120,
        color: '#e8f5e9',
        icon: '🏢',
        description: 'Corporate site with Portnox-compatible network infrastructure',
        connections: ['internet-gateway'],
        editable: true,
        metadata: {
          switches: 24,
          accessPoints: 45,
          users: 350
        }
      },
      {
        id: 'internet-gateway',
        label: 'Internet Gateway',
        type: 'network',
        x: 280,
        y: 230,
        width: 140,
        height: 60,
        color: '#f5f5f5',
        icon: '🌐',
        description: 'Site internet connection with firewall',
        connections: ['cloud-lb'],
        editable: true
      },
      {
        id: 'cloud-lb',
        label: `${cloudProvider.toUpperCase()} ALB`,
        type: 'cloud',
        x: 480,
        y: 200,
        width: 180,
        height: 80,
        color: cloudProvider === 'aws' ? '#FF9900' : '#0078D4',
        icon: '⚖️',
        description: 'Application Load Balancer for RADSec proxies with health checks',
        connections: ['radsec-container-1', 'radsec-container-2', 'radsec-vm-1'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'radsec-container-1',
        label: 'RADSec Proxy Container AZ-1',
        type: 'proxy',
        x: 720,
        y: 80,
        width: 180,
        height: 100,
        color: '#7C3AED',
        icon: '📦',
        description: 'Containerized RADSec proxy with 7-day cache and COA support',
        connections: ['portnox-radius', 'coa-service'],
        editable: true,
        deploymentType: 'container',
        metadata: {
          image: 'portnox/radsec-proxy:latest',
          cpu: '2 vCPU',
          memory: '4GB',
          storage: '20GB SSD'
        }
      },
      {
        id: 'radsec-container-2',
        label: 'RADSec Proxy Container AZ-2',
        type: 'proxy',
        x: 720,
        y: 200,
        width: 180,
        height: 100,
        color: '#7C3AED',
        icon: '📦',
        description: 'Secondary containerized RADSec proxy for high availability',
        connections: ['portnox-radius', 'coa-service'],
        editable: true,
        deploymentType: 'container',
        metadata: {
          image: 'portnox/radsec-proxy:latest',
          cpu: '2 vCPU',
          memory: '4GB',
          storage: '20GB SSD'
        }
      },
      {
        id: 'radsec-vm-1',
        label: 'RADSec Proxy VM AZ-3',
        type: 'proxy',
        x: 720,
        y: 320,
        width: 180,
        height: 100,
        color: '#8B5CF6',
        icon: '🖥️',
        description: 'VM-based RADSec proxy for legacy compatibility',
        connections: ['portnox-radius'],
        editable: true,
        deploymentType: 'vm',
        metadata: {
          os: 'Ubuntu 22.04 LTS',
          cpu: '4 vCPU',
          memory: '8GB',
          storage: '50GB SSD'
        }
      },
      {
        id: 'coa-service',
        label: 'COA Service',
        type: 'coa',
        x: 950,
        y: 140,
        width: 160,
        height: 80,
        color: '#DC2626',
        icon: '🔄',
        description: 'Change of Authorization service for dynamic policy updates',
        connections: ['portnox-radius'],
        editable: true,
        deploymentType: 'container'
      },
      {
        id: 'portnox-radius',
        label: 'Portnox Cloud RADIUS',
        type: 'nac',
        x: 950,
        y: 250,
        width: 160,
        height: 100,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Portnox Cloud RADIUS service with policy engine',
        connections: ['cache-redis', 'monitoring', 'siem-forwarder'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'cache-redis',
        label: 'Redis Cache Cluster',
        type: 'cache',
        x: 950,
        y: 380,
        width: 160,
        height: 60,
        color: '#DC382D',
        icon: '💾',
        description: '7-day authentication cache with persistence',
        connections: [],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'monitoring',
        label: 'CloudWatch/Monitor',
        type: 'monitoring',
        x: 1150,
        y: 200,
        width: 160,
        height: 60,
        color: '#FF9900',
        icon: '📊',
        description: 'Real-time monitoring with Portnox dashboards',
        connections: [],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'siem-forwarder',
        label: 'SIEM Syslog Forwarder',
        type: 'siem',
        x: 1150,
        y: 300,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '📡',
        description: 'Containerized syslog forwarder for SIEM integration',
        connections: ['external-siem'],
        editable: true,
        deploymentType: 'container'
      },
      {
        id: 'external-siem',
        label: 'External SIEM',
        type: 'siem',
        x: 1150,
        y: 420,
        width: 160,
        height: 60,
        color: '#7C2D12',
        icon: '🔍',
        description: 'External SIEM system (Splunk, QRadar, etc.)',
        connections: [],
        editable: true,
        deploymentType: 'physical'
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'site-gateway', from: 'site-network', to: 'internet-gateway', label: 'RADIUS:1812/1813', type: 'radius', animated: true, editable: true },
      { id: 'gateway-lb', from: 'internet-gateway', to: 'cloud-lb', label: 'RADSec:2083', type: 'radsec', animated: true, editable: true },
      { id: 'lb-container1', from: 'cloud-lb', to: 'radsec-container-1', label: 'Load Balanced', type: 'radsec', animated: true, editable: true },
      { id: 'lb-container2', from: 'cloud-lb', to: 'radsec-container-2', label: 'Load Balanced', type: 'radsec', animated: true, editable: true },
      { id: 'lb-vm1', from: 'cloud-lb', to: 'radsec-vm-1', label: 'Failover', type: 'radsec', animated: false, editable: true },
      { id: 'container1-radius', from: 'radsec-container-1', to: 'portnox-radius', label: 'TLS 1.3', type: 'radsec', animated: true, editable: true },
      { id: 'container2-radius', from: 'radsec-container-2', to: 'portnox-radius', label: 'TLS 1.3', type: 'radsec', animated: true, editable: true },
      { id: 'vm1-radius', from: 'radsec-vm-1', to: 'portnox-radius', label: 'TLS 1.3', type: 'radsec', animated: true, editable: true },
      { id: 'container1-coa', from: 'radsec-container-1', to: 'coa-service', label: 'COA Updates', type: 'coa', animated: true, editable: true, bidirectional: true },
      { id: 'container2-coa', from: 'radsec-container-2', to: 'coa-service', label: 'COA Updates', type: 'coa', animated: true, editable: true, bidirectional: true },
      { id: 'coa-radius', from: 'coa-service', to: 'portnox-radius', label: 'Policy Sync', type: 'https', animated: true, editable: true },
      { id: 'radius-cache', from: 'portnox-radius', to: 'cache-redis', label: 'Cache Store', type: 'data', animated: true, editable: true },
      { id: 'radius-monitor', from: 'portnox-radius', to: 'monitoring', label: 'Metrics/Logs', type: 'data', animated: true, editable: true },
      { id: 'radius-siem', from: 'portnox-radius', to: 'siem-forwarder', label: 'Audit Logs', type: 'syslog', animated: true, editable: true },
      { id: 'siem-external', from: 'siem-forwarder', to: 'external-siem', label: 'Syslog/CEF', type: 'syslog', animated: true, editable: true }
    ]

    const deploymentOptions: DeploymentOption[] = [
      {
        id: 'container-deployment',
        name: 'Container Deployment',
        description: 'Deploy RADSec proxies as containers for scalability',
        components: ['radsec-container-1', 'radsec-container-2', 'coa-service', 'siem-forwarder'],
        enabled: true,
        deploymentType: 'container'
      },
      {
        id: 'vm-deployment',
        name: 'VM Deployment',
        description: 'Deploy RADSec proxies as VMs for legacy compatibility',
        components: ['radsec-vm-1'],
        enabled: true,
        deploymentType: 'vm'
      },
      {
        id: 'coa-support',
        name: 'Change of Authorization',
        description: 'Enable dynamic policy updates via COA',
        components: ['coa-service'],
        enabled: true,
        deploymentType: 'container'
      },
      {
        id: 'siem-integration',
        name: 'SIEM Integration',
        description: 'Forward logs to external SIEM systems',
        components: ['siem-forwarder', 'external-siem'],
        enabled: true,
        deploymentType: 'container'
      }
    ]

    return {
      nodes,
      connections,
      deploymentOptions,
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getVLANAssignmentDiagram = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'user-device',
        label: 'User Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'Corporate device requesting network access',
        connections: ['switch'],
        editable: true
      },
      {
        id: 'switch',
        label: 'Managed Switch',
        type: 'network',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '🔌',
        description: '802.1X capable switch with VLAN support',
        connections: ['portnox-nac'],
        editable: true
      },
      {
        id: 'portnox-nac',
        label: 'Portnox NAC',
        type: 'nac',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with dynamic VLAN assignment',
        connections: ['policy-engine', 'identity-store'],
        editable: true
      },
      {
        id: 'policy-engine',
        label: 'Policy Engine',
        type: 'policy',
        x: 650,
        y: 150,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '⚙️',
        description: 'VLAN assignment based on user/device policies',
        connections: ['vlan-corporate', 'vlan-guest', 'vlan-iot', 'vlan-quarantine'],
        editable: true
      },
      {
        id: 'identity-store',
        label: 'Identity Store',
        type: 'identity',
        x: 650,
        y: 250,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'User and device identity verification',
        connections: [],
        editable: true
      },
      {
        id: 'vlan-corporate',
        label: 'Corporate VLAN 100',
        type: 'vlan',
        x: 900,
        y: 50,
        width: 160,
        height: 80,
        color: '#10B981',
        icon: '🏢',
        description: 'Full access for corporate devices',
        connections: [],
        editable: true,
        metadata: {
          vlanId: 100,
          subnet: '10.1.100.0/24',
          gateway: '10.1.100.1',
          access: 'Full Network Access'
        }
      },
      {
        id: 'vlan-guest',
        label: 'Guest VLAN 200',
        type: 'vlan',
        x: 900,
        y: 150,
        width: 160,
        height: 80,
        color: '#F59E0B',
        icon: '👥',
        description: 'Limited access for guest devices',
        connections: [],
        editable: true,
        metadata: {
          vlanId: 200,
          subnet: '10.1.200.0/24',
          gateway: '10.1.200.1',
          access: 'Internet Only'
        }
      },
      {
        id: 'vlan-iot',
        label: 'IoT VLAN 300',
        type: 'vlan',
        x: 900,
        y: 250,
        width: 160,
        height: 80,
        color: '#8B5CF6',
        icon: '🔗',
        description: 'Isolated network for IoT devices',
        connections: [],
        editable: true,
        metadata: {
          vlanId: 300,
          subnet: '10.1.300.0/24',
          gateway: '10.1.300.1',
          access: 'IoT Services Only'
        }
      },
      {
        id: 'vlan-quarantine',
        label: 'Quarantine VLAN 999',
        type: 'vlan',
        x: 900,
        y: 350,
        width: 160,
        height: 80,
        color: '#EF4444',
        icon: '🚫',
        description: 'Restricted access for non-compliant devices',
        connections: [],
        editable: true,
        metadata: {
          vlanId: 999,
          subnet: '10.1.999.0/24',
          gateway: '10.1.999.1',
          access: 'Remediation Portal Only'
        }
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'device-switch', from: 'user-device', to: 'switch', label: '802.1X Request', type: 'radius', animated: true, editable: true },
      { id: 'switch-nac', from: 'switch', to: 'portnox-nac', label: 'RADIUS Auth', type: 'radius', animated: true, editable: true },
      { id: 'nac-policy', from: 'portnox-nac', to: 'policy-engine', label: 'Policy Query', type: 'data', animated: true, editable: true },
      { id: 'nac-identity', from: 'portnox-nac', to: 'identity-store', label: 'Identity Lookup', type: 'ldap', animated: true, editable: true },
      { id: 'policy-corporate', from: 'policy-engine', to: 'vlan-corporate', label: 'Corporate User', type: 'data', animated: true, editable: true },
      { id: 'policy-guest', from: 'policy-engine', to: 'vlan-guest', label: 'Guest User', type: 'data', animated: true, editable: true },
      { id: 'policy-iot', from: 'policy-engine', to: 'vlan-iot', label: 'IoT Device', type: 'data', animated: true, editable: true },
      { id: 'policy-quarantine', from: 'policy-engine', to: 'vlan-quarantine', label: 'Non-Compliant', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getIntuneComplianceDiagram = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'managed-device',
        label: 'Intune Managed Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 160,
        height: 100,
        color: '#4F46E5',
        icon: '📱',
        description: 'Corporate device enrolled in Microsoft Intune',
        connections: ['network-access'],
        editable: true,
        metadata: {
          os: 'Windows 11',
          compliance: 'Compliant',
          lastCheckin: '2024-01-15T10:30:00Z'
        }
      },
      {
        id: 'network-access',
        label: 'Network Access Point',
        type: 'network',
        x: 280,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '📶',
        description: '802.1X wireless access point',
        connections: ['portnox-nac'],
        editable: true
      },
      {
        id: 'portnox-nac',
        label: 'Portnox NAC',
        type: 'nac',
        x: 480,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with Intune compliance integration',
        connections: ['intune-connector', 'compliance-engine'],
        editable: true
      },
      {
        id: 'intune-connector',
        label: 'Intune Connector',
        type: 'connector',
        x: 680,
        y: 120,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '🔗',
        description: 'Real-time Intune compliance data connector',
        connections: ['intune-service'],
        editable: true
      },
      {
        id: 'intune-service',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 900,
        y: 120,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '🔧',
        description: 'Microsoft Intune MDM service',
        connections: ['compliance-policies'],
        editable: true
      },
      {
        id: 'compliance-policies',
        label: 'Compliance Policies',
        type: 'policy',
        x: 1120,
        y: 120,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '📋',
        description: 'Device compliance policy definitions',
        connections: [],
        editable: true,
        metadata: {
          policies: ['Antivirus Required', 'OS Version Check', 'Encryption Required', 'Jailbreak Detection']
        }
      },
      {
        id: 'compliance-engine',
        label: 'Compliance Engine',
        type: 'compliance',
        x: 680,
        y: 280,
        width: 160,
        height: 80,
        color: '#DC2626',
        icon: '⚖️',
        description: 'Real-time compliance evaluation engine',
        connections: ['risk-assessment', 'remediation-actions'],
        editable: true
      },
      {
        id: 'risk-assessment',
        label: 'Risk Assessment',
        type: 'risk',
        x: 900,
        y: 240,
        width: 160,
        height: 80,
        color: '#F59E0B',
        icon: '⚠️',
        description: 'Device risk scoring and threat assessment',
        connections: [],
        editable: true,
        metadata: {
          riskFactors: ['Compliance Status', 'Threat Detection', 'App Risk', 'Network Risk']
        }
      },
      {
        id: 'remediation-actions',
        label: 'Remediation Actions',
        type: 'remediation',
        x: 900,
        y: 340,
        width: 160,
        height: 80,
        color: '#EF4444',
        icon: '🔧',
        description: 'Automated remediation and quarantine actions',
        connections: [],
        editable: true,
        metadata: {
          actions: ['Quarantine', 'Block Access', 'Require Update', 'Notify Admin']
        }
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'device-network', from: 'managed-device', to: 'network-access', label: '802.1X EAP-TLS', type: 'radius', animated: true, editable: true },
      { id: 'network-nac', from: 'network-access', to: 'portnox-nac', label: 'RADIUS Request', type: 'radius', animated: true, editable: true },
      { id: 'nac-connector', from: 'portnox-nac', to: 'intune-connector', label: 'Compliance Query', type: 'https', animated: true, editable: true },
      { id: 'connector-intune', from: 'intune-connector', to: 'intune-service', label: 'Graph API', type: 'https', animated: true, editable: true },
      { id: 'intune-policies', from: 'intune-service', to: 'compliance-policies', label: 'Policy Sync', type: 'data', animated: true, editable: true },
      { id: 'nac-compliance', from: 'portnox-nac', to: 'compliance-engine', label: 'Compliance Check', type: 'data', animated: true, editable: true },
      { id: 'compliance-risk', from: 'compliance-engine', to: 'risk-assessment', label: 'Risk Evaluation', type: 'data', animated: true, editable: true },
      { id: 'compliance-remediation', from: 'compliance-engine', to: 'remediation-actions', label: 'Action Trigger', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getTACACSEntraIntegration = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'network-admin',
        label: 'Network Administrator',
        type: 'user',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator requiring device access',
        connections: ['network-device'],
        editable: true
      },
      {
        id: 'network-device',
        label: 'Network Device',
        type: 'firewall',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔥',
        description: 'Cisco/Juniper/Aruba network device',
        connections: ['tacacs-container', 'tacacs-vm'],
        editable: true
      },
      {
        id: 'tacacs-container',
        label: 'TACACS+ Container',
        type: 'tacacs',
        x: 450,
        y: 150,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '📦',
        description: 'Containerized TACACS+ service with Entra integration',
        connections: ['entra-id', 'portnox-policy'],
        editable: true,
        deploymentType: 'container',
        metadata: {
          image: 'portnox/tacacs-plus:latest',
          cpu: '1 vCPU',
          memory: '2GB'
        }
      },
      {
        id: 'tacacs-vm',
        label: 'TACACS+ VM',
        type: 'tacacs',
        x: 450,
        y: 250,
        width: 160,
        height: 80,
        color: '#8B5CF6',
        icon: '🖥️',
        description: 'VM-based TACACS+ service for high availability',
        connections: ['entra-id', 'portnox-policy'],
        editable: true,
        deploymentType: 'vm',
        metadata: {
          os: 'Ubuntu 22.04 LTS',
          cpu: '2 vCPU',
          memory: '4GB'
        }
      },
      {
        id: 'entra-id',
        label: 'Microsoft Entra ID',
        type: 'identity',
        x: 700,
        y: 100,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '🔐',
        description: 'Azure AD/Entra ID for user authentication',
        connections: ['conditional-access'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'conditional-access',
        label: 'Conditional Access',
        type: 'policy',
        x: 900,
        y: 100,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '🛡️',
        description: 'Azure Conditional Access policies',
        connections: [],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'portnox-policy',
        label: 'Portnox Policy Engine',
        type: 'policy',
        x: 700,
        y: 250,
        width: 160,
        height: 80,
        color: '#00c8d7',
        icon: '⚙️',
        description: 'Portnox policy engine for command authorization',
        connections: ['audit-logging'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'audit-logging',
        label: 'Audit & Compliance',
        type: 'audit',
        x: 900,
        y: 250,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '📋',
        description: 'Comprehensive audit logging and compliance reporting',
        connections: [],
        editable: true,
        deploymentType: 'cloud'
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'admin-device', from: 'network-admin', to: 'network-device', label: 'SSH/HTTPS Login', type: 'https', animated: true, editable: true },
      { id: 'device-tacacs-container', from: 'network-device', to: 'tacacs-container', label: 'TACACS+ Auth', type: 'tacacs', animated: true, editable: true },
      { id: 'device-tacacs-vm', from: 'network-device', to: 'tacacs-vm', label: 'TACACS+ Failover', type: 'tacacs', animated: false, editable: true },
      { id: 'tacacs-container-entra', from: 'tacacs-container', to: 'entra-id', label: 'SAML/OAuth', type: 'saml', animated: true, editable: true },
      { id: 'tacacs-vm-entra', from: 'tacacs-vm', to: 'entra-id', label: 'SAML/OAuth', type: 'saml', animated: true, editable: true },
      { id: 'entra-conditional', from: 'entra-id', to: 'conditional-access', label: 'Policy Check', type: 'https', animated: true, editable: true },
      { id: 'tacacs-container-policy', from: 'tacacs-container', to: 'portnox-policy', label: 'Command Auth', type: 'https', animated: true, editable: true },
      { id: 'tacacs-vm-policy', from: 'tacacs-vm', to: 'portnox-policy', label: 'Command Auth', type: 'https', animated: true, editable: true },
      { id: 'policy-audit', from: 'portnox-policy', to: 'audit-logging', label: 'Audit Trail', type: 'syslog', animated: true, editable: true }
    ]

    const deploymentOptions: DeploymentOption[] = [
      {
        id: 'tacacs-container',
        name: 'TACACS+ Container',
        description: 'Deploy TACACS+ as containerized service',
        components: ['tacacs-container'],
        enabled: true,
        deploymentType: 'container'
      },
      {
        id: 'tacacs-vm',
        name: 'TACACS+ VM',
        description: 'Deploy TACACS+ as virtual machine',
        components: ['tacacs-vm'],
        enabled: true,
        deploymentType: 'vm'
      },
      {
        id: 'entra-integration',
        name: 'Entra ID Integration',
        description: 'Integrate with Microsoft Entra ID for authentication',
        components: ['entra-id', 'conditional-access'],
        enabled: true,
        deploymentType: 'cloud'
      }
    ]

    return {
      nodes,
      connections,
      deploymentOptions,
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getTACACSWorkflow = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'step1-login',
        label: 'Step 1: Admin Login',
        type: 'workflow',
        x: 50,
        y: 100,
        width: 160,
        height: 80,
        color: '#4F46E5',
        icon: '1️⃣',
        description: 'Administrator initiates login to network device',
        connections: ['step2-tacacs'],
        editable: true
      },
      {
        id: 'step2-tacacs',
        label: 'Step 2: TACACS+ Request',
        type: 'workflow',
        x: 280,
        y: 100,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '2️⃣',
        description: 'Network device sends TACACS+ authentication request',
        connections: ['step3-entra'],
        editable: true
      },
      {
        id: 'step3-entra',
        label: 'Step 3: Entra ID Auth',
        type: 'workflow',
        x: 510,
        y: 100,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '3️⃣',
        description: 'TACACS+ service authenticates user via Entra ID',
        connections: ['step4-mfa'],
        editable: true
      },
      {
        id: 'step4-mfa',
        label: 'Step 4: MFA Challenge',
        type: 'workflow',
        x: 740,
        y: 100,
        width: 160,
        height: 80,
        color: '#DC2626',
        icon: '4️⃣',
        description: 'Multi-factor authentication challenge',
        connections: ['step5-policy'],
        editable: true
      },
      {
        id: 'step5-policy',
        label: 'Step 5: Policy Check',
        type: 'workflow',
        x: 970,
        y: 100,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '5️⃣',
        description: 'Conditional access and role-based policy evaluation',
        connections: ['step6-authorization'],
        editable: true
      },
      {
        id: 'step6-authorization',
        label: 'Step 6: Authorization',
        type: 'workflow',
        x: 740,
        y: 250,
        width: 160,
        height: 80,
        color: '#EA580C',
        icon: '6️⃣',
        description: 'Command-level authorization based on user role',
        connections: ['step7-audit'],
        editable: true
      },
      {
        id: 'step7-audit',
        label: 'Step 7: Audit Logging',
        type: 'workflow',
        x: 510,
        y: 250,
        width: 160,
        height: 80,
        color: '#7C2D12',
        icon: '7️⃣',
        description: 'Comprehensive audit logging for compliance',
        connections: ['step8-access'],
        editable: true
      },
      {
        id: 'step8-access',
        label: 'Step 8: Access Granted',
        type: 'workflow',
        x: 280,
        y: 250,
        width: 160,
        height: 80,
        color: '#10B981',
        icon: '8️⃣',
        description: 'User granted access with appropriate privileges',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'flow1-2', from: 'step1-login', to: 'step2-tacacs', label: 'Login Request', type: 'https', animated: true, editable: true },
      { id: 'flow2-3', from: 'step2-tacacs', to: 'step3-entra', label: 'Auth Request', type: 'tacacs', animated: true, editable: true },
      { id: 'flow3-4', from: 'step3-entra', to: 'step4-mfa', label: 'User Lookup', type: 'saml', animated: true, editable: true },
      { id: 'flow4-5', from: 'step4-mfa', to: 'step5-policy', label: 'MFA Success', type: 'https', animated: true, editable: true },
      { id: 'flow5-6', from: 'step5-policy', to: 'step6-authorization', label: 'Policy Result', type: 'data', animated: true, editable: true },
      { id: 'flow6-7', from: 'step6-authorization', to: 'step7-audit', label: 'Auth Decision', type: 'data', animated: true, editable: true },
      { id: 'flow7-8', from: 'step7-audit', to: 'step8-access', label: 'Log & Grant', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getSIEMIntegration = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 100,
        y: 200,
        width: 160,
        height: 100,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Portnox Cloud NAC generating security events',
        connections: ['syslog-container', 'syslog-vm'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'syslog-container',
        label: 'Syslog Forwarder Container',
        type: 'siem',
        x: 350,
        y: 150,
        width: 180,
        height: 80,
        color: '#7C3AED',
        icon: '📦',
        description: 'Containerized syslog forwarder with filtering and enrichment',
        connections: ['splunk', 'qradar'],
        editable: true,
        deploymentType: 'container',
        metadata: {
          image: 'portnox/syslog-forwarder:latest',
          cpu: '1 vCPU',
          memory: '2GB',
          protocols: ['Syslog', 'CEF', 'LEEF', 'JSON']
        }
      },
      {
        id: 'syslog-vm',
        label: 'Syslog Forwarder VM',
        type: 'siem',
        x: 350,
        y: 250,
        width: 180,
        height: 80,
        color: '#8B5CF6',
        icon: '🖥️',
        description: 'VM-based syslog forwarder for legacy SIEM systems',
        connections: ['legacy-siem'],
        editable: true,
        deploymentType: 'vm',
        metadata: {
          os: 'CentOS 8',
          cpu: '2 vCPU',
          memory: '4GB',
          protocols: ['Syslog', 'SNMP']
        }
      },
      {
        id: 'splunk',
        label: 'Splunk Enterprise',
        type: 'siem',
        x: 600,
        y: 100,
        width: 160,
        height: 80,
        color: '#FF6B35',
        icon: '🔍',
        description: 'Splunk SIEM for security analytics',
        connections: ['soc-dashboard'],
        editable: true,
        deploymentType: 'physical'
      },
      {
        id: 'qradar',
        label: 'IBM QRadar',
        type: 'siem',
        x: 600,
        y: 200,
        width: 160,
        height: 80,
        color: '#1F70C1',
        icon: '🔍',
        description: 'IBM QRadar SIEM platform',
        connections: ['soc-dashboard'],
        editable: true,
        deploymentType: 'physical'
      },
      {
        id: 'legacy-siem',
        label: 'Legacy SIEM',
        type: 'siem',
        x: 600,
        y: 300,
        width: 160,
        height: 80,
        color: '#6B7280',
        icon: '🔍',
        description: 'Legacy SIEM system with syslog support',
        connections: ['soc-dashboard'],
        editable: true,
        deploymentType: 'physical'
      },
      {
        id: 'soc-dashboard',
        label: 'SOC Dashboard',
        type: 'dashboard',
        x: 850,
        y: 200,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '📊',
        description: 'Security Operations Center dashboard',
        connections: [],
        editable: true,
        deploymentType: 'cloud'
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'portnox-container', from: 'portnox-cloud', to: 'syslog-container', label: 'Syslog/CEF', type: 'syslog', animated: true, editable: true },
      { id: 'portnox-vm', from: 'portnox-cloud', to: 'syslog-vm', label: 'Syslog', type: 'syslog', animated: true, editable: true },
      { id: 'container-splunk', from: 'syslog-container', to: 'splunk', label: 'CEF/JSON', type: 'syslog', animated: true, editable: true },
      { id: 'container-qradar', from: 'syslog-container', to: 'qradar', label: 'LEEF', type: 'syslog', animated: true, editable: true },
      { id: 'vm-legacy', from: 'syslog-vm', to: 'legacy-siem', label: 'Syslog', type: 'syslog', animated: true, editable: true },
      { id: 'splunk-dashboard', from: 'splunk', to: 'soc-dashboard', label: 'Alerts', type: 'https', animated: true, editable: true },
      { id: 'qradar-dashboard', from: 'qradar', to: 'soc-dashboard', label: 'Alerts', type: 'https', animated: true, editable: true },
      { id: 'legacy-dashboard', from: 'legacy-siem', to: 'soc-dashboard', label: 'Alerts', type: 'https', animated: true, editable: true }
    ]

    const deploymentOptions: DeploymentOption[] = [
      {
        id: 'container-forwarder',
        name: 'Container Syslog Forwarder',
        description: 'Deploy syslog forwarder as container for modern SIEM',
        components: ['syslog-container'],
        enabled: true,
        deploymentType: 'container'
      },
      {
        id: 'vm-forwarder',
        name: 'VM Syslog Forwarder',
        description: 'Deploy syslog forwarder as VM for legacy SIEM',
        components: ['syslog-vm'],
        enabled: true,
        deploymentType: 'vm'
      }
    ]

    return {
      nodes,
      connections,
      deploymentOptions,
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getCOADeployment = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'policy-change',
        label: 'Policy Change Event',
        type: 'event',
        x: 50,
        y: 200,
        width: 160,
        height: 80,
        color: '#DC2626',
        icon: '⚠️',
        description: 'Security policy change or threat detection',
        connections: ['portnox-policy'],
        editable: true
      },
      {
        id: 'portnox-policy',
        label: 'Portnox Policy Engine',
        type: 'policy',
        x: 280,
        y: 200,
        width: 160,
        height: 80,
        color: '#00c8d7',
        icon: '⚙️',
        description: 'Policy engine determining required changes',
        connections: ['coa-container', 'coa-vm'],
        editable: true,
        deploymentType: 'cloud'
      },
      {
        id: 'coa-container',
        label: 'COA Service Container',
        type: 'coa',
        x: 510,
        y: 150,
        width: 180,
        height: 80,
        color: '#7C3AED',
        icon: '📦',
        description: 'Containerized Change of Authorization service',
        connections: ['radsec-proxy'],
        editable: true,
        deploymentType: 'container',
        metadata: {
          image: 'portnox/coa-service:latest',
          cpu: '1 vCPU',
          memory: '1GB',
          ports: ['3799/udp']
        }
      },
      {
        id: 'coa-vm',
        label: 'COA Service VM',
        type: 'coa',
        x: 510,
        y: 250,
        width: 180,
        height: 80,
        color: '#8B5CF6',
        icon: '🖥️',
        description: 'VM-based COA service for high availability',
        connections: ['radsec-proxy'],
        editable: true,
        deploymentType: 'vm',
        metadata: {
          os: 'Ubuntu 22.04 LTS',
          cpu: '2 vCPU',
          memory: '2GB'
        }
      },
      {
        id: 'radsec-proxy',
        label: 'RADSec Proxy',
        type: 'proxy',
        x: 750,
        y: 200,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '🔄',
        description: 'RADSec proxy forwarding COA to NAS',
        connections: ['network-device'],
        editable: true,
        deploymentType: 'container'
      },
      {
        id: 'network-device',
        label: 'Network Access Server',
        type: 'network',
        x: 980,
        y: 200,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '🔌',
        description: 'Switch/AP receiving COA for policy enforcement',
        connections: ['end-device'],
        editable: true,
        deploymentType: 'physical'
      },
      {
        id: 'end-device',
        label: 'End Device',
        type: 'endpoint',
        x: 980,
        y: 350,
        width: 160,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'Device affected by policy change',
        connections: [],
        editable: true,
        deploymentType: 'physical'
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'event-policy', from: 'policy-change', to: 'portnox-policy', label: 'Policy Update', type: 'data', animated: true, editable: true },
      { id: 'policy-coa-container', from: 'portnox-policy', to: 'coa-container', label: 'COA Request', type: 'coa', animated: true, editable: true },
      { id: 'policy-coa-vm', from: 'portnox-policy', to: 'coa-vm', label: 'COA Backup', type: 'coa', animated: false, editable: true },
      { id: 'coa-container-proxy', from: 'coa-container', to: 'radsec-proxy', label: 'COA:3799', type: 'coa', animated: true, editable: true },
      { id: 'coa-vm-proxy', from: 'coa-vm', to: 'radsec-proxy', label: 'COA:3799', type: 'coa', animated: true, editable: true },
      { id: 'proxy-nas', from: 'radsec-proxy', to: 'network-device', label: 'COA Forward', type: 'coa', animated: true, editable: true },
      { id: 'nas-device', from: 'network-device', to: 'end-device', label: 'Policy Enforcement', type: 'data', animated: true, editable: true }
    ]

    const deploymentOptions: DeploymentOption[] = [
      {
        id: 'coa-container',
        name: 'COA Container Service',
        description: 'Deploy COA service as container for scalability',
        components: ['coa-container'],
        enabled: true,
        deploymentType: 'container'
      },
      {
        id: 'coa-vm',
        name: 'COA VM Service',
        description: 'Deploy COA service as VM for reliability',
        components: ['coa-vm'],
        enabled: true,
        deploymentType: 'vm'
      }
    ]

    return {
      nodes,
      connections,
      deploymentOptions,
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  // Keep existing diagram functions but update them to return DiagramState
  const getCompleteArchitecture = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'corporate-devices',
        label: 'Corporate Devices',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 140,
        height: 100,
        color: '#4F46E5',
        icon: '💻',
        description: 'Managed corporate devices with certificates',
        connections: ['network-access', 'wireless-access'],
        editable: true
      },
      {
        id: 'network-access',
        label: `${networkVendor} Switches`,
        type: 'network',
        x: 250,
        y: 150,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '🔌',
        vendor: networkVendor,
        description: '802.1X capable network switches',
        connections: ['radsec-proxy-1', 'radsec-proxy-2'],
        editable: true
      },
      {
        id: 'wireless-access',
        label: `${networkVendor} Wireless`,
        type: 'network',
        x: 250,
        y: 250,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '📶',
        vendor: networkVendor,
        description: '802.1X capable wireless access points',
        connections: ['radsec-proxy-1', 'radsec-proxy-2'],
        editable: true
      },
      {
        id: 'radsec-proxy-1',
        label: 'RADSec Proxy AZ-A',
        type: 'proxy',
        x: 450,
        y: 120,
        width: 160,
        height: 90,
        color: '#7C3AED',
        icon: '🔄',
        description: 'Primary RADSec proxy with 7-day cache',
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'radsec-proxy-2',
        label: 'RADSec Proxy AZ-B',
        type: 'proxy',
        x: 450,
        y: 280,
        width: 160,
        height: 90,
        color: '#7C3AED',
        icon: '🔄',
        description: 'Secondary RADSec proxy for high availability',
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud NAC',
        type: 'nac',
        x: 700,
        y: 200,
        width: 160,
        height: 100,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC with Private PKI and policy engine',
        connections: ['azure-ad', 'intune', 'pki-ca'],
        editable: true
      },
      {
        id: 'azure-ad',
        label: 'Azure AD / Entra ID',
        type: 'identity',
        x: 950,
        y: 100,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity provider and user authentication',
        connections: [],
        editable: true
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 950,
        y: 200,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '📱',
        description: 'MDM for certificate deployment and compliance',
        connections: [],
        editable: true
      },
      {
        id: 'pki-ca',
        label: 'Private PKI CA',
        type: 'pki',
        x: 950,
        y: 300,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔐',
        description: 'Certificate Authority for EAP-TLS',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'devices-switch', from: 'corporate-devices', to: 'network-access', label: '802.1X EAP-TLS', type: 'radius', animated: true, editable: true },
      { id: 'devices-wireless', from: 'corporate-devices', to: 'wireless-access', label: '802.1X EAP-TLS', type: 'radius', animated: true, editable: true },
      { id: 'switch-proxy1', from: 'network-access', to: 'radsec-proxy-1', label: 'RADIUS', type: 'radius', animated: true, editable: true },
      { id: 'switch-proxy2', from: 'network-access', to: 'radsec-proxy-2', label: 'RADIUS (Failover)', type: 'radius', animated: false, editable: true },
      { id: 'wireless-proxy1', from: 'wireless-access', to: 'radsec-proxy-1', label: 'RADIUS', type: 'radius', animated: true, editable: true },
      { id: 'wireless-proxy2', from: 'wireless-access', to: 'radsec-proxy-2', label: 'RADIUS (Failover)', type: 'radius', animated: false, editable: true },
      { id: 'proxy1-cloud', from: 'radsec-proxy-1', to: 'portnox-cloud', label: 'RADSec/TLS', type: 'radsec', animated: true, editable: true },
      { id: 'proxy2-cloud', from: 'radsec-proxy-2', to: 'portnox-cloud', label: 'RADSec/TLS', type: 'radsec', animated: true, editable: true },
      { id: 'cloud-azure', from: 'portnox-cloud', to: 'azure-ad', label: 'LDAP/SAML', type: 'ldap', animated: true, editable: true },
      { id: 'cloud-intune', from: 'portnox-cloud', to: 'intune', label: 'REST API', type: 'https', animated: true, editable: true },
      { id: 'cloud-pki', from: 'portnox-cloud', to: 'pki-ca', label: 'Certificate Validation', type: 'https', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getAuthenticationFlow = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'device',
        label: 'Corporate Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 120,
        height: 80,
        color: '#4F46E5',
        icon: '💻',
        description: 'Device with installed certificate',
        connections: ['authenticator'],
        editable: true
      },
      {
        id: 'authenticator',
        label: 'Network Authenticator',
        type: 'network',
        x: 220,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '🔌',
        description: '802.1X authenticator (switch/AP)',
        connections: ['radsec-proxy'],
        editable: true
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
        description: 'RADIUS over TLS proxy',
        connections: ['portnox-radius'],
        editable: true
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
        description: 'Cloud RADIUS service',
        connections: ['identity-store', 'pki-validation'],
        editable: true
      },
      {
        id: 'identity-store',
        label: 'Identity Store',
        type: 'identity',
        x: 790,
        y: 150,
        width: 120,
        height: 60,
        color: '#0078D4',
        icon: '👤',
        description: 'User identity verification',
        connections: [],
        editable: true
      },
      {
        id: 'pki-validation',
        label: 'PKI Validation',
        type: 'pki',
        x: 790,
        y: 250,
        width: 120,
        height: 60,
        color: '#DC2626',
        icon: '🔐',
        description: 'Certificate validation',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'dev-auth', from: 'device', to: 'authenticator', label: 'EAP-TLS Start', type: 'radius', animated: true, editable: true },
      { id: 'auth-proxy', from: 'authenticator', to: 'radsec-proxy', label: 'RADIUS Request', type: 'radius', animated: true, editable: true },
      { id: 'proxy-radius', from: 'radsec-proxy', to: 'portnox-radius', label: 'RADSec/TLS', type: 'radsec', animated: true, editable: true },
      { id: 'radius-identity', from: 'portnox-radius', to: 'identity-store', label: 'User Lookup', type: 'ldap', animated: true, editable: true },
      { id: 'radius-pki', from: 'portnox-radius', to: 'pki-validation', label: 'Cert Validation', type: 'https', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getPKIInfrastructure = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'root-ca',
        label: 'Root Certificate Authority',
        type: 'pki',
        x: 400,
        y: 50,
        width: 180,
        height: 80,
        color: '#DC2626',
        icon: '🔐',
        description: 'Root CA for certificate hierarchy',
        connections: ['issuing-ca'],
        editable: true
      },
      {
        id: 'issuing-ca',
        label: 'Issuing CA',
        type: 'pki',
        x: 400,
        y: 180,
        width: 180,
        height: 80,
        color: '#EA580C',
        icon: '📜',
        description: 'Certificate issuing authority',
        connections: ['scep-server', 'ocsp-responder', 'crl-distribution'],
        editable: true
      },
      {
        id: 'scep-server',
        label: 'SCEP Server',
        type: 'cert-service',
        x: 150,
        y: 320,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '📋',
        description: 'Simple Certificate Enrollment Protocol',
        connections: [],
        editable: true
      },
      {
        id: 'ocsp-responder',
        label: 'OCSP Responder',
        type: 'cert-service',
        x: 400,
        y: 320,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '✅',
        description: 'Online Certificate Status Protocol',
        connections: [],
        editable: true
      },
      {
        id: 'crl-distribution',
        label: 'CRL Distribution Point',
        type: 'cert-service',
        x: 650,
        y: 320,
        width: 140,
        height: 80,
        color: '#0891B2',
        icon: '📋',
        description: 'Certificate Revocation List',
        connections: [],
        editable: true
      },
      {
        id: 'intune-connector',
        label: 'Intune SCEP Connector',
        type: 'connector',
        x: 150,
        y: 450,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🔗',
        description: 'Microsoft Intune SCEP connector',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'root-issuing', from: 'root-ca', to: 'issuing-ca', label: 'Signs Issuing CA', type: 'data', animated: true, editable: true },
      { id: 'issuing-scep', from: 'issuing-ca', to: 'scep-server', label: 'Certificate Requests', type: 'https', animated: true, editable: true },
      { id: 'issuing-ocsp', from: 'issuing-ca', to: 'ocsp-responder', label: 'Status Updates', type: 'https', animated: true, editable: true },
      { id: 'issuing-crl', from: 'issuing-ca', to: 'crl-distribution', label: 'Revocation Lists', type: 'https', animated: true, editable: true },
      { id: 'scep-connector', from: 'scep-server', to: 'intune-connector', label: 'SCEP Protocol', type: 'https', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getPolicyFramework = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'policy-engine',
        label: 'Central Policy Engine',
        type: 'policy',
        x: 400,
        y: 200,
        width: 180,
        height: 100,
        color: '#DC2626',
        icon: '⚙️',
        description: 'Central policy management and evaluation',
        connections: ['user-policies', 'device-policies', 'network-policies', 'compliance-policies'],
        editable: true
      },
      {
        id: 'user-policies',
        label: 'User-Based Policies',
        type: 'policy',
        x: 150,
        y: 100,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '👤',
        description: 'Role and group-based access rules',
        connections: [],
        editable: true
      },
      {
        id: 'device-policies',
        label: 'Device Policies',
        type: 'policy',
        x: 650,
        y: 100,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '💻',
        description: 'Device type and compliance rules',
        connections: [],
        editable: true
      },
      {
        id: 'network-policies',
        label: 'Network Policies',
        type: 'policy',
        x: 150,
        y: 350,
        width: 140,
        height: 80,
        color: '#EA580C',
        icon: '🌐',
        description: 'Network segment and VLAN assignment',
        connections: [],
        editable: true
      },
      {
        id: 'compliance-policies',
        label: 'Compliance Policies',
        type: 'policy',
        x: 650,
        y: 350,
        width: 140,
        height: 80,
        color: '#0891B2',
        icon: '✅',
        description: 'Regulatory and security compliance',
        connections: [],
        editable: true
      },
      {
        id: 'enforcement-points',
        label: 'Enforcement Points',
        type: 'enforcement',
        x: 400,
        y: 450,
        width: 180,
        height: 80,
        color: '#7C2D12',
        icon: '🔒',
        description: 'Network enforcement and remediation',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'engine-user', from: 'policy-engine', to: 'user-policies', label: 'User Context', type: 'data', animated: true, editable: true },
      { id: 'engine-device', from: 'policy-engine', to: 'device-policies', label: 'Device Context', type: 'data', animated: true, editable: true },
      { id: 'engine-network', from: 'policy-engine', to: 'network-policies', label: 'Network Context', type: 'data', animated: true, editable: true },
      { id: 'engine-compliance', from: 'policy-engine', to: 'compliance-policies', label: 'Compliance Check', type: 'data', animated: true, editable: true },
      { id: 'engine-enforcement', from: 'policy-engine', to: 'enforcement-points', label: 'Policy Decision', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getConnectivityOptions = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'branch-office',
        label: 'Branch Office',
        type: 'location',
        x: 50,
        y: 200,
        width: 140,
        height: 100,
        color: '#4F46E5',
        icon: '🏢',
        description: 'Remote branch location',
        connections: ['connectivity-options'],
        editable: true
      },
      {
        id: 'connectivity-options',
        label: 'Connectivity Hub',
        type: 'connectivity',
        x: 250,
        y: 200,
        width: 160,
        height: 100,
        color: '#059669',
        icon: '🌐',
        description: 'Multiple connectivity options',
        connections: ['vpn-tunnel', 'direct-connect', 'sd-wan'],
        editable: true
      },
      {
        id: 'vpn-tunnel',
        label: 'VPN Tunnel',
        type: 'vpn',
        x: 480,
        y: 100,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '🔒',
        description: 'Site-to-site VPN connection',
        connections: ['cloud-services'],
        editable: true
      },
      {
        id: 'direct-connect',
        label: 'Direct Connect',
        type: 'direct',
        x: 480,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '⚡',
        description: 'Dedicated network connection',
        connections: ['cloud-services'],
        editable: true
      },
      {
        id: 'sd-wan',
        label: 'SD-WAN',
        type: 'sdwan',
        x: 480,
        y: 300,
        width: 140,
        height: 80,
        color: '#EA580C',
        icon: '🔗',
        description: 'Software-defined WAN',
        connections: ['cloud-services'],
        editable: true
      },
      {
        id: 'cloud-services',
        label: `${cloudProvider.toUpperCase()} Cloud`,
        type: 'cloud',
        x: 680,
        y: 200,
        width: 160,
        height: 100,
        color: cloudProvider === 'aws' ? '#FF9900' : '#0078D4',
        icon: '☁️',
        description: `${cloudProvider} cloud infrastructure`,
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 900,
        y: 200,
        width: 160,
        height: 100,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'Cloud NAC platform',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'branch-hub', from: 'branch-office', to: 'connectivity-options', label: 'Network Traffic', type: 'data', animated: true, editable: true },
      { id: 'hub-vpn', from: 'connectivity-options', to: 'vpn-tunnel', label: 'VPN Path', type: 'vpn', animated: true, editable: true },
      { id: 'hub-direct', from: 'connectivity-options', to: 'direct-connect', label: 'Direct Path', type: 'direct', animated: true, editable: true },
      { id: 'hub-sdwan', from: 'connectivity-options', to: 'sd-wan', label: 'SD-WAN Path', type: 'data', animated: true, editable: true },
      { id: 'vpn-cloud', from: 'vpn-tunnel', to: 'cloud-services', label: 'Encrypted Tunnel', type: 'vpn', animated: true, editable: true },
      { id: 'direct-cloud', from: 'direct-connect', to: 'cloud-services', label: 'Dedicated Line', type: 'direct', animated: true, editable: true },
      { id: 'sdwan-cloud', from: 'sd-wan', to: 'cloud-services', label: 'Optimized Path', type: 'data', animated: true, editable: true },
      { id: 'cloud-portnox', from: 'cloud-services', to: 'portnox-cloud', label: 'API/RADIUS', type: 'https', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getIntuneIntegration = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'devices',
        label: 'Managed Devices',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 140,
        height: 100,
        color: '#4F46E5',
        icon: '📱',
        description: 'Corporate devices enrolled in Intune',
        connections: ['intune'],
        editable: true
      },
      {
        id: 'intune',
        label: 'Microsoft Intune',
        type: 'mdm',
        x: 250,
        y: 200,
        width: 160,
        height: 100,
        color: '#0078D4',
        icon: '🔧',
        description: 'Mobile Device Management platform',
        connections: ['azure-ad', 'portnox-cloud', 'scep-connector'],
        editable: true
      },
      {
        id: 'azure-ad',
        label: 'Azure AD',
        type: 'identity',
        x: 480,
        y: 100,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'Identity and device registration',
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'scep-connector',
        label: 'SCEP Connector',
        type: 'connector',
        x: 480,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '🔗',
        description: 'Certificate enrollment connector',
        connections: ['portnox-pki'],
        editable: true
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud',
        type: 'nac',
        x: 480,
        y: 300,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with Intune integration',
        connections: ['compliance-engine'],
        editable: true
      },
      {
        id: 'portnox-pki',
        label: 'Portnox PKI',
        type: 'pki',
        x: 700,
        y: 200,
        width: 140,
        height: 80,
        color: '#DC2626',
        icon: '🔐',
        description: 'Private Certificate Authority',
        connections: [],
        editable: true
      },
      {
        id: 'compliance-engine',
        label: 'Compliance Engine',
        type: 'compliance',
        x: 700,
        y: 300,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '✅',
        description: 'Device compliance validation',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'devices-intune', from: 'devices', to: 'intune', label: 'MDM Enrollment', type: 'https', animated: true, editable: true },
      { id: 'intune-azure', from: 'intune', to: 'azure-ad', label: 'Identity Sync', type: 'https', animated: true, editable: true },
      { id: 'intune-scep', from: 'intune', to: 'scep-connector', label: 'Cert Requests', type: 'https', animated: true, editable: true },
      { id: 'intune-portnox', from: 'intune', to: 'portnox-cloud', label: 'Compliance Data', type: 'https', animated: true, editable: true },
      { id: 'azure-portnox', from: 'azure-ad', to: 'portnox-cloud', label: 'Authentication', type: 'ldap', animated: true, editable: true },
      { id: 'scep-pki', from: 'scep-connector', to: 'portnox-pki', label: 'SCEP Protocol', type: 'https', animated: true, editable: true },
      { id: 'portnox-compliance', from: 'portnox-cloud', to: 'compliance-engine', label: 'Policy Check', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getDeviceOnboarding = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'new-device',
        label: 'New Device',
        type: 'endpoint',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#6B7280',
        icon: '📱',
        description: 'Unmanaged device requiring onboarding',
        connections: ['captive-portal'],
        editable: true
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
        description: 'Device registration and onboarding portal',
        connections: ['portnox-cloud'],
        editable: true
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
        description: 'NAC orchestration and policy engine',
        connections: ['certificate-authority', 'mdm-enrollment', 'identity-verification'],
        editable: true
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
        description: 'Certificate provisioning for device authentication',
        connections: [],
        editable: true
      },
      {
        id: 'mdm-enrollment',
        label: 'MDM Enrollment',
        type: 'mdm',
        x: 650,
        y: 200,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '📋',
        description: 'Device management enrollment process',
        connections: [],
        editable: true
      },
      {
        id: 'identity-verification',
        label: 'Identity Verification',
        type: 'identity',
        x: 650,
        y: 300,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '👤',
        description: 'User identity verification and approval',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'device-portal', from: 'new-device', to: 'captive-portal', label: 'Registration Request', type: 'https', animated: true, editable: true },
      { id: 'portal-portnox', from: 'captive-portal', to: 'portnox-cloud', label: 'Device Information', type: 'https', animated: true, editable: true },
      { id: 'portnox-ca', from: 'portnox-cloud', to: 'certificate-authority', label: 'Certificate Request', type: 'https', animated: true, editable: true },
      { id: 'portnox-mdm', from: 'portnox-cloud', to: 'mdm-enrollment', label: 'Enrollment Trigger', type: 'https', animated: true, editable: true },
      { id: 'portnox-identity', from: 'portnox-cloud', to: 'identity-verification', label: 'Identity Check', type: 'ldap', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getFortiGateTACACS = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        label: 'Network Administrator',
        type: 'user',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator requiring device access',
        connections: ['fortigate'],
        editable: true
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
        description: 'FortiGate next-generation firewall',
        connections: ['portnox-tacacs'],
        editable: true
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
        description: 'TACACS+ authentication and authorization',
        connections: ['active-directory', 'command-authorization'],
        editable: true
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 650,
        y: 150,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication and group membership',
        connections: [],
        editable: true
      },
      {
        id: 'command-authorization',
        label: 'Command Authorization',
        type: 'authorization',
        x: 650,
        y: 250,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '⚙️',
        description: 'Granular command-level authorization',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'admin-fortigate', from: 'admin', to: 'fortigate', label: 'SSH/HTTPS Login', type: 'https', animated: true, editable: true },
      { id: 'fortigate-tacacs', from: 'fortigate', to: 'portnox-tacacs', label: 'TACACS+ Request', type: 'tacacs', animated: true, editable: true },
      { id: 'tacacs-ad', from: 'portnox-tacacs', to: 'active-directory', label: 'User Authentication', type: 'ldap', animated: true, editable: true },
      { id: 'tacacs-auth', from: 'portnox-tacacs', to: 'command-authorization', label: 'Command Authorization', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getPaloAltoTACACS = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'admin',
        label: 'Network Administrator',
        type: 'user',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '👨‍💼',
        description: 'Network administrator',
        connections: ['palo-alto'],
        editable: true
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
        description: 'Palo Alto next-generation firewall',
        connections: ['panorama', 'portnox-tacacs'],
        editable: true
      },
      {
        id: 'panorama',
        label: 'Panorama Management',
        type: 'management',
        x: 250,
        y: 50,
        width: 140,
        height: 80,
        color: '#FF6B35',
        icon: '🎛️',
        vendor: 'paloalto',
        description: 'Centralized management platform',
        connections: ['portnox-tacacs'],
        editable: true
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
        connections: ['active-directory', 'role-mapping'],
        editable: true
      },
      {
        id: 'active-directory',
        label: 'Active Directory',
        type: 'identity',
        x: 650,
        y: 150,
        width: 140,
        height: 80,
        color: '#0078D4',
        icon: '🏢',
        description: 'User authentication store',
        connections: [],
        editable: true
      },
      {
        id: 'role-mapping',
        label: 'Role Mapping',
        type: 'authorization',
        x: 650,
        y: 250,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '🔑',
        description: 'Admin role assignment and privileges',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'admin-palo', from: 'admin', to: 'palo-alto', label: 'Management Access', type: 'https', animated: true, editable: true },
      { id: 'palo-panorama', from: 'palo-alto', to: 'panorama', label: 'Management Sync', type: 'https', animated: true, editable: true },
      { id: 'palo-tacacs', from: 'palo-alto', to: 'portnox-tacacs', label: 'TACACS+ Auth', type: 'tacacs', animated: true, editable: true },
      { id: 'panorama-tacacs', from: 'panorama', to: 'portnox-tacacs', label: 'TACACS+ Auth', type: 'tacacs', animated: true, editable: true },
      { id: 'tacacs-ad', from: 'portnox-tacacs', to: 'active-directory', label: 'User Lookup', type: 'ldap', animated: true, editable: true },
      { id: 'tacacs-role', from: 'portnox-tacacs', to: 'role-mapping', label: 'Role Assignment', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getPaloAltoUserID = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'users',
        label: 'Network Users',
        type: 'user',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated network users',
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud NAC',
        type: 'nac',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with User-ID integration',
        connections: ['syslog-server'],
        editable: true
      },
      {
        id: 'syslog-server',
        label: 'Syslog Server',
        type: 'syslog',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '📋',
        description: 'Centralized logging for User-ID mapping',
        connections: ['palo-alto'],
        editable: true
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
        description: 'User-ID enabled firewall with dynamic policies',
        connections: ['user-id-agent'],
        editable: true
      },
      {
        id: 'user-id-agent',
        label: 'User-ID Agent',
        type: 'agent',
        x: 650,
        y: 350,
        width: 140,
        height: 80,
        color: '#EA580C',
        icon: '🤖',
        description: 'User-ID mapping and policy enforcement',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'users-portnox', from: 'users', to: 'portnox-cloud', label: '802.1X Authentication', type: 'radius', animated: true, editable: true },
      { id: 'portnox-syslog', from: 'portnox-cloud', to: 'syslog-server', label: 'User Session Logs', type: 'syslog', animated: true, editable: true },
      { id: 'syslog-palo', from: 'syslog-server', to: 'palo-alto', label: 'User-ID Mapping', type: 'syslog', animated: true, editable: true },
      { id: 'palo-agent', from: 'palo-alto', to: 'user-id-agent', label: 'Policy Updates', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getFortiGateFSSO = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'users',
        label: 'Network Users',
        type: 'user',
        x: 50,
        y: 200,
        width: 140,
        height: 80,
        color: '#4F46E5',
        icon: '👥',
        description: 'Authenticated network users',
        connections: ['portnox-cloud'],
        editable: true
      },
      {
        id: 'portnox-cloud',
        label: 'Portnox Cloud NAC',
        type: 'nac',
        x: 250,
        y: 200,
        width: 140,
        height: 80,
        color: '#00c8d7',
        icon: '🛡️',
        description: 'NAC with FSSO integration',
        connections: ['fsso-collector'],
        editable: true
      },
      {
        id: 'fsso-collector',
        label: 'FSSO Collector Agent',
        type: 'collector',
        x: 450,
        y: 200,
        width: 140,
        height: 80,
        color: '#7C3AED',
        icon: '📡',
        description: 'Fortinet Single Sign-On collector',
        connections: ['fortigate'],
        editable: true
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
        description: 'FSSO enabled firewall with user-based policies',
        connections: ['policy-engine'],
        editable: true
      },
      {
        id: 'policy-engine',
        label: 'Policy Engine',
        type: 'policy',
        x: 650,
        y: 350,
        width: 140,
        height: 80,
        color: '#059669',
        icon: '⚙️',
        description: 'Dynamic user-based policy enforcement',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'users-portnox', from: 'users', to: 'portnox-cloud', label: '802.1X Authentication', type: 'radius', animated: true, editable: true },
      { id: 'portnox-fsso', from: 'portnox-cloud', to: 'fsso-collector', label: 'User Session Data', type: 'syslog', animated: true, editable: true },
      { id: 'fsso-fortigate', from: 'fsso-collector', to: 'fortigate', label: 'FSSO Integration', type: 'data', animated: true, editable: true },
      { id: 'fortigate-policy', from: 'fortigate', to: 'policy-engine', label: 'Policy Enforcement', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getZeroTrustArchitecture = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'identity-verification',
        label: 'Identity Verification',
        type: 'identity',
        x: 100,
        y: 100,
        width: 160,
        height: 80,
        color: '#0078D4',
        icon: '🔐',
        description: 'Multi-factor authentication and identity verification',
        connections: ['device-trust'],
        editable: true
      },
      {
        id: 'device-trust',
        label: 'Device Trust Engine',
        type: 'security',
        x: 350,
        y: 100,
        width: 160,
        height: 80,
        color: '#DC2626',
        icon: '🛡️',
        description: 'Continuous device posture assessment',
        connections: ['policy-engine'],
        editable: true
      },
      {
        id: 'policy-engine',
        label: 'Zero Trust Policy Engine',
        type: 'policy',
        x: 600,
        y: 100,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '⚙️',
        description: 'Dynamic policy evaluation and enforcement',
        connections: ['network-enforcement'],
        editable: true
      },
      {
        id: 'network-enforcement',
        label: 'Network Enforcement',
        type: 'enforcement',
        x: 850,
        y: 100,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '🔒',
        description: 'Real-time network access control',
        connections: [],
        editable: true
      },
      {
        id: 'continuous-monitoring',
        label: 'Continuous Monitoring',
        type: 'monitoring',
        x: 350,
        y: 250,
        width: 160,
        height: 80,
        color: '#EA580C',
        icon: '👁️',
        description: 'Real-time security monitoring and analytics',
        connections: ['threat-response'],
        editable: true
      },
      {
        id: 'threat-response',
        label: 'Automated Response',
        type: 'response',
        x: 600,
        y: 250,
        width: 160,
        height: 80,
        color: '#B91C1C',
        icon: '⚡',
        description: 'Automated threat response and remediation',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'identity-device', from: 'identity-verification', to: 'device-trust', label: 'Verified Identity', type: 'data', animated: true, editable: true },
      { id: 'device-policy', from: 'device-trust', to: 'policy-engine', label: 'Trust Score', type: 'data', animated: true, editable: true },
      { id: 'policy-enforcement', from: 'policy-engine', to: 'network-enforcement', label: 'Access Decision', type: 'data', animated: true, editable: true },
      { id: 'monitoring-response', from: 'continuous-monitoring', to: 'threat-response', label: 'Threat Detection', type: 'data', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  const getCloudNativeDeployment = (): DiagramState => {
    const nodes: DiagramNode[] = [
      {
        id: 'kubernetes-cluster',
        label: 'Kubernetes Cluster',
        type: 'container',
        x: 400,
        y: 100,
        width: 200,
        height: 100,
        color: '#326CE5',
        icon: '☸️',
        description: 'Container orchestration platform',
        connections: ['radsec-pods', 'monitoring-stack'],
        editable: true
      },
      {
        id: 'radsec-pods',
        label: 'RADSec Proxy Pods',
        type: 'pod',
        x: 200,
        y: 250,
        width: 160,
        height: 80,
        color: '#7C3AED',
        icon: '📦',
        description: 'Containerized RADSec proxy instances',
        connections: ['service-mesh'],
        editable: true
      },
      {
        id: 'service-mesh',
        label: 'Service Mesh',
        type: 'mesh',
        x: 400,
        y: 250,
        width: 160,
        height: 80,
        color: '#059669',
        icon: '🕸️',
        description: 'Service-to-service communication',
        connections: ['portnox-api'],
        editable: true
      },
      {
        id: 'monitoring-stack',
        label: 'Monitoring Stack',
        type: 'monitoring',
        x: 600,
        y: 250,
        width: 160,
        height: 80,
        color: '#FF9900',
        icon: '📊',
        description: 'Prometheus, Grafana, and alerting',
        connections: [],
        editable: true
      },
      {
        id: 'portnox-api',
        label: 'Portnox API Gateway',
        type: 'api',
        x: 400,
        y: 400,
        width: 160,
        height: 80,
        color: '#00c8d7',
        icon: '🚪',
        description: 'API gateway for cloud services',
        connections: [],
        editable: true
      }
    ]

    const connections: DiagramConnection[] = [
      { id: 'k8s-pods', from: 'kubernetes-cluster', to: 'radsec-pods', label: 'Pod Management', type: 'data', animated: true, editable: true },
      { id: 'k8s-monitoring', from: 'kubernetes-cluster', to: 'monitoring-stack', label: 'Metrics Collection', type: 'data', animated: true, editable: true },
      { id: 'pods-mesh', from: 'radsec-pods', to: 'service-mesh', label: 'Service Discovery', type: 'data', animated: true, editable: true },
      { id: 'mesh-api', from: 'service-mesh', to: 'portnox-api', label: 'API Calls', type: 'https', animated: true, editable: true }
    ]

    return {
      nodes,
      connections,
      deploymentOptions: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '2.0',
        author: 'Portnox NAC Designer'
      }
    }
  }

  // Initialize diagram state
  useEffect(() => {
    const data = getDiagramData()
    setDiagramState(data)
    setDeploymentOptions(data.deploymentOptions)
  }, [view, cloudProvider, networkVendor, connectivityType])

  // Save state when it changes
  useEffect(() => {
    if (diagramState) {
      saveState(diagramState)
    }
  }, [diagramState, saveState])

  const { nodes = [], connections = [] } = diagramState || {}

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
    setSelectedConnection(null)
    setEditMode(false)
    setIsDrawingConnection(false)
    setStartPoint(null)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
    setIsDrawingConnection(false)
    setStartPoint(null)
    setSelectedNode(null)
    setSelectedConnection(null)
  }

  const handleNodeClick = (nodeId: string) => {
    if (editMode) {
      if (isDrawingConnection) {
        if (startPoint && startPoint.nodeId !== nodeId) {
          // Create new connection
          const newConnection: DiagramConnection = {
            id: `conn-${Date.now()}`,
            from: startPoint.nodeId,
            to: nodeId,
            label: 'New Connection',
            type: 'data',
            animated: true,
            editable: true
          }
          
          if (diagramState) {
            const updatedState = {
              ...diagramState,
              connections: [...diagramState.connections, newConnection],
              metadata: {
                ...diagramState.metadata,
                lastModified: new Date().toISOString()
              }
            }
            setDiagramState(updatedState)
          }
          
          setIsDrawingConnection(false)
          setStartPoint(null)
        }
      } else {
        // Start drawing connection
        const node = nodes.find(n => n.id === nodeId)
        if (node) {
          setStartPoint({
            x: node.x + node.width / 2,
            y: node.y + node.height / 2,
            nodeId: nodeId
          })
          setIsDrawingConnection(true)
        }
      }
    } else {
      setSelectedNode(selectedNode === nodeId ? null : nodeId)
    }
  }

  const handleConnectionClick = (connectionId: string) => {
    if (editMode) {
      setSelectedConnection(selectedConnection === connectionId ? null : connectionId)
    }
  }

  const editNode = (node: DiagramNode) => {
    setEditingNode(node)
    setShowNodeEditor(true)
  }

  const editConnection = (connection: DiagramConnection) => {
    setEditingConnection(connection)
    setShowConnectionEditor(true)
  }

  const deleteNode = (nodeId: string) => {
    if (diagramState) {
      const updatedState = {
        ...diagramState,
        nodes: diagramState.nodes.filter(n => n.id !== nodeId),
        connections: diagramState.connections.filter(c => c.from !== nodeId && c.to !== nodeId),
        metadata: {
          ...diagramState.metadata,
          lastModified: new Date().toISOString()
        }
      }
      setDiagramState(updatedState)
    }
  }

  const deleteConnection = (connectionId: string) => {
    if (diagramState) {
      const updatedState = {
        ...diagramState,
        connections: diagramState.connections.filter(c => c.id !== connectionId),
        metadata: {
          ...diagramState.metadata,
          lastModified: new Date().toISOString()
        }
      }
      setDiagramState(updatedState)
    }
  }

  const saveNodeChanges = (updatedNode: DiagramNode) => {
    if (diagramState) {
      const updatedState = {
        ...diagramState,
        nodes: diagramState.nodes.map(n => n.id === updatedNode.id ? updatedNode : n),
        metadata: {
          ...diagramState.metadata,
          lastModified: new Date().toISOString()
        }
      }
      setDiagramState(updatedState)
    }
    setShowNodeEditor(false)
    setEditingNode(null)
  }

  const saveConnectionChanges = (updatedConnection: DiagramConnection) => {
    if (diagramState) {
      const updatedState = {
        ...diagramState,
        connections: diagramState.connections.map(c => c.id === updatedConnection.id ? updatedConnection : c),
        metadata: {
          ...diagramState.metadata,
          lastModified: new Date().toISOString()
        }
      }
      setDiagramState(updatedState)
    }
    setShowConnectionEditor(false)
    setEditingConnection(null)
  }

  const exportDiagram = (format: 'png' | 'svg' | 'pdf' | 'json') => {
    if (format === 'json' && diagramState) {
      const dataStr = JSON.stringify(diagramState, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diagram-${view}-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // For other formats, implement actual export logic
      console.log(`Exporting diagram as ${format}`)
    }
  }

  const importDiagram = (file: File) => {
    if (file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target?.result as string)
          setDiagramState(importedState)
          setDeploymentOptions(importedState.deploymentOptions || [])
        } catch (error) {
          console.error('Failed to import diagram:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const toggleDeploymentOption = (optionId: string) => {
    const updatedOptions = deploymentOptions.map(option =>
      option.id === optionId ? { ...option, enabled: !option.enabled } : option
    )
    setDeploymentOptions(updatedOptions)
    
    if (diagramState) {
      const updatedState = {
        ...diagramState,
        deploymentOptions: updatedOptions,
        metadata: {
          ...diagramState.metadata,
          lastModified: new Date().toISOString()
        }
      }
      setDiagramState(updatedState)
    }
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
      case 'radsec': return '#7C3AED'
      case 'https': return '#059669'
      case 'ldap': return '#0078D4'
      case 'syslog': return '#EA580C'
      case 'tacacs': return '#DC2626'
      case 'vpn': return '#7C3AED'
      case 'direct': return '#DC2626'
      case 'coa': return '#DC2626'
      case 'saml': return '#0078D4'
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
      paloalto: '🟠',
      meraki: '🟢'
    }
    return logos[vendor] || '⚪'
  }

  const getDeploymentIcon = (deploymentType?: string) => {
    switch (deploymentType) {
      case 'container': return '📦'
      case 'vm': return '🖥️'
      case 'cloud': return '☁️'
      case 'physical': return '🏢'
      default: return '⚪'
    }
  }

  return (
    <div className="architecture-diagram relative">
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <div className="flex space-x-2">
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
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeploymentOptions(!showDeploymentOptions)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                <Download className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Diagram</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => exportDiagram('png')}>PNG</Button>
                <Button onClick={() => exportDiagram('svg')}>SVG</Button>
                <Button onClick={() => exportDiagram('pdf')}>PDF</Button>
                <Button onClick={() => exportDiagram('json')}>JSON</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                <Upload className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Diagram</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) importDiagram(file)
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="default" className="bg-blue-600 text-white">
            Edit Mode: {isDrawingConnection ? 'Drawing Connection' : 'Click nodes to connect'}
          </Badge>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* Deployment Options Panel */}
      {showDeploymentOptions && deploymentOptions.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-sm z-10">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Deployment Options</span>
          </h4>
          <div className="space-y-3">
            {deploymentOptions.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={option.id}
                    checked={option.enabled}
                    onCheckedChange={() => toggleDeploymentOption(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm font-medium flex items-center space-x-1">
                    <span>{getDeploymentIcon(option.deploymentType)}</span>
                    <span>{option.name}</span>
                  </label>
                </div>
                <p className="text-xs text-gray-600 ml-6">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SVG Diagram */}
      <div className="w-full h-[700px] overflow-hidden border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 1400 600"
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
                .connection-selected {
                  stroke-width: 4;
                  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }
                .edit-mode .diagram-node {
                  cursor: crosshair;
                }
                .edit-mode .diagram-connection {
                  cursor: pointer;
                }
              `}
            </style>
            
            {/* Arrow markers for connections */}
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
                fill="currentColor"
              />
            </marker>
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
                  strokeWidth={selectedConnection === connection.id ? "4" : "2"}
                  fill="none"
                  className={`${connection.animated ? 'animated-path' : ''} ${editMode ? 'diagram-connection' : ''} ${selectedConnection === connection.id ? 'connection-selected' : ''}`}
                  markerEnd="url(#arrowhead)"
                  onClick={() => handleConnectionClick(connection.id)}
                  style={{ cursor: editMode ? 'pointer' : 'default' }}
                />
                <text
                  x={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2}
                  y={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2 - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#374151"
                  className="font-medium pointer-events-none"
                >
                  {connection.label}
                </text>
                
                {/* Edit controls for connections */}
                {editMode && selectedConnection === connection.id && (
                  <g>
                    <circle
                      cx={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2 + 20}
                      cy={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2}
                      r="8"
                      fill="white"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => editConnection(connection)}
                    />
                    <text
                      x={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2 + 20}
                      y={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2 + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#3B82F6"
                      className="pointer-events-none"
                    >
                      ✏️
                    </text>
                    
                    <circle
                      cx={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2 - 20}
                      cy={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2}
                      r="8"
                      fill="white"
                      stroke="#EF4444"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => deleteConnection(connection.id)}
                    />
                    <text
                      x={(fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2 - 20}
                      y={(fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2 + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#EF4444"
                      className="pointer-events-none"
                    >
                      🗑️
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g
                    className={`cursor-pointer ${hoveredNode === node.id ? 'node-hover' : ''} ${selectedNode === node.id ? 'node-selected' : ''} ${editMode ? 'edit-mode' : ''} diagram-node`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx="8"
                      fill={node.color}
                      stroke={selectedNode === node.id ? "#00c8d7" : "#ffffff"}
                      strokeWidth={selectedNode === node.id ? "3" : "2"}
                      opacity="0.9"
                    />
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 25}
                      textAnchor="middle"
                      fontSize="20"
                      className="pointer-events-none"
                    >
                      {node.icon}
                    </text>
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 50}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      className="font-semibold pointer-events-none"
                    >
                      {node.label.split('\n')[0]}
                    </text>
                    {node.label.includes('\n') && (
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + 65}
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        className="font-medium pointer-events-none"
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
                        className="pointer-events-none"
                      >
                        {getVendorLogo(node.vendor)}
                      </text>
                    )}
                    {node.deploymentType && (
                      <text
                        x={node.x + 15}
                        y={node.y + 15}
                        textAnchor="middle"
                        fontSize="12"
                        className="pointer-events-none"
                      >
                        {getDeploymentIcon(node.deploymentType)}
                      </text>
                    )}
                    
                    {/* Edit controls for nodes */}
                    {editMode && selectedNode === node.id && (
                      <g>
                        <circle
                          cx={node.x + node.width - 15}
                          cy={node.y + node.height - 15}
                          r="10"
                          fill="white"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            editNode(node)
                          }}
                        />
                        <text
                          x={node.x + node.width - 15}
                          y={node.y + node.height - 12}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#3B82F6"
                          className="pointer-events-none"
                        >
                          ✏️
                        </text>
                        
                        <circle
                          cx={node.x + 15}
                          cy={node.y + node.height - 15}
                          r="10"
                          fill="white"
                          stroke="#EF4444"
                          strokeWidth="2"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNode(node.id)
                          }}
                        />
                        <text
                          x={node.x + 15}
                          y={node.y + node.height - 12}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#EF4444"
                          className="pointer-events-none"
                        >
                          🗑️
                        </text>
                      </g>
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
                    {node.deploymentType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Deployment: {node.deploymentType.charAt(0).toUpperCase() + node.deploymentType.slice(1)}
                      </p>
                    )}
                    {node.metadata && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.entries(node.metadata).map(([key, value]) => (
                          <div key={key}>{key}: {String(value)}</div>
                        ))}
                      </div>
                    )}
                    {editMode && (
                      <p className="text-xs text-blue-600 mt-1">
                        Click to {isDrawingConnection ? 'connect' : 'start connection'}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Drawing connection preview */}
          {isDrawingConnection && startPoint && (
            <line
              x1={startPoint.x}
              y1={startPoint.y}
              x2={startPoint.x + 50}
              y2={startPoint.y}
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          )}
        </svg>
      </div>

      {/* Node Details Panel */}
      {selectedNode && !editMode && (
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
                    {node.deploymentType && (
                      <Badge variant="secondary">
                        {getDeploymentIcon(node.deploymentType)} {node.deploymentType.charAt(0).toUpperCase() + node.deploymentType.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{node.description}</p>
                  {node.metadata && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Technical Details:</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.entries(node.metadata).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

      {/* Node Editor Dialog */}
      <Dialog open={showNodeEditor} onOpenChange={setShowNodeEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          {editingNode && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="deployment">Deployment</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={editingNode.label}
                      onChange={(e) => setEditingNode({...editingNode, label: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-type">Type</Label>
                    <Select
                      value={editingNode.type}
                      onValueChange={(value) => setEditingNode({...editingNode, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="endpoint">Endpoint</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="proxy">Proxy</SelectItem>
                        <SelectItem value="nac">NAC</SelectItem>
                        <SelectItem value="identity">Identity</SelectItem>
                        <SelectItem value="pki">PKI</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                        <SelectItem value="firewall">Firewall</SelectItem>
                        <SelectItem value="tacacs">TACACS+</SelectItem>
                        <SelectItem value="coa">COA Service</SelectItem>
                        <SelectItem value="siem">SIEM</SelectItem>
                        <SelectItem value="vlan">VLAN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="node-description">Description</Label>
                  <Textarea
                    id="node-description"
                    value={editingNode.description}
                    onChange={(e) => setEditingNode({...editingNode, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="node-color">Color</Label>
                    <Input
                      id="node-color"
                      type="color"
                      value={editingNode.color}
                      onChange={(e) => setEditingNode({...editingNode, color: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-icon">Icon</Label>
                    <Input
                      id="node-icon"
                      value={editingNode.icon}
                      onChange={(e) => setEditingNode({...editingNode, icon: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deployment" className="space-y-4">
                <div>
                  <Label htmlFor="deployment-type">Deployment Type</Label>
                  <Select
                    value={editingNode.deploymentType || ''}
                    onValueChange={(value: 'container' | 'vm' | 'cloud' | 'physical') => 
                      setEditingNode({...editingNode, deploymentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deployment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="container">Container</SelectItem>
                      <SelectItem value="vm">Virtual Machine</SelectItem>
                      <SelectItem value="cloud">Cloud Service</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingNode.vendor && (
                  <div>
                    <Label htmlFor="node-vendor">Vendor</Label>
                    <Input
                      id="node-vendor"
                      value={editingNode.vendor}
                      onChange={(e) => setEditingNode({...editingNode, vendor: e.target.value})}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="metadata" className="space-y-4">
                <div>
                  <Label>Technical Metadata</Label>
                  <div className="space-y-2 mt-2">
                    {editingNode.metadata && Object.entries(editingNode.metadata).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newMetadata = { ...editingNode.metadata }
                            delete newMetadata[key]
                            newMetadata[e.target.value] = value
                            setEditingNode({...editingNode, metadata: newMetadata})
                          }}
                          placeholder="Key"
                        />
                        <Input
                          value={String(value)}
                          onChange={(e) => {
                            const newMetadata = { ...editingNode.metadata }
                            newMetadata[key] = e.target.value
                            setEditingNode({...editingNode, metadata: newMetadata})
                          }}
                          placeholder="Value"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMetadata = { ...editingNode.metadata, 'new-key': 'new-value' }
                        setEditingNode({...editingNode, metadata: newMetadata})
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Metadata
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowNodeEditor(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingNode && saveNodeChanges(editingNode)}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Editor Dialog */}
      <Dialog open={showConnectionEditor} onOpenChange={setShowConnectionEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
          </DialogHeader>
          {editingConnection && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="conn-label">Label</Label>
                <Input
                  id="conn-label"
                  value={editingConnection.label}
                  onChange={(e) => setEditingConnection({...editingConnection, label: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="conn-type">Connection Type</Label>
                <Select
                  value={editingConnection.type}
                  onValueChange={(value: any) => setEditingConnection({...editingConnection, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radius">RADIUS</SelectItem>
                    <SelectItem value="radsec">RADSec</SelectItem>
                    <SelectItem value="https">HTTPS</SelectItem>
                    <SelectItem value="ldap">LDAP</SelectItem>
                    <SelectItem value="syslog">Syslog</SelectItem>
                    <SelectItem value="tacacs">TACACS+</SelectItem>
                    <SelectItem value="vpn">VPN</SelectItem>
                    <SelectItem value="direct">Direct Connect</SelectItem>
                    <SelectItem value="coa">Change of Authorization</SelectItem>
                    <SelectItem value="saml">SAML</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="conn-animated"
                  checked={editingConnection.animated}
                  onCheckedChange={(checked) => setEditingConnection({...editingConnection, animated: checked})}
                />
                <Label htmlFor="conn-animated">Animated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="conn-bidirectional"
                  checked={editingConnection.bidirectional || false}
                  onCheckedChange={(checked) => setEditingConnection({...editingConnection, bidirectional: checked})}
                />
                <Label htmlFor="conn-bidirectional">Bidirectional</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowConnectionEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => saveConnectionChanges(editingConnection)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* State Information */}
      {diagramState && (
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-xs text-gray-600">
                <div>Last Modified: {new Date(diagramState.metadata.lastModified).toLocaleString()}</div>
                <div>Version: {diagramState.metadata.version}</div>
                <div>Nodes: {nodes.length} | Connections: {connections.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
