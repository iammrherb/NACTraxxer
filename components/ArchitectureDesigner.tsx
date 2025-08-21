"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import InteractiveDiagram from "./InteractiveDiagram"
import PolicyManagement from "./policy-management"
import VisualPolicySimulation from "./visual-policy-simulation"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import {
  Network,
  Shield,
  BarChart3,
  Maximize2,
  Minimize2,
  Save,
  Download,
  Eye,
  EyeOff,
  Settings,
  Monitor,
  Layers,
  Globe,
  Building,
  Users,
  Lock,
  Activity,
  Server,
  Wifi,
  Router,
  Smartphone,
  Heart,
  Landmark,
  Factory,
  ShoppingBag,
  GraduationCap,
} from "lucide-react"

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

const defaultConfig: ArchitectureConfig = {
  industry: "healthcare",
  deployment: "hybrid",
  connectivity: ["wired", "wireless"],
  wiredVendor: "cisco",
  wirelessVendor: "aruba",
  firewallVendor: "palo_alto",
  identityProvider: ["azure_ad"],
  mdmProvider: ["intune"],
  radiusType: "cloud",
  deviceAdmin: "radius",
  authTypes: ["802.1x", "mac_auth"],
  deviceTypes: ["windows", "mac", "ios", "android"],
  complianceFrameworks: ["hipaa"],
  securityFeatures: ["encryption", "mfa"],
  networkSegmentation: true,
  guestAccess: true,
  iotSupport: true,
  cloudIntegration: true,
  onPremiseIntegration: false,
  hybridDeployment: true,
  animations: true,
  showMetrics: true,
  showConnections: true,
  animationSpeed: 50,
  zoomLevel: 100,
  selectedView: "complete",
  customColors: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
  },
}

const ARCHITECTURE_VIEWS = [
  {
    id: "complete",
    name: "Complete Architecture",
    description: "Full network architecture with all components",
    icon: Layers,
    color: "#3B82F6",
  },
  {
    id: "authentication",
    name: "Authentication Flow",
    description: "User and device authentication workflows",
    icon: Lock,
    color: "#10B981",
  },
  {
    id: "pki",
    name: "PKI & Certificate Management",
    description: "Certificate authority hierarchy and PKI",
    icon: Shield,
    color: "#DC2626",
  },
  {
    id: "policies",
    name: "Access Control Policies",
    description: "Policy engine and enforcement mechanisms",
    icon: Settings,
    color: "#059669",
  },
  {
    id: "connectivity",
    name: "Connectivity Options",
    description: "WAN, LAN, cloud, and hybrid connectivity",
    icon: Network,
    color: "#7C3AED",
  },
  {
    id: "intune",
    name: "Microsoft Intune Integration",
    description: "Intune MDM integration and device compliance",
    icon: Smartphone,
    color: "#00BCF2",
  },
  {
    id: "jamf",
    name: "Jamf Pro Integration",
    description: "Jamf Pro MDM integration for Apple devices",
    icon: Monitor,
    color: "#4A90E2",
  },
  {
    id: "onboarding",
    name: "Device Onboarding",
    description: "Automated device registration workflows",
    icon: Users,
    color: "#F59E0B",
  },
  {
    id: "radsec",
    name: "RADSEC Proxy Architecture",
    description: "RADIUS over TLS proxy deployment",
    icon: Router,
    color: "#8B5CF6",
  },
  {
    id: "ztna",
    name: "Zero Trust Network Access",
    description: "ZTNA gateway and micro-segmentation",
    icon: Globe,
    color: "#7C3AED",
  },
  {
    id: "guest",
    name: "Guest Portal & Access",
    description: "Guest access management and captive portal",
    icon: Wifi,
    color: "#06B6D4",
  },
  {
    id: "iot",
    name: "IoT Device Onboarding",
    description: "IoT device discovery and automated onboarding",
    icon: Activity,
    color: "#059669",
  },
  {
    id: "tacacs",
    name: "TACACS+ Administration",
    description: "Network device administration with TACACS+",
    icon: Server,
    color: "#DC2626",
  },
  {
    id: "risk",
    name: "Risk Assessment & Analytics",
    description: "Risk-based access control and threat assessment",
    icon: BarChart3,
    color: "#EF4444",
  },
  {
    id: "multisite",
    name: "Multi-Site Deployment",
    description: "Enterprise multi-location architecture",
    icon: Building,
    color: "#6366F1",
  },
  {
    id: "cloud",
    name: "Cloud Integration",
    description: "Multi-cloud services integration",
    icon: Globe,
    color: "#3B82F6",
  },
  {
    id: "wireless",
    name: "Wireless Infrastructure",
    description: "Wireless network architecture",
    icon: Wifi,
    color: "#8B5CF6",
  },
  {
    id: "wired",
    name: "Wired Infrastructure",
    description: "Wired network infrastructure",
    icon: Network,
    color: "#6B7280",
  },
]

