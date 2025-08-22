"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Network,
  Shield,
  Users,
  Server,
  Smartphone,
  Laptop,
  Wifi,
  Lock,
  Key,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react"

interface ArchitectureLegendProps {
  currentView?: string
}

export default function ArchitectureLegend({ currentView = "complete" }: ArchitectureLegendProps) {
  const [activeTab, setActiveTab] = useState("components")

  // Define legend content based on the current architecture view
  const getLegendContent = () => {
    switch (currentView?.toLowerCase()) {
      case "authentication":
        return {
          title: "Authentication Flow Legend",
          components: [
            {
              name: "RADIUS Server",
              description: "Handles authentication requests from network devices",
              icon: <Server className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Identity Provider",
              description: "Source of user identity and group information",
              icon: <Users className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Certificate Authority",
              description: "Issues and validates digital certificates",
              icon: <FileCheck className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Supplicant",
              description: "Client software requesting network access",
              icon: <Laptop className="w-4 h-4 text-gray-600" />,
            },
            {
              name: "Authenticator",
              description: "Network device enforcing access control",
              icon: <Network className="w-4 h-4 text-orange-600" />,
            },
          ],
          methods: [
            {
              name: "802.1X-EAP-TLS",
              description: "Certificate-based mutual authentication",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "802.1X-PEAP",
              description: "Protected EAP with inner authentication",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "MAC Authentication Bypass",
              description: "Fallback for devices that don't support 802.1X",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "Web Authentication",
              description: "Captive portal for guest access",
              color: "bg-purple-100 text-purple-800",
            },
          ],
          protocols: [
            {
              name: "RADIUS",
              description: "UDP 1812/1813 - Authentication and accounting",
              icon: <Shield className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "LDAP/LDAPS",
              description: "TCP 389/636 - Directory service access",
              icon: <Users className="w-4 h-4 text-green-600" />,
            },
            {
              name: "OCSP",
              description: "TCP 80/443 - Certificate validation",
              icon: <FileCheck className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "HTTPS",
              description: "TCP 443 - Secure web communication",
              icon: <Lock className="w-4 h-4 text-red-600" />,
            },
          ],
        }
      case "pki":
        return {
          title: "PKI & Certificate Management Legend",
          components: [
            {
              name: "Root CA",
              description: "Top-level certificate authority",
              icon: <Key className="w-4 h-4 text-red-600" />,
            },
            {
              name: "Intermediate CA",
              description: "Subordinate certificate authority",
              icon: <Key className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "OCSP Responder",
              description: "Real-time certificate validation service",
              icon: <FileCheck className="w-4 h-4 text-green-600" />,
            },
            {
              name: "CRL Distribution Point",
              description: "Certificate revocation list publisher",
              icon: <XCircle className="w-4 h-4 text-red-600" />,
            },
            {
              name: "Certificate Template",
              description: "Predefined certificate configuration",
              icon: <FileCheck className="w-4 h-4 text-blue-600" />,
            },
          ],
          methods: [
            {
              name: "Auto-Enrollment",
              description: "Automatic certificate issuance and renewal",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "SCEP",
              description: "Simple Certificate Enrollment Protocol",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Manual Enrollment",
              description: "Administrator-driven certificate issuance",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "Certificate Chaining",
              description: "Validation through certificate hierarchy",
              color: "bg-yellow-100 text-yellow-800",
            },
          ],
          protocols: [
            {
              name: "OCSP",
              description: "TCP 80/443 - Online Certificate Status Protocol",
              icon: <FileCheck className="w-4 h-4 text-green-600" />,
            },
            {
              name: "SCEP",
              description: "TCP 80/443 - Simple Certificate Enrollment Protocol",
              icon: <Key className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "EST",
              description: "TCP 443 - Enrollment over Secure Transport",
              icon: <Lock className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "CRL",
              description: "TCP 80/443 - Certificate Revocation List",
              icon: <XCircle className="w-4 h-4 text-red-600" />,
            },
          ],
        }
      case "policies":
        return {
          title: "Access Control Policies Legend",
          components: [
            {
              name: "Policy Server",
              description: "Central policy decision point",
              icon: <Shield className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Policy Enforcement Point",
              description: "Network device enforcing policies",
              icon: <Network className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Policy Store",
              description: "Database of access control policies",
              icon: <Server className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Compliance Scanner",
              description: "Evaluates device security posture",
              icon: <FileCheck className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "Remediation Server",
              description: "Helps non-compliant devices meet requirements",
              icon: <Zap className="w-4 h-4 text-red-600" />,
            },
          ],
          methods: [
            {
              name: "Role-Based Access",
              description: "Access based on user role or group",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Device-Based Access",
              description: "Access based on device type or ownership",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "Location-Based Access",
              description: "Access based on network location",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "Time-Based Access",
              description: "Access restricted to specific time periods",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "Posture-Based Access",
              description: "Access based on device security compliance",
              color: "bg-red-100 text-red-800",
            },
          ],
          protocols: [
            {
              name: "RADIUS CoA",
              description: "UDP 3799 - Change of Authorization",
              icon: <Zap className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "SNMP",
              description: "UDP 161/162 - Network monitoring and management",
              icon: <Network className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Syslog",
              description: "UDP 514 - System logging protocol",
              icon: <FileCheck className="w-4 h-4 text-green-600" />,
            },
            {
              name: "HTTPS API",
              description: "TCP 443 - RESTful API communication",
              icon: <Lock className="w-4 h-4 text-purple-600" />,
            },
          ],
        }
      case "connectivity":
        return {
          title: "Connectivity Options Legend",
          components: [
            {
              name: "Wired Switch",
              description: "Ethernet switching infrastructure",
              icon: <Network className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Wireless AP",
              description: "Wireless access point",
              icon: <Wifi className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Wireless Controller",
              description: "Centralized wireless management",
              icon: <Server className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "VPN Gateway",
              description: "Remote access VPN termination",
              icon: <Lock className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "Firewall",
              description: "Network security boundary",
              icon: <Shield className="w-4 h-4 text-red-600" />,
            },
          ],
          methods: [
            {
              name: "Wired 802.1X",
              description: "Port-based network access control",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Wireless 802.1X",
              description: "Secure wireless authentication",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "VPN Authentication",
              description: "Remote access authentication",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "Guest Network",
              description: "Limited access for visitors",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "IoT Network",
              description: "Segmented network for IoT devices",
              color: "bg-red-100 text-red-800",
            },
          ],
          protocols: [
            {
              name: "802.1X",
              description: "Port-based Network Access Control",
              icon: <Lock className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "RADIUS",
              description: "UDP 1812/1813 - Authentication and accounting",
              icon: <Shield className="w-4 h-4 text-green-600" />,
            },
            {
              name: "TACACS+",
              description: "TCP 49 - Device administration",
              icon: <Users className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "SNMP",
              description: "UDP 161/162 - Network monitoring and management",
              icon: <Network className="w-4 h-4 text-orange-600" />,
            },
          ],
        }
      case "intune":
        return {
          title: "Intune Integration Legend",
          components: [
            {
              name: "Intune Service",
              description: "Cloud-based MDM platform",
              icon: <Server className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Company Portal",
              description: "Self-service app for device enrollment",
              icon: <Smartphone className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Conditional Access",
              description: "Policy-based access control",
              icon: <Shield className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Compliance Policy",
              description: "Device security requirements",
              icon: <FileCheck className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "Configuration Profile",
              description: "Device settings management",
              icon: <Laptop className="w-4 h-4 text-red-600" />,
            },
          ],
          methods: [
            {
              name: "MDM Enrollment",
              description: "Mobile Device Management enrollment",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Certificate Deployment",
              description: "Automatic certificate provisioning",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "App Protection",
              description: "Mobile application management",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "Compliance Checking",
              description: "Device security posture validation",
              color: "bg-yellow-100 text-yellow-800",
            },
          ],
          protocols: [
            {
              name: "HTTPS",
              description: "TCP 443 - Secure web communication",
              icon: <Lock className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "SCEP",
              description: "TCP 80/443 - Simple Certificate Enrollment Protocol",
              icon: <Key className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Azure AD",
              description: "TCP 443 - Identity and access management",
              icon: <Users className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Graph API",
              description: "TCP 443 - Microsoft Graph API",
              icon: <Server className="w-4 h-4 text-orange-600" />,
            },
          ],
        }
      case "onboarding":
        return {
          title: "Device Onboarding Legend",
          components: [
            {
              name: "Enrollment Server",
              description: "Handles device registration",
              icon: <Server className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Provisioning Service",
              description: "Configures device settings",
              icon: <Laptop className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Certificate Service",
              description: "Issues device certificates",
              icon: <FileCheck className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Onboarding Portal",
              description: "User self-service interface",
              icon: <Users className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "Quarantine Network",
              description: "Limited access for new devices",
              icon: <Shield className="w-4 h-4 text-red-600" />,
            },
          ],
          methods: [
            {
              name: "User-Driven",
              description: "End-user performs enrollment",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "IT-Assisted",
              description: "IT staff helps with enrollment",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "Zero-Touch",
              description: "Automatic enrollment with no user interaction",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "BYOD",
              description: "Bring Your Own Device enrollment",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "Corporate-Owned",
              description: "Company device enrollment",
              color: "bg-red-100 text-red-800",
            },
          ],
          protocols: [
            {
              name: "HTTPS",
              description: "TCP 443 - Secure web communication",
              icon: <Lock className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "SCEP",
              description: "TCP 80/443 - Simple Certificate Enrollment Protocol",
              icon: <Key className="w-4 h-4 text-green-600" />,
            },
            {
              name: "MDM",
              description: "TCP 443 - Mobile Device Management",
              icon: <Smartphone className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "802.1X",
              description: "Port-based Network Access Control",
              icon: <Network className="w-4 h-4 text-orange-600" />,
            },
          ],
        }
      default:
        return {
          title: "Complete Architecture Legend",
          components: [
            {
              name: "Portnox Cloud",
              description: "Cloud-based NAC platform",
              icon: <Server className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "Identity Provider",
              description: "User authentication source",
              icon: <Users className="w-4 h-4 text-green-600" />,
            },
            {
              name: "Network Infrastructure",
              description: "Switches, routers, and wireless",
              icon: <Network className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "Endpoint Devices",
              description: "User computers and mobile devices",
              icon: <Laptop className="w-4 h-4 text-orange-600" />,
            },
            {
              name: "MDM/EMM",
              description: "Mobile device management",
              icon: <Smartphone className="w-4 h-4 text-red-600" />,
            },
          ],
          methods: [
            {
              name: "802.1X",
              description: "Port-based network access control",
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Certificate-Based",
              description: "Authentication using digital certificates",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "MAC Authentication",
              description: "Device identification by MAC address",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "Posture Assessment",
              description: "Device security compliance checking",
              color: "bg-purple-100 text-purple-800",
            },
          ],
          protocols: [
            {
              name: "RADIUS",
              description: "UDP 1812/1813 - Authentication and accounting",
              icon: <Shield className="w-4 h-4 text-blue-600" />,
            },
            {
              name: "LDAP/LDAPS",
              description: "TCP 389/636 - Directory service access",
              icon: <Users className="w-4 h-4 text-green-600" />,
            },
            {
              name: "HTTPS",
              description: "TCP 443 - Secure web communication",
              icon: <Lock className="w-4 h-4 text-purple-600" />,
            },
            {
              name: "SNMP",
              description: "UDP 161/162 - Network monitoring and management",
              icon: <Network className="w-4 h-4 text-orange-600" />,
            },
          ],
        }
    }
  }

  const legendContent = getLegendContent()

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{legendContent.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="methods">Methods</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>
          <TabsContent value="components" className="pt-4">
            <div className="space-y-3">
              {legendContent.components.map((component, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {component.icon}
                  <div>
                    <p className="font-medium text-sm">{component.name}</p>
                    <p className="text-xs text-gray-500">{component.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="methods" className="pt-4">
            <div className="space-y-3">
              {legendContent.methods.map((method, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge className={method.color}>{method.name}</Badge>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="protocols" className="pt-4">
            <div className="space-y-3">
              {legendContent.protocols.map((protocol, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {protocol.icon}
                  <div>
                    <p className="font-medium text-sm">{protocol.name}</p>
                    <p className="text-xs text-gray-500">{protocol.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Status Indicators</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs">Active / Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-xs">Warning / Attention Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs">Error / Offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-xs">Pending / In Progress</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Security Levels</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800">High Security</Badge>
                <span className="text-xs">Certificate + Posture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800">Medium Security</Badge>
                <span className="text-xs">Password + Posture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">Basic Security</Badge>
                <span className="text-xs">Password Only</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gray-100 text-gray-800">Limited Access</Badge>
                <span className="text-xs">MAC Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
