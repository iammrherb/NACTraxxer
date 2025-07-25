"use client"

import { useState, useCallback, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { SiteForm } from "./site-form"
import { BulkEditModal } from "./bulk-edit-modal"
import type { Site, LibraryData } from "@/lib/database"
import { ArrowUpDown, Download, Edit, Plus, Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface SiteTableProps {
  initialSites: Site[]
  projectId: string
  libraryData: LibraryData
}

export function SiteTable({ initialSites, projectId, libraryData }: SiteTableProps) {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("All Regions")
  const [priorityFilter, setPriorityFilter] = useState("All Priorities")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [sortField, setSortField] = useState<keyof Site>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const fetchSites = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/sites?projectId=${projectId}`)
      if (!response.ok) throw new Error("Failed to fetch sites")
      const data = await response.json()
      setSites(data)
    } catch (error) {
      toast({ title: "Error", description: "Could not load sites.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const filteredAndSortedSites = useMemo(() => {
    const filtered = sites.filter((site) => {
      const lowerSearchTerm = searchTerm.toLowerCase()
      const matchesSearch =
        site.id.toLowerCase().includes(lowerSearchTerm) ||
        site.name.toLowerCase().includes(lowerSearchTerm) ||
        (site.country && site.country.toLowerCase().includes(lowerSearchTerm)) ||
        (site.project_manager_name && site.project_manager_name.toLowerCase().includes(lowerSearchTerm))

      const matchesRegion = regionFilter === "All Regions" || site.region === regionFilter
      const matchesPriority = priorityFilter === "All Priorities" || site.priority === priorityFilter
      const matchesStatus = statusFilter === "All Statuses" || site.status === statusFilter

      return matchesSearch && matchesRegion && matchesPriority && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [sites, searchTerm, regionFilter, priorityFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: keyof Site) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedSiteIds(checked ? filteredAndSortedSites.map((s) => s.id) : [])
  }

  const handleSelectRow = (siteId: string, checked: boolean) => {
    setSelectedSiteIds((prev) => (checked ? [...prev, siteId] : prev.filter((id) => id !== siteId)))
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
    setEditingSite(null)
    fetchSites()
  }

  const handleBulkSave = () => {
    setIsBulkEditOpen(false)
    setSelectedSiteIds([])
    fetchSites()
  }

  const handleEditClick = (site: Site) => {
    setEditingSite(site)
    setIsFormOpen(true)
  }

  const handleAddNewClick = () => {
    setEditingSite(null)
    setIsFormOpen(true)
  }

  const exportToCSV = () => {
    const headers = [
      "Site ID",
      "Site Name",
      "Region",
      "Country",
      "Priority",
      "Phase",
      "Users",
      "Project Manager",
      "Technical Owners",
      "Status",
      "Completion %",
      "Planned Start",
      "Planned End",
    ]

    const csvData = filteredAndSortedSites.map((site) => [
      site.id,
      site.name,
      site.region,
      site.country,
      site.priority,
      site.phase,
      site.users_count,
      site.project_manager_name || "",
      site.technical_owners?.map((owner: any) => owner.name).join("; ") || "",
      site.status,
      site.completion_percent,
      site.planned_start,
      site.planned_end,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `portnox-sites-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Delayed":
        return "bg-red-500"
      case "Planned":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Master Site List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Regions">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="EMEA">EMEA</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
                <SelectItem value="LATAM">LATAM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Priorities">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAddNewClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>

          {selectedSiteIds.length > 0 && (
            <div className="flex items-center justify-between p-3 mb-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelectedSiteIds([])}>
                  <X className="h-4 w-4" />
                </Button>
                <span className="font-medium">{selectedSiteIds.length} sites selected</span>
              </div>
              <Button onClick={() => setIsBulkEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Bulk Edit
              </Button>
            </div>
          )}

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-3">
                    <Checkbox
                      checked={selectedSiteIds.length > 0 && selectedSiteIds.length === filteredAndSortedSites.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-left p-3 font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Site Name <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-left p-3 font-semibold">Status</TableHead>
                  <TableHead className="text-left p-3 font-semibold">Completion</TableHead>
                  <TableHead className="text-left p-3 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedSites.length > 0 ? (
                  filteredAndSortedSites.map((site) => (
                    <TableRow key={site.id} className="hover:bg-muted/50">
                      <TableCell className="p-3">
                        <Checkbox
                          checked={selectedSiteIds.includes(site.id)}
                          onCheckedChange={(checked) => handleSelectRow(site.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="p-3 font-medium">
                        <Link href={`/projects/${projectId}/sites/${site.id}`} className="hover:underline">
                          {site.name}
                        </Link>
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(site.status)}`} />
                          {site.status}
                        </div>
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={site.completion_percent} className="w-20" />
                          <span className="text-sm font-medium">{site.completion_percent}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(site)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No sites found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {isFormOpen && (
        <SiteForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleFormSave}
          site={editingSite}
          {...libraryData}
        />
      )}
      {isBulkEditOpen && (
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          onSave={handleBulkSave}
          siteIds={selectedSiteIds}
        />
      )}
    </>
  )
}
