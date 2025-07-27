import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectStatCards } from "@/components/project-stat-cards"
import { SiteTable } from "@/components/site-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Project, Site } from "@/types"

interface ProjectPageProps {
  params: {
    id: string
  }
}

async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching project:", error)
    return null
  }

  return data
}

async function getProjectSites(projectId: string): Promise<Site[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sites:", error)
    return []
  }

  return data || []
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  const sites = await getProjectSites(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sites</h2>
        </div>
        <SiteTable sites={sites} projectId={params.id} />
      </div>
    </div>
  )
}
