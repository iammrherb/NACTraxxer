import { createClient } from "@/lib/supabase/server"
import { NewProjectForm } from "@/components/new-project-form"

async function getUsers() {
  const supabase = createClient()

  const { data: users, error } = await supabase.from("users").select("id, name, email").order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users || []
}

export default async function NewProjectPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">Set up a new deployment project to track sites and progress.</p>
        </div>

        <NewProjectForm users={users} />
      </div>
    </div>
  )
}
