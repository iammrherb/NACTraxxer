"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle, Edit } from "lucide-react"
import type { Site, DatabaseUser } from "@/lib/database"
import { SiteDetailModal } from "./site-detail-modal"
import { BulkEditModal } from "./bulk-edit-modal"
import { BulkCreateSitesModal } from "./bulk-create-sites-modal" // New import

type SiteListProps = {
  sites: Site[]
  users: DatabaseUser[]
  onEdit: (site: Site) => void
  onDelete: (id: string) => void
  onBulkUpdate: (siteIds: string[], updates: Partial<Site>) => void
  onBulkCreate: (count: number, prefix: string, start: number, defaults: Partial<Site>) => void
}

const getStatusVariant = (status: Site["status"]) => {
  switch (status) {
    case "Live":
      return "success"
    case "In Progress":
      return "default"
    case "Planning":
      return "outline"
    case "Delayed":
      return "destructive"
    default:
      return "secondary"
  }
}

export function SiteList({ sites, users, onEdit, onDelete, onBulkUpdate, onBulkCreate }: SiteListProps) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false) // New state
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleViewDetails = (site: Site) => {
    setSelectedSite(site)
    setIsDetailModalOpen(true)
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? sites.map((s) => s.id) : [])
  }

  const isAllSelected = sites.length > 0 && selectedRows.length === sites.length

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Site Inventory</h2>
        <div>
          <Button onClick={() => setIsBulkCreateModalOpen(true)} variant="outline" className="mr-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Bulk Create
          </Button>
          <Button onClick={() => onEdit(null as any)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Site
          </Button>
        </div>
      </div>
      {selectedRows.length > 0 && (
        <div className="mb-4 bg-muted p-2 rounded-lg flex items-center justify-between">
          <span>{selectedRows.length} sites selected</span>
          <Button onClick={() => setIsBulkEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Bulk Edit
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User Count</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Project Manager</TableHead>
              <TableHead className="w-[150px]">Completion</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No sites have been created for this project yet.
                </TableCell>
              </TableRow>
            ) : (
              sites.map((site) => (
                <TableRow key={site.id} data-state={selectedRows.includes(site.id) ? "selected" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(site.id)}
                      onCheckedChange={() => handleSelectRow(site.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(site.status)}>{site.status}</Badge>
                  </TableCell>
                  <TableCell>{site.details?.userCount || "N/A"}</TableCell>
                  <TableCell>{site.users_count}</TableCell>
                  <TableCell>{site.project_manager_name || "Unassigned"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={site.completion_percent} className="w-[100px]" />
                      <span className="text-xs text-muted-foreground">{site.completion_percent}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(site)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(site)}>Edit Site</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(site.id)} className="text-red-600">
                          Delete Site
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9}>{sites.length} sites</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {selectedSite && (
        <SiteDetailModal
          site={selectedSite}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          users={users}
        />
      )}
      <BulkEditModal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        selectedSiteIds={selectedRows}
        onSave={onBulkUpdate}
        users={users}
      />
      <BulkCreateSitesModal
        isOpen={isBulkCreateModalOpen}
        onClose={() => setIsBulkCreateModalOpen(false)}
        onSave={onBulkCreate}
        users={users}
      />
    </>
  )
}
