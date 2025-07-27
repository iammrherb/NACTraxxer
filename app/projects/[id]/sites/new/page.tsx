import { createClient } from "@/lib/supabase/server"
import { NewSiteForm } from "@/components/new-site-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

async function getProjectData(projectId: string) {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: projectManagers, error: managersError } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name")

  if (managersError) {
    console.error("Error fetching project managers:", managersError)
  }

  return {
    project,
    projectManagers: projectManagers || [],
  }
}

export default async function NewSitePage({ params }: { params: { id: string } }) {
  const { project, projectManagers } = await getProjectData(params.id)

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Site</CardTitle>
          <CardDescription>Add a new site to the {project.name} project.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewSiteForm projectId={params.id} projectManagers={projectManagers} />
        </CardContent>
      </Card>
    </div>
  )
}
