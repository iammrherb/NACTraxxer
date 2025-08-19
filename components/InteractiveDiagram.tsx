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
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Layers,
  Play,
  Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
    temperature?: number
    powerUsage?: number
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
}

const VENDOR_COLORS = {
  cisco: "#1BA0D7",
  aruba: "#FF6900",
  juniper: "#84BD00",
  fortinet: "#EE3124",
  palo_alto: "#FA582D",
  checkpoint: "#FF6B35",
  microsoft: "#00BCF2",
  google: "#4285F4",
  amazon: "#FF9900",
  vmware: "#607078",
  okta: "#007DC1",
  ping: "#0066CC",
  azure: "#0078D4",
  aws: "#FF9900",
  portnox: "#3B82F6",
  extreme: "#00A651",
  ruckus: "#FF6B00",
  mist: "#41B883",
  meraki: "#58C4DC",
  f5: "#FF6600",
  citrix: "#FFB900",
  zscaler: "#0066CC",
  cloudflare: "#F38020",
  akamai: "#0096D6",
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
  expressroute: "#0EA5E9",
  sdwan: "#C084FC",
  mpls: "#E879F9",
  internet: "#6366F1",
  leased_line: "#F43F5E",
  satellite: "#4ADE80",
}

const INDUSTRY_SCENARIOS = {
  healthcare: {
    name: "Healthcare",
    icon: "🏥",
    color: "#EF4444",
    compliance: ["HIPAA", "HITECH", "FDA"],
    specialRequirements: ["Medical Device Security", "Patient Data Protection", "Telemedicine"],
  },
  financial: {
    name: "Financial Services",
    icon: "🏦",
    color: "#10B981",
    compliance: ["PCI DSS", "SOX", "GDPR"],
    specialRequirements: ["Trading Floor Security", "Fraud Detection", "Regulatory Compliance"],
  },
  manufacturing: {
    name: "Manufacturing",
    icon: "🏭",
    color: "#3B82F6",
    compliance: ["IEC 62443", "NIST 800-82", "ISO 27001"],
    specialRequirements: ["OT Security", "Industrial Control Systems", "Safety Systems"],
  },
  technology: {
    name: "Technology",
    icon: "💻",
    color: "#8B5CF6",
    compliance: ["SOC 2", "GDPR", "ISO 27001"],
    specialRequirements: ["Cloud Security", "DevSecOps", "IP Protection"],
  },
  retail: {
    name: "Retail",
    icon: "🛍️",
    color: "#F59E0B",
    compliance: ["PCI DSS", "CCPA", "GDPR"],
    specialRequirements: ["POS Security", "Customer Data Protection", "Loss Prevention"],
  },
  education: {
    name: "Education",
    icon: "🎓",
    color: "#6366F1",
    compliance: ["FERPA", "CIPA", "FISMA"],
    specialRequirements: ["Student Privacy", "Research Security", "BYOD Management"],
  },
  government: {
    name: "Government",
    icon: "🏛️",
    color: "#6B7280",
    compliance: ["FISMA", "NIST 800-53", "FedRAMP"],
    specialRequirements: ["Classified Security", "Continuous Monitoring", "Insider Threat"],
  },
}

