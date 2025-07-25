import type { Project } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"

interface ProjectStatCardsProps {
  projects: Project[]
}

export function ProjectStatCards({ projects }: ProjectStatCardsProps) {
  const totalProjects = projects.length
  const onTrack = projects.filter((p) => p.status === "On Track").length
  const atRisk = projects.filter((p) => p.status === "At Risk").length
  const offTrack = projects.filter((p) => p.status === "Off Track").length
  const completed = projects.filter((p) => p.status === "Completed").length

  const stats = [
    { title: "Total Projects", value: totalProjects, icon: Package, color: "text-blue-500" },
    { title: "On Track", value: onTrack, icon: CheckCircle, color: "text-green-500" },
    { title: "At Risk", value: atRisk, icon: AlertTriangle, color: "text-yellow-500" },
    { title: "Off Track", value: offTrack, icon: XCircle, color: "text-red-500" },
    { title: "Completed", value: completed, icon: Clock, color: "text-gray-500" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {((stat.value / totalProjects) * 100 || 0).toFixed(0)}% of total projects
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
