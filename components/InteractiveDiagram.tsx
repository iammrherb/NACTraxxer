"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

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
  isFullscreen = false 
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlPanelRef = useRef<HTMLDivElement>(null)
  const [components, setComponents] = useState<DiagramComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedComponent, setSelectedComponent] = useState<DiagramComponent | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [animationActive, setAnimationActive] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(config.zoomLevel || 100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [showMetrics, setShowMetrics] = useState(config.showMetrics)
  const [showConnections, setShowConnections] = useState(config.showConnections)
  const [showLabels, setShowLabels] = useState(true)
  const [showPorts, setShowPorts] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([config.animationSpeed || 50])
  const [dataFlowAnimation, setDataFlowAnimation] = useState(0)
  const [metricsUpdateInterval, setMetricsUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  const [interactionMode, setInteractionMode] = useState<"select" | "pan" | "connect" | "edit">("select")
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [autoLayout, setAutoLayout] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "pdf">("png")
  const [showControlPanel, setShowControlPanel] = useState(showControls)
  const [controlPanelMinimized, setControlPanelMinimized] = useState(false)
  const [controlPanelPosition, setControlPanelPosition] = useState({ x: 16, y: 16 })
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [selectedView, setSelectedView] = useState(config.selectedView || "complete")
  const [selectedIndustry, setSelectedIndustry] = useState(config.industry || "healthcare")
  const [selectedDeployment, setSelectedDeployment] = useState(config.deployment || "hybrid")
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("global")

  // Configuration state - merged from the original config tab
  const [localConfig, setLocalConfig] = useState<ArchitectureConfig>(config)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    infrastructure: true,
    identity: true,
    security: true,
    features: true,
    visualization: true,
    advanced: false,
  })

  useEffect(() => {
    loadSites()
    generateArchitecture()
  }, [])

  useEffect(() => {
    generateArchitecture()
  }, [selectedView, selectedIndustry, selectedSite, selectedDeployment, localConfig])

  useEffect(() => {
    if (localConfig.animations && animationActive) {
      const interval = setInterval(
        () => {
          updateMetrics()
          setDataFlowAnimation((prev) => (prev + 1) % 100)
        },
        2000 - animationSpeed[0] * 15,
      )
      setMetricsUpdateInterval(interval)
      return () => clearInterval(interval)
    } else if (metricsUpdateInterval) {
      clearInterval(metricsUpdateInterval)
      setMetricsUpdateInterval(null)
    }
  }, [localConfig.animations, animationActive, animationSpeed])

  useEffect(() => {
    setShowControlPanel(showControls)
  }, [showControls])

  useEffect(() => {
    setZoomLevel(config.zoomLevel || 100)
    setShowMetrics(config.showMetrics)
    setShowConnections(config.showConnections)
    setAnimationSpeed([config.animationSpeed || 50])
    setSelectedView(config.selectedView || "complete")
    setSelectedIndustry(config.industry || "healthcare")
    setSelectedDeployment(config.deployment || "hybrid")
    setLocalConfig(config)
  }, [config])

  const loadSites = async () => {
    try {
      const sitesData = await storage.getSites()
      setSites(sitesData)
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const updateConfig = (updates: Partial<ArchitectureConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    if (onConfigUpdate) {
      onConfigUpdate(updates)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const generateArchitecture = useCallback(() => {
    const newComponents: DiagramComponent[] = []
    const newConnections: Connection[] = []

    // Generate architecture based on selected view
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

    setComponents(newComponents)
    setConnections(newConnections)
  }, [selectedView, selectedIndustry, selectedSite, selectedDeployment, localConfig])

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
      y: 50,
      width: 400,
      height: 150,
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

    // Identity Providers based on configuration
    if (config.identityProvider.includes("azure_ad")) {
      components.push({
        id: "azure-ad-tenant",
        type: "identity_provider",
        name: "Azure Active Directory",
        x: 100,
        y: 50,
        width: 250,
        height: 120,
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
        color: VENDOR_OPTIONS.identity.find((v) => v.value === "azure_ad")?.color || "#0078D4",
        description: "Enterprise identity platform with conditional access and MFA",
        vendor: "microsoft",
        version: "2024.01",
      })

      components.push({
        id: "conditional-access",
        type: "conditional_access_engine",
        name: "Microsoft Conditional Access",
        x: 100,
        y: 200,
        width: 250,
        height: 100,
        status: "online",
        category: "security",
        metrics: {
          policies: 28,
          uptime: 99.95,
        },
        connections: ["azure-ad-tenant", "intune-mdm", "ztna-gateway"],
        icon: "shield-check",
        color: VENDOR_OPTIONS.identity.find((v) => v.value === "azure_ad")?.color || "#0078D4",
        description: "Advanced conditional access with real-time risk assessment",
        vendor: "microsoft",
        version: "2024.01",
      })
    }

    // Zero Trust Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Application Gateway",
      x: 1200,
      y: 50,
      width: 300,
      height: 150,
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
      name: "Device Trust & Compliance Engine",
      x: 1200,
      y: 230,
      width: 300,
      height: 120,
      status: "online",
      category: "security",
      metrics: {
        uptime: 99.94,
      },
      connections: ["ztna-gateway", "intune-mdm"],
      icon: "scan",
      color: config.customColors.accent,
      description: "AI-powered device posture assessment with continuous trust scoring",
    })

    // MDM Integration based on configuration
    if (config.mdmProvider.includes("intune")) {
      components.push({
        id: "intune-mdm",
        type: "mdm_platform",
        name: "Microsoft Intune",
        x: 100,
        y: 350,
        width: 250,
        height: 120,
        status: "online",
        category: "management",
        metrics: {
          uptime: 99.92,
        },
        connections: ["azure-ad-tenant", "conditional-access", "portnox-cloud-platform", "device-trust-engine"],
        icon: "smartphone",
        color: VENDOR_OPTIONS.mdm.find((v) => v.value === "intune")?.color || "#00BCF2",
        description: "Unified endpoint management with app protection and compliance policies",
        vendor: "microsoft",
        version: "2024.01",
      })
    }

    // RADSEC Proxy based on RADIUS type
    if (config.radiusType === "proxy" || config.radiusType === "cloud") {
      components.push({
        id: "radsec-proxy-primary",
        type: "radius_proxy",
        name: "RADSEC Proxy (Primary)",
        x: 600,
        y: 250,
        width: 200,
        height: 100,
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
    }

    // Core Network Infrastructure based on wired vendor
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === config.wiredVendor)
    components.push({
      id: "core-switch-stack",
      type: "core_switch",
      name: `${wiredVendorInfo?.label || config.wiredVendor.toUpperCase()} Core Switch Stack`,
      x: 600,
      y: 400,
      width: 400,
      height: 120,
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
      connections: [
        "radsec-proxy-primary",
        "distribution-switches",
        "wireless-controller",
        "firewall-cluster",
        "connectivity-hub",
      ],
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
      name: "Distribution Layer Switches",
      x: 600,
      y: 550,
      width: 400,
      height: 100,
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
      name: "Access Layer Switches (48x)",
      x: 600,
      y: 680,
      width: 400,
      height: 100,
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

    // Wireless Infrastructure based on connectivity options
    if (config.connectivity.includes("wireless")) {
      const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === config.wirelessVendor)
      components.push({
        id: "wireless-controller",
        type: "wireless_controller",
        name: `${wirelessVendorInfo?.label || config.wirelessVendor.toUpperCase()} Wireless Controller`,
        x: 1050,
        y: 400,
        width: 200,
        height: 120,
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
        name: "WiFi 6E Access Points (240x)",
        x: 1050,
        y: 550,
        width: 200,
        height: 100,
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
    }

    // Security Infrastructure based on firewall vendor
    const firewallVendorInfo = VENDOR_OPTIONS.firewall.find((v) => v.value === config.firewallVendor)
    components.push({
      id: "firewall-cluster",
      type: "firewall_cluster",
      name: `${firewallVendorInfo?.label || config.firewallVendor.toUpperCase()} Firewall Cluster`,
      x: 1300,
      y: 400,
      width: 200,
      height: 120,
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
      connections: ["core-switch-stack", "connectivity-hub", "internet-gateway"],
      icon: "shield",
      color: firewallVendorInfo?.color || "#EF4444",
      description: "Next-generation firewall cluster with advanced threat protection",
      vendor: config.firewallVendor,
      model: firewallVendorInfo?.models?.[2] || "NGFW Cluster",
    })

    // Connectivity Hub based on deployment type
    if (selectedDeployment === "hybrid" || selectedDeployment === "cloud") {
      components.push({
        id: "connectivity-hub",
        type: "connectivity_hub",
        name: "Multi-WAN Connectivity Hub",
        x: 1300,
        y: 550,
        width: 200,
        height: 150,
        status: "online",
        category: "connectivity",
        metrics: {
          connections: 8,
          throughput: "25 Gbps",
          latency: 12,
          uptime: 99.95,
        },
        connections: ["firewall-cluster", "internet-gateway", "cloud-services"],
        icon: "git-branch",
        color: "#059669",
        description: "Intelligent WAN aggregation with automatic failover",
        vendor: "multi-vendor",
      })
    }

    // Internet Gateway
    components.push({
      id: "internet-gateway",
      type: "internet_gateway",
      name: "Internet Gateway",
      x: 1300,
      y: 750,
      width: 200,
      height: 80,
      status: "online",
      category: "connectivity",
      metrics: {
        bandwidth: "10 Gbps",
        latency: 18,
        uptime: 99.8,
      },
      connections: ["firewall-cluster", "connectivity-hub"],
      icon: "globe",
      color: "#6366F1",
      description: "High-speed internet connectivity with DDoS protection",
    })

    // Cloud Services based on cloud integration
    if (config.cloudIntegration) {
      components.push({
        id: "cloud-services",
        type: "cloud_services",
        name: "Multi-Cloud Services",
        x: 1550,
        y: 400,
        width: 200,
        height: 200,
        status: "online",
        category: "cloud",
        metrics: {
          uptime: 99.99,
          latency: 15,
          bandwidth: "50 Gbps",
        },
        connections: ["connectivity-hub", "ztna-gateway"],
        icon: "cloud",
        color: "#3B82F6",
        description: "Multi-cloud services integration",
      })
    }

    // Endpoint Devices based on device types
    components.push({
      id: "endpoint-devices",
      type: "endpoint_devices",
      name: "Endpoint Devices (12,500)",
      x: 600,
      y: 820,
      width: 400,
      height: 100,
      status: "online",
      category: "endpoint",
      metrics: {
        uptime: 94.2,
      },
      connections: ["access-switches", "access-points"],
      icon: "monitor",
      color: "#6B7280",
      description: "Diverse endpoint ecosystem with comprehensive security",
    })

    // Applications based on deployment
    if (config.onPremiseIntegration) {
      components.push({
        id: "on-premise-apps",
        type: "application_server",
        name: "On-Premise Applications",
        x: 1550,
        y: 50,
        width: 200,
        height: 120,
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
    }

    components.push({
      id: "saas-applications",
      type: "saas_applications",
      name: "SaaS Applications",
      x: 1550,
      y: 200,
      width: 200,
      height: 120,
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
      name: "Centralized Policy Engine",
      x: 600,
      y: 950,
      width: 400,
      height: 100,
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

    // Certificate Authority based on PKI requirements
    if (config.authTypes.includes("certificate") || config.authTypes.includes("802.1x")) {
      components.push({
        id: "certificate-authority",
        type: "certificate_authority",
        name: "Internal Certificate Authority",
        x: 1050,
        y: 950,
        width: 200,
        height: 100,
        status: "online",
        category: "security",
        metrics: {
          uptime: 99.98,
        },
        connections: ["portnox-cloud-platform"],
        icon: "file-key",
        color: "#DC2626",
        description: "Enterprise PKI with automated certificate lifecycle management",
      })
    }

    // TACACS+ Server based on device admin configuration
    if (config.deviceAdmin === "tacacs") {
      components.push({
        id: "tacacs-server",
        type: "tacacs_server",
        name: "TACACS+ Server",
        x: 1300,
        y: 950,
        width: 200,
        height: 100,
        status: "online",
        category: "security",
        metrics: {
          connections: 150,
          uptime: 99.95,
        },
        connections: ["portnox-cloud-platform", "core-switch-stack"],
        icon: "lock",
        color: "#DC2626",
        description: "Device administration with command authorization",
        vendor: "portnox",
      })
    }

    generateIntelligentConnections(components, connections)
  }

  // CONNECTIVITY ARCHITECTURE GENERATOR
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
      width: 300,
      height: 120,
      status: "online",
      category: "connectivity",
      connections: ["mpls-circuit", "internet-circuit", "backup-circuit", "core-switch"],
      icon: "router",
      color: "#059669",
      description: "Multi-WAN edge router with intelligent path selection",
      vendor: "cisco",
      model: "ISR 4451",
      metrics: {
        connections: 4,
        throughput: "1 Gbps",
        latency: 5,
        uptime: 99.95,
      },
    })

    // MPLS Circuit
    components.push({
      id: "mpls-circuit",
      type: "mpls_circuit",
      name: "MPLS Primary Circuit",
      x: 200,
      y: 100,
      width: 250,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-edge-router"],
      icon: "cable",
      color: "#3B82F6",
      description: "Primary MPLS connection with guaranteed SLA",
      vendor: "verizon",
      metrics: {
        bandwidth: "500 Mbps",
        latency: 15,
        uptime: 99.9,
      },
    })

    // Internet Circuit
    components.push({
      id: "internet-circuit",
      type: "internet_circuit",
      name: "Internet Backup Circuit",
      x: 1000,
      y: 100,
      width: 250,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-edge-router"],
      icon: "globe",
      color: "#6366F1",
      description: "High-speed internet backup with DDoS protection",
      vendor: "comcast",
      metrics: {
        bandwidth: "1 Gbps",
        latency: 25,
        uptime: 99.5,
      },
    })

    // Backup Circuit
    components.push({
      id: "backup-circuit",
      type: "backup_circuit",
      name: "4G/5G Backup",
      x: 600,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-edge-router"],
      icon: "satellite",
      color: "#8B5CF6",
      description: "Cellular backup for critical connectivity",
      vendor: "verizon",
      metrics: {
        bandwidth: "100 Mbps",
        latency: 50,
        uptime: 99.0,
      },
    })

    // Core Switch
    components.push({
      id: "core-switch",
      type: "core_switch",
      name: "Core Network Switch",
      x: 600,
      y: 500,
      width: 300,
      height: 120,
      status: "online",
      category: "network",
      connections: ["wan-edge-router", "distribution-layer"],
      icon: "server",
      color: "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: config.wiredVendor,
      metrics: {
        connections: 48,
        throughput: "400 Gbps",
        uptime: 99.99,
      },
    })

    // Distribution Layer
    components.push({
      id: "distribution-layer",
      type: "distribution_layer",
      name: "Distribution Layer",
      x: 600,
      y: 700,
      width: 300,
      height: 100,
      status: "online",
      category: "network",
      connections: ["core-switch"],
      icon: "network",
      color: "#6B7280",
      description: "Distribution layer with VLAN management",
      vendor: config.wiredVendor,
      metrics: {
        connections: 144,
        uptime: 99.95,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // AUTHENTICATION FLOW GENERATOR
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
      width: 200,
      height: 120,
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
      x: 400,
      y: 300,
      width: 200,
      height: 120,
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
      x: 700,
      y: 300,
      width: 200,
      height: 120,
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
      name: "Portnox Cloud Platform",
      x: 1000,
      y: 200,
      width: 300,
      height: 150,
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
      name: config.identityProvider.includes("azure_ad") ? "Azure Active Directory" : "Identity Provider",
      x: 1400,
      y: 100,
      width: 250,
      height: 120,
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
      name: "Policy Decision Engine",
      x: 1000,
      y: 400,
      width: 200,
      height: 100,
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

    // Authentication Steps
    components.push({
      id: "auth-step-1",
      type: "auth_step",
      name: "1. EAP Start",
      x: 300,
      y: 150,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      connections: [],
      icon: "zap",
      color: "#3B82F6",
      description: "Initial authentication request",
    })

    components.push({
      id: "auth-step-2",
      type: "auth_step",
      name: "2. Identity Request",
      x: 500,
      y: 150,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      connections: [],
      icon: "zap",
      color: "#3B82F6",
      description: "Request for user identity",
    })

    components.push({
      id: "auth-step-3",
      type: "auth_step",
      name: "3. Certificate Exchange",
      x: 800,
      y: 150,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      connections: [],
      icon: "zap",
      color: "#3B82F6",
      description: "Certificate validation process",
    })

    components.push({
      id: "auth-step-4",
      type: "auth_step",
      name: "4. Policy Decision",
      x: 1100,
      y: 150,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      connections: [],
      icon: "zap",
      color: "#3B82F6",
      description: "Access control decision",
    })

    components.push({
      id: "auth-step-5",
      type: "auth_step",
      name: "5. Access Granted",
      x: 1400,
      y: 300,
      width: 150,
      height: 80,
      status: "online",
      category: "security",
      connections: [],
      icon: "check-circle",
      color: "#10B981",
      description: "Network access granted",
    })

    generateIntelligentConnections(components, connections)
  }

  // PKI ARCHITECTURE GENERATOR
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
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "intermediate-ca-2"],
      icon: "file-key",
      color: "#DC2626",
      description: "Offline root CA for maximum security",
      metrics: {
        certificates: 2,
        uptime: 99.99,
      },
    })

    // Intermediate CAs
    components.push({
      id: "intermediate-ca-1",
      type: "intermediate_ca",
      name: "Issuing CA - User Certificates",
      x: 400,
      y: 300,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["root-ca", "user-certificates"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for user authentication",
      metrics: {
        certificates: 12500,
        uptime: 99.95,
      },
    })

    components.push({
      id: "intermediate-ca-2",
      type: "intermediate_ca",
      name: "Issuing CA - Device Certificates",
      x: 800,
      y: 300,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["root-ca", "device-certificates"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for device authentication",
      metrics: {
        certificates: 8500,
        uptime: 99.95,
      },
    })

    // Certificate Stores
    components.push({
      id: "user-certificates",
      type: "certificate_store",
      name: "User Certificate Store",
      x: 200,
      y: 500,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "scep-server"],
      icon: "users",
      color: "#3B82F6",
      description: "Stores user authentication certificates",
      metrics: {
        certificates: 12500,
        validCerts: 12485,
        expiringSoon: 15,
      },
    })

    components.push({
      id: "device-certificates",
      type: "certificate_store",
      name: "Device Certificate Store",
      x: 600,
      y: 500,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-2", "scep-server"],
      icon: "smartphone",
      color: "#3B82F6",
      description: "Stores device authentication certificates",
      metrics: {
        certificates: 8500,
        validCerts: 8495,
        expiringSoon: 5,
      },
    })

    // SCEP Server
    components.push({
      id: "scep-server",
      type: "scep_server",
      name: "SCEP Enrollment Server",
      x: 1000,
      y: 500,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["user-certificates", "device-certificates", "enrollment-portal"],
      icon: "key",
      color: "#8B5CF6",
      description: "Automated certificate enrollment via SCEP",
      metrics: {
        enrollments: 150,
        uptime: 99.9,
      },
    })

    // Enrollment Portal
    components.push({
      id: "enrollment-portal",
      type: "enrollment_portal",
      name: "Certificate Enrollment Portal",
      x: 1300,
      y: 400,
      width: 200,
      height: 100,
      status: "online",
      category: "application",
      connections: ["scep-server"],
      icon: "monitor",
      color: "#10B981",
      description: "Web-based certificate enrollment interface",
      metrics: {
        requests: 45,
        uptime: 99.8,
      },
    })

    // CRL Distribution Point
    components.push({
      id: "crl-distribution",
      type: "crl_distribution",
      name: "CRL Distribution Point",
      x: 400,
      y: 700,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "intermediate-ca-2"],
      icon: "database",
      color: "#EF4444",
      description: "Certificate revocation list distribution",
      metrics: {
        revokedCerts: 25,
        uptime: 99.95,
      },
    })

    // OCSP Responder
    components.push({
      id: "ocsp-responder",
      type: "ocsp_responder",
      name: "OCSP Responder",
      x: 800,
      y: 700,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "intermediate-ca-2"],
      icon: "check-circle",
      color: "#10B981",
      description: "Real-time certificate status checking",
      metrics: {
        requests: 25000,
        uptime: 99.98,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // POLICY ARCHITECTURE GENERATOR
  const generatePolicyArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Centralized Policy Engine",
      x: 600,
      y: 200,
      width: 300,
      height: 150,
      status: "online",
      category: "management",
      connections: ["policy-repository", "decision-engine", "enforcement-points"],
      icon: "settings",
      color: "#059669",
      description: "AI-powered policy engine with real-time decision making",
      metrics: {
        policies: 156,
        decisions: 2850000,
        latency: 1.5,
        uptime: 99.99,
      },
    })

    // Policy Repository
    components.push({
      id: "policy-repository",
      type: "policy_repository",
      name: "Policy Repository",
      x: 200,
      y: 200,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["policy-engine", "policy-editor"],
      icon: "database",
      color: "#3B82F6",
      description: "Centralized storage for all access policies",
      metrics: {
        policies: 156,
        globalPolicies: 25,
        sitePolicies: 131,
      },
    })

    // Decision Engine
    components.push({
      id: "decision-engine",
      type: "decision_engine",
      name: "Real-time Decision Engine",
      x: 1000,
      y: 200,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["policy-engine", "risk-engine"],
      icon: "zap",
      color: "#F59E0B",
      description: "High-performance policy evaluation engine",
      metrics: {
        decisions: 2850000,
        avgLatency: 1.2,
        uptime: 99.99,
      },
    })

    // Risk Engine
    components.push({
      id: "risk-engine",
      type: "risk_engine",
      name: "Risk Assessment Engine",
      x: 1300,
      y: 200,
      width: 200,
      height: 120,
      status: "online",
      category: "security",
      connections: ["decision-engine", "threat-intelligence"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "AI-powered risk scoring and threat assessment",
      metrics: {
        riskScores: 12500,
        threats: 15,
        uptime: 99.95,
      },
    })

    // Threat Intelligence
    components.push({
      id: "threat-intelligence",
      type: "threat_intelligence",
      name: "Threat Intelligence Feed",
      x: 1300,
      y: 50,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["risk-engine"],
      icon: "radar",
      color: "#8B5CF6",
      description: "Real-time threat intelligence and IOC feeds",
      metrics: {
        feeds: 25,
        indicators: 150000,
        uptime: 99.9,
      },
    })

    // Policy Editor
    components.push({
      id: "policy-editor",
      type: "policy_editor",
      name: "Policy Management Console",
      x: 200,
      y: 50,
      width: 200,
      height: 100,
      status: "online",
      category: "application",
      connections: ["policy-repository"],
      icon: "monitor",
      color: "#10B981",
      description: "Web-based policy creation and management interface",
      metrics: {
        users: 25,
        sessions: 45,
        uptime: 99.8,
      },
    })

    // Enforcement Points
    components.push({
      id: "enforcement-points",
      type: "enforcement_points",
      name: "Policy Enforcement Points",
      x: 600,
      y: 450,
      width: 300,
      height: 120,
      status: "online",
      category: "network",
      connections: ["policy-engine", "network-devices", "firewalls", "wireless-controllers"],
      icon: "shield",
      color: "#6366F1",
      description: "Distributed policy enforcement across network infrastructure",
      metrics: {
        enforcementPoints: 285,
        policies: 156,
        uptime: 99.95,
      },
    })

    // Network Devices
    components.push({
      id: "network-devices",
      type: "network_devices",
      name: "Network Switches",
      x: 200,
      y: 600,
      width: 200,
      height: 100,
      status: "online",
      category: "network",
      connections: ["enforcement-points"],
      icon: "network",
      color: "#6B7280",
      description: "Managed switches with policy enforcement",
      metrics: {
        switches: 48,
        connections: 2304,
        uptime: 99.8,
      },
    })

    // Firewalls
    components.push({
      id: "firewalls",
      type: "firewalls",
      name: "Next-Gen Firewalls",
      x: 600,
      y: 600,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["enforcement-points"],
      icon: "shield",
      color: "#EF4444",
      description: "NGFW with integrated policy enforcement",
      metrics: {
        firewalls: 4,
        rules: 2500,
        uptime: 99.98,
      },
    })

    // Wireless Controllers
    components.push({
      id: "wireless-controllers",
      type: "wireless_controllers",
      name: "Wireless Controllers",
      x: 1000,
      y: 600,
      width: 200,
      height: 100,
      status: "online",
      category: "network",
      connections: ["enforcement-points"],
      icon: "wifi",
      color: "#8B5CF6",
      description: "Wireless infrastructure with policy enforcement",
      metrics: {
        controllers: 2,
        accessPoints: 240,
        uptime: 99.96,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // INTUNE INTEGRATION GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["azure-ad", "conditional-access", "device-compliance", "app-protection"],
      icon: "smartphone",
      color: "#00BCF2",
      description: "Unified endpoint management with comprehensive device and app protection",
      vendor: "microsoft",
      version: "2024.01",
      metrics: {
        devices: 12500,
        policies: 45,
        compliance: 98.5,
        uptime: 99.95,
      },
    })

    // Azure AD Integration
    components.push({
      id: "azure-ad",
      type: "identity_provider",
      name: "Azure Active Directory",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["microsoft-intune", "conditional-access"],
      icon: "users",
      color: "#0078D4",
      description: "Identity provider with seamless Intune integration",
      vendor: "microsoft",
      metrics: {
        users: 12500,
        groups: 150,
        uptime: 99.97,
      },
    })

    // Conditional Access
    components.push({
      id: "conditional-access",
      type: "conditional_access",
      name: "Conditional Access Policies",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["microsoft-intune", "azure-ad", "device-compliance"],
      icon: "shield-check",
      color: "#0078D4",
      description: "Risk-based access control with device compliance",
      vendor: "microsoft",
      metrics: {
        policies: 28,
        evaluations: 2500000,
        uptime: 99.95,
      },
    })

    // Device Compliance
    components.push({
      id: "device-compliance",
      type: "device_compliance",
      name: "Device Compliance Engine",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "security",
      connections: ["microsoft-intune", "conditional-access", "managed-devices"],
      icon: "scan",
      color: "#00BCF2",
      description: "Continuous device compliance monitoring and enforcement",
      vendor: "microsoft",
      metrics: {
        compliantDevices: 12125,
        nonCompliantDevices: 375,
        policies: 15,
      },
    })

    // App Protection
    components.push({
      id: "app-protection",
      type: "app_protection",
      name: "App Protection Policies",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["microsoft-intune", "managed-apps"],
      icon: "shield",
      color: "#00BCF2",
      description: "Application-level data protection and access control",
      vendor: "microsoft",
      metrics: {
        protectedApps: 85,
        policies: 12,
        violations: 3,
      },
    })

    // Managed Devices
    components.push({
      id: "managed-devices",
      type: "managed_devices",
      name: "Managed Devices (12,500)",
      x: 600,
      y: 550,
      width: 350,
      height: 120,
      status: "online",
      category: "endpoint",
      connections: ["device-compliance", "app-protection"],
      icon: "monitor",
      color: "#6B7280",
      description: "Corporate and BYOD devices under Intune management",
      metrics: {
        windows: 8500,
        ios: 2000,
        android: 1500,
        macos: 500,
      },
    })

    // Managed Apps
    components.push({
      id: "managed-apps",
      type: "managed_apps",
      name: "Managed Applications",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "application",
      connections: ["app-protection"],
      icon: "smartphone",
      color: "#10B981",
      description: "Corporate applications with data protection",
      metrics: {
        totalApps: 85,
        requiredApps: 25,
        availableApps: 60,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // JAMF INTEGRATION GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["apple-business-manager", "device-enrollment", "policy-management", "app-catalog"],
      icon: "smartphone",
      color: "#4A90E2",
      description: "Comprehensive Apple device management platform",
      vendor: "jamf",
      version: "10.49.0",
      metrics: {
        devices: 3500,
        policies: 35,
        compliance: 99.2,
        uptime: 99.98,
      },
    })

    // Apple Business Manager
    components.push({
      id: "apple-business-manager",
      type: "device_enrollment_program",
      name: "Apple Business Manager",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["jamf-pro", "device-enrollment"],
      icon: "smartphone",
      color: "#007AFF",
      description: "Apple's device enrollment and app distribution platform",
      vendor: "apple",
      metrics: {
        enrolledDevices: 3500,
        pendingDevices: 150,
        apps: 45,
      },
    })

    // Device Enrollment
    components.push({
      id: "device-enrollment",
      type: "device_enrollment",
      name: "Automated Device Enrollment",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["jamf-pro", "apple-business-manager", "managed-apple-devices"],
      icon: "user-check",
      color: "#4A90E2",
      description: "Zero-touch enrollment for Apple devices",
      vendor: "jamf",
      metrics: {
        enrollmentsToday: 25,
        successRate: 98.5,
        avgTime: "3.2 min",
      },
    })

    // Policy Management
    components.push({
      id: "policy-management",
      type: "policy_management",
      name: "Configuration Profiles",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["jamf-pro", "managed-apple-devices"],
      icon: "settings",
      color: "#4A90E2",
      description: "Centralized policy and configuration management",
      vendor: "jamf",
      metrics: {
        profiles: 35,
        deployedPolicies: 28,
        pendingUpdates: 7,
      },
    })

    // App Catalog
    components.push({
      id: "app-catalog",
      type: "app_catalog",
      name: "Self Service App Catalog",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "application",
      connections: ["jamf-pro", "managed-apple-devices"],
      icon: "smartphone",
      color: "#10B981",
      description: "Self-service portal for approved applications",
      vendor: "jamf",
      metrics: {
        availableApps: 65,
        installations: 1250,
        userRating: 4.7,
      },
    })

    // Managed Apple Devices
    components.push({
      id: "managed-apple-devices",
      type: "managed_devices",
      name: "Managed Apple Devices (3,500)",
      x: 600,
      y: 550,
      width: 350,
      height: 120,
      status: "online",
      category: "endpoint",
      connections: ["device-enrollment", "policy-management", "app-catalog"],
      icon: "monitor",
      color: "#6B7280",
      description: "Corporate Mac, iPhone, and iPad devices",
      metrics: {
        macos: 2000,
        ios: 1200,
        ipados: 300,
        compliance: 99.2,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // DEVICE ONBOARDING GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "application",
      connections: ["certificate-enrollment", "device-registration", "policy-assignment"],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service device onboarding with automated workflows",
      vendor: "portnox",
      metrics: {
        dailyOnboarding: 125,
        successRate: 96.8,
        avgTime: "4.5 min",
      },
    })

    // Certificate Enrollment
    components.push({
      id: "certificate-enrollment",
      type: "certificate_enrollment",
      name: "Certificate Enrollment Service",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["onboarding-portal", "certificate-authority"],
      icon: "key",
      color: "#DC2626",
      description: "Automated certificate provisioning for devices",
      vendor: "portnox",
      metrics: {
        certificates: 12500,
        pending: 25,
        expiringSoon: 150,
      },
    })

    // Device Registration
    components.push({
      id: "device-registration",
      type: "device_registration",
      name: "Device Registration Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["onboarding-portal", "device-inventory"],
      icon: "smartphone",
      color: "#3B82F6",
      description: "Automated device discovery and registration",
      vendor: "portnox",
      metrics: {
        registeredDevices: 12500,
        pendingApproval: 45,
        rejectedDevices: 12,
      },
    })

    // Policy Assignment
    components.push({
      id: "policy-assignment",
      type: "policy_assignment",
      name: "Automated Policy Assignment",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["onboarding-portal", "policy-engine"],
      icon: "settings",
      color: "#059669",
      description: "Intelligent policy assignment based on device attributes",
      vendor: "portnox",
      metrics: {
        policies: 156,
        assignments: 12500,
        exceptions: 25,
      },
    })

    // Certificate Authority
    components.push({
      id: "certificate-authority",
      type: "certificate_authority",
      name: "Internal Certificate Authority",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["certificate-enrollment"],
      icon: "file-key",
      color: "#DC2626",
      description: "Enterprise PKI for device certificates",
      metrics: {
        issuedCerts: 12500,
        revokedCerts: 25,
        uptime: 99.98,
      },
    })

    // Device Inventory
    components.push({
      id: "device-inventory",
      type: "device_inventory",
      name: "Device Inventory Database",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["device-registration"],
      icon: "database",
      color: "#6B7280",
      description: "Comprehensive device inventory and asset tracking",
      vendor: "portnox",
      metrics: {
        totalDevices: 12500,
        activeDevices: 11850,
        inactiveDevices: 650,
      },
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Decision Engine",
      x: 600,
      y: 550,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["policy-assignment"],
      icon: "zap",
      color: "#059669",
      description: "Real-time policy evaluation and enforcement",
      vendor: "portnox",
      metrics: {
        decisions: 2850000,
        latency: 1.2,
        uptime: 99.99,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // RADSEC PROXY ARCHITECTURE GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "security",
      connections: ["portnox-cloud", "radius-clients", "load-balancer"],
      icon: "router",
      color: config.customColors.secondary,
      description: "High-availability RADSEC proxy cluster with intelligent load balancing",
      vendor: "portnox",
      version: "v2.8.1",
      metrics: {
        proxies: 3,
        connections: 8500,
        throughput: "15.2 Gbps",
        latency: 2,
        uptime: 99.99,
      },
    })

    // Portnox Cloud
    components.push({
      id: "portnox-cloud",
      type: "nac_platform",
      name: "Portnox Cloud Platform",
      x: 600,
      y: 350,
      width: 350,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["radsec-proxy-cluster", "policy-engine", "identity-providers"],
      icon: "cloud",
      color: config.customColors.primary,
      description: "Cloud NAC platform with centralized authentication",
      vendor: "portnox",
      metrics: {
        authentications: 2850000,
        policies: 156,
        uptime: 99.98,
      },
    })

    // Load Balancer
    components.push({
      id: "load-balancer",
      type: "load_balancer",
      name: "RADSEC Load Balancer",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["radsec-proxy-cluster", "radius-clients"],
      icon: "git-branch",
      color: "#059669",
      description: "Intelligent load balancing for RADSEC traffic",
      vendor: "f5",
      metrics: {
        connections: 8500,
        throughput: "20 Gbps",
        uptime: 99.95,
      },
    })

    // RADIUS Clients
    components.push({
      id: "radius-clients",
      type: "radius_clients",
      name: "Network Infrastructure",
      x: 1000,
      y: 100,
      width: 250,
      height: 150,
      status: "online",
      category: "network",
      connections: ["radsec-proxy-cluster", "load-balancer"],
      icon: "network",
      color: "#6B7280",
      description: "Switches, APs, and other RADIUS clients",
      vendor: "multi-vendor",
      metrics: {
        switches: 48,
        accessPoints: 240,
        firewalls: 4,
      },
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Decision Engine",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["portnox-cloud"],
      icon: "settings",
      color: "#059669",
      description: "Centralized policy evaluation and decision making",
      vendor: "portnox",
      metrics: {
        policies: 156,
        decisions: 2850000,
        latency: 1.5,
      },
    })

    // Identity Providers
    components.push({
      id: "identity-providers",
      type: "identity_providers",
      name: "Identity Providers",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["portnox-cloud"],
      icon: "users",
      color: "#0078D4",
      description: "Integrated identity providers for user authentication",
      vendor: "multi-vendor",
      metrics: {
        providers: 3,
        users: 12500,
        uptime: 99.97,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // ZTNA ARCHITECTURE GENERATOR
  const generateZTNAArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // ZTNA Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Network Access Gateway",
      x: 600,
      y: 100,
      width: 400,
      height: 150,
      status: "online",
      category: "security",
      connections: ["identity-verification", "device-trust", "application-access", "policy-enforcement"],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with continuous verification and micro-segmentation",
      vendor: "portnox",
      version: "v3.2.1",
      metrics: {
        connections: 8950,
        throughput: "25.5 Gbps",
        latency: 3,
        uptime: 99.99,
        users: 12500,
        sessions: 8200,
      },
    })

    // Identity Verification
    components.push({
      id: "identity-verification",
      type: "identity_verification",
      name: "Identity Verification Engine",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["ztna-gateway", "mfa-service"],
      icon: "fingerprint",
      color: "#0078D4",
      description: "Multi-factor identity verification with risk assessment",
      vendor: "portnox",
      metrics: {
        verifications: 125000,
        successRate: 98.5,
        riskScore: 15,
      },
    })

    // Device Trust
    components.push({
      id: "device-trust",
      type: "device_trust",
      name: "Device Trust Engine",
      x: 1100,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["ztna-gateway", "device-compliance"],
      icon: "scan",
      color: "#059669",
      description: "Continuous device posture assessment and trust scoring",
      vendor: "portnox",
      metrics: {
        devices: 12500,
        trustScore: 92,
        violations: 25,
      },
    })

    // Application Access
    components.push({
      id: "application-access",
      type: "application_access",
      name: "Application Access Control",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "application",
      connections: ["ztna-gateway", "protected-applications"],
      icon: "lock",
      color: "#DC2626",
      description: "Granular application access control with least privilege",
      vendor: "portnox",
      metrics: {
        applications: 85,
        accessRequests: 45000,
        deniedRequests: 1250,
      },
    })

    // Policy Enforcement
    components.push({
      id: "policy-enforcement",
      type: "policy_enforcement",
      name: "Policy Enforcement Engine",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["ztna-gateway"],
      icon: "shield-check",
      color: "#059669",
      description: "Real-time policy enforcement with adaptive controls",
      vendor: "portnox",
      metrics: {
        policies: 156,
        enforcements: 2850000,
        violations: 125,
      },
    })

    // MFA Service
    components.push({
      id: "mfa-service",
      type: "mfa_service",
      name: "Multi-Factor Authentication",
      x: 200,
      y: 550,
      width: 250,
      height: 100,
      status: "online",
      category: "security",
      connections: ["identity-verification"],
      icon: "key",
      color: "#DC2626",
      description: "Advanced MFA with multiple authentication factors",
      vendor: "microsoft",
      metrics: {
        challenges: 85000,
        successRate: 97.8,
        methods: 5,
      },
    })

    // Device Compliance
    components.push({
      id: "device-compliance",
      type: "device_compliance",
      name: "Device Compliance Service",
      x: 1100,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["device-trust"],
      icon: "check-circle",
      color: "#10B981",
      description: "Continuous device compliance monitoring",
      vendor: "microsoft",
      metrics: {
        compliantDevices: 12125,
        nonCompliant: 375,
        policies: 28,
      },
    })

    // Protected Applications
    components.push({
      id: "protected-applications",
      type: "protected_applications",
      name: "Protected Applications",
      x: 600,
      y: 550,
      width: 300,
      height: 120,
      status: "online",
      category: "application",
      connections: ["application-access"],
      icon: "server",
      color: "#6B7280",
      description: "Business-critical applications protected by ZTNA",
      metrics: {
        applications: 85,
        users: 12500,
        sessions: 8200,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // GUEST PORTAL GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "application",
      connections: ["captive-portal", "guest-registration", "sponsor-approval", "guest-network"],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service guest access portal with customizable branding",
      vendor: "portnox",
      metrics: {
        dailyGuests: 250,
        activeGuests: 125,
        successRate: 94.5,
      },
    })

    // Captive Portal
    components.push({
      id: "captive-portal",
      type: "captive_portal",
      name: "Captive Portal Engine",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "application",
      connections: ["guest-portal", "guest-authentication"],
      icon: "wifi",
      color: "#3B82F6",
      description: "Customizable captive portal with terms acceptance",
      vendor: "portnox",
      metrics: {
        redirects: 1250,
        authentications: 950,
        customizations: 5,
      },
    })

    // Guest Registration
    components.push({
      id: "guest-registration",
      type: "guest_registration",
      name: "Guest Registration Service",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["guest-portal", "guest-database"],
      icon: "user-check",
      color: "#059669",
      description: "Automated guest registration with data collection",
      vendor: "portnox",
      metrics: {
        registrations: 250,
        pending: 15,
        approved: 235,
      },
    })

    // Sponsor Approval
    components.push({
      id: "sponsor-approval",
      type: "sponsor_approval",
      name: "Sponsor Approval Workflow",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["guest-portal", "notification-service"],
      icon: "users",
      color: "#F59E0B",
      description: "Employee sponsor approval workflow for guest access",
      vendor: "portnox",
      metrics: {
        pendingApprovals: 15,
        avgApprovalTime: "12 min",
        sponsors: 125,
      },
    })

    // Guest Network
    components.push({
      id: "guest-network",
      type: "guest_network",
      name: "Isolated Guest Network",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["guest-portal", "internet-access"],
      icon: "wifi",
      color: "#8B5CF6",
      description: "Segmented guest network with internet-only access",
      vendor: "multi-vendor",
      metrics: {
        activeConnections: 125,
        bandwidth: "500 Mbps",
        uptime: 99.5,
      },
    })

    // Guest Authentication
    components.push({
      id: "guest-authentication",
      type: "guest_authentication",
      name: "Guest Authentication Service",
      x: 200,
      y: 550,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["captive-portal"],
      icon: "key",
      color: "#DC2626",
      description: "Secure guest authentication with time-based access",
      vendor: "portnox",
      metrics: {
        authentications: 950,
        failures: 58,
        avgDuration: "2.5 hours",
      },
    })

    // Guest Database
    components.push({
      id: "guest-database",
      type: "guest_database",
      name: "Guest Database",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["guest-registration"],
      icon: "database",
      color: "#6B7280",
      description: "Secure storage of guest information and access logs",
      vendor: "portnox",
      metrics: {
        totalGuests: 15000,
        activeGuests: 125,
        expiredAccounts: 250,
      },
    })

    // Notification Service
    components.push({
      id: "notification-service",
      type: "notification_service",
      name: "Notification Service",
      x: 600,
      y: 550,
      width: 250,
      height: 100,
      status: "online",
      category: "application",
      connections: ["sponsor-approval"],
      icon: "activity",
      color: "#10B981",
      description: "Email and SMS notifications for sponsors and guests",
      vendor: "portnox",
      metrics: {
        emailsSent: 1250,
        smsSent: 450,
        deliveryRate: 98.5,
      },
    })

    // Internet Access
    components.push({
      id: "internet-access",
      type: "internet_access",
      name: "Internet Gateway",
      x: 200,
      y: 750,
      width: 200,
      height: 80,
      status: "online",
      category: "connectivity",
      connections: ["guest-network"],
      icon: "globe",
      color: "#6366F1",
      description: "Filtered internet access for guest users",
      metrics: {
        bandwidth: "1 Gbps",
        uptime: 99.8,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // IOT ONBOARDING GENERATOR
  const generateIoTOnboarding = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // IoT Discovery Engine
    components.push({
      id: "iot-discovery-engine",
      type: "iot_discovery",
      name: "IoT Device Discovery Engine",
      x: 600,
      y: 100,
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["device-profiling", "automated-onboarding", "iot-policy-engine"],
      icon: "radar",
      color: "#059669",
      description: "AI-powered IoT device discovery and classification",
      vendor: "portnox",
      metrics: {
        devicesDiscovered: 8500,
        classified: 8125,
        unclassified: 375,
        accuracy: 95.6,
      },
    })

    // Device Profiling
    components.push({
      id: "device-profiling",
      type: "device_profiling",
      name: "Device Profiling Service",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["iot-discovery-engine", "device-fingerprinting"],
      icon: "fingerprint",
      color: "#3B82F6",
      description: "Advanced device fingerprinting and behavior analysis",
      vendor: "portnox",
      metrics: {
        profiles: 450,
        fingerprints: 8500,
        behaviorModels: 125,
      },
    })

    // Automated Onboarding
    components.push({
      id: "automated-onboarding",
      type: "automated_onboarding",
      name: "Automated IoT Onboarding",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["iot-discovery-engine", "iot-certificate-service"],
      icon: "zap",
      color: "#10B981",
      description: "Zero-touch IoT device onboarding with policy assignment",
      vendor: "portnox",
      metrics: {
        onboardedDevices: 8125,
        pending: 125,
        failed: 25,
        avgTime: "45 seconds",
      },
    })

    // IoT Policy Engine
    components.push({
      id: "iot-policy-engine",
      type: "iot_policy_engine",
      name: "IoT Policy Engine",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["iot-discovery-engine", "network-segmentation"],
      icon: "settings",
      color: "#059669",
      description: "Specialized policy engine for IoT device management",
      vendor: "portnox",
      metrics: {
        iotPolicies: 85,
        assignments: 8125,
        violations: 15,
      },
    })

    // Device Fingerprinting
    components.push({
      id: "device-fingerprinting",
      type: "device_fingerprinting",
      name: "Device Fingerprinting Database",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["device-profiling"],
      icon: "database",
      color: "#6B7280",
      description: "Comprehensive database of IoT device fingerprints",
      vendor: "portnox",
      metrics: {
        fingerprints: 8500,
        vendors: 250,
        deviceTypes: 450,
      },
    })

    // IoT Certificate Service
    components.push({
      id: "iot-certificate-service",
      type: "iot_certificate_service",
      name: "IoT Certificate Service",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["automated-onboarding"],
      icon: "key",
      color: "#DC2626",
      description: "Automated certificate provisioning for IoT devices",
      vendor: "portnox",
      metrics: {
        certificates: 8125,
        pending: 25,
        expired: 150,
      },
    })

    // Network Segmentation
    components.push({
      id: "network-segmentation",
      type: "network_segmentation",
      name: "IoT Network Segmentation",
      x: 600,
      y: 550,
      width: 300,
      height: 120,
      status: "online",
      category: "network",
      connections: ["iot-policy-engine", "iot-vlans"],
      icon: "layers3",
      color: "#8B5CF6",
      description: "Automated network segmentation for IoT devices",
      vendor: "multi-vendor",
      metrics: {
        segments: 25,
        devices: 8125,
        vlans: 15,
      },
    })

    // IoT VLANs
    components.push({
      id: "iot-vlans",
      type: "iot_vlans",
      name: "IoT VLANs",
      x: 600,
      y: 750,
      width: 300,
      height: 100,
      status: "online",
      category: "network",
      connections: ["network-segmentation"],
      icon: "network",
      color: "#6B7280",
      description: "Dedicated VLANs for different IoT device categories",
      vendor: "multi-vendor",
      metrics: {
        vlans: 15,
        devices: 8125,
        utilization: 65,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // TACACS ARCHITECTURE GENERATOR
  const generateTACACSArchitecture = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // TACACS+ Server
    components.push({
      id: "tacacs-server",
      type: "tacacs_server",
      name: "TACACS+ Authentication Server",
      x: 600,
      y: 100,
      width: 350,
      height: 150,
      status: "online",
      category: "security",
      connections: ["network-devices", "command-authorization", "accounting-service", "admin-users"],
      icon: "lock",
      color: "#DC2626",
      description: "Centralized TACACS+ server for network device administration",
      vendor: "portnox",
      version: "v3.1.2",
      metrics: {
        authentications: 15000,
        authorizations: 125000,
        accounting: 85000,
        uptime: 99.95,
      },
    })

    // Network Devices
    components.push({
      id: "network-devices",
      type: "network_devices",
      name: "Managed Network Devices",
      x: 200,
      y: 100,
      width: 250,
      height: 150,
      status: "online",
      category: "network",
      connections: ["tacacs-server"],
      icon: "network",
      color: "#6B7280",
      description: "Switches, routers, and firewalls using TACACS+ authentication",
      vendor: "multi-vendor",
      metrics: {
        switches: 48,
        routers: 12,
        firewalls: 4,
        totalDevices: 64,
      },
    })

    // Command Authorization
    components.push({
      id: "command-authorization",
      type: "command_authorization",
      name: "Command Authorization Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["tacacs-server", "privilege-levels"],
      icon: "shield-check",
      color: "#059669",
      description: "Granular command authorization based on user roles",
      vendor: "portnox",
      metrics: {
        commands: 125000,
        authorized: 118750,
        denied: 6250,
        policies: 25,
      },
    })

    // Accounting Service
    components.push({
      id: "accounting-service",
      type: "accounting_service",
      name: "TACACS+ Accounting Service",
      x: 600,
      y: 350,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["tacacs-server", "audit-logs"],
      icon: "activity",
      color: "#3B82F6",
      description: "Comprehensive logging and accounting of administrative actions",
      vendor: "portnox",
      metrics: {
        sessions: 8500,
        commands: 125000,
        logEntries: 285000,
      },
    })

    // Admin Users
    components.push({
      id: "admin-users",
      type: "admin_users",
      name: "Network Administrators",
      x: 200,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["tacacs-server", "role-based-access"],
      icon: "users",
      color: "#0078D4",
      description: "Network administrators with role-based access",
      metrics: {
        totalAdmins: 25,
        activeAdmins: 18,
        privilegeLevels: 5,
      },
    })

    // Privilege Levels
    components.push({
      id: "privilege-levels",
      type: "privilege_levels",
      name: "Privilege Level Management",
      x: 1000,
      y: 350,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["command-authorization"],
      icon: "key",
      color: "#F59E0B",
      description: "Hierarchical privilege levels for command authorization",
      vendor: "portnox",
      metrics: {
        levels: 5,
        assignments: 25,
        policies: 15,
      },
    })

    // Audit Logs
    components.push({
      id: "audit-logs",
      type: "audit_logs",
      name: "Audit Log Repository",
      x: 600,
      y: 550,
      width: 300,
      height: 120,
      status: "online",
      category: "management",
      connections: ["accounting-service"],
      icon: "database",
      color: "#6B7280",
      description: "Centralized repository for all administrative audit logs",
      vendor: "portnox",
      metrics: {
        logEntries: 285000,
        retention: "7 years",
        searchable: true,
      },
    })

    // Role-based Access
    components.push({
      id: "role-based-access",
      type: "role_based_access",
      name: "Role-Based Access Control",
      x: 200,
      y: 550,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["admin-users"],
      icon: "shield",
      color: "#8B5CF6",
      description: "Fine-grained role-based access control for administrators",
      vendor: "portnox",
      metrics: {
        roles: 8,
        permissions: 45,
        assignments: 25,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // RISK POLICY ARCHITECTURE GENERATOR
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
      width: 350,
      height: 150,
      status: "online",
      category: "security",
      connections: ["risk-dashboard", "incident-response", "threat-intelligence", "behavioral-analytics"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Comprehensive risk assessment and threat analysis platform",
      vendor: "portnox",
      metrics: {
        riskAssessments: 12500,
        threats: 45,
        incidents: 8,
        uptime: 99.95,
      },
    })

    // Risk Dashboard
    components.push({
      id: "risk-dashboard",
      type: "risk_dashboard",
      name: "Risk Management Dashboard",
      x: 1000,
      y: 400,
      width: 200,
      height: 120,
      status: "online",
      category: "application",
      connections: ["risk-assessment-platform"],
      icon: "monitor",
      color: "#3B82F6",
      description: "Executive risk visibility and management interface",
      metrics: {
        dashboards: 5,
        users: 25,
        uptime: 99.8,
      },
    })

    // Incident Response
    components.push({
      id: "incident-response",
      type: "incident_response",
      name: "Automated Incident Response",
      x: 1300,
      y: 400,
      width: 200,
      height: 120,
      status: "online",
      category: "security",
      connections: ["risk-assessment-platform"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Automated response to high-risk events",
      metrics: {
        incidents: 15,
        automated: 12,
        uptime: 99.9,
      },
    })

    // Threat Intelligence
    components.push({
      id: "threat-intelligence",
      type: "threat_intelligence",
      name: "Threat Intelligence Feed",
      x: 200,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["risk-assessment-platform"],
      icon: "radar",
      color: "#8B5CF6",
      description: "Real-time threat intelligence and IOC feeds",
      metrics: {
        feeds: 25,
        indicators: 150000,
        uptime: 99.9,
      },
    })

    // Behavioral Analytics
    components.push({
      id: "behavioral-analytics",
      type: "behavioral_analytics",
      name: "Behavioral Analytics Engine",
      x: 600,
      y: 400,
      width: 300,
      height: 120,
      status: "online",
      category: "security",
      connections: ["risk-assessment-platform"],
      icon: "activity",
      color: "#059669",
      description: "AI-powered behavioral analysis and anomaly detection",
      vendor: "portnox",
      metrics: {
        profiles: 12500,
        anomalies: 125,
        accuracy: 94.5,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // MULTI-SITE ARCHITECTURE GENERATOR
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
      width: 300,
      height: 150,
      status: "online",
      category: "network",
      connections: ["branch-office-1", "branch-office-2", "remote-sites", "data-center"],
      icon: "building",
      color: config.customColors.primary,
      description: `Main headquarters with centralized NAC management for ${selectedIndustry}`,
      metrics: {
        users: 5000,
        devices: 8500,
        sites: 25,
        uptime: 99.98,
      },
    })

    // Data Center
    components.push({
      id: "data-center",
      type: "data_center",
      name: "Corporate Data Center",
      x: 600,
      y: 50,
      width: 300,
      height: 100,
      status: "online",
      category: "network",
      connections: ["headquarters", "portnox-cloud-dc"],
      icon: "server",
      color: "#059669",
      description: "Primary data center with core infrastructure",
      metrics: {
        servers: 250,
        storage: "500 TB",
        uptime: 99.99,
      },
    })

    // Branch Office 1
    components.push({
      id: "branch-office-1",
      type: "branch_office",
      name: "Regional Branch Office",
      x: 200,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building-2",
      color: "#3B82F6",
      description: "Regional office with local NAC enforcement",
      metrics: {
        users: 500,
        devices: 850,
        uptime: 99.5,
      },
    })

    // Branch Office 2
    components.push({
      id: "branch-office-2",
      type: "branch_office",
      name: "Remote Branch Office",
      x: 1000,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building-2",
      color: "#3B82F6",
      description: "Remote office with cloud-managed NAC",
      metrics: {
        users: 200,
        devices: 350,
        uptime: 99.2,
      },
    })

    // Remote Sites
    components.push({
      id: "remote-sites",
      type: "remote_sites",
      name: "Remote Sites (15x)",
      x: 600,
      y: 400,
      width: 300,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "globe",
      color: "#8B5CF6",
      description: "Distributed remote sites with centralized management",
      metrics: {
        sites: 15,
        users: 1500,
        devices: 2250,
        uptime: 98.8,
      },
    })

    // Portnox Cloud DC
    components.push({
      id: "portnox-cloud-dc",
      type: "cloud_datacenter",
      name: "Portnox Cloud Data Center",
      x: 1000,
      y: 50,
      width: 250,
      height: 100,
      status: "online",
      category: "cloud",
      connections: ["data-center"],
      icon: "cloud",
      color: config.customColors.primary,
      description: "Portnox cloud infrastructure and services",
      vendor: "portnox",
      metrics: {
        regions: 3,
        availability: 99.99,
        latency: 5,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // CLOUD INTEGRATION GENERATOR
  const generateCloudIntegration = (
    components: DiagramComponent[],
    connections: Connection[],
    config: ArchitectureConfig,
  ) => {
    // Multi-Cloud Hub
    components.push({
      id: "multi-cloud-hub",
      type: "multi_cloud_hub",
      name: "Multi-Cloud Integration Hub",
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "cloud",
      connections: ["aws-services", "azure-services", "google-cloud"],
      icon: "cloud",
      color: "#3B82F6",
      description: "Centralized hub for multi-cloud service integration",
      metrics: {
        clouds: 3,
        services: 45,
        uptime: 99.99,
      },
    })

    // AWS Services
    components.push({
      id: "aws-services",
      type: "aws_services",
      name: "AWS Services",
      x: 200,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#FF9900",
      description: "Amazon Web Services integration",
      vendor: "aws",
      metrics: {
        services: 15,
        uptime: 99.99,
      },
    })

    // Azure Services
    components.push({
      id: "azure-services",
      type: "azure_services",
      name: "Microsoft Azure Services",
      x: 1000,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#0078D4",
      description: "Microsoft Azure services integration",
      vendor: "microsoft",
      metrics: {
        services: 18,
        uptime: 99.95,
      },
    })

    // Google Cloud
    components.push({
      id: "google-cloud",
      type: "google_cloud",
      name: "Google Cloud Platform",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#4285F4",
      description: "Google Cloud Platform services",
      vendor: "google",
      metrics: {
        services: 12,
        uptime: 99.9,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // WIRELESS INFRASTRUCTURE GENERATOR
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
      name: `${wirelessVendorInfo?.label || config.wirelessVendor.toUpperCase()} Wireless Controller Cluster`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["access-points", "wireless-management"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-availability wireless controller cluster",
      vendor: config.wirelessVendor,
      metrics: {
        controllers: 3,
        accessPoints: 240,
        clients: 2850,
        uptime: 99.96,
      },
    })

    // Access Points
    components.push({
      id: "access-points",
      type: "access_points",
      name: "WiFi 6E Access Points (240x)",
      x: 600,
      y: 400,
      width: 350,
      height: 120,
      status: "online",
      category: "network",
      connections: ["wireless-controller-cluster"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-density WiFi 6E access points with advanced security",
      vendor: config.wirelessVendor,
      metrics: {
        accessPoints: 240,
        clients: 2850,
        throughput: "28 Gbps",
        uptime: 99.92,
      },
    })

    // Wireless Management
    components.push({
      id: "wireless-management",
      type: "wireless_management",
      name: "Wireless Management Platform",
      x: 200,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["wireless-controller-cluster"],
      icon: "settings",
      color: "#059669",
      description: "Centralized wireless network management and monitoring",
      vendor: config.wirelessVendor,
      metrics: {
        sites: 25,
        accessPoints: 240,
        uptime: 99.8,
      },
    })

    generateIntelligentConnections(components, connections)
  }

  // WIRED INFRASTRUCTURE GENERATOR
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
      name: `${wiredVendorInfo?.label || config.wiredVendor.toUpperCase()} Core Switch Stack`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["distribution-switches"],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: config.wiredVendor,
      metrics: {
        switches: 4,
        connections: 192,
        throughput: "800 Gbps",
        uptime: 99.99,
      },
    })

    // Distribution Switches
    components.push({
      id: "distribution-switches",
      type: "distribution_switches",
      name: "Distribution Layer Switches",
      x: 600,
      y: 400,
      width: 350,
      height: 120,
      status: "online",
      category: "network",
      connections: ["core-switch-stack", "access-switches"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "Distribution layer with advanced routing and VLAN management",
      vendor: config.wiredVendor,
      metrics: {
        switches: 12,
        ports: 576,
        vlans: 25,
        uptime: 99.95,
      },
    })

    // Access Switches
    components.push({
      id: "access-switches",
      type: "access_switches",
      name: "Access Layer Switches (48x)",
      x: 600,
      y: 600,
      width: 350,
      height: 120,
      status: "online",
      category: "network",
      connections: ["distribution-switches"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "PoE+ enabled access switches with 802.1X authentication",
      vendor: config.wiredVendor,
      metrics: {
        switches: 48,
        ports: 2304,
        poeDevices: 1850,
        uptime: 99.8,
      },
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
                ? Math.max(10, Math.min(90, component.metrics.cpu + (Math.random() - 0.5) * 10)) ||
                  component.metrics.cpu
                : undefined,
              memory: component.metrics.memory
                ? Math.max(20, Math.min(95, component.metrics.memory + (Math.random() - 0.5) * 8)) ||
                  component.metrics.memory
                : undefined,
              network: component.metrics.network
                ? Math.max(5, Math.min(100, component.metrics.network + (Math.random() - 0.5) * 15)) ||
                  component.metrics.network
                : undefined,
              latency: component.metrics.latency
                ? Math.max(1, component.metrics.latency + (Math.random() - 0.5) * 2) || component.metrics.latency
                : undefined,
              throughput: component.metrics.throughput,
              connections: component.metrics.connections
                ? Math.max(
                    0,
                    Math.min(90000, component.metrics.connections + Math.floor((Math.random() - 0.5) * 1000)),
                  ) || component.metrics.connections
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

  const handlePanelDrag = (e: React.MouseEvent) => {
    if (!isDraggingPanel) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const newX = Math.max(0, Math.min(rect.width - 450, e.clientX - rect.left - dragStart.x))
      const newY = Math.max(0, Math.min(rect.height - 700, e.clientY - rect.top - dragStart.y))
      setControlPanelPosition({ x: newX, y: newY })
    }
  }

  const handlePanelDragStart = (e: React.MouseEvent) => {
    setIsDraggingPanel(true)
    const rect = controlPanelRef.current?.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (rect && containerRect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handlePanelDragEnd = () => {
    setIsDraggingPanel(false)
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
        canvas.width = img.width
        canvas.height = img.height
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
  }

  useEffect(() => {
    if (isDraggingPanel) {
      document.addEventListener("mousemove", handlePanelDrag as any)
      document.addEventListener("mouseup", handlePanelDragEnd)
      return () => {
        document.removeEventListener("mousemove", handlePanelDrag as any)
        document.removeEventListener("mouseup", handlePanelDragEnd)
      }
    }
  }, [isDraggingPanel, dragStart])

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
        style={{ cursor: "pointer" }}
        className="component-group"
      >
        {/* Component Background */}
        <rect
          width={component.width}
          height={component.height}
          rx={12}
          fill={component.color}
          fillOpacity={0.1}
          stroke={component.color}
          strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
          strokeOpacity={isSelected ? 1 : 0.6}
          className="component-background"
        />

        {/* Status Indicator */}
        <circle cx={component.width - 15} cy={15} r={6} fill={STATUS_COLORS[component.status]} />

        {/* Component Icon */}
        <foreignObject x={15} y={15} width={32} height={32}>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: component.color + "20" }}
          >
            <IconComponent size={20} color={component.color} />
          </div>
        </foreignObject>

        {/* Component Name */}
        <text x={55} y={30} fontSize={14} fontWeight="600" fill="#1F2937" className="component-name">
          {component.name}
        </text>

        {/* Component Description */}
        {showLabels && (
          <text x={15} y={55} fontSize={11} fill="#6B7280" className="component-description">
            <tspan x={15} dy={0}>
              {component.description.length > 50
                ? `${component.description.substring(0, 50)}...`
                : component.description}
            </tspan>
          </text>
        )}

        {/* Vendor Badge */}
        {component.vendor && (
          <>
            <rect
              x={component.width - 120}
              y={component.height - 35}
              width={110}
              height={30}
              rx={15}
              fill={component.color}
              fillOpacity={0.1}
              stroke={component.color}
              strokeWidth={1}
            />
            <text
              x={component.width - 65}
              y={component.height - 22}
              fontSize={9}
              textAnchor="middle"
              fill={component.color}
              fontWeight="600"
            >
              {component.vendor.toUpperCase()}
            </text>
            {component.model && (
              <text x={component.width - 65} y={component.height - 12} fontSize={8} textAnchor="middle" fill="#6B7280">
                {component.model}
              </text>
            )}
          </>
        )}

        {/* Metrics Display */}
        {showMetrics && component.metrics && (
          <g transform={`translate(15, ${component.height - 45})`}>
            {component.metrics.cpu && !isNaN(component.metrics.cpu) && (
              <text fontSize={9} fill="#374151">
                <tspan>CPU: {Math.round(component.metrics.cpu)}%</tspan>
              </text>
            )}
            {component.metrics.memory && !isNaN(component.metrics.memory) && (
              <text fontSize={9} fill="#374151" x={70}>
                <tspan>RAM: {Math.round(component.metrics.memory)}%</tspan>
              </text>
            )}
            {component.metrics.uptime && !isNaN(component.metrics.uptime) && (
              <text fontSize={9} fill="#374151" x={140}>
                <tspan>Uptime: {component.metrics.uptime.toFixed(2)}%</tspan>
              </text>
            )}
          </g>
        )}

        {/* Animation Effects */}
        {localConfig.animations && animationActive && (
          <g className="animation-effects">
            {/* Data flow animation */}
            <circle cx={component.width / 2} cy={component.height / 2} r={4} fill={component.color} fillOpacity={0.6}>
              <animate attributeName="r" values="4;12;4" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Pulse effect for selected component */}
            {isSelected && (
              <rect
                width={component.width}
                height={component.height}
                rx={12}
                fill="none"
                stroke={component.color}
                strokeWidth={2}
                strokeOpacity={0.8}
              >
                <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
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
    const pathData = `M ${sourceX} ${sourceY} Q ${midX} ${midY - 50} ${targetX} ${targetY}`

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
          strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
          strokeOpacity={isSelected ? 1 : isHovered ? 0.8 : 0.6}
          strokeDasharray={connection.type === "vpn" ? "5,5" : "none"}
          markerEnd="url(#arrowhead)"
        />

        {/* Connection Label */}
        {showLabels && (
          <text x={midX} y={midY - 60} fontSize={10} fill="#374151" textAnchor="middle" className="connection-label">
            {connection.protocol}
          </text>
        )}

        {/* Data Flow Animation */}
        {localConfig.animations && animationActive && (
          <circle r={3} fill={connectionColor} fillOpacity={0.8}>
            <animateMotion dur="4s" repeatCount="indefinite" path={pathData} />
          </circle>
        )}

        {/* Connection Status Indicator */}
        <circle
          cx={midX}
          cy={midY}
          r={4}
          fill={connection.status === "active" ? "#10B981" : connection.status === "error" ? "#EF4444" : "#F59E0B"}
          fillOpacity={0.8}
        />
      </g>
    )
  }

  // Industry options for configuration
  const industryOptions = [
    { value: "healthcare", label: "Healthcare", icon: Heart, color: "#EF4444" },
    { value: "financial", label: "Financial Services", icon: Landmark, color: "#10B981" },
    { value: "manufacturing", label: "Manufacturing", icon: Factory, color: "#3B82F6" },
    { value: "technology", label: "Technology", icon: Monitor, color: "#8B5CF6" },
    { value: "retail", label: "Retail", icon: ShoppingBag, color: "#F59E0B" },
    { value: "education", label: "Education", icon: GraduationCap, color: "#6366F1" },
    { value: "government", label: "Government", icon: Building, color: "#6B7280" },
  ]

  const deploymentOptions = [
    { value: "cloud", label: "Cloud Only", description: "Fully cloud-based deployment" },
    { value: "on_premise", label: "On-Premise", description: "Traditional on-premise deployment" },
    { value: "hybrid", label: "Hybrid", description: "Combination of cloud and on-premise" },
  ]

  const complianceFrameworks = [
    { value: "hipaa", label: "HIPAA" },
    { value: "pci_dss", label: "PCI DSS" },
    { value: "sox", label: "SOX" },
    { value: "iso_27001", label: "ISO 27001" },
    { value: "nist", label: "NIST" },
    { value: "gdpr", label: "GDPR" },
    { value: "fisma", label: "FISMA" },
    { value: "fedramp", label: "FedRAMP" },
  ]

  const identityProviders = [
    { value: "azure_ad", label: "Azure Active Directory", color: "#0078D4" },
    { value: "active_directory", label: "Active Directory", color: "#0078D4" },
    { value: "okta", label: "Okta", color: "#007DC1" },
    { value: "ping", label: "Ping Identity", color: "#0066CC" },
    { value: "google", label: "Google Workspace", color: "#4285F4" },
    { value: "aws_sso", label: "AWS SSO", color: "#FF9900" },
  ]

  const mdmProviders = [
    { value: "intune", label: "Microsoft Intune", color: "#00BCF2" },
    { value: "jamf", label: "Jamf Pro", color: "#4A90E2" },
    { value: "workspace_one", label: "VMware Workspace ONE", color: "#607078" },
    { value: "mobileiron", label: "MobileIron", color: "#0066CC" },
    { value: "airwatch", label: "AirWatch", color: "#607078" },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Main SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`${panOffset.x} ${panOffset.y} ${1920 * (100 / zoomLevel)} ${1080 * (100 / zoomLevel)}`}
        style={{ cursor: interactionMode === "pan" ? "grab" : "default" }}
      >
        {/* Grid Pattern */}
        {showGrid && (
          <defs>
            <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#E5E7EB" strokeWidth="1" />
            </pattern>
          </defs>
        )}
        {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

        {/* Arrow Markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
          </marker>
        </defs>

        {/* Render Connections */}
        {showConnections && connections.map(renderConnection)}

        {/* Render Components */}
        {components.map(renderComponent)}
      </svg>

      {/* Enhanced Control Panel */}
      {showControlPanel && (
        <Card
          ref={controlPanelRef}
          className="absolute bg-white/95 backdrop-blur-sm border shadow-xl"
          style={{
            left: controlPanelPosition.x,
            top: controlPanelPosition.y,
            width: 450,
            maxHeight: "calc(100vh - 32px)",
            zIndex: 1000,
          }}
        >
          <CardHeader className="pb-2 cursor-move" onMouseDown={handlePanelDragStart}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Architecture Controls
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setControlPanelMinimized(!controlPanelMinimized)}>
                  {controlPanelMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowControlPanel(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!controlPanelMinimized && (
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="p-6">
                  <Tabs defaultValue="view" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="view">View</TabsTrigger>
                      <TabsTrigger value="config">Config</TabsTrigger>
                      <TabsTrigger value="infrastructure">Infra</TabsTrigger>
                      <TabsTrigger value="display">Display</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="view" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Architecture View</label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {ARCHITECTURE_VIEWS.map((view) => {
                            const IconComponent = view.icon
                            return (
                              <Button
                                key={view.id}
                                variant={selectedView === view.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setSelectedView(view.id)
                                  updateConfig({ selectedView: view.id })
                                }}
                                className="justify-start h-auto p-3"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{view.name}</div>
                                    <div className="text-xs text-gray-500">{view.description}</div>
                                  </div>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Industry</label>
                        <Select 
                          value={selectedIndustry} 
                          onValueChange={(value) => {
                            setSelectedIndustry(value)
                            updateConfig({ industry: value })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {industryOptions.map((option) => {
                              const IconComponent = option.icon
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" style={{ color: option.color }} />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Deployment</label>
                        <Select 
                          value={selectedDeployment} 
                          onValueChange={(value) => {
                            setSelectedDeployment(value)
                            updateConfig({ deployment: value })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {deploymentOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-gray-500">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Site Selection</label>
                        <Select value={selectedSite} onValueChange={setSelectedSite}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a site to configure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global Configuration</SelectItem>
                            {sites.map((site) => (
                              <SelectItem key={site.id} value={site.id}>
                                {site.name} - {site.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                      {/* Basic Configuration */}
                      <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection("basic")}>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span className="font-medium">Basic Configuration</span>
                            </div>
                            {expandedSections.basic ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 mt-2">
                          <div>
                            <Label>Connectivity Options</Label\
