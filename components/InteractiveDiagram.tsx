"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface DiagramConfig {
  industry?: string
  identityProvider?: {
    type: string
    domain: string
    mfaEnabled: boolean
    conditionalAccess: boolean
    riskBasedAuth: boolean
  }
  mdmProvider?: {
    type: string
    complianceEnabled: boolean
    appProtection: boolean
    deviceEncryption: boolean
  }
  firewallInfrastructure?: {
    vendor: string
    haConfiguration: boolean
    nextGenFeatures: boolean
    threatIntelligence: boolean
  }
  wiredInfrastructure?: {
    vendor: string
    switchCount: number
    stackingEnabled: boolean
    poeEnabled: boolean
  }
  wirelessInfrastructure?: {
    vendor: string
    apCount: number
    wifi6Enabled: boolean
    meshEnabled: boolean
  }
  radiusConfiguration?: {
    type: string
    clustering: boolean
    loadBalancing: boolean
    failover: boolean
  }
  portnoxAgent?: {
    enabled: boolean
    riskAssessment: boolean
    behaviorAnalytics: boolean
    aiPowered: boolean
  }
  tacacsPlus?: {
    enabled: boolean
    commandAuthorization: boolean
    accounting: boolean
    redundancy: boolean
  }
  radSecProxy?: {
    enabled: boolean
    tlsVersion: string
    certificateValidation: boolean
    loadBalancing: boolean
  }
  guestPortal?: {
    enabled: boolean
    captivePortal: boolean
    selfRegistration: boolean
    socialLogin: boolean
  }
  iotOnboarding?: {
    enabled: boolean
    autoProvisioning: boolean
    deviceProfiling: boolean
    certificateBasedAuth: boolean
  }
  simulationMode?: string
  animationSpeed?: number
  showMetrics?: boolean
  showLegend?: boolean
}

interface InteractiveDiagramProps {
  view: string
  config?: DiagramConfig
  onExport?: (format: "svg" | "png" | "pdf") => void
}

