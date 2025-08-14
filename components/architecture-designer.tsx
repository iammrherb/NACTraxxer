"use client"

import { useState } from "react"
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
  Settings,
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
} from "lucide-react"

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState("complete")
  const [cloudProvider, setCloudProvider] = useState("azure")
  const [networkVendor, setNetworkVendor] = useState("cisco")
  const [connectivityType, setConnectivityType] = useState("sdwan")
  const [identityProvider, setIdentityProvider] = useState("azure-ad")
  const [mdmProvider, setMdmProvider] = useState("intune")
  const [firewallVendor, setFirewallVendor] = useState("palo-alto")
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showLegend, setShowLegend] = useState(true)
  const [showMetrics, setShowMetrics] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState("professional")
  const [simulationMode, setSimulationMode] = useState("normal")
  const [riskLevel, setRiskLevel] = useState("low")

  const architectureViews = [
    {
      id: "complete",
      name: "Complete Architecture",
      icon: <Network className="h-4 w-4" />,
      description: "Full zero trust NAC overview",
    },
    {
      id: "multi-site",
      name: "Multi-Site View",
      icon: <Globe className="h-4 w-4" />,
      description: "Global deployment architecture",
    },
    {
      id: "auth-flow",
      name: "Authentication Flow",
      icon: <Lock className="h-4 w-4" />,
      description: "Step-by-step authentication process",
    },
    {
      id: "pki",
      name: "PKI & Certificates",
      icon: <Shield className="h-4 w-4" />,
      description: "Certificate management infrastructure",
    },
    {
      id: "policy-framework",
      name: "Policy Framework",
      icon: <Settings className="h-4 w-4" />,
      description: "AI-powered policy engine",
    },
    {
      id: "cisco-tacacs",
      name: "Cisco TACACS+",
      icon: <Server className="h-4 w-4" />,
      description: "Device administration control",
    },
    {
      id: "meraki-wireless",
      name: "Meraki Wireless",
      icon: <Wifi className="h-4 w-4" />,
      description: "Cloud-managed wireless",
    },
    {
      id: "intune",
      name: "Intune Integration",
      icon: <Database className="h-4 w-4" />,
      description: "Microsoft Intune MDM",
    },
    {
      id: "policies",
      name: "Access Policies",
      icon: <Users className="h-4 w-4" />,
      description: "Dynamic access control",
    },
    {
      id: "onboarding",
      name: "Device Onboarding",
      icon: <Zap className="h-4 w-4" />,
      description: "Automated device provisioning",
    },
  ]

  const cloudProviders = [
    { id: "azure", name: "Microsoft Azure", color: "#0078d4" },
    { id: "aws", name: "Amazon AWS", color: "#ff9900" },
    { id: "gcp", name: "Google Cloud", color: "#4285f4" },
    { id: "onprem", name: "On-Premises", color: "#6b7280" },
  ]

  const networkVendors = [
    { id: "cisco", name: "Cisco Systems" },
    { id: "aruba", name: "Aruba (HPE)" },
    { id: "juniper", name: "Juniper Networks" },
    { id: "extreme", name: "Extreme Networks" },
    { id: "fortinet", name: "Fortinet" },
  ]

  const connectivityTypes = [
    { id: "sdwan", name: "SD-WAN" },
    { id: "mpls", name: "MPLS" },
    { id: "expressroute", name: "Azure ExpressRoute" },
    { id: "directconnect", name: "AWS Direct Connect" },
    { id: "vpn", name: "Site-to-Site VPN" },
    { id: "internet", name: "Internet" },
  ]

  const identityProviders = [
    { id: "azure-ad", name: "Azure Active Directory" },
    { id: "active-directory", name: "Active Directory" },
    { id: "okta", name: "Okta" },
    { id: "ping", name: "Ping Identity" },
    { id: "ldap", name: "LDAP" },
  ]

  const mdmProviders = [
    { id: "intune", name: "Microsoft Intune" },
    { id: "jamf", name: "Jamf Pro" },
    { id: "workspace-one", name: "VMware Workspace ONE" },
    { id: "mobileiron", name: "Ivanti MobileIron" },
  ]

  const firewallVendors = [
    { id: "palo-alto", name: "Palo Alto Networks" },
    { id: "fortinet", name: "Fortinet" },
    { id: "cisco", name: "Cisco ASA/FTD" },
    { id: "checkpoint", name: "Check Point" },
    { id: "sonicwall", name: "SonicWall" },
  ]

  const simulationModes = [
    { id: "normal", name: "Normal Operation", description: "Standard network operation" },
    { id: "security-breach", name: "Security Breach", description: "Simulate security incident response" },
    { id: "compliance-audit", name: "Compliance Audit", description: "Audit mode with detailed logging" },
    { id: "mass-onboarding", name: "Mass Onboarding", description: "High-volume device enrollment" },
    { id: "disaster-recovery", name: "Disaster Recovery", description: "Failover and recovery scenarios" },
  ]

  const handleExport = async (format: "svg" | "png" | "pdf") => {
    try {
      toast({
        title: "Export Started",
        description: `Generating ${format.toUpperCase()} export...`,
      })

      // The actual export will be handled by the diagram component
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: `Architecture diagram exported as ${format.toUpperCase()}`,
        })
      }, 2000)
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
    toast({
      title: "Simulation Mode Changed",
      description: `Switched to ${simulationModes.find((m) => m.id === mode)?.name} mode`,
    })
  }

  const diagramConfig = {
    identityProvider: {
      type: identityProvider,
      domain: "company.com",
      mfaEnabled: true,
    },
    mdmProvider: {
      type: mdmProvider,
      complianceEnabled: true,
    },
    firewallInfrastructure: {
      vendor: firewallVendor,
      haConfiguration: true,
    },
    wiredInfrastructure: {
      vendor: networkVendor,
      switchCount: 24,
    },
    wirelessInfrastructure: {
      vendor: networkVendor,
      apCount: 48,
    },
    radiusConfiguration: {
      type: "cloud-radius",
      clustering: true,
    },
    portnoxAgent: {
      enabled: true,
      riskAssessment: true,
      behaviorAnalytics: true,
    },
    guestPortal: {
      enabled: true,
      captivePortal: true,
      selfRegistration: true,
    },
    iotOnboarding: {
      enabled: true,
      autoProvisioning: true,
      deviceProfiling: true,
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-6 w-6 text-blue-600" />
                <span>Zero Trust NAC Architecture Designer</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Design, visualize, and simulate your network access control architecture
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live Dashboard
              </Badge>
              <Badge variant="outline">{simulationModes.find((m) => m.id === simulationMode)?.name}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="designer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="designer">Architecture Designer</TabsTrigger>
          <TabsTrigger value="policies">Policy Management</TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="space-y-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Architecture Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* View Selection */}
                <div className="space-y-2">
                  <Label>Architecture View</Label>
                  <Select value={selectedView} onValueChange={setSelectedView}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {architectureViews.map((view) => (
                        <SelectItem key={view.id} value={view.id}>
                          <div className="flex items-center space-x-2">
                            {view.icon}
                            <span>{view.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {architectureViews.find((v) => v.id === selectedView)?.description}
                  </p>
                </div>

                {/* Cloud Provider */}
                <div className="space-y-2">
                  <Label>Cloud Provider</Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Network Vendor */}
                <div className="space-y-2">
                  <Label>Network Vendor</Label>
                  <Select value={networkVendor} onValueChange={setNetworkVendor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networkVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Connectivity */}
                <div className="space-y-2">
                  <Label>Connectivity Type</Label>
                  <Select value={connectivityType} onValueChange={setConnectivityType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {connectivityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Identity Provider */}
                <div className="space-y-2">
                  <Label>Identity Provider</Label>
                  <Select value={identityProvider} onValueChange={setIdentityProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {identityProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* MDM Provider */}
                <div className="space-y-2">
                  <Label>MDM Provider</Label>
                  <Select value={mdmProvider} onValueChange={setMdmProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mdmProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Firewall Vendor */}
                <div className="space-y-2">
                  <Label>Firewall Vendor</Label>
                  <Select value={firewallVendor} onValueChange={setFirewallVendor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {firewallVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Simulation Mode */}
                <div className="space-y-2">
                  <Label>Simulation Mode</Label>
                  <Select value={simulationMode} onValueChange={handleSimulationChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {simulationModes.map((mode) => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {simulationModes.find((m) => m.id === simulationMode)?.description}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isAnimating ? "Pause" : "Play"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAnimationSpeed([1])}>
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Speed:</Label>
                    <div className="w-20">
                      <Slider
                        value={animationSpeed}
                        onValueChange={setAnimationSpeed}
                        max={3}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{animationSpeed[0]}x</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="legend" checked={showLegend} onCheckedChange={setShowLegend} />
                      <Label htmlFor="legend" className="text-sm">
                        Legend
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="metrics" checked={showMetrics} onCheckedChange={setShowMetrics} />
                      <Label htmlFor="metrics" className="text-sm">
                        Metrics
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport("svg")}>
                    <Download className="h-4 w-4 mr-2" />
                    SVG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("png")}>
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Diagram */}
          <Card>
            <CardContent className="p-0">
              <InteractiveDiagram view={selectedView} config={diagramConfig} onExport={handleExport} />
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
