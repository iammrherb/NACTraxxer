"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, StepForward, StepBack } from "lucide-react"
import { useSites, type Site } from "@/hooks/use-sites"
import { useThemeSettings } from "@/lib/theme"

// Diagram types
export type DiagramNode = {
  id: string
  label: string
  kind:
    | "endpoint"
    | "network"
    | "proxy"
    | "nac"
    | "identity"
    | "mdm"
    | "pki"
    | "policy"
    | "firewall"
    | "portal"
    | "compliance"
    | "location"
    | "cluster"
    | "vlan"
  x: number
  y: number
  w: number
  h: number
  fill: string
  icon?: string
  logo?: string // image path for vendor/cloud
  vendor?: string
  description?: string
  meta?: Record<string, string | number | boolean>
}

export type DiagramEdge = {
  id: string
  from: string
  to: string
  label: string
  protocol: keyof ReturnType<typeof useThemeSettings>["theme"]["protocolColors"] | string
  animated?: boolean
  sequence?: number // for workflow steps
  dashed?: boolean
}

export type InteractiveDiagramHandle = {
  exportSVG: (filename?: string) => void
  exportPNG: (filename?: string) => Promise<void>
}

type Props = {
  view: "multi-site" | "complete" | "auth-flow" | "pki" | "policies" | "tacacs-admin" | "onboarding"
  animationSpeed: number
  showDataFlow: boolean
  activeSiteId: string
}

const GRID = { cellW: 180, cellH: 120, gapX: 40, gapY: 40 }

function useZoom(initial = 1) {
  const [zoom, setZoom] = useState(initial)
  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 3))
  const zoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.5))
  const reset = () => setZoom(1)
  return { zoom, zoomIn, zoomOut, reset }
}

function clusterRect(siteIdx: number, cols: number, sitesLen: number) {
  // Place site clusters in grid
  const col = siteIdx % cols
  const row = Math.floor(siteIdx / cols)
  const x = 40 + col * (GRID.cellW * 4 + GRID.gapX * 3 + 100)
  const y = 40 + row * (GRID.cellH * 3 + GRID.gapY * 2 + 100)
  return { x, y, w: GRID.cellW * 4 + GRID.gapX * 3 + 60, h: GRID.cellH * 3 + GRID.gapY * 2 + 60 }
}

function iconFor(kind: DiagramNode["kind"]): string {
  switch (kind) {
    case "endpoint":
      return "💻"
    case "network":
      return "🔌"
    case "proxy":
      return "🔄"
    case "nac":
      return "🛡️"
    case "identity":
      return "👤"
    case "mdm":
      return "📱"
    case "pki":
      return "🔐"
    case "policy":
      return "⚙️"
    case "firewall":
      return "🔥"
    case "portal":
      return "🌐"
    case "compliance":
      return "✅"
    case "location":
      return "🏢"
    case "vlan":
      return "🧩"
    default:
      return "🧱"
  }
}

function logoForVendor(v?: string): string | undefined {
  if (!v) return
  const map: Record<string, string> = {
    cisco: "/logos/cisco.png",
    aruba: "/logos/aruba.png",
    juniper: "/logos/juniper.png",
    extreme: "/logos/extreme.png",
    ruckus: "/logos/ruckus.png",
    fortinet: "/logos/fortinet.png",
    paloalto: "/logos/paloalto.png",
    "azure-ad": "/logos/azure.png",
    azure: "/logos/azure.png",
    aws: "/logos/aws.png",
    gcp: "/logos/gcp.png",
    intune: "/logos/intune.png",
    portnox: "/logos/portnox.png",
  }
  return map[v]
}

function cloudColor(cloud: Site["cloudPreference"]) {
  switch (cloud) {
    case "aws":
      return "#f59e0b"
    case "azure":
      return "#2563eb"
    case "gcp":
      return "#ea4335"
    case "onprem":
      return "#4b5563"
    default:
      return "#6b7280"
  }
}

