"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const nodeKinds = [
  { name: "Endpoints", color: "#e0e7ff", description: "Laptops, mobiles, IoT" },
  { name: "Network/Wireless", color: "#d1fae5", description: "Switches/APs (802.1X)" },
  { name: "Portnox (NAC/TACACS+)", color: "#ccfbf1", description: "AAA, policies, posture" },
  { name: "Identity Provider", color: "#dbeafe", description: "AD/Entra/Okta/Ping" },
  { name: "MDM", color: "#fef3c7", description: "Intune, Jamf, Kandji" },
  { name: "Firewall", color: "#fee2e2", description: "Segmentation, User-ID/Tags" },
  { name: "PKI/Certificates", color: "#fff1f2", description: "Root/Issuing CA, CRL/OCSP" },
  { name: "Connectivity", color: "#f3e8ff", description: "RADSec, VPN, Private Link" },
  { name: "Portal/Workflow", color: "#e9d5ff", description: "Onboarding flows" },
]

const edgeKinds = [
  { name: "RADIUS / RADSec", color: "#00c8d7", details: "UDP 1812/1813, CoA 3799; RADSec over TLS" },
  { name: "HTTPS / API", color: "#059669", details: "TCP 443; TLS 1.2/1.3" },
  { name: "LDAP/LDAPS", color: "#0078D4", details: "TCP 389 (STARTTLS) / 636" },
  { name: "Syslog / User-ID", color: "#7C3AED", details: "UDP 514 / TCP 6514 (TLS)" },
  { name: "Data/Logical", color: "#6B7280", details: "Logical linkage or policy flow" },
  { name: "TACACS+", color: "#DC2626", details: "TCP 49" },
]

export default function ArchitectureLegend({ currentView }: { currentView: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legend {currentView ? `• ${formatTitle(currentView)}` : ""}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h4 className="text-sm font-semibold mb-2">Node Types</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodeKinds.map((k) => (
              <div key={k.name} className="flex items-start gap-3">
                <span className="inline-block w-4 h-4 rounded" style={{ background: k.color }} />
                <div>
                  <div className="text-sm font-medium">{k.name}</div>
                  <div className="text-xs text-muted-foreground">{k.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Separator />
        <section>
          <h4 className="text-sm font-semibold mb-2">Edge Types</h4>
          <div className="space-y-2">
            {edgeKinds.map((e) => (
              <div key={e.name} className="flex items-start gap-3">
                <svg width="60" height="16" viewBox="0 0 60 16">
                  <line x1="0" y1="8" x2="60" y2="8" stroke={e.color} strokeWidth="2" />
                  <polygon points="55,5 60,8 55,11" fill={e.color} />
                </svg>
                <div>
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.details}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

function formatTitle(id: string) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
