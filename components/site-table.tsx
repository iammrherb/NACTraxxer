"use client"

import { useState, useMemo } from "react"
import { Search, Download, Plus, Edit, Book, StickyNote, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Site } from "@/lib/database"

interface SiteTableProps {
  sites: Site[]
  onAddSite: () => void
  onEditSite: (site: Site) => void
  onViewWorkbook: (site: Site) => void
  onShowNotes: (site: Site) => void
  onSelectSite?: (site: Site) => void
}

export function SiteTable({ sites, onAddSite, onEditSite, onViewWorkbook, onShowNotes, onSelectSite }: SiteTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("All Regions")
  const [priorityFilter, setPriorityFilter] = useState("All Priorities")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [sortField, setSortField] = useState<keyof Site>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredAndSortedSites = useMemo(() => {
    const filtered = sites.filter((site) => {
      const matchesSearch =
        site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.project_manager_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion = regionFilter === "All Regions" || site.region === regionFilter
      const matchesPriority = priorityFilter === "All Priorities" || site.priority === priorityFilter
      const matchesStatus = statusFilter === "All Statuses" || site.status === statusFilter

      return matchesSearch && matchesRegion && matchesPriority && matchesStatus
    })

    // Sort
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
      site.technical_owners?.map((owner) => owner.name).join("; ") || "",
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleSiteClick = (site: Site) => {
    onSelectSite?.(site)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Site List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
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
              Export CSV
            </Button>
            <Button onClick={onAddSite}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("id")}
                    className="h-auto p-0 font-semibold"
                  >
                    Site ID <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3 font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold"
                  >
                    Site Name <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3 font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("region")}
                    className="h-auto p-0 font-semibold"
                  >
                    Region <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3 font-semibold">Priority</th>
                <th className="text-left p-3 font-semibold">Phase</th>
                <th className="text-left p-3 font-semibold">Users</th>
                <th className="text-left p-3 font-semibold">Project Manager</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Completion</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSites.map((site) => (
                <tr
                  key={site.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSiteClick(site)}
                >
                  <td className="p-3 font-mono text-sm">{site.id}</td>
                  <td className="p-3 font-medium">{site.name}</td>
                  <td className="p-3">{site.region}</td>
                  <td className="p-3">
                    <Badge className={getPriorityColor(site.priority)}>{site.priority}</Badge>
                  </td>
                  <td className="p-3">{site.phase}</td>
                  <td className="p-3">{site.users_count.toLocaleString()}</td>
                  <td className="p-3">{site.project_manager_name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(site.status)}`} />
                      {site.status}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={site.completion_percent} className="w-20" />
                      <span className="text-sm font-medium">{site.completion_percent}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEditSite(site)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onViewWorkbook(site)}>
                        <Book className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onShowNotes(site)}>
                        <StickyNote className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedSites.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No sites found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
