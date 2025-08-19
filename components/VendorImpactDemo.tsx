"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Network, Wifi, Shield, Zap, TrendingUp, DollarSign, Users, Clock } from "lucide-react"

interface VendorConfig {
  wired: string
  wireless: string
  firewall: string
}

const VENDOR_IMPACTS = {
  cisco: {
    cost: "High",
    complexity: "Medium",
    support: "Excellent",
    integration: "Excellent",
    performance: "High",
    color: "#1BA0D7",
  },
  aruba: {
    cost: "Medium",
    complexity: "Low",
    support: "Good",
    integration: "Good",
    performance: "High",
    color: "#FF6900",
  },
  juniper: {
    cost: "High",
    complexity: "High",
    support: "Good",
    integration: "Good",
    performance: "Very High",
    color: "#84BD00",
  },
  palo_alto: {
    cost: "Very High",
    complexity: "High",
    support: "Excellent",
    integration: "Excellent",
    performance: "Very High",
    color: "#FA582D",
  },
  fortinet: {
    cost: "Medium",
    complexity: "Medium",
    support: "Good",
    integration: "Good",
    performance: "High",
    color: "#EE3124",
  },
}

export default function VendorImpactDemo() {
  const [config, setConfig] = useState<VendorConfig>({
    wired: "cisco",
    wireless: "aruba",
    firewall: "palo_alto",
  })

  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [config])

  const calculateOverallScore = () => {
    const vendors = [config.wired, config.wireless, config.firewall]
    const scores = vendors.map((vendor) => {
      const impact = VENDOR_IMPACTS[vendor as keyof typeof VENDOR_IMPACTS]
      if (!impact) return 0

      let score = 0
      if (impact.performance === "Very High") score += 25
      else if (impact.performance === "High") score += 20
      else score += 15

      if (impact.support === "Excellent") score += 25
      else if (impact.support === "Good") score += 20
      else score += 15

      if (impact.integration === "Excellent") score += 25
      else if (impact.integration === "Good") score += 20
      else score += 15

      if (impact.complexity === "Low") score += 25
      else if (impact.complexity === "Medium") score += 20
      else score += 15

      return score
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / 3)
  }

  const getEstimatedCost = () => {
    const vendors = [config.wired, config.wireless, config.firewall]
    const costs = vendors.map((vendor) => {
      const impact = VENDOR_IMPACTS[vendor as keyof typeof VENDOR_IMPACTS]
      if (!impact) return 100000

      switch (impact.cost) {
        case "Very High":
          return 150000
        case "High":
          return 120000
        case "Medium":
          return 80000
        case "Low":
          return 50000
        default:
          return 100000
      }
    })

    return costs.reduce((a, b) => a + b, 0)
  }

  const getDeploymentTime = () => {
    const vendors = [config.wired, config.wireless, config.firewall]
    const complexities = vendors.map((vendor) => {
      const impact = VENDOR_IMPACTS[vendor as keyof typeof VENDOR_IMPACTS]
      if (!impact) return 4

      switch (impact.complexity) {
        case "Low":
          return 2
        case "Medium":
          return 4
        case "High":
          return 6
        default:
          return 4
      }
    })

    return Math.max(...complexities)
  }

  const testConfigurations = [
    {
      name: "All Cisco",
      config: { wired: "cisco", wireless: "cisco", firewall: "cisco" },
      description: "Single vendor simplicity",
    },
    {
      name: "Best of Breed",
      config: { wired: "juniper", wireless: "aruba", firewall: "palo_alto" },
      description: "Maximum performance",
    },
    {
      name: "Cost Optimized",
      config: { wired: "aruba", wireless: "aruba", firewall: "fortinet" },
      description: "Balanced cost/performance",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Vendor Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {testConfigurations.map((test) => (
              <Button
                key={test.name}
                variant={JSON.stringify(config) === JSON.stringify(test.config) ? "default" : "outline"}
                onClick={() => setConfig(test.config)}
                className="h-auto p-4 flex flex-col items-start"
              >
                <span className="font-medium">{test.name}</span>
                <span className="text-xs text-muted-foreground">{test.description}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" key={animationKey}>
            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Overall Score</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{calculateOverallScore()}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${calculateOverallScore()}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Est. Cost</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">${(getEstimatedCost() / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground mt-1">Infrastructure only</div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Deploy Time</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{getDeploymentTime()} weeks</div>
                <div className="text-xs text-muted-foreground mt-1">Estimated timeline</div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Support Level</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {VENDOR_IMPACTS[config.firewall as keyof typeof VENDOR_IMPACTS]?.support || "Good"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Vendor support quality</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Current Configuration Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(config).map(([category, vendor]) => {
                const impact = VENDOR_IMPACTS[vendor as keyof typeof VENDOR_IMPACTS]
                if (!impact) return null

                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {category === "wired" && <Network className="h-4 w-4" />}
                        {category === "wireless" && <Wifi className="h-4 w-4" />}
                        {category === "firewall" && <Shield className="h-4 w-4" />}
                        <span className="font-medium capitalize">{category}</span>
                        <div className="w-3 h-3 rounded-full ml-auto" style={{ backgroundColor: impact.color }} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Performance:</span>
                          <Badge variant={impact.performance === "Very High" ? "default" : "secondary"}>
                            {impact.performance}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost:</span>
                          <Badge
                            variant={
                              impact.cost === "High" || impact.cost === "Very High" ? "destructive" : "secondary"
                            }
                          >
                            {impact.cost}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Complexity:</span>
                          <Badge variant={impact.complexity === "Low" ? "default" : "secondary"}>
                            {impact.complexity}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Integration:</span>
                          <Badge variant={impact.integration === "Excellent" ? "default" : "secondary"}>
                            {impact.integration}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
