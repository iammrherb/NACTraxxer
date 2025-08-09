"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, ExternalLink } from "lucide-react"

type ViewId =
  | "zero-trust-nac"
  | "802.1x-auth"
  | "pki-infrastructure"
  | "multi-cloud"
  | "intune-integration"
  | "device-onboarding"
  | "fortigate-tacacs"
  | "paloalto-tacacs"

type EdgeType = "radius" | "https" | "ldap" | "syslog" | "tacacs" | "data"

interface InteractiveDiagramProps {
  view: string
  vendor: string
  connectivity: string
  identity: string
  deployment: string
}

interface DiagramNode {
  id: string
  label: string
  type:
    | "endpoint"
    | "network"
    | "wireless"
    | "nac"
    | "identity"
    | "mdm"
    | "policy"
    | "firewall"
    | "proxy"
    | "pki"
    | "certificate"
    | "portal"
    | "workflow"
    | "syslog"
    | "management"
    | "location"
    | "connectivity"
    | "cloud"
    | "user"
  x: number
  y: number
  width: number
  height: number
  color: string
  vendor?: string
  imageUrl?: string
  description?: string
}

type ReferenceUrl = { label: string; href: string }

interface EdgeMeta {
  ports?: string
  ciphers?: string
  certValidity?: string
  referenceUrls?: ReferenceUrl[]
  latencyMs?: number
}

interface DiagramConnection {
  id: string
  from: string
  to: string
  label: string
  type: EdgeType
  animated: boolean
  meta?: EdgeMeta
}

