"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SiteTableActions } from "./site-table-actions"
import { BulkEditModal } from "./bulk-edit-modal"
import { Edit, Trash2 } from "lucide-react"

interface Site {
  id: string
  site_name: string
  site_id: string
  region: string
  country: string
  priority: string
  phase: string
  users_count: number
  project_manager: string
  status: string
  planned_start: string
  planned_end: string
  completion_percent: number
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
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {selectedSites.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedSites.length} site{selectedSites.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowBulkEdit(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                // TODO: Implement bulk delete
                console.log("Bulk delete:", selectedSites)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
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
              <TableHead>Site Name</TableHead>
              <TableHead>Site ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead className="w-12">Actions</TableHead>
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
                <TableCell className="font-medium">{site.site_name}</TableCell>
                <TableCell className="font-mono text-sm">{site.site_id}</TableCell>
                <TableCell>
                  {site.region}, {site.country}
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(site.priority)}>{site.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${site.completion_percent}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground">{site.completion_percent}%</span>
                  </div>
                </TableCell>
                <TableCell>{site.users_count}</TableCell>
                <TableCell>{site.phase}</TableCell>
                <TableCell>
                  <SiteTableActions siteId={site.id} siteName={site.site_name} projectId={projectId} />
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
