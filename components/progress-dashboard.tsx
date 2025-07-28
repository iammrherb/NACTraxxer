"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Clock, CheckCircle, Users } from "lucide-react"
import { toast } from "sonner"

interface ProgressStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalSites: number
  completedSites: number
  overallProgress: number
  projectsByStatus: Array<{ name: string; value: number; color: string }>
  sitesByStatus: Array<{ name: string; value: number; color: string }>
  monthlyProgress: Array<{ month: string; completed: number; total: number }>
}

const COLORS = {
  Planning: "#8884d8",
  "In Progress": "#82ca9d",
  Complete: "#00C49F",
  "On Hold": "#FFBB28",
  Delayed: "#FF8042",
}

export function ProgressDashboard() {
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    fetchProgressStats()
  }, [timeRange])

  const fetchProgressStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stats?range=${timeRange}`)

      if (!response.ok) {
        throw new Error("Failed to fetch progress stats")
      }

      const data = await response.json()

      // Mock data structure - replace with actual API response
      const mockStats: ProgressStats = {
        totalProjects: data.stats?.totalProjects || 12,
        activeProjects: data.stats?.activeProjects || 8,
        completedProjects: data.stats?.completedProjects || 4,
        totalSites: data.stats?.totalSites || 156,
        completedSites: data.stats?.completedSites || 89,
        overallProgress: data.stats?.completionRate || 57,
        projectsByStatus: [
          { name: "Planning", value: 3, color: COLORS["Planning"] },
          { name: "In Progress", value: 5, color: COLORS["In Progress"] },
          { name: "Complete", value: 4, color: COLORS["Complete"] },
          { name: "On Hold", value: 0, color: COLORS["On Hold"] },
          { name: "Delayed", value: 0, color: COLORS["Delayed"] },
        ],
        sitesByStatus: [
          { name: "Not Started", value: 23, color: "#8884d8" },
          { name: "In Progress", value: 44, color: "#82ca9d" },
          { name: "Complete", value: 89, color: "#00C49F" },
          { name: "On Hold", value: 0, color: "#FFBB28" },
          { name: "Delayed", value: 0, color: "#FF8042" },
        ],
        monthlyProgress: [
          { month: "Jan", completed: 12, total: 20 },
          { month: "Feb", completed: 18, total: 25 },
          { month: "Mar", completed: 25, total: 30 },
          { month: "Apr", completed: 32, total: 40 },
          { month: "May", completed: 45, total: 50 },
          { month: "Jun", completed: 52, total: 60 },
        ],
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching progress stats:", error)
      toast.error("Failed to load progress data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load progress data</p>
        <Button onClick={fetchProgressStats} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
          <p className="text-gray-600">Track deployment progress across all projects</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active, {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSites}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedSites} completed ({Math.round((stats.completedSites / stats.totalSites) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallProgress}%</div>
            <Progress value={stats.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Projects in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Sites completed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.projectsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.projectsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Breakdown</CardTitle>
            <CardDescription>Detailed view of project statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.projectsByStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm font-medium">{status.name}</span>
                  </div>
                  <Badge variant="secondary">{status.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Status Breakdown</CardTitle>
            <CardDescription>Detailed view of site statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.sitesByStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm font-medium">{status.name}</span>
                  </div>
                  <Badge variant="secondary">{status.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
