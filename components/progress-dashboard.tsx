import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SiteStats } from "@/lib/database"

interface ProgressDashboardProps {
  stats: SiteStats
}

export default function ProgressDashboard({ stats }: ProgressDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress Overview</CardTitle>
        <CardDescription>High-level statistics for this project.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground">Overall Site Completion</span>
            <span className="text-sm font-bold">{stats.overall_completion.toFixed(1)}%</span>
          </div>
          <Progress value={stats.overall_completion} aria-label={`${stats.overall_completion}% complete`} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <span className="text-lg font-bold">{stats.total_sites}</span>
            <span className="text-xs text-muted-foreground">Total Sites</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <span className="text-lg font-bold text-green-600">{stats.completed_sites}</span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <span className="text-lg font-bold text-blue-600">{stats.in_progress_sites}</span>
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <span className="text-lg font-bold text-red-600">{stats.delayed_sites}</span>
            <span className="text-xs text-muted-foreground">Delayed</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground">Deployment Checklist Completion</span>
            <span className="text-sm font-bold">{stats.checklist_completion.toFixed(1)}%</span>
          </div>
          <Progress value={stats.checklist_completion} aria-label={`${stats.checklist_completion}% complete`} />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {stats.completed_checklist_items} / {stats.total_checklist_items} items completed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
