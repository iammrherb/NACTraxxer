"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SiteForm } from "./site-form"
import { Search, Plus, Edit, Trash2, FileText, StickyNote, Building2 } from "lucide-react"
import type { Site } from "@/lib/types"

interface SiteTableProps {
  sites: Site[]
  onEditSite: (site: Site) => void
  onDeleteSite: (siteId: string) => void
  onViewWorkbook: (siteId: string) => void
  onShowNotes: (siteId: string) => void
}

export function SiteTable({ sites, onEditSite, onDeleteSite, onViewWorkbook, onShowNotes }: SiteTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [showAddSiteDialog, setShowAddSiteDialog] = useState(false)
  const [sortField, setSortField] = useState<keyof Site>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredAndSortedSites = useMemo(() => {
    let filtered = sites

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((site) => site.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((site) => site.priority === priorityFilter)
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((site) => site.region === regionFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [sites, searchTerm, statusFilter, priorityFilter, regionFilter, sortField, sortDirection])

  const handleSort = (field: keyof Site) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const uniqueRegions = Array.from(new Set(sites.map((site) => site.region)))
  const uniqueStatuses = Array.from(new Set(sites.map((site) => site.status)))
  const uniquePriorities = Array.from(new Set(sites.map((site) => site.priority)))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>Site Management</span>
            </div>
            <Dialog open={showAddSiteDialog} onOpenChange={setShowAddSiteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Site</DialogTitle>
                </DialogHeader>
                <SiteForm
                  onClose={() => setShowAddSiteDialog(false)}
                  onSave={() => {
                    setShowAddSiteDialog(false)
                    // Refresh sites data
                    window.location.reload()
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {uniquePriorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("site_id")}>
                    Site ID
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                    Name
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("region")}>
                    Region
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("country")}>
                    Country
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Project Manager</TableHead>
                  <TableHead>Planned Start</TableHead>
                  <TableHead>Planned End</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.site_id}</TableCell>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>{site.country}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getPriorityColor(site.priority)}`}>{site.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(site.status)}`}>{site.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={site.completion_percent} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground">{site.completion_percent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.project_manager}</TableCell>
                    <TableCell>
                      {site.planned_start ? new Date(site.planned_start).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{site.planned_end ? new Date(site.planned_end).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onEditSite(site)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onViewWorkbook(site.site_id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onShowNotes(site.site_id)}>
                          <StickyNote className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onDeleteSite(site.site_id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedSites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No sites found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
