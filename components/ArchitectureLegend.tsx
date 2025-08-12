"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Cloud,
  Network,
  Server,
  Lock,
  Users,
  Settings,
  Smartphone,
  Globe,
  Eye,
  AlertTriangle,
} from "lucide-react"

interface ArchitectureLegendProps {
  currentView: string
}

export default function ArchitectureLegend({ currentView = "complete" }: ArchitectureLegendProps) {
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

  const vendorInfo = [
    {
      vendor: "cisco",
      label: "Cisco",
      color: "#1BA0D7",
      logo: "🔵",
      description: "Network infrastructure vendor",
    },
    {
      vendor: "aruba",
      label: "Aruba (HPE)",
      color: "#FF6900",
      logo: "🟠",
      description: "Wireless and switching solutions",
    },
    {
      vendor: "fortinet",
      label: "Fortinet",
      color: "#EE3124",
      logo: "🔴",
      description: "Security appliances and SASE",
    },
    {
      vendor: "paloalto",
      label: "Palo Alto Networks",
      color: "#FF6B35",
      logo: "🟠",
      description: "Next-generation security platform",
    },
    {
      vendor: "juniper",
      label: "Juniper Networks",
      color: "#84BD00",
      logo: "🟢",
      description: "Enterprise networking solutions",
    },
    {
      vendor: "extreme",
      label: "Extreme Networks",
      color: "#7B68EE",
      logo: "🟣",
      description: "Cloud-driven networking",
    },
    {
      vendor: "meraki",
      label: "Cisco Meraki",
      color: "#1BA0D7",
      logo: "🔵",
      description: "Cloud-managed networking",
    },
    {
      vendor: "mist",
      label: "Juniper Mist",
      color: "#84BD00",
      logo: "🟢",
      description: "AI-driven wireless",
    },
    {
      vendor: "ubiquiti",
      label: "Ubiquiti",
      color: "#0559C4",
      logo: "🔵",
      description: "Enterprise wireless and routing",
    },
    {
      vendor: "ruckus",
      label: "Ruckus (CommScope)",
      color: "#FF6B35",
      logo: "🟠",
      description: "Wireless networking solutions",
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
          title: "Complete Architecture Components",
          description: "Full end-to-end Zero Trust NAC deployment showing all integrated components and data flows.",
          keyComponents: ["Portnox Cloud", "Network Infrastructure", "Identity Providers", "Policy Engine"],
        }
      case "auth-flow":
        return {
          title: "Authentication Flow Components",
          description: "802.1X authentication sequence showing the complete RADIUS authentication process.",
          keyComponents: ["Supplicant", "Authenticator", "RADIUS Server", "Identity Store"],
        }
      case "pki":
        return {
          title: "PKI Infrastructure Components",
          description: "Certificate-based authentication infrastructure for secure device and user authentication.",
          keyComponents: ["Root CA", "Issuing CA", "Certificate Store", "CRL Distribution"],
        }
      case "policies":
        return {
          title: "Policy Framework Components",
          description: "Dynamic policy engine with user, device, and network-based access controls.",
          keyComponents: ["Policy Engine", "User Policies", "Device Policies", "Network Policies"],
        }
      case "connectivity":
        return {
          title: "Connectivity Options",
          description: "Multi-cloud and hybrid connectivity patterns for distributed NAC deployments.",
          keyComponents: ["SD-WAN", "Cloud Connectors", "VPN Gateways", "Direct Connect"],
        }
      case "intune":
        return {
          title: "Microsoft Intune Integration",
          description: "Device compliance integration with Microsoft Intune for comprehensive device management.",
          keyComponents: ["Intune MDM", "Azure AD", "Compliance Policies", "Device Enrollment"],
        }
      case "jamf":
        return {
          title: "JAMF Pro Integration",
          description: "Apple device management integration with JAMF Pro for macOS and iOS devices.",
          keyComponents: ["JAMF Pro", "Apple Business Manager", "Device Enrollment", "Compliance Engine"],
        }
      case "onboarding":
        return {
          title: "Device Onboarding Workflow",
          description: "Automated device enrollment and certificate provisioning for new devices.",
          keyComponents: ["Captive Portal", "Certificate Authority", "MDM Enrollment", "Policy Assignment"],
        }
      case "fortigate-tacacs":
        return {
          title: "FortiGate TACACS+ Integration",
          description: "Device administration authentication for FortiGate firewalls using TACACS+.",
          keyComponents: ["FortiGate Firewall", "TACACS+ Server", "Active Directory", "Admin Authentication"],
        }
      case "palo-tacacs":
        return {
          title: "Palo Alto TACACS+ Integration",
          description: "Centralized device administration for Palo Alto firewalls and Panorama management.",
          keyComponents: ["Palo Alto Firewall", "Panorama", "TACACS+ Server", "Admin Authentication"],
        }
      case "cisco-tacacs":
        return {
          title: "Cisco TACACS+ Integration",
          description: "Centralized device administration for Cisco network devices using TACACS+.",
          keyComponents: ["Cisco Devices", "TACACS+ Server", "Active Directory", "Admin Authentication"],
        }
      case "aruba-tacacs":
        return {
          title: "Aruba TACACS+ Integration",
          description: "Centralized device administration for Aruba network devices using TACACS+.",
          keyComponents: ["Aruba Devices", "TACACS+ Server", "Active Directory", "Admin Authentication"],
        }
      case "juniper-tacacs":
        return {
          title: "Juniper TACACS+ Integration",
          description: "Centralized device administration for Juniper network devices using TACACS+.",
          keyComponents: ["Juniper Devices", "TACACS+ Server", "Active Directory", "Admin Authentication"],
        }
      case "palo-userid":
        return {
          title: "Palo Alto User-ID Integration",
          description: "User identity mapping for Palo Alto firewalls using syslog-based User-ID integration.",
          keyComponents: ["User-ID Agent", "Syslog Container", "Palo Alto Firewall", "User Mapping"],
        }
      case "fortigate-fsso":
        return {
          title: "FortiGate FSSO Integration",
          description: "Fortinet Single Sign-On integration using syslog for user session tracking.",
          keyComponents: ["FSSO Agent", "Syslog Container", "FortiGate Firewall", "User Sessions"],
        }
      case "meraki-wireless":
        return {
          title: "Cisco Meraki Wireless Integration",
          description: "Cloud-managed wireless infrastructure with Cisco Meraki access points.",
          keyComponents: ["Meraki Dashboard", "Meraki APs", "Cloud RADIUS", "Wireless Policies"],
        }
      case "mist-wireless":
        return {
          title: "Juniper Mist Wireless Integration",
          description: "AI-driven wireless infrastructure with Juniper Mist access points.",
          keyComponents: ["Mist Cloud", "Mist APs", "AI Engine", "Wireless Analytics"],
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

  return (
    <div className="space-y-6">
      {/* View Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>{viewInfo.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{viewInfo.description}</p>
          {viewInfo.keyComponents.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Key Components:</h4>
              <div className="flex flex-wrap gap-2">
                {viewInfo.keyComponents.map((component, index) => (
                  <Badge key={index} variant="outline">
                    {component}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Component Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Component Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {componentTypes.map((component) => (
              <div key={component.type} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: component.color }}
                >
                  {component.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{component.label}</h4>
                  <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {component.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-blue-600" />
            <span>Connection Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectionTypes.map((connection) => (
              <div key={connection.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
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
                  <span className="font-semibold text-sm">{connection.label}</span>
                </div>
                <p className="text-xs text-gray-600">{connection.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Supported Vendors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorInfo.map((vendor) => (
              <div key={vendor.vendor} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="text-2xl">{vendor.logo}</div>
                <div>
                  <h4 className="font-semibold" style={{ color: vendor.color }}>
                    {vendor.label}
                  </h4>
                  <p className="text-sm text-gray-600">{vendor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Implementation Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Start with a pilot deployment in a controlled environment before full rollout</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Ensure proper certificate management and PKI infrastructure before deployment</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Configure backup authentication methods for critical network access</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Implement gradual policy enforcement to minimize user disruption</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Monitor and analyze authentication logs for security insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