export default function InteractiveDiagram({ view, config = {}, onExport }: InteractiveDiagramProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const [animationFrame, setAnimationFrame] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(
      () => {
        setAnimationFrame((prev) => (prev + 1) % 360)
      },
      100 / (config.animationSpeed || 1),
    )

    return () => clearInterval(interval)
  }, [isAnimating, config.animationSpeed])

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
        link.download = `portnox-nac-architecture-${view}-${config.industry || "enterprise"}-${Date.now()}.svg`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === "png") {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.crossOrigin = "anonymous"
        img.onload = () => {
          canvas.width = img.width * 3 // Higher resolution
          canvas.height = img.height * 3
          ctx?.scale(3, 3)
          ctx?.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `portnox-nac-architecture-${view}-${config.industry || "enterprise"}-${Date.now()}.png`
                link.click()
                URL.revokeObjectURL(url)
              }
            },
            "image/png",
            1.0,
          )
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

  const renderVendorIcon = (vendor: string, x: number, y: number, size = 40) => {
    const vendorIcons: Record<string, { color: string; icon: string; glow: string }> = {
      cisco: { color: "#1BA0D7", icon: "C", glow: "rgba(27, 160, 215, 0.6)" },
      aruba: { color: "#FF6900", icon: "A", glow: "rgba(255, 105, 0, 0.6)" },
      juniper: { color: "#84BD00", icon: "J", glow: "rgba(132, 189, 0, 0.6)" },
      fortinet: { color: "#EE3124", icon: "F", glow: "rgba(238, 49, 36, 0.6)" },
      "palo-alto": { color: "#FA582D", icon: "P", glow: "rgba(250, 88, 45, 0.6)" },
      checkpoint: { color: "#FF6B35", icon: "CP", glow: "rgba(255, 107, 53, 0.6)" },
      microsoft: { color: "#00BCF2", icon: "M", glow: "rgba(0, 188, 242, 0.6)" },
      okta: { color: "#007DC1", icon: "O", glow: "rgba(0, 125, 193, 0.6)" },
      azure: { color: "#0078D4", icon: "Az", glow: "rgba(0, 120, 212, 0.6)" },
      intune: { color: "#0078D4", icon: "In", glow: "rgba(0, 120, 212, 0.6)" },
      jamf: { color: "#1F4E79", icon: "Jf", glow: "rgba(31, 78, 121, 0.6)" },
      portnox: { color: "#00FFFF", icon: "Px", glow: "rgba(0, 255, 255, 0.8)" },
    }

    const vendorData = vendorIcons[vendor.toLowerCase()] || {
      color: "#00FFFF",
      icon: vendor.charAt(0).toUpperCase(),
      glow: "rgba(0, 255, 255, 0.6)",
    }

    return (
      <g className="vendor-icon cyber-node" transform={`translate(${x}, ${y})`}>
        <defs>
          <filter id={`glow-${vendor}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="0"
          cy="0"
          r={size / 2}
          fill={vendorData.color}
          stroke="#00FFFF"
          strokeWidth="2"
          filter={`url(#glow-${vendor})`}
          className="cyber-node"
          style={{
            boxShadow: `0 0 20px ${vendorData.glow}`,
            animation: "cyber-pulse 2s ease-in-out infinite",
          }}
        />
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize={size / 3} fontWeight="bold" className="neon-glow">
          {vendorData.icon}
        </text>
      </g>
    )
  }

  const renderConnection = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: "secure" | "data" | "control" | "wireless" = "data",
    animated = true,
  ) => {
    const connectionStyles = {
      secure: { stroke: "#00FF00", strokeWidth: 3, dashArray: "5,5", glow: "rgba(0, 255, 0, 0.8)" },
      data: { stroke: "#00FFFF", strokeWidth: 2, dashArray: "10,5", glow: "rgba(0, 255, 255, 0.8)" },
      control: { stroke: "#FF00FF", strokeWidth: 2, dashArray: "15,5", glow: "rgba(255, 0, 255, 0.8)" },
      wireless: { stroke: "#FFFF00", strokeWidth: 2, dashArray: "8,3", glow: "rgba(255, 255, 0, 0.8)" },
    }

    const style = connectionStyles[type]

    return (
      <g>
        <defs>
          <linearGradient id={`neonGradient-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={style.stroke} stopOpacity="0.3" />
            <stop offset="50%" stopColor={style.stroke} stopOpacity="1" />
            <stop offset="100%" stopColor={style.stroke} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={`url(#neonGradient-${type})`}
          strokeWidth={style.strokeWidth}
          strokeDasharray={animated ? style.dashArray : "none"}
          filter="drop-shadow(0 0 5px currentColor)"
          className={animated ? "cyber-connection data-flow" : "cyber-connection"}
        />
        {/* Data flow particles */}
        {animated && (
          <circle r="3" fill={style.stroke} className="opacity-80">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#path-${x1}-${y1}-${x2}-${y2}`} />
            </animateMotion>
          </circle>
        )}
        <path id={`path-${x1}-${y1}-${x2}-${y2}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" opacity="0" />
      </g>
    )
  }

  const renderCompleteArchitecture = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 1000"
      className="w-full h-full cyber-grid"
      style={{
        minHeight: "600px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      {/* Enhanced Background Grid with cyberpunk styling */}
      <defs>
        <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 255, 0.2)" strokeWidth="1" />
          <circle cx="0" cy="0" r="1" fill="rgba(0, 255, 255, 0.4)" />
        </pattern>

        {/* Enhanced gradients with cyberpunk colors */}
        <linearGradient id="portnoxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>

        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" />
          <stop offset="100%" stopColor="#8000FF" />
        </linearGradient>

        <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFF00" />
          <stop offset="100%" stopColor="#FF8000" />
        </linearGradient>

        {/* Glow filters */}
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="100%" height="100%" fill="url(#cyberGrid)" />

      {/* Cloud/Internet Zone */}
      <g className="holographic">
        <rect
          x="50"
          y="50"
          width="300"
          height="120"
          rx="10"
          fill="url(#cloudGradient)"
          fillOpacity="0.3"
          stroke="#FF00FF"
          strokeWidth="2"
          className="neon-border"
        />
        <text x="200" y="85" textAnchor="middle" fill="#FF00FF" fontSize="16" fontWeight="bold" className="neon-glow">
          INTERNET / CLOUD SERVICES
        </text>
        <text x="200" y="105" textAnchor="middle" fill="#FF00FF" fontSize="12" className="matrix-text">
          Azure AD • Office 365 • SaaS Applications
        </text>
        <text x="200" y="125" textAnchor="middle" fill="#FF00FF" fontSize="12" className="matrix-text">
          Certificate Authority • DNS Services
        </text>
      </g>

      {/* Firewall Zone with enhanced vendor icons */}
      <g>
        <rect
          x="450"
          y="50"
          width="200"
          height="120"
          rx="10"
          fill="url(#networkGradient)"
          fillOpacity="0.3"
          stroke="#FFFF00"
          strokeWidth="2"
          className="neon-border"
        />
        <text x="550" y="85" textAnchor="middle" fill="#FFFF00" fontSize="16" fontWeight="bold" className="neon-glow">
          FIREWALL
        </text>
        {renderVendorIcon(config.firewallInfrastructure?.vendor || "fortinet", 550, 120, 40)}
        <text x="550" y="155" textAnchor="middle" fill="#FFFF00" fontSize="10" className="matrix-text">
          {config.firewallInfrastructure?.vendor?.toUpperCase() || "FORTINET"}
        </text>
      </g>

      {/* Portnox NAC Core - Enhanced with cyberpunk styling */}
      <g className="cyber-node">
        <rect
          x="750"
          y="200"
          width="300"
          height="200"
          rx="15"
          fill="url(#portnoxGradient)"
          fillOpacity="0.4"
          stroke="#00FFFF"
          strokeWidth="3"
          className="neon-border cyber-node"
        />
        <text x="900" y="230" textAnchor="middle" fill="#00FFFF" fontSize="20" fontWeight="bold" className="neon-glow">
          PORTNOX NAC CORE
        </text>
        {renderVendorIcon("portnox", 900, 270, 60)}

        {/* Core components with status indicators */}
        <g className="status-online">
          <circle cx="820" cy="320" r="8" className="status-online" />
          <text x="835" y="325" fill="#00FF00" fontSize="12" className="matrix-text">
            Policy Engine
          </text>
        </g>
        <g className="status-online">
          <circle cx="820" cy="340" r="8" className="status-online" />
          <text x="835" y="345" fill="#00FF00" fontSize="12" className="matrix-text">
            Device Profiling
          </text>
        </g>
        <g className="status-warning">
          <circle cx="820" cy="360" r="8" className="status-warning" />
          <text x="835" y="365" fill="#FFFF00" fontSize="12" className="matrix-text">
            Risk Assessment
          </text>
        </g>
      </g>

      {/* Network Infrastructure with enhanced vendor representation */}
      <g>
        <rect
          x="100"
          y="500"
          width="250"
          height="150"
          rx="10"
          fill="rgba(255, 165, 0, 0.2)"
          stroke="#FFA500"
          strokeWidth="2"
          className="neon-border"
        />
        <text x="225" y="530" textAnchor="middle" fill="#FFA500" fontSize="16" fontWeight="bold" className="neon-glow">
          NETWORK INFRASTRUCTURE
        </text>

        {/* Wired Infrastructure */}
        {renderVendorIcon(config.wiredInfrastructure?.vendor || "cisco", 150, 570, 35)}
        <text x="150" y="610" textAnchor="middle" fill="#FFA500" fontSize="10" className="matrix-text">
          WIRED SWITCHES
        </text>

        {/* Wireless Infrastructure */}
        {renderVendorIcon(config.wirelessInfrastructure?.vendor || "aruba", 300, 570, 35)}
        <text x="300" y="610" textAnchor="middle" fill="#FFA500" fontSize="10" className="matrix-text">
          WIRELESS APs
        </text>
      </g>

      {/* Identity Providers with enhanced styling */}
      <g>
        <rect
          x="1100"
          y="200"
          width="250"
          height="200"
          rx="10"
          fill="rgba(0, 255, 0, 0.2)"
          stroke="#00FF00"
          strokeWidth="2"
          className="neon-border"
        />
        <text x="1225" y="230" textAnchor="middle" fill="#00FF00" fontSize="16" fontWeight="bold" className="neon-glow">
          IDENTITY PROVIDERS
        </text>

        {/* Azure AD */}
        {renderVendorIcon("azure", 1150, 270, 40)}
        <text x="1150" y="320" textAnchor="middle" fill="#00FF00" fontSize="10" className="matrix-text">
          AZURE AD
        </text>

        {/* Okta */}
        {renderVendorIcon("okta", 1300, 270, 40)}
        <text x="1300" y="320" textAnchor="middle" fill="#00FF00" fontSize="10" className="matrix-text">
          OKTA
        </text>

        {/* MDM Integration */}
        {renderVendorIcon(config.mdmProvider?.type || "intune", 1225, 350, 40)}
        <text x="1225" y="390" textAnchor="middle" fill="#00FF00" fontSize="10" className="matrix-text">
          MDM INTEGRATION
        </text>
      </g>

      {/* Enhanced connection lines with cyberpunk animations */}
      {renderConnection(350, 110, 450, 110, "secure", true)}
      {renderConnection(650, 110, 750, 250, "data", true)}
      {renderConnection(900, 200, 900, 170, "control", true)}
      {renderConnection(1050, 300, 1100, 300, "secure", true)}
      {renderConnection(750, 350, 350, 575, "data", true)}
      {renderConnection(900, 400, 900, 500, "control", true)}

      {/* Live metrics panel */}
      {config.showMetrics && (
        <g className="holographic">
          <rect
            x="50"
            y="750"
            width="300"
            height="200"
            rx="10"
            fill="rgba(0, 0, 0, 0.8)"
            stroke="#00FFFF"
            strokeWidth="2"
            className="neon-border"
          />
          <text
            x="200"
            y="780"
            textAnchor="middle"
            fill="#00FFFF"
            fontSize="16"
            fontWeight="bold"
            className="neon-glow"
          >
            LIVE METRICS
          </text>

          {/* Animated metrics */}
          <text x="70" y="810" fill="#00FF00" fontSize="12" className="matrix-text">
            Active Sessions: {Math.floor(Math.random() * 1000) + 500}
          </text>
          <text x="70" y="830" fill="#FFFF00" fontSize="12" className="matrix-text">
            Devices Online: {Math.floor(Math.random() * 500) + 200}
          </text>
          <text x="70" y="850" fill="#FF00FF" fontSize="12" className="matrix-text">
            Policy Violations: {Math.floor(Math.random() * 10) + 1}
          </text>
          <text x="70" y="870" fill="#FFA500" fontSize="12" className="matrix-text">
            Threat Level: {["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)]}
          </text>

          {/* Animated progress bars */}
          <rect x="70" y="890" width="200" height="10" rx="5" className="cyber-progress" />
          <rect x="70" y="890" width={`${Math.random() * 200}`} height="10" rx="5" className="cyber-progress-bar" />

          <rect x="70" y="910" width="200" height="10" rx="5" className="cyber-progress" />
          <rect x="70" y="910" width={`${Math.random() * 200}`} height="10" rx="5" className="cyber-progress-bar" />
        </g>
      )}

      {/* Enhanced legend with cyberpunk styling */}
      {config.showLegend && (
        <g className="holographic">
          <rect
            x="1100"
            y="750"
            width="250"
            height="200"
            rx="10"
            fill="rgba(0, 0, 0, 0.8)"
            stroke="#FF00FF"
            strokeWidth="2"
            className="neon-border"
          />
          <text
            x="1225"
            y="780"
            textAnchor="middle"
            fill="#FF00FF"
            fontSize="16"
            fontWeight="bold"
            className="neon-glow"
          >
            LEGEND
          </text>

          {/* Connection types */}
          <line x1="1120" y1="800" x2="1160" y2="800" stroke="#00FF00" strokeWidth="3" strokeDasharray="5,5" />
          <text x="1170" y="805" fill="#00FF00" fontSize="12" className="matrix-text">
            Secure Connection
          </text>

          <line x1="1120" y1="820" x2="1160" y2="820" stroke="#00FFFF" strokeWidth="2" strokeDasharray="10,5" />
          <text x="1170" y="825" fill="#00FFFF" fontSize="12" className="matrix-text">
            Data Flow
          </text>

          <line x1="1120" y1="840" x2="1160" y2="840" stroke="#FF00FF" strokeWidth="2" strokeDasharray="15,5" />
          <text x="1170" y="845" fill="#FF00FF" fontSize="12" className="matrix-text">
            Control Channel
          </text>

          <line x1="1120" y1="860" x2="1160" y2="860" stroke="#FFFF00" strokeWidth="2" strokeDasharray="8,3" />
          <text x="1170" y="865" fill="#FFFF00" fontSize="12" className="matrix-text">
            Wireless Link
          </text>

          {/* Status indicators */}
          <circle cx="1130" cy="885" r="6" className="status-online" />
          <text x="1145" y="890" fill="#00FF00" fontSize="12" className="matrix-text">
            Online
          </text>

          <circle cx="1130" cy="905" r="6" className="status-warning" />
          <text x="1145" y="910" fill="#FFFF00" fontSize="12" className="matrix-text">
            Warning
          </text>

          <circle cx="1130" cy="925" r="6" className="status-error" />
          <text x="1145" y="930" fill="#FF0000" fontSize="12" className="matrix-text">
            Error
          </text>
        </g>
      )}
    </svg>
  )

  const renderMultiSiteView = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 1000"
      className="w-full h-full bg-gradient-to-br from-slate-50 to-green-50"
      style={{ minHeight: "600px" }}
    >
      {/* Background and Grid */}
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Title */}
      <rect x="20" y="20" width="400" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      <text x="40" y="45" className="text-lg font-bold" fill="#1e293b">
        Multi-Site NAC Deployment
      </text>
      <text x="40" y="65" className="text-sm" fill="#64748b">
        Global Enterprise Architecture
      </text>

      {/* Central Cloud Hub */}
      <ellipse
        cx="700"
        cy="200"
        rx="150"
        ry="80"
        fill="url(#cloudGradient)"
        opacity="0.2"
        stroke="#10b981"
        strokeWidth="3"
      />
      <text x="700" y="190" textAnchor="middle" className="text-lg font-bold" fill="#059669">
        Portnox Cloud
      </text>
      <text x="700" y="210" textAnchor="middle" className="text-sm" fill="#059669">
        Central Management
      </text>

      {/* Site Locations */}
      {[
        { name: "HQ - New York", x: 200, y: 400, devices: 500, status: "operational" },
        { name: "EMEA - London", x: 500, y: 300, devices: 300, status: "operational" },
        { name: "APAC - Singapore", x: 1100, y: 450, devices: 250, status: "maintenance" },
        { name: "West Coast - LA", x: 150, y: 600, devices: 200, status: "operational" },
        { name: "Branch - Chicago", x: 400, y: 550, devices: 150, status: "operational" },
        { name: "R&D - Austin", x: 350, y: 700, devices: 180, status: "operational" },
      ].map((site, i) => (
        <g key={`site-${i}`}>
          <circle
            cx={site.x}
            cy={site.y}
            r="60"
            fill={site.status === "operational" ? "#10b981" : "#f59e0b"}
            opacity="0.2"
            stroke={site.status === "operational" ? "#10b981" : "#f59e0b"}
            strokeWidth="3"
            onMouseEnter={(e) =>
              handleComponentHover(
                e,
                `site-${i}`,
                `${site.name}\nDevices: ${site.devices}\nStatus: ${site.status.toUpperCase()}\nCompliance: 98%`,
              )
            }
            onMouseLeave={handleComponentLeave}
            className="cursor-pointer transition-all duration-300 hover:opacity-60"
          />
          <rect
            x={site.x - 30}
            y={site.y - 15}
            width="60"
            height="30"
            rx="4"
            fill={site.status === "operational" ? "#10b981" : "#f59e0b"}
          />
          <text x={site.x} y={site.y - 5} textAnchor="middle" className="text-xs font-semibold" fill="white">
            {site.name.split(" - ")[0]}
          </text>
          <text x={site.x} y={site.y + 8} textAnchor="middle" className="text-xs" fill="white">
            {site.name.split(" - ")[1]}
          </text>
          <text x={site.x} y={site.y + 35} textAnchor="middle" className="text-xs font-medium" fill="#374151">
            {site.devices} devices
          </text>

          {/* Connection to cloud */}
          <path
            d={`M ${site.x} ${site.y - 60} Q ${(site.x + 700) / 2} ${(site.y + 200) / 2 - 100} ${700} ${280}`}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            strokeDasharray={isAnimating ? "5,5" : "none"}
          >
            {isAnimating && (
              <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
            )}
          </path>
        </g>
      ))}

      {/* Site-to-Site Connections */}
      <g stroke="#6366f1" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M 200 400 Q 350 350 500 300" strokeDasharray="3,3">
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;6" dur="3s" repeatCount="indefinite" />}
        </path>
        <path d="M 200 400 Q 275 500 400 550" strokeDasharray="3,3">
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;6" dur="3s" repeatCount="indefinite" />}
        </path>
      </g>

      {/* Legend for Multi-Site */}
      {config.showLegend && (
        <g>
          <rect
            x="1000"
            y="100"
            width="350"
            height="250"
            rx="8"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="2"
            opacity="0.95"
          />
          <text x="1020" y="130" className="text-lg font-semibold" fill="#1e293b">
            Multi-Site Legend
          </text>

          <circle cx="1030" cy="155" r="15" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="2" />
          <text x="1055" y="162" className="text-sm" fill="#374151">
            Operational Site
          </text>

          <circle cx="1030" cy="180" r="15" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="2" />
          <text x="1055" y="187" className="text-sm" fill="#374151">
            Maintenance Mode
          </text>

          <ellipse cx="1040" cy="210" rx="20" ry="12" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="2" />
          <text x="1070" y="217" className="text-sm" fill="#374151">
            Cloud Management
          </text>

          <path d="M 1020 235 Q 1035 225 1050 235" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <text x="1060" y="240" className="text-sm" fill="#374151">
            Site-to-Cloud Connection
          </text>

          <path d="M 1020 260 Q 1035 250 1050 260" stroke="#6366f1" strokeWidth="1" fill="none" strokeDasharray="3,3" />
          <text x="1060" y="265" className="text-sm" fill="#374151">
            Site-to-Site Connection
          </text>

          <text x="1020" y="295" className="text-sm font-medium" fill="#1e293b">
            Total Sites: 6
          </text>
          <text x="1020" y="315" className="text-sm" fill="#64748b">
            Total Devices: 1,580
          </text>
          <text x="1020" y="335" className="text-sm" fill="#64748b">
            Global Compliance: 98.2%
          </text>
        </g>
      )}
    </svg>
  )

  const renderAuthenticationFlow = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 1000"
      className="w-full h-full bg-gradient-to-br from-slate-50 to-purple-50"
      style={{ minHeight: "600px" }}
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Title */}
      <rect x="20" y="20" width="500" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      <text x="40" y="45" className="text-lg font-bold" fill="#1e293b">
        Zero Trust Authentication Flow
      </text>
      <text x="40" y="65" className="text-sm" fill="#64748b">
        Multi-Factor Authentication with Risk Assessment
      </text>

      {/* Authentication Steps */}
      {[
        { step: 1, title: "Device Connection", desc: "Device connects to network", x: 100, y: 200, color: "#3b82f6" },
        {
          step: 2,
          title: "Identity Verification",
          desc: "User credentials validated",
          x: 350,
          y: 200,
          color: "#8b5cf6",
        },
        { step: 3, title: "Device Compliance", desc: "Device health checked", x: 600, y: 200, color: "#10b981" },
        { step: 4, title: "Risk Assessment", desc: "AI-powered risk analysis", x: 850, y: 200, color: "#f59e0b" },
        { step: 5, title: "Policy Decision", desc: "Access policy applied", x: 1100, y: 200, color: "#ef4444" },
        { step: 6, title: "Network Access", desc: "Appropriate access granted", x: 600, y: 400, color: "#06b6d4" },
      ].map((step, i) => (
        <g key={`auth-step-${i}`}>
          <circle
            cx={step.x}
            cy={step.y}
            r="50"
            fill={step.color}
            opacity="0.2"
            stroke={step.color}
            strokeWidth="3"
            onMouseEnter={(e) =>
              handleComponentHover(
                e,
                `auth-${i}`,
                `Step ${step.step}: ${step.title}\n${step.desc}\nDuration: ${Math.floor(Math.random() * 500) + 100}ms`,
              )
            }
            onMouseLeave={handleComponentLeave}
            className="cursor-pointer transition-all duration-300 hover:opacity-60"
          />
          <text x={step.x} y={step.y - 10} textAnchor="middle" className="text-lg font-bold" fill={step.color}>
            {step.step}
          </text>
          <text x={step.x} y={step.y + 5} textAnchor="middle" className="text-xs font-semibold" fill={step.color}>
            {step.title}
          </text>
          <text
            x={step.x}
            y={step.y + 70}
            textAnchor="middle"
            className="text-xs"
            fill="#374151"
            style={{ maxWidth: "80px" }}
          >
            {step.desc}
          </text>
        </g>
      ))}

      {/* Flow Arrows */}
      <g stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>

        {/* Horizontal flow */}
        <path d="M 150 200 L 300 200" strokeDasharray={isAnimating ? "5,5" : "none"}>
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />}
        </path>
        <path d="M 400 200 L 550 200" strokeDasharray={isAnimating ? "5,5" : "none"}>
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />}
        </path>
        <path d="M 650 200 L 800 200" strokeDasharray={isAnimating ? "5,5" : "none"}>
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />}
        </path>
        <path d="M 900 200 L 1050 200" strokeDasharray={isAnimating ? "5,5" : "none"}>
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />}
        </path>

        {/* Down to final step */}
        <path d="M 1100 250 Q 1100 325 650 350" strokeDasharray={isAnimating ? "5,5" : "none"}>
          {isAnimating && <animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" />}
        </path>
      </g>

      {/* Detailed Components */}
      <g>
        {/* Identity Provider Detail */}
        <rect x="250" y="300" width="200" height="80" rx="8" fill="white" stroke="#8b5cf6" strokeWidth="2" />
        <text x="350" y="325" textAnchor="middle" className="text-sm font-semibold" fill="#8b5cf6">
          Identity Provider
        </text>
        <text x="350" y="345" textAnchor="middle" className="text-xs" fill="#374151">
          {config.identityProvider?.type}
        </text>
        <text x="350" y="360" textAnchor="middle" className="text-xs" fill="#374151">
          MFA: {config.identityProvider?.mfaEnabled ? "Enabled" : "Disabled"}
        </text>
        <text x="350" y="375" textAnchor="middle" className="text-xs" fill="#374151">
          Risk-Based: {config.identityProvider?.riskBasedAuth ? "Yes" : "No"}
        </text>

        {/* Device Compliance Detail */}
        <rect x="500" y="300" width="200" height="80" rx="8" fill="white" stroke="#10b981" strokeWidth="2" />
        <text x="600" y="325" textAnchor="middle" className="text-sm font-semibold" fill="#10b981">
          Device Compliance
        </text>
        <text x="600" y="345" textAnchor="middle" className="text-xs" fill="#374151">
          {config.mdmProvider?.type}
        </text>
        <text x="600" y="360" textAnchor="middle" className="text-xs" fill="#374151">
          Encryption: {config.mdmProvider?.deviceEncryption ? "Required" : "Optional"}
        </text>
        <text x="600" y="375" textAnchor="middle" className="text-xs" fill="#374151">
          App Protection: {config.mdmProvider?.appProtection ? "Enabled" : "Disabled"}
        </text>
      </g>

      {/* Authentication Timeline */}
      <g>
        <rect
          x="50"
          y="550"
          width="1300"
          height="150"
          rx="8"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="2"
          opacity="0.95"
        />
        <text x="70" y="580" className="text-lg font-semibold" fill="#1e293b">
          Authentication Timeline
        </text>

        {/* Timeline bars */}
        {[
          { name: "Credential Check", duration: 200, color: "#8b5cf6", x: 100 },
          { name: "Device Scan", duration: 800, color: "#10b981", x: 300 },
          { name: "Risk Analysis", duration: 300, color: "#f59e0b", x: 500 },
          { name: "Policy Lookup", duration: 150, color: "#ef4444", x: 700 },
          { name: "Access Grant", duration: 100, color: "#06b6d4", x: 900 },
        ].map((item, i) => (
          <g key={`timeline-${i}`}>
            <rect x={item.x} y={600} width={item.duration / 5} height={20} fill={item.color} opacity="0.7" />
            <text x={item.x} y={595} className="text-xs font-medium" fill={item.color}>
              {item.name}
            </text>
            <text x={item.x + item.duration / 10} y={635} textAnchor="middle" className="text-xs" fill="#374151">
              {item.duration}ms
            </text>
          </g>
        ))}

        <text x={70} y={665} className="text-sm font-medium" fill="#059669">
          Total Authentication Time: ~1.55 seconds
        </text>
      </g>
    </svg>
  )

  const renderDiagram = () => {
    switch (view) {
      case "complete":
        return renderCompleteArchitecture()
      case "multi-site":
        return renderMultiSiteView()
      case "auth-flow":
        return renderAuthenticationFlow()
      case "tacacs-detailed":
        return renderTacacsDetailedView()
      case "intune-detailed":
        return renderIntuneDetailedView()
      case "jamf-detailed":
        return renderJamfDetailedView()
      case "radsec-proxy":
        return renderRadSecProxyView()
      case "pki-detailed":
        return renderPKIDetailedView()
      case "policy-framework":
        return renderPolicyFrameworkView()
      case "wireless-detailed":
        return renderWirelessDetailedView()
      case "iot-onboarding":
        return renderIoTOnboardingView()
      case "guest-portal":
        return renderGuestPortalView()
      default:
        return renderCompleteArchitecture()
    }
  }

  const renderTacacsDetailedView = () => renderCompleteArchitecture() // TODO: Implement detailed TACACS+ view
  const renderIntuneDetailedView = () => renderCompleteArchitecture() // TODO: Implement detailed Intune view
  const renderJamfDetailedView = () => renderCompleteArchitecture() // TODO: Implement detailed JAMF view
  const renderRadSecProxyView = () => renderCompleteArchitecture() // TODO: Implement RadSec proxy view
  const renderPKIDetailedView = () => renderCompleteArchitecture() // TODO: Implement PKI detailed view
  const renderPolicyFrameworkView = () => renderCompleteArchitecture() // TODO: Implement policy framework view
  const renderWirelessDetailedView = () => renderCompleteArchitecture() // TODO: Implement wireless detailed view
  const renderIoTOnboardingView = () => renderCompleteArchitecture() // TODO: Implement IoT onboarding view
  const renderGuestPortalView = () => renderCompleteArchitecture() // TODO: Implement guest portal view

  return (
    <div className="relative w-full">
      <Card className="cyber-node neon-border">
        <CardContent className="p-0">{renderDiagram()}</CardContent>
      </Card>

      {/* Enhanced tooltip with cyberpunk styling */}
      {showTooltip && (
        <div
          className="absolute z-50 bg-black border-2 border-cyan-400 text-cyan-400 text-sm rounded-lg px-3 py-2 pointer-events-none shadow-lg neon-box matrix-text"
          style={{
            left: showTooltip.x,
            top: showTooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {showTooltip.content.split("\n").map((line, index) => (
            <div key={index} className="whitespace-nowrap">
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
