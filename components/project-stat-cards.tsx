import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ListTodo, ShieldAlert, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type ProjectStats = {
  totalSites: number
  completedSites: number
  issues: number
  avgCompletion: number
}

async function getProjectStats(projectId: string): Promise<ProjectStats> {
  const supabase = createClient()

  const { count: totalSites, error: totalSitesError } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)

  if (totalSitesError) console.error("Error fetching total sites:", totalSitesError.message)

  const { count: completedSites, error: completedSitesError } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("status", "Complete")

  if (completedSitesError) console.error("Error fetching completed sites:", completedSitesError.message)

  // Mocking issues as this is not yet implemented
  const issues = 0
  const avgCompletion = totalSites && completedSites ? Math.round((completedSites / totalSites) * 100) : 0

  return {
    totalSites: totalSites ?? 0,
    completedSites: completedSites ?? 0,
    issues,
    avgCompletion,
  }
}

export async function ProjectStatCards({ projectId }: { projectId: string }) {
  const stats = await getProjectStats(projectId)

  const statCards = [
    {
      title: "Total Sites",
      value: stats.totalSites,
      icon: ListTodo,
      description: "Total number of sites in this project.",
    },
    {
      title: "Completed Sites",
      value: stats.completedSites,
      icon: CheckCircle,
      description: "Sites that are fully deployed.",
    },
    {
      title: "Avg. Completion",
      value: `${stats.avgCompletion}%`,
      icon: TrendingUp,
      description: "Average progress across all sites.",
    },
    {
      title: "Open Issues",
      value: stats.issues,
      icon: ShieldAlert,
      description: "Number of tracked issues.",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
