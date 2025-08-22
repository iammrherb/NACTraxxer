"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import {
  Settings,
  Network,
  Shield,
  Smartphone,
  Laptop,
  Wifi,
  Globe,
  Users,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react"

interface VendorConfig {
  id: string
  name: string
  category: string
  version: string
  enabled: boolean
  configuration: { [key: string]: any }
  integrationStatus: "connected" | "disconnected" | "error" | "pending"
  lastUpdated: string
  supportedFeatures: string[]
  compatibilityMatrix: { [key: string]: boolean }
}

interface VendorTemplate {
  id: string
  name: string
  category: string
  description: string
  logo: string
  defaultConfig: { [key: string]: any }
  requiredFields: string[]
  supportedFeatures: string[]
  integrationGuide: string
  certifications: string[]
}

export default function VendorConfiguration() {
  const [activeTab, setActiveTab] = useState("network")
  const [selectedVendor, setSelectedVendor] = useState<VendorConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [vendorConfigs, setVendorConfigs] = useState<VendorConfig[]>([])
  const [showCompatibilityMatrix, setShowCompatibilityMatrix] = useState(false)

  const vendorCategories = [
    {
      id: "network",
      name: "Network Infrastructure",
      icon: <Network className="h-5 w-5" />,
      description: "Switches, routers, and network equipment",
    },
    {
      id: "wireless",
      name: "Wireless Infrastructure",
      icon: <Wifi className="h-5 w-5" />,
      description: "Access points and wireless controllers",
    },
    {
      id: "identity",
      name: "Identity Providers",
      icon: <Users className="h-5 w-5" />,
      description: "Authentication and directory services",
    },
    {
      id: "firewall",
      name: "Firewall & Security",
      icon: <Shield className="h-5 w-5" />,
      description: "Next-generation firewalls and security appliances",
    },
    {
      id: "mdm",
      name: "Mobile Device Management",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Device management and compliance platforms",
    },
    {
      id: "endpoints",
      name: "Endpoint Platforms",
      icon: <Laptop className="h-5 w-5" />,
      description: "Operating systems and device types",
    },
    {
      id: "cloud",
      name: "Cloud Platforms",
      icon: <Globe className="h-5 w-5" />,
      description: "Cloud infrastructure and services",
    },
  ]

  const vendorTemplates: VendorTemplate[] = [
    // Network Infrastructure
    {
      id: "cisco-catalyst",
      name: "Cisco Catalyst Switches",
      category: "network",
      description: "Enterprise-grade switching with advanced security features",
      logo: "/vendor-logos/cisco.png",
      defaultConfig: {
        managementIP: "",
        snmpCommunity: "public",
        radiusSharedSecret: "",
        tacacsSharedSecret: "",
        dot1xEnabled: true,
        macAuthBypass: true,
        guestVlan: 100,
        authFailVlan: 999,
        voiceVlan: 200,
        dynamicVlanAssignment: true,
        coaSupport: true,
        accountingEnabled: true,
      },
      requiredFields: ["managementIP", "radiusSharedSecret"],
      supportedFeatures: [
        "802.1X Authentication",
        "MAC Authentication Bypass",
        "Dynamic VLAN Assignment",
        "Change of Authorization (CoA)",
        "RADIUS Accounting",
        "TACACS+ Administration",
        "Port Security",
        "Storm Control",
      ],
      integrationGuide: "Configure RADIUS server, enable 802.1X globally, configure interface templates",
      certifications: ["Common Criteria", "FIPS 140-2", "UC APL"],
    },
    {
      id: "aruba-cx",
      name: "Aruba CX Switches",
      category: "network",
      description: "Cloud-native switching with built-in analytics",
      logo: "/vendor-logos/aruba.png",
      defaultConfig: {
        managementIP: "",
        radiusSharedSecret: "",
        netconfEnabled: true,
        restApiEnabled: true,
        dot1xEnabled: true,
        macAuthEnabled: true,
        dynamicSegmentation: true,
        userBasedTunneling: true,
        clearPassIntegration: true,
      },
      requiredFields: ["managementIP", "radiusSharedSecret"],
      supportedFeatures: [
        "Dynamic Segmentation",
        "User-Based Tunneling",
        "ClearPass Integration",
        "NetConf/RESTCONF",
        "Network Analytics Engine",
        "Zero Touch Provisioning",
      ],
      integrationGuide: "Enable NETCONF, configure ClearPass integration, setup dynamic segmentation",
      certifications: ["Common Criteria", "FIPS 140-2"],
    },
    {
      id: "juniper-ex",
      name: "Juniper EX Series",
      category: "network",
      description: "High-performance Ethernet switches with advanced security",
      logo: "/vendor-logos/juniper.png",
      defaultConfig: {
        managementIP: "",
        radiusSharedSecret: "",
        junosSpaceIntegration: false,
        dot1xEnabled: true,
        macRadiusEnabled: true,
        captivePortal: false,
        virtualChassis: false,
        macsecEnabled: false,
      },
      requiredFields: ["managementIP", "radiusSharedSecret"],
      supportedFeatures: [
        "802.1X with JUNOS",
        "MAC-RADIUS Authentication",
        "Captive Portal",
        "Virtual Chassis",
        "MACsec Encryption",
        "JUNOS Space Integration",
      ],
      integrationGuide: "Configure RADIUS authentication, enable 802.1X on interfaces, setup JUNOS Space",
      certifications: ["Common Criteria", "FIPS 140-2"],
    },

    // Wireless Infrastructure
    {
      id: "cisco-meraki",
      name: "Cisco Meraki Wireless",
      category: "wireless",
      description: "Cloud-managed wireless with integrated security",
      logo: "/vendor-logos/meraki.png",
      defaultConfig: {
        organizationId: "",
        apiKey: "",
        networkId: "",
        radiusServers: [],
        ssidConfigs: [],
        bandwidthLimits: {},
        accessControlEnabled: true,
        guestAccessEnabled: true,
        splashPageEnabled: false,
      },
      requiredFields: ["organizationId", "apiKey", "networkId"],
      supportedFeatures: [
        "Cloud Management",
        "Integrated RADIUS",
        "Guest Access Portal",
        "Bandwidth Shaping",
        "Application Visibility",
        "Wireless Intrusion Detection",
        "Bluetooth Beacons",
      ],
      integrationGuide: "Generate API key, configure RADIUS servers, setup SSIDs with authentication",
      certifications: ["Wi-Fi 6 Certified", "FCC", "CE"],
    },
    {
      id: "aruba-instant",
      name: "Aruba Instant Access Points",
      category: "wireless",
      description: "Controller-less wireless with ClearPass integration",
      logo: "/vendor-logos/aruba.png",
      defaultConfig: {
        virtualControllerIP: "",
        clearPassServer: "",
        radiusSharedSecret: "",
        ssidProfiles: [],
        roleBasedAccess: true,
        airWaveIntegration: false,
        centralIntegration: false,
      },
      requiredFields: ["virtualControllerIP", "clearPassServer"],
      supportedFeatures: [
        "ClearPass Integration",
        "Role-Based Access Control",
        "Adaptive Radio Management",
        "AirWave Integration",
        "Central Management",
        "ClientMatch Technology",
      ],
      integrationGuide: "Configure ClearPass server, setup SSID profiles, enable role-based policies",
      certifications: ["Wi-Fi 6 Certified", "FCC", "CE"],
    },

    // Identity Providers
    {
      id: "azure-ad",
      name: "Azure Active Directory",
      category: "identity",
      description: "Microsoft's cloud-based identity and access management service",
      logo: "/vendor-logos/microsoft.png",
      defaultConfig: {
        tenantId: "",
        clientId: "",
        clientSecret: "",
        directoryId: "",
        conditionalAccessEnabled: true,
        mfaEnabled: true,
        deviceRegistrationEnabled: true,
        seamlessSsoEnabled: false,
        passwordHashSync: true,
      },
      requiredFields: ["tenantId", "clientId", "clientSecret"],
      supportedFeatures: [
        "Conditional Access",
        "Multi-Factor Authentication",
        "Device Registration",
        "Seamless SSO",
        "Password Hash Synchronization",
        "Azure AD Connect",
        "Privileged Identity Management",
      ],
      integrationGuide: "Register application in Azure AD, configure API permissions, setup conditional access",
      certifications: ["SOC 2 Type II", "ISO 27001", "HIPAA", "FedRAMP"],
    },
    {
      id: "okta",
      name: "Okta Identity Cloud",
      category: "identity",
      description: "Enterprise identity management with zero trust security",
      logo: "/vendor-logos/okta.png",
      defaultConfig: {
        orgUrl: "",
        apiToken: "",
        clientId: "",
        clientSecret: "",
        universalDirectory: true,
        adaptiveAuthentication: true,
        deviceTrust: true,
        apiAccessManagement: true,
      },
      requiredFields: ["orgUrl", "apiToken", "clientId"],
      supportedFeatures: [
        "Universal Directory",
        "Adaptive Authentication",
        "Device Trust",
        "API Access Management",
        "Lifecycle Management",
        "Advanced Server Access",
        "Workflows",
      ],
      integrationGuide: "Create API token, configure OIDC application, setup authentication policies",
      certifications: ["SOC 2 Type II", "ISO 27001", "FedRAMP", "HIPAA"],
    },

    // Firewall & Security
    {
      id: "palo-alto-ngfw",
      name: "Palo Alto Networks NGFW",
      category: "firewall",
      description: "Next-generation firewall with advanced threat prevention",
      logo: "/vendor-logos/paloalto.png",
      defaultConfig: {
        managementIP: "",
        apiKey: "",
        panoramaServer: "",
        userIdAgentEnabled: true,
        globalProtectEnabled: false,
        threatPreventionEnabled: true,
        urlFilteringEnabled: true,
        wildFireEnabled: true,
        decryptionEnabled: false,
      },
      requiredFields: ["managementIP", "apiKey"],
      supportedFeatures: [
        "User-ID Integration",
        "GlobalProtect VPN",
        "Threat Prevention",
        "URL Filtering",
        "WildFire Analysis",
        "SSL Decryption",
        "Panorama Management",
      ],
      integrationGuide: "Generate API key, configure User-ID agent, setup security policies",
      certifications: ["Common Criteria", "FIPS 140-2", "ICSA"],
    },

    // MDM Providers
    {
      id: "microsoft-intune",
      name: "Microsoft Intune",
      category: "mdm",
      description: "Cloud-based mobile device and application management",
      logo: "/vendor-logos/microsoft.png",
      defaultConfig: {
        tenantId: "",
        applicationId: "",
        applicationSecret: "",
        deviceComplianceEnabled: true,
        appProtectionEnabled: true,
        conditionalAccessIntegration: true,
        autopilotEnabled: false,
        coManagementEnabled: false,
      },
      requiredFields: ["tenantId", "applicationId", "applicationSecret"],
      supportedFeatures: [
        "Device Compliance Policies",
        "App Protection Policies",
        "Conditional Access Integration",
        "Windows Autopilot",
        "Co-management with SCCM",
        "Mobile Threat Defense",
        "Certificate Management",
      ],
      integrationGuide: "Register app in Azure AD, configure Graph API permissions, setup compliance policies",
      certifications: ["SOC 2 Type II", "ISO 27001", "HIPAA", "FedRAMP"],
    },
    {
      id: "jamf-pro",
      name: "Jamf Pro",
      category: "mdm",
      description: "Apple device management platform for enterprise",
      logo: "/vendor-logos/jamf.png",
      defaultConfig: {
        jamfProUrl: "",
        username: "",
        password: "",
        apiEnabled: true,
        deviceEnrollmentEnabled: true,
        appDeploymentEnabled: true,
        complianceMonitoring: true,
        selfServiceEnabled: true,
      },
      requiredFields: ["jamfProUrl", "username", "password"],
      supportedFeatures: [
        "Device Enrollment Program",
        "App Store App Deployment",
        "Configuration Profiles",
        "Compliance Monitoring",
        "Self Service Portal",
        "Patch Management",
        "Security Framework",
      ],
      integrationGuide: "Create service account, enable API access, configure enrollment settings",
      certifications: ["SOC 2 Type II", "ISO 27001", "Privacy Shield"],
    },

    // Endpoint Platforms
    {
      id: "windows-enterprise",
      name: "Windows Enterprise",
      category: "endpoints",
      description: "Microsoft Windows enterprise operating system",
      logo: "/vendor-logos/microsoft.png",
      defaultConfig: {
        domainJoined: true,
        bitLockerEnabled: true,
        windowsDefenderEnabled: true,
        groupPolicyEnabled: true,
        wsusEnabled: false,
        telemetryLevel: "enhanced",
        cortanaEnabled: false,
      },
      requiredFields: [],
      supportedFeatures: [
        "Domain Join",
        "BitLocker Encryption",
        "Windows Defender",
        "Group Policy",
        "Windows Update for Business",
        "Windows Hello",
        "Credential Guard",
      ],
      integrationGuide: "Configure domain join, enable BitLocker, setup Windows Defender policies",
      certifications: ["Common Criteria", "FIPS 140-2"],
    },
    {
      id: "macos-enterprise",
      name: "macOS Enterprise",
      category: "endpoints",
      description: "Apple macOS for enterprise environments",
      logo: "/vendor-logos/apple.png",
      defaultConfig: {
        fileVaultEnabled: true,
        gatekeeperEnabled: true,
        sipEnabled: true,
        firewallEnabled: true,
        xprotectEnabled: true,
        profileManagement: true,
      },
      requiredFields: [],
      supportedFeatures: [
        "FileVault Encryption",
        "Gatekeeper",
        "System Integrity Protection",
        "Application Firewall",
        "XProtect Anti-malware",
        "Configuration Profiles",
        "Keychain Access",
      ],
      integrationGuide: "Enable FileVault, configure Gatekeeper policies, deploy configuration profiles",
      certifications: ["Common Criteria", "FIPS 140-2"],
    },
  ]

  const [compatibilityMatrix, setCompatibilityMatrix] = useState({
    "cisco-catalyst": {
      "azure-ad": true,
      okta: true,
      "microsoft-intune": true,
      "jamf-pro": false,
      "palo-alto-ngfw": true,
      "windows-enterprise": true,
      "macos-enterprise": true,
    },
    "aruba-cx": {
      "azure-ad": true,
      okta: true,
      "microsoft-intune": true,
      "jamf-pro": true,
      "palo-alto-ngfw": true,
      "windows-enterprise": true,
      "macos-enterprise": true,
    },
    "cisco-meraki": {
      "azure-ad": true,
      okta: true,
      "microsoft-intune": true,
      "jamf-pro": true,
      "palo-alto-ngfw": false,
      "windows-enterprise": true,
      "macos-enterprise": true,
    },
  })

  const addVendorConfig = (template: VendorTemplate) => {
    const newConfig: VendorConfig = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      category: template.category,
      version: "1.0",
      enabled: false,
      configuration: { ...template.defaultConfig },
      integrationStatus: "disconnected",
      lastUpdated: new Date().toISOString(),
      supportedFeatures: template.supportedFeatures,
      compatibilityMatrix: compatibilityMatrix[template.id] || {},
    }

    setVendorConfigs([...vendorConfigs, newConfig])
    setSelectedVendor(newConfig)
    setIsEditing(true)

    toast({
      title: "Vendor Added",
      description: `${template.name} has been added to your configuration`,
    })
  }

  const updateVendorConfig = (configId: string, updates: Partial<VendorConfig>) => {
    setVendorConfigs(
      vendorConfigs.map((config) =>
        config.id === configId ? { ...config, ...updates, lastUpdated: new Date().toISOString() } : config,
      ),
    )

    if (selectedVendor?.id === configId) {
      setSelectedVendor({ ...selectedVendor, ...updates })
    }
  }

  const testVendorConnection = async (config: VendorConfig) => {
    updateVendorConfig(config.id, { integrationStatus: "pending" })

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate
      updateVendorConfig(config.id, {
        integrationStatus: success ? "connected" : "error",
      })

      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success
          ? `Successfully connected to ${config.name}`
          : `Failed to connect to ${config.name}. Please check configuration.`,
        variant: success ? "default" : "destructive",
      })
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const renderVendorConfigForm = () => {
    if (!selectedVendor) return null

    const template = vendorTemplates.find((t) => t.name === selectedVendor.name)
    if (!template) return null

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle>{selectedVendor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(selectedVendor.integrationStatus)}>
                {getStatusIcon(selectedVendor.integrationStatus)}
                <span className="ml-1">{selectedVendor.integrationStatus}</span>
              </Badge>
              <Switch
                checked={selectedVendor.enabled}
                onCheckedChange={(enabled) => updateVendorConfig(selectedVendor.id, { enabled })}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configuration" className="space-y-4">
            <TabsList>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              <TabsTrigger value="integration">Integration Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedVendor.configuration).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                    {typeof value === "boolean" ? (
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateVendorConfig(selectedVendor.id, {
                            configuration: { ...selectedVendor.configuration, [key]: checked },
                          })
                        }
                      />
                    ) : typeof value === "number" ? (
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          updateVendorConfig(selectedVendor.id, {
                            configuration: { ...selectedVendor.configuration, [key]: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) =>
                          updateVendorConfig(selectedVendor.id, {
                            configuration: { ...selectedVendor.configuration, [key]: e.target.value },
                          })
                        }
                        placeholder={template.requiredFields.includes(key) ? "Required" : "Optional"}
                        className={template.requiredFields.includes(key) ? "border-red-300" : ""}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button onClick={() => testVendorConnection(selectedVendor)}>Test Connection</Button>
                <Button variant="outline">Save Configuration</Button>
                <Button variant="outline">Export Config</Button>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedVendor.supportedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compatibility" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Compatibility Matrix</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(selectedVendor.compatibilityMatrix).map(([vendorId, compatible]) => {
                    const vendor = vendorTemplates.find((v) => v.id === vendorId)
                    if (!vendor) return null

                    return (
                      <div key={vendorId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <Settings className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{vendor.name}</div>
                            <div className="text-xs text-muted-foreground">{vendor.category}</div>
                          </div>
                        </div>
                        <Badge variant={compatible ? "default" : "secondary"}>
                          {compatible ? "Compatible" : "Not Compatible"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Integration Steps</h3>
                  <p className="text-sm text-muted-foreground">{template.integrationGuide}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Required Fields</h3>
                  <div className="space-y-2">
                    {template.requiredFields.map((field, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <span>Vendor Configuration System</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure and manage integrations with network vendors, identity providers, and security platforms
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {vendorConfigs.length} Configured
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {vendorConfigs.filter((v) => v.integrationStatus === "connected").length} Connected
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="grid w-full grid-cols-1 h-auto">
                {vendorCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="justify-start">
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {vendorCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-4">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground mb-4">{category.description}</div>
                    {vendorTemplates
                      .filter((template) => template.category === category.id)
                      .map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Settings className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.description}</div>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => addVendorConfig(template)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Configured Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configured Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vendorConfigs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No vendors configured yet</p>
                  <p className="text-sm">Add vendors from the categories on the left</p>
                </div>
              ) : (
                vendorConfigs.map((config) => (
                  <div
                    key={config.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVendor?.id === config.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedVendor(config)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{config.name}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(config.integrationStatus)} variant="outline">
                          {config.integrationStatus}
                        </Badge>
                        <Switch checked={config.enabled} size="sm" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {config.category} • v{config.version}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {new Date(config.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Configuration */}
        <div className="space-y-6">
          {selectedVendor ? (
            renderVendorConfigForm()
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Select a vendor to configure</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Compatibility Matrix Modal */}
      {showCompatibilityMatrix && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor Compatibility Matrix</CardTitle>
                <Button variant="ghost" onClick={() => setShowCompatibilityMatrix(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This matrix shows compatibility between different vendor solutions in your NAC deployment.
                </p>
                {/* Compatibility matrix table would go here */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
