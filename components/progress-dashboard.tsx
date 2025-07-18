"use client"

import { useMemo, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface Site {
  id: string
  name: string
  location: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  progress: number
  vendor: string
  deviceType: string
  lastUpdated: string
  assignedTo: string
  priority: "high" | "medium" | "low"
  notes?: string
  users_count?: number
  checklist_items?: Array<{ completed: boolean }>
  region?: string
  phase?: number
  completion_percent?: number
}

interface ProgressDashboardProps {
  sites?: Site[]
}

export function ProgressDashboard({ sites = [] }: ProgressDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [sitesData, setSitesData] = useState<Site[]>([])

  useEffect(() => {
    // If sites prop is provided, use it
    if (sites && sites.length > 0) {
      setSitesData(sites)
      setLoading(false)
    } else {
      // Otherwise, fetch from API
      fetchSites()
    }
  }, [sites])

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/sites")
      if (response.ok) {
        const data = await response.json()
        setSitesData(Array.isArray(data) ? data : [])
      } else {
        setSitesData([])
      }
    } catch (error) {
      console.error("Error fetching sites:", error)
      setSitesData([])
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    if (!Array.isArray(sitesData) || sitesData.length === 0) {
      return {
        totalSites: 0,
        completedSites: 0,
        inProgressSites: 0,
        plannedSites: 0,
        delayedSites: 0,
        totalUsers: 0,
        overallCompletion: 0,
        checklistCompletion: 0,
        totalChecklistItems: 0,
        completedChecklistItems: 0,
      }
    }

    const totalSites = sitesData.length
    const completedSites = sitesData.filter((site) => site.status === "completed").length
    const inProgressSites = sitesData.filter((site) => site.status === "in-progress").length
    const plannedSites = sitesData.filter((site) => site.status === "planning").length
    const delayedSites = sitesData.filter((site) => site.status === "on-hold").length
    const totalUsers = sitesData.reduce((sum, site) => sum + (site.users_count || 0), 0)
    const overallCompletion = totalSites > 0 ? Math.round((completedSites / totalSites) * 100) : 0

    // Calculate checklist completion
    const totalChecklistItems = sitesData.reduce((sum, site) => {
      return sum + (site.checklist_items?.length || 0)
    }, 0)

    const completedChecklistItems = sitesData.reduce((sum, site) => {
      return sum + (site.checklist_items?.filter((item) => item.completed).length || 0)
    }, 0)

    const checklistCompletion =
      totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0

    return {
      totalSites,
      completedSites,
      inProgressSites,
      plannedSites,
      delayedSites,
      totalUsers,
      overallCompletion,
      checklistCompletion,
      totalChecklistItems,
      completedChecklistItems,
    }
  }, [sitesData])

  const statusData = [
    { name: "Complete", value: stats.completedSites, color: "#10b981" },
    { name: "In Progress", value: stats.inProgressSites, color: "#3b82f6" },
    { name: "Planned", value: stats.plannedSites, color: "#6b7280" },
    { name: "Delayed", value: stats.delayedSites, color: "#ef4444" },
  ]

  const regionData = useMemo(() => {
    if (!Array.isArray(sitesData) || sitesData.length === 0) return []

    const regions = sitesData.reduce(
      (acc, site) => {
        const region = site.region || "Unknown"
        acc[region] = (acc[region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(regions).map(([region, count]) => ({
      region,
      count,
      completed: sitesData.filter((site) => (site.region || "Unknown") === region && site.status === "completed")
        .length,
    }))
  }, [sitesData])

  const phaseData = useMemo(() => {
    if (!Array.isArray(sitesData) || sitesData.length === 0) return []

    const phases = sitesData.reduce(
      (acc, site) => {
        const phase = `Phase ${site.phase || 1}`
        acc[phase] = (acc[phase] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(phases).map(([phase, count]) => ({
      phase,
      count,
      completed: sitesData.filter((site) => `Phase ${site.phase || 1}` === phase && site.status === "completed").length,
    }))
  }, [sitesData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
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
            <div className="text-2xl font-bold">{stats.totalSites}</div>
            <p className="text-xs text-muted-foreground">{stats.totalUsers.toLocaleString()} total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedSites}</div>
            <p className="text-xs text-muted-foreground">{stats.overallCompletion}% of all sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressSites}</div>
            <p className="text-xs text-muted-foreground">Currently being deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklist Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checklistCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedChecklistItems} of {stats.totalChecklistItems} items
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
                <span>{stats.overallCompletion}%</span>
              </div>
              <Progress value={stats.overallCompletion} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Checklist Items</span>
                <span>{stats.checklistCompletion}%</span>
              </div>
              <Progress value={stats.checklistCompletion} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {sitesData.length > 0 && (
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
          {regionData.length > 0 && (
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
          )}
        </div>
      )}

      {/* Phase Progress */}
      {phaseData.length > 0 && (
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
      )}

      {/* Site Progress List */}
      {sitesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Site Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sitesData
                .sort((a, b) => (b.completion_percent || b.progress || 0) - (a.completion_percent || a.progress || 0))
                .map((site) => (
                  <div key={site.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {site.name} ({site.id})
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {site.completion_percent || site.progress || 0}%
                        </span>
                      </div>
                      <Progress value={site.completion_percent || site.progress || 0} className="h-2" />
                    </div>
                    <div className="ml-4 text-sm text-muted-foreground">{site.status}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sitesData.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No sites data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
