'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Calendar, MapPin, Download, RefreshCw } from 'lucide-react'

export default function RolloutProgress() {
  const [activeTab, setActiveTab] = useState('overview')

  const overallStats = {
    totalSites: 45,
    completedSites: 12,
    inProgressSites: 18,
    notStartedSites: 15,
    totalUsers: 125000,
    onboardedUsers: 45000,
    overallProgress: 67
  }

  const phaseProgress = [
    { phase: 'Phase 1 - Pilot', sites: 5, completed: 5, progress: 100, status: 'Complete' },
    { phase: 'Phase 2 - Core Sites', sites: 15, completed: 7, progress: 47, status: 'In Progress' },
    { phase: 'Phase 3 - Rollout', sites: 25, completed: 0, progress: 0, status: 'Not Started' }
  ]

  const regionProgress = [
    { region: 'North America', sites: 20, completed: 8, progress: 40, users: 65000 },
    { region: 'EMEA', sites: 15, completed: 3, progress: 20, users: 35000 },
    { region: 'APAC', sites: 10, completed: 1, progress: 10, users: 25000 }
  ]

  const timelineEvents = [
    { date: '2025-01-15', event: 'Project Kickoff', type: 'milestone', status: 'complete' },
    { date: '2025-02-01', event: 'Phase 1 Pilot Started', type: 'phase', status: 'complete' },
    { date: '2025-02-28', event: 'Phase 1 Completed', type: 'milestone', status: 'complete' },
    { date: '2025-03-15', event: 'Phase 2 Rollout Started', type: 'phase', status: 'complete' },
    { date: '2025-04-30', event: 'Mid-Project Review', type: 'review', status: 'upcoming' },
    { date: '2025-06-15', event: 'Phase 2 Target Completion', type: 'milestone', status: 'upcoming' },
    { date: '2025-07-01', event: 'Phase 3 Rollout Start', type: 'phase', status: 'upcoming' },
    { date: '2025-09-30', event: 'Project Completion', type: 'milestone', status: 'upcoming' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      case 'Delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯'
      case 'phase': return '🚀'
      case 'review': return '📊'
      default: return '📅'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>ABM Industries - Zero Trust NAC Rollout Progress</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{overallStats.totalSites}</div>
              <div className="text-sm text-gray-600">Total Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overallStats.completedSites}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{overallStats.inProgressSites}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{overallStats.notStartedSites}</div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Project Progress</span>
              <span className="text-sm text-gray-600">{overallStats.overallProgress}%</span>
            </div>
            <Progress value={overallStats.overallProgress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{overallStats.onboardedUsers.toLocaleString()} users onboarded</span>
              <span>{overallStats.totalUsers.toLocaleString()} total users</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="phases" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>By Phase</span>
              </TabsTrigger>
              <TabsTrigger value="regions" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>By Region</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Site Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{overallStats.completedSites}</span>
                            <span className="text-sm text-gray-500">
                              ({Math.round((overallStats.completedSites / overallStats.totalSites) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>In Progress</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{overallStats.inProgressSites}</span>
                            <span className="text-sm text-gray-500">
                              ({Math.round((overallStats.inProgressSites / overallStats.totalSites) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span>Not Started</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{overallStats.notStartedSites}</span>
                            <span className="text-sm text-gray-500">
                              ({Math.round((overallStats.notStartedSites / overallStats.totalSites) * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Onboarding Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round((overallStats.onboardedUsers / overallStats.totalUsers) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Users Onboarded</div>
                        </div>
                        <Progress 
                          value={(overallStats.onboardedUsers / overallStats.totalUsers) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-sm">
                          <span>{overallStats.onboardedUsers.toLocaleString()} onboarded</span>
                          <span>{(overallStats.totalUsers - overallStats.onboardedUsers).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="phases" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {phaseProgress.map((phase, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{phase.phase}</h4>
                            <p className="text-sm text-gray-600">
                              {phase.completed} of {phase.sites} sites completed
                            </p>
                          </div>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regions" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {regionProgress.map((region, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{region.region}</span>
                            </h4>
                            <p className="text-sm text-gray-600">
                              {region.completed} of {region.sites} sites • {region.users.toLocaleString()} users
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{region.progress}%</div>
                            <div className="text-sm text-gray-500">Complete</div>
                          </div>
                        </div>
                        <Progress value={region.progress} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timelineEvents.map((event, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              event.status === 'complete' ? 'bg-green-100 text-green-600' :
                              event.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getEventIcon(event.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{event.event}</h4>
                                <p className="text-sm text-gray-600">{event.date}</p>
                              </div>
                              <Badge variant={event.status === 'complete' ? 'default' : 'outline'}>
                                {event.status === 'complete' ? 'Complete' : 'Upcoming'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
