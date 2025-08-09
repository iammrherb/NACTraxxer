"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { File, Building } from "lucide-react"
import AddSiteModal from "./add-site-modal"
import { List } from "lucide-react" // Declare the List variable

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
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: string
  plannedStart: string
  plannedEnd: string
  notes: string
}

interface MasterSiteListProps {
  onSiteSelect: (siteId: string) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [phaseFilter, setPhaseFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddSiteModal, setShowAddSiteModal] = useState(false)

  useEffect(() => {
    // Load sites from localStorage on component mount
    const savedSites = localStorage.getItem("portnox-sites")
    if (savedSites) {
      setSites(JSON.parse(savedSites))
    }
  }, [])

  useEffect(() => {
    // Save sites to localStorage whenever they change
    localStorage.setItem("portnox-sites", JSON.stringify(sites))
  }, [sites])

  const addSite = (newSite: Site) => {
    setSites([...sites, newSite])
  }

  const filteredSites = sites.filter((site) => {
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm) ||
      site.region.toLowerCase().includes(searchTerm) ||
      site.country.toLowerCase().includes(searchTerm) ||
      site.projectManager.toLowerCase().includes(searchTerm) ||
      site.technicalOwners.join(", ").toLowerCase().includes(searchTerm)

    const matchesRegion = !regionFilter || site.region === regionFilter
    const matchesPriority = !priorityFilter || site.priority === priorityFilter
    const matchesPhase = !phaseFilter || site.phase === phaseFilter
    const matchesStatus = !statusFilter || site.status === statusFilter

    return matchesSearch && matchesRegion && matchesPriority && matchesPhase && matchesStatus
  })

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8," + Object.keys(sites[0] || {}).join(",") + "\n"

    sites.forEach((site) => {
      const values = Object.values(site).map((value) => {
        if (Array.isArray(value)) {
          return value.join(";")
        }
        return value
      })
      csvContent += values.join(",") + "\n"
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "site_data.csv")
    document.body.appendChild(link) // Required for FF

    link.click()
    link.remove()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <List className="h-5 w-5 text-blue-600" />
            <span>Master Site List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Input
              type="search"
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-auto"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                  <SelectItem value="APAC">APAC</SelectItem>
                  <SelectItem value="LATAM">LATAM</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="1">Phase 1</SelectItem>
                  <SelectItem value="2">Phase 2</SelectItem>
                  <SelectItem value="3">Phase 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={exportToCSV}>
              <File className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowAddSiteModal(true)}>
              <Building className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </div>

          <Table>
            <TableCaption>A list of all sites in the ABM network.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead>Project Manager</TableHead>
                <TableHead>Technical Owners</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <TableRow key={site.id} onClick={() => onSiteSelect(site.id)}>
                  <TableCell className="font-medium">{site.id}</TableCell>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.region}</TableCell>
                  <TableCell>{site.country}</TableCell>
                  <TableCell>{site.priority}</TableCell>
                  <TableCell>{site.phase}</TableCell>
                  <TableCell className="text-right">{site.users}</TableCell>
                  <TableCell>{site.projectManager}</TableCell>
                  <TableCell>{site.technicalOwners.join(", ")}</TableCell>
                  <TableCell>{site.status}</TableCell>
                  <TableCell className="text-right">{site.completionPercent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddSiteModal open={showAddSiteModal} onOpenChange={setShowAddSiteModal} onAddSite={addSite} />
    </div>
  )
}
