import { createClient } from "@/lib/supabase/server"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteTable } from "@/components/site-table"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Site, SiteStats } from "@/lib/database"
import { notFound } from "next/navigation"

async function getProjectData(projectId: string): Promise<{ project: any; sites: Site[]; stats: SiteStats }> {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    console.error("Error fetching project:", projectError)
    notFound()
  }

  let { data: sites, error: sitesError } = await supabase.from("sites").select("*").eq("project_id", projectId)

  if (sitesError) {
    console.error("Error fetching sites:", sitesError)
    // Return empty array on error but don't crash the page
    sites = []
  }

  // Calculate stats on the server
  const total_sites = sites?.length || 0
  const completed_sites = sites?.filter((s) => s.status === "Complete").length || 0
  const in_progress_sites = sites?.filter((s) => s.status === "In Progress").length || 0
  const planned_sites = sites?.filter((s) => s.status === "Planned").length || 0
  const delayed_sites = sites?.filter((s) => s.status === "Delayed").length || 0
  const total_users = sites?.reduce((acc, site) => acc + (site.users_count || 0), 0) || 0
  const overall_completion = total_sites > 0 ? Math.round((completed_sites / total_sites) * 100) : 0

  const checklistItems = sites?.flatMap((s) => s.checklist_items || [])
  const total_checklist_items = checklistItems.length
  const completed_checklist_items = checklistItems.filter((item) => item.completed).length
  const checklist_completion =
    total_checklist_items > 0 ? Math.round((completed_checklist_items / total_checklist_items) * 100) : 0

  const stats: SiteStats = {
    total_sites,
    completed_sites,
    in_progress_sites,
    planned_sites,
    delayed_sites,
    total_users,
    overall_completion,
    total_checklist_items,
    completed_checklist_items,
    checklist_completion,
    sites: sites || [],
  }

  return { project, sites: sites || [], stats }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, sites, stats } = await getProjectData(params.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
      </Card>

      <ProgressDashboard stats={stats} />

      <SiteTable initialSites={sites} projectId={project.id} />
    </div>
  )
}
