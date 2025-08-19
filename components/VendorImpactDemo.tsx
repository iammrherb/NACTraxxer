"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Network,
  Wifi,
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Settings,
} from "lucide-react"

interface VendorConfig {
  wiredVendor: string
  wirelessVendor: string
  firewallVendor: string
  identityProviders: string[]
  mdmProviders: string[]
  cloudProviders: string[]
}

interface VendorImpactDemoProps {
  onVendorChange: (category: string, vendor: string) => void
  currentConfig: VendorConfig
}

const VENDOR_PRESETS = {
  "cisco-centric": {
    name: "Cisco-Centric",
    description: "Unified Cisco ecosystem with integrated management",
    icon: "🔵",
    config: {
      wiredVendor: "cisco",
      wirelessVendor: "cisco",
      firewallVendor: "cisco",
      identityProviders: ["azure_ad"],
      mdmProviders: ["intune"],
    },
    benefits: ["Single vendor support", "Integrated management", "Consistent CLI"],
    challenges: ["Vendor lock-in", "Higher costs", "Limited flexibility"],
    performance: { score: 92, deployment: 85, cost: 70 },
  },
  "best-of-breed": {
    name: "Best-of-Breed",
    description: "Optimized vendors for each technology domain",
    icon: "🌟",
    config: {
      wiredVendor: "aruba",
      wirelessVendor: "aruba",
      firewallVendor: "palo_alto",
      identityProviders: ["okta"],
      mdmProviders: ["jamf"],
    },
    benefits: ["Specialized expertise", "Advanced features", "Innovation leadership"],
    challenges: ["Complex integration", "Multiple support contracts", "Training overhead"],
    performance: { score: 96, deployment: 75, cost: 65 },
  },
  "cost-optimized": {
    name: "Cost-Optimized",
    description: "Budget-friendly options with solid performance",
    icon: "💰",
    config: {
      wiredVendor: "dell",
      wirelessVendor: "ruckus",
      firewallVendor: "fortinet",
      identityProviders: ["active_directory"],
      mdmProviders: ["mobileiron"],
    },
    benefits: ["Lower acquisition cost", "Competitive pricing", "Good value proposition"],
    challenges: ["Limited advanced features", "Smaller support ecosystem", "Upgrade paths"],
    performance: { score: 82, deployment: 90, cost: 95 },
  },
  "enterprise-grade": {
    name: "Enterprise-Grade",
    description: "Premium solutions for large-scale deployments",
    icon: "🏢",
    config: {
      wiredVendor: "juniper",
      wirelessVendor: "mist",
      firewallVendor: "checkpoint",
      identityProviders: ["ping"],
      mdmProviders: ["workspace_one"],
    },
    benefits: ["Enterprise scalability", "Advanced security", "Comprehensive features"],
    challenges: ["Higher complexity", "Premium pricing", "Specialized skills required"],
    performance: { score: 98, deployment: 70, cost: 60 },
  },
}

const VENDOR_OPTIONS = {
  wired: [
    { value: "cisco", label: "Cisco Systems", color: "#1BA0D7", marketShare: 45, satisfaction: 4.2 },
    { value: "aruba", label: "Aruba (HPE)", color: "#FF6900", marketShare: 25, satisfaction: 4.5 },
    { value: "juniper", label: "Juniper Networks", color: "#84BD00", marketShare: 15, satisfaction: 4.1 },
    { value: "extreme", label: "Extreme Networks", color: "#00A651", marketShare: 8, satisfaction: 3.9 },
    { value: "dell", label: "Dell Technologies", color: "#007DB8", marketShare: 7, satisfaction: 3.8 },
  ],
  wireless: [
    { value: "cisco", label: "Cisco Systems", color: "#1BA0D7", marketShare: 35, satisfaction: 4.1 },
    { value: "aruba", label: "Aruba (HPE)", color: "#FF6900", marketShare: 30, satisfaction: 4.6 },
    { value: "ruckus", label: "Ruckus (CommScope)", color: "#FF6B00", marketShare: 15, satisfaction: 4.3 },
    { value: "meraki", label: "Cisco Meraki", color: "#58C4DC", marketShare: 12, satisfaction: 4.4 },
    { value: "mist", label: "Mist (Juniper)", color: "#41B883", marketShare: 8, satisfaction: 4.7 },
  ],
  firewall: [
    { value: "palo_alto", label: "Palo Alto Networks", color: "#FA582D", marketShare: 28, satisfaction: 4.5 },
    { value: "fortinet", label: "Fortinet", color: "#EE3124", marketShare: 22, satisfaction: 4.2 },
    { value: "checkpoint", label: "Check Point", color: "#FF6B35", marketShare: 18, satisfaction: 4.1 },
    { value: "cisco", label: "Cisco ASA/FTD", color: "#1BA0D7", marketShare: 20, satisfaction: 3.9 },
    { value: "juniper", label: "Juniper SRX", color: "#84BD00", marketShare: 12, satisfaction: 4.0 },
  ],
  identity: [
    { value: "azure_ad", label: "Azure Active Directory", color: "#0078D4", marketShare: 40, satisfaction: 4.3 },
    { value: "okta", label: "Okta", color: "#007DC1", marketShare: 25, satisfaction: 4.6 },
    { value: "ping", label: "Ping Identity", color: "#0066CC", marketShare: 15, satisfaction: 4.2 },
    { value: "active_directory", label: "Active Directory", color: "#0078D4", marketShare: 20, satisfaction: 3.8 },
  ],
  mdm: [
    { value: "intune", label: "Microsoft Intune", color: "#00BCF2", marketShare: 35, satisfaction: 4.1 },
    { value: "jamf", label: "Jamf Pro", color: "#4A90E2", marketShare: 25, satisfaction: 4.7 },
    { value: "workspace_one", label: "VMware Workspace ONE", color: "#607078", marketShare: 20, satisfaction: 4.0 },
    { value: "mobileiron", label: "MobileIron", color: "#0066CC", marketShare: 20, satisfaction: 3.9 },
  ],
}