function buildMultiSite(sites: Site[]) {
  // returns nodes/edges for a multi-site overview with RADSec placement
  const nodes: DiagramNode[] = []
  const edges: DiagramEdge[] = []
  const cols = Math.min(2, Math.max(1, Math.ceil(Math.sqrt(sites.length))))
  const rows = Math.ceil(sites.length / cols)

  sites.forEach((site, i) => {
    const cluster = clusterRect(i, cols, sites.length)
    const clusterId = `cluster-${site.id}`
    nodes.push({
      id: clusterId,
      label: `${site.name} (${site.region})`,
      kind: "cluster",
      x: cluster.x,
      y: cluster.y,
      w: cluster.w,
      h: cluster.h,
      fill: "#ffffff",
      icon: "🗺️",
      description: "Site cluster",
      meta: { users: site.users, country: site.country, status: site.status, completion: site.completionPercent },
    })

    // Layout columns within cluster: Endpoints | Access | Proxy | Cloud/NAC
    const baseX = cluster.x + 30
    const baseY = cluster.y + 30

    const endpointId = `ep-${site.id}`
    nodes.push({
      id: endpointId,
      label: "Endpoints",
      kind: "endpoint",
      x: baseX,
      y: baseY + GRID.cellH,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#4f46e5",
      icon: iconFor("endpoint"),
      description: "Windows, macOS, Linux, iOS, Android, and IoT",
      meta: site.deviceMix as any,
    })

    const wiredId = `wired-${site.id}`
    const wifiId = `wifi-${site.id}`

    nodes.push({
      id: wiredId,
      label: `${site.wiredVendor.toUpperCase()} Switch`,
      kind: "network",
      x: baseX + GRID.cellW + GRID.gapX,
      y: baseY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#10b981",
      vendor: site.wiredVendor,
      logo: logoForVendor(site.wiredVendor),
      icon: iconFor("network"),
      description: "Access switch with 802.1X",
      meta: { role: "authenticator" },
    })
    nodes.push({
      id: wifiId,
      label: `${site.wirelessVendor.toUpperCase()} Wireless`,
      kind: "network",
      x: baseX + GRID.cellW + GRID.gapX,
      y: baseY + GRID.cellH + GRID.gapY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#10b981",
      vendor: site.wirelessVendor,
      logo: logoForVendor(site.wirelessVendor),
      icon: iconFor("network"),
      description: "Wireless AP/controller with 802.1X",
      meta: { role: "authenticator" },
    })

    const proxyId = `radsec-${site.id}`
    const proxyLocation = site.radsecDeployment
    const proxyVendor = proxyLocation === "onprem" ? "portnox" : proxyLocation
    nodes.push({
      id: proxyId,
      label: `RADSec Proxy (${proxyLocation.toUpperCase()})`,
      kind: "proxy",
      x: baseX + (GRID.cellW + GRID.gapX) * 2,
      y: baseY + GRID.cellH / 2,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#06b6d4",
      logo: logoForVendor(proxyVendor),
      icon: iconFor("proxy"),
      description: "Secure RADIUS over TLS (RADSec) proxy",
      meta: { deployment: proxyLocation },
    })

    const cloudId = `cloud-${site.id}`
    nodes.push({
      id: cloudId,
      label: `${site.cloudPreference.toUpperCase()} Cloud`,
      kind: "location",
      x: baseX + (GRID.cellW + GRID.gapX) * 3,
      y: baseY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: cloudColor(site.cloudPreference),
      logo: logoForVendor(site.cloudPreference),
      icon: iconFor("location"),
      description: "Cloud region hosting services",
    })

    const nacId = `portnox-${site.id}`
    nodes.push({
      id: nacId,
      label: "Portnox Cloud RADIUS",
      kind: "nac",
      x: baseX + (GRID.cellW + GRID.gapX) * 3,
      y: baseY + GRID.cellH + GRID.gapY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#00c8d7",
      logo: "/logos/portnox.png",
      icon: iconFor("nac"),
      description: "Cloud NAC and policy engine",
    })

    const idpId = `idp-${site.id}`
    nodes.push({
      id: idpId,
      label: site.idp === "azure-ad" ? "Microsoft Entra ID" : site.idp.toUpperCase(),
      kind: "identity",
      x: baseX + (GRID.cellW + GRID.gapX) * 4,
      y: baseY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#2563eb",
      logo: logoForVendor("azure"),
      icon: iconFor("identity"),
      description: "Identity provider and group claims",
    })

    const mdmId = `mdm-${site.id}`
    nodes.push({
      id: mdmId,
      label: site.mdm.map((m) => m.toUpperCase()).join(" + "),
      kind: "mdm",
      x: baseX + (GRID.cellW + GRID.gapX) * 4,
      y: baseY + GRID.cellH + GRID.gapY,
      w: GRID.cellW,
      h: GRID.cellH,
      fill: "#0891b2",
      logo: site.mdm.includes("intune") ? "/logos/intune.png" : undefined,
      icon: iconFor("mdm"),
      description: "Device management and compliance signals",
    })

    // Edges
    edges.push({
      id: `e-${endpointId}-${wiredId}`,
      from: endpointId,
      to: wiredId,
      label: "802.1X (EAP)",
      protocol: "radius",
      animated: true,
    })
    edges.push({
      id: `e-${endpointId}-${wifiId}`,
      from: endpointId,
      to: wifiId,
      label: "802.1X (EAP)",
      protocol: "radius",
      animated: true,
    })
    edges.push({
      id: `e-${wiredId}-${proxyId}`,
      from: wiredId,
      to: proxyId,
      label: "RADIUS",
      protocol: "radius",
      animated: true,
    })
    edges.push({
      id: `e-${wifiId}-${proxyId}`,
      from: wifiId,
      to: proxyId,
      label: "RADIUS",
      protocol: "radius",
      animated: true,
    })
    edges.push({
      id: `e-${proxyId}-${nacId}`,
      from: proxyId,
      to: nacId,
      label: "RADSec (TLS)",
      protocol: "radsec",
      animated: true,
    })
    edges.push({
      id: `e-${nacId}-${idpId}`,
      from: nacId,
      to: idpId,
      label: "AuthN/Claims",
      protocol: "ldap",
      animated: true,
    })
    edges.push({
      id: `e-${nacId}-${mdmId}`,
      from: nacId,
      to: mdmId,
      label: "Compliance API",
      protocol: "https",
      animated: true,
    })
  })

  // Global Portnox Cloud in corner (legend-like anchor)
  nodes.push({
    id: "global-portnox",
    label: "Portnox Cloud",
    kind: "nac",
    x: 40,
    y: rows * (GRID.cellH * 3 + GRID.gapY * 2 + 100) + 40,
    w: 180,
    h: 80,
    fill: "#00c8d7",
    logo: "/logos/portnox.png",
    description: "Global NAC services",
  })

  return { nodes, edges }
}

