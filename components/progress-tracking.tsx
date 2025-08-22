"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  Target,
  Calendar,
  Database,
} from "lucide-react"
import storage from "@/lib/storage" // Assuming storage library is imported here

interface Site {
  id: string
  name: string
  region: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent: number
  plannedStart: string
  plannedEnd: string
}

export default function ProgressTracking() {
  const [sites, setSites] = useState<Site[]>([])

  useEffect(() => {
    const loadSites = async () => {
      try {
        console.log("[v0] ProgressTracking: Loading sites from storage...")
        const storedSites = await storage.getSites()
        const sitesArray = storedSites || []
        console.log("[v0] ProgressTracking: Loaded", sitesArray.length, "sites")
        setSites(sitesArray)
      } catch (error) {
        console.error("[v0] ProgressTracking: Error loading sites:", error)
        setSites([])
      }
    }

    loadSites()

    const handleSitesUpdate = () => {
      console.log("[v0] ProgressTracking: Sites updated, reloading...")
      loadSites()
    }

    window.addEventListener("sitesUpdated", handleSitesUpdate)
    window.addEventListener("demoDataLoaded", handleSitesUpdate)

    return () => {
      window.removeEventListener("sitesUpdated", handleSitesUpdate)
      window.removeEventListener("demoDataLoaded", handleSitesUpdate)
    }
  }, [])

  // Calculate overall statistics
  const stats = {
    totalSites: sites.length,
    completedSites: sites.filter((s) => s.status === "Complete").length,
    inProgressSites: sites.filter((s) => s.status === "In Progress").length,
    plannedSites: sites.filter((s) => s.status === "Planned").length,
    delayedSites: sites.filter((s) => s.status === "Delayed").length,
    totalUsers: sites.reduce((sum, site) => sum + site.users, 0),
    averageCompletion:
      sites.length > 0 ? Math.round(sites.reduce((sum, site) => sum + site.completionPercent, 0) / sites.length) : 0,
  }

  // Calculate progress by phase
  const phaseProgress = {
    phase1: sites.filter((s) => s.phase === "1"),
    phase2: sites.filter((s) => s.phase === "2"),
    phase3: sites.filter((s) => s.phase === "3"),
  }

  // Calculate progress by region
  const regionProgress = sites.reduce(
    (acc, site) => {
      if (!acc[site.region]) {
        acc[site.region] = { sites: [], completion: 0 }
      }
      acc[site.region].sites.push(site)
      return acc
    },
    {} as Record<string, { sites: Site[]; completion: number }>,
  )

  // Calculate average completion for each region
  Object.keys(regionProgress).forEach((region) => {
    const regionSites = regionProgress[region].sites
    regionProgress[region].completion =
      regionSites.length > 0
        ? Math.round(regionSites.reduce((sum, site) => sum + site.completionPercent, 0) / regionSites.length)
        : 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-green-600"
      case "In Progress":
        return "text-blue-600"
      case "Delayed":
        return "text-red-600"
      case "Planned":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const loadDemoData = () => {
    // This will trigger the site management to load demo data
    window.dispatchEvent(new CustomEvent("loadDemoSites"))
  }

  if (sites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No deployment data available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add sites to the Master Site List to track rollout progress
          </p>
          <Button onClick={loadDemoData} variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Database className="h-4 w-4" />
            <span>Load Demo Data</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rollout Progress</h2>
          <p className="text-gray-600 dark:text-gray-400">Track deployment progress across all sites</p>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sites</p>
                <p className="text-2xl font-bold">{stats.totalSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Overall Deployment Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Completion</span>
              <span className="text-sm text-muted-foreground">{stats.averageCompletion}%</span>
            </div>
            <Progress value={stats.averageCompletion} className="h-3" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedSites}</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressSites}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.plannedSites}</div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.delayedSites}</div>
                <div className="text-sm text-muted-foreground">Delayed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Progress by Phase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(phaseProgress).map(([phase, sites]) => {
                const phaseNum = phase.replace("phase", "")
                const avgCompletion =
                  sites.length > 0
                    ? Math.round(sites.reduce((sum, site) => sum + site.completionPercent, 0) / sites.length)
                    : 0

                return (
                  <div key={phase} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Phase {phaseNum}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{sites.length} sites</span>
                        <span className="text-sm font-medium">{avgCompletion}%</span>
                      </div>
                    </div>
                    <Progress value={avgCompletion} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Progress by Region</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(regionProgress).map(([region, data]) => (
                <div key={region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{region}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{data.sites.length} sites</span>
                      <span className="text-sm font-medium">{data.completion}%</span>
                    </div>
                  </div>
                  <Progress value={data.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Site Progress Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sites.map((site) => (
              <div key={site.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{site.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{site.region}</span>
                      <span>Phase {site.phase}</span>
                      <span>{site.users.toLocaleString()} users</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(site.priority)}>{site.priority}</Badge>
                    <div className={`flex items-center space-x-1 ${getStatusColor(site.status)}`}>
                      {site.status === "Complete" && <CheckCircle className="h-4 w-4" />}
                      {site.status === "In Progress" && <Clock className="h-4 w-4" />}
                      {site.status === "Delayed" && <AlertTriangle className="h-4 w-4" />}
                      <span className="text-sm font-medium">{site.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{site.completionPercent}%</span>
                  </div>
                  <Progress value={site.completionPercent} className="h-2" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Started: {new Date(site.plannedStart).toLocaleDateString()}</span>
                    <span>Target: {new Date(site.plannedEnd).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
