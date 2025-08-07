'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, XCircle, Download, Calendar, Users, Building } from 'lucide-react'

interface Site {
  id: string
  name: string
  region: string
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  completionPercent: number
  users: number
  plannedEnd: string
}

export default function ProgressTracking() {
  const [sites] = useState<Site[]>([
    {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      region: 'North America',
      status: 'In Progress',
      completionPercent: 35,
      users: 2500,
      plannedEnd: '2025-08-15'
    },
    {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      region: 'North America',
      status: 'In Progress',
      completionPercent: 65,
      users: 150,
      plannedEnd: '2025-08-12'
    },
    {
      id: 'ABM-EUR003',
      name: 'European HQ',
      region: 'EMEA',
      status: 'Planned',
      completionPercent: 0,
      users: 1200,
      plannedEnd: '2025-09-15'
    },
    {
      id: 'ABM-MFG006',
      name: 'Manufacturing Plant',
      region: 'LATAM',
      status: 'Complete',
      completionPercent: 100,
      users: 450,
      plannedEnd: '2025-08-30'
    },
    {
      id: 'ABM-RD007',
      name: 'Research & Development',
      region: 'North America',
      status: 'In Progress',
      completionPercent: 55,
      users: 320,
      plannedEnd: '2025-08-20'
    }
  ])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planned': return 'text-gray-600'
      case 'Delayed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const totalSites = sites.length
  const completedSites = sites.filter(site => site.status === 'Complete').length
  const inProgressSites = sites.filter(site => site.status === 'In Progress').length
  const plannedSites = sites.filter(site => site.status === 'Planned').length
  const delayedSites = sites.filter(site => site.status === 'Delayed').length

  const totalUsers = sites.reduce((sum, site) => sum + site.users, 0)
  const overallProgress = Math.round(sites.reduce((sum, site) => sum + site.completionPercent, 0) / sites.length)

  const exportProgressData = () => {
    const headers = ['Site ID', 'Site Name', 'Region', 'Status', 'Progress %', 'Users', 'Planned End']
    const csvContent = [
      headers.join(','),
      ...sites.map(site => [
        site.id,
        `"${site.name}"`,
        site.region,
        site.status,
        site.completionPercent,
        site.users,
        site.plannedEnd
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-rollout-progress-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSites}</div>
            <p className="text-xs text-muted-foreground">
              Across all regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              To be migrated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sites</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedSites}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedSites / totalSites) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Rollout Status Breakdown</span>
          </CardTitle>
          <CardDescription>
            Current status of all sites in the deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{completedSites}</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{inProgressSites}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <XCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{plannedSites}</div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{delayedSites}</div>
              <div className="text-sm text-muted-foreground">Delayed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Progress Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Site Progress Details</CardTitle>
              <CardDescription>
                Detailed progress for each site in the rollout
              </CardDescription>
            </div>
            <Button onClick={exportProgressData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sites.map((site) => (
              <div key={site.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{site.name}</h4>
                    <p className="text-sm text-muted-foreground">{site.id} • {site.region}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(site.status)}
                    <span className={`font-medium ${getStatusColor(site.status)}`}>
                      {site.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{site.users.toLocaleString()} users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Due: {site.plannedEnd}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{site.completionPercent}% complete</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{site.completionPercent}%</span>
                  </div>
                  <Progress value={site.completionPercent} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
