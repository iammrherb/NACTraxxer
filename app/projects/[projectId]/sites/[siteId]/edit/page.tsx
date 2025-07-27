import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EditSiteForm } from "@/components/edit-site-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

async function getSite(siteId: string) {
  const supabase = createClient()
  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error || !site) {
    notFound()
  }
  return site
}

async function getProject(projectId: string) {
  const supabase = createClient()
  const { data: project, error } = await supabase.from("projects").select("id, name").eq("id", projectId).single()
  if (error || !project) {
    notFound()
  }
  return project
}

export default async function EditSitePage({ params }: { params: { projectId: string; siteId: string } }) {
  const site = await getSite(params.siteId)
  const project = await getProject(params.projectId)

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/projects/${project.id}`}>{project.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{site.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold">Edit Site</h1>
      <EditSiteForm site={site} projectId={params.projectId} />
    </div>
  )
}
