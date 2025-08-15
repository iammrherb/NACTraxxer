"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InteractiveDiagram from "./InteractiveDiagram"
import ArchitectureLegend from "./ArchitectureLegend"
import PolicyEditor from "./PolicyEditor"
import {
  Cloud,
  Network,
  Shield,
  Settings,
  Zap,
  GlobeIcon,
  Lock,
  Users,
  Server,
  Download,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState("complete")
  const [cloudProvider, setCloudProvider] = useState("aws")
  const [networkVendor, setNetworkVendor] = useState("cisco")
  const [connectivityType, setConnectivityType] = useState("sdwan")
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [isAnimating, setIsAnimating] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  const architectureViews = [
    {
      id: "complete",
      label: "Complete Architecture",
      icon: <Cloud className="w-4 h-4" />,
      description: "Full end-to-end NAC deployment with all components and data flows",
    },
    {
      id: "multi-site",
      label: "Multi-Site Enterprise",
      icon: <GlobeIcon className="w-4 h-4" />,
      description: "Enterprise deployment across multiple global locations",
    },
    {
      id: "auth-flow",
      label: "Authentication Flow",
      icon: <Shield className="w-4 h-4" />,
      description: "Detailed 802.1X authentication sequence and RADIUS flow",
    },
    {
      id: "pki",
      label: "PKI Infrastructure",
      icon: <Lock className="w-4 h-4" />,
      description: "Certificate authority and PKI certificate lifecycle management",
    },
    {
      id: "policies",
      label: "Policy Framework",
      icon: <Settings className="w-4 h-4" />,
      description: "Policy engine and rule management with enforcement points",
    },
    {
      id: "connectivity",
      label: "Connectivity Options",
      icon: <Network className="w-4 h-4" />,
      description: "Multi-cloud and network connectivity patterns",
    },
    {
      id: "intune",
      label: "Intune Integration",
      icon: <Users className="w-4 h-4" />,
      description: "Microsoft Intune MDM integration and certificate deployment",
    },
    {
      id: "jamf",
      label: "JAMF Integration",
      icon: <Smartphone className="w-4 h-4" />,
      description: "Apple device management with JAMF Pro integration",
    },
    {
      id: "onboarding",
      label: "Device Onboarding",
      icon: <Zap className="w-4 h-4" />,
      description: "Device enrollment and provisioning workflows",
    },
    {
      id: "healthcare",
      label: "Healthcare Deployment",
      icon: <Server className="w-4 h-4" />,
      description: "Medical device prioritization with HIPAA compliance",
    },
    {
      id: "education",
      label: "Education Campus",
      icon: <Server className="w-4 h-4" />,
      description: "University campus with student BYOD and research networks",
    },
    {
      id: "fortigate-tacacs",
      label: "FortiGate TACACS+",
      icon: <Server className="w-4 h-4" />,
      description: "FortiGate device administration with TACACS+",
    },
    {
      id: "palo-tacacs",
      label: "Palo Alto TACACS+",
      icon: <Server className="w-4 h-4" />,
      description: "Palo Alto device administration with TACACS+",
    },
    {
      id: "cisco-tacacs",
      label: "Cisco TACACS+",
      icon: <Server className="w-4 h-4" />,
      description: "Cisco device administration with TACACS+",
    },
    {
      id: "aruba-tacacs",
      label: "Aruba TACACS+",
      icon: <Server className="w-4 h-4" />,
      description: "Aruba device administration with TACACS+",
    },
    {
      id: "juniper-tacacs",
      label: "Juniper TACACS+",
      icon: <Server className="w-4 h-4" />,
      description: "Juniper device administration with TACACS+",
    },
    {
      id: "palo-userid",
      label: "Palo Alto User-ID",
      icon: <Users className="w-4 h-4" />,
      description: "Palo Alto User-ID integration with syslog",
    },
    {
      id: "fortigate-fsso",
      label: "FortiGate FSSO",
      icon: <Users className="w-4 h-4" />,
      description: "FortiGate FSSO integration with syslog",
    },
    {
      id: "meraki-wireless",
      label: "Meraki Wireless",
      icon: <Network className="w-4 h-4" />,
      description: "Cisco Meraki wireless deep-dive integration",
    },
    {
      id: "mist-wireless",
      label: "Mist Wireless",
      icon: <Network className="w-4 h-4" />,
      description: "Juniper Mist wireless deep-dive integration",
    },
  ]

  const cloudProviders = [
    { id: "aws", label: "Amazon Web Services", color: "#FF9900" },
    { id: "azure", label: "Microsoft Azure", color: "#0078D4" },
    { id: "gcp", label: "Google Cloud Platform", color: "#4285F4" },
    { id: "onprem", label: "On-Premises", color: "#6B7280" },
  ]

  const networkVendors = [
    { id: "cisco", label: "Cisco" },
    { id: "aruba", label: "Aruba (HPE)" },
    { id: "juniper", label: "Juniper" },
    { id: "extreme", label: "Extreme Networks" },
    { id: "ruckus", label: "Ruckus (CommScope)" },
    { id: "fortinet", label: "Fortinet" },
    { id: "paloalto", label: "Palo Alto Networks" },
    { id: "meraki", label: "Cisco Meraki" },
    { id: "mist", label: "Juniper Mist" },
    { id: "ubiquiti", label: "Ubiquiti" },
    { id: "netgear", label: "Netgear" },
    { id: "dlink", label: "D-Link" },
    { id: "tplink", label: "TP-Link" },
    { id: "huawei", label: "Huawei" },
    { id: "alcatel", label: "Alcatel-Lucent Enterprise" },
    { id: "dell", label: "Dell Technologies" },
    { id: "hpe", label: "HPE Networking" },
    { id: "brocade", label: "Brocade (Broadcom)" },
  ]

  const connectivityOptions = [
    { id: "sdwan", label: "SD-WAN" },
    { id: "expressroute", label: "Azure Express Route" },
    { id: "directconnect", label: "AWS Direct Connect" },
    { id: "mpls", label: "MPLS Network" },
    { id: "vpn", label: "Site-to-Site VPN" },
    { id: "internet", label: "Internet Connection" },
    { id: "fiber", label: "Dedicated Fiber" },
    { id: "satellite", label: "Satellite Connection" },
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

    const headerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    headerGroup.setAttribute("id", "export-header")

    const headerBg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    headerBg.setAttribute("x", "0")
    headerBg.setAttribute("y", "0")
    headerBg.setAttribute("width", "1400")
    headerBg.setAttribute("height", "80")
    headerBg.setAttribute("fill", "#00c8d7")
    headerGroup.appendChild(headerBg)

    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    titleText.setAttribute("x", "700")
    titleText.setAttribute("y", "35")
    titleText.setAttribute("text-anchor", "middle")
    titleText.setAttribute("fill", "white")
    titleText.setAttribute("font-size", "18")
    titleText.setAttribute("font-weight", "bold")
    titleText.textContent = `Portnox NAC Architecture - ${currentView?.label}`
    headerGroup.appendChild(titleText)

    const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    dateText.setAttribute("x", "700")
    dateText.setAttribute("y", "55")
    dateText.setAttribute("text-anchor", "middle")
    dateText.setAttribute("fill", "white")
    dateText.setAttribute("font-size", "12")
    dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
    headerGroup.appendChild(dateText)

    svgClone.insertBefore(headerGroup, svgClone.firstChild)

    const currentViewBox = svgClone.getAttribute("viewBox") || "0 0 1400 800"
    const viewBoxParts = currentViewBox.split(" ")
    const newViewBox = `0 0 ${viewBoxParts[2]} ${Number.parseInt(viewBoxParts[3]) + 80}`
    svgClone.setAttribute("viewBox", newViewBox)

    const existingContent = svgClone.querySelector("g:not(#export-header)")
    if (existingContent) {
      existingContent.setAttribute("transform", "translate(0, 80)")
    }

    const svgData = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    downloadFile(blob, `portnox-architecture-${selectedView}-${Date.now()}.svg`)
  }

  const exportAsPNG = async (svgElement: SVGElement) => {
    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute("width", "1400")
    svgClone.setAttribute("height", "1000")
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg")

    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    background.setAttribute("x", "0")
    background.setAttribute("y", "0")
    background.setAttribute("width", "1400")
    background.setAttribute("height", "1000")
    background.setAttribute("fill", "white")
    svgClone.insertBefore(background, svgClone.firstChild)

    const headerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    headerGroup.setAttribute("id", "export-header")

    const headerBg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    headerBg.setAttribute("x", "0")
    headerBg.setAttribute("y", "0")
    headerBg.setAttribute("width", "1400")
    headerBg.setAttribute("height", "80")
    headerBg.setAttribute("fill", "#00c8d7")
    headerGroup.appendChild(headerBg)

    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    titleText.setAttribute("x", "700")
    titleText.setAttribute("y", "35")
    titleText.setAttribute("text-anchor", "middle")
    titleText.setAttribute("fill", "white")
    titleText.setAttribute("font-size", "18")
    titleText.setAttribute("font-weight", "bold")
    titleText.textContent = `Portnox NAC Architecture - ${currentView?.label}`
    headerGroup.appendChild(titleText)

    const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    dateText.setAttribute("x", "700")
    dateText.setAttribute("y", "55")
    dateText.setAttribute("text-anchor", "middle")
    dateText.setAttribute("fill", "white")
    dateText.setAttribute("font-size", "12")
    dateText.textContent = `Generated on ${new Date().toLocaleDateString()}`
    headerGroup.appendChild(dateText)

    svgClone.insertBefore(headerGroup, background.nextSibling)

    const existingContent = Array.from(svgClone.children).find(
      (child) => child.tagName !== "rect" && child.getAttribute("id") !== "export-header",
    )
    if (existingContent) {
      existingContent.setAttribute("transform", "translate(0, 80)")
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    canvas.width = 1400
    canvas.height = 1000

    const svgData = new XMLSerializer().serializeToString(svgClone)
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

      img.onerror = () => {
        reject(new Error("Failed to load SVG image"))
      }

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
            <GlobeIcon className="h-8 w-8 text-blue-600" />
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

            {/* Connectivity Type Selection */}
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

          {/* Enhanced Animation Controls */}
          <div className="mt-6 space-y-4">
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
                <Button
                  variant={showLegend ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLegend(!showLegend)}
                >
                  Legend
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
                      {connectivityOptions.find((c) => c.id === connectivityType)?.label}
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
                view={selectedView}
                config={{
                  cloudProvider,
                  networkVendor,
                  connectivityType,
                  identityProvider: "azure-ad",
                  mdmProvider: "intune",
                  firewallVendor: "palo-alto",
                  radiusType: "cisco-ise",
                  pkiProvider: "microsoft-ca",
                  wirelessVendor: "cisco-meraki",
                  deviceTypes: ["windows", "mac", "ios", "android", "iot", "printers", "medical"],
                  byodSupport: true,
                  guestPortal: true,
                }}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed[0]}
                showLegend={showLegend}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legend" className="space-y-4">
          <ArchitectureLegend currentView={selectedView} />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <PolicyEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
