"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteTableActions } from "./site-table-actions"
import { BulkEditModal } from "./bulk-edit-modal"
import { toast } from "sonner"
import { Trash2, Edit } from "lucide-react"

interface Site {
  id: string
  name: string
  hierarchy_path: string
  priority: string
  status: string
  project_id: string
  project_manager?: string
  phase?: string
  completion_percent?: number
  users_count?: number
  created_at: string
  updated_at: string
}

interface SiteTableProps {
  sites: Site[]
  projectId: string
}

export function SiteTable({ sites, projectId }: SiteTableProps) {
  const router = useRouter()
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleBulkDelete = async () => {
    if (selectedSites.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedSites.length} sites? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const deletePromises = selectedSites.map((siteId) => fetch(`/api/sites/${siteId}`, { method: "DELETE" }))

      const results = await Promise.all(deletePromises)
      const failedDeletes = results.filter((result) => !result.ok)

      if (failedDeletes.length > 0) {
        toast.error(`Failed to delete ${failedDeletes.length} sites`)
      } else {
        toast.success(`Successfully deleted ${selectedSites.length} sites`)
      }

      setSelectedSites([])
      router.refresh()
    } catch (error) {
      console.error("Error deleting sites:", error)
      toast.error("Failed to delete sites")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "complete":
        return "default"
      case "in progress":
        return "secondary"
      case "not started":
        return "outline"
      case "on hold":
        return "destructive"
      case "delayed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkEditOpen(true)}
              disabled={selectedSites.length === 0}
            >
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedSites.length === 0 || isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Selected"}
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
                  aria-label="Select all sites"
                />
              </TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Hierarchy Path</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Project Manager</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No sites found.{" "}
                  <Button variant="link" onClick={() => router.push(`/projects/${projectId}/sites/new`)}>
                    Add your first site
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSites.includes(site.id)}
                      onCheckedChange={(checked) => handleSelectSite(site.id, checked as boolean)}
                      aria-label={`Select ${site.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => router.push(`/projects/${projectId}/sites/${site.id}`)}
                    >
                      {site.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{site.hierarchy_path}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(site.status)}>{site.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(site.priority)}>{site.priority}</Badge>
                  </TableCell>
                  <TableCell>{site.project_manager || "Unassigned"}</TableCell>
                  <TableCell>{site.phase || "Not Set"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={site.completion_percent || 0} className="w-16" />
                      <span className="text-sm text-muted-foreground">{site.completion_percent || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{site.users_count || 0}</TableCell>
                  <TableCell>
                    <SiteTableActions siteId={site.id} projectId={projectId} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BulkEditModal
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedSiteIds={selectedSites}
        onSuccess={() => {
          setSelectedSites([])
          router.refresh()
        }}
      />
    </div>
  )
}
