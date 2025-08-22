"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  Settings,
  Activity,
  BarChart3,
  Zap,
  Target,
  Wifi,
  Shield,
  Lock,
  Users,
  Server,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Network,
  Router,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Cpu,
  HardDrive,
  MemoryStick,
  Signal,
  Key,
  Eye,
  Building,
  Search,
  GitBranch,
  Layers3,
  Radio,
  Satellite,
  Cable,
  Workflow,
  FileKey,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  Scan,
  Radar,
  Factory,
  GraduationCap,
  ShoppingBag,
  Heart,
  Landmark,
  Building2,
  Minimize2,
  Maximize2,
  X,
  Layers,
  Download,
  Sliders,
  ZoomIn,
  ZoomOut,
  Save,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface DiagramComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  width: number
  height: number
  status: "online" | "offline" | "warning" | "error" | "maintenance"
  category: "cloud" | "network" | "security" | "endpoint" | "identity" | "management" | "application" | "connectivity"
  metrics?: {
    cpu?: number
    memory?: number
    network?: number
    connections?: number
    throughput?: string
    latency?: number
    uptime?: number
    users?: number
    sessions?: number
    requests?: number
    bandwidth?: string
    packetLoss?: number
    jitter?: number
    availability?: number
    responseTime?: number
    errorRate?: number
    securityScore?: number
    complianceScore?: number
    riskScore?: number
    threatLevel?: string
    vulnerabilities?: number
    patches?: number
    certificates?: number
    policies?: number
    violations?: number
    incidents?: number
  }
  connections: string[]
  icon: string
  color: string
  description: string
  vendor?: string
  model?: string
  version?: string
  location?: string
  ipAddress?: string
  macAddress?: string
  serialNumber?: string
  firmwareVersion?: string
  lastUpdate?: string
  supportContract?: string
  warrantyExpiry?: string
  isDragging?: boolean
  isSelected?: boolean
  isHovered?: boolean
}

interface Connection {
  id: string
  from: string
  to: string
  type:
    | "ethernet"
    | "fiber"
    | "wireless"
    | "vpn"
    | "radius"
    | "api"
    | "tunnel"
    | "saml"
    | "oidc"
    | "https"
    | "tacacs"
    | "radsec"
    | "expressroute"
    | "sdwan"
    | "mpls"
    | "internet"
    | "leased_line"
    | "satellite"
  status: "active" | "inactive" | "error" | "congested" | "degraded"
  protocol: string
  port?: number
  throughput?: string
  latency?: number
  encryption?: boolean
  bandwidth?: string
  packetLoss?: number
  jitter?: number
  label?: string
  bidirectional?: boolean
  redundancy?: boolean
  priority?: "low" | "medium" | "high" | "critical"
  qos?: string
  sla?: {
    uptime: number
    latency: number
    bandwidth: string
    support: string
  }
  cost?: {
    monthly: number
    setup: number
    currency: string
  }
  provider?: string
  circuitId?: string
  contractExpiry?: string
  isSelected?: boolean
  isHovered?: boolean
  pathData?: string
  animationOffset?: number
}

interface ArchitectureConfig {
  selectedSite?: string
  industry: string
  deployment: string
  connectivity: string[]
  wiredVendor: string
  wirelessVendor: string
  firewallVendor: string
  identityProvider: string[]
  mdmProvider: string[]
  radiusType: string
  deviceAdmin: string
  authTypes: string[]
  deviceTypes: string[]
  complianceFrameworks: string[]
  securityFeatures: string[]
  networkSegmentation: boolean
  guestAccess: boolean
  iotSupport: boolean
  cloudIntegration: boolean
  onPremiseIntegration: boolean
  hybridDeployment: boolean
  animations: boolean
  showMetrics: boolean
  showConnections: boolean
  animationSpeed: number
  zoomLevel: number
  selectedView: string
  customColors: {
    primary: string
    secondary: string
    accent: string
  }
}

const COMPONENT_ICONS = {
  cloud: Cloud,
  server: Server,
  network: Network,
  router: Router,
  wifi: Wifi,
  shield: Shield,
  lock: Lock,
  users: Users,
  smartphone: Smartphone,
  monitor: Monitor,
  database: Database,
  globe: Globe,
  activity: Activity,
  settings: Settings,
  "check-circle": CheckCircle,
  "alert-triangle": AlertTriangle,
  "x-circle": XCircle,
  zap: Zap,
  target: Target,
  "bar-chart-3": BarChart3,
  "trending-up": TrendingUp,
  cpu: Cpu,
  "hard-drive": HardDrive,
  "memory-stick": MemoryStick,
  signal: Signal,
  key: Key,
  eye: Eye,
  building: Building,
  search: Search,
  "git-branch": GitBranch,
  layers3: Layers3,
  radio: Radio,
  satellite: Satellite,
  cable: Cable,
  workflow: Workflow,
  "file-key": FileKey,
  "user-check": UserCheck,
  "shield-check": ShieldCheck,
  fingerprint: Fingerprint,
  scan: Scan,
  radar: Radar,
  factory: Factory,
  "graduation-cap": GraduationCap,
  "shopping-bag": ShoppingBag,
  heart: Heart,
  landmark: Landmark,
  "building-2": Building2,
}

