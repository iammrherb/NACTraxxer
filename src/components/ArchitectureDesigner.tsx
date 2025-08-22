"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { 
  Network, 
  Shield, 
  Server, 
  Wifi, 
  Router, 
  Smartphone,
  Laptop,
  Tablet,
  Eye,
  Download,
  Settings,
  Zap,
  Lock,
  Users,
  Building,
  Cloud,
  Database
} from "lucide-react"
import { storage, type ArchitectureConfig, type Site } from "../lib/storage"
import { INDUSTRY_SCENARIOS } from "../lib/industryScenarios"

const NETWORK_COMPONENTS = {
  core: {
    icon: Server,
    label: "Core Router",
    color: "bg-blue-100 border-blue-300 text-blue-800"
  },
  switch: {
    icon: Network,
    label: "Network Switch",
    color: "bg-green-100 border-green-300 text-green-800"
  },
  firewall: {
    icon: Shield,
    label: "Firewall",
    color: "bg-red-100 border-red-300 text-red-800"
  },
  wireless: {
    icon: Wifi,
    label: "Wireless Controller",
    color: "bg-purple-100 border-purple-300 text-purple-800"
  },
  nac: {
    icon: Lock,
    label: "NAC Server",
    color: "bg-orange-100 border-orange-300 text-orange-800"
  },
  radius: {
    icon: Database,
    label: "RADIUS Server",
    color: "bg-teal-100 border-teal-300 text-teal-800"
  },
  cloud: {
    icon: Cloud,
    label: "Cloud Services",
    color: "bg-sky-100 border-sky-300 text-sky-800"
  }
}

const DEVICE_TYPES = {
  laptop: { icon: Laptop, label: "Laptops", color: "text-blue-600" },
  smartphone: { icon: Smartphone, label: "Smartphones", color: "text-green-600" },
  tablet: { icon: Tablet, label: "Tablets", color: "text-purple-600" },
  iot: { icon: Router, label: "IoT Devices", color: "text-orange-600" }
}

