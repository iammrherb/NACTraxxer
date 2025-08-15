"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Edit, Eye, Trash2 } from "lucide-react"

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent: number
  notes: string
}

interface MasterSiteListProps {
  onSiteSelect: (siteId: string) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    const savedSites = localStorage.getItem("portnox-sites")
    if (savedSites) {
      setSites(JSON.parse(savedSites))
    }
  }, [])

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === "all" || site.region === regionFilter
    const matchesStatus = statusFilter === "all" || site.status === statusFilter
    const matchesPriority = priorityFilter === "all" || site.priority === priorityFilter

    return matchesSearch && matchesRegion && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-green-600"
      case "In Progress":
        return "text-blue-600"
      case "Planned":
        return "text-gray-600"
      case "Delayed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const exportCSV = () => {
    const headers = [
      "Site ID",
      "Site Name",
      "Region",
      "Country",
      "Priority",
      "Phase",
      "Users",
      "Status",
      "Completion %",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredSites.map((site) =>
        [
          site.id,
          `"${site.name}"`,
          site.region,
          site.country,
          site.priority,
          site.phase,
          site.users,
          site.status,
          site.completionPercent,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portnox-sites-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Master Site List</span>
          <div className="flex space-x-2">
            <Button onClick={exportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="EMEA">EMEA</SelectItem>
              <SelectItem value="APAC">APAC</SelectItem>
              <SelectItem value="LATAM">LATAM</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sites Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Site ID</th>
                <th className="text-left p-3 font-semibold">Site Name</th>
                <th className="text-left p-3 font-semibold">Region</th>
                <th className="text-left p-3 font-semibold">Priority</th>
                <th className="text-left p-3 font-semibold">Phase</th>
                <th className="text-left p-3 font-semibold">Users</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Progress</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-sm">{site.id}</td>
                  <td className="p-3 font-medium">{site.name}</td>
                  <td className="p-3">{site.region}</td>
                  <td className="p-3">
                    <Badge className={getPriorityColor(site.priority)}>{site.priority}</Badge>
                  </td>
                  <td className="p-3">Phase {site.phase}</td>
                  <td className="p-3">{site.users.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`font-medium ${getStatusColor(site.status)}`}>{site.status}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${site.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[40px]">{site.completionPercent}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSiteSelect(site.id)}
                        title="View Site Workbook"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSites.length === 0 && sites.length === 0 && (
          <div className="text-center py-8 text-gray-500">No sites found. Add your first site to get started.</div>
        )}

        {filteredSites.length === 0 && sites.length > 0 && (
          <div className="text-center py-8 text-gray-500">No sites found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
