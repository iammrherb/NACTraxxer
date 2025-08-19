"use client"

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
  Home,
  Briefcase,
  Car,
  Plane,
  Ship,
  Truck,
  Train,
  Bus,
  Bike,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
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
  ports?: Array<{
    id: string
    name: string
    type: "ethernet" | "fiber" | "wireless" | "usb" | "serial" | "console" | "management"
    status: "active" | "inactive" | "error" | "disabled"
    speed?: string
    duplex?: "full" | "half"
    vlan?: string
    description?: string
  }>
  certificates?: Array<{
    name: string
    issuer: string
    subject: string
    expiry: string
    status: "valid" | "expired" | "expiring" | "revoked"
    keySize?: string
    algorithm?: string
    serialNumber?: string
  }>
  policies?: string[]
  compliance?: string[]
  applications?: string[]
  authentication?: string[]
  userGroups?: string[]
  accessPolicies?: string[]
  networkSegments?: string[]
  vlans?: Array<{
    id: string
    name: string
    subnet: string
    gateway: string
    dhcp: boolean
    description: string
  }>
  routes?: Array<{
    destination: string
    gateway: string
    metric: number
    interface: string
  }>
  securityFeatures?: string[]
  monitoringTools?: string[]
  backupStatus?: {
    lastBackup: string
    status: "success" | "failed" | "in_progress"
    size: string
    location: string
  }
  highAvailability?: {
    enabled: boolean
    partner?: string
    syncStatus?: "synchronized" | "out_of_sync" | "failed"
    failoverTime?: string
  }
  performanceMetrics?: {
    cpu: Array<{ timestamp: string; value: number }>
    memory: Array<{ timestamp: string; value: number }>
    network: Array<{ timestamp: string; value: number }>
  }
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
  connectivityOptions?: {
    expressRoute: boolean
    sdwan: boolean
    vpn: boolean
    mpls: boolean
    internet: boolean
    leasedLine: boolean
    satellite: boolean
  }
  ztnaConfiguration?: {
    enabled: boolean
    provider: string
    applications: string[]
    policies: string[]
    userGroups: string[]
    deviceTrust: boolean
    continuousVerification: boolean
    microsegmentation: boolean
  }
  tacacsConfiguration?: {
    enabled: boolean
    servers: Array<{
      id: string
      address: string
      port: number
      sharedSecret: string
      timeout: number
      retries: number
    }>
    commandAuthorization: boolean
    commandAccounting: boolean
    privilegeLevels: number[]
  }
  radsecConfiguration?: {
    enabled: boolean
    proxies: Array<{
      id: string
      address: string
      port: number
      certificate: string
      cacheTimeout: number
      failover: boolean
    }>
    loadBalancing: boolean
    highAvailability: boolean
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
  home: Home,
  briefcase: Briefcase,
  car: Car,
  plane: Plane,
  ship: Ship,
  truck: Truck,
  train: Train,
  bus: Bus,
  bike: Bike,
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

export default function InteractiveDiagram({ config }: { config: ArchitectureConfig }) {
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
  const [showPorts, setShowPorts] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [dataFlowAnimation, setDataFlowAnimation] = useState(0)
  const [metricsUpdateInterval, setMetricsUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  const [interactionMode, setInteractionMode] = useState<"select" | "pan" | "connect" | "edit">("select")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [autoLayout, setAutoLayout] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "pdf">("png")
  const [showControlPanel, setShowControlPanel] = useState(true)
  const [selectedView, setSelectedView] = useState(config.selectedView || "complete")
  const [selectedIndustry, setSelectedIndustry] = useState(config.industry || "healthcare")
  const [selectedDeployment, setSelectedDeployment] = useState(config.deployment || "hybrid")
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("global")
  const [customConfig, setCustomConfig] = useState({
    wiredVendor: config.wiredVendor || "cisco",
    wirelessVendor: config.wirelessVendor || "aruba",
    firewallVendor: config.firewallVendor || "palo_alto",
    identityProviders: config.identityProvider || ["azure_ad"],
    mdmProviders: config.mdmProvider || ["intune"],
    cloudProviders: ["aws", "azure"],
    connectivity: config.connectivity || ["wired", "wireless"],
    authTypes: config.authTypes || ["802.1x", "mac_auth"],
    deviceTypes: config.deviceTypes || ["windows", "mac", "ios", "android"],
    complianceFrameworks: config.complianceFrameworks || ["hipaa"],
    securityFeatures: config.securityFeatures || ["encryption", "mfa"],
  })

  useEffect(() => {
    loadSites()
  }, [])

  useEffect(() => {
    generateArchitecture()
  }, [selectedView, selectedIndustry, selectedSite, selectedDeployment, customConfig])

  useEffect(() => {
    if (config.animations && animationActive) {
      const interval = setInterval(
        () => {
          updateMetrics()
          setDataFlowAnimation((prev) => (prev + 1) % 100)
        },
        2000 - animationSpeed * 15,
      )
      setMetricsUpdateInterval(interval)
      return () => clearInterval(interval)
    } else if (metricsUpdateInterval) {
      clearInterval(metricsUpdateInterval)
      setMetricsUpdateInterval(null)
    }
  }, [config.animations, animationActive, animationSpeed])

  const loadSites = async () => {
    try {
      const sitesData = await storage.getSites()
      setSites(sitesData)
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const generateArchitecture = useCallback(() => {
    const newComponents: DiagramComponent[] = []
    const newConnections: Connection[] = []

    // Generate architecture based on selected view
    switch (selectedView) {
      case "complete":
        generateCompleteArchitecture(newComponents, newConnections)
        break
      case "authentication":
        generateAuthenticationFlow(newComponents, newConnections)
        break
      case "pki":
        generatePKIArchitecture(newComponents, newConnections)
        break
      case "policies":
        generatePolicyArchitecture(newComponents, newConnections)
        break
      case "connectivity":
        generateConnectivityArchitecture(newComponents, newConnections)
        break
      case "intune":
        generateIntuneIntegration(newComponents, newConnections)
        break
      case "jamf":
        generateJamfIntegration(newComponents, newConnections)
        break
      case "onboarding":
        generateDeviceOnboarding(newComponents, newConnections)
        break
      case "radsec":
        generateRadSecProxyArchitecture(newComponents, newConnections)
        break
      case "ztna":
        generateZTNAArchitecture(newComponents, newConnections)
        break
      case "guest":
        generateGuestPortal(newComponents, newConnections)
        break
      case "iot":
        generateIoTOnboarding(newComponents, newConnections)
        break
      case "tacacs":
        generateTACACSArchitecture(newComponents, newConnections)
        break
      case "risk":
        generateRiskPolicyArchitecture(newComponents, newConnections)
        break
      case "multisite":
        generateMultiSiteArchitecture(newComponents, newConnections)
        break
      case "cloud":
        generateCloudIntegration(newComponents, newConnections)
        break
      case "wireless":
        generateWirelessInfrastructure(newComponents, newConnections)
        break
      case "wired":
        generateWiredInfrastructure(newComponents, newConnections)
        break
      case "compliance":
        generateComplianceArchitecture(newComponents, newConnections)
        break
      case "monitoring":
        generateMonitoringArchitecture(newComponents, newConnections)
        break
      default:
        generateCompleteArchitecture(newComponents, newConnections)
    }

    setComponents(newComponents)
    setConnections(newConnections)
  }, [selectedView, selectedIndustry, selectedSite, selectedDeployment, customConfig])

  const generateCompleteArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
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
    if (customConfig.identityProviders.includes("azure_ad")) {
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
    if (customConfig.mdmProviders.includes("intune")) {
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
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)
    components.push({
      id: "core-switch-stack",
      type: "core_switch",
      name: `${wiredVendorInfo?.label || customConfig.wiredVendor.toUpperCase()} Core Switch Stack`,
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
      vendor: customConfig.wiredVendor,
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
      vendor: customConfig.wiredVendor,
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
      vendor: customConfig.wiredVendor,
      model: wiredVendorInfo?.models?.[0] || "Access Switch",
    })

    // Wireless Infrastructure based on connectivity options
    if (customConfig.connectivity.includes("wireless")) {
      const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === customConfig.wirelessVendor)
      components.push({
        id: "wireless-controller",
        type: "wireless_controller",
        name: `${wirelessVendorInfo?.label || customConfig.wirelessVendor.toUpperCase()} Wireless Controller`,
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
        vendor: customConfig.wirelessVendor,
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
        vendor: customConfig.wirelessVendor,
        model: wirelessVendorInfo?.models?.[3] || "WiFi 6E AP",
      })
    }

    // Security Infrastructure based on firewall vendor
    const firewallVendorInfo = VENDOR_OPTIONS.firewall.find((v) => v.value === customConfig.firewallVendor)
    components.push({
      id: "firewall-cluster",
      type: "firewall_cluster",
      name: `${firewallVendorInfo?.label || customConfig.firewallVendor.toUpperCase()} Firewall Cluster`,
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
      vendor: customConfig.firewallVendor,
      model: firewallVendorInfo?.models?.[2] || "NGFW Cluster",
    })

    // Connectivity Hub based on deployment type
    if (selectedDeployment === "hybrid" || selectedDeployment === "cloud_only") {
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
    if (customConfig.authTypes.includes("certificate") || customConfig.authTypes.includes("802.1x")) {
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

  const generateAuthenticationFlow = (components: DiagramComponent[], connections: Connection[]) => {
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
      icon: customConfig.connectivity.includes("wireless") ? "wifi" : "network",
      color: customConfig.connectivity.includes("wireless")
        ? VENDOR_OPTIONS.wireless.find((v) => v.value === customConfig.wirelessVendor)?.color || "#8B5CF6"
        : VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)?.color || "#6B7280",
      description: "802.1X enabled switch port or wireless access point",
      vendor: customConfig.connectivity.includes("wireless") ? customConfig.wirelessVendor : customConfig.wiredVendor,
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
    })

    // Identity Provider
    components.push({
      id: "identity-provider",
      type: "identity_provider",
      name: customConfig.identityProviders.includes("azure_ad") ? "Azure Active Directory" : "Identity Provider",
      x: 1400,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["portnox-cloud"],
      icon: "users",
      color: customConfig.identityProviders.includes("azure_ad")
        ? VENDOR_OPTIONS.identity.find((v) => v.value === "azure_ad")?.color || "#0078D4"
        : "#0078D4",
      description: "Enterprise identity provider for user authentication",
      vendor: customConfig.identityProviders.includes("azure_ad") ? "microsoft" : "generic",
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
    })

    generateIntelligentConnections(components, connections)
  }

  const generatePKIArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
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
    })

    // Intermediate CAs
    components.push({
      id: "intermediate-ca-1",
      type: "intermediate_ca",
      name: "Policy CA",
      x: 400,
      y: 300,
      width: 200,
      height: 120,
      status: "online",
      category: "security",
      connections: ["root-ca", "issuing-ca-user", "issuing-ca-device"],
      icon: "file-key",
      color: "#DC2626",
      description: "Intermediate CA for policy certificates",
    })

    components.push({
      id: "intermediate-ca-2",
      type: "intermediate_ca",
      name: "Infrastructure CA",
      x: 800,
      y: 300,
      width: 200,
      height: 120,
      status: "online",
      category: "security",
      connections: ["root-ca", "issuing-ca-server"],
      icon: "file-key",
      color: "#DC2626",
      description: "Intermediate CA for infrastructure certificates",
    })

    // Issuing CAs
    components.push({
      id: "issuing-ca-user",
      type: "issuing_ca",
      name: "User Certificate CA",
      x: 200,
      y: 500,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "user-certificates"],
      icon: "file-key",
      color: "#DC2626",
      description: "Issues certificates for user authentication",
    })

    components.push({
      id: "issuing-ca-device",
      type: "issuing_ca",
      name: "Device Certificate CA",
      x: 400,
      y: 500,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-1", "device-certificates"],
      icon: "file-key",
      color: "#DC2626",
      description: "Issues certificates for device authentication",
    })

    components.push({
      id: "issuing-ca-server",
      type: "issuing_ca",
      name: "Server Certificate CA",
      x: 800,
      y: 500,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intermediate-ca-2", "server-certificates"],
      icon: "file-key",
      color: "#DC2626",
      description: "Issues certificates for server authentication",
    })

    // Certificate Stores
    components.push({
      id: "user-certificates",
      type: "certificate_store",
      name: "User Certificates",
      x: 200,
      y: 700,
      width: 180,
      height: 80,
      status: "online",
      category: "endpoint",
      connections: ["issuing-ca-user"],
      icon: "users",
      color: "#6B7280",
      description: "User certificate store for authentication",
    })

    components.push({
      id: "device-certificates",
      type: "certificate_store",
      name: "Device Certificates",
      x: 400,
      y: 700,
      width: 180,
      height: 80,
      status: "online",
      category: "endpoint",
      connections: ["issuing-ca-device"],
      icon: "smartphone",
      color: "#6B7280",
      description: "Device certificate store for authentication",
    })

    components.push({
      id: "server-certificates",
      type: "certificate_store",
      name: "Server Certificates",
      x: 800,
      y: 700,
      width: 180,
      height: 80,
      status: "online",
      category: "application",
      connections: ["issuing-ca-server"],
      icon: "server",
      color: "#6B7280",
      description: "Server certificate store for SSL/TLS",
    })

    generateIntelligentConnections(components, connections)
  }

  const generatePolicyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
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
    })

    // Policy Repository
    components.push({
      id: "policy-repository",
      type: "policy_repository",
      name: "Policy Repository",
      x: 300,
      y: 100,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      connections: ["policy-engine"],
      icon: "database",
      color: "#3B82F6",
      description: "Centralized storage for all access control policies",
    })

    // Decision Engine
    components.push({
      id: "decision-engine",
      type: "decision_engine",
      name: "Policy Decision Point",
      x: 600,
      y: 400,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      connections: ["policy-engine"],
      icon: "target",
      color: "#F59E0B",
      description: "Real-time policy evaluation and access decisions",
    })

    // Enforcement Points
    components.push({
      id: "enforcement-points",
      type: "enforcement_points",
      name: "Policy Enforcement Points",
      x: 1000,
      y: 200,
      width: 200,
      height: 150,
      status: "online",
      category: "network",
      connections: ["policy-engine"],
      icon: "shield",
      color: "#DC2626",
      description: "Network devices enforcing access control policies",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateConnectivityArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Network Core
    components.push({
      id: "network-core",
      type: "network_core",
      name: "Core Network Infrastructure",
      x: 600,
      y: 300,
      width: 300,
      height: 150,
      status: "online",
      category: "network",
      connections: ["wan-aggregator", "lan-distribution", "cloud-connectivity"],
      icon: "network",
      color: config.customColors.primary,
      description: "High-performance core network with redundant paths",
      vendor: customConfig.wiredVendor,
    })

    // WAN Aggregator
    components.push({
      id: "wan-aggregator",
      type: "wan_aggregator",
      name: "WAN Aggregation Hub",
      x: 300,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "connectivity",
      connections: ["network-core", "internet-gateway", "mpls-connection", "sdwan-connection"],
      icon: "git-branch",
      color: "#059669",
      description: "Intelligent WAN aggregation with automatic failover",
    })

    // Internet Gateway
    components.push({
      id: "internet-gateway",
      type: "internet_gateway",
      name: "Internet Gateway",
      x: 100,
      y: 50,
      width: 180,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-aggregator"],
      icon: "globe",
      color: "#6366F1",
      description: "High-speed internet connectivity with DDoS protection",
    })

    // MPLS Connection
    components.push({
      id: "mpls-connection",
      type: "mpls_connection",
      name: "MPLS Network",
      x: 300,
      y: 50,
      width: 180,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-aggregator"],
      icon: "network",
      color: "#E879F9",
      description: "Private MPLS network for site-to-site connectivity",
    })

    // SD-WAN Connection
    components.push({
      id: "sdwan-connection",
      type: "sdwan_connection",
      name: "SD-WAN",
      x: 500,
      y: 50,
      width: 180,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: ["wan-aggregator"],
      icon: "workflow",
      color: "#C084FC",
      description: "Software-defined WAN with intelligent path selection",
    })

    // LAN Distribution
    components.push({
      id: "lan-distribution",
      type: "lan_distribution",
      name: "LAN Distribution Layer",
      x: 1000,
      y: 300,
      width: 200,
      height: 120,
      status: "online",
      category: "network",
      connections: ["network-core", "access-layer"],
      icon: "network",
      color: VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)?.color || "#6B7280",
      description: "Distribution layer with advanced routing",
      vendor: customConfig.wiredVendor,
    })

    // Access Layer
    components.push({
      id: "access-layer",
      type: "access_layer",
      name: "Access Layer Switches",
      x: 1200,
      y: 200,
      width: 180,
      height: 100,
      status: "online",
      category: "network",
      connections: ["lan-distribution"],
      icon: "network",
      color: VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)?.color || "#6B7280",
      description: "PoE+ enabled access switches",
      vendor: customConfig.wiredVendor,
    })

    // Cloud Connectivity
    components.push({
      id: "cloud-connectivity",
      type: "cloud_connectivity",
      name: "Multi-Cloud Connectivity",
      x: 300,
      y: 500,
      width: 200,
      height: 120,
      status: "online",
      category: "connectivity",
      connections: ["network-core"],
      icon: "cloud",
      color: "#059669",
      description: "Secure connectivity to multiple cloud providers",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateIntuneIntegration = (components: DiagramComponent[], connections: Connection[]) => {
    // Intune Cloud
    components.push({
      id: "intune-cloud",
      type: "intune_cloud",
      name: "Microsoft Intune",
      x: 600,
      y: 100,
      width: 300,
      height: 150,
      status: "online",
      category: "cloud",
      connections: ["azure-ad", "device-enrollment", "app-protection", "compliance-policies"],
      icon: "cloud",
      color: VENDOR_OPTIONS.mdm.find((v) => v.value === "intune")?.color || "#00BCF2",
      description: "Cloud-based unified endpoint management platform",
      vendor: "microsoft",
      version: "2024.01",
    })

    // Azure AD
    components.push({
      id: "azure-ad",
      type: "azure_ad",
      name: "Azure Active Directory",
      x: 300,
      y: 50,
      width: 200,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["intune-cloud"],
      icon: "users",
      color: VENDOR_OPTIONS.identity.find((v) => v.value === "azure_ad")?.color || "#0078D4",
      description: "Identity and access management integration",
      vendor: "microsoft",
    })

    // Device Enrollment
    components.push({
      id: "device-enrollment",
      type: "device_enrollment",
      name: "Device Enrollment Services",
      x: 400,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      connections: ["intune-cloud"],
      icon: "smartphone",
      color: "#059669",
      description: "Automated device enrollment and provisioning",
    })

    // App Protection
    components.push({
      id: "app-protection",
      type: "app_protection",
      name: "App Protection Policies",
      x: 800,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intune-cloud"],
      icon: "shield",
      color: "#F59E0B",
      description: "Mobile application protection and data loss prevention",
    })

    // Compliance Policies
    components.push({
      id: "compliance-policies",
      type: "compliance_policies",
      name: "Compliance Policies",
      x: 600,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["intune-cloud"],
      icon: "check-circle",
      color: "#10B981",
      description: "Device compliance assessment and enforcement",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateJamfIntegration = (components: DiagramComponent[], connections: Connection[]) => {
    // Jamf Cloud
    components.push({
      id: "jamf-cloud",
      type: "jamf_cloud",
      name: "Jamf Pro",
      x: 600,
      y: 100,
      width: 300,
      height: 150,
      status: "online",
      category: "cloud",
      connections: ["apple-business-manager", "device-enrollment", "app-deployment", "security-policies"],
      icon: "cloud",
      color: VENDOR_OPTIONS.mdm.find((v) => v.value === "jamf")?.color || "#4A90E2",
      description: "Apple device management platform",
      vendor: "jamf",
      version: "10.45.0",
    })

    // Apple Business Manager
    components.push({
      id: "apple-business-manager",
      type: "apple_business_manager",
      name: "Apple Business Manager",
      x: 300,
      y: 50,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["jamf-cloud"],
      icon: "smartphone",
      color: "#000000",
      description: "Apple's device enrollment and app distribution",
      vendor: "apple",
    })

    // Device Enrollment
    components.push({
      id: "device-enrollment",
      type: "device_enrollment",
      name: "Automated Device Enrollment",
      x: 400,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      connections: ["jamf-cloud"],
      icon: "smartphone",
      color: "#059669",
      description: "Zero-touch device enrollment for Apple devices",
    })

    // App Deployment
    components.push({
      id: "app-deployment",
      type: "app_deployment",
      name: "App Deployment",
      x: 800,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "management",
      connections: ["jamf-cloud"],
      icon: "monitor",
      color: "#3B82F6",
      description: "Automated app installation and updates",
    })

    // Security Policies
    components.push({
      id: "security-policies",
      type: "security_policies",
      name: "Security Policies",
      x: 600,
      y: 300,
      width: 200,
      height: 100,
      status: "online",
      category: "security",
      connections: ["jamf-cloud"],
      icon: "shield",
      color: "#DC2626",
      description: "macOS and iOS security configuration",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateDeviceOnboarding = (components: DiagramComponent[], connections: Connection[]) => {
    // Onboarding Portal
    components.push({
      id: "onboarding-portal",
      type: "onboarding_portal",
      name: "Device Onboarding Portal",
      x: 600,
      y: 100,
      width: 300,
      height: 150,
      status: "online",
      category: "application",
      connections: ["identity-verification", "device-registration", "certificate-enrollment"],
      icon: "globe",
      color: config.customColors.primary,
      description: "Self-service device onboarding portal with multi-platform support",
    })

    // Identity Verification
    components.push({
      id: "identity-verification",
      type: "identity_verification",
      name: "Identity Verification Service",
      x: 300,
      y: 50,
      width: 200,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["onboarding-portal"],
      icon: "user-check",
      color: "#0078D4",
      description: "Multi-factor identity verification for device registration",
    })

    // Device Registration
    components.push({
      id: "device-registration",
      type: "device_registration",
      name: "Device Registration Service",
      x: 600,
      y: 300,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["onboarding-portal"],
      icon: "smartphone",
      color: "#10B981",
      description: "Automated device registration and inventory management",
    })

    // Certificate Enrollment
    components.push({
      id: "certificate-enrollment",
      type: "certificate_enrollment",
      name: "Certificate Enrollment Service",
      x: 1000,
      y: 100,
      width: 200,
      height: 120,
      status: "online",
      category: "security",
      connections: ["onboarding-portal"],
      icon: "file-key",
      color: "#DC2626",
      description: "Automated certificate enrollment and deployment",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateRadSecProxyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // RADSEC Proxy Cluster
    components.push({
      id: "radsec-proxy-cluster",
      type: "radsec_proxy_cluster",
      name: "RADSEC Proxy Cluster",
      x: 600,
      y: 200,
      width: 300,
      height: 150,
      status: "online",
      category: "network",
      connections: ["portnox-cloud", "network-devices"],
      icon: "router",
      color: config.customColors.secondary,
      description: "High-availability RADSEC proxy cluster with intelligent load balancing",
      vendor: "portnox",
      version: "v2.8.1",
    })

    // Portnox Cloud
    components.push({
      id: "portnox-cloud",
      type: "portnox_cloud",
      name: "Portnox Cloud Platform",
      x: 1000,
      y: 100,
      width: 300,
      height: 150,
      status: "online",
      category: "cloud",
      connections: ["radsec-proxy-cluster"],
      icon: "cloud",
      color: config.customColors.primary,
      description: "Cloud NAC platform with integrated RADIUS and policy engine",
      vendor: "portnox",
    })

    // Network Devices
    components.push({
      id: "network-devices",
      type: "network_devices",
      name: "Network Access Devices",
      x: 300,
      y: 50,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["radsec-proxy-cluster"],
      icon: "network",
      color: VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)?.color || "#6B7280",
      description: "Network devices configured for RADIUS authentication",
      vendor: customConfig.wiredVendor,
    })

    generateIntelligentConnections(components, connections)
  }

  const generateZTNAArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // ZTNA Gateway Cluster
    components.push({
      id: "ztna-gateway-cluster",
      type: "ztna_gateway_cluster",
      name: "Zero Trust Gateway Cluster",
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "security",
      connections: ["identity-verification", "device-trust", "application-connector"],
      icon: "shield",
      color: "#7C3AED",
      description: "High-availability ZTNA gateway cluster with micro-segmentation",
      vendor: "portnox",
      version: "v3.2.1",
    })

    // Identity Verification
    components.push({
      id: "identity-verification",
      type: "identity_verification",
      name: "Identity Verification Service",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["ztna-gateway-cluster"],
      icon: "user-check",
      color: "#0078D4",
      description: "Multi-provider identity verification with adaptive authentication",
    })

    // Device Trust
    components.push({
      id: "device-trust",
      type: "device_trust_engine",
      name: "Device Trust Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["ztna-gateway-cluster"],
      icon: "scan",
      color: "#F59E0B",
      description: "Continuous device posture assessment and trust scoring",
    })

    // Application Connector
    components.push({
      id: "application-connector",
      type: "application_connector",
      name: "Application Connector",
      x: 1000,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "application",
      connections: ["ztna-gateway-cluster"],
      icon: "git-branch",
      color: "#059669",
      description: "Secure application connectivity with micro-tunneling",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateGuestPortal = (components: DiagramComponent[], connections: Connection[]) => {
    // Guest Portal Platform
    components.push({
      id: "guest-portal-platform",
      type: "guest_portal_platform",
      name: "Guest Portal Platform",
      x: 600,
      y: 200,
      width: 300,
      height: 150,
      status: "online",
      category: "application",
      connections: ["captive-portal", "self-registration", "sponsor-approval"],
      icon: "globe",
      color: config.customColors.primary,
      description: "Comprehensive guest access management platform",
    })

    // Captive Portal
    components.push({
      id: "captive-portal",
      type: "captive_portal",
      name: "Captive Portal",
      x: 300,
      y: 100,
      width: 200,
      height: 120,
      status: "online",
      category: "application",
      connections: ["guest-portal-platform"],
      icon: "wifi",
      color: "#8B5CF6",
      description: "Branded captive portal with customizable authentication flows",
    })

    // Self Registration
    components.push({
      id: "self-registration",
      type: "self_registration",
      name: "Self-Registration Service",
      x: 600,
      y: 400,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["guest-portal-platform"],
      icon: "user-check",
      color: "#059669",
      description: "Automated guest registration with customizable workflows",
    })

    // Sponsor Approval
    components.push({
      id: "sponsor-approval",
      type: "sponsor_approval",
      name: "Sponsor Approval Workflow",
      x: 1000,
      y: 200,
      width: 200,
      height: 120,
      status: "online",
      category: "management",
      connections: ["guest-portal-platform"],
      icon: "users",
      color: "#7C3AED",
      description: "Employee sponsor-based guest approval system",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateIoTOnboarding = (components: DiagramComponent[], connections: Connection[]) => {
    // IoT Management Platform
    components.push({
      id: "iot-management-platform",
      type: "iot_management_platform",
      name: "IoT Management Platform",
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["device-discovery", "device-profiling", "certificate-provisioning"],
      icon: "activity",
      color: "#84CC16",
      description: "Comprehensive IoT device lifecycle management platform",
    })

    // Device Discovery
    components.push({
      id: "device-discovery",
      type: "device_discovery",
      name: "IoT Device Discovery Service",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["iot-management-platform"],
      icon: "search",
      color: "#3B82F6",
      description: "Automated IoT device discovery using multiple detection methods",
    })

    // Device Profiling
    components.push({
      id: "device-profiling",
      type: "device_profiling",
      name: "IoT Device Profiling Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["iot-management-platform"],
      icon: "scan",
      color: "#8B5CF6",
      description: "AI-powered IoT device profiling with security assessment",
    })

    // Certificate Provisioning
    components.push({
      id: "certificate-provisioning",
      type: "certificate_provisioning",
      name: "IoT Certificate Provisioning",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["iot-management-platform"],
      icon: "file-key",
      color: "#DC2626",
      description: "Automated certificate provisioning for IoT device identity",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateTACACSArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // TACACS+ Server Cluster
    components.push({
      id: "tacacs-server-cluster",
      type: "tacacs_server_cluster",
      name: "TACACS+ Server Cluster",
      x: 600,
      y: 200,
      width: 300,
      height: 150,
      status: "online",
      category: "security",
      connections: ["identity-sources", "policy-engine", "network-devices"],
      icon: "lock",
      color: "#DC2626",
      description: "High-availability TACACS+ server cluster for device administration",
      vendor: "portnox",
      version: "v3.1.2",
    })

    // Identity Sources
    components.push({
      id: "identity-sources",
      type: "identity_sources",
      name: "Identity Sources",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["tacacs-server-cluster"],
      icon: "users",
      color: "#0078D4",
      description: "Multiple identity sources for TACACS+ authentication",
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "tacacs_policy_engine",
      name: "TACACS+ Policy Engine",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["tacacs-server-cluster"],
      icon: "settings",
      color: "#7C3AED",
      description: "Advanced policy engine for command authorization",
    })

    // Network Devices
    components.push({
      id: "network-devices",
      type: "network_devices",
      name: "Network Infrastructure Devices",
      x: 200,
      y: 50,
      width: 300,
      height: 120,
      status: "online",
      category: "network",
      connections: ["tacacs-server-cluster"],
      icon: "network",
      color: VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)?.color || "#6B7280",
      description: "Network devices configured for TACACS+ authentication",
      vendor: customConfig.wiredVendor,
    })

    generateIntelligentConnections(components, connections)
  }

  const generateRiskPolicyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
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
      connections: ["data-collection", "risk-engine", "policy-engine"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Comprehensive risk assessment platform with AI-powered analysis",
    })

    // Data Collection
    components.push({
      id: "data-collection",
      type: "data_collection",
      name: "Data Collection Layer",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["risk-assessment-platform"],
      icon: "database",
      color: "#3B82F6",
      description: "Multi-source data collection for comprehensive risk assessment",
    })

    // Risk Engine
    components.push({
      id: "risk-engine",
      type: "risk_engine",
      name: "AI Risk Assessment Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["risk-assessment-platform"],
      icon: "target",
      color: "#DC2626",
      description: "Machine learning-powered risk assessment with real-time scoring",
    })

    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Risk Policy Engine",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["risk-assessment-platform"],
      icon: "settings",
      color: "#7C3AED",
      description: "Dynamic policy adjustment based on risk assessment",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateMultiSiteArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
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
    })

    // Branch Offices
    components.push({
      id: "branch-office-1",
      type: "branch_office",
      name: "Branch Office 1",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building-2",
      color: "#059669",
      description: "Regional branch office with local NAC enforcement",
    })

    components.push({
      id: "branch-office-2",
      type: "branch_office",
      name: "Branch Office 2",
      x: 600,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building-2",
      color: "#059669",
      description: "Regional branch office with local NAC enforcement",
    })

    // Data Center
    components.push({
      id: "data-center",
      type: "data_center",
      name: "Primary Data Center",
      x: 1000,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "server",
      color: "#6B7280",
      description: "Primary data center with disaster recovery capabilities",
    })

    // Remote Sites
    components.push({
      id: "remote-sites",
      type: "remote_sites",
      name: "Remote Sites (5x)",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "home",
      color: "#8B5CF6",
      description: "Multiple remote sites with centralized management",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateCloudIntegration = (components: DiagramComponent[], connections: Connection[]) => {
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
      connections: ["aws-services", "azure-services", "google-cloud", "cloud-security"],
      icon: "cloud",
      color: "#3B82F6",
      description: "Centralized hub for multi-cloud service integration",
    })

    // AWS Services
    components.push({
      id: "aws-services",
      type: "aws_services",
      name: "Amazon Web Services",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#FF9900",
      description: "AWS cloud services integration",
      vendor: "aws",
    })

    // Azure Services
    components.push({
      id: "azure-services",
      type: "azure_services",
      name: "Microsoft Azure",
      x: 500,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#0078D4",
      description: "Azure cloud services integration",
      vendor: "azure",
    })

    // Google Cloud
    components.push({
      id: "google-cloud",
      type: "google_cloud",
      name: "Google Cloud Platform",
      x: 800,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: "#4285F4",
      description: "GCP cloud services integration",
      vendor: "gcp",
    })

    // Cloud Security
    components.push({
      id: "cloud-security",
      type: "cloud_security",
      name: "Cloud Security Services",
      x: 1000,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["multi-cloud-hub"],
      icon: "shield",
      color: "#DC2626",
      description: "Unified cloud security and compliance",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateWirelessInfrastructure = (components: DiagramComponent[], connections: Connection[]) => {
    const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === customConfig.wirelessVendor)

    // Wireless Controller Cluster
    components.push({
      id: "wireless-controller-cluster",
      type: "wireless_controller_cluster",
      name: `${wirelessVendorInfo?.label || customConfig.wirelessVendor.toUpperCase()} Wireless Controller Cluster`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["access-points", "wireless-management", "network-core"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-availability wireless controller cluster",
      vendor: customConfig.wirelessVendor,
      model: wirelessVendorInfo?.models?.[2] || "Wireless Controller",
    })

    // Access Points
    components.push({
      id: "access-points",
      type: "access_points",
      name: "WiFi 6E Access Points",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["wireless-controller-cluster"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-density WiFi 6E access points",
      vendor: customConfig.wirelessVendor,
      model: wirelessVendorInfo?.models?.[3] || "WiFi 6E AP",
    })

    // Wireless Management
    components.push({
      id: "wireless-management",
      type: "wireless_management",
      name: "Wireless Management Platform",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["wireless-controller-cluster"],
      icon: "settings",
      color: "#059669",
      description: "Centralized wireless network management",
    })

    // Network Core
    components.push({
      id: "network-core",
      type: "network_core",
      name: "Network Core",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["wireless-controller-cluster"],
      icon: "network",
      color: "#6B7280",
      description: "Core network infrastructure",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateWiredInfrastructure = (components: DiagramComponent[], connections: Connection[]) => {
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === customConfig.wiredVendor)

    // Core Switch Stack
    components.push({
      id: "core-switch-stack",
      type: "core_switch_stack",
      name: `${wiredVendorInfo?.label || customConfig.wiredVendor.toUpperCase()} Core Switch Stack`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["distribution-switches", "access-switches", "network-management"],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: customConfig.wiredVendor,
      model: wiredVendorInfo?.models?.[3] || "Core Switch Stack",
    })

    // Distribution Switches
    components.push({
      id: "distribution-switches",
      type: "distribution_switches",
      name: "Distribution Switches",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["core-switch-stack"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "Distribution layer switches",
      vendor: customConfig.wiredVendor,
      model: wiredVendorInfo?.models?.[2] || "Distribution Switch",
    })

    // Access Switches
    components.push({
      id: "access-switches",
      type: "access_switches",
      name: "Access Switches",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["core-switch-stack"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "Access layer switches with PoE+",
      vendor: customConfig.wiredVendor,
      model: wiredVendorInfo?.models?.[0] || "Access Switch",
    })

    // Network Management
    components.push({
      id: "network-management",
      type: "network_management",
      name: "Network Management Platform",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["core-switch-stack"],
      icon: "settings",
      color: "#059669",
      description: "Centralized network management and monitoring",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateComplianceArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Compliance Management Platform
    components.push({
      id: "compliance-platform",
      type: "compliance_platform",
      name: "Compliance Management Platform",
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["audit-engine", "reporting-system", "policy-compliance"],
      icon: "check-circle",
      color: "#10B981",
      description: "Comprehensive compliance management for industry regulations",
    })

    // Audit Engine
    components.push({
      id: "audit-engine",
      type: "audit_engine",
      name: "Automated Audit Engine",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["compliance-platform"],
      icon: "search",
      color: "#3B82F6",
      description: "Continuous compliance monitoring and audit trail generation",
    })

    // Reporting System
    components.push({
      id: "reporting-system",
      type: "reporting_system",
      name: "Compliance Reporting System",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["compliance-platform"],
      icon: "bar-chart-3",
      color: "#F59E0B",
      description: "Automated compliance reporting and dashboard",
    })

    // Policy Compliance
    components.push({
      id: "policy-compliance",
      type: "policy_compliance",
      name: "Policy Compliance Engine",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "security",
      connections: ["compliance-platform"],
      icon: "shield-check",
      color: "#7C3AED",
      description: "Real-time policy compliance validation and enforcement",
    })

    generateIntelligentConnections(components, connections)
  }

  const generateMonitoringArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Monitoring Platform
    components.push({
      id: "monitoring-platform",
      type: "monitoring_platform",
      name: "Network Monitoring Platform",
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "management",
      connections: ["data-collectors", "analytics-engine", "alerting-system"],
      icon: "activity",
      color: "#3B82F6",
      description: "Comprehensive network monitoring and analytics platform",
    })

    // Data Collectors
    components.push({
      id: "data-collectors",
      type: "data_collectors",
      name: "Data Collection Agents",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["monitoring-platform"],
      icon: "database",
      color: "#059669",
      description: "Distributed data collection from network devices and systems",
    })

    // Analytics Engine
    components.push({
      id: "analytics-engine",
      type: "analytics_engine",
      name: "AI Analytics Engine",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["monitoring-platform"],
      icon: "trending-up",
      color: "#8B5CF6",
      description: "Machine learning-powered network analytics and insights",
    })

    // Alerting System
    components.push({
      id: "alerting-system",
      type: "alerting_system",
      name: "Intelligent Alerting System",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: ["monitoring-platform"],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Smart alerting with anomaly detection and escalation",
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
              throughput: component.metrics.throughput,
              connections: component.metrics.connections
                ? component.metrics.connections + Math.floor((Math.random() - 0.5) * 10)
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
            {component.metrics.cpu && (
              <text fontSize={9} fill="#374151">
                <tspan>CPU: {Math.round(component.metrics.cpu)}%</tspan>
              </text>
            )}
            {component.metrics.memory && (
              <text fontSize={9} fill="#374151" x={70}>
                <tspan>RAM: {Math.round(component.metrics.memory)}%</tspan>
              </text>
            )}
            {component.metrics.uptime && (
              <text fontSize={9} fill="#374151" x={140}>
                <tspan>Uptime: {component.metrics.uptime.toFixed(2)}%</tspan>
              </text>
            )}
          </g>
        )}

        {/* Animation Effects */}
        {config.animations && animationActive && (
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
        {config.animations && animationActive && (
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

  return (
    <div
      className="w-full h-full relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden"
      ref={containerRef}
    >
      {/* Enhanced Control Panel */}
      {showControlPanel && (
        <Card className="absolute top-4 left-4 z-20 w-96 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl max-h-[calc(100vh-2rem)] overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Architecture Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-6">
                <Tabs defaultValue="view" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="view">View</TabsTrigger>
                    <TabsTrigger value="config">Config</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>

                  <TabsContent value="view" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Architecture View</label>
                      <Select value={selectedView} onValueChange={setSelectedView}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complete">Complete Architecture</SelectItem>
                          <SelectItem value="authentication">Authentication Flow</SelectItem>
                          <SelectItem value="pki">PKI & Certificate Management</SelectItem>
                          <SelectItem value="policies">Access Control Policies</SelectItem>
                          <SelectItem value="connectivity">Connectivity Options</SelectItem>
                          <SelectItem value="intune">Intune Integration</SelectItem>
                          <SelectItem value="jamf">Jamf Integration</SelectItem>
                          <SelectItem value="onboarding">Device Onboarding</SelectItem>
                          <SelectItem value="radsec">RADSEC Proxy</SelectItem>
                          <SelectItem value="ztna">Zero Trust Network Access</SelectItem>
                          <SelectItem value="guest">Guest Portal</SelectItem>
                          <SelectItem value="iot">IoT Onboarding</SelectItem>
                          <SelectItem value="tacacs">TACACS+ Administration</SelectItem>
                          <SelectItem value="risk">Risk Assessment</SelectItem>
                          <SelectItem value="multisite">Multi-Site Deployment</SelectItem>
                          <SelectItem value="cloud">Cloud Integration</SelectItem>
                          <SelectItem value="wireless">Wireless Infrastructure</SelectItem>
                          <SelectItem value="wired">Wired Infrastructure</SelectItem>
                          <SelectItem value="compliance">Compliance & Audit</SelectItem>
                          <SelectItem value="monitoring">Monitoring & Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Industry</label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="financial">Financial Services</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Deployment</label>
                      <Select value={selectedDeployment} onValueChange={setSelectedDeployment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloud">Cloud Only</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="on_premise">On-Premise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="config" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Wired Vendor</label>
                      <Select
                        value={customConfig.wiredVendor}
                        onValueChange={(value) => setCustomConfig((prev) => ({ ...prev, wiredVendor: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_OPTIONS.wired.map((vendor) => (
                            <SelectItem key={vendor.value} value={vendor.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }}></div>
                                {vendor.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Wireless Vendor</label>
                      <Select
                        value={customConfig.wirelessVendor}
                        onValueChange={(value) => setCustomConfig((prev) => ({ ...prev, wirelessVendor: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_OPTIONS.wireless.map((vendor) => (
                            <SelectItem key={vendor.value} value={vendor.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }}></div>
                                {vendor.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Firewall Vendor</label>
                      <Select
                        value={customConfig.firewallVendor}
                        onValueChange={(value) => setCustomConfig((prev) => ({ ...prev, firewallVendor: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_OPTIONS.firewall.map((vendor) => (
                            <SelectItem key={vendor.value} value={vendor.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }}></div>
                                {vendor.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="display" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Metrics</label>
                      <Switch checked={showMetrics} onCheckedChange={setShowMetrics} />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Connections</label>
                      <Switch checked={showConnections} onCheckedChange={setShowConnections} />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Labels</label>
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Animations</label>
                      <Switch checked={animationActive} onCheckedChange={setAnimationActive} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Animation Speed: {animationSpeed}%</label>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={([value]) => setAnimationSpeed(value)}
                        max={100}
                        min={10}
                        step={10}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Zoom Level: {zoomLevel}%</label>
                      <Slider
                        value={[zoomLevel]}
                        onValueChange={([value]) => setZoomLevel(value)}
                        max={200}
                        min={50}
                        step={10}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-4">
                    <Button
                      onClick={() => toast({ title: "Export Started", description: "Exporting diagram as PNG..." })}
                      className="w-full"
                    >
                      Export as PNG
                    </Button>
                    <Button
                      onClick={() => toast({ title: "Export Started", description: "Exporting diagram as SVG..." })}
                      variant="outline"
                      className="w-full"
                    >
                      Export as SVG
                    </Button>
                    <Button
                      onClick={() => toast({ title: "Export Started", description: "Exporting diagram as PDF..." })}
                      variant="outline"
                      className="w-full"
                    >
                      Export as PDF
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Component Details Panel */}
      {selectedComponent && (
        <Card className="absolute top-4 right-4 z-20 w-80 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Component Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-base">{selectedComponent.name}</h3>
                <p className="text-sm text-gray-600">{selectedComponent.description}</p>
              </div>

              {selectedComponent.vendor && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Vendor:</span>
                  <span className="text-sm">{selectedComponent.vendor}</span>
                </div>
              )}

              {selectedComponent.model && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Model:</span>
                  <span className="text-sm">{selectedComponent.model}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[selectedComponent.status] }}
                  />
                  <span className="text-sm capitalize">{selectedComponent.status}</span>
                </div>
              </div>

              {selectedComponent.metrics && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedComponent.metrics.cpu && <div>CPU: {Math.round(selectedComponent.metrics.cpu)}%</div>}
                    {selectedComponent.metrics.memory && (
                      <div>Memory: {Math.round(selectedComponent.metrics.memory)}%</div>
                    )}
                    {selectedComponent.metrics.uptime && (
                      <div>Uptime: {selectedComponent.metrics.uptime.toFixed(2)}%</div>
                    )}
                    {selectedComponent.metrics.latency && <div>Latency: {selectedComponent.metrics.latency}ms</div>}
                    {selectedComponent.metrics.throughput && (
                      <div>Throughput: {selectedComponent.metrics.throughput}</div>
                    )}
                    {selectedComponent.metrics.connections && (
                      <div>Connections: {selectedComponent.metrics.connections}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main SVG Diagram */}
      <div className="w-full h-full overflow-auto">
        <svg
          ref={svgRef}
          width="2000"
          height="1200"
          viewBox="0 0 2000 1200"
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Definitions for markers and patterns */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>

            {/* Grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

          {/* Render connections first (behind components) */}
          {showConnections && connections.map(renderConnection)}

          {/* Render components */}
          {components.map(renderComponent)}
        </svg>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>
                  View: <strong>{selectedView}</strong>
                </span>
                <span>
                  Components: <strong>{components.length}</strong>
                </span>
                <span>
                  Connections: <strong>{connections.length}</strong>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>
                  Industry: <strong>{selectedIndustry}</strong>
                </span>
                <span>
                  Zoom: <strong>{zoomLevel}%</strong>
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowControlPanel(!showControlPanel)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
