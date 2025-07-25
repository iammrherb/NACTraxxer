import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProjectTabs } from "@/components/project-tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Project } from "@/lib/database"

// Helper function to get customer name safely
function getCustomerName(project: Project & { customer: { name: string } | { name: string }[] | null }): string {
  if (!project.customer) return project.name.charAt(0)
  const customer = Array.isArray(project.customer) ? project.customer[0] : project.customer
  return customer?.name ?? project.name
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, customer:customers(name)")
    .eq("id", params.id)
    .single()

  if (error || !project) {
    notFound()
  }

  const customerName = getCustomerName(project)

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?width=48&height=48&text=${customerName.charAt(0)}`} />
              <AvatarFallback>{customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{customerName}</p>
            </div>
          </div>
        </div>
        <ProjectTabs projectId={params.id} />
      </header>
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