export default function ArchitectureDesigner() {
  const [config, setConfig] = useState<ArchitectureConfig>({
    selectedSite: "",
    industry: "",
    deployment: "on-premise",
    connectivity: [],
    wiredVendor: "",
    wirelessVendor: "",
    firewallVendor: "",
    identityProvider: [],
    mdmProvider: [],
    radiusType: "internal",
    deviceAdmin: "certificate",
    authTypes: [],
    deviceTypes: [],
    complianceFrameworks: [],
    securityFeatures: [],
    networkSegmentation: true,
    guestAccess: true,
    iotSupport: false,
    cloudIntegration: false,
    onPremiseIntegration: true,
    hybridDeployment: false,
    animations: true,
    showMetrics: true,
    showConnections: true,
    animationSpeed: 50,
    zoomLevel: 100,
    selectedView: "logical",
    customColors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b"
    }
  })
  
  const [sites, setSites] = useState<Site[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([
    "core", "switch", "firewall", "wireless", "nac", "radius"
  ])

  useEffect(() => {
    // Load saved configuration
    const savedConfig = storage.getArchitectureConfig()
    if (savedConfig) {
      setConfig(prev => ({ ...prev, ...savedConfig }))
    }
  }, [])

  const saveConfiguration = () => {
    storage.saveArchitectureConfig(config)
    // Show success message (would implement toast here)
  }

  useEffect(() => {
    const loadSites = async () => {
      const loadedSites = await storage.getSites()
      setSites(loadedSites)
    }
    loadSites()
  }, [])

  const loadSiteConfiguration = (siteId: string) => {
    const site = sites.find(s => s.id === siteId)
    if (site) {
      setConfig(prev => ({
        ...prev,
        selectedSite: siteId,
        industry: site.industry || ""
      }))
      
      // Auto-configure based on site industry
      if (site.industry && INDUSTRY_SCENARIOS[site.industry]) {
        const scenario = INDUSTRY_SCENARIOS[site.industry]
        setConfig(prev => ({
          ...prev,
          complianceFrameworks: scenario.compliance,
          securityFeatures: scenario.specialRequirements || []
        }))
      }
    }
  }

  const generateArchitectureDiagram = () => {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300 min-h-[600px] p-8">
        {/* Network Topology Visualization */}
        <div className="flex flex-col items-center space-y-8">
          {/* Internet/WAN Layer */}
          <div className="flex items-center justify-center">
            <div className="bg-sky-100 border-2 border-sky-300 rounded-lg p-4 flex items-center space-x-2">
              <Cloud className="h-6 w-6 text-sky-600" />
              <span className="font-medium text-sky-800">Internet / WAN</span>
            </div>
          </div>

          {/* Firewall Layer */}
          {selectedComponents.includes("firewall") && (
            <div className="flex items-center justify-center">
              <div className={`${NETWORK_COMPONENTS.firewall.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Shield className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.firewall.label}</div>
                  <div className="text-xs">{config.firewallVendor || "Not configured"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Core Network Layer */}
          <div className="flex items-center justify-center space-x-8">
            {selectedComponents.includes("core") && (
              <div className={`${NETWORK_COMPONENTS.core.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Server className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.core.label}</div>
                  <div className="text-xs">{config.wiredVendor || "Not configured"}</div>
                </div>
              </div>
            )}
            
            {selectedComponents.includes("nac") && (
              <div className={`${NETWORK_COMPONENTS.nac.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Lock className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.nac.label}</div>
                  <div className="text-xs">Portnox NAC</div>
                </div>
              </div>
            )}
            
            {selectedComponents.includes("radius") && (
              <div className={`${NETWORK_COMPONENTS.radius.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Database className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.radius.label}</div>
                  <div className="text-xs">{config.radiusType}</div>
                </div>
              </div>
            )}
          </div>

          {/* Access Layer */}
          <div className="flex items-center justify-center space-x-8">
            {selectedComponents.includes("switch") && (
              <div className={`${NETWORK_COMPONENTS.switch.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Network className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.switch.label}</div>
                  <div className="text-xs">Wired Access</div>
                </div>
              </div>
            )}
            
            {selectedComponents.includes("wireless") && (
              <div className={`${NETWORK_COMPONENTS.wireless.color} border-2 rounded-lg p-4 flex items-center space-x-2`}>
                <Wifi className="h-6 w-6" />
                <div>
                  <div className="font-medium">{NETWORK_COMPONENTS.wireless.label}</div>
                  <div className="text-xs">{config.wirelessVendor || "Not configured"}</div>
                </div>
              </div>
            )}
          </div>

          {/* Device Layer */}
          <div className="flex items-center justify-center space-x-6">
            {Object.entries(DEVICE_TYPES).map(([key, device]) => {
              const DeviceIcon = device.icon
              return (
                <div key={key} className="flex flex-col items-center space-y-2">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
                    <DeviceIcon className={`h-6 w-6 ${device.color}`} />
                  </div>
                  <div className="text-xs text-center font-medium text-gray-600">
                    {device.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Network Segments */}
        {config.networkSegmentation && (
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-lg shadow-sm border p-3">
              <div className="text-sm font-medium mb-2">Network Segments</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Corporate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Guest</span>
                </div>
                {config.iotSupport && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs">IoT</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Quarantine</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Lines */}
        {config.showConnections && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Architecture Designer</h2>
            <p className="text-muted-foreground">Design and visualize your NAC network architecture</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={saveConfiguration}>
              Save Configuration
            </Button>
          </div>
        </div>

        {/* Site Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Label htmlFor="siteSelect">Target Site</Label>
            <Select value={config.selectedSite} onValueChange={loadSiteConfiguration}>
              <SelectTrigger>
                <SelectValue placeholder="Select a site..." />
              </SelectTrigger>
              <SelectContent>
                {sites.map(site => (
                  <SelectItem key={site.id} value={site.id}>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{site.name}</span>
                      <Badge variant="secondary" className="text-xs">{site.status}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {config.industry && INDUSTRY_SCENARIOS[config.industry] && (
            <div className="text-sm">
              <div className="font-medium">Industry:</div>
              <Badge variant="outline" className="mt-1">
                {INDUSTRY_SCENARIOS[config.industry].icon} {INDUSTRY_SCENARIOS[config.industry].name}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="components" orientation="vertical">
            <TabsList className="grid w-full grid-rows-4">
              <TabsTrigger value="components" className="justify-start">
                <Network className="h-4 w-4 mr-2" />
                Components
              </TabsTrigger>
              <TabsTrigger value="vendors" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Vendors
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="features" className="justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
            </TabsList>

            <div className="ml-4 space-y-4">
              <TabsContent value="components" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Network Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(NETWORK_COMPONENTS).map(([key, component]) => {
                      const ComponentIcon = component.icon
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            checked={selectedComponents.includes(key)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedComponents(prev => [...prev, key])
                              } else {
                                setSelectedComponents(prev => prev.filter(c => c !== key))
                              }
                            }}
                          />
                          <ComponentIcon className="h-4 w-4" />
                          <Label className="text-sm">{component.label}</Label>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendors" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Vendor Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Wired Network</Label>
                      <Select value={config.wiredVendor} onValueChange={(value) => 
                        setConfig(prev => ({ ...prev, wiredVendor: value }))
                      }>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cisco">Cisco</SelectItem>
                          <SelectItem value="juniper">Juniper</SelectItem>
                          <SelectItem value="hp">HP/Aruba</SelectItem>
                          <SelectItem value="extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Wireless</Label>
                      <Select value={config.wirelessVendor} onValueChange={(value) => 
                        setConfig(prev => ({ ...prev, wirelessVendor: value }))
                      }>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cisco">Cisco</SelectItem>
                          <SelectItem value="aruba">Aruba</SelectItem>
                          <SelectItem value="ruckus">Ruckus</SelectItem>
                          <SelectItem value="ubiquiti">Ubiquiti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Firewall</Label>
                      <Select value={config.firewallVendor} onValueChange={(value) => 
                        setConfig(prev => ({ ...prev, firewallVendor: value }))
                      }>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="palo-alto">Palo Alto</SelectItem>
                          <SelectItem value="fortinet">Fortinet</SelectItem>
                          <SelectItem value="cisco">Cisco ASA</SelectItem>
                          <SelectItem value="checkpoint">Check Point</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">RADIUS Type</Label>
                      <Select value={config.radiusType} onValueChange={(value) => 
                        setConfig(prev => ({ ...prev, radiusType: value }))
                      }>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal RADIUS</SelectItem>
                          <SelectItem value="external">External RADIUS</SelectItem>
                          <SelectItem value="ad">Active Directory</SelectItem>
                          <SelectItem value="ldap">LDAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Device Authentication</Label>
                      <Select value={config.deviceAdmin} onValueChange={(value) => 
                        setConfig(prev => ({ ...prev, deviceAdmin: value }))
                      }>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="certificate">Certificate-based</SelectItem>
                          <SelectItem value="mac">MAC Address</SelectItem>
                          <SelectItem value="802.1x">802.1X</SelectItem>
                          <SelectItem value="web">Web Portal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Advanced Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Network Segmentation</Label>
                      <Switch
                        checked={config.networkSegmentation}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, networkSegmentation: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Guest Access</Label>
                      <Switch
                        checked={config.guestAccess}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, guestAccess: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">IoT Support</Label>
                      <Switch
                        checked={config.iotSupport}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, iotSupport: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Cloud Integration</Label>
                      <Switch
                        checked={config.cloudIntegration}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, cloudIntegration: checked }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Connections</Label>
                      <Switch
                        checked={config.showConnections}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, showConnections: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Metrics</Label>
                      <Switch
                        checked={config.showMetrics}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({ ...prev, showMetrics: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Architecture Diagram */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Network Architecture Diagram</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {config.selectedView === "logical" ? "Logical View" : "Physical View"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      selectedView: prev.selectedView === "logical" ? "physical" : "logical"
                    }))}
                  >
                    Toggle View
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Interactive network topology showing NAC integration points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generateArchitectureDiagram()}
            </CardContent>
          </Card>
          
          {/* Configuration Summary */}
          {config.selectedSite && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Deployment Type:</span>
                    <span className="ml-2 capitalize">{config.deployment.replace("-", " ")}</span>
                  </div>
                  <div>
                    <span className="font-medium">Authentication:</span>
                    <span className="ml-2">{config.deviceAdmin}</span>
                  </div>
                  <div>
                    <span className="font-medium">Network Segmentation:</span>
                    <span className="ml-2">{config.networkSegmentation ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Guest Access:</span>
                    <span className="ml-2">{config.guestAccess ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
                
                {config.complianceFrameworks.length > 0 && (
                  <div className="mt-4">
                    <div className="font-medium text-sm mb-2">Compliance Frameworks:</div>
                    <div className="flex flex-wrap gap-2">
                      {config.complianceFrameworks.map(framework => (
                        <Badge key={framework} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}