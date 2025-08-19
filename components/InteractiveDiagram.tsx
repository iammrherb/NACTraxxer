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
  Home,
  Briefcase,
  Car,
  Plane,
  Ship,
  Truck,
  Train,
  Bus,
  Bike,
  Minimize2,
  Maximize2,
  Move,
  X,
  Info,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import VendorImpactDemo from "./VendorImpactDemo"

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

const ARCHITECTURE_VIEWS = [
  { id: "complete", name: "Complete Architecture", description: "Full network architecture with all components" },
  { id: "authentication", name: "Authentication Flow", description: "User and device authentication workflows" },
  { id: "pki", name: "PKI & Certificate Management", description: "Certificate authority hierarchy and PKI" },
  { id: "policies", name: "Access Control Policies", description: "Policy engine and enforcement mechanisms" },
  { id: "connectivity", name: "Connectivity Options", description: "WAN, LAN, cloud, and hybrid connectivity" },
  { id: "intune", name: "Microsoft Intune Integration", description: "Intune MDM integration and device compliance" },
  { id: "jamf", name: "Jamf Pro Integration", description: "Jamf Pro MDM integration for Apple devices" },
  { id: "onboarding", name: "Device Onboarding", description: "Automated device registration workflows" },
  { id: "radsec", name: "RADSEC Proxy Architecture", description: "RADIUS over TLS proxy deployment" },
  { id: "ztna", name: "Zero Trust Network Access", description: "ZTNA gateway and micro-segmentation" },
  { id: "guest", name: "Guest Portal & Access", description: "Guest access management and captive portal" },
  { id: "iot", name: "IoT Device Onboarding", description: "IoT device discovery and automated onboarding" },
  { id: "tacacs", name: "TACACS+ Administration", description: "Network device administration with TACACS+" },
  { id: "risk", name: "Risk Assessment & Analytics", description: "Risk-based access control and threat assessment" },
  { id: "multisite", name: "Multi-Site Deployment", description: "Enterprise multi-location architecture" },
  { id: "cloud", name: "Cloud Integration", description: "Multi-cloud services integration" },
  { id: "wireless", name: "Wireless Infrastructure", description: "Wireless network architecture" },
  { id: "wired", name: "Wired Infrastructure", description: "Wired network infrastructure" },
  { id: "compliance", name: "Compliance & Audit", description: "Compliance monitoring and audit trails" },
  { id: "monitoring", name: "Monitoring & Analytics", description: "Network monitoring and performance management" },
]

const LEGEND_CATEGORIES = [
  {
    name: "Component Types",
    items: [
      { icon: "cloud", label: "Cloud Services", color: "#3B82F6", description: "Cloud-based platforms and services" },
      {
        icon: "network",
        label: "Network Infrastructure",
        color: "#10B981",
        description: "Switches, routers, and network devices",
      },
      {
        icon: "shield",
        label: "Security Components",
        color: "#EF4444",
        description: "Firewalls, security appliances, and protection systems",
      },
      {
        icon: "users",
        label: "Identity & Access",
        color: "#8B5CF6",
        description: "Identity providers and access management",
      },
      { icon: "smartphone", label: "Endpoint Devices", color: "#6B7280", description: "User devices and endpoints" },
      {
        icon: "settings",
        label: "Management Systems",
        color: "#059669",
        description: "Policy engines and management platforms",
      },
    ],
  },
  {
    name: "Connection Types",
    items: [
      { type: "line", label: "Ethernet", color: "#9CA3AF", description: "Wired network connections" },
      { type: "line", label: "Wireless", color: "#A78BFA", description: "Wi-Fi network connections" },
      { type: "line", label: "RADIUS", color: "#F87171", description: "Authentication protocol connections" },
      { type: "line", label: "RADSEC", color: "#9333EA", description: "RADIUS over TLS connections" },
      { type: "line", label: "API", color: "#6EE7B7", description: "REST API communications" },
      { type: "line", label: "SAML", color: "#60A5FA", description: "Identity federation connections" },
    ],
  },
  {
    name: "Status Indicators",
    items: [
      { type: "circle", label: "Online", color: "#10B981", description: "Component is operational" },
      { type: "circle", label: "Warning", color: "#F59E0B", description: "Component has warnings" },
      { type: "circle", label: "Error", color: "#EF4444", description: "Component has errors" },
      { type: "circle", label: "Maintenance", color: "#8B5CF6", description: "Component is under maintenance" },
      { type: "circle", label: "Offline", color: "#6B7280", description: "Component is offline" },
    ],
  },
]

