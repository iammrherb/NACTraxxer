"use client"

import React from "react"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Cloud,
  Server,
  Wifi,
  Shield,
  Users,
  Smartphone,
  Laptop,
  Router,
  Key,
  Globe,
  Activity,
  Printer,
  Antenna,
  CheckCircle,
  Info,
  Database,
  Network,
  Monitor,
  Building,
  MapPin,
  CheckCircle2,
} from "lucide-react"

interface InteractiveDiagramProps {
  view: string
  config?: {
    cloudProvider?: string
    networkVendor?: string
    connectivityType?: string
    identityProvider?: string
    mdmProvider?: string
    firewallVendor?: string
    radiusType?: string
    pkiProvider?: string
    wirelessVendor?: string
    deviceTypes?: string[]
    byodSupport?: boolean
    guestPortal?: boolean
  }
  isAnimating?: boolean
  animationSpeed?: number
  showLegend?: boolean
  className?: string
}

export default function InteractiveDiagram({
  view,
  config = {},
  isAnimating = true,
  animationSpeed = 1,
  showLegend = true,
  className,
}: InteractiveDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  // Default config values
  const safeConfig = {
    cloudProvider: config.cloudProvider || "aws",
    networkVendor: config.networkVendor || "cisco",
    connectivityType: config.connectivityType || "sdwan",
    identityProvider: config.identityProvider || "azure-ad",
    mdmProvider: config.mdmProvider || "intune",
    firewallVendor: config.firewallVendor || "palo-alto",
    radiusType: config.radiusType || "cisco-ise",
    pkiProvider: config.pkiProvider || "microsoft-ca",
    wirelessVendor: config.wirelessVendor || "cisco-meraki",
    deviceTypes: config.deviceTypes || ["windows", "mac", "ios", "android", "iot"],
    byodSupport: config.byodSupport !== undefined ? config.byodSupport : true,
    guestPortal: config.guestPortal !== undefined ? config.guestPortal : true,
  }

  const componentDetails = {
    "portnox-cloud": {
      name: "Portnox Cloud NAC",
      description: "Cloud-based Network Access Control platform with global reach and enterprise-grade security",
      specs: [
        "99.9% SLA uptime guarantee",
        "Global edge locations for low latency",
        "Auto-scaling infrastructure",
        "SOC 2 Type II certified",
        "GDPR & HIPAA compliant",
        "Real-time policy enforcement",
        "Advanced threat detection",
        "Certificate lifecycle management",
      ],
      ports: ["HTTPS:443", "RADIUS:1812/1813", "LDAPS:636", "SYSLOG:514"],
      protocols: ["RADIUS", "LDAP", "SAML 2.0", "OAuth 2.0", "REST API", "GraphQL"],
      metrics: {
        uptime: "99.97%",
        latency: "< 50ms",
        throughput: "10M auth/hour",
        users: "500K+ active",
      },
    },
    "identity-provider": {
      name: safeConfig.identityProvider === "azure-ad" ? "Microsoft Azure AD" : "Identity Provider",
      description: "Centralized identity and access management with advanced security features",
      specs: [
        "Multi-factor authentication support",
        "Conditional access policies",
        "Single sign-on (SSO) integration",
        "Identity governance and lifecycle",
        "Risk-based authentication",
        "Privileged identity management",
        "Identity protection and monitoring",
        "Seamless hybrid integration",
      ],
      ports: ["HTTPS:443", "LDAPS:636", "SAML:443", "Kerberos:88"],
      protocols: ["SAML 2.0", "OAuth 2.0", "OpenID Connect", "LDAP", "Kerberos", "WS-Federation"],
      metrics: {
        users: "50K+ identities",
        sso: "200+ apps",
        mfa: "99.5% adoption",
        incidents: "0 breaches",
      },
    },
    "mdm-provider": {
      name: safeConfig.mdmProvider === "intune" ? "Microsoft Intune" : "MDM Provider",
      description: "Comprehensive mobile device management and endpoint protection platform",
      specs: [
        "Device enrollment automation",
        "Compliance policy enforcement",
        "App protection policies",
        "Certificate deployment via SCEP",
        "Remote device management",
        "Conditional access integration",
        "Zero-touch provisioning",
        "Advanced threat protection",
      ],
      ports: ["HTTPS:443", "SCEP:80/443", "APNs:443", "FCM:443"],
      protocols: ["HTTPS", "SCEP", "OMA-DM", "Apple MDM", "Android Enterprise", "Windows MDM"],
      metrics: {
        devices: "25K+ managed",
        compliance: "98.5%",
        apps: "150+ deployed",
        certificates: "30K+ issued",
      },
    },
    "network-switch": {
      name: `${safeConfig.networkVendor.charAt(0).toUpperCase() + safeConfig.networkVendor.slice(1)} Network Switch`,
      description: "Enterprise-grade managed network switch with advanced 802.1X authentication capabilities",
      specs: [
        "48 x 1GbE access ports",
        "4 x 10GbE uplink ports",
        "802.1X authentication support",
        "Dynamic VLAN assignment",
        "PoE+ support (30W per port)",
        "Advanced QoS capabilities",
        "Network segmentation",
        "Real-time monitoring",
      ],
      ports: ["SSH:22", "HTTPS:443", "SNMP:161", "RADIUS:1812", "Telnet:23"],
      protocols: ["802.1X", "RADIUS", "SNMP v3", "LLDP", "STP/RSTP", "LACP"],
      metrics: {
        ports: "48 active",
        uptime: "99.99%",
        throughput: "480 Gbps",
        power: "740W PoE",
      },
    },
    "wireless-controller": {
      name: `${safeConfig.wirelessVendor.charAt(0).toUpperCase() + safeConfig.wirelessVendor.slice(1)} Wireless Controller`,
      description: "Centralized wireless network management with enterprise security and performance",
      specs: [
        "Cloud-managed architecture",
        "Up to 1000 AP management",
        "WPA3-Enterprise support",
        "RF optimization and planning",
        "Guest portal integration",
        "Bandwidth management",
        "Rogue AP detection",
        "Advanced analytics",
      ],
      ports: ["HTTPS:443", "CAPWAP:5246/5247", "SSH:22", "SNMP:161"],
      protocols: ["CAPWAP", "802.11ax/ac", "WPA3", "RADIUS", "DNS", "DHCP"],
      metrics: {
        aps: "120 managed",
        clients: "2.5K connected",
        throughput: "2.4 Gbps",
        coverage: "99.8%",
      },
    },
    firewall: {
      name: `${safeConfig.firewallVendor.charAt(0).toUpperCase() + safeConfig.firewallVendor.slice(1)} Next-Gen Firewall`,
      description: "Advanced threat protection and network security with deep packet inspection",
      specs: [
        "Application-aware filtering",
        "User-ID integration",
        "Threat intelligence feeds",
        "SSL/TLS inspection",
        "10 Gbps throughput",
        "Intrusion prevention system",
        "Advanced malware protection",
        "URL filtering and categorization",
      ],
      ports: ["HTTPS:443", "SSH:22", "SYSLOG:514", "SNMP:161", "RADIUS:1812"],
      protocols: ["User-ID", "FSSO", "SAML", "LDAP", "RADIUS", "IPSec", "SSL VPN"],
      metrics: {
        throughput: "8.5 Gbps",
        sessions: "2M concurrent",
        threats: "99.9% blocked",
        policies: "500+ rules",
      },
    },
    "radius-server": {
      name: safeConfig.radiusType === "cisco-ise" ? "Cisco Identity Services Engine" : "RADIUS Server",
      description: "Comprehensive authentication, authorization, and accounting server with policy enforcement",
      specs: [
        "EAP method support (TLS, PEAP, TTLS)",
        "Policy decision point",
        "Certificate validation",
        "Device profiling engine",
        "Guest access management",
        "BYOD onboarding",
        "Threat-centric NAC",
        "Compliance monitoring",
      ],
      ports: ["RADIUS:1812/1813", "HTTPS:443", "TACACS+:49", "LDAP:389"],
      protocols: ["RADIUS", "TACACS+", "EAP-TLS", "PEAP", "LDAP", "SNMP", "REST API"],
      metrics: {
        authentications: "50K/day",
        policies: "200+ active",
        endpoints: "15K profiled",
        uptime: "99.95%",
      },
    },
    "certificate-authority": {
      name: safeConfig.pkiProvider === "microsoft-ca" ? "Microsoft Certificate Authority" : "Certificate Authority",
      description: "Enterprise PKI infrastructure for certificate lifecycle management and security",
      specs: [
        "X.509 certificate issuance",
        "Certificate lifecycle management",
        "SCEP enrollment support",
        "CRL distribution points",
        "Hardware security module",
        "Certificate templates",
        "Auto-enrollment capabilities",
        "Certificate revocation",
      ],
      ports: ["HTTP:80", "HTTPS:443", "LDAP:389", "SCEP:80"],
      protocols: ["SCEP", "CMP", "OCSP", "LDAP", "HTTP", "PKCS#10", "PKCS#7"],
      metrics: {
        certificates: "30K issued",
        validity: "2 years avg",
        revoked: "< 0.1%",
        enrollment: "95% auto",
      },
    },
  }

  // Animation control
  React.useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % 4)
      }, 2000 / animationSpeed)
      return () => clearInterval(interval)
    }
  }, [isAnimating, animationSpeed])

  const renderCompleteArchitecture = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 900"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      {/* Enhanced Definitions */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        {/* Enhanced Animated Flow Gradients */}
        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0.8;0.2;0.8"
                dur={`${2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>

        <linearGradient id="secureFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${3 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${3 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>

        {/* Security Zone Patterns */}
        <pattern id="secureZone" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#dcfce7" />
          <circle cx="3" cy="3" r="1" fill="#16a34a" opacity="0.4" />
        </pattern>

        <pattern id="dmzZone" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#fef3c7" />
          <circle cx="3" cy="3" r="1" fill="#d97706" opacity="0.4" />
        </pattern>

        <pattern id="accessZone" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#f1f5f9" />
          <circle cx="3" cy="3" r="1" fill="#64748b" opacity="0.4" />
        </pattern>

        {/* Glow effects */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop shadow */}
        <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Cloud Services Zone */}
      <g id="cloud-zone">
        <rect
          x="50"
          y="50"
          width="350"
          height="250"
          rx="20"
          fill="url(#secureZone)"
          stroke="#16a34a"
          strokeWidth="2"
          opacity="0.4"
          filter="url(#dropshadow)"
        />
        <text x="225" y="35" textAnchor="middle" className="text-sm font-bold fill-green-700">
          🛡️ TRUSTED CLOUD SERVICES
        </text>

        {/* Portnox Cloud - Enhanced */}
        <g
          id="portnox-cloud"
          onMouseEnter={() => setHoveredComponent("portnox-cloud")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("portnox-cloud")}
          className="cursor-pointer"
          filter={hoveredComponent === "portnox-cloud" ? "url(#glow)" : ""}
        >
          <rect
            x="80"
            y="80"
            width="140"
            height="70"
            rx="12"
            fill="#3b82f6"
            stroke="#1e40af"
            strokeWidth="2"
            opacity={hoveredComponent === "portnox-cloud" ? 0.9 : 0.8}
          />
          <Cloud className="w-8 h-8" x="140" y="105" fill="white" />
          <text x="150" y="130" textAnchor="middle" className="text-sm fill-white font-semibold">
            Portnox Cloud
          </text>
          <text x="150" y="145" textAnchor="middle" className="text-xs fill-blue-100">
            NAC Platform
          </text>
          {/* Status indicator */}
          <circle cx="210" cy="90" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
          </circle>
          <text x="220" y="95" className="text-xs fill-green-600 font-medium">
            ACTIVE
          </text>
        </g>

        {/* Identity Provider - Enhanced */}
        <g
          id="identity-provider"
          onMouseEnter={() => setHoveredComponent("identity-provider")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("identity-provider")}
          className="cursor-pointer"
          filter={hoveredComponent === "identity-provider" ? "url(#glow)" : ""}
        >
          <rect
            x="250"
            y="80"
            width="140"
            height="70"
            rx="12"
            fill="#7c3aed"
            stroke="#5b21b6"
            strokeWidth="2"
            opacity={hoveredComponent === "identity-provider" ? 0.9 : 0.8}
          />
          <Users className="w-8 h-8" x="310" y="105" fill="white" />
          <text x="320" y="130" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.identityProvider === "azure-ad" ? "Azure AD" : "Identity Provider"}
          </text>
          <text x="320" y="145" textAnchor="middle" className="text-xs fill-purple-100">
            Authentication
          </text>
          <circle cx="380" cy="90" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* MDM Provider - Enhanced */}
        <g
          id="mdm-provider"
          onMouseEnter={() => setHoveredComponent("mdm-provider")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("mdm-provider")}
          className="cursor-pointer"
          filter={hoveredComponent === "mdm-provider" ? "url(#glow)" : ""}
        >
          <rect
            x="80"
            y="180"
            width="140"
            height="70"
            rx="12"
            fill="#059669"
            stroke="#047857"
            strokeWidth="2"
            opacity={hoveredComponent === "mdm-provider" ? 0.9 : 0.8}
          />
          <Smartphone className="w-8 h-8" x="140" y="205" fill="white" />
          <text x="150" y="230" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.mdmProvider === "intune" ? "Intune" : "MDM Provider"}
          </text>
          <text x="150" y="245" textAnchor="middle" className="text-xs fill-green-100">
            Device Management
          </text>
          <circle cx="210" cy="190" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Certificate Authority - Enhanced */}
        <g
          id="certificate-authority"
          onMouseEnter={() => setHoveredComponent("certificate-authority")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("certificate-authority")}
          className="cursor-pointer"
          filter={hoveredComponent === "certificate-authority" ? "url(#glow)" : ""}
        >
          <rect
            x="250"
            y="180"
            width="140"
            height="70"
            rx="12"
            fill="#dc2626"
            stroke="#b91c1c"
            strokeWidth="2"
            opacity={hoveredComponent === "certificate-authority" ? 0.9 : 0.8}
          />
          <Key className="w-8 h-8" x="310" y="205" fill="white" />
          <text x="320" y="230" textAnchor="middle" className="text-sm fill-white font-semibold">
            Certificate Authority
          </text>
          <text x="320" y="245" textAnchor="middle" className="text-xs fill-red-100">
            PKI Management
          </text>
          <circle cx="380" cy="190" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
          </circle>
        </g>
      </g>

      {/* Network Infrastructure Zone */}
      <g id="network-zone">
        <rect
          x="500"
          y="50"
          width="400"
          height="600"
          rx="20"
          fill="url(#dmzZone)"
          stroke="#d97706"
          strokeWidth="2"
          opacity="0.4"
          filter="url(#dropshadow)"
        />
        <text x="700" y="35" textAnchor="middle" className="text-sm font-bold fill-orange-700">
          🌐 NETWORK INFRASTRUCTURE
        </text>

        {/* Firewall - Enhanced */}
        <g
          id="firewall"
          onMouseEnter={() => setHoveredComponent("firewall")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("firewall")}
          className="cursor-pointer"
          filter={hoveredComponent === "firewall" ? "url(#glow)" : ""}
        >
          <rect
            x="620"
            y="80"
            width="120"
            height="60"
            rx="10"
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="2"
            opacity={hoveredComponent === "firewall" ? 0.9 : 0.8}
          />
          <Shield className="w-7 h-7" x="670" y="100" fill="white" />
          <text x="680" y="125" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.firewallVendor === "palo-alto" ? "Palo Alto" : "Firewall"}
          </text>
          <text x="680" y="135" textAnchor="middle" className="text-xs fill-red-100">
            NGFW
          </text>
          <circle cx="730" cy="90" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* RADIUS Server - Enhanced */}
        <g
          id="radius-server"
          onMouseEnter={() => setHoveredComponent("radius-server")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("radius-server")}
          className="cursor-pointer"
          filter={hoveredComponent === "radius-server" ? "url(#glow)" : ""}
        >
          <rect
            x="530"
            y="180"
            width="120"
            height="60"
            rx="10"
            fill="#8b5cf6"
            stroke="#7c3aed"
            strokeWidth="2"
            opacity={hoveredComponent === "radius-server" ? 0.9 : 0.8}
          />
          <Server className="w-7 h-7" x="580" y="200" fill="white" />
          <text x="590" y="225" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.radiusType === "cisco-ise" ? "Cisco ISE" : "RADIUS"}
          </text>
          <text x="590" y="235" textAnchor="middle" className="text-xs fill-purple-100">
            Auth Server
          </text>
          <circle cx="640" cy="190" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.7s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Wireless Controller - Enhanced */}
        <g
          id="wireless-controller"
          onMouseEnter={() => setHoveredComponent("wireless-controller")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("wireless-controller")}
          className="cursor-pointer"
          filter={hoveredComponent === "wireless-controller" ? "url(#glow)" : ""}
        >
          <rect
            x="710"
            y="180"
            width="120"
            height="60"
            rx="10"
            fill="#06b6d4"
            stroke="#0891b2"
            strokeWidth="2"
            opacity={hoveredComponent === "wireless-controller" ? 0.9 : 0.8}
          />
          <Wifi className="w-7 h-7" x="760" y="200" fill="white" />
          <text x="770" y="225" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.wirelessVendor === "cisco-meraki" ? "Meraki" : "Wireless"}
          </text>
          <text x="770" y="235" textAnchor="middle" className="text-xs fill-cyan-100">
            Controller
          </text>
          <circle cx="820" cy="190" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.1s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Network Switch - Enhanced */}
        <g
          id="network-switch"
          onMouseEnter={() => setHoveredComponent("network-switch")}
          onMouseLeave={() => setHoveredComponent(null)}
          onClick={() => setSelectedComponent("network-switch")}
          className="cursor-pointer"
          filter={hoveredComponent === "network-switch" ? "url(#glow)" : ""}
        >
          <rect
            x="620"
            y="280"
            width="120"
            height="60"
            rx="10"
            fill="#10b981"
            stroke="#059669"
            strokeWidth="2"
            opacity={hoveredComponent === "network-switch" ? 0.9 : 0.8}
          />
          <Router className="w-7 h-7" x="670" y="300" fill="white" />
          <text x="680" y="325" textAnchor="middle" className="text-sm fill-white font-semibold">
            {safeConfig.networkVendor === "cisco" ? "Cisco Switch" : "Switch"}
          </text>
          <text x="680" y="335" textAnchor="middle" className="text-xs fill-green-100">
            L2/L3
          </text>
          <circle cx="730" cy="290" r="4" fill="#10b981">
            {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.3s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Access Points - Enhanced */}
        <g id="access-points">
          {[0, 1, 2].map((i) => (
            <g key={i} className="cursor-pointer" onClick={() => setSelectedComponent(`ap-${i + 1}`)}>
              <rect
                x={530 + i * 100}
                y="380"
                width="80"
                height="50"
                rx="8"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="2"
                opacity="0.8"
              />
              <Antenna className="w-6 h-6" x={560 + i * 100} y="395" fill="white" />
              <text x={570 + i * 100} y="415" textAnchor="middle" className="text-sm fill-white font-medium">
                AP-{i + 1}
              </text>
              <text x={570 + i * 100} y="425" textAnchor="middle" className="text-xs fill-orange-100">
                WiFi 6E
              </text>
              <circle cx={600 + i * 100} cy="390" r="3" fill="#10b981">
                {isAnimating && (
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            </g>
          ))}
        </g>

        {/* Network Metrics Display */}
        <g id="network-metrics">
          <rect
            x="530"
            y="480"
            width="300"
            height="80"
            rx="8"
            fill="rgba(0,0,0,0.1)"
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="680" y="500" textAnchor="middle" className="text-sm font-semibold fill-slate-700">
            Network Performance
          </text>
          <text x="550" y="520" className="text-xs fill-slate-600">
            Throughput: 8.5 Gbps
          </text>
          <text x="550" y="535" className="text-xs fill-slate-600">
            Latency: &lt; 2ms
          </text>
          <text x="550" y="550" className="text-xs fill-slate-600">
            Uptime: 99.97%
          </text>
          <text x="720" y="520" className="text-xs fill-slate-600">
            Active Sessions: 2.1M
          </text>
          <text x="720" y="535" className="text-xs fill-slate-600">
            Threats Blocked: 1,247
          </text>
          <text x="720" y="550" className="text-xs fill-slate-600">
            Policies: 342 active
          </text>
        </g>
      </g>

      {/* End Devices Zone */}
      <g id="device-zone">
        <rect
          x="950"
          y="50"
          width="400"
          height="600"
          rx="20"
          fill="url(#accessZone)"
          stroke="#64748b"
          strokeWidth="2"
          opacity="0.4"
          filter="url(#dropshadow)"
        />
        <text x="1150" y="35" textAnchor="middle" className="text-sm font-bold fill-slate-700">
          💻 END DEVICES & USERS
        </text>

        {/* Corporate Devices - Enhanced */}
        <g id="corporate-devices">
          <text x="970" y="80" className="text-sm font-semibold fill-slate-700">
            Corporate Managed Devices
          </text>
          {safeConfig.deviceTypes.includes("windows") && (
            <g className="cursor-pointer" onClick={() => setSelectedComponent("windows-devices")}>
              <rect x="980" y="90" width="70" height="50" rx="6" fill="#0078d4" stroke="#106ebe" strokeWidth="2" />
              <Laptop className="w-6 h-6" x="1005" y="105" fill="white" />
              <text x="1015" y="125" textAnchor="middle" className="text-sm fill-white font-medium">
                Windows
              </text>
              <text x="1015" y="155" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                1,800 devices
              </text>
              <circle cx="1040" cy="100" r="3" fill="#10b981">
                {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
              </circle>
            </g>
          )}
          {safeConfig.deviceTypes.includes("mac") && (
            <g className="cursor-pointer" onClick={() => setSelectedComponent("mac-devices")}>
              <rect x="1070" y="90" width="70" height="50" rx="6" fill="#000000" stroke="#333333" strokeWidth="2" />
              <Laptop className="w-6 h-6" x="1095" y="105" fill="white" />
              <text x="1105" y="125" textAnchor="middle" className="text-sm fill-white font-medium">
                macOS
              </text>
              <text x="1105" y="155" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                450 devices
              </text>
              <circle cx="1130" cy="100" r="3" fill="#10b981">
                {isAnimating && (
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.3s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          )}
          {safeConfig.deviceTypes.includes("ios") && (
            <g className="cursor-pointer" onClick={() => setSelectedComponent("ios-devices")}>
              <rect x="1160" y="90" width="70" height="50" rx="6" fill="#007aff" stroke="#0056cc" strokeWidth="2" />
              <Smartphone className="w-6 h-6" x="1185" y="105" fill="white" />
              <text x="1195" y="125" textAnchor="middle" className="text-sm fill-white font-medium">
                iOS
              </text>
              <text x="1195" y="155" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                850 devices
              </text>
              <circle cx="1220" cy="100" r="3" fill="#10b981">
                {isAnimating && (
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          )}
          {safeConfig.deviceTypes.includes("android") && (
            <g className="cursor-pointer" onClick={() => setSelectedComponent("android-devices")}>
              <rect x="1250" y="90" width="70" height="50" rx="6" fill="#3ddc84" stroke="#00c853" strokeWidth="2" />
              <Smartphone className="w-6 h-6" x="1275" y="105" fill="white" />
              <text x="1285" y="125" textAnchor="middle" className="text-sm fill-white font-medium">
                Android
              </text>
              <text x="1285" y="155" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                420 devices
              </text>
              <circle cx="1310" cy="100" r="3" fill="#10b981">
                {isAnimating && (
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          )}
        </g>

        {/* BYOD Devices */}
        {safeConfig.byodSupport && (
          <g id="byod-devices">
            <text x="970" y="200" className="text-sm font-semibold fill-slate-700">
              BYOD / Personal Devices
            </text>
            <g className="cursor-pointer" onClick={() => setSelectedComponent("byod-devices")}>
              <rect x="980" y="210" width="160" height="60" rx="8" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
              <Users className="w-8 h-8" x="1040" y="230" fill="white" />
              <text x="1060" y="250" textAnchor="middle" className="text-sm fill-white font-semibold">
                Personal Devices
              </text>
              <text x="1060" y="285" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                1,200+ devices
              </text>
              <circle cx="1130" cy="220" r="4" fill="#10b981">
                {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
              </circle>
            </g>
          </g>
        )}

        {/* IoT Devices */}
        {safeConfig.deviceTypes.includes("iot") && (
          <g id="iot-devices">
            <text x="970" y="310" className="text-sm font-semibold fill-slate-700">
              IoT & Infrastructure Devices
            </text>
            <g className="cursor-pointer" onClick={() => setSelectedComponent("printers")}>
              <rect x="980" y="320" width="60" height="45" rx="6" fill="#6b7280" stroke="#4b5563" strokeWidth="2" />
              <Printer className="w-5 h-5" x="1000" y="335" fill="white" />
              <text x="1010" y="355" textAnchor="middle" className="text-xs fill-white font-medium">
                Printers
              </text>
              <text x="1010" y="375" textAnchor="middle" className="text-xs fill-slate-600">
                180
              </text>
            </g>
            <g className="cursor-pointer" onClick={() => setSelectedComponent("iot-general")}>
              <rect x="1060" y="320" width="60" height="45" rx="6" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
              <Router className="w-5 h-5" x="1080" y="335" fill="white" />
              <text x="1090" y="355" textAnchor="middle" className="text-xs fill-white font-medium">
                IoT
              </text>
              <text x="1090" y="375" textAnchor="middle" className="text-xs fill-slate-600">
                320
              </text>
            </g>
            <g className="cursor-pointer" onClick={() => setSelectedComponent("cameras")}>
              <rect x="1140" y="320" width="60" height="45" rx="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <Monitor className="w-5 h-5" x="1160" y="335" fill="white" />
              <text x="1170" y="355" textAnchor="middle" className="text-xs fill-white font-medium">
                Cameras
              </text>
              <text x="1170" y="375" textAnchor="middle" className="text-xs fill-slate-600">
                85
              </text>
            </g>
          </g>
        )}

        {/* Guest Access */}
        {safeConfig.guestPortal && (
          <g id="guest-access">
            <text x="970" y="420" className="text-sm font-semibold fill-slate-700">
              Guest Access Portal
            </text>
            <g className="cursor-pointer" onClick={() => setSelectedComponent("guest-portal")}>
              <rect x="980" y="430" width="160" height="60" rx="8" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
              <Globe className="w-8 h-8" x="1040" y="450" fill="white" />
              <text x="1060" y="470" textAnchor="middle" className="text-sm fill-white font-semibold">
                Guest Portal
              </text>
              <text x="1060" y="505" textAnchor="middle" className="text-xs fill-slate-600 font-medium">
                Captive Portal & Self-Service
              </text>
              <circle cx="1130" cy="440" r="4" fill="#10b981">
                {isAnimating && (
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.7s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          </g>
        )}

        {/* Device Statistics */}
        <g id="device-stats">
          <rect
            x="980"
            y="520"
            width="300"
            height="100"
            rx="8"
            fill="rgba(0,0,0,0.1)"
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="1130" y="540" textAnchor="middle" className="text-sm font-semibold fill-slate-700">
            Device Statistics
          </text>
          <text x="1000" y="560" className="text-xs fill-slate-600">
            Total Devices: 3,520
          </text>
          <text x="1000" y="575" className="text-xs fill-slate-600">
            Compliant: 98.5%
          </text>
          <text x="1000" y="590" className="text-xs fill-slate-600">
            Certificates: 3,247
          </text>
          <text x="1000" y="605" className="text-xs fill-slate-600">
            Last Updated: 2 min ago
          </text>
          <text x="1180" y="560" className="text-xs fill-slate-600">
            Online: 2,847 (81%)
          </text>
          <text x="1180" y="575" className="text-xs fill-slate-600">
            Quarantined: 12
          </text>
          <text x="1180" y="590" className="text-xs fill-slate-600">
            Guest Sessions: 47
          </text>
          <text x="1180" y="605" className="text-xs fill-slate-600">
            Avg Session: 4.2h
          </text>
        </g>
      </g>

      {/* Enhanced Connection Lines with Multiple Flows */}
      <g id="connections" stroke="#64748b" strokeWidth="2" fill="none">
        {/* Cloud to Network connections */}
        <path d="M 400 115 Q 450 115 500 115" stroke="url(#dataFlow)" strokeWidth="4" opacity="0.8" />
        <path d="M 400 215 Q 450 215 500 215" stroke="url(#secureFlow)" strokeWidth="4" opacity="0.8" />

        {/* Network internal connections */}
        <path d="M 680 140 L 680 180" stroke="#64748b" strokeWidth="3" />
        <path d="M 650 210 L 710 210" stroke="#64748b" strokeWidth="3" />
        <path d="M 680 240 L 680 280" stroke="#64748b" strokeWidth="3" />

        {/* Network to devices */}
        <path d="M 900 200 Q 925 200 950 200" stroke="url(#dataFlow)" strokeWidth="4" opacity="0.8" />
        <path d="M 830 405 Q 890 405 950 405" stroke="url(#secureFlow)" strokeWidth="4" opacity="0.8" />
      </g>

      {/* Enhanced Data Flow Indicators */}
      {isAnimating && (
        <g id="flow-indicators">
          <circle r="6" fill="#3b82f6" opacity="0.9">
            <animateMotion dur={`${4 / animationSpeed}s`} repeatCount="indefinite">
              <path d="M 400 115 Q 450 115 500 115 L 680 115 L 680 180 L 650 210 L 950 200" />
            </animateMotion>
          </circle>
          <circle r="6" fill="#10b981" opacity="0.9">
            <animateMotion dur={`${5 / animationSpeed}s`} repeatCount="indefinite">
              <path d="M 830 405 Q 890 405 950 405 L 1150 405 L 1150 200 Q 925 200 900 200" />
            </animateMotion>
          </circle>
          <circle r="5" fill="#f59e0b" opacity="0.8">
            <animateMotion dur={`${3 / animationSpeed}s`} repeatCount="indefinite">
              <path d="M 400 215 Q 450 215 500 215 L 770 215 L 770 240 L 680 280" />
            </animateMotion>
          </circle>
        </g>
      )}

      {/* Enhanced Protocol Labels */}
      <g id="protocol-labels" className="text-xs fill-slate-600 font-medium">
        <text x="450" y="110" textAnchor="middle">
          RADIUS/TLS
        </text>
        <text x="450" y="210" textAnchor="middle">
          LDAP/SAML
        </text>
        <text x="925" y="195" textAnchor="middle">
          802.1X/EAP-TLS
        </text>
        <text x="890" y="400" textAnchor="middle">
          WiFi 6E/WPA3
        </text>
      </g>

      {/* Security Status Indicators */}
      <g id="security-status">
        <rect
          x="50"
          y="750"
          width="300"
          height="100"
          rx="10"
          fill="rgba(16, 185, 129, 0.1)"
          stroke="#10b981"
          strokeWidth="2"
        />
        <text x="200" y="770" textAnchor="middle" className="text-sm font-bold fill-green-700">
          🛡️ Security Status: PROTECTED
        </text>
        <text x="70" y="790" className="text-xs fill-green-600">
          ✓ All systems operational
        </text>
        <text x="70" y="805" className="text-xs fill-green-600">
          ✓ Zero trust policies active
        </text>
        <text x="70" y="820" className="text-xs fill-green-600">
          ✓ Threat detection enabled
        </text>
        <text x="70" y="835" className="text-xs fill-green-600">
          ✓ Compliance verified
        </text>
      </g>
    </svg>
  )

  const renderAuthenticationFlow = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #fefbf7 0%, #fef3c7 100%)" }}
    >
      <defs>
        <pattern id="authGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        <linearGradient id="authFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${3 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${3 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#authGrid)" />

      {/* Authentication Flow Title */}
      <text x="700" y="50" textAnchor="middle" className="text-2xl font-bold fill-amber-800">
        🔐 802.1X Authentication Flow
      </text>
      <text x="700" y="75" textAnchor="middle" className="text-sm fill-amber-700">
        EAP-TLS Certificate-Based Authentication Process
      </text>

      {/* Step 1: Device */}
      <g id="auth-device" className="cursor-pointer" onClick={() => setSelectedComponent("auth-device")}>
        <rect x="100" y="200" width="150" height="80" rx="10" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
        <Laptop className="w-8 h-8" x="165" y="225" fill="white" />
        <text x="175" y="255" textAnchor="middle" className="text-sm fill-white font-semibold">
          End Device
        </text>
        <text x="175" y="270" textAnchor="middle" className="text-xs fill-blue-100">
          Certificate Installed
        </text>
        <circle cx="230" cy="210" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Step 2: Network Switch */}
      <g id="auth-switch" className="cursor-pointer" onClick={() => setSelectedComponent("auth-switch")}>
        <rect x="350" y="200" width="150" height="80" rx="10" fill="#10b981" stroke="#059669" strokeWidth="2" />
        <Router className="w-8 h-8" x="415" y="225" fill="white" />
        <text x="425" y="255" textAnchor="middle" className="text-sm fill-white font-semibold">
          Network Switch
        </text>
        <text x="425" y="270" textAnchor="middle" className="text-xs fill-green-100">
          802.1X Authenticator
        </text>
        <circle cx="480" cy="210" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Step 3: RADIUS Server */}
      <g id="auth-radius" className="cursor-pointer" onClick={() => setSelectedComponent("auth-radius")}>
        <rect x="600" y="200" width="150" height="80" rx="10" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
        <Server className="w-8 h-8" x="665" y="225" fill="white" />
        <text x="675" y="255" textAnchor="middle" className="text-sm fill-white font-semibold">
          RADIUS Server
        </text>
        <text x="675" y="270" textAnchor="middle" className="text-xs fill-purple-100">
          Authentication Server
        </text>
        <circle cx="730" cy="210" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Step 4: Portnox Cloud */}
      <g id="auth-cloud" className="cursor-pointer" onClick={() => setSelectedComponent("auth-cloud")}>
        <rect x="850" y="200" width="150" height="80" rx="10" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
        <Cloud className="w-8 h-8" x="915" y="225" fill="white" />
        <text x="925" y="255" textAnchor="middle" className="text-sm fill-white font-semibold">
          Portnox Cloud
        </text>
        <text x="925" y="270" textAnchor="middle" className="text-xs fill-red-100">
          Policy Decision
        </text>
        <circle cx="980" cy="210" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.6s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Authentication Flow Steps */}
      <g id="auth-steps">
        {/* Step arrows */}
        <path d="M 250 240 L 350 240" stroke="url(#authFlow)" strokeWidth="4" markerEnd="url(#arrowhead)" />
        <path d="M 500 240 L 600 240" stroke="url(#authFlow)" strokeWidth="4" markerEnd="url(#arrowhead)" />
        <path d="M 750 240 L 850 240" stroke="url(#authFlow)" strokeWidth="4" markerEnd="url(#arrowhead)" />

        {/* Step numbers */}
        <circle cx="300" cy="240" r="15" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <text x="300" y="245" textAnchor="middle" className="text-sm fill-white font-bold">
          1
        </text>

        <circle cx="550" cy="240" r="15" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <text x="550" y="245" textAnchor="middle" className="text-sm fill-white font-bold">
          2
        </text>

        <circle cx="800" cy="240" r="15" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <text x="800" y="245" textAnchor="middle" className="text-sm fill-white font-bold">
          3
        </text>
      </g>

      {/* Detailed Flow Description */}
      <g id="flow-description">
        <rect
          x="100"
          y="350"
          width="900"
          height="300"
          rx="15"
          fill="rgba(245, 158, 11, 0.1)"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <text x="550" y="380" textAnchor="middle" className="text-lg font-bold fill-amber-800">
          Authentication Process Details
        </text>

        {/* Step 1 Details */}
        <g id="step1-details">
          <rect
            x="120"
            y="400"
            width="200"
            height="120"
            rx="8"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3b82f6"
            strokeWidth="1"
          />
          <text x="220" y="420" textAnchor="middle" className="text-sm font-bold fill-blue-800">
            Step 1: EAP Start
          </text>
          <text x="130" y="440" className="text-xs fill-blue-700">
            • Device connects to network
          </text>
          <text x="130" y="455" className="text-xs fill-blue-700">
            • Switch sends EAP-Request
          </text>
          <text x="130" y="470" className="text-xs fill-blue-700">
            • Device responds with Identity
          </text>
          <text x="130" y="485" className="text-xs fill-blue-700">
            • Certificate presented
          </text>
          <text x="130" y="500" className="text-xs fill-blue-700">
            • TLS handshake initiated
          </text>
        </g>

        {/* Step 2 Details */}
        <g id="step2-details">
          <rect
            x="340"
            y="400"
            width="200"
            height="120"
            rx="8"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="#10b981"
            strokeWidth="1"
          />
          <text x="440" y="420" textAnchor="middle" className="text-sm font-bold fill-green-800">
            Step 2: RADIUS Request
          </text>
          <text x="350" y="440" className="text-xs fill-green-700">
            • Switch forwards to RADIUS
          </text>
          <text x="350" y="455" className="text-xs fill-green-700">
            • Access-Request packet sent
          </text>
          <text x="350" y="470" className="text-xs fill-green-700">
            • Certificate validation
          </text>
          <text x="350" y="485" className="text-xs fill-green-700">
            • User identity verified
          </text>
          <text x="350" y="500" className="text-xs fill-green-700">
            • Policy lookup initiated
          </text>
        </g>

        {/* Step 3 Details */}
        <g id="step3-details">
          <rect
            x="560"
            y="400"
            width="200"
            height="120"
            rx="8"
            fill="rgba(139, 92, 246, 0.1)"
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <text x="660" y="420" textAnchor="middle" className="text-sm font-bold fill-purple-800">
            Step 3: Policy Decision
          </text>
          <text x="570" y="440" className="text-xs fill-purple-700">
            • Portnox evaluates request
          </text>
          <text x="570" y="455" className="text-xs fill-purple-700">
            • Device posture checked
          </text>
          <text x="570" y="470" className="text-xs fill-purple-700">
            • Compliance verified
          </text>
          <text x="570" y="485" className="text-xs fill-purple-700">
            • VLAN assignment
          </text>
          <text x="570" y="500" className="text-xs fill-purple-700">
            • Access decision made
          </text>
        </g>

        {/* Step 4 Details */}
        <g id="step4-details">
          <rect
            x="780"
            y="400"
            width="200"
            height="120"
            rx="8"
            fill="rgba(220, 38, 38, 0.1)"
            stroke="#dc2626"
            strokeWidth="1"
          />
          <text x="880" y="420" textAnchor="middle" className="text-sm font-bold fill-red-800">
            Step 4: Access Granted
          </text>
          <text x="790" y="440" className="text-xs fill-red-700">
            • Access-Accept returned
          </text>
          <text x="790" y="455" className="text-xs fill-red-700">
            • VLAN attributes sent
          </text>
          <text x="790" y="470" className="text-xs fill-red-700">
            • Switch configures port
          </text>
          <text x="790" y="485" className="text-xs fill-red-700">
            • Network access enabled
          </text>
          <text x="790" y="500" className="text-xs fill-red-700">
            • Session monitoring starts
          </text>
        </g>
      </g>

      {/* Timing Information */}
      <g id="timing-info">
        <rect
          x="100"
          y="680"
          width="900"
          height="60"
          rx="8"
          fill="rgba(245, 158, 11, 0.2)"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        <text x="550" y="700" textAnchor="middle" className="text-sm font-bold fill-amber-800">
          ⏱️ Authentication Timing
        </text>
        <text x="120" y="720" className="text-xs fill-amber-700">
          Total Authentication Time: &lt; 3 seconds | Certificate Validation: &lt; 500ms | Policy Lookup: &lt; 200ms |
          VLAN Assignment: &lt; 100ms
        </text>
        <text x="120" y="735" className="text-xs fill-amber-700">
          Success Rate: 99.7% | Failed Authentications: 0.3% | Average Daily Authentications: 15,000+
        </text>
      </g>

      {/* Arrow marker definition */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  )

  const renderPKIArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)" }}
    >
      <defs>
        <pattern id="pkiGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        <linearGradient id="certFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${2.5 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0">
            {isAnimating && (
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur={`${2.5 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#pkiGrid)" />

      {/* PKI Architecture Title */}
      <text x="700" y="50" textAnchor="middle" className="text-2xl font-bold fill-purple-800">
        🔐 PKI & Certificate Management Architecture
      </text>
      <text x="700" y="75" textAnchor="middle" className="text-sm fill-purple-700">
        Enterprise Certificate Lifecycle Management with SCEP Integration
      </text>

      {/* Root CA */}
      <g id="root-ca" className="cursor-pointer" onClick={() => setSelectedComponent("root-ca")}>
        <rect x="600" y="120" width="200" height="80" rx="12" fill="#7c3aed" stroke="#5b21b6" strokeWidth="3" />
        <Key className="w-10 h-10" x="685" y="145" fill="white" />
        <text x="700" y="175" textAnchor="middle" className="text-lg fill-white font-bold">
          Root CA
        </text>
        <text x="700" y="190" textAnchor="middle" className="text-xs fill-purple-100">
          Certificate Authority
        </text>
        <circle cx="780" cy="130" r="5" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* SCEP Server */}
      <g id="scep-server" className="cursor-pointer" onClick={() => setSelectedComponent("scep-server")}>
        <rect x="300" y="250" width="180" height="70" rx="10" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
        <Server className="w-8 h-8" x="380" y="270" fill="white" />
        <text x="390" y="295" textAnchor="middle" className="text-sm fill-white font-semibold">
          SCEP Server
        </text>
        <text x="390" y="310" textAnchor="middle" className="text-xs fill-purple-100">
          Certificate Enrollment
        </text>
        <circle cx="460" cy="260" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* OCSP Responder */}
      <g id="ocsp-responder" className="cursor-pointer" onClick={() => setSelectedComponent("ocsp-responder")}>
        <rect x="520" y="250" width="180" height="70" rx="10" fill="#a855f7" stroke="#9333ea" strokeWidth="2" />
        <Activity className="w-8 h-8" x="600" y="270" fill="white" />
        <text x="610" y="295" textAnchor="middle" className="text-sm fill-white font-semibold">
          OCSP Responder
        </text>
        <text x="610" y="310" textAnchor="middle" className="text-xs fill-purple-100">
          Certificate Validation
        </text>
        <circle cx="680" cy="260" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* CRL Distribution */}
      <g id="crl-distribution" className="cursor-pointer" onClick={() => setSelectedComponent("crl-distribution")}>
        <rect x="740" y="250" width="180" height="70" rx="10" fill="#c084fc" stroke="#a855f7" strokeWidth="2" />
        <Database className="w-8 h-8" x="820" y="270" fill="white" />
        <text x="830" y="295" textAnchor="middle" className="text-sm fill-white font-semibold">
          CRL Distribution
        </text>
        <text x="830" y="310" textAnchor="middle" className="text-xs fill-purple-100">
          Revocation Lists
        </text>
        <circle cx="900" cy="260" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.6s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* MDM Integration */}
      <g id="mdm-integration" className="cursor-pointer" onClick={() => setSelectedComponent("mdm-integration")}>
        <rect x="200" y="400" width="200" height="80" rx="10" fill="#059669" stroke="#047857" strokeWidth="2" />
        <Smartphone className="w-8 h-8" x="290" y="425" fill="white" />
        <text x="300" y="450" textAnchor="middle" className="text-sm fill-white font-semibold">
          MDM Integration
        </text>
        <text x="300" y="465" textAnchor="middle" className="text-xs fill-green-100">
          Automated Enrollment
        </text>
        <circle cx="380" cy="410" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* End Devices */}
      <g id="pki-devices" className="cursor-pointer" onClick={() => setSelectedComponent("pki-devices")}>
        <rect x="500" y="400" width="200" height="80" rx="10" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
        <Laptop className="w-8 h-8" x="590" y="425" fill="white" />
        <text x="600" y="450" textAnchor="middle" className="text-sm fill-white font-semibold">
          End Devices
        </text>
        <text x="600" y="465" textAnchor="middle" className="text-xs fill-blue-100">
          Certificate Recipients
        </text>
        <circle cx="680" cy="410" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.8s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Network Infrastructure */}
      <g id="pki-network" className="cursor-pointer" onClick={() => setSelectedComponent("pki-network")}>
        <rect x="800" y="400" width="200" height="80" rx="10" fill="#10b981" stroke="#059669" strokeWidth="2" />
        <Network className="w-8 h-8" x="890" y="425" fill="white" />
        <text x="900" y="450" textAnchor="middle" className="text-sm fill-white font-semibold">
          Network Infrastructure
        </text>
        <text x="900" y="465" textAnchor="middle" className="text-xs fill-green-100">
          Certificate Validation
        </text>
        <circle cx="980" cy="410" r="4" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* PKI Flow Connections */}
      <g id="pki-connections" stroke="#a855f7" strokeWidth="3" fill="none">
        {/* Root CA to services */}
        <path d="M 650 200 L 390 250" stroke="url(#certFlow)" strokeWidth="4" />
        <path d="M 700 200 L 610 250" stroke="url(#certFlow)" strokeWidth="4" />
        <path d="M 750 200 L 830 250" stroke="url(#certFlow)" strokeWidth="4" />

        {/* Services to devices */}
        <path d="M 390 320 L 300 400" stroke="url(#certFlow)" strokeWidth="4" />
        <path d="M 610 320 L 600 400" stroke="url(#certFlow)" strokeWidth="4" />
        <path d="M 830 320 L 900 400" stroke="url(#certFlow)" strokeWidth="4" />
      </g>

      {/* Certificate Lifecycle Process */}
      <g id="cert-lifecycle">
        <rect
          x="100"
          y="550"
          width="1200"
          height="200"
          rx="15"
          fill="rgba(168, 85, 247, 0.1)"
          stroke="#a855f7"
          strokeWidth="2"
        />
        <text x="700" y="580" textAnchor="middle" className="text-lg font-bold fill-purple-800">
          📋 Certificate Lifecycle Management Process
        </text>

        {/* Enrollment Phase */}
        <g id="enrollment-phase">
          <rect
            x="120"
            y="600"
            width="220"
            height="80"
            rx="8"
            fill="rgba(139, 92, 246, 0.1)"
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <text x="230" y="620" textAnchor="middle" className="text-sm font-bold fill-purple-800">
            1. Enrollment
          </text>
          <text x="130" y="640" className="text-xs fill-purple-700">
            • SCEP request initiated
          </text>
          <text x="130" y="655" className="text-xs fill-purple-700">
            • Device identity verified
          </text>
          <text x="130" y="670" className="text-xs fill-purple-700">
            • Certificate issued & deployed
          </text>
        </g>

        {/* Validation Phase */}
        <g id="validation-phase">
          <rect
            x="360"
            y="600"
            width="220"
            height="80"
            rx="8"
            fill="rgba(168, 85, 247, 0.1)"
            stroke="#a855f7"
            strokeWidth="1"
          />
          <text x="470" y="620" textAnchor="middle" className="text-sm font-bold fill-purple-800">
            2. Validation
          </text>
          <text x="370" y="640" className="text-xs fill-purple-700">
            • OCSP status checking
          </text>
          <text x="370" y="655" className="text-xs fill-purple-700">
            • CRL verification
          </text>
          <text x="370" y="670" className="text-xs fill-purple-700">
            • Real-time validation
          </text>
        </g>

        {/* Renewal Phase */}
        <g id="renewal-phase">
          <rect
            x="600"
            y="600"
            width="220"
            height="80"
            rx="8"
            fill="rgba(196, 132, 252, 0.1)"
            stroke="#c084fc"
            strokeWidth="1"
          />
          <text x="710" y="620" textAnchor="middle" className="text-sm font-bold fill-purple-800">
            3. Renewal
          </text>
          <text x="610" y="640" className="text-xs fill-purple-700">
            • Automated renewal alerts
          </text>
          <text x="610" y="655" className="text-xs fill-purple-700">
            • Pre-expiration warnings
          </text>
          <text x="610" y="670" className="text-xs fill-purple-700">
            • Seamless certificate update
          </text>
        </g>

        {/* Revocation Phase */}
        <g id="revocation-phase">
          <rect
            x="840"
            y="600"
            width="220"
            height="80"
            rx="8"
            fill="rgba(220, 38, 38, 0.1)"
            stroke="#dc2626"
            strokeWidth="1"
          />
          <text x="950" y="620" textAnchor="middle" className="text-sm font-bold fill-red-800">
            4. Revocation
          </text>
          <text x="850" y="640" className="text-xs fill-red-700">
            • Immediate revocation
          </text>
          <text x="850" y="655" className="text-xs fill-red-700">
            • CRL updates
          </text>
          <text x="850" y="670" className="text-xs fill-red-700">
            • Access termination
          </text>
        </g>
      </g>

      {/* PKI Statistics */}
      <g id="pki-stats">
        <rect
          x="1100"
          y="120"
          width="250"
          height="200"
          rx="10"
          fill="rgba(168, 85, 247, 0.1)"
          stroke="#a855f7"
          strokeWidth="1"
        />
        <text x="1225" y="145" textAnchor="middle" className="text-sm font-bold fill-purple-800">
          📊 PKI Statistics
        </text>
        <text x="1120" y="170" className="text-xs fill-purple-700">
          Active Certificates: 15,247
        </text>
        <text x="1120" y="185" className="text-xs fill-purple-700">
          Issued This Month: 1,832
        </text>
        <text x="1120" y="200" className="text-xs fill-purple-700">
          Renewal Rate: 98.5%
        </text>
        <text x="1120" y="215" className="text-xs fill-purple-700">
          Revoked: 23 (0.15%)
        </text>
        <text x="1120" y="230" className="text-xs fill-purple-700">
          Avg Validity: 2 years
        </text>
        <text x="1120" y="245" className="text-xs fill-purple-700">
          OCSP Responses: 45K/day
        </text>
        <text x="1120" y="260" className="text-xs fill-purple-700">
          Success Rate: 99.97%
        </text>
        <text x="1120" y="275" className="text-xs fill-purple-700">
          Auto-Enrollment: 95%
        </text>
        <text x="1120" y="290" className="text-xs fill-purple-700">
          Template Types: 12
        </text>
        <text x="1120" y="305" className="text-xs fill-purple-700">
          Last Backup: 2h ago
        </text>
      </g>
    </svg>
  )

  const renderMultiSiteArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)" }}
    >
      <defs>
        <pattern id="multiSiteGrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#multiSiteGrid)" />

      {/* Multi-Site Title */}
      <text x="700" y="50" textAnchor="middle" className="text-2xl font-bold fill-blue-800">
        🌐 Multi-Site Enterprise Architecture
      </text>
      <text x="700" y="75" textAnchor="middle" className="text-sm fill-blue-700">
        Centralized Management Across Global Locations
      </text>

      {/* Central Portnox Cloud */}
      <g id="central-cloud" className="cursor-pointer" onClick={() => setSelectedComponent("central-cloud")}>
        <rect x="600" y="150" width="200" height="100" rx="15" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
        <Cloud className="w-12 h-12" x="685" y="175" fill="white" />
        <text x="700" y="215" textAnchor="middle" className="text-lg fill-white font-bold">
          Portnox Cloud
        </text>
        <text x="700" y="235" textAnchor="middle" className="text-sm fill-blue-100">
          Global NAC Platform
        </text>
        <circle cx="780" cy="160" r="6" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Site 1: Headquarters */}
      <g id="site-hq" className="cursor-pointer" onClick={() => setSelectedComponent("site-hq")}>
        <rect x="100" y="350" width="250" height="150" rx="12" fill="#10b981" stroke="#059669" strokeWidth="2" />
        <Building className="w-8 h-8" x="210" y="375" fill="white" />
        <text x="225" y="405" textAnchor="middle" className="text-lg fill-white font-bold">
          New York HQ
        </text>
        <text x="225" y="425" textAnchor="middle" className="text-sm fill-green-100">
          2,500 Users | 4,200 Devices
        </text>
        <text x="225" y="445" textAnchor="middle" className="text-xs fill-green-100">
          Cisco Infrastructure
        </text>
        <text x="225" y="460" textAnchor="middle" className="text-xs fill-green-100">
          Phase 3: Implementation
        </text>
        <text x="225" y="475" textAnchor="middle" className="text-xs fill-green-100">
          Progress: 75%
        </text>
        <circle cx="330" cy="360" r="5" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Site 2: Branch Office */}
      <g id="site-branch" className="cursor-pointer" onClick={() => setSelectedComponent("site-branch")}>
        <rect x="400" y="350" width="250" height="150" rx="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <MapPin className="w-8 h-8" x="510" y="375" fill="white" />
        <text x="525" y="405" textAnchor="middle" className="text-lg fill-white font-bold">
          London Branch
        </text>
        <text x="525" y="425" textAnchor="middle" className="text-sm fill-orange-100">
          850 Users | 1,400 Devices
        </text>
        <text x="525" y="445" textAnchor="middle" className="text-xs fill-orange-100">
          Aruba Infrastructure
        </text>
        <text x="525" y="460" textAnchor="middle" className="text-xs fill-orange-100">
          Phase 2: Design
        </text>
        <text x="525" y="475" textAnchor="middle" className="text-xs fill-orange-100">
          Progress: 45%
        </text>
        <circle cx="630" cy="360" r="5" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Site 3: Remote Office */}
      <g id="site-remote" className="cursor-pointer" onClick={() => setSelectedComponent("site-remote")}>
        <rect x="700" y="350" width="250" height="150" rx="12" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
        <Globe className="w-8 h-8" x="810" y="375" fill="white" />
        <text x="825" y="405" textAnchor="middle" className="text-lg fill-white font-bold">
          Tokyo Office
        </text>
        <text x="825" y="425" textAnchor="middle" className="text-sm fill-purple-100">
          650 Users | 1,100 Devices
        </text>
        <text x="825" y="445" textAnchor="middle" className="text-xs fill-purple-100">
          Juniper Infrastructure
        </text>
        <text x="825" y="460" textAnchor="middle" className="text-xs fill-purple-100">
          Phase 1: Planning
        </text>
        <text x="825" y="475" textAnchor="middle" className="text-xs fill-purple-100">
          Progress: 15%
        </text>
        <circle cx="930" cy="360" r="5" fill="#f59e0b">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Site 4: Data Center */}
      <g id="site-datacenter" className="cursor-pointer" onClick={() => setSelectedComponent("site-datacenter")}>
        <rect x="1000" y="350" width="250" height="150" rx="12" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
        <Database className="w-8 h-8" x="1110" y="375" fill="white" />
        <text x="1125" y="405" textAnchor="middle" className="text-lg fill-white font-bold">
          AWS Data Center
        </text>
        <text x="1125" y="425" textAnchor="middle" className="text-sm fill-red-100">
          200 Servers | 500 Devices
        </text>
        <text x="1125" y="445" textAnchor="middle" className="text-xs fill-red-100">
          Cloud Infrastructure
        </text>
        <text x="1125" y="460" textAnchor="middle" className="text-xs fill-red-100">
          Phase 4: Deployment
        </text>
        <text x="1125" y="475" textAnchor="middle" className="text-xs fill-red-100">
          Progress: 90%
        </text>
        <circle cx="1230" cy="360" r="5" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Connectivity Lines */}
      <g id="site-connections" stroke="#3b82f6" strokeWidth="3" fill="none">
        <path d="M 650 250 L 225 350" strokeDasharray="5,5" />
        <path d="M 700 250 L 525 350" strokeDasharray="5,5" />
        <path d="M 750 250 L 825 350" strokeDasharray="5,5" />
        <path d="M 750 250 L 1125 350" strokeDasharray="5,5" />
      </g>

      {/* Global Statistics */}
      <g id="global-stats">
        <rect
          x="100"
          y="550"
          width="1200"
          height="120"
          rx="10"
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <text x="700" y="580" textAnchor="middle" className="text-lg font-bold fill-blue-800">
          📊 Global Deployment Statistics
        </text>

        <text x="150" y="610" className="text-sm fill-blue-700 font-medium">
          Total Sites: 47
        </text>
        <text x="150" y="630" className="text-sm fill-blue-700 font-medium">
          Active Users: 15,247
        </text>
        <text x="150" y="650" className="text-sm fill-blue-700 font-medium">
          Managed Devices: 28,350
        </text>

        <text x="400" y="610" className="text-sm fill-blue-700 font-medium">
          Completed Sites: 12
        </text>
        <text x="400" y="630" className="text-sm fill-blue-700 font-medium">
          In Progress: 23
        </text>
        <text x="400" y="650" className="text-sm fill-blue-700 font-medium">
          Planned: 12
        </text>

        <text x="650" y="610" className="text-sm fill-blue-700 font-medium">
          Global Uptime: 99.97%
        </text>
        <text x="650" y="630" className="text-sm fill-blue-700 font-medium">
          Avg Auth Time: 1.2s
        </text>
        <text x="650" y="650" className="text-sm fill-blue-700 font-medium">
          Success Rate: 99.8%
        </text>

        <text x="900" y="610" className="text-sm fill-blue-700 font-medium">
          Regions: 6
        </text>
        <text x="900" y="630" className="text-sm fill-blue-700 font-medium">
          Countries: 15
        </text>
        <text x="900" y="650" className="text-sm fill-blue-700 font-medium">
          Time Zones: 12
        </text>

        <text x="1100" y="610" className="text-sm fill-blue-700 font-medium">
          Policies: 1,247
        </text>
        <text x="1100" y="630" className="text-sm fill-blue-700 font-medium">
          Certificates: 25,890
        </text>
        <text x="1100" y="650" className="text-sm fill-blue-700 font-medium">
          Daily Auths: 450K
        </text>
      </g>
    </svg>
  )

  const renderHealthcareArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #fef7f7 0%, #fee2e2 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-red-700">
        🏥 Healthcare Deployment Architecture
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-red-600">
        Medical device prioritization with HIPAA compliance and zero-latency requirements
      </text>
    </svg>
  )

  const renderEducationArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-green-700">
        🎓 Education Campus Architecture
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-green-600">
        University campus with student BYOD, research networks, and high-density WiFi
      </text>
    </svg>
  )

  const renderTACACSArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-blue-700">
        🔧 TACACS+ Integration Architecture
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-blue-600">
        Network device administration with TACACS+ authentication and authorization
      </text>
    </svg>
  )

  const renderWirelessArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-teal-700">
        📡 Wireless Integration Deep-Dive
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-teal-600">
        Wireless controller integration and management with WiFi 6/6E support
      </text>
    </svg>
  )

  const renderUserIDArchitecture = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-yellow-700">
        👤 User-ID & FSSO Integration
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-yellow-600">
        Firewall Single Sign-On and User-ID integration for seamless security
      </text>
    </svg>
  )

  const renderDeviceOnboarding = () => (
    <svg
      viewBox="0 0 1400 800"
      className="w-full h-full architecture-diagram"
      style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)" }}
    >
      <text x="700" y="400" textAnchor="middle" className="text-lg font-semibold fill-lime-700">
        📱 Device Onboarding Scenarios
      </text>
      <text x="700" y="420" textAnchor="middle" className="text-sm fill-lime-600">
        Automated device enrollment and provisioning workflows
      </text>
    </svg>
  )

  const renderDiagramByView = () => {
    switch (view) {
      case "complete":
        return renderCompleteArchitecture()
      case "multi-site":
        return renderMultiSiteArchitecture()
      case "healthcare":
        return renderHealthcareArchitecture()
      case "education":
        return renderEducationArchitecture()
      case "authentication":
      case "auth-flow":
        return renderAuthenticationFlow()
      case "pki":
      case "pki-certificate":
        return renderPKIArchitecture()
      case "tacacs-plus":
        return renderTACACSArchitecture()
      case "wireless-integration":
        return renderWirelessArchitecture()
      case "user-id-integration":
        return renderUserIDArchitecture()
      case "device-onboarding":
      case "onboarding":
        return renderDeviceOnboarding()
      default:
        return renderCompleteArchitecture()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {renderDiagramByView()}

      {/* Enhanced Component Details Panel */}
      {selectedComponent && componentDetails[selectedComponent as keyof typeof componentDetails] && (
        <Card className="absolute top-4 right-4 w-96 max-h-[500px] overflow-y-auto shadow-xl border-2 border-blue-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-blue-900">
                {componentDetails[selectedComponent as keyof typeof componentDetails].name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedComponent(null)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {componentDetails[selectedComponent as keyof typeof componentDetails].description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {/* Technical Specifications */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Technical Specifications
              </h4>
              <ul className="space-y-1">
                {componentDetails[selectedComponent as keyof typeof componentDetails].specs.map((spec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Network Ports */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                <Network className="h-4 w-4 text-blue-600 mr-2" />
                Network Ports
              </h4>
              <div className="flex flex-wrap gap-2">
                {componentDetails[selectedComponent as keyof typeof componentDetails].ports.map((port, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200">
                    {port}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Protocols */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                <Shield className="h-4 w-4 text-purple-600 mr-2" />
                Supported Protocols
              </h4>
              <div className="flex flex-wrap gap-2">
                {componentDetails[selectedComponent as keyof typeof componentDetails].protocols.map(
                  (protocol, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-purple-50 border-purple-200">
                      {protocol}
                    </Badge>
                  ),
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            {componentDetails[selectedComponent as keyof typeof componentDetails].metrics && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                    <Activity className="h-4 w-4 text-green-600 mr-2" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(
                      componentDetails[selectedComponent as keyof typeof componentDetails].metrics || {},
                    ).map(([key, value], index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                        <div className="font-medium text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Legend Panel */}
      {showLegend && (
        <Card className="absolute bottom-4 left-4 w-80 shadow-xl border-2 border-gray-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-slate-50">
            <h3 className="font-bold text-lg flex items-center space-x-2 text-gray-800">
              <Info className="h-5 w-5 text-blue-600" />
              <span>Architecture Legend</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {/* Security Zones */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Security Zones</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                  <span>Trusted Zone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                  <span>DMZ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-400 rounded"></div>
                  <span>Access Layer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
                  <span>Restricted</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Component Types */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Component Types</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Cloud Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Identity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Network</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Data Flow Indicators */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Data Flow</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-1 bg-blue-500 rounded"></div>
                  <span>Authentication Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-1 bg-green-500 rounded"></div>
                  <span>Secure Channel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Flow Indicator</span>
                </div>
                {isAnimating && (
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span>Live Animation Active</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Status Indicators */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Status Indicators</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Online/Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Warning/Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Error/Offline</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
