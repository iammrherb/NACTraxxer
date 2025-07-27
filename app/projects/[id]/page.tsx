import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProjectStatCards } from "@/components/project-stat-cards"
import { SiteTable } from "@/components/site-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getProjectData(projectId: string) {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (projectError) {
    console.error("Error fetching project:", projectError)
    return { project: null, sites: [] }
  }

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (sitesError) {
    console.error("Error fetching sites:", sitesError)
    return { project, sites: [] }
  }

  return { project, sites: sites || [] }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, sites } = await getProjectData(params.id)

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Project Not Found</h1>
          <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
        <Button asChild>
          <Link href={`/projects/${params.id}/sites/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading statistics...</div>}>
        <ProjectStatCards projectId={params.id} />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>Manage all sites in this project. You can add, edit, or bulk update sites.</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteTable sites={sites} projectId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
