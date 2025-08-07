'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Calendar, Users, MapPin, Clock, CheckCircle, AlertTriangle, Download, RefreshCw } from 'lucide-react'

interface ProgressMetrics {
  totalSites: number
  completedSites: number
  inProgressSites: number
  plannedSites: number
  delayedSites: number
  totalUsers: number
  completedUsers: number
  overallProgress: number
}

interface PhaseProgress {
  phase: string
  totalSites: number
  completedSites: number
  totalUsers: number
  completedUsers: number
  progress: number
  estimatedCompletion: string
}

interface RegionProgress {
  region: string
  totalSites: number
  completedSites: number
  totalUsers: number
  completedUsers: number
  progress: number
  averageDelay: number
}

interface TimelineEvent {
  id: string
  date: string
  type: 'milestone' | 'completion' | 'delay' | 'issue'
  title: string
  description: string
  site?: string
  impact: 'low' | 'medium' | 'high'
}

export default function RolloutProgress() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const metrics: ProgressMetrics = {
    totalSites: 6,
    completedSites: 1,
    inProgressSites: 2,
    plannedSites: 2,
    delayedSites: 1,
    totalUsers: 5850,
    completedUsers: 1200,
    overallProgress: 28
  }

  const phaseProgress: PhaseProgress[] = [
    {
      phase: 'Phase 1 - High Priority',
      totalSites: 3,
      completedSites: 1,
      totalUsers: 4100,
      completedUsers: 1200,
      progress: 33,
      estimatedCompletion: '2025-09-15'
    },
    {
      phase: 'Phase 2 - Medium Priority',
      totalSites: 2,
      completedSites: 0,
      totalUsers: 1400,
      completedUsers: 0,
      progress: 12,
      estimatedCompletion: '2025-10-30'
    },
    {
      phase: 'Phase 3 - Low Priority',
      totalSites: 1,
      completedSites: 0,
      totalUsers: 350,
      completedUsers: 0,
      progress: 0,
      estimatedCompletion: '2025-11-15'
    }
  ]

  const regionProgress: RegionProgress[] = [
    {
      region: 'North America',
      totalSites: 2,
      completedSites: 0,
      totalUsers: 2800,
      completedUsers: 0,
      progress: 32,
      averageDelay: 0
    },
    {
      region: 'EMEA',
      totalSites: 2,
      completedSites: 1,
      totalUsers: 1650,
      completedUsers: 1200,
      progress: 50,
      averageDelay: 0
    },
    {
      region: 'APAC',
      totalSites: 2,
      completedSites: 0,
      totalUsers: 1400,
      completedUsers: 0,
      progress: 12,
      averageDelay: 5
    }
  ]

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '2025-08-15',
      type: 'completion',
      title: 'ABM London Office Completed',
      description: 'Successfully deployed NAC solution with 100% user onboarding',
      site: 'ABM-LON001',
      impact: 'high'
    },
    {
      id: '2',
      date: '2025-08-10',
      type: 'milestone',
      title: 'Phase 1 Kickoff',
      description: 'Initiated high-priority site deployments',
      impact: 'high'
    },
    {
      id: '3',
      date: '2025-08-08',
      type: 'delay',
      title: 'Sydney Office Delayed',
      description: 'Building renovation causing 2-week delay',
      site: 'ABM-SYD001',
      impact: 'medium'
    },
    {
      id: '4',
      date: '2025-08-05',
      type: 'milestone',
      title: 'Certificate Authority Setup',
      description: 'Portnox Private PKI configured and operational',
      impact: 'high'
    },
    {
      id: '5',
      date: '2025-08-01',
      type: 'milestone',
      title: 'Project Initiation',
      description: 'ABM Zero Trust NAC rollout officially started',
      impact: 'high'
    }
  ]

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'completion':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'milestone':
        return <Calendar className="h-5 w-5 text-blue-600" />
      case 'delay':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'issue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getImpactColor = (impact: TimelineEvent['impact']) => {
    switch (impact) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span>Rollout Progress Dashboard</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time tracking of Zero Trust NAC deployment across all ABM sites.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phases">By Phase</TabsTrigger>
              <TabsTrigger value="regions">By Region</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {metrics.overallProgress}%
                      </div>
                      <div className="text-sm text-blue-600">Overall Progress</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <Progress value={metrics.overallProgress} className="mt-2" />
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {metrics.completedSites}/{metrics.totalSites}
                      </div>
                      <div className="text-sm text-green-600">Sites Complete</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.round((metrics.completedSites / metrics.totalSites) * 100)}% of sites
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics.completedUsers.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Users Onboarded</div>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    of {metrics.totalUsers.toLocaleString()} total users
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {metrics.inProgressSites}
                      </div>
                      <div className="text-sm text-yellow-600">In Progress</div>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    {metrics.delayedSites} delayed
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
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
                          <span className="text-sm">Complete</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{metrics.completedSites}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((metrics.completedSites / metrics.totalSites) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">In Progress</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{metrics.inProgressSites}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((metrics.inProgressSites / metrics.totalSites) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="text-sm">Planned</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{metrics.plannedSites}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((metrics.plannedSites / metrics.totalSites) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Delayed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{metrics.delayedSites}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((metrics.delayedSites / metrics.totalSites) * 100)}%
                          </Badge>
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
                        <div className="text-3xl font-bold text-blue-600">
                          {Math.round((metrics.completedUsers / metrics.totalUsers) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Users Successfully Onboarded
                        </div>
                      </div>
                      <Progress 
                        value={(metrics.completedUsers / metrics.totalUsers) * 100} 
                        className="w-full h-3"
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{metrics.completedUsers.toLocaleString()} completed</span>
                        <span>{(metrics.totalUsers - metrics.completedUsers).toLocaleString()} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="phases" className="space-y-4">
              <div className="space-y-4">
                {phaseProgress.map((phase, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{phase.phase}</h3>
                        <Badge variant="outline">
                          Est. Completion: {new Date(phase.estimatedCompletion).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{phase.progress}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{phase.completedSites}/{phase.totalSites}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Sites</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{phase.completedUsers.toLocaleString()}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Users Done</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{phase.totalUsers.toLocaleString()}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                        </div>
                      </div>
                      
                      <Progress value={phase.progress} className="w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="regions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {regionProgress.map((region, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span>{region.region}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {region.progress}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Regional Progress
                          </div>
                        </div>
                        
                        <Progress value={region.progress} className="w-full" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Sites</div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {region.completedSites}/{region.totalSites}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Users</div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {region.completedUsers.toLocaleString()}/{region.totalUsers.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {region.averageDelay > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Avg. {region.averageDelay} days delay</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Project Timeline</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant={selectedTimeframe === '7d' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedTimeframe('7d')}
                    >
                      7 Days
                    </Button>
                    <Button 
                      variant={selectedTimeframe === '30d' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedTimeframe('30d')}
                    >
                      30 Days
                    </Button>
                    <Button 
                      variant={selectedTimeframe === '90d' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedTimeframe('90d')}
                    >
                      90 Days
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`border-l-4 ${getImpactColor(event.impact)} bg-white dark:bg-gray-800 p-4 rounded-r-lg shadow-sm`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {event.title}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            {event.site && (
                              <Badge variant="outline" className="text-xs">
                                {event.site}
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                event.impact === 'high' ? 'border-red-200 text-red-700' :
                                event.impact === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                'border-green-200 text-green-700'
                              }`}
                            >
                              {event.impact} impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