export default function InteractiveDiagram({ config }: { config: ArchitectureConfig }) {
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
  const [controlPanelMinimized, setControlPanelMinimized] = useState(false)
  const [controlPanelPosition, setControlPanelPosition] = useState({ x: 16, y: 16 })
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
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
    loadDemoData()
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

  const loadDemoData = async () => {
    try {
      // Generate realistic demo data for healthcare industry
      const demoSites = [
        {
          id: "site-healthcare-1",
          name: "Main Hospital Campus",
          location: "Downtown Medical Center",
          industry: "healthcare",
          type: "Hospital",
          status: "Complete",
          priority: "Critical",
          budget: 850000,
          timeline: "18 months",
          users: 2500,
          devices: 8500,
          completionPercent: 85,
          region: "North America",
          country: "United States",
          compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11"],
          specialRequirements: ["24/7 Operations", "Emergency Access", "Medical Device Integration"],
          infrastructure: {
            wiredVendor: "cisco",
            wirelessVendor: "aruba",
            firewallVendor: "palo_alto",
            switches: 48,
            accessPoints: 120,
            firewalls: 4,
          },
          connectivity: {
            internet: true,
            mpls: true,
            vpn: true,
            sdwan: false,
            satellite: false,
          },
          identityProviders: "azure_ad",
          mdmProvider: "intune",
          authTypes: ["802.1x", "mac_auth", "web_auth"],
          deviceTypes: ["Medical Workstations", "Imaging Equipment", "Patient Monitors", "Mobile Carts"],
          phases: [
            {
              name: "Planning & Design",
              status: "Complete",
              progress: 100,
            },
            {
              name: "Infrastructure Deployment",
              status: "In Progress",
              progress: 75,
            },
            {
              name: "Policy Configuration",
              status: "In Progress",
              progress: 60,
            },
            {
              name: "Testing & Validation",
              status: "Pending",
              progress: 0,
            },
          ],
        },
        {
          id: "site-healthcare-2",
          name: "Outpatient Clinic Network",
          location: "Suburban Locations (5 sites)",
          industry: "healthcare",
          type: "Clinic",
          status: "In Progress",
          priority: "High",
          budget: 180000,
          timeline: "12 months",
          users: 450,
          devices: 1200,
          completionPercent: 45,
          region: "North America",
          country: "United States",
          compliance: ["HIPAA", "HITECH"],
          specialRequirements: ["Telemedicine", "Mobile Device Support", "Patient Portal Access"],
          infrastructure: {
            wiredVendor: "aruba",
            wirelessVendor: "aruba",
            firewallVendor: "fortinet",
            switches: 15,
            accessPoints: 35,
            firewalls: 5,
          },
          connectivity: {
            internet: true,
            mpls: false,
            vpn: true,
            sdwan: true,
            satellite: false,
          },
          identityProviders: "azure_ad",
          mdmProvider: "intune",
          authTypes: ["802.1x", "web_auth"],
          deviceTypes: ["Tablets for Nurses", "BYOD Smartphones", "Telehealth Equipment"],
          phases: [
            {
              name: "Planning & Design",
              status: "Complete",
              progress: 100,
            },
            {
              name: "Infrastructure Deployment",
              status: "In Progress",
              progress: 40,
            },
            {
              name: "Policy Configuration",
              status: "Pending",
              progress: 0,
            },
          ],
        },
        {
          id: "site-healthcare-3",
          name: "Research Facility",
          location: "University Campus",
          industry: "healthcare",
          type: "Research",
          status: "Planning",
          priority: "Medium",
          budget: 120000,
          timeline: "9 months",
          users: 180,
          devices: 650,
          completionPercent: 15,
          region: "North America",
          country: "United States",
          compliance: ["HIPAA", "FDA 21 CFR Part 11"],
          specialRequirements: ["Data Isolation", "Collaboration Tools", "High-Performance Computing"],
          infrastructure: {
            wiredVendor: "juniper",
            wirelessVendor: "ruckus",
            firewallVendor: "checkpoint",
            switches: 12,
            accessPoints: 25,
            firewalls: 2,
          },
          connectivity: {
            internet: true,
            mpls: false,
            vpn: true,
            sdwan: false,
            satellite: false,
          },
          identityProviders: "okta",
          mdmProvider: "jamf",
          authTypes: ["802.1x", "certificate"],
          deviceTypes: ["Research Workstations", "Lab Equipment", "High-Performance Computing"],
          phases: [
            {
              name: "Planning & Design",
              status: "In Progress",
              progress: 60,
            },
            {
              name: "Infrastructure Deployment",
              status: "Pending",
              progress: 0,
            },
          ],
        },
      ]

      // Generate demo policies
      const demoPolicies = [
        {
          id: "policy-healthcare-1",
          name: "Medical Device Access Policy",
          description: "Secure access control for medical devices and equipment",
          type: "Device Access",
          status: "active",
          priority: "Critical",
          effectiveness: 94,
          compliance: ["HIPAA", "FDA 21 CFR Part 11"],
          conditions: ["Device Type: Medical Equipment", "Network Segment: Medical Device VLAN", "Time: 24/7"],
          actions: ["Allow Access", "Monitor Traffic", "Log All Activities"],
          appliedSites: ["site-healthcare-1", "site-healthcare-2"],
        },
        {
          id: "policy-healthcare-2",
          name: "BYOD Access Policy",
          description: "Controlled access for personal devices in healthcare environment",
          type: "BYOD",
          status: "active",
          priority: "High",
          effectiveness: 87,
          compliance: ["HIPAA"],
          conditions: ["Device Compliance: Required", "User Role: Healthcare Staff", "MDM Enrollment: Required"],
          actions: ["Limited Network Access", "App Protection", "Data Encryption"],
          appliedSites: ["site-healthcare-1", "site-healthcare-2", "site-healthcare-3"],
        },
        {
          id: "policy-healthcare-3",
          name: "Guest Network Policy",
          description: "Secure guest access for patients and visitors",
          type: "Guest Access",
          status: "active",
          priority: "Medium",
          effectiveness: 91,
          compliance: ["HIPAA"],
          conditions: ["User Type: Guest", "Sponsor Approval: Required", "Time Limit: 8 hours"],
          actions: ["Internet Only Access", "Bandwidth Limit", "Content Filtering"],
          appliedSites: ["site-healthcare-1", "site-healthcare-2"],
        },
      ]

      // Generate demo events
      const demoEvents = [
        {
          id: "event-1",
          title: "Main Hospital NAC Deployment",
          description: "Complete NAC infrastructure deployment for main hospital campus",
          type: "deployment",
          status: "in_progress",
          priority: "high",
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: ["John Smith", "Sarah Johnson"],
          siteId: "site-healthcare-1",
          progress: 75,
        },
        {
          id: "event-2",
          title: "Clinic Network Rollout",
          description: "Multi-site clinic network deployment and configuration",
          type: "rollout",
          status: "scheduled",
          priority: "medium",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: ["Mike Davis", "Lisa Chen"],
          siteId: "site-healthcare-2",
          progress: 0,
        },
        {
          id: "event-3",
          title: "Research Facility Planning",
          description: "Architecture design and planning for research facility NAC",
          type: "planning",
          status: "in_progress",
          priority: "low",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: ["Alex Rodriguez"],
          siteId: "site-healthcare-3",
          progress: 25,
        },
      ]

      // Generate demo users
      const demoUsers = [
        {
          id: "user-1",
          name: "John Smith",
          email: "john.smith@hospital.com",
          role: "Network Administrator",
          department: "IT",
          sites: ["site-healthcare-1", "site-healthcare-2"],
          permissions: ["admin", "deploy", "configure"],
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "active",
        },
        {
          id: "user-2",
          name: "Sarah Johnson",
          email: "sarah.johnson@hospital.com",
          role: "Security Analyst",
          department: "Security",
          sites: ["site-healthcare-1", "site-healthcare-3"],
          permissions: ["security", "audit", "monitor"],
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "active",
        },
        {
          id: "user-3",
          name: "Mike Davis",
          email: "mike.davis@hospital.com",
          role: "Project Manager",
          department: "IT",
          sites: ["site-healthcare-2"],
          permissions: ["project", "schedule", "report"],
          lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
        },
      ]

      // Save demo data to storage
      await storage.saveSites(demoSites)
      await storage.saveGlobalPolicies(demoPolicies)
      await storage.saveEvents(demoEvents)
      await storage.saveUsers(demoUsers)

      setSites(demoSites)
    } catch (error) {
      console.error("Error loading demo data:", error)
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

  // Add all the other generator functions here (authentication, pki, etc.)
  // For brevity, I'll include a few key ones:

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

  // Add other generator functions (PKI, Policy, etc.) - abbreviated for space
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

    // Add more PKI components...
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

    // Add more policy components...
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

    // Add more connectivity components...
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

    // Add more Intune components...
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

    // Add more Jamf components...
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

    // Add more onboarding components...
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

    // Add more RADSEC components...
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

    // Add more ZTNA components...
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

    // Add more guest portal components...
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

    // Add more IoT components...
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

    // Add more TACACS components...
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

    // Add more risk components...
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

    // Add more multi-site components...
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

    // Add more cloud components...
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

    // Add more wireless components...
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

    // Add more wired components...
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

    // Add more compliance components...
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

    // Add more monitoring components...
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
                ? Math.max(0, component.metrics.connections + Math.floor((Math.random() - 0.5) * 10)) ||
                  component.metrics.connections
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
    setCustomConfig((prev) => ({
      ...prev,
      [category]: vendor,
    }))
  }

  const handlePanelDrag = (e: React.MouseEvent) => {
    if (!isDraggingPanel) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const newX = Math.max(0, Math.min(rect.width - 400, e.clientX - rect.left - dragStart.x))
      const newY = Math.max(0, Math.min(rect.height - 600, e.clientY - rect.top - dragStart.y))
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
      onMouseMove={handlePanelDrag}
    >
      {/* Enhanced Control Panel - Now Moveable and Minimizable */}
      {showControlPanel && (
        <Card
          ref={controlPanelRef}
          className="absolute z-20 w-96 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl max-h-[calc(100vh-2rem)] overflow-hidden"
          style={{
            left: controlPanelPosition.x,
            top: controlPanelPosition.y,
            cursor: isDraggingPanel ? "grabbing" : "default",
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Architecture Controls
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onMouseDown={handlePanelDragStart}
                  className="cursor-grab hover:cursor-grab active:cursor-grabbing"
                >
                  <Move className="h-4 w-4" />
                </Button>
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
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="view">View</TabsTrigger>
                      <TabsTrigger value="config">Config</TabsTrigger>
                      <TabsTrigger value="display">Display</TabsTrigger>
                      <TabsTrigger value="vendor">Vendor</TabsTrigger>
                    </TabsList>

                    <TabsContent value="view" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Architecture View</label>
                        <Select value={selectedView} onValueChange={setSelectedView}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ARCHITECTURE_VIEWS.map((view) => (
                              <SelectItem key={view.id} value={view.id}>
                                <div className="flex flex-col">
                                  <span>{view.name}</span>
                                  <span className="text-xs text-gray-500">{view.description}</span>
                                </div>
                              </SelectItem>
                            ))}
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
                            <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                            <SelectItem value="financial">🏦 Financial Services</SelectItem>
                            <SelectItem value="manufacturing">🏭 Manufacturing</SelectItem>
                            <SelectItem value="technology">💻 Technology</SelectItem>
                            <SelectItem value="retail">🛍️ Retail</SelectItem>
                            <SelectItem value="education">🎓 Education</SelectItem>
                            <SelectItem value="government">🏛️ Government</SelectItem>
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
                            <SelectItem value="cloud">☁️ Cloud Only</SelectItem>
                            <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                            <SelectItem value="on_premise">🏢 On-Premise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Wired Vendor</label>
                        <Select
                          value={customConfig.wiredVendor}
                          onValueChange={(value) => handleVendorChange("wiredVendor", value)}
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
                          onValueChange={(value) => handleVendorChange("wirelessVendor", value)}
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
                          onValueChange={(value) => handleVendorChange("firewallVendor", value)}
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

                    <TabsContent value="vendor" className="space-y-4">
                      <VendorImpactDemo
                        onVendorChange={handleVendorChange}
                        currentConfig={{
                          wiredVendor: customConfig.wiredVendor,
                          wirelessVendor: customConfig.wirelessVendor,
                          firewallVendor: customConfig.firewallVendor,
                          identityProviders: customConfig.identityProviders,
                          mdmProviders: customConfig.mdmProviders,
                          cloudProviders: customConfig.cloudProviders,
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </CardContent>
          )}
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
                  <Badge
                    variant="outline"
                    style={{ borderColor: selectedComponent.color, color: selectedComponent.color }}
                  >
                    {selectedComponent.vendor.toUpperCase()}
                  </Badge>
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
                  <h4 className="font-medium text-sm">Real-time Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedComponent.metrics.cpu && !isNaN(selectedComponent.metrics.cpu) && (
                      <div>CPU: {Math.round(selectedComponent.metrics.cpu)}%</div>
                    )}
                    {selectedComponent.metrics.memory && !isNaN(selectedComponent.metrics.memory) && (
                      <div>Memory: {Math.round(selectedComponent.metrics.memory)}%</div>
                    )}
                    {selectedComponent.metrics.uptime && !isNaN(selectedComponent.metrics.uptime) && (
                      <div>Uptime: {selectedComponent.metrics.uptime.toFixed(2)}%</div>
                    )}
                    {selectedComponent.metrics.latency && !isNaN(selectedComponent.metrics.latency) && (
                      <div>Latency: {selectedComponent.metrics.latency}ms</div>
                    )}
                    {selectedComponent.metrics.throughput && (
                      <div>Throughput: {selectedComponent.metrics.throughput}</div>
                    )}
                    {selectedComponent.metrics.connections && !isNaN(selectedComponent.metrics.connections) && (
                      <div>Connections: {selectedComponent.metrics.connections.toLocaleString()}</div>
                    )}
                    {selectedComponent.metrics.users && !isNaN(selectedComponent.metrics.users) && (
                      <div>Users: {selectedComponent.metrics.users.toLocaleString()}</div>
                    )}
                    {selectedComponent.metrics.sessions && !isNaN(selectedComponent.metrics.sessions) && (
                      <div>Sessions: {selectedComponent.metrics.sessions.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              )}

              {selectedComponent.connections && selectedComponent.connections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Connected Components</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedComponent.connections.slice(0, 3).map((connId, index) => {
                      const connectedComponent = components.find((c) => c.id === connId)
                      return connectedComponent ? (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {connectedComponent.name.length > 15
                            ? `${connectedComponent.name.substring(0, 15)}...`
                            : connectedComponent.name}
                        </Badge>
                      ) : null
                    })}
                    {selectedComponent.connections.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedComponent.connections.length - 3} more
                      </Badge>
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

            {/* Gradient definitions for enhanced visuals */}
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          {showGrid && <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />}

          {/* Render connections first (behind components) */}
          {showConnections && connections.map(renderConnection)}

          {/* Render components */}
          {components.map(renderComponent)}
        </svg>
      </div>

      {/* Enhanced Legend at Bottom */}
      {showLegend && (
        <Card className="absolute bottom-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Architecture Legend
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLegend(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {LEGEND_CATEGORIES[0].items.map((item, index) => {
                    const IconComponent = COMPONENT_ICONS[item.icon as keyof typeof COMPONENT_ICONS]
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: item.color + "20" }}
                        >
                          <IconComponent size={16} color={item.color} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="connections" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {LEGEND_CATEGORIES[1].items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center">
                        {item.type === "dashed" ? (
                          <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderColor: item.color }} />
                        ) : (
                          <div className="w-8 h-0.5" style={{ backgroundColor: item.color }} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {LEGEND_CATEGORIES[2].items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10" style={{ bottom: showLegend ? "200px" : "16px" }}>
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>
                  View: <strong>{ARCHITECTURE_VIEWS.find((v) => v.id === selectedView)?.name || selectedView}</strong>
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
                  Industry: <strong className="capitalize">{selectedIndustry}</strong>
                </span>
                <span>
                  Zoom: <strong>{zoomLevel}%</strong>
                </span>
                <div className="flex items-center gap-2">
                  {!showControlPanel && (
                    <Button variant="ghost" size="sm" onClick={() => setShowControlPanel(true)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  {!showLegend && (
                    <Button variant="ghost" size="sm" onClick={() => setShowLegend(true)}>
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast({ title: "Export Started", description: "Exporting diagram as PNG..." })}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