const ARCHITECTURE_VIEWS = [
  {
    id: "complete",
    name: "Complete Architecture",
    icon: Layers,
    description: "Full network architecture with all components",
  },
  {
    id: "authentication",
    name: "Authentication Flow",
    icon: Lock,
    description: "User and device authentication workflows",
  },
  {
    id: "pki",
    name: "PKI & Certificate Management",
    icon: FileKey,
    description: "Certificate authority and PKI infrastructure",
  },
  {
    id: "policies",
    name: "Access Control Policies",
    icon: Shield,
    description: "Policy engine and enforcement points",
  },
  { id: "connectivity", name: "Connectivity Options", icon: Network, description: "WAN, LAN, and cloud connectivity" },
  { id: "intune", name: "Intune Integration", icon: Smartphone, description: "Microsoft Intune MDM integration" },
  { id: "jamf", name: "Jamf Integration", icon: Monitor, description: "Jamf Pro MDM integration" },
  { id: "onboarding", name: "Device Onboarding", icon: UserCheck, description: "Device registration and onboarding" },
  { id: "radsec", name: "RADSEC Proxy", icon: Router, description: "RADIUS over TLS proxy architecture" },
  { id: "ztna", name: "Zero Trust Network Access", icon: Target, description: "ZTNA gateway and application access" },
  { id: "guest", name: "Guest Portal", icon: Users, description: "Guest access and captive portal" },
  { id: "iot", name: "IoT Onboarding", icon: Activity, description: "IoT device discovery and management" },
  { id: "tacacs", name: "TACACS+ Administration", icon: Settings, description: "Device administration with TACACS+" },
  { id: "risk", name: "Risk Assessment", icon: AlertTriangle, description: "Risk-based access control policies" },
  { id: "multisite", name: "Multi-Site Deployment", icon: Building, description: "Multi-location architecture" },
  { id: "cloud", name: "Cloud Integration", icon: Cloud, description: "Cloud services and hybrid connectivity" },
  { id: "wireless", name: "Wireless Infrastructure", icon: Wifi, description: "Wireless network architecture" },
  { id: "wired", name: "Wired Infrastructure", icon: Cable, description: "Wired network infrastructure" },
]

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
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("global")

  useEffect(() => {
    loadSites()
  }, [])

  useEffect(() => {
    generateArchitecture()
  }, [selectedView, selectedIndustry, selectedSite, config])

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

    // Generate architecture based on selected view and industry
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
      default:
        generateCompleteArchitecture(newComponents, newConnections)
    }

    setComponents(newComponents)
    setConnections(newConnections)
  }, [selectedView, selectedIndustry, selectedSite, config])

  const generateCompleteArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    const industryConfig = INDUSTRY_SCENARIOS[selectedIndustry as keyof typeof INDUSTRY_SCENARIOS]

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
        "okta-identity",
        "intune-mdm",
        "jamf-mdm",
        "ztna-gateway",
        "policy-engine",
        "radsec-proxy-primary",
        "certificate-authority",
      ],
      icon: "cloud",
      color: config.customColors.primary,
      description: `Multi-tenant cloud NAC platform optimized for ${industryConfig.name} with ${industryConfig.compliance.join(", ")} compliance`,
      vendor: "portnox",
      version: "v6.5.2",
      location: "Multi-Region (AWS/Azure)",
      compliance: industryConfig.compliance,
      securityFeatures: industryConfig.specialRequirements,
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
        color: VENDOR_COLORS.microsoft,
        description: "Enterprise identity platform with conditional access and MFA",
        vendor: "microsoft",
        version: "2024.01",
        authentication: ["SAML", "OIDC", "OAuth 2.0"],
        userGroups: ["Employees", "Contractors", "Guests", "Service Accounts"],
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
          evaluations: 450000,
          blocked: 1250,
          uptime: 99.95,
          responseTime: 85,
        },
        connections: ["azure-ad-tenant", "intune-mdm", "ztna-gateway"],
        icon: "shield-check",
        color: VENDOR_COLORS.microsoft,
        description: "Advanced conditional access with real-time risk assessment",
        vendor: "microsoft",
        accessPolicies: ["Device Compliance", "Location-based", "Risk-based", "Application-based"],
      })
    }

    if (config.identityProvider.includes("okta")) {
      components.push({
        id: "okta-identity",
        type: "identity_provider",
        name: "Okta Identity Platform",
        x: 400,
        y: 50,
        width: 180,
        height: 100,
        status: "online",
        category: "identity",
        metrics: {
          users: 5500,
          sessions: 3200,
          uptime: 99.98,
          latency: 12,
        },
        connections: ["portnox-cloud-platform", "ztna-gateway"],
        icon: "key",
        color: VENDOR_COLORS.okta,
        description: "Universal Directory and SSO platform with adaptive MFA",
        vendor: "okta",
        authentication: ["SAML", "OIDC", "LDAP"],
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
        threatLevel: "Low",
        vulnerabilities: 0,
      },
      connections: [
        "portnox-cloud-platform",
        "azure-ad-tenant",
        "okta-identity",
        "on-premise-apps",
        "saas-applications",
        "device-trust-engine",
      ],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with micro-segmentation and continuous verification",
      vendor: "portnox",
      version: "v3.2.1",
      applications: ["ERP Systems", "CRM", "File Servers", "Databases"],
      accessPolicies: ["Zero Trust", "Least Privilege", "Continuous Verification"],
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
        devices: 15200,
        compliance: 94.8,
        riskScore: 15,
        threats: 8,
        patches: 156,
        uptime: 99.94,
      },
      connections: ["ztna-gateway", "intune-mdm", "jamf-mdm"],
      icon: "scan",
      color: config.customColors.accent,
      description: "AI-powered device posture assessment with continuous trust scoring",
      securityFeatures: ["Device Fingerprinting", "Behavioral Analysis", "Threat Detection"],
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
          devices: 12500,
          compliance: 92.5,
          policies: 35,
          apps: 125,
          uptime: 99.92,
        },
        connections: ["azure-ad-tenant", "conditional-access", "portnox-cloud-platform", "device-trust-engine"],
        icon: "smartphone",
        color: VENDOR_COLORS.microsoft,
        description: "Unified endpoint management with app protection and compliance policies",
        vendor: "microsoft",
        version: "2024.01",
        deviceTypes: ["Windows", "iOS", "Android", "macOS"],
        policies: ["Compliance", "Configuration", "App Protection"],
      })
    }

    if (config.mdmProvider.includes("jamf")) {
      components.push({
        id: "jamf-mdm",
        type: "mdm_platform",
        name: "Jamf Pro",
        x: 400,
        y: 350,
        width: 180,
        height: 100,
        status: "online",
        category: "management",
        metrics: {
          devices: 2800,
          compliance: 96.2,
          policies: 18,
          apps: 45,
          uptime: 99.89,
        },
        connections: ["portnox-cloud-platform", "device-trust-engine"],
        icon: "smartphone",
        color: "#4A90E2",
        description: "Apple device management with advanced security features",
        vendor: "jamf",
        deviceTypes: ["macOS", "iOS", "iPadOS", "tvOS"],
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
          packetLoss: 0.001,
        },
        connections: ["portnox-cloud-platform", "core-switch-stack"],
        icon: "router",
        color: config.customColors.secondary,
        description: "High-performance RADIUS over TLS proxy with intelligent caching",
        vendor: "portnox",
        version: "v2.8.1",
        ports: [
          { id: "port1", name: "Management", type: "ethernet", status: "active", speed: "1Gbps" },
          { id: "port2", name: "Uplink", type: "fiber", status: "active", speed: "10Gbps" },
        ],
      })
    }

    // Core Network Infrastructure based on wired vendor
    components.push({
      id: "core-switch-stack",
      type: "core_switch",
      name: `${config.wiredVendor.toUpperCase()} Core Switch Stack`,
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
        temperature: 38,
        powerUsage: 2850,
      },
      connections: [
        "radsec-proxy-primary",
        "distribution-switches",
        "wireless-controller",
        "firewall-cluster",
        "connectivity-hub",
      ],
      icon: "server",
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "High-density core switching with 802.1X authentication and dynamic VLAN assignment",
      vendor: config.wiredVendor,
      model: "Enterprise Core Switch",
      vlans: [
        {
          id: "10",
          name: "Management",
          subnet: "192.168.10.0/24",
          gateway: "192.168.10.1",
          dhcp: true,
          description: "Network management VLAN",
        },
        {
          id: "20",
          name: "Corporate",
          subnet: "10.0.20.0/24",
          gateway: "10.0.20.1",
          dhcp: true,
          description: "Corporate user VLAN",
        },
        {
          id: "30",
          name: "Guest",
          subnet: "10.0.30.0/24",
          gateway: "10.0.30.1",
          dhcp: true,
          description: "Guest access VLAN",
        },
        {
          id: "40",
          name: "IoT",
          subnet: "10.0.40.0/24",
          gateway: "10.0.40.1",
          dhcp: true,
          description: "IoT devices VLAN",
        },
      ],
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Distribution layer with advanced routing and VLAN management",
      vendor: config.wiredVendor,
      model: "Distribution Switch",
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "PoE+ enabled access switches with 802.1X authentication",
      vendor: config.wiredVendor,
      model: "Access Switch",
      ports: Array.from({ length: 48 }, (_, i) => ({
        id: `port${i + 1}`,
        name: `Port ${i + 1}`,
        type: "ethernet" as const,
        status: Math.random() > 0.1 ? ("active" as const) : ("inactive" as const),
        speed: "1Gbps",
        vlan: Math.random() > 0.5 ? "20" : "30",
      })),
    })

    // Wireless Infrastructure based on connectivity options
    if (config.connectivity.includes("wireless")) {
      components.push({
        id: "wireless-controller",
        type: "wireless_controller",
        name: `${config.wirelessVendor.toUpperCase()} Wireless Controller`,
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
        color: VENDOR_COLORS[config.wirelessVendor as keyof typeof VENDOR_COLORS] || "#8B5CF6",
        description: "Centralized wireless management with AI-driven optimization",
        vendor: config.wirelessVendor,
        model: "Wireless Controller",
        networkSegments: ["Corporate WiFi", "Guest WiFi", "IoT WiFi"],
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
        color: VENDOR_COLORS[config.wirelessVendor as keyof typeof VENDOR_COLORS] || "#8B5CF6",
        description: "High-density WiFi 6E access points with advanced security",
        vendor: config.wirelessVendor,
        model: "WiFi 6E AP",
      })
    }

    // Security Infrastructure based on firewall vendor
    components.push({
      id: "firewall-cluster",
      type: "firewall_cluster",
      name: `${config.firewallVendor.toUpperCase()} Firewall Cluster`,
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
        threats: 1250,
        blocked: 8500,
        cpu: 45,
        memory: 62,
      },
      connections: ["core-switch-stack", "connectivity-hub", "internet-gateway"],
      icon: "shield",
      color: VENDOR_COLORS[config.firewallVendor as keyof typeof VENDOR_COLORS] || "#EF4444",
      description: "Next-generation firewall cluster with advanced threat protection",
      vendor: config.firewallVendor,
      model: "NGFW Cluster",
      securityFeatures: ["IPS", "Anti-Malware", "URL Filtering", "Application Control", "SSL Inspection"],
    })

    // Connectivity Hub based on deployment type
    if (config.deployment === "hybrid" || config.deployment === "cloud") {
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
          availability: 99.9,
        },
        connections: ["firewall-cluster", "internet-gateway", "cloud-services"],
        icon: "git-branch",
        color: "#059669",
        description: "Intelligent WAN aggregation with automatic failover",
        vendor: "multi-vendor",
        networkSegments: ["MPLS", "Internet", "LTE", "Satellite"],
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
        utilization: 45,
      },
      connections: ["firewall-cluster", "connectivity-hub"],
      icon: "globe",
      color: "#6366F1",
      description: "High-speed internet connectivity with DDoS protection",
      provider: "ISP Provider",
    })

    // Cloud Services based on cloud integration
    if (config.cloudIntegration) {
      components.push({
        id: "cloud-services",
        type: "cloud_services",
        name: "Cloud Services",
        x: 1550,
        y: 400,
        width: 200,
        height: 200,
        status: "online",
        category: "cloud",
        metrics: {
          services: 25,
          uptime: 99.99,
          latency: 15,
          bandwidth: "50 Gbps",
        },
        connections: ["connectivity-hub", "ztna-gateway"],
        icon: "cloud",
        color: "#3B82F6",
        description: "Multi-cloud services integration",
        applications: ["AWS", "Azure", "Google Cloud", "Office 365"],
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
        devices: 12500,
        online: 8950,
        compliance: 94.2,
        threats: 15,
        patches: 2850,
      },
      connections: ["access-switches", "access-points"],
      icon: "monitor",
      color: "#6B7280",
      description: "Diverse endpoint ecosystem with comprehensive security",
      deviceTypes: config.deviceTypes,
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
        applications: ["ERP", "CRM", "File Servers", "Databases"],
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
      applications: ["Office 365", "Salesforce", "ServiceNow", "Slack"],
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
        evaluations: 2850000,
        latency: 1.5,
        accuracy: 99.8,
        uptime: 99.99,
      },
      connections: ["portnox-cloud-platform"],
      icon: "settings",
      color: "#059669",
      description: "AI-powered policy engine with real-time decision making",
      policies: ["Access Control", "Device Compliance", "Risk Assessment", "Remediation"],
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
          certificates: 15200,
          issued: 125,
          revoked: 8,
          expiring: 45,
          uptime: 99.98,
        },
        connections: ["portnox-cloud-platform"],
        icon: "file-key",
        color: "#DC2626",
        description: "Enterprise PKI with automated certificate lifecycle management",
        certificates: [
          { name: "Root CA", issuer: "Internal CA", subject: "CN=Root CA", expiry: "2030-12-31", status: "valid" },
          {
            name: "Intermediate CA",
            issuer: "Root CA",
            subject: "CN=Intermediate CA",
            expiry: "2028-12-31",
            status: "valid",
          },
        ],
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
          authentications: 5000,
          authorizations: 12000,
          accounting: 8000,
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
      deviceTypes: config.deviceTypes,
      authentication: config.authTypes,
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
      color:
        VENDOR_COLORS[
          config.connectivity.includes("wireless")
            ? (config.wirelessVendor as keyof typeof VENDOR_COLORS)
            : (config.wiredVendor as keyof typeof VENDOR_COLORS)
        ] || "#8B5CF6",
      description: "802.1X enabled switch port or wireless access point",
      vendor: config.connectivity.includes("wireless") ? config.wirelessVendor : config.wiredVendor,
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
      name: config.identityProvider.includes("azure_ad") ? "Azure Active Directory" : "Identity Provider",
      x: 1400,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "identity",
      connections: ["portnox-cloud"],
      icon: "users",
      color: config.identityProvider.includes("azure_ad") ? VENDOR_COLORS.microsoft : "#0078D4",
      description: "Enterprise identity provider for user authentication",
      vendor: config.identityProvider.includes("azure_ad") ? "microsoft" : "generic",
      authentication: ["SAML", "OIDC", "LDAP"],
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
      policies: ["Device Compliance", "User Authorization", "Network Segmentation"],
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
      location: "Secure Vault",
      certificates: [
        {
          name: "Root CA Certificate",
          issuer: "Self-Signed",
          subject: "CN=Root CA",
          expiry: "2035-12-31",
          status: "valid",
        },
      ],
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
      policies: ["Access Control", "Device Compliance", "Risk Assessment", "Network Segmentation"],
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
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Distribution layer with advanced routing",
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "PoE+ enabled access switches",
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS.microsoft,
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
      color: VENDOR_COLORS.microsoft,
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
      color: "#4A90E2",
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Network devices configured for RADIUS authentication",
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Network devices configured for TACACS+ authentication",
      vendor: config.wiredVendor,
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
      name: "Headquarters",
      x: 600,
      y: 200,
      width: 300,
      height: 150,
      status: "online",
      category: "network",
      connections: ["branch-office-1", "branch-office-2", "remote-sites"],
      icon: "building",
      color: config.customColors.primary,
      description: "Main headquarters with centralized NAC management",
    })

    // Branch Offices
    components.push({
      id: "branch-office-1",
      type: "branch_office",
      name: "Branch Office - East",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building",
      color: "#059669",
      description: "Eastern branch office with local network infrastructure",
    })

    components.push({
      id: "branch-office-2",
      type: "branch_office",
      name: "Branch Office - West",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building",
      color: "#059669",
      description: "Western branch office with local network infrastructure",
    })

    // Remote Sites
    components.push({
      id: "remote-sites",
      type: "remote_sites",
      name: "Remote Sites (15x)",
      x: 600,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: ["headquarters"],
      icon: "building",
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
      name: "AWS Services",
      x: 200,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: VENDOR_COLORS.aws,
      description: "Amazon Web Services integration",
      vendor: "aws",
    })

    // Azure Services
    components.push({
      id: "azure-services",
      type: "azure_services",
      name: "Azure Services",
      x: 1000,
      y: 100,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: VENDOR_COLORS.azure,
      description: "Microsoft Azure services integration",
      vendor: "microsoft",
    })

    // Google Cloud
    components.push({
      id: "google-cloud",
      type: "google_cloud",
      name: "Google Cloud Platform",
      x: 200,
      y: 400,
      width: 250,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["multi-cloud-hub"],
      icon: "cloud",
      color: VENDOR_COLORS.google,
      description: "Google Cloud Platform integration",
      vendor: "google",
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
    // Wireless Controller Cluster
    components.push({
      id: "wireless-controller-cluster",
      type: "wireless_controller_cluster",
      name: `${config.wirelessVendor.toUpperCase()} Wireless Controller Cluster`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["access-points", "wireless-management", "network-core"],
      icon: "wifi",
      color: VENDOR_COLORS[config.wirelessVendor as keyof typeof VENDOR_COLORS] || "#8B5CF6",
      description: "High-availability wireless controller cluster",
      vendor: config.wirelessVendor,
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
      color: VENDOR_COLORS[config.wirelessVendor as keyof typeof VENDOR_COLORS] || "#8B5CF6",
      description: "High-density WiFi 6E access points",
      vendor: config.wirelessVendor,
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
    // Core Switch Stack
    components.push({
      id: "core-switch-stack",
      type: "core_switch_stack",
      name: `${config.wiredVendor.toUpperCase()} Core Switch Stack`,
      x: 600,
      y: 200,
      width: 350,
      height: 150,
      status: "online",
      category: "network",
      connections: ["distribution-switches", "access-switches", "network-management"],
      icon: "server",
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Distribution layer switches",
      vendor: config.wiredVendor,
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
      color: VENDOR_COLORS[config.wiredVendor as keyof typeof VENDOR_COLORS] || "#6B7280",
      description: "Access layer switches with PoE+",
      vendor: config.wiredVendor,
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

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(25, Math.min(200, prev + delta)))
  }

  const handlePan = (deltaX: number, deltaY: number) => {
    setPanOffset((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))
  }

  const handleExport = (format: "png" | "svg" | "pdf") => {
    // Export functionality would be implemented here
    console.log(`Exporting diagram as ${format}`)
    toast({
      title: "Export Started",
      description: `Exporting diagram as ${format.toUpperCase()}...`,
    })
  }

  const handleSave = async () => {
    try {
      const diagramData = {
        components,
        connections,
        config: {
          selectedView,
          selectedIndustry,
          selectedSite,
          zoomLevel,
          panOffset,
          showMetrics,
          showConnections,
          showLabels,
        },
        timestamp: new Date().toISOString(),
      }

      // Save to storage
      localStorage.setItem("nac-diagram-data", JSON.stringify(diagramData))

      toast({
        title: "Diagram Saved",
        description: "Your diagram configuration has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving diagram:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save diagram configuration.",
        variant: "destructive",
      })
    }
  }

  const handleAutoLayout = () => {
    // Auto-layout functionality would be implemented here
    console.log("Applying automatic layout")
    toast({
      title: "Auto Layout",
      description: "Applying intelligent component positioning...",
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
            <rect x={component.width - 90} y={component.height - 25} width={80} height={20} rx={10} fill="#F3F4F6" />
            <text x={component.width - 50} y={component.height - 12} fontSize={10} textAnchor="middle" fill="#374151">
              {component.vendor.toUpperCase()}
            </text>
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
    <div className="w-full h-full relative bg-gradient-to-br from-slate-50 to-blue-50" ref={containerRef}>
      {/* Enhanced Control Panel */}
      {showControlPanel && (
        <Card className="absolute top-4 left-4 z-20 w-96 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Architecture Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="view" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
              </TabsList>

              <TabsContent value="view" className="space-y-4 mt-4">
                {/* Industry Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Industry Scenario</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INDUSTRY_SCENARIOS).map(([key, industry]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{industry.icon}</span>
                            <span>{industry.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Site Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Site Configuration</Label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue />
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

                {/* Architecture View Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Architecture View</Label>
                  <Select value={selectedView} onValueChange={setSelectedView}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ARCHITECTURE_VIEWS.map((view) => {
                        const IconComponent = view.icon
                        return (
                          <SelectItem key={view.id} value={view.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{view.name}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick View Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {ARCHITECTURE_VIEWS.slice(0, 6).map((view) => {
                    const IconComponent = view.icon
                    return (
                      <Button
                        key={view.id}
                        variant={selectedView === view.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedView(view.id)}
                        className="justify-start h-auto p-2"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-3 w-3" />
                          <span className="text-xs">{view.name.split(" ")[0]}</span>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4 mt-4">
                {/* Vendor Configuration */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Wired Vendor</Label>
                    <Select value={config.wiredVendor} onValueChange={(value) => console.log("Wired vendor:", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="aruba">Aruba (HPE)</SelectItem>
                        <SelectItem value="juniper">Juniper</SelectItem>
                        <SelectItem value="extreme">Extreme Networks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Wireless Vendor</Label>
                    <Select
                      value={config.wirelessVendor}
                      onValueChange={(value) => console.log("Wireless vendor:", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="aruba">Aruba (HPE)</SelectItem>
                        <SelectItem value="ruckus">Ruckus</SelectItem>
                        <SelectItem value="mist">Mist (Juniper)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Firewall Vendor</Label>
                    <Select
                      value={config.firewallVendor}
                      onValueChange={(value) => console.log("Firewall vendor:", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="palo_alto">Palo Alto Networks</SelectItem>
                        <SelectItem value="fortinet">Fortinet</SelectItem>
                        <SelectItem value="checkpoint">Check Point</SelectItem>
                        <SelectItem value="cisco">Cisco ASA/FTD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Connectivity Options */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Connectivity</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "wired", label: "Wired", icon: Cable },
                      { id: "wireless", label: "Wireless", icon: Wifi },
                      { id: "vpn", label: "VPN", icon: Shield },
                      { id: "cloud", label: "Cloud", icon: Cloud },
                    ].map(({ id, label, icon: Icon }) => (
                      <div key={id} className="flex items-center space-x-2">
                        <Checkbox
                          id={id}
                          checked={config.connectivity.includes(id)}
                          onCheckedChange={(checked) => {
                            console.log(`${id} connectivity:`, checked)
                          }}
                        />
                        <Label htmlFor={id} className="flex items-center gap-1 text-xs">
                          <Icon className="h-3 w-3" />
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authentication Types */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Authentication</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "802.1x", label: "802.1X Certificate" },
                      { id: "mac_auth", label: "MAC Authentication" },
                      { id: "web_auth", label: "Web Authentication" },
                      { id: "captive_portal", label: "Captive Portal" },
                    ].map(({ id, label }) => (
                      <div key={id} className="flex items-center space-x-2">
                        <Checkbox
                          id={id}
                          checked={config.authTypes.includes(id)}
                          onCheckedChange={(checked) => {
                            console.log(`${id} auth:`, checked)
                          }}
                        />
                        <Label htmlFor={id} className="text-xs">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4 mt-4">
                {/* Display Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Show Metrics</Label>
                    <Switch checked={showMetrics} onCheckedChange={setShowMetrics} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Show Connections</Label>
                    <Switch checked={showConnections} onCheckedChange={setShowConnections} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Show Labels</Label>
                    <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Show Grid</Label>
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Animations</Label>
                    <Switch checked={animationActive} onCheckedChange={setAnimationActive} />
                  </div>
                </div>

                <Separator />

                {/* Zoom and Animation Speed */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Zoom Level: {zoomLevel}%</Label>
                    <Slider
                      value={[zoomLevel]}
                      onValueChange={(value) => setZoomLevel(value[0])}
                      min={25}
                      max={200}
                      step={25}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Animation Speed</Label>
                    <Slider
                      value={[animationSpeed]}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                      min={10}
                      max={100}
                      step={10}
                    />
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport(exportFormat)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAutoLayout}>
                    <Layers className="h-4 w-4 mr-2" />
                    Auto Layout
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Diagram Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleZoom(25)} className="bg-white/80 hover:bg-white">
          <ZoomIn size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleZoom(-25)} className="bg-white/80 hover:bg-white">
          <ZoomOut size={16} />
        </Button>
        <Button
          variant={showMetrics ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMetrics(!showMetrics)}
          className={showMetrics ? "" : "bg-white/80 hover:bg-white"}
        >
          <BarChart3 size={16} />
        </Button>
        <Button
          variant={showConnections ? "default" : "outline"}
          size="sm"
          onClick={() => setShowConnections(!showConnections)}
          className={showConnections ? "" : "bg-white/80 hover:bg-white"}
        >
          <GitBranch size={16} />
        </Button>
        <Button
          variant={animationActive ? "default" : "outline"}
          size="sm"
          onClick={() => setAnimationActive(!animationActive)}
          className={animationActive ? "" : "bg-white/80 hover:bg-white"}
        >
          {animationActive ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowControlPanel(!showControlPanel)}
          className="bg-white/80 hover:bg-white"
        >
          <Settings size={16} />
        </Button>
      </div>

      {/* Main SVG Diagram */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${-panOffset.x} ${-panOffset.y} ${1800 * (100 / zoomLevel)} ${1400 * (100 / zoomLevel)}`}
        className="w-full h-full"
      >
        {/* Definitions */}
        <defs>
          {/* Grid Pattern */}
          {showGrid && (
            <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          )}

          {/* Arrow Marker */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
          </marker>

          {/* Gradient Definitions */}
          <linearGradient id="componentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill={showGrid ? "url(#grid)" : "transparent"} />

        {/* Connections */}
        {showConnections && connections.map(renderConnection)}

        {/* Components */}
        {components.map(renderComponent)}
      </svg>

      {/* Component/Connection Details Panel */}
      {(selectedComponent || selectedConnection) && (
        <Card className="absolute bottom-4 left-4 w-96 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl max-h-96">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {selectedComponent ? selectedComponent.name : selectedConnection?.protocol}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComponent(null)
                  setSelectedConnection(null)
                }}
              >
                <XCircle size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {selectedComponent && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <Badge
                      className={`${
                        selectedComponent.status === "online"
                          ? "bg-green-100 text-green-800"
                          : selectedComponent.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedComponent.status === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedComponent.status}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="text-sm text-gray-700 mt-1">{selectedComponent.description}</p>
                  </div>

                  {selectedComponent.vendor && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Vendor:</span>
                      <Badge className="bg-blue-100 text-blue-800">{selectedComponent.vendor}</Badge>
                    </div>
                  )}

                  {selectedComponent.version && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Version:</span>
                      <span className="text-sm">{selectedComponent.version}</span>
                    </div>
                  )}

                  {selectedComponent.metrics && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Metrics:</span>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(selectedComponent.metrics)
                          .slice(0, 8)
                          .map(([key, value]) => (
                            <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                              <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                              <span className="ml-1 font-medium">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.compliance && selectedComponent.compliance.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Compliance:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedComponent.compliance.map((comp, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.securityFeatures && selectedComponent.securityFeatures.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Security Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedComponent.securityFeatures.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.applications && selectedComponent.applications.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Applications:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedComponent.applications.map((app, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.vlans && selectedComponent.vlans.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">VLANs:</span>
                      <div className="space-y-1 mt-1">
                        {selectedComponent.vlans.slice(0, 3).map((vlan) => (
                          <div key={vlan.id} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                VLAN {vlan.id}: {vlan.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {vlan.subnet}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{vlan.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedConnection && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <Badge className="bg-blue-100 text-blue-800">{selectedConnection.type}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Protocol:</span>
                    <span className="text-sm font-medium">{selectedConnection.protocol}</span>
                  </div>

                  {selectedConnection.port && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Port:</span>
                      <span className="text-sm font-medium">{selectedConnection.port}</span>
                    </div>
                  )}

                  {selectedConnection.bandwidth && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Bandwidth:</span>
                      <span className="text-sm font-medium">{selectedConnection.bandwidth}</span>
                    </div>
                  )}

                  {selectedConnection.latency && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Latency:</span>
                      <span className="text-sm font-medium">{selectedConnection.latency}ms</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Encryption:</span>
                    <Badge
                      className={`${
                        selectedConnection.encryption ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedConnection.encryption ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <Badge
                      className={`${
                        selectedConnection.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedConnection.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedConnection.status}
                    </Badge>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {showLegend && (
        <Card className="absolute bottom-4 right-4 w-80 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Architecture Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current View Info */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const currentView = ARCHITECTURE_VIEWS.find((v) => v.id === selectedView)
                  const IconComponent = currentView?.icon || Layers
                  return (
                    <>
                      <IconComponent className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">{currentView?.name}</span>
                    </>
                  )
                })()}
              </div>
              <p className="text-xs text-blue-700">
                {ARCHITECTURE_VIEWS.find((v) => v.id === selectedView)?.description}
              </p>
            </div>

            {/* Industry Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {INDUSTRY_SCENARIOS[selectedIndustry as keyof typeof INDUSTRY_SCENARIOS]?.icon}
                </span>
                <span className="font-medium">
                  {INDUSTRY_SCENARIOS[selectedIndustry as keyof typeof INDUSTRY_SCENARIOS]?.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {INDUSTRY_SCENARIOS[selectedIndustry as keyof typeof INDUSTRY_SCENARIOS]?.compliance.map((comp) => (
                  <Badge key={comp} variant="secondary" className="text-xs">
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Legend */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Component Status</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Offline</span>
                </div>
              </div>
            </div>

            {/* Connection Types */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Connection Types</div>
              <div className="space-y-1">
                {Object.entries(CONNECTION_COLORS)
                  .slice(0, 6)
                  .map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-0.5" style={{ backgroundColor: color }}></div>
                      <span className="capitalize">{type.replace("_", " ")}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Component Categories */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Categories</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Cloud size={12} className="text-blue-500" />
                  <span>Cloud</span>
                </div>
                <div className="flex items-center gap-1">
                  <Network size={12} className="text-gray-500" />
                  <span>Network</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-red-500" />
                  <span>Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-blue-600" />
                  <span>Identity</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings size={12} className="text-purple-500" />
                  <span>Management</span>
                </div>
                <div className="flex items-center gap-1">
                  <Monitor size={12} className="text-green-500" />
                  <span>Endpoint</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
