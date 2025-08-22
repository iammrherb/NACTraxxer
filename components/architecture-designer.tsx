"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import InteractiveDiagram from "./InteractiveDiagram"
import ArchitectureLegend from "./ArchitectureLegend"
import PolicyEditor from "./PolicyEditor"
import {
  Cloud,
  Network,
  Shield,
  Settings,
  Zap,
  Globe,
  Lock,
  Server,
  Smartphone,
  Building2,
  GraduationCap,
  Factory,
  ShoppingCart,
  Landmark,
  Building,
  Layers,
  Download,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState("complete")
  const [cloudProvider, setCloudProvider] = useState("azure")
  const [networkVendor, setNetworkVendor] = useState("cisco")
  const [wirelessVendor, setWirelessVendor] = useState("cisco")
  const [firewallVendor, setFirewallVendor] = useState("palo-alto")
  const [identityProvider, setIdentityProvider] = useState("azure-ad")
  const [mdmProvider, setMdmProvider] = useState("intune")
  const [connectivityType, setConnectivityType] = useState("sdwan")
  const [industry, setIndustry] = useState("corporate")
  const [complianceFramework, setComplianceFramework] = useState("nist")
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [isAnimating, setIsAnimating] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [theme, setTheme] = useState("light")

  const architectureViews = [
    {
      id: "complete",
      label: "Complete Architecture",
      icon: <Layers className="w-4 h-4" />,
      description: "Full end-to-end NAC deployment with all components and data flows",
      category: "overview",
    },
    {
      id: "multi-site",
      label: "Multi-Site Enterprise",
      icon: <Globe className="w-4 h-4" />,
      description: "Enterprise deployment across multiple global locations",
      category: "overview",
    },
    {
      id: "authentication",
      label: "Authentication Flow",
      icon: <Shield className="w-4 h-4" />,
      description: "Detailed 802.1X authentication sequence and RADIUS flow",
      category: "technical",
    },
    {
      id: "pki",
      label: "PKI Infrastructure",
      icon: <Lock className="w-4 h-4" />,
      description: "Certificate authority and PKI certificate lifecycle management",
      category: "technical",
    },
    {
      id: "policies",
      label: "Policy Framework",
      icon: <Settings className="w-4 h-4" />,
      description: "Policy engine and rule management with enforcement points",
      category: "technical",
    },
    {
      id: "connectivity",
      label: "Connectivity Options",
      icon: <Network className="w-4 h-4" />,
      description: "Multi-cloud and network connectivity patterns",
      category: "technical",
    },
    {
      id: "intune",
      label: "Intune Integration",
      icon: <Cloud className="w-4 h-4" />,
      description: "Microsoft Intune MDM integration and certificate deployment",
      category: "integration",
    },
    {
      id: "jamf",
      label: "JAMF Integration",
      icon: <Smartphone className="w-4 h-4" />,
      description: "Apple device management with JAMF Pro integration",
      category: "integration",
    },
    {
      id: "onboarding",
      label: "Device Onboarding",
      icon: <Zap className="w-4 h-4" />,
      description: "Device enrollment and provisioning workflows",
      category: "technical",
    },
    {
      id: "tacacs",
      label: "TACACS+ Integration",
      icon: <Server className="w-4 h-4" />,
      description: "Device administration with TACACS+ authentication",
      category: "integration",
    },
    {
      id: "radsec-proxy",
      label: "RADSEC Proxy",
      icon: <Server className="w-4 h-4" />,
      description: "Secure RADIUS over TLS proxy architecture",
      category: "technical",
    },
    // Industry-Specific Views
    {
      id: "healthcare",
      label: "Healthcare Deployment",
      icon: <Building2 className="w-4 h-4" />,
      description: "Medical device prioritization with HIPAA compliance",
      category: "industry",
    },
    {
      id: "education",
      label: "Education Campus",
      icon: <GraduationCap className="w-4 h-4" />,
      description: "University campus with student BYOD and research networks",
      category: "industry",
    },
    {
      id: "manufacturing",
      label: "Manufacturing Plant",
      icon: <Factory className="w-4 h-4" />,
      description: "Industrial OT/IT convergence with safety-critical systems",
      category: "industry",
    },
    {
      id: "retail",
      label: "Retail Chain",
      icon: <ShoppingCart className="w-4 h-4" />,
      description: "POS systems, customer WiFi, and inventory management",
      category: "industry",
    },
    {
      id: "financial",
      label: "Financial Services",
      icon: <Landmark className="w-4 h-4" />,
      description: "Trading floors, compliance, and zero-trust architecture",
      category: "industry",
    },
    {
      id: "government",
      label: "Government Agency",
      icon: <Building className="w-4 h-4" />,
      description: "Classified networks with FISMA compliance and PIV authentication",
      category: "industry",
    },
  ]

  const cloudProviders = [
    { id: "aws", label: "Amazon Web Services", color: "#FF9900" },
    { id: "azure", label: "Microsoft Azure", color: "#0078D4" },
    { id: "gcp", label: "Google Cloud Platform", color: "#4285F4" },
    { id: "onprem", label: "On-Premises", color: "#6B7280" },
    { id: "hybrid", label: "Hybrid Cloud", color: "#8B5CF6" },
  ]

  const networkVendors = [
    { id: "cisco", label: "Cisco Systems", category: "enterprise" },
    { id: "aruba", label: "Aruba (HPE)", category: "enterprise" },
    { id: "juniper", label: "Juniper Networks", category: "enterprise" },
    { id: "extreme", label: "Extreme Networks", category: "enterprise" },
    { id: "ruckus", label: "Ruckus (CommScope)", category: "enterprise" },
    { id: "fortinet", label: "Fortinet", category: "security" },
    { id: "meraki", label: "Cisco Meraki", category: "cloud" },
    { id: "mist", label: "Juniper Mist", category: "cloud" },
    { id: "ubiquiti", label: "Ubiquiti Networks", category: "smb" },
    { id: "netgear", label: "Netgear", category: "smb" },
    { id: "dlink", label: "D-Link", category: "smb" },
    { id: "tplink", label: "TP-Link", category: "smb" },
    { id: "huawei", label: "Huawei", category: "enterprise" },
    { id: "alcatel", label: "Alcatel-Lucent Enterprise", category: "enterprise" },
    { id: "dell", label: "Dell Technologies", category: "enterprise" },
    { id: "hpe", label: "HPE Networking", category: "enterprise" },
  ]

  const firewallVendors = [
    { id: "palo-alto", label: "Palo Alto Networks" },
    { id: "fortinet", label: "Fortinet FortiGate" },
    { id: "cisco", label: "Cisco ASA/FTD" },
    { id: "juniper", label: "Juniper SRX" },
    { id: "checkpoint", label: "Check Point" },
    { id: "sonicwall", label: "SonicWall" },
    { id: "watchguard", label: "WatchGuard" },
    { id: "sophos", label: "Sophos XG" },
  ]

  const identityProviders = [
    { id: "azure-ad", label: "Azure Active Directory" },
    { id: "okta", label: "Okta" },
    { id: "ping", label: "PingIdentity" },
    { id: "active-directory", label: "Active Directory" },
    { id: "jumpcloud", label: "JumpCloud" },
    { id: "google-workspace", label: "Google Workspace" },
    { id: "aws-sso", label: "AWS SSO" },
    { id: "onelogin", label: "OneLogin" },
  ]

  const mdmProviders = [
    { id: "intune", label: "Microsoft Intune" },
    { id: "jamf", label: "Jamf Pro" },
    { id: "workspace-one", label: "VMware Workspace ONE" },
    { id: "mobileiron", label: "Ivanti MobileIron" },
    { id: "airwatch", label: "VMware AirWatch" },
    { id: "blackberry", label: "BlackBerry UEM" },
    { id: "citrix", label: "Citrix Endpoint Management" },
  ]

  const connectivityOptions = [
    { id: "sdwan", label: "SD-WAN" },
    { id: "expressroute", label: "Azure ExpressRoute" },
    { id: "directconnect", label: "AWS Direct Connect" },
    { id: "mpls", label: "MPLS Network" },
    { id: "vpn", label: "Site-to-Site VPN" },
    { id: "internet", label: "Internet Connection" },
    { id: "fiber", label: "Dedicated Fiber" },
    { id: "satellite", label: "Satellite Connection" },
  ]

  const industries = [
    { id: "corporate", label: "Corporate Enterprise", icon: <Building className="w-4 h-4" /> },
    { id: "healthcare", label: "Healthcare", icon: <Building2 className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "manufacturing", label: "Manufacturing", icon: <Factory className="w-4 h-4" /> },
    { id: "retail", label: "Retail", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "financial", label: "Financial Services", icon: <Landmark className="w-4 h-4" /> },
    { id: "government", label: "Government", icon: <Building className="w-4 h-4" /> },
  ]

  const complianceFrameworks = [
    { id: "nist", label: "NIST Cybersecurity Framework" },
    { id: "iso27001", label: "ISO 27001" },
    { id: "hipaa", label: "HIPAA" },
    { id: "pci-dss", label: "PCI-DSS" },
    { id: "sox", label: "SOX" },
    { id: "fisma", label: "FISMA" },
    { id: "ferpa", label: "FERPA" },
    { id: "gdpr", label: "GDPR" },
  ]

  const currentView = architectureViews.find((view) => view.id === selectedView) || architectureViews[0]

  // Export Functions
  const exportDiagram = async (format: "svg" | "png" | "pdf") => {
    const diagramElement = document.querySelector(".architecture-diagram")
    if (!diagramElement) return

    try {
      if (format === "svg") {
        await exportAsSVG(diagramElement as SVGElement)
      } else if (format === "png") {
        await exportAsPNG(diagramElement as SVGElement)
      } else if (format === "pdf") {
        await exportAsPDF(diagramElement as SVGElement)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const exportAsSVG = async (svgElement: SVGElement) => {
    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute("width", "1400")
    svgClone.setAttribute("height", "1000")
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const svgData = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.svg`)
  }

  const exportAsPNG = async (svgElement: SVGElement) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    canvas.width = 1400
    canvas.height = 1000

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)

    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          ctx!.drawImage(img, 0, 0, 1400, 1000)
          canvas.toBlob((blob) => {
            if (blob) {
              downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.png`)
              resolve()
            } else {
              reject(new Error("Failed to create PNG blob"))
            }
          }, "image/png")
          URL.revokeObjectURL(url)
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = () => reject(new Error("Failed to load SVG image"))
      img.src = url
    })
  }

  const exportAsPDF = async (svgElement: SVGElement) => {
    await exportAsPNG(svgElement)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Zero Trust NAC Architecture Designer</h1>
              <p className="text-sm text-blue-700 font-normal">
                Interactive network access control visualization and planning tool
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Architecture View Selection */}
            <div className="space-y-2">
              <Label htmlFor="view-select" className="text-sm font-semibold text-gray-700">
                Architecture View
              </Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger id="view-select" className="h-10">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {architectureViews.map((view) => (
                    <SelectItem key={view.id} value={view.id}>
                      <div className="flex items-center space-x-2">
                        {view.icon}
                        <span>{view.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cloud Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="cloud-select" className="text-sm font-semibold text-gray-700">
                Cloud Provider
              </Label>
              <Select value={cloudProvider} onValueChange={setCloudProvider}>
                <SelectTrigger id="cloud-select" className="h-10">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {cloudProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                        <span>{provider.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network Vendor Selection */}
            <div className="space-y-2">
              <Label htmlFor="vendor-select" className="text-sm font-semibold text-gray-700">
                Network Vendor
              </Label>
              <Select value={networkVendor} onValueChange={setNetworkVendor}>
                <SelectTrigger id="vendor-select" className="h-10">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {networkVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry Selection */}
            <div className="space-y-2">
              <Label htmlFor="industry-select" className="text-sm font-semibold text-gray-700">
                Industry
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry-select" className="h-10">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      <div className="flex items-center space-x-2">
                        {ind.icon}
                        <span>{ind.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Identity Provider */}
            <div className="space-y-2">
              <Label htmlFor="idp-select" className="text-sm font-semibold text-gray-700">
                Identity Provider
              </Label>
              <Select value={identityProvider} onValueChange={setIdentityProvider}>
                <SelectTrigger id="idp-select" className="h-10">
                  <SelectValue placeholder="Select IDP" />
                </SelectTrigger>
                <SelectContent>
                  {identityProviders.map((idp) => (
                    <SelectItem key={idp.id} value={idp.id}>
                      {idp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MDM Provider */}
            <div className="space-y-2">
              <Label htmlFor="mdm-select" className="text-sm font-semibold text-gray-700">
                MDM Provider
              </Label>
              <Select value={mdmProvider} onValueChange={setMdmProvider}>
                <SelectTrigger id="mdm-select" className="h-10">
                  <SelectValue placeholder="Select MDM" />
                </SelectTrigger>
                <SelectContent>
                  {mdmProviders.map((mdm) => (
                    <SelectItem key={mdm.id} value={mdm.id}>
                      {mdm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Firewall Vendor */}
            <div className="space-y-2">
              <Label htmlFor="firewall-select" className="text-sm font-semibold text-gray-700">
                Firewall Vendor
              </Label>
              <Select value={firewallVendor} onValueChange={setFirewallVendor}>
                <SelectTrigger id="firewall-select" className="h-10">
                  <SelectValue placeholder="Select firewall" />
                </SelectTrigger>
                <SelectContent>
                  {firewallVendors.map((fw) => (
                    <SelectItem key={fw.id} value={fw.id}>
                      {fw.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Connectivity Type */}
            <div className="space-y-2">
              <Label htmlFor="connectivity-select" className="text-sm font-semibold text-gray-700">
                Connectivity
              </Label>
              <Select value={connectivityType} onValueChange={setConnectivityType}>
                <SelectTrigger id="connectivity-select" className="h-10">
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-700">Display Controls</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
                  <Label htmlFor="show-labels" className="text-sm">
                    Labels
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-connections" checked={showConnections} onCheckedChange={setShowConnections} />
                  <Label htmlFor="show-connections" className="text-sm">
                    Connections
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-legend" checked={showLegend} onCheckedChange={setShowLegend} />
                  <Label htmlFor="show-legend" className="text-sm">
                    Legend
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-700">Animation Controls</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isAnimating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="flex items-center space-x-1"
                >
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAnimating ? "Pause" : "Play"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimationSpeed([1])}
                  className="flex items-center space-x-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Label className="text-sm text-gray-600 min-w-fit">Speed: {animationSpeed[0]}x</Label>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={3}
                min={0.5}
                step={0.5}
                className="flex-1"
              />
            </div>
          </div>

          {/* Current View Info */}
          {currentView && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">{currentView.icon}</div>
                <div>
                  <h3 className="font-bold text-blue-900">{currentView.label}</h3>
                  <p className="text-sm text-blue-700">{currentView.description}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="diagram" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="diagram" className="flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>Interactive Diagram</span>
          </TabsTrigger>
          <TabsTrigger value="legend" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Components Legend</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Policy Designer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-4">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">{currentView?.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{currentView?.label}</h2>
                    <p className="text-sm text-gray-600 font-normal">{currentView?.description}</p>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-blue-50 border-blue-200">
                      {cloudProviders.find((p) => p.id === cloudProvider)?.label}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 border-green-200">
                      {networkVendors.find((v) => v.id === networkVendor)?.label}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 border-purple-200">
                      {industries.find((i) => i.id === industry)?.label}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram("svg")}
                      className="flex items-center space-x-1 hover:bg-blue-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>SVG</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram("png")}
                      className="flex items-center space-x-1 hover:bg-green-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>PNG</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDiagram("pdf")}
                      className="flex items-center space-x-1 hover:bg-red-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <InteractiveDiagram
                config={{
                  industry,
                  deployment: "enterprise",
                  connectivity: [connectivityType],
                  wiredVendor: networkVendor,
                  wirelessVendor: networkVendor,
                  firewallVendor,
                  identityProvider: [identityProvider],
                  mdmProvider: [mdmProvider],
                  radiusType: "portnox",
                  deviceAdmin: "portnox",
                  authTypes: ["802.1x", "mac_auth"],
                  deviceTypes: ["windows", "mac", "ios", "android", "iot", "printers"],
                  complianceFrameworks: [complianceFramework],
                  securityFeatures: ["nac", "firewall", "radius"],
                  networkSegmentation: true,
                  guestAccess: true,
                  iotSupport: true,
                  cloudIntegration: true,
                  onPremiseIntegration: true,
                  hybridDeployment: true,
                  animations: isAnimating,
                  showMetrics: true,
                  showConnections: true,
                  animationSpeed: animationSpeed[0],
                  zoomLevel: 1,
                  selectedView,
                  customColors: {
                    primary: "#3b82f6",
                    secondary: "#6b7280",
                    accent: "#10b981"
                  }
                }}
                showControls={true}
                isFullscreen={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legend" className="space-y-4">
          <ArchitectureLegend 
            currentView={selectedView} 
            config={{
              industry,
              deployment: "enterprise",
              connectivity: [connectivityType],
              wiredVendor: networkVendor,
              wirelessVendor: networkVendor,
              firewallVendor,
              identityProvider: [identityProvider],
              mdmProvider: [mdmProvider],
              radiusType: "portnox",
              deviceAdmin: "portnox",
              authTypes: ["802.1x", "mac_auth"],
              deviceTypes: ["windows", "mac", "ios", "android", "iot", "printers"],
              complianceFrameworks: [complianceFramework],
              securityFeatures: ["nac", "firewall", "radius"],
              networkSegmentation: true,
              guestAccess: true,
              iotSupport: true,
              cloudIntegration: true,
              onPremiseIntegration: true,
              hybridDeployment: true,
              animations: isAnimating,
              showMetrics: true,
              showConnections: true,
              animationSpeed: animationSpeed[0],
              zoomLevel: 1,
              selectedView,
              customColors: {
                primary: "#3b82f6",
                secondary: "#6b7280",
                accent: "#10b981"
              }
            }}
          />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <PolicyEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