function buildComplete(site: Site) {
  const { nodes, edges } = buildMultiSite([site])
  // Also include VLAN policy nodes and firewall
  const vlanId = `vlan-${site.id}`
  nodes.push({
    id: vlanId,
    label: "VLAN Assignment",
    kind: "vlan",
    x: nodes.find((n) => n.id.startsWith("portnox-"))!.x,
    y: nodes.find((n) => n.id.startsWith("portnox-"))!.y + 120,
    w: 180,
    h: 80,
    fill: "#f59e0b",
    icon: iconFor("vlan"),
    description: "Dynamic VLAN/ACL assignment based on policy",
  })
  edges.push({
    id: `policy-${site.id}`,
    from: nodes.find((n) => n.id.startsWith("portnox-"))!.id,
    to: vlanId,
    label: "Policy Decision",
    protocol: "data",
    animated: true,
  })
  const wired = nodes.find((n) => n.id.startsWith("wired-"))!
  const wifi = nodes.find((n) => n.id.startsWith("wifi-"))!
  edges.push({
    id: `coa-wired-${site.id}`,
    from: vlanId,
    to: wired.id,
    label: "CoA (Reauth/Port-Bounce)",
    protocol: "coa",
    dashed: true,
    animated: true,
  })
  edges.push({
    id: `coa-wifi-${site.id}`,
    from: vlanId,
    to: wifi.id,
    label: "CoA (Disconnect)",
    protocol: "coa",
    dashed: true,
    animated: true,
  })
  return { nodes, edges }
}

