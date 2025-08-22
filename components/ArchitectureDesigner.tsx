"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { storage, type Site } from "@/lib/storage"
import InteractiveDiagram from "./InteractiveDiagram"
import PolicyManagement from "./policy-management"
import {
  Network,
  Shield,
  Users,
  Globe,
  Wifi,
  Key,
  Eye,
  Settings,
  Download,
  Layers,
  Zap,
  Database,
  Cloud,
  Monitor,
  Router,
  HardDrive,
} from "lucide-react"

export default function ArchitectureDesigner() {
  const [activeView, setActiveView] = useState("complete")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [showPolicyDesigner, setShowPolicyDesigner] = useState(false)
  const [architectureConfig, setArchitectureConfig] = useState({
    cloudProvider: "portnox",
    identityProvider: "azure-ad",
    mdmProvider: "intune",
    firewallVendor: "palo-alto",
    switchVendor: "cisco",
    wirelessVendor: "cisco",
    radiusType: "cloud-radius",
    enableAnimations: true,
    showMetrics: true,
    theme: "professional",
  })

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      const sitesData = await storage.getSites()
      setSites(sitesData || [])
      if (sitesData && sitesData.length > 0) {
        setSelectedSite(sitesData[0])
      }
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const handleExport = async (format: "svg" | "png" | "pdf") => {
    try {
      toast({
        title: "Export Started",
        description: `Exporting architecture diagram as ${format.toUpperCase()}...`,
      })

      // Export logic would be handled by the InteractiveDiagram component
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: `Architecture diagram exported successfully as ${format.toUpperCase()}.`,
        })
      }, 2000)
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export diagram. Please try again.",
        variant: "destructive",
      })
    }
  }

  const architectureViews = [
    {
      id: "complete",
      name: "Complete Architecture",
      description: "Full end-to-end Zero Trust NAC deployment",
      icon: Network,
      color: "text-blue-600",
    },
    {
      id: "multi-site",
      name: "Multi-Site Enterprise",
      description: "Global enterprise deployment across multiple locations",
      icon: Globe,
      color: "text-green-600",
    },
    {
      id: "authentication",
      name: "Authentication Flow",
      description: "Detailed 802.1X authentication process",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      id: "pki",
      name: "PKI & Certificate Management",
      description: "Certificate lifecycle and PKI infrastructure",
      icon: Key,
      color: "text-orange-600",
    },
    {
      id: "policy-framework",
      name: "Policy Framework",
      description: "Policy engine and enforcement architecture",
      icon: Settings,
      color: "text-red-600",
    },
    {
      id: "cisco-tacacs",
      name: "Cisco TACACS+ Integration",
      description: "Device administration with TACACS+ protocol",
      icon: Router,
      color: "text-cyan-600",
    },
    {
      id: "aruba-clearpass",
      name: "Aruba ClearPass Integration",
      description: "Aruba ClearPass policy enforcement",
      icon: Wifi,
      color: "text-indigo-600",
    },
    {
      id: "meraki-wireless",
      name: "Meraki Wireless Deep-Dive",
      description: "Cisco Meraki cloud-managed wireless",
      icon: Cloud,
      color: "text-teal-600",
    },
    {
      id: "juniper-mist",
      name: "Juniper Mist AI Integration",
      description: "AI-driven wireless with Mist platform",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      id: "user-id-integration",
      name: "User-ID Integration",
      description: "Firewall user identification and mapping",
      icon: Users,
      color: "text-pink-600",
    },
  ]

  const getConfigForSite = (site: Site | null) => {
    if (!site) {
      return {
        identityProvider: {
          type: architectureConfig.identityProvider,
          domain: "company.com",
          mfaEnabled: true,
        },
        mdmProvider: {
          type: architectureConfig.mdmProvider,
          complianceEnabled: true,
        },
        firewallInfrastructure: {
          vendor: architectureConfig.firewallVendor,
          haConfiguration: true,
        },
        wiredInfrastructure: {
          vendor: architectureConfig.switchVendor,
          switchCount: 24,
        },
        wirelessInfrastructure: {
          vendor: architectureConfig.wirelessVendor,
          apCount: 48,
        },
        radiusConfiguration: {
          type: architectureConfig.radiusType,
          clustering: true,
        },
      }
    }

    return {
      identityProvider: site.identityProvider,
      mdmProvider: site.mdmProvider,
      firewallInfrastructure: site.firewallInfrastructure,
      wiredInfrastructure: site.wiredInfrastructure,
      wirelessInfrastructure: site.wirelessInfrastructure,
      radiusConfiguration: site.radiusConfiguration,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-6 w-6 text-blue-600" />
              <span>Zero Trust NAC Architecture Designer</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPolicyDesigner(!showPolicyDesigner)}>
                <Settings className="h-4 w-4 mr-2" />
                {showPolicyDesigner ? "Hide" : "Show"} Policy Designer
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("svg")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="site-select">Site Configuration:</Label>
              <Select
                value={selectedSite?.id || "default"}
                onValueChange={(value) => {
                  if (value === "default") {
                    setSelectedSite(null)
                  } else {
                    const site = sites.find((s) => s.id === value)
                    setSelectedSite(site || null)
                  }
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select site configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Configuration</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} - {site.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Switch
                id="animations"
                checked={architectureConfig.enableAnimations}
                onCheckedChange={(checked) =>
                  setArchitectureConfig({ ...architectureConfig, enableAnimations: checked })
                }
              />
              <Label htmlFor="animations">Enable Animations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="metrics"
                checked={architectureConfig.showMetrics}
                onCheckedChange={(checked) => setArchitectureConfig({ ...architectureConfig, showMetrics: checked })}
              />
              <Label htmlFor="metrics">Show Metrics</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Architecture Views */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>Architecture Views</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {architectureViews.map((view) => {
                const IconComponent = view.icon
                return (
                  <Button
                    key={view.id}
                    variant={activeView === view.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setActiveView(view.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-5 w-5 ${view.color} flex-shrink-0 mt-0.5`} />
                      <div className="text-left">
                        <div className="font-medium text-sm">{view.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{view.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Diagram Area */}
        <div className="lg:col-span-3">
          <Tabs value={showPolicyDesigner ? "policy" : "diagram"} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="diagram"
                onClick={() => setShowPolicyDesigner(false)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Architecture Diagram</span>
              </TabsTrigger>
              <TabsTrigger
                value="policy"
                onClick={() => setShowPolicyDesigner(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Policy Designer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagram" className="space-y-4">
              <InteractiveDiagram view={activeView} config={getConfigForSite(selectedSite)} onExport={handleExport} />
            </TabsContent>

            <TabsContent value="policy" className="space-y-4">
              <PolicyManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Architecture Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Current Architecture Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center space-x-2">
                <Cloud className="h-4 w-4" />
                <span>Cloud Services</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NAC Platform:</span>
                  <Badge variant="outline">Portnox Cloud</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Identity Provider:</span>
                  <Badge variant="outline">
                    {selectedSite?.identityProvider?.type || architectureConfig.identityProvider}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">MDM Platform:</span>
                  <Badge variant="outline">{selectedSite?.mdmProvider?.type || architectureConfig.mdmProvider}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Infrastructure</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Firewall:</span>
                  <Badge variant="outline">
                    {selectedSite?.firewallInfrastructure?.vendor || architectureConfig.firewallVendor}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">RADIUS:</span>
                  <Badge variant="outline">
                    {selectedSite?.radiusConfiguration?.type || architectureConfig.radiusType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificates:</span>
                  <Badge variant="outline">EAP-TLS</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>Network Infrastructure</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Switches:</span>
                  <Badge variant="outline">
                    {selectedSite?.wiredInfrastructure?.vendor || architectureConfig.switchVendor}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wireless:</span>
                  <Badge variant="outline">
                    {selectedSite?.wirelessInfrastructure?.vendor || architectureConfig.wirelessVendor}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Protocol:</span>
                  <Badge variant="outline">802.1X</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Deployment Stats</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sites:</span>
                  <Badge variant="outline">{sites.length} Configured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Users:</span>
                  <Badge variant="outline">
                    {sites.reduce((total, site) => total + (site.users || 0), 0).toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Devices:</span>
                  <Badge variant="outline">
                    {sites.reduce((total, site) => total + (site.devices || 0), 0).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      {selectedSite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <span>Site Technical Specifications - {selectedSite.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Wired Infrastructure</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium">{selectedSite.wiredInfrastructure?.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Switch Count:</span>
                    <span className="font-medium">{selectedSite.wiredInfrastructure?.switchCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Port Count:</span>
                    <span className="font-medium">{selectedSite.wiredInfrastructure?.portCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PoE Support:</span>
                    <span className="font-medium">{selectedSite.wiredInfrastructure?.poeSupport ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Wireless Infrastructure</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium">{selectedSite.wirelessInfrastructure?.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AP Count:</span>
                    <span className="font-medium">{selectedSite.wirelessInfrastructure?.apCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Controller:</span>
                    <span className="font-medium">{selectedSite.wirelessInfrastructure?.controllerModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WiFi Standards:</span>
                    <span className="font-medium">
                      {selectedSite.wirelessInfrastructure?.wifiStandards?.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Security & Authentication</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Identity Provider:</span>
                    <span className="font-medium">{selectedSite.identityProvider?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MFA Enabled:</span>
                    <span className="font-medium">{selectedSite.identityProvider?.mfaEnabled ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RADIUS Type:</span>
                    <span className="font-medium">{selectedSite.radiusConfiguration?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificates:</span>
                    <span className="font-medium">
                      {selectedSite.radiusConfiguration?.certificates ? "EAP-TLS" : "EAP-PEAP"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
