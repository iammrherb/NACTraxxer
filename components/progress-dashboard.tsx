"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { SiteStats } from "@/lib/database"

interface ProgressDashboardProps {
  stats: SiteStats
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  // Safely access the sites array from the stats object.
  const sites = stats.sites || []

  const statusData = [
    { name: "Complete", value: stats.completed_sites, color: "#10b981" },
    { name: "In Progress", value: stats.in_progress_sites, color: "#3b82f6" },
    { name: "Planned", value: stats.planned_sites, color: "#6b7280" },
    { name: "Delayed", value: stats.delayed_sites, color: "#ef4444" },
  ]

  const regionData = useMemo(() => {
    if (!sites || sites.length === 0) return []
    const regions = sites.reduce(
      (acc, site) => {
        acc[site.region] = (acc[site.region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(regions).map(([region, count]) => ({
      region,
      count,
      completed: sites.filter((site) => site.region === region && site.status === "Complete").length,
    }))
  }, [sites])

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
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.in_progress_sites}</div>
            <p className="text-xs text-muted-foreground">Currently being deployed</p>
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
                <span>Checklist Items</span>
                <span>{stats.checklist_completion}%</span>
              </div>
              <Progress value={stats.checklist_completion} className="h-3" />
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

        {/* Regional Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
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

      {/* Site Progress List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Site Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sites
              .sort((a, b) => b.completion_percent - a.completion_percent)
              .map((site) => (
                <div key={site.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {site.name} ({site.id})
                      </span>
                      <span className="text-sm text-muted-foreground">{site.completion_percent}%</span>
                    </div>
                    <Progress value={site.completion_percent} className="h-2" />
                  </div>
                  <div className="ml-4 text-sm text-muted-foreground">{site.status}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
