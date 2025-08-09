"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Network, Shield, Cloud, Key, Settings, Workflow, Smartphone, Download, Wifi } from "lucide-react"
import InteractiveDiagram from "@/components/interactive-diagram"
import ArchitectureLegend from "@/components/architecture-legend"

type ViewId =
  | "complete-architecture"
  | "zero-trust-nac"
  | "802.1x-auth"
  | "pki-infrastructure"
  | "access-control-policies"
  | "connectivity-options"
  | "multi-cloud"
  | "intune-integration"
  | "device-onboarding"
  | "fortigate-tacacs"
  | "paloalto-tacacs"
  | "cisco-tacacs"
  | "aruba-tacacs"
  | "juniper-tacacs"
  | "meraki-wireless"
  | "mist-wireless"

export default function ArchitectureDesigner() {
  const [selectedView, setSelectedView] = useState<ViewId>("complete-architecture")
  const [selectedVendor, setSelectedVendor] = useState("cisco")
  const [selectedConnectivity, setSelectedConnectivity] = useState("direct")
  const [selectedIdentity, setSelectedIdentity] = useState("azure-ad")
  const [selectedDeployment, setSelectedDeployment] = useState("cloud")

  const architectureViews = useMemo(
    () => [
      // Core
      {
        id: "complete-architecture",
        name: "Complete Architecture",
        description: "Full end-to-end Portnox NAC deployment with identity, MDM, PKI, and logging",
        icon: <Shield className="h-4 w-4" />,
        category: "core" as const,
      },
      {
        id: "zero-trust-nac",
        name: "Zero Trust NAC",
        description: "Core Zero Trust NAC building blocks",
        icon: <Shield className="h-4 w-4" />,
        category: "core" as const,
      },
      {
        id: "802.1x-auth",
        name: "802.1X Authentication Flow",
        description: "EAP-TLS certificate-based flow with CoA",
        icon: <Key className="h-4 w-4" />,
        category: "core" as const,
      },
      {
        id: "pki-infrastructure",
        name: "PKI & Certificates",
        description: "Root/Issuing CA, server and client certificates, CRL/OCSP",
        icon: <LockIcon className="h-4 w-4" />,
        category: "core" as const,
      },
      {
        id: "multi-cloud",
        name: "Multi-Cloud",
        description: "Deploy across AWS, Azure, and GCP",
        icon: <Cloud className="h-4 w-4" />,
        category: "core" as const,
      },
      // Policy
      {
        id: "access-control-policies",
        name: "Access Control Policies",
        description: "Policy engine, contexts, and outcomes (VLAN/ACL/Tags)",
        icon: <Settings className="h-4 w-4" />,
        category: "policy" as const,
      },
      // Connectivity
      {
        id: "connectivity-options",
        name: "Connectivity Options",
        description: "Direct RADIUS, RADSec, VPN overlays, and Private Link",
        icon: <Network className="h-4 w-4" />,
        category: "connectivity" as const,
      },
      // Integration
      {
        id: "intune-integration",
        name: "Intune Integration",
        description: "MDM enrollment, compliance, and SCEP",
        icon: <Smartphone className="h-4 w-4" />,
        category: "integration" as const,
      },
      // Workflow
      {
        id: "device-onboarding",
        name: "Device Onboarding",
        description: "Corporate, BYOD, Guest, and IoT onboarding tracks",
        icon: <Workflow className="h-4 w-4" />,
        category: "workflow" as const,
      },
      // Vendor TACACS+ (existing)
      {
        id: "fortigate-tacacs",
        name: "FortiGate TACACS+",
        description: "Admin AAA with Portnox TACACS+ and AD",
        icon: <Shield className="h-4 w-4" />,
        category: "vendor" as const,
      },
      {
        id: "paloalto-tacacs",
        name: "Palo Alto TACACS+",
        description: "Admin AAA with Portnox TACACS+ and AD",
        icon: <Shield className="h-4 w-4" />,
        category: "vendor" as const,
      },
      // New Vendor TACACS+
      {
        id: "cisco-tacacs",
        name: "Cisco TACACS+",
        description: "Cisco switches/routers/WLC using Portnox TACACS+ and AD",
        icon: <Shield className="h-4 w-4" />,
        category: "vendor" as const,
      },
      {
        id: "aruba-tacacs",
        name: "Aruba TACACS+",
        description: "Aruba CX/Mobile Controller with Portnox TACACS+ and AD",
        icon: <Shield className="h-4 w-4" />,
        category: "vendor" as const,
      },
      {
        id: "juniper-tacacs",
        name: "Juniper TACACS+",
        description: "Junos-based devices using Portnox TACACS+ and AD",
        icon: <Shield className="h-4 w-4" />,
        category: "vendor" as const,
      },
      // New Wireless deep-dives
      {
        id: "meraki-wireless",
        name: "Meraki Wireless",
        description: "MR with EAP‑TLS to Portnox; Dashboard policy mapping",
        icon: <Wifi className="h-4 w-4" />,
        category: "wireless" as const,
      },
      {
        id: "mist-wireless",
        name: "Mist Wireless",
        description: "Juniper Mist APs with cloud auth path to Portnox",
        icon: <Wifi className="h-4 w-4" />,
        category: "wireless" as const,
      },
    ],
    [],
  )

  const networkVendors = [
    { id: "cisco", name: "Cisco" },
    { id: "aruba", name: "Aruba" },
    { id: "juniper", name: "Juniper" },
    { id: "extreme", name: "Extreme" },
    { id: "fortinet", name: "Fortinet" },
    { id: "paloalto", name: "Palo Alto" },
    { id: "meraki", name: "Cisco Meraki" },
    { id: "mist", name: "Juniper Mist" },
    { id: "ubiquiti", name: "Ubiquiti" },
    { id: "mikrotik", name: "MikroTik" },
    { id: "cambium", name: "Cambium" },
    { id: "ruckus", name: "Ruckus" },
  ]

  const connectivityOptions = [
    { id: "direct", name: "Direct RADIUS" },
    { id: "radsec", name: "RADSec Proxy" },
    { id: "hybrid", name: "Hybrid" },
    { id: "sdwan", name: "SD-WAN/VPN" },
  ]

  const identityProviders = [
    { id: "azure-ad", name: "Azure AD / Entra ID" },
    { id: "active-directory", name: "Active Directory" },
    { id: "okta", name: "Okta" },
    { id: "ping", name: "Ping Identity" },
  ]

  const deployments = [
    { id: "cloud", name: "Cloud" },
    { id: "hybrid", name: "Hybrid" },
    { id: "edge", name: "Edge" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            <span>Portnox NAC Architecture Designer</span>
          </CardTitle>
          <CardDescription>Select a view, vendor, connectivity, and identity to render the diagram.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Architecture View</label>
              <Select value={selectedView} onValueChange={(v) => setSelectedView(v as ViewId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <Section title="Core">
                    {architectureViews
                      .filter((v) => v.category === "core")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Policy">
                    {architectureViews
                      .filter((v) => v.category === "policy")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Connectivity">
                    {architectureViews
                      .filter((v) => v.category === "connectivity")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Integration">
                    {architectureViews
                      .filter((v) => v.category === "integration")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Workflow">
                    {architectureViews
                      .filter((v) => v.category === "workflow")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Wireless (Deep-Dive)">
                    {architectureViews
                      .filter((v) => v.category === "wireless")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                  <Separator className="my-1" />
                  <Section title="Vendor TACACS+">
                    {architectureViews
                      .filter((v) => v.category === "vendor")
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span>{v.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </Section>
                </SelectContent>
              </Select>
            </div>

            <Field label="Network Vendor">
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {networkVendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Connectivity">
              <Select value={selectedConnectivity} onValueChange={setSelectedConnectivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connectivity" />
                </SelectTrigger>
                <SelectContent>
                  {connectivityOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Identity Provider">
              <Select value={selectedIdentity} onValueChange={setSelectedIdentity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select identity" />
                </SelectTrigger>
                <SelectContent>
                  {identityProviders.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Deployment">
              <Select value={selectedDeployment} onValueChange={setSelectedDeployment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deployment" />
                </SelectTrigger>
                <SelectContent>
                  {deployments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Current selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-blue-700" />
              <span className="font-semibold text-blue-900">
                {architectureViews.find((v) => v.id === selectedView)?.name}
              </span>
            </div>
            <p className="text-blue-800 text-sm">{architectureViews.find((v) => v.id === selectedView)?.description}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant="secondary">{networkVendors.find((v) => v.id === selectedVendor)?.name}</Badge>
              <Badge variant="secondary">{connectivityOptions.find((c) => c.id === selectedConnectivity)?.name}</Badge>
              <Badge variant="secondary">{identityProviders.find((i) => i.id === selectedIdentity)?.name}</Badge>
              <Badge variant="secondary">{deployments.find((d) => d.id === selectedDeployment)?.name}</Badge>
            </div>
          </div>

          {/* Exports (hooks/placeholders) */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("Export (PNG) coming soon")}>
              <Download className="h-4 w-4 mr-1" /> PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert("Export (SVG) coming soon")}>
              <Download className="h-4 w-4 mr-1" /> SVG
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert("Export (PDF) coming soon")}>
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagram */}
      <Card>
        <CardContent className="p-4">
          <InteractiveDiagram
            view={selectedView}
            vendor={selectedVendor}
            connectivity={selectedConnectivity}
            identity={selectedIdentity}
            deployment={selectedDeployment}
          />
        </CardContent>
      </Card>

      {/* Legend */}
      <ArchitectureLegend currentView={selectedView} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-1">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{title}</div>
      {children}
    </div>
  )
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h8V8a4 4 0 1 0-8 0v2z"
      />
    </svg>
  )
}
