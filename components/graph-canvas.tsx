"use client"

import React, { useCallback, useEffect, useRef } from "react"
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Position,
  MarkerType,
  type Edge,
  type Node,
  type OnConnect,
} from "reactflow"
import "reactflow/dist/style.css"
import ELK from "elkjs/lib/elk.bundled.js"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

export type GraphSpec = {
  view: string
  cloud: "aws" | "azure" | "gcp" | "onprem"
  wired: string
  wireless: string
  firewall: string
  mdm: "intune" | "jamf" | "kandji"
  radsec: "onprem" | "aws" | "azure" | "gcp"
  agentMode: "agent" | "agentless"
  animationSpeed: number
}

type StencilData = {
  label: string
  img: string
  tooltip: string
  vendor?: string
  meta?: Record<string, string | number>
}

const elk = new ELK()

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
}

const protocolColor = (type: string) => {
  switch (type) {
    case "radius":
      return "#00c8d7"
    case "radsec":
      return "#06b6d4"
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
}

const logos: Record<string, string> = {
  portnox: "/stencils/portnox.png",
  cisco: "/stencils/cisco.png",
  aruba: "/stencils/aruba.png",
  juniper: "/stencils/juniper.png",
  extreme: "/stencils/extreme.png",
  ruckus: "/stencils/ruckus.png",
  fortinet: "/stencils/fortinet.png",
  paloalto: "/stencils/paloalto.png",
  aws: "/stencils/aws.png",
  azure: "/stencils/azure.png",
  gcp: "/stencils/gcp.png",
  onprem: "/stencils/onprem.png",
  switch: "/stencils/switch.png",
  ap: "/stencils/ap.png",
  firewall: "/stencils/firewall.png",
  server: "/stencils/server.png",
  laptop: "/stencils/laptop.png",
  phone: "/stencils/phone.png",
  iot: "/stencils/iot.png",
  printer: "/stencils/printer.png",
  ad: "/stencils/ad.png",
  jamf: "/stencils/jamf.png",
  kandji: "/stencils/kandji.png",
  intune: "/stencils/intune.png",
}

function StencilNode({ data }: { data: StencilData }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="shadow-sm border bg-white/95 backdrop-blur-sm">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <img src={data.img || "/placeholder.svg"} alt={data.label} className="h-8 w-8 object-contain" />
                <div>
                  <div className="text-xs font-semibold">{data.label}</div>
                  {data.vendor && <div className="text-[10px] text-muted-foreground">{data.vendor}</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="text-xs">
            <div className="font-semibold mb-1">{data.label}</div>
            <div className="text-muted-foreground">{data.tooltip}</div>
            {data.meta && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {Object.entries(data.meta).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <div className="text-[10px] uppercase text-muted-foreground">{k}</div>
                    <div className="text-[10px]">{String(v)}</div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const nodeTypes = { stencil: StencilNode }

async function layout(nodes: Node[], edges: Edge[]) {
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.layered.spacing.nodeNodeBetweenLayers": "60",
      "elk.spacing.nodeNode": "40",
      "elk.edgeRouting": "ORTHOGONAL",
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: 160,
      height: 60,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  }

  const res = await elk.layout(elkGraph as any)
  const positions: Record<string, { x: number; y: number }> = {}
  res.children?.forEach((c: any) => {
    positions[c.id] = { x: c.x ?? 0, y: c.y ?? 0 }
  })

  return nodes.map((n) => ({
    ...n,
    position: positions[n.id] || n.position,
  }))
}

function buildGraph(spec: GraphSpec): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const id = (s: string) => s

  // Common core nodes
  const portnoxId = id("portnox")
  nodes.push({
    id: portnoxId,
    type: "stencil",
    data: {
      label: "Portnox Cloud",
      img: logos.portnox,
      tooltip: "Cloud-native NAC: RADIUS, Policies, Posture, Guest, IoT",
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const cloudId = id(spec.cloud)
  nodes.push({
    id: cloudId,
    type: "stencil",
    data: {
      label: `${spec.cloud.toUpperCase()} Cloud`,
      img: logos[spec.cloud],
      tooltip: "Hosting, APIs and RADSec containers",
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const wiredId = id(`wired-${spec.wired}`)
  nodes.push({
    id: wiredId,
    type: "stencil",
    data: {
      label: "Access Switch",
      img: logos.switch,
      tooltip: `802.1X Authenticator (${spec.wired})`,
      vendor: spec.wired,
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const apId = id(`ap-${spec.wireless}`)
  nodes.push({
    id: apId,
    type: "stencil",
    data: {
      label: "Wireless AP",
      img: logos.ap,
      tooltip: `802.1X Authenticator (${spec.wireless})`,
      vendor: spec.wireless,
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const fwId = id(`fw-${spec.firewall}`)
  nodes.push({
    id: fwId,
    type: "stencil",
    data: {
      label: "Next-Gen Firewall",
      img: logos.firewall,
      tooltip: `Security enforcement (${spec.firewall})`,
      vendor: spec.firewall,
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const radiusId = id("radius")
  nodes.push({
    id: radiusId,
    type: "stencil",
    data: {
      label: "Portnox RADIUS",
      img: logos.server,
      tooltip: "RADIUS/TACACS+ services and device admin",
      meta: { CoA: "UDP 3799", Ports: "1812/1813" },
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const idpId = id("idp")
  nodes.push({
    id: idpId,
    type: "stencil",
    data: {
      label: "Identity Provider",
      img: logos.ad,
      tooltip: "Azure AD / AD / LDAP / SAML",
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const mdmId = id(`mdm-${spec.mdm}`)
  nodes.push({
    id: mdmId,
    type: "stencil",
    data: {
      label: spec.mdm === "intune" ? "Microsoft Intune" : spec.mdm === "jamf" ? "Jamf Pro" : "Kandji",
      img: logos[spec.mdm],
      tooltip: "Compliance posture (agentless) and certificate workflows",
    },
    position: { x: 0, y: 0 },
    ...nodeDefaults,
  })

  const dev1 = id("dev-laptop")
  const dev2 = id("dev-phone")
  const dev3 = id("dev-iot")
  nodes.push(
    {
      id: dev1,
      type: "stencil",
      data: { label: "Corp Laptop", img: logos.laptop, tooltip: "802.1X supplicant" },
      position: { x: 0, y: 0 },
      ...nodeDefaults,
    },
    {
      id: dev2,
      type: "stencil",
      data: { label: "Mobile", img: logos.phone, tooltip: "EAP-TLS via MDM" },
      position: { x: 0, y: 0 },
      ...nodeDefaults,
    },
    {
      id: dev3,
      type: "stencil",
      data: { label: "IoT Device", img: logos.iot, tooltip: "MAC auth, profiling, VLAN assignment" },
      position: { x: 0, y: 0 },
      ...nodeDefaults,
    },
  )

  // Edges by view
  const addEdgeWith = (source: string, target: string, label: string, type: string, animated = true) => {
    const color = protocolColor(type)
    edges.push({
      id: `${source}-${target}-${label}`,
      source,
      target,
      label,
      style: { stroke: color },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      animated,
    } as Edge)
  }

  // Common connections
  addEdgeWith(dev1, wiredId, "802.1X (EAP-TLS)", "radius")
  addEdgeWith(dev2, apId, "802.1X (EAP-TLS)", "radius")
  addEdgeWith(dev3, wiredId, "MAB/Profiling", "radius")
  addEdgeWith(wiredId, radiusId, "RADIUS 1812/1813", "radius")
  addEdgeWith(apId, radiusId, "RADIUS 1812/1813", "radius")
  addEdgeWith(radiusId, idpId, "LDAP/SAML", "ldap")
  addEdgeWith(portnoxId, mdmId, "Compliance API", "https")
  addEdgeWith(cloudId, portnoxId, "API/RADSec", spec.radsec === "onprem" ? "https" : "radsec")

  // View-specific embellishments
  if (spec.view === "coa-flow") {
    addEdgeWith(radiusId, wiredId, "CoA VLAN Update", "radius")
    addEdgeWith(radiusId, apId, "CoA Session Reauth", "radius")
  }
  if (spec.view === "pki") {
    const root = "root-ca"
    const issuing = "issuing-ca"
    nodes.push(
      {
        id: root,
        type: "stencil",
        data: { label: "Root CA", img: logos.server, tooltip: "Root Certificate Authority" },
        position: { x: 0, y: 0 },
        ...nodeDefaults,
      },
      {
        id: issuing,
        type: "stencil",
        data: { label: "Issuing CA", img: logos.server, tooltip: "Issues server/device certs" },
        position: { x: 0, y: 0 },
        ...nodeDefaults,
      },
    )
    addEdgeWith(root, issuing, "Signs", "https", false)
    addEdgeWith(issuing, radiusId, "Server Cert", "https", false)
    addEdgeWith(issuing, dev1, "Client Cert", "https", false)
  }
  if (spec.view === "tacacs") {
    const tacacs = "tacacs"
    nodes.push({
      id: tacacs,
      type: "stencil",
      data: { label: "Portnox TACACS+", img: logos.server, tooltip: "Device Admin AuthN/AuthZ" },
      position: { x: 0, y: 0 },
      ...nodeDefaults,
    })
    addEdgeWith(fwId, tacacs, "TACACS+ 49", "tacacs")
    addEdgeWith(tacacs, idpId, "LDAP Bind", "ldap")
  }
  if (spec.view === "intune" || spec.view === "jamf" || spec.view === "kandji") {
    addEdgeWith(mdmId, dev1, "Profile/Cert", "https", false)
    addEdgeWith(mdmId, portnoxId, "Compliance Sync", "https", true)
  }
  if (spec.view === "onboarding-guest") {
    const portal = "guest-portal"
    nodes.push({
      id: portal,
      type: "stencil",
      data: { label: "Captive Portal", img: logos.server, tooltip: "Guest self-registration & sponsor flow" },
      position: { x: 0, y: 0 },
      ...nodeDefaults,
    })
    addEdgeWith(portal, portnoxId, "Guest Workflow", "https")
    addEdgeWith(apId, portal, "Redirect", "https")
  }
  if (spec.view === "onboarding-iot") {
    addEdgeWith(dev3, portnoxId, "Profiling (DHCP/SNMP)", "data", false)
    addEdgeWith(portnoxId, wiredId, "Policy/VLAN", "https", false)
  }

  return { nodes, edges }
}

function CanvasInner({ spec }: { spec: GraphSpec }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const rfRef = useRef<any>(null)

  const generate = useCallback(async () => {
    const g = buildGraph(spec)
    const laidOut = await layout(
      g.nodes.map((n) => ({ ...n, position: { x: 0, y: 0 } })),
      g.edges,
    )
    setNodes(laidOut)
    setEdges(g.edges)
  }, [spec, setNodes, setEdges])

  useEffect(() => {
    void generate()
  }, [generate])

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges],
  )

  const proOptions = { hideAttribution: true }

  return (
    <div className="w-full h-[720px] border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <ReactFlow
        ref={rfRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
      >
        <MiniMap nodeStrokeColor="#00c8d7" maskColor="rgba(0,0,0,0.05)" />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
      </ReactFlow>
    </div>
  )
}

export default function GraphCanvas({ spec }: { spec: GraphSpec }) {
  return (
    <ReactFlowProvider>
      <CanvasInner spec={spec} />
    </ReactFlowProvider>
  )
}
