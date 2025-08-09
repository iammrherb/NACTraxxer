"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type SiteRow = {
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

function safeArr<T = string>(val?: T[]): T[] {
  return Array.isArray(val) ? val : []
}

function fmtDate(d?: string) {
  if (!d) return "—"
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString()
}

export default function SiteWorkbook({ siteId }: { siteId?: string }) {
  const [rows, setRows] = useState<SiteRow[]>([])

  // Load from localStorage if present (compatible with your AddSiteModal)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sites")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setRows(parsed)
          return
        }
      }
    } catch {
      /* ignore malformed storage */
    }
    // Fallback seed so the table renders without errors
    setRows([
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

  const filteredRows = useMemo(() => {
    if (!siteId) return rows
    return rows.filter((r) => r.id === siteId || r.name === siteId)
  }, [rows, siteId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Workbook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Centralized view of per-site deployment data. Add sites via the Master Site List or the Add Site modal.
          </p>
          <Separator />
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Site</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Wired</TableHead>
                  <TableHead>Wireless</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>RADSec</TableHead>
                  <TableHead>Planned</TableHead>
                  <TableHead>Owners</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-sm text-muted-foreground">
                      No sites found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((r, idx) => (
                    <TableRow key={r.id ?? `row-${idx}`}>
                      <TableCell className="font-medium">{r.name ?? "—"}</TableCell>
                      <TableCell>{r.region ?? "—"}</TableCell>
                      <TableCell>{r.country ?? "—"}</TableCell>
                      <TableCell>
                        {r.priority ? (
                          <Badge variant="secondary">{r.priority}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {r.status ? (
                          <Badge variant="outline">{r.status}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{typeof r.users === "number" ? r.users : "—"}</TableCell>
                      <TableCell>
                        {safeArr(r.wiredVendors).length > 0 ? safeArr(r.wiredVendors).join(", ") : "—"}
                      </TableCell>
                      <TableCell>
                        {safeArr(r.wirelessVendors).length > 0 ? safeArr(r.wirelessVendors).join(", ") : "—"}
                      </TableCell>
                      <TableCell>
                        {safeArr(r.deviceTypes).length > 0 ? safeArr(r.deviceTypes).join(", ") : "—"}
                      </TableCell>
                      <TableCell>{r.radsec ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">Start: {fmtDate(r.plannedStart)}</span>
                          <span className="text-xs">End: {fmtDate(r.plannedEnd)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {safeArr(r.technicalOwners).length > 0 ? safeArr(r.technicalOwners).join(", ") : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
