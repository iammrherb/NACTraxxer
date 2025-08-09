"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Book, MapPin, Users, Calendar, Settings, Network, Cloud } from "lucide-react"

type Site = {
  id?: string
  name?: string
  region?: string
  country?: string
  priority?: "High" | "Medium" | "Low"
  phase?: string
  users?: number
  projectManager?: string
  technicalOwners?: string[]
  status?: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent?: number
  wiredVendors?: string[]
  wirelessVendors?: string[]
  deviceTypes?: string[]
  radsec?: string
  plannedStart?: string
  plannedEnd?: string
  notes?: string
}

function safeArr<T>(val?: T[]): T[] {
  return Array.isArray(val) ? val : []
}

function fmtDate(d?: string) {
  if (!d) return "—"
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString()
}

export default function SiteWorkbook({ siteId }: { siteId?: string }) {
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portnox-sites")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setSites(parsed)
          return
        }
      }
    } catch {
      /* ignore */
    }
    // fallback sample
    setSites([
      {
        id: "HQ-1",
        name: "Global HQ",
        region: "North America",
        country: "USA",
        priority: "High",
        phase: "1",
        users: 2000,
        projectManager: "Jane Doe",
        technicalOwners: ["Alice", "Bob"],
        status: "In Progress",
        completionPercent: 45,
        wiredVendors: ["Cisco"],
        wirelessVendors: ["Aruba"],
        deviceTypes: ["Windows", "Apple", "Mobile", "IoT"],
        radsec: "Proxy",
        plannedStart: "2025-06-01",
        plannedEnd: "2025-10-15",
        notes: "HQ rollout focusing on certificate-based auth and Intune compliance.",
      },
    ])
  }, [])

  const current = useMemo(() => {
    if (!siteId) return undefined
    return sites.find((s) => s.id === siteId || s.name === siteId)
  }, [sites, siteId])

  if (!siteId || !current) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-[#00c8d7]" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Site Selected</h3>
            <p className="text-muted-foreground">Choose a site in the Master Site List to view details.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const technicalOwners = safeArr(current.technicalOwners)
  const wiredVendors = safeArr(current.wiredVendors)
  const wirelessVendors = safeArr(current.wirelessVendors)
  const deviceTypes = safeArr(current.deviceTypes)

  const statusColor =
    current.status === "Complete"
      ? "text-green-600"
      : current.status === "In Progress"
        ? "text-blue-600"
        : current.status === "Delayed"
          ? "text-red-600"
          : "text-gray-600"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-[#00c8d7]" />
            <span>
              Site Workbook: {current.name} {current.id ? `(${current.id})` : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Site Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span>{current.region || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span>{current.country || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge variant="secondary">{current.priority || "—"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phase</span>
                  <span>{current.phase ? `Phase ${current.phase}` : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span>{typeof current.users === "number" ? current.users.toLocaleString() : "—"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Project Team
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project Manager</span>
                  <span>{current.projectManager || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technical Owners</span>
                  <div className="text-right">{technicalOwners.length > 0 ? technicalOwners.join(", ") : "—"}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${statusColor}`}>{current.status || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completion</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${current.completionPercent ?? 0}%` }}
                      />
                    </div>
                    <span className="text-sm">{current.completionPercent ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned Start</span>
                  <span>{fmtDate(current.plannedStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned End</span>
                  <span>{fmtDate(current.plannedEnd)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Technical Configuration
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Wired Vendors:</span>
                  <div className="flex flex-wrap gap-1">
                    {wiredVendors.length > 0 ? (
                      wiredVendors.map((v, i) => (
                        <Badge key={`${v}-${i}`} variant="outline" className="text-xs">
                          {v}
                        </Badge>
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Wireless Vendors:</span>
                  <div className="flex flex-wrap gap-1">
                    {wirelessVendors.length > 0 ? (
                      wirelessVendors.map((v, i) => (
                        <Badge key={`${v}-${i}`} variant="outline" className="text-xs">
                          {v}
                        </Badge>
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">RADSec:</span>
                  <Badge variant="outline" className="text-xs">
                    {current.radsec || "—"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Device Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {deviceTypes.length > 0 ? (
                      deviceTypes.map((type, i) => (
                        <Badge key={`${type}-${i}`} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm">{current.notes || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
