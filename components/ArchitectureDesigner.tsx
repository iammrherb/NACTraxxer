"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InteractiveDiagram from "./InteractiveDiagram"
import PolicyManagement from "./policy-management"
import VisualPolicySimulation from "./visual-policy-simulation"
import { storage } from "../lib/storage"
import { toast } from "../hooks/use-toast"
import { Network, Shield, BarChart3, Maximize2, Minimize2, Save, Download, Eye, EyeOff } from "lucide-react"

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

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>(defaultConfig)
  const [sites, setSites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("diagram")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

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
    // This will be handled by the InteractiveDiagram component
    toast({
      title: "Export Started",
      description: "Your diagram is being exported...",
    })
  }

  return (
    <div className={`w-full h-screen flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Network className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Architecture Designer
            </h1>
            <p className="text-gray-600 font-medium">
              Design and configure your Zero Trust NAC architecture with real-time visualization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowControls(!showControls)} size="sm">
            {showControls ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showControls ? "Hide Controls" : "Show Controls"}
          </Button>
          <Button variant="outline" onClick={saveConfiguration} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button variant="outline" onClick={exportDiagram} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)} size="sm">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white border-b shadow-sm">
            <TabsTrigger
              value="diagram"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Network className="h-4 w-4" />
              Interactive Architecture Diagram
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200"
            >
              <Shield className="h-4 w-4" />
              Site Policies & Rules
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-violet-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200"
            >
              <BarChart3 className="h-4 w-4" />
              Policy Simulation & Testing
            </TabsTrigger>
          </TabsList>

          {/* Interactive Architecture Diagram Tab */}
          <TabsContent value="diagram" className="flex-1 p-0 m-0">
            <div className="h-full w-full relative">
              <InteractiveDiagram
                config={config}
                onConfigUpdate={updateConfig}
                showControls={showControls}
                isFullscreen={isFullscreen}
              />
            </div>
          </TabsContent>

          {/* Site Policies Tab */}
          <TabsContent value="policies" className="flex-1 p-0 m-0">
            <div className="h-full w-full">
              <PolicyManagement />
            </div>
          </TabsContent>

          {/* Policy Simulation Tab */}
          <TabsContent value="simulation" className="flex-1 p-0 m-0">
            <div className="h-full w-full">
              <VisualPolicySimulation />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-gray-50 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>
            Industry: <strong className="text-gray-900">{config.industry}</strong>
          </span>
          <span>
            Deployment: <strong className="text-gray-900">{config.deployment}</strong>
          </span>
          <span>
            View: <strong className="text-gray-900">{config.selectedView}</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            Sites: <strong className="text-gray-900">{sites.length}</strong>
          </span>
          <span>
            Zoom: <strong className="text-gray-900">{config.zoomLevel}%</strong>
          </span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${config.animations ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span>Animations {config.animations ? "On" : "Off"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
