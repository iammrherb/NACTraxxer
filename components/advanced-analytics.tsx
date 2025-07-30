"use client"

import { useState, useEffect } from "react"
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  BarChart3,
  LineChartIcon,
  PieChartIcon,
  CalendarIcon,
  Download,
  RefreshCw,
  ChevronDown,
  FileSpreadsheet,
  FileJson,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { exportData, formatAnalyticsDataForExport } from "@/lib/export-utils"
import { LoadingSpinner } from "@/components/loading"

// Sample data for demonstration
const sampleDeploymentData = {
  overview: {
    totalDeployments: 124,
    activeDeployments: 28,
    completedDeployments: 96,
    averageCompletionTime: "18.5 days",
    successRate: "94.2%",
  },
  trends: {
    deploymentsByMonth: [
      { month: "Jan", count: 8 },
      { month: "Feb", count: 12 },
      { month: "Mar", count: 15 },
      { month: "Apr", count: 10 },
      { month: "May", count: 18 },
      { month: "Jun", count: 22 },
      { month: "Jul", count: 17 },
      { month: "Aug", count: 14 },
      { month: "Sep", count: 8 },
    ],
    completionRateByMonth: [
      { month: "Jan", rate: 88 },
      { month: "Feb", rate: 90 },
      { month: "Mar", rate: 92 },
      { month: "Apr", rate: 91 },
      { month: "May", rate: 94 },
      { month: "Jun", rate: 96 },
      { month: "Jul", rate: 95 },
      { month: "Aug", rate: 97 },
      { month: "Sep", rate: 98 },
    ],
    issuesByType: [
      { type: "Configuration", count: 45 },
      { type: "Network", count: 32 },
      { type: "Authentication", count: 28 },
      { type: "Hardware", count: 15 },
      { type: "Software", count: 22 },
    ],
  },
  resources: {
    resourceUtilization: [
      { resource: "Network Engineers", utilized: 85, available: 15 },
      { resource: "System Admins", utilized: 72, available: 28 },
      { resource: "Security Analysts", utilized: 90, available: 10 },
      { resource: "Project Managers", utilized: 65, available: 35 },
    ],
    deploymentsByTeam: [
      { team: "Alpha", count: 42 },
      { team: "Beta", count: 38 },
      { team: "Gamma", count: 26 },
      { team: "Delta", count: 18 },
    ],
  },
  timeline: {
    averagePhaseCompletion: [
      { phase: "Planning", days: 5.2 },
      { phase: "Setup", days: 3.8 },
      { phase: "Deployment", days: 7.5 },
      { phase: "Testing", days: 4.2 },
      { phase: "Validation", days: 2.1 },
    ],
    deploymentDurationDistribution: [
      { range: "0-10 days", count: 28 },
      { range: "11-20 days", count: 45 },
      { range: "21-30 days", count: 32 },
      { range: "31-40 days", count: 12 },
      { range: "41+ days", count: 7 },
    ],
  },
  deployments: [
    {
      id: "DEP-001",
      siteName: "Headquarters",
      status: "Completed",
      startDate: "2023-01-15",
      completionDate: "2023-01-28",
      duration: "13 days",
      successRate: "98%",
      deviceCount: 245,
      issueCount: 3,
    },
    {
      id: "DEP-002",
      siteName: "Regional Office - East",
      status: "Completed",
      startDate: "2023-02-03",
      completionDate: "2023-02-18",
      duration: "15 days",
      successRate: "95%",
      deviceCount: 178,
      issueCount: 7,
    },
    {
      id: "DEP-003",
      siteName: "Data Center - North",
      status: "In Progress",
      startDate: "2023-08-28",
      completionDate: null,
      duration: "Ongoing",
      successRate: "92% (current)",
      deviceCount: 312,
      issueCount: 12,
    },
    {
      id: "DEP-004",
      siteName: "Branch Office - West",
      status: "Completed",
      startDate: "2023-03-10",
      completionDate: "2023-03-22",
      duration: "12 days",
      successRate: "97%",
      deviceCount: 86,
      issueCount: 2,
    },
    {
      id: "DEP-005",
      siteName: "Manufacturing Plant",
      status: "Completed",
      startDate: "2023-04-05",
      completionDate: "2023-04-25",
      duration: "20 days",
      successRate: "91%",
      deviceCount: 423,
      issueCount: 18,
    },
  ],
}

