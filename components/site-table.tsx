"use client"

import { useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { SiteForm } from "./site-form"
import { BulkEditModal } from "./bulk-edit-modal"
import type { Site } from "@/lib/database"

interface SiteTableProps {
  initialSites: Site[]
  projectId: string
}

export function SiteTable({ initialSites, projectId }: SiteTableProps) {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSites, setSelectedSites] = useState<string[]>([])
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

  const handleFormSave = () => {
    setIsFormOpen(false)
    setEditingSite(null)
    fetchSites() // Refresh data
  }

  const handleBulkSave = () => {
    setIsBulkEditOpen(false)
    setSelectedSites([])
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

  const toggleSelect = (siteId: string) => {
    setSelectedSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSites(sites.map((s) => s.id))
    } else {
      setSelectedSites([])
    }
  }

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Complete: "bg-green-100 text-green-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Delayed: "bg-red-100 text-red-800",
      Planned: "bg-gray-100 text-gray-800",
    }
    return <Badge className={colors[status] || colors.Planned}>{status}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sites Master List</CardTitle>
          <div className="flex items-center justify-between pt-4">
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsBulkEditOpen(true)} disabled={selectedSites.length === 0}>
                Bulk Edit ({selectedSites.length})
              </Button>
              <Button onClick={handleAddNewClick}>Add New Site</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedSites.length === sites.length && sites.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={8}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSites.length > 0 ? (
                  filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSites.includes(site.id)}
                          onCheckedChange={() => toggleSelect(site.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>{getStatusBadge(site.status)}</TableCell>
                      <TableCell>{site.phase}</TableCell>
                      <TableCell>{site.users_count.toLocaleString()}</TableCell>
                      <TableCell>{site.region}</TableCell>
                      <TableCell>{site.completion_percent}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(site)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No sites found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <SiteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        site={editingSite}
        projectId={projectId}
      />
      <BulkEditModal
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        onSave={handleBulkSave}
        siteIds={selectedSites}
      />
    </>
  )
}
