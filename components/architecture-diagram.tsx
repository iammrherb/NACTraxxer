"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Shield, Wifi, Router, Server, Laptop, Monitor, Zap, Activity, Building } from "lucide-react"

interface NetworkNode {
  id: string
  name: string
  type: "cloud" | "server" | "switch" | "ap" | "device" | "security"
  x: number
  y: number
  status: "online" | "offline" | "warning"
  connections: string[]
  details: {
    description: string
    specs?: string[]
    integrations?: string[]
  }
}

interface DataFlow {
  from: string
  to: string
  type: "auth" | "data" | "policy" | "alert"
  active: boolean
}

export function ArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [animationActive, setAnimationActive] = useState(true)
  const [activeFlow, setActiveFlow] = useState(0)

  const nodes: NetworkNode[] = [
    {
      id: "portnox-cloud",
      name: "Portnox Cloud",
      type: "cloud",
      x: 400,
      y: 50,
      status: "online",
      connections: ["radius-server", "policy-engine"],
      details: {
        description: "Centralized NAC management platform",
        specs: ["Multi-tenant SaaS", "Global deployment", "99.9% uptime SLA"],
        integrations: ["Microsoft Entra ID", "JAMF", "Intune", "SIEM platforms"],
      },
    },
    {
      id: "radius-server",
      name: "RADIUS Server",
      type: "server",
      x: 200,
      y: 150,
      status: "online",
      connections: ["meraki-switch", "meraki-ap", "ca-server"],
      details: {
        description: "Authentication server with RADSec support",
        specs: ["RADSec encryption", "High availability", "Load balancing"],
        integrations: ["Active Directory", "Certificate Authority", "MDM platforms"],
      },
    },
    {
      id: "policy-engine",
      name: "Policy Engine",
      type: "security",
      x: 600,
      y: 150,
      status: "online",
      connections: ["entra-id", "intune", "siem"],
      details: {
        description: "Dynamic policy enforcement and decision engine",
        specs: ["Real-time decisions", "ML-based analytics", "Zero Trust policies"],
        integrations: ["Identity providers", "MDM solutions", "Security tools"],
      },
    },
    {
      id: "ca-server",
      name: "Certificate Authority",
      type: "security",
      x: 100,
      y: 250,
      status: "online",
      connections: ["radius-server"],
      details: {
        description: "PKI infrastructure for certificate-based authentication",
        specs: ["Auto-enrollment", "Certificate lifecycle", "CRL/OCSP"],
        integrations: ["Microsoft CA", "OpenSSL", "Third-party CAs"],
      },
    },
    {
      id: "entra-id",
      name: "Microsoft Entra ID",
      type: "cloud",
      x: 700,
      y: 250,
      status: "online",
      connections: ["policy-engine", "intune"],
      details: {
        description: "Cloud identity and access management",
        specs: ["SSO", "MFA", "Conditional Access", "Identity Protection"],
        integrations: ["Office 365", "Azure services", "Third-party apps"],
      },
    },
    {
      id: "intune",
      name: "Microsoft Intune",
      type: "cloud",
      x: 800,
      y: 350,
      status: "online",
      connections: ["entra-id", "policy-engine"],
      details: {
        description: "Mobile device and application management",
        specs: ["Device compliance", "App protection", "Conditional access"],
        integrations: ["Entra ID", "Office 365", "Third-party MDM"],
      },
    },
    {
      id: "meraki-switch",
      name: "Meraki Switch",
      type: "switch",
      x: 300,
      y: 350,
      status: "online",
      connections: ["radius-server", "meraki-ap", "corporate-device"],
      details: {
        description: "Cloud-managed network switch with 802.1X support",
        specs: ["48-port PoE+", "10G uplinks", "Cloud management"],
        integrations: ["Meraki Dashboard", "RADIUS", "SNMP monitoring"],
      },
    },
    {
      id: "meraki-ap",
      name: "Meraki Access Point",
      type: "ap",
      x: 500,
      y: 350,
      status: "online",
      connections: ["meraki-switch", "mobile-device", "byod-device"],
      details: {
        description: "Enterprise wireless access point",
        specs: ["Wi-Fi 6E", "4x4 MIMO", "Cloud management"],
        integrations: ["Meraki Dashboard", "RADIUS", "Guest portal"],
      },
    },
    {
      id: "siem",
      name: "SIEM/SOAR",
      type: "security",
      x: 600,
      y: 50,
      status: "online",
      connections: ["policy-engine"],
      details: {
        description: "Security information and event management",
        specs: ["Real-time monitoring", "Threat detection", "Automated response"],
        integrations: ["Microsoft Sentinel", "Splunk", "QRadar", "LogRhythm"],
      },
    },
    {
      id: "corporate-device",
      name: "Corporate Laptop",
      type: "device",
      x: 200,
      y: 450,
      status: "online",
      connections: ["meraki-switch"],
      details: {
        description: "Managed corporate device with certificates",
        specs: ["Windows 11", "Domain joined", "Intune managed"],
        integrations: ["Active Directory", "Certificate store", "Endpoint protection"],
      },
    },
    {
      id: "mobile-device",
      name: "Mobile Device",
      type: "device",
      x: 400,
      y: 450,
      status: "online",
      connections: ["meraki-ap"],
      details: {
        description: "BYOD mobile device with MDM enrollment",
        specs: ["iOS/Android", "MDM enrolled", "Compliance policies"],
        integrations: ["Intune", "JAMF", "Compliance checking"],
      },
    },
    {
      id: "byod-device",
      name: "BYOD Device",
      type: "device",
      x: 600,
      y: 450,
      status: "warning",
      connections: ["meraki-ap"],
      details: {
        description: "Personal device requiring onboarding",
        specs: ["Various OS", "Self-service onboarding", "Limited access"],
        integrations: ["Guest portal", "Certificate provisioning", "Posture assessment"],
      },
    },
  ]

  const dataFlows: DataFlow[] = [
    { from: "corporate-device", to: "meraki-switch", type: "auth", active: false },
    { from: "meraki-switch", to: "radius-server", type: "auth", active: false },
    { from: "radius-server", to: "ca-server", type: "auth", active: false },
    { from: "radius-server", to: "portnox-cloud", type: "policy", active: false },
    { from: "policy-engine", to: "entra-id", type: "auth", active: false },
    { from: "entra-id", to: "intune", type: "data", active: false },
    { from: "policy-engine", to: "siem", type: "alert", active: false },
    { from: "mobile-device", to: "meraki-ap", type: "auth", active: false },
    { from: "meraki-ap", to: "radius-server", type: "auth", active: false },
  ]

  useEffect(() => {
    if (!animationActive) return

    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % dataFlows.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [animationActive, dataFlows.length])

  const getNodeIcon = (type: string, status: string) => {
    const iconClass = `h-6 w-6 ${
      status === "online" ? "text-green-600" : status === "warning" ? "text-yellow-600" : "text-red-600"
    }`

    switch (type) {
      case "cloud":
        return <Cloud className={iconClass} />
      case "server":
        return <Server className={iconClass} />
      case "switch":
        return <Router className={iconClass} />
      case "ap":
        return <Wifi className={iconClass} />
      case "device":
        return <Laptop className={iconClass} />
      case "security":
        return <Shield className={iconClass} />
      default:
        return <Monitor className={iconClass} />
    }
  }

  const getFlowColor = (type: string) => {
    switch (type) {
      case "auth":
        return "#3b82f6" // blue
      case "data":
        return "#10b981" // green
      case "policy":
        return "#f59e0b" // yellow
      case "alert":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Portnox NAC Architecture</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setAnimationActive(!animationActive)}>
                {animationActive ? (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Pause Animation
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Animation
                  </>
                )}
              </Button>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live Environment
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Network Overview</TabsTrigger>
              <TabsTrigger value="flows">Data Flows</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-[600px] overflow-hidden">
                {/* Background grid */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {nodes.map((node) =>
                    node.connections.map((connectionId) => {
                      const targetNode = nodes.find((n) => n.id === connectionId)
                      if (!targetNode) return null

                      const isActiveFlow =
                        animationActive &&
                        dataFlows[activeFlow] &&
                        ((dataFlows[activeFlow].from === node.id && dataFlows[activeFlow].to === connectionId) ||
                          (dataFlows[activeFlow].to === node.id && dataFlows[activeFlow].from === connectionId))

                      return (
                        <line
                          key={`${node.id}-${connectionId}`}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={isActiveFlow ? getFlowColor(dataFlows[activeFlow]?.type || "data") : "#e5e7eb"}
                          strokeWidth={isActiveFlow ? "3" : "2"}
                          strokeDasharray={isActiveFlow ? "5,5" : "none"}
                          className={isActiveFlow ? "animate-pulse" : ""}
                        />
                      )
                    }),
                  )}

                  {/* Animated data flow indicators */}
                  {animationActive && dataFlows[activeFlow] && (
                    <circle r="4" fill={getFlowColor(dataFlows[activeFlow].type)} className="animate-ping">
                      <animateMotion
                        dur="2s"
                        repeatCount="1"
                        path={(() => {
                          const fromNode = nodes.find((n) => n.id === dataFlows[activeFlow].from)
                          const toNode = nodes.find((n) => n.id === dataFlows[activeFlow].to)
                          if (!fromNode || !toNode) return ""
                          return `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`
                        })()}
                      />
                    </circle>
                  )}
                </svg>

                {/* Network nodes */}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                      selectedNode?.id === node.id ? "scale-110 z-10" : ""
                    }`}
                    style={{ left: node.x, top: node.y }}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  >
                    <div
                      className={`bg-white rounded-lg shadow-lg border-2 p-3 min-w-[120px] text-center ${
                        node.status === "online"
                          ? "border-green-500"
                          : node.status === "warning"
                            ? "border-yellow-500"
                            : "border-red-500"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">{getNodeIcon(node.type, node.status)}</div>
                      <div className="text-xs font-medium text-gray-900">{node.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flows">{/* Data flows content */}</TabsContent>

            <TabsContent value="integrations">{/* Integrations content */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
