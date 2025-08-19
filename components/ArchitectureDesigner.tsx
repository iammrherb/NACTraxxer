"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import InteractiveDiagram from "./InteractiveDiagram"
import PolicyManagement from "./policy-management"
import VisualPolicySimulation from "./visual-policy-simulation"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import {
  Settings,
  Network,
  Shield,
  Wifi,
  Server,
  Lock,
  Users,
  Smartphone,
  Monitor,
  Router,
  Globe,
  ChevronDown,
  ChevronRight,
  Save,
  Download,
  Activity,
  BarChart3,
  Layers,
  MapPin,
  Building,
  Factory,
  GraduationCap,
  ShoppingBag,
  Heart,
  Landmark,
  Maximize2,
  Minimize2,
  Eye,
  Zap,
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

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>(defaultConfig)
  const [sites, setSites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("configuration")
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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

  const vendorOptions = {
    wired: [
      { value: "cisco", label: "Cisco", color: "#1BA0D7" },
      { value: "aruba", label: "Aruba (HPE)", color: "#FF6900" },
      { value: "juniper", label: "Juniper", color: "#84BD00" },
      { value: "extreme", label: "Extreme Networks", color: "#00A651" },
      { value: "dell", label: "Dell Networking", color: "#007DB8" },
    ],
    wireless: [
      { value: "cisco", label: "Cisco", color: "#1BA0D7" },
      { value: "aruba", label: "Aruba (HPE)", color: "#FF6900" },
      { value: "ruckus", label: "Ruckus (CommScope)", color: "#FF6B00" },
      { value: "meraki", label: "Cisco Meraki", color: "#58C4DC" },
      { value: "mist", label: "Mist (Juniper)", color: "#41B883" },
    ],
    firewall: [
      { value: "palo_alto", label: "Palo Alto Networks", color: "#FA582D" },
      { value: "fortinet", label: "Fortinet", color: "#EE3124" },
      { value: "checkpoint", label: "Check Point", color: "#FF6B35" },
      { value: "cisco", label: "Cisco ASA/FTD", color: "#1BA0D7" },
      { value: "juniper", label: "Juniper SRX", color: "#84BD00" },
    ],
  }

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

  const architectureViews = [
    { value: "complete", label: "Complete Architecture", icon: Layers },
    { value: "authentication", label: "Authentication Flow", icon: Lock },
    { value: "pki", label: "PKI & Certificate Management", icon: Shield },
    { value: "policies", label: "Access Control Policies", icon: Settings },
    { value: "connectivity", label: "Connectivity Options", icon: Network },
    { value: "intune", label: "Intune Integration", icon: Smartphone },
    { value: "jamf", label: "Jamf Integration", icon: Monitor },
    { value: "onboarding", label: "Device Onboarding", icon: Users },
    { value: "radsec", label: "RADSEC Proxy", icon: Router },
    { value: "ztna", label: "Zero Trust Network Access", icon: Globe },
    { value: "guest", label: "Guest Portal", icon: Wifi },
    { value: "iot", label: "IoT Onboarding", icon: Activity },
    { value: "tacacs", label: "TACACS+ Administration", icon: Server },
    { value: "risk", label: "Risk Assessment", icon: BarChart3 },
    { value: "multisite", label: "Multi-Site Deployment", icon: Building },
    { value: "cloud", label: "Cloud Integration", icon: Globe },
    { value: "wireless", label: "Wireless Infrastructure", icon: Wifi },
    { value: "wired", label: "Wired Infrastructure", icon: Network },
  ]

  return (
    <div className={`w-full h-full ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Architecture Designer
          </h2>
          <p className="text-gray-600">Design and configure your Zero Trust NAC architecture</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveConfiguration}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-white border-b">
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="diagram" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Architecture Diagram
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Site Policies
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Simulation
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Site Selection */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Site Selection
                </CardTitle>
                <CardDescription>Select a site to configure its architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={config.selectedSite} onValueChange={(value) => updateConfig({ selectedSite: value })}>
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
              </CardContent>
            </Card>

            {/* Basic Configuration */}
            <Card>
              <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection("basic")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Basic Configuration
                      </div>
                      {expandedSections.basic ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Industry</Label>
                      <Select value={config.industry} onValueChange={(value) => updateConfig({ industry: value })}>
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
                      <Label>Deployment Model</Label>
                      <Select value={config.deployment} onValueChange={(value) => updateConfig({ deployment: value })}>
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
                      <Label>Connectivity Options</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          { value: "wired", label: "Wired Network" },
                          { value: "wireless", label: "Wireless Network" },
                          { value: "vpn", label: "VPN Access" },
                          { value: "remote", label: "Remote Access" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.value}
                              checked={config.connectivity.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateConfig({ connectivity: [...config.connectivity, option.value] })
                                } else {
                                  updateConfig({ connectivity: config.connectivity.filter((c) => c !== option.value) })
                                }
                              }}
                            />
                            <Label htmlFor={option.value}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Infrastructure Configuration */}
            <Card>
              <Collapsible open={expandedSections.infrastructure} onOpenChange={() => toggleSection("infrastructure")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Infrastructure
                      </div>
                      {expandedSections.infrastructure ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Wired Network Vendor</Label>
                      <Select
                        value={config.wiredVendor}
                        onValueChange={(value) => updateConfig({ wiredVendor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorOptions.wired.map((vendor) => (
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
                      <Label>Wireless Network Vendor</Label>
                      <Select
                        value={config.wirelessVendor}
                        onValueChange={(value) => updateConfig({ wirelessVendor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorOptions.wireless.map((vendor) => (
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
                      <Label>Firewall Vendor</Label>
                      <Select
                        value={config.firewallVendor}
                        onValueChange={(value) => updateConfig({ firewallVendor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorOptions.firewall.map((vendor) => (
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
                      <Label>RADIUS Type</Label>
                      <Select value={config.radiusType} onValueChange={(value) => updateConfig({ radiusType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloud">Portnox Cloud RADIUS</SelectItem>
                          <SelectItem value="on_premise">On-Premise RADIUS</SelectItem>
                          <SelectItem value="proxy">RADSEC Proxy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Device Administration</Label>
                      <Select
                        value={config.deviceAdmin}
                        onValueChange={(value) => updateConfig({ deviceAdmin: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="radius">RADIUS</SelectItem>
                          <SelectItem value="tacacs">TACACS+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Identity & Authentication */}
            <Card>
              <Collapsible open={expandedSections.identity} onOpenChange={() => toggleSection("identity")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Identity & Authentication
                      </div>
                      {expandedSections.identity ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Identity Providers</Label>
                      <div className="space-y-2 mt-2">
                        {identityProviders.map((provider) => (
                          <div key={provider.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={provider.value}
                              checked={config.identityProvider.includes(provider.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateConfig({ identityProvider: [...config.identityProvider, provider.value] })
                                } else {
                                  updateConfig({
                                    identityProvider: config.identityProvider.filter((p) => p !== provider.value),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={provider.value} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }}></div>
                              {provider.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>MDM Providers</Label>
                      <div className="space-y-2 mt-2">
                        {mdmProviders.map((provider) => (
                          <div key={provider.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={provider.value}
                              checked={config.mdmProvider.includes(provider.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateConfig({ mdmProvider: [...config.mdmProvider, provider.value] })
                                } else {
                                  updateConfig({ mdmProvider: config.mdmProvider.filter((p) => p !== provider.value) })
                                }
                              }}
                            />
                            <Label htmlFor={provider.value} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }}></div>
                              {provider.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Authentication Types</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          { value: "802.1x", label: "802.1X Certificate" },
                          { value: "mac_auth", label: "MAC Authentication" },
                          { value: "web_auth", label: "Web Authentication" },
                          { value: "captive_portal", label: "Captive Portal" },
                        ].map((auth) => (
                          <div key={auth.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={auth.value}
                              checked={config.authTypes.includes(auth.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateConfig({ authTypes: [...config.authTypes, auth.value] })
                                } else {
                                  updateConfig({ authTypes: config.authTypes.filter((a) => a !== auth.value) })
                                }
                              }}
                            />
                            <Label htmlFor={auth.value}>{auth.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Security & Compliance */}
            <Card className="lg:col-span-2">
              <Collapsible open={expandedSections.security} onOpenChange={() => toggleSection("security")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security & Compliance
                      </div>
                      {expandedSections.security ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Compliance Frameworks</Label>
                        <div className="space-y-2 mt-2">
                          {complianceFrameworks.map((framework) => (
                            <div key={framework.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={framework.value}
                                checked={config.complianceFrameworks.includes(framework.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateConfig({
                                      complianceFrameworks: [...config.complianceFrameworks, framework.value],
                                    })
                                  } else {
                                    updateConfig({
                                      complianceFrameworks: config.complianceFrameworks.filter(
                                        (f) => f !== framework.value,
                                      ),
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={framework.value}>{framework.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Security Features</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            { value: "encryption", label: "End-to-End Encryption" },
                            { value: "mfa", label: "Multi-Factor Authentication" },
                            { value: "threat_detection", label: "Threat Detection" },
                            { value: "behavioral_analysis", label: "Behavioral Analysis" },
                            { value: "device_profiling", label: "Device Profiling" },
                            { value: "risk_scoring", label: "Risk Scoring" },
                          ].map((feature) => (
                            <div key={feature.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature.value}
                                checked={config.securityFeatures.includes(feature.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateConfig({ securityFeatures: [...config.securityFeatures, feature.value] })
                                  } else {
                                    updateConfig({
                                      securityFeatures: config.securityFeatures.filter((f) => f !== feature.value),
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={feature.value}>{feature.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Features & Capabilities */}
            <Card>
              <Collapsible open={expandedSections.features} onOpenChange={() => toggleSection("features")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Features & Capabilities
                      </div>
                      {expandedSections.features ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="network-segmentation">Network Segmentation</Label>
                        <Switch
                          id="network-segmentation"
                          checked={config.networkSegmentation}
                          onCheckedChange={(checked) => updateConfig({ networkSegmentation: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="guest-access">Guest Access</Label>
                        <Switch
                          id="guest-access"
                          checked={config.guestAccess}
                          onCheckedChange={(checked) => updateConfig({ guestAccess: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="iot-support">IoT Device Support</Label>
                        <Switch
                          id="iot-support"
                          checked={config.iotSupport}
                          onCheckedChange={(checked) => updateConfig({ iotSupport: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="cloud-integration">Cloud Integration</Label>
                        <Switch
                          id="cloud-integration"
                          checked={config.cloudIntegration}
                          onCheckedChange={(checked) => updateConfig({ cloudIntegration: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="on-premise-integration">On-Premise Integration</Label>
                        <Switch
                          id="on-premise-integration"
                          checked={config.onPremiseIntegration}
                          onCheckedChange={(checked) => updateConfig({ onPremiseIntegration: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="hybrid-deployment">Hybrid Deployment</Label>
                        <Switch
                          id="hybrid-deployment"
                          checked={config.hybridDeployment}
                          onCheckedChange={(checked) => updateConfig({ hybridDeployment: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Visualization Settings */}
            <Card className="lg:col-span-2">
              <Collapsible open={expandedSections.visualization} onOpenChange={() => toggleSection("visualization")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Visualization Settings
                      </div>
                      {expandedSections.visualization ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="animations">Enable Animations</Label>
                          <Switch
                            id="animations"
                            checked={config.animations}
                            onCheckedChange={(checked) => updateConfig({ animations: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-metrics">Show Metrics</Label>
                          <Switch
                            id="show-metrics"
                            checked={config.showMetrics}
                            onCheckedChange={(checked) => updateConfig({ showMetrics: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-connections">Show Connections</Label>
                          <Switch
                            id="show-connections"
                            checked={config.showConnections}
                            onCheckedChange={(checked) => updateConfig({ showConnections: checked })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Animation Speed: {config.animationSpeed}%</Label>
                          <Slider
                            value={[config.animationSpeed]}
                            onValueChange={([value]) => updateConfig({ animationSpeed: value })}
                            max={100}
                            min={10}
                            step={10}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Zoom Level: {config.zoomLevel}%</Label>
                          <Slider
                            value={[config.zoomLevel]}
                            onValueChange={([value]) => updateConfig({ zoomLevel: value })}
                            max={200}
                            min={50}
                            step={10}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Architecture View</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {architectureViews.map((view) => {
                          const IconComponent = view.icon
                          return (
                            <Button
                              key={view.value}
                              variant={config.selectedView === view.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateConfig({ selectedView: view.value })}
                              className="justify-start h-auto p-3"
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <span className="text-xs">{view.label}</span>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </TabsContent>

        {/* Architecture Diagram Tab */}
        <TabsContent value="diagram" className="flex-1">
          <div className="h-full">
            <InteractiveDiagram config={config} />
          </div>
        </TabsContent>

        {/* Site Policies Tab */}
        <TabsContent value="policies" className="flex-1">
          <PolicyManagement />
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="flex-1">
          <VisualPolicySimulation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
