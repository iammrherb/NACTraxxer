"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Building, CheckCircle, Clock, Download, Calendar } from "lucide-react"
import { useSites } from "@/hooks/use-sites"

interface Site {
  id: string
  name: string
  region: string
  priority: "High" | "Medium" | "Low"
  phase: string
  users: number
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  completionPercent: number
}

export default function ProgressTracking() {
  const { sites } = useSites()
  const overall = Math.round(sites.reduce((acc, s) => acc + s.completionPercent, 0) / Math.max(1, sites.length))

  const [localSites, setLocalSites] = useState<Site[]>([])

  // Load sites from localStorage
  useEffect(() => {
    const savedSites = localStorage.getItem("portnox-sites")
    if (savedSites) {
      setLocalSites(JSON.parse(savedSites))
    }
  }, [])

  // Calculate statistics
  const totalSites = localSites.length
  const completedSites = localSites.filter((site) => site.status === "Complete").length
  const inProgressSites = localSites.filter((site) => site.status === "In Progress").length
  const plannedSites = localSites.filter((site) => site.status === "Planned").length
  const delayedSites = localSites.filter((site) => site.status === "Delayed").length

  const totalUsers = localSites.reduce((sum, site) => sum + site.users, 0)
  const completedUsers = localSites
    .filter((site) => site.status === "Complete")
    .reduce((sum, site) => sum + site.users, 0)

  const overallProgress = totalSites > 0 ? Math.round((completedSites / totalSites) * 100) : 0

  // Phase statistics
  const phaseStats = {
    1: localSites.filter((site) => site.phase === "1"),
    2: localSites.filter((site) => site.phase === "2"),
    3: localSites.filter((site) => site.phase === "3"),
    4: localSites.filter((site) => site.phase === "4"),
  }

  // Region statistics
  const regionStats = localSites.reduce(
    (acc, site) => {
      if (!acc[site.region]) {
        acc[site.region] = []
      }
      acc[site.region].push(site)
      return acc
    },
    {} as Record<string, Site[]>,
  )

  const exportProgressReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSites,
        completedSites,
        inProgressSites,
        plannedSites,
        delayedSites,
        totalUsers,
        completedUsers,
        overallProgress,
      },
      phaseBreakdown: Object.entries(phaseStats).map(([phase, phaseSites]) => ({
        phase: `Phase ${phase}`,
        totalSites: phaseSites.length,
        completedSites: phaseSites.filter((site) => site.status === "Complete").length,
        users: phaseSites.reduce((sum, site) => sum + site.users, 0),
      })),
      regionBreakdown: Object.entries(regionStats).map(([region, regionSites]) => ({
        region,
        totalSites: regionSites.length,
        completedSites: regionSites.filter((site) => site.status === "Complete").length,
        users: regionSites.reduce((sum, site) => sum + site.users, 0),
      })),
      siteDetails: localSites,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `portnox-progress-report-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (totalSites === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Rollout Progress</span>
            </CardTitle>
            <CardDescription>Track the progress of your Zero Trust NAC deployment across all sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sites Added Yet</h3>
              <p className="text-muted-foreground mb-4">Add sites to your deployment to start tracking progress</p>
              <Button onClick={() => (window.location.hash = "#sites")}>Add Your First Site</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Rollout Progress</span>
              </CardTitle>
              <CardDescription>Track the progress of your Zero Trust NAC deployment across all sites</CardDescription>
            </div>
            <Button variant="outline" onClick={exportProgressReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{completedSites}</p>
                <p className="text-sm text-muted-foreground">Complete Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{inProgressSites}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-600">{plannedSites}</p>
                <p className="text-sm text-muted-foreground">Planned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Project Progress</CardTitle>
          <CardDescription>
            {completedSites} of {totalSites} sites complete ({completedUsers.toLocaleString()} of{" "}
            {totalUsers.toLocaleString()} users)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Phase</CardTitle>
          <CardDescription>Deployment progress across different phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(phaseStats).map(([phase, phaseSites]) => {
              const phaseCompleted = phaseSites.filter((site) => site.status === "Complete").length
              const phaseProgress = phaseSites.length > 0 ? Math.round((phaseCompleted / phaseSites.length) * 100) : 0
              const phaseUsers = phaseSites.reduce((sum, site) => sum + site.users, 0)

              return (
                <div key={phase} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Phase {phase}</span>
                      <Badge variant="outline">{phaseSites.length} sites</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {phaseCompleted}/{phaseSites.length} complete ({phaseUsers.toLocaleString()} users)
                    </span>
                  </div>
                  <Progress value={phaseProgress} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Region Progress */}
      {Object.keys(regionStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress by Region</CardTitle>
            <CardDescription>Deployment progress across different regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(regionStats).map(([region, regionSites]) => {
                const regionCompleted = regionSites.filter((site) => site.status === "Complete").length
                const regionProgress =
                  regionSites.length > 0 ? Math.round((regionCompleted / regionSites.length) * 100) : 0
                const regionUsers = regionSites.reduce((sum, site) => sum + site.users, 0)

                return (
                  <div key={region} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{region}</span>
                        <Badge variant="outline">{regionSites.length} sites</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {regionCompleted}/{regionSites.length} complete ({regionUsers.toLocaleString()} users)
                      </span>
                    </div>
                    <Progress value={regionProgress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Site Status Overview</CardTitle>
          <CardDescription>Current status of all sites in the deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-1 text-sm text-slate-600">Overall Completion</div>
            <Progress value={overall} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map((s) => (
              <div key={s.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-slate-500">{s.status}</div>
                </div>
                <Progress value={s.completionPercent} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
