"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, Server, Wifi, Router, Shield, Users, Database, Lock, Activity, Globe, Smartphone } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface ArchitectureNode {
  id: string
  name: string
  type: "cloud" | "server" | "network" | "endpoint" | "security"
  x: number
  y: number
  icon: React.ComponentType<any>
  status: "active" | "inactive" | "warning"
  connections: string[]
}

export function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  const nodes: ArchitectureNode[] = [
    {
      id: "portnox-cloud",
      name: "Portnox Cloud",
      type: "cloud",
      x: 400,
      y: 50,
      icon: Cloud,
      status: "active",
      connections: ["radius-server", "policy-engine", "ca-server"],
    },
    {
      id: "policy-engine",
      name: "Policy Engine",
      type: "cloud",
      x: 300,
      y: 120,
      icon: Shield,
      status: "active",
      connections: ["radius-server"],
    },
    {
      id: "ca-server",
      name: "Certificate Authority",
      type: "cloud",
      x: 500,
      y: 120,
      icon: Lock,
      status: "active",
      connections: ["intune-mdm"],
    },
    {
      id: "radius-server",
      name: "RADIUS Server",
      type: "server",
      x: 400,
      y: 250,
      icon: Server,
      status: "active",
      connections: ["meraki-wireless", "meraki-switch"],
    },
    {
      id: "entra-id",
      name: "Microsoft Entra ID",
      type: "cloud",
      x: 100,
      y: 180,
      icon: Users,
      status: "active",
      connections: ["policy-engine"],
    },
    {
      id: "intune-mdm",
      name: "Microsoft Intune",
      type: "cloud",
      x: 700,
      y: 180,
      icon: Smartphone,
      status: "active",
      connections: ["endpoints"],
    },
    {
      id: "meraki-wireless",
      name: "Meraki Wireless",
      type: "network",
      x: 300,
      y: 350,
      icon: Wifi,
      status: "active",
      connections: ["endpoints"],
    },
    {
      id: "meraki-switch",
      name: "Meraki Switch",
      type: "network",
      x: 500,
      y: 350,
      icon: Router,
      status: "active",
      connections: ["endpoints"],
    },
    {
      id: "endpoints",
      name: "Managed Endpoints",
      type: "endpoint",
      x: 400,
      y: 450,
      icon: Activity,
      status: "active",
      connections: [],
    },
    {
      id: "siem",
      name: "SIEM/SOAR",
      type: "security",
      x: 600,
      y: 300,
      icon: Database,
      status: "active",
      connections: ["radius-server"],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getNodeColor = (node: ArchitectureNode) => {
    if (activeNode === node.id) return "border-blue-500 bg-blue-50"

    switch (node.status) {
      case "active":
        return "border-green-500 bg-green-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      case "inactive":
        return "border-gray-500 bg-gray-50"
      default:
        return "border-gray-300 bg-white"
    }
  }

  const getConnectionPath = (from: ArchitectureNode, to: ArchitectureNode) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const midX = from.x + dx / 2
    const midY = from.y + dy / 2

    return `M ${from.x} ${from.y} Q ${midX} ${midY - 20} ${to.x} ${to.y}`
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = []

    nodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = nodes.find((n) => n.id === connectionId)
        if (targetNode) {
          const isAnimated = animationPhase % 2 === 0
          connections.push(
            <path
              key={`${node.id}-${connectionId}`}
              d={getConnectionPath(node, targetNode)}
              stroke={activeNode === node.id || activeNode === connectionId ? "#3b82f6" : "#6b7280"}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isAnimated ? "5,5" : "none"}
              className={isAnimated ? "animate-pulse" : ""}
            />,
          )
        }
      })
    })

    return connections
  }

  const getNodeDetails = (nodeId: string) => {
    const details: Record<string, any> = {
      "portnox-cloud": {
        description: "Cloud-based NAC platform providing centralized policy management and authentication services",
        features: ["Policy Management", "User Portal", "Analytics", "API Gateway"],
        status: "99.9% Uptime",
      },
      "policy-engine": {
        description: "Intelligent policy engine that makes real-time access control decisions",
        features: ["Dynamic Policies", "Risk Assessment", "Context Awareness", "Machine Learning"],
        status: "Processing 1000+ req/sec",
      },
      "ca-server": {
        description: "Built-in Certificate Authority for issuing and managing digital certificates",
        features: ["Certificate Issuance", "SCEP Support", "CRL/OCSP", "Auto-renewal"],
        status: "5000+ Certificates Managed",
      },
      "radius-server": {
        description: "High-performance RADIUS server with RADSec support",
        features: ["802.1X Authentication", "RADSec", "CoA Support", "Load Balancing"],
        status: "Sub-100ms Response Time",
      },
      "entra-id": {
        description: "Microsoft's cloud-based identity and access management service",
        features: ["Single Sign-On", "Multi-Factor Auth", "Conditional Access", "Identity Protection"],
        status: "50,000+ Users",
      },
      "intune-mdm": {
        description: "Microsoft's mobile device management and mobile application management service",
        features: ["Device Enrollment", "App Management", "Compliance Policies", "Certificate Deployment"],
        status: "10,000+ Devices Managed",
      },
    }

    return details[nodeId] || { description: "Network component", features: [], status: "Active" }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-6 w-6" />
          <span>Portnox NAC Architecture</span>
          <Badge variant="outline" className="ml-auto">
            Interactive Diagram
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* SVG Diagram */}
          <svg
            width="800"
            height="500"
            viewBox="0 0 800 500"
            className="w-full h-auto border rounded-lg bg-gradient-to-br from-blue-50 to-green-50"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Cloud Background */}
            <rect
              x="50"
              y="30"
              width="700"
              height="150"
              rx="20"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="400" y="50" textAnchor="middle" className="text-sm font-semibold fill-blue-600">
              Portnox Cloud Platform
            </text>

            {/* On-Premises Background */}
            <rect
              x="50"
              y="220"
              width="700"
              height="250"
              rx="20"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="400" y="240" textAnchor="middle" className="text-sm font-semibold fill-green-600">
              On-Premises Infrastructure
            </text>

            {/* Connections */}
            {renderConnections()}

            {/* Data Flow Animation */}
            {animationPhase === 1 && (
              <>
                <circle cx="400" cy="250" r="3" fill="#3b82f6" className="animate-ping" />
                <circle cx="300" cy="350" r="3" fill="#10b981" className="animate-ping" />
                <circle cx="500" cy="350" r="3" fill="#10b981" className="animate-ping" />
              </>
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = node.icon
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    className={`cursor-pointer transition-all duration-300 ${getNodeColor(node)} hover:scale-110`}
                    onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  />
                  <foreignObject x={node.x - 12} y={node.y - 12} width="24" height="24">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </foreignObject>
                  <text x={node.x} y={node.y + 45} textAnchor="middle" className="text-xs font-medium fill-gray-700">
                    {node.name}
                  </text>

                  {/* Status Indicator */}
                  <circle
                    cx={node.x + 20}
                    cy={node.y - 20}
                    r="4"
                    fill={node.status === "active" ? "#10b981" : node.status === "warning" ? "#f59e0b" : "#6b7280"}
                    className={node.status === "active" ? "animate-pulse" : ""}
                  />
                </g>
              )
            })}

            {/* Legend */}
            <g transform="translate(50, 480)">
              <circle cx="10" cy="0" r="4" fill="#10b981" className="animate-pulse" />
              <text x="20" y="4" className="text-xs fill-gray-600">
                Active
              </text>

              <circle cx="80" cy="0" r="4" fill="#f59e0b" />
              <text x="90" y="4" className="text-xs fill-gray-600">
                Warning
              </text>

              <circle cx="150" cy="0" r="4" fill="#6b7280" />
              <text x="160" y="4" className="text-xs fill-gray-600">
                Inactive
              </text>
            </g>
          </svg>

          {/* Node Details Panel */}
          {activeNode && (
            <div className="absolute top-4 right-4 w-80 bg-white border rounded-lg shadow-lg p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{nodes.find((n) => n.id === activeNode)?.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveNode(null)}>
                  ×
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">{getNodeDetails(activeNode).description}</p>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {getNodeDetails(activeNode).features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline" className="text-green-600">
                    {getNodeDetails(activeNode).status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Architecture Flow Description */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h4 className="font-semibold">Authentication Flow</h4>
            </div>
            <p className="text-sm text-gray-600">
              Users authenticate via 802.1X using certificates issued by Portnox CA and managed through Intune MDM.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h4 className="font-semibold">Policy Enforcement</h4>
            </div>
            <p className="text-sm text-gray-600">
              Dynamic policies are enforced based on user identity, device posture, and compliance status from Entra ID.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h4 className="font-semibold">Monitoring & Analytics</h4>
            </div>
            <p className="text-sm text-gray-600">
              All authentication events and policy decisions are logged and integrated with SIEM/SOAR platforms.
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
