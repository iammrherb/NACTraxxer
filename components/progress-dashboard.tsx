"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface SiteStats {
  totalSites: number
  sitesWithWorkbooks: number
  sitesWithoutWorkbooks: number
  completionPercentage: number
}

export default function ProgressDashboard() {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch deployment stats.")
      }
      const data: SiteStats = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Progress</CardTitle>
        <CardDescription>Overview of site workbook completion across the project.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
            <span className="text-sm font-bold">{stats.completionPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={stats.completionPercentage} aria-label={`${stats.completionPercentage}% complete`} />
        </div>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Total Sites</span>
            <span className="font-semibold">{stats.totalSites}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Workbooks Completed</span>
            <span className="font-semibold text-green-600">{stats.sitesWithWorkbooks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Workbooks Pending</span>
            <span className="font-semibold text-orange-500">{stats.sitesWithoutWorkbooks}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
