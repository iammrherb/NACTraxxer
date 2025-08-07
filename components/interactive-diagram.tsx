'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Cloud, Server, Wifi, Shield, Database, Globe, Lock, Zap, Activity, Target, CheckCircle, Clock, AlertTriangle, XCircle, BadgeIcon as Certificate, Key, Fingerprint, ComputerIcon as Desktop, Laptop, Smartphone, Tablet, Cpu, Network, Router, HardDrive } from 'lucide-react'

interface InteractiveDiagramProps {
  view: string
  vendor: string
  connectivity: string
  identity: string
  deployment: string
}

export default function InteractiveDiagram({
  view,
  vendor,
  connectivity,
  identity,
  deployment
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showDataFlow, setShowDataFlow] = useState(false)

  useEffect(() => {
    if (svgRef.current) {
      drawDiagram()
    }
  }, [view, vendor, connectivity, identity, deployment, animationSpeed])

  const drawDiagram = () => {
    const svg = svgRef.current
    if (!svg) return

    // Clear existing content
    svg.innerHTML = ''

    // Add definitions for gradients, patterns, and markers
    addDefinitions(svg)

    switch (view) {
      case 'zero-trust-nac':
        drawZeroTrustDiagram(svg)
        break
      case '802.1x-auth':
        drawAuthFlowDiagram(svg)
        break
      case 'pki-infrastructure':
        drawPKIDiagram(svg)
        break
      case 'policy-framework':
        drawPolicyFrameworkDiagram(svg)
        break
      case 'multi-cloud':
        drawMultiCloudDiagram(svg)
        break
      case 'intune-integration':
        drawIntuneIntegrationDiagram(svg)
        break
      case 'device-onboarding':
        drawDeviceOnboardingDiagram(svg)
        break
      default:
        drawDefaultDiagram(svg)
        break
    }

    if (showDataFlow) {
      animateDataFlow(svg)
    }
  }

  const addDefinitions = (svg: SVGSVGElement) => {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    
    // Gradients
    const cloudGradient = createGradient('cloudGradient', '#e3f2fd', '#bbdefb')
    const awsGradient = createGradient('awsGradient', '#fff3e0', '#ffcc02')
    const siteGradient = createGradient('siteGradient', '#e8f5e9', '#c8e6c9')
    const secureGradient = createGradient('secureGradient', '#f3e5f5', '#e1bee7')
    
    // Arrow markers
    const arrowMarker = createArrowMarker('arrowhead', '#666')
    const secureArrowMarker = createArrowMarker('secureArrow', '#4caf50')
    const dataFlowMarker = createArrowMarker('dataFlow', '#2196f3')
    
    // Patterns
    const diagonalPattern = createDiagonalPattern('diagonalStripes')
    
    defs.appendChild(cloudGradient)
    defs.appendChild(awsGradient)
    defs.appendChild(siteGradient)
    defs.appendChild(secureGradient)
    defs.appendChild(arrowMarker)
    defs.appendChild(secureArrowMarker)
    defs.appendChild(dataFlowMarker)
    defs.appendChild(diagonalPattern)
    
    svg.appendChild(defs)
  }

  const createGradient = (id: string, color1: string, color2: string) => {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', id)
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '100%')
    gradient.setAttribute('y2', '100%')
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', color1)
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', color2)
    
    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    
    return gradient
  }

  const createArrowMarker = (id: string, color: string) => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    marker.setAttribute('id', id)
    marker.setAttribute('markerWidth', '10')
    marker.setAttribute('markerHeight', '7')
    marker.setAttribute('refX', '9')
    marker.setAttribute('refY', '3.5')
    marker.setAttribute('orient', 'auto')
    marker.setAttribute('markerUnits', 'strokeWidth')

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7')
    polygon.setAttribute('fill', color)

    marker.appendChild(polygon)
    return marker
  }

  const createDiagonalPattern = (id: string) => {
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    pattern.setAttribute('id', id)
    pattern.setAttribute('patternUnits', 'userSpaceOnUse')
    pattern.setAttribute('width', '8')
    pattern.setAttribute('height', '8')
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M0,8 L8,0')
    path.setAttribute('stroke', '#ccc')
    path.setAttribute('stroke-width', '1')
    
    pattern.appendChild(path)
    return pattern
  }

  const drawZeroTrustDiagram = (svg: SVGSVGElement) => {
    // Internet Cloud
    createCloudNode(svg, 50, 50, 150, 80, 'Internet', 'internet', '#f5f5f5')
    
    // Portnox Cloud
    createCloudNode(svg, 300, 50, 200, 100, 'Portnox Cloud NAC', 'portnox-cloud', 'url(#cloudGradient)')
    
    // AWS Infrastructure
    createRectNode(svg, 600, 30, 180, 60, 'AWS RADSec Proxy 1', 'aws-proxy-1', 'url(#awsGradient)')
    createRectNode(svg, 600, 110, 180, 60, 'AWS RADSec Proxy 2', 'aws-proxy-2', 'url(#awsGradient)')
    
    // Identity Providers
    createRectNode(svg, 300, 200, 200, 80, getIdentityProviderName(), 'identity-provider', 'url(#secureGradient)')
    
    // ABM Sites
    createSiteNode(svg, 900, 50, 150, 60, 'ABM HQ', 'site-hq', 'url(#siteGradient)')
    createSiteNode(svg, 900, 130, 150, 60, 'Data Center', 'site-dc', 'url(#siteGradient)')
    createSiteNode(svg, 900, 210, 150, 60, 'Branch Office', 'site-branch', 'url(#siteGradient)')
    
    // Network Equipment at sites
    createRectNode(svg, 1100, 50, 120, 40, getVendorEquipment(), 'network-equipment-1', '#fff')
    createRectNode(svg, 1100, 130, 120, 40, getVendorEquipment(), 'network-equipment-2', '#fff')
    createRectNode(svg, 1100, 210, 120, 40, getVendorEquipment(), 'network-equipment-3', '#fff')
    
    // End Devices
    createDeviceNode(svg, 1280, 50, 40, 40, 'Laptop', 'device-1')
    createDeviceNode(svg, 1280, 90, 40, 40, 'Phone', 'device-2')
    createDeviceNode(svg, 1280, 130, 40, 40, 'Tablet', 'device-3')
    createDeviceNode(svg, 1280, 170, 40, 40, 'IoT', 'device-4')
    createDeviceNode(svg, 1280, 210, 40, 40, 'Server', 'device-5')
    
    // Monitoring & Analytics
    createRectNode(svg, 300, 320, 200, 60, 'Splunk SIEM', 'splunk', '#9c27b0')
    
    // Connections
    createSecureConnection(svg, 200, 90, 300, 100, 'HTTPS/TLS')
    createSecureConnection(svg, 500, 100, 600, 60, 'RADSec/TLS')
    createSecureConnection(svg, 500, 100, 600, 140, 'RADSec/TLS')
    createConnection(svg, 780, 80, 900, 80, 'RADIUS')
    createConnection(svg, 780, 140, 900, 160, 'RADIUS')
    createConnection(svg, 780, 140, 900, 240, 'RADIUS')
    
    // Site to equipment connections
    createConnection(svg, 1050, 70, 1100, 70, '802.1X')
    createConnection(svg, 1050, 150, 1100, 150, '802.1X')
    createConnection(svg, 1050, 230, 1100, 230, '802.1X')
    
    // Equipment to devices
    createConnection(svg, 1220, 70, 1280, 70, 'Auth')
    createConnection(svg, 1220, 70, 1280, 110, 'Auth')
    createConnection(svg, 1220, 150, 1280, 150, 'Auth')
    createConnection(svg, 1220, 150, 1280, 190, 'Auth')
    createConnection(svg, 1220, 230, 1280, 230, 'Auth')
    
    // Identity integration
    createSecureConnection(svg, 400, 200, 400, 150, 'LDAP/SAML')
    
    // Monitoring connection
    createConnection(svg, 400, 280, 400, 320, 'Syslog')
    
    // Add technical details
    addTechnicalLabels(svg)
  }

  const drawAuthFlowDiagram = (svg: SVGSVGElement) => {
    const steps = [
      { x: 100, y: 150, label: '1. Device Connect', detail: 'EAP-Start' },
      { x: 300, y: 150, label: '2. Identity Request', detail: 'EAP-Request/Identity' },
      { x: 500, y: 150, label: '3. Certificate Auth', detail: 'EAP-TLS Handshake' },
      { x: 700, y: 150, label: '4. Policy Decision', detail: 'RADIUS Access-Accept' },
      { x: 900, y: 150, label: '5. VLAN Assignment', detail: 'Dynamic VLAN' },
      { x: 1100, y: 150, label: '6. Network Access', detail: 'Authorized Traffic' }
    ]

    // Draw flow steps
    steps.forEach((step, index) => {
      createFlowStep(svg, step.x, step.y, 80, step.label, step.detail, index)
      if (index < steps.length - 1) {
        createAnimatedConnection(svg, step.x + 80, step.y, steps[index + 1].x - 80, steps[index + 1].y, `flow-${index}`)
      }
    })

    // Add detailed protocol information
    createProtocolDetails(svg, 100, 250, [
      'EAP-TLS Certificate Exchange',
      'RADIUS Attribute Exchange',
      'Dynamic VLAN Assignment',
      'Session Monitoring',
      'Policy Enforcement'
    ])

    // Add timing information
    createTimingDiagram(svg, 100, 350)
  }

  const drawPKIDiagram = (svg: SVGSVGElement) => {
    // PKI Hierarchy
    createPKINode(svg, 500, 50, 200, 80, 'Portnox Root CA', 'root-ca', '#e3f2fd')
    createPKINode(svg, 300, 180, 180, 60, 'Issuing CA', 'issuing-ca', '#e8f5e9')
    createPKINode(svg, 700, 180, 180, 60, 'SCEP Server', 'scep-server', '#fff3e0')
    
    // Certificate Services
    createPKINode(svg, 200, 300, 150, 60, 'OCSP Responder', 'ocsp', '#f3e5f5')
    createPKINode(svg, 400, 300, 150, 60, 'CRL Distribution', 'crl', '#f3e5f5')
    createPKINode(svg, 600, 300, 150, 60, 'Certificate Store', 'cert-store', '#f3e5f5')
    createPKINode(svg, 800, 300, 150, 60, 'Key Management', 'key-mgmt', '#f3e5f5')
    
    // Client Integration
    createPKINode(svg, 100, 450, 150, 60, 'Intune MDM', 'intune', '#fff3e0')
    createPKINode(svg, 300, 450, 150, 60, 'SCEP Client', 'scep-client', '#e8f5e9')
    createPKINode(svg, 500, 450, 150, 60, 'End Device', 'end-device', '#e8f5e9')
    createPKINode(svg, 700, 450, 150, 60, 'Certificate Validation', 'cert-validation', '#f3e5f5')
    
    // Connections showing certificate flow
    createSecureConnection(svg, 500, 130, 380, 180, 'Certificate Issuance')
    createSecureConnection(svg, 600, 130, 700, 180, 'SCEP Protocol')
    
    // Certificate lifecycle connections
    createConnection(svg, 380, 240, 275, 300, 'OCSP Check')
    createConnection(svg, 475, 240, 475, 300, 'CRL Update')
    createConnection(svg, 700, 240, 675, 300, 'Certificate Storage')
    createConnection(svg, 790, 240, 825, 300, 'Key Escrow')
    
    // Client connections
    createConnection(svg, 175, 450, 300, 480, 'MDM Deployment')
    createConnection(svg, 450, 480, 500, 480, 'Certificate Install')
    createConnection(svg, 650, 480, 700, 480, 'Validation Request')
    
    // Add certificate lifecycle timeline
    createCertificateLifecycle(svg, 100, 550)
  }

  const drawPolicyFrameworkDiagram = (svg: SVGSVGElement) => {
    // Policy Engine Core
    createPolicyNode(svg, 500, 100, 200, 80, 'Policy Engine', 'policy-engine', '#e3f2fd')
    
    // Policy Components
    createPolicyNode(svg, 200, 50, 150, 60, 'Device Policies', 'device-policies', '#e8f5e9')
    createPolicyNode(svg, 200, 130, 150, 60, 'User Policies', 'user-policies', '#e8f5e9')
    createPolicyNode(svg, 200, 210, 150, 60, 'Network Policies', 'network-policies', '#e8f5e9')
    
    // Enforcement Points
    createPolicyNode(svg, 800, 50, 150, 60, 'VLAN Assignment', 'vlan-assignment', '#fff3e0')
    createPolicyNode(svg, 800, 130, 150, 60, 'ACL Application', 'acl-application', '#fff3e0')
    createPolicyNode(svg, 800, 210, 150, 60, 'QoS Policies', 'qos-policies', '#fff3e0')
    
    // Data Sources
    createPolicyNode(svg, 100, 300, 120, 50, 'Device DB', 'device-db', '#f3e5f5')
    createPolicyNode(svg, 250, 300, 120, 50, 'User Directory', 'user-directory', '#f3e5f5')
    createPolicyNode(svg, 400, 300, 120, 50, 'Compliance', 'compliance', '#f3e5f5')
    createPolicyNode(svg, 550, 300, 120, 50, 'Threat Intel', 'threat-intel', '#f3e5f5')
    
    // Policy Decision Flow
    createConnection(svg, 350, 80, 500, 120, 'Policy Input')
    createConnection(svg, 350, 160, 500, 140, 'Policy Input')
    createConnection(svg, 350, 240, 500, 160, 'Policy Input')
    
    createConnection(svg, 700, 120, 800, 80, 'Enforcement')
    createConnection(svg, 700, 140, 800, 160, 'Enforcement')
    createConnection(svg, 700, 160, 800, 240, 'Enforcement')
    
    // Data source connections
    createConnection(svg, 160, 300, 500, 180, 'Device Context')
    createConnection(svg, 310, 300, 520, 180, 'User Context')
    createConnection(svg, 460, 300, 540, 180, 'Compliance Status')
    createConnection(svg, 610, 300, 560, 180, 'Risk Score')
    
    // Add policy examples
    createPolicyExamples(svg, 100, 400)
  }

  const drawMultiCloudDiagram = (svg: SVGSVGElement) => {
    // Cloud Providers
    createCloudNode(svg, 100, 100, 180, 80, 'AWS', 'aws-cloud', '#ff9900')
    createCloudNode(svg, 350, 100, 180, 80, 'Azure', 'azure-cloud', '#0078d4')
    createCloudNode(svg, 600, 100, 180, 80, 'GCP', 'gcp-cloud', '#4285f4')
    
    // Portnox Cloud (Central)
    createCloudNode(svg, 350, 250, 200, 100, 'Portnox Cloud', 'portnox-central', '#00c8d7')
    
    // Regional Deployments
    createRectNode(svg, 50, 200, 120, 50, 'US-East RADSec', 'us-east', '#fff3e0')
    createRectNode(svg, 300, 50, 120, 40, 'EU-West RADSec', 'eu-west', '#fff3e0')
    createRectNode(svg, 650, 50, 120, 40, 'APAC RADSec', 'apac', '#fff3e0')
    
    // Site Connections
    createSiteNode(svg, 50, 350, 100, 50, 'US Sites', 'us-sites', '#e8f5e9')
    createSiteNode(svg, 200, 350, 100, 50, 'EU Sites', 'eu-sites', '#e8f5e9')
    createSiteNode(svg, 350, 400, 100, 50, 'APAC Sites', 'apac-sites', '#e8f5e9')
    createSiteNode(svg, 500, 350, 100, 50, 'LATAM Sites', 'latam-sites', '#e8f5e9')
    
    // Cloud interconnections
    createSecureConnection(svg, 280, 140, 350, 250, 'Cloud Interconnect')
    createSecureConnection(svg, 450, 140, 450, 250, 'ExpressRoute')
    createSecureConnection(svg, 600, 140, 550, 250, 'Cloud VPN')
    
    // Regional connections
    createConnection(svg, 110, 200, 190, 180, 'Regional Traffic')
    createConnection(svg, 360, 90, 400, 250, 'Regional Traffic')
    createConnection(svg, 710, 90, 500, 250, 'Regional Traffic')
    
    // Site connections
    createConnection(svg, 100, 350, 110, 250, 'Site Traffic')
    createConnection(svg, 250, 350, 360, 90, 'Site Traffic')
    createConnection(svg, 400, 400, 710, 90, 'Site Traffic')
    createConnection(svg, 550, 350, 450, 350, 'Site Traffic')
    
    // Add latency and performance metrics
    createPerformanceMetrics(svg, 850, 100)
  }

  const drawIntuneIntegrationDiagram = (svg: SVGSVGElement) => {
    // Microsoft Cloud Services
    createCloudNode(svg, 100, 50, 180, 80, 'Azure AD/Entra', 'azure-ad', '#0078d4')
    createCloudNode(svg, 350, 50, 180, 80, 'Intune MDM', 'intune-mdm', '#0078d4')
    createCloudNode(svg, 600, 50, 180, 80, 'Endpoint Manager', 'endpoint-mgr', '#0078d4')
    
    // Portnox Integration
    createCloudNode(svg, 350, 200, 200, 80, 'Portnox Cloud', 'portnox-intune', '#00c8d7')
    
    // Certificate Services
    createRectNode(svg, 100, 300, 150, 60, 'SCEP Connector', 'scep-connector', '#fff3e0')
    createRectNode(svg, 300, 300, 150, 60, 'Certificate Profiles', 'cert-profiles', '#fff3e0')
    createRectNode(svg, 500, 300, 150, 60, 'Compliance Policies', 'compliance-policies', '#fff3e0')
    
    // Device Types
    createDeviceNode(svg, 100, 450, 60, 60, 'Windows', 'windows-device')
    createDeviceNode(svg, 200, 450, 60, 60, 'macOS', 'macos-device')
    createDeviceNode(svg, 300, 450, 60, 60, 'iOS', 'ios-device')
    createDeviceNode(svg, 400, 450, 60, 60, 'Android', 'android-device')
    createDeviceNode(svg, 500, 450, 60, 60, 'Linux', 'linux-device')
    
    // Integration flows
    createSecureConnection(svg, 280, 130, 350, 200, 'Identity Sync')
    createSecureConnection(svg, 530, 130, 450, 200, 'Device Management')
    createSecureConnection(svg, 780, 130, 550, 200, 'Compliance Check')
    
    // Certificate deployment flows
    createConnection(svg, 175, 300, 130, 450, 'Certificate Deploy')
    createConnection(svg, 375, 300, 230, 450, 'Certificate Deploy')
    createConnection(svg, 375, 300, 330, 450, 'Certificate Deploy')
    createConnection(svg, 575, 300, 430, 450, 'Certificate Deploy')
    createConnection(svg, 575, 300, 530, 450, 'Certificate Deploy')
    
    // Portnox to certificate services
    createConnection(svg, 350, 280, 175, 300, 'SCEP Integration')
    createConnection(svg, 450, 280, 375, 300, 'Profile Management')
    createConnection(svg, 550, 280, 575, 300, 'Policy Enforcement')
    
    // Add enrollment workflow
    createEnrollmentWorkflow(svg, 700, 300)
  }

  const drawDeviceOnboardingDiagram = (svg: SVGSVGElement) => {
    // Onboarding stages
    const stages = [
      { x: 100, y: 100, label: 'Device Discovery', detail: 'Network Detection' },
      { x: 300, y: 100, label: 'Identity Verification', detail: 'User Authentication' },
      { x: 500, y: 100, label: 'Certificate Enrollment', detail: 'SCEP/EST' },
      { x: 700, y: 100, label: 'Policy Application', detail: 'VLAN Assignment' },
      { x: 900, y: 100, label: 'Network Access', detail: 'Authorized Connection' }
    ]

    // Draw onboarding flow
    stages.forEach((stage, index) => {
      createOnboardingStage(svg, stage.x, stage.y, 150, stage.label, stage.detail, index)
      if (index < stages.length - 1) {
        createAnimatedConnection(svg, stage.x + 150, stage.y + 30, stages[index + 1].x, stage.y + 30, `onboard-${index}`)
      }
    })

    // Device types and their onboarding paths
    createDeviceOnboardingPaths(svg, 100, 250)
    
    // Troubleshooting decision tree
    createTroubleshootingTree(svg, 100, 400)
  }

  const drawDefaultDiagram = (svg: SVGSVGElement) => {
    // Default comprehensive architecture
    createCloudNode(svg, 400, 100, 200, 80, 'Portnox NAC', 'default-portnox', '#e3f2fd')
    createRectNode(svg, 200, 250, 150, 60, 'Network Infrastructure', 'default-network', '#e8f5e9')
    createRectNode(svg, 450, 250, 150, 60, 'Identity Provider', 'default-identity', '#fff3e0')
    createRectNode(svg, 700, 250, 150, 60, 'End Devices', 'default-devices', '#f3e5f5')
    
    // Basic connections
    createConnection(svg, 350, 280, 400, 180, 'Authentication')
    createConnection(svg, 600, 180, 525, 250, 'Policy')
    createConnection(svg, 600, 280, 700, 280, 'Access')
    
    createText(svg, 500, 400, 'Select an architecture view to see detailed diagrams', 16, '#666', 'middle')
  }

  // Helper functions for creating SVG elements
  const createCloudNode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string, fill: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    // Cloud shape path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const cloudPath = `M${x + width * 0.2},${y + height * 0.6} 
                      C${x + width * 0.1},${y + height * 0.4} ${x + width * 0.1},${y + height * 0.2} ${x + width * 0.3},${y + height * 0.2}
                      C${x + width * 0.3},${y + height * 0.1} ${x + width * 0.5},${y + height * 0.1} ${x + width * 0.5},${y + height * 0.2}
                      C${x + width * 0.7},${y + height * 0.1} ${x + width * 0.9},${y + height * 0.2} ${x + width * 0.8},${y + height * 0.4}
                      C${x + width * 0.9},${y + height * 0.5} ${x + width * 0.8},${y + height * 0.7} ${x + width * 0.6},${y + height * 0.6}
                      Z`
    path.setAttribute('d', cloudPath)
    path.setAttribute('fill', fill)
    path.setAttribute('stroke', '#666')
    path.setAttribute('stroke-width', '2')
    path.setAttribute('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')
    
    const text = createText(svg, x + width/2, y + height/2, label, 14, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(path)
    g.appendChild(text)
    svg.appendChild(g)
    
    // Add click handler
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createRectNode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string, fill: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', height.toString())
    rect.setAttribute('rx', '8')
    rect.setAttribute('fill', fill)
    rect.setAttribute('stroke', '#666')
    rect.setAttribute('stroke-width', '2')
    rect.setAttribute('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))')
    
    const text = createText(svg, x + width/2, y + height/2, label, 12, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(rect)
    g.appendChild(text)
    svg.appendChild(g)
    
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createSiteNode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string, fill: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    // Building shape
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', (y + 10).toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', (height - 10).toString())
    rect.setAttribute('rx', '4')
    rect.setAttribute('fill', fill)
    rect.setAttribute('stroke', '#666')
    rect.setAttribute('stroke-width', '2')
    
    // Roof
    const roof = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    roof.setAttribute('points', `${x},${y + 10} ${x + width/2},${y} ${x + width},${y + 10}`)
    roof.setAttribute('fill', '#8bc34a')
    roof.setAttribute('stroke', '#666')
    roof.setAttribute('stroke-width', '2')
    
    const text = createText(svg, x + width/2, y + height/2 + 5, label, 12, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(rect)
    g.appendChild(roof)
    g.appendChild(text)
    svg.appendChild(g)
    
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createDeviceNode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', (x + width/2).toString())
    circle.setAttribute('cy', (y + height/2).toString())
    circle.setAttribute('r', (Math.min(width, height)/2 - 2).toString())
    circle.setAttribute('fill', '#fff')
    circle.setAttribute('stroke', '#666')
    circle.setAttribute('stroke-width', '2')
    
    const text = createText(svg, x + width/2, y + height/2, label, 10, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(circle)
    g.appendChild(text)
    svg.appendChild(g)
    
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createConnection = (svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, label?: string) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())
    line.setAttribute('stroke', '#666')
    line.setAttribute('stroke-width', '2')
    line.setAttribute('marker-end', 'url(#arrowhead)')
    line.classList.add('diagram-connection')
    
    svg.appendChild(line)
    
    if (label) {
      const text = createText(svg, (x1 + x2) / 2, (y1 + y2) / 2 - 10, label, 10, '#666', 'middle')
      text.setAttribute('font-weight', 'bold')
      svg.appendChild(text)
    }
    
    return line
  }

  const createSecureConnection = (svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, label?: string) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())
    line.setAttribute('stroke', '#4caf50')
    line.setAttribute('stroke-width', '3')
    line.setAttribute('stroke-dasharray', '5,5')
    line.setAttribute('marker-end', 'url(#secureArrow)')
    line.classList.add('diagram-secure-connection')
    
    svg.appendChild(line)
    
    if (label) {
      const text = createText(svg, (x1 + x2) / 2, (y1 + y2) / 2 - 10, label, 10, '#4caf50', 'middle')
      text.setAttribute('font-weight', 'bold')
      svg.appendChild(text)
    }
    
    return line
  }

  const createAnimatedConnection = (svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, id: string) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())
    line.setAttribute('stroke', '#2196f3')
    line.setAttribute('stroke-width', '3')
    line.setAttribute('marker-end', 'url(#dataFlow)')
    line.setAttribute('id', id)
    
    // Add animation
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    line.setAttribute('stroke-dasharray', `${length}`)
    line.setAttribute('stroke-dashoffset', `${length}`)
    
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate.setAttribute('attributeName', 'stroke-dashoffset')
    animate.setAttribute('values', `${length};0`)
    animate.setAttribute('dur', `${2 / animationSpeed}s`)
    animate.setAttribute('repeatCount', 'indefinite')
    
    line.appendChild(animate)
    svg.appendChild(line)
    
    return line
  }

  const createText = (svg: SVGSVGElement, x: number, y: number, text: string, fontSize: number, fill: string, textAnchor: string) => {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textElement.setAttribute('x', x.toString())
    textElement.setAttribute('y', y.toString())
    textElement.setAttribute('text-anchor', textAnchor)
    textElement.setAttribute('dominant-baseline', 'middle')
    textElement.setAttribute('font-size', fontSize.toString())
    textElement.setAttribute('font-family', 'Inter, system-ui, sans-serif')
    textElement.setAttribute('fill', fill)
    textElement.textContent = text
    return textElement
  }

  // Additional helper functions for specific diagram elements
  const createFlowStep = (svg: SVGSVGElement, x: number, y: number, width: number, label: string, detail: string, index: number) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('flow-step')
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', '80')
    rect.setAttribute('rx', '8')
    rect.setAttribute('fill', `hsl(${index * 60}, 70%, 90%)`)
    rect.setAttribute('stroke', `hsl(${index * 60}, 70%, 60%)`)
    rect.setAttribute('stroke-width', '2')
    
    const labelText = createText(svg, x + width/2, y + 25, label, 12, '#333', 'middle')
    labelText.setAttribute('font-weight', 'bold')
    
    const detailText = createText(svg, x + width/2, y + 50, detail, 10, '#666', 'middle')
    
    g.appendChild(rect)
    g.appendChild(labelText)
    g.appendChild(detailText)
    svg.appendChild(g)
    
    return g
  }

  const createPKINode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string, fill: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node', 'pki-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    // Hexagon shape for PKI nodes
    const points = []
    const centerX = x + width/2
    const centerY = y + height/2
    const radius = Math.min(width, height) / 2 - 5
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const px = centerX + radius * Math.cos(angle)
      const py = centerY + radius * Math.sin(angle)
      points.push(`${px},${py}`)
    }
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute('points', points.join(' '))
    polygon.setAttribute('fill', fill)
    polygon.setAttribute('stroke', '#666')
    polygon.setAttribute('stroke-width', '2')
    
    const text = createText(svg, centerX, centerY, label, 11, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(polygon)
    g.appendChild(text)
    svg.appendChild(g)
    
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createPolicyNode = (svg: SVGSVGElement, x: number, y: number, width: number, height: number, label: string, id: string, fill: string) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('diagram-node', 'policy-node')
    g.setAttribute('data-node-id', id)
    g.style.cursor = 'pointer'
    
    // Diamond shape for policy nodes
    const points = [
      `${x + width/2},${y}`,
      `${x + width},${y + height/2}`,
      `${x + width/2},${y + height}`,
      `${x},${y + height/2}`
    ]
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute('points', points.join(' '))
    polygon.setAttribute('fill', fill)
    polygon.setAttribute('stroke', '#666')
    polygon.setAttribute('stroke-width', '2')
    
    const text = createText(svg, x + width/2, y + height/2, label, 11, '#333', 'middle')
    text.setAttribute('font-weight', 'bold')
    
    g.appendChild(polygon)
    g.appendChild(text)
    svg.appendChild(g)
    
    g.addEventListener('click', () => handleNodeClick(id, label))
    
    return g
  }

  const createOnboardingStage = (svg: SVGSVGElement, x: number, y: number, width: number, label: string, detail: string, index: number) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('onboarding-stage')
    
    // Rounded rectangle with gradient
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', width.toString())
    rect.setAttribute('height', '60')
    rect.setAttribute('rx', '12')
    rect.setAttribute('fill', `url(#stage-gradient-${index})`)
    rect.setAttribute('stroke', '#666')
    rect.setAttribute('stroke-width', '2')
    
    // Stage number circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', (x + 20).toString())
    circle.setAttribute('cy', (y + 30).toString())
    circle.setAttribute('r', '15')
    circle.setAttribute('fill', '#2196f3')
    circle.setAttribute('stroke', '#fff')
    circle.setAttribute('stroke-width', '2')
    
    const numberText = createText(svg, x + 20, y + 30, (index + 1).toString(), 12, '#fff', 'middle')
    numberText.setAttribute('font-weight', 'bold')
    
    const labelText = createText(svg, x + 50, y + 20, label, 12, '#333', 'start')
    labelText.setAttribute('font-weight', 'bold')
    
    const detailText = createText(svg, x + 50, y + 40, detail, 10, '#666', 'start')
    
    g.appendChild(rect)
    g.appendChild(circle)
    g.appendChild(numberText)
    g.appendChild(labelText)
    g.appendChild(detailText)
    svg.appendChild(g)
    
    return g
  }

  // Additional helper functions for complex diagram elements
  const addTechnicalLabels = (svg: SVGSVGElement) => {
    // Add port numbers and protocol information
    const labels = [
      { x: 150, y: 40, text: 'Port 443 (HTTPS)', color: '#666' },
      { x: 550, y: 40, text: 'Port 2083 (RADSec)', color: '#4caf50' },
      { x: 850, y: 40, text: 'Port 1812/1813 (RADIUS)', color: '#666' },
      { x: 1150, y: 40, text: 'Port 802.1X', color: '#666' },
      { x: 400, y: 380, text: 'Port 514 (Syslog)', color: '#9c27b0' }
    ]
    
    labels.forEach(label => {
      const text = createText(svg, label.x, label.y, label.text, 10, label.color, 'middle')
      text.setAttribute('font-weight', 'bold')
      svg.appendChild(text)
    })
  }

  const createProtocolDetails = (svg: SVGSVGElement, x: number, y: number, protocols: string[]) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('protocol-details')
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', '300')
    rect.setAttribute('height', (protocols.length * 25 + 20).toString())
    rect.setAttribute('rx', '8')
    rect.setAttribute('fill', '#f8f9fa')
    rect.setAttribute('stroke', '#dee2e6')
    rect.setAttribute('stroke-width', '1')
    
    const title = createText(svg, x + 10, y + 15, 'Protocol Details:', 12, '#333', 'start')
    title.setAttribute('font-weight', 'bold')
    
    protocols.forEach((protocol, index) => {
      const text = createText(svg, x + 10, y + 35 + (index * 20), `• ${protocol}`, 11, '#666', 'start')
      g.appendChild(text)
    })
    
    g.appendChild(rect)
    g.appendChild(title)
    svg.appendChild(g)
    
    return g
  }

  const createTimingDiagram = (svg: SVGSVGElement, x: number, y: number) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('timing-diagram')
    
    // Timeline
    const timeline = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    timeline.setAttribute('x1', x.toString())
    timeline.setAttribute('y1', y.toString())
    timeline.setAttribute('x2', (x + 400).toString())
    timeline.setAttribute('y2', y.toString())
    timeline.setAttribute('stroke', '#333')
    timeline.setAttribute('stroke-width', '2')
    
    // Time markers
    const timeMarkers = ['0ms', '50ms', '100ms', '200ms', '500ms']
    timeMarkers.forEach((time, index) => {
      const markerX = x + (index * 80)
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      marker.setAttribute('x1', markerX.toString())
      marker.setAttribute('y1', (y - 5).toString())
      marker.setAttribute('x2', markerX.toString())
      marker.setAttribute('y2', (y + 5).toString())
      marker.setAttribute('stroke', '#333')
      marker.setAttribute('stroke-width', '1')
      
      const text = createText(svg, markerX, y + 20, time, 10, '#666', 'middle')
      
      g.appendChild(marker)
      g.appendChild(text)
    })
    
    g.appendChild(timeline)
    svg.appendChild(g)
    
    return g
  }

  const createCertificateLifecycle = (svg: SVGSVGElement, x: number, y: number) => {
    const stages = [
      { label: 'Request', color: '#ff9800', duration: '1-2 days' },
      { label: 'Issue', color: '#4caf50', duration: '< 1 hour' },
      { label: 'Deploy', color: '#2196f3', duration: '< 30 min' },
      { label: 'Validate', color: '#9c27b0', duration: 'Real-time' },
      { label: 'Renew', color: '#f44336', duration: '30 days before expiry' }
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('certificate-lifecycle')
    
    stages.forEach((stage, index) => {
      const stageX = x + (index * 120)
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', stageX.toString())
      circle.setAttribute('cy', y.toString())
      circle.setAttribute('r', '20')
      circle.setAttribute('fill', stage.color)
      circle.setAttribute('stroke', '#fff')
      circle.setAttribute('stroke-width', '3')
      
      const labelText = createText(svg, stageX, y - 35, stage.label, 12, '#333', 'middle')
      labelText.setAttribute('font-weight', 'bold')
      
      const durationText = createText(svg, stageX, y + 35, stage.duration, 10, '#666', 'middle')
      
      if (index < stages.length - 1) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        arrow.setAttribute('x1', (stageX + 25).toString())
        arrow.setAttribute('y1', y.toString())
        arrow.setAttribute('x2', (stageX + 95).toString())
        arrow.setAttribute('y2', y.toString())
        arrow.setAttribute('stroke', '#666')
        arrow.setAttribute('stroke-width', '2')
        arrow.setAttribute('marker-end', 'url(#arrowhead)')
        
        g.appendChild(arrow)
      }
      
      g.appendChild(circle)
      g.appendChild(labelText)
      g.appendChild(durationText)
    })
    
    svg.appendChild(g)
    return g
  }

  const createPolicyExamples = (svg: SVGSVGElement, x: number, y: number) => {
    const examples = [
      'Corporate Devices → VLAN 100 (Full Access)',
      'BYOD Devices → VLAN 200 (Limited Access)',
      'Guest Devices → VLAN 300 (Internet Only)',
      'IoT Devices → VLAN 400 (Segmented)',
      'Non-Compliant → Quarantine VLAN'
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('policy-examples')
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', '400')
    rect.setAttribute('height', (examples.length * 25 + 30).toString())
    rect.setAttribute('rx', '8')
    rect.setAttribute('fill', '#f8f9fa')
    rect.setAttribute('stroke', '#dee2e6')
    rect.setAttribute('stroke-width', '1')
    
    const title = createText(svg, x + 10, y + 20, 'Policy Examples:', 14, '#333', 'start')
    title.setAttribute('font-weight', 'bold')
    
    examples.forEach((example, index) => {
      const text = createText(svg, x + 10, y + 45 + (index * 22), example, 12, '#666', 'start')
      g.appendChild(text)
    })
    
    g.appendChild(rect)
    g.appendChild(title)
    svg.appendChild(g)
    
    return g
  }

  const createPerformanceMetrics = (svg: SVGSVGElement, x: number, y: number) => {
    const metrics = [
      { label: 'US-East Latency', value: '< 50ms', color: '#4caf50' },
      { label: 'EU-West Latency', value: '< 80ms', color: '#4caf50' },
      { label: 'APAC Latency', value: '< 120ms', color: '#ff9800' },
      { label: 'Availability', value: '99.9%', color: '#4caf50' },
      { label: 'Throughput', value: '10K auth/sec', color: '#2196f3' }
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('performance-metrics')
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', '200')
    rect.setAttribute('height', (metrics.length * 30 + 30).toString())
    rect.setAttribute('rx', '8')
    rect.setAttribute('fill', '#f8f9fa')
    rect.setAttribute('stroke', '#dee2e6')
    rect.setAttribute('stroke-width', '1')
    
    const title = createText(svg, x + 10, y + 20, 'Performance:', 14, '#333', 'start')
    title.setAttribute('font-weight', 'bold')
    
    metrics.forEach((metric, index) => {
      const labelText = createText(svg, x + 10, y + 45 + (index * 25), metric.label, 11, '#666', 'start')
      const valueText = createText(svg, x + 180, y + 45 + (index * 25), metric.value, 11, metric.color, 'end')
      valueText.setAttribute('font-weight', 'bold')
      
      g.appendChild(labelText)
      g.appendChild(valueText)
    })
    
    g.appendChild(rect)
    g.appendChild(title)
    svg.appendChild(g)
    
    return g
  }

  const createEnrollmentWorkflow = (svg: SVGSVGElement, x: number, y: number) => {
    const steps = [
      'User Login',
      'Device Check',
      'Certificate Request',
      'SCEP Enrollment',
      'Certificate Install',
      'Network Access'
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('enrollment-workflow')
    
    steps.forEach((step, index) => {
      const stepY = y + (index * 40)
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', x.toString())
      circle.setAttribute('cy', stepY.toString())
      circle.setAttribute('r', '15')
      circle.setAttribute('fill', '#2196f3')
      circle.setAttribute('stroke', '#fff')
      circle.setAttribute('stroke-width', '2')
      
      const numberText = createText(svg, x, stepY, (index + 1).toString(), 12, '#fff', 'middle')
      numberText.setAttribute('font-weight', 'bold')
      
      const stepText = createText(svg, x + 25, stepY, step, 12, '#333', 'start')
      stepText.setAttribute('font-weight', 'bold')
      
      if (index < steps.length - 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', x.toString())
        line.setAttribute('y1', (stepY + 15).toString())
        line.setAttribute('x2', x.toString())
        line.setAttribute('y2', (stepY + 25).toString())
        line.setAttribute('stroke', '#2196f3')
        line.setAttribute('stroke-width', '2')
        
        g.appendChild(line)
      }
      
      g.appendChild(circle)
      g.appendChild(numberText)
      g.appendChild(stepText)
    })
    
    svg.appendChild(g)
    return g
  }

  const createDeviceOnboardingPaths = (svg: SVGSVGElement, x: number, y: number) => {
    const deviceTypes = [
      { name: 'Windows', method: 'Group Policy + SCEP', color: '#0078d4' },
      { name: 'macOS', method: 'Configuration Profile', color: '#000' },
      { name: 'iOS/iPadOS', method: 'MDM Profile', color: '#007aff' },
      { name: 'Android', method: 'Work Profile', color: '#3ddc84' },
      { name: 'Linux', method: 'Manual Certificate', color: '#fcc624' }
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('device-onboarding-paths')
    
    deviceTypes.forEach((device, index) => {
      const deviceY = y + (index * 30)
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', x.toString())
      rect.setAttribute('y', (deviceY - 10).toString())
      rect.setAttribute('width', '300')
      rect.setAttribute('height', '25')
      rect.setAttribute('rx', '4')
      rect.setAttribute('fill', device.color)
      rect.setAttribute('opacity', '0.1')
      rect.setAttribute('stroke', device.color)
      rect.setAttribute('stroke-width', '1')
      
      const nameText = createText(svg, x + 10, deviceY, device.name, 12, device.color, 'start')
      nameText.setAttribute('font-weight', 'bold')
      
      const methodText = createText(svg, x + 100, deviceY, device.method, 11, '#666', 'start')
      
      g.appendChild(rect)
      g.appendChild(nameText)
      g.appendChild(methodText)
    })
    
    svg.appendChild(g)
    return g
  }

  const createTroubleshootingTree = (svg: SVGSVGElement, x: number, y: number) => {
    const issues = [
      { problem: 'Authentication Failed', solution: 'Check certificate validity', color: '#f44336' },
      { problem: 'Certificate Not Found', solution: 'Re-enroll via SCEP', color: '#ff9800' },
      { problem: 'Policy Not Applied', solution: 'Verify RADIUS attributes', color: '#2196f3' },
      { problem: 'Network Access Denied', solution: 'Check VLAN configuration', color: '#9c27b0' }
    ]
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('troubleshooting-tree')
    
    const title = createText(svg, x, y - 20, 'Common Issues & Solutions:', 14, '#333', 'start')
    title.setAttribute('font-weight', 'bold')
    
    issues.forEach((issue, index) => {
      const issueY = y + (index * 35)
      
      const problemText = createText(svg, x, issueY, `⚠️ ${issue.problem}`, 12, issue.color, 'start')
      problemText.setAttribute('font-weight', 'bold')
      
      const solutionText = createText(svg, x + 20, issueY + 15, `→ ${issue.solution}`, 11, '#666', 'start')
      
      g.appendChild(problemText)
      g.appendChild(solutionText)
    })
    
    g.appendChild(title)
    svg.appendChild(g)
    return g
  }

  // Utility functions
  const getIdentityProviderName = () => {
    switch (identity) {
      case 'azure-ad': return 'Azure AD/Entra ID'
      case 'active-directory': return 'Active Directory'
      case 'okta': return 'Okta'
      case 'ping': return 'Ping Identity'
      default: return 'Identity Provider'
    }
  }

  const getVendorEquipment = () => {
    switch (vendor) {
      case 'cisco': return 'Cisco Catalyst'
      case 'juniper': return 'Juniper EX'
      case 'aruba': return 'Aruba CX'
      case 'extreme': return 'Extreme Switch'
      case 'fortinet': return 'FortiSwitch'
      case 'meraki': return 'Meraki MS'
      case 'ubiquiti': return 'UniFi Switch'
      case 'mikrotik': return 'MikroTik CRS'
      default: return 'Network Switch'
    }
  }

  const handleNodeClick = (nodeId: string, label: string) => {
    setSelectedNode(nodeId)
    
    // Show detailed information about the clicked node
    const nodeInfo = getNodeInfo(nodeId, label)
    
    // You could show a tooltip or modal here
    console.log(`Clicked node: ${nodeId}`, nodeInfo)
  }

  const getNodeInfo = (nodeId: string, label: string) => {
    // Return detailed information about the node
    const nodeDetails: Record<string, any> = {
      'portnox-cloud': {
        description: 'Cloud-based NAC engine providing authentication, authorization, and policy enforcement',
        features: ['Private PKI', 'Policy Management', 'Real-time Monitoring', 'API Integration'],
        ports: ['443 (HTTPS)', '2083 (RADSec)'],
        sla: '99.9% uptime'
      },
      'aws-proxy-1': {
        description: 'Primary RADSec proxy for high availability RADIUS authentication',
        features: ['7-day cache', 'Load balancing', 'TLS encryption', 'Failover support'],
        ports: ['2083 (RADSec)', '1812/1813 (RADIUS)'],
        location: 'us-east-1a'
      },
      'identity-provider': {
        description: getIdentityProviderName() + ' integration for user authentication',
        features: ['LDAP/SAML', 'Multi-factor auth', 'Group policies', 'Conditional access'],
        protocols: ['LDAP', 'SAML 2.0', 'OAuth 2.0'],
        sync: 'Real-time'
      }
    }
    
    return nodeDetails[nodeId] || { description: label, features: [], ports: [], protocols: [] }
  }

  const animateDataFlow = (svg: SVGSVGElement) => {
    // Add animated data flow indicators
    const connections = svg.querySelectorAll('.diagram-connection')
    connections.forEach((connection, index) => {
      setTimeout(() => {
        connection.classList.add('animated')
      }, index * 200)
    })
  }

  const toggleDataFlow = () => {
    setShowDataFlow(!showDataFlow)
  }

  const handleAnimationSpeedChange = (speed: number) => {
    setAnimationSpeed(speed)
  }

  const currentView = architectureViews.find(v => v.id === view)
  const selectedVendor = networkVendors.find(v => v.id === vendor)
  const selectedConnectivity = connectivityOptions.find(c => c.id === connectivity)
  const selectedIdentity = identityProviders.find(i => i.id === identity)

  return (
    <div className="w-full space-y-4 font-inter">
      {/* Diagram Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <Button
            variant={showDataFlow ? "default" : "outline"}
            size="sm"
            onClick={toggleDataFlow}
            className="font-medium"
          >
            {showDataFlow ? 'Hide' : 'Show'} Data Flow
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Animation Speed:</span>
            <div className="flex space-x-1">
              {[0.5, 1, 2].map((speed) => (
                <Button
                  key={speed}
                  variant={animationSpeed === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAnimationSpeedChange(speed)}
                  className="font-medium"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {selectedNode && (
          <Badge variant="secondary" className="font-medium">
            Selected: {selectedNode}
          </Badge>
        )}
      </div>

      {/* SVG Diagram Container */}
      <div className="w-full bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          viewBox="0 0 1400 600"
          className="w-full h-auto"
          style={{ maxHeight: '600px', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {/* SVG content will be dynamically generated */}
        </svg>
      </div>

      {/* Diagram Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Architecture:</span>
              <Badge variant="outline" className="font-medium">{currentView?.name}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Vendor:</span>
              <Badge variant="outline" className="font-medium">{networkVendors.find(v => v.id === selectedVendor)?.name}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Connectivity:</span>
              <Badge variant="outline" className="font-medium">{connectivityOptions.find(c => c.id === selectedConnectivity)?.name}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Identity:</span>
              <Badge variant="outline" className="font-medium">{identityProviders.find(i => i.id === selectedIdentity)?.name}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Diagram Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
              <span className="text-sm font-medium">Cloud Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-500 rounded"></div>
              <span className="text-sm font-medium">AWS Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
              <span className="text-sm font-medium">ABM Sites</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-gray-400"></div>
              <span className="text-sm font-medium">Standard Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-green-500" style={{background: 'repeating-linear-gradient(90deg, #4caf50 0, #4caf50 4px, transparent 4px, transparent 8px)'}}></div>
              <span className="text-sm font-medium">Secure/Encrypted</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const architectureViews = [
  { id: 'zero-trust-nac', name: 'Zero Trust NAC' },
  { id: '802.1x-auth', name: '802.1X Authentication' },
  { id: 'pki-infrastructure', name: 'PKI Infrastructure' },
  { id: 'policy-framework', name: 'Policy Framework' },
  { id: 'multi-cloud', name: 'Multi-Cloud' },
  { id: 'intune-integration', name: 'Intune Integration' },
  { id: 'device-onboarding', name: 'Device Onboarding' }
]

const networkVendors = [
  { id: 'cisco', name: 'Cisco' },
  { id: 'juniper', name: 'Juniper' },
  { id: 'aruba', name: 'Aruba' },
  { id: 'extreme', name: 'Extreme' },
  { id: 'fortinet', name: 'Fortinet' },
  { id: 'meraki', name: 'Meraki' },
  { id: 'ubiquiti', name: 'Ubiquiti' },
  { id: 'mikrotik', name: 'MikroTik' }
]

const connectivityOptions = [
  { id: 'wired', name: 'Wired' },
  { id: 'wireless', name: 'Wireless' },
  { id: 'vpn', name: 'VPN' }
]

const identityProviders = [
  { id: 'azure-ad', name: 'Azure AD' },
  { id: 'active-directory', name: 'Active Directory' },
  { id: 'okta', name: 'Okta' },
  { id: 'ping', name: 'Ping Identity' }
]
