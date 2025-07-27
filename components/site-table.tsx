"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteTableActions } from "./site-table-actions"
import { BulkEditModal } from "./bulk-edit-modal"
import type { Site } from "@/types"

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
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
      case "Planned":
        return "bg-gray-100 text-gray-800"
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
              <TableHead>Site Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No sites found. Create your first site to get started.
                </TableCell>
              </TableRow>
            ) : (
              sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSites.includes(site.id)}
                      onCheckedChange={(checked) => handleSelectSite(site.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(site.priority)}>{site.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                  </TableCell>
                  <TableCell>{site.users_count?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={site.completion_percent || 0} className="w-16" />
                      <span className="text-sm text-muted-foreground">{site.completion_percent || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SiteTableActions siteId={site.id} siteName={site.name} projectId={projectId} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BulkEditModal
        isOpen={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        selectedSiteIds={selectedSites}
        onSuccess={() => {
          setSelectedSites([])
          setShowBulkEdit(false)
        }}
      />
    </div>
  )
}
