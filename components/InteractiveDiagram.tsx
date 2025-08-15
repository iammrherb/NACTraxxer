"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Network,
  Shield,
  Key,
  Lock,
  Wifi,
  Cloud,
  Smartphone,
  Monitor,
  Router,
  Server,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building,
  Cpu,
  Activity,
  Eye,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Target,
  FileText,
  UserCheck,
  ShieldCheck,
} from "lucide-react"

interface InteractiveDiagramProps {
  view: string
  vendor: string
  idp: string
  mdm: string
  showLabels: boolean
  showConnections: boolean
  animationSpeed: number
  isAnimating: boolean
  zoomLevel: number
  theme: string
  siteId?: string
}

interface DiagramComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  width: number
  height: number
  icon: React.ReactNode
  color: string
  status?: "active" | "inactive" | "warning" | "error"
  connections?: string[]
  details?: Record<string, any>
  vendor?: string
  model?: string
  version?: string
}

interface Connection {
  from: string
  to: string
  type: "data" | "control" | "auth" | "policy" | "radius" | "ldap" | "saml" | "tacacs" | "https" | "syslog"
  protocol?: string
  animated?: boolean
  bidirectional?: boolean
  encrypted?: boolean
  bandwidth?: string
  latency?: string
}

const views = {
  complete: { name: "Complete Architecture", icon: <Layers className="h-4 w-4" /> },
  authentication: { name: "Authentication Flow", icon: <Shield className="h-4 w-4" /> },
  pki: { name: "PKI & Certificate Management", icon: <Lock className="h-4 w-4" /> },
  policies: { name: "Access Control Policies", icon: <ShieldCheck className="h-4 w-4" /> },
  connectivity: { name: "Connectivity Options", icon: <Network className="h-4 w-4" /> },
  intune: { name: "Intune Integration", icon: <Cloud className="h-4 w-4" /> },
  onboarding: { name: "Device Onboarding", icon: <Eye className="h-4 w-4" /> },
  "risk-assessment": { name: "Risk Assessment", icon: <AlertTriangle className="h-4 w-4" /> },
  "guest-portal": { name: "Guest & Captive Portal", icon: <Globe className="h-4 w-4" /> },
  "iot-onboarding": { name: "IoT Device Onboarding", icon: <Cpu className="h-4 w-4" /> },
  "radsec-proxy": { name: "RADSEC Proxy Architecture", icon: <Server className="h-4 w-4" /> },
  tacacs: { name: "TACACS+ Integration", icon: <Database className="h-4 w-4" /> },
}

// Vendor-specific configurations
const vendorConfigs = {
  cisco: {
    name: "Cisco Systems",
    color: "#1BA0D7",
    switch: { model: "Catalyst 9300-48P", firmware: "17.09.04", ports: 48, poe: "740W" },
    wireless: { controller: "Catalyst 9800-CL", ap: "Catalyst 9130AXI", firmware: "17.09.04", aps: 150 },
    firewall: { model: "ASA 5516-X", firmware: "9.19(1)", throughput: "1 Gbps" },
    protocols: ["802.1X", "RADIUS", "TACACS+", "SNMP"],
  },
  aruba: {
    name: "Aruba (HPE)",
    color: "#FF6900",
    switch: { model: "CX 6300-48G", firmware: "10.10.1020", ports: 48, poe: "740W" },
    wireless: { controller: "7030", ap: "AP-635", firmware: "10.4.0.3", aps: 120 },
    firewall: { model: "ClearPass", firmware: "6.11.2", throughput: "N/A" },
    protocols: ["802.1X", "RADIUS", "ClearPass Policy Manager"],
  },
  juniper: {
    name: "Juniper Networks",
    color: "#84BD00",
    switch: { model: "EX4300-48P", firmware: "21.4R2", ports: 48, poe: "740W" },
    wireless: { controller: "Mist Cloud", ap: "AP63", firmware: "0.16.31245", aps: 180 },
    firewall: { model: "SRX1500", firmware: "21.2R3", throughput: "1.5 Gbps" },
    protocols: ["802.1X", "RADIUS", "TACACS+", "Mist AI"],
  },
  meraki: {
    name: "Cisco Meraki",
    color: "#1BA0D7",
    switch: { model: "MS225-48", firmware: "16.16", ports: 48, poe: "740W" },
    wireless: { controller: "Cloud Dashboard", ap: "MR46", firmware: "29.6.1", aps: 100 },
    firewall: { model: "MX250", firmware: "18.107.2", throughput: "1 Gbps" },
    protocols: ["802.1X", "RADIUS", "Cloud Management"],
  },
  mist: {
    name: "Juniper Mist",
    color: "#84BD00",
    switch: { model: "EX4300-48P", firmware: "21.4R2", ports: 48, poe: "740W" },
    wireless: { controller: "Mist Cloud", ap: "AP43", firmware: "0.16.31245", aps: 200 },
    firewall: { model: "SRX1500", firmware: "21.2R3", throughput: "1.5 Gbps" },
    protocols: ["802.1X", "RADIUS", "AI-driven RF", "Marvis VNA"],
  },
  ruckus: {
    name: "Ruckus (CommScope)",
    color: "#FF6B35",
    switch: { model: "ICX 7150-48P", firmware: "09.0.10", ports: 48, poe: "740W" },
    wireless: { controller: "SmartZone 144", ap: "R750", firmware: "104.1.0.0.213", aps: 130 },
    firewall: { model: "N/A", firmware: "N/A", throughput: "N/A" },
    protocols: ["802.1X", "RADIUS", "SmartZone", "BeamFlex+"],
  },
  ubiquiti: {
    name: "Ubiquiti Networks",
    color: "#0559C4",
    switch: { model: "Dream Machine Pro", firmware: "7.4.162", ports: 8, poe: "60W" },
    wireless: { controller: "UniFi Controller", ap: "U6 Enterprise", firmware: "7.4.162", aps: 80 },
    firewall: { model: "UDM Pro", firmware: "7.4.162", throughput: "3.5 Gbps" },
    protocols: ["802.1X", "RADIUS", "UniFi Controller"],
  },
}

// IDP configurations
const idpConfigs = {
  "azure-ad": {
    name: "Azure Active Directory",
    color: "#0078D4",
    icon: <Cloud className="h-6 w-6" />,
    features: ["SSO", "MFA", "Conditional Access", "Identity Protection"],
    protocols: ["SAML 2.0", "OAuth 2.0", "OpenID Connect"],
  },
  okta: {
    name: "Okta",
    color: "#007DC1",
    icon: <Shield className="h-6 w-6" />,
    features: ["Universal Directory", "Adaptive MFA", "Lifecycle Management"],
    protocols: ["SAML 2.0", "OAuth 2.0", "OpenID Connect", "LDAP"],
  },
  ping: {
    name: "PingIdentity",
    color: "#FF6B35",
    icon: <Key className="h-6 w-6" />,
    features: ["PingFederate", "PingAccess", "PingDirectory"],
    protocols: ["SAML 2.0", "OAuth 2.0", "OpenID Connect", "WS-Federation"],
  },
  ad: {
    name: "Active Directory",
    color: "#0078D4",
    icon: <Building className="h-6 w-6" />,
    features: ["Domain Services", "Group Policy", "Certificate Services"],
    protocols: ["LDAP", "Kerberos", "NTLM"],
  },
  ldap: {
    name: "LDAP Directory",
    color: "#6B7280",
    icon: <Database className="h-6 w-6" />,
    features: ["Directory Services", "User Authentication", "Group Management"],
    protocols: ["LDAP", "LDAPS"],
  },
}

