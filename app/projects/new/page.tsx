import { createClient } from "@/lib/supabase/server"
import { NewProjectForm } from "@/components/new-project-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default async function NewProjectPage() {
  const projectManagers = await getProjectManagers()

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Set up a new deployment project to track sites and progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewProjectForm projectManagers={projectManagers} />
        </CardContent>
      </Card>
    </div>
  )
}
