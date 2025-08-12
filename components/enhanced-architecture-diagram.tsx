"use client"

import { useEffect } from "react"

import { useState } from "react"

import type React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Server,
  Network,
  Users,
  ShieldCheck,
  Database,
  Cloud,
  Laptop,
  Smartphone,
  Wifi,
  ArrowRight,
  Copy,
  ServerCrash,
} from "lucide-react"
import type { ScopingQuestionnaire } from "@/lib/types"

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

const vendorLogos: { [key: string]: string } = {
  cisco: "/logos/cisco.png",
  meraki: "/logos/meraki.png",
  aruba: "/logos/aruba.png",
  juniper: "/logos/juniper.png",
}

const idpLogos: { [key: string]: string } = {
  "entra-id": "/logos/entra-id.png",
  okta: "/logos/okta.png",
  "active-directory": "/logos/active-directory.png",
}

const mdmLogos: { [key: string]: string } = {
  "Microsoft Intune": "/logos/intune.png",
  JAMF: "/logos/jamf.png",
}

const siemLogos: { [key: string]: string } = {
  Splunk: "/logos/splunk.png",
  "Microsoft Sentinel": "/logos/sentinel.png",
}

const DiagramComponent = ({
  icon,
  title,
  subtitle,
  logo,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  logo?: string
}) => (
  <div className="flex flex-col items-center text-center p-3 bg-card rounded-lg border shadow-sm min-w-[120px]">
    {logo ? (
      <Image src={logo || "/placeholder.svg"} alt={`${title} logo`} width={32} height={32} className="mb-2" />
    ) : (
      <div className="mb-2 text-primary">{icon}</div>
    )}
    <p className="font-semibold text-sm">{title}</p>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </div>
)

const Arrow = () => (
  <div className="flex items-center justify-center text-muted-foreground mx-2">
    <ArrowRight size={20} />
  </div>
)

interface EnhancedArchitectureDiagramProps {
  data: ScopingQuestionnaire
}

export function EnhancedArchitectureDiagram({ data }: EnhancedArchitectureDiagramProps) {
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
      icon: ServerCrash,
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
      icon: ShieldCheck,
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
      icon: Database,
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
      icon: Network,
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
      icon: Laptop,
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
      icon: Smartphone,
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
      icon: Laptop,
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
      icon: ServerCrash,
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

  const hasWireless = data.networkVendors.some((v) => v.type === "wireless" || v.type === "both")
  const hasWired = data.networkVendors.some((v) => v.type === "switch" || v.type === "both")
  const hasBYOD = data.byodRequirements.enabled
  const hasGuest = data.guestAccessRequirements.enabled

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
        return <ShieldCheck className="h-3 w-3 text-green-500" />
      case "warning":
        return <ArrowRight className="h-3 w-3 text-yellow-500" />
      case "error":
        return <ServerCrash className="h-3 w-3 text-red-500" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        <CardTitle>Generated Architecture for {data.organizationName}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-8">
          {/* Layer 1: Endpoints */}
          <div className="flex items-center justify-center flex-wrap gap-4">
            <DiagramComponent icon={<Laptop size={32} />} title="Corporate" subtitle="Devices" />
            {hasBYOD && <DiagramComponent icon={<Smartphone size={32} />} title="BYOD" />}
            {hasGuest && <DiagramComponent icon={<Users size={32} />} title="Guests" />}
          </div>

          {/* Layer 2: Network Access */}
          <div className="flex items-center justify-center flex-wrap gap-4">
            {hasWired && <DiagramComponent icon={<Network size={32} />} title="Wired Switches" />}
            {hasWireless && <DiagramComponent icon={<Wifi size={32} />} title="Wireless APs" />}
            {data.networkVendors.map(
              (vendor) =>
                vendorLogos[vendor.name] && (
                  <DiagramComponent
                    key={vendor.name}
                    icon={<div />}
                    title={vendor.name.charAt(0).toUpperCase() + vendor.name.slice(1)}
                    logo={vendorLogos[vendor.name]}
                  />
                ),
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-px bg-border h-8"></div>
          </div>

          {/* Layer 3: Portnox Core */}
          <div className="flex items-center justify-center flex-wrap gap-4 p-4 border-2 border-primary/50 border-dashed rounded-lg bg-primary/5">
            <DiagramComponent icon={<ShieldCheck size={32} />} title="Portnox CLEAR" subtitle="Cloud NAC" />
            {data.highAvailabilityRequired && (
              <DiagramComponent icon={<Copy size={32} />} title="HA Instance" subtitle="Redundancy" />
            )}
            {data.disasterRecoveryRequired && (
              <DiagramComponent icon={<ServerCrash size={32} />} title="DR Site" subtitle="Geo-Redundancy" />
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-px bg-border h-8"></div>
          </div>

          {/* Layer 4: Integrations */}
          <div className="flex items-center justify-center flex-wrap gap-4">
            {data.identityProviders.map(
              (idp) =>
                idpLogos[idp.name] && (
                  <DiagramComponent
                    key={idp.name}
                    icon={<div />}
                    title={idp.type === "on-premises" ? "On-Prem AD" : "Cloud IDP"}
                    logo={idpLogos[idp.name]}
                  />
                ),
            )}
            {data.mdmSolutions.map(
              (mdm) =>
                mdmLogos[mdm.name] && (
                  <DiagramComponent key={mdm.name} icon={<div />} title="MDM" logo={mdmLogos[mdm.name]} />
                ),
            )}
            {data.siemSolutions.map(
              (siem) =>
                siemLogos[siem.name] && (
                  <DiagramComponent key={siem.name} icon={<div />} title="SIEM" logo={siemLogos[siem.name]} />
                ),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