// MDM configurations
const mdmConfigs = {
  intune: {
    name: "Microsoft Intune",
    color: "#00BCF2",
    icon: <Cloud className="h-6 w-6" />,
    platforms: ["Windows", "iOS", "Android", "macOS"],
    features: ["Device Compliance", "App Protection", "Conditional Access"],
  },
  jamf: {
    name: "Jamf Pro",
    color: "#4A90E2",
    icon: <Monitor className="h-6 w-6" />,
    platforms: ["macOS", "iOS", "iPadOS", "tvOS"],
    features: ["Device Enrollment", "App Management", "Security Policies"],
  },
  "workspace-one": {
    name: "VMware Workspace ONE",
    color: "#0091DA",
    icon: <Server className="h-6 w-6" />,
    platforms: ["Windows", "iOS", "Android", "macOS", "Chrome OS"],
    features: ["Unified Endpoint Management", "Digital Workspace", "Zero Trust"],
  },
  mobileiron: {
    name: "Ivanti MobileIron",
    color: "#E31837",
    icon: <Smartphone className="h-6 w-6" />,
    platforms: ["iOS", "Android", "Windows", "macOS"],
    features: ["EMM", "UEM", "Zero Sign-On", "Threat Defense"],
  },
}

export default function InteractiveDiagram({
  view,
  vendor,
  idp,
  mdm,
  showLabels,
  showConnections,
  animationSpeed,
  isAnimating,
  zoomLevel,
  theme,
  siteId,
}: InteractiveDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [components, setComponents] = useState<DiagramComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const currentView = views[view as keyof typeof views]
  const [isAnimationActive, setIsAnimationActive] = useState(isAnimating)

  const vendorConfig = vendorConfigs[vendor as keyof typeof vendorConfigs] || vendorConfigs.cisco
  const idpConfig = idpConfigs[idp as keyof typeof idpConfigs] || idpConfigs["azure-ad"]
  const mdmConfig = mdmConfigs[mdm as keyof typeof mdmConfigs] || mdmConfigs.intune

  const toggleAnimation = () => {
    setIsAnimationActive(!isAnimationActive)
  }

  const resetView = () => {
    setSelectedComponent(null)
    setHoveredComponent(null)
  }

  useEffect(() => {
    generateDiagramComponents()
  }, [view, vendor, idp, mdm, siteId])

  useEffect(() => {
    setIsAnimationActive(isAnimating)
  }, [isAnimating])

  const generateDiagramComponents = () => {
    let newComponents: DiagramComponent[] = []
    let newConnections: Connection[] = []

    switch (view) {
      case "complete":
        newComponents = generateCompleteArchitecture()
        newConnections = generateCompleteConnections()
        break
      case "authentication":
        newComponents = generateAuthenticationFlow()
        newConnections = generateAuthenticationConnections()
        break
      case "pki":
        newComponents = generatePKIComponents()
        newConnections = generatePKIConnections()
        break
      case "policies":
        newComponents = generatePolicyComponents()
        newConnections = generatePolicyConnections()
        break
      case "connectivity":
        newComponents = generateConnectivityComponents()
        newConnections = generateConnectivityConnections()
        break
      case "intune":
        newComponents = generateIntuneComponents()
        newConnections = generateIntuneConnections()
        break
      case "onboarding":
        newComponents = generateOnboardingComponents()
        newConnections = generateOnboardingConnections()
        break
      case "risk-assessment":
        newComponents = generateRiskAssessmentComponents()
        newConnections = generateRiskAssessmentConnections()
        break
      case "guest-portal":
        newComponents = generateGuestPortalComponents()
        newConnections = generateGuestPortalConnections()
        break
      case "iot-onboarding":
        newComponents = generateIoTOnboardingComponents()
        newConnections = generateIoTOnboardingConnections()
        break
      case "radsec-proxy":
        newComponents = generateRadSecProxyComponents()
        newConnections = generateRadSecProxyConnections()
        break
      case "tacacs":
        newComponents = generateTACACSComponents()
        newConnections = generateTACACSConnections()
        break
      default:
        newComponents = generateCompleteArchitecture()
        newConnections = generateCompleteConnections()
    }

    setComponents(newComponents)
    setConnections(newConnections)
  }

  const generateCompleteArchitecture = (): DiagramComponent[] => [
    {
      id: "portnox-cloud",
      type: "nac-platform",
      name: "Portnox Cloud",
      x: 450,
      y: 60,
      width: 220,
      height: 100,
      icon: <Cloud className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        version: "24.1.2",
        region: "US-East-1",
        uptime: "99.99%",
        endpoints: "15,247",
        policies: "342",
        "last-sync": "2 min ago",
      },
    },
    {
      id: "identity-provider",
      type: "identity-provider",
      name: idpConfig.name,
      x: 120,
      y: 60,
      width: 200,
      height: 100,
      icon: idpConfig.icon,
      color: "bg-green-500",
      status: "active",
      vendor: idp,
      details: {
        tenant: idp === "azure-ad" ? "contoso.onmicrosoft.com" : `${idp}.domain.com`,
        users: "15,247",
        groups: "342",
        mfa: "Enabled",
        "conditional-access": "Active",
      },
    },
    {
      id: "mdm-platform",
      type: "mdm-platform",
      name: mdmConfig.name,
      x: 780,
      y: 60,
      width: 200,
      height: 100,
      icon: mdmConfig.icon,
      color: "bg-purple-500",
      status: "active",
      vendor: mdm,
      details: {
        devices: "8,542",
        policies: "67",
        compliance: "94.2%",
        "enrolled-today": "23",
        platforms: mdmConfig.platforms.join(", "),
      },
    },
    {
      id: "network-switch",
      type: "network-device",
      name: `${vendorConfig.name} Switch`,
      x: 220,
      y: 280,
      width: 180,
      height: 100,
      icon: <Router className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      vendor: vendor,
      model: vendorConfig.switch.model,
      version: vendorConfig.switch.firmware,
      details: {
        model: vendorConfig.switch.model,
        firmware: vendorConfig.switch.firmware,
        ports: vendorConfig.switch.ports,
        poe: vendorConfig.switch.poe,
        "active-ports": Math.floor(vendorConfig.switch.ports * 0.8),
        uptime: "45 days",
      },
    },
    {
      id: "wireless-controller",
      type: "network-device",
      name: `${vendorConfig.name} Wireless`,
      x: 650,
      y: 280,
      width: 180,
      height: 100,
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      vendor: vendor,
      model: vendorConfig.wireless.controller,
      version: vendorConfig.wireless.firmware,
      details: {
        controller: vendorConfig.wireless.controller,
        "ap-model": vendorConfig.wireless.ap,
        firmware: vendorConfig.wireless.firmware,
        aps: vendorConfig.wireless.aps,
        clients: "2,847",
        "avg-utilization": "34%",
      },
    },
    {
      id: "radius-proxy",
      type: "radius-proxy",
      name: "RADIUS Proxy",
      x: 450,
      y: 200,
      width: 220,
      height: 80,
      icon: <Server className="h-6 w-6" />,
      color: "bg-indigo-500",
      status: "active",
      details: {
        type: "Docker Container",
        version: "2024.1.5",
        throughput: "12K req/sec",
        latency: "1.2ms",
        "active-sessions": "1,247",
      },
    },
    {
      id: "windows-device",
      type: "endpoint",
      name: "Windows Devices",
      x: 60,
      y: 450,
      width: 160,
      height: 80,
      icon: <Monitor className="h-6 w-6" />,
      color: "bg-gray-500",
      status: "active",
      details: {
        count: "3,247",
        "os-versions": "Win 10, Win 11",
        compliance: "96.2%",
        "last-check": "5 min ago",
      },
    },
    {
      id: "mobile-device",
      type: "endpoint",
      name: "Mobile Devices",
      x: 280,
      y: 450,
      width: 160,
      height: 80,
      icon: <Smartphone className="h-6 w-6" />,
      color: "bg-pink-500",
      status: "active",
      details: {
        count: "2,847",
        platforms: "iOS, Android",
        compliance: "91.8%",
        "enrolled-today": "12",
      },
    },
    {
      id: "iot-device",
      type: "endpoint",
      name: "IoT Devices",
      x: 500,
      y: 450,
      width: 160,
      height: 80,
      icon: <Cpu className="h-6 w-6" />,
      color: "bg-yellow-500",
      status: "warning",
      details: {
        count: "1,542",
        types: "Cameras, Sensors, Printers",
        unmanaged: "247",
        "risk-score": "Medium",
      },
    },
    {
      id: "guest-device",
      type: "endpoint",
      name: "Guest Devices",
      x: 720,
      y: 450,
      width: 160,
      height: 80,
      icon: <Users className="h-6 w-6" />,
      color: "bg-indigo-500",
      status: "active",
      details: {
        count: "342",
        "active-sessions": "89",
        "avg-duration": "2.4 hours",
        "bandwidth-limit": "25 Mbps",
      },
    },
    {
      id: "firewall",
      type: "firewall",
      name: `${vendorConfig.name} Firewall`,
      x: 920,
      y: 280,
      width: 160,
      height: 100,
      icon: <Shield className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      vendor: vendor,
      model: vendorConfig.firewall.model,
      version: vendorConfig.firewall.firmware,
      details: {
        model: vendorConfig.firewall.model,
        firmware: vendorConfig.firewall.firmware,
        throughput: vendorConfig.firewall.throughput,
        "active-sessions": "15,247",
        "threat-blocks": "342/day",
      },
    },
  ]

  const generateCompleteConnections = (): Connection[] => [
    {
      from: "identity-provider",
      to: "portnox-cloud",
      type: "saml",
      protocol: idpConfig.protocols[0],
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "mdm-platform",
      to: "portnox-cloud",
      type: "https",
      protocol: "REST API",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "portnox-cloud",
      to: "radius-proxy",
      type: "radius",
      protocol: "RADIUS",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "radius-proxy",
      to: "network-switch",
      type: "radius",
      protocol: "RADIUS",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
    {
      from: "radius-proxy",
      to: "wireless-controller",
      type: "radius",
      protocol: "RADIUS",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
    {
      from: "network-switch",
      to: "windows-device",
      type: "data",
      protocol: "802.1X",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
    {
      from: "network-switch",
      to: "iot-device",
      type: "data",
      protocol: "MAB",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
    {
      from: "wireless-controller",
      to: "mobile-device",
      type: "data",
      protocol: "802.11",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "wireless-controller",
      to: "guest-device",
      type: "data",
      protocol: "Captive Portal",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "firewall",
      to: "portnox-cloud",
      type: "syslog",
      protocol: "Syslog",
      animated: true,
      bidirectional: false,
      encrypted: true,
    },
  ]

  const generateAuthenticationFlow = (): DiagramComponent[] => [
    {
      id: "user",
      type: "user",
      name: "User",
      x: 80,
      y: 250,
      width: 120,
      height: 80,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        username: "john.doe",
        department: "Engineering",
        "last-login": "2 hours ago",
      },
    },
    {
      id: "device",
      type: "device",
      name: "Device",
      x: 250,
      y: 250,
      width: 140,
      height: 80,
      icon: <Monitor className="h-6 w-6" />,
      color: "bg-gray-500",
      status: "active",
      details: {
        type: "Windows 11",
        hostname: "LAPTOP-ABC123",
        "mac-address": "00:1B:44:11:3A:B7",
        compliance: "Compliant",
      },
    },
    {
      id: "network-access",
      type: "network",
      name: `${vendorConfig.name} Switch`,
      x: 440,
      y: 250,
      width: 160,
      height: 80,
      icon: <Network className="h-6 w-6" />,
      color: "bg-orange-500",
      status: "active",
      vendor: vendor,
      details: {
        model: vendorConfig.switch.model,
        port: "GigabitEthernet1/0/12",
        vlan: "100",
        "auth-method": "802.1X",
      },
    },
    {
      id: "portnox-nac",
      type: "nac",
      name: "Portnox NAC",
      x: 650,
      y: 250,
      width: 160,
      height: 80,
      icon: <Shield className="h-6 w-6" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        region: "US-East",
        policies: "45 active",
        "response-time": "120ms",
        decision: "Allow",
      },
    },
    {
      id: "identity-source",
      type: "identity",
      name: idpConfig.name,
      x: 860,
      y: 250,
      width: 160,
      height: 80,
      icon: idpConfig.icon,
      color: "bg-green-500",
      status: "active",
      vendor: idp,
      details: {
        protocol: idpConfig.protocols[0],
        "auth-time": "85ms",
        mfa: "Required",
        result: "Success",
      },
    },
  ]

  const generateAuthenticationConnections = (): Connection[] => [
    {
      from: "user",
      to: "device",
      type: "auth",
      protocol: "Login",
      animated: true,
      bidirectional: false,
    },
    {
      from: "device",
      to: "network-access",
      type: "auth",
      protocol: "802.1X EAP-Start",
      animated: true,
      bidirectional: false,
    },
    {
      from: "network-access",
      to: "portnox-nac",
      type: "radius",
      protocol: "Access-Request",
      animated: true,
      bidirectional: false,
    },
    {
      from: "portnox-nac",
      to: "identity-source",
      type: "saml",
      protocol: idpConfig.protocols[0],
      animated: true,
      bidirectional: false,
    },
    {
      from: "identity-source",
      to: "portnox-nac",
      type: "saml",
      protocol: "Auth Response",
      animated: true,
      bidirectional: false,
    },
    {
      from: "portnox-nac",
      to: "network-access",
      type: "radius",
      protocol: "Access-Accept",
      animated: true,
      bidirectional: false,
    },
  ]

  const generatePKIComponents = (): DiagramComponent[] => [
    {
      id: "root-ca",
      type: "ca",
      name: "Root Certificate Authority",
      x: 450,
      y: 60,
      width: 200,
      height: 100,
      icon: <Lock className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      details: {
        algorithm: "RSA 4096",
        validity: "20 years",
        "serial-number": "01",
        issuer: "Corporate Root CA",
        "key-usage": "Certificate Sign, CRL Sign",
      },
    },
    {
      id: "issuing-ca",
      type: "ca",
      name: "Issuing Certificate Authority",
      x: 450,
      y: 200,
      width: 200,
      height: 100,
      icon: <Key className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        algorithm: "RSA 2048",
        validity: "5 years",
        "certificates-issued": "15,247",
        "active-certificates": "12,847",
        "revoked-certificates": "342",
      },
    },
    {
      id: "scep-server",
      type: "scep",
      name: "SCEP Server",
      x: 180,
      y: 350,
      width: 160,
      height: 100,
      icon: <Server className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        protocol: "SCEP",
        "enrollments-today": "23",
        "pending-requests": "5",
        "success-rate": "98.2%",
        url: "https://scep.company.com/certsrv/mscep/mscep.dll",
      },
    },
    {
      id: "certificate-store",
      type: "store",
      name: "Certificate Store",
      x: 720,
      y: 350,
      width: 160,
      height: 100,
      icon: <Database className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "total-certificates": "15,247",
        "user-certificates": "8,542",
        "device-certificates": "6,705",
        "expiring-soon": "47",
        "auto-renewal": "Enabled",
      },
    },
    {
      id: "client-cert",
      type: "certificate",
      name: "Client Certificates",
      x: 450,
      y: 480,
      width: 200,
      height: 80,
      icon: <ShieldCheck className="h-6 w-6" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "user-certs": "8,542",
        "device-certs": "6,705",
        "validity-period": "1 year",
        "renewal-threshold": "30 days",
        "auto-enrollment": "Enabled",
      },
    },
    {
      id: "crl-distribution",
      type: "crl",
      name: "CRL Distribution Point",
      x: 120,
      y: 200,
      width: 160,
      height: 80,
      icon: <FileText className="h-6 w-6" />,
      color: "bg-yellow-500",
      status: "active",
      details: {
        "crl-size": "2.4 MB",
        "revoked-certs": "342",
        "last-update": "6 hours ago",
        "next-update": "18 hours",
        url: "http://crl.company.com/rootca.crl",
      },
    },
  ]

  const generatePKIConnections = (): Connection[] => [
    {
      from: "root-ca",
      to: "issuing-ca",
      type: "control",
      protocol: "Certificate Signing",
      animated: true,
      bidirectional: false,
      encrypted: true,
    },
    {
      from: "root-ca",
      to: "crl-distribution",
      type: "control",
      protocol: "CRL Publishing",
      animated: true,
      bidirectional: false,
      encrypted: false,
    },
    {
      from: "issuing-ca",
      to: "scep-server",
      type: "control",
      protocol: "Certificate Issuance",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "issuing-ca",
      to: "certificate-store",
      type: "data",
      protocol: "Certificate Storage",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "scep-server",
      to: "client-cert",
      type: "data",
      protocol: "SCEP Enrollment",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "certificate-store",
      to: "client-cert",
      type: "data",
      protocol: "Certificate Retrieval",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
  ]

  const generatePolicyComponents = (): DiagramComponent[] => [
    {
      id: "policy-engine",
      type: "policy",
      name: "Portnox Policy Engine",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <ShieldCheck className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        "active-policies": "342",
        "policy-evaluations": "50K/min",
        "avg-response-time": "12ms",
        "cache-hit-rate": "94.2%",
        "last-update": "2 hours ago",
      },
    },
    {
      id: "global-policies",
      type: "policy-set",
      name: "Global Policies",
      x: 120,
      y: 280,
      width: 160,
      height: 100,
      icon: <Globe className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        count: "15",
        priority: "High",
        "applies-to": "All Sites",
        "last-modified": "3 days ago",
        categories: "Auth, Compliance, Security",
      },
    },
    {
      id: "site-policies",
      type: "policy-set",
      name: "Site-Specific Policies",
      x: 340,
      y: 280,
      width: 160,
      height: 100,
      icon: <Building className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        sites: "25",
        "total-policies": "180",
        "avg-per-site": "7.2",
        "most-common": "VLAN Assignment",
        "last-created": "1 day ago",
      },
    },
    {
      id: "user-policies",
      type: "policy-set",
      name: "User-Based Policies",
      x: 560,
      y: 280,
      width: 160,
      height: 100,
      icon: <UserCheck className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "user-groups": "47",
        "role-based": "23",
        "department-based": "18",
        "location-based": "12",
        "time-based": "8",
      },
    },
    {
      id: "device-policies",
      type: "policy-set",
      name: "Device-Based Policies",
      x: 780,
      y: 280,
      width: 160,
      height: 100,
      icon: <Monitor className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      details: {
        "device-types": "12",
        "os-based": "Windows, macOS, iOS, Android",
        "compliance-based": "34",
        "certificate-based": "28",
        "mac-based": "15",
      },
    },
    {
      id: "enforcement-point",
      type: "enforcement",
      name: "Policy Enforcement Points",
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Target className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      details: {
        switches: "150",
        "access-points": "300",
        firewalls: "25",
        "enforcement-rate": "99.8%",
        "avg-enforcement-time": "45ms",
      },
    },
  ]

  const generatePolicyConnections = (): Connection[] => [
    {
      from: "global-policies",
      to: "policy-engine",
      type: "policy",
      protocol: "Policy Rules",
      animated: true,
      bidirectional: false,
    },
    {
      from: "site-policies",
      to: "policy-engine",
      type: "policy",
      protocol: "Site Rules",
      animated: true,
      bidirectional: false,
    },
    {
      from: "user-policies",
      to: "policy-engine",
      type: "policy",
      protocol: "User Rules",
      animated: true,
      bidirectional: false,
    },
    {
      from: "device-policies",
      to: "policy-engine",
      type: "policy",
      protocol: "Device Rules",
      animated: true,
      bidirectional: false,
    },
    {
      from: "policy-engine",
      to: "enforcement-point",
      type: "control",
      protocol: "Enforcement Actions",
      animated: true,
      bidirectional: false,
    },
  ]

  const generateConnectivityComponents = (): DiagramComponent[] => [
    {
      id: "vlan-100",
      type: "vlan",
      name: "VLAN 100 - Corporate",
      x: 120,
      y: 180,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        "vlan-id": "100",
        subnet: "10.100.0.0/24",
        gateway: "10.100.0.1",
        "active-hosts": "247",
        "dhcp-pool": "10.100.0.10-10.100.0.250",
      },
    },
    {
      id: "vlan-200",
      type: "vlan",
      name: "VLAN 200 - Guest",
      x: 340,
      y: 180,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "vlan-id": "200",
        subnet: "10.200.0.0/24",
        gateway: "10.200.0.1",
        "active-hosts": "89",
        "bandwidth-limit": "25 Mbps",
      },
    },
    {
      id: "vlan-300",
      type: "vlan",
      name: "VLAN 300 - IoT",
      x: 560,
      y: 180,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-yellow-500",
      status: "active",
      details: {
        "vlan-id": "300",
        subnet: "10.300.0.0/24",
        gateway: "10.300.0.1",
        "active-hosts": "542",
        isolation: "Enabled",
      },
    },
    {
      id: "vlan-999",
      type: "vlan",
      name: "VLAN 999 - Quarantine",
      x: 780,
      y: 180,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-red-500",
      status: "warning",
      details: {
        "vlan-id": "999",
        subnet: "10.999.0.0/24",
        gateway: "10.999.0.1",
        "quarantined-hosts": "12",
        "remediation-url": "https://remediation.company.com",
      },
    },
    {
      id: "ssid-corporate",
      type: "ssid",
      name: "Corporate-WiFi",
      x: 230,
      y: 340,
      width: 160,
      height: 100,
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        ssid: "Corporate-WiFi",
        security: "WPA3-Enterprise",
        "auth-method": "802.1X",
        "connected-clients": "1,247",
        "signal-strength": "-45 dBm",
      },
    },
    {
      id: "ssid-guest",
      type: "ssid",
      name: "Guest-WiFi",
      x: 450,
      y: 340,
      width: 160,
      height: 100,
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        ssid: "Guest-WiFi",
        security: "Captive Portal",
        "auth-method": "Web Authentication",
        "connected-clients": "89",
        "session-timeout": "4 hours",
      },
    },
    {
      id: "ssid-iot",
      type: "ssid",
      name: "IoT-WiFi",
      x: 670,
      y: 340,
      width: 160,
      height: 100,
      icon: <Wifi className="h-8 w-8" />,
      color: "bg-yellow-500",
      status: "active",
      details: {
        ssid: "IoT-WiFi",
        security: "WPA2-PSK",
        "auth-method": "Pre-Shared Key",
        "connected-clients": "342",
        "bandwidth-limit": "10 Mbps",
      },
    },
  ]

  const generateConnectivityConnections = (): Connection[] => [
    {
      from: "ssid-corporate",
      to: "vlan-100",
      type: "data",
      protocol: "VLAN Mapping",
      animated: true,
      bidirectional: false,
    },
    {
      from: "ssid-guest",
      to: "vlan-200",
      type: "data",
      protocol: "VLAN Mapping",
      animated: true,
      bidirectional: false,
    },
    {
      from: "ssid-iot",
      to: "vlan-300",
      type: "data",
      protocol: "VLAN Mapping",
      animated: true,
      bidirectional: false,
    },
  ]

  const generateIntuneComponents = (): DiagramComponent[] => [
    {
      id: "intune-portal",
      type: "portal",
      name: "Microsoft Intune Portal",
      x: 450,
      y: 60,
      width: 220,
      height: 100,
      icon: <Cloud className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        tenant: "contoso.onmicrosoft.com",
        "enrolled-devices": "8,542",
        "active-policies": "67",
        "compliance-rate": "94.2%",
        "last-sync": "5 min ago",
      },
    },
    {
      id: "compliance-policies",
      type: "policies",
      name: "Device Compliance Policies",
      x: 120,
      y: 220,
      width: 180,
      height: 100,
      icon: <CheckCircle className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "total-policies": "23",
        platforms: "Windows, iOS, Android, macOS",
        "compliance-rate": "94.2%",
        "non-compliant": "495 devices",
        "grace-period": "3 days",
      },
    },
    {
      id: "configuration-profiles",
      type: "profiles",
      name: "Configuration Profiles",
      x: 380,
      y: 220,
      width: 180,
      height: 100,
      icon: <Settings className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "total-profiles": "45",
        "wifi-profiles": "12",
        "vpn-profiles": "8",
        "email-profiles": "15",
        "certificate-profiles": "10",
      },
    },
    {
      id: "certificate-profiles",
      type: "certificates",
      name: "Certificate Profiles",
      x: 640,
      y: 220,
      width: 180,
      height: 100,
      icon: <Lock className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "scep-profiles": "8",
        "pkcs-profiles": "2",
        "trusted-root": "5",
        "issued-certificates": "8,247",
        "renewal-rate": "98.5%",
      },
    },
    {
      id: "app-protection",
      type: "protection",
      name: "App Protection Policies",
      x: 900,
      y: 220,
      width: 180,
      height: 100,
      icon: <Shield className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      details: {
        "protected-apps": "25",
        "data-loss-prevention": "Enabled",
        "conditional-launch": "Active",
        "app-wrapping": "12 apps",
        "policy-violations": "23/day",
      },
    },
    {
      id: "managed-device",
      type: "device",
      name: "Managed Devices",
      x: 450,
      y: 380,
      width: 220,
      height: 100,
      icon: <Smartphone className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      details: {
        "total-devices": "8,542",
        windows: "3,247",
        ios: "2,847",
        android: "1,892",
        macos: "556",
      },
    },
  ]

  const generateIntuneConnections = (): Connection[] => [
    {
      from: "intune-portal",
      to: "compliance-policies",
      type: "control",
      protocol: "Policy Assignment",
      animated: true,
      bidirectional: false,
    },
    {
      from: "intune-portal",
      to: "configuration-profiles",
      type: "control",
      protocol: "Profile Deployment",
      animated: true,
      bidirectional: false,
    },
    {
      from: "intune-portal",
      to: "certificate-profiles",
      type: "control",
      protocol: "Certificate Deployment",
      animated: true,
      bidirectional: false,
    },
    {
      from: "intune-portal",
      to: "app-protection",
      type: "control",
      protocol: "App Policy Assignment",
      animated: true,
      bidirectional: false,
    },
    {
      from: "compliance-policies",
      to: "managed-device",
      type: "policy",
      protocol: "Compliance Check",
      animated: true,
      bidirectional: true,
    },
    {
      from: "configuration-profiles",
      to: "managed-device",
      type: "data",
      protocol: "Configuration",
      animated: true,
      bidirectional: false,
    },
    {
      from: "certificate-profiles",
      to: "managed-device",
      type: "data",
      protocol: "Certificate Installation",
      animated: true,
      bidirectional: false,
    },
    {
      from: "app-protection",
      to: "managed-device",
      type: "policy",
      protocol: "App Protection",
      animated: true,
      bidirectional: true,
    },
  ]

  const generateOnboardingComponents = (): DiagramComponent[] => [
    {
      id: "enrollment-portal",
      type: "portal",
      name: "Device Enrollment Portal",
      x: 450,
      y: 60,
      width: 220,
      height: 100,
      icon: <Globe className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        url: "https://enroll.company.com",
        "daily-enrollments": "23",
        "success-rate": "94.2%",
        "supported-platforms": "Windows, macOS, iOS, Android",
        "avg-enrollment-time": "4.2 minutes",
      },
    },
    {
      id: "device-discovery",
      type: "discovery",
      name: "Device Discovery",
      x: 180,
      y: 220,
      width: 180,
      height: 100,
      icon: <Eye className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "discovery-methods": "DHCP, DNS, Network Scan",
        "discovered-today": "47",
        "unknown-devices": "12",
        "fingerprinting-accuracy": "96.8%",
        "profiling-rules": "342",
      },
    },
    {
      id: "certificate-enrollment",
      type: "enrollment",
      name: "Certificate Enrollment",
      x: 450,
      y: 220,
      width: 180,
      height: 100,
      icon: <Key className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "enrollment-method": "SCEP",
        "certificates-issued": "23 today",
        "pending-requests": "5",
        "auto-renewal": "Enabled",
        "certificate-validity": "1 year",
      },
    },
    {
      id: "policy-assignment",
      type: "assignment",
      name: "Policy Assignment",
      x: 720,
      y: 220,
      width: 180,
      height: 100,
      icon: <Target className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "assignment-rules": "47",
        "user-based": "23",
        "device-based": "18",
        "location-based": "6",
        "auto-assignment": "89%",
      },
    },
    {
      id: "network-access",
      type: "access",
      name: "Network Access Grant",
      x: 450,
      y: 380,
      width: 220,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      details: {
        "access-granted": "8,247 devices",
        quarantined: "47 devices",
        "pending-approval": "12 devices",
        "avg-onboarding-time": "4.2 minutes",
        "success-rate": "94.2%",
      },
    },
  ]

  const generateOnboardingConnections = (): Connection[] => [
    {
      from: "enrollment-portal",
      to: "device-discovery",
      type: "control",
      protocol: "Device Registration",
      animated: true,
      bidirectional: false,
    },
    {
      from: "device-discovery",
      to: "certificate-enrollment",
      type: "data",
      protocol: "Device Information",
      animated: true,
      bidirectional: false,
    },
    {
      from: "certificate-enrollment",
      to: "policy-assignment",
      type: "data",
      protocol: "Certificate Validation",
      animated: true,
      bidirectional: false,
    },
    {
      from: "policy-assignment",
      to: "network-access",
      type: "control",
      protocol: "Access Authorization",
      animated: true,
      bidirectional: false,
    },
    {
      from: "enrollment-portal",
      to: "network-access",
      type: "control",
      protocol: "Enrollment Status",
      animated: true,
      bidirectional: true,
    },
  ]

  const generateRiskAssessmentComponents = (): DiagramComponent[] => [
    {
      id: "risk-engine",
      type: "engine",
      name: "Risk Assessment Engine",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <AlertTriangle className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      details: {
        "risk-evaluations": "15K/hour",
        "high-risk-devices": "47",
        "medium-risk-devices": "342",
        "low-risk-devices": "8,153",
        "avg-assessment-time": "250ms",
      },
    },
    {
      id: "device-health",
      type: "health",
      name: "Device Health Assessment",
      x: 120,
      y: 280,
      width: 180,
      height: 100,
      icon: <Activity className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "health-checks": "Antivirus, OS Updates, Firewall",
        "healthy-devices": "7,892",
        "unhealthy-devices": "650",
        "check-frequency": "Every 4 hours",
        "remediation-success": "87%",
      },
    },
    {
      id: "compliance-check",
      type: "compliance",
      name: "Compliance Verification",
      x: 380,
      y: 280,
      width: 180,
      height: 100,
      icon: <CheckCircle className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        "compliance-policies": "23",
        "compliant-devices": "8,047",
        "non-compliant": "495",
        "grace-period": "3 days",
        "auto-remediation": "Enabled",
      },
    },
    {
      id: "threat-detection",
      type: "threat",
      name: "Threat Detection",
      x: 640,
      y: 280,
      width: 180,
      height: 100,
      icon: <Shield className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "warning",
      details: {
        "threats-detected": "12 today",
        "malware-blocked": "8",
        "suspicious-behavior": "4",
        "false-positives": "2%",
        "response-time": "< 30 seconds",
      },
    },
    {
      id: "remediation",
      type: "remediation",
      name: "Automated Remediation",
      x: 900,
      y: 280,
      width: 180,
      height: 100,
      icon: <Settings className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "remediation-actions": "15",
        "auto-remediated": "342 today",
        "manual-intervention": "23",
        "success-rate": "87%",
        "avg-remediation-time": "12 minutes",
      },
    },
    {
      id: "quarantine-vlan",
      type: "quarantine",
      name: "Quarantine Network",
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Lock className="h-8 w-8" />,
      color: "bg-red-500",
      status: "warning",
      details: {
        "vlan-id": "999",
        "quarantined-devices": "47",
        "remediation-portal": "https://remediation.company.com",
        "avg-quarantine-time": "2.4 hours",
        "release-rate": "89%",
      },
    },
  ]

  const generateRiskAssessmentConnections = (): Connection[] => [
    {
      from: "device-health",
      to: "risk-engine",
      type: "data",
      protocol: "Health Status",
      animated: true,
      bidirectional: false,
    },
    {
      from: "compliance-check",
      to: "risk-engine",
      type: "data",
      protocol: "Compliance Status",
      animated: true,
      bidirectional: false,
    },
    {
      from: "threat-detection",
      to: "risk-engine",
      type: "data",
      protocol: "Threat Intelligence",
      animated: true,
      bidirectional: false,
    },
    {
      from: "risk-engine",
      to: "remediation",
      type: "control",
      protocol: "Remediation Trigger",
      animated: true,
      bidirectional: false,
    },
    {
      from: "risk-engine",
      to: "quarantine-vlan",
      type: "control",
      protocol: "Quarantine Action",
      animated: true,
      bidirectional: false,
    },
    {
      from: "remediation",
      to: "quarantine-vlan",
      type: "control",
      protocol: "Release Authorization",
      animated: true,
      bidirectional: false,
    },
  ]

  const generateGuestPortalComponents = (): DiagramComponent[] => [
    {
      id: "captive-portal",
      type: "portal",
      name: "Captive Portal",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <Globe className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        url: "https://guest.company.com",
        "daily-registrations": "89",
        "active-sessions": "47",
        "avg-session-duration": "2.4 hours",
        "success-rate": "96.8%",
      },
    },
    {
      id: "guest-registration",
      type: "registration",
      name: "Guest Registration",
      x: 180,
      y: 280,
      width: 180,
      height: 100,
      icon: <Users className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "registration-methods": "Email, SMS, Social",
        "self-registration": "67%",
        "sponsor-required": "33%",
        "terms-acceptance": "Required",
        "data-retention": "30 days",
      },
    },
    {
      id: "sponsor-approval",
      type: "approval",
      name: "Sponsor Approval",
      x: 450,
      y: 280,
      width: 180,
      height: 100,
      icon: <CheckCircle className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "approval-required": "33% of guests",
        "avg-approval-time": "12 minutes",
        "auto-approval": "After hours",
        "sponsor-notifications": "Email, SMS",
        "approval-rate": "94%",
      },
    },
    {
      id: "guest-vlan",
      type: "vlan",
      name: "Guest Network",
      x: 720,
      y: 280,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "vlan-id": "200",
        subnet: "10.200.0.0/24",
        "bandwidth-limit": "25 Mbps",
        "session-timeout": "4 hours",
        isolation: "Enabled",
      },
    },
    {
      id: "internet-access",
      type: "internet",
      name: "Internet Access",
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Globe className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      details: {
        "content-filtering": "Enabled",
        "blocked-categories": "Social Media, Gaming, Adult",
        "allowed-sites": "Company Portal, Help Desk",
        "bandwidth-per-user": "25 Mbps",
        "concurrent-sessions": "47",
      },
    },
  ]

  const generateGuestPortalConnections = (): Connection[] => [
    {
      from: "captive-portal",
      to: "guest-registration",
      type: "control",
      protocol: "Registration Flow",
      animated: true,
      bidirectional: false,
    },
    {
      from: "guest-registration",
      to: "sponsor-approval",
      type: "data",
      protocol: "Approval Request",
      animated: true,
      bidirectional: false,
    },
    {
      from: "sponsor-approval",
      to: "guest-vlan",
      type: "control",
      protocol: "Access Grant",
      animated: true,
      bidirectional: false,
    },
    {
      from: "guest-vlan",
      to: "internet-access",
      type: "data",
      protocol: "Internet Traffic",
      animated: true,
      bidirectional: true,
    },
    {
      from: "captive-portal",
      to: "internet-access",
      type: "control",
      protocol: "Session Management",
      animated: true,
      bidirectional: true,
    },
  ]

  const generateIoTOnboardingComponents = (): DiagramComponent[] => [
    {
      id: "iot-discovery",
      type: "discovery",
      name: "IoT Device Discovery",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <Eye className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        "discovery-methods": "DHCP Fingerprinting, Network Scan, LLDP",
        "discovered-today": "23",
        "device-types": "Cameras, Sensors, Printers, Controllers",
        "unknown-devices": "5",
        "profiling-accuracy": "94.2%",
      },
    },
    {
      id: "device-profiling",
      type: "profiling",
      name: "Device Profiling",
      x: 180,
      y: 280,
      width: 180,
      height: 100,
      icon: <Cpu className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "profiling-rules": "1,247",
        "device-categories": "47",
        "vendor-identification": "89%",
        "behavioral-analysis": "Enabled",
        "ml-classification": "Active",
      },
    },
    {
      id: "mac-authentication",
      type: "auth",
      name: "MAC Authentication Bypass",
      x: 450,
      y: 280,
      width: 180,
      height: 100,
      icon: <Key className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "auth-method": "MAB",
        "mac-whitelist": "1,542 entries",
        "auto-approval": "Based on profiling",
        "manual-approval": "Unknown devices",
        "success-rate": "96.8%",
      },
    },
    {
      id: "iot-vlan",
      type: "vlan",
      name: "IoT Network Segment",
      x: 720,
      y: 280,
      width: 180,
      height: 100,
      icon: <Network className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "vlan-id": "300",
        subnet: "10.300.0.0/24",
        "device-isolation": "Enabled",
        "micro-segmentation": "Active",
        "connected-devices": "1,542",
      },
    },
    {
      id: "iot-policies",
      type: "policies",
      name: "IoT Security Policies",
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Shield className="h-8 w-8" />,
      color: "bg-red-500",
      status: "active",
      details: {
        "security-policies": "23",
        "traffic-restrictions": "Enabled",
        "communication-rules": "Device-to-cloud only",
        "anomaly-detection": "Active",
        "threat-monitoring": "24/7",
      },
    },
  ]

  const generateIoTOnboardingConnections = (): Connection[] => [
    {
      from: "iot-discovery",
      to: "device-profiling",
      type: "data",
      protocol: "Device Fingerprint",
      animated: true,
      bidirectional: false,
    },
    {
      from: "device-profiling",
      to: "mac-authentication",
      type: "data",
      protocol: "Device Classification",
      animated: true,
      bidirectional: false,
    },
    {
      from: "mac-authentication",
      to: "iot-vlan",
      type: "control",
      protocol: "VLAN Assignment",
      animated: true,
      bidirectional: false,
    },
    {
      from: "iot-vlan",
      to: "iot-policies",
      type: "policy",
      protocol: "Security Enforcement",
      animated: true,
      bidirectional: false,
    },
    {
      from: "iot-discovery",
      to: "iot-policies",
      type: "control",
      protocol: "Policy Application",
      animated: true,
      bidirectional: false,
    },
  ]

  const generateRadSecProxyComponents = (): DiagramComponent[] => [
    {
      id: "radsec-proxy",
      type: "proxy",
      name: "RADSEC Proxy",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <Server className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        version: "2024.1.5",
        "tls-version": "1.3",
        "certificate-validation": "Enabled",
        throughput: "15K req/sec",
        "active-connections": "247",
      },
    },
    {
      id: "local-radius",
      type: "radius",
      name: "Local RADIUS Server",
      x: 180,
      y: 280,
      width: 180,
      height: 100,
      icon: <Database className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        type: "FreeRADIUS",
        version: "3.2.3",
        "local-users": "247",
        "shared-secrets": "Configured",
        accounting: "Enabled",
      },
    },
    {
      id: "cloud-radius",
      type: "radius",
      name: "Portnox Cloud RADIUS",
      x: 720,
      y: 280,
      width: 180,
      height: 100,
      icon: <Cloud className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        region: "US-East-1",
        "load-balancing": "Active",
        failover: "Automatic",
        "response-time": "45ms",
        availability: "99.99%",
      },
    },
    {
      id: "tls-encryption",
      type: "encryption",
      name: "TLS Encryption Layer",
      x: 450,
      y: 280,
      width: 180,
      height: 100,
      icon: <Lock className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "tls-version": "1.3",
        "cipher-suite": "AES-256-GCM",
        "certificate-authority": "Internal CA",
        "key-rotation": "90 days",
        "perfect-forward-secrecy": "Enabled",
      },
    },
    {
      id: "network-devices",
      type: "devices",
      name: `${vendorConfig.name} Network Devices`,
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Router className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      vendor: vendor,
      details: {
        switches: "150",
        "access-points": "300",
        "radsec-support": "Native",
        "shared-secrets": "Not required",
        "certificate-auth": "Enabled",
      },
    },
  ]

  const generateRadSecProxyConnections = (): Connection[] => [
    {
      from: "local-radius",
      to: "radsec-proxy",
      type: "radius",
      protocol: "RADIUS",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
    {
      from: "radsec-proxy",
      to: "tls-encryption",
      type: "control",
      protocol: "TLS Handshake",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "tls-encryption",
      to: "cloud-radius",
      type: "radius",
      protocol: "RADSEC",
      animated: true,
      bidirectional: true,
      encrypted: true,
    },
    {
      from: "radsec-proxy",
      to: "network-devices",
      type: "radius",
      protocol: "RADIUS",
      animated: true,
      bidirectional: true,
      encrypted: false,
    },
  ]

  const generateTACACSComponents = (): DiagramComponent[] => [
    {
      id: "tacacs-server",
      type: "tacacs",
      name: "TACACS+ Server",
      x: 450,
      y: 120,
      width: 220,
      height: 100,
      icon: <Database className="h-8 w-8" />,
      color: "bg-blue-500",
      status: "active",
      details: {
        version: "TACACS+ v1.78",
        "admin-sessions": "23 active",
        "command-authorization": "Enabled",
        accounting: "Full",
        "shared-secret": "Configured",
      },
    },
    {
      id: "network-admin",
      type: "admin",
      name: "Network Administrators",
      x: 120,
      y: 280,
      width: 180,
      height: 100,
      icon: <Users className="h-8 w-8" />,
      color: "bg-green-500",
      status: "active",
      details: {
        "admin-users": "23",
        "privilege-levels": "1, 7, 15",
        "active-sessions": "8",
        "mfa-required": "Yes",
        "session-timeout": "30 minutes",
      },
    },
    {
      id: "command-authorization",
      type: "authorization",
      name: "Command Authorization",
      x: 450,
      y: 280,
      width: 180,
      height: 100,
      icon: <Key className="h-8 w-8" />,
      color: "bg-orange-500",
      status: "active",
      details: {
        "authorization-rules": "247",
        "command-sets": "15",
        "privilege-mapping": "Role-based",
        "denied-commands": "12/day",
        "approval-required": "Critical commands",
      },
    },
    {
      id: "audit-logging",
      type: "logging",
      name: "Audit & Accounting",
      x: 780,
      y: 280,
      width: 180,
      height: 100,
      icon: <Activity className="h-8 w-8" />,
      color: "bg-purple-500",
      status: "active",
      details: {
        "log-retention": "7 years",
        "commands-logged": "All",
        "session-recording": "Enabled",
        "siem-integration": "Active",
        "compliance-reports": "Monthly",
      },
    },
    {
      id: "managed-devices",
      type: "devices",
      name: `${vendorConfig.name} Managed Devices`,
      x: 450,
      y: 440,
      width: 220,
      height: 100,
      icon: <Router className="h-8 w-8" />,
      color: "bg-cyan-500",
      status: "active",
      vendor: vendor,
      details: {
        switches: "150",
        routers: "47",
        firewalls: "23",
        "tacacs-clients": "220",
        "device-groups": "12",
      },
    },
  ]

  const generateTACACSConnections = (): Connection[] => [
    {
      from: "network-admin",
      to: "tacacs-server",
      type: "tacacs",
      protocol: "TACACS+ Authentication",
      animated: true,
      bidirectional: false,
    },
    {
      from: "tacacs-server",
      to: "command-authorization",
      type: "control",
      protocol: "Authorization Request",
      animated: true,
      bidirectional: true,
    },
    {
      from: "tacacs-server",
      to: "audit-logging",
      type: "data",
      protocol: "Accounting Data",
      animated: true,
      bidirectional: false,
    },
    {
      from: "command-authorization",
      to: "managed-devices",
      type: "control",
      protocol: "Command Execution",
      animated: true,
      bidirectional: false,
    },
    {
      from: "managed-devices",
      to: "tacacs-server",
      type: "tacacs",
      protocol: "TACACS+ Request",
      animated: true,
      bidirectional: true,
    },
  ]

  const getConnectionPath = (from: DiagramComponent, to: DiagramComponent): string => {
    const fromX = from.x + from.width / 2
    const fromY = from.y + from.height / 2
    const toX = to.x + to.width / 2
    const toY = to.y + to.height / 2

    // Create a curved path for better visual appeal
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const offset = Math.abs(fromX - toX) > Math.abs(fromY - toY) ? 30 : 20

    return `M ${fromX} ${fromY} Q ${midX} ${midY - offset} ${toX} ${toY}`
  }

  const getConnectionColor = (type: string): string => {
    switch (type) {
      case "auth":
        return "#10b981" // green
      case "data":
        return "#3b82f6" // blue
      case "control":
        return "#f59e0b" // amber
      case "policy":
        return "#8b5cf6" // violet
      case "radius":
        return "#00c8d7" // cyan
      case "saml":
        return "#059669" // emerald
      case "ldap":
        return "#0078d4" // blue
      case "tacacs":
        return "#dc2626" // red
      case "https":
        return "#16a34a" // green
      case "syslog":
        return "#7c3aed" // purple
      default:
        return "#6b7280" // gray
    }
  }

  const handleComponentClick = (componentId: string) => {
    setSelectedComponent(componentId === selectedComponent ? null : componentId)
  }

  const handleComponentHover = (componentId: string | null) => {
    setHoveredComponent(componentId)
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case "active":
        return "border-green-500"
      case "warning":
        return "border-yellow-500"
      case "error":
        return "border-red-500"
      case "inactive":
        return "border-gray-400"
      default:
        return "border-blue-500"
    }
  }

  const selectedComponentData = components.find((c) => c.id === selectedComponent)

  return (
    <div className="relative w-full h-full min-h-[700px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Main SVG Diagram */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1200 600"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </pattern>
          {/* Arrow markers for connections */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        {showConnections &&
          connections.map((connection, index) => {
            const fromComponent = components.find((c) => c.id === connection.from)
            const toComponent = components.find((c) => c.id === connection.to)

            if (!fromComponent || !toComponent) return null

            const path = getConnectionPath(fromComponent, toComponent)
            const color = getConnectionColor(connection.type)

            return (
              <g key={index}>
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={connection.animated && isAnimationActive ? "5,5" : "none"}
                  opacity={0.7}
                  markerEnd={!connection.bidirectional ? "url(#arrowhead)" : "none"}
                >
                  {connection.animated && isAnimationActive && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-10"
                      dur={`${2 / animationSpeed}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </path>
                {connection.bidirectional && (
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity={0.5}
                    markerStart="url(#arrowhead)"
                    markerEnd="url(#arrowhead)"
                  />
                )}
                {/* Connection label */}
                {showLabels && connection.protocol && (
                  <text
                    x={(fromComponent.x + fromComponent.width / 2 + toComponent.x + toComponent.width / 2) / 2}
                    y={(fromComponent.y + fromComponent.height / 2 + toComponent.y + toComponent.height / 2) / 2 - 5}
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="10"
                    className="pointer-events-none"
                  >
                    <tspan className="bg-white bg-opacity-75 px-1 rounded">{connection.protocol}</tspan>
                  </text>
                )}
              </g>
            )
          })}

        {/* Components */}
        {components.map((component) => (
          <g key={component.id}>
            <rect
              x={component.x}
              y={component.y}
              width={component.width}
              height={component.height}
              rx="8"
              fill="white"
              stroke={
                selectedComponent === component.id
                  ? "#3b82f6"
                  : hoveredComponent === component.id
                    ? "#6b7280"
                    : "#e5e7eb"
              }
              strokeWidth={selectedComponent === component.id ? "3" : "2"}
              className={`cursor-pointer transition-all duration-200 ${getStatusColor(component.status)}`}
              onClick={() => handleComponentClick(component.id)}
              onMouseEnter={() => handleComponentHover(component.id)}
              onMouseLeave={() => handleComponentHover(null)}
            />

            {/* Vendor indicator */}
            {component.vendor && (
              <rect
                x={component.x + component.width - 25}
                y={component.y + 8}
                width="18"
                height="18"
                rx="3"
                fill={vendorConfigs[component.vendor as keyof typeof vendorConfigs]?.color || "#6b7280"}
                opacity="0.8"
              />
            )}

            {/* Component Icon and Text */}
            <foreignObject
              x={component.x + 12}
              y={component.y + 12}
              width={component.width - 24}
              height={component.height - 24}
              className="pointer-events-none"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`p-3 rounded-lg ${component.color} text-white mb-3`}>{component.icon}</div>
                {showLabels && (
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight px-2">
                    {component.name}
                  </div>
                )}
                {component.status && (
                  <div className="mt-2">
                    <Badge
                      variant={
                        component.status === "active"
                          ? "default"
                          : component.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {component.status}
                    </Badge>
                  </div>
                )}
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>

      {/* Component Details Panel */}
      {selectedComponentData && (
        <div className="absolute top-4 left-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-20 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${selectedComponentData.color} text-white`}>
                {selectedComponentData.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{selectedComponentData.name}</h3>
                <p className="text-xs text-gray-500 capitalize">{selectedComponentData.type}</p>
                {selectedComponentData.vendor && (
                  <p className="text-xs text-gray-400">
                    {vendorConfigs[selectedComponentData.vendor as keyof typeof vendorConfigs]?.name}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(null)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>

          {selectedComponentData.details && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm border-b pb-1">Component Details</h4>
              {Object.entries(selectedComponentData.details).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key
                      .replace(/[-_]/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                    :
                  </span>
                  <span className="font-medium text-right max-w-48 truncate" title={String(value)}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <Badge
                variant={
                  selectedComponentData.status === "active"
                    ? "default"
                    : selectedComponentData.status === "warning"
                      ? "secondary"
                      : "destructive"
                }
              >
                {selectedComponentData.status || "Unknown"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* View Information */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 z-10">
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            {currentView?.icon}
            <span className="font-medium">{currentView?.name}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-400">{components.length} components</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-400">{connections.length} connections</span>
          <span className="text-gray-400">•</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendorConfig.color }} />
            <span className="text-gray-600 dark:text-gray-400">{vendorConfig.name}</span>
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-10">
        <Button variant="outline" size="sm" onClick={toggleAnimation} className="bg-white dark:bg-gray-800">
          {isAnimationActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={resetView} className="bg-white dark:bg-gray-800">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
