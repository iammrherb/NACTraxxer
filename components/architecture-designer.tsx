"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import InteractiveDiagram from "./InteractiveDiagram"
import PolicyManagement from "./policy-management"
import {
  Network,
  Download,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Shield,
  Globe,
  Server,
  Wifi,
  Database,
  Users,
  Lock,
  Cloud,
  Smartphone,
  Monitor,
  Router,
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Layers,
  Building,
  Factory,
  Hospital,
  GraduationCap,
  Briefcase,
  Palette,
  Sparkles,
  Wand2,
  Star,
  Crown,
  Gem,
  TrendingUp,
  Radar,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Workflow,
  Component,
  Orbit,
} from "lucide-react"

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState("complete")
  const [selectedIndustry, setSelectedIndustry] = useState("technology")
  const [cloudProvider, setCloudProvider] = useState("azure")
  const [networkVendor, setNetworkVendor] = useState("cisco")
  const [connectivityType, setConnectivityType] = useState("sdwan")
  const [identityProvider, setIdentityProvider] = useState("azure-ad")
  const [mdmProvider, setMdmProvider] = useState("intune")
  const [firewallVendor, setFirewallVendor] = useState("palo-alto")
  const [endpointType, setEndpointType] = useState("mixed")
  const [wirelessVendor, setWirelessVendor] = useState("cisco-meraki")
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState([1.5])
  const [showLegend, setShowLegend] = useState(true)
  const [showMetrics, setShowMetrics] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState("supreme")
  const [simulationMode, setSimulationMode] = useState("normal")
  const [riskLevel, setRiskLevel] = useState("low")
  const [visualStyle, setVisualStyle] = useState("3d-premium")
  const [animationPreset, setAnimationPreset] = useState("cinematic")
  const [interactionLevel, setInteractionLevel] = useState("advanced")
  const [realTimeMetrics, setRealTimeMetrics] = useState(true)
  const [threatSimulation, setThreatSimulation] = useState(false)
  const [complianceMode, setComplianceMode] = useState("sox-hipaa")

  const industryScenarios = [
    {
      id: "healthcare",
      name: "Healthcare Enterprise",
      icon: <Hospital className="h-5 w-5" />,
      description: "HIPAA-compliant medical facility network",
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-600",
      userCount: "15,000+",
      deviceCount: "25,000+",
      compliance: ["HIPAA", "HITECH", "FDA 21 CFR Part 11"],
      riskLevel: "critical",
      complexity: "high",
    },
    {
      id: "financial",
      name: "Financial Services",
      icon: <Briefcase className="h-5 w-5" />,
      description: "SOX-compliant banking and trading environment",
      color: "#f59e0b",
      gradient: "from-amber-500 to-orange-600",
      userCount: "8,500+",
      deviceCount: "12,000+",
      compliance: ["SOX", "PCI DSS", "GLBA", "FFIEC"],
      riskLevel: "critical",
      complexity: "very-high",
    },
    {
      id: "technology",
      name: "Technology Company",
      icon: <Cpu className="h-5 w-5" />,
      description: "High-security R&D and development environment",
      color: "#3b82f6",
      gradient: "from-blue-500 to-indigo-600",
      userCount: "12,000+",
      deviceCount: "18,000+",
      compliance: ["ISO 27001", "SOC 2", "GDPR"],
      riskLevel: "high",
      complexity: "high",
    },
    {
      id: "manufacturing",
      name: "Manufacturing Plant",
      icon: <Factory className="h-5 w-5" />,
      description: "Industrial IoT and OT network security",
      color: "#dc2626",
      gradient: "from-red-500 to-rose-600",
      userCount: "5,000+",
      deviceCount: "35,000+",
      compliance: ["NIST", "IEC 62443", "ISO 27001"],
      riskLevel: "high",
      complexity: "very-high",
    },
    {
      id: "education",
      name: "Educational Institution",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Multi-campus university network",
      color: "#7c3aed",
      gradient: "from-purple-500 to-violet-600",
      userCount: "45,000+",
      deviceCount: "60,000+",
      compliance: ["FERPA", "COPPA", "GDPR"],
      riskLevel: "medium",
      complexity: "high",
    },
    {
      id: "multi-site",
      name: "Multi-Site Enterprise",
      icon: <Building className="h-5 w-5" />,
      description: "Global enterprise with multiple locations",
      color: "#059669",
      gradient: "from-emerald-600 to-green-700",
      userCount: "25,000+",
      deviceCount: "40,000+",
      compliance: ["ISO 27001", "SOC 2", "GDPR", "CCPA"],
      riskLevel: "high",
      complexity: "very-high",
    },
  ]

  const architectureViews = [
    {
      id: "complete",
      name: "Complete Zero Trust Architecture",
      icon: <Crown className="h-4 w-4" />,
      description: "Full enterprise zero trust NAC overview with AI-powered analytics",
      premium: true,
      complexity: "supreme",
    },
    {
      id: "multi-site",
      name: "Global Multi-Site Deployment",
      icon: <Globe className="h-4 w-4" />,
      description: "Worldwide deployment architecture with regional failover",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "auth-flow",
      name: "Advanced Authentication Flows",
      icon: <Fingerprint className="h-4 w-4" />,
      description: "Multi-factor authentication with biometric integration",
      premium: true,
      complexity: "high",
    },
    {
      id: "pki-advanced",
      name: "Enterprise PKI & Certificate Management",
      icon: <ShieldCheck className="h-4 w-4" />,
      description: "Advanced certificate lifecycle management",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "ai-policy",
      name: "AI-Powered Policy Framework",
      icon: <Sparkles className="h-4 w-4" />,
      description: "Machine learning-driven policy automation",
      premium: true,
      complexity: "supreme",
    },
    {
      id: "tacacs-advanced",
      name: "Advanced TACACS+ Integration",
      icon: <Server className="h-4 w-4" />,
      description: "Enterprise device administration with role-based access",
      premium: true,
      complexity: "high",
    },
    {
      id: "wireless-mesh",
      name: "Intelligent Wireless Mesh",
      icon: <Wifi className="h-4 w-4" />,
      description: "Self-healing wireless infrastructure with AI optimization",
      premium: true,
      complexity: "high",
    },
    {
      id: "intune-premium",
      name: "Microsoft Intune Suite Integration",
      icon: <Database className="h-4 w-4" />,
      description: "Complete Intune ecosystem with Endpoint Analytics",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "jamf-enterprise",
      name: "Jamf Pro Enterprise Management",
      icon: <Monitor className="h-4 w-4" />,
      description: "Advanced Apple device management and security",
      premium: true,
      complexity: "high",
    },
    {
      id: "dynamic-policies",
      name: "Dynamic Access Policies",
      icon: <Workflow className="h-4 w-4" />,
      description: "Context-aware access control with behavioral analytics",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "iot-security",
      name: "IoT Security Framework",
      icon: <Orbit className="h-4 w-4" />,
      description: "Comprehensive IoT device security and management",
      premium: true,
      complexity: "high",
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Integration",
      icon: <Radar className="h-4 w-4" />,
      description: "Real-time threat detection and response",
      premium: true,
      complexity: "supreme",
    },
    {
      id: "compliance-automation",
      name: "Automated Compliance Monitoring",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Continuous compliance validation and reporting",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "radsec-proxy",
      name: "RadSec Proxy Architecture",
      icon: <Shield className="h-4 w-4" />,
      description: "Secure RADIUS over TLS with load balancing",
      premium: true,
      complexity: "high",
    },
    {
      id: "cloud-hybrid",
      name: "Hybrid Cloud Integration",
      icon: <Cloud className="h-4 w-4" />,
      description: "Multi-cloud NAC deployment with unified management",
      premium: true,
      complexity: "supreme",
    },
    {
      id: "zero-trust-sase",
      name: "Zero Trust SASE Architecture",
      icon: <Gem className="h-4 w-4" />,
      description: "Secure Access Service Edge with zero trust principles",
      premium: true,
      complexity: "supreme",
    },
    {
      id: "behavioral-analytics",
      name: "User Behavioral Analytics",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "AI-driven user behavior analysis and anomaly detection",
      premium: true,
      complexity: "very-high",
    },
    {
      id: "device-onboarding",
      name: "Intelligent Device Onboarding",
      icon: <Zap className="h-4 w-4" />,
      description: "Automated device provisioning with ML-based profiling",
      premium: true,
      complexity: "high",
    },
  ]

  const cloudProviders = [
    {
      id: "azure",
      name: "Microsoft Azure",
      color: "#0078d4",
      gradient: "from-blue-500 to-blue-700",
      icon: <Cloud className="h-4 w-4" />,
      features: ["Azure AD", "Conditional Access", "Intune", "Sentinel"],
      tier: "enterprise",
    },
    {
      id: "aws",
      name: "Amazon AWS",
      color: "#ff9900",
      gradient: "from-orange-500 to-orange-700",
      icon: <Server className="h-4 w-4" />,
      features: ["IAM", "Directory Service", "GuardDuty", "Config"],
      tier: "enterprise",
    },
    {
      id: "gcp",
      name: "Google Cloud",
      color: "#4285f4",
      gradient: "from-blue-400 to-blue-600",
      icon: <Globe className="h-4 w-4" />,
      features: ["Cloud Identity", "BeyondCorp", "Chronicle", "Asset Inventory"],
      tier: "enterprise",
    },
    {
      id: "multi-cloud",
      name: "Multi-Cloud Hybrid",
      color: "#8b5cf6",
      gradient: "from-purple-500 to-purple-700",
      icon: <Layers className="h-4 w-4" />,
      features: ["Cross-Cloud IAM", "Unified Management", "Hybrid Connectivity"],
      tier: "premium",
    },
  ]

  const networkVendors = [
    {
      id: "cisco",
      name: "Cisco Systems",
      color: "#1ba0d7",
      icon: <Router className="h-4 w-4" />,
      features: ["DNA Center", "ISE", "Catalyst", "Meraki"],
      tier: "enterprise",
      marketShare: "35%",
    },
    {
      id: "aruba",
      name: "Aruba (HPE)",
      color: "#01a982",
      icon: <Wifi className="h-4 w-4" />,
      features: ["ClearPass", "Central", "AirWave", "NetEdit"],
      tier: "enterprise",
      marketShare: "18%",
    },
    {
      id: "juniper",
      name: "Juniper Networks",
      color: "#84bd00",
      icon: <Network className="h-4 w-4" />,
      features: ["Mist AI", "Junos", "SRX", "Contrail"],
      tier: "enterprise",
      marketShare: "12%",
    },
    {
      id: "extreme",
      name: "Extreme Networks",
      color: "#7b2cbf",
      icon: <Zap className="h-4 w-4" />,
      features: ["ExtremeCloud IQ", "EXOS", "Fabric", "Analytics"],
      tier: "enterprise",
      marketShare: "8%",
    },
    {
      id: "fortinet",
      name: "Fortinet",
      color: "#ee1c25",
      icon: <Shield className="h-4 w-4" />,
      features: ["FortiGate", "FortiSwitch", "FortiAP", "FortiAnalyzer"],
      tier: "enterprise",
      marketShare: "15%",
    },
  ]

  const identityProviders = [
    {
      id: "azure-ad",
      name: "Azure Active Directory",
      color: "#0078d4",
      icon: <UserCheck className="h-4 w-4" />,
      features: ["Conditional Access", "PIM", "Identity Protection", "B2B/B2C"],
      tier: "premium",
      userLimit: "unlimited",
    },
    {
      id: "okta",
      name: "Okta Identity Cloud",
      color: "#007dc1",
      icon: <KeyRound className="h-4 w-4" />,
      features: ["Universal Directory", "Adaptive MFA", "Lifecycle Management"],
      tier: "premium",
      userLimit: "unlimited",
    },
    {
      id: "ping",
      name: "Ping Identity",
      color: "#ff6b35",
      icon: <Fingerprint className="h-4 w-4" />,
      features: ["PingFederate", "PingAccess", "PingDirectory", "PingOne"],
      tier: "enterprise",
      userLimit: "100,000+",
    },
    {
      id: "cyberark",
      name: "CyberArk Identity",
      color: "#1e3a8a",
      icon: <Lock className="h-4 w-4" />,
      features: ["Privileged Access", "Workforce Identity", "Customer Identity"],
      tier: "premium",
      userLimit: "unlimited",
    },
  ]

  const mdmProviders = [
    {
      id: "intune",
      name: "Microsoft Intune Suite",
      color: "#0078d4",
      icon: <Database className="h-4 w-4" />,
      features: ["Endpoint Analytics", "Tunnel", "Advanced Analytics", "Remote Help"],
      tier: "premium",
      deviceLimit: "unlimited",
    },
    {
      id: "jamf",
      name: "Jamf Pro Enterprise",
      color: "#1d4ed8",
      icon: <Monitor className="h-4 w-4" />,
      features: ["Jamf Connect", "Protect", "School", "Now"],
      tier: "premium",
      deviceLimit: "unlimited",
    },
    {
      id: "workspace-one",
      name: "VMware Workspace ONE",
      color: "#0091da",
      icon: <Layers className="h-4 w-4" />,
      features: ["UEM", "Access", "Intelligence", "Assist"],
      tier: "enterprise",
      deviceLimit: "100,000+",
    },
    {
      id: "mobileiron",
      name: "Ivanti Neurons for MDM",
      color: "#ff6b35",
      icon: <Smartphone className="h-4 w-4" />,
      features: ["UEM", "Security", "Automation", "Analytics"],
      tier: "enterprise",
      deviceLimit: "50,000+",
    },
  ]

  const firewallVendors = [
    {
      id: "palo-alto",
      name: "Palo Alto Networks",
      color: "#fa4616",
      icon: <Shield className="h-4 w-4" />,
      features: ["Prisma", "Cortex", "WildFire", "AutoFocus"],
      tier: "premium",
      throughput: "100+ Gbps",
    },
    {
      id: "fortinet",
      name: "Fortinet FortiGate",
      color: "#ee1c25",
      icon: <ShieldCheck className="h-4 w-4" />,
      features: ["Security Fabric", "FortiGuard", "FortiAnalyzer", "FortiManager"],
      tier: "enterprise",
      throughput: "80+ Gbps",
    },
    {
      id: "checkpoint",
      name: "Check Point",
      color: "#ff6900",
      icon: <CheckCircle className="h-4 w-4" />,
      features: ["Infinity", "CloudGuard", "SandBlast", "ThreatCloud"],
      tier: "premium",
      throughput: "60+ Gbps",
    },
    {
      id: "cisco-ftd",
      name: "Cisco Firepower",
      color: "#1ba0d7",
      icon: <Zap className="h-4 w-4" />,
      features: ["FMC", "Threat Intelligence", "Malware Defense", "URL Filtering"],
      tier: "enterprise",
      throughput: "100+ Gbps",
    },
  ]

  const simulationModes = [
    {
      id: "normal",
      name: "Normal Operation",
      description: "Standard network operation with baseline metrics",
      color: "#10b981",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "security-breach",
      name: "Advanced Persistent Threat",
      description: "Simulate sophisticated security incident response",
      color: "#dc2626",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit Mode",
      description: "Full audit mode with detailed logging and reporting",
      color: "#7c3aed",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      id: "mass-onboarding",
      name: "Mass Device Onboarding",
      description: "High-volume device enrollment simulation",
      color: "#f59e0b",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "disaster-recovery",
      name: "Disaster Recovery",
      description: "Failover and recovery scenario testing",
      color: "#dc2626",
      icon: <RotateCcw className="h-4 w-4" />,
    },
    {
      id: "zero-trust-validation",
      name: "Zero Trust Validation",
      description: "Comprehensive zero trust policy validation",
      color: "#1d4ed8",
      icon: <Shield className="h-4 w-4" />,
    },
  ]

  const visualThemes = [
    {
      id: "supreme",
      name: "Supreme Professional",
      description: "Ultra-premium design with advanced animations",
      preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "executive",
      name: "Executive Dashboard",
      description: "Clean, executive-level presentation style",
      preview: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "technical",
      name: "Technical Blueprint",
      description: "Detailed technical schematic style",
      preview: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: "dark-premium",
      name: "Dark Premium",
      description: "High-contrast dark theme with neon accents",
      preview: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)",
    },
  ]

  const [metrics, setMetrics] = useState({
    activeUsers: 12847,
    authenticatedDevices: 18923,
    policyViolations: 23,
    threatsBlocked: 156,
    networkUtilization: 67,
    complianceScore: 94,
    responseTime: 45,
    uptime: 99.97,
  })

  useEffect(() => {
    if (!realTimeMetrics) return

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
        authenticatedDevices: prev.authenticatedDevices + Math.floor(Math.random() * 30 - 15),
        policyViolations: Math.max(0, prev.policyViolations + Math.floor(Math.random() * 6 - 3)),
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 5),
        networkUtilization: Math.max(0, Math.min(100, prev.networkUtilization + Math.floor(Math.random() * 10 - 5))),
        complianceScore: Math.max(85, Math.min(100, prev.complianceScore + Math.floor(Math.random() * 4 - 2))),
        responseTime: Math.max(20, Math.min(100, prev.responseTime + Math.floor(Math.random() * 10 - 5))),
        uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() * 0.1 - 0.05))),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [realTimeMetrics])

  const handleExport = async (format: "svg" | "png" | "pdf" | "visio") => {
    try {
      toast({
        title: "Export Started",
        description: `Generating premium ${format.toUpperCase()} export with enhanced graphics...`,
      })

      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: `Supreme quality architecture diagram exported as ${format.toUpperCase()}`,
        })
      }, 3000)
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export diagram. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSimulationChange = (mode: string) => {
    setSimulationMode(mode)
    const selectedMode = simulationModes.find((m) => m.id === mode)
    toast({
      title: "Simulation Mode Activated",
      description: `Switched to ${selectedMode?.name} - ${selectedMode?.description}`,
    })
  }

  const selectedIndustryData = industryScenarios.find((i) => i.id === selectedIndustry)
  const selectedViewData = architectureViews.find((v) => v.id === selectedView)

  const diagramConfig = {
    industry: selectedIndustry,
    visualStyle: visualStyle,
    animationPreset: animationPreset,
    theme: selectedTheme,
    identityProvider: {
      type: identityProvider,
      domain: "company.com",
      mfaEnabled: true,
      riskBasedAuth: true,
      biometricAuth: true,
    },
    mdmProvider: {
      type: mdmProvider,
      complianceEnabled: true,
      zeroTouchProvisioning: true,
      advancedAnalytics: true,
    },
    firewallInfrastructure: {
      vendor: firewallVendor,
      haConfiguration: true,
      threatIntelligence: true,
      sandboxing: true,
    },
    wiredInfrastructure: {
      vendor: networkVendor,
      switchCount: 48,
      aiOptimization: true,
      fabricTechnology: true,
    },
    wirelessInfrastructure: {
      vendor: wirelessVendor,
      apCount: 120,
      wifiStandard: "Wi-Fi 6E",
      meshTechnology: true,
    },
    radiusConfiguration: {
      type: "cloud-radius",
      clustering: true,
      radSecEnabled: true,
      loadBalancing: true,
    },
    portnoxAgent: {
      enabled: true,
      riskAssessment: true,
      behaviorAnalytics: true,
      aiThreatDetection: true,
    },
    cloudIntegration: {
      provider: cloudProvider,
      hybridDeployment: true,
      multiRegion: true,
      disasterRecovery: true,
    },
    complianceFrameworks: selectedIndustryData?.compliance || [],
    metrics: metrics,
    simulationMode: simulationMode,
    threatSimulation: threatSimulation,
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Supreme NAC Architecture Designer
                  </span>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                    <Star className="h-3 w-3 mr-1" />
                    PREMIUM
                  </Badge>
                </CardTitle>
                <p className="text-sm text-white/80 mt-1">
                  World-class network access control architecture with AI-powered insights
                </p>
                {selectedIndustryData && (
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="border-white/30 text-white">
                      {selectedIndustryData.icon}
                      <span className="ml-1">{selectedIndustryData.name}</span>
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white">
                      {selectedIndustryData.userCount} Users
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white">
                      {selectedIndustryData.deviceCount} Devices
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{metrics.activeUsers.toLocaleString()}</div>
                <div className="text-xs text-white/60">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{metrics.authenticatedDevices.toLocaleString()}</div>
                <div className="text-xs text-white/60">Auth Devices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{metrics.threatsBlocked}</div>
                <div className="text-xs text-white/60">Threats Blocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{metrics.complianceScore}%</div>
                <div className="text-xs text-white/60">Compliance</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="designer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg border-0">
          <TabsTrigger
            value="designer"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <Gem className="h-4 w-4" />
            <span>Supreme Designer</span>
          </TabsTrigger>
          <TabsTrigger
            value="scenarios"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            <Building className="h-4 w-4" />
            <span>Industry Scenarios</span>
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Component className="h-4 w-4" />
            <span>Vendor Matrix</span>
          </TabsTrigger>
          <TabsTrigger
            value="policies"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Workflow className="h-4 w-4" />
            <span>Policy Engine</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-yellow-400" />
                <span>Supreme Architecture Configuration</span>
                <Badge className="bg-yellow-500 text-black">AI-POWERED</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Industry Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Industry Scenario</span>
                  </Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-blue-400 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industryScenarios.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          <div className="flex items-center space-x-2">
                            {industry.icon}
                            <span>{industry.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {industry.complexity}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedIndustryData && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{selectedIndustryData.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedIndustryData.compliance.map((comp) => (
                          <Badge key={comp} variant="secondary" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Architecture View */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Architecture View</span>
                  </Label>
                  <Select value={selectedView} onValueChange={setSelectedView}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-purple-400 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {architectureViews.map((view) => (
                        <SelectItem key={view.id} value={view.id}>
                          <div className="flex items-center space-x-2">
                            {view.icon}
                            <span>{view.name}</span>
                            {view.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                                PREMIUM
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedViewData && <p className="text-xs text-muted-foreground">{selectedViewData.description}</p>}
                </div>

                {/* Visual Style */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Visual Style</span>
                  </Label>
                  <Select value={visualStyle} onValueChange={setVisualStyle}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-green-400 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3d-premium">3D Premium</SelectItem>
                      <SelectItem value="isometric">Isometric Pro</SelectItem>
                      <SelectItem value="blueprint">Technical Blueprint</SelectItem>
                      <SelectItem value="modern-flat">Modern Flat</SelectItem>
                      <SelectItem value="dark-neon">Dark Neon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Animation Preset */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Animation Preset</span>
                  </Label>
                  <Select value={animationPreset} onValueChange={setAnimationPreset}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-pink-400 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="smooth">Smooth Professional</SelectItem>
                      <SelectItem value="dynamic">Dynamic Flow</SelectItem>
                      <SelectItem value="minimal">Minimal Elegant</SelectItem>
                      <SelectItem value="high-energy">High Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Cloud Provider */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Cloud className="h-4 w-4" />
                    <span>Cloud Provider</span>
                  </Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center space-x-2">
                            {provider.icon}
                            <span>{provider.name}</span>
                            <Badge variant="outline">{provider.tier}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Network Vendor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Router className="h-4 w-4" />
                    <span>Network Vendor</span>
                  </Label>
                  <Select value={networkVendor} onValueChange={setNetworkVendor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networkVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          <div className="flex items-center space-x-2">
                            {vendor.icon}
                            <span>{vendor.name}</span>
                            <Badge variant="secondary">{vendor.marketShare}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Identity Provider */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span>Identity Provider</span>
                  </Label>
                  <Select value={identityProvider} onValueChange={setIdentityProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {identityProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center space-x-2">
                            {provider.icon}
                            <span>{provider.name}</span>
                            <Badge variant="outline">{provider.tier}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* MDM Provider */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>MDM Provider</span>
                  </Label>
                  <Select value={mdmProvider} onValueChange={setMdmProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mdmProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center space-x-2">
                            {provider.icon}
                            <span>{provider.name}</span>
                            <Badge variant="outline">{provider.tier}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Firewall Vendor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Firewall Vendor</span>
                  </Label>
                  <Select value={firewallVendor} onValueChange={setFirewallVendor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {firewallVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          <div className="flex items-center space-x-2">
                            {vendor.icon}
                            <span>{vendor.name}</span>
                            <Badge variant="secondary">{vendor.throughput}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAnimating(!isAnimating)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isAnimating ? "Pause" : "Play"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnimationSpeed([1.5])}
                      className="hover:bg-gray-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="text-sm font-medium">Animation Speed:</Label>
                    <div className="w-24">
                      <Slider
                        value={animationSpeed}
                        onValueChange={setAnimationSpeed}
                        max={3}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{animationSpeed[0]}x</span>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch id="realtime" checked={realTimeMetrics} onCheckedChange={setRealTimeMetrics} />
                      <Label htmlFor="realtime" className="text-sm font-medium">
                        Real-time Metrics
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="threats" checked={threatSimulation} onCheckedChange={setThreatSimulation} />
                      <Label htmlFor="threats" className="text-sm font-medium">
                        Threat Simulation
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="legend" checked={showLegend} onCheckedChange={setShowLegend} />
                      <Label htmlFor="legend" className="text-sm font-medium">
                        Legend
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("svg")}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    SVG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("png")}
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("pdf")}
                    className="hover:bg-red-50 hover:border-red-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("visio")}
                    className="hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Visio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-0">
              <InteractiveDiagram
                view={selectedView}
                config={diagramConfig}
                onExport={handleExport}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed[0]}
                showLegend={showLegend}
                showMetrics={showMetrics}
                theme={selectedTheme}
                visualStyle={visualStyle}
                animationPreset={animationPreset}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Industry Scenarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industryScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedIndustry === scenario.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedIndustry(scenario.id)}
                  >
                    <CardHeader className={`bg-gradient-to-r ${scenario.gradient} text-white`}>
                      <CardTitle className="flex items-center space-x-2">
                        {scenario.icon}
                        <span>{scenario.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Users:</span>
                          <span className="font-semibold">{scenario.userCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Devices:</span>
                          <span className="font-semibold">{scenario.deviceCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risk Level:</span>
                          <Badge variant={scenario.riskLevel === "critical" ? "destructive" : "secondary"}>
                            {scenario.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {scenario.compliance.map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Component className="h-5 w-5" />
                <span>Vendor Configuration Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Cloud Providers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Cloud className="h-5 w-5" />
                    <span>Cloud Providers</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cloudProviders.map((provider) => (
                      <Card key={provider.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {provider.icon}
                            <span className="font-semibold">{provider.name}</span>
                            <Badge variant="outline">{provider.tier}</Badge>
                          </div>
                          <div className="space-y-1">
                            {provider.features.map((feature) => (
                              <div key={feature} className="text-xs text-muted-foreground">
                                • {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Network Vendors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Router className="h-5 w-5" />
                    <span>Network Infrastructure</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {networkVendors.map((vendor) => (
                      <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {vendor.icon}
                            <span className="font-semibold text-sm">{vendor.name}</span>
                          </div>
                          <Badge variant="secondary" className="mb-2">
                            {vendor.marketShare} Market Share
                          </Badge>
                          <div className="space-y-1">
                            {vendor.features.map((feature) => (
                              <div key={feature} className="text-xs text-muted-foreground">
                                • {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Identity Providers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Identity & Access Management</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {identityProviders.map((provider) => (
                      <Card key={provider.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {provider.icon}
                            <span className="font-semibold text-sm">{provider.name}</span>
                          </div>
                          <div className="flex space-x-2 mb-2">
                            <Badge variant="outline">{provider.tier}</Badge>
                            <Badge variant="secondary">{provider.userLimit}</Badge>
                          </div>
                          <div className="space-y-1">
                            {provider.features.map((feature) => (
                              <div key={feature} className="text-xs text-muted-foreground">
                                • {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <PolicyManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
