"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SiteStats } from "@/lib/database"
import { CheckCircle, Clock, ListTodo, Users, AlertTriangle } from "lucide-react"

interface ProgressDashboardProps {
  stats: SiteStats
}

export default function ProgressDashboard({ stats }: ProgressDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overall_completion}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completed_sites} of {stats.total_sites} sites complete
          </p>
          <Progress value={stats.overall_completion} className="mt-2 h-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sites In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.in_progress_sites}</div>
          <p className="text-xs text-muted-foreground">Currently active deployments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Sites</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{stats.delayed_sites}</div>
          <p className="text-xs text-muted-foreground">Sites needing attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_users.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all sites in project</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checklist Completion</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.checklist_completion}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completed_checklist_items} of {stats.total_checklist_items} tasks done
          </p>
          <Progress value={stats.checklist_completion} className="mt-2 h-2" />
        </CardContent>
      </Card>
    </div>
  )
}
