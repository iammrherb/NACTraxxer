"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { SiteStats, Milestone } from "@/lib/database"
import { Skeleton } from "@/components/ui/skeleton"

interface ProgressDashboardProps {
  stats: SiteStats | null
  milestones: Milestone[]
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-32 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
)

export function ProgressDashboard({ stats, milestones }: ProgressDashboardProps) {
  const sites = stats?.sites || []

  const statusData = [
    { name: "Complete", value: stats?.completed_sites, color: "#10b981" },
    { name: "In Progress", value: stats?.in_progress_sites, color: "#3b82f6" },
    { name: "Planned", value: stats?.planned_sites, color: "#6b7280" },
    { name: "Delayed", value: stats?.delayed_sites, color: "#ef4444" },
  ]

  const milestoneStats = useMemo(() => {
    if (!milestones || milestones.length === 0) return { completed: 0, total: 0, percentage: 0 }
    const completed = milestones.filter((m) => m.status === "completed").length
    const total = milestones.length
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [milestones])

  const phaseData = useMemo(() => {
    if (!sites || sites.length === 0) return []
    const phases = sites.reduce(
      (acc, site) => {
        const phase = `Phase ${site.phase}`
        acc[phase] = (acc[phase] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(phases).map(([phase, count]) => ({
      phase,
      count,
      completed: sites.filter((site) => `Phase ${site.phase}` === phase && site.status === "Complete").length,
    }))
  }, [sites])

  if (!stats) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sites}</div>
            <p className="text-xs text-muted-foreground">{stats.total_users.toLocaleString()} total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed_sites}</div>
            <p className="text-xs text-muted-foreground">{stats.overall_completion}% of all sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{milestoneStats.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {milestoneStats.completed} of {milestoneStats.total} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklist Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checklist_completion}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed_checklist_items} of {stats.total_checklist_items} items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Site Completion</span>
                <span>{stats.overall_completion}%</span>
              </div>
              <Progress value={stats.overall_completion} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Milestone Completion</span>
                <span>{milestoneStats.percentage}%</span>
              </div>
              <Progress value={milestoneStats.percentage} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <BarChart data={phaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total Sites" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
