"use client"

import React from "react"
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
  X,
  Save,
  Download,
  Layers,
  Sliders,
  RefreshCw,
  Maximize,
  Minimize,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
}

interface Connection {
  id: string
  from: string
  to: string
  type: string
  status: "active" | "inactive" | "error" | "congested" | "degraded"
  protocol: string
  port?: number
  throughput?: string
  latency?: number
  encryption?: boolean
  bandwidth?: string
  label?: string
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
    { value: "cisco", label: "Cisco", color: "#1BA0D7" },
    { value: "aruba", label: "Aruba", color: "#FF6900" },
    { value: "juniper", label: "Juniper", color: "#84BD00" },
    { value: "extreme", label: "Extreme", color: "#00A651" },
    { value: "dell", label: "Dell", color: "#007DB8" },
  ],
  wireless: [
    { value: "cisco", label: "Cisco", color: "#1BA0D7" },
    { value: "aruba", label: "Aruba", color: "#FF6900" },
    { value: "ruckus", label: "Ruckus", color: "#FF6B00" },
    { value: "meraki", label: "Meraki", color: "#58C4DC" },
    { value: "mist", label: "Mist", color: "#41B883" },
  ],
  firewall: [
    { value: "palo_alto", label: "Palo Alto", color: "#FA582D" },
    { value: "fortinet", label: "Fortinet", color: "#EE3124" },
    { value: "checkpoint", label: "Check Point", color: "#FF6B35" },
    { value: "cisco", label: "Cisco ASA", color: "#1BA0D7" },
    { value: "juniper", label: "Juniper SRX", color: "#84BD00" },
  ],
  identity: [
    { value: "azure_ad", label: "Azure AD", color: "#0078D4" },
    { value: "active_directory", label: "Active Directory", color: "#0078D4" },
    { value: "okta", label: "Okta", color: "#007DC1" },
    { value: "ping", label: "Ping Identity", color: "#0066CC" },
    { value: "google", label: "Google Workspace", color: "#4285F4" },
  ],
  mdm: [
    { value: "intune", label: "Intune", color: "#00BCF2" },
    { value: "jamf", label: "Jamf Pro", color: "#4A90E2" },
    { value: "workspace_one", label: "Workspace ONE", color: "#607078" },
    { value: "mobileiron", label: "MobileIron", color: "#0066CC" },
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
  { id: "complete", name: "Complete", icon: Layers, color: "#3B82F6" },
  { id: "authentication", name: "Auth Flow", icon: Lock, color: "#10B981" },
  { id: "pki", name: "PKI", icon: Shield, color: "#DC2626" },
  { id: "policies", name: "Policies", icon: Settings, color: "#059669" },
  { id: "connectivity", name: "Connectivity", icon: Network, color: "#7C3AED" },
  { id: "intune", name: "Intune", icon: Smartphone, color: "#00BCF2" },
  { id: "jamf", name: "Jamf", icon: Monitor, color: "#4A90E2" },
  { id: "onboarding", name: "Onboarding", icon: Users, color: "#F59E0B" },
  { id: "radsec", name: "RADSEC", icon: Router, color: "#8B5CF6" },
  { id: "ztna", name: "ZTNA", icon: Globe, color: "#7C3AED" },
  { id: "guest", name: "Guest", icon: Wifi, color: "#06B6D4" },
  { id: "iot", name: "IoT", icon: Activity, color: "#059669" },
  { id: "tacacs", name: "TACACS+", icon: Server, color: "#DC2626" },
  { id: "risk", name: "Risk", icon: BarChart3, color: "#EF4444" },
  { id: "multisite", name: "Multi-Site", icon: Building, color: "#6366F1" },
  { id: "cloud", name: "Cloud", icon: Globe, color: "#3B82F6" },
  { id: "wireless", name: "Wireless", icon: Wifi, color: "#8B5CF6" },
  { id: "wired", name: "Wired", icon: Network, color: "#6B7280" },
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
  const [showMetrics, setShowMetrics] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState([50])
  const [interactionMode, setInteractionMode] = useState<"select" | "pan" | "connect" | "edit">("select")
  const [showGrid, setShowGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "pdf">("png")
  const [showQuickControls, setShowQuickControls] = useState(true)
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [selectedView, setSelectedView] = useState<string>(config.selectedView || "complete")

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
    console.log("InteractiveDiagram mounted, generating architecture...")
    generateArchitecture()
  }, [])

  // Regenerate when view changes
  useEffect(() => {
    console.log("View changed to:", selectedView)
    generateArchitecture()
  }, [selectedView])

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

    // Generate components based on selected view
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

    console.log(`Generated ${newComponents.length} components and ${newConnections.length} connections`)
    setComponents(newComponents)
    setConnections(newConnections)
  }, [selectedView])

  // COMPLETE ARCHITECTURE GENERATOR
  const generateCompleteArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Portnox Cloud Platform - Central hub
    components.push({
      id: "portnox-cloud-platform",
      type: "nac_platform",
      name: "Portnox Cloud NAC Platform",
      x: 400,
      y: 50,
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
      connections: ["azure-ad-tenant", "intune-mdm", "ztna-gateway", "radsec-proxy"],
      icon: "cloud",
      color: localConfig.customColors.primary,
      description: "Multi-tenant cloud NAC platform with comprehensive compliance",
      vendor: "portnox",
      version: "v6.5.2",
    })

    // Azure AD Identity Provider
    components.push({
      id: "azure-ad-tenant",
      type: "identity_provider",
      name: "Azure Active Directory",
      x: 50,
      y: 50,
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
      connections: ["portnox-cloud-platform"],
      icon: "users",
      color: "#0078D4",
      description: "Enterprise identity platform with conditional access and MFA",
      vendor: "microsoft",
      version: "2024.01",
    })

    // Zero Trust Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Gateway",
      x: 750,
      y: 50,
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
      connections: ["portnox-cloud-platform", "on-premise-apps"],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with micro-segmentation",
      vendor: "portnox",
      version: "v3.2.1",
    })

    // Microsoft Intune
    components.push({
      id: "intune-mdm",
      type: "mdm_platform",
      name: "Microsoft Intune",
      x: 50,
      y: 200,
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
      connections: ["portnox-cloud-platform"],
      icon: "smartphone",
      color: "#00BCF2",
      description: "Unified endpoint management with app protection",
      vendor: "microsoft",
      version: "2024.01",
    })

    // RADSEC Proxy
    components.push({
      id: "radsec-proxy",
      type: "radius_proxy",
      name: "RADSEC Proxy",
      x: 400,
      y: 200,
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
      color: localConfig.customColors.secondary,
      description: "High-performance RADIUS over TLS proxy",
      vendor: "portnox",
      version: "v2.8.1",
    })

    // Core Network Infrastructure
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === localConfig.wiredVendor)
    components.push({
      id: "core-switch-stack",
      type: "core_switch",
      name: `${wiredVendorInfo?.label || "Core"} Switch Stack`,
      x: 400,
      y: 320,
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
      connections: ["radsec-proxy", "access-switches", "wireless-controller"],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-density core switching with 802.1X authentication",
      vendor: localConfig.wiredVendor,
    })

    // Access Switches
    components.push({
      id: "access-switches",
      type: "access_switch",
      name: "Access Switches (48x)",
      x: 400,
      y: 450,
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
      connections: ["core-switch-stack", "endpoint-devices"],
      icon: "network",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "PoE+ enabled access switches with 802.1X authentication",
      vendor: localConfig.wiredVendor,
    })

    // Wireless Infrastructure
    const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === localConfig.wirelessVendor)
    components.push({
      id: "wireless-controller",
      type: "wireless_controller",
      name: `${wirelessVendorInfo?.label || "Wireless"} Controller`,
      x: 750,
      y: 320,
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
      connections: ["core-switch-stack", "access-points"],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "Centralized wireless management with AI-driven optimization",
      vendor: localConfig.wirelessVendor,
    })

    components.push({
      id: "access-points",
      type: "access_point",
      name: "WiFi 6E APs (240x)",
      x: 750,
      y: 450,
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
      vendor: localConfig.wirelessVendor,
    })

    // Endpoint Devices
    components.push({
      id: "endpoint-devices",
      type: "endpoint_devices",
      name: "Endpoint Devices (12,500)",
      x: 400,
      y: 570,
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
      x: 1050,
      y: 50,
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

    // Generate connections
    generateConnections(components, connections)
  }

  const generateAuthenticationFlow = (components: DiagramComponent[], connections: Connection[]) => {
    // User Device
    components.push({
      id: "user-device",
      type: "endpoint_device",
      name: "User Device",
      x: 100,
      y: 200,
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
      y: 200,
      width: 150,
      height: 100,
      status: "online",
      category: "network",
      connections: ["radius-proxy", "user-device"],
      icon: "wifi",
      color: "#8B5CF6",
      description: "802.1X enabled access point",
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
      y: 200,
      width: 150,
      height: 100,
      status: "online",
      category: "security",
      connections: ["network-access-point", "portnox-cloud"],
      icon: "router",
      color: localConfig.customColors.secondary,
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
      y: 150,
      width: 200,
      height: 120,
      status: "online",
      category: "cloud",
      connections: ["radius-proxy", "identity-provider"],
      icon: "cloud",
      color: localConfig.customColors.primary,
      description: "Cloud NAC platform with integrated RADIUS",
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
      name: "Azure AD",
      x: 1150,
      y: 150,
      width: 180,
      height: 100,
      status: "online",
      category: "identity",
      connections: ["portnox-cloud"],
      icon: "users",
      color: "#0078D4",
      description: "Enterprise identity provider for user authentication",
      vendor: "microsoft",
      metrics: {
        users: 12500,
        sessions: 8950,
        uptime: 99.97,
        latency: 15,
      },
    })

    generateConnections(components, connections)
  }

  const generatePKIArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Root CA
    components.push({
      id: "root-ca",
      type: "root_ca",
      name: "Root Certificate Authority",
      x: 500,
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
      x: 250,
      y: 250,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["root-ca"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for user authentication",
      metrics: { certificates: 12500, uptime: 99.95 },
    })

    components.push({
      id: "intermediate-ca-2",
      type: "intermediate_ca",
      name: "Device Certificate CA",
      x: 570,
      y: 250,
      width: 180,
      height: 100,
      status: "online",
      category: "security",
      connections: ["root-ca"],
      icon: "file-key",
      color: "#F59E0B",
      description: "Issues certificates for device authentication",
      metrics: { certificates: 8500, uptime: 99.95 },
    })

    generateConnections(components, connections)
  }

  const generatePolicyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Policy Engine
    components.push({
      id: "policy-engine",
      type: "policy_engine",
      name: "Policy Engine",
      x: 400,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "management",
      connections: [],
      icon: "settings",
      color: "#059669",
      description: "AI-powered policy engine with real-time decision making",
      metrics: { policies: 156, decisions: 2850000, latency: 1.5, uptime: 99.99 },
    })

    generateConnections(components, connections)
  }

  const generateConnectivityArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // WAN Edge Router
    components.push({
      id: "wan-edge-router",
      type: "wan_edge_router",
      name: "WAN Edge Router",
      x: 400,
      y: 200,
      width: 250,
      height: 100,
      status: "online",
      category: "connectivity",
      connections: [],
      icon: "router",
      color: "#059669",
      description: "Multi-WAN edge router with intelligent path selection",
      vendor: "cisco",
      metrics: { connections: 4, throughput: "1 Gbps", latency: 5, uptime: 99.95 },
    })

    generateConnections(components, connections)
  }

  const generateIntuneIntegration = (components: DiagramComponent[], connections: Connection[]) => {
    // Microsoft Intune
    components.push({
      id: "microsoft-intune",
      type: "mdm_platform",
      name: "Microsoft Intune",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: [],
      icon: "smartphone",
      color: "#00BCF2",
      description: "Unified endpoint management with comprehensive device protection",
      vendor: "microsoft",
      version: "2024.01",
      metrics: { devices: 12500, policies: 45, compliance: 98.5, uptime: 99.95 },
    })

    generateConnections(components, connections)
  }

  const generateJamfIntegration = (components: DiagramComponent[], connections: Connection[]) => {
    // Jamf Pro
    components.push({
      id: "jamf-pro",
      type: "mdm_platform",
      name: "Jamf Pro",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: [],
      icon: "smartphone",
      color: "#4A90E2",
      description: "Comprehensive Apple device management platform",
      vendor: "jamf",
      version: "10.49.0",
      metrics: { devices: 3500, policies: 35, compliance: 99.2, uptime: 99.98 },
    })

    generateConnections(components, connections)
  }

  const generateDeviceOnboarding = (components: DiagramComponent[], connections: Connection[]) => {
    // Onboarding Portal
    components.push({
      id: "onboarding-portal",
      type: "onboarding_portal",
      name: "Device Onboarding Portal",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "application",
      connections: [],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service device onboarding with automated workflows",
      vendor: "portnox",
      metrics: { dailyOnboarding: 125, successRate: 96.8 },
    })

    generateConnections(components, connections)
  }

  const generateRadSecProxyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // RADSEC Proxy Cluster
    components.push({
      id: "radsec-proxy-cluster",
      type: "radsec_proxy_cluster",
      name: "RADSEC Proxy Cluster",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: [],
      icon: "router",
      color: localConfig.customColors.secondary,
      description: "High-availability RADSEC proxy cluster",
      vendor: "portnox",
      version: "v2.8.1",
      metrics: { proxies: 3, connections: 8500, throughput: "15.2 Gbps", latency: 2, uptime: 99.99 },
    })

    generateConnections(components, connections)
  }

  const generateZTNAArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // ZTNA Gateway
    components.push({
      id: "ztna-gateway",
      type: "ztna_gateway",
      name: "Zero Trust Gateway",
      x: 400,
      y: 200,
      width: 320,
      height: 120,
      status: "online",
      category: "security",
      connections: [],
      icon: "shield",
      color: "#7C3AED",
      description: "Enterprise ZTNA gateway with continuous verification",
      vendor: "portnox",
      version: "v3.2.1",
      metrics: { connections: 8950, throughput: "25.5 Gbps", latency: 3, uptime: 99.99, users: 12500, sessions: 8200 },
    })

    generateConnections(components, connections)
  }

  const generateGuestPortal = (components: DiagramComponent[], connections: Connection[]) => {
    // Guest Portal
    components.push({
      id: "guest-portal",
      type: "guest_portal",
      name: "Guest Access Portal",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "application",
      connections: [],
      icon: "monitor",
      color: "#10B981",
      description: "Self-service guest access portal with customizable branding",
      vendor: "portnox",
      metrics: { dailyGuests: 250, activeGuests: 125, successRate: 94.5 },
    })

    generateConnections(components, connections)
  }

  const generateIoTOnboarding = (components: DiagramComponent[], connections: Connection[]) => {
    // IoT Discovery Engine
    components.push({
      id: "iot-discovery-engine",
      type: "iot_discovery",
      name: "IoT Discovery Engine",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "management",
      connections: [],
      icon: "radar",
      color: "#059669",
      description: "AI-powered IoT device discovery and classification",
      vendor: "portnox",
      metrics: { devicesDiscovered: 8500, classified: 8125, unclassified: 375, accuracy: 95.6 },
    })

    generateConnections(components, connections)
  }

  const generateTACACSArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // TACACS+ Server
    components.push({
      id: "tacacs-server",
      type: "tacacs_server",
      name: "TACACS+ Server",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: [],
      icon: "lock",
      color: "#DC2626",
      description: "Centralized TACACS+ server for network device administration",
      vendor: "portnox",
      version: "v3.1.2",
      metrics: { authentications: 15000, authorizations: 125000, accounting: 85000, uptime: 99.95 },
    })

    generateConnections(components, connections)
  }

  const generateRiskPolicyArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Risk Assessment Platform
    components.push({
      id: "risk-assessment-platform",
      type: "risk_assessment_platform",
      name: "Risk Assessment Platform",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "security",
      connections: [],
      icon: "alert-triangle",
      color: "#EF4444",
      description: "Comprehensive risk assessment and threat analysis platform",
      vendor: "portnox",
      metrics: { riskAssessments: 12500, threats: 45, incidents: 8, uptime: 99.95 },
    })

    generateConnections(components, connections)
  }

  const generateMultiSiteArchitecture = (components: DiagramComponent[], connections: Connection[]) => {
    // Headquarters
    components.push({
      id: "headquarters",
      type: "headquarters",
      name: "Corporate Headquarters",
      x: 400,
      y: 200,
      width: 250,
      height: 120,
      status: "online",
      category: "network",
      connections: [],
      icon: "building",
      color: localConfig.customColors.primary,
      description: "Main headquarters with centralized NAC management",
      metrics: { users: 5000, devices: 8500, sites: 25, uptime: 99.98 },
    })

    generateConnections(components, connections)
  }

  const generateCloudIntegration = (components: DiagramComponent[], connections: Connection[]) => {
    // Multi-Cloud Hub
    components.push({
      id: "multi-cloud-hub",
      type: "multi_cloud_hub",
      name: "Multi-Cloud Hub",
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "cloud",
      connections: [],
      icon: "cloud",
      color: "#3B82F6",
      description: "Centralized hub for multi-cloud service integration",
      metrics: { clouds: 3, services: 45, uptime: 99.99 },
    })

    generateConnections(components, connections)
  }

  const generateWirelessInfrastructure = (components: DiagramComponent[], connections: Connection[]) => {
    const wirelessVendorInfo = VENDOR_OPTIONS.wireless.find((v) => v.value === localConfig.wirelessVendor)

    // Wireless Controller Cluster
    components.push({
      id: "wireless-controller-cluster",
      type: "wireless_controller_cluster",
      name: `${wirelessVendorInfo?.label || "Wireless"} Controller Cluster`,
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "network",
      connections: [],
      icon: "wifi",
      color: wirelessVendorInfo?.color || "#8B5CF6",
      description: "High-availability wireless controller cluster",
      vendor: localConfig.wirelessVendor,
      metrics: { controllers: 3, accessPoints: 240, clients: 2850, uptime: 99.96 },
    })

    generateConnections(components, connections)
  }

  const generateWiredInfrastructure = (components: DiagramComponent[], connections: Connection[]) => {
    const wiredVendorInfo = VENDOR_OPTIONS.wired.find((v) => v.value === localConfig.wiredVendor)

    // Core Switch Stack
    components.push({
      id: "core-switch-stack",
      type: "core_switch_stack",
      name: `${wiredVendorInfo?.label || "Core"} Switch Stack`,
      x: 400,
      y: 200,
      width: 280,
      height: 120,
      status: "online",
      category: "network",
      connections: [],
      icon: "server",
      color: wiredVendorInfo?.color || "#6B7280",
      description: "High-performance core switching infrastructure",
      vendor: localConfig.wiredVendor,
      metrics: { switches: 4, connections: 192, throughput: "800 Gbps", uptime: 99.99 },
    })

    generateConnections(components, connections)
  }

  const generateConnections = (components: DiagramComponent[], connections: Connection[]) => {
    components.forEach((source) => {
      source.connections.forEach((targetId) => {
        const target = components.find((c) => c.id === targetId)
        if (target) {
          connections.push({
            id: `${source.id}-${target.id}`,
            from: source.id,
            to: target.id,
            type: "api",
            protocol: "HTTPS",
            status: "active",
            throughput: "1 Gbps",
            latency: 5,
            encryption: true,
            bandwidth: "1 Gbps",
          })
        }
      })
    })
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
    generateArchitecture()
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
        style={{ cursor: "pointer" }}
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

    const connectionColor = CONNECTION_COLORS[connection.type as keyof typeof CONNECTION_COLORS] || "#6B7280"
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
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-hidden ${
        isFullscreenMode ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Main Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-40">
        <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Architecture Designer</h3>
                <Badge variant="outline" className="text-xs">
                  {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {components.length} Components
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreenMode(!isFullscreenMode)}
                  className="h-8"
                >
                  {isFullscreenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={saveConfiguration} className="h-8">
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={exportDiagram} className="h-8">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            {/* Architecture View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
              <TabsList className="grid grid-cols-9 gap-1 h-auto p-1 bg-gray-100">
                {ARCHITECTURE_VIEWS.slice(0, 9).map((view) => {
                  const IconComponent = view.icon
                  return (
                    <TabsTrigger
                      key={view.id}
                      value={view.id}
                      className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-white"
                      style={{
                        color: selectedView === view.id ? view.color : "#6B7280",
                      }}
                    >
                      <IconComponent className="h-4 w-4" />
                      {view.name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              <TabsList className="grid grid-cols-9 gap-1 h-auto p-1 bg-gray-100 mt-1">
                {ARCHITECTURE_VIEWS.slice(9).map((view) => {
                  const IconComponent = view.icon
                  return (
                    <TabsTrigger
                      key={view.id}
                      value={view.id}
                      className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-white"
                      style={{
                        color: selectedView === view.id ? view.color : "#6B7280",
                      }}
                    >
                      <IconComponent className="h-4 w-4" />
                      {view.name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Side Controls Panel */}
      {showQuickControls && (
        <div className="absolute top-32 right-4 z-30 w-80">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Diagram Controls</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowQuickControls(false)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display Options */}
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-2 block">DISPLAY OPTIONS</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Metrics</Label>
                    <Switch
                      checked={showMetrics}
                      onCheckedChange={(checked) => {
                        setShowMetrics(checked)
                        updateConfig({ showMetrics: checked })
                      }}
                      className="scale-75"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Connections</Label>
                    <Switch
                      checked={showConnections}
                      onCheckedChange={(checked) => {
                        setShowConnections(checked)
                        updateConfig({ showConnections: checked })
                      }}
                      className="scale-75"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Labels</Label>
                    <Switch checked={showLabels} onCheckedChange={setShowLabels} className="scale-75" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Grid</Label>
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} className="scale-75" />
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

              {/* Vendor Configuration */}
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-2 block">VENDOR CONFIGURATION</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Wired</Label>
                    <Select
                      value={localConfig.wiredVendor}
                      onValueChange={(value) => handleVendorChange("wired", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_OPTIONS.wired.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vendor.color }} />
                              {vendor.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Wireless</Label>
                    <Select
                      value={localConfig.wirelessVendor}
                      onValueChange={(value) => handleVendorChange("wireless", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_OPTIONS.wireless.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vendor.color }} />
                              {vendor.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Firewall</Label>
                    <Select
                      value={localConfig.firewallVendor}
                      onValueChange={(value) => handleVendorChange("firewall", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_OPTIONS.firewall.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vendor.color }} />
                              {vendor.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Identity</Label>
                    <Select
                      value={localConfig.identityProvider[0] || "azure_ad"}
                      onValueChange={(value) => updateConfig({ identityProvider: [value] })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_OPTIONS.identity.map((vendor) => (
                          <SelectItem key={vendor.value} value={vendor.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vendor.color }} />
                              {vendor.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Export Options */}
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-2 block">EXPORT OPTIONS</Label>
                <div className="flex gap-2">
                  <Select value={exportFormat} onValueChange={(value: "png" | "svg" | "pdf") => setExportFormat(value)}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG Image</SelectItem>
                      <SelectItem value="svg">SVG Vector</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={exportDiagram} className="h-8 bg-transparent">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Refresh Button */}
              <Button variant="outline" size="sm" onClick={generateArchitecture} className="w-full h-8 bg-transparent">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Diagram
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main SVG Canvas */}
      <div className={`absolute inset-0 ${isFullscreenMode ? "pt-4" : "pt-32"}`}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 1400 800"
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

          {/* Debug Info */}
          <text x={20} y={30} fontSize={12} fill="#6B7280">
            Components: {components.length} | Connections: {connections.length} | View: {selectedView}
          </text>
        </svg>
      </div>

      {/* Component Details Panel */}
      {selectedComponent && (
        <Card className="absolute bottom-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl z-50">
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
          <CardContent className="space-y-3 text-xs">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 text-xs"
                style={{ backgroundColor: selectedComponent.color + "20", color: selectedComponent.color }}
              >
                {selectedComponent.status.toUpperCase()}
              </Badge>
              <p className="text-xs text-gray-600">{selectedComponent.description}</p>
            </div>

            {selectedComponent.vendor && (
              <div>
                <Label className="text-xs font-semibold text-gray-500">VENDOR</Label>
                <p className="text-xs font-medium">{selectedComponent.vendor.toUpperCase()}</p>
                {selectedComponent.model && <p className="text-xs text-gray-500">{selectedComponent.model}</p>}
              </div>
            )}

            {selectedComponent.metrics && (
              <div>
                <Label className="text-xs font-semibold text-gray-500">METRICS</Label>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {Object.entries(selectedComponent.metrics)
                    .slice(0, 8)
                    .map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                        <span className="ml-1 font-medium">
                          {typeof value === "number"
                            ? key.includes("percent") || key.includes("Score")
                              ? `${value}%`
                              : value
                            : value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Restore Quick Controls Button */}
      {!showQuickControls && (
        <Button
          className="fixed top-32 right-4 z-50 bg-white/90 hover:bg-white shadow-lg h-10 w-10 p-0"
          onClick={() => setShowQuickControls(true)}
        >
          <Sliders className="h-4 w-4" />
        </Button>
      )}

      {/* Loading State */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating {selectedView} architecture...</p>
          </div>
        </div>
      )}
    </div>
  )
}
