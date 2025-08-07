'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Calendar, Users, MapPin, CheckCircle, Clock, AlertTriangle, Download, Filter } from 'lucide-react'

interface ProgressData {
  siteId: string
  siteName: string
  region: string
  phase: string
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  overallProgress: number
  milestones: {
    id: string
    name: string
    progress: number
    status: 'completed' | 'in-progress' | 'pending' | 'delayed'
    dueDate: string
    actualDate?: string
  }[]
  metrics: {
    usersOnboarded: number
    totalUsers: number
    devicesAuthenticated: number
    policiesDeployed: number
    issuesResolved: number
    totalIssues: number
  }
}

export default function ProgressTracking() {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedPhase, setSelectedPhase] = useState('all')
  const [viewMode, setViewMode] = useState('overview')

  const progressData: ProgressData[] = [
    {
      siteId: '1',
      siteName: 'New York Headquarters',
      region: 'North America',
      phase: '1',
      status: 'In Progress',
      overallProgress: 75,
      milestones: [
        { id: '1', name: 'Infrastructure Assessment', progress: 100, status: 'completed', dueDate: '2024-01-20', actualDate: '2024-01-18' },
        { id: '2', name: 'Portnox Cloud Setup', progress: 100, status: 'completed', dueDate: '2024-02-01', actualDate: '2024-01-30' },
        { id: '3', name: 'Certificate Authority Setup', progress: 100, status: 'completed', dueDate: '2024-02-10', actualDate: '2024-02-08' },
        { id: '4', name: 'Network Integration', progress: 85, status: 'in-progress', dueDate: '2024-02-25' },
        { id: '5', name: 'Policy Configuration', progress: 60, status: 'in-progress', dueDate: '2024-03-10' },
        { id: '6', name: 'User Onboarding', progress: 40, status: 'in-progress', dueDate: '2024-03-20' },
        { id: '7', name: 'Go-Live', progress: 0, status: 'pending', dueDate: '2024-03-30' }
      ],
      metrics: {
        usersOnboarded: 1875,
        totalUsers: 2500,
        devicesAuthenticated: 3200,
        policiesDeployed: 12,
        issuesResolved: 28,
        totalIssues: 35
      }
    },
    {
      siteId: '2',
      siteName: 'London Office',
      region: 'EMEA',
      phase: '1',
      status: 'Complete',
      overallProgress: 100,
      milestones: [
        { id: '1', name: 'Infrastructure Assessment', progress: 100, status: 'completed', dueDate: '2024-02-05', actualDate: '2024-02-03' },
        { id: '2', name: 'Portnox Cloud Setup', progress: 100, status: 'completed', dueDate: '2024-02-15', actualDate: '2024-02-12' },
        { id: '3', name: 'Certificate Authority Setup', progress: 100, status: 'completed', dueDate: '2024-02-25', actualDate: '2024-02-22' },
        { id: '4', name: 'Network Integration', progress: 100, status: 'completed', dueDate: '2024-03-10', actualDate: '2024-03-08' },
        { id: '5', name: 'Policy Configuration', progress: 100, status: 'completed', dueDate: '2024-03-25', actualDate: '2024-03-20' },
        { id: '6', name: 'User Onboarding', progress: 100, status: 'completed', dueDate: '2024-04-05', actualDate: '2024-04-02' },
        { id: '7', name: 'Go-Live', progress: 100, status: 'completed', dueDate: '2024-04-15', actualDate: '2024-04-12' }
      ],
      metrics: {
        usersOnboarded: 800,
        totalUsers: 800,
        devicesAuthenticated: 1150,
        policiesDeployed: 8,
        issuesResolved: 15,
        totalIssues: 15
      }
    },
    {
      siteId: '4',
      siteName: 'Chicago Manufacturing',
      region: 'North America',
      phase: '1',
      status: 'In Progress',
      overallProgress: 45,
      milestones: [
        { id: '1', name: 'Infrastructure Assessment', progress: 100, status: 'completed', dueDate: '2024-02-20', actualDate: '2024-02-18' },
        { id: '2', name: 'Portnox Cloud Setup', progress: 100, status: 'completed', dueDate: '2024-03-01', actualDate: '2024-02-28' },
        { id: '3', name: 'Certificate Authority Setup', progress: 80, status: 'in-progress', dueDate: '2024-03-15' },
        { id: '4', name: 'Network Integration', progress: 30, status: 'in-progress', dueDate: '2024-04-01' },
        { id: '5', name: 'Policy Configuration', progress: 0, status: 'pending', dueDate: '2024-04-20' },
        { id: '6', name: 'User Onboarding', progress: 0, status: 'pending', dueDate: '2024-05-01' },
        { id: '7', name: 'Go-Live', progress: 0, status: 'pending', dueDate: '2024-05-15' }
      ],
      metrics: {
        usersOnboarded: 540,
        totalUsers: 1200,
        devicesAuthenticated: 890,
        policiesDeployed: 6,
        issuesResolved: 18,
        totalIssues: 25
      }
    },
    {
      siteId: '5',
      siteName: 'Sydney Office',
      region: 'APAC',
      phase: '2',
      status: 'Delayed',
      overallProgress: 25,
      milestones: [
        { id: '1', name: 'Infrastructure Assessment', progress: 100, status: 'completed', dueDate: '2024-03-05', actualDate: '2024-03-10' },
        { id: '2', name: 'Portnox Cloud Setup', progress: 60, status: 'delayed', dueDate: '2024-03-20' },
        { id: '3', name: 'Certificate Authority Setup', progress: 0, status: 'pending', dueDate: '2024-04-05' },
        { id: '4', name: 'Network Integration', progress: 0, status: 'pending', dueDate: '2024-04-25' },
        { id: '5', name: 'Policy Configuration', progress: 0, status: 'pending', dueDate: '2024-05-15' },
        { id: '6', name: 'User Onboarding', progress: 0, status: 'pending', dueDate: '2024-06-01' },
        { id: '7', name: 'Go-Live', progress: 0, status: 'pending', dueDate: '2024-06-30' }
      ],
      metrics: {
        usersOnboarded: 80,
        totalUsers: 320,
        devicesAuthenticated: 120,
        policiesDeployed: 2,
        issuesResolved: 8,
        totalIssues: 18
      }
    },
    {
      siteId: '6',
      siteName: 'Frankfurt Data Center',
      region: 'EMEA',
      phase: '1',
      status: 'In Progress',
      overallProgress: 90,
      milestones: [
        { id: '1', name: 'Infrastructure Assessment', progress: 100, status: 'completed', dueDate: '2024-01-05', actualDate: '2024-01-03' },
        { id: '2', name: 'Portnox Cloud Setup', progress: 100, status: 'completed', dueDate: '2024-01-15', actualDate: '2024-01-12' },
        { id: '3', name: 'Certificate Authority Setup', progress: 100, status: 'completed', dueDate: '2024-01-25', actualDate: '2024-01-22' },
        { id: '4', name: 'Network Integration', progress: 100, status: 'completed', dueDate: '2024-02-10', actualDate: '2024-02-08' },
        { id: '5', name: 'Policy Configuration', progress: 100, status: 'completed', dueDate: '2024-02-25', actualDate: '2024-02-20' },
        { id: '6', name: 'User Onboarding', progress: 95, status: 'in-progress', dueDate: '2024-03-10' },
        { id: '7', name: 'Go-Live', progress: 0, status: 'pending', dueDate: '2024-03-15' }
      ],
      metrics: {
        usersOnboarded: 143,
        totalUsers: 150,
        devicesAuthenticated: 180,
        policiesDeployed: 10,
        issuesResolved: 12,
        totalIssues: 14
      }
    }
  ]

  const filteredData = progressData.filter(site => {
    const matchesRegion = selectedRegion === 'all' || site.region === selectedRegion
    const matchesPhase = selectedPhase === 'all' || site.phase === selectedPhase
    return matchesRegion && matchesPhase
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Planned':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'in-progress':
        return 'text-blue-600'
      case 'delayed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'delayed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const handleExportProgress = () => {
    const exportData = {
      progressData: filteredData,
      exportDate: new Date().toISOString(),
      filters: { region: selectedRegion, phase: selectedPhase },
      version: '20.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-progress-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    showNotification('Progress data exported successfully!', 'success')
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Calculate overall statistics
  const totalSites = filteredData.length
  const completedSites = filteredData.filter(s => s.status === 'Complete').length
  const inProgressSites = filteredData.filter(s => s.status === 'In Progress').length
  const delayedSites = filteredData.filter(s => s.status === 'Delayed').length
  const averageProgress = filteredData.reduce((sum, site) => sum + site.overallProgress, 0) / totalSites || 0

  const totalUsers = filteredData.reduce((sum, site) => sum + site.metrics.totalUsers, 0)
  const onboardedUsers = filteredData.reduce((sum, site) => sum + site.metrics.usersOnboarded, 0)
  const totalDevices = filteredData.reduce((sum, site) => sum + site.metrics.devicesAuthenticated, 0)
  const totalIssues = filteredData.reduce((sum, site) => sum + site.metrics.totalIssues, 0)
  const resolvedIssues = filteredData.reduce((sum, site) => sum + site.metrics.issuesResolved, 0)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-[#00c8d7]" />
                <span>Rollout Progress Tracking</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor deployment progress across all sites
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                  <SelectItem value="APAC">APAC</SelectItem>
                  <SelectItem value="LATAM">LATAM</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="1">Phase 1</SelectItem>
                  <SelectItem value="2">Phase 2</SelectItem>
                  <SelectItem value="3">Phase 3</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={handleExportProgress}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#00c8d7]" />
              <div>
                <div className="text-2xl font-bold">{totalSites}</div>
                <div className="text-sm text-muted-foreground">Active Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{averageProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{onboardedUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Users Onboarded</div>
                <div className="text-xs text-muted-foreground">
                  of {totalUsers.toLocaleString()} total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{totalDevices.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Devices Auth'd</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{resolvedIssues}/{totalIssues}</div>
                <div className="text-sm text-muted-foreground">Issues Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((site) => (
              <Card key={site.siteId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{site.siteName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{site.region} • Phase {site.phase}</p>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-bold">{site.overallProgress}%</span>
                      </div>
                      <Progress value={site.overallProgress} className="h-2" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-[#00c8d7]">
                          {site.metrics.usersOnboarded}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Users Onboarded
                        </div>
                        <div className="text-xs text-muted-foreground">
                          of {site.metrics.totalUsers}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {site.metrics.devicesAuthenticated}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Devices Auth'd
                        </div>
                      </div>
                    </div>

                    {/* Recent Milestones */}
                    <div>
                      <div className="text-sm font-medium mb-2">Recent Milestones</div>
                      <div className="space-y-2">
                        {site.milestones.slice(-3).map((milestone) => (
                          <div key={milestone.id} className="flex items-center space-x-2">
                            {getMilestoneIcon(milestone.status)}
                            <div className="flex-1">
                              <div className="text-sm">{milestone.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {milestone.progress}% complete
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {filteredData.map((site) => (
            <Card key={site.siteId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{site.siteName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{site.region} • Phase {site.phase}</p>
                  </div>
                  <Badge className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {site.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        {getMilestoneIcon(milestone.status)}
                        {index < site.milestones.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{milestone.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{milestone.progress}%</span>
                            <Badge variant="outline" className="text-xs">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={milestone.progress} className="h-1.5 mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className={getMilestoneStatusColor(milestone.status)}>
                            {milestone.status.replace('-', ' ').toUpperCase()}
                          </span>
                          {milestone.actualDate && (
                            <span>
                              Completed: {new Date(milestone.actualDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((site) => (
              <Card key={site.siteId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{site.siteName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{site.region} • Phase {site.phase}</p>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {site.metrics.usersOnboarded}
                      </div>
                      <div className="text-sm text-blue-800 font-medium">Users Onboarded</div>
                      <div className="text-xs text-blue-600">
                        of {site.metrics.totalUsers} total
                      </div>
                      <div className="mt-2">
                        <Progress 
                          value={(site.metrics.usersOnboarded / site.metrics.totalUsers) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {site.metrics.devicesAuthenticated}
                      </div>
                      <div className="text-sm text-green-800 font-medium">Devices Auth'd</div>
                      <div className="text-xs text-green-600">Active connections</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {site.metrics.policiesDeployed}
                      </div>
                      <div className="text-sm text-purple-800 font-medium">Policies Deployed</div>
                      <div className="text-xs text-purple-600">Active rules</div>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {site.metrics.issuesResolved}/{site.metrics.totalIssues}
                      </div>
                      <div className="text-sm text-yellow-800 font-medium">Issues Resolved</div>
                      <div className="text-xs text-yellow-600">
                        {((site.metrics.issuesResolved / site.metrics.totalIssues) * 100).toFixed(0)}% resolution rate
                      </div>
                      <div className="mt-2">
                        <Progress 
                          value={(site.metrics.issuesResolved / site.metrics.totalIssues) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
