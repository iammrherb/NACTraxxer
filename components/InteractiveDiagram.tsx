"use client"

import type React from "react"
import { useState, useRef } from "react"

interface DiagramConfig {
  identityProvider?: {
    type: string
    domain: string
    mfaEnabled: boolean
  }
  mdmProvider?: {
    type: string
    complianceEnabled: boolean
  }
  firewallInfrastructure?: {
    vendor: string
    haConfiguration: boolean
  }
  wiredInfrastructure?: {
    vendor: string
    switchCount: number
  }
  wirelessInfrastructure?: {
    vendor: string
    apCount: number
  }
  radiusConfiguration?: {
    type: string
    clustering: boolean
  }
  portnoxAgent?: {
    enabled: boolean
    riskAssessment: boolean
    behaviorAnalytics: boolean
  }
  guestPortal?: {
    enabled: boolean
    captivePortal: boolean
    selfRegistration: boolean
  }
  iotOnboarding?: {
    enabled: boolean
    autoProvisioning: boolean
    deviceProfiling: boolean
  }
}

interface InteractiveDiagramProps {
  view: string
  config?: DiagramConfig
  onExport?: (format: "svg" | "png" | "pdf") => void
}

export default function InteractiveDiagram({ view, config = {}, onExport }: InteractiveDiagramProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showLegend, setShowLegend] = useState(true)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Safe config access with defaults
  const safeConfig = {
    identityProvider: {
      type: "azure-ad",
      domain: "company.com",
      mfaEnabled: true,
      ...config.identityProvider,
    },
    mdmProvider: {
      type: "intune",
      complianceEnabled: true,
      ...config.mdmProvider,
    },
    firewallInfrastructure: {
      vendor: "palo-alto",
      haConfiguration: true,
      ...config.firewallInfrastructure,
    },
    wiredInfrastructure: {
      vendor: "cisco",
      switchCount: 24,
      ...config.wiredInfrastructure,
    },
    wirelessInfrastructure: {
      vendor: "cisco",
      apCount: 48,
      ...config.wirelessInfrastructure,
    },
    radiusConfiguration: {
      type: "cloud-radius",
      clustering: true,
      ...config.radiusConfiguration,
    },
    portnoxAgent: {
      enabled: true,
      riskAssessment: true,
      behaviorAnalytics: true,
      ...config.portnoxAgent,
    },
    guestPortal: {
      enabled: true,
      captivePortal: true,
      selfRegistration: true,
      ...config.guestPortal,
    },
    iotOnboarding: {
      enabled: true,
      autoProvisioning: true,
      deviceProfiling: true,
      ...config.iotOnboarding,
    },
  }

  const handleComponentHover = (event: React.MouseEvent, componentId: string, content: string) => {
    const rect = (event.target as Element).getBoundingClientRect()
    setShowTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: content,
    })
    setHoveredComponent(componentId)
  }

  const handleComponentLeave = () => {
    setShowTooltip(null)
    setHoveredComponent(null)
  }

  const handleExport = async (format: "svg" | "png" | "pdf") => {
    if (!svgRef.current) return

    try {
      if (format === "svg") {
        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `portnox-architecture-${view}-${Date.now()}.svg`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === "png") {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.crossOrigin = "anonymous"
        img.onload = () => {
          canvas.width = img.width * 2
          canvas.height = img.height * 2
          ctx?.scale(2, 2)
          ctx?.drawImage(img, 0, 0)

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.href = url
              link.download = `portnox-architecture-${view}-${Date.now()}.png`
              link.click()
              URL.revokeObjectURL(url)
            }
          })
        }

        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" })
        img.src = URL.createObjectURL(svgBlob)
      }

      onExport?.(format)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const renderCompleteArchitecture = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 1000"
      className="w-full h-full"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Header */}
      <rect x="0" y="0" width="1400" height="80" fill="url(#cloudGradient)" />
      <text x="30" y="35" fill="white" fontSize="22" fontWeight="bold">
        Portnox Zero Trust NAC - Complete Architecture
      </text>
      <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
        Real-time Risk Assessment • Policy Enforcement • Behavioral Analytics
      </text>

      {/* Security Zones */}
      <rect
        x="50"
        y="100"
        width="400"
        height="280"
        fill="#dcfce7"
        stroke="#16a34a"
        strokeWidth="3"
        rx="15"
        opacity="0.4"
        filter="url(#shadow)"
      />
      <text x="70" y="130" fill="#16a34a" fontSize="16" fontWeight="bold">
        🛡️ DMZ Security Zone
      </text>

      <rect
        x="500"
        y="100"
        width="450"
        height="280"
        fill="#fef3c7"
        stroke="#d97706"
        strokeWidth="3"
        rx="15"
        opacity="0.4"
        filter="url(#shadow)"
      />
      <text x="520" y="130" fill="#d97706" fontSize="16" fontWeight="bold">
        🏢 Corporate Network Zone
      </text>

      <rect
        x="1000"
        y="100"
        width="350"
        height="280"
        fill="#dbeafe"
        stroke="#2563eb"
        strokeWidth="3"
        rx="15"
        opacity="0.4"
        filter="url(#shadow)"
      />
      <text x="1020" y="130" fill="#2563eb" fontSize="16" fontWeight="bold">
        ☁️ Cloud Services Zone
      </text>

      {/* Cloud Services */}
      <g
        onMouseEnter={(e) =>
          handleComponentHover(
            e,
            "portnox-cloud",
            "Portnox Cloud NAC Platform\nPorts: 443, 1812/1813\nProtocols: HTTPS, RADIUS, RADSEC",
          )
        }
        onMouseLeave={handleComponentLeave}
        style={{ cursor: "pointer" }}
        filter={hoveredComponent === "portnox-cloud" ? "url(#glow)" : "url(#shadow)"}
      >
        <rect x="1050" y="160" width="140" height="100" fill="url(#cloudGradient)" rx="12" />
        <text x="1120" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Portnox Cloud
        </text>
        <text x="1120" y="205" textAnchor="middle" fill="white" fontSize="12">
          NAC Platform
        </text>
        <text x="1120" y="220" textAnchor="middle" fill="white" fontSize="10">
          AI Risk Engine
        </text>
        <circle cx="1170" cy="240" r="5" fill="#10b981">
          {isAnimating && (
            <animate attributeName="opacity" values="1;0.3;1" dur={`${2 / animationSpeed}s`} repeatCount="indefinite" />
          )}
        </circle>
        <text x="1120" y="255" textAnchor="middle" fill="white" fontSize="9">
          99.9% UP • 15.4K Sessions
        </text>
      </g>

      {/* Identity Provider */}
      <g
        onMouseEnter={(e) =>
          handleComponentHover(
            e,
            "identity-provider",
            "Azure AD Identity Provider\nPorts: 443, 389/636, 88\nProtocols: HTTPS, LDAP, SAML, OAuth",
          )
        }
        onMouseLeave={handleComponentLeave}
        style={{ cursor: "pointer" }}
        filter={hoveredComponent === "identity-provider" ? "url(#glow)" : "url(#shadow)"}
      >
        <rect x="1220" y="160" width="120" height="100" fill="#8b5cf6" rx="12" />
        <text x="1280" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {safeConfig.identityProvider.type.toUpperCase()}
        </text>
        <text x="1280" y="205" textAnchor="middle" fill="white" fontSize="12">
          Identity Provider
        </text>
        <text x="1280" y="220" textAnchor="middle" fill="white" fontSize="10">
          {safeConfig.identityProvider.mfaEnabled ? "MFA Enabled" : "Basic Auth"}
        </text>
        <circle cx="1320" cy="240" r="5" fill="#10b981">
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur={`${2.5 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
        <text x="1280" y="255" textAnchor="middle" fill="white" fontSize="9">
          8.7K Users • SSO Active
        </text>
      </g>

      {/* MDM Provider */}
      <g
        onMouseEnter={(e) =>
          handleComponentHover(
            e,
            "mdm-provider",
            "Microsoft Intune MDM\nPorts: 443, 2195/2196\nProtocols: HTTPS, SCEP, APNS",
          )
        }
        onMouseLeave={handleComponentLeave}
        style={{ cursor: "pointer" }}
        filter={hoveredComponent === "mdm-provider" ? "url(#glow)" : "url(#shadow)"}
      >
        <rect x="1050" y="280" width="140" height="100" fill="#06b6d4" rx="12" />
        <text x="1120" y="305" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {safeConfig.mdmProvider.type.charAt(0).toUpperCase() + safeConfig.mdmProvider.type.slice(1)}
        </text>
        <text x="1120" y="325" textAnchor="middle" fill="white" fontSize="12">
          MDM Platform
        </text>
        <text x="1120" y="340" textAnchor="middle" fill="white" fontSize="10">
          {safeConfig.mdmProvider.complianceEnabled ? "Compliance ON" : "Monitor Mode"}
        </text>
        <circle cx="1170" cy="360" r="5" fill="#10b981">
          {isAnimating && (
            <animate attributeName="opacity" values="1;0.3;1" dur={`${3 / animationSpeed}s`} repeatCount="indefinite" />
          )}
        </circle>
        <text x="1120" y="375" textAnchor="middle" fill="white" fontSize="9">
          3.2K Devices • 98% Compliant
        </text>
      </g>

      {/* Network Infrastructure */}
      <g
        onMouseEnter={(e) =>
          handleComponentHover(
            e,
            "switches",
            "Network Switches\nPorts: 22 (SSH), 161/162 (SNMP)\nProtocols: 802.1X, RADIUS, SNMP",
          )
        }
        onMouseLeave={handleComponentLeave}
        style={{ cursor: "pointer" }}
        filter={hoveredComponent === "switches" ? "url(#glow)" : "url(#shadow)"}
      >
        <rect x="550" y="160" width="140" height="100" fill="#059669" rx="12" />
        <text x="620" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {safeConfig.wiredInfrastructure.vendor.charAt(0).toUpperCase() +
            safeConfig.wiredInfrastructure.vendor.slice(1)}
        </text>
        <text x="620" y="205" textAnchor="middle" fill="white" fontSize="12">
          Core Switches
        </text>
        <text x="620" y="220" textAnchor="middle" fill="white" fontSize="10">
          802.1X • RADIUS • VLAN
        </text>
        <circle cx="670" cy="240" r="5" fill="#10b981">
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur={`${2.2 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
        <text x="620" y="255" textAnchor="middle" fill="white" fontSize="9">
          {safeConfig.wiredInfrastructure.switchCount} SW • 1.2K Ports
        </text>
      </g>

      {/* Wireless Infrastructure */}
      <g
        onMouseEnter={(e) =>
          handleComponentHover(
            e,
            "wireless",
            "Wireless Access Points\nPorts: 443 (HTTPS), 1812/1813 (RADIUS)\nProtocols: 802.11ax, WPA3, RADIUS",
          )
        }
        onMouseLeave={handleComponentLeave}
        style={{ cursor: "pointer" }}
        filter={hoveredComponent === "wireless" ? "url(#glow)" : "url(#shadow)"}
      >
        <rect x="720" y="160" width="140" height="100" fill="#7c3aed" rx="12" />
        <text x="790" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {safeConfig.wirelessInfrastructure.vendor.charAt(0).toUpperCase() +
            safeConfig.wirelessInfrastructure.vendor.slice(1)}
        </text>
        <text x="790" y="205" textAnchor="middle" fill="white" fontSize="12">
          Wireless APs
        </text>
        <text x="790" y="220" textAnchor="middle" fill="white" fontSize="10">
          WiFi 6 • WPA3 • RADIUS
        </text>
        <circle cx="840" cy="240" r="5" fill="#10b981">
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur={`${2.8 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
        <text x="790" y="255" textAnchor="middle" fill="white" fontSize="9">
          {safeConfig.wirelessInfrastructure.apCount} APs • 4.8K Clients
        </text>
      </g>

      {/* Guest Portal */}
      {safeConfig.guestPortal.enabled && (
        <g
          onMouseEnter={(e) =>
            handleComponentHover(
              e,
              "guest-portal",
              "Guest Portal & Captive Portal\nPorts: 443, 80, 8443\nProtocols: HTTPS, HTTP, SMTP",
            )
          }
          onMouseLeave={handleComponentLeave}
          style={{ cursor: "pointer" }}
          filter={hoveredComponent === "guest-portal" ? "url(#glow)" : "url(#shadow)"}
        >
          <rect x="100" y="160" width="140" height="100" fill="#f59e0b" rx="12" />
          <text x="170" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            Guest Portal
          </text>
          <text x="170" y="205" textAnchor="middle" fill="white" fontSize="12">
            Captive Portal
          </text>
          <text x="170" y="220" textAnchor="middle" fill="white" fontSize="10">
            Self-Registration
          </text>
          <circle cx="220" cy="240" r="5" fill="#10b981">
            {isAnimating && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur={`${3.5 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x="170" y="255" textAnchor="middle" fill="white" fontSize="9">
            850 Guests • 24h Access
          </text>
        </g>
      )}

      {/* IoT Onboarding */}
      {safeConfig.iotOnboarding.enabled && (
        <g
          onMouseEnter={(e) =>
            handleComponentHover(
              e,
              "iot-onboarding",
              "IoT Device Onboarding\nPorts: 443, 161/162, 67/68\nProtocols: HTTPS, SNMP, DHCP, CDP, LLDP",
            )
          }
          onMouseLeave={handleComponentLeave}
          style={{ cursor: "pointer" }}
          filter={hoveredComponent === "iot-onboarding" ? "url(#glow)" : "url(#shadow)"}
        >
          <rect x="270" y="160" width="140" height="100" fill="#8b5cf6" rx="12" />
          <text x="340" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            IoT Onboarding
          </text>
          <text x="340" y="205" textAnchor="middle" fill="white" fontSize="12">
            Auto Discovery
          </text>
          <text x="340" y="220" textAnchor="middle" fill="white" fontSize="10">
            Device Profiling
          </text>
          <circle cx="390" cy="240" r="5" fill="#10b981">
            {isAnimating && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur={`${4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x="340" y="255" textAnchor="middle" fill="white" fontSize="9">
            2.4K IoT • Segmented
          </text>
        </g>
      )}

      {/* Animated Data Flows */}
      {isAnimating && (
        <>
          <line
            x1="620"
            y1="210"
            x2="1120"
            y2="210"
            stroke="#10b981"
            strokeWidth="4"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,1000;1000,0"
              dur={`${2.5 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="1120"
            y1="210"
            x2="1280"
            y2="210"
            stroke="#8b5cf6"
            strokeWidth="4"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0,1000;1000,0"
              dur={`${2 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          </line>
        </>
      )}

      {/* Performance Metrics Dashboard */}
      <rect
        x="50"
        y="420"
        width="1300"
        height="180"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="12"
        filter="url(#shadow)"
      />
      <text x="80" y="450" fill="#374151" fontSize="18" fontWeight="bold">
        🔍 Real-Time Security & Performance Analytics
      </text>

      <g transform="translate(80, 470)">
        <rect width="240" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Authentication Rate
        </text>
        <text x="15" y="45" fill="#059669" fontSize="20" fontWeight="bold">
          10,247/min
        </text>
        <text x="15" y="65" fill="#6b7280" fontSize="11">
          ↑ 12% from last hour • 99.7% success
        </text>
        <circle cx="210" cy="40" r="8" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />}
        </circle>
      </g>

      <g transform="translate(340, 470)">
        <rect width="240" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Risk Assessment
        </text>
        <text x="15" y="45" fill="#059669" fontSize="20" fontWeight="bold">
          Score: 23/100
        </text>
        <text x="15" y="65" fill="#6b7280" fontSize="11">
          Low Risk • 12.5K agents active
        </text>
        <circle cx="210" cy="40" r="8" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />}
        </circle>
      </g>

      <g transform="translate(600, 470)">
        <rect width="240" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Device Compliance
        </text>
        <text x="15" y="45" fill="#059669" fontSize="20" fontWeight="bold">
          98.2%
        </text>
        <text x="15" y="65" fill="#6b7280" fontSize="11">
          3,250 devices • 58 non-compliant
        </text>
        <circle cx="210" cy="40" r="8" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />}
        </circle>
      </g>

      <g transform="translate(860, 470)">
        <rect width="240" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Active Sessions
        </text>
        <text x="15" y="45" fill="#059669" fontSize="20" fontWeight="bold">
          15,420
        </text>
        <text x="15" y="65" fill="#6b7280" fontSize="11">
          Peak: 18,500 • Avg latency: 47ms
        </text>
        <circle cx="210" cy="40" r="8" fill="#10b981">
          {isAnimating && <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />}
        </circle>
      </g>

      <g transform="translate(1120, 470)">
        <rect width="160" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Threat Detection
        </text>
        <text x="15" y="45" fill="#dc2626" fontSize="20" fontWeight="bold">
          247 Blocked
        </text>
        <text x="15" y="65" fill="#6b7280" fontSize="11">
          Last 24h • 0 false positives
        </text>
        <circle cx="130" cy="40" r="8" fill="#ef4444">
          {isAnimating && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Legend */}
      {showLegend && (
        <g transform="translate(50, 630)">
          <rect width="1300" height="120" fill="white" stroke="#e5e7eb" strokeWidth="2" rx="12" filter="url(#shadow)" />
          <text x="30" y="35" fill="#374151" fontSize="18" fontWeight="bold">
            🎯 Interactive Architecture Legend & Workflow Guide
          </text>

          <g transform="translate(30, 50)">
            <text x="0" y="20" fill="#374151" fontSize="14" fontWeight="bold">
              Components:
            </text>

            <rect x="0" y="30" width="20" height="15" fill="url(#cloudGradient)" rx="3" />
            <text x="30" y="42" fill="#374151" fontSize="12">
              Cloud NAC Platform
            </text>

            <rect x="180" y="30" width="20" height="15" fill="#8b5cf6" rx="3" />
            <text x="210" y="42" fill="#374151" fontSize="12">
              Identity Provider
            </text>

            <rect x="360" y="30" width="20" height="15" fill="#06b6d4" rx="3" />
            <text x="390" y="42" fill="#374151" fontSize="12">
              MDM Platform
            </text>

            <rect x="540" y="30" width="20" height="15" fill="url(#securityGradient)" rx="3" />
            <text x="570" y="42" fill="#374151" fontSize="12">
              Network Infrastructure
            </text>

            <rect x="720" y="30" width="20" height="15" fill="#f59e0b" rx="3" />
            <text x="750" y="42" fill="#374151" fontSize="12">
              Guest Portal
            </text>

            <rect x="880" y="30" width="20" height="15" fill="#8b5cf6" rx="3" />
            <text x="910" y="42" fill="#374151" fontSize="12">
              IoT Onboarding
            </text>
          </g>
        </g>
      )}
    </svg>
  )

  const renderJuniperMistView = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1600 1200"
      className="w-full h-full"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <filter id="shadow">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
        <linearGradient id="mistGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Header */}
      <rect x="0" y="0" width="1600" height="80" fill="url(#mistGradient)" />
      <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
        Juniper Mist AI-Driven Wireless
      </text>
      <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
        AI-Powered Automation • Cloud Management • Insights & Analytics
      </text>

      {/* Juniper Mist Cloud */}
      <g transform="translate(700, 120)">
        <rect width="200" height="120" fill="url(#mistGradient)" rx="15" filter="url(#shadow)" />
        <text x="100" y="35" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Juniper Mist Cloud
        </text>
        <text x="100" y="55" textAnchor="middle" fill="white" fontSize="12">
          AI-Driven Management
        </text>
        <text x="100" y="75" textAnchor="middle" fill="white" fontSize="10">
          Automation & Analytics
        </text>
        <text x="100" y="95" textAnchor="middle" fill="white" fontSize="10">
          Centralized Control
        </text>
        <circle cx="180" cy="100" r="6" fill="#10b981">
          {isAnimating && (
            <animate attributeName="opacity" values="1;0.3;1" dur={`${2 / animationSpeed}s`} repeatCount="indefinite" />
          )}
        </circle>
      </g>

      {/* Juniper Mist Wireless Network */}
      <g transform="translate(100, 300)">
        <rect width="300" height="200" fill="#e5e7eb" stroke="#64748b" strokeWidth="2" rx="10" opacity="0.9" />
        <text x="15" y="25" fill="#1e293b" fontSize="16" fontWeight="bold">
          Juniper Mist Wireless Network
        </text>
        <text x="15" y="45" fill="#1e293b" fontSize="12">
          AI-Driven Wireless Infrastructure
        </text>

        <rect x="20" y="60" width="80" height="60" fill="#64748b" rx="8" />
        <text x="60" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Mist AP45
        </text>
        <text x="60" y="100" textAnchor="middle" fill="white" fontSize="9">
          802.11ax
        </text>
        <text x="60" y="115" textAnchor="middle" fill="white" fontSize="8">
          AI-Driven
        </text>

        <rect x="120" y="60" width="80" height="60" fill="#64748b" rx="8" />
        <text x="160" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Mist AP43
        </text>
        <text x="160" y="100" textAnchor="middle" fill="white" fontSize="9">
          802.11ac Wave 2
        </text>
        <text x="160" y="115" textAnchor="middle" fill="white" fontSize="8">
          Location Services
        </text>

        <rect x="220" y="60" width="60" height="60" fill="#64748b" rx="8" />
        <text x="250" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          BT11
        </text>
        <text x="250" y="100" textAnchor="middle" fill="white" fontSize="9">
          Bluetooth
        </text>
        <text x="250" y="115" textAnchor="middle" fill="white" fontSize="8">
          IoT Sensors
        </text>

        <text x="20" y="150" fill="#1e293b" fontSize="11">
          • Cloud Management
        </text>
        <text x="20" y="165" fill="#1e293b" fontSize="11">
          • AI-Driven Automation
        </text>
        <text x="20" y="180" fill="#1e293b" fontSize="11">
          • Location Services
        </text>
        <circle cx="270" cy="180" r="5" fill="#10b981" />
      </g>

      {/* Wireless Clients */}
      <g transform="translate(450, 300)">
        <rect width="300" height="200" fill="#f8fafc" stroke="#475569" strokeWidth="2" rx="10" opacity="0.9" />
        <text x="15" y="25" fill="#1e293b" fontSize="16" fontWeight="bold">
          Wireless Clients
        </text>
        <text x="15" y="45" fill="#1e293b" fontSize="12">
          Connected Devices
        </text>

        <rect x="20" y="60" width="80" height="60" fill="#475569" rx="8" />
        <text x="60" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Laptops
        </text>
        <text x="60" y="100" textAnchor="middle" fill="white" fontSize="9">
          Corporate
        </text>
        <text x="60" y="115" textAnchor="middle" fill="white" fontSize="8">
          802.1X
        </text>

        <rect x="120" y="60" width="80" height="60" fill="#475569" rx="8" />
        <text x="160" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Smartphones
        </text>
        <text x="160" y="100" textAnchor="middle" fill="white" fontSize="9">
          BYOD
        </text>
        <text x="160" y="115" textAnchor="middle" fill="white" fontSize="8">
          WPA2
        </text>

        <rect x="220" y="60" width="60" height="60" fill="#475569" rx="8" />
        <text x="250" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Tablets
        </text>
        <text x="250" y="100" textAnchor="middle" fill="white" fontSize="9">
          Guest
        </text>
        <text x="250" y="115" textAnchor="middle" fill="white" fontSize="8">
          Captive Portal
        </text>

        <text x="20" y="150" fill="#1e293b" fontSize="11">
          • Secure Access
        </text>
        <text x="20" y="165" fill="#1e293b" fontSize="11">
          • Policy Enforcement
        </text>
        <text x="20" y="180" fill="#1e293b" fontSize="11">
          • Guest Access
        </text>
        <circle cx="270" cy="180" r="5" fill="#10b981" />
      </g>

      {/* Portnox Integration */}
      <g transform="translate(800, 300)">
        <rect width="300" height="200" fill="#f0fdfa" stroke="#10b981" strokeWidth="2" rx="10" opacity="0.9" />
        <text x="15" y="25" fill="#065f46" fontSize="16" fontWeight="bold">
          Portnox Integration
        </text>
        <text x="15" y="45" fill="#065f46" fontSize="12">
          Zero Trust NAC
        </text>

        <rect x="20" y="60" width="80" height="60" fill="#10b981" rx="8" />
        <text x="60" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Visibility
        </text>
        <text x="60" y="100" textAnchor="middle" fill="white" fontSize="9">
          Device Profiling
        </text>
        <text x="60" y="115" textAnchor="middle" fill="white" fontSize="8">
          Context
        </text>

        <rect x="120" y="60" width="80" height="60" fill="#10b981" rx="8" />
        <text x="160" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Control
        </text>
        <text x="160" y="100" textAnchor="middle" fill="white" fontSize="9">
          Policy Enforcement
        </text>
        <text x="160" y="115" textAnchor="middle" fill="white" fontSize="8">
          Segmentation
        </text>

        <rect x="220" y="60" width="60" height="60" fill="#10b981" rx="8" />
        <text x="250" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Automation
        </text>
        <text x="250" y="100" textAnchor="middle" fill="white" fontSize="9">
          Remediation
        </text>
        <text x="250" y="115" textAnchor="middle" fill="white" fontSize="8">
          Response
        </text>

        <text x="20" y="150" fill="#065f46" fontSize="11">
          • Enhanced Security
        </text>
        <text x="20" y="165" fill="#065f46" fontSize="11">
          • Automated Response
        </text>
        <text x="20" y="180" fill="#065f46" fontSize="11">
          • Zero Trust
        </text>
        <circle cx="270" cy="180" r="5" fill="#10b981" />
      </g>

      {/* Integration Flow */}
      <g transform="translate(200, 550)">
        <rect width="1200" height="200" fill="white" stroke="#e5e7eb" strokeWidth="2" rx="15" filter="url(#shadow)" />
        <text x="30" y="35" fill="#374151" fontSize="18" fontWeight="bold">
          Integration Flow
        </text>

        <g transform="translate(50, 60)">
          <rect width="180" height="100" fill="#dbeafe" rx="10" />
          <text x="90" y="25" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">
            1. Device Connects
          </text>
          <text x="90" y="45" textAnchor="middle" fill="#1e293b" fontSize="11">
            Wireless Client
          </text>
          <text x="90" y="60" textAnchor="middle" fill="#1e293b" fontSize="10">
            Association
          </text>
          <text x="90" y="75" textAnchor="middle" fill="#1e293b" fontSize="10">
            Authentication
          </text>
          <text x="90" y="90" textAnchor="middle" fill="#1e293b" fontSize="9">
            DHCP
          </text>
        </g>

        <g transform="translate(260, 60)">
          <rect width="180" height="100" fill="#ede9fe" rx="10" />
          <text x="90" y="25" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">
            2. Meraki Cloud
          </text>
          <text x="90" y="45" textAnchor="middle" fill="#1e293b" fontSize="11">
            Device Profiling
          </text>
          <text x="90" y="60" textAnchor="middle" fill="#1e293b" fontSize="10">
            Context Collection
          </text>
          <text x="90" y="75" textAnchor="middle" fill="#1e293b" fontSize="10">
            API Integration
          </text>
          <text x="90" y="90" textAnchor="middle" fill="#1e293b" fontSize="9">
            Analytics
          </text>
        </g>

        <g transform="translate(470, 60)">
          <rect width="180" height="100" fill="#f0fdfa" rx="10" />
          <text x="90" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            3. Portnox NAC
          </text>
          <text x="90" y="45" textAnchor="middle" fill="#065f46" fontSize="11">
            Policy Evaluation
          </text>
          <text x="90" y="60" textAnchor="middle" fill="#065f46" fontSize="10">
            Risk Assessment
          </text>
          <text x="90" y="75" textAnchor="middle" fill="#065f46" fontSize="10">
            Contextual Analysis
          </text>
          <text x="90" y="90" fill="#065f46" fontSize="9">
            Dynamic Rules
          </text>
        </g>

        <g transform="translate(680, 60)">
          <rect width="180" height="100" fill="#e5e7eb" rx="10" />
          <text x="90" y="25" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="bold">
            4. Policy Enforcement
          </text>
          <text x="90" y="45" textAnchor="middle" fill="#1e293b" fontSize="11">
            Access Control
          </text>
          <text x="90" y="60" fill="#1e293b" fontSize="10">
            VLAN Assignment
          </text>
          <text x="90" y="75" fill="#1e293b" fontSize="10">
            QoS Prioritization
          </text>
          <text x="90" y="90" fill="#1e293b" fontSize="9">
            Traffic Shaping
          </text>
        </g>

        <g transform="translate(890, 60)">
          <rect width="180" height="100" fill="#f0fdfa" rx="10" />
          <text x="90" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            5. Automated Response
          </text>
          <text x="90" y="45" fill="#065f46" fontSize="11">
            Remediation Actions
          </text>
          <text x="90" y="60" fill="#065f46" fontSize="10">
            Quarantine
          </text>
          <text x="90" y="75" fill="#065f46" fontSize="10">
            Block Access
          </text>
          <text x="90" y="90" fill="#065f46" fontSize="9">
            Alerting
          </text>
        </g>

        {/* Flow Arrows */}
        {isAnimating && (
          <>
            <line x1="230" y1="110" x2="260" y2="110" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="440" y1="110" x2="470" y2="110" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="650" y1="110" x2="680" y2="110" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="860" y1="110" x2="890" y2="110" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.6 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
          </>
        )}

        <text x="600" y="180" textAnchor="middle" fill="#374151" fontSize="12">
          Complete Integration Flow: Device → Meraki Cloud → Portnox NAC → Policy Enforcement
        </text>
      </g>

      {/* Statistics */}
      <rect
        x="50"
        y="800"
        width="1500"
        height="180"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="12"
        filter="url(#shadow)"
      />
      <text x="80" y="830" fill="#374151" fontSize="18" fontWeight="bold">
        📊 Meraki Wireless Network Analytics & Performance
      </text>

      <g transform="translate(80, 850)">
        <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Wireless Performance
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          ✅ Average Throughput: 500 Mbps
        </text>
        <text x="15" y="60" fill="#374151" fontSize="12">
          📶 Signal Strength: -65 dBm
        </text>
        <text x="15" y="75" fill="#374151" fontSize="12">
          Client Count: 4,800
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Channel Utilization: 60%
        </text>
      </g>

      <g transform="translate(380, 850)">
        <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Client Distribution
        </text>
        <text x="15" y="45" fill="#374151" fontSize="12">
          Corporate Laptops: 2,500
        </text>
        <text x="15" y="60" fill="#374151" fontSize="12">
          BYOD Smartphones: 1,200
        </text>
        <text x="15" y="75" fill="#374151" fontSize="12">
          Guest Tablets: 600
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          IoT Devices: 500
        </text>
      </g>

      <g transform="translate(680, 850)">
        <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Security Metrics
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          ✅ WPA3 Encryption: 100%
        </text>
        <text x="15" y="60" fill="#f59e0b" fontSize="12">
          ⚠️ Rogue APs Detected: 2
        </text>
        <text x="15" y="75" fill="#ef4444" fontSize="12">
          🚫 Blocked Threats: 15
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Intrusion Attempts: 32
        </text>
      </g>

      <g transform="translate(980, 850)">
        <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Guest Access
        </text>
        <text x="15" y="45" fill="#374151" fontSize="12">
          Active Guest Sessions: 850
        </text>
        <text x="15" y="60" fill="#374151" fontSize="12">
          Average Session Time: 4h
        </text>
        <text x="15" y="75" fill="#374151" fontSize="12">
          Bandwidth Usage: 500 Mbps
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Captive Portal: Enabled
        </text>
      </g>
    </svg>
  )

  const renderPolicyFrameworkView = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1600 1200"
      className="w-full h-full"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <filter id="shadow">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
        <linearGradient id="policyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Header */}
      <rect x="0" y="0" width="1600" height="80" fill="url(#policyGradient)" />
      <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
        🎯 Policy Framework & Risk Assessment Engine
      </text>
      <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
        Dynamic Policy Engine • Risk-Based Access Control • Behavioral Analytics • Automated Remediation
      </text>

      {/* Policy Engine Core */}
      <g transform="translate(650, 120)">
        <rect width="300" height="150" fill="url(#policyGradient)" rx="20" filter="url(#shadow)" />
        <text x="150" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
          🧠 Portnox Policy Engine
        </text>
        <text x="150" y="60" textAnchor="middle" fill="white" fontSize="14">
          AI-Powered Decision Making
        </text>
        <text x="150" y="80" textAnchor="middle" fill="white" fontSize="12">
          Real-time Risk Assessment
        </text>
        <text x="150" y="100" textAnchor="middle" fill="white" fontSize="12">
          Dynamic Policy Enforcement
        </text>
        <text x="150" y="120" textAnchor="middle" fill="white" fontSize="12">
          Behavioral Analytics
        </text>
        <circle cx="270" cy="130" r="8" fill="#10b981">
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur={`${1.5 / animationSpeed}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
        <text x="150" y="145" textAnchor="middle" fill="white" fontSize="10">
          Processing: 15,420 policies/sec
        </text>
      </g>

      {/* Policy Categories */}
      <g transform="translate(50, 320)">
        <rect width="220" height="140" fill="#7c3aed" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          👤 User Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Identity-Based Access Control
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • Role-based access (RBAC)
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • Attribute-based access (ABAC)
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • Time-based restrictions
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • Location-based controls
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 1,247
        </text>
      </g>

      <g transform="translate(300, 320)">
        <rect width="220" height="140" fill="#3b82f6" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          💻 Device Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Device-Based Access Control
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • Device compliance checks
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • OS version requirements
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • Encryption status validation
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • Certificate-based auth
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 2,156
        </text>
      </g>

      <g transform="translate(550, 320)">
        <rect width="220" height="140" fill="#10b981" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          🌐 Network Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Network-Based Access Control
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • VLAN assignment rules
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • Bandwidth limitations
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • QoS prioritization
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • Firewall rule injection
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 3,892
        </text>
      </g>

      <g transform="translate(800, 320)">
        <rect width="220" height="140" fill="#f59e0b" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          🛡️ Security Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Risk-Based Security Controls
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • Threat detection rules
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • Anomaly detection
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • Quarantine triggers
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • Incident response
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 1,789
        </text>
      </g>

      <g transform="translate(1050, 320)">
        <rect width="220" height="140" fill="#dc2626" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          📋 Compliance Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Regulatory Compliance Controls
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • HIPAA compliance
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • PCI-DSS requirements
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • SOX controls
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • GDPR privacy rules
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 892
        </text>
      </g>

      <g transform="translate(1300, 320)">
        <rect width="220" height="140" fill="#8b5cf6" rx="12" filter="url(#shadow)" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          🎮 Guest Policies
        </text>
        <text x="110" y="50" textAnchor="middle" fill="white" fontSize="12">
          Guest Access Management
        </text>
        <text x="20" y="75" fill="white" fontSize="10">
          • Sponsor approval workflow
        </text>
        <text x="20" y="90" fill="white" fontSize="10">
          • Time-limited access
        </text>
        <text x="20" y="105" fill="white" fontSize="10">
          • Bandwidth restrictions
        </text>
        <text x="20" y="120" fill="white" fontSize="10">
          • Internet-only access
        </text>
        <text x="110" y="135" textAnchor="middle" fill="white" fontSize="9">
          Active Policies: 456
        </text>
      </g>

      {/* Risk Assessment Engine */}
      <rect
        x="100"
        y="500"
        width="1400"
        height="200"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="15"
        filter="url(#shadow)"
      />
      <text x="130" y="535" fill="#374151" fontSize="18" fontWeight="bold">
        🎯 Advanced Risk Assessment & Behavioral Analytics Engine
      </text>

      <g transform="translate(150, 560)">
        <rect width="250" height="120" fill="#ef4444" rx="10" />
        <text x="125" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          🔴 Critical Risk Factors
        </text>
        <text x="125" y="45" textAnchor="middle" fill="white" fontSize="11">
          Immediate Action Required
        </text>
        <text x="15" y="65" fill="white" fontSize="10">
          • Malware detection (Score: +40)
        </text>
        <text x="15" y="80" fill="white" fontSize="10">
          • Compromised credentials (+35)
        </text>
        <text x="15" y="95" fill="white" fontSize="10">
          • Suspicious behavior (+30)
        </text>
        <text x="15" y="110" fill="white" fontSize="9">
          Devices affected: 23 (0.15%)
        </text>
      </g>

      <g transform="translate(420, 560)">
        <rect width="250" height="120" fill="#f59e0b" rx="10" />
        <text x="125" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          🟠 High Risk Factors
        </text>
        <text x="125" y="45" textAnchor="middle" fill="white" fontSize="11">
          Enhanced Monitoring
        </text>
        <text x="15" y="65" fill="white" fontSize="10">
          • Non-compliant device (+25)
        </text>
        <text x="15" y="80" fill="white" fontSize="10">
          • Outdated OS version (+20)
        </text>
        <text x="15" y="95" fill="white" fontSize="10">
          • Failed authentication (+15)
        </text>
        <text x="15" y="110" fill="white" fontSize="9">
          Devices affected: 187 (1.2%)
        </text>
      </g>

      <g transform="translate(690, 560)">
        <rect width="250" height="120" fill="#fbbf24" rx="10" />
        <text x="125" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          🟡 Medium Risk Factors
        </text>
        <text x="125" y="45" textAnchor="middle" fill="white" fontSize="11">
          Standard Monitoring
        </text>
        <text x="15" y="65" fill="white" fontSize="10">
          • BYOD device (+10)
        </text>
        <text x="15" y="80" fill="white" fontSize="10">
          • Guest network access (+8)
        </text>
        <text x="15" y="95" fill="white" fontSize="10">
          • Off-hours access (+5)
        </text>
        <text x="15" y="110" fill="white" fontSize="9">
          Devices affected: 1,456 (9.4%)
        </text>
      </g>

      <g transform="translate(960, 560)">
        <rect width="250" height="120" fill="#10b981" rx="10" />
        <text x="125" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          🟢 Low Risk Factors
        </text>
        <text x="125" y="45" textAnchor="middle" fill="white" fontSize="11">
          Normal Operations
        </text>
        <text x="15" y="65" fill="white" fontSize="10">
          • Compliant corporate device
        </text>
        <text x="15" y="80" fill="white" fontSize="10">
          • Valid certificates
        </text>
        <text x="15" y="95" fill="white" fontSize="10">
          • Normal behavior patterns
        </text>
        <text x="15" y="110" fill="white" fontSize="9">
          Devices affected: 13,754 (89.2%)
        </text>
      </g>

      <g transform="translate(1230, 560)">
        <rect width="220" height="120" fill="#6366f1" rx="10" />
        <text x="110" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          🤖 AI Analytics
        </text>
        <text x="110" y="45" textAnchor="middle" fill="white" fontSize="11">
          Machine Learning Insights
        </text>
        <text x="15" y="65" fill="white" fontSize="10">
          • Behavioral anomalies
        </text>
        <text x="15" y="80" fill="white" fontSize="10">
          • Pattern recognition
        </text>
        <text x="15" y="95" fill="white" fontSize="10">
          • Predictive scoring
        </text>
        <text x="15" y="110" fill="white" fontSize="9">
          ML Accuracy: 94.7%
        </text>
      </g>

      {/* Real-time Policy Execution */}
      <rect
        x="100"
        y="750"
        width="1400"
        height="180"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="12"
        filter="url(#shadow)"
      />
      <text x="130" y="785" fill="#374151" fontSize="18" fontWeight="bold">
        ⚡ Real-Time Policy Execution & Performance Metrics
      </text>

      <g transform="translate(150, 800)">
        <rect width="320" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Policy Execution Performance
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          ⚡ Average Decision Time: 47ms
        </text>
        <text x="15" y="60" fill="#10b981" fontSize="12">
          📊 Policy Evaluations: 15,420/sec
        </text>
        <text x="15" y="75" fill="#10b981" fontSize="12">
          🎯 Success Rate: 99.7%
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Peak Load: 25,000/sec handled
        </text>
      </g>

      <g transform="translate(490, 800)">
        <rect width="320" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Risk Assessment Metrics
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          🧠 AI Model Accuracy: 94.7%
        </text>
        <text x="15" y="60" fill="#f59e0b" fontSize="12">
          ⚠️ False Positives: 0.3%
        </text>
        <text x="15" y="75" fill="#ef4444" fontSize="12">
          🚨 Critical Alerts: 23 (24h)
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Behavioral Patterns: 1.2M analyzed
        </text>
      </g>

      <g transform="translate(830, 800)">
        <rect width="320" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Policy Compliance Status
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          ✅ HIPAA Compliance: 100%
        </text>
        <text x="15" y="60" fill="#10b981" fontSize="12">
          ✅ PCI-DSS Compliance: 98.7%
        </text>
        <text x="15" y="75" fill="#10b981" fontSize="12">
          ✅ SOX Controls: Active
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Last Audit: Passed
        </text>
      </g>

      <g transform="translate(1170, 800)">
        <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
        <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
          Automated Remediation
        </text>
        <text x="15" y="45" fill="#10b981" fontSize="12">
          🔄 Auto-remediated: 1,247
        </text>
        <text x="15" y="60" fill="#3b82f6" fontSize="12">
          🎯 Quarantined: 89 devices
        </text>
        <text x="15" y="75" fill="#dc2626" fontSize="12">
          🚫 Blocked: 156 attempts
        </text>
        <text x="15" y="90" fill="#6b7280" fontSize="11">
          Response Time: Avg 2.3s
        </text>
      </g>
    </svg>
  )

  const renderView = () => {
    switch (view) {
      case "complete":
        return renderCompleteArchitecture()
      case "authentication":
        return renderAuthenticationFlow()
      case "pki":
        return renderPKIView()
      case "policy-framework":
        return renderPolicyFrameworkView()
      case "meraki-wireless":
        return renderMerakiWirelessView()
      case "cisco-tacacs":
        return renderTacacsView()
      default:
        return renderCompleteArchitecture()
    }
  }

  const renderAuthenticationFlow = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1600 1200"
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
          <linearGradient id="authGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Header */}
        <rect x="0" y="0" width="1600" height="80" fill="url(#authGradient)" />
        <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
          🔑 Authentication Flow
        </text>
        <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
          Device Authentication • User Authentication • Policy Enforcement
        </text>

        {/* Device */}
        <g transform="translate(100, 200)">
          <rect width="200" height="150" fill="#e5e7eb" rx="15" filter="url(#shadow)" />
          <text x="100" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Device
          </text>
          <text x="100" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Endpoint
          </text>
          <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Laptops, Smartphones, IoT
          </text>
          <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            802.1X, MAB, Captive Portal
          </text>
        </g>

        {/* Network Access Layer */}
        <g transform="translate(400, 200)">
          <rect width="200" height="150" fill="#dbeafe" rx="15" filter="url(#shadow)" />
          <text x="100" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Network
          </text>
          <text x="100" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Access Layer
          </text>
          <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Switches, Wireless APs
          </text>
          <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            RADIUS, TACACS+
          </text>
        </g>

        {/* Portnox Cloud NAC */}
        <g transform="translate(700, 200)">
          <rect width="200" height="150" fill="#ede9fe" rx="15" filter="url(#shadow)" />
          <text x="100" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Portnox Cloud
          </text>
          <text x="100" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            NAC Platform
          </text>
          <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Policy Engine
          </text>
          <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Risk Assessment
          </text>
        </g>

        {/* Identity Provider */}
        <g transform="translate(1000, 200)">
          <rect width="200" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="100" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Identity Provider
          </text>
          <text x="100" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Azure AD, Okta
          </text>
          <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Authentication
          </text>
          <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Authorization
          </text>
        </g>

        {/* Policy Enforcement */}
        <g transform="translate(1300, 200)">
          <rect width="200" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="100" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Policy Enforcement
          </text>
          <text x="100" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Access Control
          </text>
          <text x="100" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            VLAN Assignment
          </text>
          <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            QoS, Traffic Shaping
          </text>
        </g>

        {/* Authentication Flow Steps */}
        <g transform="translate(100, 400)">
          <rect width="250" height="120" fill="#e5e7eb" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            1. Device Connection
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Device connects to the network
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            802.1X, MAB, Captive Portal
          </text>
        </g>

        <g transform="translate(400, 400)">
          <rect width="250" height="120" fill="#dbeafe" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            2. Authentication Request
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Network device sends authentication request
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            RADIUS, TACACS+
          </text>
        </g>

        <g transform="translate(700, 400)">
          <rect width="250" height="120" fill="#ede9fe" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            3. Policy Evaluation
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Portnox Cloud evaluates device and user
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            Risk assessment, compliance checks
          </text>
        </g>

        <g transform="translate(1000, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            4. Identity Verification
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Portnox Cloud verifies identity
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            Azure AD, Okta
          </text>
        </g>

        <g transform="translate(1300, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            5. Policy Enforcement
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Network device enforces access policies
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            VLAN assignment, QoS
          </text>
        </g>

        {/* Flow Arrows */}
        {isAnimating && (
          <>
            <line x1="350" y1="460" x2="400" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="650" y1="460" x2="700" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="950" y1="460" x2="1000" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="1250" y1="460" x2="1300" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.6 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
          </>
        )}

        {/* Statistics */}
        <rect
          x="50"
          y="600"
          width="1500"
          height="180"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
          rx="12"
          filter="url(#shadow)"
        />
        <text x="80" y="630" fill="#374151" fontSize="18" fontWeight="bold">
          📊 Authentication Metrics & Performance
        </text>

        <g transform="translate(80, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Authentication Rate
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Successful: 10,247/min
          </text>
          <text x="15" y="60" fill="#ef4444" fontSize="12">
            🚫 Failed: 23/min
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Total: 10,270/min
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Success Rate: 99.7%
          </text>
        </g>

        <g transform="translate(380, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Authentication Methods
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            802.1X: 6,500
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            MAB: 2,500
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Captive Portal: 1,270
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 10,270
          </text>
        </g>

        <g transform="translate(680, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Identity Providers
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Azure AD: 7,500
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Okta: 2,000
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Local DB: 770
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 10,270
          </text>
        </g>

        <g transform="translate(980, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Policy Enforcement
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Compliant: 9,800
          </text>
          <text x="15" y="60" fill="#f59e0b" fontSize="12">
            ⚠️ Limited Access: 300
          </text>
          <text x="15" y="75" fill="#ef4444" fontSize="12">
            🚫 Blocked: 170
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 10,270
          </text>
        </g>

        <g transform="translate(1280, 650)">
          <rect width="220" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Avg. Auth Time
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            ⏱️ 47ms
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Peak: 65ms
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Min: 23ms
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Last 24h
          </text>
        </g>
      </svg>
    )
  }

  const renderPKIView = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1600 1200"
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
          <linearGradient id="pkiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Header */}
        <rect x="0" y="0" width="1600" height="80" fill="url(#pkiGradient)" />
        <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
          🔒 Public Key Infrastructure (PKI)
        </text>
        <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
          Certificate Authority • Digital Certificates • Secure Communication
        </text>

        {/* Certificate Authority */}
        <g transform="translate(100, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Certificate Authority
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Root CA
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Issues Digital Certificates
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Secure Key Storage
          </text>
        </g>

        {/* Intermediate CA */}
        <g transform="translate(400, 200)">
          <rect width="250" height="150" fill="#dcfce7" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Intermediate CA
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Subordinate CA
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Delegated Certificate Issuance
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Enhanced Security
          </text>
        </g>

        {/* Devices */}
        <g transform="translate(700, 200)">
          <rect width="250" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Devices
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Endpoints
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Laptops, Servers, IoT
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Digital Certificates
          </text>
        </g>

        {/* Validation */}
        <g transform="translate(1000, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Validation
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Certificate Revocation
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            OCSP, CRL
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Trust Chain Verification
          </text>
        </g>

        {/* Applications */}
        <g transform="translate(1300, 200)">
          <rect width="250" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Applications
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Secure Communication
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            HTTPS, TLS, VPN
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Data Encryption
          </text>
        </g>

        {/* PKI Workflow */}
        <g transform="translate(100, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            1. Certificate Request
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Device requests a certificate
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            CSR Generation
          </text>
        </g>

        <g transform="translate(400, 400)">
          <rect width="250" height="120" fill="#dcfce7" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            2. Certificate Issuance
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            CA issues a digital certificate
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            Signing with Private Key
          </text>
        </g>

        <g transform="translate(700, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            3. Certificate Installation
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Device installs the certificate
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            Secure Storage
          </text>
        </g>

        <g transform="translate(1000, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            4. Certificate Validation
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Application validates the certificate
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            OCSP, CRL Checks
          </text>
        </g>

        <g transform="translate(1300, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            5. Secure Communication
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Application uses certificate for secure communication
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            HTTPS, TLS
          </text>
        </g>

        {/* Flow Arrows */}
        {isAnimating && (
          <>
            <line x1="350" y1="460" x2="400" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="650" y1="460" x2="700" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="950" y1="460" x2="1000" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="1250" y1="460" x2="1300" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.6 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
          </>
        )}

        {/* Statistics */}
        <rect
          x="50"
          y="600"
          width="1500"
          height="180"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
          rx="12"
          filter="url(#shadow)"
        />
        <text x="80" y="630" fill="#374151" fontSize="18" fontWeight="bold">
          📊 PKI Metrics & Performance
        </text>

        <g transform="translate(80, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Certificate Issuance
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Issued: 12,450
          </text>
          <text x="15" y="60" fill="#f59e0b" fontSize="12">
            ⚠️ Pending: 23
          </text>
          <text x="15" y="75" fill="#ef4444" fontSize="12">
            🚫 Failed: 2
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Last 24h
          </text>
        </g>

        <g transform="translate(380, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Certificate Revocation
          </text>
          <text x="15" y="45" fill="#ef4444" fontSize="12">
            🚫 Revoked: 15
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Reason: Compromised Key
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            OCSP Response Time: 2ms
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            CRL Updated
          </text>
        </g>

        <g transform="translate(680, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Certificate Types
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Server Certificates: 6,200
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Client Certificates: 4,500
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Code Signing: 1,750
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 12,450
          </text>
        </g>

        <g transform="translate(980, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Key Length
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            RSA 2048: 9,500
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            RSA 4096: 2,950
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            ECC: 0
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 12,450
          </text>
        </g>

        <g transform="translate(1280, 650)">
          <rect width="220" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            CA Uptime
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ 99.99%
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Last Incident: None
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Monitoring: Active
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            24/7
          </text>
        </g>
      </svg>
    )
  }

  const renderMerakiWirelessView = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1600 1200"
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
          <linearGradient id="merakiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Header */}
        <rect x="0" y="0" width="1600" height="80" fill="url(#merakiGradient)" />
        <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
          Meraki Wireless Network
        </text>
        <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
          Cloud Management • Wireless Access Points • Network Analytics
        </text>

        {/* Meraki Cloud */}
        <g transform="translate(100, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Meraki Cloud
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Centralized Management
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Network Analytics
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            API Integration
          </text>
        </g>

        {/* Meraki Access Points */}
        <g transform="translate(400, 200)">
          <rect width="250" height="150" fill="#dcfce7" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Meraki Access Points
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Wireless Infrastructure
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            802.11ax, WPA3
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Location Services
          </text>
        </g>

        {/* Wireless Clients */}
        <g transform="translate(700, 200)">
          <rect width="250" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Wireless Clients
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Connected Devices
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Laptops, Smartphones, IoT
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            802.1X, Captive Portal
          </text>
        </g>

        {/* Portnox Integration */}
        <g transform="translate(1000, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Portnox Integration
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Zero Trust NAC
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Device Profiling
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Policy Enforcement
          </text>
        </g>

        {/* Security Policies */}
        <g transform="translate(1300, 200)">
          <rect width="250" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Security Policies
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Access Control
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            VLAN Assignment
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Threat Detection
          </text>
        </g>

        {/* Meraki Workflow */}
        <g transform="translate(100, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            1. Device Connection
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Device connects to Meraki AP
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            802.11, DHCP
          </text>
        </g>

        <g transform="translate(400, 400)">
          <rect width="250" height="120" fill="#dcfce7" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            2. Authentication
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Meraki AP authenticates device
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            802.1X, Captive Portal
          </text>
        </g>

        <g transform="translate(700, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            3. Context Sharing
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Meraki shares context with Portnox
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            API Integration
          </text>
        </g>

        <g transform="translate(1000, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            4. Policy Enforcement
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Portnox enforces access policies
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            VLAN Assignment
          </text>
        </g>

        <g transform="translate(1300, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            5. Secure Access
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            Device gains secure network access
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            Policy-Based Access
          </text>
        </g>

        {/* Flow Arrows */}
        {isAnimating && (
          <>
            <line x1="350" y1="460" x2="400" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="650" y1="460" x2="700" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="950" y1="460" x2="1000" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="1250" y1="460" x2="1300" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.6 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
          </>
        )}

        {/* Statistics */}
        <rect
          x="50"
          y="600"
          width="1500"
          height="180"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
          rx="12"
          filter="url(#shadow)"
        />
        <text x="80" y="630" fill="#374151" fontSize="18" fontWeight="bold">
          📊 Meraki Wireless Metrics & Performance
        </text>

        <g transform="translate(80, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Wireless Performance
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Average Throughput: 500 Mbps
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            📶 Signal Strength: -65 dBm
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Client Count: 4,800
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Channel Utilization: 60%
          </text>
        </g>

        <g transform="translate(380, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Client Distribution
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Corporate Laptops: 2,500
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            BYOD Smartphones: 1,200
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Guest Tablets: 600
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            IoT Devices: 500
          </text>
        </g>

        <g transform="translate(680, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Security Metrics
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ WPA3 Encryption: 100%
          </text>
          <text x="15" y="60" fill="#f59e0b" fontSize="12">
            ⚠️ Rogue APs Detected: 2
          </text>
          <text x="15" y="75" fill="#ef4444" fontSize="12">
            🚫 Blocked Threats: 15
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Intrusion Attempts: 32
          </text>
        </g>

        <g transform="translate(980, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Guest Access
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Active Guest Sessions: 850
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Average Session Time: 4h
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Bandwidth Usage: 500 Mbps
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Captive Portal: Enabled
          </text>
        </g>

        <g transform="translate(1280, 650)">
          <rect width="220" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Portnox Integration
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Device Profiling: Active
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Policy Enforcement: Enabled
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Threat Detection: Active
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Zero Trust NAC
          </text>
        </g>
      </svg>
    )
  }

  const renderTacacsView = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1600 1200"
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3" />
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
          <linearGradient id="tacacsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Header */}
        <rect x="0" y="0" width="1600" height="80" fill="url(#tacacsGradient)" />
        <text x="30" y="35" fill="white" fontSize="24" fontWeight="bold">
          Cisco TACACS+ Authentication
        </text>
        <text x="30" y="55" fill="white" fontSize="14" opacity="0.9">
          Device Administration • AAA Protocol • Secure Access Control
        </text>

        {/* Network Devices */}
        <g transform="translate(100, 200)">
          <rect width="250" height="150" fill="#ede9fe" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            Network Devices
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Cisco Routers, Switches
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Device Administration
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            CLI Access
          </text>
        </g>

        {/* TACACS+ Server */}
        <g transform="translate(400, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            TACACS+ Server
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            AAA Server
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Authentication
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Authorization
          </text>
        </g>

        {/* Portnox Integration */}
        <g transform="translate(700, 200)">
          <rect width="250" height="150" fill="#dcfce7" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Portnox Integration
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Zero Trust NAC
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            Contextual Authentication
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Policy Enforcement
          </text>
        </g>

        {/* User Database */}
        <g transform="translate(1000, 200)">
          <rect width="250" height="150" fill="#f8fafc" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">
            User Database
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#374151" fontSize="14">
            Credentials
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#374151" fontSize="12">
            Username, Password
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#374151" fontSize="12">
            Access Privileges
          </text>
        </g>

        {/* Audit Logs */}
        <g transform="translate(1300, 200)">
          <rect width="250" height="150" fill="#f0fdfa" rx="15" filter="url(#shadow)" />
          <text x="125" y="35" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="bold">
            Audit Logs
          </text>
          <text x="125" y="60" textAnchor="middle" fill="#065f46" fontSize="14">
            Tracking
          </text>
          <text x="125" y="80" textAnchor="middle" fill="#065f46" fontSize="12">
            User Activity
          </text>
          <text x="125" y="100" textAnchor="middle" fill="#065f46" fontSize="12">
            Compliance
          </text>
        </g>

        {/* TACACS+ Workflow */}
        <g transform="translate(100, 400)">
          <rect width="250" height="120" fill="#ede9fe" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            1. User Access
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            User attempts to access device
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            CLI Access
          </text>
        </g>

        <g transform="translate(400, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            2. Authentication Request
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Device sends request to TACACS+
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            AAA Protocol
          </text>
        </g>

        <g transform="translate(700, 400)">
          <rect width="250" height="120" fill="#dcfce7" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            3. Context Enrichment
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Portnox enriches context
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            Device Profiling
          </text>
        </g>

        <g transform="translate(1000, 400)">
          <rect width="250" height="120" fill="#f8fafc" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
            4. Policy Evaluation
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#374151" fontSize="12">
            TACACS+ evaluates policies
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#374151" fontSize="12">
            Access Control
          </text>
        </g>

        <g transform="translate(1300, 400)">
          <rect width="250" height="120" fill="#f0fdfa" rx="10" />
          <text x="125" y="25" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            5. Access Granted/Denied
          </text>
          <text x="125" y="45" textAnchor="middle" fill="#065f46" fontSize="12">
            Device grants or denies access
          </text>
          <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="12">
            Privilege Levels
          </text>
        </g>

        {/* Flow Arrows */}
        {isAnimating && (
          <>
            <line x1="350" y1="460" x2="400" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="650" y1="460" x2="700" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.2 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="950" y1="460" x2="1000" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.4 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
            <line x1="1250" y1="460" x2="1300" y2="460" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)">
              <animate
                attributeName="stroke-dasharray"
                values="0,50;50,0"
                dur={`${1.6 / animationSpeed}s`}
                repeatCount="indefinite"
              />
            </line>
          </>
        )}

        {/* Statistics */}
        <rect
          x="50"
          y="600"
          width="1500"
          height="180"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
          rx="12"
          filter="url(#shadow)"
        />
        <text x="80" y="630" fill="#374151" fontSize="18" fontWeight="bold">
          📊 TACACS+ Metrics & Performance
        </text>

        <g transform="translate(80, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Authentication Rate
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Successful: 2,450/min
          </text>
          <text x="15" y="60" fill="#ef4444" fontSize="12">
            🚫 Failed: 5/min
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Total: 2,455/min
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Success Rate: 99.8%
          </text>
        </g>

        <g transform="translate(380, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Authorization Success
          </text>
          <text x="15" y="45" fill="#10b981" fontSize="12">
            ✅ Granted: 2,400/min
          </text>
          <text x="15" y="60" fill="#f59e0b" fontSize="12">
            ⚠️ Limited: 45/min
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Total: 2,445/min
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Success Rate: 98.2%
          </text>
        </g>

        <g transform="translate(680, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Device Types
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Routers: 1,200
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Switches: 800
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Firewalls: 400
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 2,400
          </text>
        </g>

        <g transform="translate(980, 650)">
          <rect width="280" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Privilege Levels
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            Level 15: 1,500
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Level 1: 600
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Level 0: 300
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Total: 2,400
          </text>
        </g>

        <g transform="translate(1280, 650)">
          <rect width="220" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
          <text x="15" y="25" fill="#374151" fontSize="14" fontWeight="bold">
            Avg. Auth Time
          </text>
          <text x="15" y="45" fill="#374151" fontSize="12">
            ⏱️ 52ms
          </text>
          <text x="15" y="60" fill="#374151" fontSize="12">
            Peak: 70ms
          </text>
          <text x="15" y="75" fill="#374151" fontSize="12">
            Min: 30ms
          </text>
          <text x="15" y="90" fill="#6b7280" fontSize="11">
            Last 24h
          </text>
        </g>
      </svg>
    )
  }

  return (
    <div className="relative w-full h-full">
      {renderView()}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 pointer-events-none"
          style={{
            left: showTooltip.x,
            top: showTooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {showTooltip.content.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          {isAnimating ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
        >
          Legend
        </button>
        <button
          onClick={() => handleExport("svg")}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          Export SVG
        </button>
        <button
          onClick={() => handleExport("png")}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
        >
          Export PNG
        </button>
      </div>
    </div>
  )
}
