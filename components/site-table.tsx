import { createClient } from "@/lib/supabase/server"
import { ProjectsDataTable } from "./projects-data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Site } from "@/types"
import { Badge } from "./ui/badge"
import { SiteTableActions } from "./site-table-actions"
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react"

async function getSites(projectId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("sites").select("*").eq("project_id", projectId).order("name")

  if (error) {
    console.error("Error fetching sites:", error)
    return []
  }
  return data
}

export const columns: ColumnDef<Site>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant: "default" | "secondary" | "destructive" | "outline" =
        status === "Complete" ? "default" : status === "In Progress" ? "secondary" : "destructive"

      const Icon =
        status === "Complete" ? CheckCircle : status === "In Progress" ? Clock : status === "On Hold" ? XCircle : Circle

      return (
        <Badge variant={variant} className="flex items-center w-fit">
          <Icon className="mr-2 h-4 w-4" />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "users_count",
    header: "Users",
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.getValue("updated_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <SiteTableActions site={row.original} />,
  },
]

export async function SiteTable({ projectId }: { projectId: string }) {
  const sites = await getSites(projectId)
  return <ProjectsDataTable columns={columns} data={sites} />
}