const IMPACT_METRICS = {
  performance: {
    icon: TrendingUp,
    label: "Performance Score",
    description: "Overall system performance and reliability",
    color: "#10B981",
  },
  deployment: {
    icon: Clock,
    label: "Deployment Speed",
    description: "Time to deploy and configure",
    color: "#3B82F6",
  },
  cost: {
    icon: DollarSign,
    label: "Cost Efficiency",
    description: "Total cost of ownership optimization",
    color: "#F59E0B",
  },
  complexity: {
    icon: Settings,
    label: "Management Complexity",
    description: "Operational complexity and maintenance overhead",
    color: "#8B5CF6",
  },
}

export default function VendorImpactDemo({ onVendorChange, currentConfig }: VendorImpactDemoProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [impactAnalysis, setImpactAnalysis] = useState({
    performance: 85,
    deployment: 80,
    cost: 75,
    complexity: 70,
  })
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    // Calculate impact based on current configuration
    calculateImpact()
  }, [currentConfig])

  const calculateImpact = () => {
    // Simulate impact calculation based on vendor selection
    const wiredVendor = VENDOR_OPTIONS.wired.find((v) => v.value === currentConfig.wiredVendor)
    const wirelessVendor = VENDOR_OPTIONS.wireless.find((v) => v.value === currentConfig.wirelessVendor)
    const firewallVendor = VENDOR_OPTIONS.firewall.find((v) => v.value === currentConfig.firewallVendor)

    const satisfactionValues = [
      wiredVendor?.satisfaction || 4.0,
      wirelessVendor?.satisfaction || 4.0,
      firewallVendor?.satisfaction || 4.0,
    ].filter((val) => !isNaN(val) && val > 0)

    const avgSatisfaction =
      satisfactionValues.length > 0 ? satisfactionValues.reduce((a, b) => a + b, 0) / satisfactionValues.length : 4.0

    const isUnified = currentConfig.wiredVendor === currentConfig.wirelessVendor
    const performanceBonus = isUnified ? 10 : 0
    const complexityPenalty = isUnified ? -15 : 5

    setImpactAnalysis({
      performance: Math.min(100, Math.max(0, Math.round((avgSatisfaction / 5) * 100) + performanceBonus)) || 85,
      deployment: Math.min(100, Math.max(0, Math.round(85 + (Math.random() - 0.5) * 20))) || 80,
      cost: Math.min(100, Math.max(0, Math.round(75 + (Math.random() - 0.5) * 30))) || 75,
      complexity: Math.min(100, Math.max(0, Math.round(70 + complexityPenalty + (Math.random() - 0.5) * 20))) || 70,
    })
  }

  const applyPreset = (presetKey: string) => {
    const preset = VENDOR_PRESETS[presetKey as keyof typeof VENDOR_PRESETS]
    if (preset) {
      setSelectedPreset(presetKey)
      Object.entries(preset.config).forEach(([key, value]) => {
        if (typeof value === "string") {
          onVendorChange(key, value)
        }
      })
    }
  }

  const getVendorInfo = (category: string, vendorValue: string) => {
    const vendors = VENDOR_OPTIONS[category as keyof typeof VENDOR_OPTIONS]
    return vendors?.find((v) => v.value === vendorValue)
  }

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <h3 className="text-sm font-medium mb-3">Quick Configuration Presets</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(VENDOR_PRESETS).map(([key, preset]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPreset === key ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => applyPreset(key)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{preset.name}</h4>
                      <p className="text-xs text-gray-600">{preset.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {preset.performance?.score || 0}% Performance
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Configuration */}
      <div>
        <h3 className="text-sm font-medium mb-3">Current Configuration</h3>
        <div className="space-y-3">
          {/* Wired Vendor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Wired</span>
            </div>
            <Select value={currentConfig.wiredVendor} onValueChange={(value) => onVendorChange("wiredVendor", value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_OPTIONS.wired.map((vendor) => (
                  <SelectItem key={vendor.value} value={vendor.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                      <span className="text-sm">{vendor.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wireless Vendor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Wireless</span>
            </div>
            <Select
              value={currentConfig.wirelessVendor}
              onValueChange={(value) => onVendorChange("wirelessVendor", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_OPTIONS.wireless.map((vendor) => (
                  <SelectItem key={vendor.value} value={vendor.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                      <span className="text-sm">{vendor.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Firewall Vendor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Firewall</span>
            </div>
            <Select
              value={currentConfig.firewallVendor}
              onValueChange={(value) => onVendorChange("firewallVendor", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_OPTIONS.firewall.map((vendor) => (
                  <SelectItem key={vendor.value} value={vendor.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                      <span className="text-sm">{vendor.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Configuration Impact Analysis</h3>
          <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? "Hide" : "Show"} Details
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(IMPACT_METRICS).map(([key, metric]) => {
            const IconComponent = metric.icon
            const value = impactAnalysis[key as keyof typeof impactAnalysis]
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" style={{ color: metric.color }} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <Progress value={isNaN(value) ? 0 : Math.min(100, Math.max(0, value))} className="h-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{metric.description}</span>
                  <span className="font-medium">{isNaN(value) ? "0" : Math.round(value)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Comparison */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendor Comparison Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="network" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="identity">Identity</TabsTrigger>
              </TabsList>

              <TabsContent value="network" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Wired Infrastructure</h4>
                  {VENDOR_OPTIONS.wired.map((vendor) => {
                    const isSelected = vendor.value === currentConfig.wiredVendor
                    return (
                      <div
                        key={vendor.value}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
                          <div>
                            <span className="text-sm font-medium">{vendor.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.marketShare || 0}% Market Share
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {(vendor.satisfaction || 0).toFixed(1)}/5.0
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(vendor.satisfaction || 0) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Wireless Infrastructure</h4>
                  {VENDOR_OPTIONS.wireless.map((vendor) => {
                    const isSelected = vendor.value === currentConfig.wirelessVendor
                    return (
                      <div
                        key={vendor.value}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
                          <div>
                            <span className="text-sm font-medium">{vendor.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.marketShare || 0}% Market Share
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {(vendor.satisfaction || 0).toFixed(1)}/5.0
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(vendor.satisfaction || 0) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Firewall Solutions</h4>
                  {VENDOR_OPTIONS.firewall.map((vendor) => {
                    const isSelected = vendor.value === currentConfig.firewallVendor
                    return (
                      <div
                        key={vendor.value}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
                          <div>
                            <span className="text-sm font-medium">{vendor.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.marketShare || 0}% Market Share
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {(vendor.satisfaction || 0).toFixed(1)}/5.0
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(vendor.satisfaction || 0) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="identity" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Identity Providers</h4>
                  {VENDOR_OPTIONS.identity.map((vendor) => {
                    const isSelected = currentConfig.identityProviders.includes(vendor.value)
                    return (
                      <div
                        key={vendor.value}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
                          <div>
                            <span className="text-sm font-medium">{vendor.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.marketShare || 0}% Market Share
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {(vendor.satisfaction || 0).toFixed(1)}/5.0
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(vendor.satisfaction || 0) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">MDM Solutions</h4>
                  {VENDOR_OPTIONS.mdm.map((vendor) => {
                    const isSelected = currentConfig.mdmProviders.includes(vendor.value)
                    return (
                      <div
                        key={vendor.value}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
                          <div>
                            <span className="text-sm font-medium">{vendor.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.marketShare || 0}% Market Share
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-600">
                                  {(vendor.satisfaction || 0).toFixed(1)}/5.0
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(vendor.satisfaction || 0) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Configuration Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Configuration Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentConfig.wiredVendor === currentConfig.wirelessVendor && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Unified Network Vendor</p>
                  <p className="text-xs text-green-700">
                    Using the same vendor for wired and wireless provides integrated management, consistent policies,
                    and simplified troubleshooting.
                  </p>
                </div>
              </div>
            )}

            {currentConfig.wiredVendor !== currentConfig.wirelessVendor && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Multi-Vendor Network</p>
                  <p className="text-xs text-yellow-700">
                    Different vendors for wired and wireless may require separate management tools and additional
                    integration effort.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Performance Optimization</p>
                <p className="text-xs text-blue-700">
                  Current configuration provides {impactAnalysis.performance}% performance efficiency based on vendor
                  capabilities and integration factors.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
