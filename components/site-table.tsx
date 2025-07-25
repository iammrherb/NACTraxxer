"use client"

import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

import type { Site } from "@/types"
import { deleteSiteAction } from "@/app/actions/sites"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Complete: "default",
  "In Progress": "secondary",
  Delayed: "destructive",
  Planned: "outline",
}

export function SiteTable({ sites, projectId }: { sites: Site[]; projectId: string }) {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const handleDelete = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site? This action cannot be undone.")) {
      return
    }

    const result = await deleteSiteAction(siteId, projectId)
    if (result.success) {
      toast({ title: "Success", description: result.message })
      router.refresh()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Priority</TableHead>
          <TableHead className="hidden md:table-cell">Users</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow key={site.id}>
            <TableCell className="font-medium">{site.name}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[site.status] || "outline"}>{site.status}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{site.priority}</TableCell>
            <TableCell className="hidden md:table-cell">{site.users}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleNavigate(`/projects/${projectId}/sites/${site.id}`)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(site.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