const VENDOR_OPTIONS = {
  wired: [
    {
      value: "cisco",
      label: "Cisco Systems",
      color: "#1BA0D7",
      models: ["Catalyst 9300", "Catalyst 9400", "Catalyst 9500", "Nexus 9000"],
    },
    { value: "aruba", label: "Aruba (HPE)", color: "#FF6900", models: ["CX 6200", "CX 6300", "CX 6400", "CX 8400"] },
    {
      value: "juniper",
      label: "Juniper Networks",
      color: "#84BD00",
      models: ["EX4300", "EX4400", "EX4600", "QFX5100"],
    },
    { value: "extreme", label: "Extreme Networks", color: "#00A651", models: ["X440", "X450", "X460", "X670"] },
    { value: "dell", label: "Dell Technologies", color: "#007DB8", models: ["N1500", "N2000", "N3000", "N4000"] },
  ],
  wireless: [
    {
      value: "cisco",
      label: "Cisco Systems",
      color: "#1BA0D7",
      models: ["Catalyst 9100", "Catalyst 9115", "Catalyst 9120", "Catalyst 9130"],
    },
    { value: "aruba", label: "Aruba (HPE)", color: "#FF6900", models: ["AP-515", "AP-535", "AP-555", "AP-635"] },
    { value: "ruckus", label: "Ruckus (CommScope)", color: "#FF6B00", models: ["R350", "R550", "R650", "R750"] },
    { value: "meraki", label: "Cisco Meraki", color: "#58C4DC", models: ["MR36", "MR46", "MR56", "MR86"] },
    { value: "mist", label: "Mist (Juniper)", color: "#41B883", models: ["AP21", "AP33", "AP43", "AP63"] },
  ],
  firewall: [
    {
      value: "palo_alto",
      label: "Palo Alto Networks",
      color: "#FA582D",
      models: ["PA-220", "PA-850", "PA-3220", "PA-5220"],
    },
    {
      value: "fortinet",
      label: "Fortinet",
      color: "#EE3124",
      models: ["FortiGate 60F", "FortiGate 100F", "FortiGate 600E", "FortiGate 1500D"],
    },
    { value: "checkpoint", label: "Check Point", color: "#FF6B35", models: ["1490", "3200", "5600", "15600"] },
    {
      value: "cisco",
      label: "Cisco ASA/FTD",
      color: "#1BA0D7",
      models: ["ASA 5508-X", "ASA 5516-X", "FTD 2110", "FTD 4112"],
    },
    { value: "juniper", label: "Juniper SRX", color: "#84BD00", models: ["SRX300", "SRX550", "SRX1500", "SRX4600"] },
  ],
  identity: [
    {
      value: "azure_ad",
      label: "Azure Active Directory",
      color: "#0078D4",
      features: ["SSO", "MFA", "Conditional Access", "Identity Protection"],
    },
    {
      value: "active_directory",
      label: "Active Directory",
      color: "#0078D4",
      features: ["LDAP", "Kerberos", "Group Policy", "Certificate Services"],
    },
    {
      value: "okta",
      label: "Okta",
      color: "#007DC1",
      features: ["Universal Directory", "Adaptive MFA", "Lifecycle Management", "API Access"],
    },
    {
      value: "ping",
      label: "Ping Identity",
      color: "#0066CC",
      features: ["PingFederate", "PingAccess", "PingDirectory", "PingOne"],
    },
    {
      value: "google",
      label: "Google Workspace",
      color: "#4285F4",
      features: ["Cloud Identity", "SSO", "2-Step Verification", "Admin Console"],
    },
    {
      value: "aws_sso",
      label: "AWS SSO",
      color: "#FF9900",
      features: ["Permission Sets", "Account Assignment", "External IdP", "Access Portal"],
    },
  ],
  mdm: [
    { value: "intune", label: "Microsoft Intune", color: "#00BCF2", platforms: ["Windows", "iOS", "Android", "macOS"] },
    { value: "jamf", label: "Jamf Pro", color: "#4A90E2", platforms: ["macOS", "iOS", "iPadOS", "tvOS"] },
    {
      value: "workspace_one",
      label: "VMware Workspace ONE",
      color: "#607078",
      platforms: ["Windows", "iOS", "Android", "macOS", "Chrome OS"],
    },
    { value: "mobileiron", label: "MobileIron", color: "#0066CC", platforms: ["Windows", "iOS", "Android", "macOS"] },
    {
      value: "airwatch",
      label: "AirWatch",
      color: "#607078",
      platforms: ["Windows", "iOS", "Android", "macOS", "Windows Phone"],
    },
  ],
}

const STATUS_COLORS = {
  online: "#10B981",
  offline: "#6B7280",
  warning: "#F59E0B",
  error: "#EF4444",
  maintenance: "#8B5CF6",
}

const CONNECTION_COLORS = {
  ethernet: "#9CA3AF",
  fiber: "#64748B",
  wireless: "#A78BFA",
  vpn: "#F472B6",
  radius: "#F87171",
  api: "#6EE7B7",
  tunnel: "#FBBF24",
  saml: "#60A5FA",
  oidc: "#38BDF8",
  https: "#A3E635",
  tacacs: "#FB7185",
  radsec: "#9333EA",
}

const ARCHITECTURE_VIEWS = [
  {
    id: "complete",
    name: "Complete Architecture",
    description: "Full network architecture with all components",
    icon: Layers,
  },
  {
    id: "authentication",
    name: "Authentication Flow",
    description: "User and device authentication workflows",
    icon: Lock,
  },
  {
    id: "pki",
    name: "PKI & Certificate Management",
    description: "Certificate authority hierarchy and PKI",
    icon: Shield,
  },
  {
    id: "policies",
    name: "Access Control Policies",
    description: "Policy engine and enforcement mechanisms",
    icon: Settings,
  },
  {
    id: "connectivity",
    name: "Connectivity Options",
    description: "WAN, LAN, cloud, and hybrid connectivity",
    icon: Network,
  },
  {
    id: "intune",
    name: "Microsoft Intune Integration",
    description: "Intune MDM integration and device compliance",
    icon: Smartphone,
  },
  {
    id: "jamf",
    name: "Jamf Pro Integration",
    description: "Jamf Pro MDM integration for Apple devices",
    icon: Monitor,
  },
  { id: "onboarding", name: "Device Onboarding", description: "Automated device registration workflows", icon: Users },
  { id: "radsec", name: "RADSEC Proxy Architecture", description: "RADIUS over TLS proxy deployment", icon: Router },
  { id: "ztna", name: "Zero Trust Network Access", description: "ZTNA gateway and micro-segmentation", icon: Globe },
  { id: "guest", name: "Guest Portal & Access", description: "Guest access management and captive portal", icon: Wifi },
  {
    id: "iot",
    name: "IoT Device Onboarding",
    description: "IoT device discovery and automated onboarding",
    icon: Activity,
  },
  {
    id: "tacacs",
    name: "TACACS+ Administration",
    description: "Network device administration with TACACS+",
    icon: Server,
  },
  {
    id: "risk",
    name: "Risk Assessment & Analytics",
    description: "Risk-based access control and threat assessment",
    icon: BarChart3,
  },
  {
    id: "multisite",
    name: "Multi-Site Deployment",
    description: "Enterprise multi-location architecture",
    icon: Building,
  },
  { id: "cloud", name: "Cloud Integration", description: "Multi-cloud services integration", icon: Globe },
  { id: "wireless", name: "Wireless Infrastructure", description: "Wireless network architecture", icon: Wifi },
  { id: "wired", name: "Wired Infrastructure", description: "Wired network infrastructure", icon: Network },
]

interface InteractiveDiagramProps {
  config: ArchitectureConfig
  onConfigUpdate?: (updates: Partial<ArchitectureConfig>) => void
  showControls?: boolean
  isFullscreen?: boolean
}

