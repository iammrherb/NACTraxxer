import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockProjects } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, GanttChartSquare, LayoutDashboard, ListTodo, Settings, Telescope } from "lucide-react"

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

export default function ProjectLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  const project = mockProjects.find((p) => p.id === params.id)

  if (!project) {
    notFound()
  }

  const tabs = [
    { name: "Overview", href: `/projects/${project.id}`, icon: LayoutDashboard },
    { name: "Scoping", href: `/projects/${project.id}/scoping`, icon: Telescope },
    { name: "Timeline", href: `/projects/${project.id}/timeline`, icon: GanttChartSquare },
    { name: "Sites", href: `/projects/${project.id}/sites`, icon: ListTodo },
    { name: "Reports", href: `/projects/${project.id}/reports`, icon: FileText },
    { name: "Settings", href: `/projects/${project.id}/settings`, icon: Settings },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">
            Customer: {project.customer} ({project.id})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(project.status)} className="text-base">
            {project.status}
          </Badge>
          <Button>Export Report</Button>
        </div>
      </div>
      <Tabs defaultValue={tabs[0].href} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.href} asChild>
              <Link href={tab.href}>
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