function buildAuthFlow(site: Site) {
  // Step-by-step 1..N with CoA step at end
  const base = buildComplete(site)
  const steps = ["ep->auth", "auth->proxy", "proxy->nac", "nac->idp", "nac->mdm", "nac->policy", "policy->coa"]
  let seq = 1
  base.edges.forEach((e) => {
    e.sequence = undefined
  })
  // mark sequences on specific edges
  function mark(fromPrefix: string, toPrefix: string) {
    const edge = base.edges.find((e) => e.from.startsWith(fromPrefix) && e.to.startsWith(toPrefix))
    if (edge) edge.sequence = seq++
  }
  mark("ep-", "wired-") // 1
  mark("ep-", "wifi-") // or 1 (parallel)
  mark("wired-", "radsec-") // 2
  mark("wifi-", "radsec-") // 2
  mark("radsec-", "portnox-") // 3
  mark("portnox-", "idp-") // 4
  mark("portnox-", "mdm-") // 5
  mark("portnox-", "vlan-") // 6
  // CoA edges
  base.edges
    .filter((e) => e.protocol === "coa")
    .forEach((e) => {
      e.sequence = seq++
    })
  return base
}

function buildPolicies(site: Site) {
  const { nodes, edges } = buildComplete(site)
  // Emphasize policy engine
  const nac = nodes.find((n) => n.id.startsWith("portnox-"))!
  const pol = {
    id: `policy-${site.id}`,
    label: "Policy Engine",
    kind: "policy" as const,
    x: nac.x + 220,
    y: nac.y + 120,
    w: 200,
    h: 100,
    fill: "#ef4444",
    icon: iconFor("policy"),
    description: "Evaluates user, device, posture, and location",
  }
  nodes.push(pol)
  edges.push({
    id: `nac-pol-${site.id}`,
    from: nac.id,
    to: pol.id,
    label: "Policy Context",
    protocol: "data",
    animated: true,
  })
  const vlan = nodes.find((n) => n.id.startsWith("vlan-"))!
  edges.push({
    id: `pol-vlan-${site.id}`,
    from: pol.id,
    to: vlan.id,
    label: "Result (VLAN/ACL/SGT)",
    protocol: "data",
    animated: true,
  })
  return { nodes, edges }
}

function buildTacacsAdmin(site: Site) {
  const nodes: DiagramNode[] = []
  const edges: DiagramEdge[] = []
  const baseX = 60
  const baseY = 80
  const adminId = `admin-${site.id}`
  nodes.push({
    id: adminId,
    label: "Network Admin",
    kind: "endpoint",
    x: baseX,
    y: baseY + 40,
    w: 160,
    h: 80,
    fill: "#4f46e5",
    icon: "👨‍💼",
    description: "Admin authenticates to device",
  })
  const deviceId = `device-${site.id}`
  nodes.push({
    id: deviceId,
    label: `${site.wiredVendor.toUpperCase()} Switch`,
    kind: "network",
    x: baseX + 220,
    y: baseY,
    w: 200,
    h: 80,
    fill: "#10b981",
    logo: logoForVendor(site.wiredVendor),
    icon: "🧰",
    description: "Network device under admin control",
  })
  const tacacsId = `tacacs-${site.id}`
  nodes.push({
    id: tacacsId,
    label: "Portnox TACACS+",
    kind: "nac",
    x: baseX + 460,
    y: baseY,
    w: 220,
    h: 80,
    fill: "#00c8d7",
    logo: "/logos/portnox.png",
    icon: "🛡️",
    description: "Admin authentication and authorization",
  })
  const idpId = `idp-${site.id}`
  nodes.push({
    id: idpId,
    label: "Directory (AD/Entra)",
    kind: "identity",
    x: baseX + 720,
    y: baseY,
    w: 200,
    h: 80,
    fill: "#2563eb",
    logo: "/logos/azure.png",
    icon: "🏢",
    description: "User group membership",
  })

  edges.push({
    id: `a1-${site.id}`,
    from: adminId,
    to: deviceId,
    label: "SSH/HTTPS",
    protocol: "https",
    animated: true,
  })
  edges.push({
    id: `a2-${site.id}`,
    from: deviceId,
    to: tacacsId,
    label: "TACACS+",
    protocol: "tacacs",
    animated: true,
  })
  edges.push({ id: `a3-${site.id}`, from: tacacsId, to: idpId, label: "AuthN/AuthZ", protocol: "ldap", animated: true })
  return { nodes, edges }
}

