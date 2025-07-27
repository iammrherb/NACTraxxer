import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { NewSiteForm } from "@/components/new-site-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getProjectData(projectId: string) {
  const supabase = createClient()

  const { data: project, error } = await supabase.from("projects").select("id, name").eq("id", projectId).single()

  if (error) {
    console.error("Error fetching project:", error)
    return null
  }

  return project
}

async function getProjectManagers() {
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "Manager")
    .order("name")

  if (error) {
    console.error("Error fetching project managers:", error)
    return []
  }

  return users || []
}

export default async function NewSitePage({ params }: { params: { id: string } }) {
  const project = await getProjectData(params.id)
  const projectManagers = await getProjectManagers()

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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Site</CardTitle>
            <CardDescription>Add a new site to the project "{project.name}".</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <NewSiteForm projectId={params.id} projectManagers={projectManagers} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
