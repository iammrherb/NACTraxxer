import { notFound } from "next/navigation"
import { mockProjects } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Clock, GanttChartSquare } from "lucide-react"
import type { Milestone, ProjectPhase } from "@/types"

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "On Track":
      return "success"
    case "At Risk":
      return "warning"
    case "Off Track":
      return "destructive"
    case "Completed":
      return "default"
    default:
      return "secondary"
  }
}

const getHealthColor = (score: number) => {
  if (score > 90) return "text-green-500"
  if (score > 70) return "text-yellow-500"
  return "text-red-500"
}

const PhaseStepper = ({ currentPhase }: { currentPhase: ProjectPhase }) => {
  const phases: ProjectPhase[] = ["Discovery", "Design", "Implementation", "Testing", "Deployment", "Optimization"]
  const currentIndex = phases.indexOf(currentPhase)

  return (
    <div className="flex items-center justify-between">
      {phases.map((phase, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <div key={phase} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5" /> : <GanttChartSquare className="h-5 w-5" />}
            </div>
            <p className={`mt-2 text-xs font-medium ${isCurrent ? "text-blue-600" : "text-muted-foreground"}`}>
              {phase}
            </p>
          </div>
        )
      })}
    </div>
  )
}

const MilestoneItem = ({ milestone }: { milestone: Milestone }) => {
  const getIcon = () => {
    switch (milestone.status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      case "Pending":
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }
  return (
    <div className="flex items-center gap-4">
      {getIcon()}
      <div>
        <p className="font-medium">{milestone.name}</p>
        <p className="text-sm text-muted-foreground">Due: {milestone.due_date}</p>
      </div>
    </div>
  )
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = mockProjects.find((p) => p.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-3xl">
              <Badge variant={getStatusBadgeVariant(project.status)} className="text-lg">
                {project.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Last updated 3 hours ago</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Health</CardDescription>
            <CardTitle className={`text-4xl ${getHealthColor(project.health_score.overall)}`}>
              {project.health_score.overall}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Schedule: {project.health_score.schedule}% | Budget: {project.health_score.budget}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Project Manager</CardDescription>
            <CardTitle className="text-2xl">{project.project_manager}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{project.customer}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion</CardDescription>
            <CardTitle className="text-4xl">{project.completion_percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={project.completion_percentage} aria-label={`${project.completion_percentage}% complete`} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Implementation Phase</CardTitle>
            <CardDescription>Current stage of the project lifecycle.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <PhaseStepper currentPhase={project.phase} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Milestones</CardTitle>
            <CardDescription>Upcoming and recently completed milestones.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {project.milestones.slice(0, 4).map((milestone) => (
              <MilestoneItem key={milestone.name} milestone={milestone} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