function buildPki(site: Site) {
  const nodes: DiagramNode[] = []
  const edges: DiagramEdge[] = []
  const x = 80
  const y = 40
  const root = {
    id: `root-${site.id}`,
    label: "Root CA",
    kind: "pki",
    x: x + 260,
    y: y,
    w: 160,
    h: 80,
    fill: "#ef4444",
    icon: "🔐",
    description: "Offline root",
  }
  const issuing = {
    id: `issuing-${site.id}`,
    label: "Issuing CA",
    kind: "pki",
    x: x + 260,
    y: y + 120,
    w: 160,
    h: 80,
    fill: "#f97316",
    icon: "📜",
    description: "Issues certs",
  }
  const radius = {
    id: `radiuscert-${site.id}`,
    label: "RADIUS Cert",
    kind: "pki",
    x: x + 80,
    y: y + 240,
    w: 160,
    h: 80,
    fill: "#00c8d7",
    icon: "🛡️",
    description: "Server cert",
  }
  const device = {
    id: `devcert-${site.id}`,
    label: "Device Certs",
    kind: "pki",
    x: x + 440,
    y: y + 240,
    w: 160,
    h: 80,
    fill: "#4f46e5",
    icon: "💻",
    description: "Client certs",
  }
  const crl = {
    id: `crl-${site.id}`,
    label: "CRL/OCSP",
    kind: "pki",
    x: x + 260,
    y: y + 240,
    w: 160,
    h: 80,
    fill: "#7c3aed",
    icon: "📋",
    description: "Revocation info",
  }
  nodes.push(root, issuing, radius, device, crl)
  edges.push({ id: `p1-${site.id}`, from: root.id, to: issuing.id, label: "Signs", protocol: "data", animated: true })
  edges.push({
    id: `p2-${site.id}`,
    from: issuing.id,
    to: radius.id,
    label: "Issues",
    protocol: "data",
    animated: true,
  })
  edges.push({
    id: `p3-${site.id}`,
    from: issuing.id,
    to: device.id,
    label: "Issues",
    protocol: "data",
    animated: true,
  })
  edges.push({
    id: `p4-${site.id}`,
    from: issuing.id,
    to: crl.id,
    label: "Publishes",
    protocol: "data",
    animated: true,
  })
  return { nodes, edges }
}

function buildOnboarding(site: Site) {
  const nodes: DiagramNode[] = []
  const edges: DiagramEdge[] = []
  const baseX = 60
  const baseY = 60
  const portal = {
    id: `portal-${site.id}`,
    label: "Captive Portal",
    kind: "portal",
    x: baseX + 280,
    y: baseY,
    w: 220,
    h: 80,
    fill: "#7c3aed",
    icon: "🌐",
    description: "Guest/BYOD/IoT onboarding",
  }
  const corp = {
    id: `corp-${site.id}`,
    label: "Corporate",
    kind: "policy",
    x: baseX,
    y: baseY + 140,
    w: 200,
    h: 100,
    fill: "#10b981",
    icon: "🏢",
    description: "Zero-touch with MDM and cert",
  }
  const byod = {
    id: `byod-${site.id}`,
    label: "BYOD",
    kind: "policy",
    x: baseX + 240,
    y: baseY + 140,
    w: 200,
    h: 100,
    fill: "#38bdf8",
    icon: "📱",
    description: "Self-service profile",
  }
  const guest = {
    id: `guest-${site.id}`,
    label: "Guest",
    kind: "policy",
    x: baseX + 480,
    y: baseY + 140,
    w: 200,
    h: 100,
    fill: "#f59e0b",
    icon: "🔑",
    description: "Sponsored time-bound access",
  }
  const iot = {
    id: `iot-${site.id}`,
    label: "IoT",
    kind: "policy",
    x: baseX + 720,
    y: baseY + 140,
    w: 200,
    h: 100,
    fill: "#a3e635",
    icon: "💡",
    description: "MAC-based, static auth, segment",
  }
  nodes.push(portal as any, corp as any, byod as any, guest as any, iot as any)
  edges.push({
    id: `o1-${site.id}`,
    from: portal.id,
    to: corp.id,
    label: "Enrollment",
    protocol: "https",
    animated: true,
  })
  edges.push({ id: `o2-${site.id}`, from: portal.id, to: byod.id, label: "Profile", protocol: "https", animated: true })
  edges.push({
    id: `o3-${site.id}`,
    from: portal.id,
    to: guest.id,
    label: "Sponsor",
    protocol: "https",
    animated: true,
  })
  edges.push({ id: `o4-${site.id}`, from: portal.id, to: iot.id, label: "Register", protocol: "https", animated: true })
  return { nodes, edges }
}