export default function InteractiveDiagram({
  view,
  vendor,
  connectivity,
  identity,
  deployment,
}: InteractiveDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null)

  // Store nodes/connections in state so we can drag nodes around
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [connections, setConnections] = useState<DiagramConnection[]>([])

  // Colors per protocol for legend consistency
  const getConnectionColor = (type: EdgeType) => {
    switch (type) {
      case "radius":
        return "#00c8d7" // Portnox primary accent
      case "https":
        return "#059669"
      case "ldap":
        return "#0078D4"
      case "syslog":
        return "#7C3AED"
      case "tacacs":
        return "#DC2626"
      case "data":
      default:
        return "#6B7280"
    }
  }

  // Placeholder stencil images (vendor logos, clouds, devices)
  // Using placeholder.svg with a descriptive query to generate themed blocks
  const stencil = (query: string, width = 32, height = 32) =>
    `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`

  const vendorStencil = (v: string) => {
    switch (v) {
      case "cisco":
        return stencil("Cisco logo blue")
      case "aruba":
        return stencil("Aruba HPE logo orange")
      case "juniper":
        return stencil("Juniper logo green")
      case "extreme":
        return stencil("Extreme Networks logo purple")
      case "fortinet":
        return stencil("Fortinet logo red")
      case "paloalto":
        return stencil("Palo Alto Networks logo orange")
      case "meraki":
        return stencil("Cisco Meraki logo green")
      case "ubiquiti":
        return stencil("Ubiquiti UniFi logo")
      case "mikrotik":
        return stencil("MikroTik logo")
      case "cambium":
        return stencil("Cambium Networks logo")
      case "ruckus":
        return stencil("Ruckus CommScope logo")
      default:
        return stencil("Network vendor logo")
    }
  }

  const cloudStencil = (provider: string) => {
    switch (provider) {
      case "aws":
        return stencil("AWS logo orange")
      case "azure":
        return stencil("Azure logo blue")
      case "gcp":
        return stencil("GCP logo multicolor")
      default:
        return stencil("Cloud icon")
    }
  }

  const idpStencil = (idp: string) => {
    switch (idp) {
      case "azure-ad":
        return stencil("Entra ID Azure AD logo")
      case "active-directory":
        return stencil("Active Directory logo")
      case "okta":
        return stencil("Okta logo")
      case "ping":
        return stencil("Ping Identity logo")
      default:
        return stencil("Identity provider logo")
    }
  }

  const mdmStencil = (name: string) => {
    if (/intune/i.test(name)) return stencil("Microsoft Intune logo")
    if (/jamf/i.test(name)) return stencil("Jamf logo")
    if (/kandji/i.test(name)) return stencil("Kandji logo")
    return stencil("MDM platform logo")
  }

  // Build initial diagrams for each view
  const buildInitial = useCallback(
    (v: ViewId) => {
      const nodes: DiagramNode[] = []
      const edges: DiagramConnection[] = []

      if (v === "zero-trust-nac") {
        nodes.push(
          {
            id: "endpoints",
            label: "Corporate Endpoints",
            type: "endpoint",
            x: 60,
            y: 200,
            width: 140,
            height: 90,
            color: "#e0e7ff",
            imageUrl: stencil("Laptop and phone devices"),
            description: "Windows, macOS, iOS, Android, IoT",
          },
          {
            id: "switch",
            label: `${vendor.charAt(0).toUpperCase() + vendor.slice(1)} Switch`,
            type: "network",
            x: 260,
            y: 140,
            width: 150,
            height: 90,
            color: "#d1fae5",
            vendor,
            imageUrl: vendorStencil(vendor),
            description: "802.1X Authenticator (Wired)",
          },
          {
            id: "ap",
            label: `${vendor.charAt(0).toUpperCase() + vendor.slice(1)} Wireless`,
            type: "wireless",
            x: 260,
            y: 260,
            width: 150,
            height: 90,
            color: "#d1fae5",
            vendor,
            imageUrl: vendorStencil(vendor),
            description: "802.1X Authenticator (Wireless)",
          },
          {
            id: "proxy",
            label: connectivity === "radsec" || connectivity === "hybrid" ? "RADSec Proxy" : "Direct RADIUS",
            type: "proxy",
            x: 450,
            y: 140,
            width: 150,
            height: 90,
            color: "#ede9fe",
            imageUrl: stencil("RADSec proxy"),
            description: "Secure RADIUS transport",
          },
          {
            id: "portnox",
            label: "Portnox Cloud RADIUS",
            type: "nac",
            x: 640,
            y: 200,
            width: 170,
            height: 90,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "Policy decision and AAA",
          },
          {
            id: "idp",
            label: identity === "azure-ad" ? "Azure AD" : "Identity Provider",
            type: "identity",
            x: 850,
            y: 140,
            width: 140,
            height: 90,
            color: "#e0f2fe",
            imageUrl: idpStencil(identity),
            description: "User identity and SSO",
          },
          {
            id: "mdm",
            label: "MDM (Intune/Jamf/Kandji)",
            type: "mdm",
            x: 850,
            y: 260,
            width: 180,
            height: 90,
            color: "#fef3c7",
            imageUrl: mdmStencil("Intune"),
            description: "Compliance & certificates",
          },
          {
            id: "firewall",
            label: "Next-Gen Firewall",
            type: "firewall",
            x: 640,
            y: 320,
            width: 170,
            height: 90,
            color: "#fee2e2",
            imageUrl: stencil("Firewall icon"),
            description: "Segmentation and policy",
          },
        )

        const viaProxy = connectivity === "radsec" || connectivity === "hybrid"
        edges.push(
          {
            id: "ep-switch",
            from: "endpoints",
            to: "switch",
            label: "802.1X (EAP‑TLS)",
            type: "radius",
            animated: true,
          },
          {
            id: "ep-ap",
            from: "endpoints",
            to: "ap",
            label: "802.1X (EAP‑TLS)",
            type: "radius",
            animated: true,
          },
          {
            id: "switch-proxy-or-portnox",
            from: "switch",
            to: viaProxy ? "proxy" : "portnox",
            label: viaProxy ? "RADIUS → RADSec" : "RADIUS",
            type: "radius",
            animated: true,
          },
          {
            id: "ap-proxy-or-portnox",
            from: "ap",
            to: viaProxy ? "proxy" : "portnox",
            label: viaProxy ? "RADIUS → RADSec" : "RADIUS",
            type: "radius",
            animated: true,
          },
          ...(viaProxy
            ? [
                {
                  id: "proxy-portnox",
                  from: "proxy",
                  to: "portnox",
                  label: "RADSec",
                  type: "radius",
                  animated: true,
                } as DiagramConnection,
              ]
            : []),
          {
            id: "portnox-idp",
            from: "portnox",
            to: "idp",
            label: identity === "active-directory" ? "LDAP/LDAPS" : "SAML/OIDC",
            type: identity === "active-directory" ? "ldap" : "https",
            animated: true,
          },
          {
            id: "mdm-portnox",
            from: "mdm",
            to: "portnox",
            label: "Compliance API",
            type: "https",
            animated: true,
          },
          {
            id: "portnox-fw",
            from: "portnox",
            to: "firewall",
            label: "User-ID/FSSO/Syslog",
            type: "syslog",
            animated: true,
          },
        )
      }

      if (v === "802.1x-auth") {
        nodes.push(
          {
            id: "device",
            label: "Device",
            type: "endpoint",
            x: 80,
            y: 220,
            width: 120,
            height: 80,
            color: "#e0e7ff",
            imageUrl: stencil("Laptop device"),
            description: "Supplicant with user/machine cert",
          },
          {
            id: "authenticator",
            label: "Authenticator (Switch/AP)",
            type: "network",
            x: 260,
            y: 220,
            width: 180,
            height: 80,
            color: "#d1fae5",
            imageUrl: vendorStencil(vendor),
            description: "802.1X authenticator",
          },
          {
            id: "portnox",
            label: "Portnox RADIUS",
            type: "nac",
            x: 500,
            y: 220,
            width: 150,
            height: 80,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "EAP‑TLS termination",
          },
          {
            id: "idp",
            label: identity === "active-directory" ? "Active Directory" : "Entra ID",
            type: "identity",
            x: 700,
            y: 150,
            width: 160,
            height: 80,
            color: "#e0f2fe",
            imageUrl: idpStencil(identity),
            description: "User identity",
          },
          {
            id: "pdp",
            label: "Policy Engine",
            type: "policy",
            x: 700,
            y: 290,
            width: 160,
            height: 80,
            color: "#fee2e2",
            imageUrl: stencil("Policy gear"),
            description: "Policy evaluation",
          },
        )
        const viaProxy = connectivity === "radsec"
        nodes.push(
          ...(viaProxy
            ? [
                {
                  id: "proxy",
                  label: "RADSec Proxy",
                  type: "proxy",
                  x: 390,
                  y: 140,
                  width: 140,
                  height: 80,
                  color: "#ede9fe",
                  imageUrl: stencil("RADSec proxy purple"),
                  description: "Secure RADIUS transport",
                },
              ]
            : []),
        )

        const coaLabel = "CoA (Session-Update)"
        const edgeAuthTo = viaProxy ? "proxy" : "portnox"
        const edgesBase: DiagramConnection[] = [
          {
            id: "dev-auth",
            from: "device",
            to: "authenticator",
            label: "EAPOL/EAP",
            type: "radius",
            animated: true,
          },
          { id: "auth-radius", from: "authenticator", to: edgeAuthTo, label: "RADIUS", type: "radius", animated: true },
          ...(viaProxy
            ? [
                {
                  id: "proxy-portnox",
                  from: "proxy",
                  to: "portnox",
                  label: "RADSec",
                  type: "radius",
                  animated: true,
                } as DiagramConnection,
              ]
            : []),
          {
            id: "portnox-idp",
            from: "portnox",
            to: "idp",
            label: identity === "active-directory" ? "LDAPS" : "SAML/OIDC",
            type: identity === "active-directory" ? "ldap" : "https",
            animated: true,
          },
          { id: "portnox-pdp", from: "portnox", to: "pdp", label: "Policy", type: "data", animated: true },
          {
            id: "coa",
            from: "portnox",
            to: "authenticator",
            label: coaLabel,
            type: "radius",
            animated: true,
            meta: { ports: "UDP 3799 (CoA)" },
          },
        ]
        edges.push(...edgesBase)
      }

      if (v === "pki-infrastructure") {
        nodes.push(
          {
            id: "root",
            label: "Root CA",
            type: "pki",
            x: 420,
            y: 60,
            width: 140,
            height: 70,
            color: "#fee2e2",
            imageUrl: stencil("Certificate shield"),
            description: "Offline root CA",
          },
          {
            id: "issuing",
            label: "Issuing CA",
            type: "pki",
            x: 420,
            y: 160,
            width: 160,
            height: 70,
            color: "#fde68a",
            imageUrl: stencil("Issuing CA cert"),
            description: "SCEP, device/user certs",
          },
          {
            id: "radius-cert",
            label: "RADIUS Server Cert",
            type: "certificate",
            x: 260,
            y: 260,
            width: 160,
            height: 70,
            color: "#ccfbf1",
            imageUrl: stencil("Server certificate"),
            description: "TLS server authentication",
          },
          {
            id: "device-certs",
            label: "Device/User Certs",
            type: "certificate",
            x: 580,
            y: 260,
            width: 160,
            height: 70,
            color: "#e0e7ff",
            imageUrl: stencil("Client certificate"),
            description: "EAP‑TLS client auth",
          },
          {
            id: "crl-ocsp",
            label: "CRL / OCSP",
            type: "pki",
            x: 420,
            y: 360,
            width: 160,
            height: 70,
            color: "#e0f2fe",
            imageUrl: stencil("CRL OCSP"),
            description: "Revocation checking",
          },
        )
        edges.push(
          { id: "root-issuing", from: "root", to: "issuing", label: "Signs", type: "data", animated: true },
          { id: "issuing-radius", from: "issuing", to: "radius-cert", label: "Issues", type: "data", animated: true },
          { id: "issuing-device", from: "issuing", to: "device-certs", label: "Issues", type: "data", animated: true },
          { id: "issuing-crl", from: "issuing", to: "crl-ocsp", label: "Publishes", type: "https", animated: true },
        )
      }

      if (v === "multi-cloud") {
        const provider = deployment === "cloud" ? (identity === "azure-ad" ? "azure" : "aws") : "gcp"
        nodes.push(
          {
            id: "branch",
            label: "Branch Site",
            type: "location",
            x: 80,
            y: 220,
            width: 140,
            height: 90,
            color: "#e0e7ff",
            imageUrl: stencil("Office building"),
            description: "Remote branch",
          },
          {
            id: "edge",
            label: "Edge/SD‑WAN",
            type: "connectivity",
            x: 260,
            y: 220,
            width: 140,
            height: 90,
            color: "#d1fae5",
            imageUrl: stencil("SD‑WAN edge"),
            description: "Connectivity hub",
          },
          {
            id: "cloud",
            label: `${provider.toUpperCase()} Cloud`,
            type: "cloud",
            x: 440,
            y: 140,
            width: 160,
            height: 90,
            color: "#e0f2fe",
            imageUrl: cloudStencil(provider),
            description: "Selected cloud provider",
          },
          {
            id: "portnox",
            label: "Portnox Cloud",
            type: "nac",
            x: 640,
            y: 220,
            width: 170,
            height: 90,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "Cloud NAC platform",
          },
        )
        edges.push(
          { id: "branch-edge", from: "branch", to: "edge", label: "IPSec/SD‑WAN", type: "data", animated: true },
          { id: "edge-cloud", from: "edge", to: "cloud", label: "Private Link", type: "https", animated: true },
          { id: "cloud-portnox", from: "cloud", to: "portnox", label: "API/RADIUS", type: "https", animated: true },
        )
      }

      if (v === "intune-integration") {
        nodes.push(
          {
            id: "devices",
            label: "Managed Devices",
            type: "endpoint",
            x: 80,
            y: 220,
            width: 140,
            height: 90,
            color: "#e0e7ff",
            imageUrl: stencil("Managed devices"),
            description: "Intune-managed endpoints",
          },
          {
            id: "intune",
            label: "Microsoft Intune",
            type: "mdm",
            x: 280,
            y: 220,
            width: 170,
            height: 90,
            color: "#e0f2fe",
            imageUrl: mdmStencil("Intune"),
            description: "MDM policies, SCEP",
          },
          {
            id: "entra",
            label: "Entra ID",
            type: "identity",
            x: 500,
            y: 160,
            width: 160,
            height: 90,
            color: "#dbeafe",
            imageUrl: idpStencil("azure-ad"),
            description: "User identity",
          },
          {
            id: "portnox",
            label: "Portnox Cloud",
            type: "nac",
            x: 500,
            y: 300,
            width: 170,
            height: 90,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "Compliance and AAA",
          },
          {
            id: "compliance",
            label: "Compliance Engine",
            type: "policy",
            x: 720,
            y: 220,
            width: 180,
            height: 90,
            color: "#fee2e2",
            imageUrl: stencil("Compliance check"),
            description: "Risk assessment",
          },
        )
        edges.push(
          { id: "dev-intune", from: "devices", to: "intune", label: "MDM Enrollment", type: "https", animated: true },
          {
            id: "intune-portnox",
            from: "intune",
            to: "portnox",
            label: "Compliance API",
            type: "https",
            animated: true,
          },
          { id: "entra-portnox", from: "entra", to: "portnox", label: "Auth/SAML/OIDC", type: "https", animated: true },
          { id: "portnox-comp", from: "portnox", to: "compliance", label: "Policy Eval", type: "data", animated: true },
        )
      }

      if (v === "device-onboarding") {
        nodes.push(
          {
            id: "portal",
            label: "Onboarding Portal",
            type: "portal",
            x: 420,
            y: 60,
            width: 200,
            height: 90,
            color: "#e0f2fe",
            imageUrl: stencil("Portal web"),
            description: "Self-service onboarding",
          },
          {
            id: "corp",
            label: "Corporate (EAP‑TLS)",
            type: "workflow",
            x: 80,
            y: 220,
            width: 220,
            height: 120,
            color: "#d1fae5",
            imageUrl: stencil("Corporate workflow"),
            description: "User/machine certs",
          },
          {
            id: "byod",
            label: "BYOD / Mobile",
            type: "workflow",
            x: 340,
            y: 220,
            width: 220,
            height: 120,
            color: "#fde68a",
            imageUrl: stencil("BYOD workflow"),
            description: "Captive portal / PSK",
          },
          {
            id: "guest",
            label: "Guest Access",
            type: "workflow",
            x: 600,
            y: 220,
            width: 220,
            height: 120,
            color: "#e9d5ff",
            imageUrl: stencil("Guest access"),
            description: "Sponsored guest",
          },
          {
            id: "iot",
            label: "IoT & Profiling",
            type: "workflow",
            x: 860,
            y: 220,
            width: 220,
            height: 120,
            color: "#fee2e2",
            imageUrl: stencil("IoT profiling"),
            description: "Profiling & MAB",
          },
        )
        edges.push(
          { id: "portal-corp", from: "portal", to: "corp", label: "Initiates", type: "data", animated: true },
          { id: "portal-byod", from: "portal", to: "byod", label: "Initiates", type: "data", animated: true },
          { id: "portal-guest", from: "portal", to: "guest", label: "Initiates", type: "data", animated: true },
          { id: "portal-iot", from: "portal", to: "iot", label: "Initiates", type: "data", animated: true },
        )
      }

      if (v === "fortigate-tacacs") {
        nodes.push(
          {
            id: "admin",
            label: "Network Admin",
            type: "user",
            x: 80,
            y: 220,
            width: 140,
            height: 90,
            color: "#e0e7ff",
            imageUrl: stencil("Admin user"),
            description: "SSH/HTTPS to device",
          },
          {
            id: "fortigate",
            label: "FortiGate",
            type: "firewall",
            x: 280,
            y: 220,
            width: 150,
            height: 90,
            color: "#fee2e2",
            vendor: "fortinet",
            imageUrl: vendorStencil("fortinet"),
            description: "Device admin",
          },
          {
            id: "tacacs",
            label: "Portnox TACACS+",
            type: "nac",
            x: 500,
            y: 220,
            width: 170,
            height: 90,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "AAA for admin",
          },
          {
            id: "ad",
            label: "Active Directory",
            type: "identity",
            x: 720,
            y: 220,
            width: 170,
            height: 90,
            color: "#dbeafe",
            imageUrl: idpStencil("active-directory"),
            description: "RBAC groups",
          },
        )
        edges.push(
          { id: "admin-fw", from: "admin", to: "fortigate", label: "SSH/HTTPS", type: "https", animated: true },
          { id: "fw-tacacs", from: "fortigate", to: "tacacs", label: "TACACS+", type: "tacacs", animated: true },
          { id: "tacacs-ad", from: "tacacs", to: "ad", label: "LDAP/LDAPS", type: "ldap", animated: true },
        )
      }

      if (v === "paloalto-tacacs") {
        nodes.push(
          {
            id: "admin",
            label: "Network Admin",
            type: "user",
            x: 80,
            y: 220,
            width: 140,
            height: 90,
            color: "#e0e7ff",
            imageUrl: stencil("Admin user"),
            description: "SSH/HTTPS to device",
          },
          {
            id: "pan",
            label: "Palo Alto NGFW",
            type: "firewall",
            x: 280,
            y: 220,
            width: 170,
            height: 90,
            color: "#fee2e2",
            vendor: "paloalto",
            imageUrl: vendorStencil("paloalto"),
            description: "Device admin",
          },
          {
            id: "panorama",
            label: "Panorama",
            type: "management",
            x: 280,
            y: 100,
            width: 170,
            height: 90,
            color: "#fde68a",
            vendor: "paloalto",
            imageUrl: vendorStencil("paloalto"),
            description: "Central management",
          },
          {
            id: "tacacs",
            label: "Portnox TACACS+",
            type: "nac",
            x: 520,
            y: 220,
            width: 170,
            height: 90,
            color: "#ccfbf1",
            imageUrl: stencil("Portnox logo"),
            description: "AAA for admin",
          },
          {
            id: "ad",
            label: "Active Directory",
            type: "identity",
            x: 740,
            y: 220,
            width: 170,
            height: 90,
            color: "#dbeafe",
            imageUrl: idpStencil("active-directory"),
            description: "RBAC groups",
          },
        )
        edges.push(
          { id: "admin-pan", from: "admin", to: "pan", label: "SSH/HTTPS", type: "https", animated: true },
          { id: "pan-panorama", from: "pan", to: "panorama", label: "Mgmt", type: "https", animated: true },
          { id: "pan-tacacs", from: "pan", to: "tacacs", label: "TACACS+", type: "tacacs", animated: true },
          { id: "panorama-tacacs", from: "panorama", to: "tacacs", label: "TACACS+", type: "tacacs", animated: true },
          { id: "tacacs-ad", from: "tacacs", to: "ad", label: "LDAP/LDAPS", type: "ldap", animated: true },
        )
      }

      return { nodes, edges }
    },
    [connectivity, deployment, identity, vendor],
  )

  // Latency estimate based on node center distance with protocol adjustment
  const estimateLatencyMs = (a: DiagramNode, b: DiagramNode, type: EdgeType) => {
    const ax = a.x + a.width / 2
    const ay = a.y + a.height / 2
    const bx = b.x + b.width / 2
    const by = b.y + b.height / 2
    const d = Math.hypot(ax - bx, ay - by)
    let ms = Math.max(2, Math.round(d / 18))
    if (type === "https") ms += 8
    if (type === "ldap") ms += 5
    if (type === "tacacs") ms += 4
    if (type === "syslog") ms += 1
    return ms
  }

  const defaultReferences: ReferenceUrl[] = [
    { label: "Portnox Zero Trust", href: "https://docs.portnox.com/topics/zero_trust" },
    { label: "Microsoft Zero Trust", href: "https://docs.microsoft.com/en-us/security/zero-trust/" },
  ]

  const buildEdgeMeta = (edge: DiagramConnection, from: DiagramNode, to: DiagramNode): EdgeMeta => {
    const meta: EdgeMeta = { ...(edge.meta || {}) }

    if (!meta.ports) {
      switch (edge.type) {
        case "radius": {
          const isCoA = /coa|session|reauth/i.test(edge.label)
          meta.ports = isCoA ? "UDP 3799 (CoA)" : "UDP 1812 (Auth), 1813 (Acct)"
          break
        }
        case "https":
          meta.ports = "TCP 443"
          break
        case "ldap":
          meta.ports = "TCP 389 (STARTTLS) / 636 (LDAPS)"
          break
        case "tacacs":
          meta.ports = "TCP 49"
          break
        case "syslog":
          meta.ports = "UDP 514 / TCP 6514 (TLS)"
          break
        case "data":
        default:
          meta.ports = "—"
      }
    }

    if (!meta.ciphers) {
      switch (edge.type) {
        case "https":
          meta.ciphers = "TLS 1.2/1.3 (AES-GCM)"
          break
        case "ldap":
          meta.ciphers = "STARTTLS/LDAPS (TLS 1.2/1.3)"
          break
        case "radius": {
          const isEAPTLS = /eap[-\s]?tls/i.test(edge.label)
          meta.ciphers = isEAPTLS ? "EAP‑TLS (TLS 1.2/1.3)" : "EAP methods per policy"
          break
        }
        case "tacacs":
          meta.ciphers = "TACACS+ per-session encryption"
          break
        case "syslog":
          meta.ciphers = "TLS over 6514 (if TCP) or none (UDP 514)"
          break
        case "data":
        default:
          meta.ciphers = "—"
      }
    }

    if (!meta.certValidity) {
      switch (edge.type) {
        case "https":
          meta.certValidity = "Server cert e.g., 398 days"
          break
        case "radius": {
          const isEAPTLS = /eap[-\s]?tls/i.test(edge.label)
          meta.certValidity = isEAPTLS ? "Client: 365d, Server: 398d (example)" : "Server: 398d (example)"
          break
        }
        case "ldap":
          meta.certValidity = "If LDAPS/STARTTLS: server cert per CA policy"
          break
        default:
          meta.certValidity = "N/A"
      }
    }

    if (!meta.referenceUrls) {
      const refs: ReferenceUrl[] = [...defaultReferences]
      if (edge.type === "radius" && /coa/i.test(edge.label)) {
        refs.unshift({ label: "RADIUS CoA", href: "https://docs.portnox.com/topics/radius_coa" })
      }
      meta.referenceUrls = refs
    }

    if (meta.latencyMs == null) {
      meta.latencyMs = estimateLatencyMs(from, to, edge.type)
    }

    return meta
  }

  // Rebuild the diagram whenever the selected view or controls change
  useEffect(() => {
    const v = (view as ViewId) || "zero-trust-nac"
    const { nodes, edges } = buildInitial(v)
    setNodes(nodes)
    setConnections(edges)
  }, [view, vendor, connectivity, identity, deployment, buildInitial])

  // Dragging handlers
  const onMouseDownNode = (e: React.MouseEvent<SVGGElement>, node: DiagramNode) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    // Get mouse position relative to SVG
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    const { x, y } = pt.matrixTransform(ctm?.inverse())
    setDraggingId(node.id)
    setDragOffset({ dx: x - node.x, dy: y - node.y })
  }

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingId || !dragOffset) return
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    const { x, y } = pt.matrixTransform(ctm?.inverse())
    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingId
          ? {
              ...n,
              x: x - dragOffset.dx,
              y: y - dragOffset.dy,
            }
          : n,
      ),
    )
  }

  const onMouseUp = () => {
    if (draggingId) {
      setDraggingId(null)
      setDragOffset(null)
    }
  }

  // Paths and enriched edges
  const enrichedEdges = useMemo(() => {
    return connections
      .map((edge) => {
        const from = nodes.find((n) => n.id === edge.from)
        const to = nodes.find((n) => n.id === edge.to)
        if (!from || !to) return null
        const meta = buildEdgeMeta(edge, from, to)
        const fromX = from.x + from.width / 2
        const fromY = from.y + from.height / 2
        const toX = to.x + to.width / 2
        const toY = to.y + to.height / 2
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2 - 10
        const d = `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 30} ${toX} ${toY}`
        return {
          ...edge,
          from,
          to,
          meta,
          d,
          midX,
          midY,
        }
      })
      .filter(Boolean) as Array<
      DiagramConnection & {
        from: DiagramNode
        to: DiagramNode
        meta: EdgeMeta
        d: string
        midX: number
        midY: number
      }
    >
  }, [connections, nodes])

  // Animation control (CSS animation tempo)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const paths = svg.querySelectorAll<SVGPathElement>(".animated-path")
    paths.forEach((p) => {
      p.style.animationPlayState = isAnimating ? "running" : "paused"
    })
  }, [isAnimating])

  const resetView = () => {
    const v = (view as ViewId) || "zero-trust-nac"
    const { nodes, edges } = buildInitial(v)
    setNodes(nodes)
    setConnections(edges)
    setZoom(1)
  }

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsAnimating((s) => !s)}>
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={resetView}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(3, z * 1.2))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(0.5, z / 1.2))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline">{Math.round(zoom * 100)}%</Badge>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-lg border bg-white">
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          viewBox="0 0 1100 520"
          className="w-full h-[600px]"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          <defs>
            <style>
              {`
                .animated-path {
                  stroke-dasharray: 10 5;
                  animation: dash 2s linear infinite;
                }
                @keyframes dash {
                  to { stroke-dashoffset: -15; }
                }
                .node-shadow {
                  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));
                }
              `}
            </style>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
            </marker>
          </defs>

          {/* Edges with tooltips */}
          {enrichedEdges.map((edge) => {
            const stroke = getConnectionColor(edge.type)
            return (
              <TooltipProvider key={`edge-${edge.id}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer">
                      {/* Invisible thick path to improve hover interaction */}
                      <path
                        d={edge.d}
                        stroke="transparent"
                        strokeWidth="14"
                        fill="none"
                        style={{ pointerEvents: "stroke" }}
                      />
                      <path
                        d={edge.d}
                        stroke={stroke}
                        strokeWidth="2"
                        fill="none"
                        className={edge.animated ? "animated-path" : ""}
                        markerEnd="url(#arrow)"
                      />
                      <text x={edge.midX} y={edge.midY} textAnchor="middle" fontSize="11" fill="#374151">
                        {edge.label}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="text-xs space-y-1">
                      <div className="font-semibold">{edge.label}</div>
                      <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-1">
                        <div className="text-[10px] uppercase text-muted-foreground">Protocol</div>
                        <div className="col-span-2">{edge.type.toUpperCase()}</div>

                        <div className="text-[10px] uppercase text-muted-foreground">Ports</div>
                        <div className="col-span-2">{edge.meta.ports}</div>

                        <div className="text-[10px] uppercase text-muted-foreground">Ciphers</div>
                        <div className="col-span-2">{edge.meta.ciphers}</div>

                        <div className="text-[10px] uppercase text-muted-foreground">Cert Validity</div>
                        <div className="col-span-2">{edge.meta.certValidity}</div>

                        <div className="text-[10px] uppercase text-muted-foreground">Latency</div>
                        <div className="col-span-2">{edge.meta.latencyMs} ms (approx)</div>
                      </div>
                      {edge.meta.referenceUrls && edge.meta.referenceUrls.length > 0 && (
                        <div className="pt-2 border-t mt-2">
                          <div className="text-[10px] uppercase text-muted-foreground mb-1">References</div>
                          <ul className="space-y-1">
                            {edge.meta.referenceUrls.map((r) => (
                              <li key={r.href}>
                                <a
                                  href={r.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                                >
                                  {r.label}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              className="cursor-move node-shadow"
              onMouseDown={(e) => onMouseDownNode(e, node)}
              aria-label={node.label}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={10}
                fill={node.color}
                stroke="#fff"
                strokeWidth={2}
                opacity={0.95}
              />
              {/* Image */}
              {node.imageUrl && (
                <image
                  href={node.imageUrl}
                  x={node.x + 8}
                  y={node.y + 8}
                  width="28"
                  height="28"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
              {/* Label */}
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill="#111827"
              >
                {node.label}
              </text>
              {/* Subtext */}
              {node.description && (
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {node.description}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
