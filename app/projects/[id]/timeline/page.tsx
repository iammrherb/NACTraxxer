import { createClient } from "@/lib/supabase/server"
import { ProjectTimeline, type GanttTask } from "@/components/project-timeline"

async function getTimelineData(projectId: string): Promise<GanttTask[]> {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, start_date, end_date")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    console.error("Error fetching project for timeline:", projectError)
    return []
  }

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("id, name, planned_start_date, planned_completion_date, completion_percent")
    .eq("project_id", projectId)
    .not("planned_start_date", "is", null)
    .not("planned_completion_date", "is", null)

  if (sitesError) {
    console.error("Error fetching sites for timeline:", sitesError)
    return []
  }

  const tasks: GanttTask[] = []

  const validSites = sites.filter((s) => s.planned_start_date && s.planned_completion_date)

  const overallProgress =
    validSites.length > 0
      ? Math.round(validSites.reduce((acc, site) => acc + (site.completion_percent || 0), 0) / validSites.length)
      : 0

  if (project.start_date && project.end_date) {
    tasks.push({
      id: `proj-${project.id}`,
      name: project.name,
      start: new Date(project.start_date),
      end: new Date(project.end_date),
      progress: overallProgress,
      type: "project",
      hideChildren: false,
    })
  }

  validSites.forEach((site) => {
    tasks.push({
      id: site.id,
      name: site.name,
      start: new Date(site.planned_start_date!),
      end: new Date(site.planned_completion_date!),
      progress: site.completion_percent || 0,
      type: "task",
      project: `proj-${project.id}`,
    })
  })

  return tasks
}

export default async function TimelinePage({ params }: { params: { id: string } }) {
  const tasks = await getTimelineData(params.id)

  return (
    <div className="space-y-6">
      <ProjectTimeline tasks={tasks} />
    </div>
  )
}
