"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface InteractiveDiagramProps {
  view: string
  cloudProvider: string
  networkVendor: string
  connectivityType: string
  animationSpeed: number
}

export default function InteractiveDiagram({
  view,
  cloudProvider,
  networkVendor,
  connectivityType,
  animationSpeed,
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  useEffect(() => {
    if (svgRef.current) {
      renderDiagram()
    }
  }, [view, cloudProvider, networkVendor, connectivityType, animationSpeed])

  const renderDiagram = () => {
    const svg = svgRef.current
    if (!svg) return

    // Clear existing content
    svg.innerHTML = ""

    // Set viewBox for larger canvas
    svg.setAttribute("viewBox", "0 0 1600 1000")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "700")

    // Add background gradient
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    gradient.setAttribute("id", "backgroundGradient")
    gradient.setAttribute("x1", "0%")
    gradient.setAttribute("y1", "0%")
    gradient.setAttribute("x2", "100%")
    gradient.setAttribute("y2", "100%")

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop1.setAttribute("offset", "0%")
    stop1.setAttribute("stop-color", "#f8fafc")

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop2.setAttribute("offset", "100%")
    stop2.setAttribute("stop-color", "#e2e8f0")

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    background.setAttribute("width", "1600")
    background.setAttribute("height", "1000")
    background.setAttribute("fill", "url(#backgroundGradient)")
    svg.appendChild(background)

    // Render based on selected view
    switch (view) {
      case "complete":
        renderCompleteArchitecture(svg)
        break
      case "auth-flow":
        renderAuthenticationFlow(svg)
        break
      case "pki":
        renderPKIInfrastructure(svg)
        break
      case "policies":
        renderPolicyFramework(svg)
        break
      case "connectivity":
        renderConnectivityOptions(svg)
        break
      case "intune":
        renderIntuneIntegration(svg)
        break
      case "jamf":
        renderJAMFIntegration(svg)
        break
      case "onboarding":
        renderDeviceOnboarding(svg)
        break
      case "fortigate-tacacs":
        renderFortiGateTACACS(svg)
        break
      case "palo-tacacs":
        renderPaloAltoTACACS(svg)
        break
      case "cisco-tacacs":
        renderCiscoTACACS(svg)
        break
      case "aruba-tacacs":
        renderArubaTACACS(svg)
        break
      case "juniper-tacacs":
        renderJuniperTACACS(svg)
        break
      case "palo-userid":
        renderPaloAltoUserID(svg)
        break
      case "fortigate-fsso":
        renderFortiGateFSSO(svg)
        break
      case "meraki-wireless":
        renderMerakiWireless(svg)
        break
      case "mist-wireless":
        renderMistWireless(svg)
        break
      default:
        renderCompleteArchitecture(svg)
    }

    // Add animations if enabled
    if (isAnimating) {
      addAnimations(svg)
    }
  }

  const renderCompleteArchitecture = (svg: SVGSVGElement) => {
    // Add title
    addTitle(svg, "Complete Zero Trust NAC Architecture", 800, 30)

    // Layer 1: Endpoints (Left side)
    addSectionLabel(svg, "Endpoints", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Corporate Laptops", "#4F46E5", "endpoint", [
      "Windows 10/11",
      "macOS",
      "802.1X Supplicant",
    ])
    createDetailedComponent(svg, 50, 200, "Mobile Devices", "#4F46E5", "endpoint", [
      "iOS/Android",
      "MDM Enrolled",
      "Certificate Auth",
    ])
    createDetailedComponent(svg, 50, 280, "IoT Devices", "#4F46E5", "endpoint", ["Sensors", "Cameras", "MAB Auth"])
    createDetailedComponent(svg, 50, 360, "Guest Devices", "#4F46E5", "endpoint", [
      "BYOD",
      "Captive Portal",
      "Limited Access",
    ])

    // Layer 2: Network Infrastructure (Center-left)
    addSectionLabel(svg, "Network Infrastructure", 450, 80, "#059669")
    createDetailedComponent(svg, 350, 120, `${getVendorLabel(networkVendor)} Access Switch`, "#059669", "network", [
      "48 Ports",
      "802.1X",
      "RADIUS Client",
      "Port 1812/1813",
    ])
    createDetailedComponent(svg, 350, 200, `${getVendorLabel(networkVendor)} Core Switch`, "#059669", "network", [
      "L3 Routing",
      "VLAN 100-200",
      "QoS Policies",
    ])
    createDetailedComponent(svg, 350, 280, `${getVendorLabel(networkVendor)} Wireless AP`, "#059669", "network", [
      "802.11ax",
      "WPA3-Enterprise",
      "RADIUS Auth",
    ])
    createDetailedComponent(svg, 350, 360, `${getVendorLabel(networkVendor)} Controller`, "#059669", "network", [
      "Centralized Mgmt",
      "Policy Enforcement",
      "Guest Portal",
    ])

    // Layer 3: NAC Platform (Center)
    addSectionLabel(svg, "Portnox NAC Platform", 750, 80, "#00c8d7")
    createDetailedComponent(svg, 650, 120, "Portnox Cloud", "#00c8d7", "nac", [
      "SaaS Platform",
      "Multi-Tenant",
      "Global Reach",
    ])
    createDetailedComponent(svg, 650, 200, "RADIUS Server", "#00c8d7", "nac", [
      "Port 1812/1813",
      "EAP Methods",
      "CoA/DM Support",
    ])
    createDetailedComponent(svg, 650, 280, "Policy Engine", "#00c8d7", "nac", [
      "Dynamic Policies",
      "Risk Assessment",
      "Compliance Check",
    ])
    createDetailedComponent(svg, 650, 360, "Device Profiling", "#00c8d7", "nac", [
      "Fingerprinting",
      "Behavior Analysis",
      "ML Classification",
    ])

    // Layer 4: Identity & MDM (Center-right)
    addSectionLabel(svg, "Identity & Device Management", 1050, 80, "#0078D4")
    createDetailedComponent(svg, 950, 120, "Azure Active Directory", "#0078D4", "identity", [
      "LDAP/SAML",
      "Conditional Access",
      "MFA Support",
    ])
    createDetailedComponent(svg, 950, 200, "Active Directory", "#0078D4", "identity", [
      "Domain Controller",
      "Group Policies",
      "Kerberos Auth",
    ])
    createDetailedComponent(svg, 950, 280, "Microsoft Intune", "#7C3AED", "mdm", [
      "Device Compliance",
      "App Management",
      "Conditional Access",
    ])
    createDetailedComponent(svg, 950, 360, "JAMF Pro", "#7C3AED", "mdm", [
      "Apple Devices",
      "Configuration Profiles",
      "Compliance Policies",
    ])

    // Layer 5: Cloud & Security (Right side)
    addSectionLabel(svg, "Cloud & Security", 1350, 80, "#0891B2")
    createDetailedComponent(svg, 1250, 120, getCloudProviderLabel(cloudProvider), "#0891B2", "cloud", [
      "IaaS/PaaS",
      "API Gateway",
      "Global CDN",
    ])
    createDetailedComponent(svg, 1250, 200, "Certificate Authority", "#DC2626", "pki", [
      "X.509 Certificates",
      "CRL/OCSP",
      "Auto-Enrollment",
    ])
    createDetailedComponent(svg, 1250, 280, "SIEM/SOC", "#F59E0B", "security", [
      "Log Aggregation",
      "Threat Detection",
      "Incident Response",
    ])
    createDetailedComponent(svg, 1250, 360, "Backup & DR", "#6B7280", "backup", [
      "Data Replication",
      "RTO/RPO",
      "Business Continuity",
    ])

    // Detailed Connections with protocols and ports
    createDetailedConnection(svg, 170, 160, 350, 160, "#00c8d7", "802.1X EAP-TLS", [
      "Port 802.1X",
      "Certificate Auth",
      "Dynamic VLAN",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#00c8d7", "802.1X EAP-PEAP", [
      "Username/Password",
      "Tunnel Auth",
      "Machine Auth",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#00c8d7", "MAB Authentication", [
      "MAC Address",
      "Profiling",
      "Limited Access",
    ])
    createDetailedConnection(svg, 170, 400, 350, 400, "#059669", "Captive Portal", [
      "HTTP Redirect",
      "Guest Registration",
      "Terms Acceptance",
    ])

    createDetailedConnection(svg, 470, 180, 650, 180, "#059669", "RADIUS", [
      "UDP 1812/1813",
      "Access-Request",
      "Access-Accept/Reject",
    ])
    createDetailedConnection(svg, 470, 260, 650, 260, "#059669", "SNMP Monitoring", [
      "UDP 161/162",
      "Device Status",
      "Performance Metrics",
    ])
    createDetailedConnection(svg, 470, 340, 650, 340, "#059669", "Syslog", [
      "UDP 514",
      "Event Logging",
      "Security Events",
    ])

    createDetailedConnection(svg, 770, 180, 950, 180, "#0078D4", "LDAP/LDAPS", [
      "TCP 389/636",
      "User Lookup",
      "Group Membership",
    ])
    createDetailedConnection(svg, 770, 260, 950, 260, "#0078D4", "SAML 2.0", [
      "HTTPS 443",
      "SSO Authentication",
      "Attribute Exchange",
    ])
    createDetailedConnection(svg, 770, 340, 950, 340, "#7C3AED", "REST API", [
      "HTTPS 443",
      "Device Compliance",
      "Policy Sync",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#0891B2", "Cloud API", [
      "HTTPS 443",
      "Service Integration",
      "Data Sync",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#DC2626", "Certificate Enrollment", [
      "HTTPS 443",
      "SCEP/EST",
      "Auto-Renewal",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#F59E0B", "Security Logs", [
      "HTTPS 443",
      "SIEM Integration",
      "Threat Intelligence",
    ])

    // Add network zones
    addNetworkZone(svg, 30, 100, 200, 320, "User Network", "#4F46E5", 0.1)
    addNetworkZone(svg, 330, 100, 200, 320, "Access Layer", "#059669", 0.1)
    addNetworkZone(svg, 630, 100, 200, 320, "NAC Platform", "#00c8d7", 0.1)
    addNetworkZone(svg, 930, 100, 200, 320, "Identity Layer", "#0078D4", 0.1)
    addNetworkZone(svg, 1230, 100, 200, 320, "Cloud Services", "#0891B2", 0.1)
  }

  const renderAuthenticationFlow = (svg: SVGSVGElement) => {
    addTitle(svg, "802.1X Authentication Flow", 800, 30)

    // Authentication participants
    createDetailedComponent(svg, 100, 150, "Supplicant", "#4F46E5", "endpoint", [
      "802.1X Client",
      "EAP Methods",
      "Certificate Store",
    ])
    createDetailedComponent(svg, 400, 150, "Authenticator", "#059669", "network", [
      "802.1X Switch/AP",
      "Port Control",
      "RADIUS Proxy",
    ])
    createDetailedComponent(svg, 700, 150, "Authentication Server", "#00c8d7", "nac", [
      "RADIUS Server",
      "EAP Processing",
      "Policy Decision",
    ])
    createDetailedComponent(svg, 1000, 150, "Identity Store", "#0078D4", "identity", [
      "User Database",
      "Certificate Store",
      "Group Policies",
    ])
    createDetailedComponent(svg, 1300, 150, "Policy Engine", "#7C3AED", "policies", [
      "Access Control",
      "VLAN Assignment",
      "QoS Policies",
    ])

    // Authentication flow steps with detailed protocols
    const flowSteps = [
      {
        from: { x: 220, y: 180 },
        to: { x: 400, y: 180 },
        label: "1. EAP-Start",
        details: ["Link Layer", "Port Authentication", "Identity Request"],
      },
      {
        from: { x: 520, y: 200 },
        to: { x: 700, y: 200 },
        label: "2. RADIUS Access-Request",
        details: ["UDP 1812", "EAP-Identity", "NAS-Identifier"],
      },
      {
        from: { x: 820, y: 220 },
        to: { x: 1000, y: 220 },
        label: "3. Identity Lookup",
        details: ["LDAP Query", "Certificate Validation", "Group Membership"],
      },
      {
        from: { x: 1000, y: 240 },
        to: { x: 820, y: 240 },
        label: "4. User Attributes",
        details: ["User Groups", "Certificate Status", "Account Status"],
      },
      {
        from: { x: 700, y: 260 },
        to: { x: 520, y: 260 },
        label: "5. EAP Challenge",
        details: ["EAP-TLS/PEAP", "Certificate Request", "Tunnel Setup"],
      },
      {
        from: { x: 400, y: 280 },
        to: { x: 220, y: 280 },
        label: "6. EAP Response",
        details: ["Client Certificate", "Credentials", "Identity Proof"],
      },
      {
        from: { x: 220, y: 300 },
        to: { x: 400, y: 300 },
        label: "7. EAP Success/Failure",
        details: ["Authentication Result", "Session Keys", "Port Authorization"],
      },
      {
        from: { x: 820, y: 320 },
        to: { x: 1300, y: 320 },
        label: "8. Policy Lookup",
        details: ["User Context", "Device Profile", "Network Location"],
      },
      {
        from: { x: 1300, y: 340 },
        to: { x: 820, y: 340 },
        label: "9. Access Policies",
        details: ["VLAN Assignment", "ACL Rules", "QoS Parameters"],
      },
      {
        from: { x: 700, y: 360 },
        to: { x: 520, y: 360 },
        label: "10. RADIUS Access-Accept",
        details: ["UDP 1812", "VLAN ID", "Filter-ID"],
      },
      {
        from: { x: 400, y: 380 },
        to: { x: 220, y: 380 },
        label: "11. Port Authorization",
        details: ["Port State Change", "VLAN Assignment", "Network Access"],
      },
    ]

    flowSteps.forEach((step, index) => {
      createDetailedConnection(svg, step.from.x, step.from.y, step.to.x, step.to.y, "#DC2626", step.label, step.details)

      // Add timing information
      addLabel(svg, (step.from.x + step.to.x) / 2, step.from.y - 15, `${index * 100}ms`, "#6B7280", "10")
    })

    // Add protocol details
    addProtocolBox(svg, 100, 450, "EAP Methods Supported", [
      "EAP-TLS (Certificate-based)",
      "EAP-PEAP (Username/Password)",
      "EAP-TTLS (Tunneled Authentication)",
      "EAP-FAST (Cisco Proprietary)",
    ])

    addProtocolBox(svg, 500, 450, "RADIUS Attributes", [
      "User-Name (Type 1)",
      "NAS-IP-Address (Type 4)",
      "NAS-Port (Type 5)",
      "Tunnel-Type (Type 64)",
      "Tunnel-Medium-Type (Type 65)",
      "Tunnel-Private-Group-ID (Type 81)",
    ])

    addProtocolBox(svg, 900, 450, "Policy Attributes", [
      "VLAN-ID Assignment",
      "Access Control Lists",
      "Bandwidth Limitations",
      "Session Timeout",
      "Re-authentication Timer",
    ])
  }

  const renderPKIInfrastructure = (svg: SVGSVGElement) => {
    addTitle(svg, "PKI Infrastructure for Zero Trust NAC", 800, 30)

    // PKI Hierarchy
    createDetailedComponent(svg, 700, 100, "Root Certificate Authority", "#DC2626", "pki", [
      "Offline CA",
      "Self-Signed",
      "20-Year Validity",
    ])
    createDetailedComponent(svg, 500, 200, "Issuing CA - Users", "#DC2626", "pki", [
      "Online CA",
      "1-Year Certificates",
      "Auto-Enrollment",
    ])
    createDetailedComponent(svg, 900, 200, "Issuing CA - Devices", "#DC2626", "pki", [
      "Online CA",
      "2-Year Certificates",
      "SCEP Protocol",
    ])

    // Certificate Stores
    createDetailedComponent(svg, 300, 300, "User Certificate Store", "#4F46E5", "endpoint", [
      "Personal Store",
      "Trusted Root",
      "Intermediate CA",
    ])
    createDetailedComponent(svg, 700, 300, "Device Certificate Store", "#4F46E5", "endpoint", [
      "Computer Store",
      "Machine Certificates",
      "Service Accounts",
    ])
    createDetailedComponent(svg, 1100, 300, "Network Device Certs", "#059669", "network", [
      "Switch Certificates",
      "AP Certificates",
      "RADIUS Certs",
    ])

    // Certificate Services
    createDetailedComponent(svg, 200, 450, "Certificate Templates", "#7C3AED", "templates", [
      "User Template",
      "Computer Template",
      "Custom Templates",
    ])
    createDetailedComponent(svg, 500, 450, "CRL Distribution Point", "#F59E0B", "crl", [
      "HTTP/LDAP",
      "Delta CRL",
      "Revocation Check",
    ])
    createDetailedComponent(svg, 800, 450, "OCSP Responder", "#F59E0B", "ocsp", [
      "Real-time Status",
      "RFC 6960",
      "Certificate Validation",
    ])
    createDetailedComponent(svg, 1100, 450, "Certificate Authority Web", "#0891B2", "web", [
      "Web Enrollment",
      "Certificate Request",
      "User Portal",
    ])

    // PKI Connections
    createDetailedConnection(svg, 750, 150, 550, 200, "#DC2626", "CA Certificate Chain", [
      "Root → Issuing",
      "Certificate Hierarchy",
      "Trust Chain",
    ])
    createDetailedConnection(svg, 750, 150, 950, 200, "#DC2626", "CA Certificate Chain", [
      "Root → Issuing",
      "Certificate Hierarchy",
      "Trust Chain",
    ])

    createDetailedConnection(svg, 550, 250, 350, 300, "#4F46E5", "Certificate Issuance", [
      "Auto-Enrollment",
      "Template-based",
      "User Certificates",
    ])
    createDetailedConnection(svg, 950, 250, 750, 300, "#4F46E5", "Certificate Issuance", [
      "SCEP Protocol",
      "Device Authentication",
      "Machine Certificates",
    ])
    createDetailedConnection(svg, 950, 250, 1150, 300, "#059669", "Network Device Enrollment", [
      "Manual Enrollment",
      "SCEP/EST",
      "Infrastructure Certs",
    ])

    createDetailedConnection(svg, 550, 250, 550, 450, "#F59E0B", "CRL Publishing", [
      "HTTP/LDAP",
      "Revocation List",
      "Periodic Updates",
    ])
    createDetailedConnection(svg, 950, 250, 850, 450, "#F59E0B", "OCSP Services", [
      "Real-time Check",
      "Certificate Status",
      "Validation Response",
    ])

    // Certificate Lifecycle
    addProtocolBox(svg, 50, 600, "Certificate Lifecycle", [
      "1. Certificate Request (CSR)",
      "2. Identity Verification",
      "3. Certificate Issuance",
      "4. Certificate Installation",
      "5. Certificate Usage",
      "6. Certificate Renewal",
      "7. Certificate Revocation",
    ])

    addProtocolBox(svg, 400, 600, "Certificate Validation", [
      "Chain of Trust Verification",
      "Certificate Expiration Check",
      "CRL/OCSP Revocation Check",
      "Key Usage Validation",
      "Extended Key Usage Check",
      "Certificate Policy Validation",
    ])

    addProtocolBox(svg, 750, 600, "Security Considerations", [
      "Private Key Protection",
      "Hardware Security Modules",
      "Certificate Pinning",
      "Key Escrow Policies",
      "Audit Logging",
      "Compliance Requirements",
    ])

    addProtocolBox(svg, 1100, 600, "Integration Points", [
      "802.1X EAP-TLS Authentication",
      "WiFi WPA3-Enterprise",
      "VPN Client Authentication",
      "Email S/MIME Encryption",
      "Code Signing Certificates",
      "SSL/TLS Server Certificates",
    ])
  }

  const renderJAMFIntegration = (svg: SVGSVGElement) => {
    addTitle(svg, "JAMF Pro Integration for Apple Device Management", 800, 30)

    // Apple Ecosystem
    addSectionLabel(svg, "Apple Device Ecosystem", 200, 80, "#4F46E5")
    createDetailedComponent(svg, 100, 120, "macOS Devices", "#4F46E5", "endpoint", [
      "macOS 12+",
      "System Extensions",
      "Configuration Profiles",
    ])
    createDetailedComponent(svg, 100, 200, "iOS Devices", "#4F46E5", "endpoint", [
      "iOS 15+",
      "Supervised Mode",
      "MDM Enrollment",
    ])
    createDetailedComponent(svg, 100, 280, "iPadOS Devices", "#4F46E5", "endpoint", [
      "iPadOS 15+",
      "Shared iPad",
      "User Enrollment",
    ])
    createDetailedComponent(svg, 100, 360, "Apple TV", "#4F46E5", "endpoint", [
      "tvOS",
      "Conference Room",
      "AirPlay Security",
    ])

    // Network Infrastructure
    addSectionLabel(svg, "Network Access Layer", 450, 80, "#059669")
    createDetailedComponent(svg, 350, 140, `${getVendorLabel(networkVendor)} Switch`, "#059669", "network", [
      "802.1X Port Auth",
      "RADIUS Client",
      "Dynamic VLAN",
    ])
    createDetailedComponent(svg, 350, 220, `${getVendorLabel(networkVendor)} Wireless`, "#059669", "network", [
      "WPA3-Enterprise",
      "802.11ax",
      "Fast Roaming",
    ])
    createDetailedComponent(svg, 350, 300, "Network Access Control", "#059669", "network", [
      "Port Security",
      "MAC Authentication",
      "Guest Network",
    ])

    // Portnox NAC Platform
    addSectionLabel(svg, "Portnox NAC Platform", 700, 80, "#00c8d7")
    createDetailedComponent(svg, 600, 120, "Portnox Cloud RADIUS", "#00c8d7", "nac", [
      "EAP-TLS Support",
      "Certificate Validation",
      "Policy Engine",
    ])
    createDetailedComponent(svg, 600, 200, "Device Profiling Engine", "#00c8d7", "nac", [
      "Apple Device Detection",
      "OS Version Check",
      "Compliance Status",
    ])
    createDetailedComponent(svg, 600, 280, "Policy Decision Point", "#00c8d7", "nac", [
      "JAMF Integration",
      "Compliance Policies",
      "Risk Assessment",
    ])
    createDetailedComponent(svg, 600, 360, "Compliance Monitoring", "#00c8d7", "nac", [
      "Real-time Status",
      "Policy Violations",
      "Remediation Actions",
    ])

    // JAMF Infrastructure
    addSectionLabel(svg, "JAMF Pro Infrastructure", 1000, 80, "#7C3AED")
    createDetailedComponent(svg, 900, 120, "JAMF Pro Server", "#7C3AED", "mdm", [
      "Device Management",
      "Policy Distribution",
      "Inventory Collection",
    ])
    createDetailedComponent(svg, 900, 200, "Apple Business Manager", "#7C3AED", "mdm", [
      "Device Enrollment",
      "Volume Purchasing",
      "Managed Apple IDs",
    ])
    createDetailedComponent(svg, 900, 280, "JAMF Connect", "#7C3AED", "mdm", [
      "Identity Integration",
      "Password Sync",
      "Cloud Identity",
    ])
    createDetailedComponent(svg, 900, 360, "JAMF Protect", "#7C3AED", "mdm", [
      "Endpoint Security",
      "Threat Detection",
      "Compliance Monitoring",
    ])

    // Identity and Cloud Services
    addSectionLabel(svg, "Identity & Cloud Services", 1300, 80, "#0078D4")
    createDetailedComponent(svg, 1200, 140, "Azure Active Directory", "#0078D4", "identity", [
      "Conditional Access",
      "Device Registration",
      "SSO Integration",
    ])
    createDetailedComponent(svg, 1200, 220, "Apple Push Notification", "#0078D4", "cloud", [
      "MDM Commands",
      "Real-time Updates",
      "Device Wake",
    ])
    createDetailedComponent(svg, 1200, 300, "Certificate Authority", "#DC2626", "pki", [
      "Device Certificates",
      "User Certificates",
      "SCEP Enrollment",
    ])

    // Detailed Integration Flows
    createDetailedConnection(svg, 220, 160, 350, 160, "#00c8d7", "802.1X EAP-TLS", [
      "Certificate Authentication",
      "Machine/User Auth",
      "JAMF Certificate",
    ])
    createDetailedConnection(svg, 220, 240, 350, 240, "#00c8d7", "WiFi Authentication", [
      "WPA3-Enterprise",
      "Fast Connect",
      "Seamless Roaming",
    ])
    createDetailedConnection(svg, 220, 320, 350, 320, "#059669", "Network Onboarding", [
      "Automated Enrollment",
      "Certificate Delivery",
      "Profile Installation",
    ])

    createDetailedConnection(svg, 470, 180, 600, 180, "#059669", "RADIUS Authentication", [
      "UDP 1812/1813",
      "EAP Processing",
      "Policy Lookup",
    ])
    createDetailedConnection(svg, 470, 260, 600, 260, "#059669", "Device Profiling", [
      "DHCP Fingerprinting",
      "HTTP User-Agent",
      "Device Classification",
    ])

    createDetailedConnection(svg, 720, 180, 900, 180, "#7C3AED", "JAMF API Integration", [
      "REST API",
      "Device Status",
      "Compliance Check",
    ])
    createDetailedConnection(svg, 720, 260, 900, 260, "#7C3AED", "Policy Synchronization", [
      "Compliance Policies",
      "Configuration Profiles",
      "Security Settings",
    ])
    createDetailedConnection(svg, 720, 340, 900, 340, "#7C3AED", "Real-time Monitoring", [
      "Device Health",
      "Policy Violations",
      "Security Events",
    ])

    createDetailedConnection(svg, 1020, 160, 1200, 160, "#0078D4", "Identity Integration", [
      "Azure AD Sync",
      "User Attributes",
      "Group Membership",
    ])
    createDetailedConnection(svg, 1020, 240, 1200, 240, "#0078D4", "APNs Communication", [
      "MDM Commands",
      "Push Notifications",
      "Device Management",
    ])
    createDetailedConnection(svg, 1020, 320, 1200, 320, "#DC2626", "Certificate Management", [
      "SCEP Enrollment",
      "Certificate Renewal",
      "PKI Integration",
    ])

    // JAMF Workflow Details
    addProtocolBox(svg, 50, 500, "JAMF Enrollment Process", [
      "1. Device Enrollment Program (DEP)",
      "2. User-Initiated Enrollment",
      "3. Configuration Profile Installation",
      "4. Certificate Deployment",
      "5. Policy Application",
      "6. Compliance Verification",
    ])

    addProtocolBox(svg, 400, 500, "Network Access Flow", [
      "1. Device connects to network",
      "2. 802.1X authentication initiated",
      "3. JAMF certificate presented",
      "4. Portnox validates certificate",
      "5. JAMF compliance checked",
      "6. Network access granted/denied",
    ])

    addProtocolBox(svg, 750, 500, "Compliance Policies", [
      "OS Version Requirements",
      "Security Patch Level",
      "Encryption Status",
      "Firewall Configuration",
      "Antivirus Status",
      "Application Restrictions",
    ])

    addProtocolBox(svg, 1100, 500, "Integration Benefits", [
      "Automated Certificate Deployment",
      "Real-time Compliance Monitoring",
      "Seamless User Experience",
      "Centralized Policy Management",
      "Enhanced Security Posture",
      "Audit Trail and Reporting",
    ])
  }

  const renderMerakiWireless = (svg: SVGSVGElement) => {
    addTitle(svg, "Cisco Meraki Wireless Deep-Dive Integration", 800, 30)

    // Client Devices
    addSectionLabel(svg, "Wireless Clients", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Corporate Devices", "#4F46E5", "endpoint", [
      "802.11ax Capable",
      "WPA3 Support",
      "Fast Roaming",
    ])
    createDetailedComponent(svg, 50, 200, "BYOD Devices", "#4F46E5", "endpoint", [
      "Guest Network",
      "Captive Portal",
      "Device Registration",
    ])
    createDetailedComponent(svg, 50, 280, "IoT Devices", "#4F46E5", "endpoint", [
      "2.4GHz Only",
      "WPA2/PSK",
      "Device Profiling",
    ])

    // Meraki Wireless Infrastructure
    addSectionLabel(svg, "Meraki Wireless Infrastructure", 450, 80, "#1BA0D7")
    createDetailedComponent(svg, 350, 120, "Meraki MR46 Access Points", "#1BA0D7", "network", [
      "WiFi 6 (802.11ax)",
      "4x4:4 MU-MIMO",
      "2.5 Gbps Uplink",
    ])
    createDetailedComponent(svg, 350, 200, "Meraki MR56 Access Points", "#1BA0D7", "network", [
      "WiFi 6E",
      "6 GHz Band",
      "8x8:8 MU-MIMO",
    ])
    createDetailedComponent(svg, 350, 280, "Meraki Switch Stack", "#1BA0D7", "network", [
      "MS425 Core",
      "PoE+ Support",
      "RADIUS Integration",
    ])
    createDetailedComponent(svg, 350, 360, "Meraki Security Appliance", "#1BA0D7", "firewall", [
      "MX450 Firewall",
      "SD-WAN",
      "Content Filtering",
    ])

    // Meraki Cloud Management
    addSectionLabel(svg, "Meraki Cloud Platform", 750, 80, "#1BA0D7")
    createDetailedComponent(svg, 650, 120, "Meraki Dashboard", "#1BA0D7", "cloud", [
      "Cloud Management",
      "Zero-Touch Provisioning",
      "Global Orchestration",
    ])
    createDetailedComponent(svg, 650, 200, "Wireless Configuration", "#1BA0D7", "cloud", [
      "SSID Management",
      "RF Optimization",
      "Client Steering",
    ])
    createDetailedComponent(svg, 650, 280, "Security Policies", "#1BA0D7", "cloud", [
      "Firewall Rules",
      "Content Filtering",
      "Threat Protection",
    ])
    createDetailedComponent(svg, 650, 360, "Analytics Engine", "#1BA0D7", "cloud", [
      "Client Analytics",
      "Application Visibility",
      "Performance Metrics",
    ])

    // NAC Integration
    addSectionLabel(svg, "NAC Integration Layer", 1050, 80, "#00c8d7")
    createDetailedComponent(svg, 950, 120, "Portnox Cloud RADIUS", "#00c8d7", "nac", [
      "Cloud RADIUS",
      "Multi-Tenant",
      "Global Reach",
    ])
    createDetailedComponent(svg, 950, 200, "Policy Engine", "#00c8d7", "nac", [
      "Dynamic Policies",
      "Device Profiling",
      "Risk Assessment",
    ])
    createDetailedComponent(svg, 950, 280, "Guest Management", "#00c8d7", "nac", [
      "Self-Service Portal",
      "Sponsor Approval",
      "Time-Limited Access",
    ])
    createDetailedComponent(svg, 950, 360, "Compliance Monitoring", "#00c8d7", "nac", [
      "Device Health",
      "Policy Violations",
      "Remediation",
    ])

    // Identity and External Services
    addSectionLabel(svg, "Identity & External Services", 1350, 80, "#0078D4")
    createDetailedComponent(svg, 1250, 140, "Azure Active Directory", "#0078D4", "identity", [
      "SAML/LDAP",
      "Conditional Access",
      "Multi-Factor Auth",
    ])
    createDetailedComponent(svg, 1250, 220, "Certificate Authority", "#DC2626", "pki", [
      "X.509 Certificates",
      "SCEP Enrollment",
      "Certificate Validation",
    ])
    createDetailedComponent(svg, 1250, 300, "SIEM Integration", "#F59E0B", "security", [
      "Syslog Export",
      "Security Events",
      "Threat Intelligence",
    ])

    // Detailed Wireless Flows
    createDetailedConnection(svg, 170, 160, 350, 160, "#1BA0D7", "802.11 Association", [
      "SSID: Corporate",
      "WPA3-Enterprise",
      "PMF Enabled",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#1BA0D7", "Guest Network", [
      "SSID: Guest",
      "Captive Portal",
      "Bandwidth Limit",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#1BA0D7", "IoT Network", [
      "SSID: IoT",
      "WPA2-PSK",
      "VLAN Isolation",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#1BA0D7", "Cloud Management", [
      "HTTPS 443",
      "Configuration Sync",
      "Firmware Updates",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#1BA0D7", "RF Optimization", [
      "Auto RF",
      "Channel Planning",
      "Power Control",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#1BA0D7", "Client Steering", [
      "Band Steering",
      "Load Balancing",
      "Fast Roaming",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#00c8d7", "RADIUS Authentication", [
      "UDP 1812/1813",
      "EAP Processing",
      "Policy Lookup",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#00c8d7", "Policy Enforcement", [
      "Dynamic VLAN",
      "Firewall Rules",
      "QoS Policies",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#00c8d7", "Guest Portal Integration", [
      "Captive Portal",
      "Self-Registration",
      "Sponsor Approval",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#0078D4", "Identity Lookup", [
      "LDAP/SAML",
      "User Attributes",
      "Group Membership",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#DC2626", "Certificate Validation", [
      "EAP-TLS",
      "Certificate Chain",
      "Revocation Check",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#F59E0B", "Security Logging", [
      "Authentication Events",
      "Policy Violations",
      "Threat Detection",
    ])

    // Meraki-Specific Features
    addProtocolBox(svg, 50, 500, "Meraki Wireless Features", [
      "Auto RF Optimization",
      "Intelligent Load Balancing",
      "Seamless Roaming (802.11r)",
      "Band Steering (5GHz Preference)",
      "Airtime Fairness",
      "Bluetooth Low Energy Beacons",
    ])

    addProtocolBox(svg, 400, 500, "Security Features", [
      "WPA3-Enterprise Support",
      "Protected Management Frames",
      "Rogue AP Detection",
      "Wireless Intrusion Prevention",
      "Air Marshal Security",
      "Layer 7 Firewall Rules",
    ])

    addProtocolBox(svg, 750, 500, "Integration Capabilities", [
      "External RADIUS Server",
      "LDAP/Active Directory",
      "SAML Identity Providers",
      "Syslog Export",
      "SNMP Monitoring",
      "REST API Management",
    ])

    addProtocolBox(svg, 1100, 500, "Analytics & Insights", [
      "Client Connection Analytics",
      "Application Usage Visibility",
      "RF Environment Analysis",
      "Capacity Planning Tools",
      "Performance Benchmarking",
      "Predictive Analytics",
    ])
  }

  const renderMistWireless = (svg: SVGSVGElement) => {
    addTitle(svg, "Juniper Mist AI-Driven Wireless Integration", 800, 30)

    // Client Devices
    addSectionLabel(svg, "Wireless Clients", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Enterprise Devices", "#4F46E5", "endpoint", [
      "WiFi 6E Capable",
      "WPA3 Support",
      "AI-Optimized",
    ])
    createDetailedComponent(svg, 50, 200, "Mobile Devices", "#4F46E5", "endpoint", [
      "iOS/Android",
      "Location Services",
      "BLE Proximity",
    ])
    createDetailedComponent(svg, 50, 280, "IoT Sensors", "#4F46E5", "endpoint", [
      "Environmental",
      "Asset Tracking",
      "Low Power",
    ])

    // Mist Wireless Infrastructure
    addSectionLabel(svg, "Mist Wireless Infrastructure", 450, 80, "#84BD00")
    createDetailedComponent(svg, 350, 120, "Mist AP45 Access Points", "#84BD00", "network", [
      "WiFi 6E",
      "16 BLE Radios",
      "AI-Driven RF",
    ])
    createDetailedComponent(svg, 350, 200, "Mist AP63 Access Points", "#84BD00", "network", [
      "Outdoor WiFi 6",
      "Weather Resistant",
      "Mesh Capable",
    ])
    createDetailedComponent(svg, 350, 280, "Juniper EX Switches", "#84BD00", "network", [
      "Virtual Chassis",
      "PoE++",
      "Mist Integration",
    ])
    createDetailedComponent(svg, 350, 360, "Mist Edge Appliance", "#84BD00", "network", [
      "Local Processing",
      "AI Inference",
      "Edge Computing",
    ])

    // Mist AI Cloud Platform
    addSectionLabel(svg, "Mist AI Cloud Platform", 750, 80, "#84BD00")
    createDetailedComponent(svg, 650, 120, "Mist AI Engine", "#84BD00", "ai", [
      "Machine Learning",
      "Predictive Analytics",
      "Self-Healing Network",
    ])
    createDetailedComponent(svg, 650, 200, "Marvis Virtual Assistant", "#84BD00", "ai", [
      "Natural Language",
      "Proactive Insights",
      "Automated Remediation",
    ])
    createDetailedComponent(svg, 650, 280, "Location Services", "#84BD00", "cloud", [
      "Indoor Positioning",
      "Asset Tracking",
      "Wayfinding",
    ])
    createDetailedComponent(svg, 650, 360, "User Experience Analytics", "#84BD00", "analytics", [
      "SLE Metrics",
      "Client Journey",
      "Performance Insights",
    ])

    // NAC and Security Integration
    addSectionLabel(svg, "NAC & Security Integration", 1050, 80, "#00c8d7")
    createDetailedComponent(svg, 950, 120, "Portnox Cloud Integration", "#00c8d7", "nac", [
      "AI-Enhanced Profiling",
      "Behavioral Analytics",
      "Dynamic Policies",
    ])
    createDetailedComponent(svg, 950, 200, "Security Assurance", "#00c8d7", "security", [
      "Threat Detection",
      "Anomaly Detection",
      "Security Posture",
    ])
    createDetailedComponent(svg, 950, 280, "Policy Automation", "#00c8d7", "automation", [
      "AI-Driven Policies",
      "Self-Remediation",
      "Adaptive Security",
    ])
    createDetailedComponent(svg, 950, 360, "Compliance Monitoring", "#00c8d7", "compliance", [
      "Continuous Assessment",
      "Policy Violations",
      "Audit Trails",
    ])

    // External Integrations
    addSectionLabel(svg, "External Integrations", 1350, 80, "#0078D4")
    createDetailedComponent(svg, 1250, 140, "Identity Providers", "#0078D4", "identity", [
      "Azure AD",
      "Okta",
      "SAML/OIDC",
    ])
    createDetailedComponent(svg, 1250, 220, "SIEM Platforms", "#F59E0B", "security", ["Splunk", "QRadar", "Sentinel"])
    createDetailedComponent(svg, 1250, 300, "ITSM Integration", "#7C3AED", "itsm", [
      "ServiceNow",
      "Jira",
      "Automated Tickets",
    ])

    // AI-Driven Connections
    createDetailedConnection(svg, 170, 160, 350, 160, "#84BD00", "AI-Optimized Connection", [
      "Dynamic Channel",
      "Power Optimization",
      "Interference Mitigation",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#84BD00", "Location-Aware Services", [
      "BLE Beacons",
      "Indoor GPS",
      "Proximity Services",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#84BD00", "IoT Optimization", [
      "Low Latency",
      "Power Management",
      "Predictive Maintenance",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#84BD00", "AI Cloud Processing", [
      "ML Models",
      "Pattern Recognition",
      "Predictive Analytics",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#84BD00", "Marvis AI Insights", [
      "Natural Language",
      "Proactive Alerts",
      "Root Cause Analysis",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#84BD00", "Real-time Analytics", [
      "User Experience",
      "Network Performance",
      "Capacity Planning",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#00c8d7", "AI-Enhanced NAC", [
      "Behavioral Profiling",
      "Anomaly Detection",
      "Dynamic Policies",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#00c8d7", "Security Intelligence", [
      "Threat Correlation",
      "Risk Scoring",
      "Automated Response",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#00c8d7", "Policy Orchestration", [
      "AI-Driven Rules",
      "Adaptive Enforcement",
      "Self-Healing",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#0078D4", "Identity Intelligence", [
      "User Behavior",
      "Device Patterns",
      "Risk Assessment",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#F59E0B", "Security Telemetry", [
      "AI Insights",
      "Threat Intelligence",
      "Incident Correlation",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#7C3AED", "Automated Workflows", [
      "Incident Creation",
      "Remediation Actions",
      "Change Management",
    ])

    // Mist AI Features
    addProtocolBox(svg, 50, 500, "Mist AI Capabilities", [
      "Self-Driving Network Operations",
      "Predictive Analytics & Insights",
      "Automated Problem Resolution",
      "Natural Language Troubleshooting",
      "Proactive Network Optimization",
      "Machine Learning-Based Policies",
    ])

    addProtocolBox(svg, 400, 500, "Service Level Expectations", [
      "Time to Connect (< 10 seconds)",
      "Successful Connect Rate (> 99%)",
      "Throughput Performance",
      "Roaming Success Rate",
      "Coverage Quality Metrics",
      "Capacity Utilization",
    ])

    addProtocolBox(svg, 750, 500, "Location Services", [
      "Sub-meter Indoor Positioning",
      "Asset Tracking & Management",
      "Wayfinding Applications",
      "Proximity-Based Services",
      "Occupancy Analytics",
      "Contact Tracing Capabilities",
    ])

    addProtocolBox(svg, 1100, 500, "AI-Driven Security", [
      "Behavioral Anomaly Detection",
      "Predictive Threat Analysis",
      "Automated Incident Response",
      "Dynamic Risk Assessment",
      "Adaptive Policy Enforcement",
      "Continuous Compliance Monitoring",
    ])
  }

  const renderCiscoTACACS = (svg: SVGSVGElement) => {
    addTitle(svg, "Cisco Device Administration via TACACS+", 800, 30)

    // Network Administrator
    addSectionLabel(svg, "Network Administrators", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Network Admin Workstation", "#4F46E5", "endpoint", [
      "SSH Client",
      "Telnet Client",
      "HTTPS Browser",
    ])
    createDetailedComponent(svg, 50, 200, "Mobile Admin Device", "#4F46E5", "endpoint", [
      "iOS/Android",
      "SSH Apps",
      "VPN Client",
    ])
    createDetailedComponent(svg, 50, 280, "Jump Server", "#4F46E5", "endpoint", [
      "Bastion Host",
      "Privileged Access",
      "Session Recording",
    ])

    // Cisco Infrastructure
    addSectionLabel(svg, "Cisco Network Infrastructure", 450, 80, "#1BA0D7")
    createDetailedComponent(svg, 350, 120, "Cisco Catalyst 9300", "#1BA0D7", "network", [
      "Layer 3 Switch",
      "StackWise-480",
      "TACACS+ Client",
    ])
    createDetailedComponent(svg, 350, 200, "Cisco ISR 4000", "#1BA0D7", "network", [
      "Enterprise Router",
      "SD-WAN",
      "TACACS+ AAA",
    ])
    createDetailedComponent(svg, 350, 280, "Cisco ASA 5500-X", "#1BA0D7", "firewall", [
      "Next-Gen Firewall",
      "VPN Concentrator",
      "TACACS+ Auth",
    ])
    createDetailedComponent(svg, 350, 360, "Cisco Nexus 9000", "#1BA0D7", "network", [
      "Data Center Switch",
      "ACI Fabric",
      "Role-Based Access",
    ])

    // TACACS+ Infrastructure
    addSectionLabel(svg, "TACACS+ Authentication", 750, 80, "#DC2626")
    createDetailedComponent(svg, 650, 120, "Cisco ISE TACACS+", "#DC2626", "tacacs", [
      "Policy Server",
      "Device Admin",
      "Command Authorization",
    ])
    createDetailedComponent(svg, 650, 200, "TACACS+ Proxy", "#DC2626", "tacacs", [
      "Load Balancing",
      "Failover",
      "Protocol Translation",
    ])
    createDetailedComponent(svg, 650, 280, "Command Authorization", "#DC2626", "tacacs", [
      "Privilege Levels",
      "Command Sets",
      "Role-Based Access",
    ])
    createDetailedComponent(svg, 650, 360, "Accounting & Auditing", "#DC2626", "tacacs", [
      "Session Logging",
      "Command Logging",
      "Compliance Reports",
    ])

    // Identity and Directory Services
    addSectionLabel(svg, "Identity & Directory Services", 1050, 80, "#0078D4")
    createDetailedComponent(svg, 950, 120, "Active Directory", "#0078D4", "identity", [
      "Domain Controller",
      "Group Policies",
      "User Authentication",
    ])
    createDetailedComponent(svg, 950, 200, "LDAP Directory", "#0078D4", "identity", [
      "User Attributes",
      "Group Membership",
      "Role Mapping",
    ])
    createDetailedComponent(svg, 950, 280, "Certificate Authority", "#DC2626", "pki", [
      "Admin Certificates",
      "Device Certificates",
      "PKI Authentication",
    ])
    createDetailedComponent(svg, 950, 360, "Multi-Factor Auth", "#7C3AED", "mfa", [
      "RSA SecurID",
      "Duo Security",
      "SMS/Email OTP",
    ])

    // External Systems
    addSectionLabel(svg, "Monitoring & Compliance", 1350, 80, "#F59E0B")
    createDetailedComponent(svg, 1250, 140, "SIEM Platform", "#F59E0B", "security", [
      "Splunk",
      "Log Analysis",
      "Security Monitoring",
    ])
    createDetailedComponent(svg, 1250, 220, "Configuration Management", "#6B7280", "config", [
      "Ansible",
      "Puppet",
      "Change Control",
    ])
    createDetailedComponent(svg, 1250, 300, "Compliance Reporting", "#7C3AED", "compliance", [
      "SOX Compliance",
      "Audit Trails",
      "Risk Assessment",
    ])

    // TACACS+ Authentication Flow
    createDetailedConnection(svg, 170, 160, 350, 160, "#DC2626", "SSH/Telnet Login", [
      "TCP 22/23",
      "Username Prompt",
      "Authentication Request",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#DC2626", "HTTPS Management", [
      "TCP 443",
      "Web Interface",
      "Certificate Auth",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#DC2626", "Console Access", [
      "Serial/USB",
      "Local Authentication",
      "Emergency Access",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#DC2626", "TACACS+ Authentication", [
      "TCP 49",
      "Authentication Request",
      "User Validation",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#DC2626", "Authorization Request", [
      "TCP 49",
      "Command Authorization",
      "Privilege Check",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#DC2626", "Accounting Records", [
      "TCP 49",
      "Session Start/Stop",
      "Command Logging",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#0078D4", "User Authentication", [
      "LDAP Bind",
      "Password Validation",
      "Group Lookup",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#0078D4", "Authorization Lookup", [
      "Group Membership",
      "Role Assignment",
      "Privilege Mapping",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#DC2626", "Certificate Validation", [
      "PKI Authentication",
      "Certificate Chain",
      "CRL Check",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#F59E0B", "Security Logging", [
      "Syslog Export",
      "Authentication Events",
      "Failed Attempts",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#6B7280", "Configuration Sync", [
      "Device Configs",
      "Change Detection",
      "Backup Management",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#7C3AED", "Compliance Data", [
      "Access Reports",
      "Privilege Usage",
      "Audit Trails",
    ])

    // TACACS+ Protocol Details
    addProtocolBox(svg, 50, 500, "TACACS+ Protocol", [
      "TCP Port 49 (Encrypted)",
      "Authentication (Who are you?)",
      "Authorization (What can you do?)",
      "Accounting (What did you do?)",
      "Shared Secret Encryption",
      "Per-Command Authorization",
    ])

    addProtocolBox(svg, 400, 500, "Cisco AAA Configuration", [
      "aaa new-model",
      "tacacs-server host 10.1.1.100",
      "tacacs-server key SharedSecret",
      "aaa authentication login default group tacacs+",
      "aaa authorization exec default group tacacs+",
      "aaa accounting exec default start-stop group tacacs+",
    ])

    addProtocolBox(svg, 750, 500, "Privilege Levels", [
      "Level 0: User EXEC (limited)",
      "Level 1: User EXEC (basic)",
      "Level 15: Privileged EXEC (full)",
      "Custom Levels 2-14",
      "Command Authorization",
      "Role-Based Access Control",
    ])

    addProtocolBox(svg, 1100, 500, "Security Benefits", [
      "Centralized Authentication",
      "Granular Authorization",
      "Comprehensive Accounting",
      "Encrypted Communication",
      "Multi-Factor Authentication",
      "Compliance & Auditing",
    ])
  }

  const renderArubaTACACS = (svg: SVGSVGElement) => {
    addTitle(svg, "Aruba Device Administration via TACACS+", 800, 30)

    // Network Administrators
    addSectionLabel(svg, "Network Administrators", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Admin Workstation", "#4F46E5", "endpoint", [
      "SSH Client",
      "Web Browser",
      "Aruba Central App",
    ])
    createDetailedComponent(svg, 50, 200, "Mobile Management", "#4F46E5", "endpoint", [
      "Aruba Central Mobile",
      "iOS/Android",
      "Remote Access",
    ])
    createDetailedComponent(svg, 50, 280, "Network Operations Center", "#4F46E5", "endpoint", [
      "NOC Workstation",
      "Monitoring Tools",
      "Incident Response",
    ])

    // Aruba Infrastructure
    addSectionLabel(svg, "Aruba Network Infrastructure", 450, 80, "#FF6900")
    createDetailedComponent(svg, 350, 120, "Aruba CX 6300", "#FF6900", "network", [
      "Campus Switch",
      "VSF Stack",
      "TACACS+ Client",
    ])
    createDetailedComponent(svg, 350, 200, "Aruba 9000 Controller", "#FF6900", "network", [
      "Wireless Controller",
      "Mobility Master",
      "Centralized Auth",
    ])
    createDetailedComponent(svg, 350, 280, "Aruba 7000 Gateway", "#FF6900", "network", [
      "Branch Gateway",
      "SD-WAN",
      "VPN Concentrator",
    ])
    createDetailedComponent(svg, 350, 360, "Aruba Central Cloud", "#FF6900", "cloud", [
      "Cloud Management",
      "AI Insights",
      "Zero Touch Provisioning",
    ])

    // TACACS+ Services
    addSectionLabel(svg, "TACACS+ Services", 750, 80, "#DC2626")
    createDetailedComponent(svg, 650, 120, "ClearPass TACACS+", "#DC2626", "tacacs", [
      "Policy Manager",
      "Device Administration",
      "Role-Based Access",
    ])
    createDetailedComponent(svg, 650, 200, "Authentication Server", "#DC2626", "tacacs", [
      "User Validation",
      "Multi-Factor Auth",
      "Certificate Support",
    ])
    createDetailedComponent(svg, 650, 280, "Authorization Engine", "#DC2626", "tacacs", [
      "Command Authorization",
      "Privilege Mapping",
      "Policy Enforcement",
    ])
    createDetailedComponent(svg, 650, 360, "Accounting Services", "#DC2626", "tacacs", [
      "Session Tracking",
      "Command Logging",
      "Audit Reports",
    ])

    // Identity Infrastructure
    addSectionLabel(svg, "Identity Infrastructure", 1050, 80, "#0078D4")
    createDetailedComponent(svg, 950, 120, "Active Directory", "#0078D4", "identity", [
      "Domain Services",
      "Group Policies",
      "Kerberos Auth",
    ])
    createDetailedComponent(svg, 950, 200, "Azure AD Connect", "#0078D4", "identity", [
      "Hybrid Identity",
      "Password Sync",
      "SSO Integration",
    ])
    createDetailedComponent(svg, 950, 280, "RADIUS Integration", "#00c8d7", "radius", [
      "802.1X Auth",
      "Network Access",
      "Policy Sync",
    ])
    createDetailedComponent(svg, 950, 360, "Certificate Services", "#DC2626", "pki", [
      "Admin Certificates",
      "Device Trust",
      "PKI Infrastructure",
    ])

    // Monitoring and Analytics
    addSectionLabel(svg, "Monitoring & Analytics", 1350, 80, "#F59E0B")
    createDetailedComponent(svg, 1250, 140, "Aruba Analytics", "#F59E0B", "analytics", [
      "User Experience",
      "Network Performance",
      "Capacity Planning",
    ])
    createDetailedComponent(svg, 1250, 220, "SIEM Integration", "#F59E0B", "security", [
      "Security Events",
      "Threat Detection",
      "Incident Response",
    ])
    createDetailedComponent(svg, 1250, 300, "Configuration Management", "#6B7280", "config", [
      "Change Control",
      "Backup Management",
      "Compliance",
    ])

    // Aruba TACACS+ Flow
    createDetailedConnection(svg, 170, 160, 350, 160, "#DC2626", "SSH Administrative Access", [
      "TCP 22",
      "Public Key Auth",
      "Command Line Interface",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#DC2626", "Web Management", [
      "HTTPS 443",
      "Certificate Auth",
      "GUI Management",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#FF6900", "Aruba Central Access", [
      "Cloud API",
      "OAuth 2.0",
      "Centralized Management",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#DC2626", "TACACS+ Authentication", [
      "TCP 49",
      "Encrypted Protocol",
      "Shared Secret",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#DC2626", "Command Authorization", [
      "Per-Command Check",
      "Privilege Validation",
      "Policy Lookup",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#DC2626", "Session Accounting", [
      "Start/Stop Records",
      "Command History",
      "Usage Tracking",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#0078D4", "AD Authentication", [
      "LDAP/Kerberos",
      "Domain Validation",
      "Group Membership",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#0078D4", "Hybrid Identity", [
      "Azure AD Sync",
      "Cloud Integration",
      "Federated Auth",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#00c8d7", "Policy Synchronization", [
      "RADIUS Policies",
      "Network Access",
      "User Attributes",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#F59E0B", "Performance Analytics", [
      "User Experience Metrics",
      "Network KPIs",
      "Capacity Data",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#F59E0B", "Security Telemetry", [
      "Authentication Events",
      "Failed Logins",
      "Threat Indicators",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#6B7280", "Configuration Data", [
      "Device Configs",
      "Change Logs",
      "Compliance Status",
    ])

    // Aruba-Specific Features
    addProtocolBox(svg, 50, 500, "Aruba TACACS+ Features", [
      "ClearPass Integration",
      "Role-Based Administration",
      "Multi-Factor Authentication",
      "Certificate-Based Auth",
      "Cloud Management Integration",
      "Granular Command Authorization",
    ])

    addProtocolBox(svg, 400, 500, "Aruba Configuration", [
      "tacacs-server host 10.1.1.100",
      "tacacs-server key ArubaTacacsKey",
      "aaa authentication mgmt-user tacacs local",
      "aaa authorization mgmt-user tacacs local",
      "aaa accounting mgmt-user start-stop tacacs",
      "mgmt-user admin tacacs",
    ])

    addProtocolBox(svg, 750, 500, "Administrative Roles", [
      "Super Administrator (Full Access)",
      "Network Administrator (Config)",
      "Security Administrator (Policies)",
      "Read-Only Administrator (View)",
      "Guest Administrator (Limited)",
      "Custom Roles (Granular)",
    ])

    addProtocolBox(svg, 1100, 500, "Integration Benefits", [
      "Centralized User Management",
      "Consistent Policy Enforcement",
      "Comprehensive Audit Trails",
      "Reduced Administrative Overhead",
      "Enhanced Security Posture",
      "Compliance Reporting",
    ])
  }

  const renderJuniperTACACS = (svg: SVGSVGElement) => {
    addTitle(svg, "Juniper Device Administration via TACACS+", 800, 30)

    // Network Administrators
    addSectionLabel(svg, "Network Administrators", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Admin Workstation", "#4F46E5", "endpoint", [
      "SSH Client",
      "NETCONF Client",
      "Junos Space",
    ])
    createDetailedComponent(svg, 50, 200, "Network Engineer", "#4F46E5", "endpoint", [
      "CLI Access",
      "J-Web Interface",
      "Juniper Networks Mobile",
    ])
    createDetailedComponent(svg, 50, 280, "Operations Center", "#4F46E5", "endpoint", [
      "NOC Dashboard",
      "Monitoring Tools",
      "Incident Management",
    ])

    // Juniper Infrastructure
    addSectionLabel(svg, "Juniper Network Infrastructure", 450, 80, "#84BD00")
    createDetailedComponent(svg, 350, 120, "Juniper EX4300", "#84BD00", "network", [
      "Campus Switch",
      "Virtual Chassis",
      "TACACS+ AAA",
    ])
    createDetailedComponent(svg, 350, 200, "Juniper MX Series", "#84BD00", "network", [
      "Universal Router",
      "Service Edge",
      "MPLS/VPN",
    ])
    createDetailedComponent(svg, 350, 280, "Juniper SRX Series", "#84BD00", "firewall", [
      "Security Gateway",
      "UTM Features",
      "VPN Concentrator",
    ])
    createDetailedComponent(svg, 350, 360, "Juniper QFX Series", "#84BD00", "network", [
      "Data Center Switch",
      "EVPN-VXLAN",
      "Spine-Leaf",
    ])

    // TACACS+ Infrastructure
    addSectionLabel(svg, "TACACS+ Infrastructure", 750, 80, "#DC2626")
    createDetailedComponent(svg, 650, 120, "Juniper Steel-Belted RADIUS", "#DC2626", "tacacs", [
      "AAA Server",
      "Policy Engine",
      "Multi-Protocol",
    ])
    createDetailedComponent(svg, 650, 200, "TACACS+ Authentication", "#DC2626", "tacacs", [
      "User Validation",
      "Template-Based Auth",
      "External Proxy",
    ])
    createDetailedComponent(svg, 650, 280, "Authorization Services", "#DC2626", "tacacs", [
      "Class-Based Access",
      "Command Authorization",
      "Privilege Levels",
    ])
    createDetailedComponent(svg, 650, 360, "Accounting & Logging", "#DC2626", "tacacs", [
      "Session Records",
      "Command Audit",
      "Billing Records",
    ])

    // Identity and External Services
    addSectionLabel(svg, "Identity & External Services", 1050, 80, "#0078D4")
    createDetailedComponent(svg, 950, 120, "Active Directory", "#0078D4", "identity", [
      "LDAP Integration",
      "Kerberos SSO",
      "Group Policies",
    ])
    createDetailedComponent(svg, 950, 200, "External RADIUS", "#00c8d7", "radius", [
      "802.1X Integration",
      "Network Access",
      "Policy Sync",
    ])
    createDetailedComponent(svg, 950, 280, "PKI Infrastructure", "#DC2626", "pki", [
      "Certificate Authority",
      "X.509 Certificates",
      "SSH Key Management",
    ])
    createDetailedComponent(svg, 950, 360, "Multi-Factor Auth", "#7C3AED", "mfa", [
      "RSA Authentication",
      "OATH Tokens",
      "SMS/Email OTP",
    ])

    // Management and Monitoring
    addSectionLabel(svg, "Management & Monitoring", 1350, 80, "#F59E0B")
    createDetailedComponent(svg, 1250, 140, "Junos Space", "#F59E0B", "management", [
      "Network Management",
      "Configuration Templates",
      "Software Management",
    ])
    createDetailedComponent(svg, 1250, 220, "Contrail Insights", "#F59E0B", "analytics", [
      "Network Analytics",
      "Performance Monitoring",
      "Troubleshooting",
    ])
    createDetailedComponent(svg, 1250, 300, "SIEM Integration", "#F59E0B", "security", [
      "Security Analytics",
      "Log Correlation",
      "Threat Detection",
    ])

    // Juniper TACACS+ Authentication Flow
    createDetailedConnection(svg, 170, 160, 350, 160, "#DC2626", "SSH/NETCONF Access", [
      "TCP 22/830",
      "Public Key Auth",
      "Junos CLI",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#DC2626", "J-Web Management", [
      "HTTPS 443",
      "Certificate Auth",
      "Web Interface",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#84BD00", "SNMP Management", [
      "UDP 161/162",
      "Community Strings",
      "MIB Access",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#DC2626", "TACACS+ Authentication", [
      "TCP 49",
      "Encrypted Channel",
      "Shared Secret",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#DC2626", "Command Authorization", [
      "Per-Command Check",
      "Class-Based Access",
      "Template Matching",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#DC2626", "Session Accounting", [
      "Start/Stop/Update",
      "Command History",
      "Resource Usage",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#0078D4", "LDAP Authentication", [
      "TCP 389/636",
      "Bind Operations",
      "Attribute Lookup",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#00c8d7", "RADIUS Integration", [
      "UDP 1812/1813",
      "Shared Policies",
      "Attribute Exchange",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#DC2626", "Certificate Validation", [
      "X.509 Verification",
      "CRL/OCSP Check",
      "Trust Chain",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#F59E0B", "Configuration Management", [
      "NETCONF/YANG",
      "Template Deployment",
      "Change Control",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#F59E0B", "Performance Analytics", [
      "Telemetry Data",
      "KPI Monitoring",
      "Capacity Planning",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#F59E0B", "Security Monitoring", [
      "Authentication Logs",
      "Failed Attempts",
      "Anomaly Detection",
    ])

    // Juniper-Specific Configuration
    addProtocolBox(svg, 50, 500, "Junos TACACS+ Config", [
      "set system tacplus-server 10.1.1.100",
      "set system tacplus-server secret JuniperSecret",
      "set system authentication order tacplus",
      "set system login class network-admin permissions all",
      "set system login user admin class network-admin",
      "set system accounting events login",
    ])

    addProtocolBox(svg, 400, 500, "Authentication Methods", [
      "Local User Database",
      "TACACS+ External Server",
      "RADIUS Authentication",
      "LDAP/Active Directory",
      "SSH Public Key Authentication",
      "Certificate-Based Authentication",
    ])

    addProtocolBox(svg, 750, 500, "Authorization Classes", [
      "super-user (Full Access)",
      "operator (Operational Commands)",
      "read-only (View Configuration)",
      "unauthorized (No Access)",
      "Custom Classes (Granular)",
      "Template-Based Permissions",
    ])

    addProtocolBox(svg, 1100, 500, "Juniper Benefits", [
      "Centralized AAA Management",
      "Granular Command Authorization",
      "Comprehensive Audit Logging",
      "Integration with Junos Space",
      "NETCONF/YANG Support",
      "Zero Touch Provisioning",
    ])
  }

  const renderPaloAltoUserID = (svg: SVGSVGElement) => {
    addTitle(svg, "Palo Alto User-ID Integration via Syslog", 800, 30)

    // Corporate Users
    addSectionLabel(svg, "Corporate Users", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Domain Users", "#4F46E5", "endpoint", [
      "Windows Workstations",
      "Active Directory",
      "Kerberos Auth",
    ])
    createDetailedComponent(svg, 50, 200, "Remote Users", "#4F46E5", "endpoint", [
      "VPN Clients",
      "Mobile Devices",
      "SSL VPN",
    ])
    createDetailedComponent(svg, 50, 280, "Guest Users", "#4F46E5", "endpoint", [
      "Captive Portal",
      "Temporary Access",
      "Limited Privileges",
    ])

    // NAC Platform
    addSectionLabel(svg, "Portnox NAC Platform", 450, 80, "#00c8d7")
    createDetailedComponent(svg, 350, 120, "Portnox Cloud", "#00c8d7", "nac", [
      "Authentication Engine",
      "Policy Decision",
      "User Context",
    ])
    createDetailedComponent(svg, 350, 200, "RADIUS Server", "#00c8d7", "nac", [
      "802.1X Authentication",
      "User Identification",
      "Session Tracking",
    ])
    createDetailedComponent(svg, 350, 280, "Policy Engine", "#00c8d7", "nac", [
      "Dynamic Policies",
      "User Profiling",
      "Risk Assessment",
    ])
    createDetailedComponent(svg, 350, 360, "Event Correlation", "#00c8d7", "nac", [
      "User Sessions",
      "Network Events",
      "Security Context",
    ])

    // Syslog Integration Layer
    addSectionLabel(svg, "Syslog Integration", 750, 80, "#7C3AED")
    createDetailedComponent(svg, 650, 120, "Syslog Container", "#7C3AED", "syslog", [
      "Log Aggregation",
      "Event Processing",
      "Message Parsing",
    ])
    createDetailedComponent(svg, 650, 200, "User-ID Mapping", "#7C3AED", "syslog", [
      "IP-to-User Mapping",
      "Session Correlation",
      "Real-time Updates",
    ])
    createDetailedComponent(svg, 650, 280, "Event Enrichment", "#7C3AED", "syslog", [
      "User Context",
      "Device Information",
      "Location Data",
    ])
    createDetailedComponent(svg, 650, 360, "Log Forwarding", "#7C3AED", "syslog", [
      "Syslog Protocol",
      "Secure Transport",
      "Message Formatting",
    ])

    // Palo Alto Infrastructure
    addSectionLabel(svg, "Palo Alto Security Platform", 1050, 80, "#FF6B35")
    createDetailedComponent(svg, 950, 120, "User-ID Agent", "#FF6B35", "userid", [
      "User Mapping",
      "Session Monitoring",
      "Identity Correlation",
    ])
    createDetailedComponent(svg, 950, 200, "Palo Alto Firewall", "#FF6B35", "firewall", [
      "Next-Gen Firewall",
      "App-ID",
      "User-ID Integration",
    ])
    createDetailedComponent(svg, 950, 280, "Panorama Management", "#FF6B35", "management", [
      "Centralized Management",
      "Policy Distribution",
      "Log Collection",
    ])
    createDetailedComponent(svg, 950, 360, "Prisma Access", "#FF6B35", "cloud", [
      "SASE Platform",
      "Cloud Security",
      "Remote Access",
    ])

    // Identity and External Services
    addSectionLabel(svg, "Identity Services", 1350, 80, "#0078D4")
    createDetailedComponent(svg, 1250, 140, "Active Directory", "#0078D4", "identity", [
      "Domain Controller",
      "User Database",
      "Group Policies",
    ])
    createDetailedComponent(svg, 1250, 220, "DNS Services", "#6B7280", "dns", [
      "Name Resolution",
      "Reverse Lookup",
      "IP-to-Hostname",
    ])
    createDetailedComponent(svg, 1250, 300, "SIEM Platform", "#F59E0B", "security", [
      "Security Analytics",
      "Threat Detection",
      "Incident Response",
    ])

    // User-ID Integration Flow
    createDetailedConnection(svg, 170, 160, 350, 160, "#00c8d7", "Network Authentication", [
      "802.1X EAP-TLS",
      "User Identification",
      "IP Assignment",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#00c8d7", "VPN Authentication", [
      "SSL/IPSec VPN",
      "Remote Access",
      "Tunnel Establishment",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#00c8d7", "Captive Portal", [
      "Web Authentication",
      "Guest Registration",
      "Terms Acceptance",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#7C3AED", "Authentication Events", [
      "Syslog UDP 514",
      "User Login Events",
      "Session Start/Stop",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#7C3AED", "Session Tracking", [
      "IP-to-User Mapping",
      "Session Duration",
      "Bandwidth Usage",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#7C3AED", "Policy Events", [
      "Access Decisions",
      "Policy Violations",
      "Risk Scores",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#FF6B35", "User-ID Updates", [
      "XML API",
      "User Mapping",
      "Real-time Sync",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#FF6B35", "Security Policies", [
      "User-Based Rules",
      "Application Control",
      "Threat Prevention",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#FF6B35", "Log Correlation", [
      "Traffic Logs",
      "Threat Logs",
      "User Activity",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#0078D4", "User Lookup", [
      "LDAP Queries",
      "User Attributes",
      "Group Membership",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#6B7280", "IP Resolution", [
      "DNS Queries",
      "Hostname Lookup",
      "Network Mapping",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#F59E0B", "Security Intelligence", [
      "User Behavior",
      "Threat Correlation",
      "Risk Analysis",
    ])

    // User-ID Configuration Details
    addProtocolBox(svg, 50, 500, "Syslog Message Format", [
      "Timestamp: 2024-01-15T10:30:00Z",
      "Facility: Local0 (16)",
      "Severity: Informational (6)",
      "Message: User john.doe authenticated",
      "IP Address: 192.168.1.100",
      "Session ID: ABC123456789",
    ])

    addProtocolBox(svg, 400, 500, "User-ID Agent Config", [
      "Syslog Sender Configuration",
      "User Mapping Timeout (3600s)",
      "Redistribution Settings",
      "Monitoring Interval (60s)",
      "Log Level Configuration",
      "API Authentication",
    ])

    addProtocolBox(svg, 750, 500, "Security Policy Benefits", [
      "User-Based Security Rules",
      "Application Control per User",
      "Bandwidth Management",
      "Threat Prevention Policies",
      "Data Loss Prevention",
      "Compliance Reporting",
    ])

    addProtocolBox(svg, 1100, 500, "Integration Advantages", [
      "Real-time User Identification",
      "Seamless Policy Enforcement",
      "Comprehensive Visibility",
      "Reduced Administrative Overhead",
      "Enhanced Security Posture",
      "Audit Trail Correlation",
    ])
  }

  const renderFortiGateFSSO = (svg: SVGSVGElement) => {
    addTitle(svg, "FortiGate FSSO Integration via Syslog", 800, 30)

    // Corporate Users
    addSectionLabel(svg, "Corporate Users", 150, 80, "#4F46E5")
    createDetailedComponent(svg, 50, 120, "Domain Workstations", "#4F46E5", "endpoint", [
      "Windows 10/11",
      "Domain Joined",
      "Kerberos SSO",
    ])
    createDetailedComponent(svg, 50, 200, "Mobile Devices", "#4F46E5", "endpoint", [
      "iOS/Android",
      "VPN Clients",
      "Certificate Auth",
    ])
    createDetailedComponent(svg, 50, 280, "Remote Workers", "#4F46E5", "endpoint", [
      "Home Office",
      "SSL VPN",
      "Multi-Factor Auth",
    ])

    // NAC Authentication Platform
    addSectionLabel(svg, "Portnox NAC Platform", 450, 80, "#00c8d7")
    createDetailedComponent(svg, 350, 120, "Portnox Authentication", "#00c8d7", "nac", [
      "User Authentication",
      "Device Profiling",
      "Policy Engine",
    ])
    createDetailedComponent(svg, 350, 200, "Session Management", "#00c8d7", "nac", [
      "User Sessions",
      "IP Tracking",
      "Timeout Handling",
    ])
    createDetailedComponent(svg, 350, 280, "Policy Enforcement", "#00c8d7", "nac", [
      "Access Control",
      "VLAN Assignment",
      "QoS Policies",
    ])
    createDetailedComponent(svg, 350, 360, "Event Generation", "#00c8d7", "nac", [
      "Authentication Events",
      "Session Events",
      "Policy Events",
    ])

    // Syslog Integration Layer
    addSectionLabel(svg, "Syslog Integration", 750, 80, "#7C3AED")
    createDetailedComponent(svg, 650, 120, "Syslog Container", "#7C3AED", "syslog", [
      "Log Collection",
      "Event Processing",
      "Message Parsing",
    ])
    createDetailedComponent(svg, 650, 200, "FSSO Mapping", "#7C3AED", "syslog", [
      "User-to-IP Mapping",
      "Session Correlation",
      "Group Assignment",
    ])
    createDetailedComponent(svg, 650, 280, "Event Enrichment", "#7C3AED", "syslog", [
      "User Context",
      "Device Info",
      "Location Data",
    ])
    createDetailedComponent(svg, 650, 360, "Message Forwarding", "#7C3AED", "syslog", [
      "Fortinet Format",
      "Secure Transport",
      "Real-time Delivery",
    ])

    // FortiGate Infrastructure
    addSectionLabel(svg, "FortiGate Security Platform", 1050, 80, "#EE3124")
    createDetailedComponent(svg, 950, 120, "FSSO Agent", "#EE3124", "fsso", [
      "User Authentication",
      "Group Mapping",
      "Session Tracking",
    ])
    createDetailedComponent(svg, 950, 200, "FortiGate Firewall", "#EE3124", "firewall", [
      "Next-Gen Firewall",
      "Application Control",
      "User Identity",
    ])
    createDetailedComponent(svg, 950, 280, "FortiManager", "#EE3124", "management", [
      "Centralized Management",
      "Policy Distribution",
      "Configuration",
    ])
    createDetailedComponent(svg, 950, 360, "FortiAnalyzer", "#EE3124", "analytics", [
      "Log Analysis",
      "Reporting",
      "Security Analytics",
    ])

    // Identity and External Services
    addSectionLabel(svg, "Identity & External Services", 1350, 80, "#0078D4")
    createDetailedComponent(svg, 1250, 140, "Active Directory", "#0078D4", "identity", [
      "Domain Controller",
      "User Groups",
      "Authentication",
    ])
    createDetailedComponent(svg, 1250, 220, "DNS Services", "#6B7280", "dns", [
      "Name Resolution",
      "IP-to-Hostname",
      "Domain Lookup",
    ])
    createDetailedComponent(svg, 1250, 300, "Certificate Authority", "#DC2626", "pki", [
      "User Certificates",
      "Device Certificates",
      "PKI Trust",
    ])

    // FSSO Integration Flow
    createDetailedConnection(svg, 170, 160, 350, 160, "#00c8d7", "User Authentication", [
      "802.1X/Captive Portal",
      "Credential Validation",
      "Session Establishment",
    ])
    createDetailedConnection(svg, 170, 240, 350, 240, "#00c8d7", "Device Registration", [
      "MAC Authentication",
      "Device Profiling",
      "Certificate Enrollment",
    ])
    createDetailedConnection(svg, 170, 320, 350, 320, "#00c8d7", "VPN Authentication", [
      "SSL/IPSec VPN",
      "Remote Access",
      "Tunnel Setup",
    ])

    createDetailedConnection(svg, 470, 160, 650, 160, "#7C3AED", "Authentication Logs", [
      "Syslog UDP 514",
      "User Login Events",
      "Success/Failure",
    ])
    createDetailedConnection(svg, 470, 240, 650, 240, "#7C3AED", "Session Events", [
      "Session Start/Stop",
      "IP Assignment",
      "Duration Tracking",
    ])
    createDetailedConnection(svg, 470, 320, 650, 320, "#7C3AED", "Policy Events", [
      "Access Granted/Denied",
      "VLAN Assignment",
      "QoS Application",
    ])

    createDetailedConnection(svg, 770, 160, 950, 160, "#EE3124", "FSSO Updates", [
      "Fortinet Protocol",
      "User-IP Mapping",
      "Group Information",
    ])
    createDetailedConnection(svg, 770, 240, 950, 240, "#EE3124", "Security Policies", [
      "User-Based Rules",
      "Application Control",
      "Web Filtering",
    ])
    createDetailedConnection(svg, 770, 320, 950, 320, "#EE3124", "Session Monitoring", [
      "Active Sessions",
      "Bandwidth Usage",
      "Application Usage",
    ])

    createDetailedConnection(svg, 1070, 180, 1250, 180, "#0078D4", "User Validation", [
      "LDAP Lookup",
      "Group Membership",
      "User Attributes",
    ])
    createDetailedConnection(svg, 1070, 260, 1250, 260, "#6B7280", "Hostname Resolution", [
      "DNS Queries",
      "IP-to-Name Mapping",
      "Network Discovery",
    ])
    createDetailedConnection(svg, 1070, 340, 1250, 340, "#DC2626", "Certificate Validation", [
      "PKI Verification",
      "Trust Chain",
      "Revocation Check",
    ])

    // FSSO Configuration Details
    addProtocolBox(svg, 50, 500, "FSSO Syslog Format", [
      "Timestamp: Jan 15 10:30:00",
      "Host: portnox-nac",
      "Process: authentication",
      "Message: User login successful",
      "User: domain\\username",
      "IP: 192.168.1.100",
    ])

    addProtocolBox(svg, 400, 500, "FortiGate FSSO Config", [
      "config user fsso",
      "set server 10.1.1.200",
      "set password FssoPassword",
      "set source-ip 10.1.1.1",
      "config user group",
      "set group-type fsso-service",
      "end",
    ])

    addProtocolBox(svg, 750, 500, "Security Policy Features", [
      "User-Based Firewall Rules",
      "Application Control per User",
      "Web Content Filtering",
      "Bandwidth Management",
      "Intrusion Prevention",
      "Data Loss Prevention",
    ])

    addProtocolBox(svg, 1100, 500, "FSSO Benefits", [
      "Transparent User Identification",
      "Single Sign-On Experience",
      "Granular Policy Control",
      "Real-time Session Tracking",
      "Comprehensive Logging",
      "Simplified Administration",
    ])
  }

  // Helper functions for creating detailed components and connections
  const createDetailedComponent = (
    svg: SVGSVGElement,
    x: number,
    y: number,
    label: string,
    color: string,
    type: string,
    details: string[],
  ) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    group.setAttribute("class", "component detailed-component")
    group.setAttribute("data-type", type)
    group.setAttribute("data-label", label)
    group.style.cursor = "pointer"

    // Main component rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rect.setAttribute("x", x.toString())
    rect.setAttribute("y", y.toString())
    rect.setAttribute("width", "160")
    rect.setAttribute("height", "60")
    rect.setAttribute("rx", "8")
    rect.setAttribute("fill", color)
    rect.setAttribute("stroke", "#ffffff")
    rect.setAttribute("stroke-width", "2")
    rect.setAttribute("opacity", "0.9")

    // Component title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text")
    title.setAttribute("x", (x + 80).toString())
    title.setAttribute("y", (y + 18).toString())
    title.setAttribute("text-anchor", "middle")
    title.setAttribute("fill", "white")
    title.setAttribute("font-size", "11")
    title.setAttribute("font-weight", "bold")
    title.textContent = label

    // Component details
    details.forEach((detail, index) => {
      const detailText = document.createElementNS("http://www.w3.org/2000/svg", "text")
      detailText.setAttribute("x", (x + 80).toString())
      detailText.setAttribute("y", (y + 32 + index * 10).toString())
      detailText.setAttribute("text-anchor", "middle")
      detailText.setAttribute("fill", "white")
      detailText.setAttribute("font-size", "8")
      detailText.setAttribute("opacity", "0.9")
      detailText.textContent = detail
      group.appendChild(detailText)
    })

    group.appendChild(rect)
    group.appendChild(title)

    // Add click handler
    group.addEventListener("click", () => {
      setSelectedComponent(label)
    })

    // Add hover effects
    group.addEventListener("mouseenter", () => {
      rect.setAttribute("opacity", "1")
      rect.setAttribute("stroke-width", "3")
    })

    group.addEventListener("mouseleave", () => {
      rect.setAttribute("opacity", "0.9")
      rect.setAttribute("stroke-width", "2")
    })

    svg.appendChild(group)
  }

  const createDetailedConnection = (
    svg: SVGSVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    label: string,
    details: string[],
  ) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    group.setAttribute("class", "connection detailed-connection")

    // Connection line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("x1", x1.toString())
    line.setAttribute("y1", y1.toString())
    line.setAttribute("x2", x2.toString())
    line.setAttribute("y2", y2.toString())
    line.setAttribute("stroke", color)
    line.setAttribute("stroke-width", "3")
    line.setAttribute("opacity", "0.8")

    // Arrow marker
    const defs = svg.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
    if (!svg.querySelector("defs")) {
      svg.appendChild(defs)
    }

    const markerId = `arrow-${color.replace("#", "")}`
    if (!defs.querySelector(`#${markerId}`)) {
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker")
      marker.setAttribute("id", markerId)
      marker.setAttribute("markerWidth", "12")
      marker.setAttribute("markerHeight", "12")
      marker.setAttribute("refX", "10")
      marker.setAttribute("refY", "6")
      marker.setAttribute("orient", "auto")

      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
      polygon.setAttribute("points", "0,0 0,12 12,6")
      polygon.setAttribute("fill", color)

      marker.appendChild(polygon)
      defs.appendChild(marker)
    }

    line.setAttribute("marker-end", `url(#${markerId})`)

    // Connection label background
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2

    const labelBg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    labelBg.setAttribute("x", (midX - 40).toString())
    labelBg.setAttribute("y", (midY - 25).toString())
    labelBg.setAttribute("width", "80")
    labelBg.setAttribute("height", "50")
    labelBg.setAttribute("rx", "6")
    labelBg.setAttribute("fill", "white")
    labelBg.setAttribute("stroke", color)
    labelBg.setAttribute("stroke-width", "1")
    labelBg.setAttribute("opacity", "0.95")

    // Main label
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    labelText.setAttribute("x", midX.toString())
    labelText.setAttribute("y", (midY - 10).toString())
    labelText.setAttribute("text-anchor", "middle")
    labelText.setAttribute("fill", color)
    labelText.setAttribute("font-size", "9")
    labelText.setAttribute("font-weight", "bold")
    labelText.textContent = label

    // Detail labels
    details.forEach((detail, index) => {
      const detailText = document.createElementNS("http://www.w3.org/2000/svg", "text")
      detailText.setAttribute("x", midX.toString())
      detailText.setAttribute("y", (midY + index * 8).toString())
      detailText.setAttribute("text-anchor", "middle")
      detailText.setAttribute("fill", "#374151")
      detailText.setAttribute("font-size", "7")
      detailText.textContent = detail
      group.appendChild(detailText)
    })

    group.appendChild(line)
    group.appendChild(labelBg)
    group.appendChild(labelText)

    svg.appendChild(group)
  }

  const addTitle = (svg: SVGSVGElement, title: string, x: number, y: number) => {
    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    titleText.setAttribute("x", x.toString())
    titleText.setAttribute("y", y.toString())
    titleText.setAttribute("text-anchor", "middle")
    titleText.setAttribute("fill", "#1f2937")
    titleText.setAttribute("font-size", "24")
    titleText.setAttribute("font-weight", "bold")
    titleText.textContent = title
    svg.appendChild(titleText)
  }

  const addSectionLabel = (svg: SVGSVGElement, label: string, x: number, y: number, color: string) => {
    const labelBg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    labelBg.setAttribute("x", (x - 50).toString())
    labelBg.setAttribute("y", (y - 15).toString())
    labelBg.setAttribute("width", "200")
    labelBg.setAttribute("height", "25")
    labelBg.setAttribute("rx", "12")
    labelBg.setAttribute("fill", color)
    labelBg.setAttribute("opacity", "0.1")

    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    labelText.setAttribute("x", x.toString())
    labelText.setAttribute("y", y.toString())
    labelText.setAttribute("text-anchor", "middle")
    labelText.setAttribute("fill", color)
    labelText.setAttribute("font-size", "14")
    labelText.setAttribute("font-weight", "bold")
    labelText.textContent = label

    svg.appendChild(labelBg)
    svg.appendChild(labelText)
  }

  const addProtocolBox = (svg: SVGSVGElement, x: number, y: number, title: string, items: string[]) => {
    const boxHeight = 20 + items.length * 15

    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    box.setAttribute("x", x.toString())
    box.setAttribute("y", y.toString())
    box.setAttribute("width", "300")
    box.setAttribute("height", boxHeight.toString())
    box.setAttribute("rx", "8")
    box.setAttribute("fill", "#f8fafc")
    box.setAttribute("stroke", "#e2e8f0")
    box.setAttribute("stroke-width", "1")

    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    titleText.setAttribute("x", (x + 10).toString())
    titleText.setAttribute("y", (y + 15).toString())
    titleText.setAttribute("fill", "#1f2937")
    titleText.setAttribute("font-size", "12")
    titleText.setAttribute("font-weight", "bold")
    titleText.textContent = title

    svg.appendChild(box)
    svg.appendChild(titleText)

    items.forEach((item, index) => {
      const itemText = document.createElementNS("http://www.w3.org/2000/svg", "text")
      itemText.setAttribute("x", (x + 15).toString())
      itemText.setAttribute("y", (y + 30 + index * 15).toString())
      itemText.setAttribute("fill", "#4b5563")
      itemText.setAttribute("font-size", "10")
      itemText.textContent = `• ${item}`
      svg.appendChild(itemText)
    })
  }

  const addNetworkZone = (
    svg: SVGSVGElement,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    color: string,
    opacity: number,
  ) => {
    const zone = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    zone.setAttribute("x", x.toString())
    zone.setAttribute("y", y.toString())
    zone.setAttribute("width", width.toString())
    zone.setAttribute("height", height.toString())
    zone.setAttribute("rx", "12")
    zone.setAttribute("fill", color)
    zone.setAttribute("opacity", opacity.toString())
    zone.setAttribute("stroke", color)
    zone.setAttribute("stroke-width", "2")
    zone.setAttribute("stroke-dasharray", "5,5")

    const zoneLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    zoneLabel.setAttribute("x", (x + width / 2).toString())
    zoneLabel.setAttribute("y", (y + height + 15).toString())
    zoneLabel.setAttribute("text-anchor", "middle")
    zoneLabel.setAttribute("fill", color)
    zoneLabel.setAttribute("font-size", "12")
    zoneLabel.setAttribute("font-weight", "bold")
    zoneLabel.textContent = label

    svg.appendChild(zone)
    svg.appendChild(zoneLabel)
  }

  const addLabel = (svg: SVGSVGElement, x: number, y: number, text: string, color: string, fontSize = "12") => {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
    label.setAttribute("x", x.toString())
    label.setAttribute("y", y.toString())
    label.setAttribute("text-anchor", "middle")
    label.setAttribute("fill", color)
    label.setAttribute("font-size", fontSize)
    label.textContent = text
    svg.appendChild(label)
  }

  const addAnimations = (svg: SVGSVGElement) => {
    if (!isAnimating) return

    const connections = svg.querySelectorAll(".detailed-connection line")
    connections.forEach((line, index) => {
      const animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animate")
      animateElement.setAttribute("attributeName", "stroke-dasharray")
      animateElement.setAttribute("values", "0,20;20,0;0,20")
      animateElement.setAttribute("dur", `${3 / animationSpeed}s`)
      animateElement.setAttribute("repeatCount", "indefinite")
      animateElement.setAttribute("begin", `${index * 0.3}s`)
      line.appendChild(animateElement)
    })

    // Add pulsing animation to components
    const components = svg.querySelectorAll(".detailed-component rect")
    components.forEach((rect, index) => {
      const animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animate")
      animateElement.setAttribute("attributeName", "opacity")
      animateElement.setAttribute("values", "0.9;1;0.9")
      animateElement.setAttribute("dur", `${4 / animationSpeed}s`)
      animateElement.setAttribute("repeatCount", "indefinite")
      animateElement.setAttribute("begin", `${index * 0.2}s`)
      rect.appendChild(animateElement)
    })
  }

  // Helper functions for vendor and provider labels
  const getVendorLabel = (vendor: string) => {
    const vendorMap: Record<string, string> = {
      cisco: "Cisco",
      aruba: "Aruba",
      juniper: "Juniper",
      extreme: "Extreme",
      ruckus: "Ruckus",
      fortinet: "FortiNet",
      paloalto: "Palo Alto",
      meraki: "Meraki",
      mist: "Mist",
      ubiquiti: "Ubiquiti",
      netgear: "Netgear",
      dlink: "D-Link",
      tplink: "TP-Link",
      huawei: "Huawei",
      alcatel: "Alcatel",
      dell: "Dell",
      hpe: "HPE",
      brocade: "Brocade",
    }
    return vendorMap[vendor] || "Network"
  }

  const getCloudProviderLabel = (provider: string) => {
    const providerMap: Record<string, string> = {
      aws: "AWS Cloud",
      azure: "Azure Cloud",
      gcp: "Google Cloud",
      onprem: "On-Premises",
    }
    return providerMap[provider] || "Cloud"
  }

  const getConnectivityLabel = (connectivity: string) => {
    const connectivityMap: Record<string, string> = {
      sdwan: "SD-WAN",
      expressroute: "Express Route",
      directconnect: "Direct Connect",
      mpls: "MPLS",
      vpn: "VPN Gateway",
      internet: "Internet",
    }
    return connectivityMap[connectivity] || "Network"
  }

  const getConnectivityColor = (connectivity: string) => {
    const colorMap: Record<string, string> = {
      sdwan: "#059669",
      expressroute: "#0078D4",
      directconnect: "#FF9900",
      mpls: "#7C3AED",
      vpn: "#EF4444",
      internet: "#6B7280",
    }
    return colorMap[connectivity] || "#059669"
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev)
  }

  return (
    <TooltipProvider>
      <Card className="architecture-diagram">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{view}</Badge>
            {selectedComponent && <Badge variant="secondary">Selected: {selectedComponent}</Badge>}
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={toggleAnimation}>
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isAnimating ? "Pause Animation" : "Play Animation"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleResetZoom}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="p-4">
          <div
            className="border rounded-lg overflow-auto bg-white"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left", maxHeight: "700px" }}
          >
            <svg ref={svgRef} className="w-full h-auto" style={{ minHeight: "700px" }} />
          </div>
        </div>

        {selectedComponent && (
          <div className="p-4 border-t bg-gray-50">
            <h4 className="font-semibold mb-2">Component Details: {selectedComponent}</h4>
            <p className="text-sm text-gray-600">
              Click on components in the diagram to view detailed information and configuration options.
            </p>
          </div>
        )}
      </Card>
    </TooltipProvider>
  )
}
