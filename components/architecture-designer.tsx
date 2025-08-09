"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, Globe, Server, Shield, Lock, Zap, Workflow } from "lucide-react"
import GraphCanvas, { type GraphSpec } from "@/components/graph-canvas"
import { toPng, toSvg } from "html-to-image"
import type { JSX } from "react/jsx-runtime"

type ViewId =
  | "complete"
  | "auth-flow"
  | "coa-flow"
  | "pki"
  | "tacacs"
  | "intune"
  | "jamf"
  | "kandji"
  | "onboarding-guest"
  | "onboarding-iot"

const cloudProviders = [
  { id: "aws", label: "AWS" },
  { id: "azure", label: "Azure" },
  { id: "gcp", label: "GCP" },
  { id: "onprem", label: "On-Prem" },
] as const

const vendors = ["cisco", "aruba", "juniper", "extreme", "ruckus", "fortinet", "paloalto"] as const

const mdms = ["intune", "jamf", "kandji"] as const

export default function ArchitectureDesigner({ selectedSiteId }: { selectedSiteId?: string }) {
  const [view, setView] = useState<ViewId>("complete")
  const [cloud, setCloud] = useState<(typeof cloudProviders)[number]["id"]>("azure")
  const [wired, setWired] = useState<(typeof vendors)[number]>("cisco")
  const [wireless, setWireless] = useState<(typeof vendors)[number]>("aruba")
  const [firewall, setFirewall] = useState<(typeof vendors)[number]>("fortinet")
  const [mdm, setMdm] = useState<(typeof mdms)[number]>("intune")
  const [radsec, setRadsec] = useState<"onprem" | "aws" | "azure" | "gcp">("azure")
  const [agentMode, setAgentMode] = useState<"agent" | "agentless">("agentless")
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Optionally hydrate selections from the selected site
  useEffect(() => {
    if (!selectedSiteId) return
    try {
      const saved = localStorage.getItem("portnox-sites")
      if (!saved) return
      const sites = JSON.parse(saved) as any[]
      const site = sites.find((s) => s.id === selectedSiteId)
      if (!site) return
      // map some preferences
      if (site.wiredVendors?.[0]) {
        const v = (site.wiredVendors[0] as string).toLowerCase().replace(/\s+/g, "") as any
        if (vendors.includes(v)) setWired(v)
      }
      if (site.wirelessVendors?.[0]) {
        const v = (site.wirelessVendors[0] as string).toLowerCase().replace(/\s+/g, "") as any
        if (vendors.includes(v)) setWireless(v)
      }
      if (site.radsec) {
        const r = site.radsec.toLowerCase()
        if (["onprem", "aws", "azure", "gcp"].includes(r)) setRadsec(r as any)
      }
    } catch {
      // ignore
    }
  }, [selectedSiteId])

  const views: { id: ViewId; label: string; icon: JSX.Element; desc: string }[] = [
    {
      id: "complete",
      label: "Complete Architecture",
      icon: <Globe className="w-4 h-4" />,
      desc: "End-to-end multi-cloud NAC",
    },
    { id: "auth-flow", label: "Authentication Flow", icon: <Shield className="w-4 h-4" />, desc: "802.1X RADIUS flow" },
    {
      id: "coa-flow",
      label: "Change of Authorization (CoA)",
      icon: <Workflow className="w-4 h-4" />,
      desc: "CoA/VLAN update sequence",
    },
    { id: "pki", label: "PKI & Certificates", icon: <Lock className="w-4 h-4" />, desc: "Root/Issuing CAs and certs" },
    { id: "tacacs", label: "TACACS+ Admin", icon: <Server className="w-4 h-4" />, desc: "Device admin auth" },
    { id: "intune", label: "Microsoft Intune", icon: <Zap className="w-4 h-4" />, desc: "Compliance-driven access" },
    { id: "jamf", label: "Jamf Pro", icon: <Zap className="w-4 h-4" />, desc: "macOS compliance and certs" },
    { id: "kandji", label: "Kandji", icon: <Zap className="w-4 h-4" />, desc: "Apple device mgmt" },
    {
      id: "onboarding-guest",
      label: "Guest/Captive Portal",
      icon: <Globe className="w-4 h-4" />,
      desc: "Sponsored guest onboarding",
    },
    {
      id: "onboarding-iot",
      label: "IoT Profiling",
      icon: <Globe className="w-4 h-4" />,
      desc: "IoT identification/onboarding",
    },
  ]

  const spec: GraphSpec = useMemo(
    () => ({
      view,
      cloud,
      wired,
      wireless,
      firewall,
      mdm,
      radsec,
      agentMode,
      animationSpeed,
    }),
    [view, cloud, wired, wireless, firewall, mdm, radsec, agentMode, animationSpeed],
  )

  const exportPNG = async () => {
    if (!containerRef.current) return
    const node = containerRef.current
    const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: "white" })
    const link = document.createElement("a")
    link.download = `portnox-${view}-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }

  const exportSVG = async () => {
    if (!containerRef.current) return
    const node = containerRef.current
    const dataUrl = await toSvg(node, { cacheBust: true, backgroundColor: "white" })
    const link = document.createElement("a")
    link.download = `portnox-${view}-${Date.now()}.svg`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {views.find((v) => v.id === view)?.icon}
            <span>Architecture Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>View</Label>
              <Select value={view} onValueChange={(v) => setView(v as ViewId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {views.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-2">
                        {v.icon}
                        <span>{v.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cloud</Label>
              <Select value={cloud} onValueChange={(v) => setCloud(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cloud" />
                </SelectTrigger>
                <SelectContent>
                  {cloudProviders.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wired</Label>
              <Select value={wired} onValueChange={(v) => setWired(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wired Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wireless</Label>
              <Select value={wireless} onValueChange={(v) => setWireless(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wireless Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Firewall</Label>
              <Select value={firewall} onValueChange={(v) => setFirewall(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Firewall Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>MDM</Label>
              <Select value={mdm} onValueChange={(v) => setMdm(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="MDM" />
                </SelectTrigger>
                <SelectContent>
                  {mdms.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>RADSec</Label>
              <Select value={radsec} onValueChange={(v) => setRadsec(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="RADSec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onprem">On-Prem</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="gcp">GCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agent Mode</Label>
              <Select value={agentMode} onValueChange={(v) => setAgentMode(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Agent Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agentless">Agentless (MDM Compliance)</SelectItem>
                  <SelectItem value="agent">Portnox Agent (Risk/Policy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Animation Speed: {animationSpeed.toFixed(1)}x</Label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(v) => setAnimationSpeed(v[0])}
                min={0.5}
                max={3}
                step={0.5}
              />
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button variant="outline" onClick={exportSVG}>
                <Download className="w-4 h-4 mr-2" />
                Export SVG
              </Button>
              <Button variant="outline" onClick={exportPNG}>
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Cloud: {cloud}</Badge>
            <Badge variant="outline">Wired: {wired}</Badge>
            <Badge variant="outline">Wireless: {wireless}</Badge>
            <Badge variant="outline">Firewall: {firewall}</Badge>
            <Badge variant="outline">MDM: {mdm}</Badge>
            <Badge variant="outline">RADSec: {radsec}</Badge>
            <Badge variant="outline">Mode: {agentMode}</Badge>
          </div>
        </CardContent>
      </Card>

      <div ref={containerRef}>
        <GraphCanvas spec={spec} />
      </div>
    </div>
  )
}
