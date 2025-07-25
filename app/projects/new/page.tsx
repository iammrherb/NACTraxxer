import { createClient } from "@/lib/supabase/server"
import { NewProjectForm } from "@/components/new-project-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function NewProjectPage() {
  const supabase = createClient()

  // Fetch users who can be project managers
  const { data: users, error } = await supabase.from("users").select("id, name").order("name")

  if (error) {
    console.error("Error fetching users:", error)
  }

  const projectManagers = users || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-2xl mx-auto w-full">
        <NewProjectForm projectManagers={projectManagers} />
      </div>
    </div>
  )
}
