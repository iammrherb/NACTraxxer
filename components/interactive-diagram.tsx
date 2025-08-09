"use client"

import "reactflow/dist/style.css"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useEdgesState,
  useNodesState,
  addEdge,
  MarkerType,
  Position,
  ConnectionLineType,
  type EdgeProps,
  type NodeProps,
  getSmoothStepPath,
  useReactFlow,
} from "reactflow"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, ExternalLink } from "lucide-react"

// ELK for auto layout (bundled works in browser)
import ELK from "elkjs/lib/elk.bundled.js"

type ViewId =
  | "zero-trust-nac"
  | "802.1x-auth"
  | "pki-infrastructure"
  | "multi-cloud"
  | "intune-integration"
  | "device-onboarding"
  | "fortigate-tacacs"
  | "paloalto-tacacs"

type EdgeKind = "radius" | "https" | "ldap" | "syslog" | "tacacs" | "data"

interface InteractiveDiagramProps {
  view: string
  vendor: string
  connectivity: string
  identity: string
  deployment: string
}

type StencilData = {
  label: string
  imageUrl?: string
  description?: string
  color?: string
}

type Meta = {
  ports?: string
  ciphers?: string
  certValidity?: string
  referenceUrls?: { label: string; href: string }[]
}

const stencil = (query: string, w = 32, h = 32) =>
  `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(query)}`

const vendorStencil = (v: string) => {
  switch (v) {
    case "cisco":
      return stencil("Cisco logo")
    case "aruba":
      return stencil("Aruba HPE logo")
    case "juniper":
      return stencil("Juniper logo")
    case "extreme":
      return stencil("Extreme Networks logo")
    case "fortinet":
      return stencil("Fortinet logo")
    case "paloalto":
      return stencil("Palo Alto Networks logo")
    case "meraki":
      return stencil("Cisco Meraki logo")
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
      return stencil("AWS logo")
    case "azure":
      return stencil("Azure logo")
    case "gcp":
      return stencil("GCP logo")
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

const colorFor = (kind: string) => {
  switch (kind) {
    case "endpoint":
      return "#e0e7ff"
    case "network":
    case "wireless":
      return "#d1fae5"
    case "nac":
      return "#ccfbf1"
    case "identity":
      return "#dbeafe"
    case "mdm":
      return "#fef3c7"
    case "firewall":
      return "#fee2e2"
    case "policy":
      return "#fde68a"
    case "cloud":
      return "#e0f2fe"
    case "portal":
      return "#e9d5ff"
    case "workflow":
      return "#d1fae5"
    case "connectivity":
      return "#f3e8ff"
    default:
      return "#ffffff"
  }
}

const defaultMetaFor = (kind: EdgeKind, label?: string): Meta => {
  const refs = [
    { label: "Portnox Zero Trust", href: "https://docs.portnox.com/topics/zero_trust" },
    { label: "Microsoft Zero Trust", href: "https://learn.microsoft.com/security/zero-trust/" },
  ]
  switch (kind) {
    case "radius": {
      const isCoA = /coa|session|reauth/i.test(label || "")
      return {
        ports: isCoA ? "UDP 3799 (CoA)" : "UDP 1812 (Auth), 1813 (Acct)",
        ciphers: /eap[-\s]?tls/i.test(label || "") ? "EAP‑TLS (TLS 1.2/1.3)" : "EAP per policy",
        certValidity: /eap[-\s]?tls/i.test(label || "")
          ? "Client: ~365d, Server: ~398d (example)"
          : "Server: ~398d (example)",
        referenceUrls: isCoA
          ? [{ label: "RADIUS CoA", href: "https://docs.portnox.com/topics/radius_coa" }, ...refs]
          : refs,
      }
    }
    case "https":
      return {
        ports: "TCP 443",
        ciphers: "TLS 1.2/1.3 (AES‑GCM)",
        certValidity: "Server cert e.g., 398 days",
        referenceUrls: refs,
      }
    case "ldap":
      return {
        ports: "TCP 389 (STARTTLS) / 636 (LDAPS)",
        ciphers: "STARTTLS/LDAPS (TLS 1.2/1.3)",
        certValidity: "Server cert via CA policy",
        referenceUrls: refs,
      }
    case "tacacs":
      return { ports: "TCP 49", ciphers: "Per-session encryption", certValidity: "N/A", referenceUrls: refs }
    case "syslog":
      return { ports: "UDP 514 / TCP 6514 (TLS)", ciphers: "TLS if TCP 6514", certValidity: "N/A", referenceUrls: refs }
    case "data":
    default:
      return { ports: "—", ciphers: "—", certValidity: "N/A", referenceUrls: refs }
  }
}

// Custom HTML node (React Flow nodes render as HTML)
function StencilNode({ data, selected }: NodeProps<StencilData>) {
  const fill = data.color || "#fff"
  return (
    <div
      className="rounded-lg border shadow-sm px-3 py-2 flex items-center gap-2 min-w-[180px]"
      style={{ background: fill, borderColor: selected ? "#3b82f6" : "#e5e7eb" }}
    >
      {data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.imageUrl || "/placeholder.svg"} alt={data.label} width={28} height={28} className="rounded" />
      ) : null}
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate">{data.label}</div>
        {data.description ? <div className="text-[10px] text-slate-600 truncate">{data.description}</div> : null}
      </div>
    </div>
  )
}

