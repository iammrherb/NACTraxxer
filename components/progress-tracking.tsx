'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, XCircle, Users, Building, Calendar, Target } from 'lucide-react'

interface ProgressStats {
  totalSites: number
  completedSites: number
  inProgressSites: number
  plannedSites: number
  delayedSites: number
  totalUsers: number
  overallProgress: number
}

interface SiteProgress {
  id: string
  name: string
  status: string
  progress: number
  phase: string
  users: number
}

const sampleStats: ProgressStats = {
  totalSites: 12,
  completedSites: 3,
  inProgressSites: 4,
  plannedSites: 4,
  delayedSites: 1,
  totalUsers: 9550,
  overallProgress: 35
}

const sampleSiteProgress: SiteProgress[] = [
  { id: 'ABM-HQ001', name: 'ABM Global Headquarters', status: 'In Progress', progress: 35, phase: '1', users: 2500 },
  { id: 'ABM-DC002', name: 'Primary Data Center', status: 'In Progress', progress: 65, phase: '1', users: 150 },
  { id: 'ABM-EUR003', name: 'European HQ', status: 'Planned', progress: 0, phase: '2', users: 1200 },
  { id: 'ABM-MFG006', name: 'Manufacturing Plant', status: 'Complete', progress: 100, phase: '1', users: 450 },
  { id: 'ABM-EMEA010', name: 'London Office', status: 'Complete', progress: 100, phase: '1', users: 620 },
  { id: 'ABM-DC012', name: 'Secondary Data Center', status: 'Complete', progress: 100, phase: '1', users: 120 }
]

export default function ProgressTracking() {
  const [stats, setStats] = useState<ProgressStats>(sampleStats)
  const [siteProgress, setSiteProgress] = useState<SiteProgress[]>(sampleSiteProgress)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(stats.overallProgress)
    }, 500)
    return () => clearTimeout(timer)
  }, [stats.overallProgress])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'Delayed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'Planned':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-500'
      case 'In Progress':
        return 'bg-blue-500'
      case 'Delayed':
        return 'bg-red-500'
      case 'Planned':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSites}</div>
            <p className="text-xs text-muted-foreground">
              Across all regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sites</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedSites}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.completedSites / stats.totalSites) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressSites}</div>
            <p className="text-xs text-muted-foreground">
              Active deployments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all sites
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Overall Project Progress</span>
          </CardTitle>
          <CardDescription>
            Total completion across all deployment sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Project Completion</span>
              <span className="text-2xl font-bold">{animatedProgress}%</span>
            </div>
            <Progress value={animatedProgress} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{stats.completedSites}</div>
                <div className="text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{stats.inProgressSites}</div>
                <div className="text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600">{stats.plannedSites}</div>
                <div className="text-muted-foreground">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{stats.delayedSites}</div>
                <div className="text-muted-foreground">Delayed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Site Progress Details</span>
          </CardTitle>
          <CardDescription>
            Individual site completion status and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {siteProgress.map((site) => (
              <div key={site.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(site.status)}
                    <div>
                      <div className="font-medium">{site.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {site.id} • Phase {site.phase} • {site.users.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={site.status === 'Complete' ? 'default' : 'secondary'}>
                      {site.status}
                    </Badge>
                    <span className="text-sm font-medium w-12 text-right">
                      {site.progress}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={site.progress} 
                  className={`h-2 ${getProgressColor(site.status)}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Phase Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Phase 1 (Critical Sites)</span>
                <div className="flex items-center space-x-2">
                  <Progress value={75} className="w-20 h-2" />
                  <span className="text-sm">6/8 sites</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Phase 2 (Regional Offices)</span>
                <div className="flex items-center space-x-2">
                  <Progress value={25} className="w-20 h-2" />
                  <span className="text-sm">1/4 sites</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Phase 3 (Branch Offices)</span>
                <div className="flex items-center space-x-2">
                  <Progress value={0} className="w-20 h-2" />
                  <span className="text-sm">0/3 sites</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Key Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Site Completion</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sites On Schedule</span>
                <span className="font-semibold text-green-600">91%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Users Deployed</span>
                <span className="font-semibold">4,240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Estimated Completion</span>
                <span className="font-semibold">Q2 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rollout Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Rollout Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Progress tracking functionality will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
