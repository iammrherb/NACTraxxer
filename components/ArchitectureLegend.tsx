"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { useState } from "react"

interface ArchitectureLegendProps {
  currentView: string
  onClose?: () => void
}

export default function ArchitectureLegend({ currentView = "complete", onClose }: ArchitectureLegendProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const componentTypes = [
    {
      type: "endpoint",
      label: "Endpoints",
      color: "#4F46E5",
      icon: <Smartphone className="w-4 h-4" />,
      description: "User devices and endpoints",
      examples: ["Corporate Devices", "BYOD Devices", "IoT Devices"],
    },
    {
      type: "network",
      label: "Network Infrastructure",
      color: "#059669",
      icon: <Network className="w-4 h-4" />,
      description: "Network access layer components",
      examples: ["Switches", "Wireless APs", "Routers"],
    },
    {
      type: "nac",
      label: "NAC Platform",
      color: "#00c8d7",
      icon: <Shield className="w-4 h-4" />,
      description: "Portnox NAC components",
      examples: ["Portnox Cloud", "RADIUS Server", "Policy Engine"],
    },
    {
      type: "identity",
      label: "Identity Providers",
      color: "#0078D4",
      icon: <Users className="w-4 h-4" />,
      description: "User authentication systems",
      examples: ["Azure AD", "Active Directory", "LDAP"],
    },
    {
      type: "mdm",
      label: "Device Management",
      color: "#7C3AED",
      icon: <Settings className="w-4 h-4" />,
      description: "Mobile device management",
      examples: ["Microsoft Intune", "JAMF", "VMware Workspace ONE"],
    },
    {
      type: "pki",
      label: "PKI Infrastructure",
      color: "#DC2626",
      icon: <Lock className="w-4 h-4" />,
      description: "Certificate management",
      examples: ["Certificate Authority", "Certificate Store", "CRL"],
    },
    {
      type: "firewall",
      label: "Security Appliances",
      color: "#EA580C",
      icon: <Server className="w-4 h-4" />,
      description: "Network security devices",
      examples: ["FortiGate", "Palo Alto", "Cisco ASA"],
    },
    {
      type: "cloud",
      label: "Cloud Services",
      color: "#0891B2",
      icon: <Cloud className="w-4 h-4" />,
      description: "Cloud platform services",
      examples: ["AWS", "Azure", "Google Cloud"],
    },
  ]

  const connectionTypes = [
    {
      type: "radius",
      label: "RADIUS",
      color: "#00c8d7",
      description: "Authentication protocol",
      pattern: "solid",
    },
    {
      type: "https",
      label: "HTTPS/REST API",
      color: "#059669",
      description: "Secure web communication",
      pattern: "dashed",
    },
    {
      type: "ldap",
      label: "LDAP/SAML",
      color: "#0078D4",
      description: "Directory services",
      pattern: "dotted",
    },
    {
      type: "syslog",
      label: "Syslog",
      color: "#7C3AED",
      description: "System logging",
      pattern: "solid",
    },
    {
      type: "tacacs",
      label: "TACACS+",
      color: "#DC2626",
      description: "Device administration",
      pattern: "solid",
    },
    {
      type: "data",
      label: "Data Flow",
      color: "#6B7280",
      description: "General data communication",
      pattern: "solid",
    },
  ]

  const getViewSpecificInfo = () => {
    if (!currentView) {
      return {
        title: "Architecture Components",
        description: "Zero Trust NAC architecture components and connections.",
        keyComponents: [],
      }
    }

    switch (currentView.toLowerCase()) {
      case "complete":
        return {
          title: "Complete Architecture",
          description: "Full end-to-end Zero Trust NAC deployment.",
          keyComponents: ["Portnox Cloud", "Network Infrastructure", "Identity Providers"],
        }
      case "authentication":
        return {
          title: "Authentication Flow",
          description: "802.1X authentication sequence.",
          keyComponents: ["Supplicant", "Authenticator", "RADIUS Server"],
        }
      case "pki":
        return {
          title: "PKI Infrastructure",
          description: "Certificate-based authentication infrastructure.",
          keyComponents: ["Root CA", "Issuing CA", "Certificate Store"],
        }
      case "policies":
        return {
          title: "Policy Framework",
          description: "Dynamic policy engine with access controls.",
          keyComponents: ["Policy Engine", "User Policies", "Device Policies"],
        }
      case "connectivity":
        return {
          title: "Connectivity Options",
          description: "Multi-cloud and hybrid connectivity patterns.",
          keyComponents: ["VLANs", "SSIDs", "Network Segmentation"],
        }
      case "intune":
        return {
          title: "Microsoft Intune Integration",
          description: "Device compliance integration with Microsoft Intune.",
          keyComponents: ["Intune MDM", "Azure AD", "Compliance Policies"],
        }
      case "onboarding":
        return {
          title: "Device Onboarding",
          description: "Automated device enrollment and certificate provisioning.",
          keyComponents: ["Captive Portal", "Certificate Authority", "MDM Enrollment"],
        }
      default:
        return {
          title: "Architecture Components",
          description: "Zero Trust NAC architecture components and connections.",
          keyComponents: [],
        }
    }
  }

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
    <div
      className={`fixed top-20 right-4 z-30 ${isExpanded ? "w-96" : "w-80"} max-h-[calc(100vh-6rem)] overflow-hidden`}
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Eye className="h-4 w-4 text-blue-600" />
              <span>Legend</span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-12rem)] space-y-4">
          {/* View Overview */}
          <div>
            <h4 className="font-semibold text-sm mb-2">{viewInfo.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{viewInfo.description}</p>
            {viewInfo.keyComponents.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {viewInfo.keyComponents.map((component, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {component}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Component Types */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Components</h4>
            <div className="space-y-2">
              {componentTypes.slice(0, isExpanded ? componentTypes.length : 4).map((component) => (
                <div key={component.type} className="flex items-center space-x-2 text-xs">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: component.color }}
                  >
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{component.label}</div>
                    {isExpanded && <div className="text-gray-500 text-xs">{component.description}</div>}
                  </div>
                </div>
              ))}
              {!isExpanded && componentTypes.length > 4 && (
                <div className="text-xs text-gray-500 text-center">+{componentTypes.length - 4} more components</div>
              )}
            </div>
          </div>

          {/* Connection Types */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Connections</h4>
            <div className="space-y-1">
              {connectionTypes.slice(0, isExpanded ? connectionTypes.length : 3).map((connection) => (
                <div key={connection.type} className="flex items-center space-x-2 text-xs">
                  <div
                    className="w-4 h-0.5"
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
                  <span className="font-medium">{connection.label}</span>
                </div>
              ))}
              {!isExpanded && connectionTypes.length > 3 && (
                <div className="text-xs text-gray-500 text-center">+{connectionTypes.length - 3} more protocols</div>
              )}
            </div>
          </div>

          {/* Best Practices - Only show when expanded */}
          {isExpanded && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Best Practices</h4>
              <div className="space-y-1">
                <div className="flex items-start space-x-2 text-xs">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Start with pilot deployment</p>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Ensure proper PKI infrastructure</p>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Configure backup authentication</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
