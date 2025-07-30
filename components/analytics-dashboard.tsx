"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Building,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Activity,
  Zap,
} from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface AnalyticsData {
  deploymentProgress: Array<{
    name: string
    completed: number
    total: number
    percentage: number
  }>
  siteStatus: Array<{
    name: string
    value: number
    color: string
  }>
  monthlyProgress: Array<{
    month: string
    sites: number
    useCases: number
    milestones: number
  }>
  kpis: {
    totalSites: number
    completedSites: number
    activeProjects: number
    avgCompletionTime: number
    successRate: number
    upcomingDeadlines: number
  }
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: AnalyticsData = {
          deploymentProgress: [
            { name: "Planning", completed: 8, total: 10, percentage: 80 },
            { name: "Implementation", completed: 12, total: 20, percentage: 60 },
            { name: "Testing", completed: 15, total: 18, percentage: 83 },
            { name: "Production", completed: 5, total: 8, percentage: 63 },
            { name: "Maintenance", completed: 3, total: 5, percentage: 60 },
          ],
          siteStatus: [
            { name: "Completed", value: 25, color: "#00C49F" },
            { name: "In Progress", value: 35, color: "#0088FE" },
            { name: "Planning", value: 20, color: "#FFBB28" },
            { name: "On Hold", value: 10, color: "#FF8042" },
            { name: "Issues", value: 10, color: "#8884D8" },
          ],
          monthlyProgress: [
            { month: "Jan", sites: 4, useCases: 12, milestones: 8 },
            { month: "Feb", sites: 6, useCases: 18, milestones: 12 },
            { month: "Mar", sites: 8, useCases: 24, milestones: 16 },
            { month: "Apr", sites: 12, useCases: 36, milestones: 24 },
            { month: "May", sites: 15, useCases: 45, milestones: 30 },
            { month: "Jun", sites: 18, useCases: 54, milestones: 36 },
          ],
          kpis: {
            totalSites: 100,
            completedSites: 25,
            activeProjects: 35,
            avgCompletionTime: 45,
            successRate: 92,
            upcomingDeadlines: 8,
          },
        }

        setData(mockData)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const { deploymentProgress, siteStatus, monthlyProgress, kpis } = data

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalSites}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sites</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.completedSites}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgCompletionTime}d</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -5 days from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Deployment Progress</TabsTrigger>
          <TabsTrigger value="status">Site Status</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Progress by Phase</CardTitle>
              <CardDescription>Current progress across all deployment phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentProgress.map((phase, index) => (
                  <div key={phase.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{phase.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {phase.completed}/{phase.total} ({phase.percentage}%)
                      </span>
                    </div>
                    <Progress value={phase.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Status Distribution</CardTitle>
              <CardDescription>Overview of site deployment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={siteStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {siteStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress Trends</CardTitle>
              <CardDescription>Sites, use cases, and milestones completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sites" stackId="1" stroke="#8884d8" fill="#8884d8" name="Sites" />
                    <Area
                      type="monotone"
                      dataKey="useCases"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Use Cases"
                    />
                    <Area
                      type="monotone"
                      dataKey="milestones"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Milestones"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Deployment Velocity</span>
              <Badge variant="secondary">2.3 sites/week</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Issue Resolution Time</span>
              <Badge variant="secondary">1.2 days avg</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Resource Utilization</span>
              <Badge variant="secondary">78%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <Badge variant="secondary">4.6/5.0</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">3 sites approaching deadline</p>
                <p className="text-xs text-muted-foreground">Review and prioritize</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Zap className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New integration available</p>
                <p className="text-xs text-muted-foreground">Portnox Cloud v2.1</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">5 sites completed this week</p>
                <p className="text-xs text-muted-foreground">Ahead of schedule</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
