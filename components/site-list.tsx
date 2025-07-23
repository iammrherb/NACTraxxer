"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, PlusCircle } from "lucide-react"
import type { Site, LibraryData, DatabaseUser as User } from "@/lib/database"
import { SiteForm } from "./site-form"
import { BulkEditModal } from "./bulk-edit-modal"
import { BulkCreateSitesModal } from "./bulk-create-sites-modal"

interface SiteListProps {
  sites: Site[]
  library: LibraryData
  users: User[]
  onUpdate: () => void
}

type SortKey = keyof Site | "project_manager_name"

export function SiteList({ sites, library, users, onUpdate }: SiteListProps) {
  const [filter, setFilter] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedSites = useMemo(() => {
    return sites
      .filter(
        (site) =>
          site.name.toLowerCase().includes(filter.toLowerCase()) ||
          site.id.toLowerCase().includes(filter.toLowerCase()),
      )
      .sort((a, b) => {
        const aValue = a[sortKey as keyof Site]
        const bValue = b[sortKey as keyof Site]

        if (aValue === undefined || bValue === undefined) return 0
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [sites, filter, sortKey, sortDirection])

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowIds(checked ? filteredAndSortedSites.map((s) => s.id) : [])
  }

  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRowIds((prev) => (checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)))
  }

  const openFormForNew = () => {
    setEditingSite(null)
    setIsFormOpen(true)
  }

  const openFormForEdit = (site: Site) => {
    setEditingSite(site)
    setIsFormOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700"
      case "Delayed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700"
      case "Planned":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filter sites by name or ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsBulkCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Bulk Create
          </Button>
          <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Site
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedRowIds.length === filteredAndSortedSites.length && filteredAndSortedSites.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")}>
                  Site Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("region")}>
                  Region
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("project_manager_name")}>
                  Project Manager
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => handleSort("completion_percent")}>
                  Completion
                </Button>
              </TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRowIds.includes(site.id)}
                    onCheckedChange={(checked) => handleRowSelect(site.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>{site.name}</div>
                  <div className="text-xs text-muted-foreground">{site.id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </TableCell>
                <TableCell>{site.region}</TableCell>
                <TableCell>{site.project_manager_name || "Unassigned"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={site.completion_percent} className="h-2" />
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openFormForEdit(site)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Workbook</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                {selectedRowIds.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{selectedRowIds.length} selected</span>
                    <Button variant="outline" size="sm" onClick={() => setIsBulkEditOpen(true)}>
                      Bulk Edit
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {isFormOpen && (
        <SiteForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={() => {
            onUpdate()
            setIsFormOpen(false)
          }}
          site={editingSite}
          library={library}
          users={users}
          onUpdateLibraries={onUpdate}
        />
      )}
      {isBulkEditOpen && (
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          siteIds={selectedRowIds}
          library={library}
          users={users}
          onUpdate={() => {
            onUpdate()
            setSelectedRowIds([])
          }}
        />
      )}
      {isBulkCreateOpen && (
        <BulkCreateSitesModal
          isOpen={isBulkCreateOpen}
          onClose={() => setIsBulkCreateOpen(false)}
          onUpdate={onUpdate}
          library={library}
          users={users}
        />
      )}
    </>
  )
}
