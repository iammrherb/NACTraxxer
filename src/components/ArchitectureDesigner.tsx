import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import { toast } from "@/hooks/use-toast"
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
  connectivity: ["wireless", "wired"],
  wiredVendor: "cisco",
  wirelessVendor: "cisco",
  firewallVendor: "cisco",
  identityProvider: ["azure_ad"],
  mdmProvider: ["intune"],
  radiusType: "cloud",
  deviceAdmin: "admin@company.com",
  authTypes: ["802.1x", "mac_auth", "web_auth"],
  deviceTypes: ["laptop", "mobile", "iot"],
  complianceFrameworks: ["hipaa", "gdpr"],
  securityFeatures: ["device_fingerprinting", "behavioral_analysis"],
  networkSegmentation: true,
  guestAccess: true,
  iotSupport: true,
  cloudIntegration: true,
  onPremiseIntegration: false,
  hybridDeployment: true,
  animations: true,
  showMetrics: true,
  showConnections: true,
  animationSpeed: 1,
  zoomLevel: 100,
  selectedView: "complete",
  customColors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#8b5cf6"
  }
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
      console.error("Failed to load configuration:", error)
    }
  }

  const loadSites = async () => {
    try {
      const savedSites = await storage.getSites()
      if (savedSites && savedSites.length > 0) {
        setSites(savedSites)
      }
    } catch (error) {
      console.error("Failed to load sites:", error)
    }
  }

  const saveConfiguration = async () => {
    try {
      await storage.saveArchitectureConfig(config)
      toast({
        title: "Configuration Saved",
        description: "Your architecture configuration has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateConfig = (updates: Partial<ArchitectureConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const exportDiagram = () => {
    // Export functionality placeholder
    toast({
      title: "Export Started",
      description: "Your diagram export is being prepared.",
    })
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold gradient-text">NAC Architecture Designer</h1>
              <Badge variant="secondary" className="text-xs">
                {sites.length} Sites Configured
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
              >
                {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={saveConfiguration}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportDiagram}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diagram" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Interactive Diagram
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Policy Management
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Live Simulation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Architecture Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Network className="w-16 h-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">Interactive Diagram Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      The full interactive architecture diagram with drag-and-drop components, 
                      real-time connections, and beautiful animations is being finalized.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px] bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Shield className="w-16 h-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">Policy Editor Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      Advanced policy management with visual rule builders, 
                      compliance templates, and real-time validation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Network Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px] bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="w-16 h-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">Simulation Engine Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      Real-time network simulation with device behavior modeling, 
                      traffic analysis, and comprehensive metrics dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Industry: {config.industry.toUpperCase()}</span>
              <span>Deployment: {config.deployment.toUpperCase()}</span>
              <span>Sites: {sites.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Last Saved: Never</span>
              <span>Version: 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}