export default function InteractiveDiagram({
  config,
  onConfigUpdate,
  showControls = true,
  isFullscreen = false,
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [components, setComponents] = useState<DiagramComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedComponent, setSelectedComponent] = useState<DiagramComponent | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [animationActive, setAnimationActive] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [showMetrics, setShowMetrics] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState([50])
  const [dataFlowAnimation, setDataFlowAnimation] = useState(0)
  const [metricsUpdateInterval, setMetricsUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  const [interactionMode, setInteractionMode] = useState<"select" | "pan" | "connect" | "edit">("select")
  const [showGrid, setShowGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "pdf">("png")
  const [selectedIndustry, setSelectedIndustry] = useState("healthcare")
  const [selectedDeployment, setSelectedDeployment] = useState("hybrid")
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("global")
  const [showQuickControls, setShowQuickControls] = useState(true)
  const [showComponentPalette, setShowComponentPalette] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [selectedView, setSelectedView] = useState("complete")

  // Configuration state with defaults
  const [localConfig, setLocalConfig] = useState<ArchitectureConfig>({
    industry: "healthcare",
    deployment: "hybrid",
    connectivity: ["wired", "wireless"],
    wiredVendor: "cisco",
    wirelessVendor: "aruba",
    firewallVendor: "palo_alto",
    identityProvider: ["azure_ad"],
    mdmProvider: ["intune"],
    radiusType: "proxy",
    deviceAdmin: "radius",
    authTypes: ["802.1x", "certificate"],
    deviceTypes: ["windows", "ios", "android", "macos"],
    complianceFrameworks: ["hipaa"],
    securityFeatures: ["mfa", "conditional_access"],
    networkSegmentation: true,
    guestAccess: true,
    iotSupport: true,
    cloudIntegration: true,
    onPremiseIntegration: true,
    hybridDeployment: true,
    animations: true,
    showMetrics: true,
    showConnections: true,
    animationSpeed: 50,
    zoomLevel: 100,
    selectedView: "complete",
    customColors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
    },
    ...config,
  })

  // Initialize on mount
  useEffect(() => {
    console.log("InteractiveDiagram mounted, initializing...")
    generateArchitecture()

    // Start animations
    if (localConfig.animations) {
      const interval = setInterval(() => {
        updateMetrics()
        setDataFlowAnimation((prev) => (prev + 1) % 100)
      }, 2000)
      setMetricsUpdateInterval(interval)
      return () => clearInterval(interval)
    }
  }, [])

  // Regenerate when view changes
  useEffect(() => {
    console.log("View changed to:", selectedView)
    generateArchitecture()
  }, [selectedView, localConfig.wiredVendor, localConfig.wirelessVendor, localConfig.firewallVendor])

  const updateConfig = (updates: Partial<ArchitectureConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    if (onConfigUpdate) {
      onConfigUpdate(updates)
    }
  }

  const generateArchitecture = useCallback(() => {
    console.log("Generating architecture for view:", selectedView)
    const newComponents: DiagramComponent[] = []
    const newConnections: Connection[] = []

    // Always generate some components to ensure something shows
    switch (selectedView) {
      case "complete":
        generateCompleteArchitecture(newComponents, newConnections, localConfig)
        break
      case "authentication":
        generateAuthenticationFlow(newComponents, newConnections, localConfig)
        break
      case "pki":
        generatePKIArchitecture(newComponents, newConnections, localConfig)
        break
      case "policies":
        generatePolicyArchitecture(newComponents, newConnections, localConfig)
        break
      case "connectivity":
        generateConnectivityArchitecture(newComponents, newConnections, localConfig)
        break
      case "intune":
        generateIntuneIntegration(newComponents, newConnections, localConfig)
        break
      case "jamf":
        generateJamfIntegration(newComponents, newConnections, localConfig)
        break
      case "onboarding":
        generateDeviceOnboarding(newComponents, newConnections, localConfig)
        break
      case "radsec":
        generateRadSecProxyArchitecture(newComponents, newConnections, localConfig)
        break
      case "ztna":
        generateZTNAArchitecture(newComponents, newConnections, localConfig)
        break
      case "guest":
        generateGuestPortal(newComponents, newConnections, localConfig)
        break
      case "iot":
        generateIoTOnboarding(newComponents, newConnections, localConfig)
        break
      case "tacacs":
        generateTACACSArchitecture(newComponents, newConnections, localConfig)
        break
      case "risk":
        generateRiskPolicyArchitecture(newComponents, newConnections, localConfig)
        break
      case "multisite":
        generateMultiSiteArchitecture(newComponents, newConnections, localConfig)
        break
      case "cloud":
        generateCloudIntegration(newComponents, newConnections, localConfig)
        break
      case "wireless":
        generateWirelessInfrastructure(newComponents, newConnections, localConfig)
        break
      case "wired":
        generateWiredInfrastructure(newComponents, newConnections, localConfig)
        break
      default:
        generateCompleteArchitecture(newComponents, newConnections, localConfig)
    }

    console.log(`Generated ${newComponents.length} components and ${newConnections.length} connections`)
    setComponents(newComponents)
    setConnections(newConnections)
  }, [selectedView, localConfig])

  // COMPLETE ARCHITECTURE GENERATOR
  const generateCompleteArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Portnox Cloud Platform - Central hub
    components.push({
      id: "portnox-cloud-platform",
      type: "nac_platform",
      name: "Portnox Cloud NAC Platform",
      x: 600,
      y: 100,
      width: 300,
      height: 120,
      status: "online",
      category: "cloud",
      metrics: {
        connections: 15847,
        throughput: "12.8 Gbps",
        latency: 8,
        uptime: 99.98,
        cpu: 42,
        memory: 68,
        users: 12500,
        sessions: 8950,
        requests: 2850000,
        securityScore: 98,
        complianceScore: 96,
        policies: 156,
        violations: 3,
        incidents: 0,
      },
      connections: [
        "azure-ad-tenant",
        "intune-mdm",
        "ztna-gateway",
        "policy-engine",
        "radsec-proxy-primary",
        "certificate-authority",
      ],
      icon: "cloud",
      color: config.customColors.primary,
      description: `Multi-tenant cloud NAC platform optimized for ${selectedIndustry} with comprehensive compliance`,
      vendor: "portnox",
      version: "v6.5.2",
    })

    // Azure AD Identity Provider
    components.push({
      id: "azure-ad-tenant",
      type: "identity_provider",
      name: "Azure Active Directory",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      status: "online",
      category: "identity",
      metrics: {
        users: 12500,
        sessions: 8950,
        uptime: 99.97,
        latency: 15,
        securityScore: 94,
        policies: 45,
        violations: 2,
      },
      connections: ["portnox-cloud-platform", "conditional-access", "intune-mdm", "ztna-gateway"],
      icon: "users",
      color: "#0078D4",
      description: "Enterprise identity platform with conditional access and MFA",
      vendor: "microsoft",
      version: "2024.01",
    })

    // Conditional Access
    components.push({
      id: "conditional-access",
      type: "conditional_access_engine",
      name: "Conditional Access",
      x: 100,
      y: 250,
      width: 200,
      height: 80,
      status: "online",
      category: "security",
      metrics: {
        policies: 28,
        uptime: 99.95,
      },
      connections: ["azure-ad-tenant", "intune-mdm", "ztna-gateway"],
      icon: "shield-check",
      color: "#0078D4",
      description: "Advanced conditional access with real-time risk assessment",
      vendor: "microsoft",
      version: "2024.01",
    })

    // Zero Trust Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Gateway",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      metrics: {
        connections: 8950,
        throughput: "18.5 Gbps",
        latency: 3,
        uptime: 99.99,
        users: 12500,
        sessions: 8200,
        requests: 1850000,
        securityScore: 97,
      },
      connections: [
        "portnox-cloud-platform",
        "azure-ad-tenant",
        "on-premise-apps",
        "saas-applications",
        "device-trust-engine",
      ],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with micro-segmentation and continuous verification",
      vendor: "portnox",
      version: "v3.2.1",
    })

    // Device Trust Engine
    components.push({
      id: "device-trust-engine",
      type: "device_trust_engine",
      name: "Device Trust Engine",
      x: 1000,
      y: 250,
      width: 250,
      height: 100,
      status: "online",
      category: "security",
      metrics: {
        uptime: 99.94,
        devices: 12500,
        trustScore: 92,
        violations: 25,
      },
      connections: ["ztna-gateway", "intune-mdm"],
      icon: "scan",
      color: config.customColors.accent,
      description: "AI-powered device posture assessment with continuous trust scoring",
    })

    // Microsoft Intune
    components.push({
      id: "intune-mdm",
      type: "mdm_platform",
      name: "Microsoft Intune",
      x: 100,
      y: 400,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      metrics: {
        devices: 12500,
        policies: 45,
        compliance: 98.5,
        uptime: 99.92,
      },
      connections: ["azure-ad-tenant", "conditional-access", "portnox-cloud-platform", "device-trust-engine"],
      icon: "smartphone",
      color: "#00BCF2",
      description: "Unified endpoint management with app protection and compliance policies",
      vendor: "microsoft",
      version: "2024.01",
    })

    // RADSEC Proxy
    components.push({
      id: "radsec-proxy-primary",
      type: "radius_proxy",
      name: "RADSEC Proxy",
      x: 600,
      y: 300,
      width: 180,
      height: 80,
      status: "online",
      category: "network",
      metrics: {
        connections: 2850,
        throughput: "5.2 Gbps",
        latency: 2,
        uptime: 99.99,
        cpu: 28,
        memory: 42,
      },
      connections: ["portnox-cloud-platform", "core-switch-stack"],
      icon: "router",
      color: config.customColors.secondary,
      description: "High-performance RADIUS over TLS proxy with intelligent caching",
      vendor: "portnox",
      version: "v2.8.1",
    })

    // Core Network Infrastructure
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === config.wiredVendor)
    components.push({
      id: "core-switch-stack",
      type: "core_switch",
      name: `${wiredVendorInfo?.label || "Core"} Switch Stack`,
      x: 600,
      y: 450,
      width: 300,
      height: 100,
      status: "online",
      category: "network",
      metrics: {
        connections: 96,
        throughput: "800 Gbps",
        latency: 0.5,
        uptime: 99.99,
        cpu: 18,
        memory: 35,
      },
      connections: ["radsec-proxy-primary", "distribution-switches", "wireless-controller", "firewall-cluster"],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-density core switching with 802.1X authentication and dynamic VLAN assignment",
      vendor: config.wiredVendor,
      model: wiredVendorInfo?.models?.[2] || "Enterprise Core Switch",
    })

    // Distribution Switches
    components.push({
      id: "distribution-switches",
      type: "distribution_switch",
      name: "Distribution Switches",
      x: 600,
      y: 600,
      width: 300,
      height: 80,
      status: "online",
      category: "network",
      metrics: {
        connections: 288,
        throughput: "240 Gbps",
        latency: 1,
        uptime: 99.98,
        cpu: 22,
        memory: 45,
      },
      connections: ["core-switch-stack", "access-switches", "wireless-controller"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "Distribution layer with advanced routing and VLAN management",
      vendor: config.wiredVendor,
      model: wiredVendorInfo?.models?.[1] || "Distribution Switch",
    })

    // Access Switches
    components.push({
      id: "access-switches",
      type: "access_switch",
      name: "Access Switches (48x)",
      x: 600,
      y: 720,
      width: 300,
      height: 80,
      status: "online",
      category: "network",
      metrics: {
        connections: 2304,
        throughput: "115 Gbps",
        latency: 2,
        uptime: 99.95,
        cpu: 35,
        memory: 52,
      },
      connections: ["distribution-switches", "endpoint-devices"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "PoE+ enabled access switches with 802.1X authentication",
      vendor: config.wiredVendor,
      model: wiredVendorInfo?.models?.[0] || "Access Switch",
    })

    // Wireless Infrastructure
    const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === config.wirelessVendor)
    components.push({
      id: "wireless-controller",
      type: "wireless_controller",
      name: `${wirelessVendorInfo?.label || "Wireless"} Controller`,
      x: 1000,
      y: 450,
      width: 200,
      height: 100,
      status: "online",
      category: "network",
      metrics: {
        connections: 2850,
        throughput: "45 Gbps",
        latency: 5,
        uptime: 99.96,
        cpu: 42,
        memory: 68,
      },
      connections: ["core-switch-stack", "distribution-switches", "access-points"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "Centralized wireless management with AI-driven optimization",
      vendor: config.wirelessVendor,
      model: wirelessVendorInfo?.models?.[2] || "Wireless Controller",
    })

    components.push({
      id: "access-points",
      type: "access_point",
      name: "WiFi 6E APs (240x)",
      x: 1000,
      y: 600,
      width: 200,
      height: 80,
      status: "online",
      category: "network",
      metrics: {
        connections: 2850,
        throughput: "28 Gbps",
        latency: 8,
        uptime: 99.92,
      },
      connections: ["wireless-controller", "endpoint-devices"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-density WiFi 6E access points with advanced security",
      vendor: config.wirelessVendor,
      model: wirelessVendorInfo?.models?.[3] || "WiFi 6E AP",
    })

    // Security Infrastructure
    const firewallVendorInfo = VENDOR_OPTIONS.firewall.find((v) => v.value === config.firewallVendor)
    components.push({
      id: "firewall-cluster",
      type: "firewall_cluster",
      name: `${firewallVendorInfo?.label || "Firewall"} Cluster`,
      x: 1300,
      y: 450,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      metrics: {
        connections: 125000,
        throughput: "80 Gbps",
        latency: 0.8,
        uptime: 99.98,
        cpu: 45,
        memory: 62,
      },
      connections: ["core-switch-stack", "internet-gateway"],
      icon: "shield",
      color: firewallVendorInfo?.color || "#EF4444",
      description: "Next-generation firewall cluster with advanced threat protection",
      vendor: config.firewallVendor,
      model: firewallVendorInfo?.models?.[2] || "NGFW Cluster",
    })

    // Internet Gateway
    components.push({
      id: "internet-gateway",
      type: "internet_gateway",
      name: "Internet Gateway",
      x: 1300,
      y: 600,
      width: 180,
      height: 60,
      status: "online",
      category: "connectivity",
      metrics: {
        bandwidth: "10 Gbps",
        latency: 18,
        uptime: 99.8,
      },
      connections: ["firewall-cluster"],
      icon: "globe",
      color: "#6366F1",
      description: "High-speed internet connectivity with DDoS protection",
    })

    // Endpoint Devices
    components.push({
      id: "endpoint-devices",
      type: "endpoint_devices",
      name: "Endpoint Devices (12,500)",
      x: 600,
      y: 850,
      width: 300,
      height: 80,
      status: "online",
      category: "endpoint",
      metrics: {
        uptime: 94.2,
        windows: 8500,
        ios: 2000,
        android: 1500,
        macos: 500,
      },
      connections: ["access-switches", "access-points"],
      icon: "monitor",
      color: "#6B7280",
      description: "Diverse endpoint ecosystem with comprehensive security",
    })

    // Applications
    components.push({
      id: "on-premise-apps",
      type: "application_server",
      name: "On-Premise Apps",
      x: 1300,
      y: 100,
      width: 180,
      height: 100,
      status: "online",
      category: "application",
      metrics: {
        connections: 2850,
        throughput: "8.5 Gbps",
        latency: 2,
        uptime: 99.95,
        users: 8500,
        sessions: 2850,
      },
      connections: ["ztna-gateway"],
      icon: "server",
      color: "#059669",
      description: "Critical business applications with zero trust protection",
    })

    components.push({
      id: "saas-applications",
      type: "saas_applications",
      name: "SaaS Applications",
      x: 1300,
      y: 250,
      width: 180,
      height: 100,
      status: "online",
      category: "application",
      metrics: {
        connections: 12500,
        throughput: "5.2 Gbps",
        latency: 45,
        uptime: 99.98,
        users: 12500,
        sessions: 8950,
      },
      connections: ["ztna-gateway", "azure-ad-tenant"],
      icon: "cloud",
      color: config.customColors.accent,
      description: "Cloud applications with conditional access",
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Engine",
      x: 400,
      y: 300,
      width: 150,
      height: 80,
      status: "online",
      category: "management",
      metrics: {
        policies: 156,
        latency: 1.5,
        uptime: 99.99,
      },
      connections: ["portnox-cloud-platform"],
      icon: "settings",
      color: "#059669",
      description: "AI-powered policy engine with real-time decision making",
    })

    // Certificate Authority
    components.push({
      id: "certificate-authority",
      type: "certificate_authority",
      name: "Certificate Authority",
      x: 400,
      y: 400,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      metrics: {
        certificates: 12500,
        uptime: 99.98,
      },
      connections: ["portnox-cloud-platform"],
      icon: "file-key",
      color: "#DC2626",
      description: "Enterprise PKI with automated certificate lifecycle management",
    })

    generateIntelligentConnections(components, connections)
  }

  // Add all other generator functions here (keeping them the same as before)
  const generateAuthenticationFlow = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // User Device
    components.push({
      id: "user-device",
      type: "endpoint_device",
      name: "User Device",
      x: 100,
      y: 300,
      width: 150,
      height: 100,
      status: "online",
      category: "endpoint",
      connections: ["network-access-point"],
      icon: "smartphone",
      color: "#6B7280",
      description: "Corporate or BYOD device attempting network access",
      metrics: {
        uptime: 98.5,
        cpu: 45,
        memory: 62,
      },
    })

    // Network Access Point
    components.push({
      id: "network-access-point",
      type: "network_access_point",
      name: "Network Access Point",
      x: 350,
      y: 300,
      width: 150,
      height: 100,
      status: "online",
      category: "network",
      connections: ["radius-proxy", "user-device"],
      icon: config.connectivity.includes("wireless") ? "wifi" : "network",
      color: config.connectivity.includes("wireless")
        ? VENDOR_OPTIONS.wireless.find((v) => v.value === config.wirelessVendor)?.color || "#8B5CF6"
        : VENDOR_OPTIONS.wired.find((v) => v.value === config.wiredVendor)?.color || "#6B7280",
      description: "802.1X enabled switch port or wireless access point",
      vendor: config.connectivity.includes("wireless") ? config.wirelessVendor : config.wiredVendor,
      metrics: {
        connections: 48,
        throughput: "1 Gbps",
        uptime: 99.8,
      },
    })

    // RADIUS Proxy
    components.push({
      id: "radius-proxy",
      type: "radius_proxy",
      name: "RADIUS Proxy",
      x: 600,
      y: 300,
      width: 150,
      height: 100,
      status: "online",
      category: "security",
      connections: ["network-access-point", "portnox-cloud"],
      icon: "router",
      color: config.customColors.secondary,
      description: "RADSEC proxy forwarding authentication to cloud",
      vendor: "portnox",
      metrics: {
        connections: 2850,
        throughput: "5.2 Gbps",
        latency: 2,
        uptime: 99.99,
      },
    })

    // Portnox Cloud
    components.push({
      id: "portnox-cloud",
      type: "nac_platform",
      name: "Portnox Cloud",
      x: 850,
      y: 250,
      width: 200,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["radius-proxy", "identity-provider", "policy-engine"],
      icon: "cloud",
      color: config.customColors.primary,
      description: "Cloud NAC platform with integrated RADIUS and policy engine",
      vendor: "portnox",
      metrics: {
        connections: 15847,
        throughput: "12.8 Gbps",
        latency: 8,
        uptime: 99.98,
        users: 12500,
        sessions: 8950,
      },
    })

    // Identity Provider
    components.push({
      id: "identity-provider",
      type: "identity_provider",
      name: config.identityProvider.includes("azure_ad") ? "Azure AD" : "Identity Provider",
      x: 1150,
      y: 200,
      width: 180,
      height: 100,
      status: "online",
      category: "identity",
      connections: ["portnox-cloud"],
      icon: "users",
      color: config.identityProvider.includes("azure_ad")
        ? VENDOR_OPTIONS.identity.find((v) => v.value === "azure_ad")?.color || "#0078D4"
        : "#0078D4",
      description: "Enterprise identity provider for user authentication",
      vendor: config.identityProvider.includes("azure_ad") ? "microsoft" : "generic",
      metrics: {
        users: 12500,
        sessions: 8950,
        uptime: 99.97,
        latency: 15,
      },
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Engine",
      x: 850,
      y: 400,
      width: 150,
      height: 80,
      status: "online",
      category: "management",
      connections: ["portnox-cloud"],
      icon: "settings",
      color: "#059669",
      description: "Real-time policy evaluation and access decisions",
      metrics: {
        policies: 156,
        latency: 1.5,
        uptime: 99.99,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // Add all other generator functions (PKI, Policies, etc.) - keeping them the same as before
  const generatePKIArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Root CA
    components.push({
      id: "root-ca",
      type: "root_ca",
      name: "Root Certificate Authority",
      x: 600,
      y: 100,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "intermediate-ca-2"],
      icon: "file-key",
      color: "#DC2626",
      description: "Offline root CA for maximum security",
      metrics: { certificates: 2, uptime: 99.99 },
    })

    // Intermediate CAs
    components.push({
      id: "intermediate-ca-1",
      type: "intermediate_ca",
      name: "User Certificate CA",
      x: 350,
      y: 250,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["root-ca", "user-certificates"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for user authentication",
      metrics: { certificates: 12500, uptime: 99.95 },
    })

    components.push({
      id: "intermediate-ca-2",
      type: "intermediate_ca",
      name: "Device Certificate CA",
      x: 850,
      y: 250,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["root-ca", "device-certificates"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for device authentication",
      metrics: { certificates: 8500, uptime: 99.95 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generatePolicyArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Engine",
      x: 600,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["policy-repository", "decision-engine", "enforcement-points"],
      icon: "settings",
      color: "#059669",
      description: "AI-powered policy engine with real-time decision making",
      metrics: { policies: 156, decisions: 2850000, latency: 1.5, uptime: 99.99 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateConnectivityArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // WAN Edge Router
    components.push({
      id: "wan-edge-router",
      type: "wan_edge_router",
      name: "WAN Edge Router",
      x: 600,
      y: 100,
      width: 250,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["mpls-circuit", "internet-circuit", "backup-circuit", "core-switch"],
      icon: "router",
      color: "#059669",
      description: "Multi-WAN edge router with intelligent path selection",
      vendor: "cisco",
      model: "ISR 4451",
      metrics: { connections: 4, throughput: "1 Gbps", latency: 5, uptime: 99.95 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateIntuneIntegration = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Microsoft Intune
    components.push({
      id: "microsoft-intune",
      type: "mdm_platform",
      name: "Microsoft Intune",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: ["azure-ad", "conditional-access", "device-compliance", "app-protection"],
      icon: "smartphone",
      color: "#00BCF2",
      description: "Unified endpoint management with comprehensive device and app protection",
      vendor: "microsoft",
      version: "2024.01",
      metrics: { devices: 12500, policies: 45, compliance: 98.5, uptime: 99.95 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateJamfIntegration = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Jamf Pro
    components.push({
      id: "jamf-pro",
      type: "mdm_platform",
      name: "Jamf Pro",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: ["apple-business-manager", "device-enrollment", "policy-management", "app-catalog"],
      icon: "smartphone",
      color: "#4A90E2",
      description: "Comprehensive Apple device management platform",
      vendor: "jamf",
      version: "10.49.0",
      metrics: { devices: 3500, policies: 35, compliance: 99.2, uptime: 99.98 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateDeviceOnboarding = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Onboarding Portal
    components.push({
      id: "onboarding-portal",
      type: "onboarding_portal",
      name: "Device Onboarding Portal",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "application",
      connections: ["certificate-enrollment", "device-registration", "policy-assignment"],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service device onboarding with automated workflows",
      vendor: "portnox",
      metrics: { dailyOnboarding: 125, successRate: 96.8, avgTime: "4.5 min" },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateRadSecProxyArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // RADSEC Proxy Cluster
    components.push({
      id: "radsec-proxy-cluster",
      type: "radsec_proxy_cluster",
      name: "RADSEC Proxy Cluster",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: ["portnox-cloud", "radius-clients", "load-balancer"],
      icon: "router",
      color: config.customColors.secondary,
      description: "High-availability RADSEC proxy cluster with intelligent load balancing",
      vendor: "portnox",
      version: "v2.8.1",
      metrics: { proxies: 3, connections: 8500, throughput: "15.2 Gbps", latency: 2, uptime: 99.99 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateZTNAArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // ZTNA Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Gateway",
      x: 600,
      y: 100,
      width: 320,
      height: 120,
      status: "online",
      category: "security",
      connections: ["identity-verification", "device-trust", "application-access", "policy-enforcement"],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with continuous verification and micro-segmentation",
      vendor: "portnox",
      version: "v3.2.1",
      metrics: { connections: 8950, throughput: "25.5 Gbps", latency: 3, uptime: 99.99, users: 12500, sessions: 8200 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateGuestPortal = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Guest Portal
    components.push({
      id: "guest-portal",
      type: "guest_portal",
      name: "Guest Access Portal",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "application",
      connections: ["captive-portal", "guest-registration", "sponsor-approval", "guest-network"],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service guest access portal with customizable branding",
      vendor: "portnox",
      metrics: { dailyGuests: 250, activeGuests: 125, successRate: 94.5 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateIoTOnboarding = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // IoT Discovery Engine
    components.push({
      id: "iot-discovery-engine",
      type: "iot_discovery",
      name: "IoT Discovery Engine",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: ["device-profiling", "automated-onboarding", "iot-policy-engine"],
      icon: "radar",
      color: "#059669",
      description: "AI-powered IoT device discovery and classification",
      vendor: "portnox",
      metrics: { devicesDiscovered: 8500, classified: 8125, unclassified: 375, accuracy: 95.6 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateTACACSArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // TACACS+ Server
    components.push({
      id: "tacacs-server",
      type: "tacacs_server",
      name: "TACACS+ Server",
      x: 600,
      y: 100,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: ["network-devices", "command-authorization", "accounting-service", "admin-users"],
      icon: "lock",
      color: "#DC2626",
      description: "Centralized TACACS+ server for network device administration",
      vendor: "portnox",
      version: "v3.1.2",
      metrics: { authentications: 15000, authorizations: 125000, accounting: 85000, uptime: 99.95 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateRiskPolicyArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Risk Assessment Platform
    components.push({
      id: "risk-assessment-platform",
      type: "risk_assessment_platform",
      name: "Risk Assessment Platform",
      x: 600,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: ["risk-dashboard", "incident-response", "threat-intelligence", "behavioral-analytics"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Comprehensive risk assessment and threat analysis platform",
      vendor: "portnox",
      metrics: { riskAssessments: 12500, threats: 45, incidents: 8, uptime: 99.95 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateMultiSiteArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Headquarters
    components.push({
      id: "headquarters",
      type: "headquarters",
      name: "Corporate Headquarters",
      x: 600,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["branch-office-1", "branch-office-2", "remote-sites", "data-center"],
      icon: "building",
      color: config.customColors.primary,
      description: `Main headquarters with centralized NAC management for ${selectedIndustry}`,
      metrics: { users: 5000, devices: 8500, sites: 25, uptime: 99.98 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateCloudIntegration = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Multi-Cloud Hub
    components.push({
      id: "multi-cloud-hub",
      type: "multi_cloud_hub",
      name: "Multi-Cloud Hub",
      x: 600,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["aws-services", "azure-services", "google-cloud"],
      icon: "cloud",
      color: "#3B82F6",
      description: "Centralized hub for multi-cloud service integration",
      metrics: { clouds: 3, services: 45, uptime: 99.99 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateWirelessInfrastructure = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === config.wirelessVendor)

    // Wireless Controller Cluster
    components.push({
      id: "wireless-controller-cluster",
      type: "wireless_controller_cluster",
      name: `${wirelessVendorInfo?.label || "Wireless"} Controller Cluster`,
      x: 600,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "network",
      connections: ["access-points", "wireless-management"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-availability wireless controller cluster",
      vendor: config.wirelessVendor,
      metrics: { controllers: 3, accessPoints: 240, clients: 2850, uptime: 99.96 },
    })

    generateIntelligentConnections(components, connections)
  }

  const generateWiredInfrastructure = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === config.wiredVendor)

    // Core Switch Stack
    components.push({
      id: "core-switch-stack",
      type: "core_switch_stack",
      name: `${wiredVendorInfo?.label || "Core"} Switch Stack`,
      x: 600,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "network",
      connections: ["distribution-switches"],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: config.wiredVendor,
      metrics: { switches: 4, connections: 192, throughput: "800 Gbps", uptime: 99.99 },
    })

    generateIntelligentConnections(components, connections)
  }

  const determineConnectionType = (source: DiagramComponent, target: DiagramComponent) => {
    if (source.category === "cloud" || target.category === "cloud") {
      return {
        type: "https" as const,
        protocol: "HTTPS",
        port: 443,
        throughput: "1 Gbps",
        latency: 10,
        encryption: true,
        bandwidth: "1 Gbps",
      }
    }

    if (source.type.includes("radius") || target.type.includes("radius")) {
      return {
        type: "radsec" as const,
        protocol: "RADSEC",
        port: 2083,
        throughput: "100 Mbps",
        latency: 5,
        encryption: true,
        bandwidth: "100 Mbps",
      }
    }

    if (source.type.includes("tacacs") || target.type.includes("tacacs")) {
      return {
        type: "tacacs" as const,
        protocol: "TACACS+",
        port: 49,
        throughput: "10 Mbps",
        latency: 3,
        encryption: true,
        bandwidth: "10 Mbps",
      }
    }

    if (source.category === "identity" || target.category === "identity") {
      return {
        type: "saml" as const,
        protocol: "SAML",
        port: 443,
        throughput: "100 Mbps",
        latency: 15,
        encryption: true,
        bandwidth: "100 Mbps",
      }
    }

    if (source.category === "network" && target.category === "network") {
      return {
        type: "ethernet" as const,
        protocol: "Ethernet",
        port: undefined,
        throughput: "10 Gbps",
        latency: 1,
        encryption: false,
        bandwidth: "10 Gbps",
      }
    }

    return {
      type: "api" as const,
      protocol: "REST API",
      port: 443,
      throughput: "1 Gbps",
      latency: 5,
      encryption: true,
      bandwidth: "1 Gbps",
    }
  }

  const generateIntelligentConnections = (components: DiagramComponent[], connections: Connection[]) => {
    components.forEach((source) => {
      source.connections.forEach((targetId) => {
        const target = components.find((c) => c.id === targetId)
        if (target) {
          const existingConnection = connections.find(
            (conn) =>
              (conn.from === source.id && conn.to === target.id) || (conn.from === target.id && conn.to === source.id),
          )
          if (!existingConnection) {
            const connectionDetails = determineConnectionType(source, target)
            connections.push({
              id: `${source.id}-${target.id}`,
              from: source.id,
              to: target.id,
              ...connectionDetails,
              status: "active",
            })
          }
        }
      })
    })
  }

  const updateMetrics = () => {
    setComponents((prevComponents) =>
      prevComponents.map((component) => ({
        ...component,
        metrics: component.metrics
          ? {
              ...component.metrics,
              cpu: component.metrics.cpu
                ? Math.max(10, Math.min(90, component.metrics.cpu + (Math.random() - 0.5) * 10))
                : undefined,
              memory: component.metrics.memory
                ? Math.max(20, Math.min(95, component.metrics.memory + (Math.random() - 0.5) * 8))
                : undefined,
              network: component.metrics.network
                ? Math.max(5, Math.min(100, component.metrics.network + (Math.random() - 0.5) * 15))
                : undefined,
              latency: component.metrics.latency
                ? Math.max(1, component.metrics.latency + (Math.random() - 0.5) * 2)
                : undefined,
              connections: component.metrics.connections
                ? Math.max(0, Math.min(90000, component.metrics.connections + Math.floor((Math.random() - 0.5) * 1000)))
                : undefined,
            }
          : undefined,
      })),
    )
  }

  const handleComponentClick = (component: DiagramComponent) => {
    setSelectedComponent(component)
    setSelectedConnection(null)
  }

  const handleConnectionClick = (connection: Connection) => {
    setSelectedConnection(connection)
    setSelectedComponent(null)
  }

  const handleComponentHover = (componentId: string | null) => {
    setHoveredComponent(componentId)
  }

  const handleConnectionHover = (connectionId: string | null) => {
    setHoveredConnection(connectionId)
  }

  const handleVendorChange = (category: string, vendor: string) => {
    updateConfig({ [`${category}Vendor`]: vendor } as any)
    toast({
      title: "Vendor Updated",
      description: `${category} vendor changed to ${vendor}`,
    })
  }

  const saveConfiguration = async () => {
    try {
      await storage.saveArchitectureConfig(localConfig)
      toast({
        title: "Configuration Saved",
        description: "Architecture configuration has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      })
    }
  }

  const exportDiagram = () => {
    if (!svgRef.current) return

    const svgElement = svgRef.current
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    if (exportFormat === "svg") {
      const downloadLink = document.createElement("a")
      downloadLink.href = svgUrl
      downloadLink.download = `architecture-${selectedView}-${Date.now()}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } else if (exportFormat === "png") {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width * 2
        canvas.height = img.height * 2
        ctx?.scale(2, 2)
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const downloadLink = document.createElement("a")
            downloadLink.href = pngUrl
            downloadLink.download = `architecture-${selectedView}-${Date.now()}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
          }
        })
      }

      img.src = svgUrl
    }

    URL.revokeObjectURL(svgUrl)
    toast({
      title: "Export Complete",
      description: `Diagram exported as ${exportFormat.toUpperCase()}`,
    })
  }

  const renderComponent = (component: DiagramComponent) => {
    const IconComponent = COMPONENT_ICONS[component.icon as keyof typeof COMPONENT_ICONS] || Settings
    const isSelected = selectedComponent?.id === component.id
    const isHovered = hoveredComponent === component.id

    return (
      <g
        key={component.id}
        transform={`translate(${component.x}, ${component.y})`}
        onClick={() => handleComponentClick(component)}
        onMouseEnter={() => handleComponentHover(component.id)}
        onMouseLeave={() => handleComponentHover(null)}
        style={{ cursor: editMode ? "move" : "pointer" }}
        className="component-group"
      >
        {/* Component Background */}
        <rect
          width={component.width}
          height={component.height}
          rx={8}
          fill={component.color}
          fillOpacity={0.08}
          stroke={component.color}
          strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 1}
          strokeOpacity={isSelected ? 1 : 0.4}
          className="component-background"
        />

        {/* Status Indicator */}
        <circle cx={component.width - 12} cy={12} r={4} fill={STATUS_COLORS[component.status]} />

        {/* Component Icon */}
        <foreignObject x={12} y={12} width={24} height={24}>
          <div
            className="flex items-center justify-center w-6 h-6 rounded-md"
            style={{ backgroundColor: component.color + "15" }}
          >
            <IconComponent size={14} color={component.color} />
          </div>
        </foreignObject>

        {/* Component Name */}
        <text x={44} y={24} fontSize={12} fontWeight="600" fill="#1F2937" className="component-name">
          {component.name}
        </text>

        {/* Component Description */}
        {showLabels && (
          <text x={12} y={44} fontSize={10} fill="#6B7280" className="component-description">
            <tspan x={12} dy={0}>
              {component.description.length > 40
                ? `${component.description.substring(0, 40)}...`
                : component.description}
            </tspan>
          </text>
        )}

        {/* Vendor Badge */}
        {component.vendor && (
          <>
            <rect
              x={component.width - 80}
              y={component.height - 24}
              width={72}
              height={18}
              rx={9}
              fill={component.color}
              fillOpacity={0.1}
              stroke={component.color}
              strokeWidth={0.5}
            />
            <text
              x={component.width - 44}
              y={component.height - 13}
              fontSize={8}
              textAnchor="middle"
              fill={component.color}
              fontWeight="600"
            >
              {component.vendor.toUpperCase()}
            </text>
          </>
        )}

        {/* Metrics Display */}
        {showMetrics && component.metrics && (
          <g transform={`translate(12, ${component.height - 32})`}>
            {component.metrics.cpu && !isNaN(component.metrics.cpu) && (
              <text fontSize={8} fill="#374151">
                <tspan>CPU: {Math.round(component.metrics.cpu)}%</tspan>
              </text>
            )}
            {component.metrics.memory && !isNaN(component.metrics.memory) && (
              <text fontSize={8} fill="#374151" x={60}>
                <tspan>RAM: {Math.round(component.metrics.memory)}%</tspan>
              </text>
            )}
            {component.metrics.uptime && !isNaN(component.metrics.uptime) && (
              <text fontSize={8} fill="#374151" x={120}>
                <tspan>Up: {component.metrics.uptime.toFixed(1)}%</tspan>
              </text>
            )}
          </g>
        )}

        {/* Animation Effects */}
        {localConfig.animations && animationActive && (
          <g className="animation-effects">
            {/* Data flow animation */}
            <circle cx={component.width / 2} cy={component.height / 2} r={3} fill={component.color} fillOpacity={0.4}>
              <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Pulse effect for selected component */}
            {isSelected && (
              <rect
                width={component.width}
                height={component.height}
                rx={8}
                fill="none"
                stroke={component.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              >
                <animate attributeName="stroke-opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
              </rect>
            )}
          </g>
        )}
      </g>
    )
  }

  const renderConnection = (connection: Connection) => {
    const sourceComponent = components.find((c) => c.id === connection.from)
    const targetComponent = components.find((c) => c.id === connection.to)

    if (!sourceComponent || !targetComponent) return null

    const sourceX = sourceComponent.x + sourceComponent.width / 2
    const sourceY = sourceComponent.y + sourceComponent.height / 2
    const targetX = targetComponent.x + targetComponent.width / 2
    const targetY = targetComponent.y + targetComponent.height / 2

    const connectionColor = CONNECTION_COLORS[connection.type] || "#6B7280"
    const isSelected = selectedConnection?.id === connection.id
    const isHovered = hoveredConnection === connection.id

    // Calculate connection path for better routing
    const midX = (sourceX + targetX) / 2
    const midY = (sourceY + targetY) / 2
    const pathData = `M ${sourceX} ${sourceY} Q ${midX} ${midY - 30} ${targetX} ${targetY}`

    return (
      <g
        key={connection.id}
        onClick={() => handleConnectionClick(connection)}
        onMouseEnter={() => handleConnectionHover(connection.id)}
        onMouseLeave={() => handleConnectionHover(null)}
        style={{ cursor: "pointer" }}
        className="connection-group"
      >
        {/* Connection Path */}
        <path
          d={pathData}
          fill="none"
          stroke={connectionColor}
          strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
          strokeOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.5}
          strokeDasharray={connection.type === "vpn" ? "4,4" : "none"}
          markerEnd="url(#arrowhead)"
        />

        {/* Connection Label */}
        {showLabels && (
          <text x={midX} y={midY - 35} fontSize={9} fill="#374151" textAnchor="middle" className="connection-label">
            {connection.protocol}
          </text>
        )}

        {/* Data Flow Animation */}
        {localConfig.animations && animationActive && (
          <circle r={2} fill={connectionColor} fillOpacity={0.8}>
            <animateMotion dur="3s" repeatCount="indefinite" path={pathData} />
          </circle>
        )}

        {/* Connection Status Indicator */}
        <circle
          cx={midX}
          cy={midY}
          r={3}
          fill={connection.status === "active" ? "#10B981" : connection.status === "error" ? "#EF4444" : "#F59E0B"}
          fillOpacity={0.7}
        />
      </g>
    )
  }

  return (
    <div className="w-full h-full flex">
      {/* Minimal Side Panel - Collapsible */}
      {showQuickControls && (
        <div className="w-64 flex-shrink-0 border-r bg-white shadow-sm">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Controls</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowQuickControls(false)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Architecture View Selector */}
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARCHITECTURE_VIEWS.map((view) => (
                  <SelectItem key={view.id} value={view.id}>
                    {view.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
            {/* Vendor Configuration */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Vendors</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-600">Wired</Label>
                  <Select value={localConfig.wiredVendor} onValueChange={(value) => handleVendorChange("wired", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDOR_OPTIONS.wired.map((vendor) => (
                        <SelectItem key={vendor.value} value={vendor.value}>
                          {vendor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Wireless</Label>
                  <Select
                    value={localConfig.wirelessVendor}
                    onValueChange={(value) => handleVendorChange("wireless", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDOR_OPTIONS.wireless.map((vendor) => (
                        <SelectItem key={vendor.value} value={vendor.value}>
                          {vendor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Firewall</Label>
                  <Select
                    value={localConfig.firewallVendor}
                    onValueChange={(value) => handleVendorChange("firewall", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDOR_OPTIONS.firewall.map((vendor) => (
                        <SelectItem key={vendor.value} value={vendor.value}>
                          {vendor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Display Options */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Display</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Metrics</Label>
                  <Switch checked={showMetrics} onCheckedChange={setShowMetrics} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Connections</Label>
                  <Switch checked={showConnections} onCheckedChange={setShowConnections} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Labels</Label>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Animations</Label>
                  <Switch
                    checked={localConfig.animations}
                    onCheckedChange={(checked) => updateConfig({ animations: checked })}
                    className="scale-75"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Zoom Controls */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Zoom: {zoomLevel}%</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                  className="h-7 px-2"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoomLevel(100)} className="h-7 px-2">
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="h-7 px-2"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Export */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Export</Label>
              <div className="flex gap-1">
                <Select value={exportFormat} onValueChange={(value: "png" | "svg" | "pdf") => setExportFormat(value)}>
                  <SelectTrigger className="h-7 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={exportDiagram} className="h-7 px-2 bg-transparent">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Diagram Area - Takes up all remaining space */}
      <div className="flex-1 relative bg-white">
        {/* Minimal Top Bar */}
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!showQuickControls && (
              <Button variant="outline" size="sm" onClick={() => setShowQuickControls(true)} className="h-8">
                <Sliders className="h-3 w-3 mr-1" />
                Controls
              </Button>
            )}
            <Badge variant="outline" className="text-xs bg-white">
              {ARCHITECTURE_VIEWS.find((v) => v.id === selectedView)?.name || selectedView}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={saveConfiguration} className="h-8 bg-transparent">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreenMode(!isFullscreenMode)} className="h-8">
              {isFullscreenMode ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* SVG Diagram - Full height and width */}
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`${panOffset.x} ${panOffset.y} ${1800 * (100 / zoomLevel)} ${1200 * (100 / zoomLevel)}`}
          style={{ cursor: interactionMode === "pan" ? "grab" : "default" }}
        >
          {/* Grid Pattern */}
          {showGrid && (
            <defs>
              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
              </pattern>
            </defs>
          )}
          {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

          {/* Arrow Markers */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#6B7280" />
            </marker>
          </defs>

          {/* Render Connections */}
          {showConnections && connections.map(renderConnection)}

          {/* Render Components */}
          {components.map(renderComponent)}

          {/* Status Info */}
          <text x={20} y={40} fontSize={11} fill="#6B7280" className="select-none">
            {components.length} components • {connections.length} connections
          </text>
        </svg>

        {/* Loading State */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating {selectedView} architecture...</p>
            </div>
          </div>
        )}

        {/* Component Details Panel - Only show when component is selected */}
        {selectedComponent && (
          <div className="absolute bottom-4 right-4 w-72 z-20">
            <Card className="bg-white shadow-lg border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {React.createElement(
                      COMPONENT_ICONS[selectedComponent.icon as keyof typeof COMPONENT_ICONS] || Settings,
                      {
                        className: "h-4 w-4",
                        style: { color: selectedComponent.color },
                      },
                    )}
                    {selectedComponent.name}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(null)} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: selectedComponent.color + "20", color: selectedComponent.color }}
                >
                  {selectedComponent.status.toUpperCase()}
                </Badge>
                <p className="text-xs text-gray-600">{selectedComponent.description}</p>

                {selectedComponent.vendor && (
                  <div>
                    <Label className="text-xs font-medium text-gray-500">VENDOR</Label>
                    <p className="text-xs">{selectedComponent.vendor.toUpperCase()}</p>
                    {selectedComponent.model && <p className="text-xs text-gray-500">{selectedComponent.model}</p>}
                  </div>
                )}

                {selectedComponent.metrics && (
                  <div>
                    <Label className="text-xs font-medium text-gray-500">METRICS</Label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {Object.entries(selectedComponent.metrics)
                        .slice(0, 6)
                        .map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="ml-1 font-medium">
                              {typeof value === "number" && key.includes("Score") ? `${value}%` : value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
