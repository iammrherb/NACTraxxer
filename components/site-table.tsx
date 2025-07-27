"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SiteTableActions } from "./site-table-actions"
import { BulkEditModal } from "./bulk-edit-modal"

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: string
  phase: string
  users_count: number
  status: string
  completion_percentage: number
  planned_start_date: string
  planned_end_date: string
}

interface SiteTableProps {
  sites: Site[]
  projectId: string
}

export function SiteTable({ sites, projectId }: SiteTableProps) {
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [showBulkEdit, setShowBulkEdit] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSites(sites.map((site) => site.id))
    } else {
      setSelectedSites([])
    }
  }

  const handleSelectSite = (siteId: string, checked: boolean) => {
    if (checked) {
      setSelectedSites((prev) => [...prev, siteId])
    } else {
      setSelectedSites((prev) => prev.filter((id) => id !== siteId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Planned":
        return "bg-gray-100 text-gray-800"
      case "Delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {selectedSites.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedSites.length} site{selectedSites.length > 1 ? "s" : ""} selected
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowBulkEdit(true)}>
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedSites([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedSites.length === sites.length && sites.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={(checked) => handleSelectSite(site.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{site.region}</TableCell>
                <TableCell>{site.country}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(site.priority)}>{site.priority}</Badge>
                </TableCell>
                <TableCell>{site.phase}</TableCell>
                <TableCell>{site.users_count}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                </TableCell>
                <TableCell>{site.completion_percentage}%</TableCell>
                <TableCell>{new Date(site.planned_start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(site.planned_end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <SiteTableActions siteId={site.id} siteName={site.name} projectId={projectId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkEditModal
        open={showBulkEdit}
        onOpenChange={setShowBulkEdit}
        selectedSiteIds={selectedSites}
        onSuccess={() => {
          setSelectedSites([])
          setShowBulkEdit(false)
        }}
      />
    </div>
  )
}
