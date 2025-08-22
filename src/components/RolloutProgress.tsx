"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { CalendarDays, Clock, Users, HardDrive, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import { storage, type Site } from "../lib/storage"
import { simulationMetrics } from "../lib/simulation-metrics"

interface ProgressMetrics {
  overallProgress: number
  sitesCompleted: number
  sitesInProgress: number
  sitesPlanning: number
  totalDevicesDeployed: number
  totalUsersOnboarded: number
  averageTimeToComplete: number
  upcomingMilestones: Array<{
    id: string
    title: string
    date: string
    status: string
    priority: string
  }>
}

export default function RolloutProgress() {
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState(simulationMetrics.getMetrics())
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  useEffect(() => {
    const loadSitesAndCalculateMetrics = async () => {
      const loadedSites = await storage.getSites()
      setSites(loadedSites)
      
      // Calculate progress metrics
      const totalSites = loadedSites.length
      const completedSites = loadedSites.filter(s => s.status === "completed").length
      const inProgressSites = loadedSites.filter(s => s.status === "in-progress").length
      const planningSites = loadedSites.filter(s => s.status === "planning").length
      
      const totalDevices = loadedSites.reduce((sum, site) => sum + (typeof site.devices === 'number' ? site.devices : 0), 0)
      const totalUsers = loadedSites.reduce((sum, site) => sum + (site.users || 0), 0)
    
    const overallProgress = totalSites > 0 ? Math.round((completedSites / totalSites) * 100) : 0

    const upcomingMilestones = [
      {
        id: "1",
        title: "Healthcare Main Campus - Phase 1 Complete",
        date: "2024-01-15",
        status: "in-progress",
        priority: "high"
      },
      {
        id: "2", 
        title: "Financial HQ Trading Floor Deployment",
        date: "2024-01-22",
        status: "planning",
        priority: "critical"
      },
      {
        id: "3",
        title: "Manufacturing Plant OT Integration",
        date: "2024-02-05",
        status: "planning", 
        priority: "high"
      },
      {
        id: "4",
        title: "Retail Chain POS System Integration",
        date: "2024-02-12",
        status: "planning",
        priority: "medium"
      }
    ]

    setMetrics({
      overallProgress,
      sitesCompleted: completedSites,
      sitesInProgress: inProgressSites,
      sitesPlanning: planningSites,
      totalDevicesDeployed: Math.round(totalDevices * 0.65), // Assume 65% deployed
      totalUsersOnboarded: Math.round(totalUsers * 0.72), // Assume 72% onboarded
      averageTimeToComplete: 14.5, // weeks
      upcomingMilestones
    })

    // Update real-time metrics periodically
    const interval = setInterval(() => {
      setRealTimeMetrics(simulationMetrics.generateRealTimeMetrics())
    }, 3000)

    return () => clearInterval(interval)
    }
    
    loadSitesAndCalculateMetrics()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200" 
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Rollout Progress</h2>
            <p className="text-muted-foreground">Track deployment progress across all sites</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.overallProgress}%</div>
            <Progress value={metrics.overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.sitesCompleted} of {sites.length} sites completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Completed</span>
                <span className="font-medium">{metrics.sitesCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">In Progress</span>
                <span className="font-medium">{metrics.sitesInProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600">Planning</span>
                <span className="font-medium">{metrics.sitesPlanning}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices & Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <HardDrive className="h-3 w-3 mr-1" />
                  <span>Devices</span>
                </div>
                <span className="text-sm font-medium">{metrics.totalDevicesDeployed.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Users</span>
                </div>
                <span className="text-sm font-medium">{metrics.totalUsersOnboarded.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageTimeToComplete}</div>
            <p className="text-xs text-muted-foreground">weeks per site</p>
            <p className="text-xs text-green-600 mt-1">↓ 2.3 weeks improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sites">Site Progress</TabsTrigger>
          <TabsTrigger value="milestones">Upcoming Milestones</TabsTrigger>
          <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-4">
          <div className="grid gap-4">
            {sites.map((site) => {
              const progress = site.completionPercent || Math.floor(Math.random() * 100)
              return (
                <Card key={site.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{site.name}</h4>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(site.priority || "medium")} variant="outline">
                          {site.priority || "medium"}
                        </Badge>
                        <Badge variant={site.status === "completed" ? "default" : "secondary"}>
                          {site.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Users:</span>
                        <span className="ml-2 font-medium">{site.users?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Devices:</span>
                        <span className="ml-2 font-medium">{site.devices?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="ml-2 font-medium">${site.budget?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="grid gap-4">
            {metrics.upcomingMilestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(milestone.status)}
                      <div>
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {new Date(milestone.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(milestone.priority)} variant="outline">
                      {milestone.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Policy Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.policiesEvaluated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total evaluations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{realTimeMetrics.successRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Authentication success</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.averageResponseTime}ms</div>
                <p className="text-xs text-muted-foreground">Average response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Devices Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Allowed</span>
                    <span>{realTimeMetrics.allowedDevices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Blocked</span>
                    <span>{realTimeMetrics.blockedDevices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Quarantined</span>
                    <span>{realTimeMetrics.quarantinedDevices.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Compliant</span>
                    <span>{realTimeMetrics.complianceRates.compliant.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Non-Compliant</span>
                    <span>{realTimeMetrics.complianceRates.nonCompliant.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Unknown</span>
                    <span>{realTimeMetrics.complianceRates.unknown.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Low</span>
                    <span>{realTimeMetrics.riskScoreDistribution.low}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Medium</span>
                    <span>{realTimeMetrics.riskScoreDistribution.medium}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">High</span>
                    <span>{realTimeMetrics.riskScoreDistribution.high}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Critical</span>
                    <span>{realTimeMetrics.riskScoreDistribution.critical}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Visual timeline of all site deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Interactive timeline visualization coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will show a Gantt-style chart of all site deployments with dependencies and milestones.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}