export function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(sampleDeploymentData)

  // Simulate data fetching
  const fetchData = async () => {
    setIsLoading(true)
    // In a real application, this would be an API call with the date range
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAnalyticsData(sampleDeploymentData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [dateRange])

  // Handle export functionality
  const handleExport = (format: "csv" | "excel" | "json", dataType: string) => {
    try {
      let dataToExport: any[] = []
      let filename = "portnox-analytics"

      // Format data based on the selected tab and data type
      switch (dataType) {
        case "overview":
          dataToExport = [analyticsData.overview]
          filename = "portnox-analytics-overview"
          break
        case "trends":
          if (analyticsData.trends.deploymentsByMonth) {
            dataToExport = analyticsData.trends.deploymentsByMonth
            filename = "portnox-analytics-deployment-trends"
          }
          break
        case "resources":
          if (analyticsData.resources.resourceUtilization) {
            dataToExport = analyticsData.resources.resourceUtilization
            filename = "portnox-analytics-resource-utilization"
          }
          break
        case "timeline":
          if (analyticsData.timeline.averagePhaseCompletion) {
            dataToExport = analyticsData.timeline.averagePhaseCompletion
            filename = "portnox-analytics-timeline"
          }
          break
        case "deployments":
          dataToExport = formatAnalyticsDataForExport(analyticsData)
          filename = "portnox-deployments-data"
          break
        default:
          dataToExport = formatAnalyticsDataForExport(analyticsData)
          filename = "portnox-analytics-data"
      }

      // Export the data in the selected format
      exportData(dataToExport, format, filename)
    } catch (error) {
      console.error("Error exporting data:", error)
      // In a real application, you would show a toast notification here
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your Portnox deployments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range as any)
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv", activeTab)}>
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel", activeTab)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json", activeTab)}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                    <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalDeployments}</div>
                    <p className="text-xs text-muted-foreground">Across all sites and environments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
                    <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.activeDeployments}</div>
                    <p className="text-xs text-muted-foreground">Currently in progress</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.averageCompletionTime}</div>
                    <p className="text-xs text-muted-foreground">From start to finish</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.successRate}</div>
                    <p className="text-xs text-muted-foreground">Deployments without critical issues</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Deployment Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={analyticsData.trends.deploymentsByMonth}
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
                    <CardTitle>Issue Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={analyticsData.trends.issuesByType}
                      index="type"
                      categories={["count"]}
                      colors={["blue", "cyan", "indigo", "violet", "emerald"]}
                      valueFormatter={(value) => `${value} issues`}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Deployments</CardTitle>
                  <CardDescription>Showing the 5 most recent deployments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">ID</th>
                          <th className="text-left font-medium p-2">Site</th>
                          <th className="text-left font-medium p-2">Status</th>
                          <th className="text-left font-medium p-2">Start Date</th>
                          <th className="text-left font-medium p-2">Completion</th>
                          <th className="text-left font-medium p-2">Duration</th>
                          <th className="text-left font-medium p-2">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.deployments.map((deployment) => (
                          <tr key={deployment.id} className="border-b">
                            <td className="p-2">{deployment.id}</td>
                            <td className="p-2">{deployment.siteName}</td>
                            <td className="p-2">
                              <Badge variant={deployment.status === "Completed" ? "outline" : "secondary"}>
                                {deployment.status}
                              </Badge>
                            </td>
                            <td className="p-2">{deployment.startDate}</td>
                            <td className="p-2">{deployment.completionDate || "In Progress"}</td>
                            <td className="p-2">{deployment.duration}</td>
                            <td className="p-2">{deployment.successRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline">Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployments by Month</CardTitle>
                    <CardDescription>Number of deployments initiated each month</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={analyticsData.trends.deploymentsByMonth}
                      index="month"
                      categories={["count"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value} deployments`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rate Trend</CardTitle>
                    <CardDescription>Percentage of successful deployments by month</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChart
                      data={analyticsData.trends.completionRateByMonth}
                      index="month"
                      categories={["rate"]}
                      colors={["green"]}
                      valueFormatter={(value) => `${value}%`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Issues by Type</CardTitle>
                  <CardDescription>Distribution of issues encountered during deployments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <DonutChart
                        data={analyticsData.trends.issuesByType}
                        index="type"
                        categories={["count"]}
                        colors={["blue", "cyan", "indigo", "violet", "emerald"]}
                        valueFormatter={(value) => `${value} issues`}
                        height={300}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Issue Breakdown</h4>
                      <div className="space-y-2">
                        {analyticsData.trends.issuesByType.map((issue) => (
                          <div key={issue.type} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full mr-2",
                                  issue.type === "Configuration" && "bg-blue-500",
                                  issue.type === "Network" && "bg-cyan-500",
                                  issue.type === "Authentication" && "bg-indigo-500",
                                  issue.type === "Hardware" && "bg-violet-500",
                                  issue.type === "Software" && "bg-emerald-500",
                                )}
                              />
                              <span>{issue.type}</span>
                            </div>
                            <span className="font-medium">{issue.count}</span>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Issues</span>
                        <span className="font-medium">
                          {analyticsData.trends.issuesByType.reduce((acc, issue) => acc + issue.count, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                    <CardDescription>Current allocation of resources across deployments</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={analyticsData.resources.resourceUtilization}
                      index="resource"
                      categories={["utilized", "available"]}
                      colors={["blue", "gray"]}
                      stack
                      valueFormatter={(value) => `${value}%`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployments by Team</CardTitle>
                    <CardDescription>Number of deployments handled by each team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={analyticsData.resources.deploymentsByTeam}
                      index="team"
                      categories={["count"]}
                      colors={["blue", "cyan", "indigo", "violet"]}
                      valueFormatter={(value) => `${value} deployments`}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation Details</CardTitle>
                  <CardDescription>Detailed breakdown of resource utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Resource Type</th>
                          <th className="text-left font-medium p-2">Total Capacity</th>
                          <th className="text-left font-medium p-2">Utilized</th>
                          <th className="text-left font-medium p-2">Available</th>
                          <th className="text-left font-medium p-2">Utilization %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.resources.resourceUtilization.map((resource) => (
                          <tr key={resource.resource} className="border-b">
                            <td className="p-2">{resource.resource}</td>
                            <td className="p-2">100</td>
                            <td className="p-2">{resource.utilized}</td>
                            <td className="p-2">{resource.available}</td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${resource.utilized}%` }}
                                  ></div>
                                </div>
                                <span>{resource.utilized}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Phase Completion</CardTitle>
                    <CardDescription>Average days to complete each deployment phase</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={analyticsData.timeline.averagePhaseCompletion}
                      index="phase"
                      categories={["days"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value} days`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Duration Distribution</CardTitle>
                    <CardDescription>Number of deployments by duration range</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={analyticsData.timeline.deploymentDurationDistribution}
                      index="range"
                      categories={["count"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value} deployments`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment Timeline Analysis</CardTitle>
                  <CardDescription>Detailed analysis of deployment timelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Total Deployment Time Breakdown</h4>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                              Planning
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-800">
                              {analyticsData.timeline.averagePhaseCompletion[0].days} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                          <div
                            style={{ width: "23%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-800">
                              Setup
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-indigo-800">
                              {analyticsData.timeline.averagePhaseCompletion[1].days} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                          <div
                            style={{ width: "17%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                          ></div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800">
                              Deployment
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-800">
                              {analyticsData.timeline.averagePhaseCompletion[2].days} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                          <div
                            style={{ width: "33%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-pink-200 text-pink-800">
                              Testing
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-pink-800">
                              {analyticsData.timeline.averagePhaseCompletion[3].days} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                          <div
                            style={{ width: "18%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                          ></div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                              Validation
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-800">
                              {analyticsData.timeline.averagePhaseCompletion[4].days} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                          <div
                            style={{ width: "9%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-4">Key Timeline Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Average Total Duration</div>
                          <div className="text-2xl font-bold">
                            {analyticsData.timeline.averagePhaseCompletion
                              .reduce((acc, phase) => acc + phase.days, 0)
                              .toFixed(1)}{" "}
                            days
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Longest Phase</div>
                          <div className="text-2xl font-bold">Deployment</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Most Common Duration</div>
                          <div className="text-2xl font-bold">11-20 days</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Optimization Target</div>
                          <div className="text-2xl font-bold">-15%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
