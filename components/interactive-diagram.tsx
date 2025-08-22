"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
}

export default function InteractiveDiagram({
  view,
  cloudProvider,
  networkVendor,
  connectivityType,
  animationSpeed,
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  // Component definitions for different views
  const getComponents = () => {
    const baseComponents = {
      complete: [
        { id: "user-devices", label: "User Devices", x: 50, y: 100, type: "endpoint" },
        {
          id: "network-switch",
          label: `${networkVendor.charAt(0).toUpperCase() + networkVendor.slice(1)} Switch`,
          x: 200,
          y: 100,
          type: "network",
        },
        { id: "portnox-cloud", label: "Portnox Cloud", x: 400, y: 100, type: "nac" },
        { id: "azure-ad", label: "Azure AD", x: 600, y: 50, type: "identity" },
        { id: "intune", label: "Microsoft Intune", x: 600, y: 150, type: "mdm" },
        { id: "firewall", label: "Firewall", x: 800, y: 100, type: "firewall" },
      ],
      "auth-flow": [
        { id: "supplicant", label: "Supplicant", x: 50, y: 150, type: "endpoint" },
        { id: "authenticator", label: "Authenticator", x: 200, y: 150, type: "network" },
        { id: "radius-server", label: "RADIUS Server", x: 400, y: 150, type: "nac" },
        { id: "identity-store", label: "Identity Store", x: 600, y: 150, type: "identity" },
      ],
      pki: [
        { id: "root-ca", label: "Root CA", x: 300, y: 50, type: "pki" },
        { id: "issuing-ca", label: "Issuing CA", x: 300, y: 150, type: "pki" },
        { id: "cert-store", label: "Certificate Store", x: 500, y: 100, type: "pki" },
        { id: "crl", label: "CRL Distribution", x: 100, y: 100, type: "pki" },
      ],
      intune: [
        { id: "devices", label: "Managed Devices", x: 50, y: 100, type: "endpoint" },
        { id: "intune-mdm", label: "Microsoft Intune", x: 250, y: 100, type: "mdm" },
        { id: "azure-ad-intune", label: "Azure AD", x: 450, y: 50, type: "identity" },
        { id: "portnox-intune", label: "Portnox Cloud", x: 450, y: 150, type: "nac" },
        { id: "compliance", label: "Compliance Policies", x: 650, y: 100, type: "mdm" },
      ],
      jamf: [
        { id: "apple-devices", label: "Apple Devices", x: 50, y: 100, type: "endpoint" },
        { id: "jamf-pro", label: "JAMF Pro", x: 250, y: 100, type: "mdm" },
        { id: "apple-business", label: "Apple Business Manager", x: 450, y: 50, type: "mdm" },
        { id: "portnox-jamf", label: "Portnox Cloud", x: 450, y: 150, type: "nac" },
        { id: "jamf-compliance", label: "Device Compliance", x: 650, y: 100, type: "mdm" },
      ],
    }

    return baseComponents[view as keyof typeof baseComponents] || baseComponents.complete
  }

  // Connection definitions
  const getConnections = () => {
    const baseConnections = {
      complete: [
        { from: "user-devices", to: "network-switch", type: "data" },
        { from: "network-switch", to: "portnox-cloud", type: "radius" },
        { from: "portnox-cloud", to: "azure-ad", type: "ldap" },
        { from: "portnox-cloud", to: "intune", type: "https" },
        { from: "portnox-cloud", to: "firewall", type: "syslog" },
      ],
      "auth-flow": [
        { from: "supplicant", to: "authenticator", type: "radius" },
        { from: "authenticator", to: "radius-server", type: "radius" },
        { from: "radius-server", to: "identity-store", type: "ldap" },
      ],
      intune: [
        { from: "devices", to: "intune-mdm", type: "https" },
        { from: "intune-mdm", to: "azure-ad-intune", type: "https" },
        { from: "intune-mdm", to: "portnox-intune", type: "https" },
        { from: "portnox-intune", to: "compliance", type: "https" },
      ],
      jamf: [
        { from: "apple-devices", to: "jamf-pro", type: "https" },
        { from: "jamf-pro", to: "apple-business", type: "https" },
        { from: "jamf-pro", to: "portnox-jamf", type: "https" },
        { from: "portnox-jamf", to: "jamf-compliance", type: "https" },
      ],
    }

    return baseConnections[view as keyof typeof baseConnections] || baseConnections.complete
  }

  // Component colors based on type
  const getComponentColor = (type: string) => {
    const colors = {
      endpoint: "#4F46E5",
      network: "#059669",
      nac: "#00c8d7",
      identity: "#0078D4",
      mdm: "#7C3AED",
      pki: "#DC2626",
      firewall: "#EA580C",
      cloud: "#0891B2",
    }
    return colors[type as keyof typeof colors] || "#6B7280"
  }

  // Connection colors based on type
  const getConnectionColor = (type: string) => {
    const colors = {
      radius: "#00c8d7",
      https: "#059669",
      ldap: "#0078D4",
      syslog: "#7C3AED",
      tacacs: "#DC2626",
      data: "#6B7280",
    }
    return colors[type as keyof typeof colors] || "#6B7280"
  }

  // Animation functions
  const startAnimation = () => {
    setIsAnimating(true)
    // Add animation logic here
  }

  const stopAnimation = () => {
    setIsAnimating(false)
  }

  const resetDiagram = () => {
    setIsAnimating(false)
    setZoomLevel(1)
    setSelectedComponent(null)
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const components = getComponents()
  const connections = getConnections()

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isAnimating ? stopAnimation : startAnimation}
              className="flex items-center space-x-1 bg-transparent"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAnimating ? "Pause" : "Play"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetDiagram}
              className="flex items-center space-x-1 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Diagram */}
        <Card>
          <CardContent className="p-0">
            <div className="architecture-diagram relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                viewBox="0 0 900 400"
                className="w-full h-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connections */}
                {connections.map((connection, index) => {
                  const fromComponent = components.find((c) => c.id === connection.from)
                  const toComponent = components.find((c) => c.id === connection.to)

                  if (!fromComponent || !toComponent) return null

                  return (
                    <g key={`connection-${index}`}>
                      <line
                        x1={fromComponent.x + 60}
                        y1={fromComponent.y + 30}
                        x2={toComponent.x + 60}
                        y2={toComponent.y + 30}
                        stroke={getConnectionColor(connection.type)}
                        strokeWidth="2"
                        strokeDasharray={connection.type === "https" ? "5,5" : "none"}
                        className="transition-all duration-300"
                      />
                      {/* Connection label */}
                      <text
                        x={(fromComponent.x + toComponent.x) / 2 + 60}
                        y={(fromComponent.y + toComponent.y) / 2 + 25}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                        fontSize="10"
                      >
                        {connection.type.toUpperCase()}
                      </text>
                    </g>
                  )
                })}

                {/* Components */}
                {components.map((component) => (
                  <Tooltip key={component.id}>
                    <TooltipTrigger asChild>
                      <g
                        className="cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <rect
                          x={component.x}
                          y={component.y}
                          width="120"
                          height="60"
                          rx="8"
                          fill={getComponentColor(component.type)}
                          stroke={selectedComponent === component.id ? "#000" : "transparent"}
                          strokeWidth="2"
                          className="drop-shadow-md"
                        />
                        <text
                          x={component.x + 60}
                          y={component.y + 35}
                          textAnchor="middle"
                          className="text-sm font-medium fill-white"
                          fontSize="12"
                        >
                          {component.label}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">{component.label}</p>
                        <p className="text-xs">Type: {component.type}</p>
                        <p className="text-xs">Click for details</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Animation indicators */}
                {isAnimating && (
                  <g>
                    {connections.map((connection, index) => {
                      const fromComponent = components.find((c) => c.id === connection.from)
                      const toComponent = components.find((c) => c.id === connection.to)

                      if (!fromComponent || !toComponent) return null

                      return (
                        <circle
                          key={`animation-${index}`}
                          r="4"
                          fill={getConnectionColor(connection.type)}
                          className="animate-pulse"
                        >
                          <animateMotion
                            dur={`${2 / animationSpeed}s`}
                            repeatCount="indefinite"
                            path={`M${fromComponent.x + 60},${fromComponent.y + 30} L${toComponent.x + 60},${toComponent.y + 30}`}
                          />
                        </circle>
                      )
                    })}
                  </g>
                )}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Component Details */}
        {selectedComponent && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Component Details</h3>
                {(() => {
                  const component = components.find((c) => c.id === selectedComponent)
                  if (!component) return null

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge style={{ backgroundColor: getComponentColor(component.type) }}>{component.type}</Badge>
                        <span className="font-medium">{component.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This component is part of the {view} architecture view and represents a {component.type} in the
                        Zero Trust NAC deployment.
                      </p>
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
