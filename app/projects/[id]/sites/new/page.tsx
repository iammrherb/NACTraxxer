import { createClient } from "@/lib/supabase/server"
import { NewSiteForm } from "@/components/new-site-form"
import { notFound } from "next/navigation"

async function getProject(id: string) {
  const supabase = createClient()

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    return null
  }

  return project
}

async function getUsers() {
  const supabase = createClient()

  const { data: users, error } = await supabase.from("users").select("id, name, email").order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users || []
}

export default async function NewSitePage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  const users = await getUsers()

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Site</h1>
          <p className="text-muted-foreground mt-2">Add a new site to the project "{project.name}".</p>
        </div>

        <NewSiteForm projectId={params.id} users={users} />
      </div>
    </div>
  )
}