// Custom SVG edge
function PortnoxEdge(
  props: EdgeProps<{
    label?: string
    kind?: EdgeKind
    meta?: Meta
  }>,
) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, id, markerEnd } = props
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    borderRadius: 8,
    sourcePosition: sourcePosition || Position.Right,
    targetPosition: targetPosition || Position.Left,
  })

  const d = Math.hypot(sourceX - targetX, sourceY - targetY)
  let latency = Math.max(2, Math.round(d / 18))
  switch (data?.kind) {
    case "https":
      latency += 8
      break
    case "ldap":
      latency += 5
      break
    case "tacacs":
      latency += 4
      break
    case "syslog":
      latency += 1
      break
  }

  const stroke = (() => {
    switch (data?.kind) {
      case "radius":
        return "#00c8d7"
      case "https":
        return "#059669"
      case "ldap":
        return "#0078D4"
      case "syslog":
        return "#7C3AED"
      case "tacacs":
        return "#DC2626"
      default:
        return "#6B7280"
    }
  })()

  const meta = { ...defaultMetaFor(data?.kind || "data", data?.label), ...(data?.meta || {}) }

  return (
    <g>
      {/* Transparent wide stroke to ease hover */}
      <path d={path} stroke="transparent" strokeWidth={14} fill="none" />

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g className="cursor-pointer">
              <path
                id={`p-${id}`}
                d={path}
                stroke={stroke}
                strokeWidth={2}
                fill="none"
                className="animated-path"
                markerEnd={undefined}
              />
              {/* Use React Flow markerEnd (ArrowClosed) via edge option, not a custom SVG marker */}
              {markerEnd ? <path d={path} stroke="transparent" fill="none" markerEnd={markerEnd as any} /> : null}
              {data?.label && (
                <text x={labelX} y={labelY - 2} textAnchor="middle" fontSize={11} fill="#374151">
                  {data.label}
                </text>
              )}
            </g>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="text-xs space-y-1">
              <div className="font-semibold">{data?.label || "Connection"}</div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-1">
                <div className="text-[10px] uppercase text-muted-foreground">Protocol</div>
                <div className="col-span-2">{(data?.kind || "data").toUpperCase()}</div>

                <div className="text-[10px] uppercase text-muted-foreground">Ports</div>
                <div className="col-span-2">{meta.ports}</div>

                <div className="text-[10px] uppercase text-muted-foreground">Ciphers</div>
                <div className="col-span-2">{meta.ciphers}</div>

                <div className="text-[10px] uppercase text-muted-foreground">Cert Validity</div>
                <div className="col-span-2">{meta.certValidity}</div>

                <div className="text-[10px] uppercase text-muted-foreground">Latency</div>
                <div className="col-span-2">{latency} ms (approx)</div>
              </div>
              {meta.referenceUrls && (
                <div className="pt-2 border-t mt-2">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">References</div>
                  <ul className="space-y-1">
                    {meta.referenceUrls.map((r) => (
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
    </g>
  )
}

const nodeTypes = { stencil: StencilNode }
const edgeTypes = { portnox: PortnoxEdge }

function buildGraph(view: ViewId, vendor: string, connectivity: string, identity: string, deployment: string) {
  const N = (id: string, label: string, kind: string, opts?: Partial<StencilData>) =>
    ({
      id,
      type: "stencil",
      data: {
        label,
        description: opts?.description,
        imageUrl: opts?.imageUrl,
        color: opts?.color || colorFor(kind),
      },
      position: { x: 0, y: 0 },
      width: 180,
      height: 70,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }) as Node<StencilData>

  const E = (id: string, from: string, to: string, label: string, kind: EdgeKind, meta?: Meta) =>
    ({
      id,
      source: from,
      target: to,
      type: "portnox",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6B7280" },
      data: { label, kind, meta },
    }) as Edge

  const nodes: Node[] = []
  const edges: Edge[] = []

  if (view === "zero-trust-nac") {
    nodes.push(
      N("endpoints", "Corporate Endpoints", "endpoint", {
        description: "Windows, macOS, iOS, Android, IoT",
        imageUrl: stencil("Laptop and phone"),
      }),
      N("switch", `${vendor.toUpperCase()} Switch`, "network", {
        description: "802.1X Authenticator (Wired)",
        imageUrl: vendorStencil(vendor),
      }),
      N("ap", `${vendor.toUpperCase()} Wireless`, "wireless", {
        description: "802.1X Authenticator (Wireless)",
        imageUrl: vendorStencil(vendor),
      }),
      N("proxy", connectivity === "radsec" || connectivity === "hybrid" ? "RADSec Proxy" : "Direct RADIUS", "cloud", {
        description: "Secure RADIUS transport",
        imageUrl: stencil("RADSec proxy"),
      }),
      N("portnox", "Portnox Cloud RADIUS", "nac", {
        description: "Policy decision & AAA",
        imageUrl: stencil("Portnox"),
      }),
      N("idp", identity === "active-directory" ? "Active Directory" : "Entra ID", "identity", {
        description: "User identity & SSO",
        imageUrl: idpStencil(identity),
      }),
      N("mdm", "MDM (Intune/Jamf/Kandji)", "mdm", {
        description: "Compliance & certificates",
        imageUrl: mdmStencil("Intune"),
      }),
      N("fw", "Next-Gen Firewall", "firewall", { description: "Segmentation & policy", imageUrl: stencil("Firewall") }),
    )
    const viaProxy = connectivity === "radsec" || connectivity === "hybrid"
    edges.push(
      E("ep-switch", "endpoints", "switch", "802.1X (EAP‑TLS)", "radius"),
      E("ep-ap", "endpoints", "ap", "802.1X (EAP‑TLS)", "radius"),
      E("switch-portnox", "switch", viaProxy ? "proxy" : "portnox", viaProxy ? "RADIUS → RADSec" : "RADIUS", "radius"),
      E("ap-portnox", "ap", viaProxy ? "proxy" : "portnox", viaProxy ? "RADIUS → RADSec" : "RADIUS", "radius"),
      ...(viaProxy ? [E("proxy-portnox", "proxy", "portnox", "RADSec", "radius")] : []),
      E(
        "portnox-idp",
        "portnox",
        "idp",
        identity === "active-directory" ? "LDAP/LDAPS" : "SAML/OIDC",
        identity === "active-directory" ? "ldap" : "https",
      ),
      E("mdm-portnox", "mdm", "portnox", "Compliance API", "https"),
      E("portnox-fw", "portnox", "fw", "User-ID/FSSO/Syslog", "syslog"),
    )
  } else if (view === "802.1x-auth") {
    nodes.push(
      N("device", "Device", "endpoint", { description: "Supplicant with cert", imageUrl: stencil("Laptop device") }),
      N("authenticator", "Authenticator (Switch/AP)", "network", {
        description: "802.1X authenticator",
        imageUrl: vendorStencil(vendor),
      }),
      N("portnox", "Portnox RADIUS", "nac", { description: "EAP‑TLS termination", imageUrl: stencil("Portnox") }),
      N("idp", identity === "active-directory" ? "Active Directory" : "Entra ID", "identity", {
        description: "User identity",
        imageUrl: idpStencil(identity),
      }),
      N("policy", "Policy Engine", "policy", { description: "Decision & context", imageUrl: stencil("Policy gear") }),
    )
    const viaProxy = connectivity === "radsec"
    if (viaProxy) {
      nodes.push(
        N("proxy", "RADSec Proxy", "cloud", { description: "Secure RADIUS", imageUrl: stencil("RADSec proxy") }),
      )
    }
    const edgeAuthTo = viaProxy ? "proxy" : "portnox"
    edges.push(
      E("dev-auth", "device", "authenticator", "EAPOL/EAP", "radius"),
      E("auth-radius", "authenticator", edgeAuthTo, "RADIUS", "radius"),
      ...(viaProxy ? [E("proxy-portnox", "proxy", "portnox", "RADSec", "radius")] : []),
      E(
        "portnox-idp",
        "portnox",
        "idp",
        identity === "active-directory" ? "LDAPS" : "SAML/OIDC",
        identity === "active-directory" ? "ldap" : "https",
      ),
      E("portnox-policy", "portnox", "policy", "Policy", "data"),
      E("coa", "portnox", "authenticator", "CoA (Session-Update)", "radius", { ports: "UDP 3799 (CoA)" }),
    )
  } else if (view === "pki-infrastructure") {
    nodes.push(
      N("root", "Root CA", "policy", { description: "Offline root CA", imageUrl: stencil("Root CA") }),
      N("issuing", "Issuing CA", "policy", { description: "Device/User certs", imageUrl: stencil("Issuing CA") }),
      N("servercert", "RADIUS Server Cert", "nac", {
        description: "TLS server auth",
        imageUrl: stencil("Server cert"),
      }),
      N("clientcerts", "Device/User Certs", "endpoint", {
        description: "EAP‑TLS client auth",
        imageUrl: stencil("Client cert"),
      }),
      N("crl", "CRL / OCSP", "cloud", { description: "Revocation checking", imageUrl: stencil("CRL OCSP") }),
    )
    edges.push(
      E("root-issuing", "root", "issuing", "Signs", "data"),
      E("issuing-server", "issuing", "servercert", "Issues", "data"),
      E("issuing-client", "issuing", "clientcerts", "Issues", "data"),
      E("issuing-crl", "issuing", "crl", "Publishes", "https"),
    )
  } else if (view === "multi-cloud") {
    const provider = deployment === "cloud" ? (identity === "azure-ad" ? "azure" : "aws") : "gcp"
    nodes.push(
      N("branch", "Branch Site", "portal", { description: "Remote branch", imageUrl: stencil("Office building") }),
      N("edge", "Edge/SD‑WAN", "connectivity", { description: "Connectivity hub", imageUrl: stencil("SD‑WAN edge") }),
      N("cloud", `${provider.toUpperCase()} Cloud`, "cloud", {
        description: "Selected cloud",
        imageUrl: cloudStencil(provider),
      }),
      N("portnox", "Portnox Cloud", "nac", { description: "Cloud NAC", imageUrl: stencil("Portnox") }),
    )
    edges.push(
      E("branch-edge", "branch", "edge", "IPSec/SD‑WAN", "data"),
      E("edge-cloud", "edge", "cloud", "Private Link", "https"),
      E("cloud-portnox", "cloud", "portnox", "API/RADIUS", "https"),
    )
  } else if (view === "intune-integration") {
    nodes.push(
      N("devices", "Managed Devices", "endpoint", {
        description: "Intune-managed",
        imageUrl: stencil("Managed devices"),
      }),
      N("intune", "Microsoft Intune", "mdm", { description: "MDM policies, SCEP", imageUrl: mdmStencil("Intune") }),
      N("entra", "Entra ID", "identity", { description: "User identity", imageUrl: idpStencil("azure-ad") }),
      N("portnox", "Portnox Cloud", "nac", { description: "Compliance & AAA", imageUrl: stencil("Portnox") }),
      N("compliance", "Compliance Engine", "policy", {
        description: "Risk assessment",
        imageUrl: stencil("Compliance"),
      }),
    )
    edges.push(
      E("dev-intune", "devices", "intune", "MDM Enrollment", "https"),
      E("intune-pnx", "intune", "portnox", "Compliance API", "https"),
      E("entra-pnx", "entra", "portnox", "Auth/SAML/OIDC", "https"),
      E("pnx-comp", "portnox", "compliance", "Policy Eval", "data"),
    )
  } else if (view === "device-onboarding") {
    nodes.push(
      N("portal", "Onboarding Portal", "portal", {
        description: "Self-service onboarding",
        imageUrl: stencil("Portal"),
      }),
      N("corp", "Corporate (EAP‑TLS)", "workflow", {
        description: "User/machine certs",
        imageUrl: stencil("Corporate"),
      }),
      N("byod", "BYOD / Mobile", "workflow", { description: "Captive portal / PSK", imageUrl: stencil("BYOD") }),
      N("guest", "Guest Access", "workflow", { description: "Sponsored guest", imageUrl: stencil("Guest") }),
      N("iot", "IoT & Profiling", "workflow", { description: "Profiling & MAB", imageUrl: stencil("IoT") }),
    )
    edges.push(
      E("p-corp", "portal", "corp", "Initiates", "data"),
      E("p-byod", "portal", "byod", "Initiates", "data"),
      E("p-guest", "portal", "guest", "Initiates", "data"),
      E("p-iot", "portal", "iot", "Initiates", "data"),
    )
  } else if (view === "fortigate-tacacs") {
    nodes.push(
      N("admin", "Network Admin", "endpoint", { description: "SSH/HTTPS to device", imageUrl: stencil("Admin user") }),
      N("fg", "FortiGate", "firewall", { description: "Device admin", imageUrl: vendorStencil("fortinet") }),
      N("tacacs", "Portnox TACACS+", "nac", { description: "AAA for admin", imageUrl: stencil("Portnox") }),
      N("ad", "Active Directory", "identity", { description: "RBAC groups", imageUrl: idpStencil("active-directory") }),
    )
    edges.push(
      E("adm-fg", "admin", "fg", "SSH/HTTPS", "https"),
      E("fg-tacacs", "fg", "tacacs", "TACACS+", "tacacs"),
      E("tacacs-ad", "tacacs", "ad", "LDAP/LDAPS", "ldap"),
    )
  } else if (view === "paloalto-tacacs") {
    nodes.push(
      N("admin", "Network Admin", "endpoint", { description: "SSH/HTTPS to device", imageUrl: stencil("Admin user") }),
      N("pan", "Palo Alto NGFW", "firewall", { description: "Device admin", imageUrl: vendorStencil("paloalto") }),
      N("panorama", "Panorama", "policy", { description: "Central management", imageUrl: vendorStencil("paloalto") }),
      N("tacacs", "Portnox TACACS+", "nac", { description: "AAA for admin", imageUrl: stencil("Portnox") }),
      N("ad", "Active Directory", "identity", { description: "RBAC groups", imageUrl: idpStencil("active-directory") }),
    )
    edges.push(
      E("adm-pan", "admin", "pan", "SSH/HTTPS", "https"),
      E("pan-panorama", "pan", "panorama", "Mgmt", "https"),
      E("pan-tacacs", "pan", "tacacs", "TACACS+", "tacacs"),
      E("pano-tacacs", "panorama", "tacacs", "TACACS+", "tacacs"),
      E("tacacs-ad", "tacacs", "ad", "LDAP/LDAPS", "ldap"),
    )
  } else {
    nodes.push(N("portnox", "Portnox Cloud", "nac", { description: "Cloud NAC", imageUrl: stencil("Portnox") }))
  }

  return { nodes, edges }
}

const elk = new ELK()
async function layoutWithElk(nodes: Node[], edges: Edge[]) {
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.layered.spacing.nodeNodeBetweenLayers": "60",
      "elk.spacing.nodeNode": "40",
      "elk.layered.mergeEdges": "true",
      "elk.routing": "ORTHOGONAL",
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.width || 180,
      height: n.height || 70,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  }

  const res = await elk.layout(elkGraph as any)

  const layoutedNodes = nodes.map((n) => {
    const l = (res.children || []).find((c: any) => c.id === n.id)
    return {
      ...n,
      position: { x: l?.x || 0, y: l?.y || 0 },
    }
  })

  return { nodes: layoutedNodes, edges }
}

export default function InteractiveDiagram({
  view,
  vendor,
  connectivity,
  identity,
  deployment,
}: InteractiveDiagramProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [viewport, setViewportState] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 })

  const { setViewport } = useReactFlow()

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<StencilData>([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const v = (view as ViewId) || "zero-trust-nac"
    const { nodes, edges } = buildGraph(v, vendor, connectivity, identity, deployment)
    layoutWithElk(nodes, edges).then(({ nodes: ln, edges: le }) => {
      setRfNodes(
        ln.map((n) => ({
          ...n,
          draggable: true,
          type: "stencil",
        })),
      )
      setRfEdges(
        le.map((e) => ({
          ...e,
          type: "portnox",
        })),
      )
    })
  }, [view, vendor, connectivity, identity, deployment, setRfNodes, setRfEdges])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--pnx-anim-duration", `2s`)
  }, [])

  const onConnect = useCallback(
    (params: any) =>
      setRfEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "portnox",
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds,
        ),
      ),
    [setRfEdges],
  )

  const handleZoomIn = () => {
    const newZoom = Math.min(3, viewport.zoom * 1.2)
    setViewport({ ...viewport, zoom: newZoom })
    setZoom(newZoom)
  }
  const handleZoomOut = () => {
    const newZoom = Math.max(0.5, viewport.zoom / 1.2)
    setViewport({ ...viewport, zoom: newZoom })
    setZoom(newZoom)
  }
  const handleReset = () => {
    const v = (view as ViewId) || "zero-trust-nac"
    const { nodes, edges } = buildGraph(v, vendor, connectivity, identity, deployment)
    layoutWithElk(nodes, edges).then(({ nodes: ln, edges: le }) => {
      setRfNodes(ln.map((n) => ({ ...n, draggable: true, type: "stencil" })))
      setRfEdges(le.map((e) => ({ ...e, type: "portnox" })))
      setViewport({ x: 0, y: 0, zoom: 1 })
      setZoom(1)
      setViewportState({ x: 0, y: 0, zoom: 1 })
    })
  }

  return (
    <div className="relative">
      {/* Animation CSS (global for this component subtree) */}
      <style>{`
        .animated-path {
          stroke-dasharray: 10 6;
          animation: pnx-dash var(--pnx-anim-duration, 2s) linear infinite;
          animation-play-state: ${isAnimating ? "running" : "paused"};
        }
        @keyframes pnx-dash {
          to { stroke-dashoffset: -16; }
        }
      `}</style>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm"
          onClick={() => setIsAnimating((p) => !p)}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <Badge variant="outline">{Math.round(zoom * 100)}%</Badge>
      </div>

      <div className="h-[700px] border rounded-lg overflow-hidden bg-white">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: "portnox",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          snapToGrid
          snapGrid={[12, 12]}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          onMove={(_, vp) => {
            if (vp) {
              setViewportState(vp)
              setZoom(vp.zoom)
            }
          }}
        >
          <MiniMap pannable zoomable />
          <Controls />
          <Background variant="dots" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