const INDUSTRY_OPTIONS = [
  { value: "healthcare", label: "Healthcare", icon: Heart, color: "#EF4444" },
  { value: "financial", label: "Financial Services", icon: Landmark, color: "#10B981" },
  { value: "manufacturing", label: "Manufacturing", icon: Factory, color: "#3B82F6" },
  { value: "technology", label: "Technology", icon: Monitor, color: "#8B5CF6" },
  { value: "retail", label: "Retail", icon: ShoppingBag, color: "#F59E0B" },
  { value: "education", label: "Education", icon: GraduationCap, color: "#6366F1" },
  { value: "government", label: "Government", icon: Building, color: "#6B7280" },
]

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>(defaultConfig)
  const [sites, setSites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("diagram")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [selectedView, setSelectedView] = useState("complete")
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConfiguration()
    loadSites()
  }, [])

  const loadConfiguration = async () => {
    try {
      const savedConfig = await storage.getArchitectureConfig()
      if (savedConfig) {
        setConfig({ ...defaultConfig, ...savedConfig })
      }
    } catch (error) {
      console.error("Error loading configuration:", error)
    }
  }

  const loadSites = async () => {
    try {
      const savedSites = await storage.getSites()
      setSites(savedSites || [])
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const saveConfiguration = async () => {
    try {
      await storage.saveArchitectureConfig(config)
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

  const updateConfig = (updates: Partial<ArchitectureConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const exportDiagram = () => {
    toast({
      title: "Export Started",
      description: "Your diagram is being exported...",
    })
  }

  const toggleFullscreen = (section?: string) => {
    if (section) {
      setFullscreenSection(fullscreenSection === section ? null : section)
    } else {
      setIsFullscreen(!isFullscreen)
    }
  }

  const enterFullscreenMode = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    }
    setIsFullscreen(true)
  }

  const exitFullscreenMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    setIsFullscreen(false)
    setFullscreenSection(null)
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${
        isFullscreen || fullscreenSection ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg">
            <Network className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Architecture Designer
            </h1>
            <p className="text-lg text-gray-600 font-medium mt-1">
              Design and visualize your Zero Trust NAC architecture with professional-grade tools
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowControls(!showControls)} size="lg" className="h-12">
            {showControls ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
            {showControls ? "Hide Controls" : "Show Controls"}
          </Button>
          <Button variant="outline" onClick={saveConfiguration} size="lg" className="h-12 bg-transparent">
            <Save className="h-5 w-5 mr-2" />
            Save Configuration
          </Button>
          <Button variant="outline" onClick={exportDiagram} size="lg" className="h-12 bg-transparent">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={isFullscreen ? exitFullscreenMode : enterFullscreenMode}
            size="lg"
            className="h-12 bg-transparent"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Architecture View Selector */}
      <div className="p-6 bg-white/60 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Architecture Views</h2>
          <Button variant="outline" onClick={() => toggleFullscreen("views")} size="sm">
            {fullscreenSection === "views" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        <div
          className={`grid gap-4 ${
            fullscreenSection === "views"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9"
          }`}
        >
          {ARCHITECTURE_VIEWS.map((view) => {
            const IconComponent = view.icon
            const isSelected = selectedView === view.id
            return (
              <Card
                key={view.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50"
                    : "hover:shadow-md"
                } ${fullscreenSection === "views" ? "p-6" : "p-4"}`}
                onClick={() => {
                  setSelectedView(view.id)
                  updateConfig({ selectedView: view.id })
                }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`p-4 rounded-xl shadow-sm ${fullscreenSection === "views" ? "p-6" : "p-3"}`}
                      style={{ backgroundColor: view.color + "20" }}
                    >
                      <IconComponent
                        className={`${fullscreenSection === "views" ? "h-8 w-8" : "h-6 w-6"}`}
                        style={{ color: view.color }}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-gray-900 ${
                          fullscreenSection === "views" ? "text-lg" : "text-sm"
                        }`}
                      >
                        {view.name}
                      </h3>
                      {fullscreenSection === "views" && (
                        <p className="text-sm text-gray-600 mt-2">{view.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="bg-white/80 backdrop-blur-sm border-b px-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-gray-100/50">
              <TabsTrigger
                value="diagram"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Network className="h-5 w-5" />
                <span className="font-medium">Interactive Architecture</span>
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Site Policies</span>
              </TabsTrigger>
              <TabsTrigger
                value="simulation"
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Policy Simulation</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Interactive Architecture Diagram Tab */}
          <TabsContent value="diagram" className="flex-1 p-0 m-0 relative">
            <div className="absolute inset-0 flex">
              {/* Main Diagram Area */}
              <div
                className={`flex-1 relative ${fullscreenSection === "diagram" ? "fixed inset-0 z-50 bg-white" : ""}`}
              >
                {fullscreenSection !== "diagram" && (
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="outline"
                      onClick={() => toggleFullscreen("diagram")}
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm shadow-lg"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {fullscreenSection === "diagram" && (
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="outline"
                      onClick={() => toggleFullscreen("diagram")}
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm shadow-lg"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <InteractiveDiagram
                  config={config}
                  onConfigUpdate={updateConfig}
                  showControls={showControls}
                  isFullscreen={fullscreenSection === "diagram"}
                />
              </div>
            </div>
          </TabsContent>

          {/* Site Policies Tab */}
          <TabsContent value="policies" className="flex-1 p-0 m-0 relative">
            <div
              className={`h-full w-full relative ${fullscreenSection === "policies" ? "fixed inset-0 z-50 bg-white" : ""}`}
            >
              {fullscreenSection !== "policies" && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    onClick={() => toggleFullscreen("policies")}
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {fullscreenSection === "policies" && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    onClick={() => toggleFullscreen("policies")}
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="h-full overflow-auto">
                <PolicyManagement />
              </div>
            </div>
          </TabsContent>

          {/* Policy Simulation Tab */}
          <TabsContent value="simulation" className="flex-1 p-0 m-0 relative">
            <div
              className={`h-full w-full relative ${fullscreenSection === "simulation" ? "fixed inset-0 z-50 bg-white" : ""}`}
            >
              {fullscreenSection !== "simulation" && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    onClick={() => toggleFullscreen("simulation")}
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {fullscreenSection === "simulation" && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    onClick={() => toggleFullscreen("simulation")}
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="h-full overflow-auto">
                <VisualPolicySimulation />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Status Bar */}
      <div className="border-t bg-white/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <span className="font-medium">Industry:</span>
            <span className="text-gray-900 font-semibold capitalize">{config.industry}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <span className="font-medium">Deployment:</span>
            <span className="text-gray-900 font-semibold capitalize">{config.deployment}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500"></div>
            <span className="font-medium">View:</span>
            <span className="text-gray-900 font-semibold">
              {ARCHITECTURE_VIEWS.find((v) => v.id === selectedView)?.name || "Complete Architecture"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Sites:</span>
            <span className="text-gray-900 font-semibold">{sites.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Zoom:</span>
            <span className="text-gray-900 font-semibold">{config.zoomLevel}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${config.animations ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="font-medium">Animations</span>
            <span className="text-gray-900 font-semibold">{config.animations ? "On" : "Off"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Last Saved:</span>
            <span className="text-gray-900 font-semibold">Just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}