const InteractiveDiagram = forwardRef<InteractiveDiagramHandle, Props>(function InteractiveDiagram(
  { view, animationSpeed, showDataFlow, activeSiteId }: Props,
  ref,
) {
  const { sites } = useSites()
  const site = useMemo(() => sites.find((s) => s.id === activeSiteId) ?? sites[0], [sites, activeSiteId])
  const { theme } = useThemeSettings()
  const svgRef = useRef<SVGSVGElement>(null)
  const { zoom, zoomIn, zoomOut, reset } = useZoom(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [workflowStep, setWorkflowStep] = useState(0)

  const { nodes, edges } = useMemo(() => {
    if (view === "multi-site") return buildMultiSite(sites)
    if (!site) return { nodes: [], edges: [] }
    switch (view) {
      case "complete":
        return buildComplete(site)
      case "auth-flow":
        return buildAuthFlow(site)
      case "pki":
        return buildPki(site)
      case "policies":
        return buildPolicies(site)
      case "tacacs-admin":
        return buildTacacsAdmin(site)
      case "onboarding":
        return buildOnboarding(site)
      default:
        return { nodes: [], edges: [] }
    }
  }, [sites, site, view])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const animatedPaths = svg.querySelectorAll<SVGPathElement>(".animated-path")
    animatedPaths.forEach((el) => {
      el.style.animationDuration = `${Math.max(0.2, 2 / animationSpeed)}s`
      el.style.animationPlayState = isAnimating && showDataFlow ? "running" : "paused"
    })
  }, [isAnimating, showDataFlow, animationSpeed, nodes, edges])

  const protocolColor = (proto: string) => theme.protocolColors[proto] || "#6b7280"

  const getPath = (from: DiagramNode, to: DiagramNode) => {
    const fromX = from.x + from.w
    const fromY = from.y + from.h / 2
    const toX = to.x
    const toY = to.y + to.h / 2
    const midX = (fromX + toX) / 2
    // Orthogonal-ish cubic curve to reduce overlap
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
  }

  function exportSVG(filename = "diagram.svg") {
    if (!svgRef.current) return
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(clone)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function exportPNG(filename = "diagram.png") {
    if (!svgRef.current) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgRef.current)
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.crossOrigin = "anonymous"
    const canvas = document.createElement("canvas")
    const rect = svgRef.current.getBoundingClientRect()
    canvas.width = Math.max(1200, Math.floor(rect.width * window.devicePixelRatio))
    canvas.height = Math.max(800, Math.floor(rect.height * window.devicePixelRatio))
    const ctx = canvas.getContext("2d")!
    await new Promise<void>((res, rej) => {
      img.onload = () => {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        res()
      }
      img.onerror = rej
      img.src = url
    })

    canvas.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
  }

  useImperativeHandle(ref, () => ({ exportSVG, exportPNG }), [])

  const maxX = Math.max(...nodes.map((n) => n.x + n.w), 1200)
  const maxY = Math.max(...nodes.map((n) => n.y + n.h), 700)

  // Workflow step bounds
  const maxStep = Math.max(0, ...edges.map((e) => e.sequence || 0))

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {view === "auth-flow" && (
          <>
            <Button variant="outline" size="sm" onClick={() => setWorkflowStep((s) => Math.max(0, s - 1))}>
              <StepBack className="w-4 h-4" />
            </Button>
            <Badge variant="outline">
              Step {workflowStep}/{maxStep || 1}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setWorkflowStep((s) => Math.min(maxStep, s + 1))}>
              <StepForward className="w-4 h-4" />
            </Button>
          </>
        )}
        <Button variant="outline" size="sm" onClick={() => setIsAnimating((v) => !v)}>
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-3 left-3 z-10">
        <Badge variant="outline" className="bg-white/90 backdrop-blur">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* Canvas */}
      <div
        className="w-full overflow-hidden border rounded-lg bg-white shadow-sm"
        style={{ background: "var(--pn-bg)" }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${maxX + 100} ${maxY + 100}`}
          className="w-full min-h-[650px]"
          style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
            </marker>
            <style>
              {`
                .animated-path {
                  stroke-dasharray: 10 6;
                  animation: dash 2s linear infinite;
                }
                @keyframes dash {
                  to { stroke-dashoffset: -16; }
                }
                .node {
                  transition: transform 0.15s ease, filter 0.15s ease;
                }
                .node.hovered {
                  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.18));
                  transform: translateY(-2px);
                }
                .cluster {
                  fill: #ffffffcc;
                  stroke: #e2e8f0;
                  stroke-width: 2;
                }
              `}
            </style>
          </defs>

          {/* Clusters */}
          {nodes
            .filter((n) => n.kind === "cluster")
            .map((c) => (
              <g key={c.id}>
                <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={12} className="cluster" />
                <text x={c.x + 14} y={c.y + 24} fontSize="14" fontWeight={600} fill="#334155">
                  {c.label}
                </text>
                {c.meta?.completion !== undefined && (
                  <>
                    <rect x={c.x + 14} y={c.y + 30} width={c.w - 28} height={6} fill="#e5e7eb" rx={3} />
                    <rect
                      x={c.x + 14}
                      y={c.y + 30}
                      width={((c.w - 28) * Number(c.meta.completion)) / 100}
                      height={6}
                      fill="#10b981"
                      rx={3}
                    />
                  </>
                )}
              </g>
            ))}

          {/* Edges first (so they go under nodes) */}
          {edges.map((e) => {
            const from = nodes.find((n) => n.id === e.from)
            const to = nodes.find((n) => n.id === e.to)
            if (!from || !to) return null
            const d = getPath(from, to)
            const color = protocolColor(e.protocol)
            const visible =
              view !== "auth-flow" || workflowStep === 0 || (e.sequence !== undefined && e.sequence <= workflowStep)
            return (
              <g key={e.id} opacity={visible ? 1 : 0.15}>
                <path
                  d={d}
                  stroke={color}
                  strokeWidth={
                    Number(
                      getComputedStyle(document.documentElement).getPropertyValue("--pn-edge-width").replace("px", ""),
                    ) || 2
                  }
                  fill="none"
                  className={e.animated && isAnimating && showDataFlow ? "animated-path" : ""}
                  markerEnd="url(#arrow)"
                  strokeDasharray={e.dashed ? "6 6" : undefined}
                />
                <text>
                  <textPath href={`#${e.id}-path`} startOffset="50%"></textPath>
                </text>
                {/* Edge label near mid */}
                <text
                  x={(from.x + from.w + to.x) / 2}
                  y={(from.y + from.h / 2 + to.y + to.h / 2) / 2 - 8}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#374151"
                >
                  {e.label}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes
            .filter((n) => n.kind !== "cluster")
            .map((n) => {
              const hovered = selectedNodeId === n.id
              return (
                <TooltipProvider key={n.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <g
                        className={`node ${hovered ? "hovered" : ""} cursor-pointer`}
                        onClick={() => setSelectedNodeId((id) => (id === n.id ? null : n.id))}
                      >
                        <rect
                          x={n.x}
                          y={n.y}
                          width={n.w}
                          height={n.h}
                          rx={10}
                          fill={n.fill}
                          opacity={0.96}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                        {/* Logo */}
                        {n.logo ? (
                          <image x={n.x + 8} y={n.y + 8} width="24" height="24" href={n.logo} />
                        ) : (
                          <text x={n.x + 20} y={n.y + 26} fontSize="18">
                            {n.icon || iconFor(n.kind)}
                          </text>
                        )}
                        {/* Title */}
                        <text
                          x={n.x + n.w / 2}
                          y={n.y + n.h / 2}
                          fontSize="13"
                          fontWeight={700}
                          textAnchor="middle"
                          fill="#0f172a"
                        >
                          {n.label}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-semibold">{n.label}</div>
                        {n.description && <div className="text-sm text-slate-600">{n.description}</div>}
                        {n.vendor && <div className="text-xs text-slate-500">Vendor: {n.vendor.toUpperCase()}</div>}
                        {n.meta && (
                          <div className="text-xs text-slate-600">
                            {Object.entries(n.meta).map(([k, v]) => (
                              <div key={k}>
                                <span className="font-medium">{k}: </span>
                                <span>{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
        </svg>
      </div>
    </div>
  )
})

export default InteractiveDiagram
export type { Props as InteractiveDiagramProps }
