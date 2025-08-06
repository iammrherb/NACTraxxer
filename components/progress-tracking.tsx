'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Users, MapPin, Calendar } from 'lucide-react'

interface ProgressData {
  totalSites: number
  completedSites: number
  inProgressSites: number
  plannedSites: number
  delayedSites: number
  totalUsers: number
  overallProgress: number
  onTimePercentage: number
  averageCompletionTime: number
}

interface SiteProgress {
  id: string
  name: string
  status: string
  progress: number
  phase: number
  users: number
  startDate: string
  endDate: string
  daysRemaining: number
}

export default function ProgressTracking() {
  const [progressData] = useState<ProgressData>({
    totalSites: 12,
    completedSites: 3,
    inProgressSites: 4,
    plannedSites: 4,
    delayedSites: 1,
    totalUsers: 9550,
    overallProgress: 35,
    onTimePercentage: 85,
    averageCompletionTime: 12
  })

  const [siteProgress] = useState<SiteProgress[]>([
    {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      status: 'In Progress',
      progress: 65,
      phase: 1,
      users: 2500,
      startDate: '2025-08-01',
      endDate: '2025-08-15',
      daysRemaining: 8
    },
    {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      status: 'Complete',
      progress: 100,
      phase: 1,
      users: 150,
      startDate: '2025-08-05',
      endDate: '2025-08-12',
      daysRemaining: 0
    },
    {
      id: 'ABM-EUR003',
      name: 'European Headquarters',
      status: 'Planned',
      progress: 0,
      phase: 2,
      users: 1200,
      startDate: '2025-09-01',
      endDate: '2025-09-15',
      daysRemaining: 25
    },
    {
      id: 'ABM-APAC004',
      name: 'APAC Regional Office',
      status: 'Delayed',
      progress: 15,
      phase: 2,
      users: 800,
      startDate: '2025-09-10',
      endDate: '2025-09-25',
      daysRemaining: 34
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-green-600 bg-green-100'
      case 'In Progress': return 'text-blue-600 bg-blue-100'
      case 'Delayed': return 'text-red-600 bg-red-100'
      case 'Planned': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'Complete') return 'bg-green-500'
    if (status === 'Delayed') return 'bg-red-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress > 0) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  const calculatePhaseProgress = (phase: number) => {
    const phaseSites = siteProgress.filter(site => site.phase === phase)
    if (phaseSites.length === 0) return 0
    const totalProgress = phaseSites.reduce((sum, site) => sum + site.progress, 0)
    return Math.round(totalProgress / phaseSites.length)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold">{progressData.overallProgress}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressData.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sites Completed</p>
                <p className="text-3xl font-bold">{progressData.completedSites}</p>
                <p className="text-sm text-muted-foreground">of {progressData.totalSites} total</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time Delivery</p>
                <p className="text-3xl font-bold">{progressData.onTimePercentage}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Above target
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{progressData.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">across all sites</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sites">Site Progress</TabsTrigger>
          <TabsTrigger value="phases">Phase Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Site Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteProgress.map((site) => (
                  <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{site.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(site.status)}>
                            {site.status}
                          </Badge>
                          <Badge variant="outline">Phase {site.phase}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {site.id}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {site.users.toLocaleString()} users
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {site.daysRemaining > 0 ? `${site.daysRemaining} days remaining` : 'Completed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress 
                          value={site.progress} 
                          className="flex-1 h-3"
                        />
                        <span className="text-sm font-medium w-12">{site.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((phase) => {
              const phaseSites = siteProgress.filter(site => site.phase === phase)
              const phaseProgress = calculatePhaseProgress(phase)
              const completedInPhase = phaseSites.filter(site => site.status === 'Complete').length
              
              return (
                <Card key={phase}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Phase {phase}</span>
                      <Badge variant="outline">{phaseSites.length} sites</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-bold">{phaseProgress}%</span>
                        </div>
                        <Progress value={phaseProgress} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completed</span>
                          <span className="font-medium">{completedInPhase}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">In Progress</span>
                          <span className="font-medium">
                            {phaseSites.filter(site => site.status === 'In Progress').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Planned</span>
                          <span className="font-medium">
                            {phaseSites.filter(site => site.status === 'Planned').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delayed</span>
                          <span className="font-medium text-red-600">
                            {phaseSites.filter(site => site.status === 'Delayed').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {siteProgress
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((site, index) => (
                    <div key={site.id} className="relative">
                      {index < siteProgress.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          site.status === 'Complete' ? 'bg-green-100' :
                          site.status === 'In Progress' ? 'bg-blue-100' :
                          site.status === 'Delayed' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {site.status === 'Complete' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : site.status === 'Delayed' ? (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{site.name}</h4>
                            <Badge className={getStatusColor(site.status)}>
                              {site.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(site.startDate).toLocaleDateString()} - {new Date(site.endDate).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <Progress value={site.progress} className="w-24 h-2" />
                              <span className="text-sm font-medium">{site.progress}%</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {site.users.toLocaleString()} users
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Risk Assessment & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-red-600">High Risk Items</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">APAC Regional Office</span>
                    <Badge className="bg-red-100 text-red-800">Delayed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Infrastructure delays affecting Phase 2 timeline
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Certificate Renewal</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    3 sites have certificates expiring within 30 days
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium">Accelerate Phase 1</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current progress allows for early Phase 2 start
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="font-medium">Resource Reallocation</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Move technical resources to delayed APAC project
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="font-medium">Automation Opportunity</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implement automated certificate renewal for all sites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
