"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  Server,
  Wifi,
  Router,
  Shield,
  Users,
  Database,
  Lock,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  HardDrive,
  Network,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react"

interface ArchitectureNode {
  id: string
  name: string
  type: "cloud" | "server" | "network" | "endpoint" | "security" | "integration"
  x: number
  y: number
  icon: React.ComponentType<any>
  status: "active" | "inactive" | "warning" | "error"
  connections: string[]
  details: {
    description: string
    features: string[]
    metrics?: {
      label: string
      value: string
      status: "good" | "warning" | "error"
    }[]
  }
}

interface DataFlow {
  id: string
  from: string
  to: string
  type: "authentication" | "policy" | "certificate" | "monitoring"
  animated: boolean
  color: string
}

export function EnhancedArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [activeScenario, setActiveScenario] = useState("overview")
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showDataFlows, setShowDataFlows] = useState(true)

  const scenarios = {
    overview: "Complete Architecture Overview",
    authentication: "Certificate Authentication Flow",
    policy: "Policy Enforcement Flow",
    monitoring: "Monitoring & Analytics Flow",
    remediation: "Remediation & Response Flow",
  }

  const nodes: ArchitectureNode[] = [
    {
      id: "portnox-cloud",
      name: "Portnox Cloud Platform",
      type: "cloud",
      x: 400,
      y: 80,
      icon: Cloud,
      status: "active",
      connections: ["policy-engine", "ca-server", "analytics", "radius-proxy"],
      details: {
        description: "Cloud-based NAC platform providing centralized management and policy orchestration",
        features: ["Multi-tenant Architecture", "Global Policy Management", "Real-time Analytics", "API Gateway"],
        metrics: [
          { label: "Uptime", value: "99.9%", status: "good" },
          { label: "Response Time", value: "< 50ms", status: "good" },
          { label: "Active Policies", value: "156", status: "good" },
        ],
      },
    },
    {
      id: "ca-server",
      name: "Certificate Authority",
      type: "cloud",
      x: 200,
      y: 150,
      icon: Lock,
      status: "active",
      connections: ["intune-mdm", "jamf-mdm"],
      details: {
        description: "Built-in PKI infrastructure for certificate lifecycle management",
        features: ["SCEP Support", "Auto-enrollment", "Certificate Templates", "OCSP Responder"],
        metrics: [
          { label: "Certificates Issued", value: "5,247", status: "good" },
          { label: "Revocation Check", value: "< 100ms", status: "good" },
          { label: "Success Rate", value: "99.8%", status: "good" },
        ],
      },
    },
    {
      id: "policy-engine",
      name: "Policy Engine",
      type: "cloud",
      x: 400,
      y: 150,
      icon: Shield,
      status: "active",
      connections: ["entra-id", "radius-proxy"],
      details: {
        description: "Intelligent policy decision engine with machine learning capabilities",
        features: ["Dynamic Policies", "Risk Assessment", "Context Awareness", "ML-based Decisions"],
        metrics: [
          { label: "Decisions/sec", value: "1,200", status: "good" },
          { label: "Accuracy", value: "97.3%", status: "good" },
          { label: "Policy Rules", value: "89", status: "good" },
        ],
      },
    },
    {
      id: "analytics",
      name: "Analytics Engine",
      type: "cloud",
      x: 600,
      y: 150,
      icon: Activity,
      status: "active",
      connections: ["siem-splunk"],
      details: {
        description: "Advanced analytics and reporting platform with AI-powered insights",
        features: ["Real-time Dashboards", "Predictive Analytics", "Compliance Reporting", "Threat Intelligence"],
        metrics: [
          { label: "Events/day", value: "2.3M", status: "good" },
          { label: "Reports Generated", value: "47", status: "good" },
          { label: "Anomalies Detected", value: "12", status: "warning" },
        ],
      },
    },
    {
      id: "radius-proxy",
      name: "RADIUS Proxy/Server",
      type: "server",
      x: 400,
      y: 280,
      icon: Server,
      status: "active",
      connections: ["meraki-wireless", "meraki-switch", "aruba-switch"],
      details: {
        description: "High-performance RADIUS server with cloud connectivity and local caching",
        features: ["RADSec Support", "Local Caching", "Load Balancing", "Failover"],
        metrics: [
          { label: "Auth Requests", value: "15,432/hr", status: "good" },
          { label: "Response Time", value: "45ms", status: "good" },
          { label: "Success Rate", value: "99.7%", status: "good" },
        ],
      },
    },
    {
      id: "entra-id",
      name: "Microsoft Entra ID",
      type: "integration",
      x: 100,
      y: 220,
      icon: Users,
      status: "active",
      connections: ["intune-mdm"],
      details: {
        description: "Identity provider integration for user authentication and directory services",
        features: ["SSO Integration", "MFA Support", "Conditional Access", "Group Management"],
        metrics: [
          { label: "Active Users", value: "8,547", status: "good" },
          { label: "Auth Success", value: "99.2%", status: "good" },
          { label: "MFA Adoption", value: "94%", status: "good" },
        ],
      },
    },
    {
      id: "intune-mdm",
      name: "Microsoft Intune",
      type: "integration",
      x: 200,
      y: 280,
      icon: Smartphone,
      status: "active",
      connections: ["windows-devices", "ios-devices"],
      details: {
        description: "Mobile device management for Windows and iOS devices",
        features: ["Device Enrollment", "Certificate Deployment", "Compliance Policies", "App Management"],
        metrics: [
          { label: "Managed Devices", value: "3,247", status: "good" },
          { label: "Compliance Rate", value: "96%", status: "good" },
          { label: "Cert Deployment", value: "99.1%", status: "good" },
        ],
      },
    },
    {
      id: "jamf-mdm",
      name: "Jamf Pro",
      type: "integration",
      x: 100,
      y: 350,
      icon: Laptop,
      status: "active",
      connections: ["macos-devices"],
      details: {
        description: "macOS device management and certificate deployment",
        features: ["Device Management", "SCEP Integration", "Policy Enforcement", "Inventory Management"],
        metrics: [
          { label: "Managed Macs", value: "1,156", status: "good" },
          { label: "Compliance", value: "98%", status: "good" },
          { label: "Cert Success", value: "97.8%", status: "warning" },
        ],
      },
    },
    {
      id: "meraki-wireless",
      name: "Meraki Wireless APs",
      type: "network",
      x: 300,
      y: 380,
      icon: Wifi,
      status: "active",
      connections: ["windows-devices", "macos-devices", "ios-devices", "rogue-devices"],
      details: {
        description: "Cisco Meraki wireless access points with 802.1X authentication",
        features: ["WPA2/WPA3 Enterprise", "Dynamic VLAN", "Guest Access", "RF Analytics"],
        metrics: [
          { label: "Active APs", value: "47", status: "good" },
          { label: "Connected Clients", value: "892", status: "good" },
          { label: "Auth Success", value: "98.9%", status: "good" },
        ],
      },
    },
    {
      id: "meraki-switch",
      name: "Meraki Switches",
      type: "network",
      x: 450,
      y: 380,
      icon: Router,
      status: "active",
      connections: ["windows-devices", "macos-devices", "iot-devices"],
      details: {
        description: "Cisco Meraki switches with 802.1X port authentication",
        features: ["Port-based Auth", "Dynamic VLAN", "PoE Management", "Network Segmentation"],
        metrics: [
          { label: "Active Switches", value: "23", status: "good" },
          { label: "Authenticated Ports", value: "456", status: "good" },
          { label: "VLAN Assignments", value: "98.7%", status: "good" },
        ],
      },
    },
    {
      id: "aruba-switch",
      name: "Aruba Switches",
      type: "network",
      x: 600,
      y: 380,
      icon: Network,
      status: "active",
      connections: ["windows-devices", "macos-devices"],
      details: {
        description: "HPE Aruba switches for wired network access control",
        features: ["ClearPass Integration", "Dynamic Segmentation", "Role-based Access", "Network Analytics"],
        metrics: [
          { label: "Active Switches", value: "12", status: "good" },
          { label: "Auth Sessions", value: "234", status: "good" },
          { label: "Policy Compliance", value: "99.1%", status: "good" },
        ],
      },
    },
    {
      id: "siem-splunk",
      name: "SIEM/Splunk",
      type: "security",
      x: 700,
      y: 280,
      icon: Database,
      status: "active",
      connections: [],
      details: {
        description: "Security information and event management platform",
        features: ["Log Aggregation", "Threat Detection", "Incident Response", "Compliance Reporting"],
        metrics: [
          { label: "Events Ingested", value: "2.1M/day", status: "good" },
          { label: "Alerts Generated", value: "23", status: "warning" },
          { label: "Response Time", value: "< 5min", status: "good" },
        ],
      },
    },
    {
      id: "windows-devices",
      name: "Windows Endpoints",
      type: "endpoint",
      x: 250,
      y: 480,
      icon: Monitor,
      status: "active",
      connections: [],
      details: {
        description: "Windows 10/11 managed endpoints with certificate authentication",
        features: ["Domain Joined", "Certificate Auth", "Compliance Monitoring", "Agent-based/Agentless"],
        metrics: [
          { label: "Total Devices", value: "2,847", status: "good" },
          { label: "Online", value: "2,634", status: "good" },
          { label: "Compliant", value: "96.2%", status: "good" },
        ],
      },
    },
    {
      id: "macos-devices",
      name: "macOS Endpoints",
      type: "endpoint",
      x: 400,
      y: 480,
      icon: Laptop,
      status: "active",
      connections: [],
      details: {
        description: "macOS devices managed through Jamf with SCEP certificate deployment",
        features: ["Jamf Managed", "SCEP Certificates", "Compliance Policies", "Agentless Auth"],
        metrics: [
          { label: "Total Devices", value: "1,156", status: "good" },
          { label: "Online", value: "1,089", status: "good" },
          { label: "Cert Deployed", value: "97.8%", status: "warning" },
        ],
      },
    },
    {
      id: "ios-devices",
      name: "iOS Devices",
      type: "endpoint",
      x: 550,
      y: 480,
      icon: Tablet,
      status: "warning",
      connections: [],
      details: {
        description: "iPhone and iPad devices with Intune management and certificate authentication",
        features: ["Intune Managed", "SCEP Certificates", "App Protection", "Conditional Access"],
        metrics: [
          { label: "Total Devices", value: "456", status: "good" },
          { label: "Online", value: "423", status: "good" },
          { label: "SSID Issues", value: "12", status: "error" },
        ],
      },
    },
    {
      id: "iot-devices",
      name: "IoT/Unmanaged Devices",
      type: "endpoint",
      x: 700,
      y: 480,
      icon: HardDrive,
      status: "active",
      connections: [],
      details: {
        description: "IoT devices and unmanaged endpoints using MAB authentication",
        features: ["MAC Authentication", "Device Profiling", "Network Segmentation", "Guest VLAN"],
        metrics: [
          { label: "Total Devices", value: "234", status: "good" },
          { label: "Profiled", value: "89%", status: "good" },
          { label: "Guest VLAN", value: "156", status: "good" },
        ],
      },
    },
    {
      id: "rogue-devices",
      name: "Rogue/Unknown Devices",
      type: "endpoint",
      x: 150,
      y: 480,
      icon: AlertTriangle,
      status: "error",
      connections: [],
      details: {
        description: "Unidentified or rogue devices detected on the network",
        features: ["Automatic Detection", "Quarantine VLAN", "Alert Generation", "Investigation Tools"],
        metrics: [
          { label: "Detected Today", value: "3", status: "warning" },
          { label: "Quarantined", value: "3", status: "good" },
          { label: "Under Review", value: "1", status: "warning" },
        ],
      },
    },
  ]

  const dataFlows: DataFlow[] = [
    {
      id: "auth-flow-1",
      from: "windows-devices",
      to: "meraki-switch",
      type: "authentication",
      animated: true,
      color: "#10b981",
    },
    {
      id: "auth-flow-2",
      from: "meraki-switch",
      to: "radius-proxy",
      type: "authentication",
      animated: true,
      color: "#10b981",
    },
    {
      id: "policy-flow-1",
      from: "radius-proxy",
      to: "policy-engine",
      type: "policy",
      animated: true,
      color: "#3b82f6",
    },
    {
      id: "cert-flow-1",
      from: "ca-server",
      to: "intune-mdm",
      type: "certificate",
      animated: true,
      color: "#f59e0b",
    },
    {
      id: "monitor-flow-1",
      from: "analytics",
      to: "siem-splunk",
      type: "monitoring",
      animated: true,
      color: "#8b5cf6",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getNodeColor = (node: ArchitectureNode) => {
    if (activeNode === node.id) return "border-blue-500 bg-blue-50 shadow-lg scale-110"

    switch (node.status) {
      case "active":
        return "border-green-500 bg-green-50 hover:shadow-md"
      case "warning":
        return "border-yellow-500 bg-yellow-50 hover:shadow-md"
      case "error":
        return "border-red-500 bg-red-50 hover:shadow-md"
      case "inactive":
        return "border-gray-500 bg-gray-50 hover:shadow-md"
      default:
        return "border-gray-300 bg-white hover:shadow-md"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "warning":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span>Enhanced Portnox NAC Architecture</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={showDataFlows ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDataFlows(!showDataFlows)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Data Flows
            </Button>
            <Badge variant="outline">Interactive</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeScenario} onValueChange={setActiveScenario} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(scenarios).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                {label.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative">
          <svg
            width="800"
            height="550"
            viewBox="0 0 800 550"
            className="w-full h-auto border rounded-lg bg-gradient-to-br from-blue-50 via-white to-green-50"
          >
            {/* Background Zones */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.1)" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Cloud Zone */}
            <rect
              x="50"
              y="50"
              width="700"
              height="180"
              rx="20"
              fill="url(#cloudGradient)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="400" y="80" textAnchor="middle" className="text-lg font-semibold fill-blue-600">
              Portnox Cloud Platform
            </text>

            {/* Integration Zone */}
            <rect
              x="50"
              y="250"
              width="300"
              height="150"
              rx="15"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="200" y="280" textAnchor="middle" className="text-sm font-semibold fill-green-600">
              Identity & MDM Integration
            </text>

            {/* Network Infrastructure Zone */}
            <rect
              x="250"
              y="350"
              width="500"
              height="80"
              rx="15"
              fill="rgba(168, 85, 247, 0.1)"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="500" y="380" textAnchor="middle" className="text-sm font-semibold fill-purple-600">
              Network Infrastructure
            </text>

            {/* Endpoint Zone */}
            <rect
              x="100"
              y="450"
              width="650"
              height="80"
              rx="15"
              fill="rgba(245, 158, 11, 0.1)"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="425" y="480" textAnchor="middle" className="text-sm font-semibold fill-amber-600">
              Endpoints & Devices
            </text>

            {/* Data Flow Lines */}
            {showDataFlows &&
              dataFlows.map((flow) => {
                const fromNode = nodes.find((n) => n.id === flow.from)
                const toNode = nodes.find((n) => n.id === flow.to)
                if (!fromNode || !toNode) return null

                return (
                  <g key={flow.id}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={flow.color}
                      strokeWidth="3"
                      strokeDasharray={flow.animated ? "8,4" : "none"}
                      opacity="0.7"
                      className={flow.animated ? "animate-pulse" : ""}
                    />
                    {flow.animated && animationPhase % 2 === 0 && (
                      <circle
                        cx={fromNode.x + (toNode.x - fromNode.x) * 0.5}
                        cy={fromNode.y + (toNode.y - fromNode.y) * 0.5}
                        r="4"
                        fill={flow.color}
                        className="animate-ping"
                      />
                    )}
                  </g>
                )
              })}

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = node.icon
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="35"
                    className={`cursor-pointer transition-all duration-300 ${getNodeColor(node)}`}
                    onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  />
                  <foreignObject x={node.x - 12} y={node.y - 12} width="24" height="24">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </foreignObject>

                  {/* Status indicator */}
                  <foreignObject x={node.x + 20} y={node.y - 25} width="16" height="16">
                    {getStatusIcon(node.status)}
                  </foreignObject>

                  <text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 max-w-20"
                  >
                    {node.name.split(" ").slice(0, 2).join(" ")}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Node Details Panel */}
          {activeNode && (
            <div className="absolute top-4 right-4 w-96 bg-white border rounded-lg shadow-xl p-4 animate-fade-in z-10">
              {(() => {
                const node = nodes.find((n) => n.id === activeNode)
                if (!node) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg flex items-center space-x-2">
                        <node.icon className="h-5 w-5" />
                        <span>{node.name}</span>
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveNode(null)}>
                        ×
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{node.details.description}</p>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {node.details.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {node.details.metrics && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Metrics:</h4>
                          <div className="space-y-2">
                            {node.details.metrics.map((metric, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm">{metric.label}:</span>
                                <Badge
                                  variant={
                                    metric.status === "good"
                                      ? "default"
                                      : metric.status === "warning"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {metric.value}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Active/Healthy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>Warning/Issues</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Error/Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span>Click to Inspect</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
