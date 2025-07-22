"use client"

import { useState, useEffect } from "react"
import { getSites, getUsers } from "@/lib/api"
import type { Site, User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle, FileDown, Pencil, Trash2 } from "lucide-react"
import SiteDetailModal from "./site-detail-modal"
import BulkCreateSitesModal from "./bulk-create-sites-modal"
import BulkEditModal from "./bulk-edit-modal"

export function SiteList() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [isBulkCreateOpen, setBulkCreateOpen] = useState(false)
  const [isBulkEditOpen, setBulkEditOpen] = useState(false)
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [sitesData, usersData] = await Promise.all([getSites(), getUsers()])
        setSites(sitesData)
        setUsers(usersData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSiteCreated = (newSite: Site) => {
    setSites((prevSites) => [newSite, ...prevSites])
  }

  const handleSitesImported = (newSites: Site[]) => {
    setSites((prevSites) => [...newSites, ...prevSites])
  }

  const handleBulkUpdate = (updatedSites: Site[]) => {
    setSites((prev) => prev.map((site) => updatedSites.find((us) => us.id === site.id) || site))
    setSelectedSiteIds([])
  }

  const handleRowSelection = (siteId: string) => {
    setSelectedSiteIds((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
  }

  if (loading) {
    return <div>Loading sites...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Site Inventory</CardTitle>
          <div className="flex items-center gap-2">
            {selectedSiteIds.length > 0 && (
              <Button variant="outline" onClick={() => setBulkEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Selected ({selectedSiteIds.length})
              </Button>
            )}
            <Button variant="outline" onClick={() => setBulkCreateOpen(true)}>
              <FileDown className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Site
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project Manager</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedSiteIds.includes(site.id)}
                    onChange={() => handleRowSelection(site.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{site.region}</TableCell>
                <TableCell>
                  <Badge
                    className={site.status === "At Risk" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                  >
                    {site.status}
                  </Badge>
                </TableCell>
                <TableCell>{(site.project_manager as User)?.name ?? "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={site.completion_percent} className="w-24" />
                    <span>{site.completion_percent}%</span>
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
                      <DropdownMenuItem onClick={() => setSelectedSite(site)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {selectedSite && <SiteDetailModal site={selectedSite} onClose={() => setSelectedSite(null)} users={users} />}
      {isBulkCreateOpen && (
        <BulkCreateSitesModal onClose={() => setBulkCreateOpen(false)} onSitesImported={handleSitesImported} />
      )}
      {isBulkEditOpen && (
        <BulkEditModal
          siteIds={selectedSiteIds}
          onClose={() => setBulkEditOpen(false)}
          onBulkUpdate={handleBulkUpdate}
          allUsers={users}
        />
      )}
    </Card>
  )
}
