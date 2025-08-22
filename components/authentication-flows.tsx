"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Lock,
  Key,
  Server,
  Smartphone,
  Laptop,
  Network,
  Database,
  CheckCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Settings,
  Router,
} from "lucide-react"

interface AuthenticationFlowsProps {
  identityProvider: string
  mdmProvider: string
  simulationMode: string
}

export default function AuthenticationFlows({
  identityProvider,
  mdmProvider,
  simulationMode,
}: AuthenticationFlowsProps) {
  const [selectedFlow, setSelectedFlow] = useState("complete-flow")
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState("windows-laptop")
  const [authMethod, setAuthMethod] = useState("certificate")

  const authenticationFlows = [
    {
      id: "complete-flow",
      name: "Complete Authentication Flow",
      description: "End-to-end authentication process with all components",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "tacacs-detailed",
      name: "TACACS+ Deep Dive",
      description: "Detailed TACACS+ authentication, authorization, and accounting",
      icon: <Server className="h-4 w-4" />,
    },
    {
      id: "intune-detailed",
      name: "Microsoft Intune Integration",
      description: "Complete Intune MDM/MAM authentication and compliance",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "jamf-detailed",
      name: "JAMF Pro Integration",
      description: "Apple device management with JAMF Pro authentication",
      icon: <Laptop className="h-4 w-4" />,
    },
    {
      id: "radsec-proxy",
      name: "RadSec Proxy Authentication",
      description: "Secure RADIUS over TLS proxy authentication flow",
      icon: <Lock className="h-4 w-4" />,
    },
    {
      id: "certificate-auth",
      name: "Certificate-Based Authentication",
      description: "PKI certificate authentication with EAP-TLS",
      icon: <Key className="h-4 w-4" />,
    },
    {
      id: "mfa-flow",
      name: "Multi-Factor Authentication",
      description: "Advanced MFA with risk-based authentication",
      icon: <Smartphone className="h-4 w-4" />,
    },
  ]

  const deviceTypes = [
    { id: "windows-laptop", name: "Windows Laptop", icon: <Laptop className="h-4 w-4" /> },
    { id: "mac-laptop", name: "MacBook", icon: <Laptop className="h-4 w-4" /> },
    { id: "ios-device", name: "iOS Device", icon: <Smartphone className="h-4 w-4" /> },
    { id: "android-device", name: "Android Device", icon: <Smartphone className="h-4 w-4" /> },
    { id: "network-device", name: "Network Device", icon: <Router className="h-4 w-4" /> },
    { id: "iot-device", name: "IoT Device", icon: <Network className="h-4 w-4" /> },
  ]

  const authMethods = [
    { id: "certificate", name: "Certificate (EAP-TLS)" },
    { id: "username-password", name: "Username/Password (PEAP)" },
    { id: "mfa", name: "Multi-Factor Authentication" },
    { id: "device-certificate", name: "Device Certificate" },
    { id: "kerberos", name: "Kerberos" },
  ]

  const tacacsSteps = [
    {
      step: 1,
      title: "Authentication Request",
      description: "Network device sends authentication request to TACACS+ server",
      details: [
        "Device initiates connection attempt",
        "TACACS+ client sends START packet",
        "Username and authentication method specified",
        "Encrypted communication established",
      ],
      status: "complete",
      duration: "50ms",
    },
    {
      step: 2,
      title: "Identity Verification",
      description: "TACACS+ server validates user credentials",
      details: [
        "Server queries identity provider (AD/LDAP)",
        "Password hash verification",
        "Account status validation",
        "Group membership evaluation",
      ],
      status: "complete",
      duration: "120ms",
    },
    {
      step: 3,
      title: "Authorization Check",
      description: "Command authorization and privilege level assignment",
      details: [
        "User privilege level determination",
        "Command authorization rules applied",
        "Device-specific permissions evaluated",
        "Role-based access control enforced",
      ],
      status: "in-progress",
      duration: "80ms",
    },
    {
      step: 4,
      title: "Accounting Start",
      description: "Session accounting and logging initiated",
      details: [
        "Session start time recorded",
        "User and device information logged",
        "Accounting record created",
        "Real-time monitoring enabled",
      ],
      status: "pending",
      duration: "30ms",
    },
    {
      step: 5,
      title: "Command Accounting",
      description: "Individual command execution tracking",
      details: [
        "Each command logged with timestamp",
        "Command success/failure recorded",
        "Privilege escalation tracked",
        "Audit trail maintained",
      ],
      status: "pending",
      duration: "10ms per command",
    },
  ]

  const intuneSteps = [
    {
      step: 1,
      title: "Device Enrollment",
      description: "Device registers with Microsoft Intune",
      details: [
        "Azure AD device registration",
        "Intune enrollment certificate issued",
        "Device compliance evaluation",
        "Management profile installation",
      ],
      status: "complete",
      duration: "2-5 minutes",
    },
    {
      step: 2,
      title: "Compliance Assessment",
      description: "Device compliance policies evaluated",
      details: [
        "OS version and patch level check",
        "Antivirus status verification",
        "Encryption status validation",
        "App protection policy compliance",
      ],
      status: "complete",
      duration: "30-60 seconds",
    },
    {
      step: 3,
      title: "Conditional Access",
      description: "Azure AD conditional access policies applied",
      details: [
        "Device trust level evaluation",
        "Location-based access control",
        "Risk-based authentication",
        "Application access permissions",
      ],
      status: "in-progress",
      duration: "100-200ms",
    },
    {
      step: 4,
      title: "Certificate Provisioning",
      description: "Device certificates automatically deployed",
      details: [
        "SCEP certificate request",
        "Certificate authority validation",
        "Private key generation",
        "Certificate installation",
      ],
      status: "pending",
      duration: "1-2 minutes",
    },
    {
      step: 5,
      title: "Network Access",
      description: "802.1X authentication with device certificate",
      details: [
        "EAP-TLS authentication initiated",
        "Certificate-based authentication",
        "Network policy evaluation",
        "VLAN assignment and access granted",
      ],
      status: "pending",
      duration: "2-5 seconds",
    },
  ]

  const jamfSteps = [
    {
      step: 1,
      title: "Device Enrollment",
      description: "Apple device enrolls with JAMF Pro",
      details: [
        "Apple Business Manager integration",
        "Automated Device Enrollment (ADE)",
        "JAMF Pro enrollment profile",
        "Device supervision enabled",
      ],
      status: "complete",
      duration: "3-7 minutes",
    },
    {
      step: 2,
      title: "Configuration Profiles",
      description: "Security and network profiles deployed",
      details: [
        "Wi-Fi configuration profile",
        "Certificate payload deployment",
        "Security restrictions applied",
        "App installation policies",
      ],
      status: "complete",
      duration: "1-3 minutes",
    },
    {
      step: 3,
      title: "Certificate Management",
      description: "PKI certificates provisioned via JAMF",
      details: [
        "SCEP certificate request",
        "Apple Certificate Authority",
        "Keychain certificate storage",
        "Certificate renewal automation",
      ],
      status: "in-progress",
      duration: "30-90 seconds",
    },
    {
      step: 4,
      title: "Compliance Verification",
      description: "Device compliance and security posture",
      details: [
        "OS version compliance check",
        "Security patch validation",
        "Jailbreak/root detection",
        "App compliance verification",
      ],
      status: "pending",
      duration: "10-30 seconds",
    },
    {
      step: 5,
      title: "Network Authentication",
      description: "802.1X authentication with JAMF integration",
      details: [
        "EAP-TLS with device certificate",
        "User-based authentication",
        "Network access control",
        "Dynamic VLAN assignment",
      ],
      status: "pending",
      duration: "1-3 seconds",
    },
  ]

  const radSecSteps = [
    {
      step: 1,
      title: "TLS Handshake",
      description: "Secure TLS connection establishment",
      details: [
        "TLS 1.3 connection initiated",
        "Certificate validation",
        "Cipher suite negotiation",
        "Secure channel established",
      ],
      status: "complete",
      duration: "100-200ms",
    },
    {
      step: 2,
      title: "RADIUS Encapsulation",
      description: "RADIUS packets encapsulated in TLS",
      details: [
        "RADIUS packet encryption",
        "TLS stream protection",
        "Packet integrity verification",
        "Secure transmission",
      ],
      status: "complete",
      duration: "5-10ms",
    },
    {
      step: 3,
      title: "Proxy Forwarding",
      description: "RadSec proxy forwards to RADIUS server",
      details: ["Load balancing across servers", "Health check validation", "Failover handling", "Request routing"],
      status: "in-progress",
      duration: "10-20ms",
    },
    {
      step: 4,
      title: "Authentication Processing",
      description: "RADIUS server processes authentication",
      details: ["EAP method processing", "Identity provider lookup", "Policy evaluation", "Response generation"],
      status: "pending",
      duration: "50-150ms",
    },
    {
      step: 5,
      title: "Secure Response",
      description: "Encrypted response via RadSec proxy",
      details: ["Response encryption", "TLS transmission", "Proxy relay", "Client notification"],
      status: "pending",
      duration: "20-50ms",
    },
  ]

  const getCurrentSteps = () => {
    switch (selectedFlow) {
      case "tacacs-detailed":
        return tacacsSteps
      case "intune-detailed":
        return intuneSteps
      case "jamf-detailed":
        return jamfSteps
      case "radsec-proxy":
        return radSecSteps
      default:
        return tacacsSteps
    }
  }

  const renderFlowDiagram = () => {
    const steps = getCurrentSteps()

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.step} className="relative">
            <div
              className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                step.status === "complete"
                  ? "border-green-200 bg-green-50"
                  : step.status === "in-progress"
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  step.status === "complete"
                    ? "bg-green-500"
                    : step.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                }`}
              >
                {step.status === "complete" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : step.status === "in-progress" ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  step.step
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {step.duration}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span className="text-xs">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderTacacsDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-blue-600" />
            <span>TACACS+ Architecture Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Username/Password validation</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Certificate-based auth</li>
                  <li>• Token-based authentication</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Authorization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Command authorization</li>
                  <li>• Privilege level assignment</li>
                  <li>• Service authorization</li>
                  <li>• Attribute-based control</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Accounting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Session tracking</li>
                  <li>• Command logging</li>
                  <li>• Resource usage</li>
                  <li>• Audit trail generation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TACACS+ Configuration Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-gray-400 mb-2"># Cisco IOS TACACS+ Configuration</div>
              <div>aaa new-model</div>
              <div>aaa authentication login default group tacacs+ local</div>
              <div>aaa authorization exec default group tacacs+ local</div>
              <div>aaa authorization commands 15 default group tacacs+ local</div>
              <div>aaa accounting exec default start-stop group tacacs+</div>
              <div>aaa accounting commands 15 default start-stop group tacacs+</div>
              <div className="mt-2">tacacs-server host 192.168.1.100 key SecureKey123</div>
              <div>tacacs-server timeout 5</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntuneDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Microsoft Intune Integration Architecture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Device Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Mobile Device Management (MDM)</li>
                  <li>• Mobile Application Management (MAM)</li>
                  <li>• Windows 10/11 management</li>
                  <li>• macOS device management</li>
                  <li>• iOS/Android management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• OS version requirements</li>
                  <li>• Security patch compliance</li>
                  <li>• Encryption enforcement</li>
                  <li>• Antivirus requirements</li>
                  <li>• Jailbreak/root detection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intune Certificate Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">SCEP Certificate Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Certificate Template:</strong> User Authentication
                </div>
                <div>
                  <strong>Key Usage:</strong> Digital Signature, Key Encipherment
                </div>
                <div>
                  <strong>Subject Name Format:</strong> CN=JohnDoe@example.com
                </div>
                <div>
                  <strong>Certificate Validity:</strong> 1 Year
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderJamfDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Laptop className="h-5 w-5 text-blue-600" />
            <span>JAMF Pro Integration Architecture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Apple Device Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• macOS device management</li>
                  <li>• iOS/iPadOS management</li>
                  <li>• tvOS management</li>
                  <li>• Apple Business Manager integration</li>
                  <li>• Automated Device Enrollment</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• FileVault encryption management</li>
                  <li>• Gatekeeper policy enforcement</li>
                  <li>• System Integrity Protection</li>
                  <li>• Certificate-based authentication</li>
                  <li>• Conditional access integration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JAMF Configuration Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Wi-Fi Configuration Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>SSID:</strong> Corporate-WiFi
                </div>
                <div>
                  <strong>Security Type:</strong> WPA2/WPA3 Enterprise
                </div>
                <div>
                  <strong>EAP Type:</strong> EAP-TLS
                </div>
                <div>
                  <strong>Certificate:</strong> User Certificate
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Advanced Authentication Systems</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive authentication flows with TACACS+, Intune, JAMF, and RadSec integration
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {identityProvider.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {mdmProvider.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Authentication Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center space-x-2">
                        {device.icon}
                        <span>{device.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Authentication Method</Label>
              <Select value={authMethod} onValueChange={setAuthMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="animation" checked={isAnimating} onCheckedChange={setIsAnimating} />
                <Label htmlFor="animation" className="text-sm">
                  Animation
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Flow Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Flow Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authenticationFlows.map((flow) => (
              <Card
                key={flow.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFlow === flow.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedFlow(flow.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">{flow.icon}</div>
                    <div>
                      <h3 className="font-medium text-sm">{flow.name}</h3>
                      <p className="text-xs text-muted-foreground">{flow.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flow Details */}
      <Tabs value={selectedFlow} onValueChange={setSelectedFlow}>
        <TabsContent value="complete-flow">
          <Card>
            <CardHeader>
              <CardTitle>Complete Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>{renderFlowDiagram()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tacacs-detailed">
          {renderTacacsDetails()}
          <Card>
            <CardHeader>
              <CardTitle>TACACS+ Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>{renderFlowDiagram()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intune-detailed">
          {renderIntuneDetails()}
          <Card>
            <CardHeader>
              <CardTitle>Microsoft Intune Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>{renderFlowDiagram()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jamf-detailed">
          {renderJamfDetails()}
          <Card>
            <CardHeader>
              <CardTitle>JAMF Pro Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>{renderFlowDiagram()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radsec-proxy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>RadSec Proxy Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">RadSec (RADIUS over TLS) Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">End-to-end encryption</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Certificate-based authentication</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Network className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Reliable TCP transport</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Load balancing and failover</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>RadSec Proxy Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>{renderFlowDiagram()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificate-auth">
          <Card>
            <CardHeader>
              <CardTitle>Certificate-Based Authentication (EAP-TLS)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">EAP-TLS Authentication Process</h4>
                  <div className="space-y-2 text-sm">
                    <div>1. Client presents certificate to authenticator</div>
                    <div>2. Authenticator forwards certificate to RADIUS server</div>
                    <div>3. RADIUS server validates certificate against CA</div>
                    <div>4. Certificate revocation list (CRL) checked</div>
                    <div>5. Access granted based on certificate validity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa-flow">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">MFA Methods Supported</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Something you know:</strong> Password, PIN
                    </div>
                    <div>
                      <strong>Something you have:</strong> Token, Smart card
                    </div>
                    <div>
                      <strong>Something you are:</strong> Biometrics
                    </div>
                    <div>
                      <strong>Somewhere you are:</strong> Location-based
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
