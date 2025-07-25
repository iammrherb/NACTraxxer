"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/database"
import type { Project } from "@/lib/database"
import { ProjectsDataTable } from "@/components/projects-data-table"
import { ProjectStatCards } from "@/components/project-stat-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const getStatusBadgeVariant = (status: Project["status"]) => {
  switch (status) {
    case "On Track":
      return "success"
    case "At Risk":
      return "warning"
    case "Off Track":
      return "destructive"
    case "Completed":
      return "default"
    case "On Hold":
    case "Planning":
      return "secondary"
    default:
      return "outline"
  }
}

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Link href={`/projects/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Project["status"]
      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "health",
    header: "Health",
  },
  {
    accessorKey: "project_manager",
    header: "Project Manager",
  },
  {
    accessorKey: "end_date",
    header: "End Date",
  },
  {
    accessorKey: "completion_percentage",
    header: "Progress",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("completion_percentage"))
      return (
        <div className="flex items-center gap-2">
          <Progress value={amount} className="w-24" />
          <span>{amount}%</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/projects/${project.id}`}>
              <DropdownMenuItem>View project details</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>View customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default async function ProjectsDashboardPage() {
  // Fetch all projects from the database
  const projects = await sql<Project[]>`
    SELECT 
      id, 
      name, 
      customer_name, 
      status, 
      health, 
      project_manager, 
      end_date,
      completion_percentage
    FROM projects
    ORDER BY end_date DESC
  `

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Projects Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/projects/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      <ProjectStatCards projects={projects} />

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>An interactive list of all projects. Use the filters to narrow your search.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectsDataTable data={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
