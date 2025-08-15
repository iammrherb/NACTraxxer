"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Network,
  Building,
  Users,
  Smartphone,
  Monitor,
  Router,
  Wifi,
  Lock,
  Key,
  Database,
  Cloud,
  Server,
  AlertTriangle,
} from "lucide-react"
import InteractiveDiagram from "./InteractiveDiagram"
import ArchitectureLegend from "./ArchitectureLegend"
import PolicyManagement from "./policy-management"
import { storage, type Site } from "@/lib/storage"

interface ArchitectureDesignerProps {
  onClose?: () => void
}

export default function ArchitectureDesigner({ onClose }: ArchitectureDesignerProps) {
  const [selectedView, setSelectedView] = useState("complete")
  const [selectedVendor, setSelectedVendor] = useState("cisco")
  const [selectedIdp, setSelectedIdp] = useState("azure-ad")
  const [selectedMdm, setSelectedMdm] = useState("intune")
  const [showLegend, setShowLegend] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [showPolicyDesigner, setShowPolicyDesigner] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("all")

  // Architecture views
  const architectureViews = [
    {
      id: "complete",
      name: "Complete Architecture",
      description: "Full Zero Trust NAC architecture with all components",
      icon: <Network className="h-4 w-4" />,
    },
    {
      id: "authentication",
      name: "Authentication Flow",
      description: "User and device authentication workflows",
      icon: <Key className="h-4 w-4" />,
    },
    {
      id: "pki",
      name: "PKI & Certificate Management",
      description: "Certificate lifecycle and PKI infrastructure",
      icon: <Lock className="h-4 w-4" />,
    },
    {
      id: "policies",
      name: "Access Control Policies",
      description: "Policy enforcement and decision points",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "connectivity",
      name: "Connectivity Options",
      description: "Network connectivity and VLAN assignments",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      id: "intune",
      name: "Intune Integration",
      description: "Microsoft Intune MDM integration flows",
      icon: <Cloud className="h-4 w-4" />,
    },
    {
      id: "onboarding",
      name: "Device Onboarding",
      description: "Device enrollment and onboarding scenarios",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment",
      description: "Risk-based policy enforcement and remediation",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "guest-portal",
      name: "Guest & Captive Portal",
      description: "Guest access and captive portal workflows",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "iot-onboarding",
      name: "IoT Device Onboarding",
      description: "IoT device discovery and onboarding",
      icon: <Router className="h-4 w-4" />,
    },
    {
      id: "radsec-proxy",
      name: "RADSEC Proxy Architecture",
      description: "Secure RADIUS over TLS proxy configuration",
      icon: <Server className="h-4 w-4" />,
    },
    {
      id: "tacacs",
      name: "TACACS+ Integration",
      description: "Device administration with TACACS+",
      icon: <Database className="h-4 w-4" />,
    },
  ]

  // Vendor options
  const vendorOptions = [
    { id: "cisco", name: "Cisco", type: "network" },
    { id: "aruba", name: "Aruba", type: "network" },
    { id: "juniper", name: "Juniper", type: "network" },
    { id: "meraki", name: "Cisco Meraki", type: "wireless" },
    { id: "mist", name: "Juniper Mist", type: "wireless" },
    { id: "ruckus", name: "Ruckus", type: "wireless" },
    { id: "ubiquiti", name: "Ubiquiti", type: "wireless" },
  ]

  // Identity Provider options
  const idpOptions = [
    { id: "azure-ad", name: "Azure Active Directory", icon: <Cloud className="h-4 w-4" /> },
    { id: "okta", name: "Okta", icon: <Shield className="h-4 w-4" /> },
    { id: "ping", name: "PingIdentity", icon: <Key className="h-4 w-4" /> },
    { id: "ad", name: "Active Directory", icon: <Building className="h-4 w-4" /> },
    { id: "ldap", name: "LDAP", icon: <Database className="h-4 w-4" /> },
  ]

  // MDM options
  const mdmOptions = [
    { id: "intune", name: "Microsoft Intune", icon: <Cloud className="h-4 w-4" /> },
    { id: "jamf", name: "Jamf Pro", icon: <Monitor className="h-4 w-4" /> },
    { id: "workspace-one", name: "VMware Workspace ONE", icon: <Server className="h-4 w-4" /> },
    { id: "mobileiron", name: "MobileIron", icon: <Smartphone className="h-4 w-4" /> },
  ]

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      const sitesData = await storage.getSites()
      setSites(sitesData || [])
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const handleExportDiagram = (format: "png" | "svg" | "pdf") => {
    toast({
      title: "Export Started",
      description: `Exporting diagram as ${format.toUpperCase()}...`,
    })
    // Implementation would go here
  }

  const handleImportConfiguration = () => {
    toast({
      title: "Import Configuration",
      description: "Configuration import functionality would be implemented here",
    })
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
    toast({
      title: isAnimating ? "Animation Paused" : "Animation Started",
      description: isAnimating ? "Diagram animation has been paused" : "Diagram animation has been started",
    })
  }

  const resetView = () => {
    setZoomLevel(100)
    setAnimationSpeed(1)
    setIsAnimating(false)
    toast({
      title: "View Reset",
      description: "Diagram view has been reset to default settings",
    })
  }

  const handleViewChange = (viewId: string) => {
    setSelectedView(viewId)
    const view = architectureViews.find((v) => v.id === viewId)
    if (view) {
      toast({
        title: "View Changed",
        description: `Switched to ${view.name}`,
      })
    }
  }

  const currentView = architectureViews.find((v) => v.id === selectedView)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-6 w-6 text-blue-600" />
              <span>Zero Trust NAC Architecture Designer</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPolicyDesigner(true)}>
                <Shield className="h-4 w-4 mr-2" />
                Policy Designer
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportDiagram("png")}>
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportDiagram("svg")}>
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportConfiguration}>
                <Upload className="h-4 w-4 mr-2" />
                Import Config
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Architecture View Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Architecture View</Label>
              <Badge variant="outline">{currentView?.name}</Badge>
            </div>
            <Select value={selectedView} onValueChange={handleViewChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select architecture view" />
              </SelectTrigger>
              <SelectContent>
                {architectureViews.map((view) => (
                  <SelectItem key={view.id} value={view.id}>
                    <div className="flex items-center space-x-2">
                      {view.icon}
                      <div>
                        <div className="font-medium">{view.name}</div>
                        <div className="text-xs text-muted-foreground">{view.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Network Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vendorOptions.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Identity Provider</Label>
              <Select value={selectedIdp} onValueChange={setSelectedIdp}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {idpOptions.map((idp) => (
                    <SelectItem key={idp.id} value={idp.id}>
                      <div className="flex items-center space-x-2">
                        {idp.icon}
                        <span>{idp.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">MDM Platform</Label>
              <Select value={selectedMdm} onValueChange={setSelectedMdm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mdmOptions.map((mdm) => (
                    <SelectItem key={mdm.id} value={mdm.id}>
                      <div className="flex items-center space-x-2">
                        {mdm.icon}
                        <span>{mdm.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Site Context</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Display Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Legend</Label>
              <Switch checked={showLegend} onCheckedChange={setShowLegend} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Labels</Label>
              <Switch checked={showLabels} onCheckedChange={setShowLabels} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Connections</Label>
              <Switch checked={showConnections} onCheckedChange={setShowConnections} />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Animation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Animation Speed: {animationSpeed}x</Label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Zoom Level: {zoomLevel}%</Label>
              <Slider
                value={[zoomLevel]}
                onValueChange={(value) => setZoomLevel(value[0])}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button variant="outline" size="sm" onClick={toggleAnimation}>
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? "Pause" : "Play"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Diagram Area */}
      <div className="relative">
        <Card className="min-h-[700px]">
          <CardContent className="p-0 relative">
            <InteractiveDiagram
              view={selectedView}
              vendor={selectedVendor}
              idp={selectedIdp}
              mdm={selectedMdm}
              showLabels={showLabels}
              showConnections={showConnections}
              animationSpeed={animationSpeed}
              isAnimating={isAnimating}
              zoomLevel={zoomLevel}
              theme={selectedTheme}
              siteId={selectedSite}
            />
          </CardContent>
        </Card>

        {/* Legend - Positioned to not overlap */}
        {showLegend && <ArchitectureLegend currentView={selectedView} />}
      </div>

      {/* Policy Designer Modal */}
      {showPolicyDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Policy Designer & Management</span>
                </h2>
                <Button variant="ghost" onClick={() => setShowPolicyDesigner(false)}>
                  ×
                </Button>
              </div>
              <PolicyManagement onClose={() => setShowPolicyDesigner(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
