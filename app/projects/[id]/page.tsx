import { notFound } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

import { ProjectStatCards } from "@/components/project-stat-cards"
import { SiteTable } from "@/components/site-table"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("*")
    .eq("project_id", params.id)
    .order("name", { ascending: true })

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Button asChild>
            <Link href={`/projects/${params.id}/sites/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Link>
          </Button>
        </div>
        <ProjectStatCards projectId={params.id} />
        <SiteTable sites={sites || []} projectId={params.id} />
      </div>
    </div>
  )
}
