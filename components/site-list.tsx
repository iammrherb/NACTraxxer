"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteDetailModal } from "./site-detail-modal"
import type { Site, User } from "@/lib/database"

interface SiteListProps {
  sites: Site[]
  onUpdate: () => void
  library: any
  users: User[]
}

export function SiteList({ sites, onUpdate, library, users }: SiteListProps) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (site: Site) => {
    setSelectedSite(site)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSite(null)
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Complete":
        return "default"
      case "In Progress":
        return "secondary"
      case "Delayed":
        return "destructive"
      case "Planned":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Deployment Sites</CardTitle>
          <CardDescription>
            Manage and track the progress of all deployment sites. Click 'View Details' to edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Go-Live</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(site.status)}>{site.status}</Badge>
                    </TableCell>
                    <TableCell>{site.users_count}</TableCell>
                    <TableCell>{site.planned_end}</TableCell>
                    <TableCell>{site.completion_percent}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(site)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedSite && (
        <SiteDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          site={selectedSite}
          onUpdate={onUpdate}
          library={library}
          users={users}
        />
      )}
    </>
  )
}
