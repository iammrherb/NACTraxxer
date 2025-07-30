"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, PieChart } from "@/components/ui/chart"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Building,
  CheckCircle,
  ChevronRight,
  FileText,
  Flag,
  Layers,
  Network,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading"

// Sample data for demonstration
const sampleDashboardData = {
  overview: {
    totalSites: 24,
    activeSites: 18,
    completedSites: 6,
    totalDeployments: 124,
    activeDeployments: 28,
    completedDeployments: 96,
    totalDevices: 3842,
    onboardedDevices: 2956,
    pendingDevices: 886,
    overallProgress: 76,
  },
  recentActivity: [
    {
      id: "act-001",
      type: "deployment",
      title: "Deployment completed",
      description: "Headquarters deployment completed successfully",
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      id: "act-002",
      type: "issue",
      title: "Authentication issue detected",
      description: "Multiple authentication failures at East Branch",
      timestamp: "4 hours ago",
      status: "warning",
    },
    {
      id: "act-003",
      type: "milestone",
      title: "Milestone reached",
      description: "50% of devices onboarded at West Campus",
      timestamp: "Yesterday",
      status: "info",
    },
    {
      id: "act-004",
      type: "report",
      title: "Monthly report generated",
      description: "August deployment summary report is ready",
      timestamp: "Yesterday",
      status: "info",
    },
    {
      id: "act-005",
      type: "deployment",
      title: "New deployment started",
      description: "South Branch deployment initiated",
      timestamp: "2 days ago",
      status: "info",
    },
  ],
  upcomingMilestones: [
    {
      id: "mil-001",
      title: "Complete Phase 1 Deployment",
      site: "Headquarters",
      dueDate: "2023-10-15",
      progress: 85,
    },
    {
      id: "mil-002",
      title: "Security Compliance Review",
      site: "All Sites",
      dueDate: "2023-10-22",
      progress: 40,
    },
    {
      id: "mil-003",
      title: "Network Integration Testing",
      site: "East Branch",
      dueDate: "2023-10-30",
      progress: 20,
    },
  ],
  deploymentStats: {
    byStatus: [
      { status: "Completed", count: 96 },
      { status: "In Progress", count: 22 },
      { status: "Planned", count: 6 },
    ],
    byType: [
      { type: "Initial", count: 42 },
      { type: "Upgrade", count: 56 },
      { type: "Expansion", count: 26 },
    ],
    monthlyTrend: [
      { month: "Apr", count: 8 },
      { month: "May", count: 12 },
      { month: "Jun", count: 15 },
      { month: "Jul", count: 10 },
      { month: "Aug", count: 18 },
      { month: "Sep", count: 22 },
    ],
  },
}

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(sampleDashboardData)

  // Simulate data fetching
  const fetchData = async () => {
    setIsLoading(true)
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDashboardData(sampleDashboardData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to your Portnox deployment dashboard</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 lg:w-[800px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.overview.totalSites}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.overview.activeSites} active, {dashboardData.overview.completedSites} completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.overview.totalDeployments}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.overview.activeDeployments} active, {dashboardData.overview.completedDeployments}{" "}
                      completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Devices</CardTitle>
                    <Network className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.overview.totalDevices}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.overview.onboardedDevices} onboarded, {dashboardData.overview.pendingDevices}{" "}
                      pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.overview.overallProgress}%</div>
                    <Progress value={dashboardData.overview.overallProgress} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Deployment Trend</CardTitle>
                    <CardDescription>Monthly deployment activity</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChart
                      data={dashboardData.deploymentStats.monthlyTrend}
                      index="month"
                      categories={["count"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value} deployments`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Deployment Status</CardTitle>
                    <CardDescription>Current deployment status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={dashboardData.deploymentStats.byStatus}
                      index="status"
                      categories={["count"]}
                      colors={["green", "blue", "amber"]}
                      valueFormatter={(value) => `${value} deployments`}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {dashboardData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4">
                            <div
                              className={cn(
                                "mt-0.5 rounded-full p-1",
                                activity.status === "success" && "bg-green-100",
                                activity.status === "warning" && "bg-amber-100",
                                activity.status === "info" && "bg-blue-100",
                              )}
                            >
                              {activity.type === "deployment" && (
                                <Layers
                                  className={cn(
                                    "h-4 w-4",
                                    activity.status === "success" && "text-green-600",
                                    activity.status === "warning" && "text-amber-600",
                                    activity.status === "info" && "text-blue-600",
                                  )}
                                />
                              )}
                              {activity.type === "issue" && (
                                <AlertCircle
                                  className={cn(
                                    "h-4 w-4",
                                    activity.status === "success" && "text-green-600",
                                    activity.status === "warning" && "text-amber-600",
                                    activity.status === "info" && "text-blue-600",
                                  )}
                                />
                              )}
                              {activity.type === "milestone" && (
                                <Flag
                                  className={cn(
                                    "h-4 w-4",
                                    activity.status === "success" && "text-green-600",
                                    activity.status === "warning" && "text-amber-600",
                                    activity.status === "info" && "text-blue-600",
                                  )}
                                />
                              )}
                              {activity.type === "report" && (
                                <FileText
                                  className={cn(
                                    "h-4 w-4",
                                    activity.status === "success" && "text-green-600",
                                    activity.status === "warning" && "text-amber-600",
                                    activity.status === "info" && "text-blue-600",
                                  )}
                                />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Upcoming Milestones</CardTitle>
                    <CardDescription>Deadlines and deliverables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.upcomingMilestones.map((milestone) => (
                        <div key={milestone.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{milestone.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {milestone.site} • Due {milestone.dueDate}
                              </p>
                            </div>
                            <Badge variant="outline">{milestone.progress}%</Badge>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Milestones
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <Building className="h-5 w-5 mb-1" />
                        <span className="text-xs">Add Site</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <Layers className="h-5 w-5 mb-1" />
                        <span className="text-xs">New Deployment</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <FileText className="h-5 w-5 mb-1" />
                        <span className="text-xs">Generate Report</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <Users className="h-5 w-5 mb-1" />
                        <span className="text-xs">Manage Users</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Deployment Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dashboardData.deploymentStats.byType.map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full mr-2",
                                item.type === "Initial" && "bg-blue-500",
                                item.type === "Upgrade" && "bg-green-500",
                                item.type === "Expansion" && "bg-purple-500",
                              )}
                            />
                            <span className="text-sm">{item.type}</span>
                          </div>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("sites")}>
                        <Building className="mr-2 h-4 w-4" />
                        Sites
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("projects")}>
                        <Layers className="mr-2 h-4 w-4" />
                        Projects
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("use-cases")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Use Cases
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("milestones")}>
                        <Flag className="mr-2 h-4 w-4" />
                        Milestones
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("analytics")}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("reports")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Reports
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sites">
              <Card>
                <CardHeader>
                  <CardTitle>Sites Management</CardTitle>
                  <CardDescription>Manage all your deployment sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Sites content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects Management</CardTitle>
                  <CardDescription>Manage all your deployment projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Projects content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="use-cases">
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                  <CardDescription>Manage deployment use cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Use cases content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones">
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>Track deployment milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Milestones content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Deployment analytics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Analytics content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and manage reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Reports content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20">Notifications content will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
