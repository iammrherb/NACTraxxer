"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Cloud,
  Network,
  Server,
  Lock,
  Users,
  Settings,
  Smartphone,
  Eye,
  X,
  Minimize2,
  Maximize2,
  Database,
  Globe,
  Heart,
  Factory,
  ShoppingCart,
  Building2,
} from "lucide-react"
import { useState } from "react"

interface ArchitectureLegendProps {
  currentView: string
  config: any
}

export default function ArchitectureLegend({ currentView, config }: ArchitectureLegendProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const componentTypes = [
    {
      type: "endpoint",
      label: "Endpoints & Devices",
      color: "#3B82F6",
      icon: <Smartphone className="w-4 h-4" />,
      description: "User devices, workstations, and mobile devices",
      examples: ["Corporate Laptops", "BYOD Devices", "IoT Sensors", "Mobile Phones"],
      protocols: ["802.1X", "MAB", "WebAuth"],
    },
    {
      type: "network",
      label: "Network Infrastructure",
      color: "#10B981",
      icon: <Network className="w-4 h-4" />,
      description: "Switches, routers, and wireless infrastructure",
      examples: ["Access Switches", "Distribution Switches", "Wireless Controllers", "Access Points"],
      protocols: ["RADIUS", "SNMP", "802.1X", "CAPWAP"],
    },
    {
      type: "nac",
      label: "NAC Platform",
      color: "#00C8D7",
      icon: <Shield className="w-4 h-4" />,
      description: "Portnox NAC components and services",
      examples: ["Portnox Cloud", "Policy Engine", "Risk Assessment", "Device Profiling"],
      protocols: ["RADIUS", "LDAP", "SAML", "REST API"],
    },
    {
      type: "identity",
      label: "Identity Providers",
      color: "#8B5CF6",
      icon: <Users className="w-4 h-4" />,
      description: "User authentication and directory services",
      examples: ["Azure AD", "Active Directory", "Okta", "LDAP"],
      protocols: ["SAML", "OpenID Connect", "LDAP", "Kerberos"],
    },
    {
      type: "mdm",
      label: "Device Management",
      color: "#F59E0B",
      icon: <Settings className="w-4 h-4" />,
      description: "Mobile device and endpoint management",
      examples: ["Microsoft Intune", "JAMF Pro", "VMware Workspace ONE"],
      protocols: ["HTTPS", "SCEP", "MDM API"],
    },
    {
      type: "firewall",
      label: "Security Appliances",
      color: "#EF4444",
      icon: <Server className="w-4 h-4" />,
      description: "Firewalls and security gateways",
      examples: ["Palo Alto", "Fortinet", "Cisco ASA", "Check Point"],
      protocols: ["User-ID", "Syslog", "SNMP"],
    },
    {
      type: "cloud",
      label: "Cloud Services",
      color: "#06B6D4",
      icon: <Cloud className="w-4 h-4" />,
      description: "Cloud platforms and services",
      examples: ["AWS", "Azure", "Google Cloud", "Hybrid Cloud"],
      protocols: ["HTTPS", "VPN", "ExpressRoute", "Direct Connect"],
    },
    {
      type: "tacacs",
      label: "Device Administration",
      color: "#84CC16",
      icon: <Lock className="w-4 h-4" />,
      description: "Network device administration and authorization",
      examples: ["TACACS+ Server", "Command Authorization", "Privilege Levels"],
      protocols: ["TACACS+", "SSH", "Telnet"],
    },
  ]

  const connectionTypes = [
    {
      type: "ethernet",
      label: "Ethernet",
      color: "#10B981",
      description: "Wired network connections",
      pattern: "solid",
      protocols: ["802.1X", "MAB"],
    },
    {
      type: "wireless",
      label: "Wireless",
      color: "#3B82F6",
      description: "Wi-Fi network connections",
      pattern: "solid",
      protocols: ["802.1X", "PSK", "Open"],
    },
    {
      type: "radius",
      label: "RADIUS",
      color: "#00C8D7",
      description: "Authentication protocol",
      pattern: "solid",
      protocols: ["UDP 1812/1813"],
    },
    {
      type: "radsec",
      label: "RADSEC",
      color: "#6366F1",
      description: "RADIUS over TLS",
      pattern: "solid",
      protocols: ["TCP 2083"],
    },
    {
      type: "identity",
      label: "Identity Integration",
      color: "#8B5CF6",
      description: "User authentication flows",
      pattern: "dashed",
      protocols: ["SAML", "LDAP", "OpenID"],
    },
    {
      type: "api",
      label: "API Integration",
      color: "#F59E0B",
      description: "REST API communications",
      pattern: "dashed",
      protocols: ["HTTPS", "REST"],
    },
    {
      type: "syslog",
      label: "Logging",
      color: "#EF4444",
      description: "System and security logging",
      pattern: "dotted",
      protocols: ["UDP 514", "TCP 514"],
    },
    {
      type: "tacacs",
      label: "TACACS+",
      color: "#84CC16",
      description: "Device administration",
      pattern: "solid",
      protocols: ["TCP 49"],
    },
  ]

  const industrySpecifics = {
    healthcare: {
      icon: <Heart className="w-4 h-4" />,
      name: "Healthcare",
      requirements: [
        "HIPAA Compliance",
        "Medical Device Isolation",
        "Patient Data Protection",
        "Audit Logging",
        "PHI Encryption",
      ],
      zones: [
        { name: "Medical Device Zone", color: "#EF4444", description: "Isolated network for medical equipment" },
        { name: "Patient Network", color: "#F59E0B", description: "Guest network for patients and visitors" },
        { name: "Administrative", color: "#10B981", description: "Staff and administrative systems" },
      ],
    },
    manufacturing: {
      icon: <Factory className="w-4 h-4" />,
      name: "Manufacturing",
      requirements: [
        "OT/IT Convergence",
        "Safety System Protection",
        "Industrial Protocol Support",
        "Asset Tracking",
        "Production Continuity",
      ],
      zones: [
        { name: "OT Network", color: "#A855F7", description: "Operational technology and control systems" },
        { name: "DMZ", color: "#F59E0B", description: "Demilitarized zone for OT/IT integration" },
        { name: "Corporate IT", color: "#10B981", description: "Standard corporate network" },
      ],
    },
    retail: {
      icon: <ShoppingCart className="w-4 h-4" />,
      name: "Retail",
      requirements: [
        "PCI DSS Compliance",
        "Payment Processing Security",
        "Customer Wi-Fi Isolation",
        "Inventory System Protection",
        "Multi-store Management",
      ],
      zones: [
        { name: "PCI Zone", color: "#14B8A6", description: "Payment card industry compliant zone" },
        { name: "Customer Wi-Fi", color: "#3B82F6", description: "Guest network for customers" },
        { name: "Store Operations", color: "#10B981", description: "Inventory and store management" },
      ],
    },
    corporate: {
      icon: <Building2 className="w-4 h-4" />,
      name: "Corporate",
      requirements: [
        "Multi-site Connectivity",
        "Remote Access Security",
        "BYOD Support",
        "Guest Access Management",
        "Compliance Reporting",
      ],
      zones: [
        { name: "Corporate Network", color: "#10B981", description: "Main corporate network" },
        { name: "Guest Network", color: "#3B82F6", description: "Visitor and guest access" },
        { name: "DMZ", color: "#F59E0B", description: "Public-facing services" },
      ],
    },
  }

  const getViewSpecificInfo = () => {
    const viewInfo = {
      complete: {
        title: "Complete Zero Trust Architecture",
        description: "End-to-end NAC deployment with all security layers and components.",
        keyComponents: ["Endpoints", "Network Infrastructure", "NAC Platform", "Identity Services"],
        dataFlows: ["Authentication", "Authorization", "Policy Enforcement", "Monitoring"],
      },
      "multi-site": {
        title: "Multi-Site Enterprise Deployment",
        description: "Centralized management across multiple locations with site-specific policies.",
        keyComponents: ["Headquarters", "Branch Offices", "Data Centers", "Cloud Services"],
        dataFlows: ["Site-to-Site VPN", "Centralized Policy", "Distributed Enforcement"],
      },
      "hybrid-cloud": {
        title: "Hybrid Cloud Architecture",
        description: "Seamless integration between on-premises and cloud infrastructure.",
        keyComponents: ["On-Premises NAC", "Cloud Services", "Hybrid Connectivity", "Policy Sync"],
        dataFlows: ["Cloud Integration", "Data Synchronization", "Hybrid Authentication"],
      },
      "authentication-flow": {
        title: "802.1X Authentication Flow",
        description: "Detailed authentication sequence with EAP methods and certificate validation.",
        keyComponents: ["Supplicant", "Authenticator", "RADIUS Server", "Identity Store"],
        dataFlows: ["EAP Negotiation", "Certificate Exchange", "Policy Decision"],
      },
      "pki-infrastructure": {
        title: "PKI & Certificate Management",
        description: "Complete certificate lifecycle with automated enrollment and validation.",
        keyComponents: ["Root CA", "Issuing CA", "SCEP Server", "Certificate Store"],
        dataFlows: ["Certificate Enrollment", "Validation", "Revocation", "Renewal"],
      },
    }

    return viewInfo[currentView as keyof typeof viewInfo] || viewInfo.complete
  }

  const currentIndustry =
    industrySpecifics[config.industry as keyof typeof industrySpecifics] || industrySpecifics.corporate
  const viewInfo = getViewSpecificInfo()

  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-30">
        <Button variant="outline" size="sm" onClick={() => setIsMinimized(false)} className="bg-white shadow-lg">
          <Eye className="h-4 w-4 mr-2" />
          Show Legend
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isExpanded ? "max-w-none" : "max-w-4xl mx-auto"}`}>
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span>Architecture Legend & Reference</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="industry">Industry</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{viewInfo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{viewInfo.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {viewInfo.keyComponents.map((component, index) => (
                        <Badge key={index} variant="outline">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Current Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry:</span>
                        <span className="font-medium">{currentIndustry.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deployment:</span>
                        <span className="font-medium">{config.deploymentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span className="font-medium">{config.networkType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Identity:</span>
                        <span className="font-medium">{config.identityProvider}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Flows</h4>
                    <div className="space-y-2">
                      {viewInfo.dataFlows.map((flow, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{flow}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Advanced Features</h4>
                    <div className="space-y-2">
                      {config.tacacsEnabled && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Lock className="w-3 h-3 text-green-600" />
                          <span>TACACS+ Device Administration</span>
                        </div>
                      )}
                      {config.radProxyEnabled && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Database className="w-3 h-3 text-blue-600" />
                          <span>RADSEC Proxy (TLS Encryption)</span>
                        </div>
                      )}
                      {config.ztnaEnabled && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Globe className="w-3 h-3 text-purple-600" />
                          <span>Zero Trust Network Access</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {componentTypes.map((component) => (
                  <Card key={component.type} className="p-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className="p-2 rounded-lg text-white flex-shrink-0"
                        style={{ backgroundColor: component.color }}
                      >
                        {component.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{component.label}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{component.description}</p>

                        {isExpanded && (
                          <>
                            <div className="mb-2">
                              <p className="text-xs font-medium mb-1">Examples:</p>
                              <div className="flex flex-wrap gap-1">
                                {component.examples.slice(0, 2).map((example, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium mb-1">Protocols:</p>
                              <div className="flex flex-wrap gap-1">
                                {component.protocols.slice(0, 2).map((protocol, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {protocol}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectionTypes.map((connection) => (
                  <div key={connection.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div
                      className="w-6 h-1 flex-shrink-0"
                      style={{
                        backgroundColor: connection.color,
                        borderStyle:
                          connection.pattern === "dashed"
                            ? "dashed"
                            : connection.pattern === "dotted"
                              ? "dotted"
                              : "solid",
                        borderWidth: connection.pattern !== "solid" ? "1px" : "0",
                        borderColor: connection.color,
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{connection.label}</h4>
                      <p className="text-xs text-muted-foreground">{connection.description}</p>
                      {isExpanded && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {connection.protocols.map((protocol, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {protocol}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="industry" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">{currentIndustry.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{currentIndustry.name} Deployment</h3>
                      <p className="text-sm text-muted-foreground">Industry-specific requirements and configurations</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Requirements</h4>
                    <div className="space-y-2">
                      {currentIndustry.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          <span>{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Network Zones</h4>
                    <div className="space-y-3">
                      {currentIndustry.zones.map((zone, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div
                            className="w-4 h-4 rounded flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: zone.color }}
                          />
                          <div>
                            <h5 className="font-medium text-sm">{zone.name}</h5>
                            <p className="text-xs text-muted-foreground">{zone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
