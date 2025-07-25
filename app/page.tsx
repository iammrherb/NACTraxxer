import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockDashboardMetrics, mockProjects, mockUser } from "@/lib/mock-data"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const recentProjects = mockProjects.slice(0, 5)

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Welcome back, {mockUser.name.split(" ")[0]}!</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {mockDashboardMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.changeType === "increase" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>{" "}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>An overview of your most recently active projects.</CardDescription>
            </div>
            <Link href="/projects" className="ml-auto">
              <button className="px-4 py-2 text-sm font-medium text-primary hover:underline">View All</button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="grid items-center gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.completion_percentage}%</div>
                  </div>
                  <Progress
                    value={project.completion_percentage}
                    aria-label={`${project.completion_percentage}% complete`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Tasks assigned to you across all projects.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            {/* Mock tasks */}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">Review Firewall Rules</div>
                <div className="text-muted-foreground">PROJ-001</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-destructive">Due Today</div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">Approve POC Test Plan</div>
                <div className="text-muted-foreground">PROJ-002</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">Due in 3 days</div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">Onboard New Engineer</div>
                <div className="text-muted-foreground">Internal</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">Due next week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
